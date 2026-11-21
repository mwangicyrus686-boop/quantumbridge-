import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { PassThrough } from 'node:stream';
import { buildDockerArgs, executeBotScript, validateBotInvocation, validateBotSignal } from './bot-sandbox.mjs';

const request = {
  script: { runtime: 'node', source: 'export function evaluate(ctx) { return null; }' },
  bot: {
    id: 'QB-IMP-test',
    name: 'Test bot',
    strategy: 'test',
    symbols: ['R_75'],
    lotSize: 0.01,
    stakeUsd: 10,
    multiplier: 100,
    minAccuracy: 80,
    slPips: 50,
    tpPips: 100,
    cooldownMs: 7000,
  },
  markets: [{
    symbol: 'R_75',
    price: 100,
    bias: 'BUY',
    accuracy: 85,
    rsi: 45,
    spikeProb: null,
    pipSize: 0.01,
    digits: 2,
    history: [99, 100],
  }],
};

test('passes only bounded bot config and sanitized assigned-market data', () => {
  const validated = validateBotInvocation({
    ...request,
    bot: { ...request.bot, accountId: 'private-account', scriptSource: 'ignored' },
    markets: [{ ...request.markets[0], token: 'private-token' }],
  });
  assert.equal(validated.context.bot.accountId, undefined);
  assert.equal(validated.context.markets[0].token, undefined);
  assert.deepEqual(validated.context.bot.symbols, ['R_75']);
});

test('rejects invalid runtime, out-of-bot markets, and unbounded scripts', () => {
  assert.throws(() => validateBotInvocation({ ...request, script: { runtime: 'bash', source: 'echo bad' } }), /runtime/);
  assert.throws(() => validateBotInvocation({ ...request, markets: [{ ...request.markets[0], symbol: 'UNKNOWN' }] }), /unassigned/);
  assert.throws(() => validateBotInvocation({ ...request, script: { runtime: 'node', source: 'x'.repeat(33 * 1024) } }), /32768-byte limit/);
});

test('accepts only assigned-symbol signal results', () => {
  assert.deepEqual(validateBotSignal({ action: 'BUY', symbol: 'R_75', rationale: 'test signal' }, ['R_75']), {
    action: 'BUY',
    symbol: 'R_75',
    rationale: 'test signal',
  });
  assert.throws(() => validateBotSignal({ action: 'BUY', symbol: 'XAU/USD', rationale: 'test' }, ['R_75']), /not assigned/);
  assert.throws(() => validateBotSignal({ action: 'PLACE_ORDER', symbol: 'R_75', rationale: 'test' }, ['R_75']), /must be BUY, SELL, or HOLD/);
});

test('builds a networkless and resource-limited Docker invocation', () => {
  const args = buildDockerArgs({ runtime: 'python', directory: 'C:\\bots\\one', containerName: 'quantumbridge-bot-test' });
  assert.ok(args.includes('--network'));
  assert.equal(args[args.indexOf('--network') + 1], 'none');
  assert.ok(args.includes('--read-only'));
  assert.ok(args.includes('--cap-drop=ALL'));
  assert.ok(args.includes('--memory=256m'));
  assert.ok(args.includes('--pids-limit=32'));
  assert.ok(args.includes('type=bind,source=C:\\bots\\one,target=/bot,readonly'));
});

test('writes a valid JSON-line output protocol for both script runtimes', async () => {
  for (const runtime of ['node', 'python']) {
    let runnerSource = '';
    const result = await executeBotScript({
      ...request,
      script: { runtime, source: request.script.source },
    }, {
      spawnProcess: (_executable, args) => {
        const mount = args[args.indexOf('--mount') + 1];
        const directory = mount.match(/source=(.*),target=/)[1];
        runnerSource = readFileSync(`${directory}\\${runtime === 'node' ? 'runner.mjs' : 'runner.py'}`, 'utf8');

        const child = new EventEmitter();
        child.stdin = new PassThrough();
        child.stdout = new PassThrough();
        child.stderr = new PassThrough();
        child.kill = () => {};
        queueMicrotask(() => {
          child.stdout.end('{"action":"BUY","symbol":"R_75","rationale":"test"}\n');
          child.emit('close', 0);
        });
        return child;
      },
    });

    assert.deepEqual(result, { action: 'BUY', symbol: 'R_75', rationale: 'test' });
    const outputLine = runtime === 'node'
      ? "JSON.stringify(signal) + '\\n'"
      : "json.dumps(signal, separators=(',', ':')) + '\\n'";
    assert.ok(runnerSource.includes(outputLine));
  }
});
