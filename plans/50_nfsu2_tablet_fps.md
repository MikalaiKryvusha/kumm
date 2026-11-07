# Plan 50 — Underground 2 Revived on the owner's tablet: the best picture at ≥ 50 FPS, measured

> **Created:** 2026-11-08 · on the owner's word (chat 2026-11-07 23:12 «FPS от 50 или выше» · «Охуенная графика»; 23:26 «можно и в 120 целится … но не жертвою графики сильной»; 2026-11-08 00:06 «Ты план написал, по которому ты эти работы будешь делать?» · «Разрешение снимал?» · «читай конспекты по порту и треды в интернете»)
> **Parent:** `researches/nfsu2-tablet/README.md` (first pass, 2026-11-07: no plan, part of it measured in a pause menu — EXP-0489)
> **Status:** ✅ measured 2026-11-08 02:1x — all cases run (`testcases/TC_nfsu2_tablet_fps_2026-11-08.md`); acceptance 1 not reachable in the crowded main world (hardware/port limit, measured), 2 and 3 pass, 4 waits for the owner's eye; the recommended set applied on the tablet; notes for the owner `researches/nfsu2-tablet/README_ru.md`
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
- [x] **R1 — internet threads** (helper agent): almost no player numbers for Mali; port issues #79 (car churn drops), #122, #128; Project Velocity #2 (same SoC, ~0.15 ms per draw call).
- [x] **R2 — the in-game resolution rows**: only 720p and 1080p on this tablet; FPS equal (57–59 vs 59) — the port raises both to the page size × render scale (cases R2a, G6).
- [x] **R3 — the full list of graphics-relevant settings**: the start page read in full (every tab), the case matrix in the TC file.
- [x] **M1 — GPU stand**: G1–G16 (render scale, reflections, HUD textures, FOV, detail options).
- [x] **M2 — crowd stand**: C1–C7 (cars 0 / 8 / 16 / 32, World 1, roam_rate, headlights).
- [x] **M3 — frame rate and pacing**: F1 (120 unreachable), F2 (144 vs 120 Hz — no difference by a Chrome trace).
- [x] **M4 — city driving**: learned to drive from the PC (R to the road, held keys via CDP, 480 px frames); main world 21–37.
- [x] **T1 — 10-minute soak**: 37–44 → 43, no throttling collapse.
- [x] **A — applied** the recommended set; research doc and Russian notes written; the owner's eye on the look is his (acceptance 4).

## Risks

- (a) Thermal drift between cases skews A-B → log thermal status per case; re-run the first case at the end (A-B-A).
- (a) Menu-paused readings (EXP-0489) → sample only with `pause = 0`, `drive = 2`.
- (b) The spawn crowd changes minute to minute (players come and go) → two samples per crowd case, the number of cars near logged.
- (b) The owner uses the tablet meanwhile → a run only when the game page is ours; his saves are not touched (no progress played; quit without saving).
- (c) Memory pressure from background apps → noted, not changed (his apps).

## Decisions made without the owner

- `[AI]` Applied set: car reflections at level 1 with slow update (keeps the car shine for ~5 FPS) instead of off — the owner's priority is the look («Охуенная графика»); off is named in the notes as the +5 option.
- `[AI]` Kept the owner's upscaled HUD (`ui_textures = uhud`) although it costs ~5 FPS — his visual choice; the notes name it.
- `[AI]` Kept the main world (he plays with others; «где много движения других игроков»); World 1–4 named in the notes as +10 at the spawn.
- `[AI]` Players' cars 16 (the port's phone default) instead of his 64 — 32 cars measured 24–25 at the spawn.
- `[AI]` Depth of field off — by the owner's word in chat 2026-11-07 23:36 («глубиной резкости можно пожертвовать»), so this one is his.
- `[AI]` The display refresh stays 144 Hz (his setting): 120 Hz measured no pacing gain.
- `[AI]` The in-game resolution row left at 720p (the owner's value): 1080p measured equal.
