# Test run report — shared vanilla files of the build: LegitReligious's stale stat table, the thrall system, buff icon, empty map (plan 45 step 8)

**Created:** 2026-11-06 12:10 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** Conan Exiles 3.0.1 working install; pack `ConanExiles` after `620d1c7`

## 1. Work

Plan 45 step 8 (kind 3, assets): the vanilla paths shipped by two or more paks of the build, and a vanilla table shipped whole by one mod. Cases S0, S1 of
`testcases/TC_conan_boss_recruit_heritage_bmnb_2026-11-06.md`; the new `patch-mod-asset.py` operation `vanilla:`.

## 2. Contour

`mod-overrides.py` over `ConanSandbox/Mods` (the build as installed); chunk hashes by `retoc list --path --hash` (game containers vs the mods' extracted
containers); the three copies of `BP_ThrallSystemComponent` by `retoc to-legacy` + `uaj exports` + `kismet-trace.py`; the stat table by `uaj rows` and a value
comparison of UAssetGUI JSON; the live table by the remote. REAL WORLD: accumulated — the owner's working install and save; data and machine — his; path —
the game's own load of the shipped paks.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-06 11:53 +03:00 | `python -I -X utf8 _config/mod-overrides.py <out.tsv> "<game>/ConanSandbox/Mods"` | 0 · 565 rows: 110 overrides, 455 own tables; 3 vanilla paths in 2+ paks |
| 2 | 2026-11-06 11:56 +03:00 | `retoc list --path --hash` ×3 and `uaj exports` ×3 on `BP_ThrallSystemComponent` | 0 · three different hashes; BMNB changes 1 function, LBPR 6 (the same one among them) |
| 3 | 2026-11-06 11:58 +03:00 | `uaj rows` + a JSON value comparison of LegitReligious's `ItemStatModificationTable` vs the game's | 0 · 1 653 rows identical, 0 own, 51 of 3.0.1 missing |
| 4 | 2026-11-06 12:01 +03:00 | `pult.sh "lua return dofile('…/ismt/live_keys.lua')"` (the build as shipped) | 0 · live rows 3 353; of the 51 — present 0 |
| 5 | 2026-11-06 12:03 +03:00 | `rebuild-krinik-paks.py --only LegitReligious_Enhanced --expect-changed ItemStatModificationTable --install` | 1 · the to-zen guard refused: the shared view held the game's copy of the same path |
| 6 | 2026-11-06 12:04 +03:00 | the same with `"env": {"PATCH_VIEW": "<work>/view"}` | 0 · 13 chunks identical, 1 changed on purpose; installed |
| 7 | 2026-11-06 12:06 +03:00 | run 4 again | 0 · live rows 3 404; of the 51 — present 51 |
| 8 | 2026-11-06 12:08 +03:00 | `kismet-trace.py` of `ShowThrallPlaceable`, game vs BMNB | 0 · BMNB adds: boss tag → the ghost's `SetActorScale3D` = the thrall's scale |
| 9 | 2026-11-06 12:17 +03:00 | `rebuild-krinik-paks.py --only StorageReachExpanded --expect-changed CustomConsoleCommandsDataTable --install --keep` (after a false stop on a soft path, fixed) | 0 · 8 chunks identical, 1 changed on purpose |
| 10 | 2026-11-06 12:18 +03:00 | `python -X utf8 _config/hidden-row-pairs.py --index <mod-keys.tsv>` (index by `mod-table-keys.py`, 39 664 keys) | 0 · 392 hidden rows → 1 real cross-mod pair (MSCasaDesFlores Weapons → Nails) |
| 11 | 2026-11-06 12:21 +03:00 | `pult.sh` — `cmd_check.lua`; `live-rows.lua` on item 147483093 in three tables | 0 · 8/8 console commands; the nails item = the Nails mod's whole version |

## 4. Checks

Hygiene: the build's guards (to-zen control chunk byte-identical — and it went RED once on a wrong view, run 5: the guard works); `rebuild-krinik-paks.py`
chunk identity.
Functional run: walked — the game's world load with the shipped paks; read — the live stat table's row count and the 51 keys (runs 4, 7).

| Case | Status | Observed |
|---|---|---|
| S0 | fail → the finding | the stale copy wins: 0 of the 51 rows of 3.0.1 live — the Derketo Acolyte set and the Anvil Keeper armour had no stat modifications |
| S1 | pass | after `vanilla:`: 51 of 51 live, 3 404 rows = 3 353 + 51 (the 1 700 rows the mods merge — unchanged) |
| — | C | `BP_ThrallSystemComponent`: BMNB's boss placement-ghost scale lost under LBPR → interview #033 |
| — | A | `WBP_BuffIcon` (Era of Trials = Highmane's Arsenal, one hash); `Dev/AlmostEmpty.umap` (not a game asset); `HairColorSelections` (identical to 3.0.1) |
| C0 | pass | Storage Reach Expanded's console table = the game's + its 3: the 5 commands of 3.0.1 and `SRE.show/reset/set` live |
| N0 | pass (a reading) | item 147483093: the Nails mod's whole version live (its mesh, station, icon) — A in effect |

## 5. Found

- LegitReligious shipped a stale whole copy of the game's stat-modification table — 51 rows of 3.0.1 lost; fixed natively (`vanilla:`), seen live.
- The thrall system blueprint: an owner's choice (C) — interview #033.
- `uaj func` cannot parse this kit's bytecode (empty / garbage), `kismet-trace.py` can — the tool to use.

## 6. Traces

`D:\Temp\claude\2979a53d4df93a2f\b28e2269-24c2-4684-94d1-c5c83312e18c\scratchpad\overrides.tsv`, `tsc\trace_game.txt`, `tsc\trace_BossesMyNewBesties.txt`,
`ismt\cmp.py` output, `rebuild-lr.log`; `UE4SS.log` `[KrinikAgentRemote]` 12:01, 12:06.

## 7. Verdict

pass — the stale table fixed and seen live; the thrall system waits for the owner (#033). Not covered: a stat bonus seen on an equipped Derketo Acolyte piece
in the hero's sheet; the single-mod whole tables of other mods (plan 45 step 8 list).
