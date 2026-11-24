// Chequeo de orden de carga: los <script src> de index.html comparten el ámbito global, pero una
// función declarada en un archivo POSTERIOR no existe todavía cuando corre el código de uno anterior.
// Lista cada función usada en un archivo que carga antes que el suyo (revisar si se llama al cargar).
//   node tests/hoist-check.cjs
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");
const order = [...fs.readFileSync(path.join(ROOT, "index.html"), "utf8").matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
const src = order.map(f => fs.readFileSync(path.join(ROOT, f), "utf8"));
let n = 0;
order.forEach((f, i) => {
  for (const m of src[i].matchAll(/^(?:async )?function\s+(\w+)/gm)) {
    const name = m[1];
    const users = order.filter((g, j) => j < i && new RegExp("\\b" + name + "\\b").test(src[j]));
    if (users.length) { n++; console.log(name, "en", f, "<- usada antes en", users.join(", ")); }
  }
});
console.log(n ? n + " a revisar" : "orden de carga OK");
