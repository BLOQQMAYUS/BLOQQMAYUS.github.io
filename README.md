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
  El pliegue muestra **6** en computadora y **5 en celular** (`FOLD = 6`,
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
  El botón **"¿Querés más? ↓"** ya NO despliega la grilla:
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
- **Textos vigentes de 04 y 05**: h2 de 04 **"Mi sistema,
  (salto de línea) tus resultados."** (con punto final); Post **"Edición, etalonaje, VFX, animación 2D/3D y mograph son
  la materia prima."**; Vertical **"La ola de contenido nunca frena. Paquetes
  4:5 y 9:16 para Reels, TikTok y Shorts."**; Contacto **"Contame tu proyecto — de tu
  idea pasamos al brief, y mi sistema devuelve RESULTADOS."**. El párrafo de
  Contacto lleva `margin:36px auto` → **36px de aire arriba y abajo** (el
  margen inferior del neón colapsa con el superior del párrafo: por eso 36 y
  no 30). Si se toca algún margen de esa zona, hay que volver a medir los dos
  huecos, no uno solo.
- **El h1 del hero es un CARTEL DE NEÓN 3D**, mismo lenguaje que el de Galería
  3D (placa, 2 tornillos abajo (los de arriba se quitaron: chocaban con la luz verde), `rotateX`, tubo con núcleo blanco + halo). Texto:
  **"activá el BLOQQ MÁYUS de minúsculas a MAYÚSCULAS"** (texto exacto: **sin
  coma y sin ningún punto** — ni después de MÁYUS ni al final; la "a" va en
  minúsculas) — las **minúsculas
  también son tubo**: núcleo gris + halo gris (`.hn-low`) y **son LAS QUE
  TITILAN** (`hnBlink`, cortes secos a apagado, dos duraciones desfasadas por
  renglón). Las **mayúsculas NO titilan**: `BLOQQ MÁYUS` **ámbar** y
  `MAYÚSCULAS` **ácido**, siempre prendidas y sin animación. Las únicas
  palabras en mayúscula son esas dos. Titila solo a la vista (`.lit` por IO),
  solo opacidad, y se apaga con `prefers-reduced-motion`. **No es un botón.**
  **Detalles del cartel**: una **luz LED ácida** tras "MÁYUS" (`.hn-amber::after`, mismo parpadeo `blink` que el LED de la flecha de Galería 3D) y un **cursor de tipeo neón ácido** tras "MAYÚSCULAS" (`.hn-acid::after`, `caretBlink` 1.1s con `steps(1)`, núcleo blanco + halo ácido): como si esperara seguir escribiendo. Ambos son pseudo-elementos absolutos, así no mueven el centrado del texto; arrancan con `.lit` y se detienen con `prefers-reduced-motion`.
  La placa es **`width:fit-content` + `max-width:100%`** con **padding horizontal
  amplio (46px, 24px en celu)**: tiene que haber aire de verdad entre las letras
  y el borde. *(Esto da vuelta el pedido anterior de "placa ajustada, sin aire":
  ahora el aire es el pedido.)* Sigue siendo fit-content, nunca un bloque de
  ancho completo. **Nunca dimensionarla en `vw`**: el contenedor tiene padding y una
  placa en vw se desborda y queda descentrada en celu.
  `.hn-tube`/`.hn-low` llevan `white-space:nowrap`, así en mobile cada bloque
  baja entero y el cartel queda en 3 renglones.
- **Todo el header va CENTRADO** (cartel, párrafo y "Showreel"), **menos
  la fila superior: "● REC" solo a la izquierda y "FRANCISCO BENÍTEZ · CABA"
  alineado a la derecha, a la misma altura y sin líneas.**
- **Interfaz de cámara grabando** (decorativa, `aria-hidden`): cuatro escuadras
  ámbar finas (`.cam-c`, 1px al 34%) más una hairline ámbar sobre el timecode
  (la del REC se quitó). El marco arranca **debajo del nav** (`top:84px`,
  74px en celu) para no pelearse con el logo. **El timecode "4K · 120 FPS / TC"
  ahora se ve también en mobile** (antes se ocultaba bajo 640px). Sin glow y sin
  loops JS: el único movimiento es el LED rojo del REC y el contador `#tc`.
- **CHEESY FUCK (`s0pRkDDI57Y`) está FUERA del sitio**: YouTube lo marcó como
  contenido +18 y rompe la visualización. No volver a agregarlo. El catálogo
  son **26 videoclips** y la galería **35 piezas únicas**.
- **Fondo del sitio = el de la Galería 3D**: hollín `#1A1714` plano y único.
  `.vertical`, `.servicios` y `.contact` pasaron a **`background:transparent`**
  (antes `--bg2`); si se agrega una sección nueva, no ponerle fondo opaco o
  tapará las estrellas. `--bg2` sigue existiendo para la scrollbar.
- **Campo de estrellas en todo el sitio** (`#starfield`, canvas fijo
  `z-index:0`, `aria-hidden`). **Arranca en la BANDA DE FUNDIDO del header**,
  no en el borde de 01: el recorte es `top(#trabajo) − banda`, con
  `banda = min(45% del alto, 420px)`, y dentro de la banda las estrellas entran
  con rampa de alpha y un piso de .45 para que se vean de verdad. La mitad de
  arriba del hero sigue limpia. *(Antes el corte era exacto en 01 y el fundido
  del header quedaba sin estrellas: se notaba el corte de la imagen.)* Velocidad = **60% de la de la
  galería** (`AUTO 80 × 0.6`, pedido: 40% más lento). Presupuesto de rendimiento
  (importante, ya costó un test entero): **30 fps** con throttle, **dpr acotado
  a 1.5**, **190–340 puntos** según área (subió desde 110: con menos, la banda
  del header quedaba casi vacía porque la proyección amontona las estrellas
  cerca del punto de fuga; además el nacimiento se sesga un poco hacia cerca,
  `z = NEAR + (FAR−NEAR)·random^1.35`, para que se repartan por la pantalla),
  **ni un frame** cuando ni el fundido está en pantalla, cuando la pestaña está
  oculta o **cuando hay una capa abierta**
  (`body.style.overflow === "hidden"` → la galería ya tiene sus estrellas).
  El corte es por REGIÓN, no por sección: observar solo `#trabajo` con IO haría
  que las estrellas se paren al llegar a Servicios.
  **La galería lleva 620 estrellas**, a la misma velocidad de siempre.
- **Sin chip "Todos" en 01**: solo nombres de artista, en orden aleatorio. El
  estado por defecto sigue siendo el pliegue mezclado, y **volver a tocar el
  artista activo lo deselecciona** y devuelve al pliegue (si no, no habría forma
  de volver). `workCat` sigue usando `"Todos"` internamente como estado.
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
- **El hero tiene un solo botón: "Showreel".** El "Ver videoclips" se
  eliminó por pedido.
- **Footer: `.foot-ind` con LED rojo titilante + "INDUSTRIA ARGENTINA".**
- **Toolbox (textos e íconos vigentes)**: *Dirección creativa* (claqueta) ·
  *Post, Color & VFX* (línea de tiempo con playhead; etiquetas `Edición ·
  Color · VFX · Mograph · 2D · 3D`) · *Lo viejo funciona, Juan* ("Team
  horizontal for ever: narrativa y formato largo."; `16:9 · BLOGS · PÓDCASTS ·
  YOUTUBE`) · *Estrategia Vertical* (celular con la silueta rellena de un
  rapero con micrófono). Los rellenos usan la clase **`.solid`**
  (`fill: var(--acc)`), no `currentColor` — que resolvería al hueso del texto.
  El ícono de "Lo viejo" es la **Torino**: el lineart original **calcado y simplificado** como SVG inline (`svg.car`, viewBox 520×268, relleno `var(--acc)`), sin la reja, el segundo parante de paragolpes, las costuras del capó, el limpiaparabrisas ni el tirador, para que se lea a 66px. Ya no existe `assets/torino.png`. El de Estrategia Vertical son **3 celulares**: uno principal al frente y dos levemente inclinados (±13°) detrás, recortados con una `<mask>` SVG para que no se pisen con el principal, **más 3 sparkles filled** (`.solid`, uno grande arriba a la derecha y dos chicos). **Las etiquetas rojas (`.serv-line`) se eliminaron**: en las tarjetas
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
  fuente principal.** Ojo al leer la consola: **un 404 de `i.ytimg.com` es
  normal y esperado** — no todos los videos tienen `maxresdefault` (p. ej.
  `HAxRAyv8Ll8`), y ese 404 es justamente lo que dispara el respaldo. El tour
  ignora esos 404 y en cambio exige que ninguna preview quede rota; cualquier
  otro 404 sí es un defecto.
  **La galería lleva el mismo favicon inline que el sitio**: sin él, el iframe
  pedía `/lab/vortex/favicon.ico` y ensuciaba la consola con un 404.
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

> ⚠️ **`./deploy.sh sync` pisa lo local con lo publicado.** Va **antes** de
> editar, nunca después: si ya editaste, el paso siguiente es publicar
> (`./deploy.sh <TOKEN> "mensaje"`). Correr sync con trabajo sin publicar lo
> borra — pasó una vez y hubo que rehacer la ronda entera.

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
- `tour.js` — **175 checks** en navegador real (texto vigente, pliegue 8/5,
  botón que lleva a Contacto y hace que el neón pida el click, márgenes
  clickeables de todas las previews, scroll horizontal, nav centrado y sin
  hamburguesa, tap del logo, precarga de la galería, galería con 620 estrellas
  y 3 cometas y sin textos sueltos).
  Las esperas van por **estado** (`rlPhase`, centrado del rect), no por reloj:
  en móviles emulados la transición visual tarda más que el timer.
- `starflow.js` — **dirección del campo de estrellas**: sigue estrellas
  individuales entre dos frames y exige que se alejen del centro (atrás →
  adelante). Va **separado del tour a propósito**: el `getImageData` del canvas
  fuerza readback y en render por software deja al renderer tan lento que el
  paseo se colgaba. El radio medio de TODOS los píxeles no sirve como criterio
  (las que salen del cuadro renacen lejos, cerca del centro, y arrastran el
  promedio hacia abajo): hay que seguir estrellas de una a otra.

### Medio del header y vista previa para compartir (REGLA PERMANENTE)

- **Cada vez que se cambia la imagen/video del header, se cambia también la
  imagen de la vista previa del link** (`og:image` y `twitter:image` del
  `<head>`): es la miniatura que se ve al mandar el sitio por **WhatsApp**,
  Telegram, LinkedIn, X, etc. Si no, se comparte una portada vieja.
  **Lo hace cumplir un test**: `tests/hero-sync.py` corre dentro de
  `./tests/smoke.sh` y falla si el medio del header y los dos metas no apuntan
  al mismo archivo (o si el archivo no existe).
- **Cambiarlo es un comando**: `cd portfolio && ./cambiar-hero.sh <archivo> [alt]`
  actualiza el medio **y** los dos metas juntos.
  - volver a la imagen anterior: `./cambiar-hero.sh assets/hero/anterior.jpg`
  - imagen nueva: copiá el archivo a `assets/hero/` y pasáselo al script
  - video: `./cambiar-hero.sh assets/hero/clip.mp4` → pone `<video autoplay muted
    loop playsinline>` con **poster** (el poster es lo que se comparte: WhatsApp
    no hace preview de video).
- Los medios viven en **`assets/hero/`**: `bloqq-bg.jpg` (el actual, ilustración
  del personaje cruzando la avenida con el Obelisco) y `anterior.jpg` (la foto
  anterior, guardada para volver en un segundo).
- **El zoom suave en loop lo pone la CSS** (`.hero-img img,.hero-img video` +
  `@keyframes slowzoom`, 24 s alternate, `will-change:transform` para que corra
  en el compositor), **no el archivo**: cambiar el medio no toca la animación.
- Encuadre: `object-position:62% 42%` en desktop y **93% 40%** en celu (≤760px y
  ≤640px) para que en el angosto se vea el personaje y no pura calle.
  ⚠️ hay **dos** reglas de `object-position` para el hero: la de ≤640px pisa a
  la de ≤760px, así que hay que cambiar las dos.
- **El fundido con el fondo es una MÁSCARA, no un degradado opaco encima.**
  `.hero-img` lleva `mask-image` (y `-webkit-`) que se va a transparente abajo;
  la máscara afecta también al `::after`, así que imagen y scrim se desvanecen
  juntos y **dejan ver el fondo del sitio con sus estrellas**. Antes el
  degradado terminaba en `rgba(...,.95)` y se veía el corte del borde inferior.

## 🔄 Cómo actualizar el contenido (v1.0)

Desde la v1.0 (tag `v1.0`) el diseño está cerrado: **solo se agregan o quitan
videos**. No se toca CSS/JS salvo pedido explícito.

### Videoclips (sección 1)
Todo está en `CONFIG.films` de `index.html` (más nuevos primero).

1. **Agregar**: sumar una línea al principio de `films` con este formato:
   `{ title: "…", cat: "ARTISTA", artist: "…", year: "2026", role: "Videoclip oficial", img: "assets/real/<ID>.jpg", video: "https://www.youtube.com/watch?v=<ID>" }`
   (`lineup` es opcional). `cat` es el chip de filtro: usar el mismo texto que
   ya existe para ese artista.
2. **Miniatura**: guardar la imagen como `assets/real/<ID>.jpg` (el `<ID>` es
   el de YouTube) y sumar su entrada a `videos.json` (`id`, `group`, `title`,
   `author`, `thumb`, `thumb_kb`, `date`).
3. **Quitar**: borrar la línea de `films` y su entrada en `videos.json`
   (opcional: borrar el `.jpg` de `assets/real/`).
4. El pliegue (6 en desktop / 5 en mobile, "¿Querés más? ↓"), el orden
   aleatorio y las reglas de las "Reglas vigentes" se aplican solos.

### Videos verticales (sección 2)
- **Agregar**: copiar el `.mp4` a `assets/reels/` — se auto-descubre vía la API
  de GitHub. Sumar también su nombre exacto a `FALLBACK_REELS` (por si la API
  falla) y generar sus variantes livianas en `assets/reels-lo/`,
  `assets/reels-xs/` y el poster en `assets/posters/`, igual que los existentes.
- **Quitar**: borrar el `.mp4` (y sus variantes/poster) y su nombre de `FALLBACK_REELS`.

### Publicar
1. Verlo en local (`python -m http.server 8000`) y correr los checks de la sección «Checks antes de cada push» (si `tests/` existe en el clon).
2. Commit → `git push origin main` y `git push origin main:bloqqfolio`.
3. Verificar online (Pages tarda ~1–2 min) que aparezca el cambio.

### Contenido vertical

- **Las previews de la rueda NO llevan etiquetas**: se sacó el `.reel-tag` con
  el nombre del artista (y su CSS). Quedan solo el poster y el play de
  placeholder; el título sigue en el `aria-label` para lectores de pantalla.

### Navegación, logo y fondo (vigente)

- **Los links del nav están centrados en el viewport y SIEMPRE visibles**,
  también en celular: `.nav-links` va `position:absolute; left:50%;
  transform:translateX(-50%)` dentro de `.nav-in` (que es `position:relative`
  y de ancho completo). **No hay hamburguesa ni menú desplegable** — se
  eliminaron `.burger` y sus dos listeners. En ≤880px y ≤430px solo se
  achican tipografía, gaps y paddings para que entren los cuatro.
- **El logo ⇪ va al extremo izquierdo** con aire (`.nav-in` sin `max-width`,
  padding 28px en desktop / 16 / 12). En celular queda igual de izquierda.
- **Tap del logo: la tecla outlined se RELLENA de ámbar y crece 25%.**
  `.key.tap` + transición `.26s cubic-bezier(.4,0,.2,1)` (easy ease).
  **Se suelta cuando el navegador ya lo pintó, no cuando lo dice el reloj:**
  un `requestAnimationFrame` vigila el `background-color` computado y recién
  150 ms después de verlo lleno quita la clase (con techo de 2.5 s).
  Motivo: si el equipo está ocupado (galería precargando, celular modesto)
  los frames vienen muy espaciados y una animación por tiempo **se saltea
  entera sin verse nunca**. Pasó en los tests: el `document.timeline` saltaba
  de 1785 a 3402 ms y la animación nacía y moría entre dos frames.
- **Campo de estrellas del sitio: de ATRÁS hacia ADELANTE**, no hacia abajo.
  Proyección por profundidad (`FOCAL=340, FAR=1500, NEAR=45`), `p.z -= 48·dt`
  (60% del AUTO de la galería = 40% más lento), pantalla `W/2 + p.x·k` con
  `k = FOCAL/p.z`; crecen y se abren desde el centro, se apagan al pasar
  (`z < NEAR·3`) y renacen en FAR. 30 fps, dpr ≤1.5, 110–210 puntos, recortado
  desde el tope de `#trabajo` (sobre el hero, cero píxeles).
  **Cometas**: uno cada 7–16 s, dura 1.0–1.5 s, cola en degradado hueso → ámbar
  → transparente, alpha máx .55. En la galería son 3 `<i>` con CSS puro
  (`#comets`, 17/23/29 s con delays 3/11/19 s) — sin costo de frames.
  Si la región entra en pantalla **sin** evento de scroll (resize, fuentes,
  imágenes que acomodan el layout) un `setInterval` de 600 ms la arranca igual;
  solo corre mientras el campo está frenado.

### Precarga de la galería (contrato)

- Al `load` del sitio, en `requestIdleCallback` (o `setTimeout` 1200 ms),
  `precargarGaleria()` hace `contentWindow.location.replace("lab/vortex/?preload=1")`.
  Se usa `replace` para **no ensuciar el historial conjunto**.
- La galería arma DOM y posters pero **no corre ni un frame** mientras duerme:
  `__bloqqWake()` al abrir, `__bloqqSleep()` al cerrar (cancela el rAF y cierra
  la mesa de luz). **Nunca se descarga**, así que reabrir es instantáneo.
  Si al arrancar ve `parent #galBox.open`, arranca despierta (carrera cubierta
  en los dos sentidos). Todo same-origin, **sin `postMessage`**.
- **`#galBox` cerrado va `visibility:hidden`, no solo `opacity:0`.** Con la
  galería precargada, `opacity:0` sola deja el iframe **pintándose invisible
  toda la sesión** (35 obras + 620 estrellas en un mundo 3D, a dpr 2 en celu):
  era tanto costo que el renderer se colgaba. `visibility:hidden` saltea el
  pintado sin descargar nada. El `transition:visibility 0s .45s` deja terminar
  el fundido de salida; al abrir se hace visible en el acto.
- **Las estrellas de la galería NO llevan `will-change:transform`**: son 620 y
  cada una promovida sería una capa compuesta propia viviendo toda la sesión.
  Se mueven con `#world`, que ya tiene la suya.
- **620 estrellas** (antes 416) y ahora **se ven**: el volumen es más corto que
  el del corredor (`SD = 3600`, no `D = 11900`) y el tamaño se compensa por
  perspectiva con tope 2.5×, así en pantalla miden siempre .8–2.4 px (nunca
  manchas) y las lejanas siguen siendo puntos en vez de polvo subpíxel.
  Resultado medido: **593 de 620 en cuadro**, media 1.27 px.
- **Sin textos sueltos**: se quitaron `#hub` (marca de agua), `#hud`
  (encabezado), los años `.yr` y las flechas `#navUI` ‹ ›, con sus listeners y
  26 reglas CSS muertas. Quedan **solo los captions de las previews** (título +
  artista), el campo de estrellas, los cometas y la ✕ centrada. Se navega con
  drag / rueda / pellizco y el AUTO.

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

## Movimiento (rama tipografia-cine)
- **Títulos de sección (h2)** se tipean al entrar en pantalla (IntersectionObserver, 60 %), con cursor neón ácido como el del hero. Sin efecto con `prefers-reduced-motion`. Cada h2 lleva `aria-label` con el texto completo.
- **Tarjetas de obras**: inclinación 3D + brillo que siguen al mouse, y tras 650 ms encima, loop mudo del videoclip (iframe `youtube-nocookie`, solo se muestra cuando el player reporta `playerState 1`; si no arranca en 9 s se descarta). Solo con `(hover:hover) and (pointer:fine)`, sin `saveData` ni reduced-motion; una a la vez y se limpia al salir.

## Texto del hero
Párrafo reducido (≈ 61 % del original). Una sola frase en el HTML (`#heroTail`, la larga, para buscadores/IAs); en celular (≤ 600 px) un script la cambia por la corta guardada en su atributo `data-short`.

## Escala tipográfica (variables en :root)
- `--fs-micro .68rem` (metadatos, contadores, pies, etiquetas chicas) · `--fs-label .76rem` (kicker, chips, botones mono, REC) · `--fs-lead` (párrafo de hero y descripciones de sección) · `--fs-h3 1.5rem` (títulos de tarjetas, servicios y modal) · `--ls-label .14em` (tracking de etiquetas mono; kicker/REC/índice quedan en .24em).
- Mínimo en celular: 10.2 px (antes 9 px). Solo `h1` y la flecha del cartel Galería 3D conservan `--sans` (neón); el resto del sitio usa `--body`/`--disp`/`--mono`.

## Seguridad y SEO básico (rama tipografia-cine)
- **CSP** por `<meta http-equiv>` en `index.html` y `lab/vortex/index.html` (GitHub Pages no permite headers). Necesita `'unsafe-inline'` porque el JS/CSS está inline. Si se agrega un dominio externo (imágenes, video, fuentes) hay que sumarlo a la directiva correspondiente o se bloquea.
- **`esc()`** escapa todo texto que entra por `innerHTML` (títulos, URLs de `videos.json`).
- **Embeds solo https** (`videoEmbed()` devuelve null si no) e iframes con `sandbox`.
- `rel="noopener noreferrer"` en links externos; `referrer` restringido; `postMessage` con origen explícito.
- `robots.txt`, `sitemap.xml` y `404.html` (con la estética del sitio) en la raíz.
- Chequeo final (desktop 1280, mobile 375 y 320): sin violaciones de CSP, sin scroll horizontal, reel y Galería abren/cierran con ✕, Esc y botón atrás.
