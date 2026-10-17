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
//                 поиск в сети → «реальность»; чтение карты → «воспоминание»; прочий вывод → «сравнение»; любое событие внутри 10 минут → тишина
// GAP:            хук видит МОМЕНТ, не СМЫСЛ: записал ли агент знание и то ли записал — судья и владелец; новизна, пришедшая в рассуждении агента без
//                 события (догадка в голове), хуку не видна; «неожиданный исход» ловит и слова «ошибка» в найденном тексте (ложная тревога —
//                 2026-10-18, поиск по коду самого хука), её гасит окно 10 минут
// ON-REAL-PATH:   2026-10-18 02:04–02:06 +03:00 — живая сессия KUMM: «сравнение» после проверки настроек, «слово владельца», «воспоминание» после
//                 Read методички, «неожиданный исход» (ложная тревога) — все четыре дошли в контекст агента
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
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

export function respond(ev, stampFile, now = Math.floor(Date.now() / 1000)) {
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
  try { rmSync(stamp); rmSync(dir, { recursive: true, force: true }); } catch { /* временная папка ОС */ }
  console.log(fail ? `selftest: ${fail} FAIL` : 'selftest: all ok');
  process.exitCode = fail ? 1 : 0;
}

function main() {
  try {
    if (process.argv[2] === '--selftest') return selftest();
    let ev = {};
    try { ev = JSON.parse(readFileSync(0, 'utf8') || '{}'); } catch { return; }
    const out = respond(ev, join(HERE, '.knowledge-hook.json'));
    if (out) process.stdout.write(JSON.stringify(out));
  } catch { /* хук не ломает сессию */ }
}

main();
