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
tag = (f'<video src="{new}" poster="{poster}" autoplay muted loop playsinline></video>'
       if video else f'<img src="{new}" alt="{alt}">')
partes = re.split(r'(<!--.*?-->)', inner, flags=re.S)
hecho = False
for i, parte in enumerate(partes):
    if parte.startswith("<!--"): continue          # las instrucciones se conservan
    if re.search(r'<(img|video)\b', parte):
        partes[i] = re.sub(r'<(img|video)\b[^>]*>', lambda _: tag, parte, count=1)
        hecho = True; break
assert hecho, "no se encontró el medio activo del header"
s = s[:m.start(2)] + "".join(partes) + s[m.end(2):]
url = "https://bloqqmayus.github.io/" + preview
s = re.sub(r'(property="og:image" content=")[^"]*(")', lambda x: x.group(1)+url+x.group(2), s)
s = re.sub(r'(name="twitter:image" content=")[^"]*(")', lambda x: x.group(1)+url+x.group(2), s)
open("index.html", "w", encoding="utf-8").write(s)
print("✓ header  →", new, "(video)" if video else "(imagen)")
print("✓ preview →", url)
PY
echo "· acordate: ./tests/smoke.sh (desde la raíz) y después ./deploy.sh <TOKEN> \"mensaje\""
