import { checkImages } from './check-images.mjs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import {
  mkdir,
  readFile,
  rename,
  writeFile,
  readdir,
  stat,
} from 'node:fs/promises';
import { watch } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'deliverables');
const site = path.join(root, 'dist/client');
let building = false,
  queued = false,
  timer;
async function filesIn(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const lists = await Promise.all(
    entries.map((e) =>
      e.isDirectory()
        ? filesIn(path.join(dir, e.name))
        : [path.join(dir, e.name)],
    ),
  );
  return lists.flat();
}
async function packageSite() {
  if (building) {
    queued = true;
    return;
  }
  building = true;
  try {
    console.log('Construyendo AMC…');
    await run('npm', ['run', 'build'], {
      cwd: root,
      maxBuffer: 10 * 1024 * 1024,
    });
    const html = await readFile(path.join(site, 'index.html'), 'utf8');
    if (!html.includes('CULTURA') || !html.includes('DE RUTA'))
      throw new Error('El HTML estático no contiene la página AMC.');
    if (html.includes('/@vite/client'))
      throw new Error('El resultado contiene un cliente de desarrollo.');
    await checkImages(site);
    const files = await filesIn(site);
    if (!files.some((f) => f.endsWith('.js')))
      throw new Error('No se generó JavaScript de producción.');
    await mkdir(path.join(output, 'history'), { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const temp = path.join(output, `AMC-Netlify-${timestamp}.tmp.zip`);
    // index.html must be at the ZIP root for Netlify Drop.
    await run('zip', ['-q', '-r', temp, '.'], {
      cwd: site,
      maxBuffer: 2 * 1024 * 1024,
    });
    await run('unzip', ['-tq', temp], { cwd: root });
    const bytes = await readFile(temp);
    const final = path.join(output, 'AMC-Netlify.zip');
    await rename(temp, final); // Replace only after a successful build + ZIP verification.
    await writeFile(
      path.join(output, 'history', `AMC-Netlify-${timestamp}.zip`),
      bytes,
    );
    const info = {
      builtAt: new Date().toISOString(),
      sha256: createHash('sha256').update(bytes).digest('hex'),
      bytes: (await stat(final)).size,
      files: files.length,
      entry: 'index.html',
      source: 'dist/client',
      deployed: false,
    };
    await writeFile(
      path.join(output, 'ultima-version.json'),
      JSON.stringify(info, null, 2) + '\n',
    );
    console.log(
      `ZIP actualizado: ${final}\n${info.files} archivos; ${(info.bytes / 1024 / 1024).toFixed(2)} MB; SHA256 ${info.sha256}`,
    );
  } catch (error) {
    console.error(
      'No se reemplazó el ZIP anterior:',
      error.stderr || error.message,
    );
    process.exitCode = 1;
  } finally {
    building = false;
    if (queued) {
      queued = false;
      void packageSite();
    }
  }
}
await packageSite();
if (process.argv.includes('--watch')) {
  process.exitCode = 0;
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(() => void packageSite(), 1200);
  };
  for (const dir of ['app', 'public', 'scripts'])
    watch(path.join(root, dir), { recursive: true }, schedule);
  for (const file of [
    'package.json',
    'package-lock.json',
    'next.config.ts',
    'vite.config.ts',
  ])
    watch(path.join(root, file), schedule);
  console.log(
    'Guardado automático activo. Cada cambio genera un ZIP nuevo después de compilar correctamente. Ctrl+C para detener.',
  );
}
