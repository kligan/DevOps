import http from 'node:http';
import { pathToFileURL } from 'node:url';

export function createServer() {
  return http.createServer((req, res) => {
    const path = req.url.split('?')[0];
    res.setHeader('Content-Type', 'application/json');
    if (req.method !== 'GET') {
      res.writeHead(405, { Allow: 'GET' });
      return res.end(JSON.stringify({ error: 'Method not allowed' }));
    }
    if (path === '/health') return res.end(JSON.stringify({ status: 'ok' }));
    if (path === '/') return res.end(JSON.stringify({ message: 'Hello from the DevOps lab!' }));
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be between 1 and 65535');
  const server = createServer();
  server.listen(port, '0.0.0.0', () => console.log('Listening on port ' + port));
  for (const signal of ['SIGTERM', 'SIGINT']) {
    process.once(signal, () => {
      server.close(() => process.exit(0));
      setTimeout(() => process.exit(1), 10000).unref();
    });
  }
}
