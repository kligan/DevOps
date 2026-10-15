import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createServer } from '../src/server.js';

async function withServer(fn) {
  const server = createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try { await fn('http://127.0.0.1:' + server.address().port); }
  finally { await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve())); }
}

test('root returns JSON and a useful response', () => withServer(async base => {
  const response = await fetch(base);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /application\/json/);
  assert.deepEqual(await response.json(), { message: 'Hello from the DevOps lab!' });
}));
test('health endpoint works with a query string', () => withServer(async base => {
  const response = await fetch(base + '/health?probe=1');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
}));
test('unknown routes return 404', () => withServer(async base => {
  assert.equal((await fetch(base + '/missing')).status, 404);
}));
test('unsupported methods return 405 and advertise GET', () => withServer(async base => {
  const response = await fetch(base, { method: 'POST' });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'GET');
}));
