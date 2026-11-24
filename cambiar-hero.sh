#!/usr/bin/env bash
# ================================================================
# cambiar-hero.sh — cambia el medio del header EN UN PASO
#
#   ./cambiar-hero.sh assets/hero/anterior.jpg    → volver a la imagen anterior
#   ./cambiar-hero.sh assets/hero/nueva.jpg       → imagen nueva
#   ./cambiar-hero.sh assets/hero/clip.mp4        → video (loop, mudo, con poster)
#   ./cambiar-hero.sh assets/hero/nueva.jpg "texto alternativo"
#
# Actualiza las TRES cosas juntas, que es la regla del sitio:
#   1) el medio del header   2) og:image   3) twitter:image
# (2 y 3 son la vista previa que se ve al mandar el link por WhatsApp/redes).
# El zoom suave en loop lo pone la CSS: no hace falta tocar nada más.
# Después: ./tests/smoke.sh desde la raíz y ./deploy.sh <TOKEN> "mensaje".
# ================================================================
set -euo pipefail
cd "$(dirname "$0")"
NEW="${1:-}"; ALT="${2:-}"
[ -n "$NEW" ] || { echo "uso: ./cambiar-hero.sh assets/hero/ARCHIVO [alt]"; exit 1; }
[ -f "$NEW" ] || { echo "✗ no existe el archivo: $NEW"; exit 1; }
python3 - "$NEW" "$ALT" <<'PY'
import re, sys, os
new, alt = sys.argv[1], sys.argv[2]
video = new.lower().endswith((".mp4", ".webm", ".mov"))
ALTS = {
 "anterior.jpg": "Francisco Benítez mirando a cámara a través de sus dedos",
 "bloqq-bg.jpg": "Personaje animado cruzando una avenida de Buenos Aires frente al Obelisco, entre cines y teatros",
}
alt = alt or ALTS.get(os.path.basename(new), "Imagen de portada de BLOQQ MÁYUS")
# Cada medio tiene su encuadre: la foto anterior y la ilustración no se
# recortan igual. Volver a un medio conocido restaura también su encuadre.
FRAMES = {
 "anterior.jpg": ("72% 28%", "62% 20%"),
 "bloqq-bg.jpg": ("62% 42%", "93% 40%"),
}
s = open("index.html", encoding="utf-8").read()
m = re.search(r'(<div class="hero-img">)(.*?)(</div>)', s, re.S)
assert m, "no se encontró el bloque .hero-img"
inner = m.group(2)
# el poster del video sale de la imagen que esté puesta ahora (o la de redes)
poster = None
pm = re.search(r'<img[^>]*src="([^"]+)"', re.sub(r'<!--.*?-->', '', inner, flags=re.S))
if pm: poster = pm.group(1)
if not poster:
    om = re.search(r'property="og:image" content="https://bloqqmayus\.github\.io/([^"]+)"', s)
    poster = om.group(1) if om else "assets/hero/bloqq-bg.jpg"
preview = poster if video else new
# F5: para una imagen se generan (si hay Pillow) su AVIF/WebP al lado y la tarjeta de redes 1200×630;
# el <img> lleva medidas fijas y prioridad alta (es lo primero que se ve).
stem = os.path.splitext(new)[0]
dims = ""
try:
    from PIL import Image
    if not video:
        im = Image.open(new).convert("RGB")
        dims = ' width="%d" height="%d"' % im.size
        if not os.path.exists(stem + ".webp"): im.save(stem + ".webp", "WEBP", quality=80, method=6)
        if not os.path.exists(stem + ".avif"):
            try: im.save(stem + ".avif", "AVIF", quality=60, speed=4)
            except Exception: pass                      # Pillow sin AVIF: queda WebP + JPG
    # tarjeta de redes: recorte 1,91:1 del medio siguiendo el encuadre de compu, a 1200×630
    src = Image.open(poster if video else new).convert("RGB")
    fx = float(FRAMES.get(os.path.basename(new), ("50% 50%",))[0].split()[0].rstrip("%")) / 100
    W, H = src.size
    cw, ch = (W, round(W / 1.905)) if W / H < 1.905 else (round(H * 1.905), H)
    x, y = round((W - cw) * fx), round((H - ch) * 0.3)
    og = os.path.join(os.path.dirname(new), "og-" + os.path.basename(stem) + ".jpg").replace("\\", "/")
    src.crop((x, y, x + cw, y + ch)).resize((1200, 630), Image.LANCZOS).save(og, "JPEG", quality=86, optimize=True, progressive=True)
    preview = og
except ImportError:
    print("· sin Pillow: no se generan AVIF/WebP ni la tarjeta 1200×630 (pip install pillow)")
img = f'<img src="{new}"{dims} alt="{alt}" fetchpriority="high" decoding="async">'
srcs = "".join(f'<source srcset="{stem}.{e}" type="image/{e}">' for e in ("avif", "webp") if os.path.exists(f"{stem}.{e}"))
if not video and srcs: img = f"<picture>{srcs}{img}</picture>"
tag = f'<video src="{new}" poster="{poster}" autoplay muted loop playsinline></video>' if video else img
partes = re.split(r'(<!--.*?-->)', inner, flags=re.S)
hecho = False
for i, parte in enumerate(partes):
    if parte.startswith("<!--"): continue          # las instrucciones se conservan
    if re.search(r'<(picture|img|video)\b', parte):
        partes[i] = re.sub(r'<picture\b.*?</picture>|<(?:img|video)\b[^>]*>(?:</video>)?', lambda _: tag, parte, count=1, flags=re.S)
        hecho = True; break
assert hecho, "no se encontró el medio activo del header"
s = s[:m.start(2)] + "".join(partes) + s[m.end(2):]
url = "https://bloqqmayus.github.io/" + preview
s = re.sub(r'(property="og:image" content=")[^"]*(")', lambda x: x.group(1)+url+x.group(2), s)
s = re.sub(r'(name="twitter:image" content=")[^"]*(")', lambda x: x.group(1)+url+x.group(2), s)
base, mob = FRAMES.get(os.path.basename(new), (None, None))
if base:
    s = re.sub(r'(\.hero-img img,\.hero-img video\{width:100%;height:100%;object-fit:cover;object-position:)[^;]+;',
               lambda m: m.group(1) + base + ";", s, count=1)
    s = re.sub(r'(@media\(max-width:760px\)\{\.hero-img img,\.hero-img video\{object-position:)[^}]+\}\}',
               lambda m: m.group(1) + mob + "}}", s, count=1)
    s = re.sub(r'(\n    \.hero-img img,\.hero-img video\{object-position:)[^}]+\}',
               lambda m: m.group(1) + mob + "}", s, count=1)
open("index.html", "w", encoding="utf-8", newline="\n").write(s)   # LF también en Windows
print("✓ header  →", new, "(video)" if video else "(imagen)")
if base: print("✓ encuadre →", base, "desktop /", mob, "celu")
else: print("· encuadre sin tocar (medio nuevo): revisá object-position si hace falta")
print("✓ preview →", url)
PY
echo "· acordate: ./tests/smoke.sh (desde la raíz) y después ./deploy.sh <TOKEN> \"mensaje\""
