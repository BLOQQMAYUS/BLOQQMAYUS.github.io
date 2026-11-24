/* layers.js — Botón atrás por capas (historial) y previews no arrastrables. */
/* ---- ninguna preview seleccionable ni arrastrable ---- */
document.querySelectorAll("img").forEach(i => { i.draggable = false; });
document.addEventListener("dragstart", e => {
  if (e.target.closest && e.target.closest(".film,.reel-card")) e.preventDefault();
});

/* ---- botón "atrás" del celular / gestos: cierra la capa de arriba y te
   deja exactamente donde estabas, en vez de recargar o salir del sitio.
   Cada capa abierta empuja una entrada; al volver atrás se cierra sola.
   El cierre por UI consume su propia entrada (layerSync evita el doble). ---- */
const layerStack = [];
let layerSync = 0;
function layerPush(name, closeFn) {
  layerStack.push({ name, closeFn });
  history.pushState({ bloqq: layerStack.length }, "");
}
function layerDrop(name, extra) {
  const i = layerStack.findIndex(l => l.name === name);
  if (i < 0) return;
  layerStack.splice(i, 1);
  layerSync++;
  history.go(-(1 + (extra || 0)));
}
function closeTopLayer() {
  const top = layerStack[layerStack.length - 1];
  if (top) top.closeFn(false);
}
addEventListener("popstate", () => {
  if (layerSync > 0) { layerSync--; return; }
  const top = layerStack.pop();
  if (top) top.closeFn(true);
});
