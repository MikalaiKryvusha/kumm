# Bug 74 — «E Взять» does not show over eggs in a nest that E takes

**Status:** 🔴 OPEN · **Severity:** S2 · **Version/build:** pack ConanExiles `2e75ec0`, KrinikConanUI 1.0.0 (`krinik_pickup_prompt`) · **When/context:** 2026-11-02 09:00 +03:00, the owner's play
in the agent's run; `[OWNER]` «вот яйца, их пожно брать, а плашки Взять не появилось» · «баг» (his frame: two large eggs in a palm-leaf nest, the hero beside it,
camera above)
**Fixing:** the next session, first after the hub items of STATUS

## Symptom

Two eggs in a nest can be taken by E, but the light «E Взять» plate never appears over them (it does over stones, branches, fibre — plan 42).

## Repro

The owner's spot (the oasis save, a nest next to sand and grass, a creature camp around); stand by the nest, look at an egg.

## Forensics

- Actors within 4 m of the hero at 09:00 (remote, read-only): `BP_CampOwner_C` (187 cm), `StaticMeshActor` (181), `BP_ManualSpawnPoint_C` ×2, `CritterAIController_C` ×2,
  `NPCTerritorySpawner_C`, a `Corpse_C` — no egg actor of its own.
- The prompt knows only `PickupFoliageComponent_C` instances of 55 meshes (`KrinikConanUI.md` → `krinik_pickup_prompt`).

- **Recon 2026-11-02 14:00–14:03 (remote, read-only probes `egg_probe.lua` / `nest_probe.lua` in the session scratchpad):** the owner's frame is
  «Снимок экрана 2026-11-02 085957.png» (his Pictures\Screenshots): two large cream eggs in a palm-leaf nest on sand by grass, the camera above. Over every
  loaded `StaticMeshComponent` / `InstancedStaticMeshComponent` / `HierarchicalInstancedStaticMeshComponent` / `FoliageInstancedStaticMeshComponent` the only
  mesh named «egg» is `SM_SnakeEggs_single` (a `PickupFoliageComponent_C` — our prompt already covers that class, so snake eggs are not the case); «nest» —
  `SM_KappaNest` and `SM_Nest_ostrich` (static mesh actors); no actor class named egg or nest. The ostrich nest (teleport 14:02, −61703 268654 −15708) is a
  rock nest with no eggs — not the owner's. **Not found yet:** what the owner's eggs are. Next: the owner's spot (his coordinates, or the oasis nest he
  played at 08:59) → the probe there, also by mesh names without «egg» (the nest mesh itself with eggs) and the E target the game picks (trace the
  interaction under the crosshair at that nest).

## Hypotheses (ranked)

1. The eggs are foliage instances of a component class or mesh outside the 55 (a nest-egg foliage type) — check the components near the hero for an egg mesh.
2. The eggs belong to the camp (`BP_CampOwner_C` — a static mesh with an interaction the game resolves itself); then the game's own interaction prompt is
   missing, not ours — the control case (rule 24): our section off, does the game show anything?

## Fix plan

Recon first (hypothesis 1: list `FoliageInstancedStaticMeshComponent`s within 6 m and their meshes; hypothesis 2: the camp's components), then add the class /
meshes to the probe's list at the source of that list; a case in `TC_conan_hub_rows_audit_2026-11-01.md` (P13: the plate over nest eggs).

## Decisions made without the owner

(at closing)
