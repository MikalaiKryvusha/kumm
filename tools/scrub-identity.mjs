#!/usr/bin/env node
// scrub-identity.mjs — обязательство проекта: НИЧТО, что деанонимизирует владельца или его машину,
// не попадает в репозиторий. Проверяется кодом и хуком, а не памятью человека и агента.
//
// ПОЧЕМУ ЭТО ПРИБОР, А НЕ ПРАВИЛО В ДОКУМЕНТЕ. 2026-09-12 в ПУБЛИЧНЫЙ репозиторий `kumm` уехали
// два журнала UE4SS сырыми, а до них — SteamID владельца и путь его профиля Windows в трёх
// отчётах. Никто не нарушал правил: правил не было, была память. Владелец потребовал прямо:
// «это должно стать ОБЯЗАТЕЛЬСТВОМ проекта, кодом, проверками, хуками, а не на памяти».
//
// ГЛАВНОЕ УСТРОЙСТВО: прибор НЕ ХРАНИТ секреты в себе. Имя пользователя, имя машины и домашний
// каталог он спрашивает у системы В МОМЕНТ ЗАПУСКА. Список секретов, закоммиченный в публичный
// репозиторий, сам был бы утечкой — ровно тем, от чего защищаемся.
//
// ЧТО ОСТАЁТСЯ ЧИТАЕМЫМ. Обезличивание не должно убивать пользу: адреса памяти, версии, тайминги,
// имена модов и структура путей сохраняются. Меняются только опознаватели — на заглушки той же
// формы, чтобы журнал читался так же (`<GAME>\ConanSandbox\Binaries\...`).
//
//   node tools/scrub-identity.mjs            проверить всё отслеживаемое git (ничего не пишет)
//   node tools/scrub-identity.mjs --fix      обезличить найденное на месте
//   node tools/scrub-identity.mjs --check <файлы...>   проверить конкретные файлы (так делает хук)
//   node tools/scrub-identity.mjs --install-hook       включить pre-commit в этом клоне
//
// Код возврата: 0 — чисто, 1 — найдены опознаватели (хук на этом останавливает коммит).

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();

