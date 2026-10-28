# Run report — Conan bow: zoom-out on the shot, release exit, softer FP zoom, smooth FP shift

## 1. Work

`testcases/TC_conan_bow_fp_smooth_zoom_2026-10-28.md` (N0–N9, P1–P7, X1, M4) against the owner's words of 2026-10-28 («правки твои
ждут твоих тестов» · FP zoom «не таким сильным, но немножко» · FP shift «плавно … за 500 мс … и за 500 мс - возврат») and the 2026-10-27 spec
(no zoom-out while RMB held; release never sticks).

## 2. Contour

`D:\Games\Conan Exiles 3.0.1`, the full 3.0.1 build (65 mods); `KrinikBowFixes` build 1 (FOV notify 0…6,346 s) and build 2 (notify
0…7,05 s + sound C), `KrinikArrowAim` 0.3.0 with `fp_aim_fov_scale` 0,8, `fp_shift_ms` 500 (time by `os.clock`), release exit
`FieldOfViewChange(0.1, 0)`, FP test with the offset tolerance; god mode, daytime, bow from slot 1; the agent's own run under the machine lock
(17:02–17:18), the owner away.

## 3. Runs

2026-10-28 17:02 launch (build 1) — N1, P1; 17:11 launch (build 2) — N1–N8, P1–P5; 17:15 launch (P2 fix) — P2, P7, P1, X1.
Commands: `powershell -File _config/launch-bg.ps1 -HoldSec 30` · `bash _config/enter-world-remote.sh` · `bash _config/pult.sh "exec God"` ·
`bash _config/pult.sh "lua return dofile([[…\fov-sampler.lua]])"` · `bash _config/rmb-case.sh <tag> <ms> "<seq>"` (real `SendInput` mouse) ·
summary `python -I rmb_summary.py <tags>` (scratchpad) · `powershell -File _config/close-game.ps1`.

## 4. Checks

Hygiene: `luac -p main.lua` ok; kit report `ok` (one FOV notify, one `PlaySound`); `repak info` V11 both platforms.

Functional run: real mouse input on the live build, FOV / RMB / FP arm offset read every ≈65 ms from the game, mod log read. TP: N1–N8 pass
  (max held FOV after the aim 54,6–63,9°, release → ≥ 100° in 114–176 ms, never back to aim). FP: P1 pass (86,0°, shift ≈450 ms in, ≈400 ms
  out, ≤ 4 cm per sample), P2 pass after the fix, P3–P5, P7 pass; P6 control pass (TP stays 53,8°); X1 pass with a note; N9 — expectation
  wrong, behaviour right; M4 (17:40, launch 17:39) — sound C found in the system audio by cross-correlation (ncc 0,97) at the start of
  the hold loop and again 3,93 s later while RMB was held; its taste is the owner's.

## 5. Found

1. Build 1: a FOV notify ending at 6,346 s brings the zoom-out back while RMB is held — the montage plays on after the shot, so only the
   montage end works; fixed in build 2 (notify to the end + release exit in Lua).
2. FP shift took ≈900 / 800 ms instead of 500: `ExecuteWithDelay(16)` fires once a frame; fixed — time from `os.clock`.
3. FP aim after a shot fell to 53,8°: the FP test counted our own 18 cm offset as third person; fixed — tolerance 10 cm + offset length.
4. N9: the release exit also fires on a mid-draw release (controller still at mod 1 after 100 ms) — harmless, recorded.

## 6. Traces

`ue4ss/Mods/KrinikAgentRemote/fov-N1…N8.tsv`, `fov-P1…P7.tsv`, `fov-X1.tsv` (game folder); `UE4SS.log` lines «выход из прицела»
(1)–(10) and «прицел от первого лица: обзор 86.0°»; kit report `ConanExiles/_config/devkit/kit-bowfixes-edit.json`; frames `s2.jpg`, `s3.jpg`
(scratchpad).

## 7. Verdict

pass for the camera (TP and FP, every case of the set) and for the presence of the full-charge sound (M4); not covered —
walking variants, mounted archery, the taste of the sound and of the 86° FP zoom (the owner's eye and ear).
