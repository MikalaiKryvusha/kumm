# Test cases — Conan first person: the heroine's shadow has a head; a sheathed weapon stays out of the view and keeps its shadow

> **Created:** 2026-11-22 · **Parent:** `bugs/114_conan_hero_shadow_without_head.md` (issue #13), issue #4 (the bow on the back in the first-person view),
> `bugs/98_conan_first_person_no_body_shadow.md` step 2; the owner's words 2026-11-22 09:40
> **Status:** written 2026-11-22 10:07 +03:00 before the run of the new KrinikConanCamera code; run 10:09–10:47 on v1 … v7: F1–F6, V1, N1–N3 passed on v2, C1 on v3+,
> D1 on v6; the committed v7 (pack `388b127`) got a smoke only (report run 10: neck by pitch, a death looking up, respawn, third person) — report
> `testcases/reports/2026-11-22_conan-fp-head-shadow-sheathed-bow.md`
> **Outbound:** issues #13 and #4 — closed only after these cases pass by the player's path (HOUSE_RULES 44.3)

**Test basis.** The owner: the first-person shadow has no head (2026-11-20 18:39, his frame `bugs/114_frames/owner_2026_11_20_1839.webp`); «и лук на спине —
попадающий в поле зрения игрока от первого лица с топором в руках?» (2026-11-22 09:40); issue #4: the bow's limb and string in front of the camera with a stone
tool in hand. Expected: in first person the shadow shows the head and the hair; a weapon on a «sheath_*» socket is not drawn for the camera and still casts
its shadow; a weapon drawn into the hands is drawn; in third person everything looks as before.
Reproduction found 2026-11-22 09:58 on the OLD code: bow sheathed (`sheath_bow`), «Каменный топорик» (51011) in hand, first person, pitch +70 — the limb
and the string fill the view (`KUMM/.work/fp_bow_back/x_p70_y0.jpg`); morning sun behind, pitch −55 — a headless shadow (`noon_off_y0.jpg`).

**Dimensions.** The view (first · third person); the weapon state (sheathed · in hand · changed while in first person · changed in third person, then
first); the pitch (−55 shadow · 0 · +70 · +85); the sun (behind the heroine). Not covered: a melee weapon on the hip (only the bow's sheath socket is
seen today), a shield on the back, a mount, multiplayer (the flags are local rendering).

## Stand

The build `D:\Games\Conan Exiles 3.1.1`, KrinikConanCamera from the pack's source (deployed `-Only KrinikConanCamera` 10:07, the owner's `config.lua`
kept byte-equal), background path, the machine lock `kumm`; the dry beach `{X=-82309, Y=231568, Z=-20000}`, the hour 10:00 (`BP_TimeOfDayManager_C:SetTimeOfDay(10.0)`),
god on, the stand keeper on. Quick slots: 1 — the bow (51402), 5 — «Каменный топорик» (51011). Slots are pressed by the hero's own input events
(`InpActEvt_Shortcut<N>_…({KeyName=…})`), the view by `SwitchToFirstPersonCamera()` / `SwitchToThirdPersonCamera()`, the pitch by `SetControlRotation`.
Reads: the `[KrinikConanCamera]` lines «первое лицо (…): голове тень N · убранного спрятано N · возвращено N», `fp-shadow-flags.lua`, frames by
`capture-window.ps1`.

## Cases

