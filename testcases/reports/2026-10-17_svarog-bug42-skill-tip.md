# Test run report — Svarog's Dream, баг 42: заголовок подсказки навыка при переходе между навыками

**Created:** 2026-10-17 03:52 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** SvarogsDream `8dc053d` (правка бага — `1050849`)

## 1. Work

Проверка в игре правки бага 42 (`bugs/42_DONE_svarog_skill_tip_title_white_then_red.md`): заголовок подсказки навыка в «Мастерстве» после
перехода с навыка на навык не должен ≈0,5 с быть белым. Кейсы — `testcases/TC_svarog_bug42_skill_tip_2026-10-17.md` (N1–N3); прежние K1/K2
(`testcases/TC_svarog_batch3_smallbugs_2026-10-15.md`) были blocked — путь подсказки не адресуется до первого наведения.

## 2. Contour

Игра владельца (4K, DX11), сейв владельца, точка сверки `_backups/svarog-saves-2026-10-17_0149-before-cam-run`; чистый запуск.
REAL WORLD: накоплено — сейв владельца и его настройки модов; данные и машина — его; путь — окно персонажа → «Мастерство» → наведение
настоящим курсором системы, как у игрока. Сейв после запуска сверен 7 из 7.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-17 03:51 +03:00 | `h.sh "click UI/Enablers/CharacterPanel" "click UI/CharacterPanel/CharacterPanelHeader/MasteryHeader" "shot n1_mastery"`; `tools/mouse.ps1 -X 180 -Y 1022 -Button left`; `h.sh "cursor 760 628" "wait 1.2" "findall Name"`; `h.sh "tmpwatch UI/CharacterPanel/MasteryPanel/MasterySkills/SpellTooltip/Name 60" "cursor 2040 628" "wait 2" "shot n3_b"` | 0 · N1–N3 |

## 4. Checks

Hygiene: NONE (кода в этом прогоне не меняли).
Functional run: в игре владельца — окно «Мастерство», класс «Охотник», настоящий курсор с узла на узел; прочитаны 18 строк `tmpwatch`
(цвет свойства и вершин заголовка) и кадр подсказки глазом.

| Case | Status | Observation |
|---|---|---|
| N1 | pass | окно «Мастерство» открыто, класс «Охотник» |
| N2 | pass | подсказка создана, путь заголовка найден |
| N3 | pass | после смены текста цвет заголовка (1.00 0.29 0.29) во всех 18 выборках (≈0,13 с между ними); на кадре заголовок сочно-красный |

## 5. Found

- none — белой фазы заголовка нет.

## 6. Traces

- `SvarogsDream/_harness/logs/2026-10-17_0351_bug42_tmpwatch.txt` (строки `tmpwatch`)
- кадры `SvarogsDream/_harness/n1_mastery.webp`, `n3_b.webp`, вырез `n3_b_crop.webp`

## 7. Verdict

pass — правка `1050849` держит итоговый красный заголовка с первого кадра после перехода; один переход, один класс — другие классы не гонялись.
