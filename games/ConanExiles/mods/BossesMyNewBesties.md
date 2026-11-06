# Mod notes — Bosses My New Besties (Nexus 18)

> **Created:** 2026-11-06 · **Parent:** plan 45 step 4, the knowledge-hook lock; facts from `ConanExiles/modpack.json`
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** Bosses, minibosses and unique NPCs can be knocked out and recruited as thralls. With the 100-follower limit it loads the game thread — if
stutters come, check this pair first (manifest).

## Assets

`/Game/Mods/BossesMyNewBesties/BMNB_SpawnDataTable` — its spawn rows, merged into the game's `Systems/SpawnTable/SpawnDataTable` (the boss rows it makes
recruitable).

`/Game/Systems/Thrall/BP_ThrallSystemComponent` — a vanilla path shipped whole; its only change against the game (2026-11-06 12:09 +03:00, `kismet-trace.py`): in
`ShowThrallPlaceable` a thrall tagged `Npc.Boss.Miniboss` / `Npc.Boss.WorldBoss` gives the placement ghost its own actor scale. Less Building Placement
Restrictions ships the same path and loads later — this change is lost in the build (C, interview #033); recruitment itself is in the spawn tables.

## How to look inside

`python -I -X utf8 ConanExiles/_config/devkit/patch-mod-asset.py extract BossesMyNewBesties BMNB_SpawnDataTable <work>`.

## Open

- 2026-11-06 (plan 45 step 4): 17 of its boss / elite spawn rows are also written by Heritage, 7 by EAA (both load later). **Heritage — judged 2026-11-06 11:10 +03:00:** the game
  merges the rows field by field; the live `SpawnDataTable` keeps this mod's `ProfessionTemplate`, `StatTemplate`, `StatModifierTemplate`, `NPCClass` on 17 of 17
  rows (e.g. `Aesir_Boss` → `/Game/Mods/BossesMyNewBesties/HumanoidNPCCharacter_20percentbigger_noknockout`) beside Heritage's races — nothing lost, nothing
  built. (Corrected: «`LootTable` C» and «LOST» of the file-level reading were false — the import index, then whole-row thinking; KUMM EXP-0458.) **EAA's 7 — judged
  2026-11-06 11:41 +03:00:** EAA replaces whole rows, so this mod's fields were LOST on the Silent Legion warriors 1–3, the Siptah devolved bird / demon-spider / werewolf
  bosses and the white tiger; merged into EAA's table (EAA's notes), live after: 7/7. The mod's own function (knock a boss out, recruit him) — not run in
  game yet.
