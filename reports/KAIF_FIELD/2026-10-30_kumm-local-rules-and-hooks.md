# KUMM — local rules and hooks that appeared or changed 2026-10-16 … 2026-10-30

**Compiled:** 2026-10-30 16:29 +03:00 · **For:** the KAIF framework developer session (kaif-48) · **Question:** «какие новые правила и хуки
появились у тебя в KUMM локально за последние ~2 недели?» · **Method:** read-only — hook files, `.claude/settings.json`,
`.claude/settings.local.json`, `HOUSE_RULES.md`, `HOUSE_RULES_REFERENCE.md`, `AGENT_GUIDE.md`, `PROJECT_HISTORY.md`, `EXPERIENCE.md`,
`bugs/KAIF/*.md`, `testcases/reports/*`, `git log` / `git show`, `gh issue list|view -R MikalaiKryvusha/KAIF`.

Window fact that frames the house rules: `HOUSE_RULES.md` itself was created by the KAIF 2.9 update `396f281` (2026-10-16 23:33:09 +0300);
at that commit its §1 held no numbered rules (only a pointer to `AGENT_GUIDE.md` "Notes from the human"). So **all sixteen rules of
`HOUSE_RULES.md` §1 entered inside the window.** They were first written in Russian with quotes, compacted to bare statements on 2026-10-28
(`d7c0f57`, quotes moved verbatim to `PROJECT_HISTORY.md` lines 326–433) and translated to English (`0109bc2`).

Hook wiring today: the SHARED `.claude/settings.json` carries `context-budget` (PreToolUse `*` + UserPromptSubmit), `clock-now` (PreToolUse
`Write|Edit|MultiEdit` + UserPromptSubmit) and the KAIF-shipped `.kaif/hooks/*`. Every `tools/hooks/*` hook is wired only in the LOCAL
`.claude/settings.local.json` (not in git).

## Contents

Hooks (new or changed in the window):

1. context-budget hook — no ticket — watches the context window; at 70/75/85 % tells the agent to stop new work / close softly / close now.
2. autonomy-guard hook + AGENT_GUIDE autonomy paragraph — #182 — «…автономно» arms a mode; while armed a voluntary Stop is refused below 75 %.
3. farewell-capture hook + `/resume` Step 0 — #181 — the closing turn's last message replaces `FAREWELL_MESSAGE_FROM_THE_PREVIOUS_CHAT.md`.
4. scratch-sweep hook + HOUSE_RULES rule 15 — #183 — at session start, deletes this project's session scratchpads idle for 24 h.
5. knowledge-hook ("memory hook") + HOUSE_RULES rule 2 — #159 / #160 — at moments of novelty orders the agent to write knowledge into the md docs.
6. knowledge-hook mod-notes lock (rule 2 extension) — #186 — no mod work until `games/<Game>/mods/<Mod>.md` exists and is read this session.
7. test-after-code ("testing hook") — #176 — a code edit / deploy is a test debt; Stop is blocked until a run of its kind (also open cases).
8. clock-now hook (adopted from the local KAIF 2.10) + AGENT_GUIDE stamp line — origin #170 / #172 (filed by Unliminium; KUMM: none) — the clock fills time placeholders.

Canon blocks in `AGENT_GUIDE.md` (KUMM-local edits):

9. "The owner's word mid-turn" without echoing his words — #180 — the mid-turn answer must not open by quoting the owner.

`HOUSE_RULES.md` §1 rules (rules 2 and 15 are covered by items 5, 6 and 4):

10. Rule 1 — documents in English, chat in Russian — none — every project/KAIF document English; owner quotes and interviews Russian.
11. Rule 3 — a rule is a statement — none — rules carry no rationale/history/quotes; those go to PROJECT_HISTORY.
12. Rule 4 — smoke run on video — none — anything new is clipped and the clip watched before a verdict; UI always.
13. Rule 5 — at most two helpers — none — no more than two Agent/workflow helpers at a time.
14. Rule 6 — frame measurements after «кино выключено» — none — ask once per session by voice; his word holds.
15. Rule 7 — mods respect the CPU — none — event-driven, no per-frame scene searches, self-measuring, A-B-A acceptance.
16. Rule 8 — other authors' mods fixed natively — none — default setting or pak asset edit, marked KRINIK MODIFIED; Lua only as last resort.
17. Rule 9 — crash-report window removed at once — none — by PID, logged in the run report.
18. Rule 10 — effort in hours — none — never in "chats".
19. Rule 11 — the agent prepares its own test stand — none — interference-free stand set by the remote; a case under interference does not count.
20. Rule 12 — the agent installs CLI tools itself — none — install, check version, one line in the reference.
21. Rule 13 — voice narration while the game is open — none — restated into HOUSE_RULES in the window (older memory and hook).
22. Rule 14 — meaning, not numbers, in chat — none — name every bug/plan/case by what is seen; a number only in parentheses.
23. Rule 16 — two launch paths (front / background) — none — the owner picks; every instrument must work on both.

Closing sections: KAIF-shipped hooks and rules that arrived with the 2.9 update; known KUMM tickets that are not a local rule or hook;
older rules and hooks not changed in the window; what could not be verified.

---

## 1. context-budget hook

