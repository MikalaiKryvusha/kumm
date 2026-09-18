#!/usr/bin/env node
// kaif-update-probe-matchfills.mjs <kaif-core.mjs> — зонд к тикету истока #73 (bugs/KAIF/04_*).
// Вынимает из развёрнутого ядра его СОБСТВЕННУЮ функцию matchFills (дословно, по двум маркерам в тексте) и
// зовёт её на модуле из одной строки: с заполнением без угловых скобок и с заполнением, где есть `<pack>`.
// Зачем он есть: «скорее всего причина в…» про чужой код — догадка; поднять функцию и позвать её — наблюдение.
// Пока #73 открыт, второй вызов печатает null; когда исток починит захват, он напечатает оба слота —
// это и есть проверка, что тикет закрыт по делу. Маркеры не нашлись — код 2, а не тишина.
//
// [TESTED: 2026-09-18 · два прогона по ядру 2.7 этого дерева, вывод прочитан: без скобок — оба слота выучены,
//  с `<pack>` — null; отчёт testcases/reports/2026-09-18_kaif-update-sweep.md, прогон 5]
import { readFileSync } from 'node:fs';
const src = readFileSync(process.argv[2], 'utf8').split(String.fromCharCode(13) + String.fromCharCode(10)).join(String.fromCharCode(10));
const a = src.indexOf('const slotsIn = ');
const b = src.indexOf('// Fold the fills back into their slots');
if (a < 0 || b < 0) { console.log('COULD NOT LIFT the functions - markers not found'); process.exit(2); }
const lifted = src.slice(a, b);
const PLACEHOLDERS = ['<BUILD_COMMAND>', '<TEST_HARNESS>', '<COMMIT_COMMAND>'];
const matchFills = new Function('PLACEHOLDERS', lifted + '\nreturn matchFills;')(PLACEHOLDERS);
const tpl = 'Build (`<BUILD_COMMAND>`), then verify on the harness (`<TEST_HARNESS>`).';
const plain = 'Build (`node --check kumm.mjs`), then verify on the harness (`node kumm.mjs check --json`).';
const angled = 'Build (`node --check kumm.mjs`), then verify on the harness (`Deploy-ModPack.ps1 -Verify -PackDir <pack>`).';
console.log('fill WITHOUT angle brackets ->', JSON.stringify(matchFills(tpl, plain)));
console.log('fill WITH "<pack>" inside    ->', JSON.stringify(matchFills(tpl, angled)));
