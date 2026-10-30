# House rules — KUMM

> The project's local rules (tier 4 of the document taxonomy, `AGENT_GUIDE.md`). A rule is a statement: the agent trusts it and follows it.
> The history of the rules and the owner's verbatim words live in `PROJECT_HISTORY.md`. Stands, routes and tools — `HOUSE_RULES_REFERENCE.md`:
> open it by search when a task touches that place.

## 1. Rules (The owner's standing rules)

1. **The agent talks to the owner in Russian in chat and writes all project and KAIF documentation in English.** The owner's verbatim
   quotes stay Russian; interviews (the owner answers inside them) stay Russian.
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
6. **Frame-time measurements only after the owner's word "the movie is off".** Ask once per working session, by voice
   (`SvarogsDream/tools/voice_say.py`, the phrase in the file `SvarogsDream/_harness/say.txt`), and wait for the answer; his word holds until
   he says otherwise. The measurement is a separate step at the end of a batch. The report carries the line «кино владельца: выключено, его
   слово <время>»; a measurement without it is a draft.
7. **Mods of any game respect the CPU.** Work on the game thread — on a game event, never by timer polling; scene searches (`FindAllOf`,
   `FindFirstOf`, widget walks) — no more often than an event and never in a per-frame loop. A mod measures itself: `os.clock` around its
   handlers, the sum and the worst call to its log once a minute. Accepting an edit — an A-B-A flight: median `MsCPUBusy` and stutters no
   worse than without the mod. The budget — `MASTER_PLAN.md`.
8. **Other authors' mods are fixed natively.** The mod has its own setting — change its default value in our shipment. Otherwise — edit its
   pak directly (`retoc to-legacy` → UAssetGUI JSON → edit → `retoc to-zen`, techniques in `ConanExiles/_config/devkit/build-level-mod.py`),
   by a script next to the pak, so it can be re-applied after a mod update; strings in bytecode — the same way. An edited mod is marked
   **KRINIK MODIFIED** in the shipment (storefront, mod list, its `modpack.json` entry). A Lua UI fix — only when the asset will not yield:
   once, no polling, with an A-B measurement.
9. **A crash-report window is removed at once.** The game crashed in my run → `Get-Process CrashReportClient | Select Id, StartTime,
   MainWindowTitle` → `Stop-Process -Id <PID>` (by PID, never by name; a hung game — also by PID). The run report carries «окно отчёта о
   падении закрыто, PID …».
10. **Work is estimated in hours** («≈ 1 ч», «2–3 ч»). A "chat" is never a unit of effort.
11. **The agent prepares its own test stand, free of interference.**
    1. Before the first case — a "stand" step in the case file: place, creature, its behaviour, weapon, time of day, weather — and how each
       is set up by the remote.
    2. The place — no enemies, companions or construction nearby (teleport by the remote).
    3. The hero — fitted to the case: god mode on and off, arrows and gear spawned by the remote, bows swapped, stamina by the remote.
    4. A creature — spawned, of the right class at the right distance; frozen, made peaceful or killed as the case needs. A target without
       a creature — a wall or a rock in front of the hero.
    5. The case's action — done by the agent itself.
    6. Interference (an enemy hits the hero, combat noise, the camera drifted) — remove it and repeat; a case run under interference does
       not count.
    7. How the stand was set up — one line in the game map.
12. **The agent installs a CLI tool it needs by itself** (`winget`, `pip install --user`, `npm i -g`, `cargo install`), checks it by its
    version and writes one line into the reference.
13. **While the game is open, steps are narrated by voice.**
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
| CPU, memory | AMD Ryzen 7 5700G, 8/16, 31.9 GB | `Get-CimInstance Win32_Processor` |
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
