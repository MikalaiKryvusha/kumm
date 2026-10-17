# Тест-кейсы — замок «живой машины» KUMM ↔ KAGO

**Created:** 2026-10-17 · **Under test:** `D:\work\ai_sandbox\_tools\machine-lock.mjs`, его вызов в `SvarogsDream/tools/run-game.sh` и
снятие в `SvarogsDream/tools/h.sh` (`kill`) · **Version/build:** правка 2026-10-17 17:3x
**Test basis:** `[OWNER]` «С агентом KAGO договоритесь. как вы комп будете делить» · 2026-10-17; договор с сессией `kago-5d` (семь
пунктов, поправки KAGO: «until обязателен, просроченный замок считается свободным, а запись атомарная»).

## 1. Goal vector

Avoid: две сессии одновременно грузят одну видеокарту или запускают вторую игру; замеры KUMM портятся сменой кривой KAGO, прогон
KAGO — нашей игрой. Работает — значит второй берущий получает отказ, а свободный замок берётся одним из гонщиков.

## 2. Requirements under test

| # | Requirement | Fit criterion |
|---|---|---|
| R1 | WHEN замок свободен, `take` shall взять его | `TAKEN`, код 0 |
| R2 | WHILE замок держит другой проект, `take` shall отказать | `BUSY …`, код 3 |
| R3 | WHEN срок `until` прошёл, замок shall считаться свободным | `status` → `FREE (просрочен…)`, код 0 |
| R4 | IF несколько `take` идут одновременно, THEN ровно один shall получить `TAKEN` | 6 параллельных — один `TAKEN` |
| R5 | WHILE замок держит другой проект, `run-game.sh` shall не запускать игру | код 3, процесса игры нет |
| R6 | WHEN `h.sh kill` выполнен, замок того же `LOCK_WHO` shall сниматься | `RELEASED`, затем `status` → `FREE` |

## 3. Coverage matrix

| Dimension | Values covered | Explicitly NOT covered |
|---|---|---|
| состояние замка | свободен · свой · чужой · просрочен | битый JSON (код есть, прогона нет; риск низкий) |
| одновременность | 6 параллельных take | две разные машины — замок только локальный |
| путь запуска | строка замка в `run-game.sh` · `h.sh kill` без игры | `h.sh kill` с живой игрой — при следующем живом прогоне |

## 4. Cases

| # | Case (steps → expected) | Technique | Status + evidence |
|---|---|---|---|
| C1 | `take --who kumm` на свободном → `TAKEN`, 0 | partition | pass — `TAKEN kumm · c1`, rc=0 (17:31) |
| C2 | `take --who kago` при замке kumm → `BUSY`, 3 | partition | pass — `BUSY kumm · c1`, rc=3 |
| C3 | `release --who kago` при замке kumm → `NOT YOURS`, 3 | partition | pass — `NOT YOURS kumm · c1`, rc=3 |
| C4 | повторный `take --who kumm` → `EXTENDED`, `since` прежний | state | pass — `EXTENDED`, since 17:31:32 прежний, until +2 мин |
| C5 | `take --minutes 0.01`, через 1 с `status` → `FREE (просрочен…)`; `take --who kago` → `TAKEN` | boundary | pass — `FREE (просрочен: kumm · c5…)`, затем `TAKEN kago · c5b` |
| C6 | 6 параллельных `take` → ровно одна строка `TAKEN` | error guess | pass — 1 × `TAKEN`, 5 × `BUSY` |
| C7 | замок kago, строка замка `run-game.sh` → код 3 | partition | pass — `BUSY kago · c7`, rc=3 |
| C8 | замок kumm, игра не запущена, `h.sh "kill"` → `game not running`, `RELEASED`, `status` → `FREE` | state | pass — процессов игры 0, `game not running` · `RELEASED`, `status` → `FREE` |

## 5. Control cases

| # | Control → expected | Status + evidence |
|---|---|---|
| K1 | без замка (`status` → FREE) строка замка `run-game.sh` берёт его → `TAKEN` (отказ C7 — от чужого замка, а не всегда) | pass — `TAKEN kumm · svarog run-game` на 30 мин, rc=0 |

Отчёт прогона — `testcases/reports/2026-10-17_machine-lock.md`. Не прогнано: `h.sh kill` с живой игрой (при следующем живом прогоне).
