# TC — bosses keep Bosses My New Besties' recruitability under Heritage (plan 45 step 4)

> **Created:** 2026-11-06 · **Parent:** `plans/45_conan_mod_reconciliation_all.md` step 4; `researches/mod-reconciliation/GUIDE.md` step 5
> **Status:** cases written 2026-11-06 10:59 +03:00; run 2026-11-06 11:16 +03:00 — H0, H1 pass, M0 the finding, H2, H3 skipped (report `testcases/reports/2026-11-06_conan-boss-rows-heritage-bmnb-live.md`)
> **Outbound:** —

## Test basis

- `[OWNER]` the build's criterion 2 (`MASTER_PLAN.md`): no row where a mod silently loses its change.
- Claim under test (previous chat, file-level `row-diff.py`): Heritage, loaded later, wipes BMNB's `ProfessionTemplate` / `StatTemplate` /
  `StatModifierTemplate` / `NPCClass` on 17 boss rows. Counter-evidence: `ConanExiles/docs/17`, item 3 — the live table of 2026-10-26 showed 3 of
  these bosses with BMNB's fields AND Heritage's races (the game merges rows field by field).

## Stand

Conan 3.0.1 working install, background path (`launch-bg.ps1`), the remote `KrinikAgentRemote`, world entered by `enter-world-remote.sh`. Paks: H0 — the
ORIGINAL Heritage pak (`_workshop/3726392245`, 2026-10-02) in `ConanSandbox/Mods`; H2 — the merged pak only if H0 fails. Read-only reads: `_config/live-rows.lua`.
Boss case: god mode, the boss spawned by the remote's `Summon` before the hero (class from the live row's `NPCClass`), knocked out by the remote.

## Cases

| Case | Dimension | Steps | Expected | Status |
|---|---|---|---|---|
| H0 | control: the ORIGINAL Heritage | world start; `live-rows.lua` over the 17 rows, fields ProfessionTemplate, StatTemplate, StatModifierTemplate, NPCClass vs `BMNB_SpawnDataTable` | if the field merge holds: SAME on every BMNB field of every row (17 × 4) | **pass** — 17 × 4 SAME (11:06) |
| H1 | the same start, Heritage's side | `live-rows.lua` with `mod` = `HeritageSpawnDataMasses` / `…Uniques`, field MaleRaceTemplate | SAME — Heritage's races live | **pass** — 14 + 3 SAME; control vs BMNB DIFF 16 / 13 |
| H2 | only if H0 shows DIFF: the merged pak | install the merged pak, a world start, H0 again | SAME 17 × 4 | **skipped** — H0 passed, merge reverted |
| M0 | control for plan 45 step 1 (same mechanism): the ORIGINAL Mines of Set | world start; `live-rows.lua` on `Items/ItemTable` row 51420, fields ItemClass, ArmourValue, FirstModifier, Icon, IconLayers, GameplayTags, RepairXP vs Severe Weather's `LFS_ItemTable` | field merge holds → SAME on the breather fields Mines of Set keeps vanilla (ItemClass, ArmourValue…); DIFF on RepairXP (both change it) | **fail of the expectation = the finding** — every breather field DIFF: the item table replaces whole rows; the 51420 merge is needed |
| H3 | the function the player sees | a boss of the list summoned by its live class, knocked out (not killed) | lies unconscious, «Взять в рабы» offered | **skipped** — BMNB's own function, owed under criterion 2 |
