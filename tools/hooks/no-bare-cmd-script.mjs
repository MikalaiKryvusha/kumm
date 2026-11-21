#!/usr/bin/env node
// no-bare-cmd-script.mjs — хук PreToolUse для Bash и PowerShell: не пускает запуск .cmd/.bat по ГОЛОМУ имени через `cmd /c` или Start-Process.
//
// Зачем он есть (bugs/116, S1): 2026-11-21 20:38 агент вызвал `cmd.exe /d /s /c "install.cmd "<копия игры>" < nul"` из папки сборки RC2. У процессов
// этой сессии стоит `NoDefaultCurrentDirectoryInExePath=1`, поэтому cmd не ищет голое имя в текущей папке и сразу идёт по PATH: нашёлся установщик nvm
// в AppData\Roaming\nvm, и он из повышенной оболочки сделал `setx /M PATH …` — системный PATH обрезан до 1024 символов. Выход всегда один: полный путь
// к скрипту (`cmd /c "<полный путь>"`, Start-Process -FilePath <полный путь> -WorkingDirectory <папка>).
// Сторож узкий нарочно (судья, круг 2): широкие проверки «голое имя в начале оператора» и «слово start где угодно» отклоняли обычные команды.
// Разбор по словам, без регулярных выражений с вложенными повторами (судья, круг 3: такой вариант проверял 45 КБ дольше 120 с).
// Шесть ответов (EFFICIENT_CODE §1): запуск — каждый вызов оболочки · вход — текст команды · N — один проход по её словам · ничего не хранит ·
// бюджет — единицы мс на 45 КБ · замер — в --selftest (длинные враждебные строки, предел 200 мс на всё).
//
// Контракт хука Claude Code: JSON на stdin (`tool_name`, `tool_input.command`); код 2 — отказ, stderr уходит модели; код 0 — пропустить.
// Своя ошибка → код 0 (fail-open).
//   node tools/hooks/no-bare-cmd-script.mjs --selftest
//
// @guard no-bare-cmd-script
// THREAT:         агент запускает .cmd/.bat по голому имени через cmd /c или Start-Process, а находится одноимённый чужой скрипт из PATH
// PROVED-AGAINST: --selftest: дословная команда 2026-11-21 20:38 (bugs/116) и формы судьи, круги 1 и 3, отклонены; ложные отказы круга 2 пропущены
// GAP:            голое имя прямо строкой (`install.cmd x`, `& 'x.cmd'`, `echo Y | x.cmd`, внутри try/if/for, `powershell -c`, `bash -c`, `iex`),
//                 алиас `start`, `cmd/c` без пробела, `^"x.cmd^"`, имя в переменной, `Invoke-Item`, `cmd /k`, скрипт без расширения, строка, перенесённая
//                 обратной кавычкой или `\` посреди вызова, — не судит. Пропущены нарочно известные обёртки (npm.cmd, npx.cmd, pnpm.cmd, yarn.cmd, code.cmd).
//                 ЛОЖНЫЙ отказ: команда, которая лишь УПОМИНАЕТ форму `cmd /c x.cmd` одной строкой (grep, текст сообщения в -m) — сообщение файлом (-F)
// ON-REAL-PATH:   .claude/settings.local.json (PreToolUse, matcher Bash|PowerShell), 2026-11-21 ≈20:53 — живой вызов PowerShell
//                 `cmd.exe /d /c "kumm_guard_probe_7f3.cmd"` отклонён harness'ом с этим сообщением; в новом клоне запись добавляется в местные настройки заново
// [TESTED: 2026-11-21 · selftest и живой отказ прочитаны · testcases/reports/2026-11-21_no-bare-cmd-script-guard.md]
import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

