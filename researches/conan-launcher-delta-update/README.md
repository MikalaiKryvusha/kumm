# Research — the launcher's delta update: download only what changed
> **Created:** 2026-11-21 · on the owner's words 2026-11-21 00:28–00:30 («для такого мелко обновления нужно все 13 гигов перекачивать?????? что за бред» · «нужно делать умную систему» · «гугли как такое делают»)
> **Parent:** the RC1 → RC2 update test (KUMM testcases/reports/2026-11-21_conan-launcher-update-rc1-rc2.md)
> **Status:** recon written 2026-11-21 00:45; step 0 DONE 2026-11-21 10:4x — the cause of §1's re-ordering is repak_cli 0.2.3 packing on rayon threads (one
> folder packed three times → three SHA-256, `RAYON_NUM_THREADS=1` → one), fixed by `ConanExiles/_config/devkit/repak_tool.py` (pack `23e9015`); step 1 (the
> manifest, `ConanExiles/_config/release/make_manifest.py`) built and run — KUMM `testcases/reports/2026-11-21_conan-reproducible-export.md`
> **Outbound:** a plan step in the launcher epic (KUMM plans/57) and a GitHub issue

## 1. The problem in numbers

Observed 2026-11-21 00:3x–00:43 (UTC+3), read-only, on the two unpacked bundles of the update test
(`KUMM/.work/rc1_install/Conan_311/Krinik_Mod_Pack_0_9_1_RC1` and `…_RC2`) with `find`, `stat`, `cmp`, `repak list`.

- **Today's release:** one stored zip (`7z -tzip -mx0`) cut into 7 volumes ≈ 13.7 GB; an update downloads and unpacks all of it. RC1 → RC2 cost
  12.8 GB, 00:00–00:22 at ≈ 11.6 MB/s (parent report, run 6).
- **The bundle:** 188 files, 13.72 GB — 118 files under 1 MB (10.6 MB together), 55 of 1–100 MB (0.66 GB), 9 of 100 MB–1 GiB (3.32 GB), 6 over 1 GiB
  (9.74 GB). The largest, `pack/src/Shemite_City_State/Shemite_City_State.pak`, is 2 396 312 301 B — **over GitHub's 2 GiB per-asset cap** (§3).
- **What RC2 really changed (content):** 12 files, 37.3 MB new size together — `KrinikConanUI.pak` 12.7 MB, the guide PDF 16.8 MB, the launcher exe
  5.7 MB, `KrinikConanGraphics.pak` 1.3 MB, `KrinikConanArchery.pak` 0.4 MB, `pack/modpack.json`, three Lua scripts, `Input.ini`, `README.txt` and the
  launcher's own marker `pack/.krinik_unpacked`. 114 files byte-equal, 0 added, 0 removed.
- **What RC2 changed (bytes) — the finding:** the other **62 third-party paks (13.56 GB) are byte-different at the same size.** Their entry lists are
  equal (`repak list`, sorted, same MD5 for `Emberlight.pak`), but the physical order differs: in `Emberlight.pak` (370 MB, repak V11, compression
  None, 11 entries) 1.77 M bytes differ in 5 runs — the first ≈ 0.9 MB, ≈ 1 MB at offset 2.8 MB, and the index/footer at the end: two entries swapped.
  The release export rewrites every mod wrapper pak (`ConanExiles/_config/devkit/set-pak-modinfo.py`: «Run on the release export (before the
  volumes)», repak V11), and the result is not byte-reproducible.
- **Consequence:** ANY file-level scheme would also have downloaded 13.6 GB for RC1 → RC2. Compared at fixed offsets, those 62 paks touch 164 blocks of
  1 MiB (164 MiB) or 925 blocks of 64 KiB (57 MiB). With a byte-reproducible build, a file-level update RC1 → RC2 is **37.3 MB instead of 12.8 GB**
  (≈ 340× less, ≈ 3–4 s at the observed 11.6 MB/s).

## 2. How others do it

