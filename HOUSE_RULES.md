# House rules — KUMM

> The project's local rules (tier 4 of the document taxonomy, `AGENT_GUIDE.md`). A rule is a statement: the agent trusts it and follows it.
> The history of the rules and the owner's verbatim words live in `PROJECT_HISTORY.md`. Stands, routes and tools — `HOUSE_RULES_REFERENCE.md`:
> open it by search when a task touches that place.

## 1. Rules (The owner's standing rules)

1. **The agent talks to the owner in Russian in chat and writes all project and KAIF documentation in English.** The owner's verbatim
   quotes stay Russian; interviews (the owner answers inside them) stay Russian.
   1a. **Anything the agent wants the owner to READ comes as a Russian document** — a reading copy written from the meaning of the English source (never a
       link to the English file), in `<the source's folder>/<NAME>_ru.md`, its header naming the source and the moment; shown to him per the show rule.
       (`[OWNER]` 2026-11-06 09:51 «я читаю на русском языке. Если хочешь, чтобы я что-то почитал - мне нужен RU док от тебя».)
2. **Knowledge is written down the moment it is understood, in the same move.** New — a new line; changed — an edit in place; outdated —
   deleted. Where: vision — `GOAL.md`; path — `MASTER_PLAN.md`; a task — its plan in `plans/`; a rule — this file; a stand, route or tool —
   `HOUSE_RULES_REFERENCE.md`; the engine — the project maps; a game — `games/<Game>/GAME_*_MAP.md`; a mod of a build — its ONE notes file
   `games/<Game>/mods/<Mod>.md` (what it does · assets and functions with numbers · our edits · how to look inside · open), the maps keep a pointer;
   recon — `researches/`. Before asking the owner about a subsystem, read its map line; no line — write it first.
   Work on a mod starts by reading its notes, once per session, in its own tool call; the knowledge-hook refuses the work until then
   (`[OWNER]` 2026-10-30 ≈14:25 · verbatim in the hook header and KAIF #186).
3. **A rule is written as a statement, and only genuinely important and critical instructions are written.** What to do — in steps. No
   rationale, no history, no quotes: a rule's history and the owner's words go to `PROJECT_HISTORY.md`.
4. **A smoke run of anything new is recorded on video; UI — always.** Clip — `bash SvarogsDream/tools/rec_clip.sh <name> <seconds>
   "<remote command>"…` (turn desktop HDR off before recording — `powershell -File SvarogsDream/tools/hdr.ps1 off`). Watch the clip before
   the verdict: the frame sheet next to the clip; transitions — `ffmpeg -ss <s> -t <s> -vf fps=10,scale=960:-1,tile=…`; what is seen — one
   line in the case. A UI case without a watched clip does not get `pass`.
5. **At most two helpers (Agent, workflow) at a time.** Cut big work into pieces and queue them.
6. **Saves during development are the agent's to use freely.** The owner does not play the Conan build for progress: load, overwrite, break and
   delete the game save and the mods' saves (`Saved/Game_0.db`, `Saved/SaveGames/*.sav`, `Saved/KrinikSettings.lua`) as a test needs — no copy before a run,
   no restore after it, no question to the owner. A save that broke world entry is a stand to repair (`_config/save-restore.sh` from any copy).
   (`[OWNER]` 2026-11-01 08:47 «обсолютно поебать. Я не играю на прохождение, мы делаем сборку» · «на время разработки можно делать что угодно с ними».)
7. **Mods of any game respect the CPU.** Work on the game thread — on a game event, never by timer polling; scene searches (`FindAllOf`,
   `FindFirstOf`, widget walks) — no more often than an event and never in a per-frame loop. A mod measures itself: `os.clock` around its
   handlers, the sum and the worst call to its log once a minute. Accepting an edit — an A-B-A flight: median `MsCPUBusy` and stutters no
   worse than without the mod. The budget — `MASTER_PLAN.md`.
8. **Other authors' mods are fixed natively.** The mod has its own setting — change its default value in our shipment; before any other way, look for that
   setting first (the owner's remarks on a mod's widget — the XP line of Hosav, the damage meter — start with the mod's own options) (`[OWNER]` 2026-11-02 09:01
   «если есть уже настройки по тем вещам, о которых я говорю - тогда через них настраиваем, и это становится значениями по-умолчанию в поставке сборки»). Otherwise — edit its
   pak directly (`retoc to-legacy` → UAssetGUI JSON → edit → `retoc to-zen`, techniques in `ConanExiles/_config/devkit/build-level-mod.py`),
   by a script next to the pak, so it can be re-applied after a mod update; strings in bytecode — the same way. An edited mod is marked
   **KRINIK MODIFIED** in the shipment (storefront, mod list, its `modpack.json` entry). A Lua UI fix — only when the asset will not yield:
   once, no polling, with an A-B measurement.
9. **A crash-report window is removed at once.** The game crashed in my run → `Get-Process CrashReportClient | Select Id, StartTime,
   MainWindowTitle` → `Stop-Process -Id <PID>` (by PID, never by name; a hung game — also by PID). The run report carries «окно отчёта о
   падении закрыто, PID …».
10. **No effort estimates in epics and plans — neither hours nor chats.** Plans carry steps, gates and acceptance, never a duration. (`[OWNER]` 2026-11-01 13:36
    «убрать из эпиков и планов часы оценок. Я знаю, что вы оцениваете неверно, и на самом деле быстрее все делаете. Убрать часы, чтобы они вас не обманывали» —
    supersedes «work is estimated in hours» of 2026-10-2x.)
11. **The agent prepares its own test stand, free of interference.**
    1. Before the first case — a "stand" step in the case file: place, creature, its behaviour, weapon, time of day, weather — and how each
       is set up by the remote.
    2. The place — no enemies, companions or construction nearby (teleport by the remote).
    3. The hero — fitted to the case: god mode on and off, arrows and gear spawned by the remote, bows swapped, stamina by the remote.
    4. A creature — spawned, of the right class at the right distance; frozen, made peaceful or killed as the case needs. A target without
       a creature — a wall or a rock in front of the hero.
    5. The case's action — done by the agent itself.
    5a. An object the case needs (a stone or a stick to pick up, a chest, a resource node) — SPAWNED by the remote in front of the hero, never searched
        for in the world and never asked of the owner. (`[OWNER]` 2026-11-01 08:45 «СОЗДАВАЙ СЕБЕ САМ ТЕСТОВЫЕ УСЛОВИЯ!!! ЗАСПАВНИ КАМЕНЬ!!» — after four
        probes spent searching foliage for a stone, case R2.)
    6. Interference (an enemy hits the hero, combat noise, the camera drifted) — remove it and repeat; a case run under interference does
       not count.
    6a. Conan: for the WHOLE run the stand is kept clean by `bash ConanExiles/_config/stand-keeper.sh` (god on + an in-game timer: every living humanoid
        and beast within 600 m killed every 20 s; `stand-keeper.sh last` · `off`), the camera held by `fixed-cam.lua` (the idle camera orbits after ≈30 s),
        the hour set before each clip — 11:00 for the palm-shadow stand. Started BEFORE the first clip; a one-off clean-up is not a stand.
        (`[OWNER]` 2026-11-07 16:45–16:47 «Что твоего героя пиздят со всех сторон!» · «и камера вращается от неактивности!» · «600 м!!!!» · «каждые 20 секунд!!!» ·
        «и 11 утра ставить!»)
    6b. **A frame-time MEASUREMENT gets a still scene, not a clean-by-killing one:** the stand keeper's kill timer is OFF during any capture; before each capture
        the NPCs within 600 m are FROZEN (`ConanExiles/_config/freeze-npcs.lua`, no kill — a kill pass makes the game stutter), the weather is stopped and frozen
        (`BP_SC_WeatherHandler_C:ForceStopAllWeathers()` + `FreezeWeather()` — rain spreads the numbers), then 30 s for the game to settle; only then the capture.
        (`[OWNER]` 2026-11-09 00:45–00:47 «замер некоректен» · «мобов нужно убивать ДО замера в радиусе 600 метров» · «и дать игре обработать это - секунл 30» ·
        «там всё сильно тормозит, когда убиваешь мобов - нельзя в это время замерять» · «или просто не убивай, а всех замораживай на месте» · «и дождь нужно отключать».)
    7. How the stand was set up — one line in the game map.
12. **The agent installs a CLI tool it needs by itself** (`winget`, `pip install --user`, `npm i -g`, `cargo install`), checks it by its
    version and writes one line into the reference.
13. **While the game is open, the run is narrated by voice — in general, not every step.** At a run's start and when its purpose changes, one phrase: what is
    tested and what will look different from the usual build (a mod part switched off for a control case, a stand teleport, killed NPCs). The owner sees
    the game on his screen even on the background path. **Voice — file first:** (1) Write the phrase into `voice/<YYYY-MM-DD_HH-MM-SS>_<meaning>.txt` (Latin
    meaning, the folder is committed — the project's history); (2) speak it: `node .kaif/tools/contour/voice-soft.mjs --file voice/<…>.txt --play` with the env of
    `.claude/settings.local.json` (`KAIF_VOICE_RENDER` = the Silero v5 eugene renderer in `D:/work/ai_sandbox/tools/silero_tts`, its README; beeps 2.5) — in a shell
    without that env, export the three `KAIF_VOICE_*` lines first. (3) Read its `voice log:` and `voice-soft:` lines and the exit code; a recording starts only after
    they were read. The tool is KAIF 2.10's (decision №156), taken ahead of the update; the timbre is the owner's tuned one. (`[OWNER]` 2026-11-08 23:09 «посмори новое
    требование по голову в WIP 2.10 KAIF - писать в txt командой записи, фалйы именовать и складировать» · 23:10 «твой голос оставь, мы его настроили» · «да, вот правильно».)
    (`[OWNER]` 2026-11-03 19:26–19:27 «ты хоть предупреждай голосом» · «чтобы я не триггерился» · «не понимая, что ты тестируешь» · «я же вижу на экране игру» ·
    «каждый шаг не нужно» · «хотя бы в общем» — after a control run with KrinikConanUI's Lua out showed him the old UI unannounced.)
14. **In chat the owner is told the MEANING, never a bare number.** Every bug, plan, item, case or interview is named by what the player sees
    or what breaks («камера дрожит, когда герой стоит»), in Russian words. A number may follow in parentheses only for lookup. Before sending,
    scan the reply for «баг NN», «п. NN», «план NN», «#NNN», case codes (F4, H2) standing without their meaning — rewrite each.
15. **The agent cleans up after itself on the owner's machine.** Working files live in the session scratchpad. When a piece of work is
    done (committed, shipped), delete its heavy working files at once, file by file: unpacks, copies of paks, frames, builds. What a later
    chat needs goes into a repository (STATUS, `plans/`, `researches/`, the pack), never into a scratchpad — scratchpads of sessions idle
    for 24 h are swept at session start by `tools/hooks/scratch-sweep.mjs`. A work tree outside the scratchpad (`_paksview-*`, `_text-extract-*`)
    is named in STATUS with its size and the task that needs it; when the task closes, the tree goes.
16. **A game is worked with in two ways — in front and in the background; the owner picks one at the moment, the agent masters both.**
    1. Launch by the path the owner named last: Conan — `launch-fg.ps1` (in front) or `launch-bg.ps1` (background), `HOUSE_RULES_REFERENCE.md` §6.
    2. The two paths differ ONLY in whether the owner sees the game on his screen. Every instrument and every kind of work — remote calls, frames,
       world entry, tests — works on both; an instrument that needs focus (real mouse, real keys) gets a background twin, never a silent switch of the path.
    3. Before a launch — no game of ours already running (the scripts refuse with exit 2 and the PID).
    (`[OWNER]` 2026-10-30 ≈15:3x · verbatim in `PROJECT_HISTORY.md`, entry «the owner's words behind HOUSE_RULES §1 rule 16».)

16a. **The machine is the agent's for the Conan build — the game may be in FRONT at any time** (screen capture, real input, measurements): no slot to agree, no question. (`[OWNER]` 2026-11-01 13:40 «в любое время можешь игру на передний план выводить. Ты еще не понял, что последних нескольок дней комп ПОЛНСТЬЮ ТВОЙ!!!! ТАк как мне нужна сборка, а ты телишься блять!»)

17. **Everything we put on a screen — mod UI, installer, launcher, any window — works on every main 16:9 resolution: 720p, 1080p, 2K, 4K.**
    1. Readable at each: text never smaller than the game's or Windows' own text at that size.
    2. A Windows window respects the Windows display scale (per-monitor DPI aware; the owner's TV runs 300 %) and is never bitmap-stretched.
    3. Images come from sources large enough for 4K at that scale, or vector — never pixelated.
    4. Accepted by frames at all four resolutions, looked at by eye.
    (`[OWNER]` 2026-10-09 for Svarog · 2026-10-31 09:31 for the build's installer · 09:32 for every mod of the build that brings or changes UI:
    «все наши моды в сборке, которые приносят или меняют UI, должны уважительно масштабироваться с разрешением игры в стандартном ряду 16 к 9» ·
    verbatim in `MASTER_PLAN.md`, `ideas/22_conan_build_gui_installer.md`, plan 35 release gate.)
18. **File and folder names we create — English letters, digits and underscores only: no spaces, no Cyrillic, no hyphens.** `collect_report.cmd`,
    `uninstall_krinik_build.cmd`, `_kumm_backup`. The text INSIDE a file stays Russian where the player reads it. Older names are renamed when touched;
    existing hyphenated names of tools and mods (`Deploy-ModPack.ps1`, `ConanCameraControl`) wait for the owner's word.
    (`[OWNER]` 2026-10-31 16:09 «никаких пробелов и кириллицы в названиях файлов и папок!!!» · «только английский язык и нижние подчеркивания».)
20. **A fix updates every place that describes the fixed thing — in the same commit.** The user guide (`ConanExiles/docs/guide/guide-3.0.1.html`), bug 64's
    item, plan 36's W row, the mod's notes: a fix that leaves a stale line anywhere is not done. Nothing is copied from an older document without checking it
    against bug 64 / plan 36 first. (`[OWNER]` 2026-10-31 17:49 «ОНО УЖЕ НАХУЙ ВСЕ ПОЧИНЕНО ТОБОЮ ЖЕ БЛЯТЬ В ПРОШЛЫХ СЕССИЯХ!!» · «КАКОГО ХУЯ ТЫ НЕ
    АКТУАЛИЗИРУЕШЬ СВОИ ЗНАНИЯ БЛЯТЬ» · «ПО ТОМУ ЧТО ТЫ ЖЕ ЧИНИШЬ».)
21. **In every Russian text of the build the slider control is «шкала»** («Текущая шкала», «на шкале», «своими шкалами») — never «ползунок» or «слайдер»;
    the owner's verbatim quotes keep their own word. (`[OWNER]` 2026-10-31 19:08 «шкала» · «везде так пишем».) Applied: `Game.locres` 4 entries
    (`locres-set-tr.py`), `ru_table.lua`, the settings-hub mockups; the SOURCE `dm-fish-ru.tsv` (and the table `dm-fish-ru.md` built from it) only on
    2026-10-31 23:2x — until then a full locres rebuild brought «ползунок» back (pack `ee13fcb`).
22. **The author's links (`author_links.txt`) are a SECTION OF LINKS — never «contacts», never a list under «feedback» or «куда писать».** In the README, the
    guide and the launcher they stand under their own heading («Ссылки» / «Links», «Автор сборки и ссылки») with no sentence that calls them addresses for
    reports; one source file feeds all three places (`build-docs.py`, `_config/public_release/mods-table.mjs`). (`[OWNER]` 2026-10-31 21:33 «ЭТО НЕ КОНТАКТЫ,
    ПОВТОРЯЮ НАХУЙ ТЕБЕ ЕЩЕ РАЗ!» · «это просто раздел с ссылками»; earlier 11:20 «сделаешь раздел со ссылками автора».)
23. **A mockup never passes a wish for a working thing.** Every row, button and option on a mockup the owner sees carries its status on the mockup itself:
    «работает» (code exists and was seen in game) · «нет механики — будет сделано» · «нет механики — предложение». Building a window from an accepted mockup, the
    report lists every mockup element NOT carried into the game and why — nothing is dropped silently. (`[OWNER]` 2026-11-01 13:25 «то есть, ты мне макеты
    показываешь такие, которые не сделаны?» — the vignette rows of the 10-31 mockups had no mechanics and were silently left out of the game window; plan 39 D5.)
24. **A fix removes the CAUSE — no compensating patches.** Before writing a fix of a game behaviour:
    1. Run the control case: the same action with our mod's part switched off (Lua `enabled.txt` moved out, or the pak removed) — find who makes the defect.
    2. Ours → fix the place in our code that makes it. The game's → fix it in the game's own data or function natively (rule 8), at the source.
    3. A correction applied AFTER the game did its work (move, re-set, re-colour by a timer), tuned by numbers per surface or per creature, is a crutch:
       it is not shipped; an existing one is listed and replaced by the cause fix.
    (`[OWNER]` 2026-11-01 15:07–15:08 «странно, что мы что-то куда-то досылаем» · «почему выглядит как костыль?» · «лучше бы чинить качественно, а не костылями» ·
    «не люблю костыли» · «это временные решения, которые потом еще что-то ломают» · «нужно сразу чинить качественно и правильно».)
25. **The build's install, uninstall and the launcher's buttons are tested on a COPY of the owner's clean game** — the original
    the only Conan game folder in `D:\Instals\` (its name stays out of this public repository) (59 GB) is never touched; the copy is `D:\Games\Conan_Exiles_3_0_1_clean_test` (robocopy);
    never on the working game `D:\Games\Conan Exiles 3.0.1`. **Since 2026-11-07 ≈20:00 the original in `D:\Instals\` is gone (the owner freed D:) — the copy is the
    ONLY clean Conan: no test runs on it directly any more; a test copies it first (59 GB free needed) or waits for the owner's word.** (`[OWNER]` 2026-11-02 08:37 «ты тестировал установку и удаления сборки на чистой версии? я же тебе
    нашёл чистую версию - её копируй, и на копии нужно тестировать» · «D installs»; first word 2026-11-01 13:41, plan 40.7.)
26. **The launcher: «Играть» starts the game and closes the launcher; «Удалить сборку» keeps the launcher open** (it swaps back to «Установить сборку» when
    the uninstaller's window closes). (`[OWNER]` 2026-11-02 08:35 «когда игра запущена через лаунчер по ИГРАТЬ - лаунчер нужно закрывать, чтобы не ел ресурсы
    ПК» · 08:36 «в отличие от «Удалить» - удалить не должна закрывать лаунчер».)
27. **The mods of a build are consistent with each other — reconciled by `researches/mod-reconciliation/GUIDE.md`.**
    1. Anything two mods share (tables, code, assets, resources, mechanics — and every other kind; the list is open) is an overlap: it is judged by reading both
       sides against the game's original and gets one of four outcomes — identical · merge different parts · the owner chooses on the same part · separate one
       name used for two different things.
    2. The work of reconciling mods starts by reading the guide in full; the hook `mod-reconciliation-gate` (`tools/hooks/style-gate.mjs`) refuses the tools and
       the findings files until it is read within the hour.
    (`[OWNER]` 2026-11-06 09:33–09:36 — verbatim in the guide's header.)

28. **A crash-check («долгий прогон на вылеты») is active GAMEPLAY, never fly-throughs.** Fly-throughs measure frames only; a crash check walks the
    game's systems: combat, gathering, crafting, building, thralls, inventory and the hub, eating and drinking, swimming and climbing, travel across areas,
    loading screens (death and respawn, dungeons, waystones), day and night, saving. The order, places and parameters change from run to run (the
    pesticide paradox, TESTING_FRAMEWORK principle 5); memory, FPS, crashes and Lua errors are read at checkpoints. Plan `plans/47_conan_gameplay_soak.md`.
    (`[OWNER]` 2026-11-06 20:35 «Часовой прогон на вылеты - это активное взаимодействие с миром, геймплей, а не твои демо летания» · «Твои демо летания, это
    "парадокс пестицида"».)

29. **A run checks that the game is alive at every step, and a series stops on a dead game.**
    1. `ConanExiles/_config/pult.sh` refuses a command with exit 4 «ИГРА НЕ РАБОТАЕТ» when the game process is gone or a crash-report window is open.
    2. Every loop of remote commands ends on a non-zero exit (`P … || break`); a background launch is followed by a check of the process before the next step.
    3. A crash in the agent's run: close the report window by PID (rule 9), read `UE4SS.log` up to the crash, write the cause before the next run.
    (`[OWNER]` 2026-11-07 00:03 «заебал ты скрипты свои запускать без контроля того, работает игра, или нахуй упала к ебеням».)

30. **No real input while a person is at the PC; a free PC is tested boldly.**
    1. Before any real input or a game brought to the front (`mouse-seq`, `input.ps1`, `hover-watch`, `launch-fg`, `loot-aim`, `loot-take-clip`, `m6-air-shot`) — `powershell -File
       D:/work/ai_sandbox/_tools/owner-idle.ps1`: exit 5 BUSY (keyboard/mouse touched < 10 s ago) → no such run, do the work that needs no input; exit 0 FREE → test.
    2. The mechanical half: `mouse-seq.ps1` and `input.ps1` (since 2026-11-07 19:3x — it sent a real Space while the owner typed) refuse with exit 5 by the same probe; the hook `tools/hooks/owner-presence.mjs` (PreToolUse, Bash|PowerShell) refuses
       those commands while BUSY and notes «компьютер СВОБОДЕН / ЗАНЯТ» into the agent's context at most once per 5 min.
    (`[OWNER]` 2026-11-07 12:36–12:37 «тебе бы было полезно видеть, что кто-то что-то с физической клавы набирает» · «когда это происходит - лучше тебе тесты не
    запускать» · «а когда с клавы никто не набирает - значит нет пользователя за ПК, можно тестить смело» · «разработай себе тулз…» · «пусть он в фоне, когда ты
    работаешь над KUMM, сообщает тебе такие сведения».)

19. **Every mod we write is named `Krinik…`.** `ConanCameraControl` → `KrinikConanCamera`, `ConanModPackStatus` → `KrinikConanModPackStatus`. In the README our
    mods stand at the TOP of the one list of all the build's mods, among them — no separate section. (`[OWNER]` 2026-10-31 16:3x, answers in chat: «наши моды
    описываются вверху списка всех модов сборки на ряду всех модов сборки. Наши моды начинаются отныне с Krinik» · names chosen «KrinikConanCamera +
    KrinikConanModPackStatus»; 16:48 «KrinikIntro · KrinikConanModPackStatus — вот это все организационные вопросы» · «Я предлагаю их объединять в
    KrinikConanModPackManager» — the shipped set is 7: Camera, Archery, Gameplay, UI, Graphics, RussianTranslation, ModPackManager.)
    **Since 2026-11-07 the set is 8 — `KrinikConanLocomotion`:** jumping while shooting (moved from Archery), jumping while swinging a melee weapon (new), the
    jump and the run growing with the hero's level and attributes (moved from Gameplay), PLAN — jumping off a climbed wall. (`[OWNER]` 2026-11-07 10:39
    «Немного изменяем состав и структуру модов Krinik» · «ДОбавляем мод KrinikConanLocomotion» — the list verbatim in `games/ConanExiles/mods/KrinikConanLocomotion.md`.)

The owner's rules in `AGENT_GUIDE.md`: "Notes from the human" (never ask permission for your own work · two maps for every game · KAIF
feedback without asking), "Git workflow" (anonymisation by code and hook), "Document & text hygiene" (images — WebP, never PNG). The
context-budget hook's hint is obeyed (`CLAUDE.md`).

## 2. Most critical routes

- **Commit** — three calls: `git add <files one by one>` · `git commit -F <message file>` · `git push`; never `-A`.
- **Conan pack** — after every commit `git push origin main` (the private GitHub repo `conan-exiles-modpack`). The F mirror is retired: GitHub LFS works again,
  every F ref is on GitHub (`[OWNER]` «Да, в приватный реп» · «После этого удалить временное хранилище на F.» · «РАЗРЕШАЮ ИСПРАВИТЬ ПРАВИЛО» · 2026-10-30 17:01–17:12).
  The pack has no LFS: a file over 50 MB is a stop and a question first.
- **The machine is shared with KAGO.** Game and load — only under the lock: `node D:/work/ai_sandbox/_tools/machine-lock.mjs take --who
  kumm --what <why> --minutes <n>` → work → `release --who kumm` (exit 3 — taken: work offline). Whoever launched the game closes it right
  after the run.
- **KAIF feedback** — `node .kaif/kaif-core.mjs report bugs/KAIF/NN_*.md` (`--dry-run` first), without asking.
- **Shells** — Windows PowerShell 5.1 (no `&&`, `??`, `?.`) and Git Bash. `Set-Content` — only with `-Encoding utf8` (ANSI 1251).

## 3. Environment dossier — the machine's facts (Environment dossier)

Taken 2026-08-15, refined up to 2026-10-25; facts older than four weeks are hypotheses — re-probe before relying on them (`/refresh-context`,
the dossier step).

| Fact | Value | Probe |
|---|---|---|
| OS | Windows 11 Pro 10.0.26200 | `(Get-CimInstance Win32_OperatingSystem).Caption` |
| CPU, memory | AMD Ryzen 7 5700G, 8/16, 31.9 GB (4 × 8 GB DDR4). **Since 2026-11-08 the owner runs a light CPU and DDR4 overclock and a steeper CPU fan curve** (`[OWNER]` 2026-11-08 22:56 «я чуть-чуть разограл процессор» · «разогнал RAM DDR4»): frame-time / CPU numbers taken before that day are not comparable with later ones — re-measure the baseline; a new crash or memory corruption is checked against the overclock before blaming a mod. WMI still reports 3200 MT/s and 3801 MHz (it shows the configured profile, not the live clock) | `Get-CimInstance Win32_Processor`; `Get-CimInstance Win32_PhysicalMemory \| Select Speed, ConfiguredClockSpeed` |
| GPU | RTX 5070 Ti (Gigabyte), 16 GB, driver 621.01, power limit 300 W; `AdapterRAM` lies (4 GB) — trust `nvidia-smi` | `nvidia-smi --query-gpu=name,driver_version,memory.total,power.limit --format=csv,noheader` |
| Screen | TV 3840×2160 @ 144 Hz; desktop at 300 % DPI — a probe without `SetProcessDPIAware` sees 1280×720 | `Get-CimInstance Win32_VideoController \| % {$_.CurrentHorizontalResolution, $_.CurrentRefreshRate}` |
| Frame-time capture | only `D:\work\ai_sandbox\_tools\PresentMon-2.5.1-x64.exe`, its own `--session_name`; a hung session — `logman stop <name> -ets`; the agent's shell is elevated | `& '<path>' --help` |
| Auto-lock | off | `(Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System').InactivityTimeoutSecs` |
| `TEMP` | `D:\Temp`; Claude home `%USERPROFILE%\.claude` → `F:\Claude\.claude` | `[Environment]::GetEnvironmentVariable('TEMP','User')` |
| Shells | Windows PowerShell 5.1 (no `pwsh`) · Git Bash 5.2.21 · `cmd` | `$PSVersionTable`; `bash --version` |
| Encodings | console UTF-8; ANSI 1251 — `Set-Content`/`Add-Content` only with `-Encoding utf8`; PowerShell `ru-RU` | `[Console]::OutputEncoding.WebName` |
| Tools | Node v24.15.0 · npm 10.8.2 · git 2.43.0 · gh 2.95.0 · `winget` | `node -v; git --version; gh --version` |
| `tar` / `curl` | PowerShell: `tar` is bsdtar (`D:\…` = a remote host), `curl` is an alias of `Invoke-WebRequest`; Git Bash: GNU `tar`, real `curl` | `Get-Command tar,curl`; `type -p tar curl` |
| Line endings | `core.autocrlf = true` | `git config --get core.autocrlf` |

## 4. Where the rest is

Stands, routes, tools — `HOUSE_RULES_REFERENCE.md`:

| Section | What is there |
|---|---|
| §2 External systems and access | Nexus through the debug-port Chrome, GitHub `kumm`, the KAIF origin |
| §3 Stands, environments and devices | engine checks: core tests, `fixture-pack.mjs`, `-ListMods`, `-Deploy -DryRun`, `-Verify` |
| §5 Routes and recipes | commit, pushing packs and GitHub, KAIF, the KAGO lock, disk revisions, Dungeon Siege II, Windows automation (Windows-MCP, ilspycmd, NVIDIA profiles), game dossiers, the Svarog run |
| §6 Tools of this project | engine and KAIF; Claude Code hooks; Conan — the `KrinikAgentRemote` remote, the flight bench, mod UI in the background, bytecode (`kismet-trace`, `patch-mod-asset`, `uaj`), the 26.10 instruments, sounds, `wait-input-idle`, `check-lua-game-thread`; Svarog — `gpt_edit`, `portrait_recenter`; GTA SA |
