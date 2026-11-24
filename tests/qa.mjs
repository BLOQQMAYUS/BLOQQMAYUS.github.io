// QA del sitio por CDP con Edge headless (sin dependencias: Node ≥ 22).
//   node tests/qa.mjs <carpeta-salida>          → capturas + huella + chequeos
//   node tests/qa.mjs <salida> --compare <otra>  → además compara la huella con otra corrida
// Determinista: Math.random con semilla, sin api.github.com ni i.ytimg.com (usa los respaldos locales),
// prefers-reduced-motion para congelar animaciones en las capturas.
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs'; import path from 'node:path'; import http from 'node:http';
import crypto from 'node:crypto'; import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const OUT = path.resolve(process.argv[2] || path.join(ROOT, '_plan', 'qa'));
const CMP = process.argv.includes('--compare') ? path.resolve(process.argv[process.argv.indexOf('--compare') + 1]) : null;
const PORT = 8790, CDP = 9351, sleep = ms => new Promise(r => setTimeout(r, ms));
const EDGE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find(fs.existsSync);
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };

// servidor estático mínimo
const srv = http.createServer((q, s) => {
  let p = decodeURIComponent(new URL(q.url, 'http://x').pathname); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { s.writeHead(404); return s.end(); }
  s.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(s);
}).listen(PORT);

