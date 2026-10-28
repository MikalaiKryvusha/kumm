# Test cases — Conan bow: FOV notify to the queue window, softer FP zoom, smooth FP shift (re-measure of 2026-10-27 matrix)

> **Created:** 2026-10-28 · **Basis:** owner 2026-10-28 — «правки твои ждут твоих тестов» · «В первом лице приближение камеры при прикладке
> делать не таким сильным, но немножко делать» · «Камеру при прикладке от перового лица нужно двигать не резко, а плавно, условно, за 500 мс в
> позицию прикладки, и за 500 мс - возврат к обычной после прикладки»; yesterday's matrix `TC_conan_bow_camera_rmb_matrix_2026-10-27.md` (M2: release
> right after the shot held the zoom ≈0,9 s with the notify to the montage end).
> **Contour:** `D:\Games\Conan Exiles 3.0.1`; `KrinikBowFixes` rebuilt with the FOV notify 0…6,346 s (start of `BP_QueueWindow`);
> `KrinikArrowAim` with `fp_aim_fov_scale` 0,8 (FP aim FOV = default ×0,8 ≈ 86° instead of ×0,5 = 53,75°) and `fp_shift_ms` 500 (smoothstep);
> real input `_config/mouse-seq.ps1`, sampler `_config/fov-sampler.lua` (FOV, RMB, FP arm offset every 50 ms), runner `_config/rmb-case.sh`.
> The game is the agent's own run (owner told by voice before the real-input pass).

