# Run report — Svarog's Dream: 62 hero portraits in the game

**Work:** test cases C5–C7 of `testcases/TC_svarog_hero_portraits_2026-10-11.md` — the 62 colored portraits (44 accepted by the owner from `SvarogsDream/art/heroes_avatars_color/_chosen.tsv`, 18 temporary from `_temp.tsv`) loaded by `KrinikUIRework/HeroPortraits.cs`.

**Contour:** Svarog's Dream on the owner's machine, owner's save (copy before the run: `_backups/svarog-saves-2026-10-11_2332-before-portraits`, 7 files), 1280×720, BepInEx plugins as deployed; JPEGs in `<game>/krinik_portraits/` written by `python tools/portraits_deploy.py` at 23:30.

**Runs:** one run, 2026-10-11 23:32–23:34 +03:00:
- `bash tools/run-game.sh` (start → «Продолжить» → HUD at 23:33:15)
- `grep -a "portraits:" "<game>/BepInEx/LogOutput.log"`
- `bash tools/h.sh "findall Select"` · `"findall Character"` · `"findall Hero"` · `"findall Story"` · `"findall Portrait"`

**Checks:**
- Hygiene: none.
- Functional run: the game started with the owner's save and the log line was read; the hero selection panel was searched in the loaded world through the dev harness.
- C5 pass — log line `portraits: 62 colored, 0 without file, 62 heroes`.
- C6 blocked — no selection panel in the world scene (no UI node found by the five searches); the game classes are `CharacterSelectionUI` / `CharacterSelectionManager` (assembly identifiers); not invoked — the owner took the game at 23:34.
- C7 skipped — the game was not closed: the owner plays in it himself; his save is his.

**Found:** two owner drive-by notes during the run, filed: `bugs/36_svarog_middle_mouse_camera_rotation_gone.md`, `bugs/37_svarog_far_haze_too_blue.md`. No defect of the portraits module.

**Traces:** `<game>/BepInEx/LogOutput.log` (23:33 run); `SvarogsDream/_harness/color/` comparison sheets; save copy above.

**Verdict:** partial — the swap of all 62 sprites is confirmed by the log; a colored portrait was still not seen on screen (selection screen only in the prologue at the Oak of Life, or by calling `CharacterSelectionUI` — next session).
