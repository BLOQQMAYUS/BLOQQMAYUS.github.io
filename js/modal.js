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
function openModal(item) {
  /* YouTube no acepta embeds desde file:// (Error 153): solo http/https */
  const canEmbed = /^https?:$/.test(location.protocol);
  const embed = canEmbed ? videoEmbed(item.video) : null;
  mMedia.className = "modal-media" + (item.vert ? " vert" : "");
  if (embed) {
    mMedia.innerHTML = embed;
  } else if (item.video) {
    mMedia.innerHTML = `<img src="${esc(item.img)}" alt="${esc(item.title)}"><span class="modal-open"><a href="${esc(item.video)}" target="_blank" rel="noopener noreferrer">${ICONS.play} Ver en YouTube</a></span>`;
  } else {
    mMedia.innerHTML = `<img src="${esc(item.img)}" alt="${esc(item.title)}">`;
  }
  document.getElementById("modalTitle").textContent = item.title;
  document.getElementById("modalMeta").textContent = item.meta || "";
  const ext = document.getElementById("modalExt");
  if (item.video) {
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
