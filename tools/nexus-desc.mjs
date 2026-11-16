// nexus-desc.mjs — the Nexus mod page description editor (SCEditor, BBCode) driven over CDP in the debug Chrome.
// [TESTED: 2026-11-16 · open/read/write/save on mod 65 (conanexilesenhanced), Save → «Mod saved successfully.», the block read back on the public page
// in a fresh tab; judge rounds 1–4 hardening re-run without a publish (the save → proof path itself not yet run with a publish) —
// testcases/reports/2026-11-16_nexus-call-block.md]
// Recipe: HOUSE_RULES_REFERENCE.md §2 (Nexus row, 2026-11-03): write in SOURCE mode (WYSIWYG rewrites [url=mailto:] into [email]),
// then ONE real key event (a space) — only a real keystroke enables Save (a space + Backspace disables it again, so the saved text ends with that space);
// tabs open in the background (the owner may be at the keyboard). Every failure exits 1 — the tool never reports success it did not observe.
// Files in <KUMM>/.work/ (git-ignored, HOUSE_RULES rule 15): the editor tab's id, and the pending text {tabId, text} that `write` put in — `save` saves only that.
// Usage (Chrome on :9222, logged in — `node kumm.mjs status --game <slug>`):
//   node nexus-desc.mjs open  <editUrl>   -> new background tab (forgets any earlier pending text)
//   node nexus-desc.mjs read  <outFile>   -> the text Nexus STORES (the page's original textarea in a fresh tab) — the backup, taken BEFORE any write
//   node nexus-desc.mjs write <bbFile>    -> source mode, val(bb), one real space; exit 1 unless the text landed whole and Save is enabled
//   node nexus-desc.mjs save              -> saves ONLY what `write` put into THIS tab; exit 1 without «Mod saved successfully.»
//   node nexus-desc.mjs verify <bbFile>   -> a fresh background tab of the same edit page: is the STORED text the file (whitespace aside)? `save` runs it itself
//   node nexus-desc.mjs close             -> closes the tab (checked by the tab list), forgets the pending text
//   node nexus-desc.mjs eval  <js>        -> evaluates js in the tab (debug)
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const WORK = path.join(HERE, '..', '.work')
const TAB_FILE = path.join(WORK, 'nexus-desc-tab.txt')
// Записанный, но не сохранённый текст ВМЕСТЕ с его вкладкой. Оплачено 2026-11-16 18:2x: в свежей вкладке Save оказался включён без правки, и «save без
// изменений откажет» сохранил текст как есть (совпал знак в знак — вреда нет); судья, раунд 2: текст без вкладки пропустил бы такой же клик в чужой вкладке.
const PENDING_FILE = path.join(WORK, 'nexus-desc-pending.json')
const PORT = 9222
const SAVED_TOAST = 'Mod saved successfully.'
const POLL_MS = 500
const EDITOR_WAIT_POLLS = 60       // фоновая вкладка поднимает редактор через секунды после «complete» (под нагрузкой игры — дольше 20 с) — ждём до 30 с
const TOAST_WAIT_POLLS = 20        // сообщение о сохранении — до 10 с
const KEY_SETTLE_MS = 1600         // SCEditor после второго пробела подряд обновляет форму только своим таймером 1,5 с (судья, раунд 3)
const COMMANDS = ['open', 'read', 'write', 'save', 'verify', 'close', 'eval']
const [cmd, arg] = process.argv.slice(2)
const sleep = ms => new Promise(r => setTimeout(r, ms))
const die = msg => { console.error(msg); process.exit(1) }
const forgetPending = () => { if (fs.existsSync(PENDING_FILE)) fs.unlinkSync(PENDING_FILE) }
const norm = s => s.replace(/\r\n?/g, '\n')
// Хранимое сравниваем без пробельных знаков: Nexus сам правит переводы строк (2026-11-16: записано 62 729, хранится 62 719 — переводы строк после [/list]).
// Класс, ради которого сверка, — «Save записал СТАРЫЙ текст» (2026-11-03) — пробелами не маскируется, КРОМЕ правки только в пробелах: её `write` помечает
// (wsOnly), и `save` тогда честно говорит «не доказано» (судья, раунд 4).
const sameIgnoringWhitespace = (a, b) => a.replace(/\s+/g, '') === b.replace(/\s+/g, '')
const tabAlive = async id => (await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()).some(x => x.id === id)
const CLOSE_WAIT_POLLS = 10        // закрытие вкладки — до 5 с
async function closeTab(id) {
  const b = await browserSocket()
  try { await b.send('Target.closeTarget', { targetId: id }) } catch (e) { console.log(`closeTarget ${id}: ${e.message}`) } finally { b.ws.close() }
  for (let k = 0; k < CLOSE_WAIT_POLLS; k++) {
    await sleep(POLL_MS)
    if (!(await tabAlive(id))) return true
  }
  return false
}
process.exitCode = 1   // успех ставится явно; молча закончившийся процесс (оборванный сокет, недождавшийся ответ) — провал

