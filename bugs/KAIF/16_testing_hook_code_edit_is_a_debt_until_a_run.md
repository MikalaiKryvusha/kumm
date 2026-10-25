# KAIF improvement request: a shipped "testing hook" — every code edit becomes a test debt that only a RUN of its kind clears, and the stop is blocked while the debt stands

kaif-fp: .kaif/hooks (refresh-hooks module) + TESTING_FRAMEWORK.md#what-the-word-test-means :: testing-hook-code-edit-debt :: v2.9
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/176
**Autocapture:** KAIF 2.9 · project KUMM · sphere programming · language ru · i18n ru · tracking origin · agent system claude-code (Claude Opus 5.5) · OS Windows 11 Pro 10.0.26200
**Dedup attestation:** searched `bugs/KAIF/` (`grep -ril "test-after-code|testing hook|хук тестирования" bugs/KAIF/` → none) and origin issues
(`gh issue list -R MikalaiKryvusha/KAIF --state all --search "test-after-code"`, `… "testing hook OR untested code"` → none).

## Gap

`TESTING_FRAMEWORK.md` defines the word "test" as a functional run whose result is READ, and says hygiene (syntax check, linter, build) is
not a test — but the only carrier is prose. A session writes code, runs `node --check`, says "done" (or asks the owner "shall I test it?"),
and nothing in the machinery notices. KAIF 2.9 ships hooks that make the agent RE-READ the canon and (via #160) RECORD knowledge; none makes
it TEST what it wrote.

## Field evidence — two deployments, one owner

1. **Unliminium (the owner's game project), 2026-10-24 17:59 +03:00** — the owner designed it there, verbatim:
   «немедленно меняем правила работы по КАИФ, и делаем хук» · «Аггент что-то запрограммировали -> ХУК приказывает это протестировать! ->
   агент читает фреймворк тестирования. пишет идеи тестов -> тестирует, находяит или не находит косяки -> чинит. Программирует дальше -> ХУК
   ПРИКАЗЫВАЕТ ЭТО ПРОТЕСТИРОВАТЬ!!!!» · «Агент не просит разрешения у владельца!» · «Если агент ПИШЕТ КОД - это АВТОМАТИЧЕСКИ ОБЯЗЫВАЕТ
   АГЕНТА НЕСТИ ОТВЕТСТВЕННОСТЬ ЗА КАЧЕСТВО И РАБОТОСПОСОБНОСТЬ ЭТОГО КОДА». Implementation: `tools/hooks/test-after-code.mjs` there.
2. **KUMM, 2026-10-25 ≈11:10 +03:00** — the owner ordered the port, verbatim: «сходи в проект цифровой игры UInliminium - возьми оттуда хук в
   KUMM про цикл код - тесты - правки - код - тесты - правки» · «там уже такой есть». Ported the same day, adapted to a project whose session
   edits code in SEVERAL repositories (`tools/hooks/test-after-code.mjs`, debt key = path from the shared workspace root).
3. **It caught real work within the hour:** a new regression check for a localization file (`locres-regress.py`) was edited after its first
   run; the hook blocked the stop with «Непроверено: …locres-regress.py», the re-run then exposed that the first "red" run had been read through a
   pipe (`| head`) that swallowed the exit code — the honest red run followed.

## Proposed shape (what both deployments converged on)

- `PostToolUse` Write|Edit|MultiEdit on a CODE file → the file enters a debt in a git-ignored state file, with a KIND; the first edit injects the
  full order (the testing chain steps), later edits a short one with the count.
- `PostToolUse` Bash|PowerShell (and the project's game/product tools) → a command that is a RUN of the matching kind clears that kind's debt:
  product/game run · engine test suite · running the edited tool file itself. Hygiene (`--check`, `--help`, `py_compile`, build, linters) never
  clears.
- `Stop` with debt → block with the order and the file list; a repeated stop with no new edits passes (no endless loop) — the debt stays.
- `--waive "<why>"` when a run is impossible (no device), recorded for the judge; `--status`; `--selftest` with a mutant proof.
- Kinds and run patterns are per-project data (the deployment fills them), the mechanism is the framework's.

## Local remediation

KUMM: `tools/hooks/test-after-code.mjs` (selftest 14 steps, mutant without the debt write red on 6 points, live order and clear observed
2026-10-25 11:11), wired in `.claude/settings.local.json`; part I of `tools/test-guards.mjs` (153 of 153). Reconcilable at `/kaif-update`: if
the origin ships the module, KUMM keeps only its kinds/patterns as data.
