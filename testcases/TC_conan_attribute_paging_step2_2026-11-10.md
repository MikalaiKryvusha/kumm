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
| S5–S7 | the wheel | — | not built (until 12:5x) | the kit refuses the nodes (plan 49) |
| W1 | (`kit-attribute-paging-wheel.py`, 2026-11-10 12:5x) a REAL wheel down over Живучесть (25, page 1) | the row pages to 21–40; Проворство keeps its page | **pass** | 12:58 the player path (Tab → E → E, the game in front, FREE), `mouse-seq` move 0.395/0.451 + wheel −1: the remote log Vi 0 → 1, Ag 0 (`whl/pages.txt` f2); frame `whl/w1.jpg`: «21–40», the placeholder pips at the quarters |
| W2 | a real wheel up over the same row | back to 1–20 | **pass** | wheel +1: Vi 1 → 0 (f4) |
| W3 | a real wheel over a row ≤ 20 (Сила 0) | nothing changes (the clamp) | **pass** | move 0.395/0.255 + wheel −1: St stays 0 |
| W4 | a real wheel over the right perk column | the column scrolls, no row pages | **pass** | move 0.83/0.62 + wheel −3: rows unchanged; Сила's column scrolled to its end — offset 1.7 of 1.7 (the remote; invisible on the frame). Seam for the owner's eye: Сила overflows by 1.7 units and still shows a bar |
| S8 | the «+» of any row still raises it (the arrows do not cover it) | the value +1 | | |
| S9 | close and reopen the hub | the screen opens on page 0 of every row (a fresh page per open) — or keeps the page; record which | | |
| C1 | control: the pak without the step-2 edit (step 1 only) | no arrows, no label | | |
| D1 | (look V8, pack `c6afcc9`) a real click on the DIM ‹ of a row on its first page | nothing changes: the page stays «1–20», the bar, the value and the pips the same; no other row moves | pass | 2026-11-10 12:3x, the player path (Tab → E → E, real keys, the game in front, owner-idle FREE): the 3rd click of the series (`mouse-seq.ps1` move 0.200/0.48 + lclick) on Живучесть's dim ‹ — the remote log of `Page` every 2 s: Vi stays 0, Ag stays 1 (`clk/pages.txt`) |
| D2 | a real click on the DIM › of a row on its last page | nothing changes (S3 for the V8 look) | pass | the 1st click (0.5775/0.48) on Живучесть's dim › at «21–40» (25 — the last page): Vi stays 1 |
| M1 | a real click on › of a row in the MIDDLE of the list (neither first nor last) | that row pages to 21–40; its neighbours above and below keep their page (the hit-test hits the row under the cursor, not a neighbour) | pass (‹ instead of ›) | the 2nd click on Живучесть's ‹ (row 3 of 6, Проворство above it also on page 2): Vi 1 → 0, Ag stays 1; frame `clk/f8.jpg`: Живучесть «1–20» with the stock pips and a dim ‹, Проворство «21–40» |
| S9b | close and reopen by the player's keys | — | **keeps the page** | 12:3x: the remote-opened window closed, Tab → E → E reopened «Хар-ки» on «21–40» for both rows (frame `t1.jpg`) |
| R1 | the game at 1920×1080 (`exec r.SetRes 1920x1080f` by the remote), «Хар-ки» open, a row past 20 on page 2 | arrows under the bar ends, numbers above, nothing cut or on the pips — the same layout as the 4K frame | pass | 2026-11-10 12:2x `res_1920x1080.jpg` (scratch; the TC of the placeholders, case R) |
| R2 | the same at 2560×1440 | as R1 | pass | 12:2x `res_2560x1440.jpg` |
| R3 | the same at 1280×720 | as R1; numbers readable (not smaller than the game's own row text) | pass (layout) · readability = the owner's 4K proportion | 12:2x `res_1280x720.jpg`: the whole page scales as one; the numbers stand smaller than the value digits by the same ratio as on the accepted 4K look |

Dimensions: rows past / at / below 20; click vs wheel; first / last page (clamp); reopen. Not covered: 1080p / 2K / 720p frames (rule 17 — the look first, after the
owner's eye on the arrows), the perk column per page (next step).
