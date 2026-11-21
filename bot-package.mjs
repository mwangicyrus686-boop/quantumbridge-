const MAX_IMPORT_BYTES = 256 * 1024;
const MAX_SCRIPT_BYTES = 32 * 1024;
const MAX_IMPORTED_BOTS = 25;
const SUPPORTED_SCRIPT_RUNTIMES = new Set(['node', 'python']);

function byteLength(value) {
  return new TextEncoder().encode(value).length;
}

function importedId() {
  const id = globalThis.crypto?.randomUUID?.()
    || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `QB-IMP-${id}`;
}

function text(value, field, maxLength, fallback = '') {
  const result = value === undefined ? fallback : value;
  if (typeof result !== 'string' || result.trim().length > maxLength) {
    throw new Error(`${field} must be text no longer than ${maxLength} characters.`);
  }
  return result.trim();
}

function number(value, field, fallback, minimum, maximum) {
  const result = value === undefined ? fallback : Number(value);
  if (!Number.isFinite(result) || result < minimum || result > maximum) {
    throw new Error(`${field} must be a number from ${minimum} to ${maximum}.`);
  }
  return result;
}

function makeBot(config, script, availableSymbols, defaults) {
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    throw new Error('Each imported bot must be a JSON object.');
  }

  const name = text(config.name, 'Bot name', 120);
  if (!name) throw new Error('Every imported bot needs a name.');
  const strategy = text(config.strategy, 'Strategy', 240, 'Imported bot configuration');
  const symbols = config.symbols === undefined ? defaults.symbols : config.symbols;
  if (!Array.isArray(symbols) || symbols.length < 1 || symbols.length > 30) {
    throw new Error(`${name}: assign between 1 and 30 markets.`);
  }
  const normalizedSymbols = [...new Set(symbols.map((symbol) => text(symbol, 'Market symbol', 40)))];
  if (normalizedSymbols.some((symbol) => !symbol || !availableSymbols.has(symbol))) {
    throw new Error(`${name}: one or more markets are not supported by this QuantumBridge build.`);
  }

  let scriptRuntime = null;
  let scriptSource = null;
  if (script) {
    if (!SUPPORTED_SCRIPT_RUNTIMES.has(script.runtime)) {
      throw new Error(`${name}: script runtime must be Node.js or Python.`);
    }
    if (typeof script.source !== 'string' || !script.source.trim()) {
      throw new Error(`${name}: script source is empty.`);
    }
    if (byteLength(script.source) > MAX_SCRIPT_BYTES) {
      throw new Error(`${name}: script source exceeds the ${MAX_SCRIPT_BYTES}-byte limit.`);
    }
    scriptRuntime = script.runtime;
    scriptSource = script.source;
  }

  return {
    id: importedId(),
    name,
    strategy,
    active: false,
    symbols: normalizedSymbols,
    lotSize: number(config.lotSize, 'Lot size', defaults.lotSize, 0.001, 100),
    stakeUsd: number(config.stakeUsd, 'Stake', defaults.stakeUsd, 1, 100000),
    multiplier: number(config.multiplier, 'Multiplier', defaults.multiplier, 1, 100000),
    minAccuracy: number(config.minAccuracy, 'Minimum signal score', defaults.minAccuracy, 0, 100),
    slPips: number(config.slPips, 'Stop loss', defaults.slPips, 0.1, 100000),
    tpPips: number(config.tpPips, 'Take profit', defaults.tpPips, 0.1, 100000),
    cooldownMs: number(config.cooldownMs, 'Cooldown', defaults.cooldownMs, 1000, 300000),
    tradesCount: 0,
    winRate: 0,
    winsCount: 0,
    realizedPnl: 0,
    researchEvidence: { ...defaults.researchEvidence },
    lastExecutedAt: 0,
    scriptRuntime,
    scriptSource,
  };
}

function parseJsonBots(value, fileName, availableSymbols, defaults) {
  if (Array.isArray(value)) {
    return value.map((bot) => makeBot(bot, null, availableSymbols, defaults));
  }
  if (!value || typeof value !== 'object') {
    throw new Error('Import a bot object, an array of bot objects, or a QuantumBridge bot package.');
  }
  if (value.format !== undefined) {
    if (value.format !== 'quantumbridge-bot' || value.version !== 1) {
      throw new Error('Unsupported QuantumBridge bot package format or version.');
    }
    return [makeBot(value.bot, value.script, availableSymbols, defaults)];
  }
  if (Array.isArray(value.bots)) {
    return value.bots.map((bot) => makeBot(bot, null, availableSymbols, defaults));
  }
  return [makeBot(value, null, availableSymbols, defaults)];
}

export function parseBotImport(fileName, contents, availableSymbols, defaults) {
  if (typeof contents !== 'string' || byteLength(contents) > MAX_IMPORT_BYTES) {
    throw new Error(`Import file exceeds the ${MAX_IMPORT_BYTES}-byte limit.`);
  }
  const extension = fileName.toLowerCase().split('.').pop();
  const supportedSymbols = new Set(availableSymbols);
  let bots;

  if (extension === 'mjs' || extension === 'js' || extension === 'py') {
    const name = fileName.replace(/\.(mjs|js|py)$/i, '');
    const runtime = extension === 'py' ? 'python' : 'node';
    bots = [makeBot({ name, strategy: `Imported ${runtime === 'node' ? 'Node.js' : 'Python'} script` }, {
      runtime,
      source: contents,
    }, supportedSymbols, defaults)];
  } else if (extension === 'json' || extension === 'qbot') {
    let value;
    try {
      value = JSON.parse(contents);
    } catch {
      throw new Error('Bot configuration files must contain valid JSON.');
    }
    bots = parseJsonBots(value, fileName, supportedSymbols, defaults);
  } else {
    throw new Error('Choose a JSON config, .qbot package, .mjs/.js script, or .py script.');
  }

  if (bots.length < 1 || bots.length > MAX_IMPORTED_BOTS) {
    throw new Error(`Import between 1 and ${MAX_IMPORTED_BOTS} bots at a time.`);
  }
  return bots;
}

export const botImportLimits = Object.freeze({
  maxImportBytes: MAX_IMPORT_BYTES,
  maxScriptBytes: MAX_SCRIPT_BYTES,
  maxBots: MAX_IMPORTED_BOTS,
});
