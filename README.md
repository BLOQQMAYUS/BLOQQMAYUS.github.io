# 🎬 Tu portfolio — Filmmaking & Contenido Vertical

Sitio de una sola página, oscuro y cinematográfico. Flujo del visitante:
**entra → mira el laburo → pasa al contacto.** Cinco secciones:
01 Trabajo (videoclips 16:9) · 02 3D (reels 9:16) · 03 Videoclips verticales ·
04 Toolbox (mesas de ideas) · 05 Contacto.

## 📌 Reglas vigentes (aplican a todo cambio futuro)

- **01 · MONTAJE | EDICIÓN | VFX: orden SIEMPRE aleatorio.** La grilla se mezcla
  en cada carga (Fisher–Yates sobre `workOrder`). Al agregar links/videos
  nuevos, entran al pool y se mezclan con el resto — sin prioridad por fecha.
  `CONFIG.films` se mantiene en orden cronológico solo como archivo de datos.
  El pliegue muestra **8** en computadora y **5 en celular** (`FOLD = 8`,
  `FOLD_SM = 5`, breakpoint 760px — en celu la grilla es de una columna y la
  sección se haría larguísima). Se recalcula solo al cambiar el breakpoint.
  El botón **"¿Más? Galería ↓"** ya NO despliega la grilla:
  lleva a **05 · Contacto** y dispara la clase `.attn` del cartel de neón
  (una pasada de 2.4 s, transform+opacity, se limpia en `animationend`)
  para que el usuario entre solo a la Galería 3D, donde están todas las piezas.
  El subtítulo del cartel es **solo la flecha ⇪, grande y en neón ámbar**
  (mismo lenguaje que el tubo: núcleo blanco + halo del color del sitio).
  Al filtrar por artista se muestran todas sus piezas, sin pliegue.
- **Contacto: email y teléfono apilados** (email primero). El botón del
  teléfono usa el **ícono de WhatsApp** en outline (mismo estilo que el del
  email); el link sigue siendo `tel:` — si se quiere que abra WhatsApp,
  hay que cambiar el `href` a `https://wa.me/5491159754088`.
- **02 y 03 están FUSIONADAS en una sola sección `#vertical`** — kicker
  `02 · Proyectos 2D / 3D — últimos trabajos`, título **"Contenido vertical"**.
  No existen `#3d` ni `#reels`; el nav es **Obras / Vertical / Servicios /
  Contacto** (4 links, 4 secciones).
- **La rueda 3D reemplazó al slider.** Los **8 verticales** orbitan un cilindro
  alrededor del eje Y (`rotateY(i·360/n) translateZ(R)` + `backface-visibility:
  hidden`): la pieza del frente se ve **grande y centrada**, las demás se
  alejan en profundidad. Gira sola, **despacio** (`WHEEL_DEG = 7.5` °/s ≈ 48 s
  por vuelta) y se frena cuando hay una capa abierta, cuando la sección no
  está a la vista (IO) o cuando la pestaña está oculta. **CHECHA Rifa siempre
  primera (al frente); el resto, aleatorio en cada carga.** Los reels nuevos
  que se agreguen a `assets/reels/` entran a la mezcla automáticamente.
  La rueda usa **solo posters** (`assets/posters/`): cero decode de video
  mientras gira. **Cualquier preview es clickeable en cualquier momento** →
  mesa de luz limpia (`openReel`). El click se resuelve por **proyección
  (`wheelCardAt`, elige el mayor coseno = la más al frente)**, nunca por
  hit-testing nativo (Chrome lo rompe con `preserve-3d`). Arrastrar hace
  girar la rueda; un tap (≤8 px, <600 ms) abre la pieza.
  **La rueda del mouse NO mueve la rueda: scrollea la página** (no hay
  `wheel` listener; en celular `touch-action: pan-y` deja scrollear normal).
  Sin números `.reel-idx` sobre las previews.
