# Recon 03 — drive C revision 2026-10-12: adware remnants, heavy folders, unused tools

> **Created:** 2026-10-12 · **Parent:** owner's ask in chat («чем опять засран диск C … почистить бы от мусора», «поищи на C … тяжелого … мусора»,
> «можешь написать файл-ревизию, положить его в корень C») · **Status:** survey done 2026-10-12 19:52, read-only; removal is in four
> scripts the owner runs as admin (the auto-mode classifier refused the agent's own run) · **Outbound:** the revision itself lives on the
> owner's machine (`C:\РЕВИЗИЯ_ДИСКА_C_2026-10-12.md`, scripts in `C:\РЕВИЗИЯ_C_2026-10-12\`) — not in this public repo

## Findings (short)

- **Free space:** 30 GB of 465 (94 % used). Pagefile on D:, hibernation off — the August fix holds.
- **Download-client adware, three infections** (its control server is named in the owner's local revision only; Electron "helpers" that
  push browser extensions to Chrome/Edge/Yandex/Opera):
  2024-09-10 00:10 («Steam Client Helper», fake task `\EdgeUpdate` created 13 s later — runs `auditpol` at logon), 2025-01-10/14
  («Client Helper»), 2025-10-16 22:25 (a third "client"; its 90 MB unsigned `installer.exe` still on disk). Program folders are empty
  Electron shells (no `app.asar`, no main exe); the payload that survives is in the browsers: five fake «Adblock»/«Adblock Plus»
  (not from the store, `<all_urls>` + cookies + history + management), the program's own scanner extension (registered through
  `HKLM\…\Google\Chrome\Extensions`), and **«XFinderr. Search» — removed by the August cleanup, back in Chrome Default on 2026-10-09**
  (store extension; sync is the likely route — not verified). The program's own `main.log` files are the evidence of what it did.
- **Heavy:** WSL Ubuntu disk 63 GB · Docker disk 28 GB · old agent session folders in `%TEMP%\claude` 30.7 GB (raw demo recordings —
  finished cuts are in the Svarog gallery) · NVIDIA App `ota-artifacts` 11.3 GB · CUDA ×3 11.3 GB · VS ×4 ≈ 18 GB · `MEMORY.DMP` 8 GB.
- **Dependencies checked before any removal:** CUDA 13.3 + VS Community 2022 — KAGO workloads (`KAGO/workloads/MANIFEST.json`);
  .NET SDK 8 — Svarog mods (`net472`, `net8.0`); Python 3.10 base of `_tools/capture-venv`, `_tools/unitypy-venv`; Python 3.11 base of
  `_tools/chatterbox-venv` and an `NGL` venv; Python 3.12 — nothing.

## Method that worked

- Sizes: `robocopy <dir> C:\__nonexistent__ /L /S /BYTES /XJ /NFL /NDL /NJH /MT:16` — seconds per folder; MSYS `du -sm` over C:\ did not
  finish in 10 minutes.
- "Not used": `C:\Windows\Prefetch\*.pf` LastWriteTime per exe — on this machine it reaches back to 2026-02.
- Infection forensics: the Electron apps' own `%APPDATA%\<name>\logs\main.log` name the dropper, the C2 host, every command (`BFIX:`).
