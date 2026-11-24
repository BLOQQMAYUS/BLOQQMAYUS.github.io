/* starfield.js — Campo de estrellas del sitio (30 fps, dpr ≤ 1.5, se frena fuera de vista). */
/* ---- CAMPO DE ESTRELLAS DEL SITIO ---------------------------------------
   Mismo lenguaje que la Galería 3D pero en 2D y mucho más barato: un canvas
   fijo, ~190 puntos, un rAF que solo corre cuando hay estrellas en pantalla
   (o sea, desde 01 hacia abajo) y con la pestaña visible. Velocidad = 60% de
   la de la galería (pedido: 40% más lento). prefers-reduced-motion → quieto. */
(function starfield() {
  const cv = document.getElementById("starfield");
  const g = cv.getContext("2d", { alpha: true });
  const cvT = document.getElementById("starfieldTop"), gT = cvT.getContext("2d", { alpha: true });
  const desde = document.querySelector("main"), heroEl = document.getElementById("top");
  if (!g || !gT || !desde || !heroEl) return;
  const SPEED = 80 * 0.6;                 // AUTO de la galería × 0.6 (40% más lento)
  const STEP = 1000 / 30;                 // 30 fps: el drift es lento, 60 no aporta
  const FOCAL = 340, FAR = 1500, NEAR = 45;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W = 0, H = 0, spread = 900, pts = [], raf = 0, paint = 0, tapado = false;
  let comet = null, nextComet = 0;
  /* sprite radial de 128 px: borde suave, se agranda sin pixelarse */
  const sprite = (() => {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const x = c.getContext("2d"), gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(244,238,227,1)"); gr.addColorStop(.7, "rgba(244,238,227,1)");
    gr.addColorStop(.86, "rgba(244,238,227,.55)"); gr.addColorStop(1, "rgba(244,238,227,0)");
    x.fillStyle = gr; x.fillRect(0, 0, 128, 128); return c;
  })();
  let minR = 120;
  const rnd = (a, b) => a + Math.random() * (b - a);
  function born(p, far) {
    /* distancia mínima al eje: la estrella sale de pantalla antes de llegar a NEAR,
       así nunca se apaga estando a la vista */
    do { p.x = rnd(-spread, spread); p.y = rnd(-spread, spread); } while (Math.hypot(p.x, p.y) < minR);
    p.z = far ? FAR : NEAR + (FAR - NEAR) * Math.pow(Math.random(), 1.35);  // algo más de cerca → se reparten, no se amontonan en el centro
    p.r = rnd(0.5, 1.5); p.o = rnd(0.25, 0.7); p.h = Math.random();   // p.h: cuáles se ocultan sobre la imagen
    return p;
  }
  function size() {
    /* dpr hasta 2: círculos nítidos también las estrellas más grandes */
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    spread = Math.max(W, H) * 0.95;
    minR = Math.hypot(W, H) / 2 / (FOCAL / NEAR) * 1.15;
    cv.width = cvT.width = Math.round(W * dpr); cv.height = cvT.height = Math.round(H * dpr);
    g.setTransform(dpr, 0, 0, dpr, 0, 0); gT.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(340, Math.max(190, (W * H) / 6000)));
    pts = Array.from({ length: n }, () => born({}, false));
  }
  function frame(t) {
    raf = requestAnimationFrame(frame);
    /* una capa abierta tapa el sitio: no se dibuja nada (la galería tiene sus
       propias estrellas). Se limpia una sola vez al taparse. */
    if (document.body.style.overflow === "hidden") {
      if (!tapado) { g.clearRect(0, 0, W, H); gT.clearRect(0, 0, W, H); tapado = true; }
      paint = t; return;
    }
    tapado = false;
    if (t - paint < STEP) return;          // throttle a 30 fps
    const dt = paint ? Math.min((t - paint) / 1000, 0.06) : 0;
    paint = t;
    /* Dos lienzos con las MISMAS estrellas: #starfieldTop cubre el header (por
       encima de la imagen, así las estrellas llegan hasta arriba y se funden
       con ella) y #starfield el resto del sitio (detrás del contenido). El
       corte entre ambos es el borde inferior del header. Sobre la imagen las
       estrellas van con un piso de brillo que se apaga hacia el fundido de
       abajo, donde la imagen ya es transparente y valen sus valores normales. */
    const hr = heroEl.getBoundingClientRect(), hb = hr.bottom, hh = Math.max(1, hr.height);
    g.clearRect(0, 0, W, H); gT.clearRect(0, 0, W, H);
    const cutB = Math.max(0, hb);                       // main: de acá hacia abajo
    const cutT = Math.min(H, hb);                       // top: de acá hacia arriba
    g.save(); g.beginPath(); g.rect(0, cutB, W, Math.max(0, H - cutB)); g.clip();
    gT.save(); gT.beginPath(); gT.rect(0, 0, W, Math.max(0, cutT)); gT.clip();
    for (const p of pts) {
      if (!reduce) p.z -= SPEED * dt;
      if (p.z <= NEAR) born(p, true);
      const k = FOCAL / p.z;
      const x = W / 2 + p.x * k, y = H / 2 + p.y * k;
      if (x < -8 || x > W + 8 || y < -8 || y > H + 8) { if (p.z < FAR * 0.35) born(p, true); continue; }
      let a = p.o * Math.min(1, k * 1.7);
      a *= Math.min(1, (FAR - p.z) / 260);   // entra gradual desde lejos
      const rad = p.r * Math.min(k, 5) * 0.85 + 0.3;
      if (y >= cutB) {
        g.globalAlpha = Math.max(0, Math.min(1, a));
        g.drawImage(sprite, x - rad, y - rad, rad * 2, rad * 2);
      }
      if (y < cutT) {
        const u = (y - hr.top) / hh, f = Math.max(0, Math.min(1, (0.9 - u) / 0.35));
        /* sobre la imagen se ve ~50% menos de estrellas (para no saturar el inicio); el recorte se
           desvanece hacia el fundido de abajo, donde vale la densidad normal del resto del sitio */
        if (p.h < 0.5 * f) continue;
        gT.globalAlpha = Math.max(0, Math.min(1, a + (Math.max(a, 0.7) - a) * f));
        gT.drawImage(sprite, x - rad, y - rad, rad * 2, rad * 2);
      }
    }
    /* cometas: uno cada tanto, cruzando en diagonal con cola degradada.
       Suman variabilidad al patrón sin invadir ni costar frames de más. */
    if (!reduce) {
      if (!comet && t > nextComet) {
        /* cada cometa con su profundidad (lejos = fino, lento, tenue; cerca =
           largo, rápido, brillante), dirección y recorrido propios */
        const R = Math.hypot(W, H) / 2, d = Math.random();
        const th = rnd(0, 6.2832), sx = W / 2 + Math.cos(th) * R * 1.05, sy = H / 2 + Math.sin(th) * R * 1.05;
        let dx = W / 2 + rnd(-.35, .35) * W - sx, dy = H / 2 + rnd(-.35, .35) * H - sy;
        const L = Math.hypot(dx, dy), tw = rnd(-.3, .3), c = Math.cos(tw), sn = Math.sin(tw);
        dx /= L; dy /= L;
        const travel = R * rnd(.9, 1.7), speed = Math.hypot(W, H) * (.07 + .5 * d * d) * rnd(.85, 1.2);
        comet = { sx, sy, vx: dx * c - dy * sn, vy: dx * sn + dy * c, travel, dur: travel / speed, life: 0,
          len: 40 + 230 * d, w: .7 + 1.5 * d, al: .3 + .6 * d, warm: Math.random() < .7 };
      }
      if (comet) {
        comet.life += dt;
        const u = comet.life / comet.dur;
        if (u >= 1) { comet = null; nextComet = t + rnd(3500, 12000); }
        else {
          const cx = comet.sx + comet.vx * comet.travel * u, cy = comet.sy + comet.vy * comet.travel * u;
          const tx = cx - comet.vx * comet.len, ty = cy - comet.vy * comet.len;
          const fade = Math.sin(Math.PI * u) * comet.al;
          for (const c2 of [g, gT]) {          // el cometa cruza también sobre la imagen del header
            const grd = c2.createLinearGradient(cx, cy, tx, ty);
            grd.addColorStop(0, "rgba(244,238,227," + fade.toFixed(3) + ")");
            grd.addColorStop(0.45, (comet.warm ? "rgba(242,165,26," : "rgba(217,115,127,") + (fade * 0.5).toFixed(3) + ")");
            grd.addColorStop(1, "rgba(242,165,26,0)");
            c2.globalAlpha = 1; c2.strokeStyle = grd; c2.lineWidth = comet.w; c2.lineCap = "round";
            c2.beginPath(); c2.moveTo(cx, cy); c2.lineTo(tx, ty); c2.stroke();
          }
        }
      }
    }
    g.restore(); gT.restore();
  }
  const kick = () => { if (!raf && !document.hidden) { paint = 0; raf = requestAnimationFrame(frame); } };
  const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };
  size();
  addEventListener("resize", () => { size(); kick(); }, { passive: true });
  /* El corte es "desde 01 hacia abajo", no "01 visible": si se observara solo
     #trabajo, las estrellas se pararían al llegar a Servicios. El rAF se corta
     cuando únicamente el hero está en pantalla y lo reactiva el scroll. */
  addEventListener("scroll", kick, { passive: true });
  document.addEventListener("visibilitychange", () => document.hidden ? stop() : kick());
  /* red de seguridad: si la región entra en pantalla SIN evento de scroll
     (resize, fuentes o imágenes que acomodan el layout), arranca igual.
     Solo corre mientras está frenado: un getBoundingClientRect cada 600 ms. */
  setInterval(() => {
    if (!raf && !document.hidden && desde.getBoundingClientRect().top < (H || innerHeight)) kick();
  }, 600);
  kick();
})();
