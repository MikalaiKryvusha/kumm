# TC — KrinikConanGameplay: levels and Agility speed as one mod (plan 36 W32)

> **Created:** 2026-10-30 · **Parent:** plan 36 W32, W34; `[OWNER]` «KrinikOblivionLocomotion · KrinikLevelUncapped · Идет в мод KrinikConanGameplay» · 2026-10-30 ≈13:0x
> **Status:** cases written 2026-10-30 14:2x, before the run; run 14:20–14:22 — G1–G6 pass (report testcases/reports/2026-10-30_conan-krinik-conan-gameplay-merge.md)
> **Outbound:** —

**Goal (Maintain).** After the merge the hero levels and moves exactly as with KrinikLevelUncapped + KrinikOblivionLocomotion: the rebuilt pak
(new name, the same generated tables) replaces the three progression tables and stays last in the load order; the Agility speed runs as a section.

**Stand.** The owner's save copied before the launch (level 53, XP 129,2k of 130,3k on the 14:12 frame of the KrinikConanUI run); world entry by
`enter-world-remote.sh`; god by `god-on.sh`; frames by `capture-window.ps1`. Techniques: smoke (G1), state by the log (G2, G3), an invariant
before/after — the same save shows the same XP threshold (G4), control (G5).

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| G1 | Smoke — menu | launch after the deploy; menu frame by eye | the main menu, no crash reporter | pass — the menu reached (the remote pressed «Продолжить» on it), world in 24 s, no crash reporter; no separate menu frame — the same pak set as the 14:11 frame plus one table pak |
| G2 | Pak mounted last | `ConanSandbox.log`; `Mods/modlist.txt` | `KrinikConanGameplay.pak` mounted and the LAST line of modlist; no `KrinikLevelUncapped` | pass — `Mounting mod pak file … KrinikConanGameplay.pak` 14:21:01; the last modlist line; 0 lines with KrinikLevelUncapped |
| G3 | Section loads and sets the speed | `UE4SS.log` after world entry | «[KrinikConanGameplay] section krinik_oblivion_locomotion: loaded»; the section's line with the hero's speed from Agility | pass — «section krinik_oblivion_locomotion: loaded» 14:20:54; «герой появился: Проворство 0 → бег 450, спринт по закону 773, взлёт 420» 14:21:49 |
| G4 | Tables unchanged | HUD frame after world entry | level 53, «XP : 129,2k / 130,3k» — the same as the 14:12 frame with the old pak (the same save) | pass — frame 14:21:5x: level 53, «XP : 129,2k / 130,3k (1 119)» — the same as 14:12 |
| G5 | Control — no old mods | list `ue4ss/Mods`, `Mods/`; log | no `KrinikOblivionLocomotion` folder, no `KrinikLevelUncapped.pak`, no old prefixes | pass — the old folder and pak removed file by file before the deploy; 0 old prefixes, 0 old mounts |
| G6 | No crash, no Lua errors | the whole run | no crash, 0 Lua error lines | pass — 0 Lua error lines; closed cleanly 14:22 (5,1 s), no crash reporter |
