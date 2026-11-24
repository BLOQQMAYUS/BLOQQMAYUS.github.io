/* wheel.js — 02 · Rueda 3D de contenido vertical. */
/* ---- RUEDA 3D de contenido vertical ----
   Posters en la rueda (nada de video decodeando mientras gira): el video
   arranca recién al clickear, en la mesa de luz. Giro lento y continuo,
   clickeable en cualquier momento. Se frena sola fuera de vista, con la
   pestaña oculta, con foco de teclado o con cualquier capa abierta.
   La rueda del mouse NO la mueve: scrollea la página (pedido expreso). */
const wheelStage = document.getElementById("wheelStage");
const wheelRotor = document.getElementById("wheelRotor");
let wheelItems = [], wheelCards = [], wheelAngle = 0, wheelVel = 0;
let wheelRaf = 0, wheelLast = 0, wheelVisible = false, wheelFocus = false;
let wheelGo = null, wheelFront = -1;     // giro animado hacia un punto · índice de la pieza al frente
const wheelDots = document.getElementById("wheelDots");
const WHEEL_DEG = 7.5;                    // ≈48 s por vuelta: despacio
const wheelPaused = () => modal.classList.contains("open") || ltOpen || galOpen ||
  document.hidden || !wheelVisible || wheelFocus || rlPhase !== null;

function wheelGeom() {
  const small = innerWidth <= 760;
  const cw = small ? 170 : 230, ch = Math.round(cw * 16 / 9);
  const n = Math.max(1, wheelCards.length);
  const R = Math.min(small ? 330 : 460, (cw * .5 / Math.tan(Math.PI / n)) * 1.45);
  wheelStage.style.setProperty("--cw", cw + "px");
  wheelStage.style.setProperty("--ch", ch + "px");
  wheelCards.forEach((c, i) => {
    c._a = i * (360 / n);
    c.style.setProperty("--tf", `rotateY(${c._a}deg) translateZ(${R}px)`);
  });
}
function wheelPaint() {
  wheelRotor.style.transform = `rotateY(${wheelAngle}deg)`;
  for (const c of wheelCards) {
    const k = Math.cos((wheelAngle + c._a) * Math.PI / 180);
    c.style.opacity = k <= 0 ? "0" : (0.42 + 0.58 * k).toFixed(3);
  }
  /* puntos: marca la pieza más al frente (solo toca el DOM cuando cambia) */
  let best = -1, bk = -2;
  wheelCards.forEach((c, i) => { const k = Math.cos((wheelAngle + c._a) * Math.PI / 180); if (k > bk) { bk = k; best = i; } });
  if (best !== wheelFront) {
    wheelFront = best;
    [...wheelDots.children].forEach((d, i) => d.setAttribute("aria-current", i === best));
  }
}
/* gira por el camino corto hasta dejar la pieza i al frente (≈0,7 s, ease in-out) */
function wheelGoto(i) {
  const c = wheelCards[i]; if (!c) return;
  const d = ((-c._a - wheelAngle) % 360 + 540) % 360 - 180;
  wheelVel = 0;
  wheelGo = { a0: wheelAngle, d, t0: performance.now() };
}
wheelDots.addEventListener("click", e => {
  const b = e.target.closest("button"); if (b) wheelGoto(+b.dataset.i);
});
function wheelTick(t) {
  wheelRaf = requestAnimationFrame(wheelTick);
  const dt = Math.min((t - wheelLast) / 1000, .05) || .016;
  wheelLast = t;
  if (wheelGo) {                         // el punto manda aunque la rueda esté en pausa
    const k = Math.min(1, (t - wheelGo.t0) / 700), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    wheelAngle = wheelGo.a0 + wheelGo.d * e;
    if (k >= 1) wheelGo = null;
    wheelPaint(); return;
  }
  if (wheelPaused()) return;
  wheelAngle += (WHEEL_DEG + wheelVel) * dt;
  wheelVel *= Math.pow(.05, dt);
  if (wheelAngle >= 360 || wheelAngle <= -360) wheelAngle %= 360;
  wheelPaint();
}
/* hit-test por proyección: con preserve-3d el hit-testing nativo de Chrome
   devuelve el contenedor, así que se resuelve por rect + profundidad real.
   Gana la más cercana al frente; las de atrás no se clickean. */
