# Run report — 2026-10-31 · DM0 (F1 and the Damage Meter) and C1 (the Caverns of Set chest), agent's probes

## 1. Work

Two cases of `testcases/TC_conan_build_stability_compat_perf_2026-10-26.md` the owner left to the agent (STATUS «THE AGENT'S since 21:11»): DM0 — does the
expanded Damage Meter cover Hosav's HUD text; C1 — are the Caverns of Set chests empty (their loot table is missing from the mod).

## 2. Contour

Conan Exiles 3.0.1, the full build (pack `342c676`); background launch; the owner's save restored after; machine lock `kumm` 22:51–22:55.

## 3. Runs

- 2026-10-31 22:51 — `launch-bg.ps1`, `enter-world-remote.sh`, `god-on.sh`; DM0: `capture-window.ps1` before; `mouse-seq.ps1 -Seq "kdown:0x70,wait:120,kup:0x70,…"`,
  then `"kdown:0x87,…,kdown:0x70,wait:120,kup:0x70,…"`, then the same with `wait:1500`; a frame after each; the remote listed `DN_*` widgets.
- 2026-10-31 22:56 — a second launch: the remote listed `DN_UI_DmgWidget_C` functions and called `Restore()`; a 4K frame.
- 2026-10-31 22:54 — C1: `retoc.exe list --path Mines_of_Set-Windows.utoc` (the build's paks view); the remote `LoadAsset('/Game/Mods/Mines_of_Set/Blueprints/BP_PL_CoS_Loot_Chest.BP_PL_CoS_Loot_Chest_C')`,
  the CDO's inherited properties (`ForEachProperty` up the super chain), `LootTable` of the chest CDO and of the parent CDO.

## 4. Checks

Hygiene: none (no code changed).
Functional run: real F1 key presses in the live world with frames read; the remote reads of the live class objects.

| Case | Status |
|---|---|
| DM0 | blocked at 22:53 (F1 expands nothing in three variants) → PASS 22:57 on a second launch: `DN_UI_DmgWidget_C:Restore()` (its function list read by `ForEachFunction`) expanded the meter; ≈ 35 px under the HUD text at 4K (frame `dm_restore`); F1 only moves the window |
| C1 | partial — the mod's container has no `Caverns_of_Set_Loot_Chest_Table`; the chest CDO's `LootTable` is nil, as the vanilla parent's — not decisive |

## 5. Found

none proven — C1's defect stays a hypothesis until a placed chest instance is read.

## 6. Traces

Session scratchpad `seams/`: `dm_before.webp`, `dm_after.webp`, `dm_after2.webp`, `dm_after3.webp`, `dm_pair.webp`, `dm_three.webp`.

## 7. Verdict

pass (DM0, after the restore function) · partial (C1) — the next step is written in the C1 row.