// One CDP socket; a protocol error, a dropped socket or a send on a closed socket rejects (судья, раунды 1–2).
async function socket(url) {
  const ws = new WebSocket(url)
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error(`CDP: cannot connect to ${url}`)) })
  let id = 0
  const pending = new Map()
  const failAll = why => { for (const [, p] of pending) p.rej(new Error(why)); pending.clear() }
  ws.onmessage = ev => {
    const m = JSON.parse(ev.data)
    if (!m.id || !pending.has(m.id)) return
    const p = pending.get(m.id); pending.delete(m.id)
    if (m.error) p.rej(new Error(`CDP ${p.method}: ${m.error.message}`)); else p.res(m.result)
  }
  ws.onclose = () => failAll('CDP socket closed')
  ws.onerror = () => failAll('CDP socket error')
  const send = (method, params = {}) => new Promise((res, rej) => {
    if (ws.readyState !== WebSocket.OPEN) return rej(new Error(`CDP ${method}: the socket is not open`))   // send на закрытом сокете молча теряет запрос
    const i = ++id; pending.set(i, { res, rej, method }); ws.send(JSON.stringify({ id: i, method, params }))
  })
  return { ws, send }
}

async function tabSocket(targetId) {
  const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
  const t = list.find(x => x.id === targetId)
  if (!t) throw new Error(`tab ${targetId} not found`)   // throw, не die: из проверки сохранения die пропустил бы закрытие проверочной вкладки
  const s = await socket(t.webSocketDebuggerUrl)
  s.evaluate = async expr => {
    const r = await s.send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })
    if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 600))
    return r.result?.value
  }
  return s
}

const browserSocket = async () => socket((await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json()).webSocketDebuggerUrl)

// The description editor: exactly ONE SCEditor instance on the page (2026-11-16 the edit page had one); more or none — stop, never guess the field.
// window.__orig — its original textarea: in a FRESH tab it holds the text Nexus stores; the editor's own val() is SCEditor's conversion (2026-11-16: the
// WYSIWYG start added line breaks after [/list], 62 719 stored vs 62 729 converted).
const FIND_ED = `(function(){
  var found = [];
  Array.from(document.querySelectorAll('textarea')).forEach(function(ta){ try { var i = sceditor.instance(ta); if (i) found.push([i, ta]) } catch(e){} });
  if (found.length !== 1) return found.length;
  window.__ed = found[0][0]; window.__orig = found[0][1]; return 1 })()`
// The source-mode textarea OF THAT editor (the one whose text is the editor's value) and the Save buttons of the editor's form (or the page's visible ones).
const SRC_TA = `Array.from(document.querySelectorAll('.sceditor-container textarea')).filter(function(t){ return t.value === window.__ed.val() })`
const SAVE_BTNS = `(function(){ var scope = (window.__orig && window.__orig.closest('form')) || document;
  return Array.from(scope.querySelectorAll('button')).filter(function(x){ return x.offsetParent !== null && /^\\s*Save\\s*$/i.test(x.innerText) }) })()`

async function waitEditor(t) {
  let n = 0
  for (let k = 0; k < EDITOR_WAIT_POLLS && n === 0; k++) {
    try { n = await t.evaluate(FIND_ED) } catch (e) { n = 0 }   // «Execution context was destroyed» посреди загрузки — ещё не готово, ждём дальше
    if (n === 0) await sleep(POLL_MS)
  }
  return n
}

// The proof of a save: a FRESH background tab of the same edit page, the text Nexus stores, compared with what was written (судья, раунд 3: сообщение
// «saved» доказывает, что сохранение было, но не КАКОЙ текст ушёл — кнопку могли нажать не ту, форма могла не догнать редактор).
async function storedTextNow(editUrl) {
  const b = await browserSocket()
  const { targetId } = await b.send('Target.createTarget', { url: editUrl, background: true })
  b.ws.close()
  try {
    const t = await tabSocket(targetId)
    try {
      const n = await waitEditor(t)
      if (n !== 1) {
        const line = await t.evaluate(`(document.body.innerText.match(/[^\\n]*(Failed|403|rror)[^\\n]*/) || ['no error line'])[0]`)
        throw new Error(`the proof tab: ${n} editors after ${EDITOR_WAIT_POLLS * POLL_MS / 1000} s («${line}»)`)
      }
      const stored = await t.evaluate('window.__orig.value')
      if (!stored) throw new Error('the proof tab holds no stored text (not loaded / 403?) — this is NOT a wiped description')
      return stored
    } finally { t.ws.close() }
  } finally { if (!(await closeTab(targetId))) console.log(`the proof tab ${targetId} did not close — close it by hand`) }
}

