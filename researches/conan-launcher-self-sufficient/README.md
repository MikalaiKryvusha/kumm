# Research — the self-sufficient Conan launcher: finding the game, reading its version, matching a release

> **Created:** 2026-11-18 · for epic 57 phase 1 (`plans/57_EPIC_conan_launcher_self_sufficient.md`)
> **Parent:** the owner's words 2026-11-18 08:18–08:22 (`PROJECT_HISTORY.md` entry 2026-11-18 08:11)
> **Status:** 🔬 started 2026-11-18 08:3x — local facts collected; the web part (Steam library layout, other stores, GitHub API limits) is open
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

## 2. Open questions for the web part (the fourth door: practice of others, not my reasoning)

1. Where Steam keeps its libraries on every drive (`libraryfolders.vdf`, the registry key of the Steam path) and how a game's folder and build id are read
   from `appmanifest_440900.acf`.
2. Which other stores and standard folders a Windows game lands in (Epic, Program Files, `X:\Games`, `X:\SteamLibrary`), and how launchers of other mod packs
   find a game (Vortex, Mod Organizer 2, Thunderstore / r2modman game detection).
3. GitHub API: unauthenticated rate limit for the releases list and asset downloads, and how resumable downloads of release assets behave (Range requests).
4. Reading a version from a 200 MB exe fast: stream search for the UTF-16 marker vs the PE version resource.
