# TC — the play matrix of the Conan build: what a player does × what our mods change (plan 59, remedy 2)

> **Created:** 2026-11-20 · **Parent:** `plans/59_conan_process_owner_bug_wave_2026-11-20.md` step 2 · **Status:** SKELETON 2026-11-20 19:44 +03:00 — the rows and the regression rows of
> 2026-11-20; the columns' cells are to be filled from the nine mods' notes (`games/ConanExiles/mods/Krinik*.md`) before the first play run; the page for the owner owed
> **Outbound:** shown to the owner as a page before the first play run (plan 59 step 2)

## How it is used

Every release candidate gets a play report (plan 59 remedy 1) that walks this matrix by the player's path with real input, part of the time with god mode or a
teleport (to reach places), the rows about damage, death and combat without it. A row is a case; its status goes into the play report; a row not walked is listed
under «Not covered». Every new owner bug or issue adds its regression row here the day it is filed.

Our mods (columns): Camera (CAM), Archery (ARC), Locomotion (LOC), UI incl. the hub and the pause (UI), Graphics (GFX), EngineTweaks (ENG), Gameplay (GPL),
RussianTranslation (RU), ModPackManager (MPM).

## Rows — what a player does (the mods that act on each, to be confirmed from the notes)

| # | Player activity | Mods acting | Status |
|---|---|---|---|
| P1 | Stand, walk, sprint, crouch, jump, fall, swim, climb — with nothing in the hands | CAM, LOC | — |
| P2 | The same stances with the bow: draw, hold, release, from a crouch, in a sprint, in a jump, after a wall jump | ARC, LOC, CAM | — |
| P3 | The same with a melee weapon, a knife, a tool; switching between them and the bow | ARC, LOC, CAM | — |
| P4 | First-person view: the body, the hands, the weapon in hand, the weapon on the back, the shadows | CAM, ARC, GFX | — |
| P5 | Eating and drinking with a weapon in the hands (the animation) | ARC, UI | — |
| P6 | Taking damage, dying, respawning (WITHOUT god mode) | UI, GPL | — |
| P7 | Combat with beasts and humans: distance, hits, the camera near a creature | CAM, GPL | — |
| P8 | Dialogues with NPCs; the world behind a dialogue | UI | — |
| P9 | The hub: every tab by mouse, Q / E, Tab, J, M; every button of every tab; Esc / Tab close | UI | — |
| P10 | The map: markers (add, second, reset), the full-screen map by its key, Simple Minimap's own markers | UI | — |
| P11 | Quick loot, the corpse strip, the pickup prompt «E Взять» on items, bushes, nests | UI | — |
| P12 | Crafting in the hub and at stations, the queue across a close | UI | — |
| P13 | Building, thralls and their commands, chests | UI | — |
| P14 | Loading screens: teleport, waystone, dungeon, death | UI | — |
| P15 | A new character and the character creator to the first minute in the world | RU, MPM, UI | — |
| P16 | Saving and loading, quitting to the menu and back | MPM | — |
| P17 | The main menu, the Esc menu, the «Отзыв» plate, the mod list, our settings windows | UI, MPM | — |
| P18 | Graphics over a day: shadows, water, foliage at noon and at night | GFX, ENG | — |

## Regression rows — the owner's play of 0.9.1-RC1, 2026-11-20 (issues of the public repo)

| # | Issue | Row to walk | Status |
|---|---|---|---|
| R1 | #2 | P5: drink water with the bow in the hands — the bow stays visible | — |
| R2 | #3 | P8: a dialogue — the world keeps its pace (`NO_SLOW_MODULES`, pack `dc79053`) | — |
| R3 | #4 | P4: first person — the bow on the back is not in front of the camera | — |
| R4 | #5 | P3: use the knife, then take the bow — the bow is visible | — |
| R5 | #6 | P6: enemies deal damage (god mode off and its line read first) | — |
| R6 | #8, #9 | P2: draw from a crouch — the hero stays crouched; then a standing draw — no lift off the ground | — |
| R7 | #10 | the name plate of every NPC met — readable letters | — |
| R8 | #11 | P9: «Путешествие» → «Начать путешествие» starts the journey — PASS 2026-11-20 19:38 (report `2026-11-20_conan-hub-game-pages-map-journey.md`) | pass |
| R9 | #12, #23 | P10: two markers at their clicks, the reset; the full-screen map does not stick — markers PASS 19:40 | partial |
| R10 | #13, #34 | P4: the hero's shadow has a head and a body in first person | — |
