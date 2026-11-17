# Bug 105 — Conan: a hero in a jump who touches a wall does not grab it (hits and falls)

**Status:** 🔧 the grab built and pushed (pack `4367176`, 2026-11-16 23:23 +03:00); G7 (the bow drawn — decided by the owner 23:24) r10 `68c8d11`, r11 `a3a6111`,
**r15 pushed 2026-11-17 05:1x (pack `9a33796`) — G7 and G7e pass by real input read while RMB is held** (report `testcases/reports/2026-11-17_conan-wall-grab-bow-cancel-r14.md`); OPEN: the top
of the wall with RMB held — the owner's choice (interview #037 Q1, asked 2026-11-17 04:29); then his final check · **Severity:** S2 (the owner's play, a movement feature of KrinikConanLocomotion — the wall jump family) · **Version/build:** the Conan build on 3.1.0,
pack working tree of 2026-11-16 · **When/context:** the owner's message 2026-11-16 21:38 +03:00 <!-- attribution-ok: verbatim in the «Symptom» section of this file -->, mid-session, while the agent finished bug 93 · **Fixing:** the chat of 2026-11-16 22:12 built and pushed the grab and the G7 cancel; the rest — FIRST NEXT CHAT in `STATUS.md`

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

## The fix as built (2026-11-16 22:1x–23:2x, `krinik_wall_jump.lua`, builds r1 → r7, pack `4367176`; TC `testcases/TC_conan_jump_wall_grab_2026-11-16.md`)

Final r7 by real input: G1 ×4, G4, G5b, G5c, G9, G10 pass; G3 control pass. Judge: 4 rounds — 26 findings, fixed 16, declined 6, info 3, one to the owner (G7); round 4
found no correctness defect. After round 2 a press is told from a release by the wish it leaves (`left_wc`, refreshed at every mode change), a release re-wishes only
when it cleared a wish, the state belongs to one pawn (its address).

TWINS: searched `RegisterHook` on `…_K2Node_InputActionEvent_N` in our mods — found 2 other sites: KrinikConanArchery RMB `_7` / `_8` (state-based — reads the held
button 100 ms later, so the double call only repeats the check: no defect), KrinikConanCamera `ZoomOut_…_28` / `ZoomIn_…_29` (different texts — no collision). The
stamina charge's rounding (`math.floor` of a negative cost) had a twin in `krinik_air_combat.lua` — fixed in the same commit.

