#!/usr/bin/env node
// check-perf-world.mjs — третий гейт pre-commit (2026-10-10): отчёт прогона с замером кадра обязан сказать, ЖИЛ ли мир во время замера.
//
// Зачем. `[OWNER]` «как-то ты так замеряешь, что меня обманываешь(((» · 2026-10-10 ≈23:14. За вечер дважды цифра ушла к владельцу из
// неподходящих условий: «разбудить дальних — +0.5 мс» снято при остановленных часах игры (жители не живут по расписанию — их цена кажется
// нулевой), при идущем времени — +4.5 мс (testcases/reports/2026-10-10_svarog-perf-series.md, C7). Часы останавливались ради ровного света —
// и тихо переносились на замеры цены мира. Пульт `perf` теперь сам печатает `world=running|FROZEN` (SvarogsDream KrinikDevHarness); этот
// гейт не пускает отчёт, где замер есть, а состояния мира нет.
//
// Правило: staged-файл testcases/reports/<дата>_*.md с датой ≥ 2026-10-10, в котором есть команда замера пульта (`perf N`, `perf 8`…),
// должен содержать `world=running` или `world=FROZEN` (строка пульта) или явную строку «Мир при замере: …». Судит весь файл, не дифф:
// отчёт — единица утверждения.
//
// Запуск:  node tools/check-perf-world.mjs --staged      (из tools/hooks/pre-commit)
//          node tools/check-perf-world.mjs <файл…>       (руками)
//          node tools/check-perf-world.mjs --selftest    (красный на отчёте без состояния мира, зелёный — с ним)
// [TESTED: 2026-10-10 · --selftest 5/5; на 14 отчётах дня — красный до пометки, зелёный после · testcases/reports/2026-10-10_svarog-perf-series.md]
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const SINCE = '2026-10-10';
const REPORT = /^testcases\/reports\/(\d{4}-\d{2}-\d{2})_[^/]+\.md$/;
const PERF_CMD = /\bperf \d+\b/;
const WORLD = /world=(running|FROZEN)|Мир при замере:/;

export function judge(path, text) {
  const m = REPORT.exec(path.replace(/\\/g, '/'));
  if (!m || m[1] < SINCE) return null;
  if (!PERF_CMD.test(text)) return null;
  if (WORLD.test(text)) return null;
  return `${path}: замер кадра (\`perf N\`) без состояния мира — впиши строку пульта с world=running|FROZEN или «Мир при замере: часы идут | часы стоят (почему)»`;
}

function staged() {
  const names = execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z'], { encoding: 'utf8' })
    .split('\0').filter(Boolean);
  return names.map(p => [p, execFileSync('git', ['show', `:${p}`], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })]);
}

function selftest() {
  const bad = judge('testcases/reports/2026-10-11_x.md', '1. `h.sh "perf 8"`\nC1 — 13.1 мс');
  const good = judge('testcases/reports/2026-10-11_x.md', '1. `h.sh "perf 8"`\n| world=running timescale=1');
  const declared = judge('testcases/reports/2026-10-11_x.md', '`perf 8`\nМир при замере: часы стоят — замер света');
  const old = judge('testcases/reports/2026-10-09_x.md', '`perf 8`');
  const noPerf = judge('testcases/reports/2026-10-11_x.md', 'кадры, без замера');
  const ok = bad && !good && !declared && !old && !noPerf;
  console.log(`selftest: bad ${bad ? 'RED' : 'green(!)'} · good ${good ? 'red(!)' : 'GREEN'} · declared ${declared ? 'red(!)' : 'GREEN'} · old ${old ? 'red(!)' : 'GREEN'} · no-perf ${noPerf ? 'red(!)' : 'GREEN'}`);
  process.exit(ok ? 0 : 1);
}

// Только при прямом запуске: импорт judge() из другого скрипта не должен запускать проверку.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  if (args[0] === '--selftest') selftest();
  const files = args[0] === '--staged' ? staged() : args.map(p => [p, readFileSync(p, 'utf8')]);
  const fails = files.map(([p, t]) => judge(p, t)).filter(Boolean);
  for (const f of fails) console.error(f);
  process.exit(fails.length ? 1 : 0);
}
