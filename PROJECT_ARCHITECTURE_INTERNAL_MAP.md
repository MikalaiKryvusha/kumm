# KUMM — Internal architecture map

> **The INTERNAL map: the project's logical architecture** — the abstraction objects the project's sphere
> works in, their essence, and how they interact. Where `PROJECT_STRUCTURE_EXTERNAL_MAP.md` says *where
> things live*, this says *how the system thinks*. A fresh session reads this to understand the model, not
> just the file layout.
>
> **Adapt the abstractions to the sphere:**
> - *Programming* — modules, interfaces, objects, data structures, data flows, state, protocols.
> - *Science* — hypotheses, variables, models, datasets, methods, inference chains.
> - *Sociology* — subjects, objects, institutions, roles, the relations between them.
> - *Business* — actors, processes, value flows, resources, constraints.
> - …and so on for any sphere. If unsure, describe the domain's nouns and the verbs that connect them.
>
> **Living reference — never DONE-tagged.**

---

## The core abstractions

| Abstraction | What it *is* (essence) | Responsibility |
|-------------|------------------------|----------------|
| **Pack** | A game build with mods, as a folder: manifest + config + archive library. Somebody's private collection; the engine only visits it. | Owns ALL state. `--root` / `-PackDir` name it. |
| **Manifest** (`modpack.json`) | The pack's declaration: `nexusGame`, `gameExe`, `library`, `mods[]`, optional `engineIni`, `steamEmu`, `packName`, `builtFor`. | Single source of truth for both halves. |
| **Library** | The folder of downloaded archives (`library` key; may be an absolute path outside the pack) plus `_unpacked/` and `OLD/`. | Holds *what is installed*, encoded in the file names. |
| **Archive** | One Nexus file on disk. Its NAME is a record: `<name> <ver> <modId> <ver> <ISO-date> <token>.<ext>`. | Carries mod identity + upload date without any database. |
| **Card** | One file row on a Nexus mod page, read from `dt[data-id][data-name][data-version][data-date]`. | The remote counterpart of an Archive. |
| **Target** | One game installation folder (`targets.json`), validated by `gameExe`. | The deploy destination; several may coexist across game versions. |
| **Mod source** | Either an archive to unpack or a ready folder under `_unpacked/`. Resolved once per action, reused across targets. | Decouples "where it came from" from "where it goes". |
| **CDP session** | One WebSocket to a dedicated debug-port Chrome, tabs as flat sessions. | The only channel to Nexus — it is what defeats Cloudflare. |

## How they interact

Two halves, one contract. Neither calls the other; both read the Manifest.

```
Nexus page ──listFiles──▶ Card ──┐
                                 ├──sameFile(upload date)──▶ stale? ──update──▶ Archive in Library
Library file ──parseArchive──▶ Archive ──┘                                            │
                                                                                      │
Manifest.mods ─────────────────────────────────────────────────────────────────┐      │
                                                                               ▼      ▼
                                                        Deploy-ModPack.ps1: Resolve-ModSource
                                                                               │
                                                        ┌──────────────────────┼───────────────┐
                                                        ▼                      ▼               ▼
                                                    Target 1.0.2          Target 1.0.3    %LOCALAPPDATA%
                                                   (copy + verify)       (copy + verify)   (Engine.ini,
                                                                                          written once)
```

**Download path (the whole reason KUMM exists).** `kumm` drives a real logged-in Chrome and issues the
same request the site's own button issues —
`POST /Core/Libs/Common/Managers/Downloads?GenerateDownloadUrl` with `fid` + `game_id` — which returns a
signed CDN URL that a plain `fetch` then pulls. No click emulation, no premium API endpoint.

**Staleness is decided by upload DATE, not version string** (`sameFile` → `stamp`, both sides rounded to
the minute). Authors re-upload files without touching the number, and a mod's header version routinely
differs from its file's version.

**Variant selection** (`pickCard`) picks among several main files (Steam/Gamepass, Capped/plain, presets)
by longest common prefix with the name already in the library, tie-broken by closeness in length;
`--variant` overrides; an empty library falls back to the newest upload.

## Invariants & rules of the model

1. **The engine is stateless.** No database, no cache, no config of its own. Everything is re-derived
   from the manifest and the library file names on every run. Adding hidden state breaks the model.
2. **The archive name is the record.** `libraryName()` writes it, `parseArchive()` reads it; the pair must
   round-trip. A renamed archive is an unknown mod.
3. **A download never silently replaces a library file.** `update` writes into `_incoming` and says so —
   swapping a version in the library is the owner's deliberate act.
4. **A target is only a target if `gameExe` exists in it.** Never write into an unvalidated folder.
5. **`Engine.ini` is per-machine (`%LOCALAPPDATA%`), written once per action; `steam_emu.ini` is
   per-target, written on every deploy.** Confusing the two corrupts one install or all of them.
6. **The game is data.** Any hard-coded "Palworld" outside a documented default is a defect — Oblivion
   Remastered must need only a new manifest.
7. **A deploy verifies itself** unless `-NoVerify`; a failed batch action exits 1.

## Key decisions embedded in the architecture

- **Chrome over an HTTP client.** Nexus is behind Cloudflare and its `download_link` API is premium-only.
  A real browser on a debug port is the only path that works on a free account without emulating clicks.
  Cost: Chrome must be installed and logged in once. Chrome 136+ ignores the debug port on the default
  profile, hence the dedicated profile in `%LOCALAPPDATA%\nexus-cdp\profile`.
- **Two languages, on purpose.** Node for the network half (zero deps, `fetch` + `WebSocket` built in);
  PowerShell for the filesystem half (native archive handling, ACLs, Windows paths).
- **Engine and pack live apart.** The engine ships publicly; the pack is a private collection with its
  own git. `-PackDir` is the seam; without it the script falls back to its own directory, which is how a
  self-contained pack still works.
- **Zero dependencies, Node ≥22.** No supply chain, no lockfile, no install step.

---

> Keep this in sync with the real logic as it evolves. When you introduce or retire an abstraction, or
> change how they interact, update this map in the same change. File/directory placement belongs in
> `PROJECT_STRUCTURE_EXTERNAL_MAP.md`.
