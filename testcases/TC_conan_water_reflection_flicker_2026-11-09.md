# TC — Conan: the water reflection flickers at river_bend (bug 89) — read the water-reflection levers, then variants A / B / C

> **Created:** 2026-11-09 · bug `bugs/89_conan_water_reflection_flicker.md`
> **Parent:** the owner's frame 2026-11-09 15:45 at river_bend; his target 16:59 «красивая вода и отркжения · без мерцаний · много FPS»
> **Status:** 🟡 running from 2026-11-09 17:0x
> **Outbound:** frames + 60 fps clips + FPS per variant → the owner (review folder), the chosen variant → KrinikConanGraphics Engine.ini

## Stand

Machine shared with KCCP (his builds run during the VISUAL part — no FPS numbers then; FPS only in his quiet window «окно твоё»). Game with the build, the river_bend view
of `water-scenes.sh` ("river_bend 98739 205258 -80 -46"), 11:00, weather stopped + frozen, NPCs within 600 m frozen, interface hidden for frames. Reflections `sw` (shipped).

## Cases

| # | Case | Expected | Status |
|---|---|---|---|
| V0 | read live: `r.Water.SingleLayer.Reflection`, `.DownsampleFactor`, `.DownsampleCheckerboard`, `.Denoising`, `.ScreenSpaceReconstruction`, `r.Water.SingleLayer.ForceVelocity`, `r.Water.SingleLayer.TiledComposite` | the values; if `Denoising` is already 1 — hypothesis 0 refuted | pass 17:0x — Reflection 1 · DownsampleFactor 1 · Checkerboard 0 · **Denoising 0** · SSR-recon 0 · ForceVelocity −1 · TiledComposite 1; Lumen.Reflections DownsampleFactor 1, Temporal 1, BilateralFilter 1; AA 4 (TSR) — no downsampling, NO denoiser |
| V1 | control: the shipped state at river_bend — 60 fps clip, a strip over time of the far water | the owner's dashes / grain blink between frames | pass — the flicker metric (mean abs frame-to-frame diff of the far-water band 0.47–0.62 of the height, 12 frames at ≈ 8 fps, background bursts, `flicker_metric.py`): 5.64 and 5.39 (repeat); the 60 fps clip replaced by bursts (game in the background, the owner at the keyboard) |
| VA–VC | variants A / B / C — the same clip and a 4K frame | A–C: no blink in the strip; the look for the owner's eye | A (Denoising 1): 4.17 · 4.11 · 4.05 (−26 %, ≈ −⅓ of the reflection's share); B = A (the factor is already 1); C (+ DownsampleFactor 2): 4.41; ForceVelocity 1 / 2 with A: 4.06 / 4.07 (no effect); reference rays: 5.43 → 4.66 with the denoiser — sw + denoiser is calmer than rays; strips: the grain / dashes gone, soft dark blotches where the cliffs reflect. Look → the owner, review folder 78 |
| VR | `r.Water.SingleLayer.Reflection 0` (reflection off on the water) | if the blink stays — not the reflection | pass — 1.23: the waves alone are calm; the blink is the reflection |
| FA–FC | one-minute capture per variant vs the shipped state, in KCCP's quiet window | the FPS cost of each variant | — |
