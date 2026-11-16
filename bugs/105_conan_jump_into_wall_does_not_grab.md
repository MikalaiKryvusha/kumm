# Bug 105 — Conan: a hero in a jump who touches a wall does not grab it (hits and falls)

**Status:** 🔴 OPEN · **Severity:** S2 (the owner's play, a movement feature of KrinikConanLocomotion — the wall jump family) · **Version/build:** the Conan build on 3.1.0,
pack working tree of 2026-11-16 · **When/context:** the owner's message 2026-11-16 21:38 +03:00, mid-session, while the agent finished bug 93 · **Fixing:** this session, right after the bug 93 commit

## Goal vector

Achieve: a hero in the air (a jump, a wall push of `krinik_wall_jump`) who touches a climbable wall grabs it and starts climbing, as the owner expects — instead of
bouncing off and falling. Acceptance: by real input, a run-up jump into a vertical wall of the `wall-stand.lua` stand ends in `MovementMode` 7 (climbing), not on the
ground; the control case with our Locomotion sections out shows what vanilla 3.1.0 does.

## Symptom (the owner's words, verbatim)

`[OWNER]` 2026-11-16 21:38 +03:00 «Есть проблема, что в прыжке герой не цепляется за стеную» · «Нужно чтобы герой если он летит в прыжке и касается стены - он цепляется за неё» ·
«сейчас словно просто ударяется и падает на хемлю без зацепления».

## Known (game map «Climbing», 2026-11-02 … 2026-11-14)

The climb is native (`ConanCharacterMovementComponent`): `Character::Climb(bClientSimulation)` sets `bWantsToClimb`; `Climb(false)` called WHILE AIRBORNE with movement
input into a wall starts the climb (`MovementMode` 7, custom 0); on the ground it does not. `HoldToClimb` false, `HoldingClimbButtonTime` 0.075. Not yet read: what vanilla
needs to grab in the air (the jump key held? pressed again? the wall's height / angle), and whether our sections (`krinik_air_combat` exits substate 8 at take-off;
`krinik_wall_jump` hooks `StartJump`) change it.

## Next (in order)

1. Control case: the same jump into the wall with Locomotion's sections out of the game copy — does vanilla grab? (rule 24: who makes the defect).
2. If vanilla does not grab in the air by itself: the native way — the game's own `Climb(false)` at the wall touch while airborne (the event: a hit / `OnWalkingOffLedge`
   / the capsule's blocking hit — read which one fires), never a timer.
3. Cases in a TC file before the run; the owner's hands only for the final check (memory `owner-offers-bow-testing`).

## Links

`games/ConanExiles/mods/KrinikConanLocomotion.md` (section `krinik_wall_jump`), game map «Climbing», `_config/wall-stand.lua`.
