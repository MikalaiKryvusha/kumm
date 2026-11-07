// Records a Chrome trace on the tablet (browser target over adb-forwarded CDP) for N seconds and prints the
// intervals between frames the compositor actually presented (viz Display::DrawAndSwap events): even pacing of
// 60 fps on 120 Hz is all ~16.7 ms; on 144 Hz it alternates 13.9 / 20.8 ms.   usage: node trace-pacing.mjs [seconds]
const secs = +(process.argv[2] || 5)
const ver = await (await fetch('http://127.0.0.1:9333/json/version')).json()
const ws = new WebSocket(ver.webSocketDebuggerUrl)
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pend = new Map(); const events = []
let done
const finished = new Promise(r => { done = r })
ws.addEventListener('message', ev => {
  const m = JSON.parse(ev.data)
  if (m.method === 'Tracing.dataCollected') events.push(...m.params.value)
  if (m.method === 'Tracing.tracingComplete') done()
  if (pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id) }
})
const send = (method, params) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const st = await send('Tracing.start', { traceConfig: { includedCategories: ['viz', 'gpu', 'benchmark'], recordMode: 'recordContinuously' }, transferMode: 'ReportEvents' })
if (st.error) { console.log('start error', JSON.stringify(st.error)); process.exit(2) }
await new Promise(r => setTimeout(r, secs * 1000))
await send('Tracing.end', {})
await finished
const names = {}
for (const e of events) names[e.name] = (names[e.name] || 0) + 1
const pick = ['Display::DrawAndSwap', 'DisplayScheduler::DrawAndSwap', 'Graphics.Pipeline.DrawAndSwap', 'SkiaOutputSurfaceImplOnGpu::SwapBuffers']
const nm = pick.find(n => names[n] > 10)
if (!nm) { console.log('no swap events; top names:', Object.entries(names).sort((a, b) => b[1] - a[1]).slice(0, 25).map(x => x.join(':')).join(' ')); process.exit(0) }
const ts = events.filter(e => e.name === nm && (e.ph === 'X' || e.ph === 'B' || e.ph === 'b')).map(e => e.ts / 1000).sort((a, b) => a - b)
const d = []; for (let i = 1; i < ts.length; i++) d.push(ts[i] - ts[i - 1])
const s = d.slice().sort((a, b) => a - b)
const q = p => s[Math.min(s.length - 1, Math.floor(s.length * p))].toFixed(1)
const hist = {}; for (const x of d) { const k = (Math.round(x / 2) * 2).toFixed(0); hist[k] = (hist[k] || 0) + 1 }
console.log(`event ${nm} · frames ${d.length} in ${secs}s (${(d.length / secs).toFixed(1)}/s) · interval p10 ${q(0.1)} p50 ${q(0.5)} p90 ${q(0.9)} max ${q(0.999)} ms`)
console.log('interval histogram (ms, 2-ms bins):', JSON.stringify(Object.fromEntries(Object.entries(hist).sort((a, b) => +a[0] - +b[0]))))
process.exit(0)
