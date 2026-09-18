#!/usr/bin/env node
// kaif-update-sweep.mjs — после прохода `/kaif-update` сверяет КАЖДЫЙ развёрнутый файл фреймворка с бандлом
// новой версии и называет строки, которые апстрим добавил, а на диск они не дошли.
//
// Зачем он есть (полевой случай 2026-09-18, обновление KAIF 2.5 → 2.7, тикет истока #72): проход закончился
// кодом 0, `check` был зелёным, а два модуля закрывающих ритуалов остались без своей апстримной дельты —
// проект заранее переименовал их заголовки сам (baton → handover), машинерия не нашла старый якорь, написала
// в журнал «the section arrives as new» и НЕ привезла раздел ни на диск, ни в задание обновления. Задание
// показывает только то, что классификатор счёл расхождением; то, что он потерял, не видно ниоткуда. Этот прибор
// смотрит с другой стороны: не «что сказала машинерия», а «что лежит в бандле и чего нет на диске».
//
//   node tools/kaif-update-sweep.mjs <старый KAIF-CORE-BUNDLE.md> <новый KAIF-CORE-BUNDLE.md> [--root <dir>]
//
// Бандлы берутся так: gh release download v<X> --repo MikalaiKryvusha/KAIF --pattern KAIF-CORE-BUNDLE.md
// Код выхода: 0 — всё доехало; 1 — есть недоехавшие строки (они напечатаны); 2 — прибор не смог прочесть вход.
// Неудача чтения НИКОГДА не печатается как «чисто» (урок EXP-0116: «не прочёл» ≠ «ждём»).
//
// @guard kaif-update-sweep
// THREAT:         проход обновления KAIF молча теряет апстримную дельту модуля и не кладёт её в задание (исток #72)
// PROVED-AGAINST: дерево песочницы 2.5→2.7 сразу после прохода, ДО ручного слияния — 121 строка в 11 файлах, код 1;
//                 среди них оба молча потерянных модуля (end-chat-force 5 строк, end-chat-soft шаг 1), которых НЕ было в задании
// GAP:            видит только строки, ДОБАВЛЕННЫЕ между двумя шаблонами; чистое удаление апстримом не видит; строки с
//                 плейсхолдерами и строку description (русские триггеры) пропускает намеренно — там расхождение законно,
//                 поэтому непереведённый кусок с плейсхолдером (английский символ веры) он не назовёт
// ON-REAL-PATH:   живое дерево KUMM после обновления и ручного слияния 2026-09-18 — 0 строк, код 0
//
// [TESTED: 2026-09-18 · три прогона на настоящих деревьях, вывод прочитан: сломанное — 121 строка/код 1, живое — 0/код 0,
//  нечитаемый вход — «НЕ ПРОЧЁЛ»/код 2 · отчёт testcases/reports/2026-09-18_kaif-update-sweep.md]
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const CR = String.fromCharCode(13);
const LF = String.fromCharCode(10);
const args = process.argv.slice(2);
const rootAt = args.indexOf('--root');
const ROOT = rootAt >= 0 ? args[rootAt + 1] : process.cwd();
const [oldBundle, newBundle] = args.filter((a, i) => a !== '--root' && args[i - 1] !== '--root');

// Документы, которые проект пишет САМ поверх скелета: их шаблон — не эталон содержимого.
const OWNER_SEEDED = new Set(['STATUS.md', 'GOAL.md', 'MASTER_PLAN.md', 'KAIF_FRAMEWORK.md', 'PROJECT_HISTORY.md',
  'PROJECT_STRUCTURE_EXTERNAL_MAP.md', 'PROJECT_ARCHITECTURE_INTERNAL_MAP.md']);
const KNOWLEDGE_README = /^(bugs|plans|ideas|researches|interviews|homeworks|reports)\/README\.md$/; // приезжают локализованными
const PLACEHOLDER = /<[A-Z][A-Z_/' ]{3,}>/;

const die = (msg) => { console.error('НЕ ПРОЧЁЛ: ' + msg); process.exit(2); };
if (!oldBundle || !newBundle) die('нужны два пути: <старый бандл> <новый бандл>');

// Разбор бандла: блоки `> **FILE: `путь`**` с телом между шестью обратными апострофами.
function parseBundle(path) {
  if (!existsSync(path)) die('нет файла ' + path);
  const lines = readFileSync(path, 'utf8').split(CR + LF).join(LF).split(LF);
  const files = new Map();
  const FENCE = '``````';
  let i = 0;
  while (i < lines.length) {
    const m = lines[i].match(/^> \*\*FILE: `([^`]+)`\*\*/);
    if (!m) { i++; continue; }
    i++;
    while (i < lines.length && !lines[i].startsWith(FENCE)) i++;
    i++;
    const body = [];
    while (i < lines.length && lines[i] !== FENCE) body.push(lines[i++]);
    i++;
    files.set(m[1], body);
  }
  if (!files.size) die('в ' + path + ' не найдено ни одного блока FILE: — это точно KAIF-CORE-BUNDLE.md?');
  return files;
}

const oldFiles = parseBundle(oldBundle);
const newFiles = parseBundle(newBundle);
let judged = 0, skipped = 0, missingFiles = 0, findings = 0;
const norm = (l) => l.trimEnd();

for (const [path, body] of [...newFiles].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) {
  if (path.startsWith('templates/') || path.endsWith('.json')) continue;          // языковые пакеты и мета — не развёртываются по этому пути
  if (OWNER_SEEDED.has(path) || KNOWLEDGE_README.test(path)) { skipped++; continue; }
  const disk = join(ROOT, path);
  if (!existsSync(disk)) { console.log(`ОТСУТСТВУЕТ НА ДИСКЕ  ${path}`); missingFiles++; continue; }
  const have = new Set(readFileSync(disk, 'utf8').split(CR + LF).join(LF).split(LF).map(norm));
  const was = new Set((oldFiles.get(path) || []).map(norm));
  const lost = [];
  body.forEach((l, n) => {
    const t = norm(l);
    if (!t.trim() || was.has(t) || have.has(t)) return;
    if (PLACEHOLDER.test(t) || t.startsWith('description:')) return;               // законное расхождение: заполнения и триггеры
    lost.push(`${String(n + 1).padStart(5)}: ${t.slice(0, 180)}`);
  });
  judged++;
  if (lost.length) { findings += lost.length; console.log(`## ${path} — не доехало строк: ${lost.length}`); lost.forEach((x) => console.log(x)); }
}

console.log(`-- сверено файлов: ${judged} · пропущено как документы владельца: ${skipped} · нет на диске: ${missingFiles} · недоехавших строк: ${findings}`);
process.exit(findings || missingFiles ? 1 : 0);
