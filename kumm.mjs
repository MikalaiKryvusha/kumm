#!/usr/bin/env node
// ============================================================================
//  KUMM - Krinik Universal Mod Manager
//  Моды с Nexus через отладочный порт Chrome (CDP).
//
//  Зачем: Nexus закрыт Cloudflare - curl/fetch получают 403, а живой Chrome
//  проходит. Скрипт поднимает отдельный Chrome с --remote-debugging-port,
//  ходит по страницам модов из modpack.json, сравнивает версии с библиотекой
//  и качает файлы под твоим аккаунтом. Игра любая: слаг берётся из манифеста
//  или флага --game.
//
//  Профиль отдельный (не твой основной): с Chrome 136+ отладочный порт на
//  профиле по умолчанию игнорируется. Логинишься один раз - куки живут в
//  профиле и переживают перезапуск.
//
//  Зависимостей нет: Node 22+ уже умеет WebSocket и fetch.
//
//  Команды
//    launch                    поднять Chrome и открыть Nexus
//    login                     открыть страницу входа и ждать авторизации
//    status                    жив ли порт, под кем залогинены
//    check [--json]            сверить версии в библиотеке с Nexus
//    update [modId...]         скачать всё, что разошлось, в --out
//    files <modId>             файлы мода: fileId, версия, дата, размер
//    get <modId> [fileId]      скачать файл (без fileId - главный)
//    changelog <modId>         changelog со страницы мода
//    eval <url> <js>           выполнить JS на странице и вернуть результат
//    close                     закрыть отладочный Chrome
//
//  Общие флаги
//    --game <slug>   слаг игры на Nexus, если нет манифеста
//    --root <dir>    корень сборки (по умолчанию текущая папка)
//    --manifest <f>  путь к манифесту (по умолчанию <root>/modpack.json)
//    --out <dir>     куда складывать скачанное (по умолчанию mods)
//    --port, --profile, --settle, --variant
//
//  Примеры
//    kumm launch
//    kumm check
//    kumm files 3603 --game palworld
//    kumm get 3603 --out mods/_incoming
// ============================================================================

import { spawn } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'
import { readFile, writeFile, readdir, mkdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import os from 'node:os'

// --------------------------------------------------------------------------
//  Аргументы и настройки
// --------------------------------------------------------------------------

// Флаги со значением; остальное - позиционные аргументы.
const VALUE_FLAGS = new Set(['out', 'game', 'port', 'profile', 'settle', 'manifest', 'root', 'variant'])

function parseArgv(argv) {
  const args = [], flags = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (!a.startsWith('--')) { args.push(a); continue }
    const name = a.slice(2)
    if (VALUE_FLAGS.has(name)) flags[name] = argv[++i]
    else flags[name] = true
  }
  return { args, flags }
}

const [, , cmd, ...rest] = process.argv
const { args, flags } = parseArgv(rest)

const PORT = Number(flags.port || process.env.NEXUS_CDP_PORT || 9222)

// Профиль общий для всех игр: логин на Nexus один. Живёт в LOCALAPPDATA, а не
// в TEMP, чтобы очистка временных файлов не разлогинивала.
const PROFILE = flags.profile || process.env.NEXUS_CDP_PROFILE ||
  path.join(process.env.LOCALAPPDATA || os.homedir(), 'nexus-cdp', 'profile')

const CHROME = process.env.CHROME_PATH || [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
].find(p => p && existsSync(p))

// Корень сборки - текущая папка: инструмент лежит где угодно, хоть в
// глобальном npm, и работает с той сборкой, из которой его позвали.
const ROOT = path.resolve(flags.root || process.cwd())
const MANIFEST = path.resolve(ROOT, flags.manifest || 'modpack.json')

// Слаг игры на Nexus: --game > modpack.json "nexusGame" > имя папки проекта.
let GAME = flags.game || process.env.NEXUS_GAME || null
async function gameSlug() {
  if (GAME) return GAME
  try {
    const m = JSON.parse(await readFile(MANIFEST, 'utf8'))
    if (m.nexusGame) return (GAME = m.nexusGame)
  } catch {}
  die('не понял, какая игра: добавь "nexusGame" в modpack.json или передай --game')
}

