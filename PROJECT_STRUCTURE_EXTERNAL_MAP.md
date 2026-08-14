# KUMM — External structure map

> **The EXTERNAL map: what the project looks like from the outside** — its directories, files, and the
> cross-references and dependencies between them. This is the "where things live" map a fresh session
> reads to navigate. Its companion is `PROJECT_ARCHITECTURE_INTERNAL_MAP.md` (the *internal* logical
> architecture — the abstractions and how they interact).
>
> Adapt the vocabulary to the project's **sphere**: for software — directories, files, modules; for a
> research/writing/business project — sections, documents, datasets, artifacts. Keep it in sync with the
> real tree. **Living reference — never DONE-tagged.**

---

## The tree

The repository holds the ENGINE only. A mod pack (manifest + config + archive library) is the owner's
private collection, lives in its own folder with its own git, and is reached through `-PackDir` / `--root`.

```
D:\work\ai_sandbox\KUMM/          # the engine repo — shipped, public
├── kumm.mjs                      # Nexus half: CLI, CDP client, version check, downloader (637 lines)
├── Deploy-ModPack.ps1            # game half: unpack, deploy into game folders, verify (1003 lines)
├── package.json                   # npm bin "kumm"; node>=22; kaif:* handles
├── README.md                      # the storefront (Russian) — owner's handwriting
├── GOAL.md · STATUS.md · MASTER_PLAN.md · AGENT_GUIDE.md · PHILOSOPHY.md   # KAIF canon
├── PROJECT_STRUCTURE_EXTERNAL_MAP.md · PROJECT_ARCHITECTURE_INTERNAL_MAP.md
├── REQUIREMENTS_FRAMEWORK.md · TESTING_FRAMEWORK.md · BUG_FIXING_FRAMEWORK.md
├── EXPERIENCE.md · PROJECT_HISTORY.md · KAIF_FRAMEWORK.md
├── plans/ ideas/ bugs/ researches/ interviews/ homeworks/ reports/   # KAIF knowledge dirs
├── .kaif/                         # framework core: kaif.json, kaif-core.mjs, spheres/, tools/, hooks/
├── .claude/skills/ .agents/skills/ .grok/skills/ .cline/skills/ .roo/  # 35 skills × 5 agent systems
├── CLAUDE.md · AGENTS.md · .clinerules/ · .roo/rules/                 # context pointers
└── mods/                          # gitignored — never in this repo

<pack root>/                       # SEPARATE repo, e.g. D:\Games\Palworld Mods
├── modpack.json                   # nexusGame, gameExe, library, mods[] — the single source of truth
├── targets.json                   # the game folders to deploy into
├── _config/                       # Engine.ini / steam_emu.ini fragments referenced by the manifest
└── mods/                          # the archive library: Nexus-named .zip/.7z + _unpacked/ + OLD/
```

## What each part is

| Path | What it is | Depends on / references |
|------|-----------|-------------------------|
| `kumm.mjs` | Node CLI that talks to Nexus Mods through a debug-port Chrome (CDP). Commands: `launch`, `login`, `status`, `check`, `update`, `files`, `get`, `changelog`, `eval`, `close`. | `<pack>/modpack.json` (mods, `nexusGame`, `library`); Chrome binary; the CDP profile in `%LOCALAPPDATA%\nexus-cdp\profile` |
| `Deploy-ModPack.ps1` | PowerShell deployer: resolves each mod's source (archive or `_unpacked/`), copies it into every target game folder, writes `Engine.ini` / `steam_emu.ini`, then verifies. Interactive menu with no switches. | `<pack>/modpack.json`, `<pack>/targets.json`, `<pack>/_config/`, `%LOCALAPPDATA%` for `Engine.ini` |
| `package.json` | Declares the `kumm` bin and the `kaif:*` script handles. `files` ships only `kumm.mjs`, `README.md`, `LICENSE` — **`Deploy-ModPack.ps1` is NOT in the npm tarball** (see the drift note below). | `kumm.mjs` |
| `README.md` | The storefront, Russian, owner's voice. Exempt from `[AI]` provenance marks. | the two engine files |
| `.kaif/` | KAIF core: `kaif.json` (marker: version, lang, sphere, mode, origin), `kaif-core.mjs` (backs `kaif:*`), `spheres/`, `tools/`, `hooks/`. | — |
| `mods/`, `*.log`, `node_modules/` | Gitignored. The archive library never enters this repo. | — |

## Cross-references & dependency rules

1. **The engine never stores pack data.** Neither half keeps state of its own: everything they know
   comes from `modpack.json` at run time. A feature that needs to remember something between runs
   belongs in the manifest, not in the engine.
2. **The two halves do not call each other.** `kumm.mjs` fills the library; `Deploy-ModPack.ps1`
   reads it. Their only contract is the manifest plus the archive naming scheme
   (`<name> <ver> <modId> <ver> <ISO-date> <token>.<ext>`, parsed by `parseArchive`) — change either
   side of that scheme and both halves must change together.
3. **Paths inside the manifest are relative to the pack root**, resolved by `Resolve-UnderRoot` /
   `ROOT`. An absolute path in a manifest is legal but ties the pack to one machine.
4. **The game is a manifest key, never a hard-coded value.** `nexusGame` (Nexus slug) and `gameExe`
   (target sanity check) exist so Oblivion Remastered needs no engine change. Palworld is only the
   fallback default.
5. **KAIF documents link down, never up:** `AGENT_GUIDE.md` routes to the frameworks and the maps;
   the maps do not re-explain the guide.

## Entry points

Read in this order: `README.md` (what it does) → `GOAL.md` (why) → `STATUS.md` (where we are) →
`PROJECT_ARCHITECTURE_INTERNAL_MAP.md` (how it thinks) → the header comment of `kumm.mjs` (lines 1–42,
a complete CLI reference) → the `.SYNOPSIS`/`.DESCRIPTION` block of `Deploy-ModPack.ps1` (lines 1–39).

## Truth ↔ mirror pairs

| Truth | Mirror(s) | Check |
|---|---|---|
| `kumm.mjs` command switch (lines 623+) | the header comment (lines 18–28) · the README command table · `AGENT_GUIDE.md` Tools | `node kumm.mjs help` vs. the three lists |
| `package.json` `"files"` | what a user of `npm i -g kumm` actually gets | `npm pack --dry-run` — **known drift: `Deploy-ModPack.ps1` is absent, so the npm install ships half the engine** |
| archive naming scheme | `libraryName()` (writer) ↔ `parseArchive()` (reader) in `kumm.mjs` | round-trip one name through both |
| `modpack.json` keys | `kumm.mjs` (`nexusGame`, `library`, `mods[]`) ↔ `Deploy-ModPack.ps1` (`gameExe`, `library`, `mods[]`, `steamEmu`, `packName`, `builtFor`) | grep both halves for each key |

---

> Keep this map honest: when you add, move, or rename a file/directory, update the tree and the table in
> the same change. The *internal* logic (abstractions, data/interaction flows) belongs in
> `PROJECT_ARCHITECTURE_INTERNAL_MAP.md`.
