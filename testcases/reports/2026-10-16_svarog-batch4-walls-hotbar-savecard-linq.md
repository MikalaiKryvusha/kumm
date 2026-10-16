# Test run report — Svarog's Dream, пачка 4: стены для прыжка, панель быстрых действий, карточка сейва, LINQ мода цвета

**Created:** 2026-10-16 09:51 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** SvarogsDream `34ba448` → `05da363` (KrinikFixes),
`a61b62c` (KrinikColorRework, KrinikUIRework HudRow, Shared/CsvList), `42d7b46` (KrinikUIRework SaveCard)

## 1. Work

Кейсы `testcases/TC_svarog_jump_hidden_wall_2026-10-14.md` (баг 49: W0–W8) и `testcases/TC_svarog_batch4_linq_and_walls_2026-10-16.md`
(L1–L11, H1, S1, S2, P1, P2, W8). Основание: `bugs/49` (`[OWNER]` «и видимые и невидимые пролетает» · «через окно пропрыгивает» · 2026-10-16),
эпик 26 (правило 5: ноль выделений в кадре), STATUS п. 0(5) (панель быстрых действий), план 25 (мелочи пачкой).

## 2. Contour

Игра владельца `D:\Games\Svarog's Dream` (GOG 7.2.0), 4K на ТВ, сейв владельца с точки `_backups/svarog-saves-2026-10-16_0855-before-batch4`
(10 из 10), после каждого `kill` — откат сейва и реестра. Владелец сам играл в двух запусках (прыжки #2–#10 у стен) и подтвердил словами.
REAL WORLD: accumulated — сейв владельца, его настройки игры (вторая панель ячеек включена) и клавиши (D — его привязка); data and machine —
его машина и игра; path — прыжок с W у стен домов в Граде, смена оружия, «Загрузить игру» из главного меню: verified on the real world.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-16 08:56 +03:00 | `bash tools/run-game.sh` + `bash tools/h.sh "teleport -489.3,90,1433.6"` + W/пробел | баг 49 воспроизведён: прыжок за стену трактира |
| 2 | 2026-10-16 09:01 +03:00 | `bash tools/run-game.sh` (KrinikFixes `PhantomWall` v1) + прыжки владельца и `bash _harness/wjump.sh -489.3,90,1433.6 W w7_after` | стены держат; стена с окном — нет (слово владельца) |
| 3 | 2026-10-16 09:14 +03:00 | `bash tools/run-game.sh` (KrinikFixes v2, KrinikColorRework без LINQ) + `h.sh "modcost 10 14 bg" "teleport innGradLocation" "wait 8" "modcostwait"` | L1–L3 pass, W8 pass (владелец), L6 числа |
| 4 | 2026-10-16 09:29 +03:00 | `bash tools/deploy-hot.sh KrinikUIRework` + `h.sh "callon Player PlayerEquipment SwapWeapons"` ×2 | H1 pass |
| 5 | 2026-10-16 09:45 +03:00 | ручной запуск до меню, `tools/mouse.ps1` по «Загрузить игру» и сейву, `bash tools/deploy-hot.sh KrinikUIRework` (SaveCard v5) | S2 pass |
| 6 | 2026-10-16 09:48 +03:00 | «Продолжить» + `h.sh "modcost 10 14 bg" "teleport innBaraLocation" …` и `… "teleport innGradLocation" …` | L7 fail — правка TerrainWatch выигрыша не дала, откатана |
| 7 | 2026-10-16 09:54 +03:00 | `bash tools/run-game.sh` (пульт `88c1604`) + `h.sh "active UI/ActionBar/ActionBarMain" "dump UI/ActionBar/ActionBarMain/Action~Bar/Main~Slot~Groups"` | P1, P2 pass |
| 8 | 2026-10-16 09:58 +03:00 | `bash tools/run-game.sh` (RoofFog по кадрам), через 50 с `h.sh "modcost 10 14 bg" "teleport innGradLocation" "wait 8" "modcostwait"` | L8 partial: 1,41 → 0,87 мс |
| 9 | 2026-10-16 10:01 +03:00 | то же (NightParticles по кадрам) | L9 pass: 1,61 → 0,95 мс |
| 10 | 2026-10-16 10:04 +03:00 | то же (FoliageCoverage по кадрам) | L10 pass: 1,47 → 0,88 мс |
| 11 | 2026-10-16 10:08 +03:00 | то же (GrassCoverage по кадрам) | L11 pass: 1,22 → 0,68 мс; RoofFog 3,84 — перебор памяти снимка |

## 4. Checks

Hygiene: `dotnet build -c Release` трёх модов — 0 ошибок; `node tools/refactor_inventory.mjs` — LINQ в кадре 26 → 0, поиски в кадре 7 (разовые).
Functional run: игра владельца, путь игрока — прыжки в стены, смена оружия, карточка сейва мышью; прочитаны журнал `LogOutput.log`, кадры
пульта `shot` (4K), замеры `modcost`.

| Case | Status | Observation |
|---|---|---|
| баг 49 W1, W7 до правки | fail (воспроизведено) | jump #1 08:58: касание −491,4/1441,9 снаружи трактира |
| W1, W2, W4, W7 после правки | pass | `hit phantom wall` у каждого прыжка в стену; `[OWNER]` «да, сработала» |
| W8 стена с окном (v2: колено, земля за краем) | pass | jump #1–#10 владельца — все `hit phantom wall`; `[OWNER]` «да, я проверил окно» · «работает» |
| W3 дверь, W5 контроль | not run | — |
| L1–L3 мод цвета после чистки LINQ | pass | строки журнала те же, что в базе 09:01; дымка вернулась сама после пересоздания материалов |
| L4 вода у Бары | pass (журнал) | маска `256 (Ground)` та же; HUD на кадре скрыт клавишей D |
| L5 карта | partial | `map palette: 2 map images` при загрузке, окно карты не открывалось |
| L6, L7 цена переноса | partial / fail | переписи на смене участка 0,8–1,6 мс каждая, правка общего снимка не помогла |
| H1 панель после смены оружия | fail → pass | запасная панель игры стояла двумя сетками; после правки — один ряд |
| S1 «Загрузить?» | blocked | в меню по Esc пункта нет; вопрос только после «Загрузить файл» |
| S2 карточка сейва | fail → pass (v5) | колонка за самой длинной подписью, «14.10.2026 16:00» |
| P1, P2 пульт | pass | `active` без второго аргумента читает; путь с «~» вместо пробела открылся (`dump 10208 chars`) |
| L8 RoofFog по кадрам | partial | 1,41 → 0,87 мс; цель 0,4 не достигнута (первый кусок платит перебор памяти снимка) |
| L9 NightParticles по кадрам | pass | 1,61 → 0,95 мс; `+127 materials` при загрузке, как до правки |
| L10 FoliageCoverage по кадрам | pass | 1,47 → 0,88 мс; `+246 leaf materials`, кадр `l10_town` — листва на месте |
| L11 GrassCoverage по кадрам | pass | 1,22 → 0,68 мс; после пересоздания травы игрой — снова 50 из 50 |

## 5. Found

- Прыжок проходит сквозь стены домов: у стен нет коллайдеров вовсе (баг 49) — починено.
- Проверка «твёрдое у края» на высоте груди ловила раму окна и факел — починено (колено).
- Ряд быстрых действий не знал запасную панель игры (`SecondarySkillSlots`, смена оружия) — починено (`HudRow.cs`).
- Карточка сейва: «Персона11жа», «персонажа:Ядран», «14.10.2026:16:00» — починено (`SaveCard.cs`).
- Карточка сейва: имя файла `saveFile-0` — машинное; вопрос владельцу.
- Переписи материалов на смене участка — каждая 0,8–1,6 мс (выше бюджета 1 мс). Проход по кадрам сделан у RoofFog, NightParticles,
  FoliageCoverage, GrassCoverage (каждая теперь 0,66–0,98 мс); остались MatteTerrain 1,9–2,5 и BillboardFog ≈1,0–1,2.
- Сам перебор памяти снимка (`FindObjectsOfTypeAll<Material>`) — до 3,84 мс кадра у компонента, спросившего первым (L11): кусками не режется.
- Первый прыжок после запуска — худший кадр полёта 1,585–1,662 мс (F15, выше бюджета); причина не найдена.
- Пульт: `active` без второго аргумента падает `IndexOutOfRangeException`; `dump`/`fieldon` не берут путь с пробелами.

## 6. Traces

Кадры — `SvarogsDream/_harness/`: `w1_visible_wall`, `w7_after`, `owner_window_wall`, `l2_town`, `l4_water`, `hud_after_d`, `hud_fix1`,
`swap_pair`, `s1_dialog`, `s2_card5_crop`; база журнала — `_harness/logs/2026-10-16_0901_before-linq.log`; журнал прогона —
`D:\Games\Svarog's Dream\BepInEx\LogOutput.log` (строки `jump`, `hud row`, `save card`, `modcost`).

## 7. Verdict

partial — баг 49, панель быстрых действий, карточка сейва и пульт проверены в игре владельца (pass); W3, W5 не прогнаны, L5 — partial;
на переносе между участками четыре переписи стали дешевле 1 мс (L8–L11), но MatteTerrain (1,9–2,5), BillboardFog (≈1,0–1,2) и сам
перебор памяти снимка (до 3,84 мс у первого спросившего) — ещё выше бюджета; правка TerrainWatch (L7) выигрыша не дала и откатана.
