import assert from 'node:assert/strict';
import test from 'node:test';
import { parseBotImport } from './bot-package.mjs';

const defaults = {
  symbols: ['R_75'],
  lotSize: 0.01,
  stakeUsd: 10,
  multiplier: 100,
  minAccuracy: 85,
  slPips: 50,
  tpPips: 120,
  cooldownMs: 7000,
  researchEvidence: { forwardTestPassed: false },
};
const symbols = ['R_75', 'BOOM1000'];

test('imports JSON configurations with generated IDs and inactive research state', () => {
  const [bot] = parseBotImport('bots.json', JSON.stringify([{
    id: 'attacker-chosen-id',
    name: 'Imported config',
    symbols: ['BOOM1000'],
    active: true,
    researchEvidence: { forwardTestPassed: true },
    stakeUsd: 25,
  }]), symbols, defaults);

  assert.notEqual(bot.id, 'attacker-chosen-id');
  assert.equal(bot.active, false);
  assert.equal(bot.stakeUsd, 25);
  assert.equal(bot.researchEvidence.forwardTestPassed, false);
  assert.equal(bot.scriptSource, null);
});

test('imports packaged Node and Python strategies with validated config', () => {
  for (const runtime of ['node', 'python']) {
    const [bot] = parseBotImport('strategy.qbot', JSON.stringify({
      format: 'quantumbridge-bot',
      version: 1,
      bot: { name: `${runtime} bot`, symbols: ['R_75'] },
      script: { runtime, source: 'def evaluate(ctx): return {}' },
    }), symbols, defaults);
    assert.equal(bot.scriptRuntime, runtime);
    assert.equal(bot.scriptSource, 'def evaluate(ctx): return {}');
    assert.equal(bot.active, false);
  }
});

test('imports a standalone script using a safe default bot configuration', () => {
  const [bot] = parseBotImport('mean-revert.mjs', 'export function evaluate(context) { return null; }', symbols, defaults);
  assert.equal(bot.name, 'mean-revert');
  assert.equal(bot.scriptRuntime, 'node');
  assert.equal(bot.symbols[0], 'R_75');
  assert.equal(bot.active, false);
});

test('rejects unsupported markets, malformed packages, and oversized scripts', () => {
  assert.throws(() => parseBotImport('bad.json', JSON.stringify({ name: 'bad', symbols: ['UNKNOWN'] }), symbols, defaults), /markets are not supported/);
  assert.throws(() => parseBotImport('bad.qbot', JSON.stringify({ format: 'quantumbridge-bot', version: 2 }), symbols, defaults), /Unsupported/);
  assert.throws(() => parseBotImport('large.py', 'x'.repeat(33 * 1024), symbols, defaults), /script source exceeds/);
});
