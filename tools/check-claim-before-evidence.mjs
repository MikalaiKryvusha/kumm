#!/usr/bin/env node
// check-claim-before-evidence.mjs — не пускает в коммит утверждение, написанное РАНЬШЕ наблюдения за ним.
// Класс `claim-before-evidence` (EXPERIENCE.md, EXP-0121): факт вписан в документ до того, как случилось то, что
// его производит. Два правила, оба — механические половины этого класса:
//
//   1. ШТАМП ВПЕРЕДИ ЧАСОВ. Штамп с датой И временем (`ГГГГ-ММ-ДД ЧЧ:ММ`, `…TЧЧ:ММ:СС+03:00`, `…Z`), дата которого
//      — сегодня, а момент — позже текущего, выдуман всегда. 2026-09-18 агент вписал так четыре времени за сессию
//      («STATUS: DONE (18:25)» при часах 18:15, «Correction ≈18:35» при 18:18, «Создан 18:20» при 18:16…); три
//      поймал только независимый судья. Штамп в прошлом машина от честного не отличит — это держит судья;
//      штамп на завтра и дальше — законный план; строка без времени — не штамп. Смещение учитывается,
//      без смещения время местное.
//   2. ОТМЕТКА [TESTED: <дата> БЕЗ ОТЧЁТА. TESTING_FRAMEWORK.md → «An executed run produces its report»: отметка о
//      прогоне называет его отчёт. Правило требует, чтобы в пределах отметки (до закрывающей `]`, не дальше пяти
//      строк) стоял путь `testcases/reports/<…>.md` и этот файл СУЩЕСТВОВАЛ. Тот же день: агент трижды вписал
//      `[TESTED]` в шапку ещё не запущенного прибора, а однажды — со ссылкой на отчёт, которого ещё не было.
//      Прозу про отметки правило не трогает: оно ищет только `[TESTED: ` с датой.
//
// Судятся только ДОБАВЛЕННЫЕ строки индекса (история не переписывается) и только файлы проекта: каталоги
// фреймворка (.kaif/ и зеркала навыков) приезжают из истока со своими отметками и сюда не относятся.
//
//   node tools/check-claim-before-evidence.mjs --staged     # так его зовёт tools/hooks/pre-commit
//   node tools/check-claim-before-evidence.mjs <файл…>       # целые файлы — ручная проверка
//
// Код выхода: 0 — чисто · 1 — найдено (напечатано) · 2 — НЕ ПРОЧЁЛ (git или файл; никогда не «чисто»).
// Законное исключение — `claim-ok: <причина>` на той же строке (например, время назначенной на сегодня встречи).
//
// @guard claim-before-evidence
// THREAT:         агент вписывает время, число прогона или отметку о проверке раньше, чем оно наблюдалось, и это
//                 уезжает в коммит под видом факта
// PROVED-AGAINST: `node tools/test-guards.mjs`, parts B–D: 10 file cases, 6 staged cases in throwaway repos, and the
//                 whole pre-commit hook refusing a RENAME that carries a future stamp (HEAD unmoved); the same suite
//                 against the FIRST version (commit fae2731) is red on fractional seconds, `[TESTED:` without a space,
//                 a directory argument, a content line `++ `, a non-ASCII file name, a report on disk but not in the
//                 commit, and the rename — the holes an independent judge found; plus a real commit of a probe file
//                 in this repository refused by the first version (still covered: the rules only widened)
// GAP:            штамп в прошлом, набранный наугад, не виден по построению; штамп без даты («в 18:35») и дата ДД.ММ
//                 не видны; отметка без даты и числа в прозе («121 строка») не видны — это держит судья; правило 2
//                 проверяет, что отчёт ЕСТЬ в коммите, а не что он про этот прогон
// ON-REAL-PATH:   tools/hooks/pre-commit этого репозитория, 2026-09-18 — коммит пробного файла остановлен первой
//                 версией; вторая версия подключена в тот же хук, её отказ на настоящем пути показан в одноразовом
//                 репозитории с этим же хуком (набор, часть D)
//
// [TESTED: 2026-09-18 · прогоны 1–4 и 8–9, вывод прочитан; отчёт testcases/reports/2026-09-18_claim-and-heredoc-guards.md]
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const CR = String.fromCharCode(13);
const LF = String.fromCharCode(10);
const STAMP = /(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(?:\s*(Z|[+-]\d{2}:?\d{2})(?![\d:]))?/g;
const TESTED = /\[TESTED:\s*\d{4}-\d{2}-\d{2}/;
const REPORT = /testcases\/reports\/[^\s\]`'"»)]+\.md/g;
const OK_MARK = 'claim-ok';
const FRAMEWORK = /^(\.kaif|\.claude|\.agents|\.grok|\.cline|\.roo)\//;
const MARKER_SPAN = 5;               // сколько строк отметка может занимать до закрывающей скобки

const now = Date.now();
const pad = (n) => String(n).padStart(2, '0');
const d0 = new Date(now);
const TODAY = `${d0.getFullYear()}-${pad(d0.getMonth() + 1)}-${pad(d0.getDate())}`;
const NOW_HM = `${pad(d0.getHours())}:${pad(d0.getMinutes())}`;

function stampEpoch(m) {
  const [, y, mo, d, h, mi, s, off] = m;
  const Y = +y, M = +mo - 1, D = +d, H = +h, MI = +mi, S = s ? +s : 0;
  if (!off) return new Date(Y, M, D, H, MI, S).getTime();
  if (off === 'Z') return Date.UTC(Y, M, D, H, MI, S);
  const sign = off[0] === '-' ? -1 : 1;
  const digits = off.slice(1).replace(':', '');
  return Date.UTC(Y, M, D, H, MI, S) - sign * (+digits.slice(0, 2) * 60 + +digits.slice(2, 4)) * 60000;
}

const findings = [];
const STAGED = process.argv[2] === '--staged';
// Отчёт существует там, куда уходит коммит: в режиме --staged — в индексе (файл, лежащий на диске, но не
// добавленный, в коммит не попадёт); в режиме файлов — на диске, от текущего каталога или от корня репозитория.
let TOP = null;
try { TOP = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim(); } catch { /* not a repo */ }
function reportExists(p) {
  if (STAGED) {
    try { execFileSync('git', ['cat-file', '-e', ':' + p], { stdio: 'ignore' }); return true; } catch { return false; }
  }
  return existsSync(p) || (TOP !== null && existsSync(join(TOP, p)));
}
// lines: [{ no, text }] — подряд идущие строки одного файла (добавленные, либо весь файл)
function judge(file, lines) {
  if (FRAMEWORK.test(file.split(String.fromCharCode(92)).join('/'))) return;
  lines.forEach(({ no, text }, i) => {
    if (text.includes(OK_MARK)) return;
    for (const m of text.matchAll(STAMP)) {
      if (`${m[1]}-${m[2]}-${m[3]}` !== TODAY) continue;
      if (stampEpoch(m) > now) findings.push(`${file}:${no} — штамп «${m[0]}» впереди часов (сейчас ${NOW_HM})`);
    }
    if (TESTED.test(text)) {
      let span = '';
      for (let k = i; k < Math.min(lines.length, i + MARKER_SPAN) && lines[k].no - no === k - i; k++) {
        span += lines[k].text + LF;
        if (lines[k].text.slice(k === i ? text.search(TESTED) : 0).includes(']')) break;
      }
      const paths = [...span.matchAll(REPORT)].map((r) => r[0]);
      if (!paths.length) findings.push(`${file}:${no} — отметка [TESTED: …] не называет отчёт прогона (testcases/reports/<дата>_<работа>.md)`);
      for (const p of paths) if (!reportExists(p)) findings.push(`${file}:${no} — отметка [TESTED: …] ссылается на отчёт, которого нет${STAGED ? ' в коммите' : ''}: ${p}`);
    }
  });
}

const die = (msg) => { console.error('НЕ ПРОЧЁЛ: ' + msg); process.exit(2); };
const args = process.argv.slice(2);

if (args[0] === '--staged') {
  let diff;
  try {
    // core.quotepath=false — иначе git печатает кириллическое имя файла восьмеричными кодами в кавычках, и путь
    // не узнаётся (находка судьи 2026-09-18)
    diff = execFileSync('git', ['-c', 'core.quotepath=false', 'diff', '--cached', '-U0', '--no-color', '--no-ext-diff',
      '--diff-filter=ACMR'], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  } catch (e) { die('git diff --cached не выполнился: ' + (e && e.message)); }
  const added = new Map();           // файл → [{ no, text }]
  let file = null, lineNo = 0, inHeader = false;
  for (const raw of diff.split(LF)) {
    const line = raw.endsWith(CR) ? raw.slice(0, -1) : raw;
    // Заголовок файла — только между `diff --git` и первым `@@`: добавленная строка с содержимым `++ …` выглядит в
    // diff как `+++ …`, и прежняя версия принимала её за новый файл и теряла всё до конца (находка судьи).
    if (line.startsWith('diff --git ')) { inHeader = true; file = null; continue; }
    if (inHeader && line.startsWith('+++ ')) {
      let name = line.slice(4);
      if (name.startsWith('"') && name.endsWith('"')) name = name.slice(1, -1);
      file = name.startsWith('b/') ? name.slice(2) : null;
      continue;
    }
    const hunk = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hunk) { inHeader = false; lineNo = +hunk[1]; continue; }
    if (inHeader || !file) continue;
    if (line.startsWith('+')) {
      if (!added.has(file)) added.set(file, []);
      added.get(file).push({ no: lineNo, text: line.slice(1) });
      lineNo++;
    } else if (line.startsWith(' ')) lineNo++;
  }
  for (const [f, lines] of added) judge(f, lines);
} else if (args.length) {
  for (const f of args) {
    if (!existsSync(f)) die('нет файла ' + f);
    let text;
    try { text = readFileSync(f, 'utf8'); } catch (e) { die(f + ': ' + (e && e.code || e)); }   // каталог и т.п. → «не прочёл», а не падение
    const lines = text.split(LF).map((l, i) => ({ no: i + 1, text: l.endsWith(CR) ? l.slice(0, -1) : l }));
    judge(f, lines);
  }
} else {
  die('укажи --staged или файлы');
}

for (const f of findings) console.log(f);
if (findings.length) {
  console.log(`-- утверждений раньше наблюдения: ${findings.length}. Время — из часов (date '+%Y-%m-%d %H:%M %:z'); ` +
    `отметка [TESTED: …] — после прогона и с путём к его отчёту; законное исключение — «${OK_MARK}: <причина>» на строке.`);
  process.exit(1);
}
process.exit(0);
