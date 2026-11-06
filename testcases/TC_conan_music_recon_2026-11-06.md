# Test cases — Conan: live recon of the game's music system for KrinikConanMusic (plan 46 phase 1)

> **Created:** 2026-11-06 · **Parent:** `plans/46_conan_krinik_music.md` phase 1; `[OWNER]` 2026-11-06 17:25 «да, я хотел бы мод музыки»
> **Status:** 🔧 written 2026-11-06 17:38 +03:00, not run
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
| R1 | in the world | `funcs ConanSoundStage`; `dump SoundStage` | the class's UFunctions listed; live stage actors in the level with their row fields | not run | |
| R2 | in the world | `dump CombatMusic`; `funcs` on the player controller and character filtered by «Music» | the owner of the combat tiers found (class + function) | not run | |
| R3 | a hook probe on the candidate functions of R1/R2 (log only) | the hero is teleported from the desert to the Riverlands | one log line per stage change with the row name | not run | |
| R4 | the same probe | an enemy aggroes (spawned by the remote) | one log line with the combat tier | not run | |
| R5 | music playing | the `Music` sound class volume set to 0 by a sound-mix override from Lua | the game's music silent, footsteps / ambience / UI sounds stay | not run | |
