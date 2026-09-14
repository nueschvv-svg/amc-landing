# AMC — America Motor Company

Landing del proyecto de hospitalidad y cultura de ruta en Villa Ciudad de América, Córdoba. React, TypeScript, Vinext/Vite, GSAP e imágenes locales WebP. Exportación estática: no necesita backend, credenciales ni funciones de servidor.

## Ejecutar
Requiere Node 22.13 o posterior.
```sh
npm ci
npm run dev
```
Desarrollo en http://localhost:3000.

Para comprobar exactamente la versión de producción:
```sh
npm run build
npm start -- --port 4173
```
Abrir http://127.0.0.1:4173. La vista previa sirve una copia estable del build: las recompilaciones no interrumpen sus imágenes. Para ver un build nuevo, reiniciar npm start. Mantener la terminal abierta: si se detiene el servidor, las imágenes con carga diferida dejan de poder descargarse. Recargar la página después de reiniciarlo.

## Netlify desde GitHub
Importar este repositorio y seleccionar la rama principal. netlify.toml ya define:
- Directorio base: raíz del repositorio (vacío).
- Build command: npm run build
- Publish directory: dist/client
- Node: 22.
No necesita variables de entorno ni acceso a servicios privados. No subir solamente el código fuente con Netlify Drop: para esa modalidad usar el ZIP compilado.

La creación del repositorio no publica la web. La indexación permanece deshabilitada (metadatos, robots.txt y _headers) hasta definir dominio y autorización de publicación/indexación. No hay canonical ni sitemap con URLs inventadas.

## ZIP
```sh
npm run package:netlify
npm run watch:zip
```
El segundo comando mantiene el guardado automático mientras corre. Archivo vigente: deliverables/AMC-Netlify.zip. Versiones anteriores en deliverables/history. Estos artefactos se generan localmente y no se versionan en Git. index.html queda en la raíz del ZIP.

## Validación
```sh
npm run typecheck
npm run lint
npm run build
```
Cada build verifica duplicados en el HTML, srcSet y correspondencia binaria de todas las imágenes con public/images, incluidas las vistas alternativas. Una verificación fallida detiene el build.

## Contenido y recursos
Fuentes e inventario en docs/. Fotografías aportadas, renders conceptuales y escenas editoriales IA identificadas en la página. No se presentan como obras terminadas. El logo original no se modifica. Contacto centralizado en app/project.ts.

GSAP: licencia Standard No Charge (no OSI). Lucide: ISC/MIT según su licencia distribuida. Oswald: SIL OFL, copia en docs/licencias. Los materiales del proyecto no son recursos de licencia abierta.
