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
- [x] 3a. Found on the way (rule 20 class): the README said «7 + 64 mods» while the build has 9 + 63, and its versions were typed by hand. Since 2026-11-18
      01:1x the template carries `{{PACK_VERSION}}`, `{{GAME_VERSION}}`, `{{GAME_BUILD}}`, `{{GUIDE}}`, `{{OURS}}` / `{{OTHERS}}` and `{{OURS_RU}}` / `{{OTHERS_RU}}`
      (Russian plural), filled by `_config/public_release/mods-table.mjs` from `modpack.json` and its own table; a placeholder left unfilled stops the script.
- [x] 5a. `build-docs.py` runs `guide_lint.py` and `dash_lint.py` before printing the PDF; a red lint stops the print (control 01:05: «PDF не печатаю», exit 1).
      `guide_lint.py`'s header had promised that call since 2026-10-31 — it never existed (standing falsehood, corrected by making it true).
- [ ] 4. `dm-fish-ru.tsv`: the helper's 800 rows applied by a script that checks key and token parity; then `build-ru-table.py` → `hosav-ru-entries.py` → the locres
      build (`_config/localization/README.md` steps 3–4); a sample of ten rows read in the game.
      2026-11-18 01:1x: the helper rewrote 800 rows (798 changed, 11 direct-speech rows kept with reasons → `dash_lint_allow.txt`); the parity script
      (`.work/dash_fix/apply_dmfish.py`: keys, `\n`, `{…}`, `%`, `<>`, no dash) — 800 ready, 0 problems — wrote them into `dm-fish-ru.tsv`; **the whole lint is 0**.
      The direct `Game.locres` route instead of a full rebuild: `locres-fixes-2026-11-18.tsv` (741 pairs whose old text IS in the built file; 56 rows are not in
      the built file at all — left for the next full rebuild), `locres-set-tr.py --check` exit 0; **not yet written** — an independent read of a 61-row sample runs
      first. Then `deploy-localization.py` and the in-game sample.
      **01:23 REJECTED and reverted** (`git checkout HEAD -- dm-fish-ru.tsv`, the 11 allow entries and the fix file removed): a clean instance read a 61-row
      sample — 12 rows made worse by the rewrite, 4 old errors. Cause: MY brief said «no spaced dash except direct speech», stricter than the owner's norm
      (portrait §2.4: a dash stands between two nominative nouns, before «это», for a consequence or a condition, for a summary, for a contrast) — the helper
      turned allowed dashes into colons, repeated verbs and subjectless «и …», and broke meaning in places (6154, 2361, 3725 «до 10%», 3972 a hedge, 15642,
      6177). **Next pass brief:** touch ONLY a dash that stands for a missing verb, preposition or «это»; keep the allowed ones and allow-list them with the
      norm's class; fix the four carried-over errors (14487 «не стали изгонять» inverts the meaning, 8430 Yog slithers himself, 8126 «естественном …
      естественно», 6965 the material name vs EN); a reviewer reads a fresh sample; the parity script stays (`.work/dash_fix/apply_dmfish.py`). The lint stays
      strict, so `build-docs.py` refuses the PDF until this step is done. The helper's output and the review are kept in `.work/dash_fix/` (`dm_fish_new.tsv`,
      `sample.tsv`) for the next pass. **01:28 pass 2 started by a helper with that brief** → `.work/dash_fix/pass2/new.tsv` + `allowed.tsv` (class per kept dash);
      then: `apply_dmfish.py` parity (point it at pass2), a clean-instance read of a fresh sample, the allowed rows into `dash_lint_allow.txt` with their class,
      `make_locres_fix.py` → `locres-set-tr.py`, `deploy-localization.py`, the in-game sample.
- [ ] 5. Grow the lint to the kit scripts' widget texts and to the built `Game.locres`; wire it into `build-docs.py`.
- [ ] 6. Judge round on the whole diff; commit with `review:`.

## Scope set by the owner 2026-11-18 08:11 (verbatim — `PROJECT_HISTORY.md` entry 2026-11-18 08:11; `HOUSE_RULES.md` 33.5)

Only text the agent wrote, and only a dash that was wrong from the start. Consequences for this plan:
- Every surface of the inventory gets an author column before any rewrite: the agent's (launcher, report tool, hub rows, our translation tables
  `dm-fish-ru.tsv`, `asset-strings/*.tsv`, the guide, the README template) — in scope; another author's (a mod's own Russian, the game's) — out of scope.
  The Hosav table of interviews 002 / 003 is the agent's draft accepted by the owner: in scope, and every change there is shown to him (write-gate).
- Pass 2 of `dm-fish-ru.tsv` already keeps the legal dashes (663 rows with their class in `allowed.tsv`) and changes 175 rows: it is checked row by row
  against BOTH conditions before it is applied.
- [ ] Re-read the rewrites already committed in the pack (`2d4b104`: launcher, report tool, hub rows, perks, settlement log, guide, README template) for a legal
  dash that was turned into something else; such a line goes back to its original wording and into the allow list with its class.

## Judge round on the tooling (2026-11-18 01:40, pack `2d4b104`) — to act on first

Checked against real data by the judge; to verify and fix in the next chat:
- D1 `_config/localization/asset-strings/*.tsv` (34 files patched into KRINIK MODIFIED assets) are not scanned (non-recursive glob) — 8 dashes ship today.
- D2 the Hosav translation reaches `Game.locres` through `kit-saved-loc/KrinikRU/ru_table.lua` from interviews 002 / 003 — not scanned; 9 dashes ship
  today. The robust fix: lint the shipped `Game.locres` itself.
- D3 `Deploy-ModPack.ps1` prints each mod's `version` from `modpack.json` on the player's install — not scanned; 4 Russian versions carry a dash.
- D4 `build-docs.py --no-pdf` (the route of every launcher build) runs no lint; D5 a full build now stops on the dm-fish lines and skips the launcher too,
  and hits are printed cut at 220 characters, so long allow entries cannot be copied.
- Risks R1–R11 (a literal starting with a dash read as a list marker; C# char literals `'"'` / `'('` desync the tokenizer; `@$"…"`; Lua `[==[` strings;
  dash forms U+2212 / U+2015 / narrow space; the allow list is global and tab-blind; mods-table pairs GAME_VERSION with the first CL of builtFor unchecked).
  The full report is this chat's judge hand-back (summarised here).

## Decisions made without the owner

`[AI]` (revisable): the camera mod's developer README leaves the shipment instead of being rewritten (the guide is the player's document); the lint treats a hyphen
at the start of a line as a list marker; the hint of the zoom-speed slider reads «большее число ускоряет» (the portrait's law З2 keeps «чем …, тем …» out of an
instruction).
