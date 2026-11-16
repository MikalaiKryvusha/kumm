# Run report — the first-person bow look A / B re-shot in an open view

## 1. Work

`testcases/TC_conan_fp_bow_look_reshoot_2026-11-16.md` (R0–R7) — the owner's word 18:05 on review folder 87 (the hero faced a rock in every frame,
`[OWNER]` «ничего там не понятно»); interview #036 waits for his A / B.

## 2. Contour

Conan Exiles Enhanced 3.1.0 with the build (KrinikConanArchery Lua = the pack copy, md5 `6702cc5f…`, `fpl_neck` 1.0 / `fpl_spine` 1.0), the owner's last save
(Continue), background path, the machine lock taken 18:22, god on; the heroine `AB_human_female_C`, the crafted bow in hand; first person; the look switched by
`_config/fp-look-pp.lua`; place: the oasis (18182, 244749), yaw 339, in-game ≈ 10:40.

## 3. Runs


1. 2026-11-16 18:22 — `node D:/work/ai_sandbox/_tools/machine-lock.mjs take --who kumm …` · `powershell -File launch-bg.ps1` (PID 12200) · `bash _config/pult.sh "call W_MainMenu_MainMenu_C_… B_Continue"`.
2. 18:23 — `bash _config/god-on.sh` · `pult.sh "lua … h:SwitchToFirstPersonCamera(); GUIModuleController:EnableVanityCameraMode(false)"`.
3. 18:24 — yaw scan 159 / 249 / 339 / 69 at pitch 0, `capture-window.ps1 -Width 960`; 18:25 teleport 8 m along 339, `scan2_m55`.
4. 18:25 — the first series (V / A / B × −55 / −80): the frames LOST — the output path `"$OUT\\${K}_m$P.jpg"` came out as a literal `fp-reshoot${K}_m55.jpg`, the
   six captures overwrote two files (deleted file by file).
5. 18:27 — the series again with `printf`-built paths: `pult.sh "lua _G.__fpl = {…}; return dofile('…/fp-look-pp.lua')"` · `SetControlRotation({Pitch=-P, Yaw=339})` ·
   `dofile('…/fp-bow-angle.lua')` · `capture-window.ps1 -Out <path> -Width 3840`; `to_webp.py` (q 90).
6. 18:28 — `taskkill //PID 12200 //F` (no CrashReportClient) · `machine-lock.mjs release --who kumm`; 18:29 the page built, a headless Chrome shot looked at, `Invoke-Item` for the owner.

## 4. Checks


Hygiene: NONE (no code changed).
Functional run: the game walked by the remote on the owner's save; every frame READ by eye (descriptions in the TC rows) and the bow hand's angle read by the probe:
  V 78° / 77° · A 36° / 18° · B 32° / 11° at −55 / −80 (2026-11-14: A 37° / 18°, B 31° / 11° — the same within 1°).

| Case | Status |
|---|---|
| R0 view | pass |
| R1–R6 frames | pass |
| R7 page | pass (on his screen — his word) |

## 5. Found

- none in the build;
- own slip: the lost first series (run 4) — a Git Bash `\\$` inside double quotes kept `$` literal; paths are built by `printf` from now on.

## 6. Traces

frames `KUMM/.work/fp-reshoot/{V,A,B}_m{55,80}.webp` (+ `.jpg` sources); the page `D:\Games\Conan Exiles Mods\НА ОТСМОТР НИКОЛАЕМ\88_vid_luka_na_prostore\index.html`;
the probe lines in this report.

## 7. Verdict

pass — the frames show the look difference in an open view; the choice is the owner's (interview #036).
