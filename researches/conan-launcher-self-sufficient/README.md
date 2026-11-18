# Research — the self-sufficient Conan launcher: finding the game, reading its version, matching a release

> **Created:** 2026-11-18 · for epic 57 phase 1 (`plans/57_EPIC_conan_launcher_self_sufficient.md`)
> **Parent:** the owner's words 2026-11-18 08:18–08:22 (`PROJECT_HISTORY.md` entry 2026-11-18 08:11)
> **Status:** 🔬 started 2026-11-18 08:3x — local facts collected; web part answered 2026-11-18 09:38 by a helper (§2.1–2.5, sources and five probes
> on this PC; §3 — eleven recommendations for phase 2); to verify before phase 2: whether Funcom's Shipping exe carries the CL in `ProductVersion`
> **Outbound:** the phase-2 design of the game search and the version match

## 1. Local facts (read from this project, 2026-11-18)

| Fact | Value | Source |
|---|---|---|
| The game's executables | `ConanSandbox.exe` at the install root (what the launcher looks for today, `GAME_EXE`, up to 3 folders above itself, `GAME_SEARCH_LEVELS`) and `ConanSandbox/Binaries/Win64/ConanSandbox-Win64-Shipping.exe` | `_config/launcher/KrinikConanLauncher.cs:50–54, 89–98` |
| The game's build id | the Shipping exe carries a UTF-16 string `++exiles+release-CL-<number>`: 3.1.1 = CL-383549, 3.1.0 = CL-383024, 3.0.1 = CL-379176, 2.2.3 = CL-378132 | `researches/conan_patch_3_1_0/README.md` §3 item 7; `ConanExiles/modpack.json` `builtFor` |
| The build's game version for the launcher | `modpack.json` → `launcher.gameVersion` (3.1.1) and the human line `builtFor` with the CL | `ConanExiles/modpack.json:4–6` |
| The release feed | GitHub releases of `MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack`; the launcher reads it already (`Feed`, plan 54) and downloads build parts with resume and hashes for an update | `_config/launcher/KrinikConanUpdates.cs` |
| Steam app id | 440900 (the Steam news link of `launcher.gameNotes`) | `ConanExiles/modpack.json:6` |

Consequence for the version match: the launcher reads the CL from the found Shipping exe and asks the feed for the newest release whose game CL equals it;
a release therefore has to carry its game CL in a machine-readable place (its `modpack.json` asset or the release body) — today only `gameVersion` and the
human `builtFor` line exist. To decide in phase 2.

## 2. The web part answered (2026-11-18 09:38 +03:00)

Sources are the code of other mod managers, the GitHub docs, and five probes run here: the dev PC's own Steam files (read only), two unauthenticated
GitHub GETs on a neutral public repo (`cli/cli`), one `rate_limit` read, a .NET Framework `HttpWebRequest` Range probe, and a timed scan of a 230 MB system exe.
No game folder was opened. Numbers below come from those outputs or from the cited source; my estimates are marked *estimate*.

### 2.1 Steam libraries, `libraryfolders.vdf`, `appmanifest_440900.acf`

**Where Steam is.** Two registry places, and the managers disagree on which one they read, so read both:
- `HKCU\Software\Valve\Steam` → `SteamPath` (per user). Vortex and MO2 read this one. On the dev PC it reads `c:/program files (x86)/steam`, with forward
  slashes in lower case, so normalise it with `Path.GetFullPath` before comparing.
- `HKLM\SOFTWARE\WOW6432Node\Valve\Steam` → `InstallPath` (machine-wide, backslashes). r2modman reads this one. MO2 opens keys with `KEY_WOW64_32KEY` first,
  then `KEY_WOW64_64KEY`; in .NET that is `RegistryKey.OpenBaseKey(RegistryHive.LocalMachine, RegistryView.Registry32)` and then `SOFTWARE\Valve\Steam`.
  The 64-bit view `HKLM\SOFTWARE\Valve\Steam` also exists on the dev PC.

**The library list** sits in two copies, and both exist on the dev PC. Vortex and MO2 read `<Steam>\config\libraryfolders.vdf`, while r2modman reads
`<Steam>\steamapps\libraryfolders.vdf`. A 2021 Steam forum thread says the `config` copy is the master and the `steamapps` copy is rewritten at start-up.
Read both and merge the paths. The file has had two formats:

