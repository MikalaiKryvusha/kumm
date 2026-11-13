# Bug 96 — Conan: looking at a bush, the «E Взять» prompt does not show

**Status:** 🔴 OPEN — filed 2026-11-13 11:10, not checked yet (the chat closed at the context limit) · **Severity:** S2 (gathering — a core loop of the owner's test play) ·
**Version/build:** Conan Exiles 3.0.1 build, KrinikConanUI as of pack `ca3cdef` · **When/context:** the owner's play of 2026-11-13 11:09, his frame · **Fixing:** first
in the next session

## Goal vector

Maintain: every object the hero can take or gather by hand shows the game's interaction prompt when the crosshair is on it. Acceptance: the crosshair on the bush of
the owner's frame shows «E …» (vanilla wording); the same with KrinikConanUI's prompt edits off (control) tells whose defect it is.

## Symptom (the owner's words, verbatim)

`[OWNER]` 2026-11-13 11:09 «смотрю на куст, нет E Взять - баг» · «проверь». His frame (third person, the hero with the bow, a large leafy bush in front, the crosshair
dot on the bush, no prompt on screen) — sent in the chat; the place: the stand area near `tp_ground.sh 98739 205258` (the oasis shore, his test save `Game_1`).

## Leads (not yet observed)

- Bug 83 (DONE-path work of 2026-11-06): KrinikConanUI restyled all five interaction prompts (`W_SimpleInfo`, `W_PlaceableInfo`, `W_DialogueNPCInfo`, `W_ThrallInfo`,
  `W_DBNORevive` — render scale 0.70, shifted left by the Lua half `krinik_ui_fixes`); a prompt placed off-screen or never shown would look exactly like this.
- Bug 80 (a corpse in a bush) and bug 82 (no «E Взять» over nest eggs — another object kind): the same family; bug 82's notes say snake eggs work, nest eggs do not.
- Vanilla first: is this bush hand-gatherable at all (some bushes need a tool)? Check by the game's own trace — the remote's interaction target under the crosshair.

## Plan

1. Stand: the owner's spot; the crosshair on the bush by the remote (`aim-sweep.lua` / `corpse-aim.lua` pattern); read the game's interaction target and whether a
   prompt widget is shown.
2. Control: the same with `krinik_ui_fixes` off (its section out) — prompt shown or not.
3. Fix at the cause; cases in a TC; a frame for the owner.

## Decisions made without the owner

- none yet

## Links

bugs/83, 80, 82 · `games/ConanExiles/mods/KrinikConanUI.md` (the interaction prompts)
