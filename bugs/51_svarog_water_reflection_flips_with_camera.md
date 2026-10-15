# Bug 51 — Svarog: water reflection near the Bara piers appears and vanishes with the camera angle; a far pond flickers sky ↔ reflection; house walls are not reflected

**Status:** 🔧 symptoms 1–2 — fix in code, deployed 2026-10-15 21:12 (clean restart), not proven: W1 blocked, W2 partial · symptom 3 —
NOT fixed: W3 fail (walls not reflected even at `ScreenReflectionMaxDist` 250) · needs the owner's eye and a camera through the water
**Severity:** S2 — a visible seam the owner shows on video
**Version/build:** SvarogsDream after `7edaccf`, ColorRework built 2026-10-15 ≈21:10 (`84566627eab8`)
**When/context:** 2026-10-15 ≈21:05, batch-3 run, the owner in the agent's game in Bara: `[OWNER]` «включи запись видео на 5 секунд … покажу
баг бете с отражением в воде» · «баг отражения увидел?» · «под разными углами то появляется отражение, то исчезает» · «и у дамов стены не
отражаются, только крыши» · «включи запись видео, ещё баг покажу с водой» · 2026-10-15
**Test cases:** `testcases/TC_svarog_batch3_smallbugs_2026-10-15.md` W1–W3

## Symptom
1. Bara piers, camera turning slightly: frame 1.0 s — full reflection of piers, stilts, houses; frames 0.5 / 1.5 / 3.0 s — none, only the
   sky colour (`SvarogsDream/_harness/water_bug/water_bug.mp4`, sheet `pair.webp`).
2. Camera low over the piers: the far pond switches frame to frame between blue (sky only) and dark (reflected shore) (`water_bug2.mp4`,
   `sheet2.webp`: blue in frames 1, 3, 6, 8; dark in 2, 7).
3. Houses at the water: only roofs are reflected, not walls (the owner said the same on 2026-10-13; the fix then — «near» from the hero —
   did not hold with the camera zoomed out).

## Root cause (by code, 2026-10-15)
1 and 2. `WaterReflection.OneReflectorPerMaterial` ran only with Lux full reflection; with screen reflection (`WaterSSPR`) on, EVERY plane
kept its Lux camera rendering the sky into a SHARED material — the water shows the texture of whichever plane Lux rendered LAST, and that
order follows the camera. When the last one was a plane SSPR did not process, the water near the piers had sky only. On top, SSPR processed
only the 3 planes nearest the camera; in Bara there are 6, three of them at 281 / 282 / 286 m — the set flipped with the smallest move
(`comps LuxWater_PlanarReflection 600`, 21:08).
3. `KrinikSSPR.compute`: within `_MaxDist` (80 m) of the hero everything low is reflected; beyond — only what is higher than `_MaxHeight`
(15 m) above water. With the camera zoomed out the houses are > 80 m from the hero: walls are cut, roof tops pass as «high».

## Fix
- `WaterReflection.cs`: one rendering reflector per material + height also with SSPR on — SSPR writes exactly into the texture the
  material shows.
- `WaterSSPR.cs`: `MaxPlanes` 3 → 6.
- `ScreenReflectionMaxDist` 80 → 250 live through the pult (21:08), config saved; the code default — after the owner's eye.

## Verification (2026-10-15, TC W1–W3)

- W1 blocked — 21:23–21:24, three `DemoOrbit` passes with screen recording: the camera circles the hero inside the inn, little water in
  frame; the owner's angle (through the water, `_harness/water_bug/water_bug.mp4`) is not reproduced by the console.
- W2 partial — 21:24 `water_fix3_sheet`: the far pond reflects piers and houses dark, no sky flicker in neighbouring frames; not the
  angle of `water_bug2`.
- W3 fail — 21:14 screenshot `owner_2113` (the owner's word): stilts reflect as orange streaks, no dark walls of piers or houses even at
  250 m. Symptom 3 stays open.

## Decisions made without the owner
- `[AI]` 250 m as «near» — from the zoomed-out camera of the video; the visual verdict is the owner's (taste class).

## Links
`bugs/40_svarog_mountain_reflection_pops_with_camera_angle.md` (same family, Lux full reflection) · `researches/svarogs-dream/water-sspr-recon.md`
