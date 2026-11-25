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
/* hash con el que se CARGÓ la página (si el visitante tocó el menú mientras cargaba,
   location.hash ya es otro y eso no se toca) */
const LOAD_HASH = (() => { try { return new URL((performance.getEntriesByType("navigation")[0] || {}).name || location.href).hash; } catch { return location.hash; } })();
let userMoved = false;   // el visitante ya scrolleó/tocó algo: no lo devolvemos arriba
["wheel", "touchmove", "keydown"].forEach(t => addEventListener(t, () => { userMoved = true; }, { passive: true, once: true }));
function startAtTop() {
  if (location.hash && (NAV_TYPE !== "reload" || location.hash !== LOAD_HASH)) return;
  if (userMoved) return;
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  window.scrollTo(0, 0);
}
startAtTop();
addEventListener("load", startAtTop);
/* ---- EL MENÚ ACIERTA AUNQUE SE TOQUE MIENTRAS CARGA ------------------------
   En un celu lento la página sigue creciendo después del salto (obras, rueda,
   tarjetas se arman con JS y empujan todo hacia abajo), así que «Contacto»
   caía en el medio de otra sección. Mientras la página se acomoda, la sección
   pedida queda clavada arriba; se suelta al terminar de cargar (+1,2 s), a los
   15 s, o apenas el visitante scrollea por su cuenta. */
const pinSection = (() => {
  let target = null, until = 0;
  const stop = () => { target = null; };
  const fix = () => {
    if (!target) return;
    if (performance.now() > until) return stop();
    const want = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
    const top = target.getBoundingClientRect().top;
    const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
    if (Math.abs(top - want) > 2 && !(atBottom && top > want)) target.scrollIntoView({ block: "start" });
  };
  if ("ResizeObserver" in window) new ResizeObserver(fix).observe(document.documentElement);
  addEventListener("load", () => { fix(); if (target) until = Math.min(until, performance.now() + 1200); });
  ["wheel", "touchmove", "keydown"].forEach(t => addEventListener(t, stop, { passive: true }));
  return id => {
    const el = id && document.getElementById(id);
    if (!el) return;
    target = el;
    until = performance.now() + (document.readyState === "complete" ? 1200 : 15000);
  };
})();
/* links internos (#…): al tocarlos, se clava su sección. Si el toque llegó antes de
   que este script corriera, el hash ya está puesto: se clava igual. */
document.addEventListener("click", e => {
  const a = e.target.closest && e.target.closest('a[href^="#"]');
  if (a && a.getAttribute("href").length > 1) pinSection(a.getAttribute("href").slice(1));
});
if (location.hash && location.hash !== LOAD_HASH) pinSection(decodeURIComponent(location.hash.slice(1)));
addEventListener("pageshow", e => { if (e.persisted) startAtTop(); });

/* ---- LOOP DEL SHOWREEL EN EL HEADER ----------------------------------------
   El video baja recién cuando la página terminó de cargar: en un celu con 4G
   lenta competía con CSS/JS y el menú tardaba en responder. Hasta entonces se
   ve el poster (mismo cuadro de arranque). Con «reducir movimiento» o ahorro
   de datos queda solo el poster. */
addEventListener("load", () => {
  const v = document.getElementById("heroVid");
  if (!v || matchMedia("(prefers-reduced-motion: reduce)").matches || (navigator.connection && navigator.connection.saveData)) return;
  v.querySelectorAll("source[data-src]").forEach(s => { s.src = s.dataset.src; });
  v.load(); const p = v.play(); if (p && p.catch) p.catch(() => {});
});

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
