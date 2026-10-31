# Run report — Conan build: the release archive in 19 volumes of 700 MiB unpacks into the same 223 files (plan 35 G10, plan 36 item 28, first step)

- **Work:** cases V1–V4 of `testcases/TC_conan_build_archive_volumes_2026-10-31.md`. Basis — the owner's decision of 2026-10-26 (plan 35 G10: volumes ≤ 700 MB,
  multi-volume 7-Zip zip `-tzip -mx0 -v700m`) and plan 36 §28.
- **Contour:** pack `ConanExiles` at `7faaa2b` (73 mods), engine `KUMM/Deploy-ModPack.ps1`; 7-Zip `C:\Program Files\7-Zip\7z.exe`; all output in the session scratchpad
  `g10/` (`bundle`, `vol`, `unpacked`) on drive D (283 GB free before). No game run.
- **Runs:**
  - 12:0x–12:11 `powershell -File Deploy-ModPack.ps1 -PackDir D:\work\ai_sandbox\ConanExiles -Export <scratch>\g10\bundle` → «Export complete: 73 mods, 210 files».
  - 12:11–12:12 `7z a -tzip -mx0 -v700m <scratch>\g10\vol\Krinik-Conan-3.0.1.zip *` (in `bundle`) → «Volumes: 19»; `7z t …zip.001` → «Everything is Ok».
  - 12:12–12:13 `7z x …zip.001 -o<scratch>\g10\unpacked -y`; `python -X utf8 g10_compare.py <bundle> <unpacked>` (relative paths + SHA-256 of every file).
- **Checks:**
  - Hygiene: none.
  - Functional run: the archive made, tested, unpacked and compared the way a player receives it (all volumes, `.001` opened); read — 7-Zip's lines, the part sizes,
    the comparison line.
  - V1 pass (exit 0, 73 mods). V2 pass (19 parts, the largest 734 003 200 bytes = 700.0 MiB — Windows shows «700 МБ»; `7z t` ok). V3 pass (223 files). V4 pass
    (223 = 223, 0 missing, 0 extra, 0 content differences).
- **Found:** the size boundary reads «700 MB» in Windows terms (MiB); in decimal megabytes a part is 734 MB — said here so the host's limit is checked against bytes.
- **Traces:** the 7-Zip and comparison output in this report; the working tree `g10/` removed file by file after the run.
- **Verdict:** pass for the first step of §28; the second step (`install.cmd` on a copy of the game without mods, `-Verify`, world entry) is not run.

REAL WORLD: accumulated — the owner's real pack and its library; data and machine — his PC and disk; path — the same `-Export` and 7-Zip line the release uses.
Verified on the real pack; the install on a clean game copy is the open step.