1. **What and where.** `.claude/hooks/context-budget.mjs` (129 lines), wired in the SHARED `.claude/settings.json` with
   `env.CONTEXT_BUDGET_WINDOW = "1000000"`; the obey-rule is in `CLAUDE.md` (paragraph «Obey the context-budget hook's hint at once…»);
   row in `HOUSE_RULES_REFERENCE.md` §6 (line 100); pointer in `HOUSE_RULES.md` §1 closing paragraph. Introduced `faeb538`
   2026-10-28 23:28:11 +0300; the `CLAUDE.md` line was Russian there and became English in `0109bc2` (2026-10-28 23:41:40). Source of the
   design: `D:\skill.md` (outside the repo — not read for this inventory).
2. **What it does.** Events: `UserPromptSubmit` and `PreToolUse` (matcher `*`). Reads the last 4 MB of `transcript_path`, takes the `usage` of
   the main session's last assistant reply (skips `isSidechain`), context = `input_tokens + cache_read_input_tokens +
   cache_creation_input_tokens`, share of the window. < 70 % silent; ≥ 70 % «Новую большую работу не начинай…»; ≥ 75 % «ПОРА ЗАКРЫВАТЬ ЧАТ…
   /end-chat-soft» (with the KUMM ritual: STATUS handover, commit+push, Conan pack `git push local main`, close own game, release machine lock);
   ≥ 85 % «СРОЧНО ЗАКРЫВАЙ ЧАТ… /end-chat-force» on every call. On PreToolUse it speaks only on entering a new 5 % step (state file
   `<tmp>/context-budget-<session>.json`); on UserPromptSubmit always while ≥ 70 %. Never blocks; any error → silent exit 0. It only hints:
   `CLAUDE.md` orders the agent to close the chat itself. Exports `lastUsage`, `contextOf`, `WINDOW`, `PCT_CLOSE` (reused by autonomy-guard).
3. **Why it appeared.** The owner asked for a hook that closes chats before auto-compaction (2026-10-28 evening, same evening as #179 on the
   `/resume` cost). The window size 1 M was set by observation: the previous chat of the same model reached 689 183 tokens
   (`testcases/reports/2026-10-28_context-budget-hook.md` §2). No EXP entry introduced it.
4. **Owner's words.** «разверни у нас такой хук… и самостоятельно закрывать чаты, когда окно заканчивается» — 2026-10-28, no time recorded —
   `.claude/hooks/context-budget.mjs:11-12` and `testcases/reports/2026-10-28_context-budget-hook.md:7-8` (the ellipsis is in the source).
5. **Ticket.** none. Not filed on its own; it is mentioned inside #179 (`bugs/KAIF/19_*.md:42`, «context-window hook that closes chats before
   auto-compaction (deployed the same evening…)») and #182 proposes shipping it together with the autonomy and farewell hooks
   (`bugs/KAIF/22_*.md:29`). `gh issue list -R MikalaiKryvusha/KAIF --state all --search "context-budget"` → no dedicated issue.
6. **What came out after.** Self-check `--check` 14/14 incl. a mutant without `cache_read` (red). Real path observed 2026-10-29 00:52 at 70.1 %
   (the PreToolUse line arrived as hook context; report case C6). EXP-0379 (2026-10-30): under «работай автономно» the agent stopped at 68 %
   «by feel» — the hook was right but nothing forced the loop; that miss produced item 2. `PROJECT_HISTORY.md:73` records a chat that «closed at
   72 % of the window by the context-budget rule» (below the 75 % threshold — recorded as written). From the code (not an observed incident):
   one small state file per session accumulates in the OS temp; the 4 MB tail read runs on every tool call.

## 2. autonomy-guard hook and the AGENT_GUIDE autonomy paragraph

1. **What and where.** `tools/hooks/autonomy-guard.mjs` (65 lines), wired in `.claude/settings.local.json` under `Stop` and
   `UserPromptSubmit`; state `.kaif/autonomy.json` (git-ignored, `.gitignore:54`); canon — `AGENT_GUIDE.md` lines 65-70 (inside the
   "AUTONOMOUS MODE" block: «In KUMM the owner's «работай автономно» / «работай сам» / «автопилот» IS the order to enter `/dayloop` at
   once…» and «Any «…автономно» is the order… an interrupt (Esc) or a task given mid-loop («чини») does not end it»); row
   `HOUSE_RULES_REFERENCE.md` §6 line 84. Introduced `280a750` 2026-10-30 09:53:13 +0300; widened `9571eaa` 2026-10-30 16:06:37 +0300.
2. **What it does.** `UserPromptSubmit`: a prompt matching `/автономн|автопилот|(работай|работать)\s+сам/i` and not the negation
   `не (работай|работать)? (автономн|сам)` switches the mode ON; a prompt STARTING with «стоп / stop / пауза / хватит / остановись» switches it
   OFF; other prompts leave it (a question mid-loop is answered and work goes on). `Stop`: mode ON → `decision: block` — under 75 % «не
   останавливайся. Бери следующий пункт беклога (/dayloop…)»; ≥ 75 % «закрывай чат: /end-chat-soft». A turn that ran `/end-chat-soft|force`
   passes and switches the mode OFF. Declared exception: `<!-- autonomy-pause: <why> -->` in the last message (everything left waits for the
   owner and he was called by voice). Reads the window via `context-budget.mjs`, the turn via `farewell-capture.mjs` `readTurn`. Fail-open.
3. **Why it appeared.** EXP-0379 (2026-10-30): «работай автономно» at 08:34 with no end time; the agent ended turns «at a natural cut» at 68 %
   of the window, never entered `/dayloop`, the chat never reached the 75 % closure and no farewell was filed. Widening: EXP-0388 — «гоу
   автономно, делаем дальше сборку» left the mode off (old pattern knew only «работай автономно / сам», «автопилот»), and after an interrupt
   and «ну так чини» the agent ended the turn.
4. **Owner's words.** 2026-10-30 ≈09:5x: «Я давал тебе команду работать автономно, не задал время, до которого работать - это значит я
   ожидал: ты работаешь автономно; когда окно контекста переполняется - ты начинаешь завершать дела, и начинаешь закрытие чата; по закрытию
   чата пишешь прощальное сообщение» · «Почему так не сработало?» — `tools/hooks/autonomy-guard.mjs:3-5`; the ticket carries a longer tail
   «…пишешь прощальное сообщение в документ FAREWELL_MESSAGE_FROM_THE_PREVIOUS_CHAT.md» — `bugs/KAIF/22_autonomy_order_needs_loop_entry_and_stop_guard.md:19-22`;
   the order itself: «я закончил, комп твой» · «работай автономно» (08:34) — `PROJECT_HISTORY.md:73`. 2026-10-30 ≈16:00: «гоу автономно,
   делаем дальше сборку» and «а чего ты стал? … или я не говорил работать автономно?» — `tools/hooks/autonomy-guard.mjs:24-25`; «ну так чини»
   — `EXPERIENCE.md:97`.
5. **Ticket.** #182 (`bugs/KAIF/22_*.md`, delivered 2026-10-30, open).
6. **What came out after.** `tools/test-guards.mjs` part K: 10 cases at birth (proved against a never-blocking mutant: 3 red), +3 at the
   widening («гоу автономно», «давай автономно» arm; «не работай автономно» does not) — red on the old pattern (180 of 183), green after (183
   of 183). Hole 1 (fixed 16:06): pattern too narrow (EXP-0388, `class: guard-pattern-too-narrow`). Hole 2 (canon, not code): an interrupt /
   a mid-loop task read as the loop's end — now a sentence in `AGENT_GUIDE.md:69-70`. Side effect found live: the guard's Stop refusals earlier
   in a closing turn set `stop_hook_active` on the first stop after `/end-chat-soft`, and the farewell hook skipped it (11:4x) — fixed in
   farewell-capture (item 3), i.e. the guard's live Stop refusal was itself observed then (`tools/hooks/farewell-capture.mjs:72-74`). The
   2026-10-30 run report `testcases/reports/2026-10-30_autonomy-guard-wider-order.md` says «partial» (arming proven on the owner's words; Stop
   refusal after the widening not yet observed). From the code, not observed: any prompt that merely mentions «автономн…» (e.g. a question
   about it) arms the mode; OFF works only at the start of a message; with no `usage` in the transcript the window counts as 0 % (always «work on»).

## 3. farewell-capture hook and `/resume` Step 0

1. **What and where.** `tools/hooks/farewell-capture.mjs` (99 lines), wired in `.claude/settings.local.json` `Stop`, after
   `no-permission-question`; output `FAREWELL_MESSAGE_FROM_THE_PREVIOUS_CHAT.md` at the project root (+ `.state` file), git-ignored; reader —
   `.claude/skills/resume/SKILL.md` "Step 0. The first `/resume` of a chat — read the previous chat's farewell" (lines 15-27); row
   `HOUSE_RULES_REFERENCE.md` §6 line 83. Introduced `76a02f9` 2026-10-30 07:55:02 +0300; fixes `0badf8c` (08:26:23), `5b3b2ac` (08:28:36, a
   stamp in the header that ran ahead of the clock corrected ≈08:3x → ≈08:26), `280a750` (09:53:13, made import-safe for autonomy-guard),
   `084190c` (11:58:17).
2. **What it does.** `Stop`: finds the current turn (records after the last real owner prompt), detects a closure (Skill tool with
   `end-chat-soft|force`, or `<command-name>/end-chat-…</command-name>`), takes `last_assistant_message` or the transcript text after the last
   tool call, and atomically (tmp + rename) replaces the farewell file. A turn without a closure leaves the file alone. One closure writes once
   (closure id kept in `.state`). Never blocks; fail-open.
3. **Why it appeared.** The owner copied each farewell into the next chat by hand. Follow-ups: the knowledge-hook / STATUS-guard Stop blocks
   after the farewell made the agent answer «новых знаний нет», which would overwrite the farewell (`0badf8c`); then the opposite failure at
   11:4x — the first stop after the closure already carried `stop_hook_active` (earlier autonomy-guard refusals in the same turn) and the file
   was never written (`084190c`). EXP-0383 (13:10–13:52): after the farewell a Stop hook fired and the agent repeated the whole farewell.
4. **Owner's words.** 2026-10-30 ≈07:45: «это нужно чтобы по хуку ты записывал в FAREWELL_MESSAGE_FROM_THE_PREVIOUS_CHAT.md, полностью стирая
   то, что там была, и оставляя только твоё прощальное сообщение» · «Я все равно каждый раз это руками копирую и вставляю в новый чат, а так
   оно будет автоматически в файл собираться» — `tools/hooks/farewell-capture.mjs:4-6`. ≈08:26: «оно не будет конфликтовать с сообщением о
   записе знаний чата?» — `tools/hooks/farewell-capture.mjs:14-15`. 11:4x: «опять расходится твое сообщение с тем, что в FAREWELL_MESSAGE…» —
   `tools/hooks/farewell-capture.mjs:73-74` (ellipsis in the source). 13:5x: «почему и зачем ты прощальное сообщение дважды повторил в чате?» —
   `EXPERIENCE.md:149` (EXP-0383) and `tools/hooks/knowledge-hook.mjs:125-126`.
5. **Ticket.** #181 (`bugs/KAIF/21_*.md`, open).
6. **What came out after.** Two fixes in four hours (above); `tools/test-guards.mjs` part J — the second-stop case split in `084190c` into
   «first stop after closure with `stop_hook_active` must write» (red on the old hook — exactly the live failure) and «second stop of the same
   closure must keep it»; 180 of 180 then. Report `testcases/reports/2026-10-30_farewell-capture-hook.md` — «partial» (works on a real closed
   transcript; live firing inside a closing turn still to be observed). EXP-0383 records that the file did hold the 13:10:16 farewell, i.e. a
   live write happened; yet the header marker still reads `[NOT-TESTED]` (stale relative to EXP-0383). Behaviour rule for the agent from
   EXP-0383: a Stop-hook question after the farewell gets a one-line answer, never a repeated farewell; the knowledge-hook was made silent on
   Stop in a closed chat (item 5).

## 4. scratch-sweep hook and HOUSE_RULES rule 15

1. **What and where.** `tools/hooks/scratch-sweep.mjs` (91 lines), wired by the owner in `.claude/settings.local.json` `SessionStart`
   matcher `startup` (2026-10-30 11:59); rule — `HOUSE_RULES.md` §1 rule 15 (lines 59-63). Introduced `ff8c9dd` 2026-10-30 10:37:26 +0300
   (hook + rule 15); `fe15335` 11:59:57 records the owner's wiring. No row in `HOUSE_RULES_REFERENCE.md` §6 (grep finds none); listed in
   `PROJECT_STRUCTURE_EXTERNAL_MAP.md`.
2. **What it does.** `SessionStart` (source `startup` only): under `<TEMP>/claude/<project-slug>/`, every session directory except the current
   one whose newest write is older than 24 h is deleted file by file, then empty directories bottom-up (recursive delete is forbidden on this
   machine). Refuses a root outside `<TEMP>/claude` (unless `SCRATCH_SWEEP_ANY_ROOT`). Prints one line into the agent's context
   («убрано черновиков…» / «черновиков старше 24 ч нет»). `--dry-run`, `--root`, `--session` for tests. Rule 15 adds: delete heavy working
   files when a piece of work is done; what a later chat needs goes into a repository, never a scratchpad; work trees outside the scratchpad
   (`_paksview-*`, `_text-extract-*`) are named in STATUS with size and owning task, and go when the task closes.
3. **Why it appeared.** D: had 8 GB free; 168 GB sat in scratchpads of closed sessions and 54 GB in a forgotten unpack (`ff8c9dd` message;
   `tools/hooks/scratch-sweep.mjs:5-6`). EXP-0380: the agent promised «≈95 GB back» for 85 GB measured by `du` and freed 28 GB — hard links;
   leftovers were left as «the owner's call» in a handover.
4. **Owner's words.** 2026-10-30 ≈10:5x: «и как-то нужно, чтобы ИИ агенты сами за собой прибирались...» · «если оно нужно для работы - ок» ·
   «если работа сделана, и оно больше не нужно - хорошо бы удалять мусор» — `tools/hooks/scratch-sweep.mjs:4-5`; the first phrase also in
   `EXPERIENCE.md:186` (EXP-0380).
5. **Ticket.** #183 (`bugs/KAIF/23_*.md`, open). Related KUMM ticket in the window: #177 (`bugs/KAIF/17_*.md`, origin self-test sandboxes
   `kaif-sbx-*` leak 757 folders / 44.5 GB in TEMP).
6. **What came out after.** `tools/test-guards.mjs` part L, 6 cases (idle removed; fresh and current kept, even an old current one; dry run
   deletes nothing; foreign root refused; garbage stdin → exit 0); mutant without the current-session check red. The agent could not wire it
   itself — the auto-mode classifier refused the agent's own settings edit, the owner wired it (`ff8c9dd`, `PROJECT_HISTORY.md:43`). Real
   sweep: a 10:35 dry run on the real root named 24 idle (empty) dirs and kept 23; the first real sweep was due at the next chat's start and is
   not recorded anywhere I found (header still `[NOT-TESTED]`, `ON-REAL-PATH: NOT YET`). Named GAPs: a session parked by `/pause` for more than
   24 h is swept too; hard links free space only when no other name remains. The «closure step» half of #183 is not in the local
   `/end-chat-soft` / `/end-chat-force` skills (no commit touched them in the window; grep finds no cleanup step).

## 5. knowledge-hook ("memory hook") and HOUSE_RULES rule 2

1. **What and where.** `tools/hooks/knowledge-hook.mjs` (320 lines today), wired in `.claude/settings.local.json` on `UserPromptSubmit`,
   `PostToolUse` (matcher `*`), `Stop`, and since item 6 also `PreToolUse` (`Bash|PowerShell|Edit|Write`); rule — `HOUSE_RULES.md` §1 rule 2
   (lines 11-17); row `HOUSE_RULES_REFERENCE.md` §6 line 87; research basis `researches/agent-memory-hook-psychology/README.md`. Introduced
   `befce6f` 2026-10-18 02:08:12 +0300 (hook + the Russian rule «Знания о проекте записываются в момент понимания нового — как это делает
   мозг»); changed `987ff46` 2026-10-30 13:54:10, `bbe7b58` 14:34:21 and `7c3751c` 16:21:31 (the last two — item 6).
2. **What it does.** Adds an order into the agent's context — «Это что-то новое? … ТЫ ОБЯЗАН ЭТО ЗАДОКУМЕНТИРОВАТЬ. Что-то изменилось? … ТЫ
   ОБЯЗАН ЭТО ОТРЕДАКТИРОВАТЬ…» plus where to write — at moments: the owner's word (`UserPromptSubmit`; stronger wording when emphatic: caps,
   «!!», «НЕТ»); an unexpected outcome (`PostToolUse` of a shell command whose output has error/fail/denied/«не найден»…); a meeting with
   reality (WebSearch/WebFetch, decompilation, game-remote dumps); a recalled memory (`Read` of a knowledge doc); otherwise «compare». One
   shared habituation window: at most once per 10 min. A closing order in the owner's word («закрыва…», «end-chat», «/pause»…) — always, no
   window. `Stop` (not `stop_hook_active`): `decision: block` with «есть ли новое знание…? нет — скажи одной строкой» (own 10-min window).
   Since `987ff46`: silent on Stop once the transcript contains `/end-chat-soft|force`. Fail-open. Rule 2 adds the routing table (GOAL, plan,
   HOUSE_RULES, reference, maps, game maps, mod notes, researches) and «before asking the owner about a subsystem, read its map line».
3. **Why it appeared.** 2026-10-18 night: the owner saw the project worked on for hours with its state undocumented; the maps had no
   carrier for "update the map" (#159). EXP-0308 (2026-10-18, the agent asked the owner about the HUD subsystem without reading the map) is
   the source of the «read the map line first» step. `987ff46`: EXP-0383 (repeated farewell after the reflection block).
4. **Owner's words.** 2026-10-18 (no time in the header): «какого хуя ты разрабатываешь проект, и нихуя не ДОКУМЕНТИРУЕШЬ ПО ХОДУ ЕГО
   СОСТОЯНИЕ!» · «ХУК ЗАВЕСТИ И ЗАРЕГИСТРИРОВАТЬ: ВСЕ РАБОТЫ И ЗНАНИЯ ДОКУМЕНТИРУЮТСЯ!!!!!!!! АГЕНТ ПОМНИТ И ЗНАЕТ СВОЙ ПРОЕКТ НА ВЫСОКОМ
   ПРОДУКТОВОМ И ФУНКЦИОНАЛЬНОМ УРОВНЕ!» · «А хук, который предписывает агенту: "Это что-то новое? Такого не было в проекте, и теперь будет вот
   так? Ты ОБЯЗАН ЭТО ЗАДОКУМЕНТИРОВАТЬ!"» · «Что то изменилось? Документы со знаниями говорят по-другому? ТЫ ОБЯЗАН ЭТО ОТРЕДАКТИРОВАТЬ,
   актуализировать, удалить устаревшее, написать новое!» · «он должен срабатывать на кажом ПООНИМАНИИ НОВИЗНЫ!!!!!!» · «того, как проеккт
   менячется идейным и смысловым наполнением!» · «не стоп хук!» · «а на каждом git commit, НЕТ!!!!!!!!» · «мозг человека не привязывает хуки к
   коммитам» — `tools/hooks/knowledge-hook.mjs:5-10`. Further 2026-10-18 quotes on comparison, closing/reflection and the 10-minute window —
   `tools/hooks/knowledge-hook.mjs:60-61`, `:65-67`, `:108` (e.g. «не нужно часто этот хук вызывать» · «не чаще раза в 10 минут будет
   достаточно»). 2026-10-30 13:5x for `987ff46`: «почему и зачем ты прощальное сообщение дважды повторил в чате?» · «починишь это поведение?» —
   `tools/hooks/knowledge-hook.mjs:123-126`.
5. **Ticket.** #159 (defect: maps not updated as work goes, `bugs/KAIF/13_*.md`) and #160 (improvement: a mandatory memory hook,
   `bugs/KAIF/14_*.md`), both filed 2026-10-18, open. Note: ticket 24 (#186) says in its dedup line «the knowledge hook of this project is
   local, never filed» — that contradicts #160; #160 exists.
6. **What came out after.** `--selftest` 13 of 13 at birth + live run of all four moments 2026-10-18 02:04–02:06 (report
   `testcases/reports/2026-10-18_knowledge-hook.md`, pass). False alarm recorded in the GAP: «unexpected outcome» fired on the word «ошибка»
   inside found text (2026-10-18) — narrowed to shell output only; residual false alarms damped by the 10-minute window. Hole fixed
   `987ff46`: the reflection block after the farewell (EXP-0383) — selftest M12, red on the version before. GAP named in the header: the hook
   sees the MOMENT, not the meaning; a novelty that comes only in the agent's reasoning is invisible to it.

## 6. knowledge-hook mod-notes lock (rule 2 extension)

1. **What and where.** Same file, function `notesGate` (`tools/hooks/knowledge-hook.mjs` from line 130); notes directory
   `games/ConanExiles/mods/` (hard-coded), manifest `D:/work/ai_sandbox/ConanExiles/modpack.json` (hard-coded); rule — `HOUSE_RULES.md` §1
   rule 2, lines 13-17 («a mod of a build — its ONE notes file `games/<Game>/mods/<Mod>.md`… Work on a mod starts by reading its notes, once per
   session, in its own tool call; the knowledge-hook refuses the work until then»). Introduced `bbe7b58` 2026-10-30 14:34:21 +0300; fixed
   `7c3751c` 16:21:31.
2. **What it does.** `PreToolUse`: mod work = study commands (`patch-mod-asset.py extract <Mod>`, `kismet-trace.py` / `uaj exports|func|dump`
   on a `/Mods/<Mod>/` path, `retoc … to-legacy … --filter <Mod>`), a single-mod deploy (`Deploy-ModPack.ps1 … -Only <Mod>`) or an Edit/Write
   under `ConanExiles/_unpacked/<Mod>/` → `permissionDecision: deny` if `games/ConanExiles/mods/<Mod>.md` does not exist («Сначала заведи его…»)
   or was not `Read` earlier in this session's transcript («сначала прочитай свой конспект… (один раз за сессию)»). `PostToolUse` after a study
   → «Найденное — тем же ходом в <notes>», no habituation. `Stop`: blocks if a mod was studied and its notes were not edited after the last
   study. Since `7c3751c`: a `retoc --filter` name counts as a mod only if it has notes or a manifest entry.
3. **Why it appeared.** EXP-0384 (2026-10-30): asked to change how the Hosav HUD blinks, the agent extracted and traced the widget from
   scratch although five facts about it stood in the game map, scattered by topic; a week of edits had left no notes on the mod.
   `7c3751c`: `retoc --filter WBP_ContainerInfo` (a vanilla game widget) was denied as «mod without notes» (16:1x).
4. **Owner's words.** 2026-10-30 ≈14:25–14:33: «странно, что ты над модами этими уже неделю работаешь и у тебя НЕ ЗАПИСАНЫ ПО НИМ
   КОНСПЕКТЫ!!!» · «и ты их каждый раз по-новой словно разбираешь, как первый раз видишь!» · «КАИФ ДОЛЖЕН ТЕБЯ ОБЯЗЫВАТЬ ДОКУМЕНТИРОВАТЬ ТВОИ
   ЗНАНИЯ!!!» · «Правь хук записи знаний о проектах!» · «не всегда повторное нужно обязательно все перечитывать, а умно! Думаешь "Ага, нужно
   поработать с этим модом. Иду читать мой по нему конспект!"» — `tools/hooks/knowledge-hook.mjs:130-133`. For the 16:1x fix: no verbatim
   words recorded.
5. **Ticket.** #186 (`bugs/KAIF/24_*.md`, open).
6. **What came out after.** Selftest M13–M18 (deny without notes / unread, pass after read, prompt after study, Stop block, no loop on
   `stop_hook_active`); live 2026-10-30 ≈14:4x: `extract UIMod_Hosav` before the read — deny; after a Read in its own call — pass + prompt.
   Found live: a Read in the SAME message as the command is not in the transcript yet → still deny (now in rule 2 «in its own tool call»).
   False positive (fixed 16:21): vanilla asset by `retoc` locked as a mod — selftest M19 red on the old code, green now; live `retoc --filter
   WBP_ContainerInfo` passed. Report `testcases/reports/2026-10-30_knowledge-hook-mod-notes-lock.md` — pass. From the code (not an
   observed incident): the lock knows only Conan (notes dir and manifest are hard-coded); other games' mods are not gated.

## 7. test-after-code ("testing hook")

1. **What and where.** `tools/hooks/test-after-code.mjs` (337 lines), wired in `.claude/settings.local.json` on `PostToolUse`
   `Write|Edit|MultiEdit|Bash|PowerShell` and `Stop`; state `.kaif/test-debt.json` (outside git); row `HOUSE_RULES_REFERENCE.md` §6 line 88.
   Introduced `5c71c7c` 2026-10-25 11:12:41 +0300 (ported from Unliminium `D:\work\UnliminiumTheDigitalGame\tools\hooks\test-after-code.mjs`);
   `1605464` 12:00:21 (test-guards part I); changed `e6ea6b9` 2026-10-25 16:32:32, `361a226` 2026-10-26 12:45:30, `0567c63` 13:15:11 (header
   evidence line only), `3c11641` 2026-10-28 22:30:27, `4cde408` 2026-10-30 15:33:37.
2. **What it does.** A code edit in any repo under `D:\work\ai_sandbox` becomes a debt of a kind: `engine` (`KUMM/kumm.mjs`,
   `Deploy-ModPack.ps1`) cleared by core tests / `fixture-pack.mjs`; `game` (`.lua`, non-KUMM `.cs`, and since `e6ea6b9` build data —
   `modpack.json`, `.ini`, `.locres`, `.pak` outside KUMM — and deploys: `Deploy-ModPack -Deploy` without `-DryRun`, `deploy-localization.py`,
   `deploy-hot/cold.sh`, `translation_deploy.sh`; since `361a226` any `cp/copy/Copy-Item/robocopy/mv` into a game folder) cleared by a live game
   run (`run-game.sh`, `h.sh`, `launch-bg.ps1`, since `4cde408` `launch-fg.ps1`, `capture-window.ps1`, `measure-walk.sh`, `tools/test-*.mjs`
   except `test-guards`); a deploy the game reads at start is cleared only by a LAUNCH after it; `tool` (other scripts) cleared by running the
   file itself. `--check`, `--help`, `py_compile` never clear. First order full («ТЫ НАПИСАЛ КОД — ПРОТЕСТИРУЙ ЕГО…»), then short. `Stop` with
   debt → block; repeated stop without new edits → pass (no loop). Since `3c11641`: a `[NOT-TESTED]` or `blocked` row in a `testcases/TC_*.md`
   touched in the last hours is debt too («КЕЙСЫ БЕЗ ПРОГОНА…»). Escape: `--waive "<почему>"` (recorded in `waivers`).
3. **Why it appeared.** The owner's order to port the Unliminium hook (code → tests → fixes loop, no permission questions). Changes: 2026-10-25
   Severe Weather, `r.Fog=1` and a 7 147-entry translation went into the game and the hook stayed silent (`e6ea6b9`); 2026-10-26 paks copied
   by plain `cp` made no debt and a frame of an OLD session cleared a deploy debt (EXP-0341, `361a226`); 2026-10-28 case S3 «дзинь» stayed
   `blocked` while the hook was silent (`3c11641`); 2026-10-30 the new foreground launcher must count as a run (`4cde408`).
4. **Owner's words.** Unliminium 2026-10-24 17:59: «Аггент что-то запрограммировали -> ХУК приказывает это протестировать! -> … -> чинит.
   Программирует дальше -> ХУК ПРИКАЗЫВАЕТ ЭТО ПРОТЕСТИРОВАТЬ!!!!» · «Агент не просит разрешения у владельца!»; KUMM 2026-10-25 ≈11:10: «сходи
   в проект цифровой игры UInliminium - возьми оттуда хук в KUMM про цикл код - тесты - правки - код - тесты - правки» —
   `tools/hooks/test-after-code.mjs:3-6`. 2026-10-25: «в мире не видел - почему хук тебя не дернул» — `:66`. 2026-10-26: «игре я это ещё не
   видел - почему хук тебя не дернул» — `:86`. 2026-10-28 22:2x: «почему тебя не дёрнул хук?» — `:128`.
5. **Ticket.** #176 (`bugs/KAIF/16_*.md`, open); the origin of the idea is Unliminium's #175.
6. **What came out after.** Selftest 14 steps green at birth, mutant without the debt write red on 6 points; live 2026-10-25 11:11 order and
   clear (report `testcases/reports/2026-10-25_test-after-code-hook.md`, pass). Three holes closed by the owner's «почему хук тебя не дернул»
   (deploys/data — old version red in 5 points; `test-guards` clearing game debt — red in 1 point; `cp` into the game dir and a stale-session
   frame clearing a deploy — two mutants red). Open-cases extension: mutant «openCases пуст» red in 2 points; live Stop 2026-10-28 22:3x
   blocked with 15 cases without a run. Open GAPs named in the header: it sees that a run HAPPENED, not what it checked; code written by a
   Bash heredoc is invisible; a file name in a command is a sign of a run, not proof; `--waive` lets the agent excuse itself (visible in
   `waivers`); the open-cases part is still marked `[NOT-TESTED]` at `:129`.

## 8. clock-now hook (adopted) and the AGENT_GUIDE stamp line

1. **What and where.** `.kaif/hooks/clock-now.mjs` (109 lines) — byte-identical to `D:\work\ai_sandbox\KAIF\framework\hooks\clock-now.mjs`
   (checked by `cmp` for this inventory); wired in the SHARED `.claude/settings.json` on `UserPromptSubmit` and `PreToolUse`
   `Write|Edit|MultiEdit`; canon — one bullet in `AGENT_GUIDE.md` "A stamp carries the DATE AND THE TIME" (line 848, «In KUMM the clock
   writes it…»); row `HOUSE_RULES_REFERENCE.md` §6 line 86. Introduced `01c8126` 2026-10-30 16:08:32 +0300 — taken from the local KAIF 2.10
   source today, not delivered by a KAIF update.
2. **What it does.** `UserPromptSubmit` → one English context line with the machine's local moment. `PreToolUse` of a write → the placeholder
   words NOW · NOW-ISO · DATE · TIME in white square brackets (U+27E6/U+27E7) inside `content` / `new_string` / `edits[].new_string` are
   replaced by the clock's values via `updatedInput` (no `permissionDecision`, `old_string` untouched; a backslash keeps a placeholder
   literal). Silent when nothing changes; fail-open. The KUMM canon line adds: in a shell write, probe `date` in the same call.
3. **Why it appeared.** KUMM's history of stamps ahead of the clock (the older `stamp-gate` and commit gate exist for that; one more such
   correction happened inside the window — `5b3b2ac`, «≈08:3x» → «≈08:26» in the farewell-capture header). The direct trigger was the owner
   pointing at the hook in the local KAIF.
4. **Owner's words.** «бери себе этот хук» — 2026-10-30, no time recorded — commit subject of `01c8126` and `HOUSE_RULES_REFERENCE.md:86`.
5. **Ticket.** For KUMM: none. The hook's origin tickets are #170 and #172, both filed by Unliminium (`gh issue view 170|172`).
6. **What came out after.** `--selftest` 7 of 7 in KUMM; live 16:07 — a probe file written with the NOW and TIME placeholders landed as
   «2026-10-30 16:07 +03:00» and «16:07» (`01c8126` message). No KUMM run report file; the byte-copied header still says `[NOT-TESTED: no live
   Claude Code session has run it yet…]` — true for the origin, stale for KUMM. Interaction risk (from reading, not observed): any document
   that quotes the placeholders literally is rewritten on Write/Edit unless escaped (this report avoids the bracket characters for that reason).

## 9. AGENT_GUIDE "The owner's word mid-turn" — no echo of his words

1. **What and where.** `AGENT_GUIDE.md` section "The owner's word mid-turn — the system signs its author" (line 721), step 2 rewritten:
   «Answer it AT ONCE — your next output, before any further tool call — by its kind, AS TEXT, without repeating his words back to him».
   Commit `447d8e6` 2026-10-29 10:24:53 +0300. A local edit of a KAIF-shipped section.
2. **What it does.** Prose rule, no hook: the mid-turn answer opens with the answer, never with a quote of the owner's message.
3. **Why it appeared.** The agent opened its mid-turn answers with the owner's words in quotes, as the shipped step 2 demanded
   (`PROJECT_HISTORY.md:288`). No EXP id.
4. **Owner's words.** 2026-10-29 (≈10:2x by the chronicle heading): «"Уверен, что исправлено" про падение в главном меню · убери , где в KAif
   тебе сказано повторять то, что я написал. Не нужно повторять мои слова» — `PROJECT_HISTORY.md:288-290`.
5. **Ticket.** #180 (`bugs/KAIF/20_*.md`, open). Related earlier origin issue #156 (2026-10-17, author not checked).
6. **What came out after.** Nothing further recorded (no later commit on the section in the window).

## 10. HOUSE_RULES rule 1 — documents in English, chat in Russian

1. **What and where.** `HOUSE_RULES.md` §1 rule 1 (lines 9-10); `AGENT_GUIDE.md` "Notes from the human" bullet «The chat is Russian; every
   document is English» (lines ~1209-1215) and the "Owner's working language" row; `CLAUDE.md` last line. Commit `0109bc2` 2026-10-28
   23:41:40 +0300 (supersedes the 2026-08-15 «Working language is Russian»); bulk translation `dbb2a8e` 23:44:46.
2. **What it does.** All project and KAIF documents in English; owner quotes, interviews and the `README.md` storefront stay Russian; older
   Russian documents are rewritten when taken into work. Commit messages English since 2026-10-28.
3. **Why it appeared.** Said in the conversation about the token cost of `/resume` (#179) — per the auto-memory file below; the commit gives
   no incident. No EXP id.
4. **Owner's words.** Not in the repository: the commit message `0109bc2` gives only a paraphrase («Слово владельца 2026-10-28: чат с
   владельцем по-русски, вся документация проекта и KAIF - по-английски…»). The only verbatim fragment found is outside the repo, in the
   agent's auto-memory `%USERPROFILE%\.claude\projects\d--work-ai-sandbox-KUMM\memory\docs-in-english-chat-in-russian.md:3`: «ИИ агент
   продолжает общаться с владельцем на РУССКОМ в чате, но в своих документах… на английском» (2026-10-28, no time; ellipsis in the source).
5. **Ticket.** none from KUMM. (#184, open, is the same idea from another — anonymized QA — project.)
6. **What came out after.** `0109bc2` translated STATUS, HOUSE_RULES, GOAL; `dbb2a8e` KAIF_FRAMEWORK, MASTER_PLAN, directory READMEs. The
   Russian-writing gate (`russian-gate`, older) still applies to any Cyrillic written into a file, including quotes in English documents.

## 11. HOUSE_RULES rule 3 — a rule is a statement

1. **What and where.** `HOUSE_RULES.md` §1 rule 3 (lines 18-19). Commit `d7c0f57` 2026-10-28 23:37:07 +0300 (the compaction: rules as
   statements, stands/routes/tools moved to `HOUSE_RULES_REFERENCE.md`, quotes moved verbatim to `PROJECT_HISTORY.md` 326-433); `a81730e`
   brought the environment dossier back into HOUSE_RULES §3.
2. **What it does.** Only important and critical instructions; what to do in steps; no rationale, history or quotes in the rulebook.
3. **Why it appeared.** The `/resume` entry cost (#179): by `kaif check` the entry estimate fell 112 → 89 k tokens (`d7c0f57` message).
4. **Owner's words.** no verbatim words recorded (`d7c0f57` paraphrases: «По слову владельца 2026-10-28: правила без обоснований и истории,
   только важное и критичное»).
5. **Ticket.** none (the cost problem itself is #179).
6. **What came out after.** Every later rule (14, 15, 16) was written in this form with a one-line pointer to the verbatim source.

## 12. HOUSE_RULES rule 4 — smoke run of anything new on video; UI always

1. **What and where.** `HOUSE_RULES.md` §1 rule 4 (lines 20-23). Introduced `036f367` 2026-10-18 03:06:12 +0300.
2. **What it does.** Clip by `SvarogsDream/tools/rec_clip.sh` (desktop HDR off first), watched before the verdict (frame sheet, ffmpeg tiles
   for transitions), one line in the case; a UI case without a watched clip does not get `pass`.
3. **Why it appeared.** Svarog bug 54: a red panel on the first set switch that before/after frames would not catch (`PROJECT_HISTORY.md:343-344`).
4. **Owner's words.** 2026-10-18 ≈02:31: «вообще полезно для всего нового функционала на смоук тестах видео писать и смотреть» · «особенно
   когда это GUI» — `PROJECT_HISTORY.md:342-343`.
5. **Ticket.** none.
6. **What came out after.** Only the compaction/translation. Not checked: whether later UI cases complied.

## 13. HOUSE_RULES rule 5 — at most two helpers

1. **What and where.** `HOUSE_RULES.md` §1 rule 5 (line 24). Introduced `cadcc04` 2026-10-25 20:28:59 +0300.
2. **What it does.** At most two Agent/workflow helpers at a time; big work is cut and queued.
3. **Why it appeared.** The agent ran more than two helpers (2026-10-25, Conan translation of all mods). No EXP id found.
4. **Owner's words.** 2026-10-25 20:09: «мы же договаривались на не более 2» — `PROJECT_HISTORY.md:352`.
5. **Ticket.** none.
6. **What came out after.** Nothing recorded beyond the compaction.

## 14. HOUSE_RULES rule 6 — frame measurements only after «кино выключено»

1. **What and where.** `HOUSE_RULES.md` §1 rule 6 (lines 25-28). Introduced `cadcc04` 2026-10-25 20:28:59 +0300; step 4 added `3fe6598`
   2026-10-26 01:21:11.
2. **What it does.** Ask once per working session, by voice (`voice_say.py`), wait for the answer; his word holds until he says otherwise;
   the measurement is a separate step at the end of a batch; the report carries «кино владельца: выключено, его слово <время>», else it is a draft.
3. **Why it appeared.** The owner's movie loads the GPU and spoils frame-time measurements; then the agent asked again before every batch.
4. **Owner's words.** 2026-10-25 20:22: «когда будешь тестить fps - скажи мне, я выключу кино, потому что оно купает GPU» —
   `PROJECT_HISTORY.md:358-359`. 2026-10-26 01:01: «выключено кино, заебал ты с ним» — `PROJECT_HISTORY.md:365-366`.
5. **Ticket.** none.
6. **What came out after.** The re-asking hole closed by step 4 (`3fe6598`, «don't re-ask»).

## 15. HOUSE_RULES rule 7 — mods of any game respect the CPU

1. **What and where.** `HOUSE_RULES.md` §1 rule 7 (lines 29-32). Introduced `af2c74c` 2026-10-26 01:25:04 +0300 (extends the Svarog
   budget rule of `MASTER_PLAN.md` to every game).
2. **What it does.** Game-thread work only on game events, no timer polling; scene searches no more often than an event, never per frame; each
   mod logs its own handler time once a minute; an edit is accepted by an A-B-A flight (median `MsCPUBusy`, stutters no worse).
3. **Why it appeared.** Conan measurement: UE4SS took a quarter of a core (`PROJECT_HISTORY.md:370`; main-thread runs MT1-MT4 in `3fe6598`).
4. **Owner's words.** 2026-10-26 ≈01:23: «и я просил ИИ агента переписывать моды его уважительно к ЦПУ» — `PROJECT_HISTORY.md:369-370`.
5. **Ticket.** none.
6. **What came out after.** Rule 8 (next day) narrowed the Lua route further. Related later lesson EXP-0360 (2026-10-28, Lua mods on the game
   thread, Conan crash bug 66) — linked by topic, not checked as a consequence.

## 16. HOUSE_RULES rule 8 — other authors' mods are fixed natively

1. **What and where.** `HOUSE_RULES.md` §1 rule 8 (lines 33-37). Introduced `a6d645a` 2026-10-26 09:41:25 +0300.
2. **What it does.** A mod's own setting → change its default in our shipment; otherwise edit its pak (`retoc to-legacy` → UAssetGUI JSON →
   edit → `retoc to-zen`) by a re-appliable script next to the pak; bytecode strings the same way; mark the mod **KRINIK MODIFIED** in the
   shipment; a Lua UI fix only when the asset will not yield — once, no polling, with an A-B measurement.
3. **Why it appeared.** The agent proposed fixing overlaps of Simple Modlist, Hosav, Simple Minimap, Damage Meter by a Lua mod on widget
   creation (`PROJECT_HISTORY.md:378-379`). Technique lessons in the window: EXP-0338, EXP-0342 (native patch, bytecode) — by topic.
4. **Owner's words.** 2026-10-26 09:14: «луа хуки - это дополнительные перехваты» · «они и комп грузят» · «и тормозят - как мерцающие
   переводы» · «почему бы НАТИВНО не фиксить» · «правим чужие моды напрямую, для оптимизации и скорости, для адекватности работы» —
   `PROJECT_HISTORY.md:377-380`. 2026-10-26: «если у мода есть своя настройка - то просто в поставке мода меняем значение по умолчанию» —
   `:383`; «и в поставке модов будем писать, что KRINIK MODIFED - для таких модов» — `:389` (spelling «MODIFIED» in the rule is an `[AI]` fix).
5. **Ticket.** none.
6. **What came out after.** Item 6 (mod notes lock) is the knowledge side of the same native work; nothing else recorded on the rule.

## 17. HOUSE_RULES rule 9 — the crash-report window is removed at once

1. **What and where.** `HOUSE_RULES.md` §1 rule 9 (lines 38-40). Introduced `5676688` 2026-10-26 19:41:44 +0300.
2. **What it does.** After a crash in the agent's run: `Get-Process CrashReportClient` → `Stop-Process -Id <PID>` (never by name; a hung game
   also by PID); the run report says «окно отчёта о падении закрыто, PID …».
3. **Why it appeared.** After the 18:03 crash the `ConanSandbox Crash Reporter` window stayed on the owner's screen (`PROJECT_HISTORY.md:394`).
4. **Owner's words.** 2026-10-26 ≈19:39: «убирай за собой окна креш репортов, пожалуйста» — `PROJECT_HISTORY.md:393`.
5. **Ticket.** none.
6. **What came out after.** Nothing recorded on the rule; crashes continued in the window (EXP-0386, EXP-0387 — three on 2026-10-30), compliance
   with the window-close line not checked.

## 18. HOUSE_RULES rule 10 — effort in hours

1. **What and where.** `HOUSE_RULES.md` §1 rule 10 (line 41). Introduced `5e06f93` 2026-10-26 15:52:13 +0300.
2. **What it does.** Every effort estimate (tables of `/what-next`, plans, answers) in hours of agent work; «chat» is never a unit.
3. **Why it appeared.** A `/what-next` table with a column «0,5 чата» (`PROJECT_HISTORY.md:402`).
4. **Owner's words.** 2026-10-26 ≈15:50: «прекрати оценивать усилия в чатах, оцениваем в часах» — `PROJECT_HISTORY.md:401`.
5. **Ticket.** none.
6. **What came out after.** Nothing recorded.

## 19. HOUSE_RULES rule 11 — the agent prepares its own test stand

1. **What and where.** `HOUSE_RULES.md` §1 rule 11 (lines 42-52). Introduced `3c11641` 2026-10-28 22:30:27 +0300; quotes extended `ee15b4c`
   22:30:33; lessons `c8fc876` 23:06:57 (EXP-0363–0365).
2. **What it does.** A "stand" step before the first case (place, creature, behaviour, weapon, time of day, weather — how each is set by the
   remote); place without enemies/companions/construction; hero fitted (god mode, spawned arrows/gear, bows, stamina); the creature spawned,
   frozen, pacified or killed; the agent does the case's action itself; interference → remove and repeat, a case under interference does not
   count; the stand recipe goes into the game map.
3. **Why it appeared.** Case S3: the agent waited for an archer nearby and measured on enemies hitting the hero (`PROJECT_HISTORY.md:411`;
   EXP-0365 «замер на помехе»). The same commit extended the testing hook to open cases (item 7).
4. **Owner's words.** 2026-10-28 22:3x: «Странно, что ты не создаешь себе удобные тестовые услования» · «подготовка тестового окрыжения - это
   важная часть активностей по тестированию» · «Поставить героя, где ему никто не мешает, заспавнить нужного моба, обездвижить его, если
   нужно» · «убить моба, или задать ему мирное поведение» · «Стрелять в него» · «и что угодно в таком стиле» · «ты должен для тестирования
   активно настраивать себе удобное оптимальное тестовое окружение» · «без помех, чтобы тебе не мешало что-то посторонее проверять то, что ты
   проверяешь» · «и так далее» · «что угодно, что тебе нужно для изолированного теста фичи» — `PROJECT_HISTORY.md:407-411`; step-level quotes
   «так, выключать режим бога» · «стрелы насыпать» · «луки разные менять» · «ставить терой перед стеной, чтобы пострелять в стену» —
   `PROJECT_HISTORY.md:416-420`.
5. **Ticket.** none (the open-cases half of the hook rides on #176).
6. **What came out after.** EXP-0378 (2026-10-30, stand/bow) and EXP-0381 (stand, god mode, save, hunger) — stand lessons in the window, by
   topic. EXP-0387: a crash changes the stand — stand check (world entry, one frame) before the next probe; `save-restore.sh` in the Conan pack
   (`D:\work\ai_sandbox\ConanExiles`, commit `d6741a1` 2026-10-30 15:56:41, SQLite `-wal/-shm` removed, integrity check before and after).

## 20. HOUSE_RULES rule 12 — the agent installs CLI tools itself

1. **What and where.** `HOUSE_RULES.md` §1 rule 12 (lines 53-54). Introduced `2e649c0` 2026-10-27 19:27:58 +0300.
2. **What it does.** Install a missing tool (`winget`, `pip install --user`, `npm i -g`, `cargo install`), check its version, one line in the
   reference.
3. **Why it appeared.** The isolated Python lacked PIL for a frame sheet (`PROJECT_HISTORY.md:427`).
4. **Owner's words.** 2026-10-27 ≈19:00: «можешь устанавливать нужные тебе cli тулзы» — `PROJECT_HISTORY.md:426`.
5. **Ticket.** none.
6. **What came out after.** Example in the window: PyMuPDF installed for PDF page viewing (`HOUSE_RULES_REFERENCE.md:85`, 2026-10-30).

## 21. HOUSE_RULES rule 13 — steps narrated by voice while the game is open

1. **What and where.** `HOUSE_RULES.md` §1 rule 13 (line 55). Entered HOUSE_RULES in `cadcc04` 2026-10-25 20:28:59 +0300. The rule is older:
   memory `narrate-by-voice-while-game-open` and the hook `tools/hooks/voice-reminder.mjs` (`5b3c428`, 2026-10-04, unchanged in the window).
2. **What it does.** While a game is open, the agent narrates its steps by voice; the hook reminds after 90 s of silence while the game log is
   fresh.
3. **Why it appeared (restatement).** The agent had stopped speaking during a run.
4. **Owner's words.** 2026-10-25 20:22: «а почему ты перестал со мной голосом говорить?» — `PROJECT_HISTORY.md:432-433`.
5. **Ticket.** none.
6. **What came out after.** Nothing recorded in the window.

## 22. HOUSE_RULES rule 14 — meaning, not numbers, in chat

1. **What and where.** `HOUSE_RULES.md` §1 rule 14 (lines 56-58). Introduced `3e7d872` 2026-10-29 10:19:28 +0300.
2. **What it does.** Every bug/plan/item/case/interview named in chat by what the player sees or what breaks, in Russian; a number only in
   parentheses for lookup; scan the reply before sending for bare «баг NN», «п. NN», «#NNN», case codes.
3. **Why it appeared.** The `/resume` answer listed Conan debts as «08 — ждёт твоего подтверждения» and «04, 05, 07 — старые, ещё с 2.x»
   (`PROJECT_HISTORY.md:294`). Before, the rule existed only for interviews.
4. **Owner's words.** 2026-10-29: «08 - не понимаю, поясни» · «04, 05, 07 — старые, ещё с 2. - не понимаю, поясни. Я тысячу раз говорил, что
   я не мыслю номерами, я мыслю смыслами» — `PROJECT_HISTORY.md:295-296`.
5. **Ticket.** none.
6. **What came out after.** Nothing recorded; no mechanical check exists (prose only).

## 23. HOUSE_RULES rule 16 — two launch paths, front and background

1. **What and where.** `HOUSE_RULES.md` §1 rule 16 (lines 64-69); reference row `HOUSE_RULES_REFERENCE.md` §6 (launch-fg/launch-bg). Introduced
   `4cde408` 2026-10-30 15:33:37 +0300 (with the Conan pack commit `b7275f4` 15:33:17 — `launch-fg.ps1`, `launch-bg.ps1`); sub-rule 2 rewritten
   `f5703f8` 15:56:59.
2. **What it does.** Launch by the path the owner named last (Conan: `launch-fg.ps1` front, `launch-bg.ps1` background); the paths differ ONLY in
   whether the owner sees the game; every instrument and kind of work (remote calls, frames, world entry, tests) works on both; a focus-needing
   instrument gets a background twin, never a silent path switch; before a launch no game of ours may run (scripts exit 2 with the PID).
   The testing hook counts `launch-fg.ps1` as a run (`4cde408`).
3. **Why it appeared.** The owner wants to choose per moment; earlier memory flipped between «in the background» (25.10) and «в Фореграунд игру
   открывай для тестов» (29.10, auto-memory, not in repo). The `f5703f8` refinement came with the save repair: world entry passes on both paths
   after the WAL-replay breakage (EXP-0387).
4. **Owner's words.** The Cyrillic original is not recorded in the repository. The only record is an ASCII transliteration (the script must be
   ASCII-only for PowerShell 5.1): "sdelai dva puti: rabota s igroi v foregraunde i rabota s igroi v fone" / "inogda ya tak hochu, inogda
   inache" / "ty dolzhen umet' i tak i tak" — 2026-10-30 15:3x — `D:\work\ai_sandbox\ConanExiles\_config\launch-fg.ps1:5-6`.
5. **Ticket.** none.
6. **What came out after.** `f5703f8` tightened sub-rule 2 («differ ONLY in whether the owner sees the game… world entry»). The launcher header
   is `[NOT-TESTED]`; `save-restore.sh` (`d6741a1`) added to recover the stand after a crash (EXP-0387). The 16:20 crash of the same day was a
   remote-call mistake (`{}` for a struct), not the launch path.

---

## Arrived with the KAIF 2.9 update in the window (origin code, not local)

`396f281` 2026-10-16 23:33:09 +0300 updated the KAIF-shipped hooks `.kaif/hooks/prompt-refresh-timer.mjs`, `prompt-resume-word.mjs`,
`session-start-refresh.mjs`, `stop-status-guard.mjs` (wired in `.claude/settings.json`) and brought the canon rule "A leading skill word is an
order" (`AGENT_GUIDE.md`, `CLAUDE.md`) and `HOUSE_RULES.md` itself. Not inventoried as local items.

## Known KUMM tickets of the window that are not a local rule or hook

#177 (`kaif-sbx-*` sandboxes leak in TEMP), #178 (`review.mjs --mark-shown` records a flag as a document), #179 (`/resume` ≈143 k tokens —
its local consequence is rule 3 / the compaction), #161 (`kaif-testrun-lint` misses a bulleted «Functional run» line).

## Older rules and hooks not changed in the window (names only)

- `AGENT_GUIDE.md` "Notes from the human": never ask permission for your own work · two maps for every game · KAIF feedback without asking.
- `AGENT_GUIDE.md` "Git workflow": anonymisation by code and hook. "Document & text hygiene": images WebP, never PNG.
- `tools/hooks/no-permission-question.mjs` (Stop) · `tools/hooks/stamp-gate.mjs` · `tools/hooks/style-gate.mjs` with its wirings
  `style-gate`, `ui-gate`, `russian-gate`, `arch-gate` · `tools/hooks/testcase-gate.mjs` · `tools/hooks/voice-reminder.mjs` ·
  `tools/hooks/no-backslash-heredoc.mjs` (one comment path changed by the 2.9 update) · `tools/hooks/pre-commit` (scrub-identity,
  check-claim-before-evidence, check-perf-world).
- Note on an old guard: EXP-0309 (2026-10-18) — `tools/check-claim-before-evidence.mjs` and the stamp hook read the zone offset «+03:00» after
  today's date as a time «ahead of the clock»; recorded `mechanized: none`, and no commit touched the gate after `396f281` — still unfixed as far
  as git shows.

## Not verified

- `D:\skill.md` (the context-budget design source) — outside the repository, not read.
- The scratch-sweep's first real sweep — no recorded line found; the header still says `ON-REAL-PATH: NOT YET`.
- Rule 1 verbatim words — only a paraphrase in git and a fragment in the agent's auto-memory outside the repo.
- Rule 16 verbatim words — only an ASCII transliteration exists.
- Rule 5 incident details and an EXP id — none found.
- Whether rules 4, 9 and 14 were complied with after introduction — not audited.
- Author of origin issue #156 (related to item 9) — not checked.
