# Test cases — Conan build: the release archive in volumes of ≤ 700 MB unpacks into the same files (plan 35 G10, plan 36 item 28)

> **Created:** 2026-10-31 · **Parent:** plan 36 item 28 (`[OWNER]` decision of 2026-10-26 in plan 35 G10: volumes ≤ 700 MB, multi-volume 7-Zip zip `-tzip -mx0 -v700m`)
> **Status:** written before the run
> **Outbound:** —

**Basis.** Plan 36 §28: `-Export` into a clean folder → `7z a -tzip -mx0 -v700m` → the parts unpacked into another clean folder → the file list and hashes
compared. Dimensions: volume size (the boundary 700 MB), the file set (count and relative paths), the content (SHA-256 per file). Not covered here: the install
on a copy of the game without mods (the second step of §28 — a separate stand).

| # | Case | Expected | Status | Observation |
|---|---|---|---|---|
| V1 | the export | `Deploy-ModPack.ps1 -PackDir ConanExiles -Export <scratch>\bundle` exits 0; the bundle holds `install.cmd`, the manifest, the mods unpacked | pass | 12:11: exit 0, «Export complete: 73 mods, 210 files», 13 GB; the root holds install.cmd/.ps1, README.txt, the guide PDF, Wallpapers, the three report files, `pack\modpack.json` |
| V2 | the volumes | `7z a -tzip -mx0 -v700m` writes `.zip.001…`; every part ≤ 700 MiB; 7-Zip's own test of the set passes | — | |
| V3 | unpack in another folder | `7z x <set>.zip.001` into an empty folder exits 0 | — | |
| V4 | the same files | the relative-path list of the bundle = the unpacked list (count equal, no extra, none missing); SHA-256 of every file equal | — | |
