/* work-grid.js — 01 · Videoclips: orden aleatorio, pliegue 6/5, reglas de mezcla y filtros. */
/* ---- grid de videoclips + filtros ---- */
/* REGLA PERMANENTE: el orden es SIEMPRE aleatorio en cada carga, pero el
   PLIEGUE (lo que se ve al entrar) cumple tres reglas:
     · nunca más de MAX_PER_CAT piezas del mismo artista;
     · siempre al menos una de MUSHER, una de TIERRAS RARAS y una de
       BLOQQ MÁYUS;
     · vale para los dos pliegues (6 en computadora, 5 en celular), así que se
       arma un prefijo que cumple en ambos tamaños y se mezcla después.
   Al filtrar por artista se muestran TODAS sus piezas, sin pliegue ni tope.
   CONFIG.films queda en orden cronológico como archivo de datos: los videos
   nuevos entran al pool y se mezclan, sin prioridad por fecha. */
const workGrid = document.getElementById("workGrid");
const FOLD = 6, FOLD_SM = 5;
const MUST_CATS = ["MUSHER", "TIERRAS RARAS", "BLOQQ MÁYUS"];
const MAX_PER_CAT = 2;
function buildWorkOrder() {
  const all = CONFIG.films.map((_, i) => i);
  const pools = {};
  all.forEach(i => (pools[CONFIG.films[i].cat] ||= []).push(i));
  Object.values(pools).forEach(a => shuffle(a));
  const used = {}, taken = new Set(), head = [];
  const room = c => (used[c] || 0) < MAX_PER_CAT && (pools[c] || []).some(i => !taken.has(i));
  const pick = c => {
    const p = pools[c];
    while (p.length) {
      const i = p.pop();
      if (taken.has(i)) continue;
      taken.add(i); used[c] = (used[c] || 0) + 1; head.push(i); return true;
    }
    return false;
  };
  /* primero los obligatorios, uno por artista, en orden sorteado */
  shuffle(MUST_CATS.slice()).forEach(c => { if (pools[c] && room(c)) pick(c); });
  /* después se completa el pliegue chico y el grande sin pasar el tope */
  const keys = Object.keys(pools);
  for (const target of [FOLD_SM, FOLD]) {
    for (let guard = 0; head.length < target && guard < 500; guard++) {
      const c = keys[Math.floor(Math.random() * keys.length)];
      if (room(c)) pick(c);
    }
  }
  /* se mezcla el frente hasta que el pliegue chico también tenga los tres */
  const covers = a => MUST_CATS.every(c => !pools[c] ||
    a.slice(0, FOLD_SM).some(i => CONFIG.films[i].cat === c));
  let front = head;
  for (let t = 0; t < 80; t++) {
    const cand = shuffle(head.slice());
    if (covers(cand)) { front = cand; break; }
  }
  return front.concat(shuffle(all.filter(i => !taken.has(i))));
}
const workOrder = buildWorkOrder();
workGrid.innerHTML = workOrder.map((fi, pos) => {
  const f = CONFIG.films[fi];
  return `
  <article class="work-card reveal" data-cat="${esc(f.cat)}" data-i="${fi}" data-pos="${pos}" tabindex="0" role="button" aria-label="Ver ${esc(f.title)} — ${esc(f.artist)}">
    <div class="work-media">
      <img src="${esc(ytIdOf(f.video) ? ytThumb(ytIdOf(f.video)) : f.img)}" data-yt="${esc(ytIdOf(f.video) || "")}" data-local="${esc(f.img)}" referrerpolicy="no-referrer" alt="${esc(f.title)} — ${esc(f.artist)}" loading="lazy" decoding="async">
      <span class="play"><i>${ICONS.play}</i></span>
    </div>
    <div class="work-meta">
      <h3>${esc(f.title)}</h3>
      <span class="mono">${esc(f.artist)} · ${esc(f.year)}</span>
    </div>
  </article>`;
}).join("");
workGrid.querySelectorAll("img[data-yt]").forEach(armThumb);

const counts = {};
CONFIG.films.forEach(f => counts[f.cat] = (counts[f.cat] || 0) + 1);
/* REGLA PERMANENTE: los botones de artista salen en orden ALEATORIO en cada
   visita ("Todos" queda primero por ser el filtro por defecto). */
/* Sin chip "Todos": solo nombres de artista. El estado por defecto sigue
   siendo el pliegue mezclado; volver a tocar el artista activo lo deselecciona
   y devuelve al pliegue. */
const cats = shuffle(Object.keys(counts));
const filters = document.getElementById("filters");
filters.innerHTML = cats.map(c => `<button class="chip" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
/* Pliegue: la grilla muestra las primeras FOLD piezas del orden mezclado.
   El resto de las piezas vive en la Galería 3D: el botón ya no despliega
   la grilla, lleva a 05 · Contacto y hace que el cartel de neón llame la
   atención para que el usuario entre solo. Al filtrar por artista se
   muestran todas sus piezas, sin pliegue. */
/* FOLD y FOLD_SM se declaran arriba, junto a buildWorkOrder.
   En celu la grilla es de una columna y la sección se hace larguísima:
   ahí el pliegue muestra 5. Se recalcula solo al cambiar el breakpoint. */
const foldMQ = matchMedia("(max-width: 760px)");
const foldNow = () => (foldMQ.matches ? FOLD_SM : FOLD);
let workCat = "Todos";
const moreBtn = document.getElementById("moreBtn");
const workMore = document.getElementById("workMore");
const MORE_LABEL = "¿Querés más? ↓";
function applyWork() {
  workGrid.querySelectorAll(".work-card").forEach(card => {
    const off = workCat !== "Todos"
      ? card.dataset.cat !== workCat
      : +card.dataset.pos >= foldNow();
    card.classList.toggle("hidden", off);
  });
  workMore.hidden = !(workCat === "Todos" && CONFIG.films.length > foldNow());
  moreBtn.textContent = MORE_LABEL;
}
filters.addEventListener("click", e => {
  const b = e.target.closest(".chip"); if (!b) return;
  const ya = b.classList.contains("on");
  filters.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", !ya && c === b));
  workCat = ya ? "Todos" : b.dataset.cat;
  applyWork();
});
/* "¿Más?" → 05 · Contacto + el cartel neón pide el click */
moreBtn.addEventListener("click", () => {
  const destino = document.getElementById("contacto");
  const cartel = document.getElementById("ledBtn");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (destino) destino.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  if (!cartel || reduce) return;
  clearTimeout(moreBtn._attnT);
  moreBtn._attnT = setTimeout(() => {
    cartel.classList.remove("attn");
    void cartel.offsetWidth;            /* reinicia la animación si se repite el click */
    cartel.classList.add("attn");
  }, 620);
});
if (foldMQ.addEventListener) foldMQ.addEventListener("change", applyWork);
else if (foldMQ.addListener) foldMQ.addListener(applyWork);   /* Safari viejo */
applyWork();
workGrid.addEventListener("click", e => {
  const card = e.target.closest(".work-card"); if (!card) return;
  const f = CONFIG.films[+card.dataset.i];
  openModal({ ...f, meta: `${f.lineup || f.artist} · ${f.role} · ${f.year}`, vert: false });
});
/* teclado: Enter / Espacio abren la pieza enfocado (accesibilidad) */
workGrid.addEventListener("keydown", e => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const card = e.target.closest(".work-card"); if (!card) return;
  e.preventDefault(); card.click();
});
