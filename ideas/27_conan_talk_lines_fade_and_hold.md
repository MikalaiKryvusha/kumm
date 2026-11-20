# Idea 27 — the NPC's lines in a talk fade in and out and stay on screen longer, like the enemy shouts

> **Created:** 2026-11-20 · tossed by the owner mid-task, 2026-11-20 21:08, while the agent fixed the hidden talk lines (issue #3, case D2b)
> **Parent:** `KrinikConanUI` section `krinik_shout_fade` (the shouts' mirror: 0.2 s fade in / out, a hold slider `ui_shout_hold`); issue #3
> **Status:** 📌 the owner's idea, for a later version (his word «на будущее»)
> **Outbound:** issue #44 of the public repository

## The owner's words (verbatim)

> идея на будущее:  фразы в диалогах тоже должны появляться и исчезать анимацией, и дольше задерживаться открытыми

## Goal vector (Achieve)

The pain: in a talk window the NPC's answer pops in and vanishes with the voice (≈ 0.8–1.5 s on the merchant of Iruk, 2026-11-20 21:05), shorter than reading it.
Where we want to be: a talk line fades in, stays at least as long as a hub setting says, and fades out — the same look as the enemy shouts.

## Acceptance criteria

1. Situation: a talk with the Iruk merchant open. Action: the player picks «Говорить». Result: the NPC's line appears by a fade of ≈ 0.2 s, stays at least the
   hub's hold time (a new setting or the shouts' one — the owner's choice), then fades out. Check: a 150 ms burst of the talk shows the opacity rising over ≈ 2
   frames, the line on every frame of the hold, the opacity falling at the end.
2. The enemy shouts keep their current behaviour (the mirror, `ui_shout_hold`).

## What is known (from the 2026-11-20 fix)

- The talk windows `W_NPCDialogue_C` / `W_NPCDialogue2_C` have their own `W_SubtitleRenderer`; the game never calls `SetTextActive` for its lines — the shouts'
  trigger does not fire there (`games/ConanExiles/GAME_ARCHITECTURE_INTERNAL_MAP.md`, the talk window paragraph). A talk line needs its own trigger: the line's
  birth inside the talk renderer, or `W_NPCDialogue2_C:HandleSubtitleRendererUpdated`.
- Today (pack after 29a612b) a line born in a talk is left to the game, untouched.
