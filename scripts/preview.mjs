import { createServer } from 'node:http';
import { cp, mkdtemp, readFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const snapshot = await mkdtemp(path.join(tmpdir(), 'amc-preview-'));
await cp(path.join(root, 'dist/client'), snapshot, { recursive: true });
const portIndex = process.argv.indexOf('--port');
const port = portIndex >= 0 ? Number(process.argv[portIndex + 1]) : 4173;
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.webp':'image/webp', '.woff2':'font/woff2', '.json':'application/json', '.txt':'text/plain', '.rsc':'text/x-component' };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let target = path.resolve(snapshot, '.' + pathname);
    if (!target.startsWith(snapshot + path.sep) && target !== snapshot) {
      res.writeHead(403).end(); return;
    }
    if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
    const bytes = await readFile(target);
    res.writeHead(200, { 'Content-Type':types[path.extname(target)] || 'application/octet-stream', 'Cache-Control':'no-store' });
    res.end(req.method === 'HEAD' ? undefined : bytes);
  } catch {
    res.writeHead(404, { 'Content-Type':'text/plain' }).end('Archivo no encontrado');
  }
});
server.listen(port, '127.0.0.1', () => console.log('AMC producción: http://127.0.0.1:' + port));
for (const signal of ['SIGINT','SIGTERM']) process.on(signal, () => server.close(async () => {
  await rm(snapshot, { recursive:true, force:true });
  process.exit(0);
}));
