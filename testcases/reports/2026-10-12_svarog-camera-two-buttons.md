# Test run report — камера: средняя кнопка и ЛКМ, сумка не крутит камеру (баг 36)

**Created:** 2026-10-12 08:37 +03:00 · **Run by:** агент (Claude Opus 5.5) ·
**Version/build:** KrinikCameraRework 1.6.0 (`dotnet build src/KrinikCameraRework -c Release`, сборка перед прогоном)

## 1. Work

Починка бага 36 (`bugs/36_…`): поворот камеры двумя кнопками — ЛКМ (`MouseButton 0`) и снова средняя (`MouseButton2 2`); нажатие над
окном интерфейса камеру не крутит. Набор случаев — `testcases/TC_svarog_camera_two_buttons_2026-10-12.md` (C1–C5).

## 2. Contour

Игра `D:\Games\Svarog's Dream` на машине владельца, DX11, 3840×2160, мод камеры положен в `BepInEx/plugins/KrinikCameraRework`.
Сейв владельца после его выхода 23:42 (копия `_backups/svarog-saves-2026-10-11_2342-owner-exit`, снята до прогона), время идёт.
REAL WORLD: accumulated — сейв и настройки владельца (`gameSettings`, конфиг мода с его значениями) — verified on the real world;
data and machine — его машина, его сейв — verified on the real world; path — мышь через Windows (`mouse_event`) той же дорогой ввода,
что рука владельца — verified on the real world; физической мышью не нажимал.

## 3. Runs

Один прогон, шаги по порядку.

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-12 08:34 +03:00 | `bash tools/run-game.sh` | 0 · мир за 15 с, журнал `Loading [Krinik Camera Rework 1.6.0]`, лучи 40/33 |
| 2 | 2026-10-12 08:35 +03:00 | `powershell -File tools/mouse.ps1 -X 1920 -Y 700 -Button drag-middle -DX 600` | 0 · угол 340° → 37° |
| 3 | 2026-10-12 08:35 +03:00 | `powershell -File tools/mouse.ps1 -X 1920 -Y 700 -Button drag-left -DX 600` | 0 · угол 37° → 94° |
| 4 | 2026-10-12 08:35 +03:00 | `powershell -File tools/mouse.ps1 -X 2579 -Y 1206 -Button drag-left -DX 600 -Steps 30` (сумка открыта, Tab) | 0 · предмет переехал, угол 94° → 94° |
| 5 | 2026-10-12 08:36 +03:00 | `bash tools/h.sh "cfg krinik.svarogsdream.camerarework Camera MouseButton2 -1"` + шаг 2 | 0 · угол 151° → 151° |
| 6 | 2026-10-12 08:36 +03:00 | `bash tools/h.sh "cfg krinik.svarogsdream.camerarework Camera MouseButton2 2"` + шаг 2 | 0 · угол 151° → 208° |
| 7 | 2026-10-12 08:36 +03:00 | `bash tools/h.sh kill`; `cmp` сейва с копией; `bash tools/reg-snap.sh restore` | 0 · сейв 7/7, реестр вернул |

Угол камеры после каждого шага — `bash tools/h.sh "callon Camera Transform get_eulerAngles"` (поле y).

## 4. Checks

Hygiene: сборка без ошибок (одно старое предупреждение CS0649 `_rayEveryFrame`)
Functional run: в игре на сейве владельца — протяжка средней и левой кнопкой по миру, протяжка предмета в открытой сумке, контроль с
выключенной второй кнопкой; прочитан угол камеры после каждого шага и кадры сумки до и после

| Case | Status | Observation |
|---|---|---|
| C1 | pass | средняя кнопка по миру: 340° → 37° (+57°) |
| C2 | pass | ЛКМ по миру: 37° → 94° (+57°) |
| C3 | pass | ЛКМ по топору в сумке: топор из ячейки 1 в ячейку 7, угол 94° → 94° |
| C4 | pass | вторая кнопка выключена: 151° → 151°; включена: 151° → 208° |
| C5 | pass | `kill`, сейв 7/7 против копии, реестр вернул |

## 5. Found

- none

## 6. Traces

`SvarogsDream/_harness/cb_mmb_after.webp`, `cb_lmb_after.webp`, `cb_inv_open.webp`, `cb_inv_after.webp`;
журнал `SvarogsDream/_harness/logs/2026-10-12_camera_two_buttons.log`.

## 7. Verdict

pass — обе кнопки крутят камеру по миру, перетаскивание в сумке камеру не крутит, контроль падает, когда вторая кнопка выключена.
Физической мышью владельца — не проверено.
