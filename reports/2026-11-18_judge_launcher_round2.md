# Judge, round 2: launcher 21075fb..9d2a8b4, deployer record, release scripts

Independent read of `git diff 21075fb 9d2a8b4 -- _config/launcher`, `_config/release/make_release.sh` and `make_volumes.sh` at 9d2a8b4, and the uninstaller-record change to KUMM `Deploy-ModPack.ps1` and `tools/fixture-pack.mjs` in the working tree. Nothing was compiled or launched. One run: `node _config/launcher/test/strings.mjs` (read-only) printed "no Russian literal outside the table". The launcher sources in the working tree are identical to 9d2a8b4.

## Findings, most severe first

**1. DEFECT: `make_release.sh:36` hides a failed docs build and ships stale binaries.**
`(cd "$PACK" && "$PY" -X utf8 _config/release/build-docs.py) | tail -3 || exit 1`
The script sets only `set -u` (line 13), with no `pipefail`, so the pipeline's status is the status of `tail`. Scenario: the launcher fails to compile, so build-docs.py exits 1. The `[ -f "$GUIDE" ] && [ -f "$LAUNCHER" ]` check on line 39 still passes on the previous `bin/KrinikConanLauncher.exe` and PDF. Step 5 copies those old files into `release/`, and SHA256SUMS then signs them. `make_volumes.sh:38` and `:40` have the same flaw: a failed export or mod-info step is masked, and the script goes on to zip whatever is there.
Fix: `set -uo pipefail` in both scripts.

**2. DEFECT: the release still writes a second 13 GB copy; the claimed fix is not wired in.**
`make_volumes.sh:26-28` says: "make_release.sh asks for the release part size (KRINIK_VOLUME_BYTES) so the volumes ARE the release parts — no second copy of 13 GB". But `make_release.sh:42` is `bash "$PACK/_config/release/make_volumes.sh" "$WORK" "$NAME" || exit 1`, which passes no variable. Line 46, `cat … | split -b "$RELEASE_PART" …`, then writes the whole stream again. Peak disk use is export + volumes + check + release, about 4× the archive (≈ 52 GB). That is the 50 GB the owner asked about. A drive with ~40 GB free fails at step 4.
Fix: `KRINIK_VOLUME_BYTES=$RELEASE_PART bash …make_volumes.sh …`, then `mv` the volumes into `release/` and drop the split.

**3. DEFECT: header and title still pair the build with the found game's version (`KrinikConanLauncher.cs:399`).**
`if (game != null && game.Kind == CopyKind.Krinik && game.BuildVersion != null) return (game.BuildVersion, game.Version ?? Bundle.GameVersion(here));`
For an installed build, the game half is the found copy's version, not the version the build was made for. Scenario: 0.9.1 (built for 3.1.1) is installed, Funcom patches the game to 3.2.0, and the feed carries 0.9.2 with the marker `3.2.0 CL-n`, so `Games.Learn` runs. The title becomes "Сборка модов Krinik Mod Pack 0.9.1 для Conan Exiles Enhanced 3.2.0": the false pair that finding 4 was meant to remove. The title also flips from 3.1.1 to 3.2.0 when the feed answers.
Fix: take the game half from the installed bundle's `launcher.gameVersion`, either by having `InstalledVersion` return the folder or by having the deployer write gameVersion into the record.

**4. RISK: a quoted or relative line in `never.txt` is dropped silently (`KrinikConanGames.cs:238`).**
`string n = line.Trim().Length > 0 ? Norm(line.Trim()) : null;`
Explorer's "Copy as path" gives `"D:\Instals"`. In .NET Framework, `Path.GetFullPath` throws ArgumentException on `"`, `Norm` returns null, and the line is skipped without a log entry. The reference copy is then offered by the search and can receive the build: the exact case finding 1 guards against. A relative line resolves against the launcher's working directory.
Fix: `Trim().Trim('"')`, accept only rooted paths, and log every line that is ignored.

**5. RISK: a refusal before the start erases the stop reason (`KrinikConanLauncher.cs:860` vs `KrinikConanUpdates.cs:649-650`).**
`if (u.PartsDir != null && !u.Beside) try { File.Delete(Path.Combine(u.PartsDir, STOP_MARK)); } …`
`RunJob` deletes the mark before `Run` gets to its refusals. The comment says "Отказ до начала скачивания папку частей не трогает", but the mark is already gone. Scenario: the player pauses (mark `user`), starts the game, then presses «Продолжить скачивание». The refusal `u.game.running` leaves `Started` false, so no mark is written. The screen changes from "paused" ("Вы остановили скачивание") to the warning screen "unfinished".
Fix: delete the mark inside `Run`, right after `Started = true`.

