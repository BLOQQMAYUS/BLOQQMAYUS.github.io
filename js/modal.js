/* modal.js — Modal de video (YouTube nocookie / Vimeo / mp4). */
/* ---- modal ---- */
const modal = document.getElementById("modal");
const mMedia = document.getElementById("modalMedia");
function videoEmbed(url) {
  if (!url || !/^https:\/\//i.test(url)) return null;   /* solo https; nada de javascript:/data: */
  const SB = 'sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"';
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{6,})/);
  if (yt) return `<iframe src="https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0" ${SB} referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `<iframe src="https://player.vimeo.com/video/${vm[1]}?autoplay=1" ${SB} allow="autoplay; fullscreen" allowfullscreen></iframe>`;
  if (/\.(mp4|webm|mov)(\?|$)/i.test(url)) return `<video src="${esc(url)}" controls autoplay playsinline></video>`;
  return null;
}
/* item.from (opcional) = miniatura de la tarjeta: con View Transitions la miniatura
   "crece" hasta el reproductor. Sin soporte o con movimiento reducido, abre directo. */
function openModal(item) {
  const src = item.from;
  if (src && document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    modal.classList.add("vt");
    src.style.viewTransitionName = "case";
    const vt = document.startViewTransition(() => {
      src.style.viewTransitionName = "";
      mMedia.style.viewTransitionName = "case";
      fillModal(item);
    });
    vt.finished.finally(() => { mMedia.style.viewTransitionName = ""; modal.classList.remove("vt"); });
  } else fillModal(item);
}
function fillModal(item) {
  /* YouTube no acepta embeds desde file:// (Error 153): solo http/https */
  const canEmbed = /^https?:$/.test(location.protocol);
  const embed = canEmbed ? videoEmbed(item.video) : null;
  mMedia.className = "modal-media" + (item.vert ? " vert" : "");
  if (embed) {
    /* el póster queda debajo del iframe mientras carga (y es lo que se ve en la transición) */
    mMedia.innerHTML = (item.img && !item.vert ? `<img class="modal-poster" src="${esc(item.img)}" alt="">` : "") + embed;
  } else if (item.video) {
    mMedia.innerHTML = `<img src="${esc(item.img)}" alt="${esc(item.title)}"><span class="modal-open"><a href="${esc(item.video)}" target="_blank" rel="noopener noreferrer">${ICONS.play} Ver en YouTube</a></span>`;
  } else {
    mMedia.innerHTML = `<img src="${esc(item.img)}" alt="${esc(item.title)}">`;
  }
  document.getElementById("modalTitle").textContent = item.title;
  const meta = document.getElementById("modalMeta"), facts = document.getElementById("modalFacts");
  meta.textContent = item.facts ? "" : (item.meta || "");
  meta.hidden = !!item.facts;
  facts.hidden = !item.facts;
  facts.innerHTML = (item.facts || []).filter(([, v]) => v)
    .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");
  const ext = document.getElementById("modalExt");
  if (item.video && /^https:\/\//i.test(item.video)) {   /* solo https: nunca javascript:/data: en el enlace */
    ext.hidden = false;
    ext.href = item.video;
    ext.textContent = /vimeo\.com/.test(item.video) ? "Ver en Vimeo ↗" : (/youtube|youtu\.be/.test(item.video) ? "Ver en YouTube ↗" : "Abrir video ↗");
  } else ext.hidden = true;
  document.getElementById("modalHint").textContent = embed ? "" :
    (item.video ? "✦ Archivo local: YouTube no incrusta desde file:// — usá el botón. Publicado en la web, reproduce acá mismo." :
    "✦ Placeholder — cuando llegue el reel real, se reproduce acá.");
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
  layerPush("modal", closeModal);
}
function closeModal(fromPop) {
  if (!modal.classList.contains("open")) return;
  if (!fromPop) layerDrop("modal");
  modal.classList.remove("open");
  mMedia.innerHTML = "";
  document.body.style.overflow = ltOpen ? "hidden" : "";
}
document.getElementById("modalBg").addEventListener("click", () => closeModal());
document.getElementById("modalX").addEventListener("click", () => closeModal());
document.addEventListener("keydown", e => { if (e.key === "Escape") closeTopLayer(); });
document.getElementById("showreelBtn").addEventListener("click", () =>
  openModal({ ...CONFIG.showreel, meta: "Director Creativo · Filmmaker · Editor · VFX", vert: false }));