const log = (...a) => console.log(...a)
const warn = (...a) => console.log('  [warn]', ...a)
const die = m => { console.error('  [error]', m); process.exit(1) }

// --------------------------------------------------------------------------
//  CDP: один сокет на браузер, вкладки - через flat-сессии.
// --------------------------------------------------------------------------

class Cdp {
  #ws; #id = 0; #pending = new Map(); #listeners = []

  static async connect(port = PORT) {
    const info = await fetch(`http://127.0.0.1:${port}/json/version`)
      .then(r => r.json())
      .catch(() => null)
    if (!info) return null
    const cdp = new Cdp()
    await cdp.#open(info.webSocketDebuggerUrl)
    return cdp
  }

  #open(url) {
    return new Promise((resolve, reject) => {
      this.#ws = new WebSocket(url)
      this.#ws.onopen = () => resolve()
      this.#ws.onerror = e => reject(new Error('websocket: ' + (e.message || 'failed')))
      this.#ws.onmessage = ev => {
        const msg = JSON.parse(ev.data)
        if (msg.id && this.#pending.has(msg.id)) {
          const { resolve, reject } = this.#pending.get(msg.id)
          this.#pending.delete(msg.id)
          msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result)
        } else if (msg.method) {
          for (const fn of this.#listeners) fn(msg)
        }
      }
    })
  }

  on(fn) { this.#listeners.push(fn); return () => {
    this.#listeners = this.#listeners.filter(f => f !== fn)
  } }

  send(method, params = {}, sessionId) {
    const id = ++this.#id
    const payload = JSON.stringify({ id, method, params, ...(sessionId && { sessionId }) })
    return new Promise((resolve, reject) => {
      // Таймер снимаем при ответе и держим unref: иначе процесс не завершится,
      // пока не истекут все висящие таймауты.
      const timer = setTimeout(() => {
        this.#pending.delete(id)
        reject(new Error(`timeout: ${method}`))
      }, 120_000)
      timer.unref?.()
      this.#pending.set(id, {
        resolve: v => { clearTimeout(timer); resolve(v) },
        reject: e => { clearTimeout(timer); reject(e) },
      })
      this.#ws.send(payload)
    })
  }

  close() { try { this.#ws.close() } catch {} }
}

// Разметка Nexus частично уехала в shadow DOM веб-компонентов, поэтому поиск
// элементов идёт рекурсивно по всем теневым корням. Вставляется в page.eval.
const DEEP_CLICK = `
  const deepAll = (root, sel) => {
    const out = [];
    const walk = r => {
      out.push(...r.querySelectorAll(sel));
      for (const el of r.querySelectorAll('*')) if (el.shadowRoot) walk(el.shadowRoot);
    };
    walk(root);
    return out;
  };
`

// Вкладка живёт ровно на время работы fn и закрывается за собой.
async function withPage(cdp, fn) {
  // background: true - вкладка не активируется и окно Chrome не лезет поверх
  // всего, пока идёт обход страниц.
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank', background: true })
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true })
  const page = {
    sessionId,
    targetId,
    async goto(url, settleMs = 2500) {
      await cdp.send('Page.enable', {}, sessionId)
      await cdp.send('Page.navigate', { url }, sessionId)
      await sleep(settleMs)
      await page.dismissBanners()
    },
    async eval(expression) {
      const r = await cdp.send('Runtime.evaluate', {
        expression, returnByValue: true, awaitPromise: true,
      }, sessionId)
      if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || 'eval failed')
      return r.result.value
    },
    // Настоящий клик мышью. Синтетический el.click() не даёт "жеста
    // пользователя", и Chrome глушит инициированную им загрузку.
    async clickAt(x, y) {
      const base = { x, y, button: 'left', clickCount: 1, buttons: 1 }
      await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...base, buttons: 0 }, sessionId)
      await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', ...base }, sessionId)
      await sleep(60)
      await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...base }, sessionId)
    },
    // Ищет кнопку по тексту сквозь shadow DOM, подводит её в зону видимости и
    // возвращает координаты центра.
    async locate(rootExpr, reSource) {
      return page.eval(`(()=>{
        ${DEEP_CLICK}
        const root = ${rootExpr};
        if (!root) return null;
        const hit = deepAll(root, 'a,button').find(e => ${reSource}.test((e.textContent || '').trim()));
        if (!hit) return null;
        hit.scrollIntoView({ block: 'center', behavior: 'instant' });
        const r = hit.getBoundingClientRect();
        if (!r.width || !r.height) return null;
        return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2), text: (hit.textContent || '').trim().slice(0, 40) };
      })()`)
    },
    async dismissBanners() {
      await page.eval(`(()=>{
        for (const id of ['CybotCookiebotDialogBodyButtonDecline',
                          'CybotCookiebotDialogBodyLevelButtonLevelOptinDeclineAll']) {
          const b = document.getElementById(id); if (b) b.click();
        }
        return true;
      })()`).catch(() => {})
    },
  }
  try { return await fn(page) }
  finally { await cdp.send('Target.closeTarget', { targetId }).catch(() => {}) }
}

