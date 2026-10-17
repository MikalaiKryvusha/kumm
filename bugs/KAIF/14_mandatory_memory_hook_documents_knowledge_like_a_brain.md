# KAIF improvement request: a MANDATORY "memory hook" registered in every deployment — the agent records project knowledge into the project's md documents at the moments of novelty, the way a brain does, not on commits or actions

kaif-fp: .kaif/hooks (refresh-hooks module) + AGENT_GUIDE.md#context-refresh :: mandatory-memory-hook :: v2.9
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/160
**Autocapture:** KAIF 2.9 · project KUMM · sphere programming · language ru · i18n ru · tracking origin · agent system claude-code (Claude Opus 5.5) · OS Windows 11 Pro 10.0.26200 · Node v24.15.0
**Dedup attestation:** searched `bugs/KAIF/` (`grep -ril "knowledge-hook|memory hook|хук запоминания" bugs/KAIF/` → none) and open origin issues
(`gh issue list --repo MikalaiKryvusha/KAIF --state open --search "hook knowledge memory document"` → none). Related, not a duplicate: #159 (the defect
— maps not updated as work goes, no executable carrier); this ticket is the improvement that closes it.

## Gap

KAIF 2.9 ships hooks for re-reading the canon (`.kaif/hooks/`: compaction re-read, marker-age timer, `resume` word, STATUS guard) — none for
WRITING knowledge. The canon's only carriers for recording knowledge are prose: "update the map if relations change" (`AGENT_GUIDE.md`, checklist
step 10) and "update the tree and the table in the same change" (`PROJECT_STRUCTURE_EXTERNAL_MAP.md`). A session therefore can work for hours, learn
how a subsystem works, and leave the project's documents silent (#159: two hours on one game subsystem, zero lines in its map, then a nonsensical
question to the owner about a cell that does not exist).

## The owner's words — every one of them, verbatim and in order (2026-10-18, 01:55–02:08 +03:00), with a rendering <!-- claim-ok: «+03:00» — смещение часового пояса, не время -->

The KAIF owner designed this hook live, correcting the agent's attempts one by one; the corrections are the specification.

