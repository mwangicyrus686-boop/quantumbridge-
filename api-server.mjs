import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { access, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { executeBotScript } from './bot-sandbox.mjs';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const distRoot = path.resolve(projectRoot, 'dist');
const DERIV_AUTH_TOKEN_URL = 'https://auth.deriv.com/oauth2/token';
const DERIV_API_BASE = 'https://api.derivws.com';
const DEFAULT_LOCAL_REDIRECT_URI = 'http://localhost:5173/';
const DEFAULT_JARVIS_API_BASE = 'http://localhost:5000';
let mcpBotSnapshot = { updatedAt: null, marketSource: 'UNKNOWN', bots: [], markets: [], risk: {} };
const mcpPaperProposals = [];

function isLoopbackRequest(request) {
  const address = String(request.socket?.remoteAddress || '').replace(/^::ffff:/, '');
  return address === '127.0.0.1' || address === '::1';
}

function cleanText(value, limit) {
  return typeof value === 'string' ? value.trim().slice(0, limit) : '';
}

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function sanitizeMcpSnapshot(value) {
  const bots = Array.isArray(value.bots) ? value.bots.slice(0, 50).map((bot) => ({
    id: cleanText(bot?.id, 80),
    name: cleanText(bot?.name, 120),
    strategy: cleanText(bot?.strategy, 240),
    active: Boolean(bot?.active),
    symbols: Array.isArray(bot?.symbols) ? bot.symbols.slice(0, 30).map((item) => cleanText(item, 40)).filter(Boolean) : [],
    minSignalScore: finiteNumber(bot?.minSignalScore),
    research: {
      approved: Boolean(bot?.research?.approved),
      sampleTrades: finiteNumber(bot?.research?.sampleTrades),
      minimumSampleTrades: finiteNumber(bot?.research?.minimumSampleTrades),
      shrunkWinRatePct: finiteNumber(bot?.research?.shrunkWinRatePct),
      expectancyR: finiteNumber(bot?.research?.expectancyR),
      baselineExpectancyR: finiteNumber(bot?.research?.baselineExpectancyR),
      breakEvenWinRatePct: bot?.research?.breakEvenWinRatePct === null ? null : finiteNumber(bot?.research?.breakEvenWinRatePct),
    },
  })).filter((bot) => bot.id) : [];
  const markets = Array.isArray(value.markets) ? value.markets.slice(0, 100).map((market) => ({
    symbol: cleanText(market?.symbol, 40),
    name: cleanText(market?.name, 120),
    price: finiteNumber(market?.price),
    signalScore: finiteNumber(market?.signalScore),
    bias: ['BUY', 'SELL', 'HOLD'].includes(market?.bias) ? market.bias : 'HOLD',
    regime: cleanText(market?.regime, 80),
    spread: finiteNumber(market?.spread),
  })).filter((market) => market.symbol) : [];
  const risk = value.risk && typeof value.risk === 'object' ? value.risk : {};
  return {
    updatedAt: new Date().toISOString(),
    marketSource: value.marketSource === 'DERIV_WS' ? 'DERIV_WS' : 'SIMULATOR',
    bots,
    markets,
    risk: {
      connectionMode: ['LIVE', 'DEMO', 'SIMULATOR'].includes(risk.connectionMode) ? risk.connectionMode : 'SIMULATOR',
      autoExecutionEnabled: Boolean(risk.autoExecutionEnabled),
      liveExecutionArmed: Boolean(risk.liveExecutionArmed),
      maxRiskPerTradePct: finiteNumber(risk.maxRiskPerTradePct),
      dailyMaxLoss: finiteNumber(risk.dailyMaxLoss),
      maxRealizedDrawdown: finiteNumber(risk.maxRealizedDrawdown),
      currentRealizedDrawdown: finiteNumber(risk.currentRealizedDrawdown),
      openPositionCount: finiteNumber(risk.openPositionCount),
    },
  };
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  });
  response.end(JSON.stringify(payload));
}

async function readJson(request, maxBytes = 32_768) {
  let raw = '';
  let bytes = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    bytes += buffer.length;
    if (bytes > maxBytes) throw new Error('Request body is too large.');
    raw += buffer.toString('utf8');
  }
  return raw ? JSON.parse(raw) : {};
}

function isQuantumBridgeAppOrigin(request) {
  const origin = request.headers.origin;
  if (!origin) return false;
  try {
    const parsed = new URL(origin);
    return parsed.protocol === 'http:'
      && ['localhost', '127.0.0.1', '[::1]'].includes(parsed.hostname)
      && parsed.port === '5173';
  } catch {
    return false;
  }
}

async function fetchDerivJson(url, options) {
  const upstream = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(20_000),
    headers: {
      accept: 'application/json',
      ...options.headers,
    },
  });
  const payload = await upstream.json().catch(() => ({}));
  return { status: upstream.status, payload };
}

async function fetchJarvisJson(pathname) {
  const base = process.env.QB_JARVIS_API_BASE || DEFAULT_JARVIS_API_BASE;
  const url = new URL(pathname, base);
  const upstream = await fetch(url, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(5_000),
  });
  const payload = await upstream.json().catch(() => ({}));
  return { status: upstream.status, payload };
}

