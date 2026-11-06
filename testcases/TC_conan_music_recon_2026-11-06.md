# Test cases — Conan: live recon of the game's music system for KrinikConanMusic (plan 46 phase 1)

> **Created:** 2026-11-06 · **Parent:** `plans/46_conan_krinik_music.md` phase 1; `[OWNER]` 2026-11-06 17:25 «да, я хотел бы мод музыки»
> **Status:** 🟡 run 2026-11-06 17:55–19:17 — R1 R2 M1 M2 M3 M5 pass, M4 M6 partial, H1 blocked, R2b crash (the probe); was: written 2026-11-06 17:38 +03:00, not run
> **Outbound:** —

**Test basis.** The offline read `researches/conan-custom-music-mods/conan_music_system.md`: music stages are rows of `SoundStageAudioTable` played by the native
actor `AConanSoundStage`; combat music — `CombatMusicTable` tiers VeryEasy…Avatar; native names `PlayMusic`, `StopMusic`, `MusicVolumeChanged`,
`OnPurgeMusicRequested`, `GetSoundStage`, `SoundStageInfo`.

**Dimensions.** Who exposes the functions (class) · which function fires on a stage change / a combat tier change (an event the mod can hook) · how the game's
music is silenced without touching other sound. Not covered here: death, Purge, menu (read after the hook path is found); Siptah map.

## Stand

- Game `D:\Games\Conan Exiles 3.0.1` with the build; machine lock; `launch-bg.ps1` (the owner is in the chat); world by `enter-world-remote.sh` (with `pipefail`,
  EXP-0467); god mode by `god-on.sh`. Place: the saved spot (the oasis, desert stage) — a teleport by the remote to another biome for the stage change.
- Probes READ only: `funcs`, `dump`, Lua reads of plain values; no calls into native music functions with arguments they were not built for (EXP-0464).

## Cases

