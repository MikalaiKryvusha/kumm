# Agent skill packs from GitHub — what KUMM took, where it is called, what was left and why

> **Created:** 2026-11-20 · on the owner's words 21:35–21:52 (below) · **Parent:** the owner's task of 2026-11-20 21:35 · **Status:** DEPLOYED 2026-11-20 —
> the packs in `D:/work/ai_sandbox/_tools`, KUMM links to them; the call points in `AGENT_GUIDE.md` → "Third-party skill packs at their call points"
> **Outbound:** —

`[OWNER]` 2026-11-20 21:35 «скачай и разверни в KUMM проекте и интегрируй в ритуалы KAIF, чтобы это помогало тебе» (Claude-BugHunter, superpowers) ·
21:41 «BugHunter используем не для поиска уязвимостей, а для тестирвания видеоигры» · 21:43 «тоже качай и разворачивай в KUMM, поможет тебе с играми» (REA) ·
21:47 «можешь их ставить в … _tools» · «а в KUMM ссылаться на эти тулзы» · 21:48 «это нормальный способ, или костыль?» · 21:51 «Serena и Context7 —
проверь, есть ли для тебя полезное» · 21:52 «обнови глобально на машине, пропиши в PATH» (Java 25).

## The decision

`FORK: install each pack whole as its upstream plugin | take only the parts that fit, link them from _tools, call them at KAIF's call points | keep as reference only`
· price of error: whole packs bring a second ritual set that fights KAIF in every session (superpowers' SessionStart bootstrap demands a skill call
before ANY response; its TDD contradicts the owner's "write all the code, then test in a batch"; its subagent-driven development spawns three helpers
per task against the two-helper ceiling) and BugHunter's 83 attack skills, whose text stops the model (seen 21:40) · consulted: the project's canon
(fable-method is vendored verbatim, the KAIF clauses live at the call point — `AGENT_GUIDE.md`), the owner's rules (memory), the Claude Code docs
(below). → the second option.

## The packs

| Pack | Where | Version | Licence | Taken |
|---|---|---|---|---|
| obra/superpowers | `_tools/superpowers` (git clone) | `22f0b46` (v7.0.2) | MIT | 5 skills, linked |
| elementalsouls/Claude-BugHunter | `_tools/claude-bughunter` (git clone) | `c5d5c38` | code MIT, text CC BY 4.0 | the METHOD, rewritten for games as KUMM's own skill `game-hunt` |
| morluto/rea (REA) | `_tools/node24/rea` (npm, portable Node 24.22.2) | rea-agents 6.10.1 (was 6.8.0 since 2026-11-09) | MIT | MCP server (local scope) + its skill `reverse-engineer-anything`, linked |
| Context7 (upstash) | remote, `https://mcp.context7.com/mcp` | — | — | MCP server (local scope), no API key (rate-limited tier) |

## How it is wired — and why it is not a crutch

