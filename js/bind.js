/* bind.js — Íconos, textos enlazados al contenido y redes. */

const ICONS = {
  instagram: '<svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.9-.1zM12 0C8.7 0 8.3 0 7 .1 5.8.1 4.9.3 4.1.6c-.8.3-1.5.7-2.2 1.4C1.2 2.7.8 3.4.5 4.2.3 5 .1 5.8.1 7 0 8.3 0 8.7 0 12s0 3.7.1 5c0 1.2.2 2.1.5 2.9.3.8.7 1.5 1.4 2.2.7.7 1.4 1.1 2.2 1.4.8.3 1.6.5 2.9.5 1.3.1 1.7.1 5 .1s3.7 0 5-.1c1.2 0 2.1-.2 2.9-.5.8-.3 1.5-.7 2.2-1.4.7-.7 1.1-1.4 1.4-2.2.3-.8.5-1.6.5-2.9.1-1.3.1-1.7.1-5s0-3.7-.1-5c0-1.2-.2-2.1-.5-2.9-.3-.8-.7-1.5-1.4-2.2C21.3 1.2 20.6.8 19.8.5c-.8-.3-1.6-.5-2.9-.5C15.7 0 15.3 0 12 0zm0 5.8A6.2 6.2 0 1 0 18.2 12 6.2 6.2 0 0 0 12 5.8zm0 10.2A4 4 0 1 1 16 12a4 4 0 0 1-4 4zM19.8 4.2a1.4 1.4 0 1 1-1.4-1.4 1.4 1.4 0 0 1 1.4 1.4z"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24"><path d="M19.6 5.8a4.8 4.8 0 0 1-3.4-3.7V1.5h-3.3v13.7a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9a6.2 6.2 0 1 0 5.3 6.1V8.6a8 8 0 0 0 4.7 1.5V6.8a4.8 4.8 0 0 1-1.3-1z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path transform="translate(13.5 12) scale(1.167) translate(-13.5 -12)" d="M8 7.7Q8 5 10.354 6.319L17.186 10.144Q20.5 12 17.186 13.856L10.354 17.681Q8 19 8 16.3Z"/></svg>',
  eye: '<svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5zm0 12.5a5 5 0 1 1 5-5 5 5 0 0 1-5 5zm0-8a3 3 0 1 0 3 3 3 3 0 0 0-3-3z"/></svg>'
};

/* ---- binds de texto ---- */
document.querySelectorAll("[data-bind]").forEach(el => {
  const k = el.dataset.bind;
  if (CONFIG[k]) el.textContent = CONFIG[k];
});
/* año del copyright: arranca en 2026 y el final es el año en curso ("2026 - 2027", "2026 - 2028"…).
   Sin JS queda el "2026" fijo del HTML. */
(function () {
  const START = 2026, now = new Date().getFullYear();
  document.getElementById("copyYear").textContent = now > START ? START + " - " + now : String(START);
})();
document.getElementById("mailBtn").href = "mailto:" + CONFIG.email;
document.getElementById("phoneBtn").href = "tel:" + CONFIG.phone.replace(/[^+\d]/g, "");

/* ---- botón del email: al click COPIA la dirección y muestra un aviso sutil "Copiado ✓" (1,6 s).
   Portapapeles moderno; si el navegador lo niega, textarea + execCommand; si nada copia,
   sigue el mailto: normal. Click con rueda / Ctrl+click siguen abriendo el mail. ---- */
(function () {
  const b = document.getElementById("mailBtn"), tip = b.querySelector(".copy-tip");
  let tm = 0;
  const legacyCopy = txt => {
    const ta = Object.assign(document.createElement("textarea"), { value: txt, readOnly: true });
    ta.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand("copy"); } catch {}
    ta.remove(); b.focus({ preventScroll: true });
    return ok;
  };
  b.addEventListener("click", async e => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    let ok = false;
    try { await navigator.clipboard.writeText(CONFIG.email); ok = true; } catch { ok = legacyCopy(CONFIG.email); }
    if (!ok) { location.href = "mailto:" + CONFIG.email; return; }
    tip.textContent = t("Copiado ✓");
    b.classList.add("copied");
    clearTimeout(tm);
    tm = setTimeout(() => { b.classList.remove("copied"); tip.textContent = ""; }, 1600);
  });
})();

/* ---- redes ---- */
document.getElementById("socials").innerHTML = CONFIG.socials.map(s =>
  `<a data-net="${esc(s.id)}" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${ICONS[s.id] || ""}${esc(s.label)}</a>`).join("");
