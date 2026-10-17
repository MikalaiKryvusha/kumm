# Test run report — Сварог: еда и зелья перетаскиванием между сумкой и панелью (идея 18, шаг 1), пачка 5 рефакторинга

**Created:** 2026-10-17 19:07 +03:00 · **Run by:** агент (Claude Opus 5.5) ·
**Version/build:** KrinikUIRework — рабочее дерево SvarogsDream после `86ef1fa` (файлы `HotbarDrag.cs`, `Popups.cs`, `DevotionCards.cs`, `Restore.cs`), горячая выкладка 19:02

## 1. Work

Новый шаг мода идеи 18: перенос еды и зелий мышью из сумки в ячейки еды (Q) и зелья (E) панели быстрых действий и обратно; чужая вещь над
панелью остаётся в сумке. Плюс два места эпика 26 — делегаты вместо отражения (`Popups.StyleStatus`, `DevotionCards.DevSelected`). Кейсы —
`testcases/TC_svarog_batch5_refactor_hotbar_2026-10-17.md` (H1–H6, R1–R2, K1–K2). Основа — слово владельца в `ideas/18_svarog_predmety_v_bystryh_yacheykah.md`.

## 2. Contour

Живая игра на машине владельца, 4K, запуск 18:33 (замок `kumm`, продлён до 19:27 и снят в 19:06), мод интерфейса подложен горячо
(`RELOADED (attempt 1)`). Герой — Тамара, лес ночью. Предметы для прогона выданы пультом `give` (яблоки ×2, огурец, малое зелье лечения и
шесть ошибочных выдач: 280, 299, 302, 200, 379, 409). Сейв после запуска не писался (файл `saveFile-0` — 17:01:17); точка до прогона —
`D:\work\ai_sandbox\SvarogsDream\_backups\svarog-saves-2026-10-17_1904-before-hotbar-test`.
REAL WORLD: accumulated — сейв владельца 17:01 и его игра с 18:33 (прыжки в журнале); data and machine — его машина и его герой; path — мышь
по настоящим ячейкам, как у игрока.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-17 19:02 +03:00 | `bash tools/deploy-hot.sh KrinikUIRework` | `RELOADED (attempt 1)`; прибор: `REST CHECK RED: ui moved 89 per frame (limit 40)` |
| 2 | 2026-10-17 19:04 +03:00 | `bash tools/h.sh "give 262" "give 262" "give 57" "give 61" "shot hb_bag3"` | выдано, кадр сумки |
| 3 | 2026-10-17 19:04 +03:00 | `powershell -File tools/mouse.ps1 -X 3393 -Y 1206 -Button drag-left -DX -874 -DY 858` | H1 |
| 4 | 2026-10-17 19:05 +03:00 | три `mouse.ps1 … drag-left` подряд (огурец на Q, факел на 3, зелье на E) | H2, H4, H3 |
| 5 | 2026-10-17 19:05 +03:00 | `powershell -File tools/mouse.ps1 -X 2519 -Y 2064 -Button drag-left -DX 874 -DY -858` | H5 |
| 6 | 2026-10-17 19:06 +03:00 | `bash tools/h.sh "cfg krinik.svarogsdream.uirework Hud HotbarDrag false"` → тот же жест → `… true` | K2 |

## 4. Checks

Hygiene: `dotnet build -c Release` — 0 ошибок
Functional run: мышью по ячейкам сумки и панели в живой игре 4K; прочитаны кадры пульта `hb_*.webp` и журнал `LogOutput.log` (строки `hotbar …`)

| Case | Status | Observation |
|---|---|---|
| H1 | pass | яблоки ×2 на Q с числом 2, в снаряжении «Еда»; журнал `262-Apples x2 -> equipment Food (was empty)` |
| H2 | pass | огурец на Q, яблоки вернулись в сумку; журнал `(was 262-Apples)` |
| H3 | partial | зелье на E и в «Зелье 1»; клавиша E не нажималась |
| H4 | pass | факел над ячейкой 3 остался в сумке; журнал `stays in bag` |
| H5 | pass | огурец с Q — в сумку, Q пуста; журнал `swap ok` |
| H6 | skipped | Q не нажималась |
| K2 | pass | без настройки игра выбросила огурец на землю (вес 22,3 → 22,1) — мод и правда ведёт перенос |
| R2 | partial | 19:12, `click UI/Enablers/CharacterPanel` → `DevotionHeader` → `Gods/God (1)`: страница строится, исключений нет; цвет выбранного имени по кадру не различить |
| R1, K1 | skipped | боя в этом прогоне не было |
| C20 сумки (`TC_svarog_inventory_2026-10-07.md`) | partial | 19:13, `mouse.ps1 -X 3598 -Y 1655 -Button left` (▼) и `-Y 1168` (▲): ряд уходит и возвращается, ползунок 40 точек на ряд; ползунок не тянулся |

## 5. Found

- Без мода еда, отпущенная над панелью, падает на землю (родное поведение игры, K2) — мод это закрывает.
- Прибор выкладки: `REST CHECK RED: ui moved 89 per frame (limit 40)` сразу после перезагрузки мода; повтор `bash tools/rest-check.sh` в
  19:12 — `ui moved 13 per frame (limit 40)`, выход 0: красное было в первые кадры после перезагрузки, регресса нет. Храповик эпика 26
  (`tools/refactor_baseline.json`, отметка `628f6ef` от 2026-10-14): поисков 65 → 70, принудительных перестроек 13 → 14. Выросло не в этой
  пачке: `git diff 628f6ef HEAD -- src` — разовые поиски вне кадра (замер `MaterialScanProbe`, запасной путь пульта камеры, окно выбора
  героя, шрифт боевых надписей при загрузке) и одна перестройка заголовка; поисков в кадре — 7, как было.
- Шесть ошибочных выдач пульта (сущности душ, щит, сумка и др.) лежат в сумке героя; в сейв не попали, пока игра его не записала.

## 6. Traces

Кадры `D:\work\ai_sandbox\SvarogsDream\_harness\hb_bag1.webp`, `hb_bag3.webp`, `hb_h1.webp`, `hb_h2.webp`, `hb_h4.webp`, `hb_h3.webp`,
`hb_h5.webp`, `hb_k2.webp`; журнал `D:\Games\Svarog's Dream\BepInEx\LogOutput.log`, строки 3044–3129.

## 7. Verdict

partial — перенос сумка ↔ панель для еды и зелий работает в живой игре (H1, H2, H4, H5 pass, контроль K2 pass); не прогнаны питьё и еда
клавишей (H3 вторая половина, H6) и обе правки рефакторинга (R1, R2).
