#!/usr/bin/env node
// no-backslash-heredoc.mjs — хук PreToolUse для инструмента Bash: не пускает heredoc, в теле которого есть
// обратный слэш.
//
// Зачем он есть: на этой машине bash-heredoc съедает обратный слэш — `\\` схлопывается в `\`, `\a` уходит в
// BEL, виндовый путь пишется битым, и даже закавыченный `<<'EOF'` не спасает. Записано 2026-08-21 (EXP-0029),
// лежит в памяти агента — и 2026-09-18 повторилось (EXP-0120): скрипт слияния навыков, написанный через heredoc,
// превратил `.\Deploy-ModPack.ps1` в `.Deploy-ModPack.ps1`. Два промаха одного класса по канону — механизм,
// а не третье напоминание. Выход всегда один и дешёвый: файл пишется инструментом Write, а обратный слэш внутри
// генерируемого кода строится как `String.fromCharCode(92)`.
//
// Контракт хука Claude Code: событие приходит JSON-ом на stdin (`tool_name`, `tool_input.command`);
// код 2 — вызов отклонён, stderr уходит модели; код 0 — пропустить. Любая собственная ошибка → код 0:
// сломанный страж не имеет права запереть весь Bash (fail-open, и это сказано здесь вслух).
//
// @guard no-backslash-heredoc
// THREAT:         агент пишет через bash-heredoc файл с обратным слэшем, слэш исчезает молча, код 0
// PROVED-AGAINST: `node tools/test-guards.mjs`, part A: 9 forms with a slash in the body refused (code 2) and 7 controls
//                 passed; the same suite against the FIRST version (commit fae2731) is red on `<<\EOF`, `<<'END.'`,
//                 `<<'my-eof'` — the forms an independent judge walked past it, one of them live, with the very
//                 EXP-0120 damage; a live `<<\EOF` call is now refused by the harness
// GAP:            `<<<` (here-string) не судит — там другое правило экранирования; heredoc, чьё тело собрано
//                 переменной (`cat <<EOF` + `$VAR` со слэшем), не видит — слэша нет в тексте команды; инструмент
//                 PowerShell не судит — там heredoc нет; разделитель из смешанных кусков (`E"O"F`) читается по
//                 первому куску. ЛОЖНЫЕ срабатывания: `<<` внутри строки, комментария или арифметики (`$((x<<y))`),
//                 если ниже в команде есть строка со слэшем — вызов отклонён зря, выход тот же: Write
//                 Слэш в АРГУМЕНТЕ команды (`sed -i "Na …"`, `echo`, `printf` в двойных кавычках) не судит вовсе:
//                 18.09 так сломалась вставка в полевой отчёт — задуманная пустая строка стала буквой `n`, поймано глазом
// ON-REAL-PATH:   .claude/settings.local.json этого проекта (хук PreToolUse, matcher Bash), 2026-09-18 — живые вызовы
//                 `<<'EOF'` и `<<\EOF` со слэшем отклонены, чистый heredoc прошёл. В новом клоне запись хука
//                 добавляется в местные настройки заново: файл настроек в git не уходит (AGENT_GUIDE → Tools)
//
// [TESTED: 2026-09-18 · прогоны 5–10, вывод прочитан; отчёт testcases/reports/2026-09-18_claim-and-heredoc-guards.md]
import { readFileSync } from 'node:fs';

const BS = String.fromCharCode(92);
// Разделитель heredoc — любое слово оболочки: в одинарных кавычках, в двойных, либо без кавычек, где обратный слэш
// экранирует символ (`<<\EOF` — это разделитель EOF с запретом подстановок). После снятия кавычек и слэшей
// получается строка, которой закрывается тело.
const OPENER = /(?<!<)<<(-?)[ \t]*(?:'([^']*)'|"([^"]*)"|((?:\\.|[^\s;&|<>()'"])+))/g;
const delimOf = (m) => (m[2] !== undefined ? m[2] : m[3] !== undefined ? m[3] : m[4].replace(/\\(.)/g, '$1'));

function heredocBodiesWithBackslash(command) {
  const lines = command.split(/\r?\n/);
  const pending = [];                 // очередь открытых heredoc: тела идут подряд, в порядке открытия
  const hits = [];
  for (const line of lines) {
    if (pending.length) {
      const cur = pending[0];
      const probe = cur.dash ? line.replace(/^\t+/, '') : line;
      if (probe === cur.delim) { pending.shift(); continue; }
      if (line.includes(BS)) hits.push({ delim: cur.delim, line });
      continue;
    }
    for (const m of line.matchAll(OPENER)) pending.push({ dash: m[1] === '-', delim: delimOf(m) });
  }
  return hits;
}

try {
  const raw = readFileSync(0, 'utf8').replace(/^﻿/, '');
  const event = JSON.parse(raw || '{}');
  if (event.tool_name !== 'Bash') process.exit(0);
  const command = (event.tool_input && event.tool_input.command) || '';
  const hits = heredocBodiesWithBackslash(command);
  if (!hits.length) process.exit(0);
  const first = hits[0].line.trim().slice(0, 120);
  process.stderr.write(
    'KUMM guard (tools/hooks/no-backslash-heredoc.mjs): the heredoc body (<<' + hits[0].delim + ') contains a backslash, ' +
    'and bash on this machine collapses it silently (EXPERIENCE.md EXP-0029, EXP-0120). First such line: ' + first + '\n' +
    'Do this instead: write the file with the Write tool; inside generated code build the backslash as ' +
    'String.fromCharCode(92). Строк со слэшем в теле: ' + hits.length + '.\n');
  process.exit(2);
} catch {
  process.exit(0);
}
