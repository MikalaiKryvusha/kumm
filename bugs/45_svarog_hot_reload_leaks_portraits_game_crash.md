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

2026-10-17 08:00–08:02 (case M1, `testcases/TC_svarog_rescan_icon_hotmem_2026-10-17.md`): private memory 19 408 → 19 579 MB after reload 1
(+171) → 19 588 MB after reload 2 (+9); 62 portraits colored after each; 0 exceptions. Reload 2 adds almost nothing, so the per-reload
portrait leak (up to 260 MB decoded) is not seen; reload 1's +171 MB is still unexplained (one-off cost vs leak) — a third reload in a
separate session decides. TWINS: searched `new Texture2D|Sprite.Create|new RenderTexture|new Material(` in `src/KrinikUIRework` — 15
files create small textures/sprites/materials once per load (BubbleBox, CombatText, HeroCard, HudRow, ItemWindow, MenuFonts, MiniMapArrow,
MiniMapLight, SunMirror, DevotionCards, Dialogue, Popups, LoadingLayout); not destroyed on unload — each a few KB to a few hundred KB per
reload, not the crash-sized class.

## Decisions made without the owner
`[AI]` Relaunched the game myself right after the crash from his last save (memory: the agent runs the game itself).

## Links
`testcases/TC_svarog_loot_window_2026-10-13.md` B13, C1, C1r

## 🔧 STATUS 2026-10-17 20:05 +03:00 — not closed (an earlier line here said DONE; withdrawn by the closing judge)

Functional run: 2026-10-17 19:23–19:30, the owner's live game, several hot deploys of KrinikUIRework in a row (`RELOADED` each, the game did
not crash). Process memory (`tasklist`): 3 585 760 K before one deploy, 3 967 352 K three seconds after (+373 MB — above the 200 MB limit
written in case M1), 3 330 020 K about 1.5 minutes later (19:26:52). The settled value is below the start, so no leak per deploy is SEEN, but
the case's own criterion broke on the immediate reading — M1 is partial (`testcases/TC_svarog_batch5_refactor_hotbar_2026-10-17.md`). Next: a
criterion on the settled reading (e.g. 60 s after the deploy) and a second evening.

### Decisions made without the owner
- `[AI]` Kept open: one evening of readings and a broken immediate criterion are not enough to close a bug that crashed the owner's game.
