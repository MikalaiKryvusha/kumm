# Mod notes — Hair We Go (Workshop 3731128190, container `DeaHair`)

> **Created:** 2026-11-13 · **Parent:** plan 53 (the move onto 3.1.0), the knowledge-hook lock; facts from `ConanExiles/modpack.json` and the Workshop download of 2026-11-13
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** A set of UE5 hairstyles for character creation — fills the base game's shortage of haircuts (the owner's pick of 2026-09-09). One of the few
cosmetic mods of the catalogue that does NOT need Tot ! Custom, so it works in single player (manifest).

## Assets

- One pak, `DeaHair.pak` — 918 713 673 bytes in the 2026-11-13 21:36 upload (the manifest's risk line still says 774 MB — the size of an older version).
  The second-largest mod of the build after Highmane's Arsenal; the cost is the hair textures. Nothing depends on it — the first to drop if the build must shrink.
- Vanilla paths shipped whole: none in the 3.1.0 override matrix (`_scratch/overrides/mods-3.1.0-now.tsv`, 2026-11-13 21:1x — no `override` row for it).

## Versions

- 2026-11-13 19:02 — the author's upload after the 3.1.0 beta, taken at the move (plan 53 step 2).
- 2026-11-13 21:36 — re-uploaded again; taken 21:43 (steamcmd into `workshop-3.1.0`, `workshop-swap.py … 3_1_0_1902 3731128190 --apply`: the 19:02 copy
  → `mods/OLD/_workshop-3_1_0_1902/3731128190`). What changed in it — not read.

## How to look inside

`python -I -X utf8 ConanExiles/_config/mod-overrides.py <out.tsv> "D:/Games/Conan Exiles 3.1.0/ConanSandbox/Mods"` lists its paths; the container is `DeaHair`.

## Our edits

None.

## Open

- Not seen in game after the 21:36 update.
