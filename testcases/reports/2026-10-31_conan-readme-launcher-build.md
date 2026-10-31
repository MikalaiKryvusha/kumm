# Run report — Conan build: README + PDF + launcher exe by one script, author links from author_links.txt

**Work.** Cases `testcases/TC_conan_readme_launcher_build_2026-10-31.md` L1–L9 against the owner's words of 2026-10-31 15:36–15:39 (quoted in the case file).
New in the pack: `author_links.txt`, `_config/release/author_links.py`, `_config/release/build-docs.py`, `_config/launcher/KrinikLauncher.cs`,
`Собрать ридми и лаунчер.cmd`, the «Автор сборки» section in `docs/guide/guide-3.0.1.html`.

**Contour.** This machine: Python 3.14.4, Chrome headless (own temp profile), Visual Studio 2022 Community Roslyn `csc.exe` against .NET Framework 4.x
(`C:\Windows\Microsoft.NET\Framework64\v4.0.30319`); desktop 1920×1080 at 96 DPI (remote desktop session). No game run.

**Runs.**
- 15:4x `python -I _config/release/author_links.py <file>` on four scratch files (ok, broken bracket, ftp, empty) and one with three quote styles.
- 15:4x `python -I _config/release/build-docs.py` before the markers existed (exit 1), then full (exit 0), then `--no-pdf --no-launcher` (repeat).
- 15:4x `powershell -File shot-launcher.ps1 -Exe <exe> -OutDir <dir>` (start, `PrintWindow`, BM_CLICK on the second button, `PrintWindow`, `Stop-Process -Id`)
  twice: from `_config/launcher/bin/` and from a fake `<scratch>/fakegame/pack/` with a dummy `ConanSandbox.exe` beside `fakegame/`.
- 15:4x a PyMuPDF script: page with «Автор сборки», its link URIs, the page rendered at 110 dpi and looked at.

**Checks.**
- Hygiene: none (no linter for these files).
- Functional run: the script run as the owner will run it, its output read; the PDF opened and its last page read with links; the launcher window started from two
  layouts and looked at in both states.
- L1–L9 pass (the case table). The first launcher frame (15:4x) showed text touching the window edge — fixed (padding moved to the column) and re-shot.

**Found.**
- Fixed in the run: no margins in the launcher window (Form padding is ignored with AutoSize without Dock); a disabled «Играть» drew dark text on bronze.
- Not covered: a click on a link or «Собрать отчёт»; 2K / 4K × 300 % frames — the session's screen is 1920×1080 at 100 %.

**Traces.** Frames `launcher-1.jpg` / `launcher-2.jpg` (two layouts) and `pdf-author.jpg` in the session scratchpad (deleted after the commit).

**Verdict.** pass — the links go from `author_links.txt` into the guide and the PDF (clickable) and into the launcher; the look of the launcher is the owner's (idea 22 mock-ups).
