# Research — Conan day/night: do lights switch on and the sky change abruptly?

> **Created:** 2026-11-01 · **Parent:** `[OWNER]` 2026-11-01 10:42 «мне словно показалось, что такая же проблема в смене ночи и дня как в Свароге - что источники
> света резко включаются, и словно небо резко меняет вид» · «может мне показалось» · «нужно изучить»
> **Status:** in work — run 1 (beach, no lights) done 11:03–11:08; run 2 (a lit camp, no enemies) owed
> **Outbound:** the finding → the owner in chat; a fade of NPC lights would be a feature (his word first)

## What the owner may have seen

From 10:21 to 10:33 the agent's own temperature stand jumped the time by the remote several times (`SetTimeOfDay` 10 → 2 → 1 → 3) — every jump
switches the sky and the lights at once. That is the first candidate for «резко»; it is the agent's, not the game's.

## Facts

- The day lasts 55.2 min (`ConanTimeOfDayManager:GetDayLength`); the night runs faster than the day (17.8 → 22.3 in 2.5 min of run 1).
- Run 1 (beach (-78471, 245900), one `SetTimeOfDay(17.6)`, then no touch; frames every ≈ 2 s, 1280 px; `dusk_analyze.py` — mean luminance of the whole
  frame, the sky band, the ground, bright-pixel count):
  - the sky darkens 57.6 → 35 between 17:47 and 19:00; frame-to-frame changes of the sky band up to ±7 (median 0.67) between 17:55 and 18:30 —
    by eye the frames show drifting clouds, no jump of the sky's look;
  - 22:11 one frame +29 — a creature attacked the hero (fire burst, HP bar 868/868): interference, not light;
  - no lights on the beach — the «lights switch on» part is NOT tested by run 1.
  - the whole run (150 frames, 17:47 → 05:45 game time, 11:03–11:10): at night many ONE-frame spikes — 23:29 the whole frame bright (17 598 bright
    pixels), 01:02 the sky band 33 → 80 → 32 (a lightning-like flash — Severe Weather Enhanced storms are a candidate), 00:15 a near-black frame; the
    ground spikes coincide with the creature fighting the god-mode hero all night. No interference-free step of light or sky was found; run 2 must clear
    the enemies first (rule 11.6) and look at a flash frame by eye before naming a cause.

## Next (run 2)

- A place with the game's own lights (an NPC camp or a city with torches and braziers), enemies cleared (god on, the area checked, creatures killed by
  the remote), `tp_ground.sh`, one `SetTimeOfDay(17.5)`, a 60 fps clip around the switch hour (a light that pops is one or two frames) plus the frame series.
- Look up how the game switches its placed lights at night (the actor class of a camp brazier; a time-of-day event or a per-light check) — a fade would
  be a mod feature, the owner's call.
