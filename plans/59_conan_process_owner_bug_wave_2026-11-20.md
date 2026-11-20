# Plan 59 — process: the owner's bug wave in the RC1 release build (2026-11-20) — how I test, and why my last two remedies never ran

> **Created:** 2026-11-20 · on the owner's word (verbatim in §1) · **Parent:** `HOUSE_RULES.md` rule 44 (the issues), bugs 111–114 and the owner's list of
> 18:42–19:10; the two earlier process plans `plans/32_svarog_process_owner_bug_wave_2026-10-18.md` and `plans/47_conan_gameplay_soak.md`
> **Status:** 🔧 written 2026-11-20 19:16 +03:00; the reading copy for the owner — `plans/59_conan_process_owner_bug_wave_2026-11-20_ru.md`; no step done yet
> **Outbound:** a KAIF improvement request (a process remedy that stays a document; §4 step 6)

## 1. The owner's verdict (verbatim)

`[OWNER]` 2026-11-20 18:42–19:14, after half an hour of his own play of the release build (the full list — chronicle entry 2026-11-20 18:42):
«я тебе скажу, что качество возмутетельно плохое сборки... я поиграл полчаса и нашёл кучу блокеров для релиза.» ·
«то, что мы выпустили RC1 - даже стыдно называть релиз кандидатом. Это пронизанное багами и недоделками и дырами неиграбельное дерьмо.» ·
«это не выпуск, а ты обосрался» · «и нужно что-то радикаольно менять в том, как ты работаешь, как ты тестируешь, как ты придумываешь идеи тестов и проверок.» ·
«Я нашёл кучу возмутительных неприемлимых багов, которые ты должен был найти давным давно»

## 2. Honest diagnosis — what I did, and what it let through

| # | What I did | What passed by because of it |
|---|---|---|
| D1 | I derived every test case from MY change (a mod's edit → its cases). I never derived cases from what a player does. | Ordinary play: drawing the bow from a crouch, the bow after the knife, a dialogue, two map markers, the shadow in first person, «Начать приключение». |
| D2 | I ran my checks with god mode, teleports and the remote. | Damage, falls, real input, real focus — the game the player gets. The owner's heroine takes no damage: possibly my god mode left in his save. |
| D3 | I called a narrow pass «PASS» and did not say what I left out. | The RC1 install report walked one road into the world and was read as «the build works». |
| D4 | I tested each of our mods alone. | Their crossings: archery × locomotion × camera × UI act on the same hero, keys and states — none of the crossings was walked. |
| D5 | **I wrote the remedy twice and executed it zero times.** Plan 32 (2026-10-18) named the same root — «the check went from my edit, not from the player» — and its seven steps stand unticked; plan 47 (2026-11-06, the owner's order: a crash check is active play) stands unticked, and its design leaned on god mode and the remote — the very blind spot of D2. | Everything above. A remedy written as a document did nothing; the release went out with no gate that asked for play. |

The common root: verification came from my code, under my cheats, and ended where my edit ended; the remedies lived in documents no step of the
release ever read.

## 3. Remedies — process changes held by code, not by memory

1. **The release gate.** `ConanExiles/_config/release/make_release.sh` and the GitHub publication refuse a build without a fresh **play report**: a run report
   (`testcases/reports/<date>_conan-play-<version>.md`) of at least one hour of play on the release build itself, by the player's path, with real input, no
   god mode, no teleport, no remote command during the play, a video of the session, and the coverage matrix of remedy 2 filled — every row a status.
   The gate reads the report's fields; a missing row or a `pass` without a seen observation stops the release.
2. **The coverage matrix — the source of test ideas.** One file `testcases/TC_conan_play_matrix.md`: rows = what a player does (stances: stand, crouch,
   sprint, jump, swim, climb, fall; views: first and third person; weapons and tools: bow, melee, knife, tools, switching between them; windows: inventory,
   hub, map and markers, quick loot, dialogues, crafting, building, thralls; life: damage, death, respawn, eating, save and load, a new character), columns =
   every function of our nine mods (from their notes `games/ConanExiles/mods/*.md`). A cell is a case. Ideas come from the named techniques
   (`TESTING_FRAMEWORK.md` step 2: pairwise over stance × view × weapon, state transitions for windows, error guessing from every owner bug). Every owner
   bug and every issue adds its row as a regression case.
3. **Cheats are setup only, and never stay.** God mode, teleports and spawned items prepare a stand; before any acceptance run and before the agent leaves
   a save, `god-on.sh off` is run and its «bCanBeDamaged=true» line read; the play report carries that line.
4. **«Pass» names its boundary.** Every run report carries «Not covered:» — the rows of the matrix not walked; a report without it is `partial`
   (`kaif-testrun-lint` already refuses `pass` without a functional run — the line extends it).
5. **A remedy is code in the same move.** A process plan is closed only when each remedy is a gate, a hook or a script that refuses the old way, committed
   with the plan; at the closure of a chat, an open process plan with unticked remedies is named in the farewell as debt.

## 4. Steps

- [ ] 1. File every open bug of the build as an issue (HOUSE_RULES 44) — in progress 2026-11-20.
- [ ] 2. The matrix file `testcases/TC_conan_play_matrix.md` from the nine mods' notes + the owner's bugs of 2026-11-20 and every open issue; rows / columns
      as remedy 2; show it to the owner as a page before the first play run.
- [ ] 3. The play-report template and its check (`testcases/_play-report-template.md`, a check script the gate calls); prove the check red on the RC1 install
      report (a narrow pass, no «Not covered:», no play hour).
- [ ] 4. The gate in `make_release.sh` and in the publication step; prove it red on the current RC1 tree, green on a report that fills the template.
- [ ] 5. `god-on.sh off` + the read line in the stand teardown; check the owner's working save for damage (bug: the immortal heroine) — first, before any fix.
- [ ] 6. KAIF improvement request: a process remedy left as a document (plans 32, 47, 59) — the class and the gate (remedy 5).
- [ ] 7. The health metric: the owner's next half hour of play on RC2 brings fewer findings than this one (≥ 12 in 30 min); not fewer — revise §3.

## 5. Decisions made without the owner

(at closing)
