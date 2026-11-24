// Medidor de carga por CDP con Edge headless (sin dependencias, sin Lighthouse).
//   node tests/perf.mjs [veces=3]   → mediana de FCP, LCP, CLS, TBT, peso y pedidos, en celu y compu
//   node tests/perf.mjs [veces=3] [--lista]  → mediana de FCP, LCP, CLS, TBT, peso y pedidos, en celu y compu (--lista: los 15 más pesados)
// YouTube y api.github.com bloqueados (usa los respaldos locales) para que dos corridas sean comparables.
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs'; import path from 'node:path'; import http from 'node:http'; import { fileURLToPath } from 'node:url'; import zlib from 'node:zlib';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const RUNS = +process.argv[2] || 3, PORT = 8791, CDP = 9352, sleep = ms => new Promise(r => setTimeout(r, ms));
const EDGE = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find(fs.existsSync);
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };
const srv = http.createServer((q, s) => {
  let p = decodeURIComponent(new URL(q.url, 'http://x').pathname); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { s.writeHead(404); return s.end(); }
  const type = TYPES[path.extname(f)] || 'application/octet-stream', gz = /text|json|svg/.test(type) && /gzip/.test(q.headers['accept-encoding'] || '');
  s.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store', ...(gz && { 'Content-Encoding': 'gzip' }) });   // gzip como GitHub Pages
  (gz ? fs.createReadStream(f).pipe(zlib.createGzip()) : fs.createReadStream(f)).pipe(s);
}).listen(PORT);
const prof = path.join(process.env.TEMP, 'sitio-perf-' + Date.now());
const ed = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${CDP}`, `--user-data-dir=${prof}`, '--no-first-run', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
const bye = c => { try { ed.kill(); } catch {} spawnSync('powershell', ['-NoProfile', '-Command', `Get-CimInstance Win32_Process -Filter "Name='msedge.exe'" | ? CommandLine -match 'sitio-perf-' | % { Stop-Process -Id $_.ProcessId -Force -EA SilentlyContinue }`]); srv.close(); process.exit(c); };
async function waitFor(fn, ms) { const t = Date.now(); for (;;) { try { const v = await fn(); if (v) return v; } catch {} if (Date.now() - t > ms) throw new Error('timeout'); await sleep(200); } }

try {
  const page = await waitFor(async () => (await (await fetch(`http://127.0.0.1:${CDP}/json`)).json()).find(t => t.type === 'page'), 20000);
  const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0, bytes = 0, reqs = 0, urls = {}, log = []; const pend = new Map();
  ws.onmessage = m => { const j = JSON.parse(m.data);
    if (j.id && pend.has(j.id)) { pend.get(j.id)(j); pend.delete(j.id); return; }
    if (j.method === 'Network.requestWillBeSent') urls[j.params.requestId] = j.params.request.url;
    if (j.method === 'Network.loadingFinished') { bytes += j.params.encodedDataLength; reqs++; log.push([j.params.encodedDataLength, urls[j.params.requestId]]); } };
  const cmd = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pend.set(i, j => j.error ? rej(new Error(method + ': ' + j.error.message)) : res(j.result)); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async e => (await cmd('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result.value;
  await cmd('Page.enable'); await cmd('Network.enable');
  await cmd('Network.setCacheDisabled', { cacheDisabled: true });
  await cmd('Network.setBlockedURLs', { urls: ['*api.github.com*', '*i.ytimg.com*', '*youtube*'] });
  // observadores antes de que cargue nada: LCP, CLS y tareas largas (TBT = suma de lo que pasa de 50 ms)
  await cmd('Page.addScriptToEvaluateOnNewDocument', { source: `window.__p={lcp:0,lcpEl:'',cls:0,tbt:0,shifts:[]};
    new PerformanceObserver(l=>{for(const e of l.getEntries()){__p.lcp=e.startTime;__p.lcpEl=(e.element&&(e.element.tagName+'.'+e.element.className).slice(0,40))||e.url}}).observe({type:'largest-contentful-paint',buffered:true});
    new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput){__p.cls+=e.value;if(e.value>.002)__p.shifts.push(e.value.toFixed(3)+' '+Math.round(e.startTime)+'ms '+e.sources.map(s=>s.node&&(s.node.tagName+'.'+String(s.node.className).split(' ')[0]+' y'+Math.round(s.previousRect.y)+'→'+Math.round(s.currentRect.y)+' h'+Math.round(s.previousRect.height)+'→'+Math.round(s.currentRect.height))).join(' + '))}}).observe({type:'layout-shift',buffered:true});
    new PerformanceObserver(l=>{for(const e of l.getEntries())__p.tbt+=Math.max(0,e.duration-50)}).observe({type:'longtask',buffered:true});` });
  const med = a => a.slice().sort((x, y) => x - y)[a.length >> 1];
  const out = [];
  for (const [tag, w, h, mobile] of [['celu', 390, 844, true], ['compu', 1440, 900, false]]) {
    await cmd('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: mobile ? 2 : 1, mobile });
    await cmd('Emulation.setCPUThrottlingRate', { rate: mobile ? 4 : 1 });
    await cmd('Network.emulateNetworkConditions', mobile
      ? { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 }
      : { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 });
    const rs = [];
    for (let i = 0; i < RUNS; i++) {
      await cmd('Page.navigate', { url: 'about:blank' }); await sleep(300);
      bytes = 0; reqs = 0; log = [];
      await cmd('Page.navigate', { url: `http://127.0.0.1:${PORT}/?perf=${i}` });
      await waitFor(() => ev('document.readyState==="complete"'), 60000);
      await sleep(mobile ? 5000 : 2500);   // dejar asentar LCP / CLS / tareas tardías
      const p = await ev(`({...__p,fcp:(performance.getEntriesByName('first-contentful-paint')[0]||{}).startTime||0,
        fin:Object.entries(performance.getEntriesByType('resource').reduce((a,r)=>{const k=r.initiatorType+(r.name.match(/\.(css|js|woff2|jpg|webp|avif)/)||[''])[0];a[k]=Math.max(a[k]||0,Math.round(r.responseEnd));return a},{html:Math.round(performance.getEntriesByType('navigation')[0].responseEnd)})).map(e=>e.join(' ')).join(' · ')})`);
      rs.push({ ...p, kb: bytes / 1024, reqs });
    }
    const m = k => med(rs.map(r => r[k]));
    if (process.argv.includes('--lista')) out.push(log.sort((a, b) => b[0] - a[0]).slice(0, 15)
      .map(([b, u]) => `   ${String(Math.round(b / 1024)).padStart(5)} KB  ${decodeURIComponent(u || '').replace(`http://127.0.0.1:${PORT}/`, '')}`).join('\n'));
    if (process.argv.includes('--lista')) out.push(rs[0].shifts.map(s => '   corrimiento ' + s).concat('   terminan (ms): ' + rs[0].fin).join('\n'));
    out.push(`${tag.padEnd(6)} FCP ${Math.round(m('fcp'))} ms · LCP ${Math.round(m('lcp'))} ms (${rs[0].lcpEl}) · CLS ${m('cls').toFixed(3)} · TBT ${Math.round(m('tbt'))} ms · ${Math.round(m('kb'))} KB en ${m('reqs')} pedidos`);
  }
  console.log(out.join('\n'));
  bye(0);
} catch (e) { console.error(e); bye(1); }
