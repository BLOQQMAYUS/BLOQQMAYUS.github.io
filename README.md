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
  **El pliegue cumple tres reglas** (`buildWorkOrder`): **nunca más de
  `MAX_PER_CAT = 2` piezas del mismo artista**, y **siempre al menos una de
  MUSHER, una de TIERRAS RARAS y una de BLOQQ MÁYUS** (`MUST_CATS`). Vale para
  los DOS pliegues: se arma un prefijo que cumple en 5 y en 8, y después se
  mezcla el frente hasta que el de 5 también tenga los tres. El artista se
  agrupa por `cat` (la etiqueta del filtro), así que "Musher ft. X" cuenta como
  MUSHER. **Al filtrar por artista se muestran todas sus piezas, sin pliegue
  ni tope** — las reglas son solo para la vista "Todos".
  **Los botones de artista salen en orden ALEATORIO en cada visita**
  (`shuffle(Object.keys(counts))`); "Todos" queda primero por ser el filtro
  por defecto. El catálogo son **26 videoclips** (FACE DE FURRO y FACTS, de BLOQQ MÁYUS,
  entraron en noviembre; CHEESY FUCK se retiró por el bloqueo +18).
  El botón **"¿Más? Galería ↓"** ya NO despliega la grilla:
  lleva a **05 · Contacto** y dispara la clase `.attn` del cartel de neón
  (una pasada de 2.4 s, transform+opacity, se limpia en `animationend`)
  para que el usuario entre solo a la Galería 3D, donde están todas las piezas.
  El subtítulo del cartel es **solo la flecha ⇪, grande y en neón ámbar**
  (mismo lenguaje que el tubo: núcleo blanco + halo del color del sitio),
  **con el mismo círculo LED ácido que el logo** (`.neon-cap::after`, espejo de
  `.key::after`): parpadea con `blink`, se frena cuando el cartel no está a la
  vista o se lo está hovereando, y se apaga con `prefers-reduced-motion`.
  Al filtrar por artista se muestran todas sus piezas, sin pliegue.
- **La recarga SIEMPRE arranca desde el inicio.** `history.scrollRestoration =
  "manual"` + `startAtTop()` en `load` y `pageshow`. Un link profundo (`#contacto`)
  se respeta al entrar por primera vez, pero **al recargar se limpia el hash**
  y se salta al tope — antes el navegador restauraba a medias el scroll y la
  recarga se veía rara.
- **Textos vigentes de 04 y 05**: h2 de 04 **"El sistema que devuelve
  resultados"**; Post **"Edición, etalonaje, VFX, animación 2D/3D y mograph son
  la materia prima."**; Vertical **"La ola de contenido nunca frena. Paquetes
  9:16 para Reels, TikTok y Shorts."**; Contacto **"Contame tu proyecto — de tu
  idea pasamos al brief, y mi sistema devuelve RESULTADOS."**. El párrafo de
  Contacto lleva `margin:36px auto` → **36px de aire arriba y abajo** (el
  margen inferior del neón colapsa con el superior del párrafo: por eso 36 y
  no 30). Si se toca algún margen de esa zona, hay que volver a medir los dos
  huecos, no uno solo.
- **El h1 del hero es un CARTEL DE NEÓN 3D**, mismo lenguaje que el de Galería
  3D (placa, tornillos, `rotateX`, tubo con núcleo blanco + halo). Texto:
  **"activá el BLOQQ. de minúsculas, A MAYÚSCULAS."** — las **minúsculas en gris**
  (`.hn-low`, `var(--mut)`, sin glow) y las **mayúsculas en tubo**: `BLOQQ.`
  **ámbar**, `A MAYÚSCULAS.` **ácido**. Titila solo a la vista (`.lit` por IO) y
  solo opacidad; se apaga con `prefers-reduced-motion`. **No es un botón.**
  El ancho de la placa es `min(880px, 100%)` — **nunca en `vw`**: el contenedor
  tiene padding y una placa en vw se desborda y queda descentrada en celu.
  `.hn-tube`/`.hn-low` llevan `white-space:nowrap`, así en mobile cada bloque
  baja entero y el cartel queda en 3 renglones.
- **Todo el header va CENTRADO** (cartel, párrafo y "Ver showreel"), **menos
  "REC · FRANCISCO BENÍTEZ · CABA", que queda SIEMPRE a la izquierda.**
- **Interfaz de cámara grabando** (decorativa, `aria-hidden`): cuatro escuadras
  ámbar finas (`.cam-c`, 1px al 34%) más dos hairlines ámbar — una detrás del
  REC y otra sobre el timecode. El marco arranca **debajo del nav** (`top:84px`,
  74px en celu) para no pelearse con el logo. **El timecode "4K · 24 FPS / TC"
  ahora se ve también en mobile** (antes se ocultaba bajo 640px). Sin glow y sin
  loops JS: el único movimiento es el LED rojo del REC y el contador `#tc`.
- **CHEESY FUCK (`s0pRkDDI57Y`) está FUERA del sitio**: YouTube lo marcó como
  contenido +18 y rompe la visualización. No volver a agregarlo. El catálogo
  son **26 videoclips** y la galería **35 piezas únicas**.
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
  **Nunca dos piezas de la misma serie pegadas en el anillo** (`arrangeWheel`
  + `wheelCollisions`): los 4 HDP Ando Baires no pueden quedar juntos. Se
  sortea el orden y se valida la vecindad **incluyendo el cierre del anillo**;
  con 4 HDP sobre 8 la solución es alternarlos, y el orden cambia en cada
  visita. La serie sale de `group` (o del título si no tiene).
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
- **Todas las pistas / instrucciones de texto están APAGADAS** por el
  interruptor **`const TIPS_ON = false`**: "Deslizá" del hero, "click en una
  preview = ver con sonido" de la rueda, "(Clickeá una)" del Toolbox y las
  notas del modal. Cada una lleva la clase **`.tip`** y sigue en el DOM; el
  `<body>` arranca con `no-tips` para que no haya parpadeo. Para prender todas,
  `TIPS_ON = true`; para prender solo una, quitarle la clase `.tip`.
  **La Galería 3D ya no tiene ninguna línea de instrucción.**
