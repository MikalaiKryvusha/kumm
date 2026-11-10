# TC — attribute paging step 2: arrows ‹ ›, the «21–40» label, the wheel, the pips past 20 (KrinikConanUI kit edit of `W_Attribute`)

> **Created:** 2026-11-10 · **Parent:** `plans/49_conan_endless_attributes.md` (B2 step 2; the owner's pick B2 2026-11-09 19:58, verbatim in the plan)
> **Status:** cases written 2026-11-10 09:37 +03:00 · **Outbound:** the verdict → plan 49, the frame → the owner (taste: the arrows' look)

## Test basis

Plan 49 criteria 3 (a row pages, page 1 = 1–20, page 2 = 21–40, …) and the B2 shape: arrows at both ends of a row past 20, the window label, the wheel over the
row pages by 20, every row on its own. Step 1 (the bar shows `FullValue − Page × 20`) is live since 03:0x. The perk column per page is NOT in this step.

## Stand

The build with the new KrinikConanUI pak; the hero with Проворство 39 and Живучесть 28 (past 20) and rows at or below 20 (Сила 18, Мастерство 10); «Хар-ки» opened
by real keys (Tab → E → E), the game in front, owner-idle FREE; frames by `capture-window.ps1 -Width 3840`.

## Cases

| # | Action | Expected | Status | Seen |
|---|---|---|---|---|
| S1 | open «Хар-ки» | rows past 20 (Проворство 39, Живучесть 28) show ‹ › and «1–20»; rows ≤ 20 show none; the bar of 39 full (page 0) | pass (look: fail) | 09:5x 4K frame `s1.jpg`: exactly as expected. The look is poor — small arrows ON the bar's ends, the label over the last pip and the › — a look pass for the owner's eye is owed |
| S2 | a real click on › of Проворство | label «21–40», the bar 19 of 20, the pips hidden; the value «39» unchanged; other rows unchanged | pass | frame `s2.jpg`: «21–40», bar ≈ 95 %, pips gone, 39, Живучесть still «1–20» with pips |
| S3 | a second click on › of Проворство | stays on «21–40» (the last page of 39 — the clamp) | not run | |
| S4 | a real click on ‹ of Проворство | «1–20», full bar, pips back | pass | frame `s4.jpg` |
| S5–S7 | the wheel | — | not built | the kit refuses the nodes (plan 49) |
| S8 | the «+» of any row still raises it (the arrows do not cover it) | the value +1 | | |
| S9 | close and reopen the hub | the screen opens on page 0 of every row (a fresh page per open) — or keeps the page; record which | | |
| C1 | control: the pak without the step-2 edit (step 1 only) | no arrows, no label | | |

Dimensions: rows past / at / below 20; click vs wheel; first / last page (clamp); reopen. Not covered: 1080p / 2K / 720p frames (rule 17 — the look first, after the
owner's eye on the arrows), the perk column per page (next step).
