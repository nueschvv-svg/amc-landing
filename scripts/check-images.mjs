import { readFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
export async function checkImages(site) {
  const html = await readFile(path.join(site, 'index.html'), 'utf8');
  const tags = html.match(/<img\b[^>]*>/g) || [];
  const seen = new Map();
  for (const tag of tags) {
    const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
    if (!src?.startsWith('/images/')) continue;
    const canonical = src.replace('-small.webp', '.webp');
    const bytes = await readFile(path.join(site, canonical));
    const hash = createHash('sha256').update(bytes).digest('hex');
    if (seen.has(hash)) throw new Error('Imagen repetida: ' + src + ' / ' + seen.get(hash));
    seen.set(hash, src);
    const set = tag.match(/\bsrcSet="([^"]+)"/i)?.[1];
    for (const candidate of (set || '').split(',')) {
      const file = candidate.trim().split(' ')[0];
      if (file.startsWith('/')) await access(path.join(site, file));
    }
  }
  if (seen.size < 10) throw new Error('Inventario de imágenes incompleto');
  console.log('Imágenes comprobadas: ' + seen.size + ' imágenes únicas, sin archivos faltantes.');
}
