# Test run report — Conan: one clip of every food / water blink intensity

**Created:** 2026-11-01 11:54 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** Conan 3.0.1 build, KrinikConanUI as deployed 11:4x (pack `ec5dffd`)

## 1. Work

`[OWNER]` 2026-11-01 08:49 «нужно видео, показывающее все интенсивности». Cases V1–V4 of `testcases/TC_conan_hud_blink_all_steps_video_2026-11-01.md`;
the section `krinik_hud_blink.lua` (food / water from the zone 10 % to 0 %).

## 2. Contour

The owner's machine, the live build, game behind (`launch-bg.ps1`), world by `enter-world-remote.sh`, god on, the oasis beach; every character within
60 m killed by the remote before the clean run (the first run had a respawned boss fighting the hero — discarded by stand rule 6). REAL WORLD: accumulated —
the owner's install and save; data and machine — his PC; path — the live HUD the player sees. Verified on the real world.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-01 11:48–11:49 +03:00 | lock, `launch-bg.ps1`, `enter-world-remote.sh`, `god-on.sh`, `capture-burst.ps1 -Count 60 -IntervalMs 16 -Width 1920` | world 22 s; the burst rate 18 frames/s |
| 2 | ≈ 2026-11-01 11:49–11:50 +03:00 | `capture-burst.ps1 -Count 1100 …` & `bash blink_drive.sh <steps> 4` (scratchpad) | all steps logged; DISCARDED — a boss fought the hero in frame; water crossed to the next step 2 s early (heat drain) |
| 3 | ≈ 2026-11-01 11:51–11:52 +03:00 | characters within 60 m killed; the driver re-sets the share mid-step; `capture-burst.ps1 -Count 1250 …` & `blink_drive.sh` | clean: 1250 frames in 63.4 s (19.7 fps) |
| 4 | 2026-11-01 11:53 +03:00 | `python blink_clip.py …`; `ffmpeg -framerate 19.7 … -c:v libx264 blink_all_steps.mp4`; a frame sheet | the clip 17.7 MB, 1154 labelled frames |

## 4. Checks

Hygiene: none (no code changed).
Functional run: the live HUD walked through 12 %, the eight step shares and 0 %; the section's log read («NoFood / NoWater: яркость 0.3 … 1.0» in order); the
frame sheet read by eye.

| Case | Status | Observed |
|---|---|---|
| V1 control 12 % | pass | icons steady, no «яркость» line in the control window |
| V2 steps 3 … 10 | pass | 16 lines, food and water each 0.3 → 1.0 in order; the icons redden deeper step by step on the sheet |
| V3 0 % | pass | no new line after 1.0 (the game's own blink takes over, state 'bp') |
| V4 the clip | pass | one mp4, 19.7 fps (not 60: the background path reads the window, not the screen — the blink pulses last ≈ 1 s, enough frames per pulse), each step labelled |

## 5. Found

- STATUS said «L = 0.25 … 1.0, ten steps»: the live steps are EIGHT (L = 0.3 … 1.0) — corrected in STATUS and the mod notes.
- The section's minute summary showed worst 4 ms once (run 2, a step change starting animations) — over the 1 ms rule if it repeats in play; open for plan 34.

## 6. Traces

The clip and the sheet — `D:\Games\Conan Exiles Mods\НА ОТСМОТР НИКОЛАЕМ\45_miganie_edy_i_vody_vse_stupeni\`; `UE4SS.log` 11:49–11:52 (`[KrinikConanUI:HudBlink]`);
the frames — session scratchpad. Crash-report window: none. Game closed cleanly 6.2 s, lock released.

## 7. Verdict

The clip of runs 1–4 (11:5x): pass as a clip. **The owner refuted the behaviour it showed** — 11:54 «мерчание голода и жажды неправильное» · «на 10% должно
быть в едва заметный нежный розовый, и чем ближе к 0%, тем насыщеннее красный». See the fix below; the new clip replaced the old one in review folder 45.

## 8. The fix (12:00–12:21)

**Found by measure (`blink_measure.py`, redness R − (G+B)/2 of the stomach and drop icons per frame, scratchpad):** the old clip peaked at 106–120 on EVERY
step — only the pulse speed changed. Remote probe 11:57: `PlayAnimationTimeRange(NoFood, 0, 0.15, 0 | 1000, PingPong, 0.09)` → the border's G went
1.00 → 0.10 in 4.5 s: the end of the range is ignored (EXP-0422).

**Change:** `krinik_hud_blink.lua` drives the colour itself — pulse (1 − cos) / 2, period 3.3 s, peak 0.15 at the threshold → 1.0 at the limit (food/water:
border G = B = (1 − k)^2.2; weight: the red image's alpha); the icon's native Hosav animation is stopped while we drive it; at 0 % / ≥ max the game's own blink.

| Check (live, game behind, 12:00–12:21) | Status | Observed |
|---|---|---|
| peaks grow with the falling share | pass | redness max per step 44 · 63 · 65 · 78 · 89 · 100 · 115 · 127 (9.7 → 0.7 %), 0 % (game) 127; control 12 % — 27 |
| the look (sheet of the new clip) | pass | 9.7 % a barely pink stomach and drop; 3.3 % saturated red; labels «запас X % · красный в пике NN %» |
| weight 93 % | pass after the second fix | first: alpha stayed 0.00 — Hosav's `OverEncumbered_Weight` idles «playing» and rewrites it; after `StopAnimation` in the zone: 0 → 0.40 → 0, period ≈ 3.3 s |
| leaving 0 % to 0.7 % | pass | native food animation stopped at once, our pulse to G 0.00 |
| stays white above / returns | pass | «выше порога» at 100 %; Hosav's own green for a fed hero is kept |
| cost | partial | average 0.08–0.12 ms per colour step (≈ 17 steps/s), poll ≈ 0.35 ms per 250 ms; worst 3–6 ms once a minute in BOTH buckets after three changes (reused colour tables, 50 ms step, no per-step closure) — not our garbage; the game was behind (no focus), `os.clock` is wall time; the worst-frame measure goes to the frame-measurement block |

Found on the way: while food is at exactly 0 %, Hosav's blink also overrides the weight image (vanilla behaviour at the limit).
Verdict of the fix: pass on the look and the logic; the 1 ms worst-frame rule — not proven either way here (partial).
