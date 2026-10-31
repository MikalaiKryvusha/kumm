# Run report — Conan: mod settings windows U4–U6 (build stability case set of 2026-10-26)

**Work.** Cases U4, U5, U6 of `testcases/TC_conan_build_stability_compat_perf_2026-10-26.md` (open, Russian, fits).

**Contour.** Conan Exiles 3.0.1 with the build (KrinikConanUI just redeployed with the renamed collector); background launch path; the owner's save copied to
`Conan Exiles Mods/_save-backup/2026-10-31_1614-before-u4u6` and restored (integrity ok); machine lock 16:13–16:16.

**Runs.** 16:14 `launch-bg.ps1` · `enter-world-remote.sh` (26 s) · 16:15 `walk-mod-windows.sh <dir> SM_UI_Settings PrP_Settings LLH_Settings DN_UI_Settings EAA_Famemenu
ExilesFishingTuning` (each → open, one frame each) · `close-game.ps1` (clean, 5.7 s) · `save-restore.sh` · lock released.

**Checks.**
- Hygiene: none.
- Functional run: six windows opened in the live game by the remote, the 6 frames read as one sheet. All Russian and fitting, except two dropdown values.

**Found.** bugs/64 item 48 — «Server» (Simple Minimap time dropdown); item 49 — «Top Left» (Damage Meter corner dropdown). Lore & Loot settings now open by the bare
module (the 25.10 note «does not open» no longer holds for `LLH_Settings`). No crash-report window.

**Traces.** Frames `u46/w_*.jpg` and `u46/sheet.webp` in the session scratchpad (deleted after the commit).

**Verdict.** partial — U4 and U5 fail on one English string each (filed), U6 partial (Edit Appearance and Waystones not reached).
