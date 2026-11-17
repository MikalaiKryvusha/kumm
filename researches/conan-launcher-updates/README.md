# Research — the Krinik Conan launcher: «what's new» links, update notices, self-update and build update

> **Created:** 2026-11-17 · for plan 54 (the owner's task of 2026-11-17 14:40 +03:00) · **Parent:** `ideas/23_conan_build_versions_and_launcher_update_check.md`
> (approved 2026-10-31, interview 028 Q3 = A) · **Status:** 🔬 recon observed 2026-11-17 14:4x; every fact below was read from the live source named beside it
> · **Outbound:** —

## 1. The feed — GitHub Releases of the public repo

Observed 2026-11-17 14:4x by `gh api repos/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/releases`:

- One release so far: tag `v0.9.0`, name «Krinik Mod Pack 0.9.0 — Conan Exiles Enhanced 3.0.1», `draft` false, `prerelease` false, `html_url`
  `…/releases/tag/v0.9.0`.
- Its assets: `Krinik-Conan-3.0.1-guide.pdf` and the build as `Krinik_Mod_Pack_0_9_0.zip.001` … `.007` (six × 1 992 294 400 B + 1 333 200 694 B ≈ 13.3 GB).
  **Every asset carries `digest: "sha256:<hex>"`** — the launcher can verify each download by SHA-256 with no file of its own beside the release.
- The parts are a 7-Zip zip split (`7z a -tzip -mx0 -v…`, `_config/release/make_volumes.sh`): «a 7-Zip zip volume is a plain byte cut of one zip» (the
  script's header; proven 2026-11-03 by re-splitting with `split` and `7z t`). So the concatenation of the parts in order IS one zip (Zip64: over 4 GB),
  stored without compression; the zip holds one top folder named like the parts' stem (`Krinik_Mod_Pack_0_9_0/`).
- `gh release create … --latest=false` publishes a release without marking it «Latest» (`gh release create --help`, gh 2.95.0) — the page
  `…/releases/latest` then keeps pointing at the newest BUILD release while launcher releases live in the same repo.
- Anonymous REST calls: 60 per hour per IP (GitHub REST docs, «Rate limits for the REST API»); GitHub rejects a request without `User-Agent` (same docs,
  «User agent required»). One `GET /repos/{owner}/{repo}/releases?per_page=30` per launcher start is far inside the limit.

## 2. The game's release notes — Steam

Observed 2026-11-17 14:4x by one anonymous call `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=440900&count=40&feeds=steam_community_announcements`
(Conan Exiles Enhanced is Steam app 440900):

| Game version | Steam announcement | gid |
|---|---|---|
| 3.0.1 | «October Hotfix 3.0.1» (2026-10-08, tag `patchnotes`) | 1846018067929785 |
| 3.1.0 | «Legacy of the Giant-Kings: Part Three – Live Now!» (2026-11-12, no `patchnotes` tag) | 1849192144183299 |
| 3.1.1 | «November Hotfix 3.1.1» (2026-11-14), rolled back to 3.1.0 the next day and «(Re-release) November Hotfix 3.1.1» (2026-11-15) | 1849458702684414 · 1849458702686207 |

- The human page of an announcement is `https://store.steampowered.com/news/app/440900/view/<gid>`; the HTML is filled by script (a plain GET returns
  the hub's generic title «Conan Exiles Enhanced - Steam News Hub») — whether the page shows the right post is checked in a real browser (plan 54, case W2).
- **Finding for plan 53:** the game has a hotfix 3.1.1 (2026-11-14, re-released 2026-11-15) after the 3.1.0 the build moved to on 2026-11-13.

## 3. .NET Framework 4.x facts the launcher depends on

The launcher is compiled by `csc` against `C:\Windows\Microsoft.NET\Framework64\v4.0.30319` with no `TargetFrameworkAttribute` (`build-docs.py`).

- **TLS:** an assembly without a target-framework attribute runs with the .NET 4.0 defaults, where `ServicePointManager.SecurityProtocol` does not
  include TLS 1.2 (Microsoft, «Transport Layer Security (TLS) best practices with the .NET Framework»); GitHub serves TLS 1.2+ only. The launcher sets
  `SecurityProtocolType.Tls12` itself. Checked by observation in plan 54 (case F1 against the real API).
- **JSON:** `System.Web.Script.Serialization.JavaScriptSerializer` (`System.Web.Extensions.dll`, in the full Framework of every Windows 10/11).
- **Zip64:** `System.IO.Compression.ZipArchive` (4.5+) reads Zip64 archives; it needs a seekable stream — the parts are read through one read-only
  stream that concatenates them (no 13 GB joined copy on disk).
- **Replacing a running exe:** Windows refuses to delete or overwrite a running image but allows RENAMING it (`MoveFileEx` on the same volume) — the
  self-updaters' standard move: running `X.exe` → `X.exe.old`, the downloaded file → `X.exe`, start the new one, exit; the new one deletes `X.exe.old`.

## 4. Where the launcher lives and what it can read at run time

From `Deploy-ModPack.ps1` (`Export-Bundle`, `Write-BundleInstaller`) and `KrinikConanLauncher.cs`:

- The bundle root (the unpacked archive) holds `KrinikConanLauncher.exe` (manifest `extras`), `install.cmd`, `install.ps1`, `Deploy-ModPack.ps1`, the guide
  PDF and `pack\modpack.json` (the build's manifest with `packVersion`). The desktop shortcut (`install.ps1`) points at the launcher in the BUNDLE root.
- «Installed» = the uninstaller `uninstall_krinik_build.cmd` in the game root (the launcher's own test, interview 028 Q2).
- The launcher bakes `BuildInfo.PackVersion` at compile time. After a self-update the exe would show the version it was compiled with, not the build it
  sits beside — so the build's version is read at run time from `pack\modpack.json` next to the exe (baked value only as a fallback).
