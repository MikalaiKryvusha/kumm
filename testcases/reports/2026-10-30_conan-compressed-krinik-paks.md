# Test run report — 12 KRINIK MODIFIED paks rebuilt with Oodle compression

**Created:** 2026-10-30 01:07 +03:00 · **Run by:** the agent (Claude Opus 5.5) ·
**Version/build:** Conan Exiles 3.0.1 + the Conan build; retoc local commits 8e2eedf + 9391c3a (`_tools/retoc-5.8/retoc.exe`); `rebuild-krinik-paks.py`

## 1. Work

Plan 36 item 14a — the edited paks back to the original sizes without losing a single edit. Cases — `testcases/TC_conan_compressed_krinik_paks_mount_2026-10-30.md`.

## 2. Contour

Library `D:\Games\Conan Exiles Mods\mods\_krinik-modified\*` and the game `ConanSandbox\Mods`, the owner's save, 4K, game in front; machine lock `kumm`.
REAL WORLD: accumulated — the owner's save and Saved/ExtractedMods of earlier runs (re-extracted by hash); data and machine — his; path — the normal launch and
world entry — verified on the real world.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-10-30 00:38 +03:00 | `rebuild-krinik-paks.py` (no install) | 11 of 12 verified (Simple Minimap: work dir reused — tool fixed) |
| 2 | 2026-10-30 00:41 +03:00 | `rebuild-krinik-paks.py --install` | 12 of 12 installed |
| 3 | 2026-10-30 00:46 +03:00 | `launch-bg.ps1` + `enter-world-remote.sh` | FAIL: «Incompatible Mods Detected» (PIFC) — `Failed reading 1104 bytes at offset 552848`; compressed container header |
| 4 | 2026-10-30 00:52–00:57 +03:00 | retoc fixed (finalize, then write_chunk by chunk type); guard added; `--only EnhancedPlayerIgnoresFollowerCollision --install`; `--install` | PIFC ok; the batch stopped at RNF — disk D: full (my work dirs) |
| 5 | 2026-10-30 01:00 +03:00 | listed big files deleted (19 GB + 65 files); `--only <Mod> --install` × 5 | 5 of 5 installed |
| 6 | 2026-10-30 01:04 +03:00 | `launch-bg.ps1`; frame after 50 s; log grep; `enter-world-remote.sh`; `seq.ps1` Tab / fishing / Esc | all pass |

## 4. Checks

Hygiene: per-pak guards — chunks byte-identical (proved red against the untouched original: 3 of 199 differ), container header raw (proved red on the broken PIFC).
Functional run: launched the live game, read the main-menu frame, `ConanSandbox.log` (12 of 12 «Mounted container», 0 «Failed to mount»), entered the world,
read the HUD / hub / fishing-panel frames and `UE4SS.log`.

- C0 pass (after FAIL in run 3) · C1 pass · C2 pass · C3 pass · C4 pass · C5 pass · C6 pass · C7 pass.

## 5. Found

- retoc compressed the container header chunk; UE reads it raw — fixed in retoc, guarded in the tool.
- The rebuild tool keeps every work dir (old + new unpacks + view copies): three full runs filled disk D: to 33 MB; ≈86 GB of small files remain for the owner.
- The agent skipped the smoke by eye before automation (EXP-0375, memory `smoke-by-eye-before-automation`).

## 6. Traces

Scratchpad of session 075c1f98: `smoke1.jpg`, `cmount.jpg`, `rebuild-install*.log`; crash-free; `ConanSandbox.log` of 01:04.

## 7. Verdict

pass — all 12 paks within +1 % of the original size (Hosav +0.8 %, the rest below), mounted, the world and the edited mods work; the disk cleanup left to the owner.
