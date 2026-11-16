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

## Recon by real input 2026-11-16 21:44 +03:00 (the agent, the owner's grant «комп твой»; the desert arch, the climbable wall found by `wall-stand.lua find` ×2; recorder
`KUMM/.work/bow310/series-rec.lua` with `mm` = `CharacterMovement.MovementMode`, `wc` = `bWantsToClimb`; rows `KUMM/.work/bow310/wall_{a,b,c,d}_rows.txt`)

- A (60 cm off the wall, W + Space tap): a ground climb at once — mm 1 → 7, wc true on the touch. Not the owner's case (`[OWNER]` 21:42 «ты сейчас вплотную к
  стене, естественно герой залазит» · «а нужно бежать к стене, на бегу прыгнуть так, чтобы в полёте в стену ударится»).
- B (3 m off, a run 0.45 s, Space TAPPED 80 ms): **REPRODUCED** — in the air (mm 3) wc true only 2.75 → 2.84 s, the wall hit at 2.98 (speed 470 → 10), mm stays 3,
  the hero falls (mm 1 at 3.36). No grab.
- C (as B with `HoldingClimbButtonTime` 0.075 → 0.8 by the remote): the same — wc false at 2.85. That field is not the wish's window (restored to 0.075).
- D (as B with Space HELD 1.2 s): wc stays true through the flight → at the touch (3.01) mm 7 — **the hero grabs**.
- **Cause:** vanilla grabs a wall in the air only while the jump key is HELD; the Space RELEASE clears `bWantsToClimb`. A tap — no grab. Not ours (Locomotion's
  sections were loaded, but the wish is cleared at the release, which no section of ours touches — a control run without them is still owed for the record).

## Fix plan (next session)

The native way: keep the wish for the jump's flight after the Space release — a post-hook of the hero's jump RELEASE event (`InpActEvt_Jump_K2Node_InputActionEvent_27`,
the release per `input-bindings-probe.lua`, game map «Climbing») or of `Character:StopJumping` → if falling → the game's own `Climb(false)` (sets `bWantsToClimb`; seen
to start a climb while airborne, 2026-11-14). The wish ends at landing (the game's own, or by the movement-mode hook). Guard: after a `krinik_wall_jump` push the hero
must not re-grab the SAME wall at once (the push is 0.5 m) — e.g. no re-wish for the push's first 0.3 s or until moving toward a wall; the owner's wall-to-wall jumps
(«прыгать со стены на стену») then grab the NEXT wall without holding Space. Cases first (TC), the judge, the agent's own real-input run, then the owner's final check.

## Next (in order)

1. Control case: the same jump into the wall with Locomotion's sections out of the game copy — does vanilla grab? (rule 24: who makes the defect).
2. If vanilla does not grab in the air by itself: the native way — the game's own `Climb(false)` at the wall touch while airborne (the event: a hit / `OnWalkingOffLedge`
   / the capsule's blocking hit — read which one fires), never a timer.
3. Cases in a TC file before the run; the owner's hands only for the final check (memory `owner-offers-bow-testing`).

## Links

`games/ConanExiles/mods/KrinikConanLocomotion.md` (section `krinik_wall_jump`), game map «Climbing», `_config/wall-stand.lua`.
