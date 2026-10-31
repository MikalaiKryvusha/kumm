# TC — plan 38 step 6: the camera page of «Моды Krinik'а» (KrinikConanCamera reads and takes the window's values)

> **Created:** 2026-10-31 · **Parent:** `plans/38_epic38_phase2_krinik_hub_window.md` step 6; STATUS «the camera and pack-manager pages»
> **Status:** written 2026-10-31 22:28 +03:00; run 22:28–22:34 (C1–C7 pass, C4 after a fix; C8 partly observed)
> **Outbound:** —

**Goal (Achieve).** The camera page shows the camera's CURRENT eight values (numpad tuning included), and «Сохранить» moves the camera and
writes the camera's own `config.lua` — the store file never holds camera keys.

**Design under test.** The camera publishes `KrinikCameraValues` (load, every `config.lua` write); the window shows them and on «Сохранить» hands
`KrinikCameraSet` over and bumps `KrinikSettingsVersion`; the camera takes the set on the next `GUIModuleController:ActivateModule(…, false)` (a game
window closing — an event, no timer).

**Stand.** As `TC_conan_hub_look_2026-10-31.md`; plus: the owner's live `KrinikConanCamera/config.lua` copied before the deploy
(`offset_z = 80.0`) and put back byte-equal after the run; the store file removed before the run.

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| C1 | The camera publishes at load | world entry; the remote reads `ModRef`-shared `KrinikCameraValues` through the hub section's state | a line with eight ids, `cam_height=80.0` (the owner's file) | pass 22:29 — `cam_dist=315.0;cam_height=80.0;cam_pitch=-2.0;cam_sharp=false;cam_side=0.0;cam_zoom_max=2125;cam_zoom_min=130;cam_zoom_smooth=9.0` |
| C2 | The page is live and shows the camera's values | the window opened, «KrinikConanCamera» clicked by the real mouse | the list holds the camera; eight rows; «Высота камеры» 80 (not the default 75) | pass 22:30 — the camera is first in the list and selected at opening (no click needed); eight rows, «Высота камеры» 80; window height 689 (frame c2) |
| C3 | A save moves the camera | the remote sets the height slider to 120 (`SetValue`), a real click on «Сохранить и закрыть», then the inventory closed | the section log `camera set handed over: …cam_height=120…`; the camera log `ОКНО «Моды Krinik'а»: принято 8 настроек`; a world frame — the camera higher | pass 22:30 and again 22:33 on the fixed build (100 / 400): `принято 8 настроек` at the inventory close; the hero's `ThirdPersonSpringArm` read `SocketOffset Z 100.0 arm 400.0`; world frame `c3_world_100_400` — the camera higher and farther |
| C4 | The camera writes its own file, the store holds no camera key | after C3 | `config.lua` `offset_z = 120.0`; `KrinikSettings.lua` has no `cam_` key | fail 22:30 → fixed → pass 22:33 — first `offset_z = 120.00000762939` (slider float noise); the window now rounds to the row's step: `offset_z = 100.0`, `arm_length = 400.0`; the store `return { }`, 0 `cam_` keys |
| C5 | Reopen shows the new value | the window reopened, the camera page | «Высота камеры» 120 | pass 22:31 — the slider read 120 at reopening |
| C6 | Control: no save, no move | a slider changed, «Закрыть без сохранения», inventory closed | the camera log silent (no «принято»), `config.lua` unchanged | pass 22:31 — `closed (без сохранения)`, still one «принято» line in the log, `config.lua` md5 unchanged |
| C7 | The owner's file back | the game closed, the copy restored | `cmp` of the live `config.lua` with the copy — equal | pass 22:34 — equal (copy `_save-backup/2026-10-31_2228-camera-config-before-hub-page`); the save restored, integrity ok |
| C8 | A save that does not touch the distance keeps the wheel | found at C3 (22:30): `apply(true)` would reset the wheel's distance to `arm_length` | the camera moves the distance only when the window changed it | fix 22:32 (`apply(moved)`); the moved branch seen (arm 400); the unmoved branch NOT observed on the fixed build (on the first build the arm stayed 230 by the zoom keeper) |
