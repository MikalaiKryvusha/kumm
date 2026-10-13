# Test run report — Svarog's Dream: свет суток в 3:00 (LightCycle) и подписи ячеек

**Created:** 2026-10-13 18:07 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** `KrinikColorRework` с `LightCycle.cs`
(сборки 17:45, 17:48, 17:57), `KrinikUIRework` горячая выкладка 17:50

## 1. Work

Замечания владельца вечера 2026-10-13 — лист `testcases/TC_svarog_owner_remarks_2026-10-13_evening.md`: E2 (вода вспыхивает в 3:00),
E8 (переход ночь → рассвет плавно), E11 (подписи клавиш ячеек ниже, мельче, в угол). Новый `LightCycle.cs` заменил `SunJump.cs`: яркость
и угол света по таблицам игры плавно внутри часа, переброс света с запада на восток в 3:00 при погашенном свете.

## 2. Contour

Игра `D:\Games\Svarog's Dream`, BepInEx, сейв владельца (точка `_backups/svarog-saves-2026-10-13_1720-owner-played`, «Железный человек»),
лето, день 8–10, экран 1280×720 (удалённый стол владельца), бессмертие героя пультом (`static WorldState isGodMode True`) на ночь в лесу.
REAL WORLD: накоплено — сейв владельца и его настройки; данные и машина — его ПК; путь — запуск игры как у него, `run-game.sh`.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-13 17:46 +03:00 | `bash tools/run-game.sh` | 0 · мир в 3:00, журнал `light: flipped … x0,00`, строка `flipped` повторялась каждый кадр |
| 2 | 2026-10-13 17:49 +03:00 | `bash tools/run-game.sh`; захват `ffmpeg -f lavfi -i "ddagrab=output_idx=0:framerate=2" -t 85 -vf "hwdownload,format=bgra,scale=960:-1" -q:v 3 _harness/lightcap/dawn1/f%04d.jpg` с 17:51:20; `python -I tools/light_lum.py _harness/lightcap/dawn1` | 0 · 170 кадров, скачок +57 % в 3:00 |
| 2a | 2026-10-13 17:50 +03:00 | `bash tools/deploy-hot.sh KrinikUIRework`; `h.sh "cfg krinik.svarogsdream.uirework Hud HotkeySize 1.8" "shot e11_after"` | 0 · RELOADED, кадр |
| 2b | 2026-10-13 17:54–17:56 +03:00 | `h.sh "cfg … Sky Haze false" … "cfg … Water Reflections false" … "callon Lighting Light set_enabled False"` с кадрами `v0–v5`, `u0–u1` | 0 · опыты над рыжей водой |
| 3 | 2026-10-13 17:58 +03:00 | `bash tools/run-game.sh`; захват с 17:59:08, 90 с, `_harness/lightcap/dawn2`; `python -I tools/light_lum.py _harness/lightcap/dawn2 2.6328` | 0 · 180 кадров; игру закрыл владелец ≈18:00 |

## 4. Checks

Hygiene: `dotnet build` обоих модов — без ошибок и предупреждений в изменённых файлах.
Functional run: игра владельца, его сейв, кадры экрана прочитаны глазом и скриптом яркости; журнал BepInEx прочитан.

| Case | Status | Observation |
|---|---|---|
| E2 | pass (прогон 3) | 2:52–3:05 яркость 11,53–11,56, шаги ≤ 0,15 %; до правки 16,1 → 25,2 (+57 %) |
| E8 | partial | скачка в 3:00 нет; рассвет 3:05–3:35 растёт ровно, шаги до 2,4–3,2 % за 0,5 с (порог 2 %); после 3:48 камеру водил владелец |
| E11 | pass на 720p | кадры `e11_before/after`, лист `e11_zoom.webp`: цифры в углу, до рамки ≈1 точка; 1080p/2K/4K не сняты |

## 5. Found

- Строка `flipped` в журнале каждый кадр: Unity читает угол (180, 0, 0) как (0, 180, 180) — починено сравнением со своим прошлым углом (прогон 2).
- Множитель гашения не действовал: `PatchLight` (`Plugin.cs`) на том же `SetDayNightSceneLighting` ставит яркость через «=» после него —
  починено `HarmonyPriority(Priority.Last)` (прогон 3).
- Владелец после прогона 3 (его слово): в 3:30 на небе ещё луна, а вода уже отражает рассветное солнце, которое на небе встаёт только
  к 4:30; свет над героем не должен отражаться в воде; ночное небо должно растаять к восходу; всё — по длине дня поры года. Кейсы E10,
  E12–E14; правка (свет за диском неба `Sky.SunUp`, слои воды из маски фонаря, `Sky.SeasonHour`) собрана, в игре не прогнана.

## 6. Traces

`SvarogsDream/_harness/lightcap/dawn1/` (`lum.tsv`, `jump_14_16.webp`), `SvarogsDream/_harness/lightcap/dawn2/` (`lum.tsv`, `flicker.webp`),
`SvarogsDream/_harness/v_sheet.webp`, `u_sheet.webp`, `w_sheet.webp`, `e11_zoom.webp`; журнал `D:\Games\Svarog's Dream\BepInEx\LogOutput.log`
(перезаписан следующим запуском). Сейв после выхода владельца — `_backups/svarog-saves-2026-10-13_1801-owner-exit-after-dawn-test`.

## 7. Verdict

partial — вспышка в 3:00 снята (E2 pass), но рассветный свет обгоняет солнце на небе (замечание владельца → E12), правка не прогнана.
