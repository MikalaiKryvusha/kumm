#!/usr/bin/env node
// guide-no-raw-voice.mjs — страж: в своде правил KUMM (AGENT_GUIDE.md, HOUSE_RULES.md, CLAUDE.md) нет сырого голоса владельца.
//
// Зачем: свод правил — тезисная методичка истин, договорённостей, инструкций, правил и ограничений проекта; не летопись, не
// шпаргалка и не хранилище сообщений владельца. Правило «в свод идёт правило, а не цитата» стоит в каноне KAIF с 2.8 (#89) и всё
// равно не держало: агент 2026-11-10 вписал в AGENT_GUIDE абзац из семи дословных реплик владельца. Правило, которое агент знает
// и всё равно нарушает, держит код (KAIF #196). Дословные слова живут в источнике — PROJECT_HISTORY.md, интервью; в своде — одна
// строка-адрес `[OWNER] <дата> · <где лежат слова>`.
//
// Что судит строка за строкой (findHits):
//   * кириллица — свод пишется по-английски, русское в нём — голос владельца (HOUSE_RULES правило 1); строка данных (надпись интерфейса,
//     термин, вывод инструмента) несёт `<!-- verbatim-ok: <причина> -->` — причина обязательна, и это исключение ТОЛЬКО для кириллицы;
//   * строка с меткой `[OWNER]` и парой кавычек где угодно на ней ("…", «…», “…”, „…“, ‹…›, ‘…’) — дословная цитата; апостроф не пара.
// Как судит — ПО РАЗНИЦЕ (newHits): находкой считается строка, которой не было до правки (ключ — вся строка, с кратностью). Поэтому
// чистка старых строк проходит, а символ веры (KAIF:CREED в AGENT_GUIDE, текст владельца по канону) отдельного исключения не требует:
// его строки уже стоят в файле. Новая строка внутри символа веры или его новая формулировка — находка: символ веры меняется по слову
// владельца (судья, третий круг: вписанная пара маркеров и растянутый блок выключали стража, пока исключение было).
//
// Входы:
//   (без ключей)       PreToolUse Write | Edit | MultiEdit сводного файла этого репозитория: правка применяется в памяти к файлу на диске
//                      (переводы строк к LF), судятся новые строки; находка — код 2.
//   --staged           pre-commit: сводные файлы индекса против HEAD (по разнице); находка — код 1; своя поломка — код 3.
//   --check <файл…>    весь файл (ручной осмотр); блок символа веры AGENT_GUIDE.md здесь не судится; находка — код 1.
//   --selftest         красные и зелёные образцы; код 0, если страж различает их.
// Своя поломка в хуке → код 0 (сломанный страж не запирает правку); в остальных входах → код 3.
//
// @guard guide-no-raw-voice
// THREAT:         дословная реплика владельца (по-русски или английской цитатой под [OWNER]) входит в свод правил
// PROVED-AGAINST: --check 2026-11-10 до чистки — AGENT_GUIDE.md 32 находки, HOUSE_RULES.md 66, CLAUDE.md 1; --selftest — красные образцы трёх кругов
//                 судьи (цитата с датой, тире, двоеточием, перед меткой, в закрывающих кавычках; вписанная пара маркеров; растянутый символ веры;
//                 verbatim-ok на цитате и без причины) и зелёные (строка-адрес, апостроф, чистка, данные с причиной)
// GAP:            английские слова владельца БЕЗ кавычек не видит — ни без метки, ни после неё (`[OWNER]` 2026-11-10: stop closing early),
//                 ни в обёртке из обратных кавычек, ни цитату без метки («The owner (2026-10-31): "…"»), ни кавычки дальше строки после
//                 метки — английская цитата ловится эвристикой, это суждение, не узор (судья, пятый круг; русская речь ловится в UTF-8, файл не в UTF-8 — сам находка); `verbatim-ok`, поставленный
//                 на голос намеренно (метка строкой выше), не ловится — это обход правила, а не ошибка; хук пропускает правку файла, который уже
//                 не в UTF-8 (его ловит pre-commit); чужие проекты не судит; правку одного слова в старой русской строке судит как новую строку (такой
//                 строки в чистом своде нет); PreToolUse проведён в .claude/settings.local.json (вне git) — у свежего клона только pre-commit;
//                 русское, нарочно записанное HTML-сущностями (`&#1057;`), не видит — так не вставляют, так шифруют; переименование, меняющее
//                 только регистр имени, судится как новый файл (отказ на символе веры — в сторону строгости)
// ON-REAL-PATH:   2026-11-10 ≈02:00 — живая правка AGENT_GUIDE.md с русской строкой отбита клиентом (PreToolUse); `--staged` — в одноразовом
//                 репозитории (Add-Content в 1251 → код 1) и на коммите этой чистки (testcases/reports/2026-11-10_guide-no-raw-voice.md)
// Судья — семь кругов; седьмой: «nothing above cosmetic».
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// Корень репозитория — две папки над этим файлом (tools/hooks/…).
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
// Сводные файлы — пути от корня. Двойник входит сюда, когда вычищен (KAIF #196, обход двойников).
const GUARDED = ['AGENT_GUIDE.md', 'HOUSE_RULES.md', 'CLAUDE.md'];
const CYRILLIC = /[Ѐ-ӿ]/;
const OWNER = /\[OWNER\]/;
// Пары кавычек; одинарная ASCII — только не внутри слова (апостроф «owner's» — не кавычка).
const QUOTE_PAIR = /"[^"]+"|«[^»]+»|“[^”]+”|„[^“”]+[“”]|‹[^›]+›|‘[^’]+’|”[^”]+”|(?<![\w'])'[^']+'(?![\w])/;
const DATA_OK = /<!--\s*verbatim-ok:\s*\S[^>]*-->/;
const CREED_BEGIN = /^\s*<!--\s*KAIF:CREED:BEGIN\s*-->\s*$/;
const CREED_END = /^\s*<!--\s*KAIF:CREED:END\s*-->\s*$/;