### 2.1 Steam — SteamPipe depots ([Valve, Uploading to Steam](https://partner.steamgames.com/doc/sdk/uploading))
- «SteamPipe initially splits each file into roughly one megabyte (MB) chunks. Each chunk is then compressed and encrypted before being upload to the
  Steam content-delivery system.» Every depot build gets a manifest with a unique 64-bit manifest ID.
- On an update only chunks absent from the previous build are new, and «those new chunks are the only pieces a client must download».
- The client rebuilds a changed file beside the old one: «to update a 25 GB pack file, SteamPipe will always build a new, 25GB file» — a 10-byte change
  still costs a full local copy (disk IO, free space).
- Pack-file advice (section «Game Content Structure - Best Practices»): limit pack size («one or two gigabytes (GB) is sufficiently large»); keep changes
  local and the asset order stable («SteamPipe does not know about asset boundaries within a pack file»); one TOC near the start or end; avoid
  absolute byte offsets; no filenames or build timestamps inside; add new packs for new content instead of growing old ones; Steam compresses itself,
  so cross-asset compression «will spread out changes»; encryption «most likely unnecessary». The page does not forbid compression outright.
- Unreal: «Some versions of the Unreal Engine use asset "padding alignment" in the pack files which can have a very large impact on the size of
  SteamPipe updates»; the advice is `-patchpaddingalign=1048576 -blocksize=1048576`, so shifts land on Steam's 1 MB grid — i.e. a byte shift that is
  not a multiple of the chunk size defeats the chunk match.

