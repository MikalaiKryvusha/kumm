# House rules — KUMM

> The project's local rules (tier 4 of the document taxonomy, `AGENT_GUIDE.md`). A rule is a statement: the agent trusts it and follows it.
> The owner's verbatim words behind every rule live in `PROJECT_HISTORY.md` — the entry 2026-11-10 01:55 holds this file as it stood with them, older
> entries hold the rest; here each rule carries only `[OWNER] <date>`. Stands, routes and tools — `HOUSE_RULES_REFERENCE.md`: open it by search when a
> task touches that place. The guard `tools/hooks/guide-no-raw-voice.mjs` keeps this file free of quotes; a line of data (a UI string, a term, a spoken
> phrase) carries `verbatim-ok:`.

## 1. Rules (The owner's standing rules)

1. **The agent talks to the owner in Russian in chat and writes all project and KAIF documentation in English.** The owner's verbatim
   quotes stay Russian and live in the chronicle, interviews, plans and bugs — never in a rulebook (this file, `AGENT_GUIDE.md`, `CLAUDE.md`);
   interviews stay Russian — he answers inside them.
   1a. **Anything the agent wants the owner to READ comes as a Russian document** — a reading copy written from the meaning of the English source (never a
       link to the English file), in `<the source's folder>/<NAME>_ru.md`, its header naming the source and the moment; shown to him per the show rule.
       `[OWNER]` 2026-11-06 09:51.
