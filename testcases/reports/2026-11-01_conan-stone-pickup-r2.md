# Test run report — Conan: a stone picked up in third person at the default and the far zoom (case R2)

**Created:** 2026-11-01 12:46 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** Conan 3.0.1 build as deployed 12:3x (KrinikConanCamera with the widened pickup trace)

## 1. Work

Case R2 of `testcases/TC_conan_build_stability_compat_perf_2026-10-26.md` (owner's path: aim at a stone in third person, press E — picked at the default and the
far zoom); on the owner's 1.0.0 list («the third-person stone pickup — SPAWN the stone and test», STATUS 09:01); the stand rule 11.5a (`[OWNER]` 08:45 «ЗАСПАВНИ КАМЕНЬ!!»).

## 2. Contour

The owner's machine, the live build, game behind (`launch-bg.ps1`), oasis, god on. Stand: a real pickable stone found by code (foliage component instances,
not by eye), the hero placed 2 m from it, the camera aimed at it by `SetControlRotation`, the real E and the real wheel by `mouse-seq.ps1` while the owner was
idle. Spawning a stone was tried first: `AddInstance` on the pickup component returns −1 — the game takes no new pickable instance, so an existing one is used.
A respawned boss stood next to the hero once — killed before the presses. REAL WORLD: accumulated — the owner's save; data and machine — his PC; path — the real E key.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-01 12:41 +03:00 | remote: foliage components, `arr[i]:get()`, meshes and counts → `foliage.txt` | 134 meshes; pickable `SM_rock_small01…04` in `PickupFoliageComponent_C_*` |
| 2 | 2026-11-01 12:42 +03:00 | remote `AddInstance(…, true)` 2 m ahead | −1, no stone |
| 3 | 2026-11-01 12:43 +03:00 | nearest instance (#268, 20.5 m), hero 2 m east, aim; `mouse-seq.ps1 -Seq "kdown:E…"` | weight 65.10 → 65.16; #268 scale → 0 |
| 4 | 2026-11-01 12:44–12:46 +03:00 | wheel −1 ×33 (arm 503 → 2125), the next stone (27.9 m), hero 2 m east, aim from the far camera (2388 to the stone), E | weight 65.16 → 65.22; that stone's scale 0.85 → 0.00 |

## 4. Checks

Hygiene: none (no code changed).
Functional run: the real E pressed in the live game at two camera distances; read — the hero's weight (one stone = 0.06: 650 stones weighed 39.0 at 12:0x) and the
aimed instance's scale before and after; frames of the aim at both zooms.

| Check | Status | Observed |
|---|---|---|
| default zoom (as loaded; the camera 499 from the stone) | pass | +0.06 weight, the aimed stone hidden |
| far zoom (arm 2125, the camera 23.9 m from the stone) | pass | +0.06 weight, the aimed stone hidden |
| no interaction prompt seen on the frame before the press | note | the frame showed no «E» prompt over the stone, yet E picked it — the prompt look is not part of R2 |

## 5. Found

- The morning's «a foliage component's mesh is not readable» was wrong: an array element from `K2_GetComponentsByClass` must be unwrapped with `:get()` — corrected in the game map.
- `AddInstance` on a pickup foliage component returns −1: a stand stone comes from the existing instances, found by code.

## 6. Traces

`UE4SS.log` 12:41–12:46 (`[KrinikAgentRemote]`, `[KrinikConanCamera] ЗУМ`); frames `stone_aim*.webp`, `stone_far.webp` in the session scratchpad. Crash-report window: none.

## 7. Verdict

pass — a stone is picked up in third person by the real E at the default and at the far zoom.
