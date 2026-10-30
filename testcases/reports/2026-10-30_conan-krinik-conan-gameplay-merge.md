# Run report — Conan: KrinikConanGameplay, levels and Agility speed as one mod (plan 36 W32)

**Work.** Plan 36 W32 (the owner's Krinik mod set, W34): the level pak rebuilt under the name `KrinikConanGameplay`, the Lua mod
KrinikOblivionLocomotion made its section; basis — `testcases/TC_conan_krinik_conan_gameplay_merge_2026-10-30.md` (G1–G6).

**Contour.** Conan Exiles 3.0.1 with the build (KrinikConanUI already merged); pack `ConanExiles` with the new last manifest entry; the owner's save
copied to `Conan Exiles Mods/_save-backup/2026-10-30_1420-before-gameplay-run` (identical to the 14:10 copy) and restored after; god on; lock 14:20–14:22.

**Runs.**
- 14:17 `python -I -X utf8 build-level-mod.py --name KrinikLevelUncapped --work <scratch> --out <scratch>` — step 6 failed: `KIT_UNREALPAK` named the
  removed kit `F:\CEDevKit\…`; fixed to `F:\CEUE5Devkit\…`; rerun rc 0, 3 × 10 000 rows = generators. Against the 2026-10-02 pak: the same size
  (7 060 894 B), containers differ in bytes (references now resolve against the 3.0.1 containers) — so a live check is required.
- 14:19 the same with `--name KrinikConanGameplay --out _unpacked/KrinikConanGameplay` — rc 0, step 6 green, `modinfo.json` name/folder `KrinikConanGameplay`.
- 14:20 `Deploy-ModPack.ps1 -Deploy -Only KrinikConanGameplay` — «dropped KrinikLevelUncapped.pak», the pak appended last; `-Verify` clean.
- 14:20:45 `launch-bg.ps1`, `enter-world-remote.sh` (24 s), `god-on.sh`; 14:21:5x `capture-window.ps1 -Width 3840`; 14:22 `close-game.ps1`.

**Checks.**
- Hygiene: `build-level-mod.py` step 6 (tables = generators); `-Verify` clean.
- Functional run: the live game, world entry, the HUD frame read, `ConanSandbox.log` and `UE4SS.log` read.
- G1 pass (no separate menu frame) · G2 pass · G3 pass · G4 pass (the same XP threshold on the same save) · G5 pass · G6 pass.

**Found.** `build-level-mod.py` pointed its self-check at a kit folder that no longer exists — fixed (one constant). No defect in the merged mod.
Not checked: an actual level-up and a run with Agility above 0 (the save's hero has Agility 0); the table values are covered by step 6 and G4.

**Traces.** `UE4SS.log` lines `[KrinikConanGameplay…]` 14:20:54–14:21:49; `ConanSandbox.log` line 2965 (mount); the frame `g4-xp.webp` in the session scratchpad.

**Verdict.** pass — the merged mod mounts last, the levels read the same on the same save, the Agility section sets the hero speed.
