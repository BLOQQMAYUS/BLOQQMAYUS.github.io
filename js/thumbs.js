/* thumbs.js — Miniaturas de YouTube auto-actualizables (bucket diario ?d=) con respaldo local. */
/* ---- MINIATURAS DE YOUTUBE: AUTO-ACTUALIZABLES ---------------------------
   REGLA PERMANENTE: las previews de YouTube NUNCA se congelan. Se piden
   directo a i.ytimg.com con un "bucket" diario (?d=YYYYMMDD): la caché del
   navegador se renueva sola cada día, así que si cambiás una miniatura en
   YouTube el sitio la toma sin tocar código ni volver a bajar archivos.
   Cadena de respaldo: maxres → sd → hq → copia local de assets/real.
   La copia local es un seguro para offline / file://, nunca la fuente
   principal: por eso el sitio no vuelve a quedar viejo aunque no se toque. */
const THUMB_DAY = new Date().toISOString().slice(0, 10).replace(/-/g, "");
const YT_THUMB_Q = ["maxresdefault", "sddefault", "hqdefault"];
function ytThumb(id, q) {
  return "https://i.ytimg.com/vi/" + id + "/" + (q || YT_THUMB_Q[0]) + ".jpg?d=" + THUMB_DAY;
}
function ytIdOf(url) {
  const m = String(url || "").match(/(?:watch\?v=|youtu\.be\/|shorts\/)([\w-]{6,})/);
  return m ? m[1] : null;
}
/* engancha la cadena de respaldo a una <img> ya insertada */
function armThumb(img) {
  const id = img.dataset.yt, local = img.dataset.local;
  if (!id) return;
  let k = 0, settled = false;
  const next = () => {
    if (settled) return;
    if (k < YT_THUMB_Q.length - 1) { img.src = ytThumb(id, YT_THUMB_Q[++k]); return; }
    settled = true;
    if (local) img.src = local;          // último recurso: copia local
  };
  img.addEventListener("error", next);
  /* YouTube a veces contesta un placeholder chico en vez de un 404 */
  img.addEventListener("load", () => { if (img.naturalWidth > 0 && img.naturalWidth <= 120) next(); });
}
