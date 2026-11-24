/* work-cards.js — Tarjetas de obras: inclinación 3D + brillo + loop mudo (solo mouse). */
/* ---- tarjetas de obras: inclinación 3D + brillo + loop mudo al quedarse encima (solo mouse) ---- */
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const touch = matchMedia("(hover:none)").matches;
  if (!fine && !touch) return;
  const grid = document.getElementById("workGrid");
  const conn = navigator.connection || {};
  const canPreview = !conn.saveData;
  let raf = 0, cur = null, dwell = 0, pv = null, pvTimer = 0;
  function stopPreview() {
    clearTimeout(dwell); clearTimeout(pvTimer);
    if (pv) { pv.parentNode && pv.parentNode.classList.remove("vid-on"); pv.remove(); pv = null; }
  }
  function startPreview(card) {
    const img = card.querySelector("img[data-yt]"); const id = img && img.dataset.yt;
    if (!id || !canPreview || document.body.style.overflow === "hidden") return;
    const media = card.querySelector(".work-media");
    const f = document.createElement("iframe");
    f.className = "pv"; f.setAttribute("sandbox", "allow-scripts allow-same-origin"); f.setAttribute("aria-hidden", "true"); f.tabIndex = -1; f.setAttribute("allow", "autoplay");
    f.referrerPolicy = "strict-origin-when-cross-origin";
    f.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&modestbranding=1&playsinline=1&rel=0&disablekb=1&enablejsapi=1&origin=${encodeURIComponent(location.origin)}`;
    f.addEventListener("load", () => { try { f.contentWindow.postMessage(JSON.stringify({ event: "listening", id: 1 }), "https://www.youtube-nocookie.com"); } catch (e) {} });
    media.insertBefore(f, media.querySelector(".play")); pv = f;
    pvTimer = setTimeout(stopPreview, 9000);   /* si no arranca (no embebible), se descarta */
  }
  /* el iframe avisa cuando realmente está reproduciendo: recién ahí se muestra */
  addEventListener("message", e => {
    if (!pv || e.source !== pv.contentWindow || e.origin !== "https://www.youtube-nocookie.com") return;
    let d; try { d = typeof e.data === "string" ? JSON.parse(e.data) : e.data; } catch (_) { return; }
    const st = d && d.info && d.info.playerState;
    if (st === 1) { clearTimeout(pvTimer); pv.parentNode.classList.add("vid-on"); }
    else if (d && d.event === "onError") stopPreview();
  });
  /* ---- mobile: la tarjeta del centro de la pantalla se "activa" sola; 1.er toque = preview, 2.º = modal ---- */
  if (touch) {
    let armed = null, ticking = false;
    const setLive = card => {
      if (card === cur) return;
      stopPreview();
      if (cur) cur.classList.remove("live");
      cur = card; armed = null;
      if (!card) return;
      card.classList.add("live");
      card.style.setProperty("--gx", "50%"); card.style.setProperty("--gy", "50%");
      dwell = setTimeout(() => startPreview(card), 800);
    };
    const pick = () => {
      ticking = false;
      if (document.hidden || document.body.style.overflow === "hidden") { setLive(null); return; }
      const mid = innerHeight / 2; let best = null, bd = innerHeight * .22;
      grid.querySelectorAll(".work-card").forEach(c => {
        const r = c.querySelector(".work-media").getBoundingClientRect();
        if (!r.height) return;
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bd) { bd = d; best = c; }
      });
      setLive(best);
    };
    const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(pick); } };
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
    document.addEventListener("visibilitychange", queue);
    pick();
    grid.addEventListener("click", e => {
      const card = e.target.closest(".work-card"); if (!card) return;
      const playable = canPreview && card.querySelector("img[data-yt]");
      if (!playable || armed === card) return;          /* 2.º toque (o sin preview posible): sigue al modal */
      e.preventDefault(); e.stopPropagation();
      armed = card;
      if (card !== cur) { card.scrollIntoView({ behavior: "smooth", block: "center" }); setLive(card); armed = card; }
      else if (!pv) { clearTimeout(dwell); startPreview(card); }
    }, true);
    return;
  }
  grid.addEventListener("pointermove", e => {
    const card = e.target.closest(".work-card"); if (!card) return;
    const m = card.querySelector(".work-media"); const r = m.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      card.style.setProperty("--ry", ((x - .5) * 9).toFixed(2) + "deg");
      card.style.setProperty("--rx", ((.5 - y) * 7).toFixed(2) + "deg");
      card.style.setProperty("--gx", (x * 100).toFixed(1) + "%"); card.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
    });
  });
  grid.addEventListener("pointerover", e => {
    const card = e.target.closest(".work-card"); if (!card || card === cur) return;
    stopPreview(); cur = card; card.classList.add("tilting");
    dwell = setTimeout(() => startPreview(card), 650);
  });
  grid.addEventListener("pointerout", e => {
    const card = e.target.closest(".work-card"); if (!card || card.contains(e.relatedTarget)) return;
    card.classList.remove("tilting"); card.style.removeProperty("--rx"); card.style.removeProperty("--ry");
    if (cur === card) { cur = null; stopPreview(); }
  });
})();
