# Run report — our kit paks on the 3.1.0 devkit + the «+» in Conan gold (2026-11-14)

## Work

Plan 53 step 10 (our three kit paks rebuilt on the 3.1.0 kit CL 383024: KrinikConanGraphics `M_Foliage` WPO bound, KrinikConanUI with the «3.1.0»
line, KrinikConanArchery) and plan 49 G1 (the attribute «+» in the owner's Conan gold `#E9C27A`, hover `#ECD97C`, page arrows in the same gold). Basis — the case
set `testcases/TC_conan_kit_310_our_mods_2026-11-14.md` (K1–K10).

## Contour

The 3.1.0 game (`targets.json` target «3.1.0», Revision 383 024), the owner's world save; paks built by `ConanExiles/_config/devkit/kit-buildmod.py`
(aligned with the 3.1.0 BuildMod.cs: no ModCompat.bin, pipeline caches, the manifest's `<xxh128>` block), deployed by `Deploy-ModPack.ps1 -Deploy -Only …`;
machine lock «kumm»; the game launched by `launch-fg.ps1` (it stayed behind VS Code both times), read by the remote `pult.sh`, frames by `capture-window.ps1 -Width 3840`.

## Runs

- 2026-11-14 00:49–00:53 — run 1: `Deploy-ModPack.ps1 -PackDir D:\work\ai_sandbox\ConanExiles -Deploy -Only 'KrinikConanGraphics','KrinikConanUI','KrinikConanArchery'`
  (3/3, verify 114 present, 0 missing) → `launch-fg.ps1` (PID 33888) → `enter-world-remote.sh` → remote reads, frames, the tint A-B (`plus-tint-probe.lua`:
  R 1.5623 / 1.0 / 0.3); game closed by PID 00:54, no crash window.
- 2026-11-14 01:03–01:10 — run 2 (the «+» by baked textures): `make_plus_gold.py` → `run-plus-gold.sh` (import, `kit-plus-button-gold.py`, `kit-buildmod.py
  KrinikConanUI`) → `-Deploy -Only 'KrinikConanUI'` → `launch-fg.ps1` (PID 28440) → `enter-world-remote.sh` → `ActivateModule(Inventory)` + `SetCarouselIndex(2)`
  → frames; `mouse-seq.ps1 -Seq "move:0.1898/0.2542,wait:5000"` (hover, owner FREE); `attr-arrows-show.lua`; `strip-open.sh k8 BP_PL_Crafting_CampFire_C`.

## Checks

Hygiene: every built pak's manifest re-hashed by an independent pass (`check_manifest_hashes.py`: 7/7 for each of the three, run 2's UI 7/7); our XXH128 =
  the kit's on an official build (Frequent_meteors 10/10); `set-pak-version.py` on a copy of an `<xxh128>` pak — 10/10, its control (the old script) — modinfo
  xxh128 DIFF; the cooked `M_Foliage` vs the game's 3.1.0 one by tagged property — only our bound and `StateId` differ.
Functional run: the 3.1.0 game with the owner's world, run by the remote and two real-input steps; READ: the game log (mounts), the UE4SS log, the remote's
  live reads (the bound, the button's style tints, the strip's slot paddings), 4K frames by eye and by pixel samples.
- K1 pass · K2 pass (bound 100.0 live) · K3 pass · K4 pass («3.1.0» · «0.9.0») · K5 fail → fixed → pass (run 1 tint clamped; run 2 rim (206, 175, 107) vs the
  owner's mockup 05 (209, 178, 118)) · K6 pass (hover (229, 206, 104)) · K7 pass by stand (arrows made visible by the remote; no row past 20 in this save) ·
  K8 pass (strip slot L120/R120, loot L500) · K9 blocked in run 2 (the LMB landed on the open hub's «+» — Found 7), pass in run 3 (01:32: a real draw and shot,
  the aim held to the RMB release, an arrow copy born) · K10 pass by K2.

## Found

1. The kit update REPAIRED our in-place `M_Foliage` edit (bound back to 0) — re-applied; the rule written in the mod's notes.
2. `kit-buildmod.py` had drifted from the vendor's BuildMod.cs: it still listed `ModCompat.bin` (the 3.1.0 cook no longer writes it — UnrealPak skipped it
   silently), lacked the pipeline caches and the manifest's `<xxh128>` block — aligned.
3. `set-pak-version.py` and `set-pak-modinfo.py` updated only the MD5 of `modinfo.json` — on a pak with an `<xxh128>` block the loader would keep the OLD
   extracted modinfo; fixed through the shared `kit_manifest.py`. No installed pak was stale (scan of 66).
4. A brush tint above 1.0 is clamped on screen per channel — the tint way of plan 49 G1 could not reach `#E9C27A`; the gains baked into our textures.
5. The game's own mod list lost our texts in the move (plan 53 step 13 — open).
6. Two remote traps: the hub controller keeps a second set of attribute rows — the first `FindAllOf` match may be a hidden copy; `launch-fg.ps1` did not get the
   game in front while VS Code held the foreground (both runs).
7. My own test input spent a point: K9's real LMB (01:09) landed on Сила's «+» — the hub had NOT closed (`ActivateModule(Inventory | CharacterInventory, false)`
   leaves it open) and the cursor stood where K6 left it; the hero's free points 2 → 1, Сила 1 → 2. Rule for the next real-input step: close the hub by the
   player's key and park the cursor off every button first.
8. Judge round 1 (a fresh helper on the pack diff): 10 findings — fixed 7 (stale-xxh128 repair in both modinfo scripts, lazy xxhash import, the second-active-mod
   refusal, `if not compiled`, the stale header and dead code, the Lua probes' order and globals, the useless `IsInViewport` read; the row-position probe
   removed), confirmed and deferred 1 (the paks are built UNcompressed — BuildMod compresses only with `-Compress` + `-OodleLevel=Optimal3`; size only, the
   verified paks stay), declined 2 with reasons (hover/pressed gains referenced to the default texture — hover measured within ≈ 10 sRGB of #ECD97C, an `[AI]`
   state; the `ModsShared` remap of FileToPackage — no FilesToCook line uses `Shared/`). Re-tests: the stale-xxh128 repair proven against copies made stale
   by the OLD scripts (A, B: DIFF → 10/10), the second-active-mod refusal, an MD5-only manifest with no xxhash import.

## Traces

Frames (working copies, `KUMM/.work/kit310/frames/`: `k4_menu.jpg`, `k3_world.jpg`, `k5_attr.jpg`, `k5_attr_r10.jpg`, `k5_attr_r03.jpg`, `k5b_attr.jpg`,
`k6_hover.jpg`, `k7_arrows.jpg`, `k8.jpg`); kit logs `KUMM/.work/kit310/*.log`; reports `ConanExiles/_config/devkit/kit-foliage-wpo.json`,
`kit-plus-button-gold.json`, `kit-conanui-edit.json`, `import-logo-texture.json`; the game's `ConanSandbox/Saved/Logs/ConanSandbox.log` and `ue4ss/UE4SS.log` of run 2.
Window closures: run 1 game closed by PID 33888 (no crash-report window).

## Verdict

pass — K1–K10 pass; K9 passed in run 3 (2026-11-14 01:31–01:33: `launch-fg.ps1` PID 22472 → `enter-world-remote.sh` → a real draw and shot by `mouse-seq.ps1`
with the cursor parked at the centre; the aim held until the RMB release, an arrow copy born; game closed by PID, no crash window).
