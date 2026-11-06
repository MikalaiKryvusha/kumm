# Bug 82 — over the eggs in a nest our «E Взять» never shows, although the hero takes them with E

**Status:** 🔬 research · **Severity:** S3 (a missing hint; E works) · **Version/build:** pack ConanExiles `4a739c1`, KrinikConanUI `krinik_pickup_prompt`
· **When/context:** the guide's chapter «Известные проблемы и планы на 1.0.0» (2026-11-02); this document 2026-11-03 23:06 +03:00 (chat cb012770 dayloop)
**Fixing:** the next chat — the study first (below)

## Goal vector (Achieve)

Over a nest's eggs the «E Взять» plate shows exactly when E would take an egg.
Acceptance: a frame with the crosshair on a nest egg shows the plate; a real E then takes the egg (the hero's inventory gains it).

## Symptom

The guide's line: «Над яйцами в гнезде подсказка «E Взять» не появляется, хотя герой берёт их клавишей E.»

## Forensics (2026-11-03 23:1x, remote, read-only)

- The plate asks the game's own foliage probe `EnvironmentFunctionLibrary:PickupGatheringOneInstance` once a second (bug 77); the game map lists eggs
  among the 55 meshes of `PickupFoliageComponent_C` near the oasis.
- At the ostrich-nest canyon (−61703, 268654; the hero landed at z −15575): no actor within 25 m whose class names a nest, an egg, a harvestable or a
  pickup; no `FoliageInstancedStaticMeshComponent` with an «egg» or «nest» mesh within 30 m (`GetInstancesOverlappingSphere(hero, 3000, true)` → 0). So this
  canyon has no eggs now (taken, or never there) — the stand is elsewhere.

- Over ALL loaded foliage (23:1x): the only egg mesh among the pickups is `SM_SnakeEggs_single` (`PickupFoliageComponent_C`, 57 instances); at the nearest
  untaken one (−62077, 254132, −20093) with the hero 0.6 m off looking down: our plate visibility 3 / opacity 1.00 and the game's probe `true` — snake eggs
  are fine. So the guide's «яйца в гнезде» are NOT foliage pickups (an ostrich / bird nest is another kind of object) — the study goes to step 2.

- Asset names (23:2x, `retoc-5.8 list --path <chunk>.utoc` over the 37 game chunks, grep «nest» / «egg»): the nests are PLACEABLE meshes —
  `Items/Placeables/meshes/SM_Nest_ostrich`, `SM_snake_nest_swamp`, `SM_branch_nest`, `SM_branch_nest_small`, `SM_locust_nest_desert|swamp` (pakchunk1050),
  `Environment/Props/Meshes/SM_KappaNest` (pakchunk1030); egg-like foliage types exist in the DLC (`DLC_Siptah/…/FT_Siptah_SerpentEgg_1…3`) and placeable
  egg blueprints (`DLC/Special/a2c4/…/BP_PL_Spider_Eggs_Randomized`). No loaded actor's class names a nest or an egg in the oasis region.

- 23:3x: over all loaded foliage of the oasis region no mesh names a nest (0); with no nest actor either, a nest is to find in another region
  (the ostrich lands, the swamp for snake / locust nests) — load the region by a teleport first, then repeat the two counts.

- 2026-11-06 12:45 +03:00 (chat of 2026-11-06, second): the game maps know only the ostrich-nest canyon (no eggs there). Next concrete step: in a region load, list the
  loaded `StaticMeshActor`s / components whose mesh is `SM_Nest_*` / `SM_KappaNest` / `SM_*_nest*` (the nests are placeable meshes) — their positions give
  the stand; then the actor under the crosshair at that nest (a container or a harvestable) — its class decides the fix.

- **2026-11-06 12:49 +03:00 — FOUND the nest eggs (the oasis save, read-only scan `nest_scan.lua`, actors only, class defaults skipped):** the eggs a hero takes with E are
  `/Game/Items/GatheringResources/SM_KappaEggs_Blueprint.SM_KappaEggs_Blueprint_C` — a gathering-resource ACTOR (3 loaded, the nearest 70 m from the oasis
  spawn), next to `SM_KappaNest` meshes (`StaticMeshActor` `SM_KappaEggs*` in `Gameplay_NPCs_Desert_SouthWest`). The 13 vulture nests (`SM_Nest_ostrich` mesh,
  `Wildlife_split113`) are plain decoration. Our plate asks only the FOLIAGE probe (`PickupGatheringOneInstance`) — an actor of this class is outside its
  question: that is the cause, most likely. NEXT: stand the hero at the 70 m Kappa eggs, read the actor's interaction (its functions — `funcs SM_KappaEggs_Blueprint_C`)
  and what the game shows under the crosshair; then the plate asks the same question for this actor kind (an event, not polling — house rule 7).
- **2026-11-06 12:53 +03:00 — the actor read:** `SM_KappaEggs_Blueprint_C` derives straight from `Actor`; the nearest instance `Wildlife_split042…SM_KappaEggs_North_Camp_12` at
  (−89380, 232461, −20150). Its blueprint (offline: `retoc to-legacy` + `uaj exports`) holds ONE component of eggs — `InstancedBushes`, a plain
  `InstancedStaticMeshComponent` (not the foliage `PickupFoliageComponent_C` the plate asks about). So the eggs are mesh INSTANCES inside a level actor; the
  game most likely takes them by its gathering of instanced meshes (`Gathering_v2/ItemNameToTemplateID` by the mesh name). NEXT: at that egg, call the same
  probe the plate uses with this component (or the game's interaction trace) and see what it answers; then widen the plate's question to instanced meshes
  of such actors. Remote notes: `funcs` / `dump` by the instance name answered nothing; components through `K2_GetComponentsByClass` — an empty list (the
  Lua conversion of the returned array — to look at). Note: the plate already asks the game's OWN probe — `PickupGatheringOneInstance`, the call of
  `FunCombat_PlayerController:UpdateHighlightTarget` (bugs/77) — so if E takes these eggs, `UpdateHighlightTarget` reaches them by ANOTHER branch: read its
  other calls in the bytecode trace of bug 77 (`kismet-trace.py`) and ask that one too.
- **2026-11-06 12:56 +03:00 — `UpdateHighlightTarget` read** (`kismet-trace.py` over the 3.0.1 `FunCombat_PlayerController`, 1 122 lines): two branches — (1) the probe the plate
  uses, `PickupGatheringOneInstance`; (2) `SphereTraceMulti` / `LineTraceMulti` keeping hits whose actor (or its `InteractTargetOverride`) implements
  `InteractableInterface`. The eggs blueprint implements NO interface (its names hold none) → if E takes these eggs, it is branch (1), the same probe — so the
  decisive case is AT the egg: the hero 1–2 m from `SM_KappaEggs_North_Camp_12` (−89380, 232461, −20150), the crosshair on an egg, the plate's probe answer
  and a real E (front path). If the probe says false and E takes the egg, the take is not `UpdateHighlightTarget` at all — read the E press handler next.
- **2026-11-06 13:01 +03:00 — the decisive case run (G1):** hero teleported 150 cm from egg 0 of `SM_KappaEggs_North_Camp_12` (5 egg instances), view aimed by
  `SetControlRotation` (`ConanExiles/_config/egg-stand.lua`, `egg-probe.lua` — run by `pult.sh "lua return dofile('…')"`, stand first, probe after ≥ 2 s): the plate's own probe,
  called exactly as the plate calls it, answered **true twice** (camera→egg 439–448 cm, arm bonus 230, reach 90, radius 200). Yet the frame at that moment
  (4K window capture) shows NO «E Взять» plate at the crosshair (the hero stood inside the nest's palm bush). So the probe sees the eggs, and the plate's own
  gating hides it — read `krinik_pickup_prompt.lua` around the call (line ~207: what runs before `show(found)` — a timer not started in this state, a
  distance or component-class filter, the bug-80 rule «off while the corpse strip is on screen») and re-run G1 with the plate's log on. A real E there —
  not done yet (front path).
  The gating read (`krinik_pickup_prompt.lua:199-200`): before the probe the plate hides when `GUIModuleController:IsModuleActive(CONTAINER_MODULE)` or
  `strip_on_screen()` (a remembered `FloatingNames` strip `IsInViewport` + `IsVisible` — the bug-80 rule «yield to the game's own strip»). NEXT at the G1 stand:
  read those two values in that same second (most likely suspect — a `FloatingNames` strip of the nest / a nearby corpse counted as «on screen» though not
  seen in the frame); then fix the gating by the cause, not by an exception for eggs.

## Study (next)

1. Find eggs: over all `InstancedFoliageActor`s, the components whose mesh names an egg — their instances with `Scale3D` ≠ 0 (not taken), the nearest.
2. If nest eggs are not foliage at all: the actor under the crosshair at a real nest (`GetHitResultUnderCursor`-like trace from the camera) — its class.
3. Stand by the remote at the nearest egg: our probe's answer (`PickupGatheringOneInstance` from the same start as the plate) — true / false; a real E —
   what happens.
4. Fix by what is found: the probe's distance/start for eggs, or an actor kind our plate does not ask about.

## Decisions made without the owner

— (open)

## Links

Bug 77 (the plate asks the game's probe), bug 80 (the plate yields to the corpse strip), game map «Foliage pickups — what they are».
