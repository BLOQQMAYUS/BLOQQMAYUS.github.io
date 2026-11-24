/* reel-preview.js — Previsualización limpia de reels (mesa de luz). */
/* ---- previsualización limpia: fondo 65%, vuelo al centro YA reproduciendo,
   sin controles; click fuera (sobre el fondo oscurecido) = cerrar y volver ---- */
const rlBox = document.getElementById("rlBox");
const rlBg = document.getElementById("rlBg");
const rlVideo = document.getElementById("rlVideo");
let rlCard = null, rlPhase = null, rlTimer = 0;
function rlFit() {
  /* margen cómodo en TODOS los lados para poder clickear afuera y volver */
  const vw = innerWidth, vh = innerHeight;
  const pad = Math.min(72, Math.max(32, Math.min(vw, vh) * .07));
  let h = vh - pad * 2, w = h * 9 / 16;
  if (w > vw - pad * 2) { w = vw - pad * 2; h = w * 16 / 9; }
  return { top: (vh - h) / 2, left: (vw - w) / 2, width: w, height: h };
}
function rlSetRect(r) {
  rlVideo.style.top = r.top + "px"; rlVideo.style.left = r.left + "px";
  rlVideo.style.width = r.width + "px"; rlVideo.style.height = r.height + "px";
}
function openReel(list, i, card) {
  if (rlPhase) return;
  const v = list[((i % list.length) + list.length) % list.length];
  rlCard = card || null;
  wheelVel = 0;
  rlVideo.src = v.lo || v.src;
  rlVideo.poster = v.poster || "";
  rlVideo.muted = true;                 // arranca mudo durante el vuelo (dentro del gesto)…
  rlBox.classList.add("open");
  rlVideo.style.transition = "none";
  rlSetRect(rlCard ? rlCard.getBoundingClientRect() : rlFit());
  rlVideo.style.borderRadius = "28px";
  void rlVideo.offsetWidth;
  rlVideo.style.transition = "";
  rlSetRect(rlFit());
  rlVideo.style.borderRadius = innerWidth < 700 ? "0" : "14px";
  rlBox.classList.add("on");
  document.body.style.overflow = "hidden";
  rlVideo.play().catch(() => {});
  rlPhase = "in";
  layerPush("rl", closeReel);
  clearTimeout(rlTimer);
  rlTimer = setTimeout(rlLand, 700);
}
function rlLand() {
  if (rlPhase !== "in") return;
  rlPhase = "open";
  rlVideo.muted = false;                // …y suena al llegar al centro
}
rlVideo.addEventListener("transitionend", e => {
  if (e.propertyName !== "width" && e.propertyName !== "height") return;
  if (rlPhase === "in") rlLand();
  else if (rlPhase === "out") rlFinish();
});
function closeReel(fromPop) {
  if (rlPhase !== "open") return;
  rlPhase = "out";
  if (!fromPop) layerDrop("rl");
  rlBox.classList.remove("on");
  rlVideo.style.transition = "none";
  rlSetRect(rlFit());
  void rlVideo.offsetWidth;
  rlVideo.style.transition = "";
  rlSetRect(rlCard ? rlCard.getBoundingClientRect() : rlFit());
  rlVideo.style.borderRadius = "28px";
  clearTimeout(rlTimer);
  rlTimer = setTimeout(rlFinish, 700);
}
function rlFinish() {
  if (rlPhase !== "out") return;
  rlPhase = null;
  rlVideo.pause();
  rlVideo.removeAttribute("src"); rlVideo.load();
  rlBox.classList.remove("open", "on");
  document.body.style.overflow = ltOpen ? "hidden" : "";
}
rlBg.addEventListener("click", () => closeReel());
addEventListener("resize", () => { if (rlPhase === "open" || rlPhase === "in") rlSetRect(rlFit()); });
