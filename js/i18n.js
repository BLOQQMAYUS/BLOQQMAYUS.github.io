/* i18n.js — Idioma ES / EN con un solo clic. El español es el original (index.html); acá vive la traducción al inglés.
   · Textos fijos del HTML: tabla S de abajo (selector → inglés). Se guarda el original y se alterna sin recargar.
   · Textos que arma el JS (modal, fichas, "Copiado"): t("texto en español") devuelve el inglés si el idioma es EN.
   · Para sumar un texto nuevo: agregarlo a S (si está en el HTML) o a T (si lo arma un .js). */
/* un solo global: t() */
var t;
(function () {
let LANG = "es";
try { if (localStorage.getItem("lang") === "en") LANG = "en"; } catch (e) {}

/* ---- textos armados por JS ---- */
const T = {
  "Copiado ✓": "Copied ✓",
  "Más en la Galería ↓": "More in the Gallery ↓",
  "Videoclip oficial": "Official music video",
  "Lyric video oficial": "Official lyric video",
  "Artista": "Artist", "Año": "Year", "Rol": "Role", "Cámara": "Camera",
  "Ver en YouTube": "Watch on YouTube", "Ver en YouTube ↗": "Watch on YouTube ↗",
  "Ver en Vimeo ↗": "Watch on Vimeo ↗", "Abrir video ↗": "Open video ↗",
  "Director Creativo · Filmmaker · Editor · VFX": "Creative Director · Filmmaker · Editor · VFX"
};
t = s => (LANG === "en" && T[s]) || s;

/* ---- textos fijos del HTML: [selector, inglés, atributo?]  (array = uno por cada coincidencia, en orden) ---- */
const S = [
  ["title", "Francisco Benítez — BLOQQ MÁYUS · Filmmaker &amp; Vertical Content"],
  [".skip", "Skip to content"],
  [".nl-l a:nth-child(1)", "Works"], [".nl-l a:nth-child(2)", "Vertical"],
  [".nl-r a:nth-child(1)", "Services"], [".nl-r a.cta", "Contact"],
  [".nav-links .logo", "Back to top", "aria-label"],
  [".avail", '<i aria-hidden="true"></i>Available for projects <span>· I reply within 24 HRS</span>'],
  [".hn-low", ["switch on", "from lowercase to"]], [".hn-acid", "UPPERCASE"],
  [".hero-sub", 'Audiovisual filmmaker with <b>10+ years of experience</b> in production and post-production for brands and production companies.<span class="ht-long"> I take every project from brief to delivery with narrative judgment, visual standards and schedule management, building <span class="hs-u">lasting working relationships</span>.</span><span class="ht-short"> From brief to delivery, with narrative judgment and schedule management.</span>'],
  ["#proof", "The work in numbers", "aria-label"],
  [".stat dt", ["years in the craft", "official music videos", "artists"]],
  ["#trabajo .kicker", "<b>01 ·</b> Music videos"],
  ["#trabajo h2", "Official music videos"],
  ["#trabajo .sec-desc", "Projects conceived from the brief and built in Premiere Pro, After Effects, Photoshop, Illustrator, plus agentic / generative AI tools to boost the workflow."],
  ["#moreBtn", "More in the Gallery ↓"],
  ["#moreBtn", "Go to Contact and open the 3D Gallery", "aria-label"],
  ["#vertical .kicker", "<b>02 ·</b> 2D &amp; 3D animation"],
  ["#vertical h2", "Vertical content"],
  ["#wheelDots", "Pick a piece from the wheel", "aria-label"],
  ["#servicios .kicker", "<b>03 ·</b> Services"],
  ["#servicios h2", 'My system,<br>your results. <span class="h2-hint tip">(Click one)</span>'],
  [".serv h3", ["Creative direction", "Post, Color &amp; VFX", "Old school works, Juan", "Vertical strategy"]],
  [".serv p", [
    "Concept, script and direction, from brief to final delivery.",
    "Editing, color grading, VFX, 2D/3D animation and motion graphics are the raw material.",
    "Team horizontal forever: narrative and long format.",
    "The content wave never stops. 4:5 and 9:16 packs for Reels, TikTok and Shorts."]],
  ["#contacto .kicker", "<b>04 ·</b> Contact"],
  ["#contacto h2", 'switch on the <span class="nw">bloqq <em>MÁYUS</em></span>'],
  ["#ledBtn", "Open the 3D Gallery", "aria-label"], ["#ledBtn", "Open the 3D Gallery", "title"],
  ["#contactBox > p", "Tell me about your project — we take your idea to the brief, and my system delivers RESULTS."],
  [".foot-ind", "<i></i> MADE IN ARGENTINA"],
  ["#galFrame", "3D Gallery — BLOQQ MÁYUS", "title"],
  ["#galX", "Close gallery", "aria-label"],
  ["#ltPanel", "Light table", "aria-label"], ["#ltX", "Close light table", "aria-label"],
  ["#modalX", "Close", "aria-label"]
];
/* prefijos de aria-label que arma el JS en tarjetas y puntos de la rueda */
const AP = [["Ver ", "View "], ["Ir a ", "Go to "]];

const attrOf = (el, a) => el.getAttribute(a);
S.forEach(([sel, en, attr]) => {
  document.querySelectorAll(sel).forEach((el, i) => {
    const list = Array.isArray(en) ? en : [en];
    if (list[i] == null) return;
    el._i = { en: list[i], attr, es: attr ? attrOf(el, attr) : (sel === "title" ? el.textContent : el.innerHTML) };
    (el._all || (el._all = [])).push(el._i);
  });
});

/* títulos que se tipean (effects.js): al cambiar idioma se vuelven a partir en letras */
function resplit(h2) {
  h2.setAttribute("aria-label", h2.textContent.replace(/\s+/g, " ").trim());
  const started = h2._ty && h2._ty[0] && h2._ty[0].classList.contains("on");
  if (!h2._ty) return;
  const spans = [];
  const walk = node => [...node.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      [...n.textContent].forEach(ch => {
        const s = document.createElement("span"); s.className = "ty" + (started ? " on" : ""); s.textContent = ch;
        s.setAttribute("aria-hidden", "true"); frag.appendChild(s); spans.push(s);
      });
      n.replaceWith(frag);
    } else if (n.nodeType === 1 && n.tagName !== "BR" && !n.classList.contains("h2-hint")) walk(n);
  });
  walk(h2); h2._ty = spans;
}

