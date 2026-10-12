# Test run report — часы белым и ровными цифрами, нулевые статы светлее, миникарта светлее

**Created:** 2026-10-12 08:45 +03:00 · **Run by:** агент (Claude Opus 5.5) ·
**Version/build:** KrinikUIRework (рабочее дерево 2026-10-12: `WorldClock.cs`, `StatsLayout.cs`, новый `MiniMapLight.cs`, `Hud.cs`)

## 1. Work

Три замечания владельца из игры 2026-10-11 (STATUS п. 0 и 1а): часы белым и цифры без дёрганья, нули статов в сумке ярче и чуть серее
ненулевых, миникарта светлее. Набор случаев — `testcases/TC_svarog_hud_clock_stats_minimap_2026-10-12.md` (C1–C5, C4a).

## 2. Contour

Игра `D:\Games\Svarog's Dream` на машине владельца, DX11, 3840×2160; мод интерфейса — `BepInEx/scripts` (горячая перезагрузка
ScriptEngine). Сейв владельца (копия `_backups/svarog-saves-2026-10-11_2342-owner-exit`), время идёт. Конфиг владельца:
`WorldClockGold` 0.35 → 0, `MiniMapOpacity` = 1.
REAL WORLD: accumulated — его сейв и его конфиг мода — verified on the real world; data and machine — его машина — verified on the real
world; path — окна HUD и сумка (Tab), как открывает он — verified on the real world.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-12 08:41 +03:00 | `bash tools/run-game.sh` | 0 · мир, журнал `world clock: digit cell 52,2 px` |
| 2 | 2026-10-12 08:42 +03:00 | `bash tools/h.sh "dump \"UI/ActionBar/ActionBarMain/Action Bar/MiniMap\""` | 0 · ActualMap альфа 0.54, часы `#f2f2f2` |
| 3 | 2026-10-12 08:43 +03:00 | `bash tools/deploy-hot.sh KrinikUIRework` | 0 · RELOADED (attempt 1) |
| 4 | 2026-10-12 08:43 +03:00 | `bash tools/h.sh "cfg krinik.svarogsdream.uirework Hud MiniMapOpacity <0|0.7|0.85|1>" "wait 1" "shot hc_mm_<v>"` | 0 · четыре кадра |
| 5 | 2026-10-12 08:43 +03:00 | `bash tools/h.sh "dump \"…/CircleBorders/KrinikWorldClock\""` ×3 с паузой 3 с | 0 · ячейки на местах |
| 6 | 2026-10-12 08:44 +03:00 | `powershell -File tools/keys.ps1 -Key Tab -Ms 80`; `bash tools/h.sh "shot hc_stats"` | 0 · кадр статов |
| 7 | 2026-10-12 08:44 +03:00 | `bash tools/h.sh kill`; `cmp` сейва; `bash tools/reg-snap.sh restore` | 0 · сейв 7/7, реестр вернул |

## 4. Checks

Hygiene: сборка без ошибок
Functional run: в игре на сейве владельца — HUD с часами и миникартой при четырёх значениях яркости, дампы часов на трёх разных
минутах, сумка со статами; прочитаны дампы, кадры и цвета пикселей

| Case | Status | Observation |
|---|---|---|
| C1 | pass | дата и цифры `#f2f2f2`, без золота (дамп и кадры `hc_mm_*`) |
| C2 | pass | 18:55 → 18:59 → 19:03: C0 2951 · C1 3001 · C2 3051 · C3 3073 · C4 3123 во всех трёх дампах |
| C3 | pass | нуль: было (148, 145, 134), стало (220, 218, 217); ненулевое (255, 255, 255) |
| C4 | pass | причина темноты — ActualMap альфа 0.54 над фоном (0.09, 0.09, 0.10) |
| C4a | pass | 0.54 → 0.7 → 0.85 → 1 светлеет; маркер героя и значки поверх; за круг не выходит |
| C5 | pass | сейв 7/7, реестр вернул |

## 5. Found

- none

## 6. Traces

`SvarogsDream/gallery/game/2026-10-12_часы-статы-миникарта/` (лист миникарты, пара статов, README);
`SvarogsDream/_harness/hc_mm_*.webp`, `hc_stats.webp`; журнал `SvarogsDream/_harness/logs/2026-10-12_hud_clock_stats_minimap.log`.

## 7. Verdict

pass — все три замечания исполнены и видны на кадрах. Вкус (насколько светлее нули и миникарта) — глазом владельца.
