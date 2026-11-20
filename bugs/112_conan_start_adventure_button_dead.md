# Bug 112 — the «Начать приключение (Пробел)» button does not work

**Status:** 🔴 OPEN — recorded only; the chat is paused by the owner, no investigation started
**Severity:** S2 by the ladder; CRITICAL by HOUSE_RULES 38 (a button that does not press — possibly a blocker on the way into the game)
**Version/build:** Krinik Mod Pack 0.9.1-RC1 (the release build), Conan Exiles Enhanced 3.1.1, the owner's working game `D:\Games\Conan Exiles 3.1.1`
**When/context:** 2026-11-20 18:34 +03:00, the owner's own play right after bug 111; his words (verbatim): «не работает кнопка Начать приключение Пробел...» and then «пиздец»
**Fixing:** after the pause — first, together with bug 111 (owner's debt; critical goes before cosmetic)

## Symptom

The button «Начать приключение» with the key hint «Пробел» does nothing — neither a click nor Space is reported to work (his words do not say which; both
are checked).

## Repro (deterministic)

Not known yet. To find from the build first: which window carries «Начать приключение» with the «Пробел» hint (the game's character creation or a start /
respawn screen, or a mod's window) — grep the game's and the mods' text tables and our locres fixes for the caption; then reproduce on the working game by the
player's path (a new character or the owner's state), the remote first, real input only with the owner FREE (HOUSE_RULES 30).

## Forensics

None yet. To read first: the `UE4SS.log` and `ConanSandbox/Saved/Logs/ConanSandbox.log` of the owner's session of 2026-11-20 ≈18:30 (read only, the game may
still run).

## Root cause / Hypotheses

Not investigated (the pause). Order to check, cheapest first:
1. A mod that rebinds Space or consumes the key / click on that window (our KrinikConanUI input handling after bug 85's move off key binds; KrinikConanLocomotion
   jump; Keybinds of UE4SS) — the control case: the same press with our Lua mods off (HOUSE_RULES 24).
2. A mod's widget over the button that eats the click (z-order) — the frame of the window.
3. The vanilla flow blocked by a mod's state (a journey, a character-creation mod: Edit Appearance, Heritage, Female New Faces).

## Fix plan

Find the window and the cause by the control case → fix at the source → neighbours (HOUSE_RULES 39: the other buttons and keys of that window) → a stand case
that presses the button by the player's path → the owner's own press.

## Decisions made without the owner

- `[AI]` Treated as critical by HOUSE_RULES 38 (a button that does not press).

## Links

- `bugs/111_conan_name_plate_mojibake.md` — reported by the owner a minute before, same session
- `bugs/85_conan_crash_keybind_lua_races_game_thread.md` — KrinikConanUI moved off key binds (a possible neighbour)
