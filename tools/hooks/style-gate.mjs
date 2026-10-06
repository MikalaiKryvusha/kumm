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
//           или Bash вызывает инструмент партий (`phrases_add.py`, `items_xunity.py … --add`, `spells_ru_add.py`, `help_ru.py`).
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
// ON-REAL-PATH:   2026-10-06 15:28 +03:00 — в живой сессии: Bash с «phrases_add.py» без чтения → остановлен (код 2, текст
//                 агенту); Read STYLE.md → метка 15:28; тот же Bash → прошёл
import { readFileSync, statSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const MODE = args.includes('--mark') ? 'mark' : args.includes('--gate') ? 'gate' : '';
const STYLE = opt('--style');
const STAMP = opt('--stamp');
const MAX_MIN = Number(opt('--max', '60'));

const norm = (p) => String(p || '').replace(/\\/g, '/').toLowerCase();
const PATHS = [
  /svarogsdream\/translation\/[^/]*_ru\.(tsv|py)$/,
  /svarogsdream\/translation\/glossary[^/]*\.tsv$/,
  /svarogsdream\/_config\/xunity\/zz_[^/]*\.txt$/,
];
const TOOLS = [/phrases_add\.py/, /items_xunity\.py[^\n]*--add/, /spells_ru_add\.py/, /help_ru\.py/];
const mtime = (p) => { try { return statSync(p).mtimeMs; } catch { return -1; } };

try {
  if (!MODE || !STYLE || !STAMP) process.exit(0);
  const event = JSON.parse(readFileSync(0, 'utf8') || '{}');
  const tool = event.tool_name || '';
  const input = event.tool_input || {};

  if (MODE === 'mark') {
    if (tool === 'Read' && norm(input.file_path) === norm(STYLE)) writeFileSync(STAMP, new Date().toISOString() + '\n');
    process.exit(0);
  }

  let writes = false;
  if (tool === 'Write' || tool === 'Edit') {
    const p = norm(input.file_path);
    writes = p !== norm(STYLE) && PATHS.some((rx) => rx.test(p));
  } else if (tool === 'Bash') {
    writes = TOOLS.some((rx) => rx.test(String(input.command || '')));
  }
  if (!writes) process.exit(0);

  const read = mtime(STAMP), changed = mtime(STYLE);
  const ageMin = (Date.now() - read) / 60000;
  let why = '';
  if (read < 0) why = 'методичка в этой работе ещё не прочитана';
  else if (changed > read) why = 'методичка менялась после последнего чтения';
  else if (ageMin > MAX_MIN) why = `методичка прочитана ${Math.round(ageMin)} мин назад — больше ${MAX_MIN}`;
  if (!why) process.exit(0);
  process.stderr.write(`style-gate: перевод пишется по методичке, а ${why}. Прочти её инструментом Read целиком: ${STYLE} ` +
    `— и повтори действие. (Правило владельца 2026-10-06: «чтение методички - обязательством в хук делаем».)\n`);
  process.exit(2);
} catch {
  process.exit(0);
}
