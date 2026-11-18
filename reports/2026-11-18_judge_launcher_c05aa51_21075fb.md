# Judge round 1 on the launcher of plan 57 — `c05aa51..21075fb` (pack `ConanExiles/_config/launcher`, `build-docs.py`)

> **Created:** 2026-11-18 · a fresh helper, read-only, files read at the commit by `git show`
> **Parent:** `plans/57_EPIC_conan_launcher_self_sufficient.md` (phase 5 — judge rounds), `plans/55_…` R3
> **Status:** received 2026-11-18 18:32 +03:00; each finding verified against the code before a fix (`BUG_FIXING_FRAMEWORK.md` → "A finding is not a finding until verified")
> **Outbound:** —

## Findings (the judge's severity; verification and fate in the plan 57 step list)

1. **DEFECT — the owner's reference copy is offered and can be installed into.** `KrinikConanGames.cs:214` `Walk(root, 0, add, clock, cancelled)`; `:231` `if
   (File.Exists(Path.Combine(d, GAME_EXE))) { add(d); continue; }` — `D:\Instals\<copy>` is depth 2 (`WALK_DEPTH = 4`), `SKIP` (`:221-222`) holds system names only;
   `Describe` → Clean («без модов»); `KrinikConanLauncher.cs:735` picks → `mainAction` installs at once; `Games.Choose` remembers it (`Chosen()` `:180-184`);
   `BuildUpdate.Prepare` (`Updates.cs:686`) / `PrepareLocal` no guard. Judge's fix: one `IsReference(dir)` used in Search, Around, Chosen, PickFolder and as a hard
   refusal in Prepare / PrepareLocal / the uninstaller; marker outside the copy.
2. **DEFECT — "installed version" = the highest unpacked `Krinik_*` folder.** `Games.cs:153-156`. An update unpacked but refused (game running `Updates.cs:806`,
   cancel `:808`, `u.wrong.version`, `u.not.removed`) → `Describe` says 1.0.1 → `Launcher.cs:456` `Feed.Newer` false → «installed», the plate gone, the message asks to
   press a button that is gone. Same for a hand-unpacked newer archive. Fix: the version the installer recorded.
3. **DEFECT — every unfinished download reads «Связь с GitHub прервалась».** `Launcher.cs:548` `File.Exists(f) ? … : "net"`; `:535` `v.net.stop` for all but «user»;
   `STOP_MARK` deleted `:821`, written only when `u.Stop != null` (`:843-844`). Disk full (`u.failed`), digest twice (`u.twice`), a killed launcher, a reboot → the
   false text and «Продолжить скачивание». Fix: the mark records the real outcome on every terminal path; no mark → a neutral «download not finished».
4. **DEFECT — the header and the title name a game version / pack the panel denies.** `Launcher.cs:395` `GameShown() => game?.Version ?? Bundle.GameVersion(here)`;
   `:392` `Bundle.PackVersion(here)`; `:370` `Form.Text`. Unknown CL → header «3.1.1» (compiled), panel «CL-390000 … ещё не вышла»; 3.0.1 with no release → title
   «… для Conan Exiles Enhanced 3.0.1». G6 checks only the panel.
5. **DEFECT — «Играть» and «Удалить сборку» stay live while the launcher's uninstaller runs.** `Launcher.cs:776-780` (`Children.Track`, `Exited += Refresh`), screen
   stays «installed» (`:451-452`): Play starts the game over a half-restored folder; a second Uninstall starts a second uninstaller. Fix: a «removing» screen from
   `Children.AnyAlive`.
6. **DEFECT — a remembered copy is final.** `Launcher.cs:323` `Games.Around(here) ?? Games.Chosen()` skips the search; `:658` auto-chooses a single copy; only
   «notfound» offers `PickFolder`. A mis-pick or a second copy installed later can never be switched to.
7. **RISK — Steam's «fully installed» bypassed.** `Games.cs:337-340` adds every `common\*`; the walk adds it again; a half-downloaded copy is offered.
8. **RISK — `ScanCl` may return a truncated CL** at a 1 MiB chunk end (`Games.cs:121-122`).
9. **RISK — the CL scan runs on the UI thread on every Refresh** (`Launcher.cs:415` → `ReadCl` → `ScanCl`, ≈ 1 s per 200 MB when ProductVersion has no «-CL-»).
10. **RISK — `/releases?per_page=30`** (`Updates.cs:111`): after 30 releases older builds drop out.
11. **RISK — `NetFailure(ex) => ex is WebException`** (`Updates.cs:742`): 403 / 404 / 416 read as a broken connection, the resume loops forever.
12. **RISK — the old-bundle offer may delete a folder the launcher did not create** (`Launcher.cs:154` `Directory.Delete(dir, true)`; guards `:142-144` match a
    hand-unpacked bundle). Fix: only with `pack\.krinik_unpacked`.
13. **RISK — a hung installer: a window that cannot close** (`Updates.cs:965` `p.WaitForExit()` no timeout; `FormClosing` cancels while `Busy`).
14. **RISK / COSMETIC — placement:** centred once at `OnLoad` (`:1536`); growth only clamps (`:1549-1551`); mixed DPI; a window larger than the area pinned top-left.
15. **COSMETIC:** `:523-527` «уже лежат рядом с лаунчером» for a bundle unpacked in the game folder; `:718` `m.none` overwrites «установлена сборка X»; hashing parts
    shows «ожидание данных»; the Remove stage bar stays 0 %.

## Tests that can pass for the wrong reason

- G0 (`self.mjs:137`) never sees a folder dialog (frames stand returns before it, `Launcher.cs:743`).
- C12 (`self.mjs:421-430`) is circular — checks `Place()`'s own log line.
- The owner's-state check (`self.mjs:394,440`) compares names only — an overwrite passes.
- `strings.mjs:16` skips `throw new …(` / `new WebException(` messages, yet `ex.Message` reaches the player (`u.failed`, `s.failed`, `s.failed.back`):
  Russian from `Updates.cs:241, 251, 891, 1020` in the English UI.
- No case covers findings 1, 2, 3, 5.

## Checked, nothing found

Both Vdf formats and escapes; the release marker parse and exact-CL `BuildFor`; Range resume and the 200 restart; SHA-256 of parts and of the launcher exe; the
zip tail probe; the zip path-escape guard and the manifest / marker order; `ConcatStream`; the self-update rollback, mutex, thread ownership; `-Upgrade`
detection; the language table, its placeholders and `Ui.Init`; the taskbar button; `build-docs.py`.
