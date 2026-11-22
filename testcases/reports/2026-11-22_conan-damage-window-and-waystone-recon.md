# Test run report — the damage-window stand tool (DW0) and the Waystones Enhanced recon for the loading-screen cases

**Created:** 2026-11-22 09:44 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** Krinik Mod Pack 0.9.1-RC3 published bytes + the Locomotion fix + the dev remote,
Conan Exiles Enhanced 3.1.1 (`D:\Games\Conan Exiles 3.1.1`)

## 1. Work

The new stand tool `ConanExiles/_config/damage-window.lua` (EXP-0603: a damage window closed by the game, god back on under half health) against case DW0 of
`testcases/TC_conan_loading_screen_waystone_dungeon_2026-11-22.md`; and the offline recon of Waystones Enhanced for case R21a (bug 79, issue #21): the item, feat
and recipe ids, the classes, the travel function.

## 2. Contour

The working build above, background path (`launch-bg.ps1`, PID 33548), the machine lock `kumm` taken 09:39 for 60 minutes, world entered by
`enter-world-remote.sh` on the save in the build (the heroine at hp 56 of 236 on entry). The stand keeper on (god on, 600 m, every 20 s). The recon ran on copies
in `KUMM/.work/waystone_recon/`.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-22 09:38 +03:00 | `retoc-5.8/retoc.exe to-legacy --version UE5_7 --no-shaders view legacy` (in `.work/waystone_recon`) | 0 · «Extracted 18 (0 failed)» |
| 2 | 2026-11-22 09:41 +03:00 | `bash pult.sh "lua _G.__dw_max_s=5; _G.__dw_frac=0.5; return dofile('…/damage-window.lua')"` | 0 · «hp 56 already at or under 118 — heal first» (the refusal) |
| 3 | 2026-11-22 09:43 +03:00 | `bash pult.sh "lua FindFirstOf('PlayerController').CheatManager:SetStat('HealthCurrent', 236.0) return 'ok'"` | 0 · hp read back 236/236 |
| 4 | 2026-11-22 09:43 +03:00 | the run 2 command again, then `lua return tostring(_G.__dw_last)` after 7 s | 0 · «closed 09:43:28: time out hp 230/236 after 4.8 s, god ON, 47 ticks» |
| 5 | 2026-11-22 09:48 +03:00 | after judge round 1: `lua _G.__dw_max_s=2.5; … dofile(…)`, then `_G.__dw_frac=1.5` | 0 · «closed 09:48:46: time out … after 2.6 s, god ON, 25 ticks»; the bad fraction refused, god ON |
| 6 | 2026-11-22 09:52 +03:00 | after judge round 2: `lua _G.__dw_ms=60000; … dofile(…)`, then `_G.__dw_max_s=2` | 0 · the minute tick refused, god ON; «closed 09:52:40: time out … after 2.1 s, god ON, 20 ticks» |

## 4. Checks

- Hygiene: none (no lint for the stand Lua); the Lua language server's «undefined global» lines are the UE4SS globals.
- Functional run: the tool called in the live game by the remote, its state read by the remote — `bCanBeDamaged` true inside the window, false after it; the
  `[damage-window]` state line read back.
- DW0 — **pass**: the window opened at full health, god switched off, closed by the time-out after ≈ 5 s with god back on (47 ticks of ≈ 100 ms).
- The refusal under the floor — **pass** (run 2).
- DW0b (judge round 1's failure scenario, a float time-out; a bad fraction) — **pass** (run 5). DW0c (judge round 2: a minute-long tick; a 2 s window) — **pass** (run 6).
- Judge: two rounds by fresh helpers — round 1: one defect (a float input threw after god went off) and five quality / cosmetic findings; round 2: three
  quality findings; all nine verified against the code and fixed; none refuted.
- DW1 (the close by real hits) — **not run**: the owner's two first-person items came first (his messages 09:40); owed.
- Recon — the ids and classes read (`games/ConanExiles/mods/WaystonesEnhanced.md`, «Read 2026-11-22»).

## 5. Found

- The console `exec SetStat Health 236` changes nothing; `CheatManager:SetStat('HealthCurrent', <value>)` (the ECharIntStatID name) heals — recorded in the tool's
  header and the game map.
- No defect in the tool.

## 6. Traces

`D:\Games\Conan Exiles 3.1.1\ConanSandbox\Binaries\Win64\ue4ss\Mods\KrinikAgentRemote\done.txt` (lines 8–17), `UE4SS.log` (`[damage-window]` lines of 09:43),
`KUMM/.work/waystone_recon/legacy/` (the legacy assets, deleted when R21a closes).

## 7. Verdict

partial — DW0 and the refusal pass; DW1 owed; R21a / R21b not run yet (the recon is done).
