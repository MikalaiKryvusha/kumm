# Run report — first-person camera does not look into the hero's neck (bug 69)

## 1. Work

`testcases/TC_conan_fp_neck_hidden_2026-10-29.md` (N1–N6) against the owner's words of 2026-10-29 (bug 69).

## 2. Contour

Conan Exiles Enhanced 3.0.1, the 3.0.1 build; `ConanCameraControl` from `_unpacked` copied into `ue4ss/Mods`; the owner's save, the beach; 4K;
the game in front (the owner's permission 10:45), the owner watching.

## 3. Runs

- 2026-10-29 10:49–10:50 (old mod) — remote: `SwitchToFirstPersonCamera`, `SetControlRotation` pitch 89, frame; `HideBoneByName('b_neck_1', 0)`, frame
- 10:51:46 build 1 deployed, restart: no «шея» line — the hero-appearance event does not fire in this mod (fail)
- 10:53:57 build 2 (install from `try_install_zoom_hook`), restart; 10:55–10:56 `mouse-seq.ps1` real wheel in ×10 / out ×4 / in ×6, remote reads, `capture-window.ps1 -Width 3840`

## 4. Checks

Hygiene: `luac -p main.lua` OK.
Functional run: the real wheel switches the view on the owner's save; the frames and the bone state read.

- N1 pass — «шея от первого лица: перехват встал» 10:54:39 (build 2).
- N2 pass — FP by the real wheel, pitch 89: sky and palms, the neck hidden.
- N3 pass — TP by the real wheel: the head in the helmet visible, hidden = false.
- N4 pass — FP again: hidden = true.
- N5 pass — the head-camera socket shown vs hidden: identical to 0.01 cm.
- N6 pass — control: neck shown in FP → skin fills the screen (10:49 frame).

## 5. Found

- Build 1: `NotifyOnNewObject("/Script/ConanSandbox.BasePlayerChar")` does not fire in this mod (known since 12.09) — fixed in build 2.
- Not checked: the hero's shadow in FP (a hidden bone usually loses its shadow too) — the sun near zenith, the shadow under the feet.

## 6. Traces

`ue4ss/UE4SS.log` 10:54:39; scratchpad `fp_up_before.webp`, `fp_up_after.webp`, `n2_fp_up.webp`, `n3_tp.webp`.

## 7. Verdict

pass (the shadow in FP not checked).
