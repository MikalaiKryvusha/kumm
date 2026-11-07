# TC — KrinikConanLocomotion: combat in a jump (melee new, the bow moved) · the hub «dance» · «E Взять» timing

> **Created:** 2026-11-07 · on the owner's words 2026-11-07 ≈10:10 (melee in a jump), 10:39 (the mod), 10:41–10:42 («E Взять» 10 / s, fade 0.1), 10:47 (the melee
> design), 10:52–10:53 (the hub dances on item select) — verbatim in `games/ConanExiles/mods/KrinikConanLocomotion.md` and `KrinikConanUI.md`
> **Parent:** HOUSE_RULES rule 19; bug 64 (hub)
> **Status:** run 2026-11-07 from 10:44 to 11:09 — see the table; report `testcases/reports/2026-11-07_conan-locomotion-hub-dance-pickup.md` · **Outbound:** —

## Stand

Background game, the oasis save, god on; Sword of Crom (`exec SpawnItem 50506 1`, quick slot 5) and «Мощный охотничий лук» (51405, slot 3) taken by the hero's own
shortcut input events; swings and jumps by the hero's own input events (`InpActEvt_PrimaryActionV2_*`, `InpActEvt_Jump_*`) and `Jump()`; probes
`_config/air-attack-probe.lua`, `jump-mid-swing-probe.lua`, `air-swing-twice.lua`, `combo-then-air.lua`, `pickup-away-probe.lua`, `stone-stand.lua`.

## Cases

| # | Situation | Action | Expected | Status | Observation |
|---|---|---|---|---|---|
| M1 | sword in hand, no mod section (control, 10:45) | jump, swing at +150 ms | the game refuses in the air | pass | attacking false the whole jump |
| M2 | sword, the section (11:03) | jump, swing at +150 ms, a second press at +450 ms | the swing starts in the air, the jump arc as without it; the simple first step | pass | `AM_combat_2h_sword_primary_light_c0` in the air, z −19956 → −19867 → lands; the second press played `c1` after landing (the game's queue) |
| M3 | sword, the section with the take-off reset (11:08) | two ground swings, jump on the first tick after the swing, swing at once | the air swing is the simple first step | pass | ×2: `light_c0` in the air |
| M4 | sword, the game's rule (10:46) | a swing on the ground, Space at +250 ms | no jump during the swing (the owner 10:47) | pass | mode stays 1 during the swing — the section adds no launch for melee |
| M5 | bow in hand (11:09) | jump | the bow branch of the section at take-off | pass | log «прыжок с луком: выстрел в воздухе разрешён (1)» |
| M6 | bow in hand | a real shot in the air (RMB + LMB) | the arrow flies | skipped | the remote's LMB event shoots nothing even on the ground — the bow shoots by RMB hold; real input needs the game in front |
| D1 | the hub on «Снаряжение», the build before the fix (10:52) | select the stone sword, then the Sword of Crom (real clicks), whole-screen frames | the middle does not move | fail | the whole middle moved 2–3 px at 4K (the ScaleBox content 1080.8 vs 1079.0) |
| D2 | after `krinik_ui_fixes` 1.6.0 (11:04) | the same two clicks | as D1 | pass | shift 0 on bag header, craft header, filters, bag grid, level line; the diff shows only the item texts, rims and the live world |
| P1 | «E Взять» shown at a stone (11:05) | the view turned 90° away, ×3 | the fade starts within ≈ 100 ms, lasts ≈ 0.10 s | pass | fade starts 63 / 80 / 120 ms, lasts 72–78 ms; the plate gone in 134–198 ms (was 280–400 ms) |
