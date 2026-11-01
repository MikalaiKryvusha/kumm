# Test cases — Conan: arrows stuck in an enemy stay in its ragdoll corpse and can be picked up

> **Created:** 2026-11-01 · **Parent:** `[OWNER]` 2026-11-01 09:11 «KrinikConanArchery · в этот мод идет еще одна фича · После смерти - регдол труп врага не должен
> уничтожать воткнутые в него стрелы - все стрелы сохраняются, торчат из трупа, их можно собрать.» · **Status:** cases written 2026-11-01 12:49 +03:00; run 12:51–13:12 — A1 pass, A2 fail (the game destroys the copy), A3–A4 blocked · **Outbound:** —

**Basis.** The owner's word above; the cause — the arrow copy `BP_DummyProjectile` destroys itself on the creature's `OnDestroyed` (notes `KrinikConanArchery.md`).
Code: `main.lua` section «стрелы остаются в трупе» (pre-hook on `DestroyDummyIfAttachedObjectIsDestroyed` → a new copy on the nearest `Corpse_C` mesh at the same bone).

**Stand.** The save of 2026-10-31 16:56 (bow in quick slot 1), god on, no other enemy within 60 m; a target creature summoned and frozen 8 m ahead
(`arrow-stand.sh summon / place 8 / freeze`); real shots by `aim-shot.sh`; the kill by the remote `KillCharacter`; frames by `capture-window.ps1`.

**Dimensions.** Target class: a wild creature (Kappa) · a humanoid. Arrows in the body at death: 1 · 3. Pickup: E on a corpse arrow. Control: `keep_in_corpse = false`
not run (the 2026-10-31 stand P8 is the control: 0 copies 2 s after the kill).

| # | Case | Steps | Expected | Status | Observed |
|---|---|---|---|---|---|
| A1 | The hook stands | first shot | log «стрелы в трупе: перехват уборки копии стоит» | pass | «родился Corpse_C, прицепленных к существам копий 3» (native CorpseBase) |
| A2 | Arrows move to the corpse | 3 hits, kill | log «стрела в трупе: … прицеплена true» ×3; 3 copies attached to the corpse's mesh 2 s later | fail | re-attached (attach true) and destroyed by the game's event 1–2 s later — report 2026-11-01_conan-arrows-corpse-recon.md |
| A3 | Seen on the ragdoll | frame of the corpse | the shafts stand in the body at the hit places | fail | observed: 0 copies 10 s after the kill (run 7, 13:09) — no shaft on the ragdoll |
| A4 | Picked up | E on a corpse arrow | the arrow count / weight grows; that copy gone | fail | observed: nothing to pick up — 0 copies after the kill (run 7) |
| A5 | Humanoid | the same on a humanoid | as A2–A3 | not run | — |

### Route (a) — unbind the copy from the creature's OnDestroyed (plan 40.4 R2; `researches/conan-arrows-in-corpse/README.md`)

| ID | Situation | Action | Expected | Status | Observed |
|---|---|---|---|---|---|
| A6 | a green Kappa frozen 8 m ahead, 1–2 real arrows in it (`aim-shot.sh`), the section with the unbind deployed | the remote reads the type and methods of the creature's `OnDestroyed` wrapper (`scratchpad/r2_probe.lua`, mode read) | a delegate wrapper with a `Remove` method listed (or the read says what it is) | pass | 23:17: two real shots into a frozen Kappa made invulnerable (`bCanBeDamaged` false — the first, wild Kappa died of the first headshot); `OnDestroyed` = `MulticastSparseDelegateProperty` userdata, `Remove` / `Clear` / `Add` are functions; `Remove(copy, "DestroyDummyIfAttachedObjectIsDestroyed")` returned with no error |
| A7 | as A6 | kill the Kappa (`KillCharacter`) | the log «отвязано от уборки существа N из N»; 10 s later the copies alive, attached to the corpse mesh at their bones (`r2_probe.lua` count) | pass | 23:18: the log «прицепленных к существам копий 2, отвязано от уборки существа 2 из 2» and «к трупу прицеплено 2 … срок 600 с»; +11 s: 2 copies alive, parent `Corpse_C_2147447348`, life 588 s (the 13:13 run without the unbind: 0 copies at +10 s) |
| A8 | as A7 | a frame from the side at +10 s | the shafts stand in the ragdoll | pass | 23:19 4K frame: the black-and-white fletching stands in the Kappa corpse's flank; the second shaft is hidden behind the body |
| A9 | as A8, the hero 1.5–4.7 m from a shaft, the crosshair on it | a real E | the arrow count +1, that shaft gone (plan 40.4 criterion 3) | not concluded | 23:19 at 4.7 m: E opened the CORPSE's loot (one EAA item, no arrows); 23:20 with `IsLootable` set true on both copies, aim at the copy's point (its nock end), distance not checked: E did nothing — copies 2, arrows 49. Two tries are not a verdict (TESTING_FRAMEWORK activity 6: ≥ 3 variants); the cause is NOT known — corrected 23:40 after the owner's «Из земли можно, а из трупа нельзя?». Next variants: how E takes a ground arrow (what the trace hits — the copy's collision, an interaction component), the same on a corpse arrow at 1 m with the crosshair on the shaft's middle |
| A10 | a wild Kappa NOT invulnerable, frozen | one real headshot kills it | the killing arrow stays in the corpse too | fail | 23:16: the corpse was born BEFORE the game spawned the copy («копий 0» at corpse birth); the copy read 0 0 0, life 0 right after, and was gone by 23:17 (the count showed only the next Kappa's two) — no leak, but the KILLING arrow is not kept: the section looks for copies only at corpse birth. **Fixed 23:2x and re-run — pass:** a copy born within 2 s of the last corpse re-runs the corpse pass; 23:25:37 four real shots into a vulnerable Kappa at 3 m, the 4th killed it: «прицепленных к существам копий 3» at the corpse birth, 0.12 s later «… 4», «к трупу прицеплено 4»; +11 s four copies on `Corpse_C_2147451929`, life 585 s |
