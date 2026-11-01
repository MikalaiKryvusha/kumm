#!/usr/bin/env node
// knowledge-hook.mjs — «хук запоминания»: агент обязан записывать знания о проекте в его md-документы в момент, когда понял новое или
// изменённое, — как это делает мозг, а не по коммитам и не по действиям.
//
// Слово владельца 2026-10-18: `[OWNER]` «какого хуя ты разрабатываешь проект, и нихуя не ДОКУМЕНТИРУЕШЬ ПО ХОДУ ЕГО СОСТОЯНИЕ!» · «ХУК ЗАВЕСТИ И
// ЗАРЕГИСТРИРОВАТЬ: ВСЕ РАБОТЫ И ЗНАНИЯ ДОКУМЕНТИРУЮТСЯ!!!!!!!! АГЕНТ ПОМНИТ И ЗНАЕТ СВОЙ ПРОЕКТ НА ВЫСОКОМ ПРОДУКТОВОМ И ФУНКЦИОНАЛЬНОМ УРОВНЕ!» ·
// «А хук, который предписывает агенту: "Это что-то новое? Такого не было в проекте, и теперь будет вот так? Ты ОБЯЗАН ЭТО ЗАДОКУМЕНТИРОВАТЬ!"» ·
// «Что то изменилось? Документы со знаниями говорят по-другому? ТЫ ОБЯЗАН ЭТО ОТРЕДАКТИРОВАТЬ, актуализировать, удалить устаревшее, написать новое!» ·
// «он должен срабатывать на кажом ПООНИМАНИИ НОВИЗНЫ!!!!!!» · «того, как проеккт менячется идейным и смысловым наполнением!» · «не стоп хук!» ·
// «а на каждом git commit, НЕТ!!!!!!!!» · «мозг человека не привязывает хуки к коммитам».
//
// Устройство — по разведке KUMM researches/agent-memory-hook-psychology/README.md: мозг пишет на ОШИБКЕ ПРЕДСКАЗАНИЯ (ожидал одно — пришло
// другое); малая ошибка при вызванном воспоминании — правка старого, большая — новая запись; значимость усиливает запись; повтор того же
// раздражителя гасит отклик (привыкание). Моменты агента, в которые хук вписывает предписание ему в контекст:
//   1. слово владельца (UserPromptSubmit) — новый смысл, правило, поправка; с нажимом (ЗАГЛАВНЫЕ, «!!!», «НЕТ») — предписание сильнее;
//   2. неожиданный исход (PostToolUse, в ответе инструмента — ошибка, провал, отказ, «не найдено») — ожидал одно, получил другое;
//   3. встреча с реальностью (PostToolUse: поиск и чтение в сети, декомпиляция, пульт игры — дамп, поля, вызовы) — узнал, как устроено;
//   4. вызванное воспоминание (PostToolUse на Read документа знаний) — сверь с тем, что знаешь сейчас; расходится — правь.
// Привыкание: хук говорит не чаще раза в 10 минут, какой бы момент ни пришёл (слово владельца 2026-10-18). Ничего не блокирует; сбой — молча 0.
//
//   node tools/hooks/knowledge-hook.mjs             # событие Claude Code на stdin
//   node tools/hooks/knowledge-hook.mjs --selftest
//
// @guard knowledge-hook
// THREAT:         агент работает часами, понимает новое о проекте и не записывает его в md-знания — сам и следующая сессия проект не знают
// PROVED-AGAINST: --selftest — слово владельца → предписание, с нажимом → «нажим»; ошибка в ответе инструмента → «неожиданный исход»; дамп пульта и
//                 поиск в сети → «реальность»; чтение карты → «воспоминание»; прочий вывод → «сравнение»; любое событие внутри 10 минут → тишина;
//                 M12 (2026-10-30) — остановка в закрытом чате → тишина, без закрытия → рефлексия; версия до правки на том же случае останавливала
//                 ход (красный); живой журнал чата 759898d5: закрыт → тишина, он же до строки закрытия → «block»
// PROVED-AGAINST (замок конспекта, 2026-10-30): M13–M18 — без конспекта и без прочтения отказ, после прочтения пропуск, после разбора предписание,
//                 остановка с неписаным конспектом — блок; в версии до правки ветки PreToolUse нет вовсе (moment() → null) — M13 там красный по построению
// GAP:            хук видит МОМЕНТ, не СМЫСЛ: записал ли агент знание и то ли записал — судья и владелец; новизна, пришедшая в рассуждении агента без
//                 события (догадка в голове), хуку не видна; «неожиданный исход» ловит и слова «ошибка» в найденном тексте (ложная тревога —
//                 2026-10-18, поиск по коду самого хука), её гасит окно 10 минут
// ON-REAL-PATH:   2026-10-30 ≈14:4x — живая сессия KUMM: extract UIMod_Hosav до прочтения конспекта — отказ; после Read отдельным вызовом — пропуск и
//                 предписание; Read в одном сообщении с командой ещё не в журнале — отказ (записано в конспекте мода).
//                 2026-10-18 02:04–02:06 +03:00 — живая сессия KUMM: «сравнение» после проверки настроек, «слово владельца», «воспоминание» после
//                 Read методички, «неожиданный исход» (ложная тревога) — все четыре дошли в контекст агента
import { readFileSync, writeFileSync, mkdtempSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const HABIT_SEC = 600;   // привыкание: не чаще раза в 10 минут на все моменты (слово владельца 2026-10-18)

const WHERE = 'GOAL.md (видение) · MASTER_PLAN.md (путь) · план задачи в plans/ · HOUSE_RULES.md (правила владельца, стенды, инструменты) · ' +
  'карты проекта PROJECT_*_MAP.md · карты игры games/<Игра>/GAME_*_MAP.md (как устроена подсистема: поведение, номера, пути) · researches/ (разведка)';
const RULE = 'Это что-то новое? Такого не было в проекте, и теперь будет вот так? ТЫ ОБЯЗАН ЭТО ЗАДОКУМЕНТИРОВАТЬ. Что-то изменилось? Документы со ' +
  'знаниями говорят по-другому? ТЫ ОБЯЗАН ЭТО ОТРЕДАКТИРОВАТЬ, актуализировать, удалить устаревшее, написать новое (`[OWNER]` · 2026-10-18).';

export const MOMENTS = {
  owner: `knowledge-hook · слово владельца. В нём новый смысл, правило, решение, поправка, приоритет? ${RULE} Тем же ходом — в: ${WHERE}.`,
  stress: `knowledge-hook · слово владельца С НАЖИМОМ — это его правило или поправка, сильнейший сигнал записи. ${RULE} Правило — в HOUSE_RULES.md ` +
    `или канон дословно с цитатой; поправка — исправить в знаниях там, где стоит неверное. Тем же ходом — в: ${WHERE}.`,
  surprise: `knowledge-hook · неожиданный исход: ждал одно — получил другое (ошибка, провал, отказ, «не найдено»). Чего не знали знания проекта? ${RULE} ` +
    `Тем же ходом — в: ${WHERE}.`,
  reality: `knowledge-hook · встреча с реальностью: ты узнал, как что-то устроено (сеть, декомпиляция, пульт игры). ${RULE} Тем же ходом — строкой в ` +
    `карту подсистемы или в разведку: ${WHERE}.`,
  // Сравнение — на любую пришедшую информацию: `[OWNER]` «мозг человека постоянно сравнивает свой текущий опыт с тем, что посутпает в мозг через
  // источники информации, и постоянно идёт сравнение "я это знаю, или нет? это новоек? а как у меня в памяти хранится? и постоянно актуализирует
  // базу знаний"» · 2026-10-18.
  compare: 'knowledge-hook · сравни пришедшее с тем, что знаешь: я это знаю или нет? Это новое? А как это лежит в знаниях проекта? Новое или ' +
    `иначе, чем записано, — ${RULE} Тем же ходом — в: ${WHERE}.`,
  // Закрытие и остановка: `[OWNER]` «и пусть срабатывает, когда агенту сказано закрывать работу и закругляться. Когда агент останавливает работу
  // сам - ему нужно порефлексировать, проверить, записал ли он новые знания» · 2026-10-18.
  // Не пересмотр сессии, а новые знания и изменения знаний: `[OWNER]` «не полного пересмотра сессии..... А новых знаний» · «изменений» · 2026-10-18.
  closing: 'knowledge-hook · владелец велит закрывать работу. Есть ли новое знание или изменение знаний, ещё не записанное в знания проекта? ' +
    `Есть — запиши сейчас: ${RULE} В: ${WHERE}.`,
  reflect: 'knowledge-hook · ты останавливаешь работу. Есть ли новое знание или изменение знаний, ещё не записанное в знания проекта? Есть — ' +
    `запиши сейчас; нет — скажи одной строкой. ${RULE} В: ${WHERE}.`,
  recall: 'knowledge-hook · ты перечитал документ знаний. Он говорит то же, что ты знаешь сейчас? Расходится — ТЫ ОБЯЗАН ЭТО ОТРЕДАКТИРОВАТЬ, ' +
    'актуализировать, удалить устаревшее, написать новое (`[OWNER]` · 2026-10-18) — в этом же документе, тем же ходом.',
};

// Нажим владельца: слово заглавными (3+ букв), «!!», «НЕТ» / «не так» в начале — как эмоция у человека усиливает запись.
export const stressed = (text) => /\p{Lu}{3,}/u.test(text) && /\p{Lu}{3,}(?:\s+\p{Lu}{2,})*/u.test(text) || /!{2,}/.test(text) || /^\s*(?:нет|не так)\b/i.test(text);

// Неожиданный исход в ответе инструмента.
const SURPRISE = /\b(?:error|exception|fail(?:ed|ure)?|refused|denied|not found|traceback)\b|\bERR\b|✖|не найден|отказ|ошибк|упал|exit [1-9]/i;
// Встреча с реальностью: сеть, декомпиляция, пульт игры.
const REALITY_CMD = /ilspycmd|tools\/h\.sh\s+"(?:dump|fieldon|callon|static|findall|find|compsof|comps|mats|colliders)\b|\/dec\/|scratchpad\/dec\b/;
// Документ знаний проекта.
const KNOWLEDGE_DOC = /(?:GOAL|MASTER_PLAN|STATUS|HOUSE_RULES|AGENT_GUIDE|PROJECT_[A-Z_]+_MAP|GAME_[A-Z_]+_MAP|EXPERIENCE)\.md$|[\\/](?:plans|researches|games)[\\/].+\.md$/i;

// Приказ закрываться в слове владельца.
const CLOSING = /закрыва|закругл|заверш|сворачива|на паузу|end-chat|\/pause|закрой чат|wrap up/i;

export function moment(ev) {
  const name = ev.hook_event_name;
  if (name === 'Stop') return ev.stop_hook_active ? null : 'reflect';
  if (name === 'UserPromptSubmit') {
    const p = String(ev.prompt || '');
    return CLOSING.test(p) ? 'closing' : stressed(p) ? 'stress' : 'owner';
  }
  if (name !== 'PostToolUse') return null;
  const tool = String(ev.tool_name || ''), input = ev.tool_input || {};
  if (tool === 'Read' && KNOWLEDGE_DOC.test(String(input.file_path || ''))) return 'recall';
  if (tool === 'WebSearch' || tool === 'WebFetch') return 'reality';
  if ((tool === 'Bash' || tool === 'PowerShell') && REALITY_CMD.test(String(input.command || ''))) return 'reality';
  // Неожиданный исход — только в выводе команд оболочки: ответ правки, записи, чтения и поиска несёт текст самого агента или файла, и слово
  // «ошибка» там — не исход (ложная тревога на правке хука, 2026-10-18).
  const resp = typeof ev.tool_response === 'string' ? ev.tool_response : JSON.stringify(ev.tool_response || '');
  if ((tool === 'Bash' || tool === 'PowerShell') && SURPRISE.test(resp.slice(0, 20000))) return 'surprise';
  return 'compare';   // любая другая пришедшая информация — постоянное сравнение (с привыканием)
}

// Одно общее привыкание на все моменты: `[OWNER]` «не нужно часто этот хук вызывать» · «не чаще раза в 10 минут будет достаточно» · 2026-10-18.
// Пока хук молчит, ближайшее событие любого рода ждёт конца окна; первое после окна — говорит. [TESTED: 2026-10-18 · --selftest M7b, M8, M9 · testcases/reports/2026-10-18_knowledge-hook.md]
// Приказ закрываться — без окна (рефлексия перед закрытием обязательна); остановка по своей воле — своё окно 10 минут, чтобы не на каждой короткой
// реплике; прочие моменты — общее окно.
function habituated(kind, file, now) {
  if (kind === 'closing') return false;
  const key = kind === 'reflect' ? 'stop' : 'last';
  let seen = {};
  try { seen = JSON.parse(readFileSync(file, 'utf8')); } catch { /* */ }
  if (seen[key] && now - seen[key] < HABIT_SEC) return true;
  seen[key] = now;
  try { writeFileSync(file, JSON.stringify(seen)); } catch { /* */ }
  return false;
}

// Чат уже закрыт (`/end-chat-soft` или `/end-chat-force` в журнале): обряд закрытия прошёл шаг знаний (EXPERIENCE, STATUS, проверка авторства),
// и остановка больше не требует рефлексии. Слово владельца после закрытия хук по-прежнему отмечает (UserPromptSubmit). Оплачено 2026-10-30
// 13:10–13:52: после прощания хук остановки требовал «нет — скажи одной строкой», агент повторил прощание целиком, владелец: «почему и зачем ты
// прощальное сообщение дважды повторил в чате?» · «починишь это поведение?» (KUMM EXP-0383).
const CLOSED_CHAT = /"skill"\s*:\s*"(?:[\w-]+:)?end-chat-(?:soft|force)"|<command-name>\/?end-chat-(?:soft|force)<\/command-name>/;
export const chatClosed = (transcriptText) => CLOSED_CHAT.test(String(transcriptText || ''));

// ЗАМОК КОНСПЕКТА МОДА — из напоминания в обязательство. Слово владельца 2026-10-30 ≈14:25–14:33: `[OWNER]` «странно, что ты над модами этими уже
// неделю работаешь и у тебя НЕ ЗАПИСАНЫ ПО НИМ КОНСПЕКТЫ!!!» · «и ты их каждый раз по-новой словно разбираешь, как первый раз видишь!» · «КАИФ ДОЛЖЕН ТЕБЯ
// ОБЯЗЫВАТЬ ДОКУМЕНТИРОВАТЬ ТВОИ ЗНАНИЯ!!!» · «Правь хук записи знаний о проектах!» · «не всегда повторное нужно обязательно все перечитывать, а умно!
// Думаешь "Ага, нужно поработать с этим модом. Иду читать мой по нему конспект!"». Случай: виджет HUD Hosav разобран с нуля, хотя пять фактов о нём
// лежали в карте игры, разбросанные по темам. Устройство:
//   1. PreToolUse — работа с модом (разбор его ассетов, правка его исходников, раскатка -Only <Мод>) запрещена, пока конспект
//      games/<Игра>/mods/<Мод>.md не существует или не прочитан в ЭТОЙ сессии (один раз — умно, не каждый раз);
//   2. PostToolUse после разбора — предписание дописать найденное в этот конспект, без окна привыкания;
//   3. Stop — ход не кончается, если мод разбирали, а конспект после последнего разбора не правили.
// Имя мода — имя его папки в игре (`UIMod_Hosav`, `KrinikConanUI`); конспекты Конана — KUMM/games/ConanExiles/mods/.
// [TESTED: 2026-10-30 · --selftest M13–M19 (M19 16:1x: a vanilla asset by retoc is not locked; live: retoc --filter WBP_ContainerInfo passed); живой отказ и пропуск на extract UIMod_Hosav · testcases/reports/2026-10-30_knowledge-hook-mod-notes-lock.md]
const NOTES_DIR = 'games/ConanExiles/mods';
const STUDY = [   // команды разбора: имя мода — первая группа
  /patch-mod-asset\.py\s+extract\s+["']?([A-Za-z0-9_]+)/,
  /(?:kismet-trace\.py|uaj(?:\.exe)?\s+(?:exports|func|dump))\s[^\n]*?[\\/]Mods[\\/]([A-Za-z0-9_]+)[\\/]/,
  /retoc[^\n]*to-legacy[^\n]*--filter\s+["']?([A-Za-z0-9_]+)/,
];
const WORK = [    // иная работа с модом: раскатка одного мода, правка его исходника
  // имя манифеста бывает с пробелами в кавычках («Simple Minimap»): прежний разбор брал первое слово «Simple» и требовал Simple.md (2026-11-01)
  /Deploy-ModPack\.ps1[^\n]*-Only\s+(?:"([^"]+)"|'([^']+)'|([A-Za-z0-9_]+))/,
];
// Имя мода → имя конспекта: пробелы → «_» (Simple_Minimap.md) или без пробелов — какой файл есть; иначе конспект, в чьей первой строке
// стоит это имя («# Mod notes — The Damage Meter …» в DamageNumber.md: разбор ассетов зовёт мод именем пака, раскатка — именем манифеста;
// 2026-11-01 конспект под одним именем требовал второй под другим); иначе первый вид.
const noteName = (name, exists = (n) => existsSync(join(HERE, '..', '..', notesRel(n))), titled = notesByTitle) => {
  const cands = [name.replace(/\s+/g, '_'), name.replace(/\s+/g, '')];
  return cands.find((n) => exists(n)) || titled(name) || cands[0];
};
function notesByTitle(name) {
  try {
    const dir = join(HERE, '..', '..', NOTES_DIR);
    for (const f of readdirSync(dir)) {
      if (!f.endsWith('.md')) continue;
      const first = readFileSync(join(dir, f), 'utf8').split('\n', 1)[0];
      if (first.includes(`— ${name} `) || first.endsWith(`— ${name}`)) return f.slice(0, -3);
    }
  } catch { /* нет папки — нет конспекта */ }
  return null;
}
const SRC_EDIT = /ConanExiles[\\/]_unpacked[\\/]([A-Za-z0-9_]+)[\\/]/;
const notesRel = (mod) => `${NOTES_DIR}/${mod}.md`;
const norm = (p) => String(p || '').replace(/\\/g, '/').toLowerCase();
// `retoc --filter <имя>` распаковывает ЛЮБОЙ ассет: и мода, и самой игры (WBP_ContainerInfo — ванильный виджет; знание о нём — в карте игры).
// Модом имя считается, только если на него есть конспект или оно стоит в манифесте сборки (2026-10-30 16:1x, M19).
const PACK_MANIFEST = 'D:/work/ai_sandbox/ConanExiles/modpack.json';
let packNames = null;
const packMods = () => {
  if (!packNames) { try { packNames = new Set(JSON.parse(readFileSync(PACK_MANIFEST, 'utf8')).mods.map((x) => x.name)); } catch { packNames = new Set(); } }
  return packNames;
};
const RETOC = STUDY[2];

export function modOf(tool, input, isMod = (name) => packMods().has(name)) {
  if (tool === 'Bash' || tool === 'PowerShell') {
    const c = String(input.command || '');
    for (const re of STUDY) { const m = c.match(re); if (m) return re === RETOC && !isMod(m[1]) ? null : { mod: m[1], study: true }; }
    for (const re of WORK) { const m = c.match(re); if (m) return { mod: noteName(m[1] || m[2] || m[3]), study: false }; }
  }
  if (tool === 'Edit' || tool === 'Write') {
    const m = String(input.file_path || '').match(SRC_EDIT);
    if (m) return { mod: m[1], study: false };
  }
  return null;
}

// По журналу сессии: прочитан ли конспект; правился ли он после последнего разбора мода.
function toolUses(transcriptText) {
  const out = [];
  for (const line of String(transcriptText || '').split('\n')) {
    if (!line.includes('"tool_use"')) continue;
    let j; try { j = JSON.parse(line); } catch { continue; }
    for (const c of (j.message && j.message.content) || []) if (c && c.type === 'tool_use') out.push({ name: c.name, input: c.input || {} });
  }
  return out;
}
export const notesRead = (uses, mod) => uses.some((u) => u.name === 'Read' && norm(u.input.file_path).endsWith(norm(notesRel(mod))));
export function studiedNotWritten(uses, isMod) {
  const last = {};   // мод → индекс последнего разбора
  uses.forEach((u, i) => { const r = modOf(u.name, u.input, isMod); if (r && r.study) last[r.mod] = i; });
  return Object.keys(last).filter((mod) => !uses.some((u, i) => i > last[mod] && (u.name === 'Edit' || u.name === 'Write') &&
    norm(u.input.file_path).endsWith(norm(notesRel(mod)))));
}

export function notesGate(ev, transcriptText, exists) {
  const name = ev.hook_event_name, tool = String(ev.tool_name || ''), input = ev.tool_input || {};
  const isMod = (m) => exists(notesRel(m)) || packMods().has(m);
  if (name === 'PreToolUse') {
    const r = modOf(tool, input, isMod); if (!r) return null;
    const rel = notesRel(r.mod);
    if (!exists(rel)) return { hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason:
      `knowledge-hook · работа с модом ${r.mod}, а конспекта ${rel} нет. Сначала заведи его (что делает · ассеты и функции с номерами · наши правки · ` +
      `как смотреть внутрь · открытое) из того, что уже записано (карты игры, researches/, планы), и прочитай — потом работа.` } };
    if (!notesRead(toolUses(transcriptText), r.mod)) return { hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny',
      permissionDecisionReason: `knowledge-hook · работа с модом ${r.mod}: сначала прочитай свой конспект ${rel} (один раз за сессию) — там уже ` +
      `записано, как он устроен; не разбирай заново известное.` } };
    return null;
  }
  if (name === 'PostToolUse') {
    const r = modOf(tool, input, isMod); if (!r || !r.study) return null;
    return { hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: `knowledge-hook · ты разобрал ${r.mod}. Найденное — тем же ходом ` +
      `в ${notesRel(r.mod)} (ассет, функция, числа, где на диске, что это значит); остановка без этой записи не пройдёт.` } };
  }
  if (name === 'Stop' && !ev.stop_hook_active) {
    const owed = studiedNotWritten(toolUses(transcriptText), isMod);
    if (owed.length) return { decision: 'block', reason: `knowledge-hook · разобраны ${owed.join(', ')}, а их конспекты после разбора не правились: ` +
      `${owed.map(notesRel).join(', ')}. Запиши найденное — потом остановка.` };
  }
  return null;
}

