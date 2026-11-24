/* core.js — Utilidades (esc, shuffle), interruptor TIPS_ON, "la recarga siempre arranca arriba" y fade-in de imágenes. */
/* escapa texto/atributos antes de armarlo como HTML (todo template pasa por acá) */
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
/* ---- PISTAS / INSTRUCCIONES ----------------------------------------------
   Todas apagadas por pedido: "Deslizá" del hero, "click en una preview = ver
   con sonido" de la rueda, "(Clickeá una)" del Toolbox y las notas del modal.
   Nada se borra: cada una lleva la clase .tip y vive en el DOM. Para volver a
   mostrarlas, poner TIPS_ON en true (o prender solo alguna quitándole .tip).
   La Galería 3D ya no tiene ninguna línea de instrucción. */
/* ---- LA RECARGA SIEMPRE ARRANCA DESDE EL INICIO --------------------------
   El navegador restaura a medias el scroll anterior (y con un #hash vuelve a
   saltar), así que la recarga se veía rara. scrollRestoration manual + salto
   al tope en load/pageshow. Un link profundo (#contacto) se respeta al entrar
   por primera vez; al RECARGAR se limpia el hash y se arranca arriba. */
const NAV_TYPE = (performance.getEntriesByType &&
  (performance.getEntriesByType("navigation")[0] || {}).type) || "";
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
function startAtTop() {
  if (location.hash && NAV_TYPE !== "reload") return;
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  window.scrollTo(0, 0);
}
startAtTop();
addEventListener("load", startAtTop);
addEventListener("pageshow", e => { if (e.persisted) startAtTop(); });

const TIPS_ON = false;
document.body.classList.toggle("no-tips", !TIPS_ON);

const pad2 = n => String(n).padStart(2, "0");
/* mezcla Fisher–Yates — regla permanente de orden aleatorio en todo el sitio */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---- fade-in de imágenes al cargar (fase de captura: 'load' no burbujea) ---- */
document.addEventListener("load", e => {
  if (e.target && e.target.tagName === "IMG") e.target.classList.add("ld");
}, true);
