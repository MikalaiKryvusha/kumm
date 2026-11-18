# Idea 26 — Conan: the «E Взять» plate hangs in the world over the item the probe sees

> **Created:** 2026-11-18 · tossed by the owner mid-task (the 0.9.1 build session), 19:06 +03:00 — a feature for the future, recorded, not worked
> **Parent:** the pickup prompt of KrinikConanUI (`krinik_pickup_prompt`, plan 42; notes `games/ConanExiles/mods/KrinikConanUI.md`)
> **Status:** 💡 recorded 2026-11-18 19:06 — the owner's own idea («фича на будушее, просто запиши в идеи»), no work before he takes it into a version
> **Outbound:** —

## The owner's words (verbatim)

`[OWNER]` 2026-11-18 19:06:

> фича на будушее, просто запиши в идеи
>
> E Взять должна появляться НАД предметом и держаться над ним. То есть, это не просто UI чать HUD, а становится AR XR частью мира - оно висит над предметов, в который смотрит щуп. И если герой двигается рядмо с предметом - эта плашка висит над предметом, уменьшается и увеличивается согласно законам перспективы 3D мира

## Goal vector (Achieve)

The plate «E Взять» stops being a fixed part of the HUD under the crosshair and becomes part of the world: it stands over the item the game's pickup probe
points at, stays over it while the hero moves near it, and grows and shrinks with the distance as any object of the 3D world does.

## Acceptance criteria (draft, for the day the idea is taken into work)

1. Situation: the hero looks at a stone the probe would take. Action: the hero walks around the stone. Result: the plate stays over the stone on every frame.
   Check: frames every 0.5 s of a walk around the stone — the plate's centre within a few pixels of the stone's projected top.
2. Situation: the same stone. Action: the hero steps back from 1 m to 4 m. Result: the plate's on-screen size falls with the distance by the world's perspective.
   Check: the plate's height at 1 m and 4 m in frames, the ratio ≈ the ratio of the projected sizes.
3. The cost stays within the build's CPU budget (MASTER_PLAN: 1 ms for all mods in the worst gameplay frame).

## The reference the owner named (2026-11-18 19:07)

`[OWNER]` «так сделано в Veloren, у них открытый исходный код, можно будет подсмотреть реализацию - это по моей фиче E Взять». Veloren (an open-source voxel
RPG, Rust) draws its interaction prompts over the item in the world — the recon starts from its source (how it projects the item's position, scales the label
by distance, keeps it over a moving camera).

## Notes for the future recon (not decided)

Two industry ways to recon first: a world-space widget component on an actor spawned at the item (UMG `WidgetComponent`, Space = World — real perspective), or a
screen-space widget placed each frame by `ProjectWorldLocationToScreen` with a scale by distance (cheaper, but per-frame work). The probe today gives «E would
take an instance» (`PickupGatheringOneInstance`); the item's world position must come from the same probe.

## Decisions made without the owner

None — the idea is recorded as said.
