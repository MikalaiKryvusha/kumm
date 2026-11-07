# Run report — Conan: palm leaf shadow flicker — sun texel bias, wind, light step (bug 67)

## 1. Work

Bug 67 against the owner's acceptance (2026-11-06 19:26: smooth sun · no leaf-shadow flicker · no constant cache redraw) and his word of 2026-11-07 13:04
(«ЛИСТЬЯ НЕ ПРЫГАЛИ ТУДА СЮДА… Повысить строгость их показа!»). Case set `testcases/TC_conan_palm_shadow_levers_2026-11-07.md`; recon experiments 2 (no WPO)
and 6 (texel bias) of `researches/conan-shadow-flicker/2026-11-06_vsm_foliage_recon.md`, then step sizes (pattern C).

## 2. Contour

Conan Exiles 3.0.1 with the build (pack `d85dfbe`), 3840×2160, god mode; the oasis near (−77938, 245051); a FIXED CameraActor view target at
(−77438, 245551, −19817), pitch −30, yaw −135 (`_config/fixed-cam.lua`); time of day 14.0 set before every clip; humanoids and beasts cleared within 40 m
before every clip; values set live by the remote (`exec`), 4 s settle; capture = the game WINDOW by `gfxcapture` (Windows Graphics Capture, 8-bit SDR,
variable rate ≈ 40–45 fps), metric over the sand box (200, 1200)–(3700, 2100) with repeats dropped. Wind off = `MPC_BiomeSettings` `WindIntensity`,
`Wind Speed`, `Wind Strength` 0 (live 0.1) + level `WindDirectionalSource2` strength 0, speed 0 (live 0.1 / 3.482).

## 3. Runs

2026-11-07, one launch (13:32). `bash _config/palm-shadow-series.sh <out> "<label>|<cvar> <value>;…"` with `TOD=14.0 QUIET=40 BOX="200 1200 3700 2100"`.
- 13:38 series 1 — INVALID: ddagrab recorded the owner's VS Code (the game went behind when he typed) — all 0.000; clips deleted.
- 13:5x series 2 and 3 — INVALID: the oasis camp boss fought the god hero (quiet-stand missed `HumanoidNPCCharacter_20percentbigger_boss_C`), then
  the idle camera orbited (no real input ≈ 30 s); clips deleted. Fixes: `quiet-stand.lua` prefix → `HumanoidNPCCharacter`; fixed CameraActor.
- 14:2x wind series 8 s ×12 (wind off, then on) · 14:3x step series 12 s ×10 (wind on).

## 4. Checks

Hygiene: none.
Functional run: walked on the real game at the oasis; frames read by eye (shadows of fronds on the sand in every valid clip; first wind-off series
re-shot — it was measured on bare sand after a time-of-day change, 0.06 everywhere, invalid); the metric READ per clip (2nd-difference median, lower = calmer):

| Light step | Bias | Wind off | Wind on |
|---|---|---|---|
| 0.003 (every frame) | −1.0 (build) | 0.189 · 0.313 | 0.316 · 0.157 |
| 0.003 | −1.5 (game Cine) | 0.367 | 0.314 |
| 0.003 | −2.0 | 0.340 | 0.702 |
| 2.0 (build) | −1.0 | 0.144 · 0.150 | 0.156 · 0.173 |

Step series, wind on, bias −1.0 (median / p90):

| Light step | Clip 1 | Clip 2 |
|---|---|---|
| 2.0 | 0.160 / 0.220 | 0.166 / 0.221 |
| 0.25 | 0.148 / 0.201 | 0.158 / 0.222 |
| 0.1 | 0.136 / 0.205 | 0.155 / 0.232 |
| 0.05 | 0.180 / 0.684 | 0.186 / 0.473 |
| 0.003 | 0.386 / 0.604 | 0.218 / 0.327 |

## 5. Found

1. The light turning every frame flickers at this stand **with and without wind**; a still light is the calmest in all 6 clips. On this stand the
   rotation drives the flicker; the wind at its live 0.1 adds no measurable share (the owner's 14:19 reading «во многом вызваны ветром» is not seen here —
   one stand, one wind strength).
2. Finer sun texels (−1.5, −2.0) do not calm it — equal or worse. Lever (1) of the 13:04 plan is refuted.
3. Steps of 0.1° and 0.25° are as calm as 2.0 (median and p90); 0.05° shows a blink per step (p90 0.47–0.68). A 0.1° step moves a 10 m palm's
   shadow ≈ 2 cm, about once a second.
4. Stand defects found and fixed: desktop capture records whatever is in front (→ window capture); quiet-stand missed the camp boss; the idle camera
   ignores SetControlRotation (→ CameraActor view target, no input needed).

## 6. Traces

Clips `D:\Games\Conan Exiles Mods\_shadow_runs\2026-11-07_wind\`, `…\2026-11-07_steps\`; review folder 71 (`НА ОТСМОТР НИКОЛАЕМ\71_teni_palm_shag_sveta`, clips 1–4 +
`chto_smotret.md`); tools `_config/palm-shadow-series.sh`, `fixed-cam.lua`, `shadow_flicker_metric.py`, `quiet-stand.lua`.

## 7. Verdict

partial — the measurement points to a 0.1° (or 0.25°) light step: calm like 2.0, steps 8–20× smaller (the sun disk: per the game's help the delta turns only the light — NOT checked by eye); the build stays at 2.0
until the owner's eye on folder 71 (taste class). The live game was returned to 2.0 / −1.0, wind restored, the view back on the hero.
