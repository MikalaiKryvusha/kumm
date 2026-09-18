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
// PROVED-AGAINST: десять синтетических событий (четыре со слэшем в теле — код 2, шесть контрольных — код 0) и
//                 настоящий вызов Bash с `<<'EOF'` и `C:\probe\path` в теле — отклонён харнессом, файл не записан
// GAP:            `<<<` (here-string) не судит — там другое правило экранирования; heredoc, чьё тело собрано
//                 переменной (`cat <<EOF` + `$VAR` со слэшем), не видит — слэша нет в тексте команды; инструмент
//                 PowerShell не судит — там heredoc нет
// ON-REAL-PATH:   .claude/settings.local.json этого проекта (хук PreToolUse, matcher Bash), сессия 2026-09-18 — живой
//                 вызов отклонён, чистый heredoc прошёл. В новом клоне запись хука добавляется в местные настройки
//                 заново: файл настроек в git не уходит (AGENT_GUIDE → Tools)
//
// [TESTED: 2026-09-18 · прогоны 5–7, вывод прочитан; отчёт testcases/reports/2026-09-18_claim-and-heredoc-guards.md]
import { readFileSync } from 'node:fs';

const BS = String.fromCharCode(92);
const OPENER = /(?<!<)<<(-?)[ \t]*(['"]?)([A-Za-z_][A-Za-z0-9_]*)\2/g;

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
    for (const m of line.matchAll(OPENER)) pending.push({ dash: m[1] === '-', delim: m[3] });
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
