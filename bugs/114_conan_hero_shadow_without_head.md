# Bug 114 — the hero's shadow has no head

> **GitHub issue:** [#13](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/13) — the public tracker of this defect (HOUSE_RULES 44)

**Status:** 🔧 fixed 2026-11-22 14:10 by the owner's words 13:10–13:11 (KrinikConanCamera, pack 25dff5d — no bone hide, the camera pushed forward; cases TC_conan_fp_shadow_always_owner_no_see_2026-11-22.md); the first fix (pack 388b127, TC_conan_fp_head_shadow_sheathed_bow_2026-11-22.md) is superseded, comment on #13 posted; closes after the owner's look and the next build
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

## Work 2026-11-22 (the owner 09:40: «почему бы тебе тень головы от первого лица не починить?» — taken first, as his debt)

**Cause, observed.** KrinikConanCamera hid the bone `b_neck_1` for the whole first-person view (bug 69: the camera entered the neck looking up); a hidden bone
collapses the shadow with the mesh. The game itself makes the head and the hair invisible in first person, and an invisible mesh casts no shadow without
`CastHiddenShadow`. Live proof by hand (remote 10:0x, old code): the bone opened + `CastHiddenShadow` on the two invisible own meshes → the shadow with the head and
the hair (`KUMM/.work/fp_bow_back/sheet_ab.jpg`, top: before / after).
**The neck (SUPERSEDED 2026-11-22 13:3x — the «skin» was a medium armour's collar, the neck itself never enters the view; the bone hide is gone, the camera is pushed forward — see «Superseded» below).** With the bone open the camera is in the neck from ≈ 76° up (74° sky, 78° / 81° / 85° skin; the bone hidden → sky at 85°) — so the bone is
hidden only while the view pitch is above 70° and shown below 66°; looking at the sky, the head's shadow on the ground is out of view anyway.
**The fix** (KrinikConanCamera `main.lua`, the first-person section; notes `games/ConanExiles/mods/KrinikConanCamera.md`): the hidden shadow on the game-hidden
own meshes that had a shadow in third person; the neck by pitch in the per-frame hold loop (3.5 µs a frame measured in a batch, first person only); the view state read from the
game at `EventOnThirdPersonChange` (the vanity camera path); a fallback for a respawn straight into first person. The sheathed bow of issue #4 rides in the same
section (`bugs/117_…`).
**Cases:** `testcases/TC_conan_fp_head_shadow_sheathed_bow_2026-11-22.md` — F1 (the shadow with the head), F6 (no neck at 85°, the bone open again below),
V1 (the vanity view keeps the head), D1 (a death and a respawn straight into first person: head and body cast), C1 (the cost), N1–N3; judge rounds — the pack commit.
Fixing: this session.

## Decisions made without the owner

- `[AI]` Severity S3 (cosmetic by HOUSE_RULES 38); queued after the critical bugs 112 and 113.
- `[AI]` 2026-11-22: the neck thresholds 70° / 66° (measured entry ≈ 76°); above 70° the head's shadow is lost while the camera looks at the sky.
- `[AI]` 2026-11-22: the hidden shadow, not `OwnerNoSee` (the latter removed the shadow as well — remote 10:0x).
- **Superseded 2026-11-22 13:37 +03:00 by the owner's words 13:10–13:11** (verbatim: «Это не решение, а костыль. Тень должна быть всегда! Её может не только солнце отбрасывать.
  Придумай как это сделать!» · «игра мультиплеерная, так что для других игроков лук и все части тела должны быть видны всегда» · «для самого игрока от первого
  лица можно делать его голову прозрачной, но чтобы отбрасывала тень. и лук на спине можно делать прозрачным - чтобы не мешал обзору, но чтобы отбрасывал тень»):
  the neck-bone hide above 70° is removed — the first-person camera moves forward along the view from 55° (10 cm at 75°+) instead; the sheathed weapon gets
  `OwnerNoSee` + `CastHiddenShadow`. **Correction:** the 10:0x probe set `OwnerNoSee` + `CastShadow` only; with `CastHiddenShadow` the shadow stays (13:2x,
  `KUMM/.work/fp_nosee/sheet_c.jpg`) — the line above was wider than its observation. Cases `testcases/TC_conan_fp_shadow_always_owner_no_see_2026-11-22.md`.

## Links

- `bugs/95_…` — the bow in first person (look B), a likely neighbour
- `bugs/111_…`, `bugs/112_…`, `bugs/113_…` — the same session of the owner's play
