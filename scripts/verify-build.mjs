import { checkImages } from './check-images.mjs';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
await checkImages('dist/client');
let count = 0;
for (const file of await readdir('public/images')) {
  if (!file.endsWith('.webp')) continue;
  const source = await readFile(path.join('public/images', file));
  const output = await readFile(path.join('dist/client/images', file));
  if (!source.equals(output)) throw new Error('Imagen alterada o incompleta: ' + file);
  if (output.toString('ascii', 0, 4) !== 'RIFF' || output.toString('ascii', 8, 12) !== 'WEBP')
    throw new Error('Formato de imagen inválido: ' + file);
  count++;
}
console.log(count + ' archivos WebP, incluidas variantes responsive y vistas alternativas, verificados.');
