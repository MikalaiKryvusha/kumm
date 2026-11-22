# Test cases — Conan 0.9.1: in first person the head and the sheathed weapon are hidden only from the player's own eyes, their shadow exists always, the camera never looks into the neck or the armour collar

> **Created:** 2026-11-22 · **Parent:** the owner 2026-11-22 13:10–13:11 (verbatim in `bugs/114_*`, section of this date): the neck-bone hide above 70° is a crutch,
> the shadow must exist always and not only from the sun; the game is multiplayer — other players see the bow and every body part always; for the player
> himself the head and the bow on the back may be invisible but cast a shadow. Issues #13, #4.
> **Status:** written 2026-11-22 13:3x before the code change; the live experiments behind the design — frames `KUMM/.work/fp_nosee/` (sheets c, e, f, i, j)
> **Outbound:** issues #13 / #4 — a comment after the run; closed after the owner's look and the next build

**Test basis.** The owner's words above; the UE practice for a part the owner's camera must not see while its shadow stays: `bOwnerNoSee` + `bCastHiddenShadow`
(`researches/first-person-body-camera/README.md` §4). Experiments of 13:2x on the build `D:\Games\Conan Exiles 3.1.1`: owner-no-see + hidden shadow keeps the
bow's shadow (sheet c); with no armour the open neck never enters the view at 74–85° with the bow or the axe (sheets e, f); a chest piece's collar enters at
78–85° (sheet i) and leaves with the camera 5 cm forward along the view (sheet j); a near-clip raise cuts the hand from 20 cm (sheet f) — rejected.

**Dimensions.** The view: first person, third person, the idle orbit. The pitch: −40 (the ground shadow), 60–85 (the push ramp). Gear: no weapon, the bow in
hand, the bow sheathed with the axe in hand, a chest piece on. Light: the sun at 10:00; a torch-lit place (the Wine Cellar) — optional. Not covered: a second
player's client (no second client on this machine — the code guard is the local-controller rule; said in the report), a dedicated server, mounts.

## Stand

The build `D:\Games\Conan Exiles 3.1.1`, background path, the machine lock `kumm`; the dry beach `-82309 231568 -20000`, the hour 10:00, god on. Quick slots:
1 — the hunting bow 51405, 2 — the stone hatchet 51011; chest piece 52442 «Нагрудник егеря» (put on by `SpawnItem` itself). Frames: `KUMM/.work/fp_nosee/shot.sh`
(`MODE=` empty — the mod's own state). Reads: `KUMM/.work/tmp/fp_nosee_try.lua` (`_G.__fnt='read'`), `AdjustableCamera.RelativeLocation`, `IsBoneHiddenByName(b_neck_1)`.

## Cases

| # | Situation | Action | Expected | Status | Seen |
|---|---|---|---|---|---|
| S1 | first person, the bow sheathed, the axe or nothing in hand, 10:00 | frames at pitch −40, yaws 0 / 90 / 180 / 270 | the bow's and the head's shadows on the sand; the bow not in the view; read: the sheathed bow `noSee true · vis true · cast true · hidSh true`, head / hair `hidSh true` | pass (v1 13:38, v2 13:49) | `sheet_v2_s1.jpg`: at yaw 180 the shadow with the head, the bow across the back and the raised axe; the bow not in the view at any yaw; read: bow `vis true · cast true · noSee true · hidSh true`, its ThrowingKnife child `noSee true · hidSh true · cast false` (kept dark), head and hair `vis false · hidSh true` |
| S2 | first person, the chest piece on, the axe in hand | pitch 55, 70, 78, 85 | no collar, fur or skin in the view at any pitch; `RelativeLocation.X` grows 0 → full push; `b_neck_1` never hidden | pass (v1 13:39, v2 13:50) | `sheet_v2_s2s4.jpg`: sky, hand and axe only, no collar or fur; `RelativeLocation.X` 0 / 7.5 / 10 / 10 at 55 / 70 / 78 / 85; `b_neck_1` hidden false at every pitch |
| S3 | first person, the axe in hand | pitch −40 frame; read the axe's mesh | the axe casts a shadow (`cast true`) | pass (v2 13:49) | the axe `cast true` in first person; the log «предметам в руке тень 1» (the axe taken after the record); its shadow on the sand (`sheet_v2_s1.jpg`, yaws 90 and 180) |
| S4 | first person, the bow sheathed | the bow drawn into the hand (slot 1) | the bow in the view, `noSee false`, `hidSh false` | pass (v1 13:40, v2 13:50) | the bow at `Socket_Bow`: `noSee false · hidSh false · cast true`, the ThrowingKnife child cleared too; at −55 the bow along the lower edge of the view (`v2_s4_bow_p-55.jpg`) |
| S5 | first person with the bow sheathed and the camera pushed (pitch 85) | switch to third person | the bow on the back visible (`noSee false`), `RelativeLocation.X` 0, the neck open | pass (v1 13:40, v2 13:51) | at 85 `rel X 10`, then third person: bow `noSee false · hidSh false`, `rel X 0`, neck open; the bow on her back in `v2_s5_tp.jpg` |
| S6 | first person, the bow sheathed | the idle orbit (`SwitchToVanityCamera`) | the bow on the back visible in the orbit view; the heroine has her head | pass (v1 13:41, v2 13:51) | first person at 80 (`rel X 10`, bow `noSee true`) → `SwitchToVanityCamera`: bow `noSee false`, `rel X 0`, `tp true`; the orbit frame `v2_s6_vanity.jpg` — head and the bow on the back |
| S7 | first person, pitch 85 | `exec suicide`, respawn | no Lua error in the log; the new heroine's camera offset 0 until she looks up | pass (v1 13:41, v2 13:52) | `exec suicide` at 85 in first person; v1 respawned in first person: `rel X 0`, at 80 → 10; v2 respawned in third person: `rel X 0`, first person + 80 → 10; no mod error in `UE4SS.log` |

## Neighbours (HOUSE_RULES 39)

| # | Neighbour of the change | Short case | Status | Seen |
|---|---|---|---|---|
| N1 | the third-person camera of the same mod | third person: the camera behind the heroine as before, the wheel zooms | pass (v2 13:51) | third person behind the heroine as before (`v2_s5_tp.jpg`); the wheel not exercised |
| N2 | the «E Взять» plate (KrinikConanUI, eye = the first-person camera) | first person at a pickup bush: the plate shows | pass (v2 13:49) | «E Взять» shows in first person at a pickup on the beach (`sheet_v2_s1.jpg`, yaw 180) |
| N3 | the bow aim in first person | the bow drawn and aimed at pitch 60: the bow and the arrow in the view, the shot leaves | partial (v2 13:50) | the bow held (not drawn) at −55 is in the view; the drawn aim at 60 not run (needs a held right mouse button) — owed |
