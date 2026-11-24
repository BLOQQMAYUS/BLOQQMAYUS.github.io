/* gallery.js — Galería 3D: overlay con iframe a lab/vortex/, precarga y cierre. */
/* ---- Galería 3D · la activa la flecha de contacto (overlay a pantalla completa) ---- */
const galBox = document.getElementById("galBox");
const galFrame = document.getElementById("galFrame");
let galOpen = false;
/* ---- precarga: al abrir el sitio ya se arma la galería, quieta ----
   Así las previews están listas cuando el usuario entra (sobre todo en celu)
   y no aparecen de golpe. location.replace no ensucia el historial conjunto. */
let galPrecargada = false;
function precargarGaleria() {
  if (galPrecargada || galOpen) return;
  galPrecargada = true;
  galFrame.dataset.cargada = "1";
  galFrame.contentWindow.location.replace("lab/vortex/?preload=1");
}
/* Se espera al `load` para no competir con las imágenes del sitio, pero con un
   TECHO: en una conexión lenta el load puede tardar muchísimo y la galería
   quedaría sin precargar justo cuando más falta hace. Lo que pase primero. */
const preloadTecho = setTimeout(precargarGaleria, 3500);
addEventListener("load", () => {
  clearTimeout(preloadTecho);
  if ("requestIdleCallback" in window) requestIdleCallback(precargarGaleria, { timeout: 2500 });
  else setTimeout(precargarGaleria, 1200);
});
function openGal() {
  if (galOpen) return;
  precargarGaleria();          // si aún no se precargó, carga ahora
  galOpen = true;
  layerPush("gal", closeGal);
  galBox.classList.add("open");
  galBox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  /* ya está cargada: solo se despierta, no se vuelve a navegar */
  try { galFrame.contentWindow.__bloqqWake && galFrame.contentWindow.__bloqqWake(); } catch (e) {}
}
function closeGal(fromPop) {
  if (!galOpen) return;
  galOpen = false;
  if (!fromPop) {
    /* si adentro quedó una mesa de luz abierta, se consumen sus entradas también */
    let extra = 0;
    try { extra = galFrame.contentWindow.__bloqqLayers ? galFrame.contentWindow.__bloqqLayers() : 0; } catch (e) {}
    layerDrop("gal", extra);
  }
  galBox.classList.remove("open");
  galBox.setAttribute("aria-hidden", "true");
  /* NO se descarga: queda dormida (cero frames) para que reabrir sea instantáneo */
  try { galFrame.contentWindow.__bloqqSleep && galFrame.contentWindow.__bloqqSleep(); } catch (e) {}
  document.body.style.overflow = ltOpen ? "hidden" : "";
}
window.galClose = closeGal;               // la galería (iframe) se cierra sola con Esc
document.getElementById("ledBtn").addEventListener("click", openGal);
document.getElementById("galX").addEventListener("click", () => closeGal());
/* el neón titila solo cuando está a la vista → cero costo de animación fuera de pantalla */
const heroNeon = document.getElementById("heroNeon");
if ("IntersectionObserver" in window) {
  new IntersectionObserver(es => es.forEach(en =>
    { heroNeon.classList.toggle("lit", en.isIntersecting); if (en.isIntersecting) heroNeon.classList.add("ignite"); }), { threshold: .1 }).observe(heroNeon);
} else { heroNeon.classList.add("lit"); }
const neonSign = document.getElementById("ledBtn");
if ("IntersectionObserver" in window) {
  new IntersectionObserver(es => es.forEach(en =>
    neonSign.classList.toggle("lit", en.isIntersecting)), { threshold: .15 }).observe(neonSign);
} else { neonSign.classList.add("lit"); }
/* la llamada de atención se limpia sola al terminar (vuelve al titileo normal) */
neonSign.addEventListener("animationend", e => {
  if (e.animationName === "neonAttn") neonSign.classList.remove("attn");
});