export function respond(ev, stampFile, now = Math.floor(Date.now() / 1000), transcriptText = '', exists = () => true) {
  const gate = notesGate(ev, transcriptText, exists);
  if (gate) return gate;
  if (ev.hook_event_name === 'PreToolUse') return null;
  if (ev.hook_event_name === 'Stop' && chatClosed(transcriptText)) return null;
  const kind = moment(ev);
  if (!kind || habituated(kind, stampFile, now)) return null;
  // Остановка: Claude Code не даёт закончить ход и отдаёт причину агенту; stop_hook_active (агент уже ответил) — пропуск, без петли.
  if (kind === 'reflect') return { decision: 'block', reason: MOMENTS.reflect };
  return { hookSpecificOutput: { hookEventName: ev.hook_event_name, additionalContext: MOMENTS[kind] } };
}

function selftest() {
  const dir = mkdtempSync(join(tmpdir(), 'khook-'));
  const stamp = join(dir, 'seen.json');
  let fail = 0, t = 1000;
  const kindOf = (ev, dt = 1000) => { const r = respond(ev, stamp, (t += dt)); return r ? Object.keys(MOMENTS).find((k) => MOMENTS[k] === r.hookSpecificOutput.additionalContext) : 'тишина'; };
  const cases = [
    ['M1 слово владельца', { hook_event_name: 'UserPromptSubmit', prompt: 'давай с 20 до 21 чтобы свет разгорался' }, 'owner'],
    ['M2 слово с нажимом', { hook_event_name: 'UserPromptSubmit', prompt: 'НЕТ БЛЯТЬ!!!!' }, 'stress'],
    ['M3 ошибка в ответе', { hook_event_name: 'PostToolUse', tool_name: 'Bash', tool_input: { command: 'dotnet build' }, tool_response: { stdout: 'error CS1002' } }, 'surprise'],
    ['M4 дамп пульта', { hook_event_name: 'PostToolUse', tool_name: 'Bash', tool_input: { command: 'bash tools/h.sh "dump UI/ActionBar"' }, tool_response: { stdout: 'done' } }, 'reality'],
    ['M5 поиск в сети', { hook_event_name: 'PostToolUse', tool_name: 'WebSearch', tool_input: { query: 'x' } }, 'reality'],
    ['M6 чтение карты', { hook_event_name: 'PostToolUse', tool_name: 'Read', tool_input: { file_path: 'D:\\work\\ai_sandbox\\KUMM\\games\\SvarogsDream\\GAME_ARCHITECTURE_INTERNAL_MAP.md' } }, 'recall'],
    ['M7 вывод команды — сравнение', { hook_event_name: 'PostToolUse', tool_name: 'Bash', tool_input: { command: 'git status' }, tool_response: { stdout: 'nothing to commit' } }, 'compare'],
    ['M3b правка файла со словом «ошибка» — не исход', { hook_event_name: 'PostToolUse', tool_name: 'Edit', tool_input: { file_path: 'x.cs' }, tool_response: 'ошибка в тексте' }, 'compare'],
    ['M7b второе сравнение через 1 с — привыкание', { hook_event_name: 'PostToolUse', tool_name: 'Grep', tool_input: { pattern: 'x' }, tool_response: 'a' }, 'тишина', 1],
  ];
  for (const [name, ev, want, dt] of cases) { const got = kindOf(ev, dt); const ok = got === want; if (!ok) fail++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}: ${got}`); }
  // Общее привыкание: любое событие в пределах 10 минут — тишина (и нажим тоже); после окна — снова предписание.
  const ev = { hook_event_name: 'PostToolUse', tool_name: 'WebSearch', tool_input: {} };
  const a = respond(ev, stamp, 90000), b = respond(ev, stamp, 90010), c = respond(ev, stamp, 90000 + HABIT_SEC + 1);
  const okH = a && !b && c; if (!okH) fail++; console.log(`${okH ? 'ok  ' : 'FAIL'} M8 раз в 10 минут: ${a ? 'да' : 'нет'} · ${b ? 'да' : 'тишина'} · ${c ? 'да' : 'нет'}`);
  const s = respond({ hook_event_name: 'UserPromptSubmit', prompt: 'СТОП!!' }, stamp, 90000 + HABIT_SEC + 5);
  const okS = !s; if (!okS) fail++; console.log(`${okS ? 'ok  ' : 'FAIL'} M9 нажим внутри окна — тоже тишина`);
  const cl = respond({ hook_event_name: 'UserPromptSubmit', prompt: 'работай 30 минут, затем закрывай чат' }, stamp, 90000 + HABIT_SEC + 6);
  const okC = cl && cl.hookSpecificOutput.additionalContext === MOMENTS.closing; if (!okC) fail++; console.log(`${okC ? 'ok  ' : 'FAIL'} M10 приказ закрываться — рефлексия и внутри окна`);
  const r1 = respond({ hook_event_name: 'Stop' }, stamp, 100000), r2 = respond({ hook_event_name: 'Stop', stop_hook_active: true }, stamp, 100001), r3 = respond({ hook_event_name: 'Stop' }, stamp, 100002);
  const okR = r1 && r1.decision === 'block' && !r2 && !r3; if (!okR) fail++; console.log(`${okR ? 'ok  ' : 'FAIL'} M11 остановка: рефлексия · после ответа — пропуск · снова в окне — пропуск`);
  // M12 — закрытый чат: остановка молчит; тот же журнал без закрытия — рефлексия (контроль); слово владельца после закрытия — отмечается.
  const closedTr = '{"type":"assistant","message":{"content":[{"type":"tool_use","name":"Skill","input":{"skill":"end-chat-soft"}}]}}\n';
  const openTr = '{"type":"assistant","message":{"content":[{"type":"tool_use","name":"Skill","input":{"skill":"dayloop"}}]}}\n';
  const c1 = respond({ hook_event_name: 'Stop' }, stamp, 200000, closedTr);
  const c2 = respond({ hook_event_name: 'Stop' }, stamp, 300000, openTr);
  const c3 = respond({ hook_event_name: 'UserPromptSubmit', prompt: 'починишь это поведение?' }, stamp, 400000, closedTr);
  const okM12 = !c1 && c2 && c2.decision === 'block' && c3; if (!okM12) fail++;
  console.log(`${okM12 ? 'ok  ' : 'FAIL'} M12 закрытый чат: остановка — ${c1 ? 'рефлексия' : 'тишина'} · без закрытия — ${c2 ? 'рефлексия' : 'тишина'} · слово владельца — ${c3 ? 'отмечено' : 'тишина'}`);
  // M13–M18 — замок конспекта мода (2026-10-30). Журнал — строки tool_use, как пишет Claude Code.
  const use = (name, input) => JSON.stringify({ type: 'assistant', message: { content: [{ type: 'tool_use', name, input }] } });
  const extract = { command: 'python -I -X utf8 patch-mod-asset.py extract UIMod_Hosav W_SmoothHP D:/x/w' };
  const readNotes = use('Read', { file_path: 'D:\\work\\ai_sandbox\\KUMM\\games\\ConanExiles\\mods\\UIMod_Hosav.md' });
  const pre = (input, tr, ex = () => true, tool = 'Bash') => respond({ hook_event_name: 'PreToolUse', tool_name: tool, tool_input: input }, stamp, 500000, tr, ex);
  const deny = (r) => !!(r && r.hookSpecificOutput && r.hookSpecificOutput.permissionDecision === 'deny');
  const g1 = pre(extract, '', () => false), g2 = pre(extract, ''), g3 = pre(extract, readNotes);
  const okG = deny(g1) && /нет/.test(g1.hookSpecificOutput.permissionDecisionReason) && deny(g2) && /прочитай/.test(g2.hookSpecificOutput.permissionDecisionReason) && !g3;
  if (!okG) fail++; console.log(`${okG ? 'ok  ' : 'FAIL'} M13 разбор мода: нет конспекта — отказ · не прочитан — отказ · прочитан — пропуск`);
  const g4 = pre({ file_path: 'D:\\work\\ai_sandbox\\ConanExiles\\_unpacked\\KrinikConanUI\\ue4ss\\Scripts\\main.lua' }, '', () => true, 'Edit');
  const g5 = pre({ command: 'powershell -File Deploy-ModPack.ps1 -PackDir x -Deploy -Only KrinikConanGameplay' }, '');
  const g6 = pre({ command: 'git status' }, ''), g7 = pre({ file_path: 'D:\\work\\ai_sandbox\\KUMM\\STATUS.md' }, '', () => true, 'Edit');
  const okW = deny(g4) && /KrinikConanUI/.test(g4.hookSpecificOutput.permissionDecisionReason) && deny(g5) && !g6 && !g7;
  if (!okW) fail++; console.log(`${okW ? 'ok  ' : 'FAIL'} M14 правка исходника и раскатка -Only мода — отказ без конспекта; прочие команды и файлы — пропуск`);
  const g8 = pre({ command: 'python -I -X utf8 kismet-trace.py D:/s/legacy/ConanSandbox/Content/Mods/UIMod_Hosav/W_SmoothHP.uasset e.tsv j.json Progress_Food' }, readNotes);
  const g9 = pre({ command: 'python -I -X utf8 kismet-trace.py D:/s/legacy/ConanSandbox/Content/Mods/UIMod_Hosav/W_SmoothHP.uasset e.tsv j.json Progress_Food' }, '');
  const okT = !g8 && deny(g9); if (!okT) fail++; console.log(`${okT ? 'ok  ' : 'FAIL'} M15 kismet-trace по пути мода — имя мода из пути`);
  const post = respond({ hook_event_name: 'PostToolUse', tool_name: 'Bash', tool_input: extract, tool_response: 'ok' }, stamp, 500001);
  const okP = post && /UIMod_Hosav\.md/.test(post.hookSpecificOutput.additionalContext); if (!okP) fail++;
  console.log(`${okP ? 'ok  ' : 'FAIL'} M16 после разбора — предписание дописать конспект, без окна привыкания`);
  const studied = [readNotes, use('Bash', extract)].join('\n') + '\n';
  const wrote = studied + use('Edit', { file_path: 'D:/work/ai_sandbox/KUMM/games/ConanExiles/mods/UIMod_Hosav.md' }) + '\n';
  const s1 = respond({ hook_event_name: 'Stop' }, stamp, 600000, studied), s2 = respond({ hook_event_name: 'Stop' }, stamp, 700000, wrote);
  const okSt = s1 && s1.decision === 'block' && /UIMod_Hosav/.test(s1.reason) && !(s2 && /UIMod_Hosav/.test(s2.reason || ''));
  if (!okSt) fail++; console.log(`${okSt ? 'ok  ' : 'FAIL'} M17 остановка: разобран и не записан — блок с именем мода · записан — без этого блока`);
  const s3 = respond({ hook_event_name: 'Stop', stop_hook_active: true }, stamp, 800000, studied);
  const okSa = !s3; if (!okSa) fail++; console.log(`${okSa ? 'ok  ' : 'FAIL'} M18 повторная остановка после ответа (stop_hook_active) — пропуск, без петли`);
  // M19 (2026-10-30 16:1x): `retoc --filter WBP_ContainerInfo` — ванильный виджет игры, не мод; замок требовал конспект мода «WBP_ContainerInfo».
  const rv = (name) => ({ command: `R=/d/t/retoc.exe; $R to-legacy --version UE5_7 --no-shaders --filter ${name} /d/w/_paksview-3.0.1 /d/s/ci` });
  const g10 = pre(rv('WBP_ContainerInfo'), '', () => false), g11 = pre(rv('KrinikConanUI'), '', () => false), g12 = pre(rv('UIMod_Hosav'), '', (p) => /UIMod_Hosav/.test(p));
  const s4 = respond({ hook_event_name: 'Stop' }, stamp, 900000, use('Bash', rv('WBP_ContainerInfo')) + '\n', () => false);
  const okV = !g10 && deny(g11) && deny(g12) && !(s4 && /WBP_ContainerInfo/.test(s4.reason || ''));
  if (!okV) fail++; console.log(`${okV ? 'ok  ' : 'FAIL'} M19 retoc ванильного ассета — без замка и без блока остановки · мод из манифеста и мод с конспектом — замок`);
  try { rmSync(stamp); rmSync(dir, { recursive: true, force: true }); } catch { /* временная папка ОС */ }
  console.log(fail ? `selftest: ${fail} FAIL` : 'selftest: all ok');
  process.exitCode = fail ? 1 : 0;
}

function main() {
  try {
    if (process.argv[2] === '--selftest') return selftest();
    let ev = {};
    try { ev = JSON.parse(readFileSync(0, 'utf8') || '{}'); } catch { return; }
    let transcript = '';
    const needsLog = ev.hook_event_name === 'Stop' || (ev.hook_event_name === 'PreToolUse' && modOf(String(ev.tool_name || ''), ev.tool_input || {}));
    if (needsLog && ev.transcript_path) { try { transcript = readFileSync(ev.transcript_path, 'utf8'); } catch { /* */ } }
    const root = join(HERE, '..', '..');
    const out = respond(ev, join(HERE, '.knowledge-hook.json'), undefined, transcript, (rel) => existsSync(join(root, rel)));
    if (out) process.stdout.write(JSON.stringify(out));
  } catch { /* хук не ломает сессию */ }
}

main();
