# Test run report — Conan 3.0.1: bytecode FText into .locres, Damage Meter corner default, data table merge semantics
**Created:** 2026-10-26 12:13 +03:00 · **Run by:** the agent (Claude Opus 5.5) ·
**Version/build:** Conan Exiles Enhanced 3.0.1 (CL-379176), pack `ConanExiles` 17867ba, `_tools/src/uaj` with `prop:` and `func`

## 1. Work
Cases of `testcases/TC_conan_build_stability_compat_perf_2026-10-26.md`: T3 (locres regression), D1 (built pak part), C4 (T4 armorer row) and
its twin for bosses (docs/17 item 3). Basis: bugs/64 items 7 and 1/10; owner's word «нужно сворачивать не в левый нижний угол, а в левый
верний», «если у мода есть своя настройка - то просто в поставке мода меняем значение по умолчанию»; criterion 2 of the build (conflicts).

## 2. Contour
Pack tools on the agent's machine; kit `F:/CEUE5Devkit` (GatherText compile); live game PID 15460 started 11:24 — the owner was playing in
it (idle 39–42 s), so only read-only pult reads were made, no restart, no menus opened.

## 3. Runs
- 2026-10-26 11:50–12:00 `hosav-ru-entries.py` (old) — killed after the manifest/archive were written; 12:01 fixed version, 3.7 s:
  `python -I -X utf8 ../devkit/hosav-ru-entries.py "<interview 002>,<interview 003>,<dm-fish-ru.md>" all-mods-ftext.csv F:/CEUE5Devkit/UE4/Saved/Loc/KrinikRU KrinikRU`
- 2026-10-26 ≈12:00–12:02 `UnrealEditor-Cmd.exe ConanSandbox.uproject -run=GatherText -config=…\KrinikRU_Compile.ini -unattended -nopause -NullRHI -nosplash`
- 2026-10-26 12:02 `python -I -X utf8 _config/devkit/locres-regress.py _config/localization/Game/ru/Game.locres F:/CEUE5Devkit/UE4/Saved/Loc/KrinikRU/ru/KrinikRU.locres`
- 2026-10-26 ≈11:57 `python -I -X utf8 _config/devkit/patch-mod-asset.py build DamageNumber DN_SG_SaveSettings <work> _config/localization/asset-strings/DamageNumber__DN_SG_SaveSettings.tsv`; `cmp -l` legacy vs patched `.uexp`
- 2026-10-26 ≈12:06 `uaj setstr` with `prop:TextBlock_Hunters_5/Font/Size` on `BP_EAA_Template` and the DamageNumber map again; `cmp`
- 2026-10-26 12:08–12:11 `bash _config/pult.sh "lua … StaticFindObject('/Game/Systems/SpawnTable/ProfessionTemplateDataTable…'):ForEachRow(…)"` and the same for `SpawnDataTable`

## 4. Checks
Hygiene: `dotnet build` of uaj 0 errors; `modpack.json` parses; placeholder check of 53 new rows — 0 mismatches.
Functional run: tool runs on the real mod assets and the real kit; the live game's data tables read through the pult; the in-game look of
the new translations and of the minimized Damage Meter — NOT yet (needs a relaunch the owner's session blocks).

| Case | Status | Observation |
|---|---|---|
| Stitcher fix (golden) | pass | new manifest + ru/en archives byte-equal to the pre-fix output (`cmp`), 3.7 s instead of > 10 min |
| T3 | pass | 54 381 → 54 440 entries, lost 0, changed 0 (+59 = the new keys) |
| D1 (pak) | pass | one byte at `.uexp` 1937: 2 → 0, size 2286 both; game part — not run |
| `prop:` scoped | pass | one byte changed (float 18 → 15), unknown export reported «НЕ НАЙДЕНО»; global map rebuilt byte-equal |
| C4 | pass | `Armorer_4` live: tier 4, craft groups 9, bonus recipes 31, combos 18, Crafter |
| C4 twin (bosses) | pass | `Aesir_Boss` live: BMNB stats/profession/KO mods + Heritage `Race_AesirMale/Female` |

## 5. Found
- `hosav-ru-entries.py` report rebuilt a set per table row (quadratic) — fixed in the same move.
- `uaj func`: UAssetAPI 1.1.0 parses only part of the 5.8 functions (ubergraph and `Is_VisibleInInventory` stay raw) — limit, written down.
- docs/17 items 2 and 3 were false alarms: the game merges rows per field.

## 6. Traces
`D:\Temp\claude\d--work-ai-sandbox-KUMM\eeaa02cd-eb9f-44a3-800e-8a2ca913f679\scratchpad\regress2.log`, `stitch2.log`, `compile2.log`,
`stitch-golden\`, `dnbuild\DN_SG_SaveSettings\`, `t13\`; pult answers quoted in `ConanExiles/docs/17` and in this report.

## 7. Verdict
partial — tool and data checks pass; the in-game cases T2, D1 (game part), U2b wait for a relaunch after the owner's session.