function wheelCardAt(x, y) {
  let best = null, bestK = -Infinity;
  for (const c of wheelCards) {
    const r = c.getBoundingClientRect();
    if (x < r.left || x > r.right || y < r.top || y > r.bottom) continue;
    const k = Math.cos((wheelAngle + c._a) * Math.PI / 180);
    if (k <= .05) continue;
    if (k > bestK) { bestK = k; best = c; }
  }
  return best;
}
function buildWheel(items) {
  wheelItems = items;
  wheelRotor.innerHTML = items.map((v, i) => `
    <article class="reel-card wheel-card" data-i="${i}" tabindex="0" role="button" aria-label="Ver ${esc(v.title)}">
      <div class="reel-ph"><i>${ICONS.play}</i></div>
      <img class="reel-poster" src="${esc(v.poster)}" alt="" loading="lazy" decoding="async" draggable="false">
    </article>`).join("");
  wheelCards = [...wheelRotor.querySelectorAll(".wheel-card")];
  wheelDots.innerHTML = items.map((v, i) => `<button type="button" data-i="${i}" aria-label="Ir a ${esc(v.title)}"></button>`).join("");
  wheelFront = -1;
  wheelCards.forEach(c => {
    const p = c.querySelector(".reel-poster");
    if (!p) return;
    const mark = () => c.classList.add("has-poster");
    if (p.complete && p.naturalWidth) mark(); else p.addEventListener("load", mark);
  });
  wheelGeom(); wheelPaint();

  /* arrastrar para girar + TAP propio (setPointerCapture redirige el click) */
  let down = false, sx = 0, sa = 0, lx = 0, lt = 0, moved = 0, downT = 0, downCard = null;
  wheelStage.addEventListener("pointerdown", e => {
    down = true; moved = 0; sx = e.clientX; sa = wheelAngle;
    lx = e.clientX; lt = performance.now(); downT = lt; wheelVel = 0;
    downCard = wheelCardAt(e.clientX, e.clientY);
    wheelStage.classList.add("dragging");
    wheelStage.setPointerCapture(e.pointerId);
  });
  wheelStage.addEventListener("pointermove", e => {
    if (!down) return;
    const dx = e.clientX - sx;
    moved = Math.max(moved, Math.abs(dx));
    wheelAngle = sa + dx * .22;
    const now = performance.now(), dt = now - lt || 16;
    wheelVel = ((e.clientX - lx) / dt) * 1000 * .22;
    lx = e.clientX; lt = now;
    wheelPaint();
  });
  wheelStage.addEventListener("pointerup", e => {
    if (!down) return;
    down = false; wheelStage.classList.remove("dragging");
    if (moved <= 8 && performance.now() - downT < 600) {
      const c = downCard || wheelCardAt(e.clientX, e.clientY);
      downCard = null; wheelVel = 0;
      if (c) openReel(wheelItems, +c.dataset.i, c);
      return;
    }
    downCard = null;
    wheelVel = Math.max(-90, Math.min(90, wheelVel));
  });
  wheelStage.addEventListener("pointercancel", () => {
    down = false; downCard = null; wheelStage.classList.remove("dragging");
  });
  wheelStage.addEventListener("dragstart", e => e.preventDefault());
  wheelStage.addEventListener("keydown", e => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const c = e.target.closest(".wheel-card"); if (!c) return;
    e.preventDefault(); openReel(wheelItems, +c.dataset.i, c);
  });
  wheelStage.addEventListener("focusin", () => { wheelFocus = true; });
  wheelStage.addEventListener("focusout", () => { wheelFocus = false; });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(es => es.forEach(en => { wheelVisible = en.isIntersecting; }),
      { threshold: .05 }).observe(wheelStage);
  } else wheelVisible = true;
  if (!wheelRaf) { wheelLast = performance.now(); wheelRaf = requestAnimationFrame(wheelTick); }
}
addEventListener("resize", () => { wheelGeom(); wheelPaint(); });
document.addEventListener("visibilitychange", () => {
  if (document.hidden) { if (rlPhase === "open") rlVideo.pause(); }
  else if (rlPhase === "open") rlVideo.play().catch(() => {});
});
