# Bug 114 — the hero's shadow has no head

> **GitHub issue:** [#13](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/13) — the public tracker of this defect (HOUSE_RULES 44)

**Status:** 🔴 OPEN — recorded only; the chat is paused by the owner, no investigation started
**Severity:** S3 by the ladder (a visual defect: cosmetic by HOUSE_RULES 38) — flagged by the owner, so it is the owner's debt
**Version/build:** Krinik Mod Pack 0.9.1-RC1 (the release build), Conan Exiles Enhanced 3.1.1, the owner's working game `D:\Games\Conan Exiles 3.1.1`
**When/context:** 2026-11-20 18:39 +03:00, the owner's own play of the RC1 build, after bugs 111–113; his words (verbatim): «у тени героя нет головы»; his frame
**Fixing:** after the pause, after the critical bugs 112 and 113

## Symptom

On sand in sunlight the hero's shadow shows the body, the raised arms and a bow string, and above the shoulders only a low rounded blob with no head shape.
Frame: `bugs/114_frames/owner_2026_11_20_1839.webp` (the camera looks down at the shadow; the view is probably first person — not confirmed).

## Repro (deterministic)

Not known yet. To find: in which camera mode it happens (first person, third person, aiming the bow), with which headgear, and whether the vanilla game without
our camera / archery Lua mods shows the head in the shadow (the control case, HOUSE_RULES 24).

## Forensics

None yet.

## Root cause / Hypotheses

Not investigated (the pause). An unverified hypothesis, the commonest cause first: the first-person view hides the head mesh (or the helmet and hair) so the
camera does not see it from inside, and a hidden component casts no shadow unless it is set to cast a hidden shadow (`bCastHiddenShadow`) — the shadow loses
the head with the mesh. Our first-person bow look (`KrinikConanArchery`, bug 95) and the camera mod (`KrinikConanCamera`) are the places to read first; the
game's own first-person mode is the control.

## Fix plan

The camera mode and the hiding component by the control case → keep the head hidden from the camera and casting its shadow (at the source, HOUSE_RULES 24) →
neighbours (HOUSE_RULES 39: the helmet, the hair, the bow in first person, the third-person view) → a frame of the shadow before / after from one place.

## Decisions made without the owner

- `[AI]` Severity S3 (cosmetic by HOUSE_RULES 38); queued after the critical bugs 112 and 113.

## Links

- `bugs/95_…` — the bow in first person (look B), a likely neighbour
- `bugs/111_…`, `bugs/112_…`, `bugs/113_…` — the same session of the owner's play
