# TC — Conan: palm leaf shadow flicker levers at a smooth sun (bug 67), re-run of 2026-11-06

> **Created:** 2026-11-07 · **Parent:** `bugs/67_DONE_conan_palm_leaf_shadows_flicker.md`; recon `researches/conan-shadow-flicker/2026-11-06_vsm_foliage_recon.md`
> (experiments 1, 3, 4, 6) · **Status:** cases written 2026-11-07 13:32 +03:00, not run · **Outbound:** clips → the owner's review folder (taste class)

## Basis

`[OWNER]` 2026-11-06 19:26 — all three at once: the sun moves smoothly · the leaf shadows do not flicker · the cache is not redrawn constantly.
`[OWNER]` 2026-11-07 13:04 «можно так переделать пересчет листьев пальм, чтобы на мелких углах повората солнца ЛИСТЬЯ НЕ ПРЫГАЛИ ТУДА СЮДА, не скрывались и
показывались!!! · Повысить строгость их показа!» → first lever: finer sun texels (`ResolutionLodBiasDirectional[Moving]`), the build has −1.0, the game's Cine −1.5.

## Stand (HOUSE_RULES rule 11)

| What | Value | How set |
|---|---|---|
| Place | the oasis (−78166, 245999), palms over sand, no enemies within 40 m | `K2_TeleportTo` by the remote; `quiet-stand.lua` radius 40 |
| Hero | god mode, standing still | `god-on.sh` |
| Camera | fixed absolute view on sand under the fronds | `SetControlRotation` by the remote; pose recorded below after the first frame |
| Time of day | 10.0, set before EVERY clip | `BP_TimeOfDayManager_C:SetTimeOfDay(10.0)` inside `palm-shadow-series.sh` |
| Weather | as is (clear at the oasis) | — |
| Capture | HDR off, ddagrab 60 fps, 8 s, after 4 s settle | `palm-shadow-series.sh` |
| Metric | temporal 2nd difference in the sand box | `shadow_flicker_metric.py` |

Pose: (filled after the first frame)

## Cases

Every clip: same pose, same time 10.0; A-B-A order so wind drift shows. Lower 2nd-diff = calmer.

| # | Setting (light step · bias · extra) | Expected | Status | Observed |
|---|---|---|---|---|
| S1 | 0.003 · −1.0 (smooth sun, the build's bias) | flickers (the bug) | — | |
| S2 | 0.003 · −1.5 (the game's Cine) | calmer than S1 | — | |
| S3 | 0.003 · −2.0 | calmer than S2 or equal; no page-pool corruption (checkerboard / missing shadows) | — | |
| S4 | 0.003 · −1.0 (repeat of S1) | ≈ S1 — drift check | — | |
| D1 | 2.0 · −1.0 (the build now) | calm — the reference | — | |
| F1 | 2.0 · −1.0 · `r.Shadow.Virtual.Cache.ForceInvalidateDirectional 1` | ≈ D1 → redraw without rotation is innocent (exp. 1) | — | |
| R1 | 0.003 · −1.0 · `r.Shadow.Virtual.SMRT.RayCountDirectional 0` | crisp crawl → grid re-roll is the core (exp. 4) | — | |
| C1 | 0.003 · −1.0 · `r.Shadow.Virtual.Enable 0` | CSM shimmers too → generic rotating-map aliasing (exp. 3) | — | |

**Run 2026-11-07 14:2x–14:4x** (report `testcases/reports/2026-11-07_conan-palm-shadow-levers-wind-steps.md`; stand changed: fixed CameraActor, time 14.0,
window capture): S1/S4 **pass** (flickers: 0.19–0.32 vs still light 0.14–0.17); S2 **fail** (−1.5 not calmer: 0.31–0.37); S3 **fail** (−2.0 not calmer: 0.34–0.70;
no pool corruption seen in frames); D1 **pass** (0.14–0.17, the floor); F1, R1, C1 **blocked** (shot under the idle camera in series 3 — not re-shot).
Added: W (wind off, 0.003) — flickers like wind on → rotation drives it; K (steps) — 0.1 and 0.25 calm like 2.0, 0.05 blinks.

Control case (TESTING_FRAMEWORK step 5): D1 vs S1 — the same scene must show the difference, or the metric sees nothing.
