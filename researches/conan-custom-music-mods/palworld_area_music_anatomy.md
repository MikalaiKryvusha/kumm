# Research — anatomy of Palworld «Area specific background Music» (Nexus palworld/4679), the base of KrinikConanMusic

> **Created:** 2026-11-06 · on the owner's word «KrinikConanMusic - можно взять за основу наработки мода по Palworld и для нас его переделать» (17:25)
> **Parent:** `researches/conan-custom-music-mods/README.md` · idea 25
> **Status:** read 2026-11-06 17:31 +03:00 — file 22713 v0.9.3 (2026-08-19), downloaded once by `node kumm.mjs get 4679 22713 --game palworld` into the session scratchpad; nothing installed
> **Outbound:** — (feeds `plans/46_conan_krinik_music.md`)

## What is in the archive

| Part | What it is |
|---|---|
| `scripts/main.lua` (2 215 lines), `polygons.lua` (740 KB, hand-flown area polygons), `ui_helpers.lua` | The **detector**: decides the scene and writes it to `State/state.json`. Comments in German. |
| `dlls/main.dll` (3.2 MB, `PalworldAreaMusicNative`) | The **player**: a UE4SS C++ mod (`RC::CppUserModBase`, imports `UE4SS.dll`), a **Debug** build of the author's `PalworldModding` tree; audio by **miniaudio** (WASAPI/DirectSound), Vorbis (Xiph libVorbis 1.3.7) and Opus decoders built in, R128 gain tags read. No game class names inside — it knows only `state.json` and the folders. **No source in the archive.** |
| `music/<Area>/`, `ambience/<Area> Ambience/`, `battle/<Type>/<Area>/` | Empty folders with `placeholder.txt`; battle folders carry `battle_music_enabled.txt` (1/0). `music/track_gains.txt` — `File.mp3|0.5` per track. |
| `AreaMap.html`, `README_EN.txt`, `README_DE.txt` | A map of the areas; the user manual (one README for the whole mod — not per folder). |

## The protocol between detector and player — `state.json`

Written by Lua through a temp file + rename (the player may read mid-write), into a sibling `State/` folder — never into `scripts/` (UE4SS hot-reloads that folder; a file
rewritten every second there reloads the mod endlessly). Fields:

`{"category":"…","categoryFallback":"…","combatActive":bool,"worldReady":bool,"volume":0.000,"ambientVolume":0.000,"battleType":"…","battleVolume":0.000,"battleMusicEnabled":bool}`

- `volume` = game master × game music slider × the mod's own factor — the player follows the in-game sliders through Lua.
- Folder resolution with fallbacks, in the player: `battle/<Type>/<Area>` → `battle/<Type>/Standard Battle Music` → `battle/Standard`; nothing → the game's own
  music keeps playing. Areas: specific folder → one of three generic folders.
- A random track per entry; crossfade on scene change; a **grace period** (~60 s): a scene left and re-entered within it resumes, not restarts (no restart storms on borders and short fights).

## How the detector knows the scene (Palworld-specific — NOT portable)

- Area: the player's position, polled every 1 000 ms (`LoopAsync`), point-in-polygon over hand-flown polygons.
- Combat: hooks on the game's own events — `PalPlayerCharacter:OnChangeBattleBGM` (the game's battle-music rank) and `OnChangeNearEnemy_ToAll`; raids —
  `PalGroupGuildBase:OnRep_UnderRaidBaseCampIds`.
- Muting the game's music while ours plays: the game's own switch `PalAudioWorldSubsystem:SetDsiableBattleBGM(bool)`.
- Settings page in the ESC menu (its own widget work).

## What carries over to Conan and what does not

| Carries over (the design) | Does not (Palworld-only or unfit) |
|---|---|
| Detector in Lua → `state.json` → a player outside the game thread | Their `main.dll`: no source, a Debug build against another UE4SS tree (Conan runs UE4SS v3.0.1 Beta, SHA 83330635 — a C++ mod's ABI is tied to the UE4SS build), redistribution not granted in the archive |
| Folders per scene + fallback chain + `*_enabled.txt` switches + `track_gains.txt` | The polygons and the position polling (Conan's own music system already knows the area and the fight — hook it instead; HOUSE_RULES rule 7: events, not timers) |
| Random track, crossfade, grace period, follow the game's volume sliders | Their German folder names with spaces (our rule: English letters, digits, underscores) |
| Temp-file + rename write, `State/` outside `scripts/` | One README for all — the owner wants a README.md IN EACH folder |

## Our player — the carrier decision

FORK: options <their DLL as-is | our own UE4SS C++ mod | our own small player process started by the Lua mod> · price of error <a crash on a UE4SS mismatch; a binary we may not ship; a build we cannot reproduce> · consulted <this archive (Lua → state.json → native player); M4 Music for Palworld (github m4ur1tz1us/M4-Music: the player is an EXTERNAL process launched by the mod, «no codec libraries»); the Subnautica 2 jukebox (native DLL); building a UE4SS C++ mod needs the RE-UE4SS tree whose UEPseudo submodule is gated behind an Epic-linked GitHub account>

`[AI]` Chosen: **our own player process** — a small C program on miniaudio (single header, public domain / MIT-0; MP3, FLAC, WAV built in) + stb_vorbis (OGG), built by the MSVC 14.44 on this machine with one command; it reads `state.json`, plays and crossfades, and exits when the game process ends. No UE4SS ABI, no game-thread cost (decoding runs in another process — the 1 ms CPU budget is untouched), the source and the build script ship with the mod (Nexus quarantine asks for exactly that).
