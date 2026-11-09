# Run report — Conan: the water reflection flickers far away (bug 89), live levers at river_bend

## 1. Work

Bug `bugs/89_conan_water_reflection_flicker.md` · cases `testcases/TC_conan_water_reflection_flicker_2026-11-09.md` (V0, V1, VA–VC, VR, FA–FC) · the owner's frame 15:45 and his
target «красивая вода и отражения · без мерцаний · много FPS»; his look rule 17:40–17:41 (near water sharp, no denoiser).

## 2. Contour

Game `D:\Games\Conan Exiles 3.0.1` with the build, background path (4 sessions: PIDs 21260, 23608, 12132, 5828 — each closed by PID), the river_bend view of
`water-scenes.sh`, 11:00, weather stopped + frozen, NPCs within 600 m frozen, HUD hidden; machine shared with KCCP (visual work during its builds, FPS only in its quiet window).
Meter: `ConanExiles/_config/flicker-metric.py` — mean abs frame-to-frame difference over a 12-frame `capture-burst.ps1` series, wide band (y 0.47–0.62) and the owner's spot
(x 0.52–0.66 · y 0.465–0.52).

## 3. Runs

- 2026-11-09 17:02–17:09 — V0 read-back, control, denoiser, half res, no reflection, velocity modes, rays (`pult.sh "exec …"` + bursts).
- 17:16–17:20 — A-B video `ab-video.sh … water_denoiser_ab` (3 s × 5), re-recorded after the schedule fix.
- 17:22–17:27 — `static-bench.sh b89-denoise{0,1}` × 2 in KCCP's quiet window.
- 17:28–17:35 — material levers on the MID (`SetScalarParameterValue`), Lumen / TSR / DLSS cvars.
- 17:38–17:41 — two A-B videos (denoiser + 32 frames; + roughness 0.15).
- 17:42–17:55 — levers without the denoiser (Fresnel roughness, TSR anti-flicker, history 200, reflection jitter, wave levers).
- 17:51–17:58 — horizon material swap; render-target census.
- 18:10–18:27 — research levers (TAA, coastline, foam, horizon specular); permutation swaps.
- 18:33–18:37 — Epic's `Water_Material_Ocean` swapped in; native screen percentage.

## 4. Checks

Hygiene: every cvar / parameter read back after setting; the flicker metric re-run on known bursts after its box change.
Functional run: the live game, background path; frames and strips LOOKED AT for each state; the owner watched the A-B videos and the live screen.
- Shipped state: the water denoiser is OFF; owner's spot 6.2 (no reflection 1.0).
- Denoiser: 3.5 at the spot, 0 FPS cost (71.2 / 72.2 → 71.8 / 72.9) — REJECTED by the owner (soap near).
- No lever without the denoiser reaches the root (TAA worse 8.85; others within the base's spread); history 200 −10 %; Epic's own material blinks alike (owner 18:35).
- Material swaps: the FluidFlux permutations and the horizon MI hide the water; setting the old MI back does not restore it (owner saw it first, 18:28).

## 5. Found

- The root (web + kit shaders): Lumen forces Single Layer Water reflections to mirror since 5.1, with sub-pixel wave normals far away → aliasing; no cvar exists; the fix is
  a rebuild of the Lumen global shaders (route A, chosen by the owner and deferred).
- `SetWaterMaterial` on the live ocean is a one-way door (EXP-0496).
- `r.NGX.DLSS.Enable` reads 0 in 3.0.1 (TSR is the AA); `r.TSR.ShadingRejection.Flickering` 0; `r.Lumen.Reflections.SmoothBias` 0.3.

## 6. Traces

Bursts, frames, strips, videos: session scratchpad `b89/` (removed at the session sweep); review folder `D:\Games\Conan Exiles Mods\НА ОТСМОТР НИКОЛАЕМ\78_voda_shumodav\`
(frames, crop, loop, `04_video_AB_3s_x5.mp4`); research `researches/fluidflux-distant-shimmer/README.md`; captures `_bench/2026-11-09_172*_b89-denoise*.csv`.

## 7. Verdict

partial — the cause is identified and confirmed; no fix ships (the denoiser rejected, route A deferred by the owner).