- **El hero tiene un solo botón: "Ver showreel".** El "Ver videoclips" se
  eliminó por pedido.
- **Footer: `.foot-ind` con LED rojo titilante + "INDUSTRIA ARGENTINA".**
- **Toolbox (textos e íconos vigentes)**: *Dirección creativa* (claqueta) ·
  *Post, Color & VFX* (línea de tiempo con playhead; etiquetas `Edición ·
  Color · VFX · Mograph · 2D · 3D`) · *Lo viejo funciona, Juan* ("Team
  horizontal for ever: narrativa y formato largo."; `16:9 · BLOGS · PÓDCASTS ·
  YOUTUBE`) · *Estrategia Vertical* (celular con la silueta rellena de un
  rapero con micrófono). Los rellenos usan la clase **`.solid`**
  (`fill: var(--acc)`), no `currentColor` — que resolvería al hueso del texto.
  El ícono de "Lo viejo" es la **Torino**: `assets/torino.png` (fondo removido,
  recortada, 520px) aplicada como **máscara CSS** con `background: var(--acc)`,
  así toma el ámbar exacto de la marca y acompaña el hover como los demás.
  El de Estrategia Vertical son **3 celulares** (pantallas solas, sin silueta)
  **más 2 sparkles filled a la izquierda**, uno más chico que el otro. Los
  rectángulos llevan `stroke-width: 1.15` y separación real: con el trazo
  estándar de 1.5 las tres pantallas se fundían en una mancha al tamaño del
  ícono. **Las etiquetas rojas (`.serv-line`) se eliminaron**: en las tarjetas
  quedan solo el título y el subtítulo.
- **La Galería 3D es función oficial del sitio** (ya no es un lab temporal):
  la activa el **cartel de neón 3D titilante "GALERÍA 3D"** de la sección
  Contacto (`#ledBtn`), como overlay a pantalla completa (`#galBox` + iframe
  a `lab/vortex/`, que se descarga al cerrar). El neón titila solo cuando está
  a la vista (IntersectionObserver) y anima únicamente opacidad → sin costo
  de rendimiento; se apaga con `prefers-reduced-motion`.
  **La ✕ que cierra la galería va CENTRADA arriba** (`#galX`, 52px, anillo
  ámbar): es la única salida hacia el sitio, tiene que verse. En celu el
  sufijo "· GALERÍA 3D" del header de la galería se oculta cuando está
  embebida, para que no se le superponga. **El ⇪ con LED del centro de la
  galería (`#hub b`) se eliminó**; queda solo la marca de agua "galería 3d".
  La galería contiene **las 35 piezas únicas del sitio** (26 videoclips +
  showreel + 8 reels), una sola vez por vuelta — sin copias y sin contador.
  `N` y `D` se derivan de `UNIQUE.length`, así que agregar piezas recalcula
  todo solo. **FACTS figura una sola vez como videoclip de YouTube**; el reel
  vertical `BLOQQ MÁYUS_FACTS.mp4` es otro corte (vertical) y convive con él. Los videos nuevos que se agreguen al sitio deben sumarse también
  a `UNIQUE` en `lab/vortex/index.html`. Fondo: espacio 3D con estrellas
  sutiles. Click en una obra → mesa de luz (65% de oscuridad, vuelo al centro,
  autoplay sin controles; click en la preview = play/pausa invisible; click
  afuera = volver a la galería). El click se resuelve por **proyección
  matemática (`cardAt`)**, no por hit-testing nativo: Chrome rompe el
  hit-testing con `preserve-3d` + `perspective` (las obras se dibujan pero no
  clickean, sobre todo al moverse). `cardAt` proyecta cada obra y elige la más
  cercana bajo el pointer → funciona a cualquier profundidad.
- **Las miniaturas de YouTube se actualizan SOLAS, para siempre.** Ninguna
  preview de YouTube se sirve desde una copia congelada: se piden directo a
  `i.ytimg.com` con un **bucket diario** (`?d=YYYYMMDD`, `THUMB_DAY`), así la
  caché del navegador se renueve por día y una miniatura cambiada en YouTube
  aparece en el sitio sin tocar código ni volver a bajar archivos.
  Cadena de respaldo: sitio `maxres → sd → hq → copia local de assets/real`;
  galería `sd → hq → mq → copia local`. Además se detecta el **placeholder
  chico** que YouTube devuelve a veces en lugar de un 404 (`naturalWidth ≤ 120`)
  y se baja al siguiente escalón. `armThumb()` corta la cadena al llegar al
  respaldo local: nunca reintenta en bucle. Las copias de `assets/real/` siguen
  en el repo **solo como seguro** para offline / `file://` / caída del CDN —
  están verificadas con un test que bloquea `i.ytimg.com` y exige que las 8
  previews del pliegue se vean igual. Todas llevan `referrerpolicy="no-referrer"`.
  **Regla para el futuro: no volver a hardcodear una miniatura local como
  fuente principal.**
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
