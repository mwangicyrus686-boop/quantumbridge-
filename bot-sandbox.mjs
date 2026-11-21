import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const MAX_SOURCE_BYTES = 32 * 1024;
const MAX_CONTEXT_BYTES = 64 * 1024;
const MAX_OUTPUT_BYTES = 16 * 1024;
const SCRIPT_TIMEOUT_MS = 15_000;
const CONTAINER_NAME_PREFIX = 'quantumbridge-bot-';
const RUNTIMES = Object.freeze({
  node: {
    image: 'node:24-alpine',
    sourceFile: 'bot.mjs',
    runnerFile: 'runner.mjs',
    command: ['node', '--permission', '--allow-fs-read=/bot/bot.mjs,/bot/runner.mjs', '--max-old-space-size=96', '/bot/runner.mjs'],
  },
  python: {
    image: 'python:3.14-alpine',
    sourceFile: 'bot.py',
    runnerFile: 'runner.py',
    command: ['python', '-I', '-S', '/bot/runner.py'],
  },
});

const nodeRunner = `let raw = '';
for await (const chunk of process.stdin) raw += chunk;
const context = JSON.parse(raw);
const bot = await import('file:///bot/bot.mjs');
const evaluate = typeof bot.default === 'function' ? bot.default : bot.evaluate;
if (typeof evaluate !== 'function') throw new Error('Export an evaluate(context) function.');
const signal = await evaluate(context);
process.stdout.write(JSON.stringify(signal) + '\\n');
`;

const pythonRunner = `import json
import runpy
import sys

context = json.load(sys.stdin)
namespace = runpy.run_path('/bot/bot.py')
evaluate = namespace.get('evaluate')
if not callable(evaluate):
    raise RuntimeError('Define an evaluate(context) function.')
signal = evaluate(context)
sys.stdout.write(json.dumps(signal, separators=(',', ':')) + '\\n')
`;

function boundedText(value, field, maximum, required = false) {
  if (typeof value !== 'string') throw new Error(`${field} must be text.`);
  const result = value.trim();
  if ((required && !result) || result.length > maximum) {
    throw new Error(`${field} must contain 1 to ${maximum} characters.`);
  }
  return result;
}

function finiteNumber(value, field, minimum, maximum, nullable = false) {
  if (nullable && value === null) return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < minimum || number > maximum) {
    throw new Error(`${field} must be a finite number from ${minimum} to ${maximum}.`);
  }
  return number;
}

