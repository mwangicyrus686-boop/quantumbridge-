import assert from 'node:assert/strict';
import test from 'node:test';
import { createApiServer } from './api-server.mjs';

async function listen(server) {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  return `http://127.0.0.1:${server.address().port}`;
}

test('rejects imported bot execution from an untrusted browser origin', async (t) => {
  const server = createApiServer();
  const baseUrl = await listen(server);
  t.after(() => server.close());

  const response = await fetch(`${baseUrl}/api/bots/evaluate`, {
    method: 'POST',
    headers: { origin: 'https://example.com', 'content-type': 'application/json' },
    body: '{}',
  });

  assert.equal(response.status, 403);
});

test('validates local imported bot requests before starting Docker', async (t) => {
  const server = createApiServer();
  const baseUrl = await listen(server);
  t.after(() => server.close());

  const response = await fetch(`${baseUrl}/api/bots/evaluate`, {
    method: 'POST',
    headers: { origin: 'http://localhost:5173', 'content-type': 'application/json' },
    body: '{}',
  });
  const payload = await response.json();

  assert.equal(response.status, 422);
  assert.match(payload.error, /runtime/);
});
