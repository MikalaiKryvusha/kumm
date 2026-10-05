# Run report — Mafia II mod build, first launch

- **Work:** the owner's Mafia II build (Friends for Life 2.22.20, Epilog 2021, Uncut Radio 1.2, Small Static Dot
  Crosshair 1.1, 4GB patch) installed into the GOG Director's Cut (RU); basis — the owner's list in chat 2026-10-05
  and `games/Mafia2/README.md`.
- **Contour:** `D:\Games\Mafia II` on the owner's machine; display switched by the game to 1920×1080; build staged
  from `D:\Games\Mafia II Mods\stage` (1025 files).
- **Runs:**
  - ≈2026-10-05 19:45–19:48 — merge checks: `sdscli.exe unpack/pack` on `tables.sds`, FFL `ingame.sds`, JA `ingame.sds`,
    each re-unpacked and `diff -rq` against the intended tree.
  - ≈2026-10-05 19:49 — `python tools/install.py install` (exit 0).
  - 2026-10-05 19:50:19 – ≈19:54 — `Start-Process D:\Games\Mafia II\pc\mafia2.exe`, frames by `capture.ps1`, keys by
    `input.ps1 -RequireWindow mafia2`; closed by `CloseMainWindow` → `Stop-Process` after 15 s.
- **Checks:**
  - Hygiene: round-trip of all three merged SDS — only the intended files differ (pass); `install.py` verify 1025/1025
    md5 (pass); `laa.py --check` LARGE_ADDRESS_AWARE=True, 3 bytes changed vs the original exe (pass).
  - Functional run: launched the game as the player does, read the screen: process alive, NVIDIA logo, then the main
    menu blocked by the dialog «Пакет DLC "Friends for Life by zahar" установлен, но, похоже, не был куплен» (fail).
    Dialog did not close on Enter or synthetic mouse (blocked). Crosshair, radio, Epilog, story start — not reached.
- **Found:**
  - Friends for Life is refused by the game's DLC-ownership check on the GOG exe; the author's fix (`update5` exe) and
    DLC Mod Enabler both bypass that check — the owner's decision, recorded in the dossier.
- **Traces:** frames `D:\Games\Mafia II Mods\_harness\f01–f08.webp` (f04/f05 — the dialog); receipt
  `D:\Games\Mafia II Mods\backup\install-receipt.json`; manifest `D:\Games\Mafia II Mods\stage-manifest.json`.
- **Verdict:** fail — the build installs and the game starts, but Friends for Life / Epilog do not load.