export function validateBotInvocation(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Bot evaluation request must be an object.');
  }
  const runtime = value.script?.runtime;
  const runtimeConfig = RUNTIMES[runtime];
  if (!runtimeConfig) throw new Error('Script runtime must be Node.js or Python.');
  const source = value.script?.source;
  if (typeof source !== 'string' || !source.trim()) {
    throw new Error('Bot script source is empty.');
  }
  if (Buffer.byteLength(source, 'utf8') > MAX_SOURCE_BYTES) {
    throw new Error(`Bot script exceeds the ${MAX_SOURCE_BYTES}-byte limit.`);
  }

  const bot = value.bot;
  if (!bot || typeof bot !== 'object' || Array.isArray(bot)) {
    throw new Error('Bot configuration is missing.');
  }
  const symbols = Array.isArray(bot.symbols)
    ? [...new Set(bot.symbols.map((symbol) => boundedText(symbol, 'Market symbol', 40, true)))]
    : [];
  if (!symbols.length || symbols.length > 30) {
    throw new Error('Bot must have between 1 and 30 assigned markets.');
  }

  const markets = Array.isArray(value.markets) ? value.markets.slice(0, 30).map((market) => {
    const symbol = boundedText(market?.symbol, 'Market symbol', 40, true);
    if (!symbols.includes(symbol)) throw new Error('Market snapshot contains an unassigned symbol.');
    const history = Array.isArray(market.history)
      ? market.history.slice(-50).map((price) => finiteNumber(price, 'Historical price', 0, 1e15))
      : [];
    return {
      symbol,
      price: finiteNumber(market.price, 'Market price', 0, 1e15),
      bias: ['BUY', 'SELL', 'HOLD'].includes(market.bias) ? market.bias : 'HOLD',
      accuracy: finiteNumber(market.accuracy, 'Market score', 0, 100),
      rsi: finiteNumber(market.rsi, 'RSI', 0, 100),
      spikeProb: finiteNumber(market.spikeProb, 'Spike probability', 0, 100, true),
      pipSize: finiteNumber(market.pipSize, 'Pip size', 0, 1e6),
      digits: finiteNumber(market.digits, 'Price digits', 0, 12),
      history,
    };
  }) : [];

  const context = {
    bot: {
      id: boundedText(bot.id, 'Bot ID', 80, true),
      name: boundedText(bot.name, 'Bot name', 120, true),
      strategy: boundedText(bot.strategy || '', 'Strategy', 240),
      symbols,
      lotSize: finiteNumber(bot.lotSize, 'Lot size', 0.001, 100),
      stakeUsd: finiteNumber(bot.stakeUsd, 'Stake', 1, 100000),
      multiplier: finiteNumber(bot.multiplier, 'Multiplier', 1, 100000),
      minAccuracy: finiteNumber(bot.minAccuracy, 'Minimum score', 0, 100),
      slPips: finiteNumber(bot.slPips, 'Stop loss', 0.1, 100000),
      tpPips: finiteNumber(bot.tpPips, 'Take profit', 0.1, 100000),
      cooldownMs: finiteNumber(bot.cooldownMs, 'Cooldown', 1000, 300000),
    },
    markets,
    timestamp: new Date().toISOString(),
  };
  if (markets.length === 0) throw new Error('No assigned market snapshots were provided.');
  if (Buffer.byteLength(JSON.stringify(context), 'utf8') > MAX_CONTEXT_BYTES) {
    throw new Error('Market snapshot exceeds the script input limit.');
  }

  return { runtime, runtimeConfig, source, context };
}

export function validateBotSignal(value, assignedSymbols) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Script must return a JSON signal object.');
  }
  const action = value.action;
  if (!['BUY', 'SELL', 'HOLD'].includes(action)) {
    throw new Error('Signal action must be BUY, SELL, or HOLD.');
  }
  const symbol = boundedText(value.symbol, 'Signal symbol', 40, true);
  if (!assignedSymbols.includes(symbol)) {
    throw new Error('Script returned a market that is not assigned to this bot.');
  }
  const rationale = boundedText(value.rationale, 'Signal rationale', 500, true);
  return { action, symbol, rationale };
}

export function buildDockerArgs({ runtime, directory, containerName }) {
  const runtimeConfig = RUNTIMES[runtime];
  if (!runtimeConfig) throw new Error('Script runtime must be Node.js or Python.');
  const args = [
    'run',
    '--rm',
    '--pull=missing',
    '--name', containerName,
    '--network', 'none',
    '--read-only',
    '--memory=256m',
    '--memory-swap=256m',
    '--cpus=0.5',
    '--pids-limit=32',
    '--cap-drop=ALL',
    '--security-opt=no-new-privileges:true',
    '--user', '65534:65534',
    '--tmpfs', '/tmp:rw,noexec,nosuid,nodev,size=8m,uid=65534,gid=65534',
    '--mount', `type=bind,source=${directory},target=/bot,readonly`,
    '--workdir', '/tmp',
    '--env', 'HOME=/tmp',
  ];
  if (runtime === 'python') args.push('--env', 'PYTHONDONTWRITEBYTECODE=1');
  args.push(runtimeConfig.image, ...runtimeConfig.command);
  return args;
}