- **Control (G3, 22:22):** Locomotion out of the game — the tapped jump bounces off: the game's own rule, not ours (rule 24).
- **The mechanism:** a post-hook on the hero's Jump event; after a RELEASE body (the wish cleared) while falling → the game's own `Climb(false)`. G1 passed on r1
  (22:26, 22:29) and r4 (22:46, 22:49): the wish stands through the flight, mode 7 at the touch. OUR wish is taken back at the landing (G4 pass r4 22:44) and when the
  climb it gave ends (the judge's round-1 item 1; seen at the push 22:47:43.4416 «лазание кончилось (режим 3) — … снято»).
- **UE4SS hooks the press and the release as ONE event** (debug probe 22:38): `…InputActionEvent_26` and `_27` differ only by the FName number; a hook on either
  fires for both. So the handler tells them apart by the effect (the press body sets the wish, the release clears it). Build r1 misread this as «the game sends a
  second release at the push»; build r3 hooked both names and lost the landing clear (G4 fail). Game map «Climbing» carries the rule.
- **The same wall after a push (G5b fail on r1, 22:29):** with W held the hero re-caught the wall 0.13 s after the push. Now: no re-wish in a push's flight until the
  landing or a new press in it; the wish cleared again after the push press's body (its rest sets it).
- **One key event may call the hook twice in the same moment** (22:47:43.5360 / .5362): a call within 5 ms of the previous is skipped (build r5).
- **The push costs the game's jump stamina** (bug 106 item 1): log «… выносливость -20 …» 22:47:43.4425.

## Next (in order)

1. ~~Control case~~ — done 22:22 (G3). ~~The native re-wish~~ — built (r1 → r7, pack `4367176`). ~~Cases in a TC file~~ — done.
2. ~~G7 by the owner's rule; the rest of judge round 2 of `cancel_draw`~~ — done 2026-11-17 (r12 → r14, below). Left: his answer on the top of the wall
   (interview #037 Q1) → build it, then G7 over the top by the same rule; his final check (G1 grab after a tap, G5b push, G10 stamina, G7 with the bow).

## 2026-11-17 — the rest of judge round 2 and two more judge rounds (r12 → r14, `krinik_wall_jump.lua`)

- r12 — the judge round 2 items of 2026-11-16: the stance re-read on the deferred step (an RMB release before the step ends it by itself — nothing stopped, nothing
  claimed); the log read back after the exits; the error of the grab call logged instead of dropped; ONE `bow_in_hand` (krinik_air_combat's, `_G.__krinik_bow_in_hand`).
- Judge r12 (fresh, 11 findings, no defect): `StopAnimMontage(nil)` stops whatever is current; the read-back in the same step cannot see a relapse or a throw-off;
  the attack flag may outlive the exits; 15 / 16 of another weapon was cancelled; the pre-read inside the hook; a third `bow_in_hand` copy in krinik_bow_sprint;
  wording / counter / comment items; the `bow` substring matcher (declined — older code, out of scope: a class name with «bow» attached to the hero is not met in
  the build). Checked against a run: the 15 ms recorder (new `mt=` column) showed the draw, the full hold, the shot's release tail and a redraw are ONE montage
  `AM_combat_2h_bow_combo_heavy_c0`, and the arrow is shot when 16 ends at the LMB — so the «a shot's release cancelled loses the arrow» worry is refuted (the
  release tail runs after the shot); the attack-flag worry refuted by G7g (dropped off, the game's jump ran, a new draw started; the flag read false).
- r13 — the montage stopped only when it is the bow's; a 300 ms second read; only the bow's stance; always deferred; krinik_bow_sprint reads the shared function.
  G7, G7e, G1, G7g, S1b pass by real input.
- Judge r13 (fresh, no defect): `GetCurrentMontage` is the montage started LAST — a later montage in another slot would hide the draw; the 300 ms read only
  logged. r14 — the draw stopped BY IDENTITY (the asset + a current `2h_bow_combo` montage, each only if playing); a stance back on the wall at 300 ms is ended
  again, always; the stance logged as its substate list; honest wording. G7 and G7e pass on r14.
- Judge r14 (fresh, no correctness defect): the log could disarm the re-check, duplicates told by short name, the re-check armed only with a stance, a paused
  montage skipped; the matcher again (declined). r15 fixed the four; G7, G7e and G1 with the bow pass on r15; pack `9a33796` pushed (review: 4 rounds, 30 findings).

## Decisions made without the owner

- `[AI]` Wall to wall needs a Space tap in the push's flight: a re-wish there would let the pushed-off wall catch the hero again (G5b), and telling the same wall from
  the next one would be a correction after the game's grab (HOUSE_RULES rule 24).
- `[AI]` The push is refused for the game's jump blockers (13 / 14 / 18) — a safety net: the game drops an exhausted hero off the wall itself (23:20).
- `[AI]` ~~The G7 cancel stops the hero's montage by `StopAnimMontage(nil)`~~ — replaced 2026-11-17 (r13 → r14): only the bow's draw montage, by identity.
- `[AI]` 2026-11-17: only the BOW's stance is cancelled at a grab — another weapon's charge (15 / 16) and a melee swing are left as the game plays them (the owner
  named the bow's stance).
- `[AI]` 2026-11-17: a stance found back on the wall 300 ms after the cancel is ended once more (a safety net for a montage the identity stop could miss); never seen
  live.
- `[AI]` The shipped 0.9.0 guide is not edited; the next release's guide takes the wall jump and the grab (mod notes carry the text's source).
- G7 DECIDED by the owner: `[OWNER]` 2026-11-16 23:24 +03:00 «при натянутом луке и прыжке на стену - натяжение снимается, герой повисает на стене. ПКМ прикладка не
  работает в висе на стене» — grab (A); at the grab the draw is cancelled; while hanging, RMB does not start the aim. r7 grabs but keeps the draw (substates 11, 15, 16
  until RMB goes up) — TO BUILD: the draw's cancel at the climb's start and no aim on the wall (recon first: how the game ends a draw; does vanilla refuse RMB on a wall).
  `[OWNER]` 23:31 «то что она с луком в лекоыв руке висит - ок» · «гдавное, чтобы не в стойке натяжения висела» · 23:32 «если стоять в натяжке перед стеной и прыгнуть с
  натяжкой на стену, то пероснаж начинает в натяжении ползти по стене - вот это нужно фиксить, да».
- **BUILT 2026-11-16 23:2x–23:4x (pack r10, `cancel_draw` in `krinik_wall_jump.lua`):** at the climb's start, a draw (15 / 16, or 11 with the bow in hand) is ended by
  `ExitSubstate(16, 15, 11)` on the next game-thread step — the hero keeps hanging, the aim view returns by itself, a held RMB does not redraw on the wall (the game
  refuses a draw there: G7b passes by the game itself). `CancelAttackTry()` was tried first (r8) and REJECTED: it throws the hero off the wall. Pass: G7 (run-up, r9),
  G7c (the owner's case, r9; frame `KUMM/.work/wallgrab/g7c_r9.jpg`). **OPEN — G7e:** a draw begun ≈ 0.25 s before the touch comes back on the wall (the montage
  plays on and enters 15 / 16 after our exit; r10 23:46). **The recipe, read 23:49 by the remote on that very state (the hero hanging, 15 / 16 back, RMB held):**
  `StopAnimMontage(nil)` + `ExitSubstate(16, 15, 11)` → mode 7 kept, the substates gone, the view normal in 0.3 s, no redraw for 1.8 s with RMB held; the frame
  `KUMM/.work/wallgrab/g7e_stop.jpg` — the climbing pose, the bow in the left hand. FIRST NEXT CHAT: add `c:StopAnimMontage(nil)` before the exits in `cancel_draw`,
  re-run G7e / G7 / G7c / G1, a judge round, and the rest of judge round 2 (a shot's release read as a draw; 15 / 16 without the bow; the dropped pcall error in
  `on_mode_changed`; the log line after an RMB release; `bow_in_hand` shared with air_combat through `_G`).
- **2026-11-16 23:49–23:52 — the owner watching the agent's runs:** `[OWNER]` 23:49 «ты вот сейчас тестируешь - и я видел, как она в натяжке ползёт по стене» · 23:50
  «ьг на месте» · «наверное ты неверно интерпретируешь - смотришь псоле отпускания ПКМ» · 23:51 «а нужно смотреть пока ПКМ ещё держишь - натяжка не должна
  сохраняться». The 23:49 run was r10 G7e (the stance came back on the wall — the defect, stopped by the remote at 2.4 s). r11 (`StopAnimMontage(nil)` added, pack
  working tree, committed at the closure 23:5x) run 23:52 with RMB HELD through the whole crawl: frame `KUMM/.work/wallgrab/held_1.jpg` (≈ 1.4 s, mode 7) — the climbing pose, the bow
  lowered, no stance; frame `held_2.jpg` (≈ 2.3 s, RMB still held) — the hero came over the top of the lower ledge (z +380 cm, mode 3) and the HELD RMB redrew at
  once in the air at the wall's top (substate 11, the aim view). **OPEN, ask the owner first:** is that top-of-wall redraw what he saw, and should a held RMB redraw
  after the climb ends, or only a new press? Then the agent's frames are taken by the rule «while RMB is held», a series, not one read (the owner's 23:51).

## Links

`games/ConanExiles/mods/KrinikConanLocomotion.md` (section `krinik_wall_jump`), game map «Climbing», `_config/wall-stand.lua`.