export async function handleApiRequest(request, response) {
  const requestUrl = new URL(request.url || '/', 'http://127.0.0.1');

  try {
    if (requestUrl.pathname === '/api/bots/evaluate' && request.method === 'POST') {
      if (!isLoopbackRequest(request) || !isQuantumBridgeAppOrigin(request)) {
        return sendJson(response, 403, { error: 'Imported bot execution accepts requests from the local QuantumBridge app only.' });
      }
      const body = await readJson(request, 128 * 1024);
      try {
        const signal = await executeBotScript(body);
        return sendJson(response, 200, { signal });
      } catch (error) {
        return sendJson(response, error.statusCode || 422, { error: error.message || 'Imported bot execution failed.' });
      }
    }

    if (requestUrl.pathname.startsWith('/api/mcp/')) {
      if (!isLoopbackRequest(request)) {
        return sendJson(response, 403, { error: 'The local MCP bridge accepts connections from this computer only.' });
      }

      if (requestUrl.pathname === '/api/mcp/state' && request.method === 'GET') {
        return sendJson(response, 200, mcpBotSnapshot);
      }
      if (requestUrl.pathname === '/api/mcp/state' && request.method === 'POST') {
        mcpBotSnapshot = sanitizeMcpSnapshot(await readJson(request));
        return sendJson(response, 200, { ok: true, updatedAt: mcpBotSnapshot.updatedAt });
      }
      if (requestUrl.pathname === '/api/mcp/proposals' && request.method === 'GET') {
        return sendJson(response, 200, { proposals: mcpPaperProposals.filter((proposal) => proposal.status === 'PENDING_REVIEW') });
      }
      if (requestUrl.pathname === '/api/mcp/proposals' && request.method === 'POST') {
        const body = await readJson(request);
        const botId = cleanText(body.botId, 80);
        const symbol = cleanText(body.symbol, 40);
        const action = ['BUY', 'SELL', 'HOLD'].includes(body.action) ? body.action : '';
        const rationale = cleanText(body.rationale, 1000);
        const snapshotAge = Date.now() - Date.parse(mcpBotSnapshot.updatedAt || '');
        const bot = mcpBotSnapshot.bots.find((candidate) => candidate.id === botId);
        if (!Number.isFinite(snapshotAge) || snapshotAge > 30_000) {
          return sendJson(response, 409, { error: 'QuantumBridge bot status is stale. Reopen the app and retry.' });
        }
        if (!bot || !symbol || !bot.symbols.includes(symbol) || !action || !rationale) {
          return sendJson(response, 400, { error: 'Select a listed bot and assigned market, provide BUY, SELL, or HOLD, and include a rationale.' });
        }
        if (mcpPaperProposals.filter((proposal) => proposal.status === 'PENDING_REVIEW').length >= 50) {
          return sendJson(response, 429, { error: 'The paper review inbox is full. Review existing proposals first.' });
        }
        const proposal = {
          id: randomUUID(),
          botId,
          botName: bot.name,
          symbol,
          action,
          rationale,
          createdAt: new Date().toISOString(),
          status: 'PENDING_REVIEW',
        };
        mcpPaperProposals.unshift(proposal);
        if (mcpPaperProposals.length > 200) mcpPaperProposals.length = 200;
        return sendJson(response, 201, { proposal });
      }
      const decisionMatch = requestUrl.pathname.match(/^\/api\/mcp\/proposals\/([0-9a-f-]{36})\/decision$/i);
      if (decisionMatch && request.method === 'POST') {
        const body = await readJson(request);
        if (!['PAPER_LOGGED', 'DISMISSED'].includes(body.decision)) {
          return sendJson(response, 400, { error: 'Decision must be PAPER_LOGGED or DISMISSED.' });
        }
        const proposal = mcpPaperProposals.find((candidate) => candidate.id === decisionMatch[1]);
        if (!proposal || proposal.status !== 'PENDING_REVIEW') {
          return sendJson(response, 404, { error: 'Pending paper proposal not found.' });
        }
        proposal.status = body.decision;
        proposal.reviewedAt = new Date().toISOString();
        return sendJson(response, 200, { proposal });
      }
      return sendJson(response, 404, { error: 'MCP bridge route not found.' });
    }

    if (requestUrl.pathname === '/api/oauth/exchange' && request.method === 'POST') {
      const body = await readJson(request);
      const { client_id: clientId, redirect_uri: redirectUri, code, code_verifier: codeVerifier } = body;
      const expectedRedirectUri = process.env.QB_OAUTH_REDIRECT_URI || DEFAULT_LOCAL_REDIRECT_URI;

      if (typeof clientId !== 'string' || !/^[A-Za-z0-9_-]{2,64}$/.test(clientId)) {
        return sendJson(response, 400, { error: 'Enter the App ID assigned to your registered Deriv OAuth app.' });
      }
      if (process.env.QB_DERIV_CLIENT_ID && clientId !== process.env.QB_DERIV_CLIENT_ID) {
        return sendJson(response, 400, { error: 'This App ID does not match the server configuration.' });
      }
      if (redirectUri !== expectedRedirectUri) {
        return sendJson(response, 400, { error: `The callback URL must match the registered URL: ${expectedRedirectUri}` });
      }
      if (typeof code !== 'string' || code.length < 4 || code.length > 4096) {
        return sendJson(response, 400, { error: 'Deriv did not return a valid authorization code.' });
      }
      if (typeof codeVerifier !== 'string' || codeVerifier.length < 43 || codeVerifier.length > 128) {
        return sendJson(response, 400, { error: 'The sign-in verifier is missing or invalid. Start login again.' });
      }

      const form = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        code,
        code_verifier: codeVerifier,
        redirect_uri: redirectUri,
      });
      const result = await fetchDerivJson(DERIV_AUTH_TOKEN_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: form,
      });

      if (result.status < 200 || result.status >= 300) {
        const reason = result.payload?.error_description || result.payload?.message || result.payload?.error;
        return sendJson(response, result.status, { error: reason || 'Deriv could not complete sign-in. Check the App ID and registered callback URL.' });
      }
      if (!result.payload?.access_token || !Number.isFinite(Number(result.payload?.expires_in))) {
        return sendJson(response, 502, { error: 'Deriv returned an incomplete token response.' });
      }

      return sendJson(response, 200, {
        access_token: result.payload.access_token,
        token_type: result.payload.token_type || 'Bearer',
        expires_in: Number(result.payload.expires_in),
      });
    }

    if (requestUrl.pathname === '/api/jarvis/signals' && request.method === 'GET') {
      try {
        const result = await fetchJarvisJson('/api/quantumbridge/signals');
        return sendJson(response, result.status, result.payload);
      } catch {
        return sendJson(response, 503, { error: 'JARVIS is not reachable. Start JARVIS Workshop on localhost:5000.' });
      }
    }

    if (requestUrl.pathname === '/api/jarvis/status' && request.method === 'GET') {
      try {
        const result = await fetchJarvisJson('/api/quantumbridge/status');
        return sendJson(response, result.status, result.payload);
      } catch {
        return sendJson(response, 503, { error: 'JARVIS is not reachable. Start JARVIS Workshop on localhost:5000.' });
      }
    }

    if (requestUrl.pathname === '/api/deriv/accounts' && request.method === 'GET') {
      const authorization = request.headers.authorization;
      if (!authorization?.startsWith('Bearer ')) {
        return sendJson(response, 401, { error: 'Sign in with Deriv before loading accounts.' });
      }
      const result = await fetchDerivJson(`${DERIV_API_BASE}/trading/v1/options/accounts`, {
        method: 'GET',
        headers: { authorization },
      });
      return sendJson(response, result.status, result.payload);
    }

    const otpMatch = requestUrl.pathname.match(/^\/api\/deriv\/accounts\/([A-Za-z0-9_-]{2,64})\/otp$/);
    if (otpMatch && request.method === 'POST') {
      const authorization = request.headers.authorization;
      if (!authorization?.startsWith('Bearer ')) {
        return sendJson(response, 401, { error: 'Sign in with Deriv before connecting an account.' });
      }
      const accountId = encodeURIComponent(otpMatch[1]);
      const result = await fetchDerivJson(`${DERIV_API_BASE}/trading/v1/options/accounts/${accountId}/otp`, {
        method: 'POST',
        headers: { authorization },
      });
      return sendJson(response, result.status, result.payload);
    }

    return sendJson(response, 404, { error: 'API route not found.' });
  } catch (error) {
    const status = error instanceof SyntaxError ? 400 : 502;
    return sendJson(response, status, { error: error.message || 'Deriv request failed.' });
  }
}

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