- **Botón ATRÁS (Android / navegador) cierra la capa de arriba, nada más.**
  Cada capa abierta empuja una entrada de historial (`layerPush`) y el
  `popstate` cierra solo la última: mesa de luz de reel, mesa del Toolbox,
  modal y Galería 3D en el sitio; mesa de luz dentro de la galería. Cerrar
  desde la UI consume su propia entrada (`layerDrop` + `history.go`) para que
  el historial no quede sucio. Escape hace lo mismo que atrás. Al cerrar la
  galería se descuentan las capas que quedaron abiertas adentro del iframe
  (`__bloqqLayers()`). **Atrás nunca recarga el sitio**: la galería vuelve
  exactamente al mismo lugar (`camZ` intacto). El iframe se carga y se
  descarga con `contentWindow.location.replace()` — asignar `.src` metería
  entradas extra en el historial conjunto.
- **Footer: `.foot-ind` con LED rojo titilante + "INDUSTRIA ARGENTINA".**
- **Toolbox (textos e íconos vigentes)**: *Dirección creativa* (claqueta) ·
  *Post, Color & VFX* (línea de tiempo con playhead; etiquetas `Edición ·
  Color · VFX · Mograph · 2D · 3D`) · *Lo viejo funciona, Juan* ("Team
  horizontal for ever: narrativa y formato largo."; `16:9 · BLOGS · PÓDCASTS ·
  YOUTUBE`) · *Estrategia Vertical* (celular con la silueta rellena de un
  rapero con micrófono). Los rellenos usan la clase **`.solid`**
  (`fill: var(--acc)`), no `currentColor` — que resolvería al hueso del texto.
  **PENDIENTE: el ícono de "Lo viejo" es todavía pantalla+play; hay que
  cambiarlo por la Torino con el fondo removido, en ámbar.** La imagen se
  anunció en `/assets/uploads/Torino.png` pero **no está en el repo** (revisado
  el árbol completo de `main`): ese commit no se guardó. Hay que subirla de
  nuevo o pasarla por el chat.
- **La Galería 3D es función oficial del sitio** (ya no es un lab temporal):
  la activa el **cartel de neón 3D titilante "GALERÍA 3D"** de la sección
  Contacto (`#ledBtn`), como overlay a pantalla completa (`#galBox` + iframe
  a `lab/vortex/`, que se descarga al cerrar). El neón titila solo cuando está
  a la vista (IntersectionObserver) y anima únicamente opacidad → sin costo
  de rendimiento; se apaga con `prefers-reduced-motion`.
  La galería contiene **las 34 piezas únicas del sitio** (24 videoclips +
  showreel + FACTS + 8 reels), una sola vez por vuelta — sin copias y sin
  contador. Los videos nuevos que se agreguen al sitio deben sumarse también
  a `UNIQUE` en `lab/vortex/index.html`. Fondo: espacio 3D con estrellas
  sutiles. Click en una obra → mesa de luz (65% de oscuridad, vuelo al centro,
  autoplay sin controles; click en la preview = play/pausa invisible; click
  afuera = volver a la galería). El click se resuelve por **proyección
  matemática (`cardAt`)**, no por hit-testing nativo: Chrome rompe el
  hit-testing con `preserve-3d` + `perspective` (las obras se dibujan pero no
  clickean, sobre todo al moverse). `cardAt` proyecta cada obra y elige la más
  cercana bajo el pointer → funciona a cualquier profundidad.
- **Toda preview respeta la relación de aspecto original del archivo**
  (16:9, 9:16, 1:1, 4:5…): nunca se fuerza un crop uniforme.
- **Todas las mesas de luz / previews oscurecen el fondo al 65%**
  (rgba(10,8,6,.65)): reels, mesas del Toolbox, modal y Galería 3D.
