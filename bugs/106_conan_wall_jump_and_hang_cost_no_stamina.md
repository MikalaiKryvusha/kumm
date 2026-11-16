# Bug 106 — Conan: the jump off a wall and the hang on a wall cost no stamina

**Status:** 🔴 OPEN · **Severity:** S2 (the owner's play rules for the climb, KrinikConanLocomotion — the wall family) · **Version/build:** the Conan build on 3.1.0,
pack working tree of 2026-11-16 · **When/context:** the owner's two messages mid-turn, 2026-11-16 22:31 +03:00, while the agent built bug 105 · **Fixing:** item 1 pushed
(pack `4367176`, TC G10 79 → 59); item 2 — the fork asked of the owner in chat 2026-11-16 23:09 (a timer of ours, rule 7, and the rate −1 / −2 / −3 per second), no answer yet

## Symptom (the owner's words, verbatim)

`[OWNER]` 2026-11-16 22:31 +03:00 «прыжок из виса на стене должен расходовать выносливость» · 22:31 «вис на стене должен медленно но расходывать выносливость, помимо
того что ползание по стене расходует выносливость».

## Goal vector

Achieve two stamina rules of the climb, both by the game's own stamina functions:
1. The push off a wall (`krinik_wall_jump`, our `LaunchCharacter` — not the game's jump, so nothing charges it by itself; game map, stamina line (7)) costs what a jump
   costs: `GetStaminaJumpCost` → `AdjustStaminaCurrent`, as the mid-draw jump of `krinik_air_combat` (bug 93 Z10). An exhausted hero stays on the wall.
2. Hanging on a wall without moving drains stamina slowly, on top of the game's own cost of moving along the wall.

Acceptance: (1) a push with honest stamina takes the jump cost off the bar (the hero's stamina before / after, read by the remote, and the log line
«…выносливость −20…»); (2) a hero hanging still on a wall for N seconds loses stamina at the chosen slow rate, and a hero climbing loses the game's cost as before
(not doubled); the main thread stays inside the 1 ms budget (no per-frame Lua — HOUSE_RULES rule 7).

## Known

- The game charges the climb's MOVEMENT itself (`ReceiveClimbingStaminaCostModifier`, `SetClimbingStaminaCostModifier` — game map «Climbing»; the cheat line uses
  `SetClimbingStaminaCostModifier(0.0)`). Whether hanging still costs anything in vanilla is NOT read yet.
- The run stands use god mode (`stand-keeper.sh`): stamina tests need it honest — check what god mode does to stamina first (the bug 93 run had «stamina honest from 21:07»).

## Recon (2026-11-16 22:5x, the remote, no input, the hero hanging still on the desert-arch wall)

- **Vanilla hanging costs NOTHING and regenerates nothing:** `GetIntStat(5, 0)` (StaminaCurrent) read 81 / 108 at t 526.8, 533.9, 541.4 s — mode 7, speed 0. (God mode
  of `stand-keeper.sh` did not freeze the bar: the push took 81 → 78 by 1.7 s later — the −20 and the regen after the landing.)
- **The game's stamina functions** (`ForEachFunction` over the hero's classes): `BasePlayerChar_C` / `ConanCharacter` — `K2_CanRegenerateStamina`, `GetStaminaRegen`,
  `GetStaminaRegenTickRate`, `AdjustStaminaRegenMod`, `K2_GetStaminaRegenMod`, `ReceiveClimbingStaminaCostModifier`, `SetClimbingStaminaCostModifier`,
  `K2_ClimbingStaminaCostModifier`, `ShouldUseHealthForClimbingStaminaConsumption`, `ReceiveClimbingHealthCostModifier`, `OnClimbingFromCeilingChanged`. Their
  parameters are not read yet (a bare call errors «UFunction expected» — read them by `_config/fn-params.lua` first).
- **A native way to try first:** the game's own regen tick. If `K2_CanRegenerateStamina` (a native event — hookable, as `K2_CanSprint`) is what stops the regen on the
  wall, a post-hook could let the tick run while the hero hangs still, with `GetStaminaRegen` (or the regen modifier) giving a small NEGATIVE value there. The game
  then drains the bar at its own tick, with no timer of ours. To check: does the game call these per tick (a post-hook count over 2 s), and with what values.

- **Signatures** (`_config/fn-params.lua`, 22:55): `ConanCharacter:K2_CanRegenerateStamina(isRegenPositive: bool)`, `GetStaminaRegen() → float`,
  `GetStaminaRegenTickRate() → float`, `K2_GetStaminaRegenMod(Value: float)`, `AdjustStaminaRegenMod(Input: float)`, `SetClimbingStaminaCostModifier(Modifier: float)`,
  `K2_ClimbingStaminaCostModifier(Value: float)`.
- **The regen tick is hookable** (`KUMM/.work/wallgrab/regen-probe.lua`, 23:01, on the ground, stamina 108 / 108): `GetStaminaRegen` — 46 calls in 4.6 s (≈ 10 Hz);
  `K2_CanRegenerateStamina` and `GetStaminaRegenTickRate` — 0 (a hook on the BP class name refused: not overridden there).
- **On the wall the regen tick does not run at all** (23:08, the hero hanging still after a real-input grab, stamina 82): `GetStaminaRegen` — 0 calls in 5.6 s. So the
  game has no time-based call on a hanging hero to ride: the «negative regen» way is closed. The climb's own cost is paid only on movement (88 → 79 for ≈ 0.5 s up,
  ≈ 18 per second; 0 when still).
- **What is left — a FORK for the owner** (HOUSE_RULES rule 7 says «on a game event, never by timer polling», and there is no event): a slow timer of ours only while
  the hero hangs on a wall (started at the climb's start, stopped at its end — the mode-change hook already there), once a second: still and climbing → −N stamina by
  `AdjustStaminaCurrent`. Cost: one call a second while hanging, nothing otherwise. The rate «медленно» is the owner's number: e.g. −1 / s (a full bar of 108 holds
  ≈ 1 min 48 s), −2 / s (≈ 54 s), −3 / s (≈ 36 s); the climbing cost for comparison ≈ 18 / s.

## Plan

1. Item 1 — built 2026-11-16 22:32 in `krinik_wall_jump.lua` (the push: the game's jump blockers 13 / 14 / 18, then the jump cost) — TC row G10 of
   `testcases/TC_conan_jump_wall_grab_2026-11-16.md`.
2. Item 2 — recon first, no code: what drains stamina on the wall in vanilla (a hang 10 s by the remote's stamina reads, moving vs still; the climb's stamina
   functions and data rows — `DT_CharacterMovement` «Climb» row? a regen block while climbing?). The native way is the game's own climb cost or regen data for the
   still hang; a Lua timer is the last resort and needs an A-B cost measurement. The rate («медленно») goes to the owner as a number with what it means in seconds of
   hanging before the bar is empty.

## Decisions made without the owner

- `[AI]` The push is refused while the hero is exhausted (the game's own jump blockers, the same set as the mid-draw jump) — the owner asked for the cost; the refusal is
  the game's rule for any jump.

## Links

`bugs/105_conan_jump_into_wall_does_not_grab.md` (the same file and run), `games/ConanExiles/mods/KrinikConanLocomotion.md`, game map «Climbing» and the stamina line (7).
