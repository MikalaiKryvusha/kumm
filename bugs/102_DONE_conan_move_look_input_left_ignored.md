# Bug 102 — Conan: after a hub / settings-window session the hero's move and look input stayed ignored (the hero could not walk or jump)

**Status:** ✅ cause found 2026-11-14 17:3x — a STAND-ONLY path, the player's path is clean (E1); the stand got `_config/hubswitch/close-hub.lua` · **Severity:**
S2 for the agent's runs (a frozen hero spoils every later case), none for the player
**Version/build:** Conan Exiles 3.1.0, the Krinik build (pack `456bfda` + the KrinikConanLocomotion edit of 17:0x) · **When/context:** 2026-11-14 17:14, the move
TC L1–L5 (the Xevyr settings hub and our «Карта» page) right after the wall-jump runs
**Fixing:** done this session — the stand's remote close was the cause; the tool `close-hub.lua` (below)

## Description

After the sequence below the stand's remote jump presses stopped moving the hero (z constant, place constant, no take-off). The hero's state was normal (no
substate, `GetCharacterState()` 0, `CanJump()` true), the inventory, our settings window and the map modules all closed — but
`PlayerController:IsMoveInputIgnored()` and `IsLookInputIgnored()` were both **true**. A real Tab open / close of the hub did not clear them (the ignore flags are
counters: an open / close pair adds and removes one each, so a leftover stays). `ResetIgnoreMoveInput()` + `ResetIgnoreLookInput()` cleared them.

## Steps (the sequence that left it, 17:07–17:14)

1. The world entered by the remote, the stand runs (wall climbs and pushes) — jumps work (17:05).
2. Remote: the Xevyr settings hub opened (`KrinikHubRequest` + `ActivateModule('KrinikModSettings', true)`); pages switched by the remote (`WS_KrinikPages`).
3. Real clicks (`mouse-seq.ps1`, the game brought forward and given back each time): a check, «Сохранить» (17:10:55); the list item, the check, «Сохранить» (17:11:4x).
4. Remote: the settings window closed (`ActivateModule(…, false)`), reopened, closed again (17:12–17:13).
5. Remote: the hub opened on tab 7 «Карта» (`open-tab.lua`, `SetCarouselIndex`); real clicks on the tabs «Путешествие» and «Карта» (17:13:4x).
6. Remote: the inventory closed by `ActivateModule('Inventory', false, false)` (17:14:17).
7. The stand's `climb` (17:14:5x): the press fires, the hero does not move — move / look ignored.

## Hunt (none reproduced it)

| Variant | What | Flags after |
|---|---|---|
| A | our settings window opened / closed by the remote over the world | false / false |
| B | the inventory opened / closed by the remote | false / false |
| C | the hub opened on «Карта» by the remote, switched to «Путешествие», closed by the remote | false / false |
| D | the settings window opened by the remote, one REAL click on its list, closed by the remote | false / false |
| E1 (17:32, fresh game) | REAL Tab, a click on «Карта», a click on the map, REAL Tab | false / false — the player's path is clean |
| E3 (17:32) | REAL Tab, the same clicks, then the REMOTE close `ActivateModule('Inventory', false)` | **true / true while open, still true after the remote close — reproduced** |

## Root cause

The native Tab that OPENS the inventory adds one IgnoreMoveInput and one IgnoreLookInput to the PlayerController (E3: both true while the hub is open);
the Tab that closes it removes them (E1). The stand's remote close `GUIModuleController:ActivateModule('Inventory', false)` closes the module but removes
neither — and leaves the hub carousel alive, so the next real Tab closes the leftover carousel instead of opening the hub (17:34). The step-6 close of the
17:07–17:14 sequence was exactly that. (Hypothesis 1 of the first draft — the map page — was wrong: the map does not matter, the close path does.)
No mod of ours closes the inventory this way: `ActivateModule(…, false)` in KrinikConanUI closes only mod windows (`krinik_mods_button.lua` 170 / 263,
`krinik_mod_settings.lua` 1108 / 1113 / 1241), and variant A showed such a window adds and keeps no ignore.

## Fix

`ConanExiles/_config/hubswitch/close-hub.lua` — the stand closes the hub by the game's own `GUIModuleController:ForceDeactivateFullscreenModules()` (releases
the input within ≈ 1 s), checks after 1 s and resets the two ignores only if still set. Seen 17:36: «before: move true look true · 1 s after the force-close:
move false look false · no reset needed», the hub controller logged «хаб закрыт», a remote jump then took off (+95 cm). `ToggleModule('Inventory')` does
nothing (the Tab goes another way). Rule for the stand: never close a hub by `ActivateModule(false)` — use `close-hub.lua` or a real Tab.

## Links

`testcases/TC_conan_move_3.1.0_2026-11-13.md` L1–L5; `testcases/reports/2026-11-14_conan-wall-jump-press-order-and-real-space.md`.

## Decisions made without the owner

- `[AI]` Closed as a stand-only defect with a stand tool, no change to the build: the player's Tab path keeps the input right (E1), and no mod of ours
  closes the inventory by `ActivateModule(false)`.

## ✅ STATUS: DONE (2026-11-14 17:4x)

Hygiene: judge round on `close-hub.lua` (see the pack commit). Functional run: E1 (the player's path, real Tab / clicks) clean; E3 reproduced the lock by
the remote close; `close-hub.lua` on a remote-opened hub released it (17:36) and a jump followed.