**6. RISK: three new test checks cannot fail (`test/self.mjs:328, 331, 340`).**
`check(/pressed/.test(click(pid, 'Window language')), 'LG4 the language field pressed', '')`
When click.ps1 finds nothing it exits 3, and `click()` returns `'not pressed: …'`, which matches `/pressed/`. The same applies to «LG4 Esc sent to the list» and «LG2 «Русский» picked from the list», and to the older G4 check on line 182. The log checks that follow still cover the effect, but these lines can never fail.
Fix: `/^pressed/`.

**7. RISK: the U1 check for hidden buttons is racy and mostly vacuous (`test/self.mjs:238, 246`).**
`ping -n 5 127.0.0.1` keeps the stub uninstaller alive for about 4 s. Each `click.ps1 … -TimeoutSec 2` costs about 2 s of Add-Type plus 2 s of polling. The «Удалить сборку» probe therefore runs after the uninstaller has exited, when the copy is no longer Krinik and the button is absent anyway. It passes with or without the «removing» screen.
Fix: make the stub wait for a file that the case deletes after both probes, and assert that `экран: removing` is still the last screen line.

**8. RISK: a 416 response now ends in an error screen the player cannot escape (`KrinikConanUpdates.cs:754`).**
`return w.Response is HttpWebResponse r && (int)r.StatusCode >= 500;`
A 416 now shows "dlerror". Its only button, «Продолжить скачивание», sends the same `Range` request, gets the same 416, and never deletes the part, so the player is stuck. Statuses 408 and 429 are transient but are now final too.
Fix: on 416 delete the part and fetch it whole; treat 408 and 429 as net.

**9. COSMETIC: a forbidden folder around the launcher is still offered a local install (`KrinikConanLauncher.cs:330`, `:503-509`).**
`string dir = Games.Around(here) ?? Games.Chosen();`
A bundle unpacked into a forbidden folder skips the `Never` check. `FoundScreen` then offers «Установить сборку» (found-files), and every press ends in the `u.never` box.
Fix: check `Games.Never(game.Dir)` before the local-bundle branch.

**10. COSMETIC: the case starts even if the watcher never got ready (`test/self.mjs:517`).**
`until(...watching...).then(() => run())` runs the case even when `until` timed out and returned null, so the readiness gate does not gate. The C1 check catches "windows seen 0" later.
Fix: `.then(ok => ok ? run() : check(false, 'watcher ready', ''))`.

## Areas checked, nothing found
- **CBT hook (`Frames.HideBoxes`):** the delegate is held in a static field; the hook is thread-local with hMod 0; it is installed before `new Launcher()` and before any `MessageBox` on the UI thread. Nothing in the callback throws.
- **Message filter (`OutsideClick`):** .NET iterates over a snapshot, so `RemoveMessageFilter` inside `PreFilterMessage` is safe. The filter is removed in `Close` and `Dispose`, and guarded by `IsOpen`. The parent walk stops at the field or the list, Esc is consumed only while the list is open, and a window going to the background closes it through `Deactivate`.
- **Uninstaller `Exited`:** `OnUi` uses `BeginInvoke`, so `uninstalling = p` always precedes the null assignment. In .NET Framework, `HasExited` raises `Exited` when it detects the exit, so `Children.AnyAlive` disposing the process cannot lose the event. `ObjectDisposedException` is an `InvalidOperationException`, so it is caught.
- **«removing» screen:** no gold button and no «Удалить сборку»; a launcher update during removal is refused by `Children.AnyAlive`.
- **`ScanCl` cut:** the carried tail is at most the marker plus 19 bytes, so the loop cannot spin; a marker split across chunks is re-parsed whole.
- **CL cache, `incomplete` set, `per_page=100`:** correct; locks are taken on shared state.
- **`InstalledVersion` and the deployer record:** `-Restore` removes `_kumm_backup` on success (Deploy-ModPack.ps1:279) and keeps it together with the .cmd on failure, so the record cannot outlive its install. The change has no 5.1-incompatible syntax, and `$pack` resolves to script scope as on the neighbouring lines. The fixture expectations can fail (`'(нет файла)'`).
- **Stop marks net/user/error/unfinished:** written only under `!Beside` with an existing parts folder; `u.Started` crosses threads through `BeginInvoke`.
- **Window re-centring (`placedAt`):** runs only while the window has not been moved, inside `Relayout`'s `layingOut` guard.
- **Exception texts in the string table:** both reach the player through `u.failed` in the window's language, and the strings guard passes.
- **V1/V2, N1/N2, D4b:** each one distinguishes the old behaviour from the new and can fail.
