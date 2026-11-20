# Bug 108 — Esc does not close other mods' settings windows over the hub (EAA, fishing, Hosav and seven more)

> **GitHub issue:** [#41](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/41) — the public tracker of this defect (HOUSE_RULES 44)

**Status:** 🔴 OPEN — known regression of 0.9.1 by decision (bug 85): the Lua Esc key bind that closed them was the crash class
**Severity:** S3 by impact (a window closes by its own close button; no crash, no lost data) — kept as a document because a native fix per mod is real work
**Version/build:** Conan Exiles 3.1.1 build, KrinikConanUI 0.9.1 · **When/context:** 2026-11-18 19:40 — the owner: «еще баг на будущее по модам EAA: их окно ESC не закрывает. А должен закрывать.» · «Это про эту же историю, что ты сейчас делаешь»
**Fixing:** after the 0.9.1 release (not a release blocker — the owner's own word «на будущее»; critical = HOUSE_RULES 38)

## Symptom

A mod's settings window opened over the inventory hub (from the «Настройки модов» list): a press of Esc does nothing — the window stays, the hub stays.

## Repro

`ConanExiles/_config/post-key.ps1 -Key Escape` (a key posted into the game's window) after `ActivateModule(<module>, true)` over the open hub — run of
2026-11-18 19:4x (report `testcases/reports/2026-11-18_conan-keybinds-recon.md`): swallowed by `AMR_Settings`, `LLH_Settings`, `PrP_Settings`, `DN_UI_Settings`,
`EmberlightMasterConfig`, `EAA_Armorsettings`, `PIFC_Settings`, `ExilesFishingTuning`, `HosavUIsettings` (and our `KrinikModSettings` — fixed by its own kit event,
bug 85); `LBPRWidgetID` — Esc closes the HUB and leaves the LBPR window open. Close by themselves: `SM_UI_Settings`, `NightTerrorsSettings`.

## Root cause / what was tried

The windows have no FLX button with `KeyShortcutName` Escape (the vanilla popups' way) and swallow the key before the module controller's escape stack.
From Lua: a UE4SS key bind works but is the crash class of bug 85 (removed 2026-11-18); a Lua-made FLX button with the Escape shortcut inside the window never
presses (run 20:22, owner = GameInstance and owner = the window).

## Fix plan

Native, per mod (HOUSE_RULES rule 8): in each mod's window blueprint add (or bind) a cancel `WBP_ButtonBase` with `KeyShortcutName` Escape that closes its module
— by a kit/pak patch script next to the pak, re-applied after a mod update, the mod marked KRINIK MODIFIED; LBPR — find what closes the hub first.

## Decisions made without the owner

- `[AI]` 2026-11-18 20:3x: the Esc of these windows is dropped in 0.9.1 rather than kept on a key bind (crash > convenience; said to the owner in chat).

## Links

Bug 85 · `games/ConanExiles/mods/KrinikConanUI.md` «Clicks and Esc without key binds».
