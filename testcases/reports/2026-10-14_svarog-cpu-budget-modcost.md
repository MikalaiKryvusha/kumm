# Test run report — Svarog's Dream: бюджет процессора модов (1 мс), броня 8+, плашки оружия, клипы прыжка

**Created:** 2026-10-14 11:56 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** SvarogsDream `e1fc544` … `2b3fd4e`
(пульт `modcost`, правки `SettingsLayout`, `AuthorBugs`, `Popups`, `KrinikCameraRework` трава, `NightParticles`, `Shared/ShaderNames`)

## 1. Work

Кейсы `testcases/TC_svarog_cpu_budget_jump_clips_2026-10-14.md`: B0–B9 (бюджет 1 мс — `[OWNER]` «Маши моды все вместе не должны кушать
больше 1 мс процессорного времени НИКОГДА ни при каких условиях» · 2026-10-14), Q8 (броня 8+, интервью #015 В1), S2 (плашки, В3), J1–J6
(клипы прыжка, В4). План — `plans/24_svarog_cpu_budget_1ms.md`.

## 2. Contour

Игра владельца `D:\Games\Svarog's Dream`, BepInEx, моды Krinik из SvarogsDream; сейв — точка
`_backups/svarog-saves-2026-10-14_0832-owner-before-camera-ground` (после каждого прогона — откат, 10 из 10 совпали); 1280×720 и 3840×2160
(разрешение менялось между запусками). REAL WORLD: accumulated — сейв владельца вечера 13.10 (верно на реальном мире); data and machine —
его машина и его игра (верно на реальном мире); path — тот же запуск игры и меню «Продолжить» (верно на реальном мире).

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-14 11:05 +03:00 | `bash tools/h.sh "modcost 6 12 burn"` | 0 · контроль виден; пик `LateUpdate` 1,99 мс |
| 2 | 2026-10-14 11:06 +03:00 | `bash tools/h.sh "modcost 10 10"` | 0 · худший кадр 2,644 мс |
| 3 | 2026-10-14 11:08 +03:00 | `bash tools/deploy-hot.sh KrinikUIRework` (дважды), журнал «late parts … max ms» | 0 · `settings` 1,42–1,84 → 0,001 мс |
| 4 | 2026-10-14 11:11 +03:00 | `bash tools/h.sh "active UI 0" "rec <файл> 2.6 120" "gwait 0.4" "callon Player/ModelSelector UnityEngine.Animator Play Anim_BowJumpShot_Fwd" "recwait" "active UI 1"` и такие же для J2–J5 до 11:15 | 0 · пять клипов; игру в 11:16:45 закрыл не агент |
| 5 | 2026-10-14 11:26 +03:00 | `bash tools/h.sh "call KrinikFixes.Quality8Bonus TestBonus 50" "cfg krinik.svarogsdream.fixes Fixes AuthorBugs false" …` | 0 · Q8 pass |
| 6 | 2026-10-14 11:26 +03:00 | `bash tools/h.sh "call UICharacterMessages ShowBluntLevelUpMessage 12" … "shot s2_plates"` | 0 · S2 pass |
| 7 | 2026-10-14 11:27 +03:00 | `bash tools/h.sh "modcost 10 8"`; `modcost 11 8` + `keys.ps1 -Key W -Ms 8000` | 0 · костёр 0,952 мс; бег 1,128 мс |
| 8 | 2026-10-14 11:30 +03:00 | три пересъёма J1 (`rec` …) до 11:32 | 0 · брак: ракурс отпущен, 4K — 41 кадр из 312 |
| 9 | 2026-10-14 11:39 +03:00 | `bash tools/h.sh "modcost 18 10 bg" … "click UI/Enablers/Inventory" … "modcostwait"` | 0 · окна 87,1 мс |
| 10 | 2026-10-14 11:40 +03:00 | `bash tools/h.sh "modcost 20 10 bg" "wait 6" "teleport innGradLocation" "modcostwait"` | 0 · перенос 111,6 мс |
| 11 | 2026-10-14 11:44 +03:00 | тот же перенос после правок травы; повторы 11:48, 11:50, 11:53 (частицы, список, имена шейдеров) | 0 · 29,1 / 24,8 / 24,3 / 26,4 мс |

## 4. Checks

Hygiene: `dotnet build` каждого мода — успешно; контроль замера `burn` (2,0 мс заданы → 2,023 измерено).
Functional run: игра владельца на его сейве, путь игрока (у костра, бег клавишей, окна кликом и клавишами, перенос героя); прочитаны
строки пульта `modcost`, журнал BepInEx («late parts», «update parts», «grass height», «fix q8»), кадры `shot` и листы кадров клипов.

| Case | Status | Observation |
|---|---|---|
| B0 | pass | `McBurn` 10 кадров по 2,023 мс |
| B1 | fail | 2,644 мс (поиск меню настроек) |
| B2 | fail | 1,128 мс (`IconHoverTick`) |
| B3 / B3b | fail | 27,8 (после горячей) / 87,1 мс (чистый) — `KrinikLetter` |
| B4 | fail | 111,6 мс — трава `detailPrototypes` |
| B5 | pass | `settings` 0,001 мс; костёр 0,952 мс |
| B6 | pass по замеру | трава 106,7 → 22,2 мс; вид травы глазом не проверен |
| B7 | partial → pass по B8 | частицы до 5,0 → 1,30 мс |
| B8 | pass | список по худшему кадру метода есть |
| B9 | pass, мало | листва 4,68 → 4,38 · крыши 4,18 → 3,91 · трава 2,67 → 1,96 · деревья 2,12 → 1,17 |
| Q8 | pass | q9 217, q10 225, q12 240; контроль q9 117 |
| S2 | pass | «12 Дробящий», «7 Режущий», «7 Магия», «9 Колющий» |
| J1 | partial | приземление за кадром |
| J2, J3, J5 | skipped | вне вопроса, убраны из папки |
| J4 | pass по кадру | вариант «Б»; владелец: «выглядит плохо» |

## 5. Found

- Поиск закрытого меню настроек раз в секунду — 1,4–1,8 мс (починено).
- Оформление окон `KrinikLetter` — 30–53 мс за проход (план 24).
- Высота травы после переноса — 106,7 мс (снижено до 22,2; путь в шейдер).
- Шесть копий переписи материалов памяти — 2–5 мс каждая (план 24).
- Пузырь реплики — 11–12 мс (план 24).
- Камера влетает в героя, когда точка взгляда ниже земли (кувырок пультом) — G14, отложен.
- Горячая выкладка: `PurseKickTick` ищет окно статов 10 раз по 55–65 мс (только при выкладках).

## 6. Traces

`SvarogsDream/_harness/out.txt` (строки пульта), `D:/Games/Svarog's Dream/BepInEx/LogOutput.log`, кадры `SvarogsDream/_harness/s2_plates.webp`,
`b6_after.webp`, клипы и листы `SvarogsDream/_harness/jump/`, папка отсмотра «14 Прыжок - клипы героя».

## 7. Verdict

partial — замер и контроль работают, броня и плашки — pass; бюджет 1 мс держится только у костра; окна и перенос героя — fail, путь в
плане 24.
