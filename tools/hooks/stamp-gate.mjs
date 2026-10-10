#!/usr/bin/env node
// stamp-gate.mjs — хук Claude Code (PreToolUse на Write|Edit): штамп с сегодняшней датой и временем ПОЗЖЕ часов не попадает в
// файл. Класс `claim-before-evidence` (EXPERIENCE.md EXP-0137, EXP-0160): время вписывается по ощущению до вызова `date`. Страж
// коммита (tools/check-claim-before-evidence.mjs) держит только коммиты KUMM; код, тест-кейсы и рулбук SvarogsDream до него не
// доходят, а KUMM — только в момент коммита, когда штамп уже стоял в документе. 2026-10-07 утром — дважды за пятнадцать минут:
// «Created: 2026-10-07 09:45» при часах 09:34, «v2.2 — 09:51» при 09:49 (оба поймал агент сам, после записи). Урок без механизма
// не держит; хук держит до записи. Память владельца: «Штамп и число — только после наблюдения».
//
// Штамп — сегодняшняя дата `ГГГГ-ММ-ДД`, за ней (через пробел, «T», запятую) необязательные «≈» / «около» / «до» и `ЧЧ:ММ`; время
// местное. Позже текущей минуты — код 2 и указание: взять время из `date`. Завтра и дальше — план, законно. Строка с
// `claim-ok: <причина>` — объявленное исключение (время назначенной на сегодня встречи).
//
//   node stamp-gate.mjs      # событие PreToolUse на stdin; на любом неожиданном — молча 0: хук не ломает сессию
//
// @guard stamp-gate
// THREAT:         агент пишет в документ или комментарий сегодняшний штамп времени впереди часов, и он остаётся как факт
// PROVED-AGAINST: tools/test-guards.mjs, часть G — до появления хука все семь случаев красные; с хуком Write и Edit со штампом через
//                 10 минут → 2, прошлое, завтра, claim-ok, Bash, мусор → 0. Правило документов испытаний (2026-10-10): Edit сегодняшнего
//                 TC с «pass <через 10 мин>» — хук из HEAD до правки → 0, после → 2; прошлое время, игровые часы со стрелкой, тот же
//                 итог вне testcases/ → 0
// GAP:            время без даты («в 18:35», «≈09:51» без даты рядом) — вне сегодняшних документов `testcases/` (там с 2026-10-10
//                 ловятся время после слова итога и конец диапазона «ЧЧ:ММ–ЧЧ:ММ»), дата ДД.ММ и UTC-штамп с «Z» не видны; штамп в прошлом, набранный
//                 наугад, не отличим от честного — это держит судья; NotebookEdit и запись через Bash хук не видит; штамп ЗАВТРАШНЕЙ
//                 даты у полуночи («2026-10-08 ≈00:00» при часах 2026-10-07 23:59 — случай 2026-10-07) проходит как «план» — держит судья
// ON-REAL-PATH:   2026-10-07 09:50 +03:00 — в живой сессии Write пробного файла scratchpad со штампом на 20 минут вперёд остановлен
//                 («сейчас 2026-10-07 09:50»), затем — эта же строка с цитатой пробного штампа (claim-ok: цитата пробы, не штамп)
//                 тоже; подключён в местных .claude/settings.local.json, matcher Write|Edit|MultiEdit
import { readFileSync } from 'node:fs';

const pad = (n) => String(n).padStart(2, '0');
const now = new Date();
const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const nowMin = now.getHours() * 60 + now.getMinutes();
const STAMP = new RegExp(today + String.raw`[ T,]+(?:(?:≈|около|до)\s*)?(\d{2}):(\d{2})`, 'g');

try {
  const event = JSON.parse(readFileSync(0, 'utf8') || '{}');
  const t = event.tool_input || {};
  let text = '';
  if (event.tool_name === 'Write') text = String(t.content || '');
  else if (event.tool_name === 'Edit') text = String(t.new_string || '');
  else if (event.tool_name === 'MultiEdit') text = (t.edits || []).map((e) => String(e.new_string || '')).join('\n');
  else process.exit(0);

  // Сегодняшний документ испытаний (testcases/…<сегодня>…): там дата стоит в имени файла, а в строках — голое время итога
  // («pass 10:58») и диапазоны прогона («09:58–10:08»). 2026-10-10 трижды за час такое время ушло вперёд часов (10:08 при 10:07,
  // 10:58 при 10:53) — дату рядом хук не видел. Игровые часы («час стоял 03:05», «03:20 → 23:09») сюда не попадают: не после слова
  // итога и не через тире.
  const path = String(t.file_path || '').replace(/\\/g, '/');
  const testDoc = path.includes('/testcases/') && path.includes(today);
  const VERDICT = /(?:pass|fail|partial|blocked|skipped)[^|\d]{0,40}?(\d{2}):(\d{2})(?:[–-](\d{2}):(\d{2}))?/g;
  const RANGE = /(?<![\d:])(\d{2}):(\d{2})[–-](\d{2}):(\d{2})(?![\d:])/g;
  const late = (h, m) => Number(h) < 24 && Number(h) * 60 + Number(m) > nowMin;

  const ahead = [];
  for (const line of text.split(/\r?\n/)) {
    if (line.includes('claim-ok:')) continue;
    for (const m of line.matchAll(STAMP)) {
      const min = Number(m[1]) * 60 + Number(m[2]);
      if (min > nowMin) ahead.push(m[0]);
    }
    if (!testDoc) continue;
    for (const m of line.matchAll(VERDICT)) if (late(m[1], m[2]) || (m[3] && late(m[3], m[4]))) ahead.push(m[0]);
    for (const m of line.matchAll(RANGE)) if (late(m[3], m[4])) ahead.push(m[0]);
  }
  if (!ahead.length) process.exit(0);
  process.stderr.write(`stamp-gate: штамп впереди часов — ${ahead.join(', ')}; сейчас ${today} ${pad(now.getHours())}:${pad(now.getMinutes())}. ` +
    'Время в тексте — только из `date` той же минуты (EXP-0160); назначенное на сегодня время — с `claim-ok: <причина>` на строке.\n');
  process.exit(2);
} catch {
  process.exit(0);
}