function cleanupContainer(dockerExecutable, containerName) {
  return new Promise((resolve) => {
    const cleanup = spawn(dockerExecutable, ['rm', '--force', containerName], {
      stdio: 'ignore',
      windowsHide: true,
    });
    cleanup.once('error', resolve);
    cleanup.once('close', resolve);
  });
}

function runDocker(dockerExecutable, args, context, containerName, spawnProcess) {
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    let outputBytes = 0;
    let timedOut = false;
    let outputExceeded = false;
    let settled = false;
    const child = spawnProcess(dockerExecutable, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      windowsHide: true,
    });

    const finish = (error, output) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (error) reject(error);
      else resolve(output);
    };

    const stop = () => {
      child.kill();
      void cleanupContainer(dockerExecutable, containerName);
    };

    const timer = setTimeout(() => {
      timedOut = true;
      stop();
    }, SCRIPT_TIMEOUT_MS);

    child.stdout.on('data', (chunk) => {
      outputBytes += chunk.length;
      if (outputBytes > MAX_OUTPUT_BYTES) {
        outputExceeded = true;
        stop();
        return;
      }
      stdout += chunk.toString('utf8');
    });
    child.stderr.on('data', (chunk) => {
      outputBytes += chunk.length;
      if (outputBytes > MAX_OUTPUT_BYTES) {
        outputExceeded = true;
        stop();
        return;
      }
      stderr += chunk.toString('utf8');
    });
    child.stdin.on('error', () => {});
    child.once('error', (error) => finish(new Error(`Could not start Docker: ${error.message}`)));
    child.once('close', (code) => {
      if (timedOut || outputExceeded) {
        const error = timedOut
          ? new Error(`Script exceeded the ${SCRIPT_TIMEOUT_MS} ms time limit.`)
          : new Error(`Script output exceeded the ${MAX_OUTPUT_BYTES}-byte limit.`);
        void cleanupContainer(dockerExecutable, containerName).then(() => finish(error));
        return;
      }
      if (code !== 0) {
        const detail = stderr.trim().slice(-1500);
        return finish(new Error(detail || `Sandbox runner exited with code ${code}.`));
      }
      finish(null, stdout);
    });
    child.stdin.end(JSON.stringify(context));
  });
}

export async function executeBotScript(value, {
  dockerExecutable = process.env.QB_DOCKER_EXECUTABLE || 'docker',
  spawnProcess = spawn,
  tempDirectory = os.tmpdir(),
} = {}) {
  const { runtime, runtimeConfig, source, context } = validateBotInvocation(value);
  const workingDirectory = await mkdtemp(path.join(tempDirectory, 'quantumbridge-bot-'));
  const containerName = `${CONTAINER_NAME_PREFIX}${randomUUID()}`;
  try {
    await writeFile(path.join(workingDirectory, runtimeConfig.sourceFile), source, { encoding: 'utf8', mode: 0o400 });
    await writeFile(path.join(workingDirectory, runtimeConfig.runnerFile), runtime === 'node' ? nodeRunner : pythonRunner, {
      encoding: 'utf8',
      mode: 0o400,
    });
    const args = buildDockerArgs({ runtime, directory: workingDirectory, containerName });
    const output = await runDocker(dockerExecutable, args, context, containerName, spawnProcess);
    const responseLine = output.trim().split(/\r?\n/).pop();
    let signal;
    try {
      signal = JSON.parse(responseLine);
    } catch {
      throw new Error('Script did not return valid JSON.');
    }
    return validateBotSignal(signal, context.bot.symbols);
  } finally {
    await rm(workingDirectory, { recursive: true, force: true });
  }
}

export const botSandboxLimits = Object.freeze({
  maxSourceBytes: MAX_SOURCE_BYTES,
  maxContextBytes: MAX_CONTEXT_BYTES,
  maxOutputBytes: MAX_OUTPUT_BYTES,
  timeoutMs: SCRIPT_TIMEOUT_MS,
});
