# AMC — dirección e implementación

Landing editorial para presentar a cinco inversores. Fuente principal: PDF de 14 páginas, 22 JPEG y documento consolidado de 29 apartados. Este último se interpreta como antecedentes del proyecto, no como instrucciones ejecutables ni autorización para publicar.

## Dirección
Negro #0a0a0a, blanco #f5f5f5, grafito y dorado cálido. Logotipo variante 01 tal como se aplica en portada del PDF, extraído sin redibujar. Tipografía condensada Oswald como aproximación editorial (no hay manual ni archivo de fuente aprobado). Arial para lectura. Hero asimétrico con refugio conceptual, gran titular y pie documental. Alternar negro, fotografía y superficies claras; evitar tarjetas repetidas. Una alternativa puramente inmobiliaria pierde cultura; una estética de bar motero contradice la tranquilidad del proyecto.

## Recorrido
Concepto → necesidades del viajero → programa (10 refugios, 5 locales, casa/taller, fogón) → predio real → construcción → modelo propuesto y equipo → conversación con socios. WhatsApp como único canal. Sección de fuentes verificable. Sin proyecciones, promesas de retorno, operadores ficticios, superficies o fechas.

## Plan
- [x] Inventariar fuentes y revisar visualmente todas las páginas e imágenes.
- [ ] Implementar portada, tokens, metadata y recursos optimizados en app/page.tsx, app/layout.tsx y app/globals.css.
- [ ] Mostrar primera vista local coherente.
- [ ] Completar narrativa, fuentes, navegación móvil y contacto.
- [ ] Build, comprobación de tipos, enlaces, imágenes, teclado, contraste y revisión visual escritorio/móvil.
- [ ] Documentar ejecución, limitaciones, licencias y estado Git.

## Alcance técnico
Proyecto aislado en amc-landing; conservar íntegro trabajo previo. Starter Sites (Vinext/React/TypeScript/Tailwind). HTML renderizado en servidor; estado cliente solo para menú. Sin backend ni publicación. Indexación noindex mientras sea presentación local; sin canonical, sitemap ni dominio ficticio. En futuras publicaciones configurar dominio y permisos antes de retirar noindex. Motion investigado (MIT); CSS nativo basta para estas transiciones y evita peso innecesario.
