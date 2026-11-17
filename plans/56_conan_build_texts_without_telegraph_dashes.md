# Plan 56 — every Russian string of the Conan build says its verb: no telegraphic dashes

> **Created:** 2026-11-18 · on the owner's word 2026-11-18 00:44 (verbatim — `PROJECT_HISTORY.md` entry 2026-11-18 00:44)
> **Parent:** the owner's eye on a launcher stand window during epic 55 B7 (`plans/55_EPIC_conan_build_0_9_1_for_3_1_1.md`)
> **Status:** 🔧 started 2026-11-18 00:46 — rule written (`HOUSE_RULES.md` 33, `researches/russian-writing/RUSSIAN_RULES.md` §11), the lint built,
> the first surfaces rewritten (mod settings hub, report tool, perks, settlement log); the translation table and the storefront in progress
> **Outbound:** the release of 0.9.1 (epic 55 phase D) waits for this plan's gate

## Goal vector (Avoid)

The player and the owner never read a Russian line of the build where a dash stands in for a verb, a preposition or «это». Every line the build shows is a
whole sentence in the owner's voice (portrait `D:/work/ai_sandbox/krinik_voice/AUTHOR_STYLOMETRY.md`).

## Acceptance criteria

1. `python -I -X utf8 _config/release/dash_lint.py` (pack root) exits 0: no spaced dash in a player string of the launcher, the report tool, the uninstaller,
   the Krinik Lua mods, the mods' README files, our translation tables, the guide source and the README template — or the line is in
   `_config/release/dash_lint_allow.txt` with a reason (a string the player never sees, direct speech).
2. The rewritten lines keep every technical token of the old ones: for the translation table — the same keys, the same count of `\n`, `{…}`, `%`, `<…>` per row
   (script check in step 4).
3. The rewritten strings are seen in their real places: the hub page rows (game), the launcher window (stand capture), the report tool's console and box,
   the locres strings in the game (a sample of the fishing and damage-meter texts).
4. `release` gate: the lint runs inside `build-docs.py` before the PDF (as `guide_lint.py` does), so a new dash stops the build.

## Inventory (2026-11-18 00:5x, after the parser learned log calls, Lua long comments and list markers)

| Surface | Lines | Who rewrites |
|---|---|---|
| launcher `KrinikConanLauncher.cs` | 3 | the agent, together with B8 (after the B7 judge round) |
| report tool `collect_report.ps1`, `feedback_howto.txt` | 2 + 6 | the agent — DONE 00:5x, with the second feedback path (GitHub Issues, D-fb) |
| mod settings hub `krinik_mod_settings.lua` | 10 | the agent — DONE 00:5x |
| perks of Era of Trials `eot-perks-ru.tsv`, settlement log `il-event-phrases-ru.tsv` | 4 + 2 | the agent — DONE 00:5x (both tables are drafts not yet patched into their assets) |
| camera mod `README.md` (shipped inside the mod folder) | 40 | not rewritten: a developer's note, moved out of the shipment to `docs/dev/KrinikConanCamera_dev_README.md`; the guide carries the player's camera keys |
| translation of The Damage Meter and Exiles Fishing `dm-fish-ru.tsv` | 800 | a helper by the portrait and the method, then the script check and a sample read |
| guide source `guide-3.0.1.html` | 29 | the agent, with epic 55 D (the 3.1.1 guide) |
| README template | 13 | the agent, with epic 55 D (0.9.1 numbers, the feedback section) |

Not covered by the lint yet: strings inside our kit paks (widget texts set by `_config/devkit/*.py`), the game's `Game.locres` as built. Step 5.

## Steps

- [x] 1. Rule and method: `HOUSE_RULES.md` 33, `RUSSIAN_RULES.md` §11, memory `no-telegraph-dashes-in-russian`.
- [x] 2. The lint `ConanExiles/_config/release/dash_lint.py` + allow list `dash_lint_allow.txt`; log strings (`log`, `say`, `print`, `note`, `counted` in Lua; `Log` in C#)
      are the agent's and are skipped (`--with-logs` shows them).
- [ ] 3. The agent's surfaces rewritten (table above) and seen in place. 2026-11-18 01:0x: rewritten — the hub rows, the report tool (console read on the real
      build 00:57: both feedback paths printed), the perks and settlement log, the guide (29 lines + two `guide_lint.py` hits: a justification «так устроена сама
      игра» and «загрузчик UE4SS» in the license), the README template (13 lines + the feedback section with the second path in both languages), the launcher
      (3 lines, with B8); seen in place — the launcher window and the hub rows owed (the next launcher build, the next game run).
- [x] 5a. `build-docs.py` runs `guide_lint.py` and `dash_lint.py` before printing the PDF; a red lint stops the print (control 01:05: «PDF не печатаю», exit 1).
      `guide_lint.py`'s header had promised that call since 2026-10-31 — it never existed (standing falsehood, corrected by making it true).
- [ ] 4. `dm-fish-ru.tsv`: the helper's 800 rows applied by a script that checks key and token parity; then `build-ru-table.py` → `hosav-ru-entries.py` → the locres
      build (`_config/localization/README.md` steps 3–4); a sample of ten rows read in the game.
- [ ] 5. Grow the lint to the kit scripts' widget texts and to the built `Game.locres`; wire it into `build-docs.py`.
- [ ] 6. Judge round on the whole diff; commit with `review:`.

## Decisions made without the owner

`[AI]` (revisable): the camera mod's developer README leaves the shipment instead of being rewritten (the guide is the player's document); the lint treats a hyphen
at the start of a line as a list marker; the hint of the zoom-speed slider reads «большее число ускоряет» (the portrait's law З2 keeps «чем …, тем …» out of an
instruction).
