# Plan 49 — Conan: attributes without the cap of 20, their effects by formula past 20, and the attribute screen that pages past 20

> **Created:** 2026-11-07 · on the owner's words of 2026-11-07 19:50 – 22:02 (verbatim below)
> **Parent:** STATUS «FIRST NEXT CHAT» items (b), (c) and the owner's queue item 2; bugs 84, 86 (the same screen)
> **Status:** 🟡 recorded 2026-11-07 22:03 +03:00 · recon done 2026-11-08 13:1x · the cap removed by a pak edit 2026-11-08 23:47 (criteria 1–2 seen live) — the
> screen paging (criteria 3–5) not started
> **Outbound:** —

## Goal vector (Achieve)

The build's levelling is endless (KrinikConanGameplay, 10 000 levels, XP curve base 1000 since 2026-11-07 21:06). The hero's attributes follow it: the «+» stays past
20, every point keeps adding to the hero's stats by the game's own per-point formulas, and the attribute screen shows the rows and their perks past 20 page by page.

## The owner's words

- `[OWNER]` 2026-11-07 19:50 «я прокачал проворство до 20, и провал плюсик - это нужно убрать, так как прокачка у нас бесконечная» · «можно сколь угодно повышать дальше атрибут».
- `[OWNER]` 2026-11-07 20:50 «И откобчаем лимит на прокачку атрибутов. Делаем её бесконечной.» · «И она бесконечно будет по фотмулам влиять на характеристики героя».
- `[OWNER]` 2026-11-07 22:02 (a frame of the attribute screen: rows «Сила 20», «Проворство 20», each a golden scale with perk nodes at 5, 10, 15, 20, the
  «Осквер…» corrupted column on the right edge) «вот эти ряды навыков нужно научиться делать листаемыми, или скролл бар, или переключение "страницы шкалы"».
- `[OWNER]` 2026-11-07 22:02 (a frame of the right column «Живучесть»: the attribute's line, then the perks «Жажда жизни», «Второе дыхание» (greyed), «Быстрая
  регенерация», «Полнокровность», «Последний бой» cut at the bottom) «Эти списки с описанием перков нужно соответствующем образом уметь переключать на следующую
  страницу в соответствие со станицей шкалы перков».

- `[OWNER]` 2026-11-07 22:03 «в будущем будем сильно развивать систему перков, создавать новые перки для уровеней аттрибутов выше 20-го» — the paging is built for
  future perks past 20: a page is driven by the perk data (nodes at the levels the data names), not by hard-coded 5/10/15/20; pages without perks yet show the bare scale.

## Acceptance criteria

