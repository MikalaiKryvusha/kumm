# Run report — замок «живой машины» KUMM ↔ KAGO

## Work

`D:\work\ai_sandbox\_tools\machine-lock.mjs` и его вызовы в `SvarogsDream/tools/run-game.sh` (взятие) и `tools/h.sh` (`kill` —
снятие) — против кейсов `testcases/TC_machine_lock_kumm_kago_2026-10-17.md` (C1–C8, K1).

## Contour

машина владельца, Git Bash, Node v24; замок `D:\work\ai_sandbox\_tools\machine-lock.json`; игра не запущена (процессов 0),
сессия KAGO в это время офлайн (её слово в переписке 17:28).

## Runs

один прогон 2026-10-17 17:31:31–17:31:35 +03:00: команды `node machine-lock.mjs take|status|release …` по кейсам, 6 параллельных
`take` в фоне оболочки, строка замка из `run-game.sh` через `bash -c "$(grep 'machine-lock.mjs take' tools/run-game.sh)"`,
`bash tools/h.sh "kill"`. Перед ним — черновой прогон 17:30:14 теми же командами (до записи кейсов), его итоги совпали.

## Checks


Hygiene: `bash -n tools/h.sh`, `bash -n tools/run-game.sh` — синтаксис цел.
Functional run: инструмент вызывался так же, как его вызывают сессии и `run-game.sh`; прочитаны строки вывода и коды возврата.
- C1 pass · C2 pass · C3 pass · C4 pass · C5 pass · C6 pass (1 `TAKEN`, 5 `BUSY`) · C7 pass (код 3) · C8 pass · K1 pass.

## Found

none.

## Traces

вывод прогона — в чате сессии 2026-10-17; итоги по кейсам — в TC-файле.

## Verdict

pass — с оговоркой: `h.sh kill` при живой игре не прогнан, ждёт ближайшего живого прогона.
