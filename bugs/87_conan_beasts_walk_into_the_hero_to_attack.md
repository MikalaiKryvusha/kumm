# Bug 87 — beasts walk INTO the hero to attack (the body overlaps the hero)

**Status:** 🔴 OPEN — recorded from the owner's frame and words
**Severity:** S2-visible (combat looks broken; the owner: «это выглядит как баг»)
**Version/build:** Conan Exiles 3.0.1 build · **When/context:** 2026-11-07 22:22 +03:00 — the owner's frame in chat during the agent's stand run (a feral tiger attacking the hero)
**Fixing:** this session, after the control case

## Symptom (the frame, described — the image lives in the chat only)

`[OWNER]` 2026-11-07 22:22 «многие звери странным образом ОЧЕНЬ сильно приближаются к герою, чтобы его бить.» · «это выглядит как баг». The frame: a tiger
(1 070 / 1 070 HP bar) stands INSIDE the hero — the hero's head and turban stick out of the tiger's back, the tiger's head at the hero's feet.

## Expected

`[OWNER]` 2026-11-07 22:23 «уверен. что они модли бы стоять от героя чуть дальше. и при этом так же успешно наносить по герою удары» — the beast stops at the
edge of its reach (bodies apart) and its hits still land.

## Hypotheses (ranked)

1. The build's `EnhancedPlayerIgnoresFollowerCollision` (PIFC) makes the player ignore pawn collision with more than followers (all creatures / the Pawn channel),
   so a beast's capsule walks into the hero's. Control: the same beast with PIFC's pak out (rule 24) — does it stop at its normal attack distance?
2. A mod changes the beasts' attack range / acceptance radius (EAA creature mods, `EAA_FeralTiger_C` is an EAA class).
3. Vanilla: Conan's beasts stop at their capsule edge; a big beast's capsule is small relative to its mesh (vanilla look).

## Measurement (remote, 2026-11-07 22:23 +03:00)

`EAA_FeralTiger_C`: capsule radius 96 cm, the hero's 42 cm (sum 138); attacking it stood 140 cm centre-to-centre (22:20, heard-stand) — the capsules TOUCH, they do not
pass through → hypothesis 1 (PIFC switches pawn collision off) is unlikely. Its controller: `GetCurrentWeaponMinRange` 0, `GetCurrentWeaponMaxRange` 150 cm. So the AI
closes to < 150 cm centre-to-centre — less than the tiger's own half-length in front of its capsule centre — and its head and paws end up inside the hero. Lever to
recon: the beast's attack range (the weapon's range data / `GetCurrentAttackRangeOverrides`, `IsInCombatRange`, `HasTargetInAttackRange` of
`ConanAttackerAIController`) — raise the stop distance by the body length beyond the capsule, keep the hit landing (the hit traces come from the attack, check they still
reach). Compare a vanilla beast of similar size (control without the EAA paks).

## To do

1. Read PIFC's notes / settings (its own setting first — rule 8); the control case with its pak out; measure the beast–hero distance at attack (remote: capsule radii + distance).
2. Fix natively (PIFC's option or its collision rule restricted to followers), frame before / after.

## Links

- the stand run of bug 85 K13 (heard-stand.lua, a feral tiger at 1.4 m from the hero 22:20) · `games/ConanExiles/mods/` (PIFC has no notes file yet).
