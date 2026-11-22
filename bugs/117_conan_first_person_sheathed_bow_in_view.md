# Bug 117 — first person: the bow slung on the back fills the view when looking up, with a tool in hand

> **GitHub issue:** [#4](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/4) — the public tracker of this defect (HOUSE_RULES 44)

**Status:** 🔧 fixed 2026-11-22 14:10 by the owner's words 13:10–13:11 — the sheathed weapon OwnerNoSee + CastHiddenShadow, visible to other players (pack 25dff5d, cases TC_conan_fp_shadow_always_owner_no_see_2026-11-22.md); the first fix (pack 388b127, SetVisibility) superseded; comment on #4 posted; closes after the owner's look and the next build
**Severity:** S3 (a visual defect: cosmetic by HOUSE_RULES 38) — flagged by the owner, so it is the owner's debt
**Version/build:** Krinik Mod Pack 0.9.1-RC1 … RC3, Conan Exiles Enhanced 3.1.1
**When/context:** the owner's play 2026-11-20 18:4x («[frame] от первого лица видно лук на спине», `PROJECT_HISTORY.md` entry 2026-11-20 18:42); again
2026-11-22 09:40 «и лук на спине — попадающий в поле зрения игрока от первого лица с топором в руках?». No local file existed until 2026-11-22 — I first told the
owner it was a new defect (corrected the same turn; EXP-0608).
**Fixing:** this session (with bug 114, the same code section)

## Symptom

In first person, with the bow sheathed on the back (`sheath_bow`, Game.ini `VisibleSheathedWeapons=0` — All) and a tool in hand, the bow's limb and string
fill the frame when the heroine looks up. Reproduced 2026-11-22 09:58 (old code): the bow sheathed by pressing its quick slot again, «Каменный топорик» (51011)
from slot 5, `SwitchToFirstPersonCamera()`, pitch +70 → `KUMM/.work/fp_bow_back/x_p70_y0.jpg`. Not seen at pitch 0, ±60 yaw, −45, −85 (still frames).

## Cause

The game draws the sheathed weapon for its owner's first-person camera; the camera at `b_headcam` sees above the shoulder when the head tilts back.

## Fix

KrinikConanCamera, first-person section: a mesh on or under a `sheath*` socket is made invisible with `CastHiddenShadow` (its shadow stays; `OwnerNoSee`
removed the shadow too — tried live 10:0x **with `CastShadow` only; corrected 2026-11-22 13:37 +03:00: `OwnerNoSee` + `CastHiddenShadow` keeps the shadow (13:2x,
`KUMM/.work/fp_nosee/sheet_c.jpg`), and since the owner's 13:11 word (multiplayer: the bow visible to other players always) the mod uses that pair instead of
`SetVisibility(false)` — `testcases/TC_conan_fp_shadow_always_owner_no_see_2026-11-22.md`**); only what the mod hid gets visibility back — when the weapon is drawn into the hands, and when the view leaves first
person, the idle vanity camera included (`EventOnThirdPersonChange`, EXP-0607). Re-passes 0.8 s and 1.6 s after `OnWeaponUnequip`: the bow reaches the back
0.3–1 s after the event. Notes: `games/ConanExiles/mods/KrinikConanCamera.md`.

## Cases

`testcases/TC_conan_fp_head_shadow_sheathed_bow_2026-11-22.md`: F2 (no bow at +70), F3 (the drawn bow visible), F4 (hidden again after a sheathe in first
person), V1 (the vanity view shows it), F5 (third person shows it).

## Decisions made without the owner

- `[AI]` The sheathed weapon is hidden from the first-person camera at every pitch (not only looking up): the camera cannot see it in a useful way, and its
  shadow stays.
- `[AI]` The rule is by socket name (`sheath*`): a melee weapon on the hip or a shield on the back with another socket name is not covered yet — not seen today.

## Links

`bugs/114_conan_hero_shadow_without_head.md` (the same section), `bugs/95_conan_first_person_bow_not_visible.md` (the bow in the hands in first person),
`bugs/69_DONE_conan_fp_camera_looking_up_clips_into_hero.md` (the neck).
