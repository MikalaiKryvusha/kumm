# Test run report — Svarog's Dream: отражение экраном (SSPR) на нескольких прудах и без переворота, хвосты карточки героя

**Created:** 2026-10-13 01:46 +03:00 (написан после прогонов, по журналу пульта и коммитам — задним числом, на закрытии чата) · **Run by:** агент
(Claude Opus 5.5) · **Version/build:** SvarogsDream `707cf84` (SSPR: все видимые плоскости, без переворота «под D3D»), `5805d82` (пульт: плюс вместо
пробела), KrinikUIRework сборки 2026-10-12 23:31

## 1. Work

Отражение экраном — `[OWNER]` «да, нужно без нагрузки на процессор, и предметы отражать - только те, что рядом» · 2026-10-12; хвосты Ф1
карточки героя — `ideas/15`. Кейсы — `testcases/TC_svarog_hero_card_2026-10-12.md` C10, C15, C24, C27, C29, C48–C51.

## 2. Contour

Игра Svarog's Dream владельца, BepInEx + наши моды, сейв владельца (копии `_backups/svarog-saves-2026-10-12_2336-quit`, `…_2343-quit`,
`…_2353-quit`, `…-2026-10-13_0001-quit`), 4K полный экран; пульт `SvarogsDream/tools/h.sh`. После каждого выхода — `h.sh quit` (сейв
записан игрой), копия сейвов, `reg-snap.sh restore`.
REAL WORLD: accumulated — сейв владельца после его игры, его конфиг модов (`Water.ScreenReflection = true`); data and machine — его машина,
OBS владельца шёл весь прогон (не трогался); path — тот же запуск, что у владельца (`run-game.sh`, «Продолжить»).

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-12 23:39 +03:00 | `run-game.sh` (сборка в `plugins/KrinikColorRework/`) | журнал «sspr: buffers 1920x1080 ARGB32», «sspr: attached» |
| 2 | 2026-10-12 23:40 +03:00 | `h.sh "DemoOrbit 45 2.5 12 12" "shot mq" "camrt Reflection"` | две текстуры отражения (`_WaterPlane`, `_WaterPlane (1)`) с отражённым лесом |
| 3 | 2026-10-12 23:42 +03:00 | `cfg … Water ScreenReflection false/true` + `camrt WaterPlaneReflection` (лист `mr_sheet`) | у Lux скалы в строках ~110–210, у экранного лес в 0–170 — сдвиг (C51 fail) |
| 4 | 2026-10-12 23:43–23:45 +03:00 | Unity batch `KrinikBuild.Bundles` (переворот убран); `quit`; `run-game.sh`; то же `camrt` выкл/вкл (лист `ms_bright`) | лес под горизонтом в строках ~120–260 |
| 5 | 2026-10-12 23:54 +03:00 | `run-game.sh` (пульт `5805d82`); `active UI/ActionBar/ActionBarMain/Action+Bar/Main+Slot+Groups 0/1` + `shot c10a/b/c` | карточка ушла и вернулась (C10) |
| 6 | 2026-10-12 23:55 +03:00 | `hover/unhover UI/ActionBar/KrinikHeroCard/Bar+…` × 5 + `shot tp_*` | окна всех шкал (C24) |
| 7 | 2026-10-12 23:56 +03:00 | `click …/PortraitMask/Portrait` × 2 + `shot c15a/b` | сумка открылась и закрылась, журнал «portrait click -> bag» (C15) |
| 8 | 2026-10-12 23:57 +03:00 | `DemoOrbit 45 8 12 12` + `shot md1…md4` (день 10:42–10:48) | гора и деревья в прудах на местах (C49, C51) |

## 4. Checks

Hygiene: `dotnet build` KrinikColorRework, KrinikDevHarness — без ошибок; пакет шейдеров — «ok compute KrinikSSPR».
Functional run: игра владельца, кадры 4K изнутри движка, текстуры отражения `camrt`, журнал BepInEx — прочитаны глазом агента.

- C10 partial — карточка идёт за панелью умений; настоящим путём игры (кнопка «Оружие в руки / убрать») не прогнан.
- C15 pass · C24 pass · C27 pass (кадры mu1 ночь 00:56 игры, md1 день 10:42) · C29 pass (вырезка `c29_crop`; с кадром «до» не сравнивал).
- C49 pass, C51 pass — днём после правки переворота (лист `md_water`). C48 — замеры прежние, картинка тех замеров была с переворотом.
- C50 partial — обе плоскости получают отражение; цена видеокарты с несколькими прудами не мерена.

## 5. Found

- Переворот «под D3D» в compute-шейдере сдвигал отражение вверх: текстуры отрисовки Unity на D3D лежат строкой 0 внизу (EXP-0234).
- Dll, положенная в корень `plugins/`, грузится без пакета шейдеров рядом — журнал «KrinikSSPR not in the bundle».
- Пульт не брал пути с пробелами — научен плюсу.

## 6. Traces

- Кадры: `SvarogsDream/_harness/mq.webp`, `mr_sheet.webp`, `ms_bright.webp`, `md_sheet.webp`, `md_water.webp`, `c10_sheet.webp`, `c10_right.webp`,
  `tp_sheet.webp`, `tp_x_crop.webp`, `c15_sheet.webp`, `c27_sheet.webp`, `c29_crop.webp`.
- Отражение днём владельцу — `SvarogsDream/НА ОТСМОТР НИКОЛАЕМ/8 Вода - отражение экраном/`.

## 7. Verdict

partial — SSPR на всех видимых прудах и без переворота проверен днём кадром и текстурой; C15, C24, C27, C29 — pass; C10 и C50 — partial.
Не проверено: ночь и закат для SSPR, цена видеокарты с несколькими прудами, C10 настоящей кнопкой игры. Глаз владельца — ждёт.
