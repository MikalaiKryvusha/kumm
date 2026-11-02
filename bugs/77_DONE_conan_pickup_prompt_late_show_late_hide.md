# Bug 77 — «E Взять» shows up seconds late and stays seconds too long

**Status:** ✅ DONE · **Severity:** S2 (a visible lag of a core prompt) · **Version/build:** pack ConanExiles `40db56d`, KrinikConanUI 1.0.0 (`krinik_pickup_prompt`) ·
**When/context:** 2026-11-02 14:18–14:19 +03:00, the owner's play after the chat's closure
**Fixing:** FIRST in the next chat

`[OWNER]` «перестала появляться E взять» · «чини!» · «прямо сейчас на палку смотрю.» · «с какой-то должгой задержкой появляется и долго не исчезает» · 2026-11-02 14:18–14:19.

## Symptom

Looking at a stick on the ground (≈ 5–6 m before the hero, frame `stick.jpg` of the session scratchpad, 14:19), no «E Взять»; when it comes, it comes late and
it stays on after the view leaves the pickup.

## Forensics (14:18–14:19, remote, read-only)

- The section runs: the log line every ≈ 12.5 s «за 60 проверок своё время … близких компонентов 2 из 279–281» — and the near count stayed 2 while the hero walked
  33 m. The plate exists in the crosshair (`HB_KrinikPickup`, Collapsed, opacity 0).