| # | Situation | Action | Expected | Status | Seen |
|---|---|---|---|---|---|
| R1 | in the world | read the live `BP_SoundStage_C` (remote Lua) | the stage's slots and what plays in them | pass | 2026-11-06 17:59 +03:00 (run 17:55, the oasis, day): ONE stage actor `BP_SoundStage_C_2147477239`, properties `AudioInfo` (TArray of 7 `SoundStageInfo`: Group FName, Priority, State 0/1, FadeVolume) and `AudioComponents` (7): slot 2 plays `Music_Area_Middle` (State 1, FadeVolume 1.00), slot 7 `env_cycle_desert_day_layered_C`; slots 1–2 = the music group (size 2, crossfade), 3–7 = ambience. The playing cue's NAME is readable: `c.Sound:GetFName()` |
| R2 | in the world | find the owner of the combat tiers | class + its state | pass | the hero `BasePlayerChar_C` (chain BaseSurvivalChar → BaseBPCombat → BaseBPChar → `/Script/ConanSandbox.ConanCharacter`) carries the component `BP_AC_AudioController_C`: `PlayingCombatMusicThreatLevel`=0 (out of combat), `CanTransitionCombatMusic`, `CombatMusicTransitionCooldown`=10.0, `MusicCrossfadeDuration`=2.0, `TrackOnePlaybackTime`, `TrackTwoPlaybackTime`, `CurrentCombatMusic`; its BP functions `UpdateCombatMusicStateWithNewActor`, `ResetCombatMusicTransitionCooldown`, `UpdateTrackOnePlaybackTime` / `UpdateTrackTwoPlaybackTime` (offline export list) |
| R2b | the same run | read `snd.SoundClassObject` of the slot cues and `GetFullName` of an empty `CurrentCombatMusic` under `pcall` | — | fail (CRASH) | 17:58:46 access violation 0x18 in UE4SS.dll; crash reporter PID 29620 closed by PID; lesson added to EXP-0464 — asset facts are read offline |
| M1 | KrinikConanMusic 0.1.0 deployed (`-Deploy -Only KrinikConanMusic`), `music/explore_desert/` holds one 220 Hz WAV tone, `combat/` one 330 Hz tone; the hero at the oasis (stage cue `Music_Area_Middle`) | the game starts and enters the world | UE4SS log: «загружен», «сцена звука: …BP_SoundStage_C…», «музыка места: Music_Area_Middle», «сцена: explore_desert», «глушу родную музыку: stage»; `State/player.log` «play …explore_desert…»; the player's audio session peak ≈ 0.22 × 0.8 | pass | 18:17–19:16 (four launches): every expected log line seen; player.log «play …explore_desert…test_tone_desert_220.wav»; the player's session peak 0.146 (= 6000/32768 × 0.8 of the tone written) |
| M2 | M1 | the game's own stage music muted by `Soundstage_2d_Music.Properties.Volume = 0` | the game process's audio session peak with the mute LOWER than with it lifted (A-B-A, ambience stays) | pass | 18:18 on the music class: 0.019 / lifted 0.028 / 0.024 (in noise — the stage cue is quiet); the mechanism proven on the ambience class `Soundstage_2d_Env`: 0.025 → `Properties.Volume=0` → 0.000 → back 0.022; with ambience at 0 the whole game read 0.000 while the mod held the music class at 0 (ambience restored to its own 0.9) |
| M3 | M1 | an enemy aggroes (the hero teleported next to the oasis boss, god mode) | log «угроза боя: N», «сцена: combat_<tier>» → the `combat` tone (fallback); after the fight back to the place scene | pass (after a fix) | first runs: the combat tone played 40 min with no fight — `PlayingCombatMusicThreatLevel` is the tier of the LAST combat track, never reset; fixed: combat = `#AggroList > 0` (1 at the boss, 0 150 m away). 19:08 and 19:17: «угроза боя: 2» → «сцена: combat_easy» → the `combat` tone, «глушу родную музыку: combat»; away: «угроза боя: 0» → «возвращаю родную музыку: combat» → the place scene |
| M4 | M1 | the player started from Lua by `start ""` | no console window on screen | partial | the 18:10 desktop frames show none; the start moment itself (the menu) was not filmed |
| M5 | the game closed | — | the player process gone within 3 s | pass | close-game.ps1 at 18:15, 19:05, 19:09, 19:14: player.log «the game ended - exit» within 1.4 s |
| M6 | M1 running a minute | — | the mod's minute line «N вызовов, всего X мс, худший Y мс»: worst ≤ 1 ms with spikes (the 1 ms budget of all mods) | fail → partial | 18:08 worst 24 ms (FindFirstOf each second before the world) → objects by `NotifyOnNewObject`; 19:12 17 ms/min ≈ 0.28 ms per call (≈12 reflected reads) → reads alternate by second; 19:17 steady 4 ms/min, worst 1 ms (os.clock quantum); minutes with a scene change 9 ms, worst 2–3 ms — over the rule; next: spread a change over ticks, then the A-B-A flight |
| H1 | the hub open, each tab | Q / E switching recorded at 60 fps and read frame by frame | no element of the hub jumps or appears late; the tab text does not shake (bug 64 items 15/17) | blocked | 18:10–18:15: gdigrab gave 12.9 fps at 4K → ddagrab + NVENC 54–58 fps; the hub opened by the remote (`ActivateModule CharacterInventory`); Q/E (and I) sent three ways — `keybd_event` VK, VK + scan code, `SendInput` KEYEVENTF_SCANCODE — the game in front each time: the tab never changed (`_config/frame_settle.py`: no switch in 840 frames). Next: switch tabs by the hub's own function through the remote |
| R3 | a hook probe on the candidate functions of R1/R2 (log only) | the hero is teleported from the desert to the Riverlands | one log line per stage change with the row name | not run | |
| R4 | the same probe | an enemy aggroes (spawned by the remote) | one log line with the combat tier | not run | |
| R5 | music playing | the `Music` sound class volume set to 0 by a sound-mix override from Lua | the game's music silent, footsteps / ambience / UI sounds stay | not run | |
