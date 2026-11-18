# Test run report — the core's quality instrument after judge rounds 2–3, and the Russian guard on owner documents

**Created:** 2026-11-18 14:04 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** KUMM `11779e3` + working tree; core `cc3b391` + working tree

## 1. Work

Two pieces of plan 58 (`plans/58_EPIC_academic_russian_guards_and_proofreading.md`, criterion 6 and phase 3): (a) `krinik-stylometry/eval/quality-prep.mjs`
after the findings of judge rounds 2 and 3 (two defects and eleven risks of round 2; two regressions and ten risks of round 3), case set
`testcases/TC_core_quality_ab_2026-11-18.md`; (b) `tools/hooks/ru-build-text-check.mjs` extended to the Russian documents the agent writes for the owner
(interviews, homeworks, voice phrases, `*_ru.md`, the core's `russian_norms/`), each checked by the core's §8 in the genre of its purpose (`HOUSE_RULES.md` 35.4).

## 2. Contour

Windows 11, Node v24.15.0, Git Bash; the core clone `KUMM/krinik-stylometry` (CRLF working copy); real data: the run-1 key and verdicts
`eval/quality-keys/key_none_vs_v22.json`, `eval/quality/none_vs_v22/verdicts_odd.json`, `verdicts_even.json` (110 records), texts `eval/runs/none`, `v22`;
the hook driven by a PostToolUse event on this session's real owner documents and seen firing live on an Edit of interview #039.

## 3. Runs

Moments marked «≈» were not captured by a clock probe at the run; they are bounded by the probes around them.

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | ≈ 2026-11-18 13:17 +03:00 | `node eval/quality-prep.mjs --tally none v22` (before any edit) | 0 · baseline stdout and `result_none_vs_v22.json` saved to `.work/core-eval/` |
| 2 | ≈ 2026-11-18 13:19 +03:00 | `node ../.work/core-eval/old-prep.mjs` (the new selftest grafted on the HEAD code) | 3 · 17/30: all 13 new cases red on the old code |
| 3 | ≈ 2026-11-18 13:29 +03:00 | `node .work/core-eval/verify3.mjs` (the judge's round-3 findings on the round-2 code) | 0 · findings 1, 2, 4, 6, 7 reproduced (REJECTED / wrong counts) |
| 4 | ≈ 2026-11-18 13:34 +03:00 | `node eval/quality-prep.mjs --selftest` | 0 · 40/40 |
| 5 | ≈ 2026-11-18 13:34 +03:00 | `node eval/quality-prep.mjs --tally none v22` + `diff` / `cmp` against run 1 | 0 · stdout identical, result file identical (110 kept) |
| 6 | ≈ 2026-11-18 14:02 +03:00 | `node tools/hooks/ru-build-text-check.mjs --selftest` | 0 · 9/9 |
| 7 | ≈ 2026-11-18 14:03 +03:00 | `printf '{"tool_name":"Write","tool_input":{"file_path":"<doc>"}}' \| node tools/hooks/ru-build-text-check.mjs` on four real documents | 0 · hits read (below) |

## 4. Checks

Hygiene: quality-prep selftest 40/40, its new cases red on HEAD (13) and on the round-2 code (the judge's inputs); hook selftest 9/9; core `voice-check.mjs --lint-core` 0, selftest 18/18.
Functional run: the tally walked on the real run-1 verdicts (110 records), the output READ and compared byte for byte with the baseline; the hook driven as the harness drives it on four real documents of this session and its additional context READ; the hook seen firing by itself on an Edit of interview #039 in this session.

| Case | Status | Observation |
|---|---|---|
| tally on real verdicts unchanged | pass | run 5: stdout and result file identical to run 1 |
| LF clone reads the CRLF key | pass (in memory) | 48/48 fingerprints match LF-converted texts; an actual LF checkout not made |
| four legit typography quotes of v22 kept | pass | after the last fix the four «- это …» quotes (a hyphen mid-line after a bold term) count again |
| hook on interview #039 | pass | three hits: two named terms (marked `ru-ok`), one real «Тот же» — rewritten; re-run clean |
| hook on `NATIVE_RUSSIAN_STYLE.md` | pass | three hits: a quote of Nora Gal and a named term (marked), one real «Поэтому» — rewritten; re-run clean |
| hook on voice phrases | pass | 14:00 clean; 13:46 «поэтому» — the phrase was already spoken, kept as history |
| hook fires live | pass | PostToolUse context after the Edit of interview #039 listed lines 35 and 40 |
| `contour-page-lock.mjs` selftest | pass | 4/4 (no lock passes, a lock refuses, a plan and a decision file are not contour documents) |
| `contour-page-lock.mjs` on the real interview | pass | event piped with a lock: exit 2 and the hint; without it: exit 0 |
| `contour-page-lock.mjs` live through the harness | pass | with a placed lock an Edit of interview #039 was refused by the harness (PreToolUse error text read); the lock removed after |
| `dash_lint.py` extended (D1–D3, D5) | pass | 86 files, 370 lines: asset-strings 8, KrinikRU 349, HosavRU 9, manifest 4 — the counts of the probe `.work/dash_fix/probe_rutable.py`; after the notes left `version`, the manifest 0 |
| `build-docs.py --no-pdf` lints the launcher (D4) | pass | control: a telegraph dash put into the «Что нового» button → «лаунчер не собираю», exit 1; source restored by git; a clean run built `KrinikConanLauncher.exe` 1.1.0 (exit 0) |
| the installer's mod list | pass | `Deploy-ModPack.ps1 -ListMods -PackDir ConanExiles` prints «KrinikConanArchery … 0.9.0», no developer notes |

## 5. Found

- An agent regression of round 2 (whole words next to a range dash) and of the round-3 fix (a legit typography quote starting with a mid-line hyphen): both fixed the same hour, re-tally identical.
- The «check each record once» change of `tools/hooks/ru-reply-check.mjs` regressed (a hit first seen at a repeat Stop is never blocked): reverted, plan 58.

## 6. Traces

`.work/core-eval/` (tally_before.txt, tally_after3.txt, result_before.json, verify3.mjs, mutant.mjs, round3.diff, round4.diff); `.work/ru-reply-stand/` (stand, judge diff);
the judges' reports in this chat; interview #039 and its decision files.

## 7. Verdict

partial — quality-prep: judge round 4 not run yet, the two blind reviewers of run 2 not started; the hook: no judge round yet. Both wait for a free helper slot.
