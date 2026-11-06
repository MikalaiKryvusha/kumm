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
