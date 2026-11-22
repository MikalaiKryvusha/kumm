# Test cases — Conan 0.9.1-RC4 retest on the published build: the death error (#48), the first-person view (#4), the view switch cost (#53)

> **Created:** 2026-11-23 · the loop of 00:52 (the owner: work autonomously until the context fills) · **Parent:** STATUS «Left of the RC4 list» — the
> issues close only after the retest on the published release (HOUSE_RULES 44.4)
> **Status:** written before the run · **Outbound:** the issue comments / closures of #48 and #4 by the results

## Basis

- #48: «Пока героиня мертва, мод не пишет ошибок в журнал UE4SS» (the issue's expected result; the fix `b99409a` in KrinikConanLocomotion 0.9.1-RC4).
- #4: in first person a weapon on the hero's back stays out of the frame (the RC4 notes; the fix `25dff5d` in KrinikConanCamera 0.9.1-RC4).
- #53: switching to the first-person view costs ≈ 3 ms in one event (the camera notes, measured 2026-11-22 22:10) — measured again here, informative.

## Stand

The working game `D:\Games\Conan Exiles 3.1.1` holds the RC4 mods (`_kumm_backup/pack_version.txt` = `0.9.1-RC4`; the published release's Krinik mods
carry the same versions); the background path `launch-bg.ps1`, the machine lock `kumm`, the owner's save (HOUSE_RULES 6). God on by the remote except in the
death case; the stand keeper off in the death case. A bow in hand by the quick slot recipe, then sheathed for R4.

## Cases

| # | Situation | Action | Expected | Status | Observation |
|---|---|---|---|---|---|
| R48 | the heroine alive, god off, the stand keeper off | the remote kills her (`exec suicide`) | from the death until the respawn screen has stood 20 s: no `[KrinikConanLocomotion` error line («шаг упал», «attempt to perform arithmetic») in UE4SS.log | **pass** (2026-11-23 01:25, the published RC4 mods) | death 01:25:14, respawn by herself 01:25:24; 0 KrinikConanLocomotion error lines in 25 s (`.work/rc4/logs/r48_death.log`) |
| R4 | first person, a bow on the back (sheathed), daylight | the view turned up 60° | the bow is not in the frame (a frame looked at) | **pass** (01:24) | frame `.work/rc4/frames/r4_fp_up.webp`: sky and palm, no bow; control `r4_tp_control.webp` — third person, the bow on her back |
| R53 | third person | first person switched on by the remote | the camera's log lines of that switch span ≤ 1 ms (informative: the issue expects ≈ 3 ms) | **fail — confirms #53** | the first switch after world entry: lines 01:23:15.0373 → .0418 (4.5 ms), the mod's own «просмотрено 27 … 2 мс»; the second switch 01:25:53: 1.7 ms, «просмотрено 22 … 0 мс» |

| R13 | added 01:32 (the second run): 10:00, god on, first person | pitch −55 at yaw 0 and yaw 180 | the ground shadow shows the head (a frame looked at) | **pass** (01:34) | `.work/rc4/frames/r13_pair.webp`: at yaw 180 (the sun behind) the shadow on the sand has the head and the shoulders → #13 closed |

## Neighbours (HOUSE_RULES 39)

| # | Function sharing the code | Check | Status |
|---|---|---|---|
| N1 | the respawn after the death (Locomotion's run and jump by Agility) | after the respawn the log shows the Agility line for the new heroine | **pass** — «герой появился: Проворство 8 → бег 474» 01:25:24 |
| N2 | the weapon swap in first person (the camera's attached-items pass) | a swap in first person logs no error | **not run** — the slot-2 call (`Shortcut1_…_24`) left no weapon line (the flushed log read after the game closed too); in the second run the heroine had respawned without her gear after R48's death (her items stay on the corpse), the quick slots empty; owed |