function applyLang() {
  const en = LANG === "en";
  document.documentElement.lang = en ? "en" : "es";
  S.forEach(([sel]) => document.querySelectorAll(sel).forEach(el => {
    (el._all || []).forEach(o => {
      const v = en ? o.en : o.es;
      if (o.attr) el.setAttribute(o.attr, v);
      else if (el.tagName === "TITLE") el.textContent = v.replace(/&amp;/g, "&");
      else el.innerHTML = v;
    });
    if (el.tagName === "H2" && el._all && el._all.length) resplit(el);
  }));
  const from = en ? 0 : 1, to = en ? 1 : 0;
  document.querySelectorAll("[aria-label]").forEach(el => {
    const a = el.getAttribute("aria-label");
    AP.forEach(p => { if (a.startsWith(p[from])) el.setAttribute("aria-label", p[to] + a.slice(p[from].length)); });
  });
  const b = document.getElementById("langBtn");
  if (b) { b.setAttribute("aria-label", en ? "Cambiar a español" : "Switch to English"); b.dataset.lang = LANG; }
}

function setLang(l) {
  LANG = l === "en" ? "en" : "es";
  try { localStorage.setItem("lang", LANG); } catch (e) {}
  applyLang();
}
document.getElementById("langBtn").addEventListener("click", () => setLang(LANG === "en" ? "es" : "en"));
/* Una pasada previa a effects.js (los títulos aún no se partieron) y otra cuando el DOM ya tiene las tarjetas. */
if (LANG === "en") applyLang();
document.addEventListener("DOMContentLoaded", () => { if (LANG === "en") applyLang(); });
document.getElementById("langBtn").setAttribute("aria-label", LANG === "en" ? "Cambiar a español" : "Switch to English");
document.getElementById("langBtn").dataset.lang = LANG;
})();