2. **Knowledge is written down the moment it is understood, in the same move.** New — a new line; changed — an edit in place; outdated —
   deleted. Where: vision — `GOAL.md`; path — `MASTER_PLAN.md`; a task — its plan in `plans/`; a rule — this file; a stand, route or tool —
   `HOUSE_RULES_REFERENCE.md`; the engine — the project maps; a game — `games/<Game>/GAME_*_MAP.md`; a mod of a build — its ONE notes file
   `games/<Game>/mods/<Mod>.md` (what it does · assets and functions with numbers · our edits · how to look inside · open), the maps keep a pointer;
   recon — `researches/`. Before asking the owner about a subsystem, read its map line; no line — write it first.
   Work on a mod starts by reading its notes, once per session, in its own tool call; the knowledge-hook refuses the work until then.
   `[OWNER]` 2026-10-18 · 2026-10-30 ≈14:25 (verbatim in the header of `tools/hooks/knowledge-hook.mjs`; KAIF #186).
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
   `[OWNER]` 2026-11-01 08:47.
7. **Mods of any game respect the CPU.** Work on the game thread — on a game event, never by timer polling; scene searches (`FindAllOf`,
   `FindFirstOf`, widget walks) — no more often than an event and never in a per-frame loop. A mod measures itself: `os.clock` around its
   handlers, the sum and the worst call to its log once a minute. Accepting an edit — an A-B-A flight: median `MsCPUBusy` and stutters no
   worse than without the mod. The budget — `MASTER_PLAN.md`.
8. **Other authors' mods are fixed natively.** The mod has its own setting — change its default value in our shipment; before any other way, look for that
   setting first (the owner's remarks on a mod's widget — the XP line of Hosav, the damage meter — start with the mod's own options; `[OWNER]` 2026-11-02 09:01).
   Otherwise — edit its pak directly (`retoc to-legacy` → UAssetGUI JSON → edit → `retoc to-zen`, techniques in `ConanExiles/_config/devkit/build-level-mod.py`),
   by a script next to the pak, so it can be re-applied after a mod update; strings in bytecode — the same way. An edited mod is marked
   **KRINIK MODIFIED** in the shipment (storefront, mod list, its `modpack.json` entry). A Lua UI fix — only when the asset will not yield:
   once, no polling, with an A-B measurement.
9. **A crash-report window is removed at once.** The game crashed in my run → `Get-Process CrashReportClient | Select Id, StartTime,
   MainWindowTitle` → `Stop-Process -Id <PID>` (by PID, never by name; a hung game — also by PID). The run report carries the line
   «окно отчёта о падении закрыто, PID …». <!-- verbatim-ok: the report line plans 36 and 41 quote -->
10. **No effort estimates in epics and plans — neither hours nor chats.** Plans carry steps, gates and acceptance, never a duration. `[OWNER]` 2026-11-01 13:36
    (supersedes the hours-estimate rule of 2026-10-2x).
11. **The agent prepares its own test stand, free of interference.**
    1. Before the first case — a "stand" step in the case file: place, creature, its behaviour, weapon, time of day, weather — and how each
       is set up by the remote.
    2. The place — no enemies, companions or construction nearby (teleport by the remote).
    3. The hero — fitted to the case: god mode on and off, arrows and gear spawned by the remote, bows swapped, stamina by the remote.
    4. A creature — spawned, of the right class at the right distance; frozen, made peaceful or killed as the case needs. A target without
       a creature — a wall or a rock in front of the hero.
    5. The case's action — done by the agent itself.
    5a. An object the case needs (a stone or a stick to pick up, a chest, a resource node) — SPAWNED by the remote in front of the hero, never searched
        for in the world and never asked of the owner. `[OWNER]` 2026-11-01 08:45 (case R2).
    6. Interference (an enemy hits the hero, combat noise, the camera drifted) — remove it and repeat; a case run under interference does
       not count.
    6a. Conan: for the WHOLE run the stand is kept clean by `bash ConanExiles/_config/stand-keeper.sh` (god on + an in-game timer: every living humanoid
        and beast within 600 m killed every 20 s; `stand-keeper.sh last` · `off`), the camera held by `fixed-cam.lua` (the idle camera orbits after ≈30 s),
        the hour set before each clip — 11:00 for the palm-shadow stand. Started BEFORE the first clip; a one-off clean-up is not a stand.
        `[OWNER]` 2026-11-07 16:45–16:47.
    6b. **A frame-time MEASUREMENT gets a still scene, not a clean-by-killing one:** the stand keeper's kill timer is OFF during any capture; before each capture
        the NPCs within 600 m are FROZEN (`ConanExiles/_config/freeze-npcs.lua`, no kill — a kill pass makes the game stutter), the weather is stopped and frozen
        (`BP_SC_WeatherHandler_C:ForceStopAllWeathers()` + `FreezeWeather()` — rain spreads the numbers), then 30 s for the game to settle; only then the capture.
        `[OWNER]` 2026-11-09 00:45–00:47.
    6c. **Before a measurement series the machine is taken from the neighbour sessions:** `ListAgents` → every peer session gets a SendMessage «no builds, compiles,
        tests, installs, downloads or heavy CPU / GPU / disk work until I hand the machine back»; they wait with no exception and open no GUI windows while a screen
        recording runs (2026-11-09 17:19: a neighbour simulator window landed in an A-B video); at the end of the series each gets
        «замеры закончены, машина твоя». While the quiet window is not yet given, do the work that needs no clean machine (recon from files, code, documents, <!-- verbatim-ok: the message text sent to the neighbour -->
        cases) — never sit idle waiting. `[OWNER]` 2026-11-09 15:24–15:25 · 18:59.
    6e. **The probe must not change the circuit.** (1) Before / after numbers come from the LIGHTEST instrument (PresentMon only), the same on both sides, A-B-B-A —
        a differential measurement; (2) a profiler (ETW / xperf) only NAMES a hitch, on its own flight, and its numbers are never compared with untraced ones (its own
        cost, measured 2026-11-09: traced base 67 hitches / 55.7 FPS vs untraced 35–59 / 58–59); (3) the profiler writes into memory or another disk, never the game's
        disk, during the flight; (4) nothing of ours runs inside the measured window — no voice, no remote calls, no neighbour work; (5) every lightening of the probe is
        proven by one control pair. `[OWNER]` 2026-11-09 21:26–21:27.
    6f. **A mod's cost (its own `os.clock` summaries, any per-call timing) is measured with the game IN FRONT.** A background window gets a smaller CPU share from
        Windows (no foreground boost, background power throttling), and wall-clock timers count the waits as the mod's cost — background numbers are not a measurement.
        A report of a cost names the path it was taken on. `[OWNER]` 2026-11-13 17:15 · verbatim in `bugs/99_conan_pickup_plate_check_cost.md`.
    6d. **A graphics option is compared by an A-B VIDEO:** the same still view, 3 s option A, 3 s option B, switched 5 times in a row, the current option labelled on
        the video; the game in front, desktop HDR off for the recording. A frame series or an animation does not replace it. **Frames for a comparison go into ONE flat
        folder**, named so the pair stands next to each other (`01_river_bend_A.webp`, `01_river_bend_B.webp`) — the owner flips them with the mouse wheel; no subfolders.
        `[OWNER]` 2026-11-09 17:11–17:14.
    7. How the stand was set up — one line in the game map.
12. **The agent installs a CLI tool it needs by itself** (`winget`, `pip install --user`, `npm i -g`, `cargo install`), checks it by its
    version and writes one line into the reference.
13. **The agent comments its work by voice REGULARLY — during all work, game or no game.** One or two sentences at every finished step, every finding and
    every change of direction (what was done, what was found, what is next), and never more than 5 minutes of silence while working. With the game open, also
    at a run's start and when its purpose changes: what is tested and what will look different from the usual build (a mod part switched off for a control
    case, a stand teleport, killed NPCs). The text in chat repeats what was said. The hook `tools/hooks/voice-reminder.mjs --always` (PostToolUse, wired in
    `.claude/settings.local.json`) reminds after 5 minutes of silence — the newest `voice/*.txt` is the last phrase. `[OWNER]` 2026-11-03 19:26–19:27 (with
    the game) · 2026-11-13 21:12–21:30 (all work, a project rule; verbatim in `PROJECT_HISTORY.md` entry 2026-11-13 21:30).
    1. **The phrase is Cyrillic words only — no Latin letter, no digit, no unit sign.** The project is said in Cyrillic letter names (the voice file's
       phrase «Николай, это Кей Ю Эм Эм»); numbers and units in Russian words; never KUMM or KAIF in Latin, «A-B», a cvar, «31 %» or «140 мс». <!-- verbatim-ok: the spoken phrase itself -->
       The hook `tools/hooks/voice-cyrillic-gate.mjs` (PreToolUse, Bash | PowerShell) refuses a voice call whose phrase file holds any of them. `[OWNER]` 2026-11-09 20:15–20:16.
    2. **Voice — file first:** Write the phrase into `voice/<YYYY-MM-DD_HH-MM-SS>_<meaning>.txt` (Latin meaning, the folder is committed — the project's history).
    3. Speak it IN THE BACKGROUND with the Glass chime (never the beeps): `D:/work/ai_sandbox/tools/silero_tts/venv/Scripts/python.exe -I
       D:/work/ai_sandbox/tools/silero_tts/say.py --file voice/<…>.txt` with `TEMP`/`TMP` set to `.work/tmp` in the command (rule 15). The voice and its rules —
       `D:/work/ai_sandbox/tools/silero_tts/VOICE_RULES.md` («мягкий голос с Glass», the owner's final pick of 2026-11-09). <!-- verbatim-ok: the name of the voice file -->
       `[OWNER]` 2026-11-09 (memory `owner-voice-and-call-rules`) · 2026-11-13 21:13 (the beeps of `voice-soft.mjs` refused again).
    4. Read its `soft voice:` line and the exit code; a recording starts only after they were read.
14. **In chat the owner is told the MEANING, never a bare number.** Every bug, plan, item, case or interview is named by what the player sees
    or what breaks, in Russian words. A number may follow in parentheses only for lookup. Before sending, scan the reply for «баг NN», «п. NN», «план NN», <!-- verbatim-ok: the patterns the agent greps in its own Russian reply -->
    «#NNN» and case codes (F4, H2) standing without their meaning — rewrite each.
    14.1. **The question «what are you working on?» is answered by the task first:** sentence one names the task and why it is done now (above all right
          after a milestone the owner considers closed), sentence two says where it stands; incidents and details come after.
          `[OWNER]` 2026-11-21 20:59 · `PROJECT_HISTORY.md` entry 2026-11-21 20:50–21:00.
15. **The agent works only inside its project folder and cleans up after itself.** Working files live in `D:\work\ai_sandbox\KUMM\.work\<topic>\`
    (git-ignored); the processes' temp folder is `.work\tmp`, set in EVERY command that makes temp files (`TEMP='D:\work\ai_sandbox\KUMM\.work\tmp' TMP=… <cmd>`;
    the pack's tools — its `_scratch`): the harness overrides `TEMP` / `TMP` / `TMPDIR` of its shells, the `env` of `.claude/settings.local.json` does not reach
    them (checked 2026-11-13 21:1x). The harness's own temp (its scratchpad, background-task output) follows the Windows USER `TEMP` — `F:\Temp` since 2026-11-13
    22:4x (dossier row `TEMP`), never `D:\Temp`. `D:\Temp` is the owner's folder: the agent never writes, reads or deletes there — not even the harness scratchpad
    that lives under it. When a piece of work is done (committed, shipped), delete its heavy working files at once, file by file: unpacks, copies of paks,
    frames, builds. What a later chat needs goes into a repository (STATUS, `plans/`, `researches/`, the pack), never into `.work\`. A work tree outside
    `.work\` (`_paksview-*`, `_text-extract-*`) is named in STATUS with its size and the task that needs it; when the task closes, the tree goes.
    Explicit garbage of the agent's own work (a stale stand, a build, an unpack, frames, logs under `KUMM\.work\` or the pack's `_scratch\`) is deleted at once
    without asking, by `node ConanExiles/_config/rm-tree.mjs <dir>`; the auto-mode classifier allows exactly this (`.claude/settings.local.json` → `autoMode.allow`).
    The permission matches one written form only, so the command is sent alone in its tool call, with absolute `D:/` paths:
    `node D:/work/ai_sandbox/ConanExiles/_config/rm-tree.mjs D:/work/ai_sandbox/KUMM/.work/<dir> …` — no `/d/…` spelling, no relative path, no pipe or second command
    after it (each of them made the classifier refuse the cleanup twice on 2026-11-20). Cleaning up is the agent's duty; a refusal is fixed by the form, never handed to the owner.
    `[OWNER]` 2026-11-13 18:57 · verbatim in `PROJECT_HISTORY.md` entry 2026-11-13 18:57 · 2026-11-18 19:19–19:20 (entry 2026-11-18 19:2x) · 2026-11-20 16:50–16:51 (entry 2026-11-20 16:50).
16. **A game is worked with in two ways — in front and in the background; the owner picks one at the moment, the agent masters both.**
    1. Launch by the path the owner named last: Conan — `launch-fg.ps1` (in front) or `launch-bg.ps1` (background), `HOUSE_RULES_REFERENCE.md` §6.
    2. The two paths differ ONLY in whether the owner sees the game on his screen. Every instrument and every kind of work — remote calls, frames,
       world entry, tests — works on both; an instrument that needs focus (real mouse, real keys) gets a background twin, never a silent switch of the path.
    3. Before a launch — no game of ours already running (the scripts refuse with exit 2 and the PID).
    `[OWNER]` 2026-10-30 ≈15:3x.

16a. **The machine is the agent's for the Conan build — the game may be in FRONT at any time** (screen capture, real input, measurements): no slot to agree,
     no question. `[OWNER]` 2026-11-01 13:40.

17. **Everything we put on a screen — mod UI, installer, launcher, any window — works on every main 16:9 resolution: 720p, 1080p, 2K, 4K.**
    1. Readable at each: text never smaller than the game's or Windows' own text at that size.
    2. A Windows window respects the Windows display scale (per-monitor DPI aware; the owner's TV runs 300 %) and is never bitmap-stretched.
    3. Images come from sources large enough for 4K at that scale, or vector — never pixelated.
    4. Accepted by frames at all four resolutions, looked at by eye.
    `[OWNER]` 2026-10-09 for Svarog · 2026-10-31 09:31 for the build's installer · 09:32 for every mod of the build that brings or changes UI
    (`MASTER_PLAN.md`, `ideas/22_conan_build_gui_installer.md`, plan 35 release gate).
18. **File and folder names we create — English letters, digits and underscores only: no spaces, no Cyrillic, no hyphens.** `collect_report.cmd`,
    `uninstall_krinik_build.cmd`, `_kumm_backup`. The text INSIDE a file stays Russian where the player reads it. Older names are renamed when touched;
    existing hyphenated names of tools and mods (`Deploy-ModPack.ps1`, `ConanCameraControl`) wait for the owner's word. `[OWNER]` 2026-10-31 16:09.
19. **Every mod we write is named `Krinik…`.** `ConanCameraControl` → `KrinikConanCamera`, `ConanModPackStatus` → `KrinikConanModPackStatus`. In the README our
    mods stand at the TOP of the one list of all the build's mods, among them — no separate section. `[OWNER]` 2026-10-31 16:3x–16:48. The shipped set:
    1. Since 2026-10-31 — 7: Camera, Archery, Gameplay, UI, Graphics, RussianTranslation, ModPackManager (KrinikIntro and KrinikConanModPackStatus merged into it).
    2. Since 2026-11-07 — 8: `KrinikConanLocomotion` — jumping while shooting (moved from Archery), jumping while swinging a melee weapon (new), the jump and the run
       growing with the hero's level and attributes (moved from Gameplay), PLAN — jumping off a climbed wall. `[OWNER]` 2026-11-07 10:39 (the list in
       `games/ConanExiles/mods/KrinikConanLocomotion.md`).
    3. Since 2026-11-09 — 9: `KrinikConanEngineTweaks` — all our engine fixes and engine tuning (the performance cvars and config of the quick wins — N1 async
       navmesh gathering, A1 Niagara shaders on load, the physics queue `p.Chaos.…` moved from KrinikConanGraphics); the LOOK settings stay in KrinikConanGraphics.
       `[OWNER]` 2026-11-09 21:49.
20. **A fix updates every place that describes the fixed thing — in the same commit.** The user guide (`ConanExiles/docs/guide/guide-3.0.1.html`), bug 64's
    item, plan 36's W row, the mod's notes: a fix that leaves a stale line anywhere is not done. Nothing is copied from an older document without checking it
    against bug 64 / plan 36 first. `[OWNER]` 2026-10-31 17:49.
21. **In every Russian text of the build the slider control is «шкала»** («Текущая шкала», «на шкале», «своими шкалами») — never «ползунок» or «слайдер»; <!-- verbatim-ok: the build's term and its forms -->
    the owner's verbatim quotes keep their own word. `[OWNER]` 2026-10-31 19:08. Applied: `Game.locres` 4 entries (`locres-set-tr.py`), `ru_table.lua`, the
    settings-hub mockups; the SOURCE `dm-fish-ru.tsv` (and the table `dm-fish-ru.md` built from it) only on 2026-10-31 23:2x — until then a full locres rebuild
    brought the old word back (pack `ee13fcb`).
22. **The author's links (`author_links.txt`) are a SECTION OF LINKS — never «contacts», never a list under «feedback» or «куда писать».** In the README, the <!-- verbatim-ok: the banned Russian heading -->
    guide and the launcher they stand under their own heading («Ссылки» / «Links», «Автор сборки и ссылки») with no sentence that calls them addresses for <!-- verbatim-ok: the headings as the player reads them -->
    reports; one source file feeds all three places (`build-docs.py`, `_config/public_release/mods-table.mjs`). `[OWNER]` 2026-10-31 11:20 · 21:33.
23. **A mockup never passes a wish for a working thing.** Every row, button and option on a mockup the owner sees carries its status on the mockup itself:
    «работает» (code exists and was seen in game) · «нет механики — будет сделано» · «нет механики — предложение». Building a window from an accepted mockup, the <!-- verbatim-ok: the three status labels as the mockup shows them -->
    report lists every mockup element NOT carried into the game and why — nothing is dropped silently. `[OWNER]` 2026-11-01 13:25 (plan 39 D5).
24. **A fix removes the CAUSE — no compensating patches.** Before writing a fix of a game behaviour:
    1. Run the control case: the same action with our mod's part switched off (Lua `enabled.txt` moved out, or the pak removed) — find who makes the defect.
    2. Ours → fix the place in our code that makes it. The game's → fix it in the game's own data or function natively (rule 8), at the source.
    3. A correction applied AFTER the game did its work (move, re-set, re-colour by a timer), tuned by numbers per surface or per creature, is a crutch:
       it is not shipped; an existing one is listed and replaced by the cause fix.
    `[OWNER]` 2026-11-01 15:07–15:08.
25. **A game build lives on disk as exactly four things; nothing else of it is kept.**
    1. **The clean version** — the owner's download, the only Conan folder in `D:\Instals\`. Nothing is installed, written, linked or run in it; it is only COPIED for
       a test or a build (`robocopy <clean> <target> /E`). Its integrity is checked against the hash list it was downloaded with: `node ConanExiles/_config/download-check.mjs verify <hash list> <clean>`
       (every piece) and `list` (no file outside the download list); `clean` removes what is not the download list's. Whole folders go by `node ConanExiles/_config/rm-tree.mjs <dir>…`
       (file by file, links unlinked, never followed; the clean version and the source refused).
    2. **The shipment** — our mods packed into the archives players get (the export bundle, the GitHub / Nexus parts). Deleted once the release is shipped; its
       publication texts (release notes, Nexus description, letters) go into the pack first (`_config/release/published_<version>/`). Every published GitHub
       release of the build, an RC included, is marked as the repository's latest release (`gh release create` with `--latest`). `[OWNER]` 2026-11-20 16:17 ·
       chronicle entry 2026-11-20 16:17.
    3. **The build's source** — the pack repo `D:\work\ai_sandbox\ConanExiles`, the mod library `D:\work\ai_sandbox\ConanExiles\_library\mods` (without `OLD`) and the
       originals of the mods we patch `…\_library\_patch-originals` — everything a shipment is built from. The library lives inside the pack folder, git-ignored
       (`/_library/`), since 2026-11-20 16:08 by the owner's choice (it was `D:\Games\Conan Exiles Mods`).
    4. **The build** — a copy of the clean version with the shipment installed: `D:\Games\Conan Exiles <game version>` (a real folder, never a junction), the one
       game the agent runs and tests in; `ConanExiles/targets.json` names it. Install, uninstall and launcher tests run on a fresh copy of the clean version or on
       this build, never on the clean version.
    Everything else (old game versions, pak views of a removed game, work extracts, bench output, reviewed review folders, save copies) is deleted the moment its
    task closes, file by file. `[OWNER]` 2026-11-17 19:43–19:44 · `PROJECT_HISTORY.md` entry 2026-11-17 19:43 (supersedes the clean-copy rule of 2026-11-01 13:41 · 2026-11-02 08:37).
26. **The launcher: «Играть» starts the game and closes the launcher; «Удалить сборку» keeps the launcher open** (it swaps back to «Установить сборку» when <!-- verbatim-ok: the launcher's button labels -->
    the uninstaller's window closes). `[OWNER]` 2026-11-02 08:35–08:36.
27. **The mods of a build are consistent with each other — reconciled by `researches/mod-reconciliation/GUIDE.md`.**
    1. Anything two mods share (tables, code, assets, resources, mechanics — and every other kind; the list is open) is an overlap: it is judged by reading both
       sides against the game's original and gets one of four outcomes — identical · merge different parts · the owner chooses on the same part · separate one
       name used for two different things.
    2. The work of reconciling mods starts by reading the guide in full; the hook `mod-reconciliation-gate` (`tools/hooks/style-gate.mjs`) refuses the tools and
       the findings files until it is read within the hour.
    `[OWNER]` 2026-11-06 09:33–09:36 (verbatim in the guide's header).
28. **A crash-check («долгий прогон на вылеты» — a long run for crashes) is active GAMEPLAY, never fly-throughs.** <!-- verbatim-ok: the owner's name of the task, how he orders it -->
    Fly-throughs measure frames only; a crash check walks the
    game's systems: combat, gathering, crafting, building, thralls, inventory and the hub, eating and drinking, swimming and climbing, travel across areas,
    loading screens (death and respawn, dungeons, waystones), day and night, saving. The order, places and parameters change from run to run (the
    pesticide paradox, TESTING_FRAMEWORK principle 5); memory, FPS, crashes and Lua errors are read at checkpoints. Plan `plans/47_conan_gameplay_soak.md`.
    `[OWNER]` 2026-11-06 20:35.
29. **A run checks that the game is alive at every step, and a series stops on a dead game.**
    1. `ConanExiles/_config/pult.sh` refuses a command with exit 4 and the line «ИГРА НЕ РАБОТАЕТ» when the game process is gone or a crash-report window is open. <!-- verbatim-ok: the tool's output line -->
    2. Every loop of remote commands ends on a non-zero exit (`P … || break`); a background launch is followed by a check of the process before the next step.
    3. A crash in the agent's run: close the report window by PID (rule 9), read `UE4SS.log` up to the crash, write the cause before the next run.
    `[OWNER]` 2026-11-07 00:03.
30. **CANCELLED 2026-11-20 19:37 by the owner: no rule about a busy keyboard or mouse holds the agent's real input or a game in front.** The hook
    `owner-presence.mjs` is unwired, the idle guards of `mouse-seq.ps1` and `input.ps1` are removed. `[OWNER]` 2026-11-20 19:37 · `PROJECT_HISTORY.md` entry
    2026-11-20 19:37. The text below is history, not a rule.
    (was) **No real input while a person is at the PC; a free PC is tested boldly.**
    1. Before any real input or a game brought to the front (`mouse-seq`, `input.ps1`, `hover-watch`, `launch-fg`, `loot-aim`, `loot-take-clip`, `m6-air-shot`) — `powershell -File
       D:/work/ai_sandbox/_tools/owner-idle.ps1`: exit 5 BUSY (keyboard/mouse touched < 10 s ago) → no such run, do the work that needs no input; exit 0 FREE → test.
    2. The mechanical half: `mouse-seq.ps1` and `input.ps1` (since 2026-11-07 19:3x — it sent a real Space while the owner typed) refuse with exit 5 by the same probe; the hook
       `tools/hooks/owner-presence.mjs` (PreToolUse, Bash|PowerShell) refuses those commands while BUSY and notes «компьютер СВОБОДЕН / ЗАНЯТ» into the agent's <!-- verbatim-ok: the hook's own output line -->
       context at most once per 5 min.
    3. **The owner's word «the computer is free» beats the probe** (his typing in the chat is keyboard input — the probe reads BUSY while he orders a test): write
       `D:/work/ai_sandbox/_tools/owner-free-grant.txt` — line 1 the grant's end (local `yyyy-MM-ddTHH:mm:ss`, 30 min after his word, `claim-ok:` after it), line 2 his words
       verbatim; `owner-idle.ps1` then answers «FREE by the owner's word until HH:MM», so the hook and the input tools pass. Only under his explicit word.
    `[OWNER]` 2026-11-07 12:36–12:37 · 2026-11-16 19:01 (verbatim in `bugs/93_…`, run 19:05).
31. **Every large work and every commit of code goes to an independent judge, round after round, until the judge has almost nothing left to find; its
    findings are verified before fixing** — the steps live in the canon, `AGENT_GUIDE.md` → Notes from the human. `[OWNER]` 2026-11-10 01:41–01:43.

32. **A show WITH an explanation is one local HTML page with a caption under every frame.** Variants to pick, before / after, a defect: build one self-contained page from
    `.kaif/_explain-page-template.html` (images embedded, the question at the top, a Russian caption under each image saying what it shows and what to look at), open it for
    the owner, one chat line on what is there. A folder of files with a notes file beside it is not a show. `[OWNER]` 2026-11-13 15:28 · verbatim in `bugs/95_…`.

33. **A dash never stands in for a verb in Russian text.** Every Russian sentence the player or the owner reads — launcher, installer, uninstaller, report tool,
    mod UI, locres fixes, guide, README, release notes, Nexus text, interviews, the chat — is a whole sentence with its verb.
    1. Before writing, load the owner's voice portrait (`node .kaif/tools/kaif-voice-lint.mjs load`) and the Russian method (`krinik-stylometry/russian_norms/RUSSIAN_RULES.md` §11).
    2. A dash that replaces a verb, a preposition or a «это» is rewritten as a full sentence: the line of the launcher «Игра не найдена: сборку — в папку игры» <!-- verbatim-ok: the defective line the owner quoted -->
       becomes a sentence that says who does what («Игра не найдена. Распакуйте сборку в папку игры.»). <!-- verbatim-ok: the rewritten line -->
    3. A dash stays where the Russian norm (the owner's portrait §2.4) puts it and no word is missing: direct speech, a range of numbers, a GOST caption,
       before the particle that introduces a definition, between two nouns in the nominative, before a summary, for a contrast, between a condition and its
       consequence. Such a line goes to `dash_lint_allow.txt` with its class. Turning an allowed dash into a colon, a repeated verb or a subjectless
       conjunction is a defect (the sample review of 2026-11-18 01:23, plan 56 step 4).
    4. The check: `python ConanExiles/_config/release/dash_lint.py` lists every Russian player string with a dash; a hit is rewritten, never waived silently.
    5. **Scope: only text the agent wrote, and only a dash that was wrong from the start.** Text of other authors (a mod's own strings, the game's, the owner's
       words) is not touched by this rule; a dash that stood legally in the agent's own text stays as it was and goes to the allow list with its class.
       `[OWNER]` 2026-11-18 08:11 · `PROJECT_HISTORY.md` entry 2026-11-18 08:11.
    `[OWNER]` 2026-11-18 00:44 · `PROJECT_HISTORY.md` entry 2026-11-18 00:44.

34. **Mockups of a UI are made in KUIPS** (`D:\work\ai_sandbox\KUIPS`, the owner's prototyping system), never as ASCII sketches in the chat.
    1. The project's KUIPS folder lives next to the UI's source (the Conan launcher: `ConanExiles/_config/launcher/design/` — `mockups.html`, one
       `[data-screen]` element per state, and `flow-map/flow-map.json`); the window is drawn by the real one's numbers, its states differ only where the state does.
    2. `node D:/work/ai_sandbox/KUIPS/bin/kuips.mjs shoot --root <dir>` (scale 4, the owner's 4K TV) → `layout` → `build` → `check` (0 defects), then the agent looks
       at the frames and the whole sheet itself, then opens `design/flow-map.html` for the owner ONCE. A rebuild never opens a new tab: the owner keeps
       the sheet open, and the agent says in chat that the sheet is rebuilt and the open tab needs F5 (until KUIPS refreshes an open sheet by itself).
       `[OWNER]` 2026-11-18 10:35.
    3. The built sheet and the frames are rebuilt by these commands and stay out of git; the page and the manifest are committed.
    4. The flow runs left to right (GOST 19.701-90 / ISO 5807 flow direction): the user's path is ONE row of the manifest's `layout`, its main line on
       tier 0 column after column, the forks on tiers above and below the step they branch from; a new row only for a different process. Before
       `kuips build`, a link from the last column of a row into the first column of the next row means the path was cut into rows — merge them.
       Upstream recommendation: KUIPS issue #1.
    `[OWNER]` 2026-11-18 08:16 · 08:19 · 10:20 · `PROJECT_HISTORY.md` entry 2026-11-18 08:11.

35. **The agent's own Russian is academic, strict and clear; text the player or the owner reads as the build's goes by the owner's portrait.**
    1. Every Russian text of the agent (chat, voice, documents for the owner, interviews) is written by the manuals of the owner's core
       `krinik-stylometry/russian_norms/` — `RUSSIAN_RULES.md`, `NATIVE_RUSSIAN_STYLE.md`, `ACADEMIC_RUSSIAN.md`, `GOST_TECHNICAL_RUSSIAN.md` — and the
       catalogue of AI-Russian defects `krinik-stylometry/russian_norms/AI_RUSSIAN_DEFECTS.md` (calques of English syntax, telegraphic dashes, bureaucratese, the
       "not just X but Y" frame, filler, false enthusiasm); before sending, the text is read against the catalogue's checklist. The Stop hook
       `tools/hooks/ru-reply-check.mjs` checks the turn's text by the core's §8 (genre `reply`), blocks once on a hit and logs every turn to
       `.work/ru-reply-log.jsonl` (the measure of plan 58 criterion 6); a quoted defect carries `<!-- ru-ok: <reason> -->` on its line.
       The PostToolUse hook `tools/hooks/ru-build-text-check.mjs` runs the dash lint and the core's §8 on every written file of the build's player texts.
    2. Text of the build (launcher, installer, report tool, mod UI, guide, README, release notes, Nexus text, mockup strings) — `node .kaif/tools/kaif-voice-lint.mjs load`
       before the first word, written by the portrait, `kaif-voice-lint.mjs check <file>` and a clean-instance read after (the fourth KAIF obligation of `AGENT_GUIDE.md`).
    3. A word is chosen for its exact meaning: an action is named by its real name (a git push is called a push of the code, never a sending of the build).
    4. **The register follows the purpose of the text — three purposes, never confused.**
       1. The game's art text (dialogues, characters' speech, in-game books) is living prose: it follows the native-language rules of the core
          (`krinik-stylometry/russian_norms/NATIVE_RUSSIAN_STYLE.md`, the core's §2.4).
       2. A strict description of rules and requirements (documents, plans, specifications, test cases, tickets, rulebooks, all of the technical project of an
          Unreal Engine game) may use bureaucratic turns where they make the requirement complete, consistent and unambiguous (`REQUIREMENTS_FRAMEWORK.md`).
          The test: replace the turn with a verb and ask what the requirement lost. Nothing lost (a split predicate where the verb exists, a «process» before <!-- verbatim-ok: the term under test -->
          another deverbal noun, text about the text) → the turn is replaced; precision or completeness lost → it stays.
       3. Text addressed to a person (the interface, the launcher, the installer, messages to the player, replies to the owner in chat) is soft, elegant and
          friendly, without bureaucratese.
    5. **Every piece of work that touches Russian follows the manuals of the core `krinik-stylometry/russian_norms/` — strictly, with no exception.** Release
       notes, README updates and the user guide of every next release are written only in this language: the owner's portrait loaded before the first word
       (`node .kaif/tools/kaif-voice-lint.mjs load`), the register of 35.4, the manuals' rules, then `kaif-voice-lint.mjs check`, the core's
       `tools/voice-check.mjs`, `dash_lint.py` for build texts and a clean-instance read; only then the text goes to the owner, and to a publication after his word.
    6. **A text is rewritten by whole sentences and whole blocks, never by patching a phrase inside an old sentence.**
       1. Each block (a section, a paragraph, a list, a table, one screen of a UI) is read for its idea first, then judged: a sentence that already says its
          part well by the manuals stays untouched; a sentence with a defect is rewritten whole; a block whose sentences do not hold together is rewritten whole.
       2. Before writing, state in one line what the sentence or block must tell its reader; then write it anew from that meaning by the manuals, without the old
          wording open. The idea is what is kept; the form — the words, the sentences, their order, the block's structure — may be entirely new.
       3. The facts are kept by a script, not by keeping sentences: every number, version, path, link, name and key of the old block is found in the new one
          (a parity check of tokens), and every fact the new block drops is listed with the reason.
       4. A before / after show pairs whole sentences or whole blocks, as they were rewritten.
    `[OWNER]` 2026-11-18 09:00–09:01 · `PROJECT_HISTORY.md` entry 2026-11-18 08:11 · 4: `[OWNER]` 2026-11-18 13:50–13:59 · entry 2026-11-18 13:55 · interview #039 · 5: `[OWNER]` 2026-11-18 14:31–14:32 · entry 2026-11-18 13:55 (continued) · 6: `[OWNER]` 2026-11-18 15:04 · entry 2026-11-18 15:03.

36. **The owner is talked to in the chat; a question for his decision goes through the interactive contour, never a dialog of the harness.**
    1. A clarification is plain text in the chat, and the agent answers his messages as a conversation, not as a report.
    2. A decision is an interview in `interviews/`, checked by `node .kaif/tools/contour/review.mjs <doc> --check` and shown by the contour.
    3. While a page is open (`interviews/decisions/<doc>.lock` exists), the document belongs to the page: the agent does not edit it.
    4. When his answer arrives in the chat, the agent closes the page itself: `node .kaif/tools/contour/review.mjs <doc> --close`, then records the answer.
    `[OWNER]` 2026-11-18 13:50–13:58 · `PROJECT_HISTORY.md` entry 2026-11-18 13:55.

37. **Images of the build: WebP wherever the reader can open it (documents, pages, GitHub), JPEG quality 95 where WebP cannot be used (Nexus uploads, the
    launcher's embedded pictures — .NET Framework reads no WebP, so `make-res.py` writes JPEG 95 and PNG); a wallpaper ships in the format its final upscale
    gives.** All art sources live in ONE folder `art/` at the pack root (logos, icons, wallpapers, wallpapers_source,
    screenshots); scripts and published copies read from there. `[OWNER]` 2026-11-18 15:38 · interview #040 Q2, Q3.

38. **A critical bug is a defect of the software's technical state: a crash, a slowdown, a lag, a program that does not start or falls, an error, a missing
    window, an extra window, a button that does not press, a blocker, a dead end, a state the player cannot continue from, a save that does not save, a load that
    does not load — and the like. A visual defect is cosmetic, however visible.** A list of critical bugs is drawn from the bug files by this test, and every
    bug's status is read from its file together with its interview and plan before it is said to the owner (an accepted fix whose bug file was never updated is
    the failure this guards). `[OWNER]` 2026-11-18 18:58 · 18:59 · `PROJECT_HISTORY.md` entry 2026-11-18 19:0x.
    1. **The workaround question comes first: a defect the player can get past by a workaround in reach is comfort, not critical** (Esc that does not close
       another mod's window over the hub, while the window's own button closes it). Critical keeps the player from going on: a crash, a hang, a lost save, a
       softlock or dead end, a core function with no workaround. The scale and its sources — `researches/bug-severity/README.md`. `[OWNER]` 2026-11-23 00:00 ·
       `PROJECT_HISTORY.md` entry «2026-11-23 00:0x — the severity of a bug».

39. **A test walks next door: every functional run also checks the neighbouring functions the change could break.** The case set of a change carries a
    «Neighbours» section — the functions that share the edited code, assets, hooks, widgets or events (a blueprint edited → its other buttons and events; a hook
    added → the other sections on the same function; a layout changed → the controls beside it) — each a short case run in the same session as the change's own.
    `[OWNER]` 2026-11-18 20:35 · `PROJECT_HISTORY.md` entry 2026-11-18 20:35.

40. **Every Krinik mod pak carries its fields of the game's own mod list — author, author URL, change note — filled, and the change note is kept per release.**
    1. The fields live in the mod's SOURCE (its `kit/modinfo.json`, or the build script that writes the modinfo) and in one change-note table of the pack; the build of
       the pak writes them, so no rebuild can leave them empty.
    2. The change note of each Krinik mod says what changed in THAT mod in the current release; a new release adds its line before the paks are built.
    3. The guard: a Krinik pak with an empty author, author URL or change note fails the release (`make_release.sh`) and the check of the working game; the main menu's
       mods screen of the working game is looked at once per release.
    `[OWNER]` 2026-11-03 12:58–12:59 (plan 44) · 2026-11-18 21:35–21:36 · `PROJECT_HISTORY.md` entry 2026-11-18 21:35.

41. **The work a piece of code does is proportional to what changed, never to what exists.** A full pass (every widget, row, object of the scene, the whole
    window's drawing, every pixel of an image) on every event, frame, tick or click is forbidden; it is legal only at birth or when everything really changed
    (size, language, map).
    1. Before building or changing an algorithm or a program entity, read `researches/efficient-code/EFFICIENT_CODE.md` in full and answer its six questions
       (trigger · inputs · N per event · static vs volatile · budget · measurement) in the plan step or the commit body.
    2. The hook `efficient-code-gate` (`tools/hooks/style-gate.mjs`, PreToolUse Write | Edit) refuses a code file until the rulebook was read whole within
       60 minutes.
    3. Every judge brief (rule 31) hunts «work not proportional to the change» as its own class; an interface carries a stand case with a time budget.
    `[OWNER]` 2026-11-20 11:43–11:46 · `PROJECT_HISTORY.md` entry 2026-11-20 11:37–11:46.

42. **A release updates all its meta information in one move, in sync: the release is not published until every item below carries the new version and was read
    back in its medium.**
    1. The GitHub release: the notes (RU + EN), the title, «Latest» (rule 25.2), the assets (parts, launcher, the guide PDF, checksums).
    2. The public repository: the README and the public tree (`make_public_tree.py` → a commit on top of the public history).
    3. The user guide: the HTML source, the PDF in the pack's archive and the PDF asset of the release.
    4. The mods' descriptions: the README and guide tables, the change notes of the game's mod list (`krinik_change_notes.json` → the paks).
    5. The Nexus page, when the release goes to Nexus (rule 25.2 and the owner's word for the Nexus publication).
    One text written once feeds every place it appears; a fix in one place is a fix in all of them in the same move (rule 20).
    **The ritual is code:** `python -I -X utf8 ConanExiles/_config/release/release_checklist.py [--published]` — stages A (what the release carries: changes,
    judge rounds, my retests, the play report), B (versions: every Krinik mod, the menu line in the UI kit pak, the launcher), C (texts: notes, change notes,
    guide read against the owner's remarks, README, descriptions, what's new / fixed, Nexus, lints), D (deploy + verify, `make_release.sh`, install and update
    through the launcher), E (published, Latest, assets, tag, kept texts, read back, issues commented, cleanup). `make_release.sh` step 0b stops on a TODO; the
    hook `tools/hooks/release-ritual-gate.mjs` refuses `gh release create` on a TODO. `[OWNER]` 2026-11-20 21:22–21:25 · `PROJECT_HISTORY.md` entry 2026-11-20 21:2x.
    `[OWNER]` 2026-11-20 17:01–17:03 · `PROJECT_HISTORY.md` entry 2026-11-20 17:01.

43. **The agent admits its own mistakes in the first person: the agent itself is the subject of every sentence about its failure.**
    1. The required and the banned forms: «я не проверил», «я не сделал», «я ошибся» — never «проверка не дошла», «инструмент сжал», «мы отбирали», «баги выпуска», «ваш долг передо мной». <!-- verbatim-ok: the required and the banned Russian forms -->
    2. The same holds in every text the owner reads: the chat, STATUS, a run report, a bug document, the farewell — the agent is named as the one who did or did
       not do the thing; a process, a tool, a check, the release or «we» never stands in its place. <!-- verbatim-ok: the pronoun as a word -->
    3. Before sending a reply, read each sentence about a defect or an omission and check its subject.
    `[OWNER]` 2026-11-20 18:35 · `PROJECT_HISTORY.md` entry 2026-11-20 18:35.

44. **Every bug and improvement of the Conan build lives as an issue of the public repository `MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack`,
    so nothing is forgotten, every one is taken into repair and retested after the fix, and the community can help.**
    1. A defect the owner names or the agent finds is filed there at once: the title in English «Area: essence»; the body in Russian by the owner's bug-report
       genre (portrait §2.5 — description, steps, actual result, expected result last) with the build and game version; labels `bug` / `enhancement`, and
       `critical` for a defect of HOUSE_RULES 38.
    2. Before filing, the text is scanned for what the public repository must not carry (the owner's identity, local paths, the game copy's origin — the
       pattern list of `make_public_tree.py`) and checked by `kaif-voice-lint.mjs check`.
    3. The local bug document (`bugs/NN_…`) keeps the agent's working notes and names its issue; the issue's state follows the fix: closed only after the
       retest by the player's path.
    4. **The retest is the agent's own play by the player's path — never handed to the owner.** A case the agent cannot reach yet (no NPC of that kind nearby,
       a fight without god mode) is the agent's owed work, named as such in the report and in STATUS. `[OWNER]` 2026-11-20 20:37 · `PROJECT_HISTORY.md` entry
       2026-11-20 20:37.
    `[OWNER]` 2026-11-20 18:42–19:10 · `PROJECT_HISTORY.md` entry 2026-11-20 18:42.

The owner's rules in `AGENT_GUIDE.md`: "Notes from the human" (never ask permission for your own work · the independent judge · the guide is a thesis
handbook · two maps for every game · KAIF feedback without asking), "Git workflow" (anonymisation by code and hook), "Document & text hygiene" (images —
WebP, never PNG; for the build's own images rule 37 above governs). The context-budget hook's hint is obeyed (`CLAUDE.md`).

## 2. Most critical routes

- **Commit** — three calls: `git add <files one by one>` · `git commit -F <message file>` · `git push`; never `-A`.
- **Conan pack** — after every commit `git push origin main` (the private GitHub repo `conan-exiles-modpack`). The F mirror is retired: GitHub LFS works again,
  every F ref is on GitHub. `[OWNER]` 2026-10-30 17:01–17:12. The pack has no LFS: a file over 50 MB is a stop and a question first.
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
| CPU, memory | AMD Ryzen 7 5700G, 8/16, 31.9 GB (4 × 8 GB DDR4). **Since 2026-11-08 the owner runs a light CPU and DDR4 overclock and a steeper CPU fan curve** (`[OWNER]` 2026-11-08 22:56): frame-time / CPU numbers taken before that day are not comparable with later ones — re-measure the baseline; a new crash or memory corruption is checked against the overclock before blaming a mod. **2026-11-09 KAGO tuned the RAM sub-timings** (latency 109 → ≈ 90 ns; probe `node D:/work/ai_sandbox/KAGO/tools/mem-latency.mjs`): Conan still scenes +0 %, the `krinik-show` flight +2…+8 % (plan 51). WMI still reports 3200 MT/s and 3801 MHz (it shows the configured profile, not the live clock) | `Get-CimInstance Win32_Processor`; `Get-CimInstance Win32_PhysicalMemory \| Select Speed, ConfiguredClockSpeed` |
| GPU | RTX 5070 Ti (Gigabyte), 16 GB, driver 621.01, power limit 300 W; `AdapterRAM` lies (4 GB) — trust `nvidia-smi` | `nvidia-smi --query-gpu=name,driver_version,memory.total,power.limit --format=csv,noheader` |
| Screen | TV 3840×2160 @ 144 Hz; desktop at 300 % DPI — a probe without `SetProcessDPIAware` sees 1280×720 | `Get-CimInstance Win32_VideoController \| % {$_.CurrentHorizontalResolution, $_.CurrentRefreshRate}` |
| Frame-time capture | only `D:\work\ai_sandbox\_tools\PresentMon-2.5.1-x64.exe`, its own `--session_name`; a hung session — `logman stop <name> -ets`; the agent's shell is elevated | `& '<path>' --help` |
| Auto-lock | off | `(Get-ItemProperty 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System').InactivityTimeoutSecs` |
| `TEMP` | the user `TEMP` / `TMP` = **`F:\Temp`** since 2026-11-13 22:44 by the owner's word (PROJECT_HISTORY entry 2026-11-13 22:44; was `D:\Temp` — the owner's folder, rule 15). The harness gives its shells the TEMP of the process that started VS Code — the project `env` does not move it; a session started before 22:44 keeps `D:\Temp` until VS Code restarts. Claude home `%USERPROFILE%\.claude` → `F:\Claude\.claude` | `[Environment]::GetEnvironmentVariable('TEMP','User')`; in a session — `echo "$TEMP $TMPDIR $KAIF_VOICE"` |
| Crash dump | kernel dump (`CrashDumpEnabled` 2, `AutoReboot` 0) into the dedicated 8 GB file `C:\dump\MEMORY.DMP` — moved back from `D:\dump` on 2026-11-13 14:10 by the owner's word (C has room, D does not); takes effect at the next boot, `D:\dump` is queued for deletion at that boot (`PendingFileRenameOperations`). The file is pre-allocated at boot and held open — 8 GB on disk is the reserve, not a crash | `(Get-ItemProperty 'HKLM:\SYSTEM\CurrentControlSet\Control\CrashControl').DedicatedDumpFile`; `Test-Path D:\dump` |
| Shells | Windows PowerShell 5.1 (no `pwsh`) · Git Bash 5.2.21 · `cmd` | `$PSVersionTable`; `bash --version` |
| Encodings | console UTF-8; ANSI 1251 — `Set-Content`/`Add-Content` only with `-Encoding utf8`; PowerShell `ru-RU` | `[Console]::OutputEncoding.WebName` |
| Tools | Node v24.15.0 · npm 10.8.2 · git 2.43.0 · gh 2.95.0 · `winget` | `node -v; git --version; gh --version` |
| Java | **JDK 25 machine-wide since 2026-11-20 21:53** (the owner's word 21:52): `C:\Program Files\Microsoft\jdk-25.0.5.102-hotspot`, first in the machine PATH, machine `JAVA_HOME`; JDK 21 stays on disk, off PATH; the user `JAVA_HOME` (bubblewrap's JDK 17) removed — the restore line is in `researches/agent-skill-packs/README.md` | `java -version`; `[Environment]::GetEnvironmentVariable('JAVA_HOME','Machine')` |
| Agent tool packs | in `D:/work/ai_sandbox/_tools`: `superpowers`, `claude-bughunter` (git clones), REA 6.10.1 on the portable Node 24.22.2 (`node24/rea`; the global Node 24.15 serves pm2), Ghidra 12.2; MCP `rea` and `context7` at local scope of KUMM; skills symlinked into `.claude/skills`; LSP plugins `csharp-lsp`, `lua-lsp`, `pyright-lsp`, `typescript-lsp` (claude-plugins-official, local scope) over the machine-wide servers csharp-ls 0.28.0 (dotnet tool; 0.29.0's package is broken), lua-language-server 3.19.2 (winget), pyright 1.1.414 and typescript-language-server 6.1.0 over `typescript` 5.9.3 (global npm; TypeScript 7 ships no `tsserver.js`, the JS server fails on it). First use 2026-11-20 22:2x: Python, Lua, JS answer, files outside KUMM too; C# answers only under the session folder — KUMM has no C# (`researches/agent-skill-packs/README.md`) | `node tools/skill-packs.mjs check`; `claude mcp list`; `claude plugin list` |
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
