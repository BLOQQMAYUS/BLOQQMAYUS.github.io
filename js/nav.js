/* nav.js — Nav: tecla central y scrollspy. */
/* ---- nav ---- */
const nav = document.getElementById("nav");
const scrollCue = document.getElementById("scrollCue");
addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", scrollY > 40);
  if (scrollCue) scrollCue.classList.toggle("hide", scrollY > 80);
}, { passive: true });
const navLinks = document.getElementById("navLinks");
/* feedback táctil del logo: relleno ámbar + scale 1.25, una sola pasada.
   El relleno se SUELTA cuando el navegador ya lo pintó, no cuando lo dice el
   reloj. Si el equipo está ocupado (galería precargando, celular modesto) los
   frames vienen espaciados y una animación por tiempo se saltearía entera sin
   verse nunca. Acá la tecla queda llena hasta que se vea de verdad. */
const logoKey = document.querySelector(".logo .key");
/* la flecha aparece solo al pasar la sección OBRAS (no en el hero ni dentro de OBRAS) */
(function logoVisible() {
  const lg = document.querySelector(".logo"), obras = document.getElementById("trabajo");
  const mid = document.getElementById("navMid");
  const upd = () => { const on = obras.getBoundingClientRect().bottom < 80; lg.classList.toggle("show", on); mid.classList.toggle("show", on); };
  addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();
})();
let tapRaf = 0;
document.querySelector(".logo").addEventListener("click", () => {
  cancelAnimationFrame(tapRaf);
  logoKey.classList.add("tap");
  const t0 = performance.now();
  let llenoDesde = 0;
  const vigilar = () => {
    if (getComputedStyle(logoKey).backgroundColor === "rgb(242, 165, 26)") {
      if (!llenoDesde) llenoDesde = performance.now();
      if (performance.now() - llenoDesde >= 150) { logoKey.classList.remove("tap"); return; }
    }
    if (performance.now() - t0 > 2500) { logoKey.classList.remove("tap"); return; }
    tapRaf = requestAnimationFrame(vigilar);
  };
  tapRaf = requestAnimationFrame(vigilar);
});

/* ---- scrollspy: marca la sección activa en el nav ---- */
const spyMap = {};
navLinks.querySelectorAll('a[href^="#"]:not(.logo)').forEach(a => { spyMap[a.getAttribute("href").slice(1)] = a; });
if ("IntersectionObserver" in window) {
  const spy = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    Object.values(spyMap).forEach(a => a.classList.remove("active"));
    const a = spyMap[en.target.id]; if (a) a.classList.add("active");
  }), { rootMargin: "-40% 0px -55% 0px", threshold: 0 });
  Object.keys(spyMap).forEach(id => { const s = document.getElementById(id); if (s) spy.observe(s); });
}

