#!/usr/bin/env node
// style-gate.mjs — хук Claude Code: перевод Svarog's Dream пишется только по прочитанной методичке.
//
// Зачем: `[OWNER]` «Правила стиля нужно записать в специальную методичку» · «и чтение методички - обязательством в хук
// делаем» · 2026-10-06 ≈15:27–15:30. Правило, которое держится памятью, теряется к середине длинной сессии; хук держит его кодом.
//
// Два режима:
//   --mark  (PostToolUse, matcher Read): агент прочёл файл методички инструментом Read → метка-файл --stamp обновляется.
//   --gate  (PreToolUse, matcher Write|Edit|Bash): действие пишет перевод — Write/Edit файла перевода сборки
//           (`translation/*_ru.tsv`, `translation/glossary*.tsv`, `translation/help_ru.py`, `_config/xunity/zz_*.txt`)
//           или Bash вызывает инструмент партий (`phrases_add.py`, `items_xunity.py … --add`, `notes_xunity.py … --add`,
//           `dialogue_xunity.py … --add | --adopt`, `spells_ru_add.py`, `help_ru.py`).
//           Пускает, только если метка свежее последней правки методички и не старше --max минут (правило часа из канона
//           KAIF: через час прочитанное уходит из рабочего контекста). Иначе — код 2 и указание прочесть.
// Сама методичка (STYLE.md) правится без метки: правка правил — не перевод.
// Контракт хука Claude Code: событие — JSON на stdin (`tool_name`, `tool_input.file_path` | `tool_input.command`); код 2
// останавливает вызов, stderr уходит агенту. На любом неожиданном — молча 0: хук не должен ломать сессию.
//
//   node style-gate.mjs --mark|--gate --style <STYLE.md> --stamp <метка> [--max 60]
//
// @guard style-gate
// THREAT:         агент правит перевод по памяти о стиле, не открыв методичку (правила владельца 15:23–15:30 теряются)
// PROVED-AGAINST: tools/test-guards.mjs, часть E — нет метки / метка старше методички / метка старше --max → 2; свежая → 0;
//                 чужие файлы и команды → 0; Read методички ставит метку
// GAP:            Read — не понимание: хук доказывает, что файл был открыт, а не что правило применено; правка перевода
//                 мимо перечисленных путей и инструментов (новый генератор) хук не видит — добавлять в PATHS / TOOLS
//                 (так было с notes_xunity.py до 2026-10-06 16:12 — случай части E краснел, пока его не внесли); черновик
//                 перевода в чате или в scratchpad хук не видит вовсе — останавливается только запись в файлы сборки.
//                 Закрыто 2026-10-06 17:17: Read отрывка (offset/limit) метку больше не ставит — замечено ≈16:48, когда
//                 частичное чтение пропустило бы правило §5 («сударь» в чёрном списке; поймано только полным чтением)
// ON-REAL-PATH:   2026-10-06 15:28 +03:00 — в живой сессии: Bash с «phrases_add.py» без чтения → остановлен (код 2, текст
//                 агенту); Read STYLE.md → метка 15:28; тот же Bash → прошёл. 2026-10-06 ≈16:01 — новая сессия: тот же
//                 замер остановлен по причине «методичка менялась после последнего чтения» (метка 15:41, правка 15:49);
//                 после Read — прошёл; партия notes_xunity.py --add прошла при свежей метке.
//                 russian-gate: 2026-10-13 — подключён в живой сессии и сразу остановил три записи с кириллицей (AGENT_GUIDE,
//                 STYLE.md, память) — «документ ещё не прочитан»; Read RUSSIAN_RULES.md целиком → те же три записи прошли
import { readFileSync, statSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const MODE = args.includes('--mark') ? 'mark' : args.includes('--gate') ? 'gate' : args.includes('--remind') ? 'remind' : '';
const STYLE = opt('--style');
const STAMP = opt('--stamp');
const MAX_MIN = Number(opt('--max', '60'));

const norm = (p) => String(p || '').replace(/\\/g, '/').toLowerCase();
const PATHS = [
  /svarogsdream\/translation\/[^/]*_ru\.(tsv|py)$/,
  /svarogsdream\/translation\/glossary[^/]*\.tsv$/,
  /svarogsdream\/_config\/xunity\/zz_[^/]*\.txt$/,
];
const TOOLS = [/phrases_add\.py/, /items_xunity\.py[^\n]*--add/, /notes_xunity\.py[^\n]*--add/,
  /dialogue_xunity\.py[^\n]*--(add|adopt)/, /spells_ru_add\.py/, /help_ru\.py/,
  // 2026-10-07: правка тире партиями по источникам — хук её не знал, партии записок шли при методичке, прочитанной 60+ мин назад
  /dash_src\.py[^\n]*\bapply\b/,
  // 2026-10-07: события мира — свой инструмент партий (KUMM plans/14, фаза 6)
  /worldevents_xunity\.py[^\n]*--add/,
  // 2026-10-07: окно выбора героя (черты, судьбы, имена) — партия имён прошла при методичке, прочитанной 70 мин назад
  /selection_xunity\.py[^\n]*--add/];
const mtime = (p) => { try { return statSync(p).mtimeMs; } catch { return -1; } };
// Тот же хук держит и другой документ: --paths <regex> (по нормализованному пути) заменяет пути перевода, инструменты партий тогда не
// судятся; --label и --reason — имя и слово владельца в отказе. Второе применение — руководство интерфейса Svarog: код мода
// интерфейса правится только по прочитанной философии прекрасного (`[OWNER]` «это тоже в руководства запиши и в ХУК - когда делаешь
// UI, руководствоваться этой философией прекрасного» · 2026-10-06 ≈22:35). Обобщено, а не скопировано: одна машина — одна копия.
const PATHS_OPT = opt('--paths');
const LABEL = opt('--label', 'style-gate');
const REASON = opt('--reason', 'Правило владельца 2026-10-06: «чтение методички - обязательством в хук делаем».');
const GATED = PATHS_OPT ? [new RegExp(PATHS_OPT)] : PATHS;
const GATED_TOOLS = PATHS_OPT ? [] : TOOLS;
// Третье применение — методичка русского языка (KUMM/researches/russian-writing/RUSSIAN_RULES.md): `[OWNER]` «и хук на то, чтобы
// читать эту методичку каждый раз, когда что-то пишешь по-русски» · 2026-10-13. Путь «русского» файла не узнать, поэтому
// --cyrillic судит по ТЕКСТУ: Write/Edit, чей новый текст несёт кириллицу (в любом файле), и Bash с кириллицей в команде.
// --remind (UserPromptSubmit): ответ в чате файлом не пишется — на каждое сообщение владельца при несвежей метке хук печатает
// в контекст агента указание прочесть методичку до ответа. [NOT-TESTED]
const CYR = args.includes('--cyrillic');
const HAS_CYR = /[А-Яа-яЁё]/;

try {
  if (!MODE || !STYLE || !STAMP) process.exit(0);
  const event = JSON.parse(readFileSync(0, 'utf8') || '{}');
  const tool = event.tool_name || '';
  const input = event.tool_input || {};

  if (MODE === 'mark') {
    // Засчитывается только чтение ЦЕЛИКОМ: отрывок (offset дальше начала, limit короче файла) метку не ставит — 2026-10-06
    // частичное чтение пропустило бы правило §5 («сударь»), поймано только полным; `[OWNER]` «давай обновим методичку, и
    // обновим хук» · между 17:16 и 17:17.
    const lines = readFileSync(STYLE, 'utf8').split('\n').length;
    const whole = !(Number(input.offset) > 1) && !(Number(input.limit) > 0 && Number(input.limit) < lines);
    if (tool === 'Read' && whole && norm(input.file_path) === norm(STYLE)) writeFileSync(STAMP, new Date().toISOString() + '\n');
    process.exit(0);
  }

  const read = mtime(STAMP), changed = mtime(STYLE);
  const ageMin = (Date.now() - read) / 60000;
  let why = '';
  if (read < 0) why = 'документ в этой работе ещё не прочитан';
  else if (changed > read) why = 'документ менялся после последнего чтения';
  else if (ageMin > MAX_MIN) why = `документ прочитан ${Math.round(ageMin)} мин назад — больше ${MAX_MIN}`;

  if (MODE === 'remind') {
    if (why) process.stdout.write(`${LABEL}: ответ владельцу пишется по-русски, а ${why}. До ответа прочти целиком инструментом ` +
      `Read: ${STYLE} (${REASON})\n`);
    process.exit(0);
  }

  let writes = false;
  if (tool === 'Write' || tool === 'Edit' || tool === 'MultiEdit') {
    const p = norm(input.file_path);
    const text = String(input.content || '') + String(input.new_string || '') +
      (Array.isArray(input.edits) ? input.edits.map((e) => e.new_string || '').join('') : '');
    writes = p !== norm(STYLE) && (CYR ? HAS_CYR.test(text) : GATED.some((rx) => rx.test(p)));
  } else if (tool === 'Bash' || tool === 'PowerShell') {
    const cmd = String(input.command || '');
    writes = CYR ? HAS_CYR.test(cmd) : tool === 'Bash' && GATED_TOOLS.some((rx) => rx.test(cmd));
  }
  if (!writes || !why) process.exit(0);
  process.stderr.write(`${LABEL}: эта работа пишется по документу, а ${why}. Прочти его инструментом Read целиком: ${STYLE} ` +
    `— и повтори действие. (${REASON})\n`);
  process.exit(2);
} catch {
  process.exit(0);
}
