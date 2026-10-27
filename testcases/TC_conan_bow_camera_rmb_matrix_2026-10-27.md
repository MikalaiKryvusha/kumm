# Test cases — Conan bow: camera on RMB, shot, release, first person (matrix of joints)

> **Created:** 2026-10-27 · **Basis:** owner 2026-10-27 20:2x — «да, тестируй сам, расширенно» · «наживай, отпускай, стреляй, эмулируй реальные
> нажатия кнопок» · «тестируй много разных кейсво и комбинаций» · «там баги на границах, на стыках логик!»; plan 36 items 34, 43; earlier words —
> «если пкм отпускаю - она должна отъезжать, уходить из прицельного приближения» · «камеру нужно помещать над стрелой» · «её нужно перемещать
> ТОЛЬКО на прицельную стойку» · «левее» (FP offset (−5, 16, 6) accepted: «от первого лица вид в прикладке стал хороший»).
> **Contour:** `D:\Games\Conan Exiles 3.0.1`, the build with `KrinikArrowAim` (keep_aim OFF, FP offset on RMB events); input — real Windows
> `SendInput` (`_config/mouse-seq.ps1`), game window in front during the sequence; sampler — the pult records FOV and the FP arm offset
> every 50 ms (`_config/fov-sampler.lua` via `lua dofile`); god mode, bow + arrows.

