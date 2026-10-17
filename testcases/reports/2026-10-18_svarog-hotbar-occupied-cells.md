# Run report — панель быстрых действий: броски на занятую ячейку (2026-10-18)

**Work:** кейсы `testcases/TC_svarog_hotbar_occupied_cells_2026-10-18.md` Z1–Z5, ZK; основание — вопрос владельца `[OWNER]` «перекладывать
предмет на панель быстрых действий в уже занятую ячейку пробовал?» · 2026-10-18.

**Contour:** живая игра Svarog's Dream на машине владельца, 3840×2160; сейв владельца (точка `_backups/svarog-saves-2026-10-17_1936-owner-exit`):
навык на ячейке «1», ссылка на лук (вещь 408) на «2», на E — зелье снаряжения. KrinikUIRework — сборка в игре на 2026-10-18 (SvarogsDream `82ee721`).

**Runs:** один запуск 2026-10-18 00:25–00:27 +03:00.
- `LOCK_MINUTES=20 bash tools/run-game.sh` → `bash tools/h.sh "click UI/Enablers/Inventory"`
- настоящая мышь: `powershell -File tools/mouse.ps1 -X 2769 -Y 1206 -Button drag-left -DX -1325 -DY 877 -Steps 30` (Z1) и такие же броски для Z2–Z5
- после каждого броска — `cat …/krinik_hotbar_items.txt`, строки журнала `hotbar …`, кадр пульта `shot z1…z5`
- `bash tools/h.sh "kill"` → `SAVE_POINT=… bash tools/save-check.sh` (до отката) → `--restore` → `bash tools/reg-snap.sh restore`

**Checks:**
- Hygiene: — (код не менялся).
- Functional run: живая игра, настоящая мышь по ячейкам сумки и панели; прочитаны журнал, файл ссылок и кадры `z1_crop.webp`, `z24_crop.webp`.

| # | Status | Observation |
|---|---|---|
| Z1 | pass | вещь на ячейку со ссылкой: новая ссылка заменила старую молча (`1 408` → `1 280`), обе вещи в сумке |
| Z2 | pass | вещь на ячейку с навыком: отказ, навык на месте, вещь в сумке |
| Z3 | pass | ссылка на ссылку: поменялись местами |
| Z4 | pass | ссылка на навык: отказ, всё на местах |
| Z5 | pass | еда на Q со ссылкой: замена (вариант с едой — второго зелья нет) |
| ZK | pass | в сейве изменился только наш файл ссылок; данные игры не тронуты |

**Found:**
- Дефектов нет: поведение совпадает с кодом. Открыт вопрос вкуса к владельцу: заменять ли навык вещью (сейчас отказ) и заменять ли ссылку молча (сейчас да).

**Traces:** `SvarogsDream/_harness/z0.webp` … `z5.webp`, `z1_crop.webp`, `z24_crop.webp`; журнал `D:/Games/Svarog's Dream/BepInEx/LogOutput.log`, строки `hotbar bind / drop / move`.

**Verdict:** pass — все кейсы на живой игре; как должно быть на занятой ячейке, решает владелец.
