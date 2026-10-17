# Тест-кейсы — умный рандом советов экрана загрузки

**Created:** 2026-10-17 · **Under test:** `SvarogsDream/src/KrinikUIRework/TipsBag.cs` (префикс `LoadingScreen.ShowRandomTip`, файл
`BepInEx/config/krinik_loading_tips_seen.tsv`) · **Version/build:** сборка KrinikUIRework этого вечера
**Test basis:** `[OWNER]` «нужна система умного рандома, чтобы те советы, которые показывались - получали меньший шанс показаться из всех
советов, а те, которые ещё не показывались - больший шанс - и чтобы оно между сессиями запоминалось» · 2026-10-17; разведка —
`researches/svarog-loading-tips-smart-random/README.md`.

## 1. Goal vector

Achieve: игрок видит все советы прежде повторов; ни один совет не идёт дважды подряд; счёт показов переживает перезапуск игры.

## 2. Requirements under test

| # | Requirement | Fit criterion |
|---|---|---|
| R1 | WHEN выбирается совет, мод shall не брать совет, показанный в последние K выборов | 30 выборов — ни одного номера, повторившегося в пределах 10 выборов |
| R2 | WHILE есть непоказанные советы, мод shall выбирать их почти всегда | первые 30 выборов — 30 разных советов (при пустом файле) |
| R3 | WHEN мод перезагружен, счёт shall подниматься из файла | после перезагрузки `tick` продолжает, а не начинается с 1 |
| R4 | Формат строки shall остаться «Tip N: текст» / «Совет N: текст» | дерево интерфейса: текст подсказки начинается с «Совет» (перевод) |

## 3. Coverage matrix

| Dimension | Values covered | Explicitly NOT covered |
|---|---|---|
| файл счёта | пустой (первый запуск) · с записями (после перезагрузки) | битый файл (код ловит, прогона нет) |
| источник вызова | пульт `call LoadingScreen ShowRandomTip` | настоящий экран загрузки (быстрое перемещение) — глазом в следующий заход |

## 4. Cases

| # | Case (steps → expected) | Technique | Status + evidence |
|---|---|---|---|
| C1 | 30 × `call LoadingScreen ShowRandomTip` → журнал `tip pick`: 30 разных номеров, `tick` 1…30 | use case | [NOT-TESTED] |
| C2 | файл `krinik_loading_tips_seen.tsv`: 30 строк с n = 1, `#tick 30` | use case | [NOT-TESTED] |
| C3 | горячая перезагрузка мода, ещё 10 вызовов → `tick` 31…40, номера не из первых 30, пока остались непоказанные | state | [NOT-TESTED] |
| C4 | `gettext` подсказки → начинается с «Совет » | use case | [NOT-TESTED] |

## 5. Control cases

| # | Control → expected | Status + evidence |
|---|---|---|
| K1 | `Loading.SmartTips = false` → строк `tip pick` нет, выбор игры (повторы возможны) | [NOT-TESTED] |