**Expected (the owner's spec):**
- E1 TP unchanged: RMB → ≈53,8°; shot while held → no zoom-out above 65°; release at any moment → ≥ 100° within 0,4 s (yesterday M2: 0,9 s at +0).
- E2 FP zoom: RMB held → FOV settles at 86 ± 2° (not 53,8°); release → ≥ 100°.
- E3 FP shift smooth: offset goes 0 → (−5, 16, 6) through ≥ 5 intermediate samples, reaching the end in 0,4–0,7 s; back the same on release.
- E4 no jumps: between two neighbouring samples the offset moves ≤ 4 cm on any axis; a release mid-way reverses from the current point.

Dimensions: view (TP · FP) × RMB timeline (hold · shot held · release at +0/+100/+300/+700 · early shot · mid-draw release · tap 100 ms ·
release mid-shift 250 ms) × switch while held. Not covered: walking variants (yesterday's T11/F5 stay for the next pass), mounted, crossbow.

| # | Case | Sequence (`mouse-seq.ps1`) | Expected | Status | Observation |
|---|---|---|---|---|---|
| N0 | Kit edit + build + mount | `kit-bowfixes-edit.py` (headless kit), `kit-buildmod.py KrinikBowFixes`, copy to `Mods/`; launch | report: one FOV notify, one `PlaySound` at 1,853; game log: pak mounted, no `Mod is too old` | pass | build 1 (17:01): notify 0…6,346 — failed N1, see there; build 2 (17:11): kit report `ok`, `BP_FieldOfViewChangeForDuration @0.000 dur 7.050`, ONE `PlaySound @1.853` (sound C of the owner's pick), wrapper 249 865 bytes, `devkitRevisionNumber` 1002; launches 17:11 and 17:15 — `Mounting mod pak file … KrinikBowFixes.pak`, «contributes 3 package(s)», no refusal; UE4SS: no `ошибка` lines; crash reporter: none |
| N1 | TP shot, keep held | `rdown, wait 1500, lclick, wait 1500, rup, wait 1000` | E1 | pass (build 2) | build 2, 17:12: aim 53,8°, max held after the aim 63,9° (one-two samples at the shot, yesterday's M1 blip), release → ≥ 100° in 176 ms, never back. Build 1 (notify 0…6,346), 17:04 — FAIL: aim 53,8°, after the shot 61 → 102,5 → 106,9° for ≈450 ms, back to 53,8° by +1 s while RMB held — the original zoom-out. Cause: after the shot the montage plays on by itself, so ANY notify end before the montage end drops the zoom while RMB is held. Build 2: notify back to the montage end + `KrinikArrowAim` exits aim on RMB release (`FieldOfViewChange(0.1, 0)` when the controller's mod is still 1) |
| N2 | TP shot, release at +0 | `rdown, wait 1500, lclick, rup, wait 1500` | E1 release ≤ 0,4 s | pass | 17:12: max held 55,4°; release → ≥ 100° in 171 ms (yesterday M2 T4: ≈920 ms); mod log «выход из прицела» |
| N3 | TP shot, release at +100 | `rdown, wait 1500, lclick, wait 100, rup, wait 1500` | E1 | pass | 17:12: max held 54,6°; release lag 175 ms; never back to aim |
| N4 | TP shot, release at +300 | `rdown, wait 1500, lclick, wait 300, rup, wait 1500` | E1 | pass | 17:12: max held 56,2°; release lag 172 ms (yesterday T6 with the mod: ≈580 ms) |
| N5 | TP shot, release at +700 | `rdown, wait 1500, lclick, wait 700, rup, wait 1500` | E1 | pass | 17:13: max held 55,5°; release lag 114 ms |
| N6 | TP early shot, keep held | `rdown, wait 300, lclick, wait 1500, rup, wait 1000` | E1 | pass | 17:13: max held 63,3° (blip at the shot); release lag 175 ms |
| N7 | TP release mid-draw | `rdown, wait 600, rup, wait 1500` | ≥ 100° within 0,4 s | pass | 17:13: release lag 130 ms |
| N8 | TP two shots without release | `rdown, wait 1500, lclick, wait 1500, lclick, wait 1500, rup, wait 1000` | E1 after each shot | pass | 17:13: max held 63,5° over both shots; release lag 175 ms |
| P1 | FP hold, no shot | (first person) `rdown, wait 1500, rup, wait 1500` | E2, E3, E4 | pass (build 2) | build 2, 17:14: offset 0 → (−5,16,6) in ≈450 ms, back in ≈400 ms, ≤ 4 cm per sample; FOV 86,0°; release → ≥ 100° in 135 ms; re-run after the P2 fix 17:16 — FOV 86, release lag 211 ms. Build 1, 17:0x: E2 pass — FOV 107,3 → 86,0° (settles in ≈400 ms), release → 107,5° in ≈60 ms; E4 pass — ≤ 2 cm per sample, ≈14 intermediate samples each way; E3 FAIL on time — shift took ≈900 ms in, ≈800 ms out: `ExecuteWithDelay(16)` fires once a frame (≈29 ms), so counting steps stretched 500 ms. Build 2: time from `os.clock` |
| P2 | FP shot, keep held | `rdown, wait 1500, lclick, wait 1500, rup, wait 1500` | E2 holds through the shot; offset held | pass (after fix) | 17:14 FAIL: after the shot FOV 86 → 53,8° while held — the FP test «camera ≤ 10 cm from the arm point» failed because our own offset puts the camera 18 cm away, so the native re-aim counted as TP. Fix: tolerance 10 cm + offset length. 17:16: held FOV min 86, max 89,1 (blip at the shot), offset held, release lag 133 ms |
| P3 | FP shot, release at +0 | `rdown, wait 1500, lclick, rup, wait 1500` | offset back smoothly (E3, E4); FOV ≥ 100° | pass | 17:14: release → ≥ 100° in 204 ms; offset back to 0 |
| P4 | FP tap 100 ms | `rdown, wait 100, rup, wait 1500` | no jump (E4); offset at most a short smooth bump | pass | 17:14: no offset at all (the press handler reads the key 100 ms later — released); FOV dips to 95° and back — native |
| P5 | FP release mid-shift | `rdown, wait 250, rup, wait 1500` | offset reverses from the current point (E4), back to 0 | pass | 17:14: (−2,5,2) → (−3,9,3) → back (−2,8,3) … 0 in ≈330 ms, no jump |
| P6 | Control: TP aim with the FP rule loaded | as N1 first second | TP FOV ≈53,8° (the FP rule does not leak into TP) | pass | N1–N8 17:12–17:13: TP aim 53,8° every time; mod log has no «первого лица» line in TP |
| P7 | FP two shots without release | `rdown, wait 1500, lclick, wait 1500, lclick, wait 1500, rup, wait 1500` | E2 after each shot | pass | 17:16: held FOV min 86, max 90,3 (blips at the shots); release lag 161 ms |
| N9 | Control of the release exit: release mid-draw | `rdown, wait 600, rup, wait 1500` | the game exits by itself; mod log shows NO «выход из прицела» line for this release | fail of the expectation, harmless | 17:13: the line DID fire (#7, no shot): 100 ms after a mid-draw release the controller's mod is still 1. The native exit follows with target 0 — by the bytecode a no-op after ours; return took 130 ms (native ≈120). Expectation was wrong, behaviour is right |
| X1 | Switch FP → TP while RMB held | FP, `rdown, wait 2000`, pult `SwitchToThirdPersonCamera()` at ≈+1,2 s, `rup, wait 2000` | no FP offset stuck; TP view sane after release | pass with a note | 17:17: after the switch (camera 215 cm from the arm) FOV stays 86 — the FP aim — until release (TP aim would be 53,8): a rare joint, nothing stuck; release → 107,3°, offset back to 0 in ≈400 ms |
| M4 | Full-charge sound C at the start of the hold loop | hold RMB ≥ 2 s | heard once per hold; again every 4 s while held | pass (presence); taste — the owner's ear | 17:40: TP, real RMB held 7 s, system audio recorded by WASAPI loopback (`SvarogsDream/tools/rec_audio.py`), sound C located by normalized cross-correlation: at 5,29 s and 9,22 s of the recording, ncc 0,97 both — once at the start of the hold loop and once more 3,93 s later (the 4 s loop repeats it while held); the overall game output was quiet (peak −48,5 dBFS) |
