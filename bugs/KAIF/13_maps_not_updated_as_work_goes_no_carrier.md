# KAIF bug: the project maps are not updated as the work goes — "update the map" has no executable carrier, and a session works for hours on a subsystem the maps never mention

kaif-fp: AGENT_GUIDE.md#before-every-task-checklist (step 10) + fable-method step 4/7 :: map-not-updated-as-work-goes :: v2.9
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/159
**Autocapture:** KAIF 2.9 · project KUMM · sphere programming · language ru · i18n ru · tracking origin · agent system claude-code (Claude Opus 5.5) · OS Windows 11 Pro 10.0.26200 · Node v24.15.0
**Dedup attestation:** searched `bugs/KAIF/` (`grep -ril "map" bugs/KAIF/ | xargs grep -il "same move|update the map"` → no match) and open origin issues
(`gh issue list --repo MikalaiKryvusha/KAIF --state open --search "map update same move"` → only field reports #149, #153, #155; `--search "map"` → the same three). No match found.

## Expected per canon

> "10. Check the map & blast radius   # before editing code: PROJECT_ARCHITECTURE_INTERNAL_MAP.md — who is affected; update the map if relations change" — `AGENT_GUIDE.md`, "Before every task — checklist", step 10.

> "Keep this map honest: when you add, move, or rename a file/directory, update the tree and the table in the same change." — `PROJECT_STRUCTURE_EXTERNAL_MAP.md`, footer.

The project extends this to every modded game (its owner's standing rule, `AGENT_GUIDE.md` → "Notes from the human"): "Before decompiling or probing the game, read both maps; whatever the probe finds goes into them in the same move."

## Got in the field

One night session (2026-10-18, 00:00–01:55, KUMM working on the Svarog's Dream mod pack) spent ~2 hours on one game subsystem — the quick-action bar —
and learned, by decompiling and by probing the live game: two skill sets with slot IDs 0–11 and 12–23 bound to the weapon swap
(`PlayerEquipment.SwapWeapons` → `SpellsActionManager.SwapSpellSlots`); Q/E shared by both sets; an author bug in `UISlotBase.OnBeginDrag`
(`DragKeyModifierIsDown()` returns true for `None`, so no drag icon ever appears); cooldowns keyed by spell id and running on game time; the
"Space" cell removed by the project's own jump mod. Every one of these facts went into code comments, test cases and chat — **none into
`games/SvarogsDream/GAME_ARCHITECTURE_INTERNAL_MAP.md`**, which had no row about the bar at all.

The cost surfaced at the end: the agent asked the owner, in an interview, where to put the "Space" cell in the row (interview #023, Q5) — a
cell that is not on the bar, because the project's jump mod removed it long ago at the owner's own demand. The owner's words, verbatim (Russian), with a rendering:

- «твой вопрос про пробел неуместен, и мне даже грустно тебе говорить, почему» — "your question about Space is out of place, and it even saddens me to tell you why"
- «почему это ты только сейчас узнал, спустя часы работы?» — "why did you only learn this now, after hours of work?"
- «ты и не должен был [открывать Jump.cs]. Ты должен был это понять из более высокоуровневых документов проекта» — "you were not supposed to [open the code file]. You should have understood it from the project's higher-level documents"
- «какого хуя ты разрабатываешь проект, и нихуя не ДОКУМЕНТИРУЕШЬ ПО ХОДУ ЕГО СОСТОЯНИЕ!» — "why the hell are you developing the project and not DOCUMENTING ITS STATE AS YOU GO!"
- «БАГ В КАИФ, НЕМЕДЛЕННО!» — "A BUG INTO KAIF, IMMEDIATELY!"

## Repro (deterministic)

1. A KAIF project with the two maps; a task touching a subsystem the internal map has no row for.
2. Run the task by the fable loop for several commits: probe, decompile, fix, test, commit, push.
3. Observe: no step of the loop, of `/plan-task`, of the commit hygiene or of `/end-chat-soft` asks "which map row did this subsystem's new
   knowledge go into?" — the session closes green (`check`, the lints, the judge) with the map unchanged.

## Cost and violated invariant

Hours of the owner's live time spent re-explaining the project to its own agent; a nonsensical question shown to the owner; the next cold-start
session would have re-discovered the same subsystem from code. Violated: **cold-start** (a fresh session cannot learn the subsystem from the
maps), **memory**, and **owner-work-safety** (the owner pays for the agent's forgetting).

## What in KAIF led to this

The obligation lives as prose in two places ("update the map if relations change", "in the same change") with no command, step or checkbox —
exactly the form `AGENT_GUIDE.md` → "The form of an obligation" says a weak (or busy) model does not honour. The trigger is also too narrow: "if
relations change" reads as "if I moved a module", not "if I learned how a subsystem works". `/end-chat-soft` step 1 updates STATUS and
EXPERIENCE but never the maps; `/fable-judge` has no hunt for "new subsystem knowledge outside the maps".

## Proposed fix (smallest that closes the gap)

1. Restate the obligation as a step with an exit condition at the fable loop's step 7 (report) and in `/end-chat-soft` step 1:
   "Name the map row each subsystem touched in this session lives in — or add it; a subsystem with new knowledge and no row is not done."
2. Add a judge hunt — "subsystem knowledge outside the maps": files changed in the session's commits whose subsystem has no row (or an unchanged
   row) in the internal map.
3. Optional machinery: `kaif-core check --maps <since>` listing directories/modules touched since a commit whose names do not occur in either map.

## Local remediation (per the "defect in KAIF itself" contour)

- The hotbar row added to `games/SvarogsDream/GAME_ARCHITECTURE_INTERNAL_MAP.md` (2026-10-18), and the lesson `EXPERIENCE.md` EXP-0308.
- Not yet mutation-proved: no guard exists locally either; the proposed hunt is the guard.
