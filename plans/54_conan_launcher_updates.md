# Plan 54 — the Krinik Conan launcher: «Что нового» under both versions, a new-version plate, «Обновить сборку» and «Обновить лаунчер»

> **Created:** 2026-11-17 · on the owner's word (chat 2026-11-17 14:40 +03:00, under the quoted handover of the previous chat): `[OWNER]` «Ещё будет задание:
> - в лаунчере под версией нашей сборки должна быть кнопка [Что нового] - которая ведёт в описание самого последнего релиза в GH сборки
> - в лаунчере под версией игры должна быть кнопка [Что нового] - которая ведёт в описание релиза в Steam
> Лаунчер, заметив новую версию сборки в релизах GH должен показывать плашку, что вышла новая версия. И должна появляться кнопка [Обновить сборку]
> Лаунчер может обновляться самостоятельно вне зависимости от самой сборки. Когда будут выходить релизы по чисто лаунчеру, то будет кнопка [Обновить лаунчер] -
> чтобы это обновление не требовало скачки многих гигабайт всей сборки, а только легике файлы самого лаунчера.» · then 14:42 «работай автономмо вдейлупе».
> **Parent:** `ideas/23_conan_build_versions_and_launcher_update_check.md` (approved 2026-10-31 20:11, interview 028 Q3 = A — this plan is its step 3 and
> its «later» step 4); recon `researches/conan-launcher-updates/README.md` · **Status:** 🔧 started 2026-11-17 14:4x · phases 1–3 built and passed on the
stand 15:17 (16 of 17 cases; the Steam page's rendered post not seen headless) — the judge rounds, the show page and the first real release left · **Outbound:** the first real launcher
> release on GitHub waits for the owner's word (an outward publish)

## Goal vector (Achieve)

A player of the Krinik build learns from the launcher itself what changed in the build and in the game, sees when a newer build or a newer launcher is out,
and updates either with one button — the launcher alone in seconds (a few MB), the whole build in one supervised download with every part checked.

## Acceptance criteria

1. **Build «Что нового».** Situation: the launcher of build 0.9.0 is open, the network is up. Action: the player presses «Что нового» under the build's
   version. Result: the browser opens the newest build release on GitHub (today `…/releases/tag/v0.9.0`). Check: the click's target read from the launcher
   log line «открываю …»; the page title in a headless browser.
2. **Game «Что нового».** Situation: the launcher of a build made for game 3.0.1. Action: «Что нового» under the game's version. Result: the browser opens
   the Steam announcement «October Hotfix 3.0.1». Check: the log line; the page in a real browser shows that title.
3. **New build plate.** Situation: the feed holds a build release with a higher number than the bundle's `pack\modpack.json`. Action: the launcher starts.
   Result: within 5 s a plate «Вышла новая версия сборки X.Y.Z» with the button «Обновить сборку»; with no newer release — no plate. Check: snapshots
   against the local test feed with a higher and an equal tag.
4. **New launcher plate.** Situation: the feed holds `launcher-vX.Y.Z` higher than the launcher's own version. Action: start. Result: the plate says
   «Вышла новая версия лаунчера X.Y.Z» with «Обновить лаунчер». Check: snapshot against the test feed.
5. **Offline.** Situation: no network (the feed refuses). Action: start. Result: the window opens in its usual time, no plate, no error box; both
   «Что нового» still open their pages (the build one — `…/releases/latest`). Check: the feed pointed at a closed port; window shown, log line «лента не ответила».
6. **Launcher self-update.** Situation: launcher 1.0.0 in a bundle folder, the feed has `launcher-v1.0.1` with its exe. Action: «Обновить лаунчер».
   Result: the exe in the folder is the new one (SHA-256 = the asset's digest), the new launcher is running, `KrinikConanLauncher.exe.old` is gone after its
   start; a digest mismatch leaves the old exe untouched with a message. Check: hashes before/after; the process list; the mismatch case on a forged asset.
7. **Build update.** Situation: a fixture game with build 1.0.0 installed from a fixture bundle; the feed has `v1.0.1` as zip parts. Action: «Обновить
   сборку», confirm. Result: the parts download (resumable), each SHA-256 equals its digest, the new bundle is unpacked beside the old one, the old build is
   uninstalled, the new one installed (uninstaller present, the new build's files in the game), the new launcher opens. Check: the fixture game's file list and
   the journal before/after; `pack\modpack.json` of the new bundle = 1.0.1.
8. **Every resolution.** The new buttons and the plate are readable and laid out at 720p, 1080p, 2K, 4K (HOUSE_RULES rule 17). Check: snapshots at 96, 144,
   192, 288 dpi looked at by eye.
9. **Privacy.** The launcher sends nothing about the player: one anonymous `GET` of a public URL, no query parameters beyond `per_page`. Check: the code.

## Decisions made without the owner (`[AI]`, revisable)

1. One feed — the public repo's GitHub Releases. Build releases keep tags `vX.Y.Z`; launcher releases get tags `launcher-vX.Y.Z`, are published with
   `--latest=false` (the «Latest» badge stays on the build) and carry one asset `KrinikConanLauncher.exe`.
2. The launcher's version lives in the manifest (`launcher.version`) next to `packVersion`; `build-docs.py` bakes it. The game version and its Steam
   announcement move from the launcher's constant to the manifest (`launcher.gameVersion`, `launcher.gameNotes`) — one place to change at a game move.
3. The build's version shown under its logo is read at run time from `pack\modpack.json` beside the exe (the baked value is a fallback): a self-updated
   launcher must show the build it sits in, not the build it was compiled with.
4. «Что нового» of the build opens the newest build release from the feed; before the feed answers or without network — `…/releases/latest`.
5. The plate stands on the left under the title, the metal plaque of «Отзыв»; it lists one line per available update, each with its button.
6. The build update downloads into `<game>\<parts stem>_parts\`, unpacks into `<game>\<parts stem>\` (the guide's own advice — «unpack into the game
   folder»; so the new launcher finds the game one level up), runs the old uninstaller, then the new `install.cmd "<game>"` (stdin `nul`: the trailing
   `pause` does not wait; success = the uninstaller is back in the game root), starts the new launcher; the parts are deleted after a successful install,
   the old bundle folder stays (the player's). A stop keeps the downloaded parts; the next press resumes by Range.
7. Plate lines are Cambria like the versions (Georgia's old-style digits read «1.0.1» as «1.o.1»); the two «Что нового» stand in one row under the lower
   version line.
8. The launcher is tested through env switches no player sets: `KRINIK_LAUNCHER_FEED` (a test feed), `KRINIK_LAUNCHER_DRY` (links logged, not opened),
   `KRINIK_LAUNCHER_NOACTIVATE` (the window takes no focus), besides the older `KRINIK_LAUNCHER_SNAPSHOT` / `KRINIK_LAUNCHER_STATE`.

## Phases

### Phase 1 — the links, the feed, the plate

- [x] 1.1 Manifest `launcher {version, gameVersion, gameNotes, feedRepo}`; `build-docs.py` bakes them into `BuildInfo`; the constant `GAME_VERSION` goes.
- [x] 1.2 The feed: one async `GET …/releases?per_page=30` (TLS 1.2, `User-Agent`, 5 s timeout, silent on failure); newest build tag and newest launcher
      tag by SemVer; test override `KRINIK_LAUNCHER_FEED=<url>` (never set on a player's machine).
- [x] 1.3 Two «Что нового» buttons under the version lines; the plate with «Обновить сборку» / «Обновить лаунчер».
- [x] 1.4 The pack version read at run time from `pack\modpack.json`.
- [x] 1.5 Cases `testcases/TC_conan_launcher_updates_2026-11-17.md`; the local test feed `ConanExiles/_config/launcher/test/feed.mjs`; snapshots at four DPIs.
- [ ] 1.6 A show page for the owner (rule 32) — the frames with captions.

### Phase 2 — «Обновить лаунчер»

- [x] 2.1 Download the asset beside the exe as `.new`, verify the digest, rename running → `.old`, `.new` → exe, start it, exit; the new start removes `.old`.
- [x] 2.2 Cases S1 / S2 on the test feed (the good asset and a forged one) — pass 2026-11-17 15:09 / 15:11.

### Phase 3 — «Обновить сборку»

- [x] 3.1 Confirm box with the total size and the free space; download the parts with resume and a progress line; verify every digest.
- [x] 3.2 Unpack through one stream over the parts; uninstall the old build; install the new one; start the new launcher.
- [x] 3.3 Cases B1–B3 on a fake game with bundles of two versions (B3 — Zip64, an entry past 4 GB) — pass 2026-11-17 15:11–15:17; report
      `testcases/reports/2026-11-17_conan-launcher-updates.md`.

### Judge round 1 (2026-11-17 15:27, a fresh helper on the diff) — what changed

Fixed: the free-space need now counts what is left (undownloaded + unpack unless the folder exists + the install copy when no build is installed);
the install's success = install.ps1's own exit code 0 AND the uninstaller present (install.cmd loses the code after `echo.` / `pause` — probe 15:29) — a
partial install is reported, the parts kept; the window refuses to close while busy, «Остановить» goes dark once uninstall / install start; a launcher
that does not start after the swap is rolled back (and a failed rollback tells where the old exe lies); `.old` is removed only after the new window shows;
after a failed update the column is re-read from the game (applyState), and applyState is ignored while busy; cleaning the parts no longer turns a success
into a failure; every worker and the feed read catch everything into a message; only `Krinik_…` archive names are accepted (no «.» / «..»); a network game
folder skips the free-space check instead of crashing; a stale `.new` is deleted before the download. New cases S3 (garbage asset), B4 (partial install),
B5 (close mid-download).
Left open (quality, not defects): a retry after «Игра запущена» re-hashes and re-unpacks everything (no «unpacked OK» mark); every update leaves the
previous bundle folder (~13 GB) in the game folder — offer to delete it (layout (a) only, never the game folder itself) — a step for phase 4.

### Judge round 2 (2026-11-17 15:50) — fixed and re-run (15:53–15:55: 74 checks pass, 0 fail)

Fixed: the archive's `packVersion` must equal the release tag before anything is uninstalled (no update loop); «Остановить» goes dark synchronously and
one last stop check precedes the uninstall; the self-update rolls back an empty exe place before advising «run as administrator»; `-GameDir` without a
trailing `\` (a game at a drive root); «Что нового» opens only http(s) and says so instead of crashing when no browser answers; the window helper swallows
any exception of a window that is going; after an installed build whose new launcher did not start, the plate stops offering it; the B2 Range check reads
the FILE request (the one after the 302).

**RELEASE BLOCKERS — before the first real launcher or build release (the owner's word is needed for that release anyway):**
1. A new launcher that STARTS and then dies (a crash in its window code, an antivirus kill) is not rolled back — the old one has already closed. Needs a
   handshake: the old process waits for the new window (a named event set in `Shown`) and rolls back if the new process exits first.
2. **The update resets the player's settings:** the bundle's «Game config» mod carries every `Saved/Config/Windows/*.ini` and the mods' `.sav` settings
   (`exportConfig`); the uninstall restores the pre-build copies and the new install writes the pack's. Keep the player's current copies across the update
   (copy before the uninstall, put back after the install) or skip «Game config» on an update — and say it in the confirm box.
3. A self-updated launcher reads only `packVersion` from `pack\modpack.json`; `GameVersion`, `GameNotes`, `GuidePdf`, `UninstallCmd` still come from its
   own build — read them from the bundle's manifest too.
4. The update must refuse to start while an install / uninstall console started by this launcher is still running (keep the `Process` objects).
5. Smaller: the free-space formula counts a partly unpacked folder as done; parts could be deleted right after a good unpack (peak −T); a release with
   its last part missing fails late with a ZIP message; `GameRunning()` is checked only after the download; a stand case meets the owner's real Conan.

### Phase 4 — release tooling

- [ ] 4.1 `build-docs.py` / a release note line: how a launcher release is published (`gh release create launcher-vX.Y.Z --latest=false <exe>`); the
      first real one waits for the owner's word.
