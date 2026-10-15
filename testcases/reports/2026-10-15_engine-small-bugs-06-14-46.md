# Test run report — мелкие баги движка 06, 14, 46 (пачка плана 25, пункты 6–8)

**Created:** 2026-10-15 20:52 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** KUMM `43d22f1` + правки рабочего дерева
(`kumm.mjs` — `newestOfKind`; `Deploy-ModPack.ps1` — слияние `modlist.txt` при `-Only`, предупреждения «0 files» и «nothing to verify»)

## 1. Work

Три бага движка из плана 25: `bugs/14` (`pickCard` держится за старый файл с версией в имени), `bugs/06` (`-Only` обрезает `modlist.txt`),
`bugs/46` (мод без `verify` проверяется молча, мод с 0 файлов — `[ok]`). Основа — критерии приёмки в документах багов. Кейсы — в
регрессии `test-pick-card.mjs` (два новых) и в стенде `tools/fixture-pack.mjs` (восемь новых проверок: раскатка, `-Verify`, второй пак с
`modsDir` + `modList`).

## 2. Contour

Чистое ядро `kumm.mjs` (вырезка функций тестом); игровая половина — стенд во временной папке ОС (поддельные паки, папка «игры»); реальный
мир — `-Verify` (только чтение) по трём пакам владельца: `D:/work/ai_sandbox/Palworld`, `ConanExiles`, `SvarogsDream`.
`REAL WORLD:` accumulated — установленные игры владельца со всеми прошлыми раскатками; data and machine — его паки и его машина; path —
`Deploy-ModPack.ps1 -PackDir <пак> -Verify`, как он запускает. Раскатка `-Only` в игру владельца не делалась: она меняет его установку.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-15 20:46 +03:00 | `node test-pick-card.mjs` (до правки) | 1 · 18 из 19, красный ровно кейс бага 14 |
| 2 | 2026-10-15 20:47 +03:00 | `node test-pick-card.mjs`; `node test-parse-archive.mjs`; `node test-archive-roundtrip.mjs`; `node test-help-commands.mjs` | 0 · 19/19, 17/17, 8/8, help ок |
| 3 | 2026-10-15 20:49 +03:00 | `KUMM_DEPLOY=<HEAD-копия Deploy-ModPack.ps1> node tools/fixture-pack.mjs` | 1 · 4 провала — ровно названные кейсы багов 06 и 46 |
| 4 | 2026-10-15 20:49 +03:00 | `node tools/fixture-pack.mjs` | 0 · 20 из 20 |
| 5 | 2026-10-15 20:50 +03:00 | `powershell -File <old\|new> -PackDir D:/work/ai_sandbox/<Palworld\|ConanExiles\|SvarogsDream> -Verify` | 0 у всех; Palworld и Конан — вывод тот же (ok 23 / 68); Сварог — 7 `nothing to verify` |
| 6 | 2026-10-15 20:51 +03:00 | `powershell -File Deploy-ModPack.ps1 -PackDir D:/work/ai_sandbox/SvarogsDream -Verify` (после `verify` в манифесте) | 0 · `8 present, 0 missing`, ни одного предупреждения |

## 4. Checks

Hygiene: регрессия ядра 19/19 + 17/17 + 8/8; стенд 20/20; контроль — та же проверка по прежней версии скрипта красная ровно на 4 названных кейсах.
Functional run: `-Verify` по трём настоящим пакам владельца (его установки игр) — прочитан вывод каждой строки; живой путь `kumm check` через
Chrome и `-Deploy -Only` в игру владельца — НЕ прогонялись.

| Case | Status | Observation |
|---|---|---|
| баг 14: «BossesMyNewBesties 3.0» → свежий файл того же рода | pass | гигиена: `uploaded 2026-09-17T12:19:38Z` |
| баг 14: вариант Capped не подменяет обычный | pass | гигиена: `PWS 1.0.8` |
| баг 46: мод с 0 файлов | pass | стенд: `[warn] Empty Mod 1  (0 files …)` |
| баг 46: мод без `verify` | pass | стенд: `[warn] More Katanas: nothing to verify`; пак Сварога — 7 таких же строк |
| баг 46: удалён сторожевой файл | pass | стенд: `[FAIL] Camera Control…`, код 1 |
| баг 06: `-Only "Beta Bows"` | pass | стенд: `modlist.txt` = `AlphaArms.pak,BetaBows.pak,GammaGear.pak` до и после |
| баг 06: `-Verify` после `-Only` | pass | стенд: код 0, ни одного `not in modlist` |
| реальный мир: Palworld, Конан | pass | вывод `-Verify` старой и новой версии совпал (ok 23 / 68, warn 1 / 5) |

## 5. Found

- пак Сварога (`SvarogsDream/modpack.json`) — 7 модов без строк `verify`: `-Verify` говорил «clean», проверив один `steam_emu`; дописаны
  сторожевые пути (UIRework — `BepInEx/scripts`, как кладёт `_harness/deploy_set.sh`, а не `plugins`, как пишет его `install`).

## 6. Traces

Вывод `-Verify` старой и новой версии — scratchpad сессии (`v-<пак>-<old|new>.txt`); стенд — `%TEMP%\kumm-fixture-*`.

## 7. Verdict

partial — гигиена и `-Verify` на реальном мире прошли; живой путь бага 14 (`kumm check` с Nexus) и `-Only` в установку Конана владельца не
прогнаны.
