# Bug 45 — Svarog: hot reloads of the UI mod leaked hero portraits until the game crashed in LoadImage

**Status:** 🔧 fix pending verification
**Severity:** S1 (the owner's trust and data: his game crashed in his session, ≈30 min of play after the last save lost)
**Version/build:** SvarogsDream `5f4137b` + working tree · **When/context:** 2026-10-13 22:24:29, ≈14 hot reloads of `KrinikUIRework`
(`tools/deploy-hot.sh`) into the owner's running game while fixing his live remarks. Owner: `[OWNER]` «и словно игра упала» · 2026-10-13

## Symptom
Right after a hot reload the game process vanished. Owner's progress after the save 21:56:35 (loot from two corpses, +126 XP) was not
written — Ironman does not save on a crash.

## Forensics
- `%USERPROFILE%\AppData\LocalLow\VI Games\Svarog's Dream\Player.log`, line ≈15785 «Crash!!!»; managed frames:
  `UnityEngine.ImageConversion:LoadImage` ← `KrinikUIRework.Plugin:LoadPortrait` ← `HeroPortraitsTick` ← `LateUpdate`.
- Crash report folder `…\Temp\VI Games\Svarog's Dream\Crashes\Crash_2026-10-13_192430766`.
- One minute before: Git Bash could not fork — «fork: Resource temporarily unavailable» (memory pressure on the machine).
- Code: `HeroPortraits.LoadPortrait` creates a `Texture2D` + `Sprite` per portrait from JPEG; `RestoreHeroPortraits` (called on unload)
  put the game's sprites back but never destroyed ours; the new copy's static cache is empty → every reload loaded all portraits again.

## Root cause
Native objects created by the mod were not destroyed on unload — a leak per hot reload.

## Fix
`RestoreHeroPortraits` destroys every loaded texture and sprite and clears the cache (`HeroPortraits.cs`). Game relaunched with the
fix at 22:27 from the owner's save; save copy before relaunch: `_backups/svarog-saves-2026-10-13_2226-owner-before-crash-relaunch`.
Lesson: `EXPERIENCE.md` EXP-0253.

TWINS: searched `new Texture2D|Sprite.Create|new RenderTexture` in `src/KrinikUIRework` — to be listed at verification (not yet run).

## Verification (pending)
Several hot reloads in a row; process memory before/after must not grow by the portrait set each time.

## Decisions made without the owner
`[AI]` Relaunched the game myself right after the crash from his last save (memory: the agent runs the game itself).

## Links
`testcases/TC_svarog_loot_window_2026-10-13.md` B13, C1, C1r
