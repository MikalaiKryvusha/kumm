# Bug 89 — Conan: the reflections on the water flicker, like the palm-leaf shadows on the sand did

**Status:** 🔴 OPEN · **Severity:** S2 (the look the owner picked for the build) · **Fixing:** this session, after plan 51's measurements (R, C1, D)
**Version/build:** Conan 3.0.1 + the build, KrinikConanGraphics Engine.ini with software Lumen reflections (shipped 2026-11-09 01:48)
**When/context:** 2026-11-09 15:45 +03:00, the owner watching plan 51's measured pass in front (five still river beaches, 11:00, weather frozen, NPCs frozen)

## Symptom

`[OWNER]` 2026-11-09 15:45 «сейчас видно, как отражения на воде мерцают. Очень похоже, как тени листвы пальм мерцали на песку».
Twin of the owner's queue item 7 of 2026-11-07 20:05 (STATUS): «с шеудером водыы, предположительно, похожая проблема, как и с шейдером тени листвы пальм - есть какая- то
неестественная рябь, что-то то появляется то исчезает» — fine sparkling speckles over the oasis water (that was BEFORE the software reflections shipped).
Expected: a still reflection of the far shore, cliffs and palms; no part of it blinking from frame to frame.

**The scene — the owner's frame 2026-11-09 15:45 («вот эта сцена» · «запомни её, потом исследуем продлему»):** `river_bend` of plan 51 — start (98739, 205258), march −80,
view −46 (`water-scenes.sh` spec `"river_bend 98739 205258 -80 -46"`, game map → five river beaches): red cliffs on the left, rock spires and jungle haze ahead, palms on the
right bank. On his frame (chat only, 1188×900 crop): short DARK HORIZONTAL DASHES and grain over the whole water surface, denser and finer towards the far shore, broken
streaks across the reflected haze — a scan-line-like pattern, not a smooth reflection. Our still 4K frame of the same view without the interface from the measured pass:
`ws-ram/03_river_bend_sw.jpg` (scratchpad) → to be copied here as the «before» frame.

## Repro (deterministic — to build)

The stand of plan 51: `water-scenes.sh` scene (weather frozen, NPCs frozen, 30 s, 11:00), the camera still; a 60 fps recording of the water (memory «UI flicker needs a 60 fps
video» — a frame series at 6–7 fps misses one-two-frame blinks), then a strip over time (`burst-strip.py`) of the reflected palms.

## Hypotheses (ranked, not yet checked)

1. **Swaying palm leaves in the reflection** — WPO foliage (the bug 67 class): the reflection traces the Lumen scene / distance fields, where the leaves' WPO is not the
   drawn position; leaf cards drop in and out. Control: wind / WPO off (or the palms hidden) → the blink must go.
2. **The sun step** `DynamicSky.SolarUpdateAngleDelta=0.0025` (bug 67's fix for the shadows) re-lights the Lumen scene every small step; the reflection's lighting
   updates in steps. Control: time frozen at 11:00 vs moving.
3. **Software Lumen reflection noise** — temporal denoise of rough reflections; screen traces are off by design (the owner banned screen-space reflection). Control: `off`
   mode on the same view (no reflection) and rays (variant 6) — does the blink follow the mode?

## Fix plan

Control cases first (HOUSE_RULES rule 24: find who makes it), each A-B on the same still view with a 60 fps clip; the fix at the cause, then the cost A-B-A-B.
The owner foresees the route: `[OWNER]` 2026-11-09 15:45 «может и шейдер отражений в воде придется переписывать» — if the controls point at the water material, it is
overridden through the kit like bug 67's `M_Foliage` (our asset in the KrinikConanGraphics pak, `kit-buildmod.py`), not compensated by cvars.

## Decisions made without the owner

(filled at closing)

## Links

`bugs/67_DONE_conan_palm_leaf_shadows_flicker.md` · `games/ConanExiles/mods/KrinikConanGraphics.md` (water reflections section) · `testcases/reports/2026-11-09_conan-water-reflections-five-scenes.md` ·
`plans/51_conan_water_fps_after_ram_tuning.md`
