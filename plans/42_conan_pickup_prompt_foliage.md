# Plan 42 — Conan build: a light «E Поднять» prompt over sticks, fibre and stones

> **Created:** 2026-11-01 · on the owner's word in chat: `[OWNER]` 21:14 «получится при наведении на палки, на траву, на камень - писать тонкий виджет E Поднять ?» ·
> 21:15 «меня бесит, что я навожу на камень - и ничего не появляется о том, что я могу его поднять» · 21:16 «како-то ненавязчивый виджет, с полупрозначным фейд фоном,
> небольшой текст, легкий» · «не такой большой, как виджет трупов»
> **Parent:** the Conan 3.0.1 build 1.0.0 (`MASTER_PLAN.md` → What matters now)
> **Status:** 🔬 recon 2026-11-01 21:1x — the game's own pickup search is not reachable from Lua (below); route not chosen yet
> **Outbound:** the look (a mockup frame) to the owner before the code is shipped (the taste class)

## Goal vector

Achieve: WHEN the crosshair rests on a stick, a fibre plant or a stone the hero can pick up with E, the screen shall show a light prompt «E Поднять»; WHEN it
leaves, the prompt shall go. Maintain: our mods' 1 ms CPU budget in gameplay frames (`MASTER_PLAN.md`), no per-frame scene search (HOUSE_RULES §1 rule 7).

## Acceptance criteria

1. Situation: the hero stands 1 m from a spawned stone, the crosshair on it. Action: none. Result: «E Поднять» is on screen within 0.2 s. Check: a frame by
   `capture-window.ps1` shows the prompt.
2. Situation: as 1. Action: the crosshair moves 2 m off the stone. Result: the prompt is gone within 0.2 s. Check: a frame.
3. The prompt shows exactly where E picks up: every case where E takes the object shows it, no case where E does nothing shows it (stick, fibre, stone; 1st
   and 3rd person). Check: case table, one row per object kind and camera.
4. Look (the owner's words): a small text, a translucent backing that fades out to the edges, smaller than the corpse prompt; 16:9 at 720p / 1080p / 2K / 4K.
   Check: frames at the four resolutions; the owner's eye on a mockup first.
5. Cost: the section's own time per minute in the log; the worst call ≤ 0.2 ms; A-B flight median `MsCPUBusy` no worse than without it.

## Recon so far (2026-11-01 21:1x, the live game by the remote)

- Sticks, fibre and stones are FOLIAGE INSTANCES, not actors — the game's highlight / prompt system (`ClientSetHighlightedObject`, `W_ActionTutorial`) never sees
  them, which is why no prompt exists (game map: `UpdateHighlightTarget` → native `PickupGatheringOneInstance(TraceLength, TraceRadius)`, `PickupInteractionDistance`
  25, `PickupTraceSphereRadius` 200, from the camera).
- `PickupGatheringOneInstance` is NOT a UFunction: absent from the controller's and the character's class chains (`ConanPlayerController`, `ConanCharacter`) and
  from every component of the hero (171; only `BP_Gathering_C` has `GetRandomPickupAmount`, `GetPickupLoot`) — its result cannot be read from Lua.
- A post-hook on `FunCombat_PlayerController_C:UpdateHighlightTarget` counted 0 calls in 3 s with the game in the BACKGROUND — not concluded: repeat with the game
  in front (the call may run only for the focused window or on input).

## Next steps

- [ ] R1. Repeat the call count of `UpdateHighlightTarget` with the game in front; if it runs per frame or on a timer, the prompt can ride it (our check only
      when the game itself asks «what is under the crosshair»).
- [ ] R2. Find the cheapest own test of «a pickup instance under the crosshair»: one sphere trace by the game's own numbers from the camera, on the call of R1,
      against the foliage pickup channel; measure its cost per call.
- [ ] R3. The look: a mockup frame on the game (small text, fade backing, smaller than the corpse prompt) → review folder for the owner.
- [ ] Code, cases 1–5, run report.
