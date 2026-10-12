# Bug 39 — Svarog's Dream: a ~100 ms frame hitch twice per second, through the whole session

**Status:** 🔧 fixed 2026-10-12 21:39 (restart with the fix), measured in the owner's save — awaiting the owner's eye on the stream
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

## Measurements 2026-10-12 21:27–21:44 (owner: `[OWNER]` «Комп твой? Игра твоя - тестируй? Меряй!» · OBS stream running, «ты наш ОБС не убивай плиз»)
1. Hero card off 60 s — 20 spikes per 10 s, unchanged (my first count "22 in 36 s" read an unflushed log — retracted in chat and by voice).
2. `Water Reflections False` 40 s — 20 per 10 s, unchanged.
3. `prof 10 20` — `KrinikColorRework.WaterReflection.Update` **3.855 ms/frame** on average, first line. I first read it as "no script
   explains a 100 ms spike" — wrong: 3.86 ms × 20 frames = 77 ms once per 0.5 s. Retracted in chat and by voice.
4. GC: `GC.CollectionCount(0)` 316 → 316 over 10 s — not GC. CPU: OBS 4 % of the machine — not contention.
5. OBS off 21:11:45–21:20:52 (its log) — spikes 101–119 per minute, unchanged → not OBS.
6. `targetFrameRate` 30 for 12 s — spikes every 13–14 frames instead of 20, still every 0.50 s → **time-driven**, not frame-driven.
7. Saved logs: the 0.5 s rhythm first appears in `_harness/logs/2026-10-12_water_reflection.log` (11:16), absent at 10:54.

## Root cause
`WaterReflection.Update` (`SvarogsDream/src/KrinikColorRework/WaterReflection.cs`, commit `c239442`/`47eb465`, idea 13) ran
`Resources.FindObjectsOfTypeAll<LuxWater_PlanarReflection>()` every `CheckSeconds = 0.5f` — a walk over every loaded object incl.
assets (~800 MB managed heap) — **before** looking at the `Reflections` switch, so turning the reflection off did not stop it.

## Fix
Planes register themselves: Harmony postfix on `LuxWater_PlanarReflection.OnEnable` adds to `WaterReflection.Known`; one full walk only on
the first tick (hot reload into a live world). Twin `WaterProbe.Scan` (`ScanSeconds = 2`, only when the probe is on) reads the same list.
After restart in the owner's save (21:39): `prof 10 8` — `WaterReflection.Update` no longer in the top 8 (scripts 2.99 ms/frame, was
6.76); spikes 1–3 per minute (was 101–131), loading and two hot reloads excluded. Reflection still applied (`planes 4 → 5` in the log).

TWINS: searched `FindObjectsOfTypeAll` inside periodic code of all mods (`grep -B3` for Update/Tick/Seconds) — found 1 other periodic
site: `KrinikCameraRework/Plugin.cs` near `DrawDistanceRefreshSeconds = 1f` (line 56) — to check next; the rest run once (startup,
window open). Test case: `testcases/TC_svarog_hero_card_2026-10-12.md`, C31–C32.

## Decisions made without the owner
(filled at closing)

## Links
`ideas/15_svarog_kartochka_geroya_hud.md` (budget 0.1 ms per frame for the card) · `ideas/13_svarog_otrazheniya_v_vode.md` · EXP-0222