// ---------------------------------------------------------------- секреты этой машины, из системы
const USER = os.userInfo().username;
const HOST = os.hostname();
const HOME = os.homedir();
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Заглушки намеренно похожи на оригинал по форме — чтобы текст остался читаемым.
const RULES = [
  // --- жёсткие: опознают человека или машину, запрещены ВЕЗДЕ ------------------------------
  { id: 'user-profile-path', scope: 'all',
    re: /\b([A-Za-z]:[\\/])Users[\\/]([^\\/\s"'`,;)\]]+)/g,
    // Заглушка — НАСТОЯЩАЯ переменная Windows, а не `<user>`: документы содержат команды
    // восстановления (в том числе для единственного экземпляра сохранения Elden Ring), и они
    // обязаны остаться копируемыми. `%USERPROFILE%` и безопасен, и исполняем.
    fix: (m, drive, who) => (who.toLowerCase() === USER.toLowerCase() ? '%USERPROFILE%' : m),
    why: 'путь профиля Windows называет имя пользователя' },

  // Без буквы диска: `\\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy1\Users\<имя>\…` — теневая
  // копия тома. Правило с буквой диска такое НЕ ловит; пропуск найден переписыванием истории
  // 12.09.2026, то есть гейт был дырявым ровно там, где путь выглядит непривычно.
  { id: 'user-profile-unc', scope: 'all',
    re: /([\\/])Users([\\/])([^\\/\s"'`,;)\]]+)/g,
    fix: (m, s1, s2, who) => (who.toLowerCase() === USER.toLowerCase() ? `${s1}Users${s2}<user>` : m),
    why: 'путь профиля без буквы диска (теневая копия, UNC) называет имя пользователя' },

  { id: 'home-path-posix', scope: 'all',
    re: /\/home\/([^/\s"'`,;)\]]+)/g,
    fix: (m, who) => (who.toLowerCase() === USER.toLowerCase() ? '/home/<user>' : m),
    why: 'домашний каталог называет имя пользователя' },

  { id: 'ls-owner-column', scope: 'all',
    re: new RegExp(`([-drwx]{10}\\s+\\d+\\s+)${esc(USER)}\\b`, 'g'),
    fix: (m, head) => `${head}<user>`,
    why: 'колонка владельца в выводе ls называет имя пользователя' },

  { id: 'hostname', scope: 'all',
    re: new RegExp(`\\b${esc(HOST)}\\b`, 'gi'),
    fix: () => '<host>',
    why: 'имя машины' },

  { id: 'steam-id', scope: 'all',
    re: /\b7656119\d{10}\b/g,
    fix: () => '<steamid>',
    why: 'SteamID64 — прямой опознаватель аккаунта' },

  { id: 'email', scope: 'all',
    // Пустые метки домена запрещены намеренно: `[ShadowQuality@0..Cine]` — секция Unreal, и
    // наивное `[A-Za-z0-9.-]+` объявляло её почтой (поймано на своих же документах 12.09.2026).
    re: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}\b/g,
    fix: () => '<email>',
    why: 'адрес почты',
    allow: [/noreply@anthropic\.com/i, /@example\./i, /@users\.noreply\.github\.com/i] },

  { id: 'mac-address', scope: 'all',
    re: /\b(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}\b/g,
    fix: () => '<mac>',
    why: 'MAC-адрес сетевой карты' },

  { id: 'private-ip', scope: 'all',
    re: /\b(?:192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b/g,
    fix: () => '<lan-ip>',
    why: 'адрес в домашней сети' },

  // --- мягкие: только в ЖУРНАЛАХ и снимках, где путь — не инструкция, а след машины ---------
  { id: 'log-timezone', scope: 'artifact',
    re: /(Timezone:\s*)([A-Za-z]+\/[A-Za-z_]+)/g,
    fix: (m, head) => `${head}<redacted>`,
    why: 'часовой пояс в журнале выдаёт географию' },

  // Пробел ВНУТРИ пути разрешён намеренно: «D:\Games\Conan Exiles\…» — обычное имя папки, а
  // остановка по первому пробелу давала обрубок «<GAME> Exiles\…» (поймано на своих журналах).
  // Путь кончается кавычкой, скобкой, запятой, точкой с запятой или концом строки.
  { id: 'log-abs-path', scope: 'artifact',
    re: /\b([A-Za-z]:[\\/](?:Games|work|Program Files(?: \(x86\))?|Users)[\\/][^\r\n"'`,;)\]]*)/g,
    fix: (m) => {
      const s = m.replace(/\//g, '\\');
      const tail = s.split('\\').slice(3).join('\\');
      if (/^[A-Za-z]:\\Games\\/i.test(s)) return tail ? `<GAME>\\${tail}` : '<GAME>';
      if (/^[A-Za-z]:\\work\\/i.test(s)) return tail ? `<WORK>\\${tail}` : '<WORK>';
      return '<PATH>';
    },
    why: 'абсолютный путь в журнале описывает раскладку дисков машины' },
];

// ---------------------------------------------------- локальный запретный словарь (вне git)
// Слова, которые владелец назвал «не светить нигде», СОЗНАТЕЛЬНО НЕ ЛЕЖАТ В ЭТОМ ФАЙЛЕ:
// публичный список того, что мы прячем, сам всё и рассказывает — и первая версия правила
// именно этим и грешила (12.09.2026). Словарь живёт рядом, в `tools/scrub-local.json`,
// закрытом `.gitignore`. Формат: { "terms": ["…", "…"], "why": "одна строка" }.
// Файла нет — правило просто не работает, и прибор говорит об этом вслух, а не молчит.
// Класс «ручной»: такие слова прибор находит и БЛОКИРУЕТ, но не заменяет — вокруг них живёт
// смысл, и переписывать надо руками, нейтрально.
const LOCAL_LIST = path.join(ROOT, 'tools', 'scrub-local.json');
let localLoaded = 0;
if (fs.existsSync(LOCAL_LIST)) {
  let cfg;
  try { cfg = JSON.parse(fs.readFileSync(LOCAL_LIST, 'utf8')); }
  catch (e) { console.error(`tools/scrub-local.json не разобран: ${e.message}`); process.exit(1); }
  const terms = (cfg.terms || []).filter(Boolean).map(esc);
  if (terms.length) {
    localLoaded = terms.length;
    RULES.push({ id: 'local-forbidden', scope: 'all', manual: true,
      re: new RegExp(`(?<![\\p{L}\\p{N}_])(?:${terms.join('|')})`, 'gui'),
      why: cfg.why || 'слово из локального запретного списка (tools/scrub-local.json)' });
  }
}

const ARTIFACT = /(\.log(\.txt)?|\.dmp\.txt|-log\.txt|\.trace)$/i;
const SKIP_DIR = /(^|[\\/])(\.git|node_modules)([\\/]|$)/;
// Сам прибор и канон ОБЯЗАНЫ содержать примеры заглушек — иначе их нельзя описать.
const SELF = /(^|[\\/])(tools[\\/]scrub-identity\.mjs|tools[\\/]hooks[\\/]pre-commit)$/;

function isText(buf) {
  const n = Math.min(buf.length, 8000);
  for (let i = 0; i < n; i++) if (buf[i] === 0) return false;
  return true;
}

function scan(rel, fix) {
  const abs = path.join(ROOT, rel);
  let buf;
  try { buf = fs.readFileSync(abs); } catch { return { hits: [], changed: false }; }
  if (!isText(buf)) return { hits: [], changed: false };
  let text = buf.toString('utf8');
  const before = text;
  const artifact = ARTIFACT.test(rel);
  const hits = [];

  for (const rule of RULES) {
    if (rule.scope === 'artifact' && !artifact) continue;
    text = text.replace(rule.re, (...args) => {
      const m = args[0];
      if (rule.allow && rule.allow.some((a) => a.test(m))) return m;
      if (rule.manual) {                                  // блокируем, но не правим сами
        const line = before.slice(0, args[args.length - 2]).split('\n').length;
        hits.push({ rule: rule.id, why: rule.why, line, mask: m, manual: true });
        return m;
      }
      const replaced = rule.fix(...args.slice(0, -2));
      if (replaced === m) return m;                    // правило не сработало на этом совпадении
      const line = before.slice(0, args[args.length - 2]).split('\n').length;
      const mask = m.length > 12 ? `${m.slice(0, 6)}…${m.slice(-3)}` : '…';
      hits.push({ rule: rule.id, why: rule.why, line, mask });
      return replaced;
    });
  }
  const changed = text !== before;
  if (fix && changed) fs.writeFileSync(abs, text, 'utf8');
  return { hits, changed };
}

function trackedFiles() {
  return execFileSync('git', ['ls-files', '-z'], { cwd: ROOT, encoding: 'utf8' })
    .split('\0').filter(Boolean).filter((f) => !SKIP_DIR.test(f) && !SELF.test(f));
}

function installHook() {
  const dir = path.join(ROOT, 'tools', 'hooks');
  execFileSync('git', ['config', 'core.hooksPath', 'tools/hooks'], { cwd: ROOT });
  const hook = path.join(dir, 'pre-commit');
  if (fs.existsSync(hook)) { try { fs.chmodSync(hook, 0o755); } catch { /* windows */ } }
  console.log('core.hooksPath = tools/hooks — pre-commit включён в этом клоне');
}

// ------------------------------------------------------------------------------------ запуск
const argv = process.argv.slice(2);
if (argv.includes('--install-hook')) { installHook(); process.exit(0); }

const fix = argv.includes('--fix');
const explicit = argv.filter((a) => !a.startsWith('--'));
const files = explicit.length
  ? explicit.map((f) => path.relative(ROOT, path.resolve(f)).replace(/\\/g, '/')).filter((f) => !SELF.test(f))
  : trackedFiles();

let bad = 0, fixed = 0, manual = 0;
for (const f of files) {
  const { hits, changed } = scan(f, fix);
  if (!hits.length) continue;
  bad += hits.length;
  manual += hits.filter((h) => h.manual).length;
  if (changed && fix) fixed++;
  const by = new Map();
  for (const h of hits) by.set(h.rule, (by.get(h.rule) || 0) + 1);
  console.log(`${fix ? 'обезличен' : 'НАЙДЕНО  '} ${f}`);
  for (const [rule, n] of by) {
    const one = hits.find((h) => h.rule === rule);
    console.log(`    ${rule} ×${n} (строка ${one.line}, «${one.mask}») — ${one.why}`);
  }
}

// Молчание о выключенном правиле опаснее самого правила: сессия решит, что проверено ВСЁ.
const localNote = localLoaded
  ? `локальный словарь: ${localLoaded} слов`
  : 'локального словаря НЕТ (tools/scrub-local.json) — правило запретных слов ВЫКЛЮЧЕНО';

if (!bad) { console.log(`чисто: проверено файлов ${files.length}, опознавателей не найдено · ${localNote}`); process.exit(0); }
console.log(`(${localNote})`);
if (fix) {
  console.log(`\nобезличено файлов: ${fixed}, замен: ${bad - manual}`);
  if (!manual) process.exit(0);
  console.log(`ОСТАЛОСЬ ${manual} мест РУЧНОГО класса — их прибор не правит намеренно:`);
  console.log('вокруг слова живёт объяснение, и заглушка сделала бы текст бессмысленным.');
  console.log('Перепиши нейтрально, сохранив технический смысл, и прогони проверку снова.');
  process.exit(1);
}
console.log(`\nОПОЗНАВАТЕЛЕЙ: ${bad}. Это обязательство проекта, а не совет.`);
console.log('Починить:  node tools/scrub-identity.mjs --fix');
console.log('Разобрать по одному:  node tools/scrub-identity.mjs --check <файл>');
process.exit(1);
