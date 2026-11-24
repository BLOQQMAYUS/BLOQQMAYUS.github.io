/* reels.js — Reels: auto-descubrimiento por la API de GitHub. */
/* ---- reels · auto-descubrimiento + dos film strips (3D / Videoclips) ---- */
const REEL_API = "https://api.github.com/repos/BLOQQMAYUS/BLOQQMAYUS.github.io/contents/assets/reels";
const FALLBACK_REELS = ["BLOQQ MÁYUS_HDP Ando Baires_01.mp4", "BLOQQ MÁYUS_HDP Ando Baires_02.mp4", "BLOQQ MÁYUS_HDP Ando Baires_03.mp4", "BLOQQ MÁYUS_HDP Ando Baires_04.mp4", "CHECHA_Rifa.mp4", "AL SALA BO_ Oscar Wilde.mp4", "BLOQQ MÁYUS_FACTS.mp4", "LIHUEL YAIR_La vuelta del Zaraza.mp4"];
const is3D = n => /HDP/i.test(n) || /CHECHA/i.test(n);
function reelTitle(n) {
  return n.replace(/\.mp4$/i, "")
    .replace(/^BLOQQ MÁYUS[_\s]+/i, "")
    .replace(/promo\d+v\d+/i, "Promo")
    .replace(/_(\d+)$/, " · $1")
    .split(/[_\s]+/).filter(t => t && !/^v\d+$/i.test(t)).join(" ");
}
/* Click-to-play: ningún video descarga ni reproduce hasta que se clickea.
   Un solo video inline activo a la vez (registro global) → cero decoders simultáneos. */