const TOK = /"[^"\n]*"|'[^'\n]*'|\S+/g                               // слово: строка в кавычках или кусок без пробелов — один линейный проход
const unq = t => t.replace(/^[`\\"'(]+/, '').replace(/[`\\"',)]+$/, '')
const TOOL_SHIMS = new Set(['npm.cmd', 'npx.cmd', 'pnpm.cmd', 'yarn.cmd', 'code.cmd'])
// Голое имя: без разделителей пути и без диска, расширение .cmd или .bat; известные обёртки инструментов ищут по PATH намеренно.
const bare = t => { const n = unq(t || ''); return /^[^\\/:<>|&;=\s"']+\.(?:cmd|bat)$/i.test(n) && !TOOL_SHIMS.has(n.toLowerCase()) ? n : null }
const isCmd = t => /(?:^|[\\/])cmd(?:\.exe)?$/i.test(unq(t || ''))
const SWITCHES = new Set(['wait', 'nonewwindow', 'passthru', 'usenewenvironment'])
// Текст после /c у cmd: каждая команда цепочки (&&, &, ||, |) по первому слову, с необязательными call и start "".
function afterC(rest) {
  for (const seg of rest.split(/&&|\|\||&|\|/)) {
    const w = seg.replace(/\\"/g, ' ').split(/[\s"'`<>()]+/).filter(Boolean)   // слова без кавычек: `"install.cmd x"`, `install.cmd>out.log`
    let i = /^(?:call|start)$/i.test(w[0] || '') ? 1 : 0                // `start "" x.cmd`: пустой заголовок исчезает при разрезе по кавычкам
    if (isCmd(w[i])) {                                                  // вложенный `… & cmd /c x.cmd` в той же цепочке
      const k = w.findIndex((x, n) => n > i && /^(?:\/{1,2}[a-bd-z](?::\w+)?)*\/{1,2}c$/i.test(x))
      if (k > 0) i = /^(?:call|start)$/i.test(w[k + 1] || '') ? k + 2 : k + 1
    }
    const b = bare(w[i])
    if (b) return b
  }
  return null
}
// Конец ключа /c в слове (ключи перед ним склеены: /d/s/c), с кавычками перед ним; -1 — не /c.
const cEnd = t => { const m = /^(?:\\?["'])*(?:\/{1,2}[a-bd-z](?::\w+)?)*\/{1,2}c(?=$|[\\"'])/i.exec(t); return m ? m[0].length : -1 }
export function hit(command) {
  for (const line of command.split(/\r?\n/)) {
    const toks = [...line.matchAll(TOK)]
    // Граница оператора для Start-Process: индекс следующего Start-Process / saps / ; / | — один обратный проход (без квадрата на длинной строке).
    const stop = new Array(toks.length + 1).fill(line.length)
    for (let k = toks.length - 1; k >= 0; k--) stop[k] = /^(?:Start-Process|saps|;|\|)$/i.test(toks[k][0]) ? toks[k].index : stop[k + 1]
    let cmdDone = false                                                  // afterC уже прошёл цепочку до конца строки
    for (let i = 0; i < toks.length; i++) {
      const t = toks[i][0]
      if (!cmdDone && isCmd(t)) {                                       // cmd [ключи] /c …
        for (let j = i + 1; j < toks.length; j++) {
          const u = toks[j][0], e = cEnd(u)
          if (e >= 0) { const b = afterC(line.slice(toks[j].index + e)); if (b) return b; cmdDone = true; break }
          if (!/^(?:--%|\/{1,2}[a-z](?::\w+)?)+$/i.test(u)) break       // не ключ cmd — это не запуск через /c
        }
      }
      if (/^(?:Start-Process|saps)$/i.test(t)) {                        // Start-Process: файл после -FilePath/-File (или -FilePath:x) либо первым позиционным
        let file = null, at = -1
        for (let j = i + 1; j < toks.length && file === null; j++) {
          const u = toks[j][0]
          if (u === ';' || u === '|') break
          if (u.startsWith('-')) {
            const name = u.slice(1).split(':')[0].toLowerCase(), inline = u.includes(':') ? u.slice(u.indexOf(':') + 1) : null
            if (name === 'filepath' || name === 'file') { if (inline !== null) { file = inline; at = j } else if (j + 1 < toks.length) { file = toks[j + 1][0]; at = j + 1 } }
            else if (!SWITCHES.has(name) && inline === null) j++              // значение параметра (-Verb RunAs, -WorkingDirectory D:\x)
          } else { file = u; at = j }
        }
        if (file !== null) {
          if (isCmd(file)) {                                            // Start-Process cmd … "/d /c x.cmd" / '/c','x.cmd' / позиционно
            const rest = line.slice(toks[at].index + toks[at][0].length, stop[at + 1]).replace(/["'`,]/g, ' ')
            const m = /(?:^|\s)\/{1,2}c(?=\s|$)/i.exec(rest)
            if (m) { const b = afterC(rest.slice(m.index + m[0].length)); if (b) return b }
          } else { const b = bare(file); if (b) return b }
        }
      }
    }
  }
  return null
}

const main = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href   // при import — только hit, без чтения stdin
if (main && process.argv[2] === '--selftest') {
  const refuse = [
    'cmd.exe /d /s /c "install.cmd `"$g`" < nul" | Select-Object -Last 5',   // дословно bugs/116
    'cmd /c install.cmd "D:\\game"', 'cmd //c uninstall_krinik_build.cmd', "cmd.exe /c 'collect_report.bat'", 'Start-Process install.cmd -ArgumentList x',
    'Start-Process -FilePath "setup.bat"',
    // судья, круг 1
    'cmd /c install.cmd>out.log', 'cmd /c install.cmd<nul', 'cmd /c "install.cmd&echo done"', 'cmd /c"install.cmd x"', 'cmd.exe /c "\\"install.cmd\\" \\"D:\\g\\""',
    'cmd /v:on /c install.cmd', 'cmd /d/s/c install.cmd', 'cmd.exe --% /c install.cmd', 'cmd /c call install.cmd', 'cmd /c start "" install.cmd',
    'Start-Process -Wait -FilePath install.cmd', 'Start-Process -File install.cmd', 'saps install.cmd', 'Start-Process cmd.exe -ArgumentList "/c install.cmd" -Wait',
    // судья, круг 3
    'cmd /c "pushd D:\\x && install.cmd"', 'cmd /c "cd /d D:\\x & install.cmd"', 'cmd /c npm.cmd ci & cmd /c install.cmd',
    'Start-Process -Verb RunAs install.cmd', 'Start-Process -Verb RunAs -FilePath install.cmd', 'Start-Process -WorkingDirectory D:\\x -FilePath install.cmd -Wait',
    'Start-Process -WindowStyle Hidden install.cmd', 'Start-Process -ArgumentList x -FilePath install.cmd', 'Start-Process -FilePath:install.cmd',
    'Start-Process cmd -ArgumentList "/d /c install.cmd"', "Start-Process cmd -ArgumentList '/c','install.cmd'", 'Start-Process cmd -ArgumentList "/d","/c","install.cmd"',
    'Start-Process cmd.exe "/c install.cmd"', 'Start-Process cmd -Args "/c install.cmd"', 'Start-Process -FilePath "C:\\Windows\\System32\\cmd.exe" -ArgumentList "/c install.cmd"']
  const pass = [
    'cmd.exe /d /s /c ""D:\\work\\g\\uninstall_krinik_build.cmd" < nul"', 'cmd /c "D:/work/g/install.cmd" x', 'cmd /c .\\install.cmd', 'cmd /c echo install.cmd',
    'Start-Process notepad.exe -ArgumentList x', 'Start-Process -FilePath "D:\\g\\install.cmd" -WorkingDirectory D:\\g -ArgumentList "log=out.cmd"',
    // судья, круг 2: ложные отказы
    'npm.cmd run build', 'cmd /c npm.cmd install', 'git commit -m @\'\nfix: guard\n\ninstall.cmd now takes the full path\n\'@',
    'gh release upload v1 a.zip `\n  install.cmd', 'git add \\\n  a.cmd', "'install.cmd','uninstall.cmd' | ForEach-Object { Test-Path $_ }",
    'grep -n "Start-Process" install.cmd', 'grep start install.cmd', 'Select-String -Pattern start -Path install.cmd', 'node tools/start/run.mjs install.cmd',
    'cat start.log install.cmd', 'Start-Job { Get-Content a.cmd }', 'Start-Transcript -Path log.cmd', 'Start-Process notepad install.cmd', 'my-cmd /c install.cmd',
    'git add a.cmd', 'node script.mjs', 'Get-Content install.cmd', 'x.cmd /c y.cmd', 'Start-Process -FilePath D:\\x\\a.exe -ArgumentList install.cmd',
    'Start-Process cmd -ArgumentList "/c D:\\x\\install.cmd"', 'Start-Process powershell -ArgumentList "-c Get-Content install.cmd"',
    'cmd /c "cd /d D:\\x && D:\\x\\install.cmd"', 'cmd /c npm.cmd ci']
  let bad = 0
  for (const c of refuse) if (!hit(c)) { bad++; console.log(`FAIL not refused: ${c}`) }
  for (const c of pass) if (hit(c)) { bad++; console.log(`FAIL refused: ${c}`) }
  // Цена (круг 3): длинные враждебные строки — все вместе не дольше 200 мс.
  const t0 = Date.now()
  for (const s of ['cmd /c' + ' '.repeat(40000), '\n'.repeat(40000), 'cmd /c x & '.repeat(4000), 'Start-Process cmd '.repeat(2500), 'cmd /c ' + 'a'.repeat(40000),
    'Start-Process -A b '.repeat(2500), 'cmd '.repeat(10000)]) hit(s)
  const ms = Date.now() - t0
  if (ms > 200) { bad++; console.log(`FAIL the long inputs took ${ms} ms`) }
  console.log(bad ? `selftest: ${bad} failure(s)` : `selftest: ${refuse.length} refused, ${pass.length} passed, long inputs in ${ms} ms`)
  process.exit(bad ? 1 : 0)
}

if (main) {
  try {
    const ev = JSON.parse(readFileSync(0, 'utf8') || '{}')
    const name = hit(String(ev?.tool_input?.command || ''))
    if (name) {
      process.stderr.write(`KUMM guard (tools/hooks/no-bare-cmd-script.mjs, bugs/116): «${name}» is started by its bare name, so it is looked up in PATH `
        + `(NoDefaultCurrentDirectoryInExePath=1 skips the current folder) and a different script of that name may run (2026-11-21 20:38 nvm's install.cmd `
        + `truncated the machine PATH). Give the FULL path to the script: cmd /c "<full path>" or Start-Process -FilePath <full path> -WorkingDirectory <folder>.\n`)
      process.exit(2)
    }
  } catch { /* fail-open */ }
  process.exit(0)
}
