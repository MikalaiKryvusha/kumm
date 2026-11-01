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
| A6 | a green Kappa frozen 8 m ahead, 1–2 real arrows in it (`aim-shot.sh`), the section with the unbind deployed | the remote reads the type and methods of the creature's `OnDestroyed` wrapper (`scratchpad/r2_probe.lua`, mode read) | a delegate wrapper with a `Remove` method listed (or the read says what it is) | — | — |
| A7 | as A6 | kill the Kappa (`KillCharacter`) | the log «отвязано от уборки существа N из N»; 10 s later the copies alive, attached to the corpse mesh at their bones (`r2_probe.lua` count) | — | — |
| A8 | as A7 | a frame from the side at +10 s | the shafts stand in the ragdoll | — | — |
