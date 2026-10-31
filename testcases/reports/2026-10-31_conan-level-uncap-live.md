# Run report — Conan: levels past 60 with the build's XP law, seen live (idea 04, plan 36 item 27)

- **Work:** plan 36 item 27 — idea 04 «Уровень без потолка» against the build: the one thing not seen live was a level past the vanilla 60. Basis — the owner's
  decision of 2026-09-13 in idea 04 and the merge report `2026-10-30_conan-krinik-conan-gameplay-merge.md` («Not checked: an actual level-up»).
- **Contour:** game `D:\Games\Conan Exiles 3.0.1` (background path), the oasis save (level-53 hero), restored after; `KrinikConanGameplay` pak
  (`DT_ExperienceSystemLevel`: 10 000 levels, XP per level 500 × L^0.5). Machine lock `kumm` taken 12:07, released by 12:09.
- **Runs:** 12:08 `launch-bg.ps1` → world → `god-on.sh` → `exec MakeMeAdmin` → `CheatManager:SetLevel(65)` by the remote → a frame of the HUD 2 s later;
  `python -I -c "print(500*65**0.5)"`.
- **Checks:**
  - Hygiene: none.
  - Functional run: the hero set to level 65 in the live game; read — the HUD level badge and its XP line.
  - The badge reads 65 (vanilla stops at 60); the XP line «172,5k / 176,5k (4 031)» — 4 031 to the next level = 500 × √65 = 4 031.1. pass.
- **Found:** none.
- **Traces:** frame `lv65.jpg` (crop `lv65_crop.webp`) in the session scratchpad.
- **Verdict:** pass — the cap is gone and the step follows the law; the pace in a real hour of play stays the owner's to judge (idea 04, «Открыто»).

REAL WORLD: accumulated — the owner's own build and oasis save (restored after: the level is not kept); data and machine — his PC and game install; path — the
level set by the cheat manager, not earned by play.
