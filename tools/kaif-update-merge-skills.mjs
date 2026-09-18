#!/usr/bin/env node
// kaif-update-merge-skills.mjs <projectRoot> <tplRoot> [--write]
// Ручная половина обновления KAIF для навыков, которые отличаются от шаблона ТОЛЬКО нашими заполнениями:
// цель = шаблон новой версии + заполнения этого проекта + местная строка description (в ней русские триггеры).
// Зачем он есть: машинерия не выводит заполнения, в значении которых есть `<…>` (исток #73), и на каждом
// интервале отдаёт руке /autoloop, /dayloop, /nightloop; а модуль, чей заголовок проект переименовал сам,
// она теряет молча (исток #72). <tplRoot> — дерево, извлечённое из KAIF-CORE-BUNDLE.md новой версии.
// Без --write только показывает, что изменится, и кладёт предпросмотр во временный каталог системы.
// Сохраняет окончания строк каждого файла. Остался незаполненный плейсхолдер — отказ, код 1.
// Список FILES и карта FILLS — про ЭТОТ проект и ЭТОТ интервал: перед следующим обновлением сверить оба.
//
// [TESTED: 2026-09-18 · функциональный прогон на живом дереве KUMM при обновлении 2.5 → 2.7: предпросмотр прочитан
//  разностью по всем семи файлам, затем --write, затем повторный прогон — «=» у всех семи; после него
//  tools/kaif-update-sweep.mjs дал 0 недоехавших строк. Версия ДО правки каталога предпросмотра; после правки —
//  один прогон без --write, см. testcases/reports/2026-09-18_kaif-update-sweep.md, прогон 4]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
const [root, tpl] = process.argv.slice(2);
const WRITE = process.argv.includes('--write');
const BS = String.fromCharCode(92); // a backslash that no shell layer can eat
const FILES = [
  '.claude/skills/autoloop/SKILL.md',
  '.claude/skills/dayloop/SKILL.md',
  '.claude/skills/nightloop/SKILL.md',
  '.claude/skills/end-chat-soft/SKILL.md',
  '.claude/skills/end-chat-force/SKILL.md',
  '.claude/skills/pause/SKILL.md',
  '.claude/skills/team-deployment/references/team-constitution-template.md',
];
const FILLS = [
  ['<BUILD_COMMAND>', 'node --check kumm.mjs'],
  ['<TEST_HARNESS>', 'node kumm.mjs check --json / .' + BS + 'Deploy-ModPack.ps1 -Verify -PackDir <pack>; full table in AGENT_GUIDE.md "Test harness"'],
  ['<COMMIT_COMMAND>', 'git add -A && git commit -m "<msg>" && git push'],
  ["<YOUR AGENT/MODEL> <YOUR AGENT'S noreply EMAIL>", 'Claude Opus 5 (1M context) <noreply@anthropic.com>'],
];
const ALIAS = ' Trigger aliases (ru): ';
const CR = String.fromCharCode(13);
const LF = String.fromCharCode(10);
let bad = 0;
const PREVIEW = join(tmpdir(), 'kaif-merge-preview');   // не в корень проекта: предпросмотр — не часть дерева
if (!WRITE) { mkdirSync(PREVIEW, { recursive: true }); console.log('предпросмотр: ' + PREVIEW); }
for (const f of FILES) {
  const raw = readFileSync(join(root, f), 'utf8');
  const crCount = raw.split(CR + LF).length - 1;
  const lfCount = raw.split(LF).length - 1;
  const crlf = crCount > 0 && crCount === lfCount;
  if (crCount > 0 && crCount !== lfCount) { console.log(`! ${f}: MIXED line endings (CRLF ${crCount} of ${lfCount})`); bad++; }
  const local = raw.split(CR + LF).join(LF).split(LF);
  let target = readFileSync(join(tpl, f), 'utf8').split(CR + LF).join(LF);
  for (const [a, b] of FILLS) target = target.split(a).join(b);
  const t = target.split(LF);
  const li = local.findIndex((l) => l.startsWith('description:'));
  const ti = t.findIndex((l) => l.startsWith('description:'));
  if (li >= 0 && ti >= 0) {
    const k = local[li].indexOf(ALIAS);
    const localBase = k >= 0 ? local[li].slice(0, k) : local[li];
    const suffix = k >= 0 ? local[li].slice(k) : '';
    if (localBase !== t[ti]) console.log(`! ${f}: upstream description text differs from the local base - taking upstream + local aliases`);
    t[ti] = t[ti] + suffix;
  }
  const left = t.join(LF).match(/<[A-Z][A-Z_/' ]{3,}>/g);
  if (left) { console.log(`! ${f}: unfilled placeholders remain: ${[...new Set(left)].join(' ')}`); bad++; }
  const out = t.join(LF);
  const same = out === local.join(LF);
  console.log(`${same ? '=' : '~'} ${f} (${local.length} -> ${t.length} lines, ${crlf ? 'CRLF' : 'LF'} ${crCount}/${lfCount})`);
  if (WRITE && !same) writeFileSync(join(root, f), crlf ? out.split(LF).join(CR + LF) : out);
  if (!WRITE) writeFileSync(join(PREVIEW, f.split('/').join('__')), out);
}
process.exit(bad ? 1 : 0);