// --------------------------------------------------------------------------
//  Запуск / остановка Chrome
// --------------------------------------------------------------------------

async function cdpAlive(port = PORT) {
  return !!(await fetch(`http://127.0.0.1:${port}/json/version`).then(r => r.json()).catch(() => null))
}

async function launch({ url } = {}) {
  url ??= `https://www.nexusmods.com/${await gameSlug()}`
  if (await cdpAlive()) { log(`  Chrome уже поднят на :${PORT}`); return }
  if (!CHROME) die('chrome.exe не найден - задай CHROME_PATH')
  await mkdir(PROFILE, { recursive: true })
  const child = spawn(CHROME, [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${PROFILE}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--start-maximized',
    url,
  ], { detached: true, stdio: 'ignore' })
  child.unref()
  for (let i = 0; i < 40; i++) {
    await sleep(500)
    if (await cdpAlive()) { log(`  Chrome поднят на :${PORT}, профиль ${PROFILE}`); return }
  }
  die('Chrome не поднял отладочный порт')
}

async function close() {
  const cdp = await Cdp.connect()
  if (!cdp) { log('  Chrome и так не запущен'); return }
  await cdp.send('Browser.close').catch(() => {})
  cdp.close()
  log('  Chrome закрыт')
}

async function need() {
  const cdp = await Cdp.connect()
  if (!cdp) die(`нет CDP на :${PORT} - сначала "node _config/nexus.mjs launch"`)
  return cdp
}

// --------------------------------------------------------------------------
//  Страницы Nexus
// --------------------------------------------------------------------------

const modUrl = id => `https://www.nexusmods.com/${GAME}/mods/${id}`

async function whoami(cdp) {
  // На странице мода шапка с именем отрисована всегда; на лендинге игры - нет.
  const probe = await library()
    .then(l => l.mods.find(m => m.nexusId)?.nexusId)
    .catch(() => null)
  return withPage(cdp, async page => {
    await page.goto(probe ? modUrl(probe) : `https://www.nexusmods.com/${GAME}`, 3000)
    return page.eval(`(()=>{
      const t = document.body.innerText;
      const byLink = [...document.querySelectorAll('a[href*="/users/"]')]
        .map(a => (a.textContent || '').trim())
        .find(s => s && s.length < 30 && !/^my /i.test(s) && !/profile|users|sign|account/i.test(s));
      const m = t.match(/\\n([A-Za-z0-9_\\-]{3,30})\\n(?:Premium|Member|Supporter)\\n/);
      const byImg = document.querySelector('img[alt*="avatar" i]')?.getAttribute('alt') || null;
      // Сначала имя рядом со статусом аккаунта: ссылок на /users/ в шапке
      // много, и половина из них - пункты меню вроде "Download history".
      return {
        loggedIn: !t.includes('\\nLog in\\n'),
        user: (m ? m[1] : null) || byLink || byImg,
      };
    })()`)
  })
}

// Шапка мода: версия, даты, автор.
async function modInfo(cdp, id) {
  return withPage(cdp, async page => {
    await page.goto(modUrl(id), 3000)
    return page.eval(`(()=>{
      const t = document.body.innerText;
      const pick = l => { const m = t.match(new RegExp("(?:^|\\\\n)" + l + "\\\\n([^\\\\n]+)")); return m ? m[1].trim() : null; };
      return {
        name: document.title.replace(/ at .*Nexus.*$/, ''),
        version: pick('Version'),
        updated: pick('Last updated'),
        uploaded: pick('Original upload'),
        author: pick('Created by'),
      };
    })()`)
  })
}

