# KUMM — Project History (the chronicle)

> The APPEND-ONLY chronicle of how this project lived and grew: closed sessions, shipped phases,
> releases, big decisions in the order they happened. This is where `STATUS.md` sheds its past —
> STATUS stays a short live summary of NOW; everything finished moves HERE (the "bonsai trim" step
> of `/end-chat`).
>
> **Not required reading.** This file is NOT part of `/resume`'s canon set and not in the
> before-every-task minimum — open it only when you actually need the archaeology: how a decision
> came to be, what an old phase contained, when something shipped.
>
> **Chronicle rules (ADR discipline):**
> - **Append-only, newest on top.** A recorded entry is never edited to say something else —
>   history that can be rewritten is not history. Corrections come as NEW entries that reference
>   and supersede the old one.
> - An entry moves here VERBATIM from `STATUS.md` when its work closes — move, don't rewrite;
>   the entry already carries its dates, counters and file pointers.
> - Entries mention versions and dates freely — a chronicle legitimately speaks of old versions,
>   and the update machinery's stale-claims scan knows to leave this file alone.
> - When the file grows unwieldy, split by era: keep the newest era here, move older ones to
>   `PROJECT_HISTORY_<era>.md` files, and leave a one-line index at the top of this file
>   (the pattern large changelogs use).
>
> Living document — never DONE-tagged.

---

## Entries (newest first)

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

### <date> — <session/phase/release title> <✅/🎉>
`<The entry as it lived in STATUS.md — verbatim: what was done, key numbers, file pointers.>`
