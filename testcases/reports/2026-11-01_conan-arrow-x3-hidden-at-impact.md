# Test run report — the ×3 visual arrow hidden at impact, only the ×1 copy stays

**Created:** 2026-11-01 21:13 +03:00 · **Run by:** the agent (Claude Opus 5.5) and the owner (the look) · **Version/build:** pack ConanExiles `fd30f7d` (the hook; the log line
of the hide is in the pack, not yet in the running game)

## 1. Work

`[OWNER]` 2026-11-01 21:07 «когда стрела попадает в землю - наша x3 отображается долго вместе с настоящей x1» · «нашу x3 мгновенно нужно скрывать, когда происходит
слолкновение, и показывать только настоящую x1». Cases V5, V6 of `testcases/TC_conan_hub_rows_audit_2026-11-01.md`.

## 2. Contour

The live game 3.0.1, the oasis save, god on, food and water written to 100; a frozen green Kappa 28 m ahead in the water; real-mouse shots (`mouse-seq.ps1`) and
the remote shot `LaunchProjectile()`; then the owner played the same running game.
REAL WORLD: accumulated — the owner's live save; data and machine — his; path — the player's own shots (the owner's run).

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-01 21:05 +03:00 | `pult.sh "lua … LaunchProjectile()"` (before the fix) | a normal shot in the archery log: the background twin of a real shot works |
| 2 | 2026-11-01 21:08–21:09 +03:00 | `Deploy-ModPack.ps1 -Deploy -Only KrinikConanArchery`, `launch-bg.ps1`, `enter-world-remote.sh` | world in 24 s |
| 3 | 2026-11-01 21:10 +03:00 | `mouse-seq.ps1 -Seq "kdown:0x7C,kup:0x7C,wait:700,rdown,wait:1300,lclick,wait:2500,rup,wait:600"` | log «гашение крупной стрелы при ударе: подписано»; copy 62 cm from the hit |
| 4 | 2026-11-01 21:11–21:13 +03:00 | the owner plays the running game | «да, суппер работает!» · «и земля, и камни, и враги» |

## 4. Checks

Hygiene: `lua loadfile` of `main.lua`; `check-lua-game-thread.py` — 0 game-thread calls.
Functional run: real shots in the live game; read — the archery log; the look — the owner's own shots into the ground, rocks and enemies.
V5 partial (the hook subscribed; my remote read did not single out our mesh); V6 pass (the owner).

## 5. Found

1. The 60 fps desktop recording of run 3 caught the owner's own desktop (the game in the background between the sequence steps) — deleted unwatched; a video of
   the game is taken only with the game holding the screen for the whole clip.

## 6. Traces

The UE4SS log lines 21:10:37 «крупная стрела: сетка SM_iron_arrow ×3.0 …», «гашение крупной стрелы при ударе: подписано», 21:10:39 «копия стрелы #1 … 62 см».

## 7. Verdict

pass — the owner saw the big arrow vanish at impact on ground, rocks and enemies.