- **Skills: directory symlinks** `.claude/skills/<name>` → the pack's folder in `_tools`. Documented by Claude Code (code.claude.com/docs/en/skills.md,
  «Symlinked folders»): "a `<skill-name>` entry in the enterprise, personal, or project location can be a symlink to a directory elsewhere on disk. Claude Code
  reads `SKILL.md` from the target". Seen working: the six linked skills appeared in the session's skill list the minute they were linked (21:56).
  Junctions are not documented (the docs are silent), so real symlinks (the agent's shell is elevated). The links are machine-local and git-ignored;
  `node tools/skill-packs.mjs link | check` recreates and checks them (tested: red with no links, red with no `.gitignore` lines, red on a repointed link,
  green after `link`).
- **Why not a plugin:** a plugin cannot drop superpowers' `hooks/hooks.json` (custom hook paths MERGE with it — docs, manifest-reference) and cannot hold
  symlinks that leave the plugin (docs, plugins/loading «Paths that escape the plugin directory»), so a plugin of five skills means copies that drift.
- **MCP servers: local scope** (`claude mcp add --scope local …` from the KUMM folder) — REA's own documented route for one project
  (`docs/getting-started/installation.md`, «Limit REA to one project»); the entry lives in `~/.claude.json` under the KUMM path, not in the repository.
  `npx rea-agents setup` was NOT used: it registers REA for every project and installs the skill user-wide.
- **Java 25 machine-wide** (Ghidra 12.2 declares `application.java.min=25`; REA's Ghidra bridge is verified with Ghidra 12.2 + JDK 25): `winget install
  Microsoft.OpenJDK.25` → `C:\Program Files\Microsoft\jdk-25.0.5.102-hotspot`, first in the machine PATH, machine `JAVA_HOME`; `jdk-21\bin` taken off PATH
  (the JDK 21 folder stays); the USER `JAVA_HOME` = `%USERPROFILE%\.bubblewrap\jdk\jdk-17.0.11+9` (bubblewrap's JDK, it shadowed the machine value) removed —
  restore: `[Environment]::SetEnvironmentVariable('JAVA_HOME',"$env:USERPROFILE\.bubblewrap\jdk\jdk-17.0.11+9",'User')`. Running programs see it after a restart.

## superpowers — skill by skill

| Skill | Verdict | Why |
|---|---|---|
| systematic-debugging | **taken** | root cause before any fix, four phases, "3 failed fixes → question the architecture", condition-based waiting instead of sleeps — the same spirit as `BUG_FIXING_FRAMEWORK.md` and the ban on blocking waits, sharper at the moment of a bug |
| verification-before-completion | **taken** | "no completion claim without fresh verification evidence" — the self-check at the moment of the claim; `/fable-judge` stays the adversarial pass after it |
| requesting-code-review | **taken** | its `code-reviewer.md` brief for the independent judge after each piece of code |
| receiving-code-review | **taken** | how to take the judge's findings: verify each, push back on wrong ones, no performative agreement |
| writing-skills | **taken** | pressure-testing a skill before it ships — for KAIF and KUMM skills (`game-hunt` included) |
| using-superpowers (+ SessionStart hook) | left | demands a skill call before ANY response; fights `/resume` and the KAIF rituals |
| brainstorming | left | "MUST use before any creative work" → fires on everything; questions go to the chat or the contour (the owner's rule), forks to `/interview` |
| writing-plans, executing-plans | left | `/plan-task` and `/plan-epic` are the canon; one plan format (DRY) |
| subagent-driven-development, dispatching-parallel-agents | left | three helpers per task; the owner's ceiling is two and helpers cost his tokens |
| test-driven-development | left | "delete code written before the test" contradicts the owner's "write all the code, then test in a batch" |
| using-git-worktrees, finishing-a-development-branch | left | KUMM works on `main` (AGENT_GUIDE → Git workflow) |
| diagnosing-superpowers | left | about superpowers itself |

The taken skills mention `superpowers:<name>` skills KUMM did not take; read them as: `superpowers:test-driven-development` → `TESTING_FRAMEWORK.md`
(the work produces its own check), `superpowers:verification-before-completion` → the linked skill of that name.

## Claude-BugHunter — for testing a game, not for security

It is a bug-bounty kit for web applications (83 skills: XSS, SSRF, OAuth, cloud, VPN gateways, platform reports). **Reading its README and attack-skill
list tripped the model's safeguards at 21:40 and paused the session** — only its method files are read: `skills/bb-methodology`, `skills/triage-validation`,
`skills/evidence-hygiene`, `commands/autopilot.md`, `commands/pickup.md`. What transfers to a game, now in `.claude/skills/game-hunt/SKILL.md`: the session
line (goal + one or two classes, wide or deep), the non-linear phases, the coverage walk with negatives recorded (its ledger = our play matrix,
`testcases/TC_conan_play_matrix.md`, plan 59), the seven-question gate before filing, the pre-severity gate, kill-fast rules, the four false-positive
rules (baseline diff, unique markers, n ≥ 10 interleaved with 2σ for timing claims, count what ran), the sibling hunt, the "find more" protocol, the
retraction appendix, the evidence order. Its `cbh` CLI, Burp/HackerOne MCPs and `hunt` scaffolder are web tools — not installed.

## REA — reverse engineering of the games

What it gives the game work: native binaries through Ghidra (pseudocode, strings, calls, references — the Conan exe), .NET assemblies (Unity mods, Svarog's
Dream), Unity IL2CPP `global-metadata.dat`, Godot PCK, PE imports, desktop installation layout. `rea doctor` on 2026-11-20: Node 24.22.2, Ghidra 12.2 and
JDK 25 healthy; Hopper, IDA, Kuna, JADX absent (not needed — Ghidra is the provider); its "config drift" lines are about the user-wide setup we did not run.
Ghidra 12.2.0 carries the provider defect `ghidra-9996` (some `-O0` switch tables lose flow references) until 12.2.1.

## Context7 and Serena

- **Context7 — taken.** Its index has the libraries of our work: UE4SS (`/ue4ss-re/re-ue4ss`, ≈3 000 snippets), Unreal Engine docs, BepInEx, Harmony, Unity,
  Lua, Ghidra, WPF, the Nexus Mods API. A real question (`RegisterKeyBind`) returned the official UE4SS page with both overloads and an example (21:52).
- **Serena — not taken.** 40+ languages incl. C#, Lua, Python, PowerShell, but its core (symbol navigation over LSP) duplicates what Claude Code does
  natively through the official LSP plugins (`claude-plugins-official`: `csharp-lsp`, `lua-lsp`, `pyright-lsp`, `typescript-lsp`); it needs `uv` + Python
  and adds ~20 tools and a memory of its own next to ours. The official LSP plugins are the better path — the owner: «Ставь» (22:02). Installed at local scope of KUMM: `csharp-lsp`, `lua-lsp`,
  `pyright-lsp`, `typescript-lsp`; their servers machine-wide: csharp-ls 0.28.0 (`dotnet tool install -g csharp-ls --version 0.28.0` — 0.29.0 fails
  «DotnetToolSettings.xml not found» on SDK 10.0.402), lua-language-server 3.19.2 (`winget install LuaLS.lua-language-server`), pyright 1.1.414 and
  typescript-language-server 6.1.0 (`npm i -g pyright typescript-language-server typescript`). Each answers `--version` from a fresh PATH; the LSP tool
  itself loads at the next session start.

## Updating

- superpowers, BugHunter: `git -C D:/work/ai_sandbox/_tools/<pack> pull`, then `node tools/skill-packs.mjs check` and a look at what changed in the five skills.
- REA: `npm i -g rea-agents@<version> --prefix D:/work/ai_sandbox/_tools/node24/rea` with the portable Node first in PATH; the local MCP entry keeps pointing
  at the same `rea.mjs` (re-add only if the entry script moves).
