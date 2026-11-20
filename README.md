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
  El pliegue muestra las primeras **8** del orden mezclado (`FOLD = 8`).
  El botón **"¿Más? Galería ↓"** ya NO despliega la grilla:
  lleva a **05 · Contacto** y dispara la clase `.attn` del cartel de neón
  (una pasada de 2.4 s, transform+opacity, se limpia en `animationend`)
  para que el usuario entre solo a la Galería 3D, donde están todas las piezas.
  Al filtrar por artista se muestran todas sus piezas, sin pliegue.
- **02 · 3D: CHECHA Rifa siempre primera; el resto, aleatorio en cada carga.**
  **03 · Videoclips verticales: siempre aleatorio.** Los reels nuevos que se
  agreguen a `assets/reels/` entran a la mezcla automáticamente.
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
- Las mesas de luz del Toolbox son "mesas de ideas" por rama, con placeholders
  punteados reservando lugar para imágenes futuras en formatos variados.
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
