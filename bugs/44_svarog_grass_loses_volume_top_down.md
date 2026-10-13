# Bug 44 — Svarog: grass loses its green volume when the camera looks straight down (≈90°)

**Status:** 🔴 OPEN
**Severity:** S3 (visual; owner-visible on the camera he uses)
**Version/build:** SvarogsDream `5f4137b` + working tree · **When/context:** 2026-10-13 evening, owner playing; tossed mid-task.
Owner's words: `[OWNER]` «шейдер травы странный. Если ровно под 90 градкусов камеру повернуть - зеленева травы исчезает» · «словно трава
тонкая, и под 90 нет объема травы» · 2026-10-13
**Test case:** `testcases/TC_svarog_loot_window_2026-10-13.md` W1

## Symptom
Camera pitch at the top limit (our camera mod: `MaxPitch` 90, clamped inside to `MaxSafePitch` 89.5, `KrinikCameraRework/Plugin.cs:742`)
— the green of the grass disappears; the grass reads thin, without volume. At lower pitch the grass is green and full.

## Repro
1. Any meadow (owner's save, day 10, Bara outskirts).
2. Rotate the camera down to the limit (≈89.5°).
3. Compare a `shot` at 85° and at 89.5° on the same spot.

## Hypotheses (ranked; nothing verified yet)
1. **Horses:** grass is vertical crossed quads (Unity terrain detail `WavingDoublePass` / Nature Shaders grass, bug 35 forensics) — seen
   straight from above, the quads are edge-on: only their thin edges and the ground remain. Standard remedies in the industry: tilt the
   quads toward the camera at steep angles (vertex shader), add a ground-tint layer under grass, or cap the pitch a few degrees short of 90.
2. Nature Shaders' view-angle fade (hides quads seen edge-on) fades the whole field at 90°.
3. Our grass changes (`krinik.shaders`, bug 35: alpha threshold ×0.3, fade distances) interact with the steep angle.

## Fix plan
Recon first (`researches/`): which shader draws the meadow grass at the hero (dump of `mats` near the hero), whether it has a view-angle
fade, how top-down games keep grass volume. Then a single change with frames at 85° / 89.5°, control with the change off.

## Decisions made without the owner
— (open)

## Links
`bugs/35_DONE_svarog_grass_melts_at_zoom_out.md` (grass materials and shaders inventory)
