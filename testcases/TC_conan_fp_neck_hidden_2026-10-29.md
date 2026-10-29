# TC — first-person camera does not look into the hero's neck (bug 69)

> **Created:** 2026-10-29 · **Parent:** `bugs/69_conan_fp_camera_looking_up_clips_into_hero.md`
> **Status:** run 2026-10-29 10:52–10:56 — pass, report `testcases/reports/2026-10-29_conan-fp-neck-hidden.md`
> **Outbound:** —

**Basis.** `[OWNER]` «в FPV камере при поднятии камеры 90 градусов вверх - камера проникает в текстуру героя» · «сокрытие ТОЛЬКО для игрока» ·
«более простое решение» (2026-10-29). Fix: `ConanCameraControl` hides bone `b_neck_1` of the local hero mesh on `SwitchToFirstPersonCamera`,
shows it on `SwitchToThirdPersonCamera`.

**Stand.** The beach, no enemies near, hero idle, daylight; the view switched by the REAL mouse wheel (`_config/mouse-seq.ps1`, game in front —
the owner allowed the foreground 2026-10-29 10:45); the pitch set by the remote (`SetControlRotation` 89°). Dimensions: FP ↔ TP transitions
by the player's path, look straight up, the camera position. Not covered: death and respawn in FP, other players' view (no second client).

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| N1 | Hook installed | `UE4SS.log` after the world loads | «шея от первого лица: перехват встал» | pass 10:54:39 (second build: installed from `try_install_zoom_hook`; the first build hooked the hero-appearance event, which does not fire here — fail 10:52) |
| N2 | FP, look straight up | wheel in to FP, pitch 89° | frame: sky/palms, no skin filling the screen | pass 10:55 — real wheel ×10, `b_neck_1` hidden = true, frame: sky and palms |
| N3 | TP after FP | wheel out to TP | frame: the hero's head and neck visible | pass 10:55 — real wheel −4, hidden = false, frame: the head in the helmet |
| N4 | FP again | wheel in again, pitch 89° | sky again (the hook fires every time) | pass 10:56 — real wheel ×6, hidden = true |
| N5 | Camera does not move | remote: camera location with the neck hidden vs shown, same pose | equal to 0.1 cm | pass 10:56 — `b_headcam` socket shown and hidden: −94432.09 247467.07 −20009.84 both |
| N6 | Control: neck shown in FP | remote `UnHideBoneByName` in FP, pitch 89° | skin fills the screen again (the bug) | pass 10:49 (frame before the hide) |
