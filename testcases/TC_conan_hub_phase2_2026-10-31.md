# TC — plan 38 phase 2: the «Моды Krinik'а» hub window by mockup 5, live rows, the settings store (first batch: the KrinikConanUI page)

> **Created:** 2026-10-31 · **Parent:** `plans/38_epic38_phase2_krinik_hub_window.md` (criteria 1–7) · mockup 5 (review folder `34_mods_settings_hub_by_author`)
> **Status:** written 20:37, not run
> **Outbound:** frames to the owner beside mockup 5

**Goal (Achieve).** The window looks like mockup 5, its clicks route (mod list, «i», reset, save, save and close, close without saving), a saved
value changes the mod at once and survives a restart, and nothing of the hub runs in play. This batch: the KrinikConanUI page only (LIVE = ui);
the other pages wait for their mods' readers.

**Stand.** As phase 0 (`TC_conan_hub_kit_window_2026-10-31.md`): the owner's save copied before and restored after (`save-restore.sh`); the machine
lock; `launch-bg.ps1`; world entry by `enter-world-remote.sh`; god on; the hub by the remote `ActivateModule('CharacterInventory')`; our window by the
remote `ActivateModule('KrinikModSettings', true, false)` (phase 1 brings the button); real input by `mouse-seq.ps1` after `wait-input-idle.ps1`;
frames `capture-window.ps1 -Width 3840`, looked at by eye after every step; click points read from the frame of P1 (no guess). The store file
`<game>\ConanSandbox\Saved\KrinikSettings.lua` removed before the run (a clean start = every default). Techniques: state transitions
(closed → open → page → changed → saved / discarded → reopened → restarted), boundary values (a slider at its ends), a control click (P10).

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| P0 | The pak and the sections load | kit ×2 (0 errors), build, deploy `-Only KrinikConanUI`; launch; `UE4SS.log` | `section krinik_mod_settings: loaded`, `[KrinikConanUI:Settings] no store yet`, the merge line; no Lua error | not run |
| P1 | The look (criterion 1) | world; hub; our window; a frame at 1080p game resolution | head (title left, «Закрыть без сохранения» right), the list with «KrinikConanUI» only, the right side «KrinikConanUI» + «интерфейс сборки», five rows (label, «i», grey hint, control), the footer three buttons; side by side with `variant_05_final.webp` | not run |
| P2 | Values from the store (defaults) | the remote reads the five controls | ui_fps on, food 10, weight 90, menu ×33, craft on | not run |
| P3 | «i» hover (criterion 3) | the real mouse over the «i» of «Мигание еды и воды»; a frame | the plate «Мигание еды и воды» with its text under the row; away — gone | not run |
| P4 | «i» click pins | a real click on the same «i», the mouse away; a frame | the plate stays; a second click hides it | not run |
| P5 | Untick the FPS counter, «Сохранить» (criterion 4) | a real click on the FPS checkbox; a real click on «Сохранить»; a frame of the corner | log `store written: 1 keys, 1 changed`, `счётчик выключен (хаб)`; the number gone from the corner; the file holds `["ui_fps"] = false` | not run |
| P6 | Close without saving (criterion 5) | change the food slider (real drag or click on the bar); «Закрыть без сохранения»; `cmp` the store with its copy before | log `closed (без сохранения)`; the store byte-equal; reopen — the slider back at 10 | not run |
| P7 | Reset (criterion 6) | change two rows; «Сбросить к исходным» | the page's controls at the defaults; the store unchanged until «Сохранить» | not run |
| P8 | Save and close | tick the FPS counter back; «Сохранить и закрыть» | the window closes; the number back in the corner; the store without `ui_fps` (a default is not written) | not run |
| P9 | Survives a restart (criterion 4) | P5's state saved; close the game by its PID; launch; world | the counter stays off; `store read: N keys` | not run |
| P10 | Control — a click on empty space in the window | a real click on the window's background | no routed action in the log; nothing changes | not run |
| P11 | Menu slow-down applies | set «Мир замедляется в меню» to 5, «Сохранить»; close our window (the hub stays) | `krinik_pause_in_menu` sets dilation 0.2 while the hub is open | not run |
| P12 | No cost in play (criterion 7) | close the window; read the log | `watch stopped (window closed)`; no hub log lines while playing | not run |
| P13 | No harm | after the run | no crash window; the save restored and `--check` ok | not run |