- **04 · Toolbox: las mesas de luz están APAGADAS a propósito** (falta preparar
  el contenido de cada rama). El interruptor es **`const LIGHTTABLES_ON = false`**
  en `index.html`: ponerlo en `true` reactiva TODO solo — el click de las 4
  tarjetas, las mesas y el `(Clickeá una)` del h2. No hay nada que reescribir.
  Apagado, el h2 queda en **"Mis herramientas, a tu disposición."** y las
  tarjetas son informativas: conservan el **"+" y el hover como anticipo**,
  pero salen del orden de tabulación (`tabIndex = -1`), se anuncian
  `aria-disabled` y no muestran cursor de mano. **No empujan historial**: el
  botón atrás nunca queda atrapado en una capa fantasma.
  Se conserva intacto `LIGHTTABLES`, `openLT/closeLT` y `#ltBox` (mesas de
  ideas por rama, con placeholders punteados para imágenes futuras en formatos
  variados). El smoke corre el sitio **dos veces**: tal cual (apagado) y con el
  interruptor prendido (`LT=1 node tests/shim.js`), para que la función dormida
  no se pudra mientras espera.
- **`.reveal.in{transform:none}` pisa los hover de igual especificidad** que
  estén antes en la hoja. Por eso el hover de las tarjetas del Toolbox es
  `.serv-grid .serv:hover` (una clase extra). Si se agrega un hover con
  transform a un elemento que también lleva `.reveal`, hay que subirle la
  especificidad o no va a levantar nunca.
- Todo lo que no sirva al objetivo portfolio → contacto se corta.


## 📁 Estructura
```
portfolio/
├── index.html      ← todo el sitio (diseño + lógica + tus datos)
└── assets/         ← las imágenes (ahora son ejemplos generados con IA)
```

## ✏️ Cómo personalizarlo (5 minutos)
Abre `index.html` y busca el bloque **`✏️ CONFIG — EDITA SOLO ESTE BLOQUE`** (dentro de `<script>`, casi al final). Ahí cambias:

| Campo | Qué es |
|---|---|
| `name`, `city`, `email`, `phone` | Tu nombre, ciudad, email y teléfono (se actualizan en toda la página) |
| `showreel.video` | URL de tu showreel (YouTube, Vimeo o .mp4) |
| `clients` | Marcas/clientes del carrusel animado |
| `stats` | Tus métricas (años, proyectos, views…) |
| `gear` | Tu equipo |
| `socials` | Enlaces a tus redes |
| `films` | Proyectos horizontales: título, categoría, año, rol, miniatura y vídeo |
| `verticals` | Reels/TikToks/Shorts: título, plataforma, views, miniatura y vídeo |

**Vídeos:** en cada proyecto, pega la URL en el campo `video`. El modal detecta
YouTube (incluido Shorts), Vimeo y archivos `.mp4` automáticamente. Si lo dejas
vacío (`""`), se muestra la miniatura con un aviso de demo.

**Imágenes:** sustituye los archivos de `assets/` por tus propios frames
(mantén los nombres, o actualiza las rutas en CONFIG). Recomendado:
horizontales ≥1600×900, verticales ≥900×1600, JPG calidad ~80.

## 🚀 Cómo publicarlo (gratis)
- **Netlify Drop** — arrastra la carpeta `portfolio/` a https://app.netlify.com/drop y listo.
- **GitHub Pages** — sube la carpeta a un repo y activa Pages en Settings → Pages.
- **Vercel / Cloudflare Pages** — importa el repo, sin configuración (sitio estático).