**Expected behaviour (the owner's spec):**
- E1 TP: RMB held → aim view (≈54°); a shot while RMB is held does NOT throw the camera out (target: FOV ≤ 60° on every sample after the shot
  while held; baseline today: 88–107° for ≈0,6 s — the bug); release RMB → normal view (≥ 100°) within 0,6 s, at ANY moment, never stuck.
- E2 FP: RMB held → camera over the arrow (`FirstPersonCameraArm.SocketOffset` = (−5, 16, 6)) within 0,2 s; released → (0, 0, 0) within 0,2 s;
  never shifted without RMB; FOV unchanged (FP has no aim zoom).
- E3 no jerks: FOV never jumps up and back within ≤ 3 samples (a twitch) while RMB is held.

Dimensions: view (TP · FP · switch while held) × RMB timeline (tap 100 ms · hold 1,5 s no shot · full draw → shot → keep 1,5 s · shot → release
at +0 / +100 / +300 / +700 / +1500 ms · early shot at 0,3 s draw · release mid-draw) × movement (stand · walk W) × repeat (two shots without
release). Not covered on purpose: mounted archery, crossbow (separate pass), controller input.

| # | Case | Sequence (`mouse-seq.ps1`) | Expected | Status | Observation |
|---|---|---|---|---|---|
| B0 | Baseline TP, mod as is (no montage patch): full draw → shot → keep 1,5 s → release | `rdown, wait 1500, lclick, wait 1500, rup, wait 1000` | records today's native zoom-out at the shot (bug reference) | pass (baseline recorded) | 20:26, real input: RMB → 107,5 → 53,8° in ≈450 ms; shot → 106° within ≈120 ms, held ≈650 ms, back to 53,8° in ≈500 ms while RMB held (THE BUG); release → 107,5° in ≈120 ms. Cause in data: the montage FOV notify ends 0,24 s after the fire section `se` starts (5,83 → 6,08 s) |
| T1 | TP tap | `rdown, wait 100, rup, wait 1000` | aim may begin; after release ≥ 100° within 0,6 s | pass (native) | 20:27: zoom starts, release → 107,4° in ≈350 ms, no stick |
| T2 | TP hold, no shot | `rdown, wait 1500, rup, wait 1000` | ≤ 60° while held; ≥ 100° within 0,6 s after release | [NOT-TESTED] | |
| T3 | TP shot, keep held | `rdown, wait 1500, lclick, wait 1500, rup, wait 1000` | E1: ≤ 60° all held samples after the shot; release → ≥ 100° | [NOT-TESTED] | |
| T4 | TP shot, release at +0 | `rdown, wait 1500, lclick, rup, wait 1500` | ≥ 100° within 0,6 s; never back to 54° | pass (native) | 20:27: release at the shot → 104,5° in ≈60 ms, 107,4° next sample |
| T5 | TP shot, release at +100 | `…, lclick, wait 100, rup, wait 1500` | same as T4 | [NOT-TESTED] | |
| T6 | TP shot, release at +300 | `…, lclick, wait 300, rup, wait 1500` | same as T4 (mid-transition joint) | pass (native) | 20:27: shot → 107,4° (the native zoom-out), release at +300 keeps 107 |
| T7 | TP shot, release at +700 | `…, lclick, wait 700, rup, wait 1500` | same as T4 (joint with the native re-aim ≈0,7 s) | pass (native) | 20:27: same as T6 |
| T8 | TP early shot (0,3 s draw), keep held | `rdown, wait 300, lclick, wait 1500, rup, wait 1000` | E1 | [NOT-TESTED] | |
| T9 | TP release mid-draw | `rdown, wait 600, rup, wait 1500` | ≥ 100° within 0,6 s | pass (native) | 20:27: release mid-draw → 105,1° within ≈120 ms |
| T10 | TP two shots without release | `rdown, wait 1500, lclick, wait 1500, lclick, wait 1500, rup, wait 1000` | E1 after each shot; release → ≥ 100° | [NOT-TESTED] | |
| T11 | TP walking: shot while held | `keydown W, rdown, wait 1500, lclick, wait 1500, rup, keyup W, wait 1000` | E1, E3 | [NOT-TESTED] | |
| F1 | FP hold, no shot | (first person) `rdown, wait 1500, rup, wait 1000` | E2 | pass | 20:28: offset (−5,16,6) ≈130 ms after RMB, (0,0,0) ≈120 ms after release; FP aim zooms to 53,8° too (real input) |
| F2 | FP shot, keep held | `rdown, wait 1500, lclick, wait 1500, rup, wait 1000` | E2 holds through the shot | partial | 20:28: offset held through the shot (pass); FOV goes out to 107,5° for ≈650 ms at the shot — the same native bug as B0 |
| F3 | FP shot, release at +0 | `rdown, wait 1500, lclick, rup, wait 1000` | offset (0,0,0) within 0,2 s | pass | 20:28: offset (0,0,0) ≈130 ms after the release at the shot; FOV 107,4° ≈250 ms after |
| F4 | FP tap | `rdown, wait 100, rup, wait 1000` | offset never stays after release | partial | 20:28: tap 100 ms — the offset appears AFTER the release for ≈130 ms (the press handler reads the key 100 ms late while it is still down) — a short sideways jump on a tap |
| F5 | FP walking, shot | `keydown W, rdown, wait 1500, lclick, wait 1000, rup, keyup W` | E2 | [NOT-TESTED] | |
| X1 | Switch FP → TP while RMB held | FP, `rdown, wait 800`, wheel out to TP, `wait 800, rup` | no FP offset left in TP; TP view sane after release | [NOT-TESTED] | |
| X2 | Switch TP → FP while RMB held | TP, `rdown, wait 800`, wheel in to FP, `wait 800, rup` | offset (0,0,0) after release; FOV normal | [NOT-TESTED] | |
| M0 | `KrinikBowFixes` builds and mounts (kit mod: bow montage override + `S_ChargeFull`) | `kit-buildmod.py KrinikBowFixes …`; deploy into `Mods/` + `modlist.txt`; launch | cook finds both packages; wrapper V11; game log: pak mounted, no `ValidateMod`/`ModCompat` refusal, no new error class | [NOT-TESTED] | |
| M1 | With the mod: TP shot while held — no zoom-out (the owner's main ask) | as T3 | FOV ≤ 60° on every held sample after the shot; release → ≥ 100° within 0,6 s | [NOT-TESTED] | |
| M2 | With the mod: the joints again — T1, T4, T6, T7, T8, T9, T10, T11 | as listed | E1 and E3 on each; release never sticks | [NOT-TESTED] | |
| M3 | With the mod: FP — F1–F5 | as listed | E2; FOV held through the shot | [NOT-TESTED] | |
| M4 | Full-charge sound (owner's file, peak at 50 ms) | hold RMB ≥ 2 s; record system audio around the moment the hold loop starts | one sound at the start of the hold loop; every further 4 s while still held — reported to the owner as a choice | [NOT-TESTED] | |
| X3 | Control: test file `test_rmb.txt` absent in every case | `ls` the mod folder before the pass | absent | pass | 20:24 `test_rmb.txt` absent |
