# Mod notes — KrinikConanMusic (ours: the player's own music in folders by game scene)

> **Created:** 2026-11-06 · **Parent:** `plans/46_conan_krinik_music.md`; `[OWNER]` 2026-11-06 17:25 «да, я хотел бы мод музыки» (verbatim — idea 25)
> **Status:** 🔧 0.1.0 in the game (dev-only, `export: false`) since 2026-11-06 19:20 +03:00: places and combat work with test tones; cost spikes and death/Purge/menu open
> **Outbound:** the folder list → the owner with the first build

**What it is.** A UE4SS Lua mod + a small native player program. The Lua half learns the scene from the game's own music system (stage rows, combat tier,
death, the Purge, the menu) and writes `State/state.json`; the player `player/krinik_music_player.exe` plays a random track of the scene's folder with a
crossfade and a 60 s grace period, outside the game process. Design taken from Palworld «Area specific background Music» (Nexus 4679) — anatomy in
`researches/conan-custom-music-mods/palworld_area_music_anatomy.md`.

## Where things are

- Source `ConanExiles/_unpacked/KrinikConanMusic/` → game `ConanSandbox/Binaries/Win64/ue4ss/Mods/KrinikConanMusic`.
- `Scripts/main.lua` — the detector. `player/src/krinik_music_player.c` + `player/vendor/` (miniaudio 0.11.26 + stb_vorbis 1.22, public domain / MIT-0,
  `LICENSE_miniaudio.txt`) + `player/build_player.cmd` (MSVC 14.44) → `player/krinik_music_player.exe`.
- `music/<scene>/` — the player's folders, each with a Russian `README.md`; `music/track_gains.txt`; optional `music/<scene>/playlist.txt`.
- `State/` — `state.json` (Lua → player), `player.json` (player → Lua: playing, folder, title, inventory), `player.log`. Outside `Scripts/`: UE4SS reloads a
  mod whose `Scripts/` changes (Palworld's lesson).

## The game's music system (read 2026-11-06)

- Stages: native `AConanSoundStage` (`/Script/ConanSandbox.ConanSoundStage`; UFunctions `RegisterSound`, `HandleSFXMuteStateChange`; Python-visible
  `audio_components`, `audio_info`; struct `SoundStageInfo` {group, priority, fade_volume, remaining_delay, remaining_fade, state}, `SoundStageAudioDesc`);
  base `/Script/UE4Dreamworld.SoundStage` (`GetActiveAudioVolumeTags`); the current stage — `/Script/UE4Dreamworld.DWGameState:GetSoundStage`. Rows —
  `SoundStageAudioTable` (group 0 = music, 102 rows; mods add theirs: Caverns of Set 11, Ymir's Respite 6). Full list — `researches/conan-custom-music-mods/conan_music_system.md`.
- Combat: `/Game/Characters/BP_AC_AudioController` references `CombatMusicTable` (tiers VeryEasy, Easy, Normal, Hard, VeryHard, Boss, Avatar).
- Death: `Music_death_Cue` ← `/Game/Systems/FunCombat_PlayerController`. Purge: `music_Purge_loop_Cue` ← `/Game/Characters/BasePlayerChar`,
  native `ConanCharacter:OnPurgeMusicRequested`. Menu: `GUIModuleController:PlayMusic` / `StopMusic`; `Music_Startup` ← `BP_UIResourceSingleton`;
  `Remaster/Night_Time` is a part of `Music_Startup` (the menu theme), NOT a night-time scene. Music volume: `SettingsAudioBase:MusicVolumeChanged`.
- Sound classes: `Music` (parent of MusicCombat, MusicDeath, MusicMenu, MusicPurge, Soundstage_2d_Music …); the mix `Music_MuteMusic_BG_and_Combat` exists.
- Source of these facts: the Dev Kit probe `ConanExiles/_config/devkit/kit-probe-music.py` → `kit-probe-music.json` (functions by reflection, referencers by the
  asset registry) — re-run it after a game update.

## Read live 2026-11-06 (cases `testcases/TC_conan_music_recon_2026-11-06.md`)

- The stage actor: ONE `BP_SoundStage_C` in the level; `AudioComponents[1..2]` = the music group, `[3..7]` ambience; `AudioInfo[i].State`: 0 silent,
  1 fading in, 2 playing; the playing cue — `AudioComponents[i].Sound:GetFName()`. At the oasis by the boss the game plays `Music_Area_Riverland`, at the
  save spot (15516, 133000) `Music_Area_Middle`; the cue changes only when the hero crosses into another area.
- Combat: `BP_AC_AudioController_C` (a component of `BasePlayerChar_C`) has `AudioComp1`, `AudioComp2`, `AudioCompTransition`, `AggroList` (array),
  `PlayingCombatMusicThreatLevel` (byte). **The level is the tier of the LAST combat track and is never reset** — «in combat» is `#AggroList > 0`
  (1 next to the oasis boss, 0 at 150 m). Seen tiers: 1 and 2 at the oasis boss (`HumanoidNPCCharacter_20percentbigger_boss_C`, ≈ −79313, 242099).
- Muting works by `SoundClass.Properties.Volume` at runtime (proven on `Soundstage_2d_Env`: game peak 0.025 → 0.000 → 0.022).
- Cost: a reflected property read ≈ 0.03 ms; the mod alternates the place read and the combat read by second; steady 4 ms per minute.
- Stand: god mode by `god-on.sh` (retry if «FAILED» right after the world entry); combat — `tp_ground.sh -79368 241524`; out of combat — `tp_ground.sh 15516 133000`.

## Pitfalls to keep

- The player's tracks live in the GAME folder: a redeploy of the mod must never delete files inside `music/` (as the camera's `config.lua`).
- Never call native music functions with objects they were not built for (EXP-0464); hook and read.

## Open

- Scene-change spikes 2–3 ms — FIXED 2026-11-06 19:22 run: the change is spread over seconds (decide · write state · read folders), one log line per call;
  every minute's worst call ≤ 1 ms (the os.clock quantum), 5–12 ms per minute. Still owed: the A-B-A flight (HOUSE_RULES rule 7).
- Death, the Purge, the menu — not detected yet (the classes are known: MusicDeath, MusicPurge, MusicMenu).
- The game's music slider is not followed yet (volume comes from the mod's `config.lua`).
- Whether the start from Lua flashes a console window — filmed only after the fact.
- Test tones `music/explore_desert/test_tone_desert_220.wav` and `music/combat/test_tone_combat_330.wav` sit in the GAME folder (not the pack) — remove after the tests.
