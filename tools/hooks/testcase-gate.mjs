#!/usr/bin/env node
// testcase-gate.mjs — хук Claude Code: функциональный прогон в игре — только по написанным тест-кейсам, и каждый прогон — с записанным
// итогом.
//
// Зачем: KAIF требует писать документ тест-кейсов ДО прогона (TESTING_FRAMEWORK.md → «The testing activities», шаг 3: план,
// набор случаев по названным техникам, что сознательно не покрыто) и ставить каждому случаю статус ПОСЛЕ (шаг 4), а 2026-10-06 агент
// провёл весь вечер прогонов окна персонажа без документа и собрал случаи задним числом. `[OWNER]` «Ты тест кейсы пишешь, как КАИФ
// обязывает?» · «давай хук на это сделаем - написание тестов» · 2026-10-06 ≈21:25. Правило, которое держится памятью, теряется под
// нагрузкой; хук держит кодом.
//
// Версия 2 (2026-10-06 ≈21:50): первая пускала по ВРЕМЕНИ правки документа — правленный 12 минут назад под другую работу документ
// пропустил бы выкладку правок, под которые не написано ни одного случая, а выполнение случаев не проверялось вовсе (находка агента
// на вопрос владельца). `[OWNER]` «хук написания тест кейсов и их выполнения сработал?» · «ужесточай хук» · «что-то кодишь - пишешь
// тесткейсы, чтобы проверить в игре разные кейсы» · 2026-10-06 ≈21:48. Теперь:
//   1. в последнем документе `TC_*.md` есть таблица случаев и хотя бы один случай ЖДЁТ прогона — статус `[NOT-TESTED]` или `fail`
//      (написан и не пройден): прогонять есть что;
//   2. с прошлого пропущенного прогона ТАБЛИЦА СЛУЧАЕВ ИЗМЕНИЛАСЬ — записаны итоги (pass/fail + кадр) или добавлены случаи под новую
//      правку. Сравнивается отпечаток строк случаев (номер + статус + шаги), а не время файла: касание файла не обманет. Отпечаток и
//      время пропущенного прогона — в файле --stamp (состояние сессии, не история: в .gitignore).
// Режим --gate (PreToolUse, matcher Bash): команда запускает прогон в игре — выкладку мода с перезагрузкой (`deploy-hot.sh`) или
// запуск игры (`run-game.sh`). Иначе — код 2 и указание агенту. Контракт хука Claude Code: событие — JSON на stdin (`tool_name`,
// `tool_input.command`); код 2 останавливает вызов, stderr уходит агенту. На любом неожиданном — молча 0: хук не должен ломать сессию.
//
//   node testcase-gate.mjs --gate --dir <testcases> --stamp <файл состояния>
//
// @guard testcase-gate
// THREAT:         агент гоняет игру (сборка, прогон, кадры) и называет это тестом, не написав случаев под ЭТУ правку до прогона и не
//                 записав итог прошлого прогона
// PROVED-AGAINST: tools/test-guards.mjs, часть F — нет документа / нет таблицы / нет ждущих случаев → 2; повторный прогон без правки
//                 таблицы → 2; касание файла без правки строк → 2; записан итог или добавлен случай → 0; чужие команды → 0
// GAP:            хук видит, что таблица изменилась, а не что новые случаи относятся к ЭТОЙ правке кода (случай под чужую работу его
//                 обманет); прогон мимо deploy-hot.sh и run-game.sh (пульт h.sh по уже запущенной игре) не останавливается —
//                 намеренно: кадр по ходу работы не прогон; добавлять инструменты в RUNS
// ON-REAL-PATH:   v1 — 2026-10-06 ≈21:26 +03:00 (run-game.sh остановлен при документе 640-минутной давности, после записи TC прошёл);
//                 v2 — NOT YET
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';
import { createHash } from 'node:crypto';

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const DIR = opt('--dir');
const STAMP = opt('--stamp');
const RUNS = [/deploy-hot\.sh/, /run-game\.sh/];
const CASE_ROW = /^\|\s*C\d+\s*\|.*$/gm;
// Статус — последняя непустая ячейка строки случая: «[NOT-TESTED]», «fail — …» ждут прогона; «pass — …», «blocked», «skipped» — нет.
const statusOf = (row) => { const cells = row.split('|').map((c) => c.trim()).filter(Boolean); return cells[cells.length - 1] || ''; };
const waiting = (row) => { const s = statusOf(row); return /\[NOT-TESTED\]/.test(s) || /^fail\b/i.test(s); };

function refuse(why) {
  process.stderr.write(`testcase-gate: прогон в игре — по написанным тест-кейсам и с записанным итогом прошлого прогона, а ${why}. ` +
    `Кодишь — пишешь случаи, чтобы проверить в игре разные кейсы: шаблон .kaif/_testcases-template.md → ${DIR}/TC_<работа>.md ` +
    `(требования, матрица покрытия, случаи C1… со статусом [NOT-TESTED], контрольные K1…); после прогона — статус каждому ` +
    `(pass/fail + кадр). Потом повтори команду. (KAIF TESTING_FRAMEWORK.md, шаги 3–4; слово владельца 2026-10-06 ≈21:25, ≈21:48.)\n`);
  process.exit(2);
}

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
  if (!best) refuse('в ' + DIR + ' нет ни одного документа TC_*.md');
  const rows = readFileSync(best.p, 'utf8').match(CASE_ROW) || [];
  if (!rows.length) refuse(`в ${best.n} нет таблицы случаев (строк «| C1 | …»)`);
  if (!rows.some(waiting)) refuse(`в ${best.n} нет случаев, ждущих прогона (статус [NOT-TESTED] или fail) — под эту правку случаи не написаны`);

  const print = createHash('sha256').update(best.n + '\n' + rows.map((r) => r.replace(/\s+/g, ' ').trim()).join('\n')).digest('hex');
  if (STAMP) {
    let last = null;
    try { last = JSON.parse(readFileSync(STAMP, 'utf8')); } catch { last = null; }
    if (last && last.print === print)
      refuse(`таблица случаев в ${best.n} не изменилась с прошлого прогона (${last.at}): итоги не записаны и новых случаев нет`);
    writeFileSync(STAMP, JSON.stringify({ at: new Date().toISOString(), doc: basename(best.p), print }) + '\n');
  }
  process.exit(0);
} catch {
  process.exit(0);
}
