# Run report — the Krinik paks' mod-list fields (author, author URL, change note), HOUSE_RULES rule 40

- **Work:** rule 40 (`HOUSE_RULES.md` 40.1–40.3): the fields live in one source and every pak build writes them; a release and the working game are
  guarded. Code in the pack: `_config/devkit/krinik_modinfo.py`, `_config/release/krinik_change_notes.json`, `kit-buildmod.py`, `build-level-mod.py`,
  `set-pak-modinfo.py --check-krinik`, `make_release.sh` step 2b, `make_volumes.sh` step 2c, `dash_lint.py` (the table as player text).
  Basis: the owner's frame of 2026-11-03 (plan 44: «Автор --», «URL автора --», «Список изменений --»), rule 40.
- **Contour:** the working game `D:/Games/Conan Exiles 3.1.1` (its `ConanSandbox/Mods`, read only); copies of the four source paks
  `_unpacked/<Mod>/<Mod>.pak` in `KUMM/.work/modinfo_t4/paks`; a Gameplay build into `KUMM/.work/gameplay_t5`. The source paks and the game were not
  written.
- **Runs** (2026-11-20, each command run from the pack root):
  1. ≈09:28 — the module: `python -I -X utf8 -c "…krinik_modinfo…"` (release, pak mods, each note); a missing line: `change_note('KrinikConanNope')`.
  2. ≈09:28 — the guard on the working game: `python -I -X utf8 _config/devkit/set-pak-modinfo.py "D:/Games/Conan Exiles 3.1.1/ConanSandbox/Mods" --check-krinik`.
  3. ≈09:29 — `python -I -X utf8 _config/release/dash_lint.py --only krinik_change_notes`; the control `KUMM/.work/voice/dash_control.py` (a dash put
     into the table, the lint, the table restored).
  4. ≈09:29 — the export path on copies: `set-pak-modinfo.py <copies> --work <dir>`, then `--check-krinik <copies>`; one pak moved aside, the check again.
  5. 09:31–09:32 — `python -I -X utf8 _config/devkit/build-level-mod.py --name KrinikConanGameplay --work <empty> --out <dir>`, then
     `repak get <out pak> ConanSandbox/Mods/modinfo.json`.
  6. ≈09:36 — the guard lines of `make_volumes.sh` 2c and `make_release.sh` 2b in `bash -c 'set -uo pipefail; …'` on the copies and on the working game.
- **Checks:**
  - Hygiene: `kaif-voice-lint check` of the table's texts — 0 findings; `dash_lint` — 0 lines with a dash.
  - Functional run: the real tools on real paks (the working game's four Krinik paks, copies of the source paks, a fresh Gameplay build), their output
    and the paks' `modinfo.json` READ.
  - Run 1: release `0.9.1`, pak mods Archery, Gameplay, Graphics, UI; notes 376 / 230 / 260 / 949 characters; a missing line — the refusal naming the
    table, the mod and the release, exit 1. PASS.
  - Run 2: 4 of 4 `[fail] … author, authorUrl, changeNote` (all three empty — the owner's frame), exit 1. PASS (the control case of the guard).
  - Run 3: 0 lines; the control — the dash found at line 3, exit 1, the table restored equal. PASS.
  - Run 4: 4 of 4 written (author «Кот Криник (KOT KRINIK)», Russian descriptions from the README), the check 4 of 4 `[ok]`; with Graphics moved aside —
    `[fail] KrinikConanGraphics: no KrinikConanGraphics.pak`, exit 1. PASS.
  - Run 5: the build ends with every step green; its modinfo: `author` «Кот Криник (KOT KRINIK)», `authorUrl` the Nexus page, `changeNote` the 0.9.1
    line, version 0 / 9 / 1. PASS.
  - Run 6: exit 0 on the copies, exit 1 on the working game. PASS.
  - Not run: `kit-buildmod.py`'s new step 4 (needs the kit cook — the UI, Archery and Graphics builds of RC1); the game's own mod list on screen (rule
    40.3 «looked at once per release» — after the RC1 deploy).
- **Found:** none in the code. The working game's four Krinik paks carry empty fields today — the state rule 40 exists for; RC1's pak builds and
  deploy fill them.
- **Traces:** command output in this session; `KUMM/.work/modinfo_t4/` (copies, work), `KUMM/.work/gameplay_t5/` and `KUMM/.work/gameplay_t5.log`,
  `KUMM/.work/voice/change_notes_091.md` (the texts as checked).
- **Verdict:** partial — the source, the export writer, the Gameplay builder and both guards work; the kit builder's step waits for the RC1 kit builds.
