# Test cases — Conan: the bow draws in any flight (KrinikConanLocomotion `krinik_air_combat`)

**Created:** 2026-11-17 · **Under test:** `krinik_air_combat.lua` — the re-equip after a climb ended early in the air (`on_character_state`, the climb exit armed in
`on_movement_mode`); the existing take-off branch (substate 8 left with the bow in hand) for a ground jump and a fall · **Version/build:** the Conan build on 3.1.0, pack after `e6d1d97`
**Test basis:** `[OWNER]` 2026-11-17 09:18 «Если ПКМ уже зажата, или если ПКМ зажимается в полёте - оба варианта должны работать - герой натягивает лук в прыжке, и не
важно откуда прыжок, с земли ли, со стены ли, просто падение со скалы ли.» (interview #035, verbatim there); 2026-10-28 «Если герой уже летит в воздухе и игрок делает или ПКМ
с луком, или ЛКМ - то нужно сразу в воздухе начинать соответствующие действия по луку» (the mod's header).

## 1. Goal vector

Achieve: in every flight — a jump from the ground, a push off a wall, a fall off a ledge — the bow in hand draws and shoots in the air; after a wall the game's
1.35 s re-equip no longer eats the ≈ 1.1 s flight.

## 2. Requirements under test

| # | Requirement (EARS sentence) | Fit criterion (Scale · Meter · Target) |
|---|---|---|
| R1 | WHEN the hero pushes off a wall with the bow and RMB is pressed in the flight, the bow shall draw and an arrow shall leave before the landing | the moment of the shot vs the landing · the stand's 0.1 s samples (mode, substates) + the Archery log «#N из лука» · the shot while mode 3 |
| R2 | WHEN the hero jumps from the ground or falls off a ledge with the bow in hand, the bow shall draw and shoot in the air as before | same · same · the shot while mode 3 |
| R3 | WHILE a draw started in the flight after a wall goes on past 1.35 s, the game's late equip timer shall not end it | substates 15 / 16 after 1.35 s · samples · still present |
| R4 | WHEN the bow is wielded on the ground by the hot bar, the equip shall keep the game's own timing | ECharacterState 3 duration · samples · ≈ 1.35 s, no AirCombat «полёт после стены» line |

## 3. Coverage matrix

| Dimension | Values covered | Explicitly NOT covered (risk named) |
|---|---|---|
| where the flight starts | wall push (B1, B5) · ground jump (B3) · fall from a height (B4) | dropping off a wall by `ExitClimbing` without a push (same exit path as the push — low) |
| RMB timing | pressed in the flight (B1, B3, B4) | HELD from before the jump / through the wall — real input only (the owner at the keyboard) — B7 for his play |
| the game's timer | the draw held past it (B5) | a draw released exactly at 1.35 s (low) |
| not a climb | a ground equip by the hot bar (B6) | an equip pressed in the air without a climb (the game's timing kept by design) |

## 4. Cases

Stand: the desert arch (`tp_ground.sh 17929 244723`, `wall-stand.lua find` ×2, `climb`), the bow wielded (`ToggleWieldWeapon()`), the game in the BACKGROUND;
`wall-stand.lua airshot` — Space press 0.05 / release 0.12, RMB `_7` at `_G.__ws_draw`, LMB `_9` / `_10` at `_G.__ws_shot`, RMB up `_8`; samples every 0.1 s:
time, mode, substates, ECharacterState, the bow's socket. Logs `[KrinikConanLocomotion:AirCombat]`, `[KrinikConanArchery]`.

| # | Case (steps → expected) | Technique | Status + evidence |
|---|---|---|---|
| B1 | On the wall, `airshot` (draw 0.25, shot 0.75) → state 0 within ≈ 0.3 s, substates 11 / 15 in mode 3, the shot before mode 1; the line «полёт после стены: лук готов сразу …» | partition (wall) | **fail** (r1: the hook read the old state — never fired; r2: state 0 at 0.11 s, the draw and the light shot in the air, but the flying arrow born with v 0 — `arrow-birth-probe.lua`; 3 more tries v 0) — CORRECTED 2026-11-17 10:34 +03:00: v 0 = the arrow hit the wall the view faced; the case is re-run with the view turned away (`bugs/107_…`) |
| B1′ | The same with the view turned 180° 0.15 s after the push (`SetControlRotation`), LMB at 0.3 s — the hero aims AWAY from the wall she pushed off | partition (wall, aimed away) | **pass** 2026-11-17 10:38 +03:00 (rearm r2): «полёт после стены: лук готов сразу …» 0.1 s after the exit, the light shot in mode 3, the flying arrow born v 2499, «#1 из лука» 0.67 s after the push, the landing at 1.29 s · report `testcases/reports/2026-11-17_conan-bow-any-flight-r2.md` |
| B3 | On the ground, `airshot` → the draw and the shot in mode 3 (regression) | partition (ground jump) | partial · the remote's draw stays in 11 (RMB not held physically), the light shot's arrow left after the landing (#1, #2); real input — the owner's play 2026-11-10 (M6) |
| B4 | The hero lifted 6 m by `K2_SetActorLocation`, RMB / LMB events in the fall → the draw and the shot in mode 3 | partition (fall) | partial · a light shot (LMB only) in the fall: the arrow born v 2499, «#3 из лука»; RMB + LMB by the remote → «CannotQueue» (the remote's draw, not held) |
| B5 | On the wall, `airshot` with the shot at 1.6 s (`_G.__ws_end` 2.2) → 15 / 16 kept past 1.35 s; the shot fires | boundary (the game's timer) | partial 2026-11-17 10:46 +03:00 — a light shot at 1.15 s (it replaced the equip montage at 1.20 s, the game's equip end around it) launched a flying arrow v 2499, «#2 из лука»; a HELD draw past 1.35 s — real input (B7) |
| B6 | On the ground, `ToggleWieldWeapon()` ×2 (sheathe, wield) → state 3 lasts as the game's, no AirCombat «полёт после стены» line | partition (not a climb) | blocked — the remote's `ToggleWieldWeapon()` does not sheathe a wielded bow (state 0, `Socket_Bow` before and after, 2026-11-17 10:38 +03:00); by the code: `on_character_state` returns at once unless a climb ended in the air ≤ 2 s ago |
| B7 | RMB held from the wall through the push — real keys | use-case (held) | skipped — real input; the owner at the keyboard (rule 30); for his play |

## 5. Control cases — MUST

| # | Control → expected: the behaviour is absent | Status + evidence |
|---|---|---|
| K1 | The build before (2026-11-14, TC_conan_wall_jump W6): `airshot` on the wall → no draw in the flight, ActionTry refused «NotAggressive», state 3 until 1.35 s | pass · `testcases/TC_conan_wall_jump_2026-11-14.md` W6 (16:5x); the game map «The character state across a climb» |

## 6. Verdict

B1′ pass on rearm r2 (the shot aimed away from the wall) — the earlier B1 «fail» was the wall in front (bug 107, Correction); B3 / B4 partial (the remote's draw),
B5 / B6 blocked, B7 the owner's real keys. Reports `testcases/reports/2026-11-17_conan-bow-any-flight-research.md`, `…-r2.md`.