// Changelog спрятан в свёрнутом <dt>Changelogs</dt> - раскрываем кликом.
async function changelog(cdp, id, limit = 1200) {
  return withPage(cdp, async page => {
    await page.goto(`${modUrl(id)}?tab=logs`, 3000)
    return page.eval(`(async()=>{
      const dt = [...document.querySelectorAll('dt')].find(d => d.textContent.trim().startsWith('Changelogs'));
      if (!dt) return null;
      try { (dt.firstElementChild || dt).click(); } catch {}
      await new Promise(r => setTimeout(r, 2000));
      const dd = dt.nextElementSibling;
      return dd ? dd.textContent.replace(/\\s*\\n\\s*/g, '\\n').trim().slice(0, ${limit}) : null;
    })()`)
  })
}

// Список файлов. Вкладка Files - это аккордеон: у каждого <dt> лежат готовые
// data-атрибуты (id, имя, версия, размер, дата), а кнопки скачивания - в
// соседнем <dd>. Разбирать текст карточки не нужно и ненадёжно: секции
// сворачиваются, и innerText у скрытых пропадает.
async function listFiles(cdp, id) {
  return withPage(cdp, async page => {
    await page.goto(`${modUrl(id)}?tab=files`, 3500)
    return page.eval(`(()=>{
      const dts = [...document.querySelectorAll('dt[data-id][data-name]')];
      const oldHead = [...document.querySelectorAll('h2,h3,h4')]
        .find(h => /^old files/i.test(h.textContent.trim()));
      const cards = dts.map(dt => ({
        fileId: dt.dataset.id,
        name: dt.dataset.name,
        version: dt.dataset.version || null,
        uploaded: dt.dataset.date
          ? new Date(Number(dt.dataset.date) * 1000).toISOString().replace(/\\.\\d+Z$/, 'Z')
          : null,
        sizeKb: dt.dataset.size || null,
        old: !!(oldHead && (oldHead.compareDocumentPosition(dt) & Node.DOCUMENT_POSITION_FOLLOWING)),
      }));
      if (!cards.length) {
        const t = document.body.innerText;
        const i = t.indexOf('Main files');
        return { cards: [], raw: i >= 0 ? t.slice(i, i + 600) : null };
      }
      return { cards };
    })()`)
  })
}

// Ссылку на файл берём тем же путём, что и сам сайт: legacy-эндпоинт
// GenerateDownloadUrl отдаёт подписанный адрес CDN и бесплатному аккаунту.
// Новый UI прячет кнопку в shadow DOM веб-компонента, а её клик к запросу за
// файлом почему-то не приводит - через API и надёжнее, и быстрее.
async function resolveDownloadUrl(cdp, modId, fileId) {
  return withPage(cdp, async page => {
    await page.goto(`${modUrl(modId)}?tab=files`, 3000)
    return page.eval(`(async()=>{
      const gid = window.current_game_id;
      if (!gid) return { err: 'на странице нет current_game_id' };
      const r = await fetch('/Core/Libs/Common/Managers/Downloads?GenerateDownloadUrl', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: 'fid=${fileId}&game_id=' + gid,
      });
      if (!r.ok) return { err: 'GenerateDownloadUrl вернул ' + r.status };
      const j = await r.json().catch(() => null);
      if (!j || !j.url) return { err: 'в ответе нет url: ' + JSON.stringify(j).slice(0, 200) };
      return { url: j.url, gameId: gid };
    })()`)
  })
}

// Имя в библиотеке: "<имя файла> <modId> <версия> <дата загрузки> <токен>.<ext>".
// Так называет файлы Nexus, и на эту форму опираются маски source.archive и
// разбор parseArchive ниже.
const token = () => Array.from({ length: 9 }, () =>
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 62)]).join('')

function libraryName(card, modId, ext) {
  const stamp = (card.uploaded || '').replace(/:\d\d(\.\d+)?Z$/, 'Z').replace(/:/g, '-')
  return [card.name, modId, card.version ?? '0', stamp, token()].join(' ') + ext
}

