# Test run report — first person: the head's shadow and the sheathed bow out of the view (KrinikConanCamera)

**Created:** 2026-11-22 10:40 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** Krinik Mod Pack 0.9.1-RC3 published bytes + the Locomotion fix + the dev remote,
KrinikConanCamera from the pack's source (v1 … v7 of the change, deployed `-Only KrinikConanCamera`), Conan Exiles Enhanced 3.1.1 (`D:\Games\Conan Exiles 3.1.1`)

## 1. Work

The owner's two items of 2026-11-22 09:40 — the head's shadow in first person (`bugs/114_…`, issue #13) and the bow on the back in the first-person view with a
tool in hand (`bugs/117_…`, issue #4) — against the case set `testcases/TC_conan_fp_head_shadow_sheathed_bow_2026-11-22.md` (F1–F6, V1, D1, C1, N1–N3).

## 2. Contour

The working build above, background path (`launch-bg.ps1`), the machine lock `kumm`; world entry by `enter-world-remote.sh`; the dry oasis beach
`{X=-82309, Y=231568, Z=-20000}` by `exec TeleportPlayer`, the hour 10:00, god on, the stand keeper on; the owner's camera `config.lua` copied out before every
deploy and back after (md5 `f9f59b7c…` equal every time). Six game launches 09:39–10:36, each closed by its own PID, no crash window.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-22 09:58 +03:00 | quick slots by `h:InpActEvt_Shortcut0_…_25` / `Shortcut4_…_21`, `h:SwitchToFirstPersonCamera()`, `pc:SetControlRotation({Pitch=70,…})`, `capture-window.ps1` (old code) | the defect reproduced: the bow's limb and string fill the view (`.work/fp_bow_back/x_p70_y0.jpg`) |
| 2 | 2026-11-22 10:00 +03:00 | `pult.sh "lua _G.__fft='on'|'off'; return dofile('KUMM/.work/tmp/fp_fix_try.lua')"` (the fix by hand, old code) | before / after: headless → head and hair in the shadow; the bow gone looking up (`sheet_ab.jpg`); `OwnerNoSee` removed the bow's shadow too (with `CastShadow` only — corrected 2026-11-22 13:3x: with `CastHiddenShadow` the shadow stays, EXP-0610) |
| 3 | 2026-11-22 10:09 +03:00 | v1 deployed, F1–F4 | F1, F2 pass; the vanity camera then showed the bow invisible on the back (`fp_after/sheet_f34.jpg`) — a defect of v1 |
| 4 | 2026-11-22 10:14 +03:00 | hooks on `EventOnThirdPersonChange` / `SetThirdPerson` / `SwitchCameraMode` (`KUMM/.work/tmp/view_events*.lua`), `h:SwitchToVanityCamera()` | the vanity path found: `EventOnThirdPersonChange tp=true`, no `SwitchToThirdPersonCamera` |
| 5 | 2026-11-22 10:21 +03:00 | v2 deployed, F1–F6, V1 | all pass (frames `fp_v2/sheet_a.jpg`, `sheet_b.jpg`); the neck threshold measured 10:1x (`fp_after/sheet_f6b.jpg`) |
| 6 | 2026-11-22 10:28 +03:00 | v3: `exec suicide` in first person | no camera-mod error; the new heroine's head and body without shadow — fixed in v5 / v6 |
| 7 | 2026-11-22 10:38 +03:00 | v6: `exec suicide` in first person, frames at four yaws | D1 pass: «без записи третьего лица: невидимым своим дана тень 2 · телу возвращена тень 6»; the shadow with the head (`fp_v2/sheet_d1.jpg`) |
| 8 | 2026-11-22 10:40 +03:00 | a batch of 2000 runs of the neck check's body by the remote | 3.5 µs a frame |
| 9 | 2026-11-22 10:44 +03:00 | my throwaway probe `KUMM/.work/tmp/list_teleports.lua` (reads every property of `BP_TriggerTeleport_C`) — dungeon recon, not this change | the game fell: EXCEPTION_ACCESS_VIOLATION in UE4SS; окно отчёта о падении закрыто, PID 38512; EXP-0609 |
| 10 | 2026-11-22 10:47 +03:00 | v7 (judge round 4: the old mesh's neck unhidden on a hero change): first person, pitch 80, `exec suicide`, respawn, `SwitchToThirdPersonCamera()` | neck hidden at 80 in first person; after the respawn neck open, the HUD pass «невидимым своим дана тень 2»; third person neck open; no camera-mod error |

## 4. Checks

Hygiene: `luac -p` clean on every version; `luac -l` — no accidental global in the new section after judge round 3.
Functional run: the real game, the heroine's quick-slot events, the view switches, the vanity camera, a death and a respawn — the frames looked at and the
  `[KrinikConanCamera]` lines read.
- F1, F2, F3, F4, F5, F6, V1, D1, C1, N1, N2, N3 — **pass** (details per case in the case set).
- The control: the same angles on the old code (run 1, run 2 «off») show the defects — headless shadow, the bow in the view.
- Judge: four rounds by fresh helpers on the diffs (round 4 on v6 — its verdict in the commit message).

## 5. Found

- v1 defect (mine): the first-person state mirrored from two hooks; the vanity camera bypassed them — fixed in v2 (EXP-0607).
- The bone open made the camera enter the neck above ≈ 76° — the neck hidden only above 70° (v2).
- `GetControlRotation()` per frame cost 17 µs — the property read (v3).
- A respawn straight into first person had no shadow for head and body — the HUD-birth pass and the no-record fallback (v5, v6).
- Not this change: KrinikConanArchery logs a caught Lua error at the heroine's death — «вид тела от первого лица: ошибка (сокет после экипировки) —
  … `GetPostProcessInstance`» (`main.lua:1859`), twice at 10:29:03; recorded in STATUS for its own fix.
- Not this change: `-Verify` names 4 files of KrinikConanMusic missing in the build (the mod is not in the published RC3 bytes).

## 6. Traces

`KUMM/.work/fp_bow_back/` (before), `KUMM/.work/fp_after/` (v1), `KUMM/.work/fp_v2/` (v2 … v6) — frames as JPEG from `capture-window.ps1`, deleted after the
owner's show; `UE4SS.log` of the build (`[KrinikConanCamera] первое лицо (…)` lines 10:09–10:38); the throwaway probes `KUMM/.work/tmp/*.lua`.

## 7. Verdict

pass — every case of the set passed by the player's path in the real game (v2 … v6, see the case set), v7 smoked (run 10); the owner's eye on the look is still to come (the show page).