1. An attribute at 20 with free points shows «+»; a click raises it to 21; the screen shows 21 (frame at 4K and 1080p — HOUSE_RULES rule 17).
2. Each attribute's stat effect past 20 follows the game's own per-point curve (read from the game's data first — game map); a measured stat at 25 matches the formula.
3. The scale of a row pages (a scroll bar or page switch — the owner's pick of the two, shown as a mockup with statuses, rule 23): page 1 = 1–20, page 2 = 21–40, …
4. The perk-description column switches to the same page as the scale.
5. No overlap of the caption, nodes and the description column (bug 86) at all four resolutions.

## Steps

- [x] Recon: where the cap 20 lives — **2026-11-08 13:0x, bytecode of the 3.0.1 assets** (`retoc-5.8 to-legacy --filter BP_ProgressionSystem | UI/Inventory/Attributes`,
      `UAssetGUI tojson VER_UE5_8`, `kismet-trace.py`):
      - `BP_ProgressionSystem::CanGiveAttribute(Attribute) → CanGiveAttribute, HasBeenMaxed` = `Attribute < MaxAttributePointsSpent` AND `AttributePointsUndistributed ≥
        GetAttributePointCost(Attribute)`; `HasBeenMaxed` = NOT the first. **`MaxAttributePointsSpent` is a CDO int = 20**, used ONLY there.
      - `W_Attributes::AttributeViewUpdateRequested` reads the attribute by `StatHolder:GetIntStat`, calls `CanGiveAttribute`, passes its result to
        `W_Attribute::UpdateAttributeView(CanGiveAttribute, …)` → the ubergraph sets `LevelAttributeButton` («+») visible / collapsed by it.
      - `W_Attribute::UpdateView` scales the bar by `MaxAttributePointAllotment` (CDO int = **20**), `FClamp(value / 20, 0, 1)` — past 20 the bar stays full.
      - The stored value is not clamped (Agility 22 was accepted and shown on 2026-09-13, `ideas/03` :448).
      - Native `UAttributeSystem` per-point bonuses are flat floats (`BonusDamageMeleePercentagePerAttribute`, `BonusArmorPerAttribute`, `BonusHealthPercentagePerAttribute`,
        `BonusDamageRangedPercentagePerAttribute`, `BonusStaminaPerAttribute`, `BonusEncumbrancePerAttribute`) — linear per point; whether the native code clamps the
        attribute at 20 when applying them is NOT read (live check: an attribute at 25 → the stat). `BP_AttributeSystem` CDO overrides (read 2026-11-08):
        melee damage +0.05 (5 %) per point, armour +8, health +0.10 (10 %), encumbrance +15; ranged damage and stamina keep the C++ defaults (not in the CDO).
      - `ServerGiveAttribute` → the ubergraph (offset 1014): `IsServer` → `StatHolder:GetIntStat` → the SAME `CanGiveAttribute` — one variable gates the UI and
        the server. `GetAttributePointCost(A)` = `DT_AttributeSystem` row named `A` → `CostPerPoint` (our pak: 10 000 rows, cost 1 — no wall past 20).
      **Seen live 2026-11-08 13:1x (remote, no input; TC `TC_conan_xp1000_and_water_reflections_2026-11-08.md` A1–A2):** the lever — with
      `ps.MaxAttributePointsSpent = 2` three `ServerGiveAttribute(19)` stop Agility at 2; with 10 000 the next gives 3 (stat ids: `AttributeHealth` 14 = Vitality,
      `AttributeAthleticism` 19 = Agility, `StatHolder:GetIntStat(id, 1)`; `ServerResetAttributeAll` refunds). Effects past 20 continue (HUD, the hero at 50 %
      corruption, Vitality = Agility = n): health max shown 100 / 350 / 360 / 400 at n = 0 / 20 / 21 / 25 (+10 per point past 20, ×2 without the corruption),
      stamina 50 / 60 / 60 / 62, the speed line 71 / 78 / 78 / 80 — the native per-point bonuses have no cap; only the «+» (`CanGiveAttribute`) and the bar scale stop at 20.
      `FORK: options <a pak edit of the BP_ProgressionSystem CDO (MaxAttributePointsSpent → 10 000) and of W_Attribute (MaxAttributePointAllotment → the page size) |
      Lua sets ProgressionSystem.MaxAttributePointsSpent on the hero's spawn event> · price of error <a whole vanilla blueprint shipped in our pak overrides it for every
      mod that ships the same path and goes stale on a game update; a Lua assignment is one line per spawn> · consulted <HOUSE_RULES rules 8 and 24 (native data first;
      a value set once by an event is not a re-set after the game's work), the asset-override detector `mod-overrides.py` to run before the pak path>` — **DECIDED
      2026-11-08 23:05 by the owner: (A)** `[OWNER]` «(А) — правку пака скриптом». `mod-overrides.py` 23:2x: no mod of the build ships `BP_ProgressionSystem` or
      `BP_BaseProjectile`.
- [x] **DONE 2026-11-08 23:47, seen live (pack `121899e`, guide `bb00ad7`; report `testcases/reports/2026-11-08_conan-attributes-uncapped-dead-shot.md`):**
      cap 10000, Agility 25 → 26 accepted by the server, «+» on the 4K frame of «Хар-ки»; criterion 1 met (bar full past 20 — criteria 3–5 are the paging steps below).
      Build (A): `_config/devkit/vanilla_patches.py` — the GAME's chunk (`retoc get`) + `uaj setstr prop:Default__BP_ProgressionSystem_C/MaxAttributePointsSpent 10000`,
      same-size .uexp, `splice_chunk`; injected by `build-level-mod.py` step 4b into the three KrinikConanGameplay containers; step 6 checks the chunks. Cases
      `testcases/TC_conan_attributes_uncapped_and_dead_shot_2026-11-08.md` A1–A3. The same module carries the owner's Dead Shot change (×2 → ×1.2, D1–D2).
- [ ] Recon: the attribute screen's widgets (`W_Paperdoll…` / the attribute tree), how a row draws its scale and perk nodes, and the perks' data (are there perks past 20 — the
      game has none; `[AI]` what a page past 20 shows goes to him as a mockup).
- [ ] Mockup of the paging (scroll bar vs page switch) on our own frame, statuses on every element — to the owner.
- [ ] Build, cases, frames at four resolutions.