// Скачивание: ссылку берём через сайт (сессия и куки живут в Chrome), а сам
// файл тянем уже из Node - подписанный адрес CDN отдаётся кому угодно.
async function download(cdp, modId, fileId, outDir, { card = null } = {}) {
  const dest = path.resolve(ROOT, outDir)
  await mkdir(dest, { recursive: true })

  const link = await resolveDownloadUrl(cdp, modId, fileId)
  if (link.err) throw new Error(link.err)

  const res = await fetch(link.url)
  if (!res.ok) throw new Error(`CDN ответил ${res.status} ${res.statusText}`)

  // Имя файла: из карточки на Nexus, иначе - из Content-Disposition.
  const cd = res.headers.get('content-disposition') || ''
  const fromHeader = decodeURIComponent((cd.match(/filename\*?=(?:UTF-8'')?"?([^";]+)/i) || [])[1] || '')
  const ext = path.extname(fromHeader) || '.zip'
  const name = card ? libraryName(card, modId, ext) : (fromHeader || `${modId}-${fileId}${ext}`)

  const target = path.join(dest, name)
  await writeFile(target, Buffer.from(await res.arrayBuffer()))
  const { size } = await stat(target)
  return { file: name, dir: dest, bytes: size }
}

// --------------------------------------------------------------------------
//  Библиотека: что лежит локально
// --------------------------------------------------------------------------

