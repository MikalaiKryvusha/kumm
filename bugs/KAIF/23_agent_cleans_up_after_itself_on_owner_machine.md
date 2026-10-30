# KAIF improvement request: the agent cleans up after itself on the owner's machine — a canon rule, a closure step and a shipped scratchpad sweep

kaif-fp: AGENT_GUIDE (new section) + end-chat-soft/end-chat-force + hooks/ :: agent-machine-hygiene :: v2.9
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/183
**Autocapture:** KAIF 2.9 · project KUMM · sphere programming · language ru · tracking origin · agent system claude-code (Claude Opus 5.5, 1 M window) · OS Windows 11 Pro 10.0.26200 · Node v24.15.0
**Dedup attestation:** `grep -ril -E "scratchpad|clean ?up|disk" bugs/KAIF/` → 17 (#177: the origin's own self-test sandboxes `kaif-sbx-*` leak in
TEMP — one tool's leak, not the agent's general duty); `gh issue list -R MikalaiKryvusha/KAIF --state all --search` "scratchpad" · "cleanup" ·
"disk space" · "temp files" → none.

## Gap

KAIF governs how the agent works IN the repository and says nothing about what the agent leaves ON THE MACHINE: working files in the session
scratchpad, unpacked archives, copies, frames, builds, work trees next to the repository. Nothing in the canon, the closure skills or the hooks
asks the agent to delete them when the work is done, and nothing sweeps them after the chat is gone. Every session adds; no session removes.
The class is general — any sphere that unpacks, renders, builds or downloads (games, media, ML, data) fills the owner's disk the same way.

## Field evidence

KUMM, 2026-10-30. The owner saw drive D: full: 8.2 GB free of 954 GB. A measurement found:
- 168 GB in `<TEMP>/claude/<project>/<session>/` scratchpads of ~19 closed sessions (pak unpacks, copies of paks, frames) — checked byte by byte
  for anything unique: nothing (the "before" copies matched the library, the rest were reproducible), 1 292 text notes kept in a 3.3 MB archive;
- 54 GB in a forgotten work tree next to the repositories (an unpack of an old game version the work had moved past);
- 90 GB of a previous chat's rebuild folders, named in its handover as "the owner's call" instead of being removed when the work closed.
After cleanup: 288 GB free. The owner, verbatim: «и как-то нужно, чтобы ИИ агенты сами за собой прибирались...» · «если оно нужно для работы - ок» ·
«если работа сделана, и оно больше не нужно - хорошо бы удалять мусор» · «это тоже хороший навык в КАИФ - не только по играм, а в целом,
обобщённо, как ИИ агенту работать и при этом соблюдать порядок за собой на машине пользователя» · «можно импрув в каиф завести».

## Proposal

1. **Canon rule (AGENT_GUIDE, a short section "Order on the owner's machine"):** working files live in the session scratchpad; when a piece of
   work is done (committed, shipped), its heavy working files are deleted at once, file by file; what a later chat needs goes into the
   repository (STATUS, plans, researches), never into a scratchpad; a work tree outside the scratchpad is named in STATUS with its size and the
   task that needs it, and goes when that task closes. "The owner's call" is legal only for the owner's own data, never for the agent's leftovers.
2. **Closure step (`/end-chat-soft`, `/end-chat-force`):** "Machine order: <what was deleted, GB> | <what stays and why>" — measured, not felt.
3. **Shipped hook (refresh-hooks module):** SessionStart (`startup`) sweep of the project's scratchpads idle for 24 h, the current session never
   touched, deletion by enumeration (no recursive one-liner), a root outside `<TEMP>/claude` refused, the result line put into the agent's context.
4. **A disk-audit recipe** for the agent: biggest folders, hard-link share (`find -links +1`), so the agent says how much space a deletion
   REALLY returns — a hard-linked tree freed 28 GB of the 85 GB `du` promised.

## Local remediation

KUMM 2026-10-30: `tools/hooks/scratch-sweep.mjs` (self-test `tools/test-guards.mjs` part L, 6 cases; a mutant without the current-session check
removes the current session — the case goes red; a dry run on the real root named 24 idle dirs and kept 23 fresh); `HOUSE_RULES.md` §1 rule 15.
Wiring the hook into `.claude/settings.local.json` waits for the owner: the auto-mode classifier refused the agent's own settings edit
(self-modification) — a shipped install step that wires it would avoid that. Reconcile at the next `/kaif-update`.
