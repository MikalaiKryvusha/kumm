# Test run report — the mod-reconciliation gate (style-gate `--cmds`)

**Created:** 2026-11-06 09:38 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** KUMM working tree after `24d9b61` + `tools/hooks/style-gate.mjs` `--cmds`, the
`.claude/settings.local.json` entries «mod-reconciliation-gate» (gate) and the GUIDE.md mark

## 1. Work

`[OWNER]` 2026-11-06 09:34 «и когда занимаешься сведением водов друг с другом - пускай ХУК тебе напоминает прочесть это руководство»; `HOUSE_RULES.md` rule 27.
Expected: the reconciliation tools (`who-overwrites-table.py`, `mod-overrides.py`, `check-mod-conflicts.py`, `check-conflicts.py`, `patch-mod-asset.py`) and
writes into the findings files (`researches/mod-reconciliation/`, `researches/conan-table-conflicts/`, `ConanExiles/_config/krinik_patches/`) are refused until
`researches/mod-reconciliation/GUIDE.md` is read in full within the hour; the guide itself and other commands pass.

## 2. Contour

The live Claude Code session (the hook wired in `settings.local.json`) and direct calls of the hook with JSON events on stdin and a throwaway stamp in the
session scratchpad.
REAL WORLD: accumulated — the owner's working session with all other hooks wired; data and machine — his; path — the agent's own tool calls.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-06 ≈09:37 +03:00 | a Bash call carrying the tools' names, in the live session, the guide not read | refused: «mod-reconciliation-gate: … документ в этой работе ещё не прочитан» |
| 2 | 2026-11-06 ≈09:37 +03:00 | `echo '<event>' \| node tools/hooks/style-gate.mjs --gate|--mark --style GUIDE.md --stamp <tmp> --paths … --cmds …` ×8 | see Checks |
| 3 | 2026-11-06 ≈09:38 +03:00 | `node tools/test-guards.mjs` | «184 of 184 as expected» |

## 4. Checks

Hygiene: `tools/test-guards.mjs` 184 of 184 (the older style-gate uses unchanged).
Functional run: the gate refused a real tool call in the live session; the eight direct calls READ by exit code:

| Case | Expected | Observed |
|---|---|---|
| merge tool, no read | 2 | 2 |
| other command (`git status`) | 0 | 0 |
| findings file write, no read | 2 | 2 |
| the guide itself edited | 0 | 0 |
| partial Read (offset 5, limit 10) → then a tool | 2 | 2 |
| whole Read → then a tool | 0 | 0 |

## 5. Found

None in the gate. Side note: `knowledge-hook` reads `patch-mod-asset.py extract <Mod>` and demanded notes for a dummy mod name «X» — the test used a real mod.

## 6. Traces

The live refusal text in the session; the throwaway stamp removed after the run.

## 7. Verdict

pass.
