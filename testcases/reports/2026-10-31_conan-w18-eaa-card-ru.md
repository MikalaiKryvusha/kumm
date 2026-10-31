# Run report — 2026-10-31 · W18 twin sweep: Russian for the EAA class-artefact card and the Beyond Decor menu line

## 1. Work

Plan 36 W18 «sweep ALL English strings» — the restored bytecode scan over every mod of the build, then the player-facing finds translated into
`Game.locres` without losing the fixes made straight in that file.

## 2. Contour

Pack `ConanExiles` (`feb2805`); the 20 GB text extract `_text-extract-3.0.1`; the dev kit's `KrinikRU` localization target; the live game for the lookup;
machine lock `kumm` 23:18–23:20; the owner's save restored after.

## 3. Runs

- 2026-10-31 23:12 — `python -I -X utf8 _config/compat/missing-bytecode-ftext.py <_text-extract-3.0.1>` (38 s) → 28 keys.
- 2026-10-31 23:14 — `extend-worklist.py … - cards=<6 keys>.csv`; `owner-terms-check.py` (0); `build-ru-table.py`; `hosav-ru-entries.py …`.
- 2026-10-31 23:17 — `UnrealEditor-Cmd … -run=GatherText -config=…KrinikRU_Compile.ini`; `locres-regress.py` (old vs the full build: exit 1, 4 changed, 2 lost) →
  `locres-add-keys.py … --check`, then without `--check`; `locres-regress.py` (old vs the patched file: exit 0); control runs (0 added; a bad key → exit 2).
- 2026-10-31 23:18 — `deploy-localization.py`; `launch-bg.ps1`; the remote `KismetTextLibrary:FindTextInLocalizationTable('', <key>, out, '')` for the 6 keys.

## 4. Checks

Hygiene: `owner-terms-check.py` 0 violations; `locres-regress.py` lost 0 / changed 0; the add-keys tool's two control runs.
Functional run: the live game's localization table read for all 6 keys — each found, Russian text returned (`Меню Beyond Decor: правка украшений ♥`,
`Артефакты класса …` ×5). NOT seen: the EAA class card or the Beyond Decor menu on screen.

## 5. Found

1. A full localization rebuild would revert 6 entries fixed straight in `Game.locres` — their sources were not edited (debt in the localization README).

## 6. Traces

Session scratchpad: `missing_now.csv`, `eaa-bdii-cards.csv`, `Game_before.locres`, `loc_compile.log`.

## 7. Verdict

partial — the keys are in the game's table in Russian; the screens that show them are not observed.
