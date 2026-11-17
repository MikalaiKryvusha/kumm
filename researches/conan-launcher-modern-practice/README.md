# Research — how mature updaters and launchers update themselves and the content without losing the user's files

> **Created:** 2026-11-17 · on the owner's word (chat 2026-11-17 20:00 «пиши эпики…», 20:07 «веб разведка, как соверменные лаунчеры делают, какие технологии,
> какая архитектура, как обновления он получает и ставит») · **Parent:** `plans/55_EPIC_conan_build_0_9_1_for_3_1_1.md` (rung 1 of the ladder) ·
> **Status:** §1 written 2026-11-17 20:1x from a web-research helper's report (sources opened by the helper, quoted with URLs); §2 (launcher architecture and
> delivery) pending the second helper; §3 local recon; §4 the decisions for phase B · **Outbound:** forks → interview #039

## 1. Self-update rollback, keeping the user's files, interlocks, test matrices (helper report 2026-11-17 20:16)

### 1.1 "The new version must prove it started" — self-update rollback

- **Chromium updater — qualify, then activate.** A new version installs side by side as "Unqualified", runs a self-test, and is activated only after it passes, under a
  global prefs lock (a kernel mutex on Windows); a persisted "swapping" bit makes an interrupted activation resume at the next start; the old version uninstalls
  itself only after it sees a newer ACTIVE one. The only desktop "health check, then commit" design found documented.
  https://chromium.googlesource.com/chromium/src.git/+/HEAD/docs/updater/design_doc.md
- **Velopack — rollback covers the folder swap only.** Extract to temp, stop the app, rename `current` → temp-old (10 × 1 s), move the new folder in (30 tries); a
  failed second rename moves the old back; after that "past the point of no return" — the `--veloapp-updated` hook result is not checked, nothing rolls back a
  version that crashes after start. https://github.com/velopack/velopack/blob/develop/src/bins/src/commands/apply_windows_impl.rs · hooks with 15–30 s timeouts,
  first run signalled by `VELOPACK_FIRSTRUN`: https://docs.velopack.io/integrating/hooks · per-user under LocalAppData, no UAC; a locked `current` → kill the processes
  in it, then ask about other lockers: https://docs.velopack.io/packaging/operating-systems/windows
- **Squirrel.Windows** keeps `app-x.y.z` folders (current + previous) and says "there is no built-in support for rolling back".
  https://github.com/Squirrel/Squirrel.Windows/blob/develop/docs/using/update-process.md
- **ClickOnce** keeps one previous version; rollback is manual from Add/Remove Programs. https://msdn.microsoft.com/en-US/library/cc160746(v=vs.100)
- **Chrome's exe swap:** the installer drops `new_chrome.exe` beside the running `chrome.exe`; at relaunch Chrome renames itself to `old_chrome.exe` and promotes the
  new file. https://chromium.googlesource.com/chromium/src/+/master/chrome/browser/first_run/upgrade_util_win.cc
- **Firefox startup-crash counter:** `toolkit.startup.recent_crashes` vs `max_resumed_crashes` (2) → Safe Mode offered. https://bugzilla.mozilla.org/show_bug.cgi?id=731613 ·
  its updater keeps a per-file `.moz-backup`; an open bug: a full disk mid-apply breaks the rollback (`firefox.exe` lost). https://bugzilla.mozilla.org/show_bug.cgi?id=1661556
