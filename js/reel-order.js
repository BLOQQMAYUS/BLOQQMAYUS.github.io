/* reel-order.js — Seguridad de nombres de reel + orden de la rueda (CHECHA al frente, series separadas). */
/* ---- Seguridad: los nombres de reel vienen de la API de GitHub (dato externo).
   Se aceptan SOLO nombres de archivo .mp4 simples: sin rutas ni traversal y sin
   caracteres con significado en HTML. Así nada externo puede inyectar markup
   ni escapar de un atributo, y las rutas ya viajan con encodeURIComponent. ---- */
const REEL_OK = n => typeof n === "string" && n.length <= 120 &&
  /\.mp4$/i.test(n) && !/[<>"'`\\/]|\.\./.test(n);

/* REGLA PERMANENTE de la rueda: CHECHA Rifa anclada al frente, el resto
   aleatorio en cada carga y NUNCA dos piezas de la misma serie pegadas en el
   anillo (los 4 HDP Ando Baires no pueden quedar juntos). Se sortea el orden
   y se valida la vecindad incluyendo el cierre del anillo; si tras muchos
   intentos no hay orden perfecto, se usa el de menos choques. */
function wheelSeries(it) {
  return String(it.group || it.title || "").toUpperCase().replace(/\s*·\s*\d+$/, "").trim();
}
function wheelCollisions(a) {
  let n = 0;
  for (let k = 0; k < a.length; k++)
    if (wheelSeries(a[k]) === wheelSeries(a[(k + 1) % a.length])) n++;
  return n;
}
function arrangeWheel(items) {
  const esChecha = i => /CHECHA/i.test(i.group || "");
  const front = items.filter(esChecha), rest = items.filter(i => !esChecha(i));
  let best = null, bestBad = Infinity;
  for (let t = 0; t < 400; t++) {
    const cand = [...front, ...shuffle(rest.slice())];
    const bad = wheelCollisions(cand);
    if (!bad) return cand;
    if (bad < bestBad) { bestBad = bad; best = cand; }
  }
  return best || items;
}
async function loadReels() {  let names = FALLBACK_REELS;
  try {
    const cached = JSON.parse(sessionStorage.getItem("reels-manifest") || "null");
    const cachedOk = cached && Array.isArray(cached.names) ? cached.names.filter(REEL_OK) : [];
    if (cached && Date.now() - cached.t < 600000 && cachedOk.length) names = cachedOk;
    else {
      const r = await fetch(REEL_API, { headers: { Accept: "application/vnd.github+json" } });
      if (r.ok) {
        const mp4 = (await r.json()).filter(x => x && REEL_OK(x.name)).map(x => x.name);
        if (mp4.length) { names = mp4; sessionStorage.setItem("reels-manifest", JSON.stringify({ t: Date.now(), names: mp4 })); }
      }
    }
  } catch (e) { /* offline, file:// o rate-limit → fallback */ }
  const items = names.map(n => ({
    src: "assets/reels/" + encodeURIComponent(n),
    lo: "assets/reels-lo/" + encodeURIComponent(n),
    xs: "assets/reels-xs/" + encodeURIComponent(n),
    poster: "assets/posters/" + encodeURIComponent(n.replace(/\.mp4$/i, ".jpg")),
    title: reelTitle(n),
    group: is3D(n) ? (/CHECHA/i.test(n) ? "CHECHA RIFA" : "HDP ANDO BAIRES") : ""
  }));
  buildWheel(arrangeWheel(items));
}
