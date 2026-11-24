# AGENTS.md — guía de 1 página para cualquier agente

Portfolio de **Francisco Benítez / BLOQQ MÁYUS** (`bloqqmayus.github.io`). Sitio estático de una
página en GitHub Pages: **sin build, sin npm, sin framework**. Lo que está en el repo es lo que se sirve.

## Antes de tocar nada
1. Leé **«Reglas vigentes»** en `README.md`: son pedidos explícitos del dueño (texto exacto del cartel
   de neón, orden aleatorio, pliegue 6/5, rueda 3D, miniaturas `?d=`, estrellas con presupuesto,
   botón atrás por capas, interruptores `TIPS_ON` / `LIGHTTABLES_ON`). No se rompen sin pedido.
2. Cambios de **contenido** (agregar/quitar videos) no tocan CSS ni JS.
3. Nunca publicar (`git push`) sin OK del dueño. Se publica a `main` **y** a `bloqqfolio` (siempre iguales).

## Dónde está cada cosa
| Quiero… | Archivo |
|---|---|
| Agregar/quitar un videoclip, cambiar email, teléfono, redes, showreel | `content/site.js` (`CONFIG`) |
| Créditos en la ficha de un videoclip | `credits: [["Cámara","Nombre"], …]` en ese film de `CONFIG.films` (opcional) |
| Agregar un reel vertical | `assets/reels/` + `FALLBACK_REELS` en `js/reels.js` (ver README) |
| Colores, fuentes, variables | `css/tokens.css` |
| Estructura HTML de las secciones | `index.html` |
| Estilos de una sección | `css/<sección>.css` (nav, hero, proof, work, vertical, services, contact, footer, overlays) |
| Cifras bajo el hero | `index.html` (`#proof`) + `js/proof.js`: videoclips y artistas = `CONFIG.films` + `data-base` (150 y 50) |
| Lógica de una sección | `js/<sección>.js` (cada archivo arranca con una línea que dice qué hace) |
| Galería 3D | `lab/vortex/index.html` (su lista `UNIQUE` también se actualiza al sumar videos) |

## Orden de carga (importa)
- **CSS**: los `<link>` del `<head>` en orden; `css/reveal.css` va **último** a propósito.
- **JS**: scripts clásicos al final del `<body>`, en orden, compartiendo el ámbito global.
  `js/core.js` (utilidades: `esc`, `shuffle`, fade-in de imágenes) → `content/site.js` (`CONFIG`) → el resto → `js/main.js`.
  Una función declarada en un archivo **posterior** no existe al cargar uno anterior:
  correr `node tests/hoist-check.cjs` y, si algo se llama al cargar, moverlo a `core.js`.
- Todo HTML armado con plantillas pasa por `esc()`; nunca interpolar datos externos sin escapar.

## Probar antes de entregar
```
node tests/qa.mjs _plan/qa-ahora --compare _plan/qa-antes
```
Edge headless, sin dependencias: capturas por sección (desktop 1440 y celu 390), 21 chequeos de
conducta (pliegue, filtros, rueda, Showreel, Escape, Galería 3D, consola limpia) y una **huella** del
DOM + estilos computados. Para refactors sin cambio visual la huella tiene que dar **IDÉNTICA**.
Vista previa manual: `python -m http.server 8765` en esta carpeta.

## Estilo del código
- Comentarios y textos en castellano rioplatense; nombres de código en inglés o como ya estén.
- Sin colores ni medidas sueltas: si hace falta uno nuevo, va a `css/tokens.css`.
- Animar solo `transform` y `opacity`; todo movimiento respeta `prefers-reduced-motion`.
