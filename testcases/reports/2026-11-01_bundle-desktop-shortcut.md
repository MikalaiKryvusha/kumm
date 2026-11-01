# Test run report — the bundle installer's desktop shortcut and its removal by the uninstaller

**Created:** 2026-11-01 11:20 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** KUMM main after `916e01b` + the `[int]$LASTEXITCODE` fix; Conan pack after `1679bba`

## 1. Work

The desktop shortcut «Krinik Conan» (`[OWNER]` 2026-11-01 11:11 «по установке - сборка на рабочем столе создает ярлык Krinik Conan»): `install.ps1`, written by
`Deploy-ModPack.ps1 -Export`, creates `<Desktop>\<manifest.shortcut.name>.lnk` → `<bundle>\<target>` with `<bundle>\<icon>` after a successful deploy; the uninstaller
template's `{SHORTCUT}` line removes it. Basis: the owner's word above and STATUS "Where to continue" (the 11:13 handover). Cases — the three `ярлык:` checks of
`tools/fixture-pack.mjs` (expected: shortcut exists with the bundle target and icon; the uninstaller carries the name; after the player's uninstaller the shortcut is gone and the
game folder equals its pre-install snapshot). Control: the earlier `откат:` runs use the same template with an empty `{SHORTCUT}` — no shortcut, no error.

## 2. Contour

The engine's fixture stand in the OS temp (`D:\Temp\kumm-fixture-*`): a fake undo pack exported with `-Export`, its `install.ps1` run against a clean fake game folder,
the generated `Uninstall.cmd` run through `cmd /c` (the player's path). The shortcut lands on the REAL desktop under a unique name `KUMM fixture <ms>` for seconds.
REAL WORLD: accumulated — the owner's real Conan install with the build already deployed; data and machine — his Desktop; path — the release install from the archive volumes.
Not verified there: the owner ordered the archive and the install from it LAST (2026-11-01 11:11–11:12), so the real-game run waits for that step.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | ≈ 2026-11-01 11:18 +03:00 (between the 11:17 and 11:20 clock probes) | `node tools/fixture-pack.mjs` | 1 · install gave verify 1 (the player's own pak outside modlist in the shared «vanilla» folder) → a separate clean game folder for the shortcut block |
| 2 | ≈ 2026-11-01 11:19 +03:00 | `node tools/fixture-pack.mjs` | 1 · deploy green, no shortcut: `$LASTEXITCODE` is `$null` after a script with no `exit`, `$null -eq 0` is false |
| 3 | ≈ 2026-11-01 11:20 +03:00 (probe 11:20 right after) | `node tools/fixture-pack.mjs` + the four core tests | 0 · all 37 stand checks pass; core tests exit 0 |

## 4. Checks

Hygiene: the four core tests (`test-parse-archive`, `test-archive-roundtrip`, `test-pick-card`, `test-help-commands`) — exit 0.
Functional run: the player's path on the fixture stand — export → `install.ps1` → the shortcut read back through `WScript.Shell` (target and icon) → `Uninstall.cmd` → the desktop listing and the game-folder snapshot read.

| Case | Status | Observed |
|---|---|---|
| ярлык: install creates the shortcut to the bundle program with the bundle icon | pass (run 3) | `TargetPath` = `<export>\Launcher.exe`, `IconLocation` = `<export>\build.ico,0`; failed in run 2 on the real defect |
| ярлык: the uninstaller carries the shortcut name | pass | `'KUMM fixture <ms>.lnk'` in `Uninstall.cmd` |
| ярлык: the player's uninstaller removes it, the game folder returns | pass | `.lnk` absent; snapshot equal to the pre-install one |
| control: empty `{SHORTCUT}` | pass | the six `откат:` checks green with the same template line |
| the Conan pack's own template line and manifest | structure only | the line is the same as the stand's; `target`/`icon` are basenames of two `extras`; desktop has no leftover `fixture` shortcut |

## 5. Found

- `install.ps1` read `$LASTEXITCODE` after `& Deploy-ModPack.ps1`; a successful deploy leaves it `$null`, so the shortcut was never created. Fixed: `$rc = [int]$LASTEXITCODE`.

## 6. Traces

The stand's console output (runs 1–3, this session); the stand folders `D:\Temp\kumm-fixture-1793521178256` and later — OS temp.

## 7. Verdict

partial — the engine and the stand pass; the Conan pack's shortcut on the real game waits for the release install from the archive volumes (the owner's order: last).