async function main() {
  if (!COMMANDS.includes(cmd)) die(`usage: node nexus-desc.mjs ${COMMANDS.join('|')} [arg] — see the header`)
  if (cmd === 'open') {
    if (!arg) die('open needs the edit URL')
    if (fs.existsSync(TAB_FILE)) {   // наша прежняя вкладка — закрыть, не копить сироты с несохранённой правкой
      const old = fs.readFileSync(TAB_FILE, 'utf8').trim()
      if (await tabAlive(old) && !(await closeTab(old))) die(`the previous tab ${old} did not close — close it first`)
    }
    const b = await browserSocket()
    const { targetId } = await b.send('Target.createTarget', { url: arg, background: true })
    b.ws.close()
    fs.mkdirSync(WORK, { recursive: true })
    forgetPending()
    fs.writeFileSync(TAB_FILE, targetId)
    console.log(`tab ${targetId} (background)`)
    process.exitCode = 0
    return
  }
  const tabId = fs.existsSync(TAB_FILE) ? fs.readFileSync(TAB_FILE, 'utf8').trim() : die(`no tab file ${TAB_FILE} — run open first`)
  if (cmd === 'close') {
    if (await tabAlive(tabId) && !(await closeTab(tabId))) die(`tab ${tabId} is still open — the tab file is kept, retry close`)
    forgetPending()
    fs.unlinkSync(TAB_FILE)
    console.log(`tab ${tabId} closed`)
    process.exitCode = 0
    return
  }
  const t = await tabSocket(tabId)
  try {
    await t.send('Emulation.setFocusEmulationEnabled', { enabled: true })
    if (cmd === 'eval') { console.log(JSON.stringify(await t.evaluate(arg))); process.exitCode = 0; return }
    const n = await waitEditor(t)
    if (n !== 1) die(`expected exactly one description editor, found ${n}`)
    if (cmd === 'verify') {   // после загрузки своей вкладки: две ОДНОВРЕМЕННЫЕ загрузки страницы правки — проверочная не поднимала редактор за 30 с (2026-11-16)
      if (!arg) die('verify needs a BBCode file')
      const want = fs.readFileSync(arg, 'utf8').replace(/^﻿/, '')
      const stored = await storedTextNow(await t.evaluate('location.href'))
      if (!sameIgnoringWhitespace(stored, want)) die(`the stored text (${stored.length}) is NOT the file (${want.length})`)
      console.log(`the stored text = the file (${stored.length} / ${want.length} chars, whitespace aside)`)
      process.exitCode = 0
      return
    }
    if (cmd === 'read') {
      if (!arg) die('read needs an output file')
      if (fs.existsSync(PENDING_FILE) || await t.evaluate('!!window.__kummWrote')) die('this tab was written into — the backup must come from a fresh tab (open, then read)')
      const stored = await t.evaluate('window.__orig.value')
      const conv = await t.evaluate('window.__ed.val()')
      if (!stored) die('the stored text is empty — the page may not have loaded; nothing written')
      fs.writeFileSync(arg, stored, 'utf8')
      console.log(`read ${stored.length} chars (stored) -> ${arg}; the editor's conversion ${conv.length}${norm(conv) === norm(stored) ? ' — equal' : ' — differs (a used tab, or the converter); use a fresh tab for a backup'}`)
      process.exitCode = 0
      return
    }
    if (cmd === 'write') {
      if (!arg) die('write needs a BBCode file')
      forgetPending()
      const bb = fs.readFileSync(arg, 'utf8').replace(/^﻿/, '')   // PS 5.1 Out-File пишет BOM — невидимый знак ушёл бы на страницу
      if (!bb.trim()) die('the file is empty — refusing to write a blank description')
      if (!(await t.evaluate('window.__orig.value'))) die('the page holds no stored text — not loaded (403?); nothing written')
      await t.evaluate('(function(){ window.__kummWrote = true; if (!window.__ed.inSourceMode()) window.__ed.sourceMode(true); return true })()')
      await t.evaluate(`window.__ed.val(${JSON.stringify(bb)})`)
      const before = await t.evaluate(`${SAVE_BTNS}.map(function(x){ return x.disabled })`)
      const nSrc = await t.evaluate(`(function(){ var s = ${SRC_TA}; if (s.length !== 1) return s.length;
        s[0].focus(); s[0].selectionStart = s[0].selectionEnd = s[0].value.length; return 1 })()`)
      if (nSrc !== 1) die(`the editor's source textarea not found uniquely (${nSrc}) — nothing typed, nothing saved`)
      await t.send('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', text: ' ', windowsVirtualKeyCode: 32 })
      await t.send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 })
      await sleep(KEY_SETTLE_MS)
      const now = await t.evaluate('window.__ed.val()')
      const after = await t.evaluate(`${SAVE_BTNS}.map(function(x){ return x.disabled })`)
      const want = norm(bb) + ' '
      console.log(`wrote ${bb.length} chars, editor now ${now.length}; Save disabled before the key ${JSON.stringify(before)}, after ${JSON.stringify(after)}`)
      if (norm(now) !== want) die('the editor text is not the file + one space — do not save')
      if (after.indexOf(false) < 0) die('Save stayed disabled — the text may equal the stored one (nothing to save), or the keystroke did not count')
      if (before.indexOf(false) >= 0) console.log('note: Save was already enabled before the keystroke (a fresh tab can show that)')
      const wsOnly = sameIgnoringWhitespace(await t.evaluate('window.__orig.value'), want)   // правка только в пробелах — сверка без пробелов её не докажет
      if (wsOnly) console.log('note: the change is whitespace-only — `save` will save it but cannot PROVE it (the proof ignores whitespace)')
      fs.writeFileSync(PENDING_FILE, JSON.stringify({ tabId, text: want, wsOnly }), 'utf8')
      process.exitCode = 0
      return
    }
    if (cmd === 'save') {
      if (!fs.existsSync(PENDING_FILE)) die('nothing written by `write` — refusing to save whatever the editor holds')
      const p = JSON.parse(fs.readFileSync(PENDING_FILE, 'utf8'))
      if (p.tabId !== tabId) die(`the pending text belongs to tab ${p.tabId}, this is ${tabId} — refusing`)
      if (await t.evaluate(`document.body.innerText.indexOf(${JSON.stringify(SAVED_TOAST)}) >= 0`)) die(`«${SAVED_TOAST}» already on the page — cannot tell a new save; open a fresh tab`)
      // Сверка и клик — одним вызовом: между ними текст и кнопки не успеют смениться.
      const r = await t.evaluate(`(function(){ var want = ${JSON.stringify(p.text)};
        if (window.__ed.val().replace(/\\r\\n/g, '\\n') !== want) return 'the editor text is not what write put there';
        var b = ${SAVE_BTNS}.filter(function(x){ return !x.disabled })[0];
        if (!b) return 'no enabled Save button';
        b.click(); return 'clicked' })()`)
      if (r !== 'clicked') die(`refusing to save: ${r}`)
      for (let k = 0; k < TOAST_WAIT_POLLS; k++) {
        await sleep(POLL_MS)
        if (await t.evaluate(`document.body.innerText.indexOf(${JSON.stringify(SAVED_TOAST)}) >= 0`)) {
          console.log(`${SAVED_TOAST} — checking what Nexus stores now, in a fresh tab…`)
          forgetPending()   // сохранение СЛУЧИЛОСЬ: повторный save с этим текстом не нужен, что бы ни показала сверка
          const notProven = why => die(`SAVED (the toast was seen), NOT PROVEN: ${why} — do NOT save again; run: open <edit url>, then verify <your file>`)
          if (p.wsOnly) notProven('a whitespace-only change cannot be told from the old text by the whitespace-blind proof; compare a fresh `read` with your file exactly')
          let stored
          try { stored = await storedTextNow(await t.evaluate('location.href')) } catch (e) { notProven(e.message) }
          if (!sameIgnoringWhitespace(stored, p.text)) die(`SAVED, BUT the stored text (${stored.length}) is NOT the written one (${p.text.length}) — run: open <edit url>, read <file>, compare`)
          console.log(`the stored text = the written one (${stored.length} chars, whitespace aside)`); process.exitCode = 0; return
        }
      }
      die(`clicked Save, no «${SAVED_TOAST}» within ${TOAST_WAIT_POLLS * POLL_MS / 1000} s — check the page in a fresh tab before any retry`)
    }
  } finally { t.ws.close() }
}
main().catch(e => die(String(e && e.message || e)))
