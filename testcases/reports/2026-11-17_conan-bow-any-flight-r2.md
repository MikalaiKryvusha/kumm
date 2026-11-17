# Test run report — Conan: the bow in the flight after a wall push, rearm r2 re-checked aimed away from the wall (bug 107)

**Created:** 2026-11-17 10:38 +03:00 · **Run by:** the agent, the remote only · **Version/build:** the Conan build on 3.1.0, pack `e6d1d97` + `krinik_air_combat.lua` rearm r2
(working tree, = `KUMM/.work/bowflight/krinik_air_combat.rearm-r2.lua`)

## 1. Work

The correction of bug 107 (the «speed 0» arrows were the wall in front) and the re-check of rearm r2 by TC `testcases/TC_conan_bow_any_flight_2026-11-17.md` B1′, B6.

## 2. Contour

The desert arch stand (`tp_ground.sh 17929 244723`, `wall-stand.lua find` ×2 / `climb` / `jumpwall`), the game in the BACKGROUND; probes
`KUMM/.work/bowflight/arrow-birth-probe.lua` (each projectile's birth: class, place, speed), `refuse-probe.lua` (mode, state, montage every 50 ms; refusals).
Machine lock `kumm` from 10:28. REAL WORLD: accumulated — the owner's save and 3.1.0 install; data and machine — his; path — the remote's input events and
`SetControlRotation` for the view (the player's mouse turn); real keys not used (the owner at the keyboard).

## 3. Runs

All on 2026-11-17 (+03:00), `bash pult.sh "lua …"` from `ConanExiles/_config`.

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 10:29–10:31 | build `9a33796` (no rearm): a climb with a draw (`_7` before `climb`) → the bow kept on `Socket_Bow` on the wall; push + LMB 0.3 s | no re-equip (state 0 at 0.11 s), the flying arrow v 0 — the wall in front |
| 2 | 10:31 | a ground jump + LMB 0.12 s | the flying arrow v 2499 in the air |
| 3 | 10:32 | run 1 with the view turned 180° at 0.15 s | v 2499 — the Correction |
| 4 | 10:35–10:36 | rearm r2 restored (`Copy-Item … rearm-r2.lua`), `Deploy-ModPack.ps1 -Deploy -Only KrinikConanLocomotion` (md5 = source), launch; climb with the bow sheathed, push, view turned, LMB 0.3 s | B1′ below |
| 5 | 10:37–10:38 | `ToggleWieldWeapon()` on the ground (B6) | the remote's toggle does not sheathe |

## 4. Checks

Hygiene: none separate (the four hook lines of AirCombat at the start).
Functional run: the game's own climb, push, re-equip and shot on the owner's save; the projectiles' birth and the logs read.

| Case | Status | Observation |
|---|---|---|
| B1′ rearm r2, aimed away | pass | «полёт после стены: лук готов сразу …» 10:36:41.316; the light shot in mode 3 from 0.374 s; the flying arrow born v 2499 at 181 cm from the hero; «#1 из лука» 10:36:41.983 (0.67 s), landing at 1.285 s |
| B6 ground wield | blocked | the remote's toggle leaves the bow in hand (state 0 before and after) |

## 5. Found

- none new; the Correction of bug 107 (the stand's geometry, not the code).

## 6. Traces

`UE4SS.log` 10:36:41–42 (`[KrinikConanLocomotion:AirCombat] полёт после стены …`, `[KrinikConanArchery] #1 из лука …`, «#1 через 0.6 с: … скорость 2495 см/с»).

## 7. Verdict

pass for B1′ on the remote's path; real keys (held RMB through the push, B7) — the owner's play.