- Instances within 3 m of the hero: two `PickupFoliageComponent_C` small rocks (the section's «2»), no branch — the stick lies beyond 3 m.
- Code (`krinik_pickup_prompt.lua`): `refresh_near` walks the component list `NEAR_SLICE` = 20 per check, round robin, over ≈ 280 components → a full cycle is
  ≈ 14 checks; while the plate is hidden the check runs once a second (5 / s only while it shows — the owner's 09:04 word) → a pickup that just came within
  `NEAR_CM` 600 can wait up to ≈ 14 s to enter the near set. The same arithmetic was seen 2026-11-02 morning («E Взять» up to ≈ 14 s late, STATUS).
  The late HIDE is not explained yet (the shown check runs 5 / s).

**14:20, the owner:** `[OWNER]` «фейд плохой, контур E не действует на фейд!» — the fade does not reach the E key rim (`Brd_KrinikPickupKey`, its brush outline): the word and the backing fade, the rim stays. Likely the fade drives the plate's `RenderOpacity` of children that do not include the rim's own brush, or the rim is a sibling outside the faded box — check the tree (`KrinikConanUI.md` → `krinik_pickup_prompt`: `HB_KrinikPickup` = E in its own rim + «Взять») and fade ONE parent.

**14:22, the place:** `[OWNER]` «и слишком далеко плашка от центра» · «поднять выше в одну линию с точной прицела, и правее» — the plate's default place moves: vertical = the crosshair dot's line (today +6 %), horizontal = closer to the centre (today −14 %); the defaults live in the hub rows `ui_pickup_x` / `ui_pickup_y` (`krinik_mod_settings.lua` PAGES and the section's fallbacks) — pick the new x by a frame with the owner's camera, the plate left of the dot without touching it.

## Fix plan

**The owner's direction 14:20 (supersedes the near-set idea below):** `[OWNER]` «ДА НЕ СПИСКО БЛИЗКИХ УЖНО ПРОВЕРЯТЬ!» — no near list at all: check WHAT THE CROSSHAIR LOOKS AT. A line trace from the camera through the crosshair (the game's pickup reach, our camera's boom accounted for) returns the hit component and its instance index (`HitResult.Component`, `Item`); a `PickupFoliageComponent_C` hit with a live instance → the plate; anything else → no plate. One trace per check, no list, no round robin. `[OWNER]` 14:20 «А ЩУП ИЗ ПРИЦЕЛА!» · «КОТОРЫМ И ПОДНИМАЮТ!» — the probe is THE GAME'S OWN pickup probe, the one E uses to take the item: find that function in the hero's interaction code (bytecode / the E input path — `PickupInteractionDistance`, `PickupTraceSphereRadius` are its numbers) and call it / read its result at the check, so the plate shows exactly when E would take something — never a copy of the search. `[OWNER]` 14:21 «ЭТИМ ЖЕ ЩУПОМ РАЗ В СЕКУНДУ ЩУПАТЬ, ЕСТЬ ЛИ В ЗОНЕ ВЗЯТИЯ ТО, ЧТО МОЖНО ВЗЯТЬ!» — the rate: the same probe once a second while hidden (5 / s while shown — his 09:04 word stays); the near list and its round robin are removed.

1. (superseded) Cause: the near set depends on a slow round robin. Rebuild it by the hero's MOVE, not by the clock: when the hero has moved ≥ 3 m since the last full pass
   (or on the first check after a teleport), re-check ALL components at once (measure: 281 × `GetInstancesOverlappingSphere` — was 0.18 ms per 20 → ≈ 2.5 ms
   once per 3 m of walking, inside the 1 ms rule only if spread: then a full pass split over the next 3 checks), and keep the slice for the idle hero.
2. The late hide: log the moment the probe stops hitting and the moment the plate fades; check the fade (0.2 s) and whether a hit on the SAME instance after the
   pickup is taken keeps it.
3. Cases (new TC): walk up to a stick from 15 m — the plate within ≤ 0.5 s of the stick entering 6 m; look away — the plate gone ≤ 0.4 s; the cost line per minute.

## The fix (2026-11-02, pack `008faf4`)

- **The game's own probe, found:** `UpdateHighlightTarget` (bytecode, `uaj func … FunCombat_PlayerController.uasset VER_UE5_6`) calls the STATIC
  `/Script/ConanSandbox.EnvironmentFunctionLibrary:PickupGatheringOneInstance(WorldContextObject, Actor, Controller, Eye, ViewDir, TraceLength, TraceRadius,
  out OutFoliage, out OutInstance) → bool` (an `EX_CallMath`; plan 42 had searched only the controller / character chains and wrote «not a UFunction»).
  Its arguments in the game: `Eye` = the active camera (`AdjustableCamera` in first person, else `CameraThirdPerson`) + its forward ×
  `InteractionDistanceThirdPersonBonus` (0 in first person, else `ThirdPersonSpringArm.TargetArmLength` — the game writes the field only at an E press, so the
  section takes the arm length itself), `ViewDir` = the camera forward, `PickupInteractionDistance`, `PickupTraceSphereRadius`; true → the game makes that
  instance E's target (`ServerSetHighlightedObject`). The function only searches.
- `krinik_pickup_prompt` calls it once a second, 5 / s while the plate shows; the component list, its births and the round robin are gone.
- The E rim: a RoundedBox outline ignores the parent's render opacity (frame at opacity 0 — the white square stayed); `set_rim` drives its alpha with the fade.
- The place: the slot aligned by its right edge and middle (1.0, 0.5) at the crosshair; defaults x −1 %, y 0 % (hub rows `ui_pickup_x/y`, the same in
  `krinik_mod_settings.lua`).

## ✅ STATUS: DONE (2026-11-02 15:11 +03:00)

Hygiene: `luac -p`, `check-lua-game-thread.py` 0, `check-lua-shadow.py` 0.
Functional run: the live game, cases N0–N8 of `testcases/TC_conan_pickup_native_probe_2026-11-02.md` pass — the plate 0.3–1.2 s after the view lands, gone
0.3–0.4 s after it leaves, 0.9 s in a place 150 m away (was up to ≈ 14 s), a real E takes the probe's target, the rim fades, the place by a 4K frame; cost
0.089 ms a check. Report `testcases/reports/2026-11-02_conan-pickup-native-probe.md`.
REAL WORLD: accumulated — the owner's game folder and his oasis save, his camera `config.lua` (kept byte-equal through the deploys); data and machine — his
machine, his save; path — the hero looking at stones and pressing E, as he plays. Verified on the real world, except his own eye on the new place.

## Decisions made without the owner

- `[AI]` The exact x default −1 % (the plate's right edge ≈ 60 px left of the dot at 4K): «левее точки, не касаясь» was his; the number is mine, set by one
  4K frame — his eye decides, the hub row moves it.
- `[AI]` The plate is anchored by its right edge (so x 0 = touching the dot) instead of its middle — the row's meaning changed; no saved value existed
  (`KrinikSettings.lua` held only `arc_wave`).
- `[AI]` Third / first person per the game's branch; first person not run (one camera case left, TC coverage note).
- `[AI]` `InteractionDistanceThirdPersonBonus` taken from the arm length instead of the controller field (0 until the first E press) — the same number the
  game writes at the press.
