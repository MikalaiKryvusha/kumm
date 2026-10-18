# Test run report — Svarog's Dream, ночь 2026-10-18, пачка 1 (план 31: ряд, кнопка наборов, баг 54, карточка, стопка сообщений, урон, дымка воды)

**Created:** 2026-10-18 03:02 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** SvarogsDream `8dd82b4` + несданные правки
(`MessageStack.cs`, `AuthorBugs.cs` правка 5, плашка пульта) — коммит этого отчёта

## 1. Work

План 31, пункты 2 (кнопка смены наборов), 7 и 7б (сообщения и отказы — стопкой над рядом), 9 (плашка бессмертия пульта), 10 (Q и E в конце ряда),
13 (карточка 0,9), 14 (полоса баффов от края карточки), 15 (баг 54 — красная панель), 17 («Суммарный Урон»), 6 (дымка над водой — замер). Кейсы —
`testcases/TC_svarog_night_batch1_2026-10-18.md` (R1–R6b, G1–G1b, M1–M7, H1–H2, B54-1, D1r, C1–C2); основа — интервью #022, #023 и слова владельца
в запуске агента 02:28–02:41 (цитаты — в плане 31).

## 2. Contour

Игра владельца `D:\Games\Svarog's Dream` (BepInEx 5.4.23.5), 4K 3840×2160, экран владельца в его отсутствие — по его слову «комп твой» · «я спать».
Сейв — копия `_backups/svarog-saves-2026-10-17_1936-owner-exit` (интервью #022, Q5: сейвы в распоряжении агента); живой сейв до работы сохранён в
`_backups/svarog-saves-2026-10-18_0225-live-before-night-agent`. Первый запуск 02:25–02:50 — с тремя горячими выкладками мода интерфейса (владелец
играл в нём 02:27–02:41); второй 02:51–03:02 — чистый, моды холодно. REAL WORLD: accumulated — настройки модов владельца в `BepInEx/config` (в них
записано `[HeroCard] Scale = 0.9`) — verified on the real world; data and machine — его игра и сейв-копия, его машина — verified with real state;
path — HUD и сумка в мире, как у игрока — verified on the real world.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-18 02:25 +03:00 | `LOCK_MINUTES=40 bash tools/run-game.sh` | 0 · мир за 41 с, лучи мыши сверены |
| 2 | 2026-10-18 02:30 +03:00 | `bash tools/deploy-hot.sh KrinikUIRework` (×2, второй 02:34) | 0 · RELOADED, проверка покоя 11–13 ui/кадр |
| 3 | 2026-10-18 02:39 +03:00 | `bash tools/h.sh "click UI/ActionBar/ActionBarMain/Action~Bar/Main~Slot~Groups/KrinikSwapButton" …` | 0 · смены наборов, наведение — лист `_harness/s_sheet.webp` |
| 4 | 2026-10-18 02:51 +03:00 | `LOCK_MINUTES=60 bash tools/run-game.sh` (после `deploy-cold.sh KrinikUIRework KrinikFixes KrinikDevHarness`) | 0 · чистый запуск |
| 5 | 2026-10-18 02:52 +03:00 | `bash tools/rec_clip.sh b54ctl 10 …` · `bash tools/rec_clip.sh b54v2 16 …` | 0 · клипы `_harness/demo21/clips/b54ctl.mkv`, `b54v2.mkv` |
| 6 | 2026-10-18 02:55 +03:00 | `bash tools/rec_clip.sh m4 9 "callon UI/ActionBar/InfoMessages GameUI.UIInfoMessages ShowNewCustomMessage …" …` | 0 · клип `m4.mkv` |
| 7 | 2026-10-18 02:56 +03:00 | `bash tools/h.sh "static WorldState isGodMode True" …`, `cfg … AuthorBugs false/true`, `cfg … SwapButton`, `cfg … MessageStack`; `deploy-hot.sh KrinikUIRework` (02:58) | 0 · кадры `g_sheet2`, `rm_sheet`, дамп урона |
| 8 | 2026-10-18 03:00 +03:00 | `bash tools/h.sh "teleport -737.6,96.3,1863.0" … "cfg krinik.svarogsdream.colorrework Sky HazeDensity 0.5/3/1.2"` | 0 · лист `h_sheet.webp` |
| 9 | 2026-10-18 03:02 +03:00 | `bash tools/h.sh "static WorldState isGodMode False"` · `h.sh kill` · `reg-snap.sh restore` · `hdr.ps1 on` | 0 · игра закрыта, замок снят |

## 4. Checks

- Hygiene: `dotnet build` KrinikUIRework, KrinikFixes, KrinikDevHarness — Build succeeded (02:22–02:58); `deploy-cold.sh` — md5 сверены.
- Functional run: HUD, сумка и мир в игре владельца, пультом и записью экрана; прочитаны кадры, листы клипов, дамп интерфейса и журнал BepInEx.

| Case | Status | What was read |
|---|---|---|
| R1 ряд 1–0 F G Q E ⇅ | pass | кадр `r1b_row.webp` |
| R2/R3 смена наборов кнопкой | pass | журнал `second set True/False`, лист `s_sheet.webp` |
| R4 подпись «Сменить оружие и набор [X]» | pass | лист `s_sheet.webp` (s3/s4) |
| R5 выключатель кнопки | pass | `rm_sheet.webp` |
| R6 вид кнопки | fail → R6b pass | `r2_crop.webp` (мельче, серая) → дамп `[1715,14 130x130]`, поле `Well` |
| G1 плашка бессмертия | fail → G1b pass | `g_sheet.webp` (нет) → `g_sheet2.webp` (есть / нет) |
| M1/M3 разведка сообщений и полос каста | pass | дамп `InfoMessages`, `findall Cast` |
| M4/M5 стопка над рядом, полоса маны | pass с находкой | клип `m4.mkv`, `rm_sheet` m6a/m6b |
| M7 только видимые строки в стопке | pass | журнал `live 1` |
| B54-1 красная панель | not tested — условие гипотезы не создано (второй набор пуст; суд, п. 2) | клипы `b54ctl`, `b54v2` |
| D1r «Суммарный Урон» | pass | дамп 245,455; контроль 157,94 |
| C1 карточка 0,9 / C2 полоса от края | pass | дамп `[40,36 1035x495]`, значок x 42 |
| H1/H2 дымка воды | partial — у мелкой реки видно дно (суд, п. 8) | `RenderSettings`, лист `h_sheet.webp` |

## 5. Found

1. Кнопка ⇅ была на треть мельче и светлее ячеек (размер видимой коробки вместо рамки; нет тёмного поля «Cooldown») — исправлено, R6b.
2. Плашка бессмертия не показывалась во время пачки команд пульта (проверка после выхода по `_busy`) — исправлено, G1b.
3. Стопка сообщений подхватывала выключенные копии: игра погасшие строки не уничтожает (29 строк за сессию) — исправлено, M7.
4. Квадраты вместо кириллицы в статах сумки после горячих выкладок (кадр владельца) — след выгрузки старой копии, дописан в баг 45.
5. «Суммарный Урон»: у автора крит выше 100 % не ограничен, у лука и мага неверная частота ударов — исправлено, D1r.
6. Красная панель владельца при первой смене наборов — в трёх вариантах условие гипотезы не создано (второй набор пуст), это «не проверено»; правка «устаревшей перезарядки» стоит по коду (баг 54).
7. Суд (`scratchpad/judge1/judge1.md`): выключатель `Hud/StaleCooldownFix` оставлен выключенным после контроля — включён 03:18; бессмертие жило между пачками — механизм в `h.sh`; метки `[TESTED]` 4bb19d6 сужены до увиденного.

## 6. Traces

`SvarogsDream/_harness/`: `r1b_row.webp`, `r2_crop.webp`, `s_sheet.webp`, `g_sheet.webp`, `g_sheet2.webp`, `rm_sheet.webp`, `m3_sheet.webp`, `h_sheet.webp`,
`f_sheet.webp`; клипы и листы — `_harness/demo21/clips/b54ctl.*`, `b54v2.*`, `m4.*`; журнал — `D:\Games\Svarog's Dream\BepInEx\LogOutput.log` (02:25–03:02).

## 7. Verdict

partial — новое (ряд, кнопка, плашка, стопка, урон, карточка, полоса) прошло в игре; баг 54 у владельца не воспроизведён (правка по коду, ждёт его
слова), бумага стопки видна (днём — пачка 2, M8); кейсы P6–P16 и W2 прошлой ночи — не прогнаны в этой пачке (P6 — частично: журнал
`hotbar items: hero 'Tamara', 1 links from krinik_hotbar_items.txt`).
