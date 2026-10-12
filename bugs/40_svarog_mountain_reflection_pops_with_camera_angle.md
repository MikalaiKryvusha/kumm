# Bug 40 — Svarog's Dream: the mountains' reflection in the water disappears and reappears as the camera angle changes

**Status:** 🔴 OPEN
**Severity:** S2 — a visible seam in the owner's view (water reflection flickers in and out while he turns the camera)
**When/context:** 2026-10-12 21:56, tossed by the owner mid-task (the agent was cataloguing HUD texts): `[OWNER]` «и огражение горы в воде
пропадает-появляется при изменеиии угла камеры» · 2026-10-12. Live game since 21:39, build `781b05e` (WaterReflection: Ground layer, bare
terrain in the reflection pass, one reflector per material — `OneReflector = true` in the config).

## Symptom
Turning the camera (yaw/pitch) — the mountains reflected in the pond vanish, then return, depending on the angle.

## Repro (to confirm)
Stand by the Bor pond, rotate the camera with the mouse; frames every few degrees (`shot`), `camrt Reflection` for the reflection texture.

## Root cause / Hypotheses (ranked, not measured)
1. `WaterReflection.OneReflectorPerMaterial` (every 0.5 s) keeps only the nearest VISIBLE plane of a material rendering and disables the
   rest; `Renderer.isVisible` and the nearest one change with the camera angle — the plane that renders may not be the one on screen, so
   the shared texture holds another plane's view (or a stale one) until the next tick.
2. Lux `OnWillRenderObject` renders only when that plane's renderer is visible to the camera; with the reflecting plane disabled or
   off-screen the material keeps the last image.
3. The reflection camera's far clip / oblique projection cuts the mountains at some pitches.

## Fix plan
Confirm 1 first: `cfg krinik.svarogsdream.colorrework Water OneReflector False` and rotate the same way — if the popping stops, the rule
of choosing the reflector is wrong (pick per frame in `Camera.onPreCull`, or reflect from every visible plane but cheaper).

## Decisions made without the owner
(filled at closing)

## Links
`ideas/13_svarog_otrazheniya_v_vode.md` · `bugs/39_svarog_frame_hitch_twice_per_second.md` · `researches/svarogs-dream/water-recon.md`

## Measured 2026-10-12 22:49–22:54 (pond near Bor, camera orbit at pitch 22°)
- Frames `SvarogsDream/_harness/r_three.webp` (columns: rule on · rule off · after fix): with «one reflector per material» the land
  patches on the water differ from the rule-off frames — the shared texture held another plane's view. Hypothesis 1 confirmed.
- Fix (`WaterReflection.cs`): group = material + plane height (0.1 m); the reflecting plane is chosen EVERY frame (was every 0.5 s).
  After the fix the patches match the rule-off frames.
- Cost, same place, `perf 8` median: reflection off 14.8 ms · old rule 14.9 ms (22:50) · after fix 19.2–20.0 ms · rule off 21.1 ms.
  So before the fix this pond's reflection was mostly NOT rendered (cheap and wrong — the popping). A correct ground reflection here
  costs ≈4.4 ms of the main thread, not the +0.5 ms accepted at 11:16 (measured at another pond). Fork for the owner: keep the correct
  reflection (+4.4 ms near ponds), or turn the planar reflection off until the GPU path (SSPR, idea 13 — owner: «нужно без нагрузки на
  процессор»).

## SSPR checked by day (2026-10-12 23:59)

- The GPU path exists now (`WaterSSPR`, SvarogsDream `707cf84`). With `Water.ScreenReflection = true` the Lux camera renders sky only, and the
  mountain comes from the screen pass (`farHigh`): by day after the row-order fix the mountain sits under the pond shore (C49, C51 pass;
  frames in `SvarogsDream/НА ОТСМОТР НИКОЛАЕМ/8 Вода - отражение экраном/`). So fork A no longer means "water without mountains": it means
  SSPR on (−3.1 ms CPU, +0.2 ms GPU at the Bor pond) instead of +4.4 ms. Known limit: a mountain whose top is above the screen edge is cut
  by a straight line. Still the owner's call.
