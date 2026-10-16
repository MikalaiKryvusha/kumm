// Кейс К6 прибора tools/kaif-update-sweep.mjs (отчёт testcases/reports/2026-09-18_kaif-update-sweep.md, §8): мутант независимого
// судьи обновления 2.7 → 2.9, перенесён в репозиторий 2026-10-16. Иглы — строки бандла 2.9; на другом бандле, где их нет, мутант
// падает с «needle not found» — тогда выбрать две новые строки той версии, не слоты.
// Judge mutant for F1: copy every deployable file the 2.9 bundle names from the live tree into a scratch root, then
// delete ONE upstream line that is not a template slot (a 2.9 line of /owner-reviews I8, and one of KAIF_REFERENCE)
// — a real "undelivered upstream line". Addressees named BEFORE the run: the HEAD sweep must name both lines (exit 1);
// the patched sweep must name both too if its slot rule is as narrow as claimed. Intact copy → 0 lines (the sweep version
// before 2026-10-16 also printed 8 genuine slot lines).
// usage: node tools/kaif-update-sweep-mutant.mjs <bundle> <liveRoot> <outRoot>
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
const [bundle, live, out] = process.argv.slice(2);
const CR = String.fromCharCode(13), LF = String.fromCharCode(10);
const lines = readFileSync(bundle, 'utf8').split(CR + LF).join(LF).split(LF);
let n = 0;
for (const l of lines) {
  const m = l.match(/^> \*\*FILE: `([^`]+)`\*\*/);
  if (!m) continue;
  const src = join(live, m[1]);
  if (!existsSync(src)) continue;
  mkdirSync(dirname(join(out, m[1])), { recursive: true });
  copyFileSync(src, join(out, m[1])); n++;
}
const cut = (rel, needle) => {
  const p = join(out, rel);
  const t = readFileSync(p, 'utf8');
  const arr = t.split(LF);
  const i = arr.findIndex((x) => x.includes(needle));
  if (i < 0) throw new Error('needle not found in ' + rel);
  console.log('mutant: removed', rel + ':' + (i + 1), '«' + arr[i].trim().slice(0, 100) + '»');
  arr.splice(i, 1);
  writeFileSync(p, arr.join(LF));
};
cut('.claude/skills/owner-reviews/SKILL.md', 'Saving wakes the waiter');
cut('.kaif/KAIF_REFERENCE.md', 'at the project root on first use — a standing rule of the owner');
console.log('copied', n, 'files');
