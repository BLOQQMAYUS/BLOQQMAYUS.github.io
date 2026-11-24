/* effects.js — Reveal al hacer scroll, timecode del hero y títulos que se tipean. */
/* ---- reveal on scroll ---- */
const io = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
}), { threshold: .12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

/* ---- timecode decorativo (120 fps): sigue el reloj real, 120 cuadros por segundo ---- */
const tcEl = document.getElementById("tc");
const t0 = performance.now();
const pad = n => String(n).padStart(2, "0");
setInterval(() => {
  if (document.hidden) return;
  const frame = Math.floor((performance.now() - t0) * 120 / 1000);
  const f = frame % 120, s = Math.floor(frame / 120) % 60, m = Math.floor(frame / 7200) % 60, h = Math.floor(frame / 432000);
  tcEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}:${String(f).padStart(3, "0")}`;
}, 1000 / 12);

/* ---- títulos de sección: se tipean al entrar en pantalla ---- */
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((ents) => {
    ents.forEach(en => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      const spans = en.target._ty; let i = 0, prev = null;
      const tick = () => {
        if (i >= spans.length) {
          if (prev) {
            const last = prev; last.classList.add("idle");
            /* 4 titileos (4,4 s): termina apagada, recién ahí se quita la barra */
            setTimeout(() => last.classList.remove("cur", "idle", "first"), 4500);
          }
          return;
        }
        const s = spans[i++]; s.classList.add("on");
        if (prev) prev.classList.remove("cur");
        s.classList.add("cur"); if (i === 1) s.classList.add("first"); prev = s;
        setTimeout(tick, /\s/.test(s.textContent) ? 40 : 70);
      };
      tick();
    });
  }, { threshold: 0.6 });
  document.querySelectorAll("section h2").forEach(h2 => {
    const label = [...h2.childNodes].filter(n => !(n.nodeType === 1 && n.classList.contains("h2-hint")))
      .map(n => (n.nodeType === 1 && n.tagName === "BR") ? " " : n.textContent).join("").replace(/\s+/g, " ").trim();
    h2.setAttribute("aria-label", label);
    const spans = [];
    const walk = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        [...n.textContent].forEach(ch => {
          const s = document.createElement("span"); s.className = "ty"; s.textContent = ch; s.setAttribute("aria-hidden", "true");
          frag.appendChild(s); spans.push(s);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== "BR" && !n.classList.contains("h2-hint")) walk(n);
    });
    walk(h2); h2._ty = spans; io.observe(h2);
  });
})();
