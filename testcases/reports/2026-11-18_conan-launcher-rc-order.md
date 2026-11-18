# Run report — the launcher orders release candidates: 0.9.1-RC1 < 0.9.1-RC2 < 0.9.1

## Work

Plan 55 phase E (the owner 2026-11-18 19:08 «Это будет 0.9.1-RC1» · «все последующие фиксы получают выше номер RCx» · 19:09 «это классические правила
версионирования ПО» · 19:11 «мы делаем как Линус, без точки»): the launcher's release number (`KrinikConanVersion.cs`, `ReleaseNumber`) replaces
`System.Version` with the tail after «-» cut. Basis: SemVer 2.0.0 §11 (a pre-release sorts below its release), the RC number compared as a number.

## Contour

Pack `D:\work\ai_sandbox\ConanExiles` working tree after 5c63efd (launcher sources + `test/version_order.cs` + the `rc` case of `test/self.mjs`); the launcher
compiled by `make_variant.py` into `KUMM/.work/rcorder/build` (version 1.0.0, build 0.9.1); the stand `KUMM/.work/launcher57/st.json` (fixture parts, test feed
`feed.mjs`), every window off-screen, no game of the owner read.

## Runs

1. 2026-11-18 21:01 — `csc -nologo -langversion:latest -out:KUMM\.work\rcorder\version_order.exe _config\launcher\KrinikConanVersion.cs _config\launcher\test\version_order.cs`
   then `version_order.exe`.
2. 2026-11-18 21:02 — `python -I -X utf8 _config/launcher/test/make_variant.py D:/work/ai_sandbox/KUMM/.work/rcorder/build 1.0.0` (the whole launcher compiles).
3. 2026-11-18 21:04 — `node _config/launcher/test/self.mjs rc KUMM/.work/rcorder/r1 <new exe> --stand st.json` (stand defect found, see Found).
4. 2026-11-18 21:04–21:05 — the same into `r2` after the stand fix.
5. 2026-11-18 21:05 — control: the same case into `r3old` on the previous exe `KUMM/.work/launcher57/build/KrinikConanLauncher.exe` (built 18:51 from 9d2a8b4).

## Checks

Hygiene: run 1 — 26 / 26 PASS (9 order pairs, 5 equal spellings, 9 strings that are not our numbers, the display form, null below every number) and the
built-in control: the old reading fails 5 of 9 order pairs. Run 2 — the launcher compiles (5533 KB).
Functional run: the real launcher exe on the stand, by the player's path (the installed build read from `_kumm_backup\pack_version.txt`, the feed answer, the
screen the window shows) — the log lines READ:

- RC1 PASS — 0.9.1-RC1 installed, 0.9.1-RC2 in the feed: «экран: update», «новейшая 0.9.1-RC2 (у нас 0.9.1-RC1)».
- RC2 PASS — 0.9.1-RC2 installed, 0.9.1 in the feed: «экран: update», «новейшая 0.9.1 (у нас 0.9.1-RC2)».
- RC3 PASS — 0.9.1 installed, 0.9.1-RC2 in the feed: «экран: installed» (no update offered).
- RC4 PASS — the same RC installed and in the feed: «экран: installed».
- Control (run 5) — the previous exe FAILS RC1 and RC2: it reads both as 0.9.1 («новейшая 0.9.1 (у нас 0.9.1)») and offers no update — the defect the change removes.

## Found

1. The stand case first shared one state folder: the launcher remembered the first pair's game and every later pair read RC1 (run 3, RC3 FAIL with «у нас
   0.9.1-RC1»). Fixed in the case (a state folder per pair, the check also reads «у нас <installed>»); run 4 green.
2. For the version step (R1, not this change): `build-level-mod.py:139` splits `packVersion` into three integers and `make_volumes.sh:23` names the parts
   `Krinik_Mod_Pack_<packVersion with dots as underscores>` — «0.9.1-RC1» breaks the first and puts a hyphen into the second, which the launcher's part
   pattern `Krinik_[A-Za-z0-9_]+` refuses.

## Traces

`KUMM/.work/rcorder/r2/rc/tmp/KrinikConanLauncher.log`, `KUMM/.work/rcorder/r3old/rc/tmp/KrinikConanLauncher.log`; the test binary `KUMM/.work/rcorder/version_order.exe`.

## Verdict

pass — the launcher orders RC1 < RC2 < 0.9.1 on the stand by the player's path; the control shows the old exe did not. Not covered: the real GitHub feed
(RC1 published — plan 55 phase E), a launcher self-update between RC-numbered launcher tags (no such tag planned).