async function serveStatic(request, response) {
  const pathname = decodeURIComponent(new URL(request.url || '/', 'http://127.0.0.1').pathname);
  const safePath = path.resolve(distRoot, `.${pathname}`);
  if (safePath !== distRoot && !safePath.startsWith(`${distRoot}${path.sep}`)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  let filePath = safePath;
  try {
    await access(filePath);
    if ((await stat(filePath)).isDirectory()) filePath = path.join(filePath, 'index.html');
    await access(filePath);
  } catch {
    filePath = path.join(distRoot, 'index.html');
  }

  response.writeHead(200, {
    'content-type': mimeTypes[path.extname(filePath)] || 'application/octet-stream',
    'x-content-type-options': 'nosniff',
  });
  createReadStream(filePath).pipe(response);
}

export function createApiServer({ serveBuiltSite = false } = {}) {
  return createServer(async (request, response) => {
    if (request.url?.startsWith('/api/')) {
      return handleApiRequest(request, response);
    }
    if (serveBuiltSite) return serveStatic(request, response);
    response.writeHead(404).end('Not found');
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const serveBuiltSite = process.argv.includes('--serve-dist');
  const host = process.env.HOST || 'localhost';
  const port = Number(process.env.PORT || 5173);
  const server = createApiServer({ serveBuiltSite });
  server.listen(port, host, () => {
    console.log(`QuantumBridge ${serveBuiltSite ? 'preview' : 'API'} server listening at http://${host}:${port}`);
  });
}
