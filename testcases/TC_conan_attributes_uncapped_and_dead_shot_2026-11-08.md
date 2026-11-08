# TC — Conan: attributes past 20 (pak edit of the cap) and «Верная рука» arrow speed ×1.2

> **Created:** 2026-11-08 · on the owner's words `[OWNER]` 2026-11-08 23:05 «(А) — правку пака скриптом» · «это имбаланс. Если можно, я бы перк изменил, чтобы он
> процентов 20% прибавлял к скорости» · «чтобы суппер быстро не летала у новичка стрела»
> **Parent:** `plans/49_conan_endless_attributes.md` (criterion 1); KrinikConanGameplay notes; the pre-change Archery log (uncharged 2484–2499 cm/s before
> the trait, 4997–5004 after)
> **Status:** ✅ run 2026-11-08 23:36–23:47 — all cases pass; written 2026-11-08 23:22 +03:00
> **Outbound:** —

## 1. Goal vector

Achieve: (a) an attribute at 20 with free points keeps its «+», and a point raises it to 21 (server accepts it); (b) the Dead Shot trait (`Agility_10b`) adds
20 % to the arrow's initial speed instead of 100 %.

## 2. Stand

Build: KrinikConanGameplay rebuilt by `build-level-mod.py` (step 4b injects the edited `BP_ProgressionSystem` and `BP_BaseProjectile` chunks); installed into the
game. Background path, machine lock, the owner's save (the hero has unspent points and Dead Shot taken — 2026-11-07 19:50). Remote only — no real input.

## 3. Cases

| # | Case | Expected | Status |
|---|---|---|---|
| B1 | build: `build-level-mod.py --name KrinikConanGameplay …` | step 4b prints both edits (`MaxAttributePointsSpent 20 → 10000`, `ExecuteUbergraph_BP_BaseProjectile 2.0 → 1.2`), ≤ 8 bytes changed each; step 6 all ✅ incl. «ванильные блюпринты … 2 из 2» on three platforms | pass — 23:38 step 4b both edits, step 6 all ✅ (report 2026-11-08_conan-attributes-uncapped-dead-shot.md) |
| B2 | control of the guard: the same step with the double's old value set to 3.0 | the build stops «число 3.0 не найдено» (the guard can fail) | pass — the build stopped «число 3.0 не найдено» |
| A1 | remote: `ProgressionSystem.MaxAttributePointsSpent` read on the hero's component | 10000 | pass — «cap=10000 before=25 free=53» |
| A0 | the same probe on the build BEFORE the edit (control) | `cap=20` | pass — 23:27 «cap=20 before=25 free=53» (Agility 25 left by the 13:1x lever test) |
| A2 | `attr-cap-probe.lua` push: Agility (19) from 25 to 26 by `ServerGiveAttribute` (with the vanilla cap 20 the server refuses any point past 20) | after=26, free −1 | pass — «calls=1 after=26 free=52» |
| A3 | the attribute screen at 21, frame | «+» visible beside the row, «21» shown (bar full — paging is plan 49's later step) | pass — 4K frame: «Проворство 26», «Живучесть 25», «+» on both rows; bar full past 20 |
| D1 | the hero with Dead Shot: `LaunchProjectile()` uncharged, the Archery log's arrow speed | ≈ 2990–3000 cm/s (2490 × 1.2), not ≈ 5000 | pass — 5999 → 3000 cm/s with the trait (4979 → 2490 without), ×1.2 |
| D2 | control: the same hero and shot before the change — the Archery log of 2026-11-07 (4997–5004 cm/s with the trait, 2484–2499 without); pulling the pak out would also drop the level tables of the save, so the recorded log is the control | D1 ≠ the control by ×1.67 (2.0 / 1.2) | pass — 3000 vs 4997–5004 before = 2.0 / 1.2 |
| D3 | (added after the owner's 23:55 «а текст перка подправил?» — missed in the first set) the perk text: `vanilla-overrides-ru.tsv` row → `vanilla-override.py` → `locres-regress.py` → deploy; «Хар-ки» with the Agility info (`W_AttributeInfo_C:SetAttributeInfo(A_Agility)` by the remote), 4K frame | «Верная рука — … летят на 20% быстрее …»; locres lost 0 | pass — 2026-11-09 00:0x frame shows the new text; 54458 → 54459 entries, lost 0, changed 0 |
