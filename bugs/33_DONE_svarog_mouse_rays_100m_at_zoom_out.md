# Bug 33 — Svarog's Dream: game mouse rays reach 100 m, our zoom-out puts the camera at 123.8 m — hover, clicks, spells, pet commands

**Status:** ✅ DONE 2026-10-10 15:52 — fix deployed (KrinikCameraRework 1.3.1), hover and click verified on the owner's save (below)
**Correction 2026-10-10 19:07:** verified only on a NEAR banker (≈125 m from the camera). ×1.5 = 150 m is short of what a tilted camera
sees (160–290 m): far items and villagers stayed unclickable — found by the owner, fixed in 1.3.2 (`bugs/34_DONE_svarog_far_clicks_ray_150m_short_of_view.md`).
**Severity:** S2 — our mod broke game input at its own zoom-out; found by the agent, not reported by the owner
**Version/build:** SvarogsDream after `bcd55e7`; game release player, BepInEx · **When/context:** 2026-10-10, plan 18 item "hover over a
villager's icon does not change the cursor" (C7 of `testcases/TC_svarog_icons_service_2026-10-10.md`, 12:23)

## Symptom

At max zoom-out the system cursor over a villager's world icon stays default (handle 242353969), over the body it is "talk"
(935790973). The same in the build before the icon-service rework — older than that work.

## Root cause

- `CursorIcons.LateUpdate` on request casts `Physics.Raycast(ray, out hit, 100f, Item|Storage|Interactable)`. Our UI mod replaces
  the ray (`PatchClickRay`) so over an icon it goes from the camera to the icon's owner — correct direction, but 100 m long.
- Camera distance = `dst × zoom`; the vanilla max is ≈80 m from the hero, our `MaxZoomFactor` 1.5 puts it at **123.8 m** (harness
  `cursorinfo`, 15:32). The ray ends before the owner.
- Not only the cursor: a census of the decompiled `Assembly-CSharp` (rule — inside one method, after a ray source, every
  `Physics.Raycast*` passing `100f`) found **40 such rays in 33 methods** of 8 classes: `CastSpell` 24 (spell targeting, 13 of them
  inside coroutines), `PlayerController` 7 (clicks on items, recipes, villagers, inventory; petting; a first-world portal check),
  `CursorIcons` 3, `ConsumeManager` 1 (bomb throw), `AIControllableAnimal`, `AIDruidWolf`, `AIHuntingDog`, `AIWalkingDead` (orders
  to summons and pets). All of them silently stopped at our zoom-out.

## Fix

`KrinikCameraRework` 1.3.1 — `PatchMouseRayReach`: a transpiler over those 8 classes and their nested (coroutine) types replaces the
`100f` distance argument of `Physics.Raycast*` that follows a ray source with `100 × MaxZoomFactor` (camera ×1.5 → ray ×1.5).
`FORK:` options <A: lengthen the 100 m reach by the zoom factor | B: shift every mouse ray's origin forward by the extra camera
distance | C: fix only our icon ray> · price of error <A — rays reach 50 m further than vanilla design; B — skips anything within the
first ≈40 m of the camera, touches every user of the ray; C — leaves 39 of 40 rays broken> · consulted <the game's code (census,
`CursorIcons`, `PlayerController`, `CastSpell`); vanilla geometry — 100 m reach over an 80 m camera; Unity ScriptReference
`Camera.ScreenPointToRay` (the ray starts at the near plane)>. A keeps the vanilla ratio of reach to camera distance.

## Guard

`SvarogsDream/tools/ray-reach-check.sh` (called at the end of `tools/run-game.sh`): the mod's log line `sites=N methods=M` against
the census (`tools/ray_census.mjs`, 40/33). Proved: real log — exit 0; against the first census 31/8 (it missed rays held in a `ray`
variable) — RED, exit 3.

## Verification

`testcases/TC_svarog_mouse_ray_reach_2026-10-10.md`, report `testcases/reports/2026-10-10_svarog-mouse-ray-reach.md`:
C5 (40 in 33, matches the census) — pass; C1 — camera 123.8 m, body "talk", icon reading taken before focus — partial; C2–C4, K1
(hover and click on an icon at zoom-out, control at factor 1) — pending: the owner was at the screen with the mouse (remote desktop).

`TWINS: searched Physics.Raycast* with 100f after a mouse ray in Assembly-CSharp — found 40 sites in 33 methods: all patched;
200 m rays (3) reach past 123.8 m; unlimited ones (10) unaffected.`
`TWINS (camera distance, beyond rays): audio — the active AudioListener is the game's own at the hero (`Managers/SoundManagers/
AudioListener`, 0.0 m from him, enabled), the camera's listener is disabled (harness `callon … get_enabled`, 2026-10-10 15:54) — the
zoom-out does not quieten the world; LOD, shadows, grass, streaming and the far clip are already scaled by the camera mod itself.`

## Decisions made without the owner

- `[AI]` Reach = 100 × `MaxZoomFactor` rather than a fixed number — follows the owner's zoom setting.
- `[AI]` The guard counts sites, not behaviour; the behaviour is the mouse cases still to run.

## Links

plan 18 (the hover item) · `KrinikUIRework/IconClick.cs` (`PatchClickRay`) · EXP-0207 (the lesson) · EXP-0208 (the stamp slip on the way)

## ✅ STATUS: DONE (2026-10-10 15:52 +03:00)

- Hygiene: builds of the camera mod, the harness and the UI mod — no errors; guard self-test `node tools/test-guards.mjs` 138/138
  (two hook fixes found on the way); guard `ray-reach-check.sh` red on the wrong census, green on the real one.
- Functional run: the owner's save, his 1280×720 borderless mode, camera at max zoom-out 122.4–123.8 m, the system cursor read by the
  harness (`cursorinfo`): over the banker's icon — the same handle as over his body ("talk"); the control on 1.3.0 — the icon gives the
  default cursor; a right click on the icon opened the banker's conversation, "Leave" closed it. The guard printed "40 rays in 33
  methods — matches the census" at the end of the game launch.
- REAL WORLD: accumulated — the owner's save after his play, his mod configs; data and machine — his machine, his display mode;
  path — the mouse over an icon and a right click, as he plays. Not walked by hand: spell targeting and pet orders at zoom-out (the same
  mechanism and the same census).
- Standing falsehood: none — the plan 18 suspicion ("the cursor is reset every frame") is corrected in place in the plan.
