# Research — how Conan Exiles 3.0.1 plays its music (for KrinikConanMusic)

> **Created:** 2026-11-06 · for plan 46 (the owner's order «да, я хотел бы мод музыки», 17:25)
> **Parent:** `researches/conan-custom-music-mods/README.md` (web recon) · `palworld_area_music_anatomy.md`
> **Status:** offline part read 2026-11-06 17:37 +03:00 from the game's own containers (`_paksview-3.0.1`, `pakchunk*-Windows.utoc`); the live part (functions, events, mute) — plan 46
> phase 1, cases `testcases/TC_conan_music_recon_2026-11-06.md`
> **Outbound:** the scene list → the folder table of the mod (plan 46 phase 4)

## How it was read (re-runnable)

- Asset paths: `retoc-5.8/retoc.exe list --path <_paksview-3.0.1>/pakchunk<N>-Windows.utoc` over every game chunk (148 941 paths, 634 with «music»).
- Tables: `retoc to-legacy --version UE5_7 --no-shaders --filter <Table> <_paksview-3.0.1> <out>` → `uaj tojson <asset> <out.json> VER_UE5_8` → a row flattener
  (session scratchpad `tools/dt_rows.py`).
- Native names: a read-only string scan of `ConanSandbox-Win64-Shipping.exe` for «soundstage / combatmusic / music».

## The pieces

| Piece | What it is | Where |
|---|---|---|
| **Sound stages** | Native actor `AConanSoundStage` (blueprint child `BP_SoundStage_C`, whose own graph is only BeginPlay/Tick) placed in the level as a volume; it plays rows of `SoundStageAudioTable` by name. | `/Script/ConanSandbox.ConanSoundStage`, `/Game/Systems/Audio/BP_SoundStage` |
| `SoundStageAudioTable` | 245 rows: `SoundAsset` (a Sound Cue), `AudioGroup` (enum `SoundStageGroupNames`), `Priority`, `FadeDelay`, `FadeInDuration`, `FadeOutDuration`, `FadeInVolume`, `FadeOutVolume`. **Group 0 = music (102 rows), group 1 = ambience (143 rows).** | `/Game/Sound/Tables/SoundStageAudioTable` |
| `SoundStageGroupDefinitionTable` | Group 0: size 2, `ForceCrossfade` true (two music layers crossfade); group 1: size 5 (five ambience layers). | same folder |
| **Mods add stage tables of their own** | Caverns of Set (`Mods/Mines_of_Set/Tables/SoundStageAudioTable_Caverns_of_Set`, 11 music rows: `mus_cave_macabre`, `mus_cave_nightmare`, `mus_cave_doom`, `mus_cave_dread`, `mus_sand_market`, `mus_dune_outpost`, `mus_desert_tribe`, `mus_sand_gates`, `mus_arabian_nights`, `mus_area_akhlut_outpost`, `mus_cave_darkness_vol2_mix`); Ymir's Respite (6: `mus_ymirs_respite_*`). | the mods' paks |
| `CombatMusicTable` | 7 rows — the combat tiers: `VeryEasy`, `Easy`, `Normal`, `Hard`, `VeryHard`, `Boss`, `Avatar`, each one Sound Cue `/Game/Sound/Music/Combat_1/CombatMusic_<Tier>_Cue`; structs `CombatMusicIntensityStruct`, enum `CombatMusicIntensityCategories`. Who plays it — not read yet. | `/Game/Sound/Tables/CombatMusicTable` |
| Other music | `Music_death_Cue` (death), `The_Purge/*` (base attack: start, warning, new wave, loop, end), `Music_Startup*`, `Music_Loading_Delayed_Main_Theme_Cue` (menu, loading), `Music_Store_Cue`, `mus_char_creation*`, `Remaster/Night_Time` (a track named for the night; how it is used — not read), stingers, religion stingers. Native names seen: `PlayMusic`, `StopMusic`, `MusicVolumeChanged`, `OnPurgeMusicRequested`, `PlayClassicMenuMusic`, `GetSoundStage`, `SoundStageInfo`. | `/Game/Sound/Music/…` |
| Sound classes | `Music`, `MusicEnvironment`, `MusicCombat`, `MusicCombat_Boss`, `MusicDeath`, `MusicPurge`, `MusicMenu`, `MusicCutscene`, `MusicSpecialEvents`, `Music_Bazaar`, `Music_Character_Creation`, `MusicDiegetic` (instruments in the world — not ours to mute), `Music_Siptah_Storm`; mixes `Mix_MusicCombat`, `Mix_MusicCombat_Boss`, `Mix_MusicPurge`, `Music_MuteMusic_BG_and_Combat`. | `/Game/Sound/Mixes_Classes/` |

## The music stage rows of the base game (group 0), by what the player sees

| Scene | Rows |
|---|---|
| Desert, south | `mus_desert_main`, `mus_dogs_desert`, `mus_pirate_desert`, `mus_oasis_big`, `mus_oasis_north`, `mus_sinkhole`, `mus_mounds` |
| Riverlands, highlands, savanna | `mus_riverland`, `mus_highland_main`, `mus_fertile_highland`, `mus_canyon_plateou`, `mus_savannah`, `mus_hotspring`, `mus_pirate_land`, `mus_pirate_ship` |
| Jungle | `mus_jungle_main`, `mus_darfari_lands` |
| North, snow | `mus_frozen_slope`, `mus_village_nordheimer`, `mus_village_cimmerian`, `mus_midnight_grove_1` |
| Volcano | `mus_volcano_1`, `mus_volcano_2` |
| Cities and ruins | `mus_unnamed_area`, `mus_unnamed_bridge`, `mus_unnamed_centre`, `mus_unnamed_ext`, `mus_unnamed_set`, `mus_unnamed_archives`, `mus_undead_city`, `mus_relic_hunters`, `mus_observatory`, `mus_sotr`, `mus_sotr_bat`, `mus_teliths_island`, `mus_witchqueen`, `mus_ab_keep`, `mus_ab_keep_combat_override`, `mus_DLC_main` |
| Dungeons and caves | `mus_sewer_1..3`, `mus_dark_dregs_intro/1/2/3/boss/STOP`, `mus_anvil_giants_1..3`, `mus_spidercave`, `mus_sandstone_cave`, `mus_frost_cave`, `mus_frost_cave_combat_override`, `mus_od_rift_arena`; Siptah vaults `mus_vault_<bat/drowned/fiend/goblin/harpy/snake/spider/wolf/bird>_1..3`, `mus_vault_prize_room_A`, `mus_vault_stop(_fast)` |
| Tavern, wine cellar | `mus_tavern_conan_1`, `Music_Area_WineCellar_Drunk` |
| Isle of Siptah | `mus_siptah_NL_ashlands/deadzone/floodlands/savanna`, `mus_siptah_beach`, `mus_siptah_rolling_hills`, `mus_siptah_western_highlands`, `mus_siptah_eastern_redwoods`, `mus_siptah_tower` |
| Character creation | `mus_char_creation`, `mus_char_creation_siptah` |
| Silence, tests | `mus_silence`, `mus_silence_slow_fade`, `music_test_MAIN` |

## What this gives the mod

The game already decides the scene: a stage row name (area, dungeon, tavern) and a combat tier. The mod maps a ROW NAME / TIER to a folder by a table, so a new
area of a mod (Caverns of Set, Ymir's Respite) lands in the right folder by its prefix (`mus_cave_*` → dungeons, `mus_sand_*` → desert) and an unknown row falls
back to the general exploration folder. Still to read live: the function that fires on a stage change and a tier change, death / Purge / menu entry points, and the
mute path (the `Music` sound class or `Music_MuteMusic_BG_and_Combat`).
