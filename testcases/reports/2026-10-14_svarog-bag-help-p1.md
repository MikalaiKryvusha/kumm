# Test run report — Svarog's Dream: справки «?» сумки целиком, без синей полосы над сумкой

**Created:** 2026-10-14 09:39 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** SvarogsDream, мод `KrinikUIRework`
(горячая выкладка 09:37: `InventoryHelp.cs` — перемер высот следующими кадрами, `HeroCard.cs` — картинка `EquipmentScreen/Popup` гаснет)

## 1. Work

Две правки по слову владельца 2026-10-14: `[OWNER]` «обе ? обрезаны, и супки и статов»; о синей полосе — «это вроде как авторская
задовка, но я с тобой согласен. что она нахуй не нужна». Кейсы — `testcases/TC_svarog_bag_help_p1_2026-10-14.md` (Q1–Q3, P1).

## 2. Contour

Игра Svarog's Dream, 4K во весь экран и 720p, сейв — точка `_backups/svarog-saves-2026-10-14_0859-after-owner-repro`, сумка открыта пультом.
`REAL WORLD:` accumulated — конфиги и сейв владельца; data and machine — его машина; path — справки открываются наведением на «?» в сумке.
Проверено на реальной установке с его сейвом; наведение — событием пульта (`hover`), не настоящей мышью.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-14 09:34 +03:00 | `bash tools/h.sh "hover …/KrinikQ_Items" "shot q1_items" … "hover …/Stats/Tip" "shot q1_stats"` | 0 · контроль: обе справки обрезаны |
| 2 | 2026-10-14 09:37 +03:00 | `bash tools/deploy-hot.sh KrinikUIRework`, `bash tools/h.sh "perf 4"` | 0 · RELOADED, 70,7 к/с |
| 3 | 2026-10-14 09:37 +03:00 | те же наведения, `shot q2_items`, `shot q2_stats` | 0 · обе целиком |
| 4 | 2026-10-14 09:38 +03:00 | `bash tools/h.sh "callon …/Popup UnityEngine.UI.Image get_enabled" "click UI/Enablers/Inventory" ×2 …` | 0 · False, fill 0,715 |
| 5 | 2026-10-14 09:38 +03:00 | `bash tools/h.sh "call UnityEngine.Screen SetResolution 1280 720 ExclusiveFullScreen" … "shot q3_items" "shot q3_stats" … "SetResolution 3840 2160 FullScreenWindow"` | 0 · обе целиком на 720p |
| 6 | 2026-10-14 09:44 +03:00 | D1: `bash tools/deploy-hot.sh KrinikUIRework`, `bash tools/h.sh "click UI/Enablers/Inventory" "shot d1_open" "perf 4"`, `prof 3` | 0 · главный поток 25 мс — fail (как выяснилось в 8 — следы горячих выкладок) |
| 7 | 2026-10-14 09:46 +03:00 | D1: правка «место полос — только при сдвиге ряда», та же выкладка и `perf 4` ×2 | 0 · 24–25 мс, проверка покоя красная |
| 8 | 2026-10-14 09:48 +03:00 | D1: чистый запуск `bash tools/run-game.sh`, `bash tools/h.sh "perf 4" "click UI/Enablers/Inventory" "perf 4" "perf 4" "shot d1_open3" … "shot d1_closed3"` | 0 · 90–96 к/с; ряд 24,7 / 25,1, мир 5,3 / 11,1 |
| 9 | 2026-10-14 09:53 +03:00 | M1: `bash tools/deploy-hot.sh KrinikUIRework`, `bash tools/h.sh "comps EnemyHealthBar 30"`, затем `"findall HealthBar"` | 0 · врагов нет, 197 полос выключены — blocked |
| 10 | 2026-10-14 09:58 +03:00 | S1 контроль: `bash tools/h.sh "callon UI/ActionBar/ActionBarMain/Action+Bar/CharacterMessages UICharacterMessages ShowAlchemyLevelUpMessage 9" "shot s1_ctrl_c"` | 0 · «9» без слова |
| 11 | 2026-10-14 10:00 +03:00 | S1: выкладка (одна строка, шрифт HUD), тот же вызов, `get_font`, `get_text` | 0 · шрифт Manrope-ExtraBold, текст «9» — fail |
| 12 | 2026-10-14 10:02 +03:00 | S1: выкладка (имена по глоссарию), Alchemy 9 · Agility 22 · Strength 15, `get_text`, `shot s1_after2`, `perf 4` | 0 · «9 Алхимия», «22 Ловкость», «15 Сила»; 79,6 к/с |
| 13 | 2026-10-14 10:08 +03:00 | Q4: `SetResolution 1920 1080` и `2560 1440 ExclusiveFullScreen`, наведения, `shot q4_*` | 0 · обе справки целиком |

## 4. Checks

Hygiene: `dotnet build src/KrinikUIRework -c Release` — без ошибок.
Functional run: сумка в игре, обе справки открыты наведением, кадры прочитаны глазом; состояние картинки полосы — ответом пульта.

- Мир при замере: часы идут (`timescale` не трогал).
- Q1 — pass (дефект виден до правки), Q2 — pass (4K), Q3 — pass (720p), P1 — pass по состоянию картинки и кадру; контрольного кадра полосы
  «до» нет (на паузе сумки она свёрнута).
- Q4 — pass (1080p, 2K). D1 — pass на чистом запуске (прогоны 6–7 — fail от следов горячих выкладок, EXP-0258): панель при сумке не
  темнеет, мир темнеет, шва нет. S1 — partial: текст целиком и шрифт HUD, фон-мазок автора не под текстом. M1 — blocked (нет врагов в бою).

## 5. Found

- Причина обреза — русификатор подменяет шрифт TMP после смены текста (EXP-0224), высота мерилась до подмены.
- Наведение — событием пульта: настоящей мышью справки не открывал.

## 6. Traces

`SvarogsDream/_harness/q1_items.webp`, `q1_stats.webp`, `q2_items.webp`, `q2_stats.webp`, `q3_items.webp`, `q3_stats.webp`, `p1_after.webp`;
журнал `LogOutput.log` (строки `inventory help:`); ответы пульта `_harness/out.txt`.

## 7. Verdict

partial — справки «?» целиком на 720p, 1080p, 2K, 4K (pass), синей полосы нет (pass), панель при сумке не темнеет (pass); плашки навыков —
текст целиком, фон не подогнан (partial); полосы врагов вдали — не проверены, врагов не было (blocked).
