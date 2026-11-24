/* proof.js — Cifras bajo el hero. Videoclips y artistas salen de CONFIG (content/site.js) + la base
   fija de cada <dd data-base>: al sumar un videoclip o un artista nuevo, el número sube solo. */
(() => {
  const films = CONFIG.films || [];
  const artists = [...new Set(films.map(f => f.cat).filter(Boolean))];
  const SRC = { films: films.length, artists: artists.length };

  /* cifras: valor real + conteo animado una sola vez al entrar en pantalla */
  const dds = [...document.querySelectorAll(".stats dd")];
  dds.forEach(dd => {
    const n = (dd.dataset.countFrom ? SRC[dd.dataset.countFrom] : +dd.dataset.count) + (+dd.dataset.base || 0);
    dd.dataset.n = n;
    dd.textContent = (dd.dataset.prefix || "") + n;
  });
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const count = dd => {
    const n = +dd.dataset.n, pre = dd.dataset.prefix || "", t0 = performance.now(), dur = 900;
    const step = t => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      dd.textContent = pre + Math.round(n * e);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (!still && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target); count(en.target);
    }), { threshold: .6 });
    dds.forEach(dd => io.observe(dd));
  }

})();
