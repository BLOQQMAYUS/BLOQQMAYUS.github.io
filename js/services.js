/* services.js — 04 · Servicios: íconos que entran de a uno + movimiento idle. */
/* ---- servicios: los íconos aparecen de a uno; después quedan con un movimiento sutil (todo al pulso B); luz que sigue al mouse ---- */
(function () {
  const INTRO = { direccion: 1.7, post: 1.9, viejo: 1.6, vertical: 1.9 };   // segundos hasta que termina la entrada
  const B = .6;                                                            // pulso base: los tiempos aleatorios son múltiplos de B
  const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const cards = [...document.querySelectorAll(".serv")];
  const vis = new Set();

  const idle = {
    // playhead: se mueve horizontalmente a ritmos y distancias al azar
    post(c, tok) {
      const ph = c.querySelector(".tl-ph"); if (!ph) return;
      let x = 102;
      const move = () => {
        if (c._tok !== tok) return;
        if (vis.has(c) && !document.hidden) {
          x = Math.max(86, Math.min(120, x + (Math.random() < .5 ? -1 : 1) * rnd(3, 14)));
          const dur = B * pick([1, 2, 3]);
          ph.style.transition = "transform " + dur + "s cubic-bezier(.45,0,.25,1)";
          ph.style.transform = "translateX(" + x + "px)";
          setTimeout(move, (dur + B * pick([0, 1, 2])) * 1000);
        } else setTimeout(move, 500);
      };
      setTimeout(move, 1900);
    },
    // humo ácido: bocanadas sueltas a intervalos rápidos y cantidades al azar
    viejo(c, tok) {
      const sm = c.querySelector(".car-smoke"); if (!sm) return;
      const NS = "http://www.w3.org/2000/svg";
      const puff = () => {
        const el = document.createElementNS(NS, "circle");
        el.setAttribute("class", "ip"); el.setAttribute("cx", "46.6"); el.setAttribute("cy", "17.9");
        el.setAttribute("r", rnd(1.1, 1.7).toFixed(2)); el.setAttribute("fill", "url(#svSmoke)");
        sm.appendChild(el);
        const dx = rnd(6, 15), dy = rnd(-7.5, -3), s = rnd(2.2, 3.1);
        const a = el.animate([
          { opacity: 0, transform: "translate(0px,0px) scale(.35)" },
          { opacity: .8, offset: .22 },
          { opacity: 0, transform: "translate(" + dx + "px," + dy + "px) scale(" + s + ")" }
        ], { duration: 1500, easing: "ease-out" });
        a.onfinish = () => el.remove();
      };
      const loop = () => {
        if (c._tok !== tok) return;
        if (vis.has(c) && !document.hidden) {
          const n = pick([1, 1, 2]);
          for (let i = 0; i < n; i++) setTimeout(() => { if (c._tok === tok) puff(); }, i * 150);
        }
        setTimeout(loop, B * pick([1, 2, 3, 4]) * 1000);
      };
      setTimeout(loop, 4900);
    }
  };

  function reset(c) {
    const ph = c.querySelector(".tl-ph");
    if (ph) { ph.style.transition = "none"; ph.style.transform = ""; }
    c.querySelectorAll(".car-smoke .ip").forEach(n => n.remove());
  }

  cards.forEach(c => {
    let busy = false;
    c._play = () => {
      if (reduce || busy) return;
      busy = true;
      const tok = c._tok = (c._tok || 0) + 1;
      reset(c);
      c.classList.remove("go"); void c.offsetWidth; c.classList.add("go");
      const f = idle[c.dataset.lt]; if (f) f(c, tok);
      setTimeout(() => { busy = false; }, (INTRO[c.dataset.lt] || 2) * 1000 + 150);
    };
    if (!reduce) c.classList.add("arm");
    c.addEventListener("click", c._play);
    if (fine) {
      c.addEventListener("pointerenter", c._play);
      c.addEventListener("pointermove", e => {
        const r = c.getBoundingClientRect();
        c.style.setProperty("--mx", (e.clientX - r.left) + "px"); c.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    }
  });

  // entrada de a uno: cada ícono espera a que termine la aparición del anterior
  const q = []; let running = false;
  const drain = () => {
    if (running || !q.length) return;
    running = true;
    const c = q.shift(); c._play();
    setTimeout(() => { running = false; drain(); }, ((INTRO[c.dataset.lt] || 2) + .3) * 1000);
  };
  const iop = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    iop.unobserve(en.target);
    q.push(en.target); q.sort((a, b) => cards.indexOf(a) - cards.indexOf(b));
    drain();
  }), { threshold: .55 });
  const vop = new IntersectionObserver(es => es.forEach(en => { en.isIntersecting ? vis.add(en.target) : vis.delete(en.target); }), { threshold: 0 });
  cards.forEach(c => { iop.observe(c); vop.observe(c); });
})();
