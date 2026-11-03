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
