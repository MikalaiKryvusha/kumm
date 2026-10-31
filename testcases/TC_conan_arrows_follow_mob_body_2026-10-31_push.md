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
