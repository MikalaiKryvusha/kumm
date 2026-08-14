# KUMM — MASTER PLAN

> The roadmap: how we get from the project's **current state** to the vision in `GOAL.md`. A high-level,
> stepwise decomposition — phases and milestones, not day-to-day tasks (those live in `plans/`). Derived
> from `GOAL.md` by the agent at deploy and refreshed with `/revision` as the goal or the state changes.
>
> This is a **living reference**, not a task — never DONE-tagged.

---

## Vision (one line)

One command assembles, updates and repairs a modded game build — for any game, on a free Nexus account.

## Guiding principles

- **The engine is stateless; the pack owns everything.** No database, no cache, no hidden config.
  Every fact is re-derived from `modpack.json` and from the library's file names on each run. This is
  what lets one engine serve many packs and many games (`PHILOSOPHY.md` → simplicity).
- **The game is data, never code.** Palworld is a default, not an assumption. Oblivion Remastered must
  cost a manifest, not a release.
- **Zero dependencies.** Node ≥22 and Windows PowerShell ship what the project needs. A dependency is a
  design change, not a commit.
- **Observation over trust.** A deploy verifies itself; staleness is decided by the file's upload date,
  not by a version string an author forgot to bump.
- **Courtesy toward Nexus.** The tool reproduces exactly the request the site makes on a human click —
  no batching, no click emulation, no premium bypass. This constraint shapes the architecture.

## From here to there — the phased path

### Phase 0 — the two halves ✅
- **Goal of the phase:** downloading from Nexus on a free account, and deploying a pack into a game,
  both working for Palworld.
- **Steps:** CDP transport through a dedicated Chrome profile · `check`/`update` against the library ·
  `Deploy-ModPack.ps1` with targets, `Engine.ini`, `steam_emu.ini` and self-verification · the engine
  split away from the pack (`-PackDir` / `--root`), so the pack keeps its own private git.
- **Status:** ✅ done — v0.1.0, three commits, in daily use by the owner.

### Phase 1 — an engine you can trust unattended 🔲
- **Goal of the phase:** the deterministic core is covered by checks a fresh session can run with no
  network, no Chrome and no game installed — so a change to the naming scheme or the variant picker
  cannot ship silently.
- **Steps:** round-trip check for `parseArchive` ↔ `libraryName` · cases for `sameFile`/`stamp` and
  `pickCard` (Steam vs Gamepass, Capped vs plain) · a fixture pack of zero-byte correctly-named
  archives driving `check --json`, `-ListMods` and `-Deploy -DryRun` · close the packaging drift
  (`npm i -g` currently ships `kumm.mjs` without `Deploy-ModPack.ps1`) · a real `help` command, since
  the switch block, the header comment and the README table are three copies of one list.
- **Status:** 🔲 todo — this is the phase the autonomous backlog is pointed at.

### Phase 2 — the second game 🔲
- **Goal of the phase:** Oblivion Remastered runs on a manifest alone, with no engine change. That is
  the only honest proof that "the game is data" holds.
- **Steps:** a manifest for the second game (`nexusGame`, `gameExe`, `library`) · run the whole cycle
  against it · fix whatever turns out to be Palworld-shaped in the code · record what a new game costs
  in a research doc, so the third game is cheaper than the second.
- **Status:** 🔲 todo — waits on the owner actually starting the game.

### Phase 3 — compatibility, the part that hurts 🔲
- **Goal of the phase:** the engine tells the owner *before* deploying which two mods will fight, and
  in what order they must land.
- **Steps:** file-overlap detection across mods at deploy planning time · load order / priority as a
  manifest field · conflicts reported by `-DryRun` instead of discovered in-game · known-conflict notes
  attached to the mod entry.
- **Status:** 🔲 todo — needs a research doc first (how the modding community actually resolves this
  for UE4SS-based games).

### Phase 4 — optimization as knowledge, not folklore 🔲
- **Goal of the phase:** engine and mod tuning (the `Engine.ini` contour today) becomes a reusable,
  documented set of presets instead of settings remembered by one person.
- **Steps:** presets named and versioned in the pack · what each setting buys, measured, in
  `researches/` · applying a preset is one flag.
- **Status:** 🔲 todo.

### Phase 5 — the goal is reached 🔲
- A new game build lands; the owner runs one command; mods update, conflicts are reported, the pack
  deploys into the new build and verifies itself. What is left for a human is the decisions — which
  mods, which presets — and nothing else.

## Decision log

`<Stamped, one line each: significant decisions and why — so a future session doesn't relitigate
them. A stamp is a MOMENT: date AND time in the owner's local clock (AGENT_GUIDE → Document & text
hygiene). Decided and recorded are two moments — tell them apart when they differ; write an honest
`≈` rather than an invented minute.>`

| Stamp | Decision | Why |
|------|----------|-----|
| 2026-08-14 23:57 +03:00 (recorded — commit `6ec673c`) | Reach Nexus through a real Chrome on a debug port (CDP), not an HTTP client | Cloudflare blocks plain requests and `download_link` is premium-only; a logged-in browser issuing the site's own `GenerateDownloadUrl` request is the only path that works on a free account without emulating clicks |
| 2026-08-14 23:57 +03:00 (recorded — commit `6ec673c`) | A dedicated Chrome profile in `%LOCALAPPDATA%\nexus-cdp\profile` | Chrome 136+ ignores the debug port on the default profile; `%LOCALAPPDATA%` rather than `%TEMP%` so a cleanup does not log the owner out |
| 2026-08-14 23:57 +03:00 (recorded — commit `6ec673c`) | Compare by the file's UPLOAD DATE, not by version string | Authors re-upload without bumping the number (WorldSettingsUnlocker), and a mod's header version differs from its file's (PauseOnMenu 1.0 vs 1.0.0) |
| 2026-08-15 00:33 +03:00 (recorded — commit `7ead876`), extended 00:44 (`a0bfa7f`) | Split the engine from the pack — `-PackDir` / `--root`, and let the library live outside the pack | The engine ships publicly; a pack is the owner's private collection with its own git |
| 2026-08-15 01:02 +03:00 (recorded) | Canonical name is **KUMM**; `kumm` stays the npm id and the CLI command | Identity is the owner's call, not the machinery's guess from `package.json` (owner's answer at the KAIF deployment) |
| 2026-08-15 01:02 +03:00 (recorded) | KAIF 2.2 deployed, sphere `programming`, tracking mode `origin` | The project is worked on across context-losing agent sessions; the framework externalizes the memory and discipline that a chat cannot keep |

---

> **Maintenance:** keep this in sync with reality. When `GOAL.md` or the project's state shifts materially,
> run `/revision` to re-derive the phases. The per-step detail plans that implement each phase live in
> `plans/`.