## 🅰️ Si prefieres montarlo en Adobe Portfolio
No puedo entrar en tu cuenta, pero puedes replicar esta estructura tú mismo:
1. En portfolio.adobe.com/sites → **Create New Site** → elige una plantilla minimalista oscura (p. ej. *Ludwig* o *Meridian*) y pon el fondo en negro (#0b0b0e).
2. Crea estas páginas/secciones: **Work** (galería grid 2 columnas con tus piezas horizontales), **Vertical** (galería con miniaturas 9:16), **About** (retrato + bio + métricas) y **Contact**.
3. Usa el bloque **Video** para incrustar tu showreel y cada pieza (YouTube/Vimeo).
4. Copia los textos de este sitio (bio, servicios, kickers) desde `index.html`.
5. Tipografía: Helvetica Bold (la biblia pide Helvetica 75 Bold), títulos en mayúsculas. Paleta brasa de la biblia: hollín #1A1714, ámbar #F2A51A, brasa #B8321F, rodocrosita #D9737F, hueso #F4EEE3; verde ácido #B5E61D solo en momentos clave.
6. Conecta tu dominio propio en Settings → Domain (incluido con tu suscripción Creative Cloud).

## 🖥️ Verlo en local
```bash
cd portfolio
python3 -m http.server 8000
# abre http://localhost:8000
```

## ⚠️ Abrir el HTML con doble click (file://)
YouTube **no permite reproductores incrustados desde archivos locales** (Error 153).
El sitio lo detecta y muestra la miniatura con un botón **"Ver en YouTube"** que abre
el video en una pestaña nueva. Publicado en la web (o servido por http), reproduce
inline sin problema. Además, el link "Ver en YouTube ↗" está siempre en el modal.

Versiones para descargar:
- `portfolio_BLOQQ_MAYUS.zip` — el sitio completo (index.html + assets/). Descomprimir y abrir index.html.
- `Portfolio_BLOQQ_MAYUS.html` — versión de un solo archivo con las 18 imágenes embebidas (~9 MB). Funciona con doble click, sin carpeta assets.

## ✅ Checks antes de cada push (en `../tests/`)

```bash
./tests/smoke.sh                              # conducta del sitio + galería + SEGURIDAD
NODE_PATH="$PWD/node_modules" node tests/tour.js   # tour real en Chromium (desktop + mobile)
```

- `shim.js` / `lab-shim.js` — conducta sin navegador (scanner, mesas, shuffle,
  pliegue 8, botón → Contacto + `.attn`, galería abrir/cerrar/descargar).
- **`security.js`** — la única entrada de datos externos es la API de GitHub
  (`REEL_OK`: sólo nombres `.mp4` simples, sin rutas/traversal ni caracteres
  con significado en HTML; las rutas viajan con `encodeURIComponent`).
  Además verifica: sin `eval`/`new Function`/`document.write`, sin
  `target="_blank"` sin `noopener`, sin `postMessage` sin control de origen,
  embeds en `youtube-nocookie`, sin contenido mixto `http://` y
  **ningún token filtrado en los archivos publicables**.
- `tour.js` — 41 checks en navegador real (texto vigente, 8 previews, botón
  que lleva a Contacto y hace que el neón pida el click, márgenes clickeables
  de todas las previews, scroll horizontal, galería con 320 estrellas).
  Las esperas van por **estado** (`rlPhase`, centrado del rect), no por reloj:
  en móviles emulados la transición visual tarda más que el timer.

### Galería 3D · ajustes vigentes

- Sin el ⇪ junto a "BLOQQ MÁYUS" en el encabezado y **sin la línea de texto
  informativo** de abajo (se quitó `#hint`; `seen()` quedó como no-op).
- **Reciclado por geometría, no por z fijo.** Antes se reciclaba a `z > 620`:
  en monitores anchos las obras más anchas (YouTube, 340px) seguían en cuadro
  a ese z y desaparecían de golpe antes de salir de pantalla; las verticales
  (216px) salían antes y en celu no pasaba. Ahora `computeRecycle()` calcula
  el z exacto en que cada obra termina de salir del encuadre:
  `z = P + dz − x_interior·P/(ancho/2)`, con `P = 900` (perspective), `dz` y
  `x_interior` derivados del ancho de la obra y el giro de 16°. Se recicla
  ahí +40 de margen (piso 620, techo 870) y se recalcula en `resize`.
  Sin lecturas de layout por frame.
- Regresión cubierta por **`tests/gallery-recycle.js`**: mide el salto de la
  posición propia de cada obra (`_z`, que la cámara no altera) y exige que
  ninguna obra perceptible se recicle estando en pantalla, hacia adelante y
  hacia atrás, en 1920 / 1280 / 390. `FORCE_OLD=1` reproduce el bug viejo
  para probar que el test lo detecta de verdad.
