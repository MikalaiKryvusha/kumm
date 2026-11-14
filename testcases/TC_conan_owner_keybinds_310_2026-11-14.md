# TC — Conan 3.1.0: the owner's six key bindings work again (plan 53 step 14)

> **Created:** 2026-11-14 · **Parent:** `plans/53_conan_move_3.1.0.md` step 14 · **Status:** written 11:59; run 12:00–12:08 (game PID 10400), control run 12:09–12:16
> (PID 12100) — all cases pass · **Outbound:** — (the owner's own play is the final check; a full dodge roll needs a hero that is not overloaded)

**Test basis:** the owner's live 3.0.1 `Input.ini` (2026-11-13 12:50) — read by `ConanExiles/_config/input-edits.py` against the game's `DefaultInput.ini`
(byte-identical in 3.0.1 and 3.1.0, as are the six other input configs of `pakchunk0`): exactly six edits — `CrouchMode` C → LeftControl ·
`DodgeActionV2` LeftAlt → ThumbMouseButton (mouse side button) · `SecondaryActionV2` LeftControl → MiddleMouseButton (heavy attack) · `GlobalChat` Enter → None ·
`GuildChat` Subtract (numpad −) → None · `VicinityChat` Multiply (numpad *) → None. The numpad belongs to KrinikConanCamera (game map, «Клавиши мода камеры»:
+/− distance). The file was put into the 3.1.0 game by `python -I -X utf8 _config/deploy-config.py Input.ini` (11:57, game closed; pack copy = game copy by `cmp`).
**Stand:** the 3.1.0 game, the owner's world (Continue) by the oasis shore, machine lock «kumm», `stand-keeper.sh` (god on, no enemy near), third-person camera,
the bow in hand; the hero carries 203 / 76 (268 %) — overloaded, so the game refuses a dodge with «Вы перегружены» (the owner's world, kept as it is). Real input
only when `owner-idle.ps1` says FREE; the clip — `SEC=<s> SEQ="…" bash _config/loot-take-clip.sh <out.mkv>` (120 fps, HDR off for the capture), frames read by
eye from sheets at 2 fps (`.work/keybinds/`). The six presses ran in ONE `mouse-seq` sequence (clip 1, 19 s), the controls in clip 2 (13 s).
**Dimensions covered:** each of the six edited actions by its real key · the old keys as controls (C, LeftAlt) · numpad − reaching the camera mod · the live table
with and without the file (the probe's control) · the file after the game's own exit (the game rewrites `Input.ini` on exit). Not covered: the gamepad (no
edits there); the in-game key menu screen; a full dodge roll (the hero is overloaded).

| # | Case | Expected | Status | Observed |
|---|---|---|---|---|
| K0 | live mapping table: `InputSettings` default object's `ActionMappings` read by the remote (`_config/keybinds-live.lua`) | the six actions carry the owner's keys (CrouchMode LeftControl, DodgeActionV2 ThumbMouseButton, SecondaryActionV2 MiddleMouseButton, the three chats None); Jump keeps SpaceBar | **pass** | 12:00 main menu: `rows=258 · CrouchMode=Gamepad_FaceButton_Top,LeftControl · DodgeActionV2=Gamepad_FaceButton_Right,ThumbMouseButton · SecondaryActionV2=Gamepad_LeftTrigger,MiddleMouseButton · GlobalChat=None · GuildChat=None · VicinityChat=None · Jump=Gamepad_FaceButton_Bottom,SpaceBar` |
| K0c | control of K0: the same read with the file moved away (12:09, PID 12100) | the defaults: C, LeftAlt, LeftControl, Enter, Subtract, Multiply | **pass** | `CrouchMode=…,C · DodgeActionV2=…,LeftAlt · SecondaryActionV2=…,LeftControl · GlobalChat=Enter · GuildChat=Subtract · VicinityChat=Multiply` — the probe tells the two states apart |
| K1 | real numpad − in the world | no chat panel opens; the camera distance changes (the camera mod) | **pass** | clip 1 ≈ 2.3 s: the camera moved closer (the hero larger and nearer the centre, frames 2.0 vs 3.6), no chat panel on any frame 2.0–7.0 |
| K2 | real numpad * | no chat panel opens | **pass** | clip 1 ≈ 4.0 s: no chat panel on the frames; the panel's visibility in this capture is proven by the control K2c |
| K3 | real Enter | no chat panel opens | **pass** | clip 1 ≈ 5.7 s: no chat panel on the frames |
| K4 | real Left Ctrl tapped, then tapped again | the hero crouches, then stands (and does not draw the bow) | **pass** | clip 1 ≈ 7.4 s: crouched (only the head above the rock, frame 8.6); ≈ 9.3 s: standing again (frame 10.6); the bow not drawn. Clip 2: Ctrl of Ctrl+T crouched the hero too |
| K5 | real mouse side button (XBUTTON1) | the dodge action fires | **pass — by the game's refusal** | clip 1 ≈ 12.6 s and clip 2 ≈ 5.0 s: the game shows «Вы перегружены» (the dodge refused for the weight, 268 %); a full roll not seen — the hero is overloaded |
| K5c | control: real LeftAlt (the old dodge key) | nothing (no dodge, no «Вы перегружены») | **pass** | clip 2 ≈ 2.7 s: frames 2.0–5.0 unchanged, no message |
| K6 | real middle mouse button, the bow in hand | the heavy attack — with a bow it draws and shoots | **pass** | clip 1 ≈ 14.7 s: the bow drawn while held (frames 15.0–16.0), the shot on release (16.5) |
| K7 | control: real C | no crouch (C is no longer the crouch key) | **pass** | clip 1 ≈ 10.9 s: the hero stays standing (frame 12.2) |
| K8 | after the game's own exit (`exec quit`, 12:08): `input-edits.py` on the 3.1.0 `Input.ini` | still the six edits, nothing else | **pass** | the game rewrote the file at 12:08 — byte-identical to the pack copy (`cmp`), `input-edits.py`: the same six |
| K2c | control of K2 / K3: the file moved away, real numpad * and Enter | the chat panel opens (proves an open chat is visible in the clip) | **pass** | 12:14 (PID 12100, defaults live by K0c): numpad * opened the chat panel «Local» bottom-left (frames 2.0–9.0); the last Esc opened the game menu. Clip 2's Ctrl+T (`ToggleChatWindow`) had shown nothing — not a control. On exit the game wrote an EMPTY diff file (header only); the owner's file was put back by `deploy-config.py Input.ini`, game = pack by `cmp`. Report `testcases/reports/2026-11-14_conan-owner-keybinds-310.md` |
