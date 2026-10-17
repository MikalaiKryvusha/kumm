# Test run report — Svarog's Dream: реплики жителей на делегатах полей, прыжок B3–B4 (баг 47)

**Created:** 2026-10-17 08:08 +03:00 · **Run by:** агент (Claude Opus 5.5) · **Version/build:** SvarogsDream `7139b99` (интерфейс с
делегатами `FieldRefAccess` в `PatchYellBubble`); `KrinikFixes` с прыжком, выложенным 2026-10-15

## 1. Work

Кейсы `testcases/TC_svarog_yell_refs_jump_b_2026-10-17.md`: D1 — реплики жителей после перевода `Traverse` на делегаты (эпик 26, правило 9);
B3, B4a, B4b — кейсы бага 47 (`bugs/47_svarog_mvp_jumps_bugs.md`, `testcases/TC_svarog_jump_physics_2026-10-14.md`) по выложенным правкам прыжка.

## 2. Contour

Игра владельца, 4K, чистый запуск `tools/run-game.sh` с его сейвом (точка `_backups/svarog-saves-2026-10-17_0723-before-stream-gate`; после
запуска сверка 7 из 7, реестр возвращён). Прыжок — настоящей клавишей (`tools/keys.ps1`, окно игры вперёд). REAL WORLD: accumulated — сейв
владельца (Ловкость 30); data and machine — его машина; path — бег по клику и пробел, как играет он.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-17 08:05 +03:00 | `bash tools/run-game.sh`, `h.sh "static WorldState isGodMode True" "teleport innGradLocation" "wait 40" "shot d1_inn"` | 0 · D1 partial |
| 2 | 2026-10-17 08:06 +03:00 | `bash _harness/jump_run.sh -594.4,110.8,-570.2 -640,110,-570.2 0.7`; `… -612,145,-330 -612.3,145,-348.5 0.7`; `… -556,132,-335 -592,130,-335` | 0 · под бессмертием — скорость 18,5 и 24,1 м/с, замер недействителен |
| 3 | 2026-10-17 08:07 +03:00 | `h.sh "static WorldState isGodMode False"`, `jump_run.sh -556,132,-335 -592,130,-335`, `jump_run.sh -612,145,-322 -612.3,145,-348.5 0.7` | 0 · B4b pass, B4a blocked |
| 4 | 2026-10-17 08:11 +03:00 | новый чистый запуск; `h.sh "teleport -612,145,-330" "wait 6" "call KrinikCameraRework.Plugin CamYaw 180"`, `keys.ps1 -Key W -Ms 3000` фоном, через 1,5 с `keys.ps1 -Key SPACE -Ms 80` | 0 · B2 pass (журнал) |
| 5 | 2026-10-17 08:13 +03:00 | новый чистый запуск; `h.sh "teleport -576,108,-596" "wait 6" "call KrinikCameraRework.Plugin CamYaw 180" "findall Cart"`, W фоном, пробел через 1,1 с; `colliders 8 40` | 0 · B1 blocked — тележки там нет (кладбище), скелеты напали — игра закрыта сразу |
| 6 | 2026-10-17 08:52 +03:00 | новый чистый запуск; `bash _harness/jump_run.sh -612,145,-318 -612.3,145,-348.5 1.5` | 0 · B4c fail (постановка: добежал и встал) |
| 7 | 2026-10-17 08:53 +03:00 | новый чистый запуск; `bash _harness/jump_run.sh -612,145,-318 -612.3,145,-348.5 0.9` | 0 · B4d partial: разбег в утёс, касание на 2,7 м выше подножия |
| 8 | 2026-10-17 09:04 +03:00 | новый чистый запуск; `h.sh "teleport -594.4,110.8,-570.2" "wait 5" "slopes 6 1" "slopes 12 1"`, `bash _harness/jump_run.sh -594.4,110.8,-570.2 -606,129.1,-567.1 0.4` | 0 · B3b blocked: агент обходит склон |
| 9 | 2026-10-17 09:05 +03:00 | новый чистый запуск; `h.sh "teleport -594.4,110.8,-570.2" "wait 6" "call KrinikCameraRework.Plugin CamYaw 270"`, W 3000 мс фоном, пробел через 0,8 с | 0 · B3c fail: упёрся в склон круче 50°, подъёма нет |
| 10 | 2026-10-17 09:07 +03:00 | новый чистый запуск; `h.sh "teleport -590,110.5,-570.2" "wait 6" "call KrinikCameraRework.Plugin CamYaw 270"`, W 3000 мс фоном, пробел через 0,3 с | 0 · B3d pass: `apex +3,49` |

## 4. Checks

Hygiene: сборка интерфейса без ошибок; выкладка `deploy-cold.sh` — md5 пары совпали
Functional run: герой у трактира Града 40 с (реплики жителей), прыжки на бегу по клику у дуба и у утёса — на игре владельца; прочитаны журнал
`LogOutput.log` (`bubble #`, `jump #`), `Player.log`, кадр `d1_inn`

| Case | Status | Observation |
|---|---|---|
| D1 | partial | одна реплика за 40 с, исключений наших модов 0; ветка возврата значка не сработала |
| B3 | blocked | цель ниже старта — бег вниз, не на склон; под бессмертием 18,5 м/с |
| B4a | blocked | `run 0,0 m/s` — разбега в стену не было |
| B1 | blocked | тележки по координате нет; прыжок `(wasd)` по оси без сдвига вбок (0,0 м) |
| B2 | pass (журнал) | `run 11,5 m/s (wasd, … agent velocity 0,0)`, приземление на 5 м по W и на 1,5 м выше; героя за скалой на кадре не видно |
| B3d | pass | с разбега 4 м по W: `apex +3,49`, касание склона дальше −596,0 — п. 3 работает на склоне владельца |
| B3c | fail (постановка) | по W, упёршись в склон: касание через 0,05 с, `apex +0,27` — у №13 было +1,82; склон круче 50° считается стеной |
| B3b | blocked | подъём на запад крут для сетки — агент пошёл в обход, прыжок ушёл вниз; нужен разбег по W |
| B4d | partial | `run 11,5 m/s (facing)`, `hit rock proxy SM_Cliff_Formation_03`, касание на 2,7 м выше подножия, `apex +2,81` — 14.10 F12 касался у подножия |
| B4b | pass | `run 11,5 m/s (facing)`, `hit HQ_OakTreeGroup01`, касание через 3,7 м — как F4 |

## 5. Found

- Бессмертие пульта (`static WorldState isGodMode True`) ускоряет бег героя (18,5–24,1 м/с вместо 11,5) — для замеров движения его не включать.
- `AudioSetter.OnEnable/Start` — 2 исключения игры в `Player.log` (видели и ночью до правок; код игры).

## 6. Traces

`SvarogsDream/_harness/d1_inn.webp`; строки `jump #1`…`#5` и `bubble #1` — в `LogOutput.log` этого запуска; итоги — в файле кейсов.

## 7. Verdict

partial — реплики работают на делегатах, прыжок по клику у дерева как прежде; склон и утёс с разбегом не получены постановкой — повторить.
