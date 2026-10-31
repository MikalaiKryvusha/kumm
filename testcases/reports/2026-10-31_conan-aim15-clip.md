# Run report — 2026-10-31 · AIM15, the arrow at the bow (a 60 fps clip of a real shot)

## 1. Work

Case AIM15 of `testcases/TC_conan_build_stability_compat_perf_2026-10-26.md`: the arrow is visible leaving the bow (the owner's «появляется на 3 метрах»)
and lands under the crosshair.

## 2. Contour

Conan Exiles 3.0.1, the full build (pack `342c676`); background launch; the owner's oasis save (restored after); desktop HDR off for the clip, on after;
machine lock `kumm` 22:59–23:01.

## 3. Runs

- 2026-10-31 22:59 — `hdr.ps1 off`; `launch-bg.ps1`, `enter-world-remote.sh`, `god-on.sh`; `aim15.sh` (session scratchpad): `ffmpeg … ddagrab=output_idx=0:framerate=60
  -t 5 -c:v hevc_nvenc -qp 18 aim15.mkv` with `mouse-seq.ps1 -Seq "rdown,wait:1500,lclick,wait:1500,rup,wait:300"` 0.5 s after the start.
- 2026-10-31 23:00 — `ffmpeg -ss 1.9 -t 0.8 … fps=15,scale=960:540 -f image2` → a 12-frame grid; `close-game.ps1`, `hdr.ps1 on`, `save-restore.sh`.

## 4. Checks

Hygiene: none (no code changed).
Functional run: a real aimed shot in the live world; the archery log («#1 из лука, заряд 0.75: щуп — небо, 96.3 м», the flight at 0.3 s and 0.6 s) and the
clip's frames READ.

| Case | Status |
|---|---|
| AIM15 | partial — the shot went to the sky (no landing point); at 960 px the arrow near the bow is not discernible |

## 5. Found

none

## 6. Traces

Session scratchpad `seams/`: `aim15.mkv` (5 s, 60 fps, 38 MB), `a15_grid.webp`, `aim15_sheet.webp`.

## 7. Verdict

partial — a second clip at 23:03 (a frozen Kappa 10 m ahead, the hit logged) did not let the agent see the arrow at the bow; both clips went to the owner's review folder `40_arrow_clip`.
