# 🎬 Tu portfolio — Filmmaking & Contenido Vertical

Sitio de una sola página, oscuro y cinematográfico. Flujo del visitante:
**entra → mira el laburo → pasa al contacto.** Cinco secciones:
01 Trabajo (videoclips 16:9) · 02 3D (reels 9:16) · 03 Videoclips verticales ·
04 Toolbox (mesas de ideas) · 05 Contacto.

## 📌 Reglas vigentes (aplican a todo cambio futuro)

- **01 · Trabajo seleccionado: orden SIEMPRE aleatorio.** La grilla se mezcla
  en cada carga (Fisher–Yates sobre `workOrder`). Al agregar links/videos
  nuevos, entran al pool y se mezclan con el resto — sin prioridad por fecha.
  `CONFIG.films` se mantiene en orden cronológico solo como archivo de datos.
  El pliegue "Ver los N trabajos" muestra las primeras 12 del orden mezclado.
- **Toda preview respeta la relación de aspecto original del archivo**
  (16:9, 9:16, 1:1, 4:5…): nunca se fuerza un crop uniforme.
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