```
"libraryfolders"                       // current (the Storage Manager era); root key in lower case
{
	"0"  { "path" "C:\\Program Files (x86)\\Steam"  "label" ""  "contentid" "…"  "totalsize" "0"
	       "update_clean_bytes_tally" "…"  "time_last_update_verified" "…"  "apps" { "228980" "245987471" } }
	"1"  { "path" "D:\\SteamLibrary" … "apps" { "<appid>" "<bytes on disk>" … } }
}
"LibraryFolders"                       // old; entries are plain strings; the Steam folder itself is implicit
{ "TimeNextStatsReport" "…"  "ContentStatsID" "…"  "1" "D:\\SteamLibrary" }
```

r2modman branches on `libraryfolders` (object entries with `path`) against `LibraryFolders` (string entries). Vortex starts at index `"0"` if it exists,
otherwise at `"1"`, and always adds the Steam folder itself, because the file "at times" lists all libraries and at other times only the extra ones.
MO2 picks the library whose `apps` block contains the app id. That is fast, but the block can be stale, so the manifest stays the proof.

**The app manifest** is `<library>\steamapps\appmanifest_440900.acf`. Its root is `"AppState"`, with the fields `appid`, `name`, `StateFlags`, `installdir`,
`LastUpdated`, `SizeOnDisk`, `buildid`, `TargetBuildID`, `UpdateResult`, `BytesToDownload`, `BytesDownloaded`, `InstalledDepots` and `LastOwner`
(field list read from a manifest on the dev PC). The game folder is `<library>\steamapps\common\<installdir>`; Vortex and r2modman build it the same way.
- `StateFlags` is a bitmask: 1 Uninstalled, 2 UpdateRequired, **4 FullyInstalled**, 32 FilesMissing, 64 AppRunning, 256 UpdateRunning, 512 UpdatePaused,
  1024 UpdateStarted, 2048 Uninstalling, 1048576 Downloading (game-scanner's `SteamAppState`). Treat the game as installed only when `(flags & 4) != 0`,
  and say "Steam is updating the game" when 2, 256, 1024 or 1048576 is set.
- `buildid` is Steam's build number, not Funcom's CL. It only tells that the files changed since the last check; the version match uses the CL from the exe (§2.3).
- `LastOwner` is a SteamID. Never log it or show it (the house rule on the owner's identity).

**Parsing VDF in C# without libraries.** The format is Valve's KeyValues text: quoted or bare tokens, `{ }` nesting, `//` comments, backslash escapes in
Steam's files (GameFinder sets `HasEscapeSequences = true`), and optional `[$WIN32]` conditions that these two files do not use. A recursive reader of about
40 lines is enough: a tokenizer that yields strings and braces, and `Dictionary<string, object>` nodes built with `StringComparer.OrdinalIgnoreCase`, which
also covers `LibraryFolders` against `libraryfolders`. Test it on the two format samples above plus a broken file, which must return "no Steam" and not throw.

Sources: Vortex `src/util/Steam.ts` (v1.12.0) https://raw.githubusercontent.com/Nexus-Mods/Vortex/v1.12.0/src/util/Steam.ts ·
MO2 `gamegamebryo.cpp` https://github.com/ModOrganizer2/modorganizer-game_gamebryo/blob/master/src/gamebryo/gamegamebryo.cpp ·
r2modman `GameDirectoryResolver.ts` https://github.com/ebkr/r2modmanPlus/blob/develop/src/r2mm/manager/win32/GameDirectoryResolver.ts ·
StateFlags https://docs.rs/crate/game-scanner/1.0.4/source/src/steam/types.rs · GameFinder (C#) https://github.com/erri120/GameFinder ·
config vs steamapps https://steamcommunity.com/discussions/forum/0/3044985412473578414 · KeyValues https://developer.valvesoftware.com/wiki/KeyValues

### 2.2 Finding a game without store metadata

**Stores.** Conan Exiles Enhanced (UE5) shipped on 2026-05-05 **on Steam only**. Epic Games Store and Microsoft Store owners stay on Conan Exiles Legacy
(UE4), which gets no further updates. So the launcher needs no Epic, GOG or Xbox metadata. A Legacy copy found on disk has the same exe names and must be
rejected by its CL. For reference only: Epic keeps one JSON `*.item` per game, with `InstallLocation`, in `C:\ProgramData\Epic\EpicGamesLauncher\Data\Manifests`.

**What the established managers do:**
- **Vortex.** At start-up it runs only *quick discovery*: store lookups by the game's Steam id (`queryArgs`) or a `queryPath` callback. A found folder must
  still contain the game's `requiredFiles`. The full *search* starts only when the user asks for it (the `start-discovery` event opens a search-paths dialog).
  It walks every drive that `drivelist` reports as `isSystem && !isRemovable`, all roots in parallel, with **no depth limit and no blacklist**. It matches
  file basenames against `requiredFiles` and then checks that all required files sit in that folder. Progress is a guess that starts at 2^24 folders and
  converges. This search is slow, which is why it stays manual.
- **Mod Organizer 2.** It tries the game's own registry key first (`HKLM\Software\Bethesda Softworks\<game>` → `Installed Path`), then Steam (HKCU `SteamPath`,
  `config\libraryfolders.vdf`, the library whose `apps` holds the id, then `steamapps\common\<dir>` if that folder exists). Failing both, the user browses.
- **r2modman / Thunderstore.** A folder set by the user in settings wins. Then come HKLM `InstallPath`, `steamapps\libraryfolders.vdf` (both formats),
  `appmanifest_<id>.acf` and `installdir`. Failing those, the error asks the user to set the folder by hand.
- **CKAN** (C#) depends on the ValveKeyValue library for Steam's files; other installs are added by the user. **GameFinder** (C#, used by Nexus Mods' newer app)
  covers Steam, GOG, EGS, Origin, EA Desktop, Xbox and Heroic. Neither page I could read showed a disk walk.

The common pattern is store metadata first, then a check of required files, then a folder picked by the user and remembered. None of them runs an unbounded
disk walk on start-up. Our launcher must work with no help from the player, so it needs a **bounded** walk. The bounds below are my own design (*estimate*),
not taken from a source:
- Drives: `DriveInfo.GetDrives()` with `DriveType.Fixed && IsReady`, skipping Removable, Network, CDRom and Ram drives.
- Priority roots on each drive: `X:\SteamLibrary\steamapps\common`, `X:\Steam\steamapps\common`, `X:\Program Files (x86)\Steam\steamapps\common`,
  `X:\Program Files\Steam\steamapps\common`, `X:\Games`, `X:\Program Files (x86)`, `X:\Program Files`, `X:\Epic Games`, then `X:\` itself.
- Depth: at most 4 folders below each root. Skip `Windows`, `Windows.old`, `$Recycle.Bin`, `System Volume Information`, `Recovery`, `PerfLogs`,
  `ProgramData`, `WindowsApps`, `Users\*\AppData`, `.git` and `node_modules`. Skip every folder with `FileAttributes.ReparsePoint` (junction loops,
  OneDrive placeholders).
- Errors: `Directory.EnumerateDirectories` (lazy) with a catch for `UnauthorizedAccessException`, `IOException` and `PathTooLongException` on each folder.
  .NET Framework has no `EnumerationOptions`, so there is no built-in skipping.
- Time: a total budget of about 15 s on a background thread, cancellable. Installs are reported as they are found; a hit in a priority root ends the walk early.
- A match is a folder that holds `ConanSandbox.exe` **and** `ConanSandbox\Binaries\Win64\ConanSandbox-Win64-Shipping.exe`. Deduplicate by
  `Path.GetFullPath`, ignoring case.

Sources: Vortex `discovery.ts`, `index.ts`, `getDriveList.ts` (v1.12.0) https://github.com/Nexus-Mods/Vortex/tree/v1.12.0/src/extensions/gamemode_management ·
store scope https://worthplaying.com/article/2026/4/23/news/149686-conan-exiles-gets-enhanced-in-may-with-free-unreal-engine-5-visual-overhaul-but-only-for-steam-players-trailer/ ·
https://heise.de/-11283393 · https://funcom.helpshift.com/hc/en/5-conan-exiles/faq/81-conan-exiles-enhanced-–-overview/ ·
CKAN on ValveKeyValue https://www.nuget.org/packages/ValveKeyValue · Epic manifests https://jayd.ml/games/2020/05/16/epic-games-store-steam-libraries.html

### 2.3 Reading the game build from a 200 MB exe

- **`FileVersionInfo`** reads only the PE version resource. Measured on `C:\Windows\System32\MRT.exe` (230 MB, .NET Framework 4.8 through PowerShell 5.1): **6.2 ms**.
  In Unreal, `BUILD_VERSION` defaults to `{BranchName}-CL-{Changelist}` from `Build/Build.version`, which is exactly the shape of `++exiles+release-CL-383549`.
  An Epic issue (UE-195983) says `BUILD_VERSION` fills `ProductVersion` in `Default.rc2`, and a UE4 report shows a ProductVersion of `++UE4+Release-4.21-CL-4753647`.
  Whether Funcom's Shipping exe carries the CL in `ProductVersion` is **not verified**: this pass opened no game folder. The first phase-2 step reads it once.
- **Stream search** over the whole file. Measured on the same 230 MB exe: 1 MB chunks decoded as UTF-16 and searched with an ordinal `IndexOf` took
  **977 ms and 918 ms** (two passes, warm cache). The robust form is a byte search for the UTF-16LE bytes of `++exiles+release-CL-`. It keeps
  (pattern length − 1) bytes of overlap between chunks, is independent of alignment, stops at the first hit, and reads the digits after the hit.
  A cold read is bound by the disk: about 1–2 s on a hard disk and well under a second on an SSD (*estimate*).
- **The game log** `ConanSandbox\Saved\Logs\ConanSandbox.log` has the line `LogInit: Build: ++exiles+release-CL-…` (seen in bug 07). It exists only after
  the game has run and goes stale after an update, so it is a hint only.

Recommendation: use `ProductVersion` if the phase-2 read shows the CL there; otherwise run the byte scan on a background thread. Either way, cache
`(full path, size, LastWriteTimeUtc) → CL` in the launcher's settings and rescan only when the exe changes. Steam's `buildid` can serve as an extra change signal.

Sources: https://ikrima.dev/ue4guide/build-guide/ubt/engine-versionbuildid/ · https://issues.unrealengine.com/issue/UE-195983 ·
https://forums.unrealengine.com/t/where-to-inject-custom-engine-versioning/305079

### 2.4 GitHub releases for an unauthenticated client

- **Limit:** 60 requests per hour per originating IP (the `core` resource), reported in `x-ratelimit-limit`, `-remaining`, `-used`, `-reset` and `-resource`.
  Past the limit, GitHub answers 403 or 429 with `remaining` 0, and the client must wait until `x-ratelimit-reset`. Players behind a shared address
  (a carrier NAT) share these 60 requests.
- **Endpoints:** `GET /repos/{o}/{r}/releases/latest` returns the newest release that is neither a draft nor a prerelease, by `created_at` (the commit date),
  or the release marked with `make_latest`. `GET …/releases?per_page=N` lists releases (default 30, at most 100; drafts appear only with push access).
  `GET …/releases/tags/{tag}` returns one release. Our feed mixes build (`v…`) and launcher (`launcher-v…`) releases, so the list read of today is right,
  and `releases/latest` stays the build only while launcher releases are published with `make_latest=false`.
- **ETag does not save the limit here.** The docs say a 304 is free only "while correctly authorized". Measured on 2026-11-18 without a token: a 200 left
  `remaining` at 59, then `If-None-Match` got a **304 and `remaining` dropped to 58**. API answers carry `Cache-Control: public, max-age=60`. An ETag
  therefore saves only the body.
- **Asset downloads:** `browser_download_url` (`github.com/{o}/{r}/releases/download/{tag}/{name}`) answers **302** to
  `release-assets.githubusercontent.com/github-production-release-asset/…` (the older host was `objects.githubusercontent.com`). The redirect carries a
  signed query whose `se=` expiry was about **1 hour** after issue (issued 06:31Z, expires 07:32Z). Neither response carries `x-ratelimit` headers,
  and `/rate_limit` still showed 58 after three asset GETs, so **asset downloads do not use the API quota**.
- **Range and resume:** the CDN answers `206 Partial Content` with `Content-Range`, `Accept-Ranges: bytes`, an Azure-style `ETag "0x8D…"` and `Last-Modified`.
  **.NET Framework 4.x `HttpWebRequest.AddRange` survives the automatic redirect.** Measured: 206, final host `release-assets.githubusercontent.com`,
  `Content-Range: bytes 14167000-14167373/14167374`. This confirms the redirect half of today's `Feed.Download` and `HasZipEnd` (marked `[NOT-TESTED]`).
  Every attempt must start again from `browser_download_url`, because a stored signed URL dies within the hour. Today's code already does this.
  `If-Range: <ETag>` would make a replaced asset come back as a 200 instead of a stitched file; the sha256 from the asset's `digest` field (`sha256:…`) already catches that case.
- **A link outside the API:** `github.com/{o}/{r}/releases/latest/download/{name}` answers 302 to the latest release's asset (documented, and observed on
  a public repo). A small feed asset fetched this way works even when the 60 requests are spent.

Sources: https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api ·
https://docs.github.com/en/rest/using-the-rest-api/best-practices-for-using-the-rest-api · https://docs.github.com/en/rest/releases/releases ·
https://docs.github.com/en/rest/releases/assets · https://docs.github.com/en/repositories/releasing-projects-on-github/linking-to-releases

### 2.5 Speed and remaining time in download UIs

- **wget:** speed comes from a ring of the most recent reads (20 entries today, earlier 30 of at least 0.1 s, about 3 s of history). The screen redraws at most
  every 0.2 s; the ETA refreshes at most about once a second (0.99 s) "to avoid jerky predictions". After 5 s with no data (`STALL_START_TIME`) it shows
  "stalled", drops the current speed and clears the history.
- **curl:** the meter redraws once a second. Its time left comes from the average speed of the whole transfer.
- **tqdm:** an exponential moving average of speed, `smoothing = 0.3` by default (0 is the overall average, 1 the instantaneous speed); the display refreshes at most every 0.1 s.

Recommendation: sample the byte count on a UI timer every 250–500 ms, not on every buffer read. Smooth the speed over a window of about 5 s, or with an
EMA of α ≈ 0.3 per second. ETA is remaining bytes over the smoothed speed, refreshed at most once a second and rounded (hours and minutes, then minutes,
then "less than a minute"). After 5 s without bytes, show no speed and an ETA of "estimating" instead of a jump to hours. Count the amount and percent over
**all parts** (`Total`, `Have` from `BuildUpdate.Prepare`). Count speed only from bytes of this session, so resumed bytes do not inflate it. Elapsed time runs
from this session's start, and hashing is shown as its own stage.

Sources: https://code.moparisthebest.com/moparisthebest/wget/src/branch/master/src/progress.c (mirror of GNU wget `src/progress.c`) ·
https://github.com/curl/curl/blob/master/lib/progress.c · https://tqdm.github.io/docs/tqdm/

## 3. Recommendation for phase 2

- **Search order**, all on a background thread while the window is already open: the launcher's own folder walk-up (today's 3 levels), then the paths
  remembered from earlier runs, then Steam (both registry views, both `libraryfolders.vdf` copies and formats, `appmanifest_440900.acf` with `StateFlags & 4`),
  then the bounded fixed-drive walk of §2.2, and last a "choose folder" button whose answer is remembered.
- **One install is** a folder with `ConanSandbox.exe` and the Shipping exe. Show every install found with its CL, preselect the one that matches the newest
  build, and let the player switch.
- **The bounded walk:** fixed, ready drives; priority roots first; depth 4 at most; system folders and reparse points skipped; errors caught per folder;
  about 15 s in total; cancellable.
- **A minimal VDF reader** of about 40 lines with case-insensitive keys, escapes and comments, tested on the old and new samples and on a broken file.
  `LastOwner` is never logged.
- **The CL:** first read `FileVersionInfo.ProductVersion` of the real Shipping exe once (one read-only check). If it carries `++exiles+release-CL-…`, that is
  the 6 ms path; otherwise use the UTF-16LE byte scan (about 1 s per 220 MB, measured). Cache the CL by path, size and modification time.
- **Every build release states its game CL** in a machine-readable form: a marker line in the release body, which the list call already returns at no
  extra cost, plus `launcher.gameCL` in `modpack.json`. The launcher takes the newest build release whose CL equals the installed one. With no such release,
  it names the game version the newest build needs.
- **One feed call per start:** cache the list body and its time in settings, skip the call when the cache is under 10 minutes old, and on 403/429 use the
  cache and show the time from `x-ratelimit-reset`. Do not count on an ETag to save the limit (an unauthenticated 304 still costs one request, measured).
  A feed asset behind `releases/latest/download/` stays the quota-free fallback.
- **Downloads** start every attempt from `browser_download_url`; the signed CDN link lives about an hour. Range resume through the redirect is confirmed on
  .NET Framework. Keep the size and `digest` sha256 checks; `If-Range` is optional.
- **Parts already next to the launcher:** count them by size, verify the sha256 of full-size parts before skipping them, and remember the result by name,
  size and modification time, so a restart does not rehash 13 GB. Hashing ran at 821 MB/s with `SHA256.Create()` (`SHA256Managed`) and 924 MB/s with
  `SHA256Cng` on a warm 230 MB file, so the disk sets the pace.
- **Progress line:** amount over all parts, speed smoothed over about 5 s or by EMA 0.3, ETA refreshed at most once a second, "stalled" after 5 s,
  elapsed time of this session, resumed bytes left out of the speed.
- **Test stand:** a fake Steam root and libraries in a stand folder, chosen through an environment override like `KRINIK_LAUNCHER_FEED`. Never the owner's
  registry or folders. The local `test/feed.mjs` serves 302, 206, 403/429 and a stall.
