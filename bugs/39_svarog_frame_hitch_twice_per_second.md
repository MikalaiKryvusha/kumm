# Bug 39 — Svarog's Dream: a ~100 ms frame hitch twice per second, through the whole session

**Status:** 🔴 OPEN
**Severity:** S2 — every animation in the owner's game looks torn ("словно мало кадров"); found while fixing the hero-card pulse
**When/context:** 2026-10-12 21:24, found by the agent in the log of the owner's own session (game launched by the agent 20:38,
the owner played on), while checking the hero-card pulse the owner called torn: `[OWNER]` «анимации пульсации рваниые получились,
словно мало кадров в ней» · 2026-10-12.

## Symptom
`BepInEx/LogOutput.log` of the session 20:38–21:24: **5 207** `event: spike` lines (frame > 50 ms, `KrinikUIRework/Plugin.cs` Update).
Per minute of game time: 101–131 spikes, average 96–106 ms, every minute from 3 to 45 (minutes 0, 12, 21, 36 carry loading
spikes of 4.5–6 s). Between two spikes ~20 frames of ~21 ms (≈47 FPS), e.g. frames 103281 → 103302 → 103322 at t 2719.29 → 2719.81
→ 2720.31.

Expected: earlier runs of the same build line — 0.3 spikes/s (`_harness/logs/2026-10-12_devotion_bar.log` 154 in 555 s,
`2026-10-12_traveler_reach.log` 105 in 279 s, `2026-10-12_camera_two_buttons.log` 42 in 137 s). The only earlier log near this
rate is `2026-10-12_water_reflection.log` — 126 in 95 s (1.3/s), the run with the expensive reflection camera (EXP-0222).

## Repro (deterministic — to confirm)
1. Launch with the current build (KrinikUIRework with HeroCard, ColorRework `Reflections = true`, `ReflectionLayers = Ground`).
2. Stand in Bor in daylight 60 s; `grep -c "event: spike"` over that minute.

## Forensics
- What is new in this session against the 0.3/s runs: the hero card (`HeroCard.cs`, `dab207b` + `de67962`, first launch 20:38) and the
  ground-only water reflection (idea 13, accepted at +0.5 ms, 11:16).
- Owner's window: whether the game was focused or behind VS Code / remote desktop for these 45 minutes is unknown — a background
  window may be throttled by Windows. Not checked.

## Root cause / Hypotheses (ranked, not yet measured)
1. Something periodic at ~2 Hz in our mods since the hero card (a search, a layout rebuild, a texture build) — measure with the card
   off (`HeroCard` enable flag) vs on, same place, 60 s each.
2. The water reflection still renders the scene a second time on some frames (planes 32 → 34 in the log) — measure `Reflections`
   off vs on.
3. Windows throttling of a background window — measure with the game focused vs behind another window.

## Fix plan
Measure the three switches one at a time (`perf 8` + spike count per 60 s), then profile the spike frame of the guilty one.
Test case: `testcases/TC_svarog_hero_card_2026-10-12.md`, C31.

## Decisions made without the owner
(filled at closing)

## Links
`ideas/15_svarog_kartochka_geroya_hud.md` (budget 0.1 ms per frame for the card) · `ideas/13_svarog_otrazheniya_v_vode.md` · EXP-0222
