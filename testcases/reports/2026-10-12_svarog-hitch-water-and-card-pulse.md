# Run report — Svarog's Dream: frame hitch twice per second (bug 39) and the hero-card pulse

**Created:** 2026-10-12 21:47 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** SvarogsDream `781b05e` + `c3393db`

## 1. Work

bug 39 (a ~100 ms frame hitch every 0.5 s) and the hero-card pulse/corners by the owner's words of the evening; basis —
`testcases/TC_svarog_hero_card_2026-10-12.md` C11, C30–C35; `bugs/39_svarog_frame_hitch_twice_per_second.md`.

## 2. Contour

the owner's machine and his live game (`[OWNER]` «Комп твой? Игра твоя - тестируй? Меряй!» · 2026-10-12), his OBS stream
running throughout (not touched); 4K; build SvarogsDream `54b6256` → `781b05e` + `c3393db`; save — his session 20:38–21:38, quit with
save 21:38:42, copy `_backups/svarog-saves-2026-10-12_2138-owner-quit`; restart 21:39 with `run-game.sh`.

## 3. Runs

- 2026-10-12 21:27:07 `h.sh "cfg krinik.svarogsdream.uirework HeroCard Enabled False"` — 60 s; 21:28:13 `… colorrework Water Reflections False` — 40 s.
- 21:28:58 `h.sh "prof 10 20"`; 21:30:18–21:30:29 `h.sh "call System.GC CollectionCount 0"` twice; 21:30:40 `h.sh "perf 8"`.
- 21:32:59 `h.sh "call UnityEngine.Application set_targetFrameRate 30" "wait 12" "call UnityEngine.Application set_targetFrameRate 144"`.
- 21:38:42 `h.sh "quit"`; 21:39 `bash tools/run-game.sh`; 21:40:37 `h.sh "prof 10 8" "fps 20"`; 21:43:23 `h.sh "shot hc_outline1"`;
  21:46 `h.sh "prof 15 60"`. Hot deploys `bash tools/deploy-hot.sh KrinikUIRework` 21:42, 21:44.
- Arithmetic check of the pulse steps: `node tools/pulse_steps.mjs` (21:21, re-run per tone/period change).

## 4. Checks

- Hygiene: both mods build; `pulse_steps.mjs` re-run after each change.
- Мир при замере: часы идут — строка пульта `perf 8` 21:30:48 `world=running timescale=1`; время не останавливалось ни в одном замере.
- Functional run: the owner's save in his world, spike counts read from `BepInEx/LogOutput.log` per 10 s, `prof`/`perf` lines read, one
  in-engine frame of the card read by eye.
- C31 (spike source found) — pass: card off / reflection off — 20 per 10 s unchanged; GC 316 → 316; OBS off 21:11–21:20 (its log) — unchanged;
  fps 30 → every 13–14 frames, still 0.50 s; first saved log with the rhythm — `water_reflection` 11:16; `prof` — `WaterReflection.Update`
  3.855 ms/frame.
- C32 (hitch gone) — pass: after restart 1–3 spikes per minute (was 101–131), `WaterReflection.Update` 0.004 ms/frame; reflection still applied.
- C35 (outline pulse) — partial: frame `_harness/hc_outline1.webp` — «Сытость» 0 %: thin red outline, background unchanged, other bars
  without outline; smoothness over time not observed by the agent (single frame); the owner watched on stream and answered «ОК».
- C11 (card cost) — partial: `KrinikLowPulse.Update` 0.009 ms/frame with the pulse on; canvas rebuild not measured.
- C30 (a) pass by arithmetic; (b), C33 (corners 22:00/7:00 fade), C34 (superseded by C35) — not observed in game.

## 5. Found

- bug 39 root cause — `Resources.FindObjectsOfTypeAll` every 0.5 s in `WaterReflection.Update` (fixed, `781b05e`).
- `fps 20` after restart — low1% 0.8 FPS within 20 s (one long frame, ~1 s+) — not investigated.
- Two wrong statements of the agent during the run (card is guilty; scripts do not explain the spike) — retracted in chat and by voice.

## 6. Traces

`D:\Games\Svarog's Dream\BepInEx\LogOutput.log` (this launch; previous launch overwritten),
`SvarogsDream/_harness/hc_outline1.webp`, `hc_outline1_crop.webp`, OBS log `%APPDATA%\obs-studio\logs\2026-10-12 19-52-12.txt`.

## 7. Verdict

partial — the hitch is found and fixed with measurements; pulse and corners are in the game, their motion not yet
observed frame by frame by the agent.