1. «какого хуя ты разрабатываешь проект, и нихуя не ДОКУМЕНТИРУЕШЬ ПО ХОДУ ЕГО СОСТОЯНИЕ!» — "why the hell are you developing the project and not DOCUMENTING ITS STATE AS YOU GO!"
2. «БАГ В КАИФ, НЕМЕДЛЕННО!» — "a bug into KAIF, immediately!" (→ #159)
3. «ХУК ЗАВЕСТИ И ЗАРЕГИСТРИРОВАТЬ: ВСЕ РАБОТЫ И ЗНАНИЯ ДОКУМЕНТИРУЮТСЯ!!!!!!!! АГЕНТ ПОМНИТ И ЗНАЕТ СВОЙ ПРОЕКТ НА ВЫСОКОМ ПРОДУКТОВОМ И ФУНКЦИОНАЛЬНОМ УРОВНЕ!» — "create and register a hook: ALL work and knowledge get documented! the agent remembers and knows its project at a high product and functional level!"
4. «КАЖДЫЙ РАЗ, КОГДА ЧТО-ТО НОВОЕ ВВОДИТСЧЯ, ДЕЛАЕТСЯ, МЕНЯЕТСЯ _ АГЕНТ ОБЯЗАТ ЭТО ЗАДОКУМЕНТИРОВАТЬ В ЗАНИЯ ПО ПРОЕКТУ!!!!!!» — "every time something new is introduced, done, changed — the agent is obliged to document it in the project's knowledge!"
5. «Импрувмент в каиф: ОБЯЗАТЕЛЬНАЯ РЕГИСТРАЦИЯ ТАКОГО ХУКА, КОТОРЫЙ ОБЯЗЫВАЕТ АГЕНТА ДОКУМНТИРОВАТЬ ЗНАНИЯ ПО ПРОЕКТУ, НАД КОТОРЫМ ОН РАБОТАЕТ!» — "improvement to KAIF: MANDATORY registration of such a hook that obliges the agent to document the knowledge of the project it works on!"
6. (on the agent's first design, a Stop hook blocking the end of the turn) «НКТ!!!!!!!!» · «не стоп хук!» — "NO!" · "not a stop hook!"
7. «А хук, который предписывает агенту: "Это что-то новое? Такого не было в проекте, и теперь будет вот так? Ты ОБЯЗАН ЭТО ЗАДОКУМЕНТИРОВАТЬ!"» — "a hook that PRESCRIBES to the agent: 'Is this something new? It wasn't in the project, and now it will be like this? You MUST DOCUMENT IT!'"
8. «Что то изменилось? Документы со знаниями говорят по-другому? ТЫ ОБЯЗАН ЭТО ОТРЕДАКТИРОВАТЬ, актуализировать, удалить устаревшее, написать новое!» — "Did something change? Do the knowledge documents say otherwise? You MUST EDIT IT, bring it up to date, delete what is stale, write what is new!"
9. (on the second design, a gate refusing `git commit`) «а на каждом git commit, НЕТ!!!!!!!!» — "and on every git commit — NO!"
10. «он должен срабатывать на кажом ПООНИМАНИИ НОВИЗНЫ!!!!!!» · «ИЗМЕНЕНИй!» · «того, как проеккт менячется идейным и смысловым наполнением!» — "it must fire on every UNDERSTANDING OF NOVELTY! · of CHANGES! · of how the project changes in its ideas and meaning!"
11. (on the third design, a prescription only when code is edited) «только срабатывание в момент правки кода. НЕТ БЛЯТЬ!!!!!!!!!!!» — "firing only at the moment of a code edit — NO!"
12. «иди в интернет, разведка о психологии человека» · «как мозг и нейронные сети запоминают информацию» · «и в какой момент у человека в голове срабатывает "ХУК ЗАПОМИНАНИЯ"» — "go to the internet, recon on human psychology · how the brain and neural networks memorize information · and at what moment the 'memory hook' fires in a human head"
13. «Так должен работать агентский ХУК, который обязывает агента ЗАПОМИНАТЬ знания о проетке в локальных md документах» · «а не миханистически привязывать нахуй это к каким-то комитам и прочим действиям» · «мозг человека не привязывает хуки к коммитам» — "that is how the agent's hook must work, obliging the agent to REMEMBER project knowledge in local md documents · not mechanically tie it to commits and other actions · the human brain does not tie its hooks to commits"
14. «мозг человека постоянно сравнивает свой текущий опыт с тем, что посутпает в мозг через источники информации, и постоянно идёт сравнение "я это знаю, или нет? это новоек? а как у меня в памяти хранится? и постоянно актуализирует базу знаний"» — "the human brain constantly compares its current experience with what arrives through the sources of information — 'do I know this or not? is it new? how is it stored in my memory?' — and constantly updates its knowledge base"
15. «не нужно часто этот хук вызывать» · «не чаще раза в 10 минут будет достаточно» · «сессии агента Клод обычно длинные, от 30 минут до часов» — "don't call this hook often · no more than once per 10 minutes is enough · Claude agent sessions are usually long, 30 minutes to hours"
16. «и пусть срабатывает, когда агенту сказано закрывать работу и закругляться. Когда агент останавливает работу сам - ему нужно порефлексировать, проверить, записал ли он новые знания» — "and let it fire when the agent is told to close the work and wrap up. When the agent stops working by itself — it needs to reflect, to check whether it recorded the new knowledge"
17. «полного пересмотра сессии … не полного пересмотра сессии..... А новых знаний» · «мщменений знаний» · «изменений» — "not a full review of the session… but of new knowledge · of changes of knowledge"
18. «импрувмент в КАИФ отправлен со всеми моими набросами по этому хуку?» — "is the improvement to KAIF sent with all my sketches of this hook?" (this ticket)

Context of the same night (#159): «ты и не должен был [открывать код]. Ты должен был это понять из более высокоуровневых документов проекта» · «это не записано в карту проекта?» — "you were not supposed to [open the code]. You should have understood it from the project's higher-level documents · isn't it written in the project map?"

## Field evidence

- KUMM, 2026-10-18 night (#159): hours of work on one game subsystem, no line in its map; a question to the owner that the maps would have prevented.
- The recon the owner ordered (item 12): `researches/agent-memory-hook-psychology/README.md` in KUMM — the brain writes memory on PREDICTION ERROR
  (hippocampal novelty signal → dopamine → potentiation; Lisman & Grace 2005); a small error on a REACTIVATED memory updates it (reconsolidation),
  a large one forms a NEW memory; salience (emotion) strengthens the write; event boundaries consolidate the episode (Zacks); repetition of the same
  stimulus habituates. Neural networks: Titans (Google, 2025) write long-term memory in proportion to "surprise" (gradient of the memory's error),
  with momentum and decay. Sources are listed in the recon document.
- A working implementation, observed live in the session that wrote it: KUMM `tools/hooks/knowledge-hook.mjs` (commit `befce6f`), self-test 13 cases,
  run report `testcases/reports/2026-10-18_knowledge-hook.md`.

## Proposed change (smallest that closes the gap)

1. Ship a `memory-hook` in `.kaif/hooks/`, wired by `wire-hooks` like the refresh hooks — MANDATORY (the owner's item 5): registered in every
   deployment, its `"hooks": "off"` opt-out not covering it, `check` naming a deployment where it is absent.
2. Behaviour — the owner's specification above, as implemented in KUMM:
   - moments of novelty, each injecting the prescription of items 7–8 into the agent's context: the owner's message (stronger when stressed — CAPS,
     «!!!», «НЕТ»); an unexpected outcome in a shell command's output (error, failure, refusal, "not found"); contact with reality (web search and
     fetch, decompilation, live probes of the product); a re-read knowledge document (reconsolidation: "does it say what you know now?"); and
     constant comparison on any other incoming information ("do I know this? is it new? how is it stored?") — items 10, 13, 14;
   - the owner's order to close or wrap up, and the agent's own stop: one question — "is there new knowledge or a change of knowledge not yet recorded?"
     (items 16–17; the stop asks once, `stop_hook_active` ends it);
   - habituation: at most once per 10 minutes across all moments (item 15); never tied to commits or code edits (items 6, 9, 11, 13); nothing blocked
     except the single reflection on stop;
   - where to write: the deployment's own knowledge documents — vision, plan, task plans, house rules, the two maps, per-subsystem maps, recon.
3. A canon line in `AGENT_GUIDE.md` (the obligation in executable form, the hook as its carrier) and a judge hunt: "knowledge learned in the session and
   absent from the project's documents".

## Expected effect and its check

The next session of any KAIF project finds in its maps what the previous one learned; the owner stops re-explaining the project. Check: in a sandbox,
a scripted session that probes a subsystem and stops — the memory hook's prescriptions appear in the transcript at the moments listed, at most once per
10 minutes, and the stop reflection fires once. Invariants served: cold-start, memory, owner-work-safety.
