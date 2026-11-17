# Bug 107 — Conan: after a wall push the bow is not ready in the flight (the game re-equips for 1.35 s)

**Status:** 🔬 research — four tries failed (below), none shipped; the pack keeps `9a33796`'s `krinik_air_combat.lua` · **Severity:** S2 (the owner's design of the
bow in any flight, KrinikConanLocomotion) · **Version/build:** the Conan build on 3.1.0, pack `e6d1d97` · **When/context:** applying the owner's answer to
interview #035, 2026-11-17 09:56–10:26 · **Fixing:** next — `/bug-research` (the 3-attempts rule), then a build by the hypothesis below

## The owner's requirement (verbatim)

`[OWNER]` 2026-11-17 09:18 (interview #035): «Если ПКМ уже зажата, или если ПКМ зажимается в полёте - оба варианта должны работать - герой натягивает лук в прыжке, и не
важно откуда прыжок, с земли ли, со стены ли, просто падение со скалы ли.»

## Goal vector

Achieve: in the flight after a wall push the bow draws and the arrow flies, as after a ground jump or a fall. Acceptance: TC `testcases/TC_conan_bow_any_flight_2026-11-17.md`
B1 — after the push, a shot before the landing: the flying arrow born with speed > 0 (`arrow-birth-probe.lua`: the second `BP_Visual_BowProjectileBase_C` with v ≈ 2500),
the Archery line «#N из лука»; B3 / B4 (ground jump, fall) unchanged.

## Symptom

After `krinik_wall_jump`'s push (and any climb end into the air) the game re-equips the bow: ECharacterState 12 → 4 → 0 → 3 (EquipItem, the bow on `Socket_Bow`,
montage `AM_combat_2h_bow_3rd_equip`, 1.333 s) → 0 by its own timer ≈ 1.35 s after the exit; until then ActionTry refuses («NotAggressive») and the falling
substate 8 stays (our take-off branch saw the bow still sheathed). The flight lasts ≈ 1.1 s — no shot in it (TC W6 of 2026-11-14 = the control K1).

## Forensics (2026-11-17, the remote, background game, probes in `KUMM/.work/bowflight/`)

- **What the game does at the end of the re-equip** (`window-probe.lua`, every hero + bow UFunction hooked, window 1.15–1.55 s after the push): ClearCurrentAttack ·
  SetAnimInstanceTickRateSlow · EndAttackingFromItem · ComboWindowClose · QueueWindowClose · ClearComboAdvanceWindow · HyperArmorClose · … · ExitSubstate ·
  StaminaDegenerationBitmaskClear · SetIsAttacking · **HandleItemInitialize** · ApplyNewRotationRate · CheckMovement_HandlePostAction · HandlePostAction · **ActionEnd**
  (post-hook completion order): the re-equip is an ACTION that ends with the item's initialisation.
- **A shot fired before that end launches an arrow WITH NO SPEED** (`arrow-birth-probe.lua`): in a fall the game births two projectiles — the nocked visual arrow
  (v 0) and the flying one (v 2499); after the wall both are born at the bow, 100–140 cm from the hero, BOTH v 0. Archery skips such an arrow (`on_arrow`: speed < 1
  retried 4 times, then return — no «#N из лука» line), and its stuck copy (`BP_DummyProjectile_C`) lands at the world origin with no lifespan («от точки удара
  246438 см, срок 0.0 с» — 2.45 km = the arch's distance to 0 0 0). A shot 1.7 s after the push (after the game's own end) — a normal arrow (copy 62 cm, 14.9 s).
- **UE4SS runs a hook on a NATIVE UFunction BEFORE its body** (`ConanCharacter:SetCharacterState`: the 10:01 rows read the old state at the call; build r1 of the
  fix read it and never fired). The new value is the call's parameter (`NewState`). Blueprint functions' hooks run AFTER their body (the mod headers).
- The remote's input events do not hold RMB physically: a draw by `_7` stays in substate 11 and Archery ends the aim («ПКМ отпущена»); an LMB while that attack runs is
  refused «CannotQueue» (fall case, 10:13). Real-input draws are the owner's (rule 30).

## Tries (none shipped)

1. `SetCharacterState(Aggressive)` on the next step after the game enters EquipItem in the flight + `ExitSubstate(8)` (`.work/bowflight/krinik_air_combat.rearm-r2.lua`):
   state 0 at 0.11 s, the draw starts in the air, the light shot plays in the air — **the arrow is born with v 0**. Worse than vanilla (a broken arrow, a copy at the origin).
2. + `ActionEnd(0.1)` by the remote at 0.15 s — v 0.
3. + the equip montage at ×3 (`Montage_SetPlayRate`, ended at 0.36 s), the shot at 0.65 s — v 0 (no Archery line).
4. + `HandleItemInitialize(GetWeaponItemActive().CurrentWeapon, true)` by the remote at 0.15 s — v 0; its log line did not appear (the delayed call may have thrown —
   not read).

## Hypotheses for `/bug-research`

1. **Keep the bow wielded through the climb** — then no re-equip exists to wait for. A draw brought onto the wall already keeps the bow in the left hand (G7 —
   `[OWNER]` 2026-11-16 23:31 «то что она с луком в лекоыв руке висит - ок»). Read what sheathes it at the climb's start (`Handle Auto Wield Sheathe`, the state 12
   handler) and whether a hero who climbed with the bow in hand fires a normal arrow right after the push.
2. Find what gives the flying arrow its speed (the weapon item's projectile stats — `TryItemInitialize`, `GetWeaponItemActive`, the PowerCharge multiplier hook
   Archery reads) and whether try 4's call really ran.

## Decisions made without the owner

- `[AI]` The rearm (try 1) is not shipped: with it the shot after a wall launches a dead arrow; without it the game refuses for 1.35 s, as before.

## Links

Interview #035 · TC `testcases/TC_conan_bow_any_flight_2026-11-17.md` · game map «The character state across a climb» · `games/ConanExiles/mods/KrinikConanLocomotion.md` ·
`KrinikConanArchery` `on_arrow` (`main.lua` ≈ 639).
