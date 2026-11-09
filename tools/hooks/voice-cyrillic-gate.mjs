#!/usr/bin/env node
// voice-cyrillic-gate.mjs — хук PreToolUse (Bash | PowerShell): не пускает озвучку фразы, в файле которой есть латинская буква.
//
// Зачем: слово владельца 2026-11-09 20:15–20:16 «тебе каиф не говорил, что в речи писать только кирилицей?» · «никаких латинских
// символом» · «если нужно сказать KUMM, то это будет Кей Ю Эм Эм» — после фразы «Николай, это KUMM». Правило уже стояло в памяти
// агента («имя проекта один раз, КИРИЛЛИЦЕЙ») и не удержало: голос Silero читает латиницу неверно. Правило, которое память не держит,
// держит код (HOUSE_RULES правило 13).
//
// Что судит: команду, где вызывается голос (`voice-soft.mjs`, `say.py`, `voice-say.mjs`) с `--file <путь>`; читает этот файл и ищет
// [A-Za-z]. Нашёл — код 2 и строка с первыми латинскими словами; иначе код 0. Любая своя ошибка (нет файла, нечитаемый JSON) → код 0:
// сломанный страж не запирает оболочку.
//
// @guard voice-cyrillic-gate
// THREAT:         фраза голосу владельцу с латиницей («Николай, это KUMM») — голос читает её неверно
// PROVED-AGAINST: прогон 2026-11-09 на файлах в черновике: «Николай, это KUMM.» → код 2; «…минус 31 %…» → код 2; «Николай, это Кей Ю Эм Эм.» → код 0
// GAP:            фразу, переданную текстом в аргументе (не файлом), не судит — по правилу 13 фраза всегда идёт файлом
// ON-REAL-PATH:   NOT YET — wired in `.claude/settings.local.json` (PreToolUse, Bash|PowerShell) 2026-11-09 20:18; a live call in the same session was NOT
//                 refused: the client reads hooks at session start — check in the next chat with `echo "voice-soft.mjs --file <a Latin phrase file>"`
// Hygiene 2026-11-09: stdin runs — Latin «KUMM» → 2, digits and «%» → 2, a Cyrillic phrase → 0, an unrelated command → 0. The live path is open (above).
// [NOT-TESTED]
import { readFileSync, existsSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';

const VOICE_TOOL = /(voice-soft\.mjs|say\.py|voice-say\.mjs)/;
const FILE_ARG = /--file\s+("([^"]+)"|'([^']+)'|(\S+))/;

try {
  const raw = readFileSync(0, 'utf8').replace(/^﻿/, '');
  const event = JSON.parse(raw || '{}');
  if (event.tool_name !== 'Bash' && event.tool_name !== 'PowerShell') process.exit(0);
  const command = (event.tool_input && event.tool_input.command) || '';
  if (!VOICE_TOOL.test(command)) process.exit(0);
  const m = command.match(FILE_ARG);
  if (!m) process.exit(0);
  let path = m[2] || m[3] || m[4];
  if (!isAbsolute(path)) path = join(process.env.CLAUDE_PROJECT_DIR || process.cwd(), path);
  if (!existsSync(path)) process.exit(0);
  const text = readFileSync(path, 'utf8');
  // латиница, цифры и знаки единиц (%, °, ‰, №, ×, /) — всё это говорится словами (владелец 20:16 «цифры все словами русскими, и единицы
  // измерения - все словами на кирилице»)
  const bad = text.match(/[A-Za-z0-9%°‰№×\/]+/g);
  if (!bad) process.exit(0);
  process.stderr.write(
    'KUMM guard (tools/hooks/voice-cyrillic-gate.mjs): the voice phrase has Latin letters, digits or unit signs: ' + [...new Set(bad)].slice(0, 8).join(', ') + '.\n' +
    'Rewrite it in Cyrillic words only (HOUSE_RULES rule 13): the project is «Кей Ю Эм Эм», numbers and units in Russian words ' +
    '(«тридцать один процент», «пятьдесят миллисекунд»).\n');
  process.exit(2);
} catch {
  process.exit(0);
}
