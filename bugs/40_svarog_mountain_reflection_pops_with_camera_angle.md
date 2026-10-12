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