// "Camera Control 1.0.0 3659 1.0.0 2026-07-12T21-35Z c9QVrj0bZ.zip"
//                          ^id   ^version ^дата загрузки
const globToRe = g => new RegExp(
  '^' + g.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$', 'i')

function parseArchive(fileName) {
  const parts = path.basename(fileName, path.extname(fileName)).split(' ')
  for (let i = 0; i < parts.length - 1; i++) {
    if (/^\d{4}$/.test(parts[i]) && /^\d{4}-\d{2}-\d{2}T/.test(parts[i + 2] || '')) {
      return { modId: parts[i], version: parts[i + 1], uploaded: parts[i + 2] }
    }
  }
  return null
}

async function library() {
  const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'))
  const modsDir = path.join(ROOT, manifest.library || 'mods')
  const files = (await readdir(modsDir, { withFileTypes: true }))
    .filter(d => d.isFile())
    .map(d => ({ file: d.name, ...(parseArchive(d.name) || {}) }))
    .filter(x => x.modId)

  const mods = manifest.mods
    .filter(m => m.nexusId)
    .map(m => ({
      name: m.name,
      nexusId: String(m.nexusId),
      manifestVersion: m.version,
      enabled: m.enabled !== false,
      archive: files.find(f => f.modId === String(m.nexusId)) || null,
    }))

  // Базовый Engine.ini приезжает архивом с Nexus, но модом в manifest.mods не
  // числится - находим его по той же маске, что использует деплой.
  if (manifest.engineIni?.base) {
    const ini = files.find(f => globToRe(manifest.engineIni.base).test(f.file))
    if (ini && !mods.some(m => m.nexusId === ini.modId)) mods.push({
      name: `${path.parse(manifest.engineIni.base).name.replace(/\*.*$/, '').trim()} (engineIni)`,
      nexusId: ini.modId,
      manifestVersion: null,
      enabled: true,
      archive: ini,
    })
  }
  return { manifest, modsDir, mods }
}

async function check({ json = false } = {}) {
  const cdp = await need()
  const { mods } = await library()
  const rows = []
  for (const m of mods) {
    process.stderr.write(`  ... ${m.name}\n`)
    let card = null, info = null
    try {
      info = await modInfo(cdp, m.nexusId)
      const { cards } = await listFiles(cdp, m.nexusId)
      card = pickCard(cards, m.archive, m.nexusId)
    } catch (e) { warn(`${m.name}: ${e.message}`) }
    rows.push({
      mod: m.name,
      id: m.nexusId,
      have: m.archive?.version ?? '?',
      remote: card?.version ?? info?.version ?? '?',
      updated: info?.updated ?? '?',
      stale: card ? !sameFile(m.archive, card) : false,
      enabled: m.enabled,
      file: m.archive?.file ?? null,
    })
  }
  cdp.close()
  if (json) { log(JSON.stringify(rows, null, 2)); return rows }

  const w = a => Math.max(...rows.map(r => String(r[a]).length), a.length)
  const pad = (s, n) => String(s).padEnd(n)
  log('')
  log(`  ${pad('mod', w('mod'))}  ${pad('id', 5)}  ${pad('have', w('have'))}  ${pad('nexus', w('remote'))}  updated`)
  for (const r of rows) {
    const flag = r.stale ? '!' : ' '
    log(`${flag} ${pad(r.mod, w('mod'))}  ${pad(r.id, 5)}  ${pad(r.have, w('have'))}  ${pad(r.remote, w('remote'))}  ${r.updated}`)
  }
  const stale = rows.filter(r => r.stale)
  log('')
  log(`  ${stale.length} из ${rows.length} с обновлением${stale.length ? ': ' + stale.map(r => r.mod).join(', ') : ''}`)
  return rows
}

const norm = v => String(v ?? '').replace(/^v/i, '').trim()
const squash = s => String(s ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '')

// Дата загрузки надёжнее версии: авторы перезаливают файл, не трогая номер
// (WorldSettingsUnlocker), и наоборот - в шапке мода версия своя, а у файла
// своя (PauseOnMenu: 1.0 против 1.0.0). Обе даты приводим к минуте.
const stamp = s => String(s ?? '').replace(/[-:]/g, '').replace(/T(\d{4}).*$/, 'T$1')
const sameFile = (archive, card) =>
  !!archive && !!card && stamp(archive.uploaded) === stamp(card.uploaded)

// У мода бывает несколько главных файлов - Steam/Gamepass, Capped/обычный,
// разные пресеты. Берём тот, что ближе к уже лежащему в библиотеке; если в
// библиотеке пусто - самый свежий.
function pickCard(cards, archive, modId, prefer = null) {
  const main = cards.filter(c => !c.old)
  const pool = main.length ? main : cards
  if (!pool.length) return null
  if (prefer) {
    const hit = pool.find(c => squash(c.name).includes(squash(prefer)))
    if (hit) return hit
  }
  if (archive?.file) {
    const oldBase = squash(archive.file.split(` ${modId} `)[0])
    const exact = pool.find(c => squash(c.name) === oldBase)
    if (exact) return exact
    // Иначе - у кого длиннее общий префикс с прежним именем, а при равном
    // префиксе - чьё имя ближе по длине. Это и отсекает лишние довески:
    // "(Gamepass)" против "(Steam)", "1.0.8 Capped" против "1.0.8".
    const scored = pool.map(c => {
      const n = squash(c.name)
      let i = 0
      while (i < n.length && i < oldBase.length && n[i] === oldBase[i]) i++
      return { c, prefix: i, drift: Math.abs(n.length - oldBase.length) }
    }).sort((a, b) => b.prefix - a.prefix || a.drift - b.drift)
    if (scored[0].prefix > 0) return scored[0].c
  }
  return [...pool].sort((a, b) => (b.uploaded || '').localeCompare(a.uploaded || ''))[0]
}

// Скачать главный файл каждого мода, у которого версия на Nexus разошлась с
// библиотекой. Кладём в отдельную папку: подменять архивы в библиотеке - шаг
// осознанный, старое уезжает в mods/OLD руками или скриптом деплоя.
async function update({ outDir = 'mods/_incoming', only = null } = {}) {
  const cdp = await need()
  const { mods } = await library()
  const targets = mods.filter(m =>
    (!only || only.includes(m.nexusId) || only.includes(m.name)))
  const done = [], skipped = [], failed = []

  for (const m of targets) {
    try {
      const { cards } = await listFiles(cdp, m.nexusId)
      const card = pickCard(cards, m.archive, m.nexusId, flags.variant)
      if (!card) { failed.push(`${m.name}: не нашёлся главный файл`); continue }

      const have = m.archive?.version ?? null
      if (sameFile(m.archive, card)) { skipped.push(`${m.name} (v${have})`); continue }

      log(`  ${m.name}: ${have ?? '-'} -> ${card.version}   [${card.name}]`)
      const r = await download(cdp, m.nexusId, card.fileId, outDir, { card })
      done.push(`${m.name}  ${r.file}  (${Math.round(r.bytes / 1024)} KB)`)
    } catch (e) {
      failed.push(`${m.name}: ${e.message}`)
    }
  }
  cdp.close()

  log('')
  log(`  скачано (${done.length}):`); for (const d of done) log('    ' + d)
  if (skipped.length) { log(`  уже актуальны (${skipped.length}): ${skipped.join(', ')}`) }
  if (failed.length) { log(`  не вышло (${failed.length}):`); for (const f of failed) log('    ' + f) }
  log('')
  log(`  файлы в ${path.resolve(ROOT, outDir)} - переносить в библиотеку осознанно,`)
  log('  старые архивы при этом убирать в mods/OLD.')
  return { done, skipped, failed }
}

// --------------------------------------------------------------------------
//  CLI
// --------------------------------------------------------------------------

// Всё, что ходит на Nexus, работает в контексте конкретной игры.
if (!['close', 'help', undefined].includes(cmd)) await gameSlug()

switch (cmd) {
  case 'launch': await launch(); break

  case 'close': await close(); break

  case 'login': {
    await launch({ url: 'https://users.nexusmods.com/auth/sign_in' })
    log('  Залогинься в открывшемся окне, потом: node _config/nexus.mjs status')
    break
  }

  case 'status': {
    if (!(await cdpAlive())) { log(`  CDP на :${PORT} не отвечает`); break }
    const cdp = await need()
    const who = await whoami(cdp)
    cdp.close()
    log(who.loggedIn ? `  залогинен: ${who.user ?? '(имя не прочиталось)'}` : '  не залогинен')
    break
  }

  case 'check': await check({ json: !!flags.json }); break

  case 'update':
    await update({ outDir: flags.out || 'mods/_incoming', only: args.length ? args : null })
    break

  case 'files': {
    const id = args[0] || die('нужен modId')
    const cdp = await need()
    const r = await listFiles(cdp, id)
    cdp.close()
    if (!r.cards.length) { log('  карточки файлов не разобрались. Сырой текст:'); log(r.raw); break }
    for (const c of r.cards) {
      log(`  ${c.old ? 'old ' : 'MAIN'}  file_id=${c.fileId}  v${c.version ?? '?'}  ${c.uploaded ?? ''}  ${c.sizeKb ?? '?'}KB  ${c.name}`)
    }
    break
  }

  case 'get': {
    const [modId, fileIdArg] = args
    if (!modId) die('нужно: get <modId> [fileId] [--out mods]')
    const cdp = await need()
    const { cards } = await listFiles(cdp, modId)
    // Без явного fileId берём главный файл: свежайший из секции Main files.
    const card = fileIdArg
      ? cards.find(c => c.fileId === String(fileIdArg))
      : cards.filter(c => !c.old).sort((a, b) => (b.uploaded || '').localeCompare(a.uploaded || ''))[0]
    if (!card) { cdp.close(); die(`файл не найден у мода ${modId}`) }
    log(`  качаю: ${card.name}  v${card.version}  (file_id=${card.fileId})`)
    const r = await download(cdp, modId, card.fileId, flags.out || 'mods', { card })
    cdp.close()
    log(`  готово: ${r.file}  (${Math.round(r.bytes / 1024)} KB)`)
    log(`  куда:   ${r.dir}`)
    break
  }

  case 'eval': {
    const [url, ...js] = args
    if (!url || !js.length) die('нужно: eval <url> <js>')
    const cdp = await need()
    const out = await withPage(cdp, async page => {
      await page.goto(url, Number(flags.settle || 3000))
      return page.eval(js.join(' '))
    })
    cdp.close()
    log(typeof out === 'string' ? out : JSON.stringify(out, null, 2))
    break
  }

  case 'changelog': {
    const id = args[0] || die('нужен modId')
    const cdp = await need()
    log(await changelog(cdp, id) ?? '  changelog не найден')
    cdp.close()
    break
  }

  default:
    log(await readFile(fileURLToPath(import.meta.url), 'utf8')
      .then(s => s.split('\n').filter(l => l.startsWith('//')).join('\n')))
}
