# Plan 50 — Underground 2 Revived on the owner's tablet: the best picture at ≥ 50 FPS, measured

> **Created:** 2026-11-08 · on the owner's word (chat 2026-11-07 23:12 «FPS от 50 или выше» · «Охуенная графика»; 23:26 «можно и в 120 целится … но не жертвою графики сильной»; 2026-11-08 00:06 «Ты план написал, по которому ты эти работы будешь делать?» · «Разрешение снимал?» · «читай конспекты по порту и треды в интернете»)
> **Parent:** `researches/nfsu2-tablet/README.md` (first pass, 2026-11-07: no plan, part of it measured in a pause menu — EXP-0489)
> **Status:** 🔧 plan written 2026-11-08 00:1x; recon R1–R3 in progress
> **Outbound:** optional feature request to the port's author (own car detail vs other players') — the owner's call

## Goal vector (Achieve)

The owner plays free roam in the main world with other players on his tablet at **≥ 50 FPS sustained** (120 if it comes without a visible loss), with the best picture that budget allows — and every setting on the tablet is chosen by a measurement, not by a guess.

## Acceptance criteria

1. Scale: median FPS over 20 s of driving · Meter: the page's `#fps` counter read over CDP (`sample.js`), `pause = 0`, `drive = 2` · Target: ≥ 50 in the main world in the city away from the spawn, and the number at the garage spawn crowd reported (expected lower).
2. Scale: FPS after 10 minutes of play · Meter: same, plus `dumpsys thermalservice` status · Target: within 10 % of the first minute (no throttling collapse).
3. Every graphics-relevant port setting and in-game option has a measured row (or a written reason why it was not measured) in the case file.
4. The owner's eye accepts the look on the tablet (taste class: he judges, the agent prepares).

## Steps

- [x] **R0 — read the port's own notes:** `discord-bot/faq.md`, `knowledge.md` (community answers), `docs/web/PLAYING.md`, changelog. Found: the in-game resolution row matters (use the native-size row, not 720p/1080p); "GPU done" counts frames in flight; 144 Hz gets uneven pacing at 60 and 120; a throttling phone is steady at 30.
- [ ] **R1 — internet threads** (helper agent): players' FPS numbers and settings on Android / Mali, crowded free roam.
- [ ] **R2 — the in-game resolution rows**: which rows the game lists on this tablet and the render size each really draws (the game log / `[app]` lines).
- [ ] **R3 — the full list of graphics-relevant settings** (port `settings.ini` web keys + in-game Display and advanced options) → the case table.
- [ ] **M1 — GPU stand (empty own world, standing at the garage, driving state)**: render scale 0.5 / 0.75 / 1.0 × reflections off / on; the in-game resolution row native vs 720p.
- [ ] **M2 — crowd stand (main world, garage spawn)**: players' cars 0 / 16 / 32 at the best M1 config; `roam_rate`; `other_headlights`.
- [ ] **M3 — frame rate and pacing**: 120 in the empty world at the best config; display 144 vs 120 Hz (frame-time spread); 30 as the steady fallback.
- [ ] **M4 — city away from spawn**: drive (ArrowUp held) in the main world; the chosen config's FPS.
- [ ] **T1 — 10-minute soak** at the chosen config: FPS and thermal status every 2 minutes.
- [ ] **A — apply** the chosen config, write the case results, update the research doc, show the owner (frames on the tablet; his eye decides car reflections on/off).

## Risks

- (a) Thermal drift between cases skews A-B → log thermal status per case; re-run the first case at the end (A-B-A).
- (a) Menu-paused readings (EXP-0489) → sample only with `pause = 0`, `drive = 2`.
- (b) The spawn crowd changes minute to minute (players come and go) → two samples per crowd case, the number of cars near logged.
- (b) The owner uses the tablet meanwhile → a run only when the game page is ours; his saves are not touched (no progress played; quit without saving).
- (c) Memory pressure from background apps → noted, not changed (his apps).

## Decisions made without the owner

(filled at closing)
