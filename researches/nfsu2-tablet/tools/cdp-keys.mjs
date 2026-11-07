// Send key presses to the tablet's nfsu2.xyz page over CDP.
// usage: node cdp-keys.mjs <step> [<step> ...]
//   step: KEY (tap) | KEY:hold_ms | wait:ms | click:<button text> | eval:<file>
//   KEY: Enter, Escape, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Space, F8, F9, or a single letter
import { readFileSync } from 'node:fs'
const KEYS = {
  Enter: [13, 'Enter', 'Enter', '\r'], Escape: [27, 'Escape', 'Escape'], Space: [32, 'Space', ' ', ' '],
  ArrowUp: [38, 'ArrowUp', 'ArrowUp'], ArrowDown: [40, 'ArrowDown', 'ArrowDown'],
  ArrowLeft: [37, 'ArrowLeft', 'ArrowLeft'], ArrowRight: [39, 'ArrowRight', 'ArrowRight'],
  F8: [119, 'F8', 'F8'], F9: [120, 'F9', 'F9'], Tab: [9, 'Tab', 'Tab'], Backspace: [8, 'Backspace', 'Backspace'],
}
const list = await (await fetch('http://127.0.0.1:9333/json/list')).json()
const page = list.find(p => p.type === 'page' && p.url.startsWith('https://nfsu2.xyz'))
if (!page) { console.error('no nfsu2 page'); process.exit(2) }
const ws = new WebSocket(page.webSocketDebuggerUrl)
await new Promise(r => ws.addEventListener('open', r, { once: true }))
let id = 0; const pend = new Map()
ws.addEventListener('message', ev => { const m = JSON.parse(ev.data); if (pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id) } })
const send = (method, params) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
const sleep = ms => new Promise(r => setTimeout(r, ms))
function keyDef(k) {
  if (KEYS[k]) return KEYS[k]
  if (k.length === 1) { const up = k.toUpperCase(); return [up.charCodeAt(0), 'Key' + up, k, k] }
  throw new Error('unknown key ' + k)
}
async function key(k, type) {
  const [code, codeName, keyName, text] = keyDef(k)
  await send('Input.dispatchKeyEvent', { type, windowsVirtualKeyCode: code, nativeVirtualKeyCode: code, code: codeName, key: keyName, ...(type === 'keyDown' && text ? { text } : {}) })
}
for (const step of process.argv.slice(2)) {
  if (step.startsWith('wait:')) { await sleep(+step.slice(5)); continue }
  if (step.startsWith('click:')) {
    const t = step.slice(6)
    const r = await send('Runtime.evaluate', { expression: `(()=>{const b=[...document.querySelectorAll('button,a,[role=button]')].find(e=>e.offsetParent&&e.textContent.trim()===${JSON.stringify(t)});if(!b)return 'not found';b.click();return 'clicked'})()`, returnByValue: true })
    console.log(step, r.result?.result?.value); continue
  }
  if (step.startsWith('eval:')) {
    const r = await send('Runtime.evaluate', { expression: readFileSync(step.slice(5), 'utf8'), awaitPromise: true, returnByValue: true })
    console.log(r.result?.result?.value ?? JSON.stringify(r.result).slice(0, 500)); continue
  }
  const [k, hold] = step.split(':')
  await key(k, 'keyDown'); await sleep(hold ? +hold : 80); await key(k, 'keyUp'); await sleep(120)
}
ws.close(); process.exit(0)