const prof = path.join(process.env.TEMP, 'sitio-qa-' + Date.now());
const ed = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${CDP}`, `--user-data-dir=${prof}`, '--no-first-run', '--mute-audio', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const bye = code => { try { ed.kill(); } catch {} spawnSync('powershell', ['-NoProfile', '-Command', `Get-CimInstance Win32_Process -Filter "Name='msedge.exe'" | ? CommandLine -match 'sitio-qa-' | % { Stop-Process -Id $_.ProcessId -Force -EA SilentlyContinue }`]); srv.close(); process.exit(code); };

async function waitFor(fn, ms, what) { const t = Date.now(); for (;;) { try { const v = await fn(); if (v) return v; } catch {} if (Date.now() - t > ms) throw new Error('timeout ' + what); await sleep(200); } }

const page = await waitFor(async () => (await (await fetch(`http://127.0.0.1:${CDP}/json`)).json()).find(t => t.type === 'page'), 20000, 'Edge');
const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
let id = 0; const pend = new Map(), errs = [];
ws.onmessage = m => { const j = JSON.parse(m.data);
  if (j.id && pend.has(j.id)) { pend.get(j.id)(j); pend.delete(j.id); return; }
  if (j.method === 'Runtime.exceptionThrown') errs.push('excepción: ' + (j.params.exceptionDetails.exception?.description || j.params.exceptionDetails.text).split('\n')[0]);
  if (j.method === 'Runtime.consoleAPICalled' && j.params.type === 'error') errs.push('console.error: ' + j.params.args.map(a => a.value ?? a.description).join(' '));
  if (j.method === 'Log.entryAdded' && j.params.entry.level === 'error' && !/i\.ytimg|api\.github|ERR_BLOCKED/.test(j.params.entry.text + (j.params.entry.url || ''))) errs.push(j.params.entry.source + ': ' + j.params.entry.text + ' ' + (j.params.entry.url || ''));
};
const cmd = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pend.set(i, j => j.error ? rej(new Error(method + ': ' + j.error.message)) : res(j.result)); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async expr => { const r = await cmd('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; };

await cmd('Runtime.enable'); await cmd('Log.enable'); await cmd('Page.enable'); await cmd('Network.enable');
await cmd('Network.setBlockedURLs', { urls: ['*api.github.com*', '*i.ytimg.com*', '*youtube*'] });
await cmd('Page.addScriptToEvaluateOnNewDocument', { source: `(()=>{let s=1234567;Math.random=()=>((s=Math.imul(s^(s>>>15),2246822507)+0x6D2B79F5|0)>>>0)/4294967296;})();` });
fs.mkdirSync(OUT, { recursive: true });

// huella: estructura del DOM + estilos computados de cada elemento visible (sin canvas ni contadores de tiempo)
const FP = `(() => {
  const P = ['display','position','width','height','margin','padding','font-family','font-size','font-weight','line-height','letter-spacing','color','background-color','background-image','border','border-radius','box-shadow','opacity','transform','grid-template-columns','gap','justify-content','align-items','text-transform','z-index','filter','mask-image','object-position','animation-name','transition'];
  const out = [];
  for (const el of document.body.querySelectorAll('*')) {
    if (el.closest('canvas,#tc,script')) continue;
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    // la rueda se arma con datos asíncronos: su ORDEN varía entre corridas, el contenido se compara aparte
    // lo mismo para filtros y grilla de obras: el orden aleatorio depende de cuántos sorteos hizo el campo de estrellas antes
    if (el.closest('#filters,#workGrid')) { out.push(el.tagName + '|' + (el.className.baseVal ?? el.className) + '|' + P.filter(p => !/width|height/.test(p)).map(p => cs.getPropertyValue(p)).join(';')); continue; }
    const inWheel = !!el.closest('#wheelRotor');
    const attrs = [...el.attributes].filter(a => !(inWheel && /^(aria-label|src|alt|title)$/.test(a.name))).map(a => a.name + '=' + a.value).sort().join(' ');
    if (inWheel && !el.childElementCount) { out.push(el.tagName + '|' + attrs + '|' + P.map(p => cs.getPropertyValue(p)).join(';')); continue; }
    out.push(el.tagName + '|' + attrs + '|' + Math.round(r.x) + ',' + Math.round(r.y + scrollY) + ',' + Math.round(r.width) + 'x' + Math.round(r.height) + '|' + P.map(p => cs.getPropertyValue(p)).join(';') + '|' + (el.childElementCount ? '' : (el.textContent || '').trim().slice(0, 80)));
  }
  out.push('FILTROS ' + [...document.querySelectorAll('#filters button')].map(e => e.textContent.trim()).sort().join(' / '));
  out.push('OBRAS ' + [...document.querySelectorAll('#workGrid img')].map(e => e.alt).sort().join(' / '));
  out.push('RUEDA ' + [...document.querySelectorAll('#wheelRotor [aria-label]')].map(e => e.getAttribute('aria-label')).sort().join(' / '));
  return out;
})()`;

const checks = [];
const ok = (name, v) => { checks.push((v ? 'OK   ' : 'FALLA') + ' ' + name); };
const result = {};
for (const [tag, w, h, mobile] of [['desktop', 1440, 900, false], ['mobile', 390, 844, true]]) {
  await cmd('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile });
  await cmd('Emulation.setTouchEmulationEnabled', { enabled: mobile });
  await cmd('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await cmd('Page.navigate', { url: `http://127.0.0.1:${PORT}/?qa=${tag}` });
  await waitFor(() => ev('document.readyState === "complete" && document.fonts.status === "loaded"'), 20000, 'carga');
  await sleep(1500);
  // forzar todos los .reveal visibles y las imágenes diferidas cargadas, para capturas y huella estables
  await ev(`(async()=>{document.querySelectorAll('.reveal').forEach(e=>e.classList.add('in'));document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.complete?0:new Promise(r=>{i.onload=i.onerror=r;setTimeout(r,4000)})));window.scrollTo(0,0);})()`);
  await sleep(800);
  const fp = await ev(FP);
  result[tag] = fp;
  fs.writeFileSync(path.join(OUT, `huella-${tag}.txt`), fp.join('\n'));
  // capturas por sección
  for (const sec of ['top', 'trabajo', 'vertical', 'servicios', 'contacto']) {
    const y = await ev(`(()=>{const e=document.getElementById('${sec}');return e?Math.round(e.getBoundingClientRect().top+scrollY):0})()`);
    await ev(`window.scrollTo(0, ${y})`); await sleep(500);
    const shot = await cmd('Page.captureScreenshot', { format: 'jpeg', quality: 82 });
    fs.writeFileSync(path.join(OUT, `${tag}-${sec}.jpg`), Buffer.from(shot.data, 'base64'));
  }
  await ev('window.scrollTo(0,0)');
  // chequeos de conducta
  ok(`${tag}: pliegue de obras = ${mobile ? 5 : 6}`, await ev(`document.querySelectorAll('#workGrid > *:not([hidden])').length`) >= (mobile ? 5 : 6));
  ok(`${tag}: filtros de artista`, await ev(`document.querySelectorAll('#filters button').length`) > 3);
  ok(`${tag}: rueda con 8 verticales`, await ev(`document.querySelectorAll('#wheelRotor > *').length`) === 8);
  ok(`${tag}: 4 tarjetas de servicios`, await ev(`document.querySelectorAll('.serv-grid .serv').length`) === 4);
  ok(`${tag}: sin scroll horizontal`, await ev(`document.documentElement.scrollWidth <= innerWidth`));
  await ev(`document.querySelector('#filters button').click()`); await sleep(300);
  ok(`${tag}: filtrar por artista muestra sus obras`, await ev(`document.querySelectorAll('#workGrid > *').length`) >= 1);
  await ev(`document.querySelector('#filters button').click()`); await sleep(300);
  await ev(`document.getElementById('showreelBtn').click()`); await sleep(700);
  ok(`${tag}: Showreel abre la capa`, await ev(`document.body.style.overflow === 'hidden'`));
  await cmd('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await cmd('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 }); await sleep(900);
  ok(`${tag}: Escape cierra la capa`, await ev(`document.body.style.overflow !== 'hidden'`));
  await ev(`document.getElementById('ledBtn').click()`); await sleep(1500);
  ok(`${tag}: Galería 3D abre`, await ev(`!!document.querySelector('#galBox iframe') && document.body.style.overflow === 'hidden'`));
  await ev(`document.getElementById('galX').click()`); await sleep(1000);
  ok(`${tag}: Galería 3D cierra`, await ev(`document.body.style.overflow !== 'hidden'`));
}
ok('sin errores de consola', errs.length === 0);
let report = checks.join('\n') + (errs.length ? '\n\nErrores:\n' + [...new Set(errs)].join('\n') : '');
if (CMP) {
  for (const tag of ['desktop', 'mobile']) {
    const a = fs.readFileSync(path.join(CMP, `huella-${tag}.txt`), 'utf8').split('\n'), b = result[tag];
    const diff = []; for (let i = 0; i < Math.max(a.length, b.length); i++) if (a[i] !== b[i]) diff.push(`#${i}\n  antes: ${a[i]}\n  ahora: ${b[i]}`);
    report += `\n\nHUELLA ${tag}: ${diff.length ? diff.length + ' diferencias' : 'IDÉNTICA'} (${b.length} elementos)` + (diff.length ? '\n' + diff.slice(0, 12).join('\n') : '');
  }
}
report += '\n\nhash desktop ' + crypto.createHash('sha1').update(result.desktop.join('\n')).digest('hex').slice(0, 12) + ' · mobile ' + crypto.createHash('sha1').update(result.mobile.join('\n')).digest('hex').slice(0, 12);
fs.writeFileSync(path.join(OUT, 'informe.txt'), report);
console.log(report);
bye(checks.some(c => c.startsWith('FALLA')) ? 1 : 0);
