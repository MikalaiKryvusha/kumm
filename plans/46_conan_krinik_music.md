# Plan 46 — KrinikConanMusic: the player's own music in folders by game scene

> **Created:** 2026-11-06 · on the owner's word `[OWNER]` 2026-11-06 17:25 «да, я хотел бы мод музыки» · «KrinikConanMusic - можно взять за основу наработки мода
> по Palworld и для нас его переделать» · «Поставляться в сборке он будет с пустыми папками, в которых будут лежить README.md, с описание, за какие сцены
> отвечает текущая папка, какие треки в неё пользователю закидывать» (verbatim — `ideas/25_conan_krinik_music_user_folders.md`)
> **Parent:** idea 25; recon `researches/conan-custom-music-mods/README.md` + `palworld_area_music_anatomy.md` + `conan_music_system.md`
> **Status:** 🔧 started 2026-11-06 17:37 +03:00; phase 1 (recon) — offline part done (the game's scenes from its own tables), the live part next
> **Outbound:** the folder list (the scenes the player sees) → the owner with the first build of the mod

## Goal vector (Achieve)

The player of the build hears their own music in the game's own scenes: they drop mp3/ogg/flac/wav files into a scene folder of `KrinikConanMusic`, and in that
scene the game's music gives way to a random track from the folder, with a smooth crossfade; an empty folder leaves the game's own music playing.

## Acceptance criteria

1. **Situation.** `music/explore_desert/` holds two mp3 tracks; the hero walks out of the Riverlands into the desert. **Action.** The game starts its desert stage.
   **Result.** One of the two tracks fades in within 5 s; the game's own desert music is not heard. **Check.** `KrinikConanMusic.log` line «scene explore_desert → <file>»
   and an audio capture of the game process with the game's music class muted.
2. **Situation.** `combat_hard/` empty, `combat/` holds one track. **Action.** A hard enemy aggroes. **Result.** The `combat/` track plays (the fallback chain); the
   area track resumes after the fight from where it was if back within the grace period. **Check.** log lines «combat_hard empty → combat», «resume explore_…».
3. **Situation.** Every scene folder empty. **Action.** One hour of play. **Result.** The game sounds exactly as without the mod. **Check.** no «mute» line in the log.
4. **Situation.** The shipped build, freshly installed. **Action.** The player opens `KrinikConanMusic\music\`. **Result.** One folder per scene, each with a Russian
   `README.md`: the scenes it plays and what tracks fit; no other files. **Check.** `python <generator> --verify` — folder set = scene table, every README present.
5. **CPU (HOUSE_RULES rule 7, MASTER_PLAN 1 ms).** A-B-A fly-through: median `MsCPUBusy` and stutters with the mod no worse than without; the mod's own Lua
   handlers' sum per minute in its log. Decoding happens outside the game process.
6. **The player follows the game.** The game's music slider at 0 → our music silent; game closed → the player process gone within 3 s.

## Phases

1. **Recon** — offline: the game's music scenes from its own tables (DONE 2026-11-06 17:37 +03:00, `researches/conan-custom-music-mods/conan_music_system.md`); live, by the
   remote (cases `testcases/TC_conan_music_recon_2026-11-06.md`): the functions of `AConanSoundStage` and of whatever plays `CombatMusicTable`, the event that tells
   which stage row / combat tier starts, how death, the Purge and the menu start, and how to silence the game's music (the `Music` sound class / a sound mix).
2. **The player** — `krinik_music_player.exe`: C on miniaudio + stb_vorbis, built by `build_player.cmd` (MSVC 14.44); reads `State/state.json`; random track,
   crossfade, grace period, volume from the state; exits when the game process ends. Source and build script ship with the mod.
3. **The detector** — `KrinikConanMusic/scripts/main.lua`: the game's events → scene → folder by the fallback chain → `state.json` (temp file + rename, `State/`
   outside `scripts/`); mutes the game's music only while our folder for the scene has tracks; starts the player once per session.
4. **Folders and READMEs** — one scene table (the source of truth) → a generator writes the folder tree and each folder's Russian `README.md` (`--verify` for
   criterion 4).
5. **In the build** — `modpack.json` entry, the guide's line, the README mod list (our mods on top, HOUSE_RULES 19), the mod's notes
   `games/ConanExiles/mods/KrinikConanMusic.md`.
6. **Functional run** — the criteria above, a run report; the A-B-A measure.

## Groundwork for later (the owner's word 17:37, not in the first version)

`[OWNER]` 2026-11-06 17:37 «задел на будущее … идеи из UnliminiumTheDigaitalGame: 1) настройка плейлиста через настройку мода 2) виджет текущего заигравшего трека
поверх игры внизу слева в ХУД» (verbatim — idea 25). Reference: `D:/work/UnliminiumTheDigitalGame/design/flow-map-music/` (screens `mus-card-small`,
`mus-tab-hud-info`, …). What the first version does NOW so both land without a rework: the player writes `State/now_playing.json` (scene, file, title from the
tags or the file name, started-at) on every track start — the future HUD widget reads it; the folder resolution reads an optional per-scene playlist file
(`playlist.txt`: order / weights / excluded files) — the future settings page writes it.

## Phase 1, live part — steps

- [ ] 1. Machine lock; `launch-bg.ps1`; world entry by the remote.
- [ ] 2. `funcs ConanSoundStage`, `funcs BP_SoundStage_C`; `dump SoundStage` — the live stages and their fields.
- [ ] 3. Find the combat-music owner: `dump CombatMusic`, `funcs` of the player controller / character for «Music».
- [ ] 4. Hook candidates by a probe (log only, no calls into native internals — EXP-0464): which function fires on a stage change and on a combat tier change.
- [ ] 5. Mute test: the `Music` sound class volume to 0 by a sound-mix override — the game's music gone, other sounds stay.
- [ ] 6. Write the findings into the game map (`GAME_ARCHITECTURE_INTERNAL_MAP.md` → «Music») and the recon doc; close the game, release the lock.
