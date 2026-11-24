/* lighttables.js — 04 · Mesas de ideas del Toolbox (apagadas: LIGHTTABLES_ON). */
/* ---- mesas de luz del Toolbox: una superficie clara por categoría.
   Tipos soportados: yt (YouTube), video (MP4 propio), img, doc.
   Para sumar piezas: agregar entradas acá (o pasame los links y las cargo). ---- */
/* ---- MESAS DE IDEAS DEL TOOLBOX ------------------------------------------
   Función terminada pero APAGADA a propósito: falta preparar el contenido de
   cada rama. Para reactivarla alcanza con poner este valor en true — vuelven
   solos el "(Clickeá una)" del h2, el click de las 4 tarjetas y las mesas.
   Apagada: las tarjetas quedan informativas, conservan el "+" y el hover como
   anticipo, salen del orden de tabulación y se anuncian deshabilitadas.
   NO se borra nada: LIGHTTABLES, openLT/closeLT y #ltBox siguen intactos. */
const LIGHTTABLES_ON = false;

const LIGHTTABLES = {
  direccion: { title: "Dirección creativa", acc: "#F2A51A",
    desc: "Mesa de ideas · del concepto al set: tratamiento visual, frames de rodaje y detrás de escena.",
    items: [
    { t: "yt", id: "Csj207PWog0", title: "Showreel 2026", sub: "dirección · reel" },
    { t: "ph", ar: "16/9", label: "Frame de rodaje", fmt: "16:9 · horizontal" },
    { t: "yt", id: "Y2o1pV-uG6I", title: "Palo Santo", sub: "Tierras Raras · 2026" },
    { t: "ph", ar: "1/1", label: "Still de set", fmt: "1:1 · cuadrado" },
    { t: "yt", id: "5Xf4IfjnmFw", title: "Hard-street", sub: "B13X & Showsa · 2026" },
    { t: "ph", ar: "9/16", label: "Detrás de escena", fmt: "9:16 · vertical" },
    { t: "yt", id: "N2OL2nSRO20", title: "Apagón", sub: "Sherpa & Ajitawira · 2026" },
    { t: "yt", id: "Yuh5ulasmBA", title: "Los Beatles", sub: "Tierras Raras · 2026" }
  ]},
  post: { title: "Post, Color & VFX", acc: "#B8321F",
    desc: "Mesa de ideas · color, VFX y 3D: antes/después, stills etalonados y renders del proceso.",
    items: [
    { t: "video", n: "BLOQQ MÁYUS_HDP Ando Baires_01.mp4", title: "HDP Ando Baires · 01", sub: "3D · VFX" },
    { t: "ph", ar: "1/1", label: "Antes / después de color", fmt: "1:1 · cuadrado" },
    { t: "video", n: "BLOQQ MÁYUS_HDP Ando Baires_02.mp4", title: "HDP Ando Baires · 02", sub: "3D · VFX" },
    { t: "ph", ar: "16/9", label: "Frame etalonado", fmt: "16:9 · horizontal" },
    { t: "video", n: "CHECHA_Rifa.mp4", title: "CHECHA Rifa", sub: "3D · VFX" },
    { t: "ph", ar: "9/16", label: "Render 3D en proceso", fmt: "9:16 · vertical" },
    { t: "yt", id: "oxOTVVbyYFA", title: "Luna Nueva", sub: "Lihuel Yair ft. El Soud · VFX + lyric" },
    { t: "yt", id: "HAxRAyv8Ll8", title: "Tai Chi & Full Contact", sub: "iQ.NO1" }
  ]},
  viejo: { title: "Lo viejo funciona, Juan", acc: "#D9737F",
    desc: "Mesa de ideas · archivo 2020–2023 que sigue vigente: VFX, animación 2D/3D y montaje con oficio.",
    items: [
    { t: "yt", id: "bIVLTBuUCj8", title: "En tu camino", sub: "Sello De Luna ft. Nakko FG · 2020 · animación 2D/3D" },
    { t: "ph", ar: "16/9", label: "Pieza de archivo rescatada", fmt: "16:9 · horizontal" },
    { t: "yt", id: "PyPTavYcGUQ", title: "Si me hago viral", sub: "Seal G · 2020 · VFX + etalonaje" },
    { t: "ph", ar: "4/5", label: "Arte / poster de la pieza", fmt: "4:5 · vertical suave" },
    { t: "yt", id: "DcKFx7KnNSk", title: "Mahfackas", sub: "Delni · 2021 · VFX + etalonaje" },
    { t: "ph", ar: "1/1", label: "Fotograma memorable", fmt: "1:1 · cuadrado" },
    { t: "yt", id: "GZgUjji0K-o", title: "Siento que corone", sub: "Seal G · 2021 · VFX + etalonaje" },
    { t: "yt", id: "hTIK3eSvI3M", title: "Tabla Esmeralda", sub: "B13X & Lasistta · 2023" }
  ]},
  vertical: { title: "Estrategia Vertical", acc: "#B5E61D",
    desc: "Mesa de ideas · 9:16 que retiene: hooks de apertura, series de contenido y resultados.",
    items: [
    { t: "video", n: "BLOQQ MÁYUS_FACTS.mp4", title: "FACTS", sub: "9:16 · artista" },
    { t: "ph", ar: "9/16", label: "Hook de apertura", fmt: "9:16 · vertical" },
    { t: "video", n: "AL SALA BO_ Oscar Wilde.mp4", title: "Oscar Wilde", sub: "AL SALA BO · 9:16" },
    { t: "ph", ar: "1/1", label: "Placa / resultado de métricas", fmt: "1:1 · cuadrado" },
    { t: "video", n: "LIHUEL YAIR_La vuelta del Zaraza.mp4", title: "La vuelta del Zaraza", sub: "LIHUEL YAIR · 9:16" },
    { t: "ph", ar: "9/16", label: "Serie de contenido", fmt: "9:16 · vertical" },
    { t: "video", n: "BLOQQ MÁYUS_HDP Ando Baires_04.mp4", title: "HDP Ando Baires · 04", sub: "3D · 9:16" }
  ]}
};
const ltBox = document.getElementById("ltBox"), ltBg = document.getElementById("ltBg");
const ltPanel = document.getElementById("ltPanel"), ltGrid = document.getElementById("ltGrid");
let ltOpen = false, ltCat = null;
const ltVideo = n => ({
  title: n, lo: "assets/reels-lo/" + encodeURIComponent(n),
  src: "assets/reels/" + encodeURIComponent(n),
  poster: "assets/posters/" + encodeURIComponent(n.replace(/\.mp4$/i, ".jpg"))
});
function openLT(cat) {
  const tb = LIGHTTABLES[cat];
  if (!tb || ltOpen) return;
  ltCat = cat; ltOpen = true;
  layerPush("lt", closeLT);
  ltPanel.style.setProperty("--lt-acc", tb.acc);
  document.getElementById("ltTitle").textContent = tb.title;
  const real = tb.items.filter(i => i.t !== "ph").length;
  const phs = tb.items.length - real;
  document.getElementById("ltCount").textContent = real + " piezas" + (phs ? " · " + phs + " espacios" : "");
  document.getElementById("ltDesc").textContent = tb.desc || "";
  const IMG_ICO = '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>';
  ltGrid.innerHTML = tb.items.map((it, i) => {
    /* cada preview respeta la relación de aspecto original del archivo */
    if (it.t === "ph") {
      return `<span class="lt-item lt-phwrap" data-i="${i}">
        <span class="lt-thumb lt-ph" style="aspect-ratio:${esc(it.ar)};border-color:${esc(tb.acc)};color:${esc(tb.acc)}">
          ${IMG_ICO}<b>${esc(it.label)}</b><span>${esc(it.fmt)}</span></span>
        <span class="lt-cap">${esc(it.label)}<em>próximamente · ${esc(it.fmt)}</em></span></span>`;
    }
    const ar = it.t === "yt" ? "16/9" : "9/16";
    const thumb = it.t === "yt" ? `https://i.ytimg.com/vi/${it.id}/hqdefault.jpg` : ltVideo(it.n).poster;
    const badge = it.t === "yt" ? "▶ youtube" : "▶ video 9:16";
    const play = `<span class="lt-play"><i>${ICONS.play}</i></span>`;
    return `<button type="button" class="lt-item" data-i="${i}">
      <span class="lt-thumb" style="aspect-ratio:${ar}"><img src="${esc(thumb)}" alt="" loading="lazy" draggable="false"><span class="lt-badge ${it.t}">${badge}</span>${play}</span>
      <span class="lt-cap">${esc(it.title)}<em>${esc(it.sub || "")}</em></span></button>`;
  }).join("");
  ltBox.classList.add("open");
  void ltPanel.offsetWidth;
  ltBox.classList.add("on");
  document.body.style.overflow = "hidden";
}
function closeLT(fromPop) {
  if (!ltOpen) return;
  ltOpen = false;
  if (!fromPop) layerDrop("lt");
  ltBox.classList.remove("on");
  setTimeout(() => { if (!ltOpen) { ltBox.classList.remove("open"); ltGrid.innerHTML = ""; } }, 380);
  document.body.style.overflow = (modal.classList.contains("open") || rlPhase) ? "hidden" : "";
}
ltBg.addEventListener("click", () => closeLT());
document.getElementById("ltX").addEventListener("click", () => closeLT());
ltGrid.addEventListener("click", e => {
  const b = e.target.closest(".lt-item");
  if (!b || !ltCat) return;
  const it = LIGHTTABLES[ltCat].items[+b.dataset.i];
  if (it.t === "ph") return;                 // placeholder: aún sin contenido
  if (it.t === "yt") {
    openModal({ title: it.title, img: `https://i.ytimg.com/vi/${it.id}/hqdefault.jpg`,
      video: `https://www.youtube.com/watch?v=${it.id}`, meta: it.sub || "" });
  } else if (it.t === "video") {
    const v = ltVideo(it.n);
    openReel([{ ...v, title: it.title }], 0, b.querySelector(".lt-thumb"));
  } else {
    window.open(it.src || it.href, "_blank", "noopener");
  }
});
document.querySelectorAll(".serv").forEach(c => {
  if (!LIGHTTABLES_ON) {
    c.setAttribute("aria-disabled", "true");
    c.tabIndex = -1;
    c.classList.add("serv-off");
    return;
  }
  c.addEventListener("click", () => openLT(c.dataset.lt));
});
const servHint = document.querySelector("#servicios .h2-hint");
if (servHint) servHint.style.display = LIGHTTABLES_ON ? "" : "none";
