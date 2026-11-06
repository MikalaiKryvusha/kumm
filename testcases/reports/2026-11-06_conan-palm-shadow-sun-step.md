# Run report — Conan: palm leaf shadow flicker vs how often the sun's light turns (bug 67)

## 1. Work

Bug 67, the owner's acceptance of 2026-11-06 19:26: the sun moves smoothly · the leaf shadows do not flicker · the shadow cache is not re-rendered
constantly. Basis: the game's own help of `DynamicSky.SolarUpdateAngleDelta` («How many degrees can the sun/moon move in the sky before we rotate the
corresponding directional light to match») and the web recon `researches/conan-shadow-flicker/2026-11-06_vsm_foliage_recon.md` (the light's turn
re-samples the VSM pages — Epic, Fortnite write-up).

## 2. Contour

Conan Exiles 3.0.1 with the build, foreground path, 3840×2160, god mode; the oasis (−78166, 245999) at 09:10, the hero still, the camera still; palm
shadows on sand in the box (2100, 1300)–(3700, 1650). Values set live by the remote (`exec`), 4 s settle, 6 s ddagrab + NVENC at 60 fps.

## 3. Runs

2026-11-06 19:36–19:38 +03:00, one launch: `run <delta> <bias> <label>` = `pult.sh "exec DynamicSky.SolarUpdateAngleDelta <delta>"` + both
`r.Shadow.Virtual.ResolutionLodBiasDirectional[Moving] <bias>` → `ffmpeg -f lavfi -i ddagrab…` → `python _config/shadow_flicker_metric.py <clip> 2100 1300 3700 1650`;
order A1 D1 B C E F A2 D2.

## 4. Checks

Hygiene: none.
Functional run: walked on the real game at the oasis; the metric READ per clip (temporal second difference of the region — smooth sway ≈ 0, jitter high):

| Clip | Light step | Bias | 2nd-diff median | p90 |
|---|---|---|---|---|
| A1 / A2 | 0.003 (smooth light) | −1.0 | 1.552 / 0.860 | 2.266 / 1.751 |
| E | 0.003 | −1.5 (the game's Cine) | 1.095 | 1.757 |
| B | 0.1 | −1.0 | 0.642 | 0.952 |
| F | 0.1 | −1.5 | 0.568 | 1.063 |
| C | 0.25 | −1.0 | 0.564 | 0.760 |
| D1 / D2 | 2.0 (the build now) | −1.0 | 0.806 / 0.569 | 2.173 / 0.779 |

## 5. Found

1. A light turned almost every frame (0.003) flickers ≈ 1.5–2× more than any stepped value; 0.1 and 0.25 are as calm as 2.0 while their steps are 8–20×
   smaller (a 10 m palm's tip shadow moves ≈ 2–4 cm per step).
2. Our `Engine.ini` sets `ResolutionLodBiasDirectional[Moving] = −1.0`, coarser than the game's own Cine −1.5 (the game log: −1.5 by the quality group,
   then our −1.0); −1.5 lowers the flicker at 0.003 (1.55 → 1.10) and keeps 0.1 calm.
3. Whether a 0.1–0.25° step is seen in play is the owner's eye — the clips are 6 s and may hold no step.
4. **Confound (the owner's question 20:02 «время дня разное в них?»):** the time of day was NOT fixed — the series ran ~2.5 real minutes ≈ one game hour
   from 09:10 (EXP-0469); A1 vs A2 (same setting) 1.55 vs 0.86 shows the drift. The ordering holds over three pairs but is not clean — a re-run with
   `SetTimeOfDay(10.0)` before each clip is owed.

## 6. Traces

Clips — `D:\Games\Conan Exiles Mods\НА ОТСМОТР НИКОЛАЕМ\68_teni_palm_shag_solnca\` (1 = A1, 2 = D2, 3 = C, 4 = F) with `chto_smotret.md`; the metric
script `ConanExiles/_config/shadow_flicker_metric.py`.

## 7. Verdict

partial — the measurement points to 0.1–0.25 + bias −1.5; the build is not changed until the owner's eye on the clips (taste class) and a live look at
the step.