// Строки-находки текста. creed — пропустить первый блок символа веры (только --check по AGENT_GUIDE.md: ручной осмотр всего файла).
// Строки — по CRLF, LF и одиночному CR: одиночный CR склеил бы две строки в одну, а разметка показала бы две (судья, шестой круг).
const splitLines = (t) => t.split(/\r\n|\r|\n/);

// Текст файла из байтов: не UTF-8 (кодовая страница 1251 от Set-Content в PowerShell 5.1, UTF-16 от Out-File) — сам по себе находка:
// русское в такой записи читается как «�» без кириллицы и проскочило бы (судья, шестой круг).
const UTF8 = new TextDecoder('utf-8', { fatal: true });
export function decodeRulebook(buf) {
  if (buf.includes(0)) return null;
  try { return UTF8.decode(buf); } catch { return null; }
}

export function findHits(text, { creed = false } = {}) {
  const lines = splitLines(text);
  let skip = null;
  if (creed) {
    const b = lines.findIndex((l) => CREED_BEGIN.test(l));
    const e = b < 0 ? -1 : lines.findIndex((l, i) => i > b && CREED_END.test(l));
    if (e > b) skip = [b, e];
  }
  // Цитата под [OWNER] — пара кавычек на строке метки ИЛИ перенесённая: свод переносится по ширине, и кавычка, открытая на строке метки,
  // закрывается на следующей, или следующая строка начинается с цитаты (`> "…"`) — судья, четвёртый круг. Дальше по абзацу не ищется:
  // там законно стоят названия разделов в кавычках. Ключ такой находки — строка метки и следующая: новая следующая — новая находка.
  // Следующая строка начинается с цитаты — допускается короткое вступление (`(chat: "…"`, `> — "…"`); дальше по строке не ищется (судья, пятый круг).
  const OPENS = /^\s*>?\s*\(?(?:[\w-]+\s*){0,2}[:—–-]?\s*[«"„“‹‘”']/;
  // Подпись под цитатой: строка метки начинается с тире — цитата стоит на строке ВЫШЕ (`> "…"` / `> — [OWNER] дата`).
  const ATTRIBUTION = /^\s*>?\s*[—–-]\s*`?\[OWNER\]/;
  const hits = [];
  lines.forEach((line, i) => {
    if (skip && i >= skip[0] && i <= skip[1]) return;
    if (OWNER.test(line)) {
      const near = (k) => ((lines[k] || '').trim() === '' ? '' : lines[k]);
      const next = near(i + 1), prev = ATTRIBUTION.test(line) ? near(i - 1) : '';
      const m = QUOTE_PAIR.exec(next ? `${line} ${next}` : line);
      if ((m && (m.index < line.length || OPENS.test(next))) || (prev && QUOTE_PAIR.test(prev))) {
        hits.push({ line: i + 1, why: 'a quote under [OWNER]', text: line.trim().slice(0, 140), key: `${prev.trim()}\n${line.trim()}\n${next.trim()}` });
        return;
      }
    }
    // verbatim-ok — для данных; в строке с меткой владельца русское — его голос, исключения нет (судья, четвёртый круг)
    if (CYRILLIC.test(line) && (OWNER.test(line) || !DATA_OK.test(line))) {
      hits.push({ line: i + 1, why: 'Russian text (the owner\'s voice)', text: line.trim().slice(0, 140), key: line.trim() });
    }
  });
  return hits;
}

// Находки, которых не было до правки (по всей строке, с кратностью).
export function newHits(before, after) {
  const seen = new Map();
  for (const h of findHits(before)) seen.set(h.key, (seen.get(h.key) || 0) + 1);
  return findHits(after).filter((h) => {
    const n = seen.get(h.key) || 0;
    if (n > 0) { seen.set(h.key, n - 1); return false; }
    return true;
  });
}

// Путь — сводный файл ЭТОГО репозитория? Без учёта регистра (NTFS), без хвостовых точек и пробелов и без `::$DATA` — Windows открывает
// по ним тот же файл (судья, третий круг); именованный поток `:имя:$DATA` — другой файл, его снятие лишь стережёт с запасом.
const relPath = (abs) => relative(ROOT, resolve(String(abs).replace(/:[^:\\/]*:\$DATA$|::\$DATA$/i, '').replace(/[. ]+$/, ''))).replace(/\\/g, '/');
const relKey = (abs) => relPath(abs).toLowerCase();
const GUARDED_KEYS = GUARDED.map((g) => g.toLowerCase());
const isGuardedPath = (abs) => typeof abs === 'string' && abs !== '' && GUARDED_KEYS.includes(relKey(abs));

function report(where, hits) {
  for (const h of hits) process.stderr.write(`${where}:${h.line}: ${h.why}: ${h.text}\n`);
}

const HINT =
  'The rulebook takes the RULE, not the owner\'s words: write the rule as an English statement plus one provenance line\n' +
  '`[OWNER] <date> · <where the verbatim lives>`; the verbatim goes to PROJECT_HISTORY.md (a chronicle entry) or stays in the interview.\n' +
  'Russian DATA, not voice (a UI string, a term, a tool\'s output) → add `<!-- verbatim-ok: <reason> -->` on that line (never for a quote,\n' +
  'never on a line with [OWNER]). A section NAME next to [OWNER] is written without quotes (AGENT_GUIDE.md → Notes from the human);\n' +
  'the owner\'s words are never re-dressed in backticks or another wrapper — they go to the chronicle.\n' +
  'The creed is the owner\'s text: it changes by his word only.\n';

// Применяет правку инструмента к тексту в памяти. Не нашлось old_string — null (инструмент сам откажет).
function applyEdits(text, edits) {
  let out = text;
  for (const e of edits) {
    if (typeof e.old_string !== 'string' || typeof e.new_string !== 'string') return null;
    if (e.old_string === '') { out = e.new_string + out; continue; }
    if (!out.includes(e.old_string)) return null;
    out = e.replace_all ? out.split(e.old_string).join(e.new_string) : out.replace(e.old_string, () => e.new_string);
  }
  return out;
}

// Переводы строк — к LF и в файле, и в правке: файл с CRLF после checkout (core.autocrlf) не совпал бы со строкой правки с LF.
const lf = (s) => (typeof s === 'string' ? s.replace(/\r\n/g, '\n') : s);

function hookMode() {
  let event;
  try { event = JSON.parse(readFileSync(0, 'utf8').replace(/^﻿/, '') || '{}'); } catch { process.exit(0); }
  if (!event || typeof event !== 'object') process.exit(0);
  const input = event.tool_input || {};
  if (!['Write', 'Edit', 'MultiEdit'].includes(event.tool_name) || !isGuardedPath(input.file_path)) process.exit(0);
  const before = lf(existsSync(input.file_path) ? readFileSync(input.file_path, 'utf8') : '');
  const edits = (event.tool_name === 'Edit' ? [input] : (Array.isArray(input.edits) ? input.edits : []))
    .filter((e) => e && typeof e === 'object').map((e) => ({ ...e, old_string: lf(e.old_string), new_string: lf(e.new_string) }));
  const after = event.tool_name === 'Write' ? lf(String(input.content ?? '')) : applyEdits(before, edits);
  // old_string не найден — правка не применится; судим её новый текст против всего файла
  const hits = after === null ? newHits(before, edits.map((e) => e.new_string).filter((t) => typeof t === 'string').join('\n')) : newHits(before, after);
  if (!hits.length) process.exit(0);
  process.stderr.write(`KUMM guard (tools/hooks/guide-no-raw-voice.mjs): the edit of ${relPath(input.file_path)} brings the owner's raw voice:\n`);
  report('new text', hits);
  process.stderr.write(HINT);
  process.exit(2);
}

function checkFiles(files) {
  let bad = 0;
  for (const f of files) {
    const text = decodeRulebook(readFileSync(f));
    if (text === null) { process.stderr.write(`${f}: not UTF-8 (a 1251 or UTF-16 write?) — Russian in it cannot be judged\n`); bad++; continue; }
    const hits = findHits(text, { creed: relKey(f) === 'agent_guide.md' });
    report(f, hits);
    bad += hits.length;
  }
  if (bad) process.stderr.write(`guide-no-raw-voice: ${bad} finding(s) (lines of the owner's raw voice, or a file not in UTF-8).\n` + HINT);
  else console.log(`guide-no-raw-voice: clean — ${files.length} file(s)`);
  return bad ? 1 : 0;
}

function stagedMode() {
  // -z: без него git берёт в кавычки пути с не-ASCII, и сводный файл в такой папке ускользнул бы (судья, первый круг).
  const gitBuf = (args) => execFileSync('git', args, { maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'ignore'] });
  const top = gitBuf(['rev-parse', '--show-toplevel']).toString('utf8').trim();
  const names = gitBuf(['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z']).toString('utf8').split('\0')
    .filter((n) => n && isGuardedPath(resolve(top, n)));
  let bad = 0;
  for (const n of names) {
    const staged = decodeRulebook(gitBuf(['show', `:${n}`]));
    if (staged === null) { process.stderr.write(`${n}: not UTF-8 (a 1251 or UTF-16 write?) — Russian in it cannot be judged\n`); bad++; continue; }
    let head = '';
    try { head = gitBuf(['show', `HEAD:${n}`]).toString('utf8'); } catch { head = ''; }   // нового файла в HEAD нет — судится весь
    const hits = newHits(lf(head), lf(staged));
    report(n, hits);
    bad += hits.length;
  }
  if (bad) process.stderr.write(`guide-no-raw-voice: ${bad} finding(s) in the staged rulebook (new lines of the owner's raw voice, or a file not in UTF-8).\n` + HINT);
  return bad ? 1 : 0;
}

function selftest() {
  const C0 = '<!-' + '- KAIF:CREED:BEGIN -->', C1 = '<!-' + '- KAIF:CREED:END -->';
  const lines = [
    ['cyrillic line', '`[OWNER]` 2026-11-01 «периодически код отдавай на ревью»', 1],
    ['English quote right after the tag', '[OWNER] "quote in English"', 1],
    ['quote after a date', '`[OWNER]` 2026-11-01 21:26 "do it"', 1],
    ['quote after an em dash', '`[OWNER]` 2026-11-01 21:26 — "do it"', 1],
    ['quote after a colon', '[OWNER]: "x"', 1],
    ['quote before the tag', '> "Stop closing the chat early." — [OWNER] 2026-10-31', 1],
    ['quote far after the tag', '`[OWNER]` 2026-10-31 21:26–21:27 · 2026-11-02 08:35–08:36 (chat): "a long way off"', 1],
    ['closing curly quotes as a pair', '`[OWNER]` 2026-10-31: ”do it”', 1],
    ['single curly pair', '[OWNER] 2026-10-31 ‘x’', 1],
    ['apostrophe is not a quote', 'Rule. `[OWNER]` 2026-10-31 · the owner\'s chronicle entry.', 0],
    ['provenance line', 'Rule. `[OWNER]` 2026-11-01 · chronicle entry 2026-11-01', 0],
    ['quoted title without the tag', 'See the "Languages" table.', 0],
    ['Russian data with a reason', 'Labels «Играть» <!-- verbatim-ok: UI strings -->', 0],
    ['verbatim-ok without a reason', 'Текст <!-- verbatim-ok: -->', 1],
    ['verbatim-ok does not cover a quote', '`[OWNER]` 2026-10-31 "you close too soon" <!-- verbatim-ok: x -->', 1],
    ['bare verbatim-ok word', 'Текст verbatim-ok: x', 1],
    ['tag on one line, the quote on the next', '`[OWNER]` 2026-11-10:\n> "Stop closing early."', 1],
    ['one quote wrapped across lines', '[OWNER] 2026-11-10 said "stop closing\nearly, warn only".', 1],
    ['a quote in the next paragraph is not his', '`[OWNER]` 2026-11-10 · chronicle entry.\n\nSee the "Languages" table.', 0],
    ['verbatim-ok does not cover Russian on an [OWNER] line', '`[OWNER]` 2026-11-10 закрывайся на 85 <!-- verbatim-ok: x -->', 1],
    ['a title in backticks next to the tag', '`[OWNER]` 2026-11-10 · chronicle entry `Chat closure`.', 0],
    ['blockquote attribution under the quote', '> "Stop closing the chat early."\n> — `[OWNER]` 2026-10-31', 1],
    ['quote after a short lead on the next line', 'Close at 85 %. `[OWNER]` 2026-10-31\n(chat: "warn only, do not close").', 1],
    ['ASCII single quotes', "[OWNER] 2026-10-31 'stop closing early'", 1],
    ['a quoted name deep in the next line is not a quote', '`[OWNER]` 2026-10-31 · chronicle entry.\nThe rule in the section "Languages" stands.', 0],
    ['a lone CR does not glue a Russian line to a verbatim-ok line', 'Rule. <!-- verbatim-ok: term -->\rзакрывайся', 1],
  ];
  let fail = 0;
  const check = (name, got, want) => { if (got !== want) { fail++; console.log(`FAIL ${name}: ${got}, want ${want}`); } };
  for (const [name, text, want] of lines) check(name, findHits(text).length, want);
  // по разнице: правки символа веры и маркеров
  const file = `Intro.\n${C0}\n> ВЕРИТЬ\n${C1}\nRule «старое»\nEnd.`;
  const edit = (o, n) => newHits(file, applyEdits(file, [{ old_string: o, new_string: n }])).length;
  check('cleanup of an old line', edit('Rule «старое»', 'Rule.'), 0);
  check('a new Russian line', edit('End.', 'End.\nНовое'), 1);
  check('creed widened (END moved down)', edit(`${C1}\n`, `> закрывайся на 85\n${C1}\n`), 1);
  check('a creed pair injected around a Russian line', edit('End.', `End.\n${C0}\nсделай так\n${C1}`), 1);
  check('the creed reworded (by the owner only)', edit('> ВЕРИТЬ', '> ВЕРИТЬ В ПРОДУКТ'), 1);
  check('creed lines moved, unchanged', edit(`Intro.\n${C0}\n> ВЕРИТЬ\n${C1}\n`, `${C0}\n> ВЕРИТЬ\n${C1}\nIntro.\n`), 0);
  const longOld = `Rule ${'я'.repeat(150)}`;
  check('a long old line with a new tail', newHits(longOld, longOld + ' ещё').length, 1);
  // --check по AGENT_GUIDE: блок символа веры не судится
  check('--check skips the creed block', findHits(`${C0}\n> ВЕРИТЬ\n${C1}`, { creed: true }).length, 0);
  // путь: только сводные файлы этого репозитория, без учёта регистра, без хвостовой точки и потока
  const paths = [[resolve(ROOT, 'agent_guide.md'), true], [resolve(ROOT, 'HOUSE_RULES.md'), true], [resolve(ROOT, 'AGENT_GUIDE.md.'), true],
    [resolve(ROOT, 'AGENT_GUIDE.md') + '::$DATA', true], [resolve(ROOT, '..', 'Palworld', 'AGENT_GUIDE.md'), false],
    [resolve(ROOT, 'researches', 'x', 'AGENT_GUIDE.md'), false]];
  for (const [p, want] of paths) check(`path ${p}`, isGuardedPath(p), want);
  // кодировка: русское в 1251 и UTF-16 — «не UTF-8», UTF-8 — читается
  check('cp1251 bytes are not UTF-8', decodeRulebook(Buffer.from([0x52, 0x20, 0xe7, 0xe0, 0xea])) === null, true);
  check('UTF-16 bytes are not UTF-8', decodeRulebook(Buffer.from('Rule', 'utf16le')) === null, true);
  check('UTF-8 Russian reads', decodeRulebook(Buffer.from('Правило', 'utf8')), 'Правило');
  const total = lines.length + 8 + paths.length + 3;
  console.log(`selftest: ${total} checks, ${fail} failed`);
  return fail ? 1 : 0;
}

const args = process.argv.slice(2);
try {
  if (args[0] === '--check') {
    if (args.length < 2) { process.stderr.write('guide-no-raw-voice: --check needs file names\n'); process.exit(3); }
    process.exit(checkFiles(args.slice(1)));
  }
  else if (args[0] === '--staged') process.exit(stagedMode());
  else if (args[0] === '--selftest') process.exit(selftest());
  else if (args.length) { process.stderr.write(`guide-no-raw-voice: unknown flag ${args[0]} (--check · --staged · --selftest; no flag = the PreToolUse hook)\n`); process.exit(3); }
  else hookMode();
} catch (e) {
  process.stderr.write(`guide-no-raw-voice: own failure — ${e && e.message}\n`);
  process.exit(args.length ? 3 : 0);
}