| # | Situation | Action | Expected | Status | Seen |
|---|---|---|---|---|---|
| F1 | third person, bow sheathed, hatchet in hand | switch to first person; pitch −55 with the sun behind | log «убранного спрятано 2» (смена лица) and «невидимым своим дана тень 2» (первое лицо); the ground shadow shows the head and hair | pass (v2, 10:21) | 10:21:36 both lines; frame `fp_v2/f1_shadow.jpg`: the shadow with the head, the hair and the bow on the back. Also v1 10:09 (`fp_after/sheet_f1.jpg`) |
| F2 | F1's state | pitch +70 | no bow limb or string in the frame | pass (v2) | `fp_v2/f2_up70.jpg`: sky, palm, the hatchet and the hand; before the fix `fp_bow_back/x_p70_y0.jpg` showed the limb and the string |
| F3 | F2's state | press slot 1 (draw the bow) | the bow in the hands is drawn; log «оружие взято … возвращено 2» | pass (v2, 10:24) | the bow `Socket_Bow` vis true; frame `fp_v2/f3_drawn.jpg` at pitch −55: the bow in the hands at the frame's bottom |
| F4 | first person, bow in the hands | press slot 1 again (sheathe) | the bow hidden by a repeat pass within 1.6 s (log «оружие убрано (повтор) … спрятано 2»); pitch +70 frame without the bow | pass (v2, 10:24) | 10:24:14 «(повтор) … спрятано 2»; `sheath_bow` vis false hidSh true; `fp_v2/f4_sheathed_up70.jpg` without the bow |
| V1 | first person, bow sheathed and hidden | the idle vanity camera (`SwitchToVanityCamera()`), then back to first person | in the vanity view the heroine has her head and the bow on her back; back in first person the bow is hidden again | pass (v2, 10:24) | `fp_v2/v1_vanity.jpg`: head and bow; `sheath_bow` vis true, neck not hidden, `GetIsInThirdPerson` true; back: vis false hidSh true. On v1 the same path left the bow invisible (`fp_after/sheet_f34.jpg`, right) — the defect v2 fixed |
| F5 | first person, bow sheathed and hidden | switch to third person | the bow on the back is drawn; log «вид: смена лица … возвращено 2» and «тень: записано … (третье лицо)» | pass (v2, 10:24) | `fp_v2/f5_tp.jpg`: the bow on the back; vis true, neck not hidden |
| F6 | first person | pitch +85, then back to −55 | no skin or inside of the neck fills the frame (bug 69 stays fixed); below 66° the neck bone is open again | pass (v2) | `fp_v2/f6_up85.jpg`: sky; `IsBoneHiddenByName(b_neck_1)` false at −55. Threshold measured with the bone open: 74° sky, 78° and 81° skin (`fp_after/sheet_f6b.jpg`) |
| C1 | first person, the neck pitch check running | a batch of 2000 runs of the check's body by the remote; the mod's minute line for comparison | the per-frame cost far under the 1 ms budget of all mods | pass (v3+) | the body (2 × `IsValid`, the `ControlRotation` property, 2 × `os.clock`) costs 3.5 µs a frame; `GetControlRotation()` alone cost 17 µs (v2 used it). The mod's minute line sums 1 ms clock steps and over-reads (v2 707 ms, v3 160 ms a minute) — reworded as an estimate (judge round 3) |
| D1 | first person | the heroine dies (`exec suicide`), respawns straight into first person | no Lua error from the camera mod; the new heroine's neck open below 70°; her head AND body cast a shadow | pass (v6, 10:38) | v3 10:29: no camera-mod error, neck open, but head and body without shadow (no record, unbuilt tree) → v5/v6: the HUD-birth pass «без записи третьего лица: невидимым своим дана тень 2 · телу возвращена тень 6» (10:38:37); frames `fp_v2/sheet_d1.jpg`: the shadow with the head by the bedroll. The Archery mod logs a caught error at the death (`GetPostProcessInstance`, «вид тела от первого лица: ошибка (сокет после экипировки)») — not this change, recorded separately |

## Neighbours (HOUSE_RULES 39)

| # | Neighbour of the change | Short case | Status | Seen |
|---|---|---|---|---|
| N1 | the first-person body shadow (bug 98, the same hook) | F1's frame: the body and the arms still cast | pass (v2) | `fp_v2/f1_shadow.jpg`: the arm, the body and the bow in the shadow |
| N2 | the third-person record (`record_tp_shadows`, extended) | log «тень: записано сеток с тенью N, своих видимых M» | pass (v2) | «записано сеток с тенью 10, своих видимых 7 (HUD героя)» and «(третье лицо)» 10:24:48 |
| N3 | the camera's own work (zoom, the spring arm) | the log keeps «ВЫБРАН компонент …» and the per-frame hold at world entry | pass (v2) | «удержание ПОКАДРОВОЕ: по разу на кадр» 10:19:5x; third-person frames at the usual distance (`fp_v2/f5_tp.jpg`) |