- **Windows facts:** a running exe can be renamed but not deleted (https://golang.org/issue/21997); `MoveFileEx(DELAY_UNTIL_REBOOT)` needs admin — not for a per-user
  launcher (https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-movefileexa).
- Not found by the helper: Steam client self-update internals, WinSparkle / Sparkle rollback.

### 1.2 Keeping the files the user changed

- **Windows Installer:** "Nonversioned Files are User Data" — a file whose Modified date is later than its Create date is not overwritten; equal times → hash compare.
  https://learn.microsoft.com/en-us/windows/win32/msi/file-versioning-rules · for us FRAGILE: unzip and copy-back reset the timestamps (helper's inference).
- **dpkg conffiles — the three-way rule by hash** (the proven one): the shipped file's hash is stored at install; on upgrade — the user did not change it and the
  package did → take the new; the user changed it and the package did not → keep the user's; both changed → ask (keep the old and leave the new as `.dpkg-dist`, or
  take the new and save the user's as `.dpkg-old`); `--force-confdef --force-confold` keeps changed files without asking.
  https://raphaelhertzog.com/2010/09/21/debian-conffile-configuration-file-managed-by-dpkg/ · `ucf --three-way` merges: https://manpages.debian.org/trixie/ucf/ucf.1.en.html
- **Inno Setup:** `onlyifdoesntexist`, `uninsneveruninstall`; advice — ship a read-only default, the app copies it only when no settings exist.
  https://jrsoftware.org/ishelp/topic_filessection.htm
- **Unreal Engine:** `Saved/Config/<Platform>/*.ini` stores only the DIFFERENCES from the Default ini hierarchy — shipping those files wipes every player change; pack
  defaults belong in the Default layer. NOT confirmed that Conan's shipping build reads a loose Default layer — a stand test.
  https://docs.unrealengine.com/4.27/ProductionPipelines/ConfigurationFiles
- **Wabbajack:** an update deletes every file not in the modlist EXCEPT downloads, the `.wabbajack` file, `profiles/*/saves`, any path with `[NoDelete]`, kept archives;
  other profile files are overwritten (users lose their load order); files already matching are skipped by hash.
  https://github.com/wabbajack-tools/wabbajack/blob/main/Wabbajack.Installer/AInstaller.cs · https://genesismodlist.com/modifying-install/
- **Mod Organizer 2:** a profile holds its own game INIs and optional saves; the My Games copies are untouched.
  https://stepmodifications.org/forum/topic/3420-mod-organizers-profiles-directory-technical-details
- **ATLauncher:** an update deletes `mods/`, `configs/`, `bin/`; packs list what to keep with `<keep>`; kept by default `options.txt`, `servers.dat` and
  `mods/rei_minimap` (minimap waypoints — our marker-file case); saves never touched. https://wiki.atlauncher.com/pack-admin/xml/keep
- **CurseForge app:** custom changes are overwritten on a version change unless «Update to new Profile». https://support.curseforge.com/support/solutions/articles/9000206622
- **Modrinth / Prism:** `.mrpack` copies `overrides/` over the instance (https://support.modrinth.com/en/articles/8802351-modrinth-modpack-format-mrpack); Prism added
  «Ask before deleting saves as part of a Modpack update».
- **Pack-side Minecraft mods:** copy defaults once (YOMBR marker; Default Options copies only if absent — https://modrinth.com/mod/default-options); per-version key
  patches (Modpack Config Updater, `modpack_version.txt`, handles skipped versions); Config Reconciler — a per-key three-way merge, the player wins by default
  (`KEEP_USER`), backups, dry run (https://www.curseforge.com/minecraft/mc-mods/config-reconciler).
- **Vortex:** an "External Changes" dialog for deployed files changed outside it (forum only). r2modman / BepInEx — no authoritative source.

### 1.3 Interlocks

- **Inno `AppMutex`:** the app holds a named mutex; setup / uninstall refuse while it exists. https://jrsoftware.org/ishelp/topic_setup_appmutex.htm
- **Restart Manager:** `RmStartSession` → `RmRegisterResources(files)` → `RmGetList` names the processes holding files.
  https://learn.microsoft.com/en-us/windows/win32/rstmgr/using-restart-manager-with-a-secondary-installer
- **One installer at a time:** `_MSIExecute` mutex → error 1618; Chromium: installers "should implement a single-instance mechanism", the updater never kills an
  installer and times out after 15 min. https://chromium.googlesource.com/chromium/src/+/main/docs/updater/functional_spec.md
- **Atomic install:** stage-then-rename with retries and move-back (Velopack); Windows Installer's rollback script (`Config.Msi`), undo in reverse order; Chromium's
  "swapping" bit as a journal. Free space: no mature updater documents a rule; a full disk mid-apply breaks rollback (Firefox 1661556).

### 1.4 GitHub Releases facts

- `/releases/latest` = the most recent non-prerelease, non-draft release; `make_latest` true / false / legacy; drafts and prereleases cannot be latest; drafts listed only
  for users with push access. https://docs.github.com/en/rest/releases/releases
- Asset `digest` — "string or null", `sha256:<hex>`, computed at upload since June 2025; no statement of backfill.
  https://github.blog/changelog/2025-06-03-releases-now-expose-digests-for-release-assets/
- Unauthenticated: 60 requests / hour / IP; over → 403 or 429, wait until `x-ratelimit-reset`; anonymous 304s still count.
  https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api
- Not found: whether `browser_download_url` downloads count against the limit; an official word that Range (resume) works on the CDN (our stand B2 checks the 206).

### 1.5 The helper's test-case list (Firefox updater tests, Chromium test plan, TUF)

Self-update: the new exe crashes in its form / never signals / is killed after signalling; `.old` locked; same version, downgrade, N → N+2; an older REAL build
updating to this one. Download: interrupted + resumed, a server ignoring Range (no 206), wrong hash, `digest` null, disk full mid-download and mid-unpack, offline,
403 / 429 / 304. Install: game running, a game file locked, a child console open, a second launcher instance, no write access, the launcher killed in every journal
phase, rollback failing, path traversal in zip entries. Settings: player-changed vs pack-changed vs both-changed ini; the marker file kept; `Game_0.db` byte-identical.
Channels: a prerelease never through `/latest`, a draft invisible, an older release marked latest by `make_latest`.
(https://searchfox.org/firefox-main/source/toolkit/mozapps/update/tests/unit_update_binary · https://chromium.googlesource.com/chromium/src/+/main/docs/updater/test_plan.md ·
https://theupdateframework.io/security/)

## 2. Launcher architecture and delivery (helper report 2026-11-17 20:21; sources opened by the helper)

### 2.1 Architecture — a thin UI and a separate worker

- **Battle.net:** the UI app and `Agent.exe` (versioned folders under `ProgramData\Battle.net\Agent`) are separate; the Agent is a local HTTP service on `127.0.0.1:1120`
  and updates itself independently (https://cascette-rs.readthedocs.io/en/latest/client/agent.html; a 2022 Agent build broke updates — forum reports). Qt + CEF — unconfirmed.
- **Riot League client:** C++ REST microservice "plugins" (each semver-versioned) + an Ember front end in CEF, WebSocket pushes (https://technology.riotgames.com/node/40).
- **Steam:** `steam.exe` is a bootstrapper fetching a `steam_client_win32` manifest and `.zip.vz` packages; the UI runs in `steamwebhelper.exe` (CEF) — community logs,
  not Valve docs (https://developer.valvesoftware.com/wiki/CEF). **Epic:** Slate + CEF (unofficial). **GOG Galaxy 2.0:** each integration a separate Python process with
  a `manifest.json` (https://galaxy-integrations-python-api.readthedocs.io/en/0.42/overview.html). EA app, Ubisoft Connect, Minecraft launcher, alt:V — no source opened.
- **Mod tools:** Mod Organizer 2 — C++/Qt, USVFS hooks the file APIs into one virtual Data folder (https://github.com/isanae/usvfs); Vortex — hardlink / symlink / move
  deploy (forums); r2modman — Electron, profiles; CurseForge — Electron ≈ 110 MB; **Prism Launcher** — C++/Qt6 with a SEPARATE `prismlauncher_updater.exe` pulling
  from GitHub Releases (repo fixed at build time); **FlightCore (Northstar)** — Tauri 2, MSI from GitHub Releases, self-update offer; FiveM — Release / Beta / Canary
  channels by `UpdateChannel=` in `CitizenFX.ini`.

### 2.2 Content delivery

- **Steam** (https://partner.steamgames.com/doc/sdk/uploading): ≈ 1 MB chunks, compressed and encrypted, a manifest per depot version; an update reuses matching chunks;
  the client "builds the new version alongside the old version" and then commits; a changed big pak is rebuilt whole; Valve advises 1–2 GB packs and for Unreal
  `-patchpaddingalign=1048576`.
- **Epic** (Legendary's `manifest.py`, https://github.com/derrod/legendary): magic `0x44BEC00C` + SHA-1 of the body; chunk entries (128-bit GUID, 64-bit hash, SHA-1,
  sizes); file entries with SHA-1 / SHA-256 and chunk parts; `IChunkDeltaOptimiser` for a manifest pair.
- **Riot's League patcher** (https://www.riotgames.com/en/news/supercharging-data-delivery-new-league-patcher): a SIGNED ≈ 8 MB FlatBuffers release manifest («Clients will
  only load a release manifest if it's properly signed»); content-defined chunks (FastCDC), zstd 19, > 300 000 chunks in < 5 000 content-named bundles (> 85 % carry
  over); plain S3/CDN with multipart Range over 8 connections; a local SQLite state db, in-place updates in ≤ 64 MB slices with a commit after each (a cancel is safe,
  no staging copy); the launch check by size and timestamp (≈ 100 ms), partial and full repair; average update < 40 s instead of > 8 min, failures 2.2 % → 0.3 %.
- **Blizzard TACT / CASC** (https://wowdev.wiki/TACT): a version server hands a build config and a CDN config; data content-addressed by MD5 at
  `host/path/{config|data|patch}/AB/CD/<hash>`; ≈ 256 MB archives with indices; a download manifest with priorities 0–2 lets the game start early; patches ZBSDIFF1.
- **Binary deltas:** Courgette cut a Chrome patch 704 512 → 78 848 bytes (https://blog.chromium.org/2009/07/smaller-is-faster-and-safer-too.html); Zucchini needs ≈ 20 min
  and GBs of RAM per diff; MSIX block maps resend whole 64 KB blocks; content-defined chunking resists insertions (https://www.hydraulic.dev/blog/20-deltas-diffed.html).

### 2.3 How launchers update themselves

- **Squirrel.Windows:** per-user `%LocalAppData%\App` with `Update.exe`, `packages\` (full + delta `.nupkg`), side-by-side `app-x.y.z\`; shortcuts call `Update.exe --processStart`.
- **Velopack:** a root stub `App.exe` launches `current\`, an update replaces `current\` whole; a `releases.{channel}.json` feed; `GithubSource(repo, token, prerelease)`
  (https://docs.velopack.io/integrating/update-sources).
- **electron-updater:** `latest.yml` per release, staged rollouts (`stagingPercentage`), Windows code-signature validation; the GitHub API only with `GH_TOKEN`
  (https://www.electron.build/v26/docs/features/auto-update).
- **Tauri updater:** a static `latest.json` {version, notes, pub_date, platforms{url, signature}} at `…/releases/latest/download/latest.json`; the signature check
  "cannot be disabled" (https://v2.tauri.app/plugin/updater/). **WinSparkle:** an RSS appcast over HTTPS (https://winsparkle.org/guides/publishing-updates/).
  **MSIX App Installer:** `HoursBetweenUpdateChecks`, `OnLaunch`, signed packages (https://learn.microsoft.com/en-us/windows/msix/app-installer/update-settings).
- **Windows:** a running exe can be renamed (the loader opens it with `FILE_SHARE_DELETE`) — the `exe → exe.old` swap works
  (https://blogs.msdn.microsoft.com/larryosterman/2004/05/13/why-is-it-file_share_read-and-file_share_write-anyway). **Code signing:** since August 2024 OV and EV build
  SmartScreen reputation the same way (https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/code-signing-options).

### 2.4 Modpack and mod-manager updates

- **Modrinth `.mrpack`:** `files[]` with `path` (reject `..` / absolute), `hashes` (SHA-1 + SHA-512), `env`, `downloads[]` mirrors, `fileSize`; `overrides/` copied over the
  instance; the spec says nothing of user configs on update (https://support.modrinth.com/en/articles/8802351-modrinth-modpack-format-mrpack).
- **Wabbajack:** a compiled `.wabbajack`, each file tied to its source archive, changed files as binary patches; an update reinstalls with overwrite and deletes what
  does not match (only `[NoDelete]` spared) (https://skyrimunificationproject.github.io/01HowDoI/UpdatingModlist).
- **Thunderstore:** a zip with `manifest.json` (semver, dependencies `Team-Name-Version`) (https://wiki.thunderstore.io/mods/creating-a-package). **Nexus Collections:**
  numbered revisions; guides advise a fresh profile on update (https://modding.wiki/en/nexusmods/collections/about).

### 2.5 GitHub Releases as the source

Up to 1 000 assets per release, each < 2 GiB, no total size or bandwidth limit (https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases);
`/releases/latest/download/<asset>` is a stable link that spends no API quota; immutable releases GA since 2025-10-28 (lock assets and tag, `gh release verify-asset`);
Range support on the download host undocumented — the launcher tests the 206 itself.

### 2.6 The helper's fit list for a one-person WinForms launcher (13 GB pack)

1. One release manifest asset per release (`packVersion`, `minLauncherVersion`, channel, `files[{path, size, sha256, url}]`, `deletes[]`) fetched by
   `releases/latest/download/…` — no API quota. 2. Mods as separate assets instead of zip parts; unchanged files keep the URL of the release that first carried them.
3. No binary deltas (cooked compressed paks explode diffs). 4. Stage, then commit; a local state file (size, mtime, SHA-256) and a «Repair». 5. Resumable `.part` +
Range, a full re-download without 206, 4–8 connections. 6. An explicit config policy per entry: `managed` or `seed` (copy only if missing); delete only what the
previous manifest listed. 7. The `exe → exe.old` swap is enough for one exe; `minLauncherVersion` so an old launcher updates itself before reading a newer format.
8. A signed manifest (Ed25519 key in the launcher) cross-checked with GitHub's `digest`. 9. Channels: stable = GitHub «latest», testing = a pre-release by tag; one
check per start. 10. Nexus as a mirror URL (no source on whether Nexus allows automated downloads).

## 3. Local recon (2026-11-17 20:1x)

- The deploy's undo journal (`KUMM/Deploy-ModPack.ps1` `Save-Original` / `Invoke-Restore`): `replaced` (a copy kept in `_kumm_backup\files\`), `created`, `dir`; the
  first entry of a path wins (a redeploy keeps the vanilla copy); `-Restore` reads only the journal and deletes `_kumm_backup` on success.
- What a bundle writes under `Saved/`: every `Saved/Config/Windows/*.ini` of the owner's game at export (`-ConfigFrom`) + `exportConfig` (four mod `.sav`:
  `HosavUISave_New`, `SimpleMinimap`, `ProximityParty`, `DamageMeter`). Never written: `SimpleMinimap_MarkerData.sav`, `DamageData_*.sav`, `Game_*.db` — the journal
  never touches them, so an update keeps them already (a case to prove, not to assume).
- The bundle's `install.ps1` (`Write-BundleInstaller`) runs `-Deploy` only; it does not know an older build is installed. The launcher's update (plan 54, `BuildUpdate`)
  runs the OLD uninstaller first, then the new `install.ps1` → every config file the player changed after the install is replaced by the pre-build copy, then by the
  new bundle's defaults (plan 54 blocker 2).
- The 0.9.0 players have the 0.9.0 launcher (no updater) and the 0.9.0 uninstaller (no knowledge of player settings): their path to 0.9.1 is manual — the 0.9.1
  installer must recognise an installed older build itself.
- Nexus: 0.9.0's file has been quarantined since 2026-11-03 («Virus scan — Some suspicious files», ticket 276571, three letters; the third says «None of the scripts
  downloads or runs anything from the internet» — no longer true of the 0.9.1 launcher).

- **Found 2026-11-17 20:22 — the shipped config carries the TEST machine's display:** `-Export -ConfigFrom <game>` bundles EVERY `*.ini` of `Saved/Config/Windows`
  as it is — the stashed 3.1.0 build's `GameUserSettings.ini` holds `ResolutionSizeX=1280` / `Y=720`, `FullscreenMode=1`, `FrameRateLimit=141` (the agent's background
  runs), `Input.ini` 258 mapping lines (the owner's own binds, numpad camera among them), `ServerSettings.ini` (the single-player server rules). A 0.9.1 bundle made
  that way starts every player at 720p.

## 4. Decisions for phase B (2026-11-17 20:2x, `[AI]` by the owner's mandate «работай автономно» and his goal «не портил настройки и сейвы игроков»; revisable)

FORK: options <player's file wins when both changed | the build's wins | per-key merge now> · price of error <the player loses his settings, or a build fix is
dropped for him> · consulted <dpkg conffiles (`--force-confold` keeps the user's), Config Reconciler `KEEP_USER` default, ATLauncher `<keep>`, Windows Installer
"nonversioned files are user data" — §1.2>. Chosen: **the player's file wins; the new build's version is left beside it as `<file>.krinik-new` and the update log
names it** (dpkg confold); the build's OWN Engine.ini sections are merged section by section (the existing `Merge-IniPart`) so a build fix there still lands.

1. **Ownership classes of everything the build writes under `Saved/`** — one table in the manifest (`configPolicy`), read by the installer:
   `managed` — the build's tuning that must hold (Engine.ini's pack sections, `ServerSettings.ini`, `Game.ini`); `seed` — written only when the player has no file
   (the mod `.sav` settings, `Input.ini`); `strip` — keys never shipped (`GameUserSettings.ini` resolution / fullscreen / frame-rate / `LastUserConfirmed*` keys);
   `never` — the deny list neither the installer nor the uninstaller may write or restore (`Game_*.db*`, `SimpleMinimap_MarkerData.sav`, `DamageData_*.sav`, every
   `.sav` not in `exportConfig`).
2. **The installer owns the upgrade** (both the launcher's update and the player's own `install.cmd` — and 0.9.0 → 0.9.1, whose old uninstaller knows nothing):
   when `install.ps1` finds an installed build (the uninstaller and the journal in the game root) it (a) hashes the player's current config-class files and compares
   them with the hashes the old build shipped (`_kumm_backup\shipped.json`, written by every install from 0.9.1; for 0.9.0 — a table of 0.9.0's shipped hashes
   taken once from the 0.9.0 release archive and embedded in the pack), (b) saves the changed ones aside, (c) runs the old uninstall, (d) installs the new build,
   (e) puts the player's changed files back by the rule above, (f) writes the new `shipped.json`. The launcher's update then runs only the new `install.ps1`.
3. **Self-update proves its start** (Chromium "qualify, then activate", reduced to one exe — §1.1): the old process stays alive; the new one starts with
   `--after-update <pid>` and sets a named event once its window is shown and idle 3 s; no event within 30 s or the new process exits first → the old kills it,
   renames it `.bad`, puts `.old` back, restarts itself and says «обновление лаунчера откатилось»; `.old` is deleted only at the new launcher's SECOND clean
   start, and a «starting» marker counts unfinished starts — two while `.old` exists → revert (an antivirus kill after the handshake).
4. **Interlocks** (§1.3): one named mutex held for the whole update; the launcher keeps the `Process` of every console it started and refuses an update while one
   lives; the game process checked before the download AND before the uninstall; a write probe in the game folder; the free-space need = what is left to
   download + unpack + the backups + a margin.
5. **The bundle's `pack\modpack.json` is the truth** for what the launcher shows (game version, «Что нового» of the game, the guide, the uninstaller name), the
   compiled values only a fallback (plan 54 blocker 3).
6. **Kept as is for 0.9.1** (KISS, the next days' release): the feed (`/releases?per_page=30`, one call per start, silent on 403 / 429 — §1.4), zip parts with
   per-part digests, the `exe → exe.old` swap. **Later, filed as an idea** (§2.6): a release manifest asset, per-mod assets with reuse across releases, a signed
   manifest, a «Repair» button.
