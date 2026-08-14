# KUMM — Current Status

> This file is read by the AI agent before every task. Update it on every significant change of state.
> It is the PRIMARY handoff between sessions: a new agent session starts with empty context and must be
> able to get productive from this file alone. Write accordingly — concrete, with file paths and commands.
> 🧠 Prime thinking principle — `PHILOSOPHY.md` (SIMPLICITY: KISS + Occam). Read your working framework
> in `AGENT_GUIDE.md`.
>
> ⚠️ **STATUS is a SUMMARY of NOW, not a chronicle.** A status file that only ever grows turns into
> the project's history book, and the agent that came for a quick "where are we" drowns in it
> (field: a 2 300-line STATUS — "an abyss, not a summary"). The rules that keep it a summary:
>
> - **Every line passes two tests:** *"if I remove this line, will the next agent make a mistake?"*
>   and *"does a newcomer still read the whole file in one sitting?"* Soft target: **~200 lines**
>   (one-two screens of substance) — the guard is a warning, not a wall, but crossing it means a
>   trim is overdue.
> - **Closed work is MOVED OUT, not accumulated:** when a phase/session's entry is no longer "now",
>   move it VERBATIM into `PROJECT_HISTORY.md` (the chronicle — that is what it is for).
>   `/end-chat` carries a "bonsai trim" step for exactly this (`/pause` stays ceremony-free by design).
> - **Leave the file the way you'd want to find it:** fresh summary of what works, what's in
>   progress, what's next, the pitfalls, and WHERE TO LOOK for the details (plans, bugs, history) —
>   pointers, not retellings.

---

## What's done (the short tail — older entries live in PROJECT_HISTORY.md)

### v0.1.0 — the two halves, 2026-08-14/15 ✅
- `kumm.mjs` (637 lines, zero deps, Node ≥22): CDP transport to a dedicated debug-port Chrome;
  `launch`/`login`/`status`/`check`/`update`/`files`/`get`/`changelog`/`eval`/`close`.
  Downloads via the site's own `GenerateDownloadUrl` request — works on a free Nexus account.
- `Deploy-ModPack.ps1` (1003 lines, Windows PowerShell 5.1): resolves each mod's source, deploys into
  every target game folder, writes `Engine.ini` (per machine) and `steam_emu.ini` (per target),
  verifies itself. Interactive menu when run with no switches.
- Engine split from pack (`7ead876`, `a0bfa7f`): `-PackDir` / `--root`; the archive library may sit
  outside the pack entirely. This repo ships the ENGINE only — packs are private, with their own git.

### KAIF 2.2 deployed, 2026-08-15 01:0x +03:00 ✅
- Bootstrap clean: loader → sha256-verified machinery → mechanical deploy. 35 skills × 5 agent systems.
- Canonical name recorded as **KUMM** (owner's answer); sphere `programming`; tracking mode `origin`.
- Both maps, `MASTER_PLAN.md`, the environment dossier and the placeholder set filled by the agent.

---

## Where we are now

The engine works and the owner uses it daily for Palworld. What it does NOT have is any way to check
itself: there is no test of any kind, and both halves talk to the outside world (Nexus through a
browser, game folders on disk), so a fresh session cannot currently prove a change is safe without the
owner's eyes. That is the whole of the current focus — Phase 1 in `MASTER_PLAN.md`.

| Phase | Status | What's there |
|-------|--------|--------------|
| Phase 0 — the two halves | ✅ done | v0.1.0 in daily use |
| Phase 1 — trustworthy unattended | 🔲 next | no tests exist yet; the deterministic core is the target |
| Phase 2 — the second game | 🔲 todo | waits on the owner starting Oblivion Remastered |
| Phase 3 — compatibility | 🔲 todo | needs a research doc first |
| Phase 4 — optimization presets | 🔲 todo | |

---

## 🤖 Autonomous backlog pool (no human / no special hardware needed)

> Tasks the agent can do FULLY autonomously: write code → build → test on the harness → fix → commit,
> without the human and without resources only the human can provide. The loop skills
> (`/autoloop`, `/dayloop`, `/nightloop`) grind this pool.

- [ ] **Round-trip check for the archive naming scheme** — `libraryName()` writes it, `parseArchive()`
      reads it; they must agree. Pure functions, no network, no disk. This is the single most exposed
      pair in the codebase.
- [ ] **Cases for `sameFile`/`stamp` and `pickCard`** — upload-date comparison rounded to the minute;
      variant selection between Steam/Gamepass, Capped/plain, presets. Pure, autonomous.
- [ ] **A fixture pack** (throwaway `modpack.json` + zero-byte correctly-named archives, built under the
      scratchpad, never in the repo) driving `check --json`, `-ListMods` and `-Deploy -DryRun` with no
      network and no game installed.
- [ ] **Close the packaging drift** — `package.json` `"files"` ships `kumm.mjs` without
      `Deploy-ModPack.ps1`, so `npm i -g` delivers half the engine. Verify with `npm pack --dry-run`.
- [ ] **A real `help` command** — the switch block, the header comment (lines 18–28) and the README
      table are three hand-maintained copies of one list. One source, the rest generated or checked.
- [ ] **`kumm status` after `close`** — confirm it reports cleanly rather than throwing; cheap, and it
      is the command a session runs first.

---

## ❓ Awaiting human review (interviews / homework)

> Decisions the agent must not make alone (brand/UX/architecture), or actions only the human can do
> (test on real hardware, external accounts). Filed in `interviews/` and `homeworks/`.

- *(none open)* — the one identity question of the KAIF deployment (canonical name) was answered:
  **KUMM**, 2026-08-15.
- 🧰 Anything needing a real Nexus login, a real game install, or the owner's own mod pack is his to
  run — the agent can build the fixture path but cannot verify the live path alone.

---

## Where to continue next session

> A concrete checklist so the next session (empty context) can start immediately: which files, which
> commands, what to verify first.

1. `git log --oneline -5` and `git status` — see whether the KAIF deployment commit is the tip.
2. Read `AGENT_GUIDE.md` → "Test harness" and "Build". There is no build; `node --check kumm.mjs` is
   the syntax gate.
3. Take the first autonomous-backlog item (the naming-scheme round trip). Plan it with `/plan-task` —
   it is ordinary, not heavy.
4. The functions live in `kumm.mjs`: `parseArchive` (line 450), `libraryName` (412), `sameFile`/`stamp`
   (541–543), `pickCard` (548), `parseArgv` (59), `globToRe` (447).
5. Decide the check runner BEFORE writing checks — the project has zero dependencies and that is a
   design constraint (`MASTER_PLAN.md` → Guiding principles). `node:test` + `node --test` is built in
   and costs nothing; anything requiring an install is an interview question, not an agent decision.
6. Never loop live Nexus calls while testing (`AGENT_GUIDE.md` → "Live-path rule").

---

## Open bugs

*(none in the project's own code)* — the known defect worth filing when someone picks it up is the
packaging drift: `package.json` `"files"` omits `Deploy-ModPack.ps1`, so `npm i -g kumm` installs the
Nexus half without the deploy half (verified: `npm pack --dry-run` → 4 files, 15.2 kB).

Framework tickets (not this project's code, kept visible until an update retires them):
- 🟡 `bugs/KAIF/01_package_json_reformatted_wholesale.md` — the `kaif:*` wiring re-serializes the whole
  `package.json`; 24 of 31 diff lines are whitespace-only. Semantically empty, accepted locally, filed
  upstream. Expect it again at the next `/kaif-update`.
