# Bug 102 — Conan: after a hub / settings-window session the hero's move and look input stayed ignored (the hero could not walk or jump)

**Status:** 🔬 research — seen once 2026-11-14 17:14 in the agent's run; four variants did not reproduce it (A–D below); variant E needs a free PC (real clicks)
· **Severity:** S2 if a player path leaves it (the hero frozen until a reload), none if it is the remote stand's own close
**Version/build:** Conan Exiles 3.1.0, the Krinik build (pack `456bfda` + the KrinikConanLocomotion edit of 17:0x) · **When/context:** 2026-11-14 17:14, the move
TC L1–L5 (the Xevyr settings hub and our «Карта» page) right after the wall-jump runs
**Fixing:** after variant E on a free PC — if E reproduces it, the fix is in the close path of the page that left it; if not, the stand's remote close is the cause
and gets the reset in its own tool

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
| E | the hub open, REAL clicks on its tabs incl. «Карта», then the remote close (and the real Tab close) | — (the owner came back to the keyboard) |

## Hypotheses

1. The game's own map page under a REAL click takes the mouse (map drag / capture) and adds an ignore; closing the inventory by `ActivateModule(false)`
   instead of the player's Tab / Esc skips the page's own release (step 6 — a stand-only path).
2. A focus change while a UI is open (the stand's tools bring the game forward and give the window back) adds an ignore the game never removes.
3. Something of ours on the hub's map page (KrinikConanUI hub controller, Simple Minimap helper row) adds an ignore.

## Links

`testcases/TC_conan_move_3.1.0_2026-11-13.md` L1–L5; `testcases/reports/2026-11-14_conan-wall-jump-press-order-and-real-space.md`.

## Decisions made without the owner

- None yet (the bug is open).
