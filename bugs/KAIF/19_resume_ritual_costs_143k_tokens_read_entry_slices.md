# KAIF improvement request: `/resume` costs ≈ 143 k tokens on a mature project — read each canon document's ENTRY SLICE at entry, fetch the rest by the router

kaif-fp: skills/resume + AGENT_GUIDE Document taxonomy :: resume-entry-cost :: v2.9
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/179
**Autocapture:** KAIF 2.9 · project KUMM · sphere programming · language ru · tracking origin · agent system claude-code (Claude Opus 5.5, 1 M window) · OS Windows 11 Pro 10.0.26200 · Node v24.15.0
**Dedup attestation:** `grep -ril "resume" bugs/KAIF/` → 11, 14, 18 (hook smoke probe, memory hook, mark-shown — none about the ritual's cost);
`gh issue list -R MikalaiKryvusha/KAIF --state all --search "resume in:title"`, `--search "resume tokens"`, `--search "resume cost"`,
`--search "context budget"` → empty (gh itself answers: `--limit 5` lists #174–#178). No match found.

## Gap

`/resume` Step 1: «**Read every canon document — the full set, not a slice.** A session that skips one resumes with a hole exactly there»,
and AGENT_GUIDE → Context router: «`/resume` is the session's ENTRY point — the one full pass here is exactly what makes the lazy slices safe
afterwards. Never "optimize" one with the other.» The size budget that should keep the pass affordable counts LINES
(`node .kaif/kaif-core.mjs check` → `DOC_BUDGETS`), and lines hide the cost: `AGENT_GUIDE.md` is 1 226 lines but 100 532 bytes —
the Read tool itself refused it whole: «36621 tokens, cap 25000». Nothing measures the ritual in the unit the model actually pays.

## Field evidence

KUMM, 2026-10-28 23:14–23:25, a `resume` + task message after a handover. Token growth of the main session, read from `usage` of each
answer in the session transcript (`input + cache_read + cache_creation`):

| Step | Context after | Δ tokens |
|---|---|---|
| session base (system prompt, tools, CLAUDE.md, memory index, skill list) | 65 198 | — |
| skill `/resume` loaded | 67 858 | 2 660 |
| `STATUS.md` · `AGENT_GUIDE.md` 1–711 · `PHILOSOPHY.md` (+ a 5 k task file) | 113 996 | 46 138 |
| `AGENT_GUIDE.md` 712–1227 · `HOUSE_RULES.md` 1–205 | 145 013 | 31 017 |
| `HOUSE_RULES.md` 206–260 · `GOAL.md` · `MASTER_PLAN.md` · `TESTING_FRAMEWORK.md` | 174 803 | 29 790 |
| `BUG_FIXING_FRAMEWORK.md` · `REQUIREMENTS_FRAMEWORK.md` · external map · `KAIF_FRAMEWORK.md` | 199 274 | 24 471 |
| internal map · project's Russian writing rules · owner's queue | 208 277 | 9 003 |

**≈ 140 k tokens of reading before the first line of the owner's task** — on a 200 k window that is the whole window; on 1 M it is 14 %
per handover, paid again at every new chat. The previous chat of the same project closed at 689 k; the owner then asked for a
context-window hook that closes chats before auto-compaction (deployed the same evening, `.claude/hooks/context-budget.mjs`) — and the
next request, verbatim: `[OWNER]` «нужно будет подумать, что у нас в ритуале resume можно уменьшить, или что из тех документов, что ритуал
resume читает, можно урезать, уменьшить - чтобы не потерять в качестве восстановления работы после передачи из другого чата, но сильно
высвободить траты токенов на ритуал resume» · 2026-10-28 · «может быть это импрувментом в KAIF оформить в его GH».

Bytes per document (≈ tokens at the observed ratio 100 532 B → 36 621 tok, i.e. ≈ 2.75 B/token):

| Document | Bytes | ≈ tokens | What a resuming session actually uses from it |
|---|---|---|---|
| `AGENT_GUIDE.md` | 100 532 | 36 600 | creed + prayer, checklist, router, taxonomy, identity, git rules, owner's notes; the rest is rationale and field history of rules |
| `HOUSE_RULES.md` (project) | 84 510 | 30 700 | §1 owner's standing rules; §4 dossier and §6 tools table are LOOKUP tables (the router already says: open when the task touches the surface) |
| `STATUS.md` | 28 098 | 10 200 | all of it — it is the handover |
| `KAIF_FRAMEWORK.md` | 25 791 | 9 400 | nothing for the task: deployment record + per-version changelogs for the owner |
| `TESTING_FRAMEWORK.md` | 20 594 | 7 500 | the marker contract and the activities chain; principles/grounding are reference |
| `MASTER_PLAN.md` | 19 717 | 7 200 | "now" + phase statuses; the decision log is archaeology |
| `PHILOSOPHY.md` | 17 297 | 6 300 | the prayer already carries its 16 lines; the essays are reference |
| `REQUIREMENTS_FRAMEWORK.md` | 14 928 | 5 400 | the writing checklist; the ten criteria/EARS are needed only when writing requirements (router row exists) |
| `BUG_FIXING_FRAMEWORK.md` | 14 331 | 5 200 | owner's-debt rule + the loop; ladder/guards on demand (router row exists) |
| maps (external + internal) | 17 798 | 6 500 | both are small; keep |

## Proposed change (smallest that closes the gap)

1. **Measure in tokens, not lines.** `kaif-core check` prints the `/resume` entry cost (bytes of the entry set ÷ a per-language ratio, or a
   real count from the transcript `usage`, as above) with a budget — e.g. ≤ 40 k tokens on top of the session base — and warns by
   document when it is crossed. Lines stay as a secondary signal.
2. **An ENTRY SLICE per key document, marked in the document itself** — `<!-- KAIF:ENTRY:BEGIN -->` … `<!-- KAIF:ENTRY:END -->` (the same
   marker family as `KAIF:CREED`). `/resume` Step 1 reads every document's entry slice — still the FULL SET of documents, so no hole by
   document — and the router fetches the remainder by task type, exactly as it already does for frameworks. Candidate slices:
   `AGENT_GUIDE` — creed, prayer, checklist, router, taxonomy, identity, git workflow, owner's notes (rationale moves to
   `KAIF_REFERENCE.md` §17, which already exists for "why a rule is the way it is"); the three frameworks — their executable carriers
   (writing checklist · testing activities + markers · bug loop + owner's debt); `MASTER_PLAN` — "now" + phases, not the decision log;
   `HOUSE_RULES` — §1 standing rules + the §5 routes index, not the dossier and tool tables.
3. **Drop `KAIF_FRAMEWORK.md` from Step 1.** It is the deployment record for the owner; the version line is one `kaif:version` away.
4. **Keep STATUS whole** — it is the handover; its ~200-line budget already governs it.

Estimate (from the table, not yet run): ≈ 140 k → ≈ 50–60 k tokens per entry, without removing any document from the set.

## Expected effect and its check

- **Cost:** the entry pass, measured from `usage` as in the table above, drops below the budget of item 1 on KUMM (a mature deployment:
  1 226-line guide, 260-line house rules).
- **Quality held (the owner's condition «не потерять в качестве восстановления»):** an A/B on real handovers — the same STATUS handed to a
  full-pass session and an entry-slice session (≥ 3 handovers); compare the announcement's chosen direction, the first three actions, and
  rule violations caught by the judge and the project hooks in the first hour. Acceptance: same direction in every pair, no new class of
  violation in the slice arm. Invariants served: cold-start, simplicity, autonomy (a window spent on the ritual is a window not spent on
  the owner's work).
- **Guard:** `check` reddens when an entry slice marker is missing from a key document, or when the entry cost crosses its budget.
