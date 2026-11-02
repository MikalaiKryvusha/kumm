# TC — the Conan 3.0.1 build released as 0.9.0

> **Created:** 2026-11-02 · **Parent:** `plans/43_conan_release_0.9.0.md` (the owner's order 18:40, verbatim there)
> **Status:** running 2026-11-02 18:58 +03:00
> **Outbound:** —

**Test basis.** Plan 43 criteria 1–6; house rule 25 (install and uninstall on the clean COPY); plan 40.7 criteria 1, 3, 6.
**Dimensions.** Versions — every carrier of the build version (manifest, three paks' modinfo, the menu logo line, the launcher title and its lines under the
logos, the guide, the cover). Packaging — the volumes self-check, install from them on the clean copy, `-Verify`, uninstall. Pictures — the cover, the guide's
title page, the hero by day, the HUD. Consciously NOT covered: the 16:9 gate of every window (plan 40.6 — named in the guide's chapter as a plan for 1.0.0), the
frame cost, a long run.

## Stand

| Part | Value | Set up by |
|---|---|---|
| Game | the working `D:/Games/Conan Exiles 3.0.1`, the build deployed `-Only KrinikConanUI,KrinikConanArchery,KrinikConanGameplay,KrinikConanGraphics` | `Deploy-ModPack.ps1` |
| Launch | background path (the owner is in the chat) | `launch-bg.ps1` |
| Place | the rock spire of the `krinik-show` start, ≈ (−2500, 128500), view west over the arch and the river | `tp_ground.sh` |
| Time | noon | `BP_TimeOfDayManager_C:SetTimeOfDay(12.0)` |
| Hero | god on; a bow in hand; third-person camera from behind, the whole hero in the frame | `god-on.sh`, the remote |
| Interference | creatures around killed | `quiet-stand.lua` |
| Clean copy | `D:/Games/Conan_Exiles_3_0_1_clean_test` (rule 25) | robocopy (exists) |

## Cases

| # | Case | Expected | Status | Observation |
|---|---|---|---|---|
| V1 | `modpack.json` packVersion | 0.9.0 | pass | `json.load` → 0.9.0; the deploy prints «KrinikConan* 0.9.0» for the four deployed mods |
| V2 | modinfo inside KrinikConanUI, KrinikConanArchery, KrinikConanGameplay paks | 0 / 9 / 0 each; Archery's six platform files byte-equal to before | pass | `repak get … ConanSandbox/Mods/modinfo.json` 0 / 9 / 0 ×3; `repak hash-list` old vs new Archery — only `manifest.json` and `modinfo.json` differ; Gameplay step 6 3 × 10 000 rows ✅ |
| V3 | main menu frame, 4K | «0.9.0» under the KRINIK MOD PACK logo, «3.0.1» under the game's | pass | frame 18:56 (PrintWindow 3840 × 2160); log «СБОРКА: моды 66/66» |
| V4 | launcher snapshots 288 / 144 / 96 dpi | title «… 0.9.0»; «3.0.1» and «0.9.0» under the logos, serif lining digits as in the menu | pass | `KRINIK_LAUNCHER_SNAPSHOT` 288 / 144 / 96: each version centred under its logo's solid box; first build Oswald, then Georgia (old-style digits — not the menu's), final Cambria Bold — lining serif |
| V5 | guide PDF | title page «0.9.0»; contents item 9 «Известные проблемы и планы на 1.0.0»; the chapter on one page | pass | PyMuPDF render of pages 1 and 11 (12 pages); after the proofread the chapter re-rendered on one page |
| V6 | cover (wallpapers 1080p / 2K / 4K) | «0.9.0» under our logo; only the digits' region differs from the old | pass | `ImageChops.difference` > 40 bbox (1171, 343, 1463, 446) of 1920 × 1080 — the digits only; 1080p looked at |
| S1 | hero by day over a valley, bow in hand, third person from behind | a 4K frame, the whole hero in it, HUD visible | pass | the Oasis Overlook edge (−253496, 18067), noon, the owner's camera; `[OWNER]` 19:16 «КАДР ОХУЕННЫЙ!!!!», 19:20 «кадр принят» (the variant with both logos in the sky) |
| S2 | the HUD | a 4K frame of the HUD in the same scene | pass | the same frame carries the full HUD (Hosav, minimap, FPS, quick bar with the dragon-bone bow, star-metal bow, Krom's sword, Great Wolf greatsword, obsidian / explosive / snake arrows) |
| Z1 | `make_volumes.sh D:/Temp/krinik_release_20261102 Krinik_Mod_Pack_0_9_0` | `OK: <N> files, hashes equal`, every part ≤ 700 MiB | pass | run 1 19:21–19:25 `OK: 241 files, hashes equal` (its PDF was the pre-proofread one); run 2 into `…20261102b` 19:26–19:30 `OK: 241 files, hashes equal`, PDF sha = the pack's `a2b82bdb…`; 18 × 734 003 200 B + 462 921 445 B |
| Z2 | install from the volumes on the clean copy (`install.cmd`) | `-Verify` exit 0 | pass | `7z x …zip.001 -o<copy>` 241 files / 13.67 GB in 58 s; `install.ps1` (no argument, finds the game next to the bundle) exit 0 «73/73 mods, 215 files · verify 113 present, 0 missing», the desktop shortcut made; `-Verify` exit 0 «Verify clean» |
| Z3 | uninstall on the clean copy | the file set equals the one before install | pass | `uninstall_krinik_build.cmd` (the player's file) «returned 10, deleted 206», the shortcut removed; `find` list = the 597-file list before (bundle folder aside); the shipping exe sha `086af500…` same; the working game 1489 files before and after; the owner's shortcut re-made to his launcher |
