# Test run report — boss rows under Heritage + Bosses My New Besties, and the Grey One Mask control (plan 45 steps 4 and 1)

**Created:** 2026-11-06 11:15 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** Conan Exiles 3.0.1 working install; pack `ConanExiles` after `2a7ed07`
(Heritage unmodified, Workshop pak 2026-10-02; Mines of Set original for M0 only)

## 1. Work

Plan 45 step 4: does Heritage (loaded later) wipe Bosses My New Besties' recruitability fields on the 17 boss rows both write, as the file-level reading of
10:47 claimed? And, by the same mechanism, step 1: was Severe Weather's breather on row 51420 really lost under Mines of Set? Cases H0, H1, M0, H3 of
`testcases/TC_conan_boss_recruit_heritage_bmnb_2026-11-06.md`.

## 2. Contour

The live game tables after a world start (`Systems/SpawnTable/SpawnDataTable`, `Items/ItemTable`), read by the remote `KrinikAgentRemote` with the new
read-only `_config/live-rows.lua` (each field as text by `DataTableFunctionLibrary:GetDataTableColumnAsString`), against each mod's own table loaded in the same
game. Background path, machine lock held. REAL WORLD: accumulated — the owner's working install and save (`Game_0.db`, the oasis); data and machine — his
machine, his game folder; path — the game's own load of the paks in `ConanSandbox/Mods`.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-06 10:56 +03:00 | `python -I -X utf8 _config/devkit/rebuild-krinik-paks.py --only Heritage --expect-changed HeritageSpawnDataMasses --expect-changed HeritageSpawnDataUniques --install --keep` | 0 · 33 chunks identical, 2 changed on purpose — later reverted (not needed) |
| 2 | 2026-11-06 11:01 +03:00 | `bash _config/pult.sh "lua _G.__lr={…SpawnDataTable…, mod=…BMNB_SpawnDataTable…, rows={17}, fields={ProfessionTemplate,StatTemplate,StatModifierTemplate,NPCClass}}; return dofile('…/live-rows.lua')"` (first version, Lua property read) | 0 · three fields SAME 17/17; `NPCClass` unreadable (opaque soft-pointer userdata) |
| 3 | 2026-11-06 11:02 +03:00 | probe `Default__KismetSystemLibrary:Conv_SoftClassReferenceToString(<soft userdata>)` | the game crashed (`EXCEPTION_ACCESS_VIOLATION` in UE4SS) — crash window closed; EXP-0459 |
| 4 | 2026-11-06 11:06 +03:00 | run 2 again with `live-rows.lua` reading columns as text | 0 · all four fields SAME 17/17 |
| 5 | 2026-11-06 11:07 +03:00 | `live-rows.lua` fields `MaleRaceTemplate,FemaleRaceTemplate` against BMNB, `HeritageSpawnDataMasses`, `HeritageSpawnDataUniques` | 0 · Heritage 14 + 3 SAME; against BMNB DIFF 16 / 13 |
| 6 | 2026-11-06 11:13 +03:00 | original `Mines_of_Set.pak` swapped in; `live-rows.lua` on `Items/ItemTable` row 51420 vs `LFS_ItemTable` | 0 · every breather field DIFF (live = plain armour, Mines of Set's row) |

## 4. Checks

Hygiene: `row-diff.py` re-run on the saved JSONs of the four tables (Keymaster, Aesir_Boss, both load orders) — the new wording, no «LOST» for a field-merged table.
Functional run: walked — the game's own world load with the paks as shipped; read — the live table values on screen of the remote's reply (runs 4–6).

| Case | Status | Observed |
|---|---|---|
| H0 | pass | live `SpawnDataTable`, ORIGINAL Heritage: BMNB's `ProfessionTemplate`, `StatTemplate`, `StatModifierTemplate`, `NPCClass` SAME on 17 of 17 rows (e.g. `Aesir_Boss` `NPCClass` = `/Game/Mods/BossesMyNewBesties/HumanoidNPCCharacter_20percentbigger_noknockout…_C`) |
| H1 | pass | Heritage's races live: 14 rows SAME to `HeritageSpawnDataMasses`, 3 to `…Uniques`; control — the same fields against BMNB's table DIFF 16 / 13 (the reader can say DIFF) |
| H2 | skipped | H0 passed — the merged pak is not needed; reverted (manifest entry, library copy, `_patch-originals` link, two maps) |
| M0 | pass (as a control) | original Mines of Set: row 51420 live = `BPGameItemArmor_C`, armour 35, «Light», `RepairXP` 3 710, Mines of Set's icon layers — Severe Weather's breather IS lost without the merge; `Items/ItemTable` replaces whole rows |
| H3 | skipped | knocking a boss out is BMNB's own function (criterion 2 of the build), not this overlap; owed in plan 45 / the BMNB notes |

## 5. Found

- The claim «Heritage wipes BMNB's recruitability on 17 bosses» (10:47) was FALSE — the spawn table merges by field (EXP-0458); corrected in the register,
  plan 45, both mods' notes, the guide and its Russian copy, the game map, `row-diff.py`.
- The opposite generalization (written 11:1x, «the game always merges by field») was false for the item table (run 6) — narrowed in the same places.
- Passing a UE4SS soft-pointer userdata to a UFunction crashes the game (run 3; EXP-0459).

## 6. Traces

Remote replies — `D:\Temp\claude\2979a53d4df93a2f\b28e2269-24c2-4684-94d1-c5c83312e18c\scratchpad\h0.txt`, `h0b.txt`, `h1.txt` (session scratchpad);
`UE4SS.log` lines `[KrinikAgentRemote]` 11:01–11:13; the crash: the owner's pasted report (`EXCEPTION_ACCESS_VIOLATION reading address 0x1c`, UE4SS frames).

## 7. Verdict

pass — the 17 boss rows lose nothing (no merge needed, Heritage ships unmodified); the Grey One Mask merge is confirmed necessary. Not covered: H3 (the
recruit function in play).