### 2.2 itch.io — butler / wharf ([wharf docs](https://itch.io/docs/wharf/))
- Signature = the old container's layout + one hash pair per **64 kB block** of every file: a 4-byte rolling weak hash and an MD5 strong hash
  ([diff algorithm](https://itch.io/docs/wharf/algorithms/diff.html), [block size](https://itch.io/docs/wharf/appendix/block-size.html): «The larger
  the block size, the bigger diffs get»).
- Patch = rsync-like ops per new file: `BLOCK_RANGE` (reuse blocks of ANY old file — renames are free) and `DATA` (fresh bytes, flushed at 4 MB).
- Apply ([apply](https://itch.io/docs/wharf/algorithms/apply.html)): rebuild changed files in a **staging folder**, verify them against the signature,
  then merge; «no changes must be committed to the original directory» on a mismatch — «the staging folder can simply be erased».
- Optional backend pass `butler rediff` ([bsdiff](https://itch.io/docs/wharf/algorithms/bsdiff.html)) replaces a file's rsync ops with bsdiff when
  many small scattered changes waste whole 64 kB blocks; «bsdiff holds both files in memory, along with a suffix array», capped at 4 GiB per file.

### 2.3 zsync, casync, desync — rsync over plain HTTP
- zsync ([paper, ch. 2](https://zsync.moria.org.uk/paper/ch02.html), [home](http://zsync.moria.org.uk/)): the server publishes a precomputed
  `.zsync` control file (block weak checksums + «a strong checksum (currently MD4)»); «The server has no per-client calculations»; the client runs the
  rolling checksum over its local seed and pulls the rest with «HTTP Range requests». Look-inside-gzip support was removed in the latest release.
- casync ([Lennart Poettering](https://0pointer.net/blog/casync-a-tool-for-distributing-file-system-images.html)): content-defined chunking
  (buzhash, 64 K average), chunks stored as files named by SHA-256 (`.castr`), an index (`.caibx`/`.caidx`) listing them; delivery needs «only the
  most basic form of HTTP»; local seeds, with no history relation to the new image, supply the chunks already present.
- desync ([folbricht/desync](https://github.com/folbricht/desync)): casync-compatible in Go; a chunk store «is any static file host»; seeds,
  in-place extraction; Windows only a subset of commands.

### 2.4 Squirrel.Windows and Velopack — full + delta packages
- Squirrel ([delta packages](https://github.com/Squirrel/Squirrel.Windows/blob/develop/docs/using/delta-packages.md)): a delta nupkg holds a bsdiff
  `.diff` per changed file and a `.shasum` («a SHA1 of the expected resulting file and its filesize»); new files are copied whole. The client picks
  deltas only when their sum is smaller than the full package
  ([UpdateInfo.cs](https://raw.githubusercontent.com/Squirrel/Squirrel.Windows/develop/src/Squirrel/UpdateInfo.cs):
  `deltasSize < latestFull.Filesize && deltasSize > 0`), else the full one.
- Velopack ([deltas](https://docs.velopack.io/packaging/deltas)): «Delta packages use Zstandard to create binary patches of individual files»; no
  single file may exceed 2 GB (a Zstandard limit); an old client applies a CHAIN (1.0.0 → 1.0.1 → 1.0.2 → 1.0.3), a heuristic weighs the full size,
  the delta sum and the count; `MaximumDeltasBeforeFallback` defaults to 10 ([UpdateOptions](https://docs.velopack.io/reference/cs/Velopack/UpdateOptions));
  on GitHub Releases «any one GitHub release must only have 1 full package and 1 delta update». A failed reconstruction falls back to the full package.

### 2.5 Unreal Engine — patch paks, ChunkDownloader, Epic's chunk manifests
- Patch paks ([how to create a patch](https://dev.epicgames.com/documentation/en-us/unreal-engine/how-to-create-a-patch-in-unreal-engine)): the
  cooker compares against the kept release content (`-generatepatch -basedonreleaseversion=…`) and writes only changed assets into a new pak whose
  name ends `_p.pak`; both are mounted, the patch with priority. Storage grows with every patch; Epic leaves delivery to each platform.
- ChunkDownloader ([hosting a manifest](https://dev.epicgames.com/documentation/en-us/unreal-engine/hosting-a-manifest-and-assets-for-chunkdownloader-in-unreal-engine)):
  a plain-text `BuildManifest-<platform>.txt` (`$NUM_ENTRIES`, `$BUILD_ID`, then per file: name, size, version string, chunk id, relative URL) on a
  static CDN; it downloads **whole pak files** — Epic's own runtime downloader is file-level.
- Epic BuildPatchServices ([API](https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/BuildPatchServices)): chunk manifests,
  `OptimiseChunkDelta` produces extra delta data for a manifest pair, feature level `VariableSizeChunks`. The store's tool itself is not documented
  publicly in detail.
- Inside a pak ([rust-u4pak notes](https://github.com/panzi/rust-u4pak)): data records, then the index, then the footer; «you need to read the footer
  first», the index holds offsets of the records; records carry a SHA-1. When one asset changes size, every later record shifts and the index is
  rewritten: a fixed-grid chunker (Steam) loses the tail, a rolling-hash differ (wharf, zsync, casync) re-finds it. Our wrappers are V11,
  uncompressed outer pak (§1) — friendly to block deltas, but only if the order is stable.

### 2.6 Battle.net — CASC / TACT (short note)
Local storage is content-addressed: files are found by key (truncated MD5), index journals map keys to archive offsets
([CASC](https://wowdev.wiki/CASC)); the CDN side maps content keys to encoding keys, packs small files into archives with indexes and fetches
fragments by offset with partial HTTP requests ([TACT](https://wowdev.wiki/TACT)). Same pattern as §2.3, at Blizzard's scale.

### 2.7 The common thread
Every system is: **a manifest of content hashes → fetch only what the local copy lacks → verify by hash → commit atomically.** They differ only in the
unit: whole file (ChunkDownloader, Squirrel's new files), fixed block (Steam), rolling block (wharf, zsync), content-defined chunk (casync, Epic).

## 3. GitHub Releases constraints

| Fact | Value | Source |
|---|---|---|
| Size per asset | «Each file included in a release must be under 2 GiB» (2 147 483 648 B) | [About releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases) |
| Assets per release | «Up to 1000 release assets may be associated with a single release» | same page |
| Total size, bandwidth | «There is no limit on the total size of a release, nor bandwidth usage» | same page |
| Asset hash | `digest: "sha256:<hex>"` on every asset uploaded since 2025-06-03; not backfilled (observed: `cli/cli` v2.40.0 of 2023 → `"digest": null`) | [changelog](https://github.blog/changelog/2025-06-03-releases-now-expose-digests-for-release-assets/) |
| Asset names | «GitHub renames asset filenames that have special characters…»; a duplicate name is an error | [Release assets API](https://docs.github.com/en/rest/releases/assets) |
| REST, anonymous | 60 requests/hour per IP; secondary: ≤ 100 concurrent requests | [REST rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api) |

Observed 2026-11-21 ≈ 00:30–00:40 (UTC+3) with `curl` on a public asset (`cli/cli` v2.40.0 `gh_2.40.0_windows_amd64.zip`, 10 747 825 B), nothing saved:
- `github.com/<owner>/<repo>/releases/download/<tag>/<name>` → `302` to **`release-assets.githubusercontent.com`** (older reports name
  `objects.githubusercontent.com`; the launcher must follow whatever host the 302 names), an Azure-blob signed URL with an expiry `se=` ≈ 1 hour after issue → a resume must re-ask github.com for a fresh URL.
- `Range: bytes=0-1023` → `206 Partial Content`, `Content-Range: bytes 0-1023/10747825`, `Accept-Ranges: bytes`, an `ETag`; `bytes=N-` → `206`;
  `If-Range: <ETag>` → `206`. **Multi-range `bytes=0-99,200-299` → `501 Unsupported client range`; suffix `bytes=-100` → `501`.**
- Three ranged downloads through `browser_download_url` left the anonymous REST budget unchanged (`core.used` 3 before and after): asset downloads do
  not spend the 60/hour.

## 4. Options for this launcher

| | **A** — per-file manifest, files as assets | **B** — patch per adjacent pair + full | **C** — zsync-style blocks over the volumes |
|---|---|---|---|
| Unit | whole file (small files grouped) | file-level or binary patch per pair | 64 KiB–1 MiB block, rolling hash |
| RC1 → RC2, measured (§1) | 37.3 MB once the build is reproducible; 13.6 GB as built today | the same as A for the pair (file-level); smaller if binary | ≈ 164 MiB + the real changes even with today's build (fixed-grid upper bound) |
| A 2 GB pak, one asset changed | the whole file (≤ 2.4 GB) | binary patch small, but zstd stops at 2 GB (Velopack), bsdiff needs RAM ≈ both files + suffix array (wharf) | only the changed blocks + the index |
| Update from ANY older version | yes: stateless — local hashes vs the target manifest | chain of patches (Velopack caps 10) or N² patches; else the full 13.7 GB | yes: any local seed |
| Fresh install | the same code with an empty inventory; resumable per file | full archive (today's path) | full volumes (today's path) |
| Resume / verify | per-file `Range: bytes=N-`; SHA-256 per file = the asset digest | per patch file; result hash per file | per block run; whole-file hash |
| GitHub fit | ≈ 75 assets (70 big files, 1 small-file group, 2 parts of Shemite, manifest) ≪ 1000; split > 2 GiB | 7 volumes + 1 patch per release | 7 volumes + 1 control file (≈ 13.7 GB / 64 KiB ≈ 210 k blocks ≈ 5 MB) |
| HTTP | 1 GET per changed file | 1 GET per patch | one GET per missing run (no multi-range: 501) |
| Launcher work | hash inventory, download, verify, stage, rename — no new algorithm | + a binary patcher in .NET 4 (native zstd or bsdiff) and a chain planner | + rolling checksum, block matcher, zip reassembly; scans all 13.7 GB local |
| Build work | byte-reproducible paks; hash; upload; manifest last | + a differ per pair, kept old builds | + control-file generator |
| Moving parts | fewest | patch chain, fallback logic | most |

## 5. Recommendation — option A, a per-file content manifest, with a reproducible build as step 0

**Why A.** It is ChunkDownloader's model with Steam's and wharf's verification discipline: least code, nothing but static GitHub assets, any old version
and a fresh install are one algorithm, resumable and verified per file. Its weak spot (a big pak with a small change costs the whole file) is rare in
this build — the paks that change between RCs are the Krinik ones (0.4–12.7 MB); a third-party mod is re-downloaded only when its author updates it.
C would absorb today's re-pack noise (a rolling hash re-finds moved entries) but costs the most code: a rolling matcher over 13.7 GB of local data and
one GET per missing run. It stays a later step for big files only, if the release history shows big paks changing often (then: a zsync-style control
per big file, ranges on that file's own asset).

**Step 0 (build side, required for A and for B).** The release export must be byte-reproducible: the same inputs → the same file bytes. Write the
wrapper's entries in a fixed (sorted) order and skip the rewrite when the fields are already right; the release ritual checks it by exporting twice
and comparing SHA-256 of every file, and by printing «changed vs the previous release: N files, X MB» before the upload.

**Manifest** — the asset `manifest.json`, uploaded LAST (it is the release's commit point):
```json
{ "format": 1, "version": "0.9.1-RC3", "tag": "v0.9.1-RC3", "root": "Krinik_Mod_Pack_0_9_1_RC3",
  "files": [
    { "path": "pack/src/KrinikConanUI/KrinikConanUI.pak", "size": 12710710, "sha256": "3f2a…", "asset": "3f2a9c1e5b7d0a44-KrinikConanUI.pak" },
    { "path": "pack/src/Shemite_City_State/Shemite_City_State.pak", "size": 2396312301, "sha256": "9b1c…",
      "parts": [ { "asset": "9b1c…-Shemite_City_State.pak.p1", "size": 2000000000, "sha256": "…" },
                 { "asset": "9b1c…-Shemite_City_State.pak.p2", "size": 396312301, "sha256": "…" } ] },
    { "path": "pack/src/KrinikConanUI/ue4ss/Scripts/krinik_hub_controller.lua", "size": 26524, "sha256": "…", "group": "small-5d0e….zip" } ],
  "groups": [ { "asset": "small-5d0e….zip", "size": 10600000, "sha256": "…" } ],
  "localOnly": [ "pack/.krinik_unpacked" ] }
```
- Asset name = 16 hex of the file's SHA-256 + its basename reduced to `[A-Za-z0-9._-]` (`Pickup+.pak` would be renamed by GitHub otherwise); the
  publisher reads the asset list back and checks every name and `digest` against the manifest before un-drafting.
- Files under 1 MB go into one stored zip group (118 files, 10.6 MB): a changed script costs ≤ 11 MB, the asset count stays ≈ 75.
- Files over 2 GiB are split into byte parts (each with its hash). Every release is self-contained (all its assets in itself) — the upload stays what
  it is today; an optional `tag` per entry (a blob living in an older release) would cut the upload later, at the price «old releases are never deleted».

**Launcher steps.**
1. *Discover:* 1 REST call for the releases (as today); download `manifest.json` and check it against its asset `digest`. No manifest → the release is
   volumes-only → today's path.
2. *Inventory:* hash the files of every Krinik bundle folder beside the game (any old version, plus the staging folder of an interrupted run) into a map
   SHA-256 → local path; cache (path, size, mtime → hash) in the launcher's state so a second run does not re-read 13.7 GB; use the CNG hash
   (`SHA256Cng` / `SHA256CryptoServiceProvider`), not `SHA256Managed` — measure the speed on the player's path.
3. *Plan:* each manifest file found in the map by hash → hardlink (same NTFS volume) or copy into `<root>.staging`; the rest → the download list. The
   confirmation box shows the real sum («Скачать 37 МБ») and the free space the plan needs.
4. *Download:* each asset to `staging/.dl/<asset>.part`; resume with `Range: bytes=N-` after re-asking github.com for the redirect; at most 2–4 in
   parallel; verify each blob's SHA-256; unzip the group, join the parts.
5. *Verify:* the whole staging tree equals the manifest (every path, size, SHA-256; no extra files except `localOnly`).
6. *Apply:* rename `<root>.staging` → `<root>` (one rename on the same volume), then run the bundle's installer exactly as today.
7. *Rollback:* until the installer reports success the old bundle stays untouched; on failure the old bundle's installer restores the old build; the
   «delete the previous bundle» offer comes only after success. A crash at any step leaves either the old bundle or a resumable staging folder.

**Transition.** The RC1/RC2 launchers understand only volumes: either publish the volumes beside the files until the manifest-aware launcher has
self-updated (plan 54 step 2.1 already swaps the exe by digest), or make the next release's launcher arrive first through that self-update.

## 6. Risks (Murphy, tiered)

**Tier 1 — kills the gain or breaks the install**
1. *The build is not reproducible* (observed now: 62 paks re-ordered) → every update is 13.6 GB again, silently. Guard: step 0's export-twice check and
   the «changed vs previous» line in the ritual; a publish whose changed bytes exceed the expected set stops.
2. *A half-applied update* (crash, power, antivirus lock) → a mixed bundle. Guard: staging + verify-all + one rename; the old bundle is kept until the
   installer's success.
3. *A dirty or missing delta base* (the old bundle deleted, a file edited or quarantined) → hashes differ → those files are simply downloaded again;
   seeds come only from bundle trees, never from the game's player-owned files (`Saved/Config`), so no player setting becomes a «source».

**Tier 2 — fails for some players**
4. *Old launchers* see no volumes if the release drops them → keep the volumes during the transition (double upload) or self-update first.
5. *The signed redirect expires (≈ 1 h) and multi/suffix ranges return 501* → re-resolve per resume, use only `bytes=N-` / `bytes=a-b`.
6. *Asset limits:* 2 GiB per asset (Shemite is 2.23 GiB → parts), 1000 per release (→ the small-file group), renamed names (→ sanitized names checked
   after upload).
7. *Hashing time and disk:* 13.7 GB of SHA-256 on a slow disk takes minutes → the hash cache; hardlinks need NTFS on one volume, else a copy needs up to
   13.7 GB free → the box counts the plan's real need.

**Tier 3 — rare**
8. A big third-party pak updated by its author costs the whole file (up to 2.4 GB) — accepted; block deltas for big files only if the history repeats it.
9. Old assets without an API `digest` (not backfilled) → the manifest's own SHA-256 is the truth; the manifest itself is checked by its digest.
10. The 16-hex prefix in an asset name collides → names only; every check uses the full SHA-256.

## Sources

- Valve, Uploading to Steam (SteamPipe) — https://partner.steamgames.com/doc/sdk/uploading
- itch.io wharf: overview https://itch.io/docs/wharf/ · diff https://itch.io/docs/wharf/algorithms/diff.html · apply
  https://itch.io/docs/wharf/algorithms/apply.html · bsdiff https://itch.io/docs/wharf/algorithms/bsdiff.html · block size
  https://itch.io/docs/wharf/appendix/block-size.html
- zsync: http://zsync.moria.org.uk/ · https://zsync.moria.org.uk/paper/ch02.html
- casync: https://0pointer.net/blog/casync-a-tool-for-distributing-file-system-images.html · desync: https://github.com/folbricht/desync
- Squirrel.Windows: https://github.com/Squirrel/Squirrel.Windows/blob/develop/docs/using/delta-packages.md ·
  https://raw.githubusercontent.com/Squirrel/Squirrel.Windows/develop/src/Squirrel/UpdateInfo.cs
- Velopack: https://docs.velopack.io/packaging/deltas · https://docs.velopack.io/reference/cs/Velopack/UpdateOptions
- Unreal Engine: https://dev.epicgames.com/documentation/en-us/unreal-engine/how-to-create-a-patch-in-unreal-engine ·
  https://dev.epicgames.com/documentation/en-us/unreal-engine/hosting-a-manifest-and-assets-for-chunkdownloader-in-unreal-engine ·
  https://dev.epicgames.com/documentation/unreal-engine/API/Runtime/BuildPatchServices · pak layout https://github.com/panzi/rust-u4pak
- CASC / TACT: https://wowdev.wiki/CASC · https://wowdev.wiki/TACT
- GitHub: https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases ·
  https://docs.github.com/en/rest/releases/assets · https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api ·
  https://github.blog/changelog/2025-06-03-releases-now-expose-digests-for-release-assets/
- Local observations: the two bundles under `KUMM/.work/rc1_install/Conan_311/` (§1); `curl` probes of `cli/cli` v2.40.0 assets (§3).
