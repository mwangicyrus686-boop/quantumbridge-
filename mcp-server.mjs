import readline from 'node:readline';

const apiBase = (process.env.QB_MCP_API_BASE || 'http://localhost:5173').replace(/\/$/, '');
const supportedProtocolVersions = ['2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05'];
const tools = [
  {
    name: 'get_bot_fleet_snapshot',
    description: 'Read QuantumBridge bot configurations, assigned symbols, research gate summaries, and risk controls. No broker credentials are exposed.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'get_market_snapshot',
    description: 'Read the latest market prices, signal scores, directional labels, and regimes published by QuantumBridge.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  },
  {
    name: 'submit_paper_signal',
    description: 'Send a BUY, SELL, or HOLD idea for an existing bot and one of its assigned symbols to the QuantumBridge human review inbox. This never places or queues a broker order.',
    inputSchema: {
      type: 'object',
      properties: {
        botId: { type: 'string', description: 'The exact bot id from get_bot_fleet_snapshot.' },
        symbol: { type: 'string', description: 'A market symbol assigned to that bot.' },
        action: { type: 'string', enum: ['BUY', 'SELL', 'HOLD'] },
        rationale: { type: 'string', minLength: 1, maxLength: 1000, description: 'Short explanation for the proposed paper signal.' },
      },
      required: ['botId', 'symbol', 'action', 'rationale'],
      additionalProperties: false,
    },
  },
];

async function apiRequest(path, options = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: { accept: 'application/json', ...(options.body ? { 'content-type': 'application/json' } : {}), ...options.headers },
    signal: AbortSignal.timeout(5000),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `QuantumBridge API returned HTTP ${response.status}.`);
  return payload;
}

function toolResult(value) {
  return { content: [{ type: 'text', text: JSON.stringify(value, null, 2) }] };
}

async function callTool(name, args = {}) {
  if (name === 'get_bot_fleet_snapshot') {
    return toolResult(await apiRequest('/api/mcp/state'));
  }
  if (name === 'get_market_snapshot') {
    const snapshot = await apiRequest('/api/mcp/state');
    return toolResult({ updatedAt: snapshot.updatedAt, marketSource: snapshot.marketSource, markets: snapshot.markets });
  }
  if (name === 'submit_paper_signal') {
    const snapshot = await apiRequest('/api/mcp/state');
    const age = Date.now() - Date.parse(snapshot.updatedAt || '');
    if (!Number.isFinite(age) || age > 30_000) throw new Error('QuantumBridge snapshot is stale. Open or refresh the app and retry.');
    const response = await apiRequest('/api/mcp/proposals', {
      method: 'POST',
      body: JSON.stringify({ botId: args.botId, symbol: args.symbol, action: args.action, rationale: args.rationale }),
    });
    return toolResult({ ...response, message: 'Saved for human paper review. No order was placed.' });
  }
  throw new Error(`Unknown QuantumBridge tool: ${name}`);
}

function send(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

async function handleMessage(message) {
  const { id, method, params = {} } = message || {};
  if (typeof method !== 'string') {
    if (id !== undefined) send({ jsonrpc: '2.0', id, error: { code: -32600, message: 'Invalid JSON-RPC request.' } });
    return;
  }
  if (method === 'notifications/initialized' || method.startsWith('notifications/')) return;
  if (method === 'initialize') {
    const requested = params.protocolVersion;
    const protocolVersion = supportedProtocolVersions.includes(requested) ? requested : supportedProtocolVersions[0];
    send({
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'quantumbridge-bots', title: 'QuantumBridge Bot Fleet', version: '1.0.0' },
        instructions: 'Read bot and market status. Signal proposals go only to the QuantumBridge paper review inbox; this server has no broker order tool.',
      },
    });
    return;
  }
  if (method === 'ping') {
    send({ jsonrpc: '2.0', id, result: {} });
    return;
  }
  if (method === 'tools/list') {
    send({ jsonrpc: '2.0', id, result: { tools } });
    return;
  }
  if (method === 'tools/call') {
    try {
      const result = await callTool(params.name, params.arguments || {});
      send({ jsonrpc: '2.0', id, result });
    } catch (error) {
      send({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: error.message || 'QuantumBridge tool failed.' }], isError: true } });
    }
    return;
  }
  if (id !== undefined) send({ jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } });
}

const input = readline.createInterface({ input: process.stdin, crlfDelay: Infinity, terminal: false });
input.on('line', (line) => {
  if (!line.trim()) return;
  try {
    const message = JSON.parse(line);
    void handleMessage(message).catch((error) => {
      process.stderr.write(`QuantumBridge MCP error: ${error.message}\n`);
    });
  } catch {
    send({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error.' } });
  }
});
