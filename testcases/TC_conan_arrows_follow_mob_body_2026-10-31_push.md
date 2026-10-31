# Test cases — Conan: stuck arrows pushed to the hit bone's depth (plan 36 W13, KrinikConanArchery)

> **Created:** 2026-10-31 · **Parent:** plan 36 W13 (`[OWNER]` «вот видно стрелы торчащие из моба в воздухе» · «это моб ККаппа» · 2026-10-29)
> **Status:** written 2026-10-31 10:3x, before the run
> **Outbound:** the Kappa frame → the owner's eye

**Basis.** Bytecode 10:3x: the game puts the copy at the hit ImpactPoint (physics-body surface) and attaches it to the hit bone; our Lua pushed it a
constant 15 cm. Now the push = the bone's depth along the flight line, clamped to 15…60 cm.

**Stand.** Game in front, oasis save copy, god on, the oasis boss frozen 6 m ahead (found by name, re-found each call), aim checked on a frame.

| # | Case | Expected | Status | Observation |
|---|---|---|---|---|
| P1 | a hit on a humanoid | log «в тушку: … дослана на N см», 15 ≤ N ≤ 60, the copy still attached to the hit bone | partial | 10:34 «Гирканийский литейщик» frozen 6 m ahead: two hits, «кость удара b_spine_1, прицеплена к CharacterMesh0, сокет b_spine_1», «дослана на 60 см» — the CAP: the spine lies ≥ 60 cm ahead of the copy origin along the flight, so the copy origin is not the arrow tip; the NPC died (45 HP) before a look at the arrows. The push is capped back to 15 cm (old behaviour) until a frame of a living NPC shows where the arrow sits; the depth goes to the log |
| P2 | no regression of a miss | a miss into the ground: no push line, no error line | pass | 10:33–10:34: 6 misses into the landscape — «прицеплена к ничему», no «в тушку», no «ошибка» |
| P3 | the Kappa (the owner's case) | arrows sit in the shell, none hanging off the body when it moves | — | |

**Second slice (written 2026-10-31 10:53, before the run).** The push now counts from the arrow TIP: tip = copy origin + mesh length × (local Z · flight
direction), push = clamp(bone depth − tip, 15, 60); the log adds the tip, the mesh length, the Z sign and the impact point ahead of the origin.

**Stand (rule 11).** Background launch (the owner's last word «работай в фоне»), the machine lock, the oasis save copy `2026-10-31_1004-before-w13-arrows`
(restored after). God mode by `god-on.sh` ≈ 8 s after world entry. The target — an adult green Kappa summoned by the remote
(`CheatManager:Summon('/Game/Characters/NPCs/Primates/Blueprints/BP_NPC_Wildlife_Kappa_Green.BP_NPC_Wildlife_Kappa_Green_C')`), found by its
class each call (never a «nearest humanoid» — the companions), frozen by `CustomTimeDilation = 0` for the shots, released after. The hero turned to it
by the remote; aim checked on a frame before EVERY shot; shots by the real mouse (`mouse-seq.ps1`). Dimensions: the geometry read (P4), the push on a
thick body (P5), a moving body (P6), a humanoid (P7), a miss (P2 again). Not covered: rhino, elephant.

| # | Case | Expected | Status | Observation |
|---|---|---|---|---|
| P4 | the geometry is read, not assumed | the «в тушку» line carries the mesh length 70–90, the Z factor near ±1, and the impact point ahead of the origin; the tip and the impact point agree within 10 cm | fail → finding | 10:57–10:59, three hits (head ×2, right arm): mesh 76, Z factor 1.00 / 0.96, BUT the impact point stands 180–187 cm ahead of the copy origin (the tip at 76) — the copy is born ≈ 1.1 m short of the hit, where the arrow was before its last flight step; the head bone 237 cm. A side frame 10:59 (`s3_crop`): the arrow hangs horizontally in the air before the Kappa's snout — the owner's symptom reproduced with the 60 cm push. Formula changed: push = clamp(impact − tip + 10, 15, 200) |
| P5 | a hit into the frozen Kappa | the arrow shaft leaves the skin, no tip and no shaft gap off the body | pass | 11:02 after the change: «дослана на 121 см (… точка удара 187 см)»; a side frame from the SAME spot as the 10:59 one: the shaft enters the snout, the tip hidden, the fletching outside (pair `s3_crop` / `f1_crop`, scratch `w13/`) |
| P6 | the Kappa released and walking | frames every 0.35 s over 5 s: every visible arrow touches the body in each pose | partial | 11:04 released, 5 frames over 4 s: the arrow stays in the snout in every frame — but the Kappa did not walk (the hero hidden for the frame); the next tries were spoiled by a wild Kappa and by a release sent without the target's name; the owner then took the game (11:05) |
| P7 | a humanoid (no regression) | the arrow visible in the body, not buried whole | — | not run |
