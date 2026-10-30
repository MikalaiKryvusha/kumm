# KAIF improvement request: a studied component must have ONE notes file, read before the next work on it — a lock, not a reminder

kaif-fp: AGENT_GUIDE (Context router + knowledge capture) + hooks/ :: component-notes-lock :: v2.9
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/186
**Autocapture:** KAIF 2.9 · project KUMM · sphere programming · language ru · tracking origin · agent system claude-code (Claude Opus 5.5, 1 M window) · OS Windows 11 Pro 10.0.26200 · Node v24.
**Dedup attestation:** `grep -ril -E "notes|конспект|knowledge|re-?stud|rediscover" bugs/KAIF/` → none on this class (#179 is the cost of the
entry ritual; the knowledge hook of this project is local, never filed); `gh issue list -R MikalaiKryvusha/KAIF --state all --search` "knowledge hook" ·
"notes per component" · "rediscover" → to be checked by the report command's dedup.

## Gap

KAIF tells the agent to write knowledge down (house rule «knowledge is written the moment it is understood», a project knowledge hook that prompts
at moments of novelty) — but only as ADVICE: a prompt that fires at most once per 10 minutes and blocks nothing. Two holes follow:
1. **Knowledge is filed by topic, not by the thing studied.** Facts about one component end up in five paragraphs of a map, a plan row and a
   commit message; nobody can find "everything about X" in one look.
2. **Nothing obliges the agent to READ what it already knows before working on the same component again.** The context router says "read the
   relevant slice", the game-map rule says "read both maps before probing" — both are prose, and a session under load skips them.
Result: the agent re-derives the same internals each session, "as if seeing it for the first time".

## Field evidence

KUMM, 2026-10-30, the Conan build. The owner asked for a change in how the HUD mod (Hosav's Custom UI) blinks hunger/thirst/weight. The agent
extracted the widget, listed its exports and traced its bytecode from scratch — while five facts about that very widget (its slots, its settings
object, its button, its number formatting) already stood in the game's internal map, scattered by topic, unread. The mod had been edited for a
week (translation, layout, the «k» digit). The owner, verbatim: «странно, что ты над модами этими уже неделю работаешь и у тебя НЕ ЗАПИСАНЫ ПО НИМ
КОНСПЕКТЫ!!!» · «и ты их каждый раз по-новой словно разбираешь, как первый раз видишь!» · «Это неправильная работа по КАИФ!!! КАИФ ДОЛЖЕН ТЕБЯ
ОБЯЗЫВАТЬ ДОКУМЕНТИРОВАТЬ ТВОИ ЗНАНИЯ!!!» · «а не по тысячу раз переоткрывать одно и то же!» · «не всегда повторное нужно обязательно все
перечитывать, а умно! Думаешь "Ага, нужно поработать с этим модом. Иду читать мой по нему конспект!"».

## Proposal

1. **Canon rule (AGENT_GUIDE, next to the context router):** every component the project works on (a module, a mod, a service, a device) has ONE
   notes file — what it does · its parts with names and numbers · our changes · how to look inside (the commands) · open items. Work on the
   component starts by reading its notes once per session; anything learned goes into the same file in the same move. Maps keep a pointer,
   not a copy (DRY).
2. **Shipped hook (optional module, the mechanical half):** PreToolUse — a command that works on a component (configurable patterns: extract,
   decompile, trace, edit of its sources, deploy of it alone) is DENIED while the notes file is missing or not read in this session, with the
   path in the reason; PostToolUse after a study command — "write what you found into <notes>" with no habituation window; Stop — the turn
   does not end while a component was studied after its notes were last edited.
3. **Template** `.kaif/_component-notes-template.md` with the five sections.

## Local remediation

`KUMM/tools/hooks/knowledge-hook.mjs` (2026-10-30): `notesGate()` — PreToolUse deny / PostToolUse prompt / Stop block; components are the mods of the
Conan build, notes in `KUMM/games/ConanExiles/mods/<Mod>.md`; self-test M13–M18; live: an extract refused before the read, passed after it.
Found limit: a Read sent in the SAME message as the command is not in the session log yet when PreToolUse runs — read in its own call.
