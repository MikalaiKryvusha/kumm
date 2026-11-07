// Evaluate a JS expression (from a file) in the tablet's nfsu2.xyz page over CDP (adb forward tcp:9333).
// usage: node cdp-eval.mjs <expr-file>
import { readFileSync } from 'node:fs'
const expr = readFileSync(process.argv[2], 'utf8')
const list = await (await fetch('http://127.0.0.1:9333/json/list')).json()
const page = list.find(p => p.type === 'page' && p.url.startsWith('https://nfsu2.xyz'))
if (!page) { console.error('no nfsu2 page'); process.exit(2) }
const ws = new WebSocket(page.webSocketDebuggerUrl)
await new Promise(r => ws.addEventListener('open', r, { once: true }))
ws.addEventListener('message', ev => {
  const m = JSON.parse(ev.data)
  if (m.id !== 1) return
  const r = m.result?.result
  console.log(m.result?.exceptionDetails ? 'EXC ' + JSON.stringify(m.result.exceptionDetails).slice(0, 800) : (r?.value ?? JSON.stringify(r)))
  ws.close(); process.exit(0)
})
ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: expr, awaitPromise: true, returnByValue: true } }))
setTimeout(() => { console.error('timeout'); process.exit(3) }, 30000)
