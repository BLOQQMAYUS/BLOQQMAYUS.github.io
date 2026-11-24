/* proof.js — F3: cifras y cinta de artistas. Todo sale de CONFIG (content/site.js): al sumar un
   videoclip o un artista nuevo, los números y la cinta se actualizan solos. */
(() => {
  const films = CONFIG.films || [];
  const artists = [...new Set(films.map(f => f.cat).filter(Boolean))];
  const SRC = { films: films.length, artists: artists.length };

  /* cifras: valor real + conteo animado una sola vez al entrar en pantalla */
  const dds = [...document.querySelectorAll(".stats dd")];
  dds.forEach(dd => {
    const n = dd.dataset.countFrom ? SRC[dd.dataset.countFrom] : +dd.dataset.count;
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

  /* cinta de artistas: dos copias para el loop sin costura (la segunda, oculta a lectores) */
  const track = document.getElementById("mqTrack");
  const row = shuffle(artists.slice()).map(a => `<span>${esc(a)}</span>`).join("");
  track.innerHTML = row + row.replace(/<span>/g, '<span aria-hidden="true">');
  track.style.setProperty("--mq-dur", Math.max(24, artists.length * 4) + "s");
  const mq = track.closest(".marquee");
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(es => es.forEach(en => mq.classList.toggle("on", en.isIntersecting))).observe(mq);
  } else mq.classList.add("on");
})();
