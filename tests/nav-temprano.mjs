// ¿El menú funciona si alguien lo toca APENAS entra? (Edge headless por CDP, sin dependencias)
//   node tests/nav-temprano.mjs [url]   → por defecto sirve la carpeta local como perf.mjs (gzip, celu lento)
// Para cada link del menú y cada momento (apenas se ve la página / a los 0,5 s / a los 1,5 s):
// recarga en frío, hace click real (mouse por CDP) y a los 6 s mira si la sección quedó arriba, debajo del nav.
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs'; import path from 'node:path'; import http from 'node:http'; import { fileURLToPath } from 'node:url'; import zlib from 'node:zlib';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const PORT = 8792, CDP = 9353, sleep = ms => new Promise(r => setTimeout(r, ms));
const URL0 = process.argv.slice(2).find(a => a.startsWith('http')) || `http://127.0.0.1:${PORT}/`;
const EDGE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find(fs.existsSync);
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };
const srv = http.createServer((q, s) => {
  let p = decodeURIComponent(new URL(q.url, 'http://x').pathname); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { s.writeHead(404); return s.end(); }
  const type = TYPES[path.extname(f)] || 'application/octet-stream', gz = /text|json|svg/.test(type) && /gzip/.test(q.headers['accept-encoding'] || '');
  s.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store', ...(gz && { 'Content-Encoding': 'gzip' }) });
  (gz ? fs.createReadStream(f).pipe(zlib.createGzip()) : fs.createReadStream(f)).pipe(s);
}).listen(PORT);
const prof = path.join(process.env.TEMP, 'sitio-nav-' + Date.now());
const ed = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${CDP}`, `--user-data-dir=${prof}`, '--no-first-run', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
const bye = c => { try { ed.kill(); } catch {} spawnSync('powershell', ['-NoProfile', '-Command', `Get-CimInstance Win32_Process -Filter "Name='msedge.exe'" | ? CommandLine -match 'sitio-nav-' | % { Stop-Process -Id $_.ProcessId -Force -EA SilentlyContinue }`]); srv.close(); process.exit(c); };
async function waitFor(fn, ms) { const t = Date.now(); for (;;) { try { const v = await fn(); if (v) return v; } catch {} if (Date.now() - t > ms) throw new Error('timeout'); await sleep(50); } }

try {
  const page = await waitFor(async () => (await (await fetch(`http://127.0.0.1:${CDP}/json`)).json()).find(t => t.type === 'page'), 20000);
  const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0; const pend = new Map();
  ws.onmessage = m => { const j = JSON.parse(m.data); if (j.id && pend.has(j.id)) { pend.get(j.id)(j); pend.delete(j.id); } };
  const cmd = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pend.set(i, j => j.error ? rej(new Error(method + ': ' + j.error.message)) : res(j.result)); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async e => (await cmd('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result.value;
  await cmd('Page.enable'); await cmd('Network.enable'); await cmd('Network.setCacheDisabled', { cacheDisabled: true });
  await cmd('Network.setBlockedURLs', { urls: ['*api.github.com*', '*i.ytimg.com*', '*youtube*'] });
  const DEBUG = process.argv.includes('--debug');
  // registro: clicks que llegan, cambios de hash y saltos de scroll (con quién los pidió)
  await cmd('Page.addScriptToEvaluateOnNewDocument', { source: `window.__n=[];window.__T=()=>Math.round(performance.now());
    addEventListener('click',e=>__n.push(__T()+' click '+(e.target.closest&&e.target.closest('a')?e.target.closest('a').getAttribute('href'):e.target.tagName)+' prevented='+e.defaultPrevented),true);
    addEventListener('click',e=>__n.push(__T()+' click(burbuja) prevented='+e.defaultPrevented));
    addEventListener('hashchange',()=>__n.push(__T()+' hash '+location.hash));
    for(const k of ['scrollTo','scroll']){const o=window[k];window[k]=function(...a){__n.push(__T()+' '+k+'('+JSON.stringify(a)+') '+new Error().stack.split(String.fromCharCode(10))[2]);return o.apply(this,a)}}
    {let ly=0;setInterval(()=>{if(scrollY!==ly){__n.push(__T()+' y='+Math.round(scrollY));ly=scrollY}},100);}
    document.addEventListener('readystatechange',()=>__n.push(__T()+' '+document.readyState));` });
  const UNO = process.argv.includes('--uno'); const SECS = UNO ? ['contacto'] : ['contacto', 'servicios', 'vertical', 'trabajo'], ESPERAS = UNO ? [1500] : [0, 500, 1500];
  let fallas = 0;
  for (const [tag, w, h, mobile] of [['celu', 390, 844, true], ['compu', 1440, 900, false]]) {
    await cmd('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: mobile ? 2 : 1, mobile });
    await cmd('Emulation.setTouchEmulationEnabled', { enabled: mobile });
    await cmd('Emulation.setCPUThrottlingRate', { rate: mobile ? 4 : 1 });
    await cmd('Network.emulateNetworkConditions', mobile
      ? { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 }
      : { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
    for (const sec of SECS) for (const espera of ESPERAS) {
      await cmd('Page.navigate', { url: 'about:blank' }); await sleep(200);
      await cmd('Page.navigate', { url: URL0 + (URL0.includes('?') ? '&' : '?') + 'n=' + Date.now() });
      // «apenas se ve»: el link del menú ya existe y tiene tamaño
      const caja = `(()=>{const a=document.querySelector('#navLinks a[href="#${sec}"]');if(!a)return null;const r=a.getBoundingClientRect();if(!r.width)return null;const x=r.x+r.width/2,y=r.y+r.height/2,e=document.elementFromPoint(x,y);return{x,y,arriba:e===a||a.contains(e)?'link':e&&(e.tagName+'.'+String(e.className).slice(0,30)+(e.parentElement?' en '+e.parentElement.tagName+'.'+String(e.parentElement.className).slice(0,30):''))}})()`;
      await waitFor(() => ev(caja), 30000);
      if (espera) await sleep(espera);
      const box = await ev(caja);   // medido justo antes del click (el menú puede moverse mientras carga)
      if (DEBUG && box.arriba !== 'link') console.log('      encima del link:', box.arriba, box.x, box.y);
      const t = await ev('Math.round(performance.now())');
      for (const type of ['mousePressed', 'mouseReleased']) await cmd('Input.dispatchMouseEvent', { type, x: box.x, y: box.y, button: 'left', clickCount: 1 });
      await sleep(6000);
      const r = await ev(`(()=>{const s=document.getElementById('${sec}');return {top:Math.round(s.getBoundingClientRect().top),y:Math.round(scrollY),max:Math.round(document.documentElement.scrollHeight-innerHeight),hash:location.hash,listo:document.readyState}})()`);
      // bien = la sección arriba (scroll-margin 84 → top ≈ 84) o el final de la página si no alcanza a subir tanto
      const ok = Math.abs(r.top - 84) <= 12 || (r.y >= r.max - 2 && r.top > 0 && r.top < h * .6);
      if (!ok) fallas++;
      if (DEBUG && !ok) console.log('      ' + (await ev('JSON.stringify(window.__n||"sin registro")')));
      console.log(`${ok ? 'OK   ' : 'FALLA'} ${tag.padEnd(5)} #${sec.padEnd(9)} click a los ${String(t).padStart(5)} ms → sección a ${r.top}px del borde (scroll ${r.y}/${r.max}, ${r.listo})`);
    }
  }
  console.log(fallas ? `\n${fallas} caídas fuera de lugar` : '\ntodo cae donde tiene que caer');
  bye(fallas ? 1 : 0);
} catch (e) { console.error(e); bye(1); }
