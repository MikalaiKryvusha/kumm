#!/usr/bin/env node
// testcase-gate.mjs — хук Claude Code: функциональный прогон в игре — только по написанным тест-кейсам.
//
// Зачем: KAIF требует писать документ тест-кейсов ДО прогона (TESTING_FRAMEWORK.md → «The testing activities», шаг 3: план,
// набор случаев по названным техникам, что сознательно не покрыто), а 2026-10-06 агент провёл весь вечер прогонов окна
// персонажа без него и собрал случаи задним числом в отчёте. `[OWNER]` «Ты тест кейсы пишешь, как КАИФ обязывает?» · «давай хук
// на это сделаем - написание тестов» · 2026-10-06 ≈21:25. Правило, которое держится памятью, теряется под нагрузкой; хук держит кодом.
//
// Режим --gate (PreToolUse, matcher Bash): команда запускает прогон в игре — выкладку мода с перезагрузкой (`deploy-hot.sh`) или
// запуск игры (`run-game.sh`). Пускает, только если в каталоге --dir есть документ `TC_*.md`, правленный не раньше --max минут
// назад, и в нём есть таблица случаев (строка «| C<число> |»). Иначе — код 2 и указание: сначала случаи, потом прогон.
// Время правки документа и есть метка: отдельного файла-метки нет.
// Контракт хука Claude Code: событие — JSON на stdin (`tool_name`, `tool_input.command`); код 2 останавливает вызов, stderr уходит
// агенту. На любом неожиданном — молча 0: хук не должен ломать сессию.
//
//   node testcase-gate.mjs --gate --dir <testcases> [--max 90]
//
// @guard testcase-gate
// THREAT:         агент гоняет игру (сборка, прогон, кадры) и называет это тестом, не написав случаев до прогона
// PROVED-AGAINST: tools/test-guards.mjs, часть F — нет документа / документ старше --max / документ без таблицы случаев → 2;
//                 свежий документ со случаями → 0; чужие команды → 0
// GAP:            хук видит, что документ правился, а не что случаи написаны под ЭТУ работу (правка чужого документа его
//                 обманет); прогон мимо deploy-hot.sh и run-game.sh (пульт h.sh по уже запущенной игре) не останавливается —
//                 это намеренно: кадр по ходу работы не прогон; добавлять инструменты в RUNS
// ON-REAL-PATH:   2026-10-06 ≈21:26 +03:00 — в живой сессии: команда со словом run-game.sh при документе TC 640-минутной давности →
//                 остановлена (код 2, текст агенту); после записи testcases/TC_svarog_character_window_cards.md запуск
//                 run-game.sh прошёл (контрольный случай K1, ≈21:27)
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const DIR = opt('--dir');
const MAX_MIN = Number(opt('--max', '90'));
const RUNS = [/deploy-hot\.sh/, /run-game\.sh/];
const CASE_ROW = /^\|\s*C\d+\s*\|/m;

try {
  if (!args.includes('--gate') || !DIR) process.exit(0);
  const event = JSON.parse(readFileSync(0, 'utf8') || '{}');
  if (event.tool_name !== 'Bash') process.exit(0);
  const cmd = String((event.tool_input || {}).command || '');
  if (!RUNS.some((rx) => rx.test(cmd))) process.exit(0);

  let best = null;
  for (const n of readdirSync(DIR)) {
    if (!/^TC_.*\.md$/.test(n)) continue;
    const p = join(DIR, n), m = statSync(p).mtimeMs;
    if (!best || m > best.m) best = { p, n, m };
  }
  let why = '';
  if (!best) why = 'в ' + DIR + ' нет ни одного документа TC_*.md';
  else {
    const age = (Date.now() - best.m) / 60000;
    if (age > MAX_MIN) why = `последний документ тест-кейсов (${best.n}) правился ${Math.round(age)} мин назад — больше ${MAX_MIN}`;
    else if (!CASE_ROW.test(readFileSync(best.p, 'utf8'))) why = `в ${best.n} нет таблицы случаев (строк «| C1 | …»)`;
  }
  if (!why) process.exit(0);
  process.stderr.write(`testcase-gate: прогон в игре — по написанным тест-кейсам, а ${why}. Сначала запиши или обнови случаи ` +
    `этой работы (шаблон .kaif/_testcases-template.md → ${DIR}/TC_<работа>.md: требования, матрица покрытия, случаи C1…, ` +
    `контрольные K1…), потом повтори команду. (KAIF TESTING_FRAMEWORK.md, шаг 3; слово владельца 2026-10-06 ≈21:25.)\n`);
  process.exit(2);
} catch {
  process.exit(0);
}
