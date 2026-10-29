# TC — «Хар-ки» perk descriptions do not touch (bug 64 item 46) · RNF spawn rows point to existing tables (plan 36 item 2)

> **Created:** 2026-10-29 · **Parent:** bug 64 item 46; plan 36 item 2; helper reports of 2026-10-29 22:5x (cause and recipes — game map «perk rows», manifest RNF entry)
> **Status:** written 2026-10-29 22:5x, not run
> **Outbound:** —

**Basis.** Perks: the agent's frame 21:37 — «Берсерк» and «Кровожадный берсерк» touch (gap −1 unit between entries); fix `PerkDescription` slot padding 10/10 in
`KrinikUIFixes`. RNF: `RNF_Shared_WeightedSpawns` rows pointing to missing spawn tables (4 Wadai smelters, a Zingaran boss deleted; the Pictish alchemist 4 and
the «Pirate » typo repointed) — the game logs «SpawnNPC - could not find SpawnTable».

**Stand.** The owner's save, 4K, hub by the remote, tab «Хар-ки» by `NextCarouselWindow` ×2; attributes selected by real clicks (the game in front — the owner's
word «Игру в форграунд выводи при тестах»); `ConanSandbox.log` grep after the world loads and after 5 min in the world.

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| P1 | Kit report | read `kit-uifixes-edit.json` | the step `PerkDescription padding … (2.0, 5.0) → 10/10`, `saved_perk` true; the pak holds `W_AttributeInfoEntry_PerkView` | not run |
| P2 | «Сила» | the frame of the perk column | visible space between «Берсерк», «Кровожадный берсерк», «Сокрушительные удары» and between «Сложные связки» / «Как по мерке» | not run |
| P3 | Link lines | the same frame | both link lines run pip to pip, no stub above the top pip or below the bottom one | not run |
| P4 | Short rows | the same frame | rows of ≤ 3 lines keep their pip spacing (as in `stats.jpg`) | not run |
| P5 | All six attributes | click each | no description cut at the bottom of the column | not run |
| N1 | No missing spawn tables | world load + 5 min | `ConanSandbox.log`: 0 lines «could not find SpawnTable» with `RNF_` | not run |
| N2 | The pak mounts | the log | `MountMod … RagnarsNewFactions.pak` validate/extract, no errors of the mod | not run |
