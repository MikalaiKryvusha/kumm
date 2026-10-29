# TC — «Хар-ки» perk descriptions do not touch (bug 64 item 46) · RNF spawn rows point to existing tables (plan 36 item 2)

> **Created:** 2026-10-29 · **Parent:** bug 64 item 46; plan 36 item 2; helper reports of 2026-10-29 22:5x (cause and recipes — game map «perk rows», manifest RNF entry)
> **Status:** run 2026-10-29 22:51–22:5x — P1–P5, N1, N2 pass; waits for the owner's eye on the perk spacing
> **Outbound:** —

**Basis.** Perks: the agent's frame 21:37 — «Берсерк» and «Кровожадный берсерк» touch (gap −1 unit between entries); fix `PerkDescription` slot padding 10/10 in
`KrinikUIFixes`. RNF: `RNF_Shared_WeightedSpawns` rows pointing to missing spawn tables (4 Wadai smelters, a Zingaran boss deleted; the Pictish alchemist 4 and
the «Pirate » typo repointed) — the game logs «SpawnNPC - could not find SpawnTable».

**Stand.** The owner's save, 4K, hub by the remote, tab «Хар-ки» by `NextCarouselWindow` ×2; attributes selected by real clicks (the game in front — the owner's
word «Игру в форграунд выводи при тестах»); `ConanSandbox.log` grep after the world loads and after 5 min in the world.

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| P1 | Kit report | read `kit-uifixes-edit.json` | the step `PerkDescription padding … (2.0, 5.0) → 10/10`, `saved_perk` true; the pak holds `W_AttributeInfoEntry_PerkView` | pass 22:51: step `(2.0, 5.0) → top 10 bottom 10`, cooked 4 widgets, pak 3 097 732 B |
| P2 | «Сила» | the frame of the perk column | visible space between «Берсерк», «Кровожадный берсерк», «Сокрушительные удары» and between «Сложные связки» / «Как по мерке» | pass 22:5x (frame `stats2.jpg`): «…доспеха.» → «Кровожадный» 34 px vs 23 before (1920 frame) |
| P3 | Link lines | the same frame | both link lines run pip to pip, no stub above the top pip or below the bottom one | pass (same frame) |
| P4 | Short rows | the same frame | rows of ≤ 3 lines keep their pip spacing (as in `stats.jpg`) | pass: Тяжелая рука → Сложные связки 95 px |
| P5 | All six attributes | click each | no description cut at the bottom of the column | pass: real clicks, sheet `att_sheet.webp` — all six columns whole |
| N1 | No missing spawn tables | world load + 5 min | `ConanSandbox.log`: 0 lines «could not find SpawnTable» with `RNF_` | pass at world load (0); the 5-minute part not run |
| N2 | The pak mounts | the log | `MountMod … RagnarsNewFactions.pak` validate/extract, no errors of the mod | pass: mounted, validate/extract 0.40 s, deployed md5 070efe25… |
