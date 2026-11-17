# Test run report — Conan: the bow in the flight after a wall push (interview #035, bug 107)

**Created:** 2026-11-17 10:27 +03:00 · **Run by:** the agent, the remote only (no real input) · **Version/build:** the Conan build on 3.1.0, pack `e6d1d97` + the working-tree
`krinik_air_combat.lua` rearm r1 / r2 (NOT committed; saved as `KUMM/.work/bowflight/krinik_air_combat.rearm-r2.lua`, the pack file restored to `9a33796`'s)

## 1. Work

The owner's answer to interview #035 (verbatim in `bugs/107_conan_bow_not_ready_in_flight_after_wall.md`): the bow draws in any flight. Basis: TC
`testcases/TC_conan_bow_any_flight_2026-11-17.md` B1–B7, K1.

## 2. Contour

The desert arch (`tp_ground.sh 17929 244723`, `wall-stand.lua find` ×2 / `climb` / `jumpwall` / `airshot`), the bow wielded by `ToggleWieldWeapon()`, the game in
the BACKGROUND; probes `KUMM/.work/bowflight/equip-probe.lua`, `launch-probe.lua`, `refuse-probe.lua`, `window-probe.lua`, `arrow-birth-probe.lua`. Machine lock
`kumm` 09:56–10:26. REAL WORLD: accumulated — the owner's save and 3.1.0 install with the build; data and machine — his; path — the remote's input events (the draw is
not held physically — real input was not used, the owner at the keyboard).

## 3. Runs

All on 2026-11-17 (+03:00), `bash pult.sh "lua …"` from `ConanExiles/_config`.

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 09:56–09:58 | `launch-bg.ps1` · `enter-world-remote.sh` · `equip-probe.lua list` | 0 · `EquipTimer`, `ItemEquip*`, `SetCharacterState` found |
| 2 | 10:00–10:01 | `equip-probe.lua arm`, push with the bow sheathed, then wielded | the state chain 12 → 4 → 0 → 3 → 0 (≈ 1.35 s) |
| 3 | 10:04–10:06 | deploy rearm r1 · B1 | fail — the native hook read the old state, never fired |
| 4 | 10:07–10:09 | deploy rearm r2 (`NewState` parameter) · B1 · B3 | state 0 at 0.11 s, draw in the air; no Archery shot line |
| 5 | 10:11–10:16 | `refuse-probe.lua` B1 / B3 / B4; `launch-probe.lua` fall vs wall | wall: `LaunchProjectile` called as in the fall; fall RMB+LMB «CannotQueue» |
| 6 | 10:18–10:20 | late shot 1.7 s; `window-probe.lua` 1.15–1.55 s; `ActionEnd(0.1)` at 0.15 s | late shot normal; the action-end chain read; ActionEnd early — no help |
| 7 | 10:22–10:25 | equip montage ×3; `arrow-birth-probe.lua` fall vs wall; `HandleItemInitialize` at 0.15 s | fall arrow v 2499, wall arrow v 0 (all tries) |
| 8 | 10:26 | the pack file restored (`git checkout`), `Deploy-ModPack.ps1 -Deploy -Only KrinikConanLocomotion` (md5 = HEAD), game closed, lock released | 0 |

## 4. Checks

Hygiene: none separate (the game's Lua load — the hook lines «перехват SetCharacterState поставлен»).
Functional run: the game's own climb, push and shot events on the owner's save; the arrows' birth read by a probe, the logs read — the cases below.

| Case | Status | Observation |
|---|---|---|
| B1 wall push + shot in the flight | fail | r2: state 0 at 0.11 s, substate 8 gone, the draw and the light shot in the air; the flying arrow born at the bow with v 0 (fall: v 2499) |
| B3 ground jump | partial | the remote's draw stays in 11; the light shot's arrow after the landing; real input — the owner's play 2026-11-10 |
| B4 fall | partial | a light shot in the fall — v 2499, «#3 из лука»; RMB + LMB → «CannotQueue» (remote draw) |
| B5, B6 | blocked | by B1 |
| B7 held RMB | skipped | real input |
| K1 control | pass | TC_conan_wall_jump W6 (2026-11-14) |

## 5. Found

- `bugs/107_conan_bow_not_ready_in_flight_after_wall.md` — the re-equip after a climb is an action that ends with the item's initialisation; a shot before it
  launches an arrow with no speed; four tries failed → `/bug-research`.

## 6. Traces

`UE4SS.log` 10:06–10:25 (`[RP]`, `[KrinikConanLocomotion:AirCombat] полёт после стены …`, `[KrinikConanArchery] копия стрелы #6 … 246438 см`); the probes and the
experimental file in `KUMM/.work/bowflight/`.

## 7. Verdict

fail (B1) — nothing shipped; the build stays as pushed.
