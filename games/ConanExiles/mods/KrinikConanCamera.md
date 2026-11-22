# Mod notes — KrinikConanCamera (ours: the third-person camera straight behind the hero)

> **Created:** 2026-10-31 · **Parent:** the rename `ConanCameraControl` → `KrinikConanCamera` (`[OWNER]` «Наши моды начинаются отныне с Krinik» · names
> «KrinikConanCamera + KrinikConanModPackStatus» · 2026-10-31 16:3x; HOUSE_RULES rule 19); written from the mod's header (`Scripts/main.lua`) and the manifest
> **Status:** living notes — the ONE place for this mod's internals (the mod had no notes file before the rename)
> **Outbound:** the mod's Nexus page draft `NEXUS_PAGE.md` still says ConanCameraControl — a publication under a new name is the owner's call

**What it is.** A Lua mod (UE4SS) that puts the third-person camera straight behind the hero (the owner's Palworld CameraControl, Nexus 3659, `offset_y = 0`),
with distance, height, side offset and the rotation axis tuned live from the numpad and saved to `config.lua`.

## Where things are

- Source `ConanExiles/_unpacked/KrinikConanCamera/` (until 2026-10-31 `_unpacked/ConanCameraControl/`) → game `ConanSandbox/Binaries/Win64/ue4ss/Mods/KrinikConanCamera`
  (install step `"."` — the whole folder, Nexus drafts and pictures included; a cleanup of the shipped set is open).
- `Scripts/main.lua` (`MOD_NAME = "KrinikConanCamera"`, log prefix `[KrinikConanCamera]`), `config.lua` beside `Scripts/` (paths relative: `SCRIPT_DIR .. "../config.lua"`),
  `agent-cmd.txt` (the stand's command file, `_config/run-camera-test.ps1`, `_config/corpse-prompt-test.sh`). Key layout — `README.md` (truth for the keys).
- Writes into the native `USpringArmComponent` (`SocketOffset`, `TargetArmLength`); the component is found and logged by name at start, never guessed.

## The owner's live config

The owner's tuned `config.lua` lives in the GAME folder, not in the pack (the pack's file is the default for players). Any redeploy that recreates the folder
must carry it over: copy it out before, back after (done at the rename 16:4x — byte-equal, the log «config.lua перебил 9 настроек кода»).

## The «Моды Krinik'а» window (plan 38 step 6, since 2026-10-31 22:3x)

`config.lua` stays the camera's ONLY store — the window never writes it and the window's `KrinikSettings.lua` holds no camera key. Eight keys are shown
and changed by the window (`HUB_KEYS` in `main.lua`): `offset_z` → `cam_height`, `offset_y` → `cam_side`, `arm_length` → `cam_dist`, `camera_pitch` →
`cam_pitch`, `zoom_min` / `zoom_max` → `cam_zoom_min` / `cam_zoom_max`, `own_arm_length` → `cam_sharp`, `zoom_interp_speed` → `cam_zoom_smooth`.
- The camera publishes the UE4SS shared variable `KrinikCameraValues` (`id=value;…`, sorted) at load and after every `write_config` — the window shows
  them, so numpad tuning is never overwritten by a stale window value.
- The window's «Сохранить» sets `KrinikCameraSet` (all eight rows, rounded to the row's step) and bumps `KrinikSettingsVersion`; the camera takes it in a
  pre-hook of `GUIModuleController:ActivateModule` when a window CLOSES (no timer): cfg, `apply(moved)` (the distance only when the window changed
  it — the wheel's distance is kept otherwise), `write_config`. Log line «ОКНО «Моды Krinik'а»: принято 8 настроек …».
- **The close must go through the UFunction (2026-11-01 14:4x):** the hub's own `TryCloseWindow` closes the module natively and this pre-hook never fired —
  the set waited for the inventory's close. The hub now calls `ActivateModule(FName("KrinikModSettings"), false, false)` from Lua after the close; seen: height
  100 taken at «Сохранить и закрыть» (`testcases/TC_conan_hub_rows_audit_2026-11-01.md` H1–H8; reads: the hero's `ThirdPersonSpringArm`, `CameraThirdPerson`,
  hero fields `ThirdPersonCameraMin/MaxArmLength`, `TP_SpringArmInterpSpeed`).
- The window hands the set over only when a camera row differs from `KrinikCameraValues` («camera page unchanged — nothing handed over» otherwise):
  a save on another page never rewrites the camera's file.
- Cases `testcases/TC_conan_hub_camera_page_2026-10-31.md` (C1–C10 pass 2026-10-31 22:29–22:47).

## The wheel in the bow aim (2026-11-02, bug 78)

The wheel zooms by the GAME (`BasePlayerChar` `CameraZoomIn/Out` on `ZoomIn = MouseScrollUp`, `ZoomOut = MouseScrollDown`, step `CameraZoomAmount`, which this
mod holds by distance). Section «КОЛЕСО В ПРИЦЕЛЕ ЛУКА»: a post-hook of Arrow Quick Swap's `UpdateDisplayUI` (birth of `AQS_Actor_Component_C` registers it)
reads `AllowShowingUI` (= substate 16); while true the watcher's `want_step` is 0 (also written at once at the aim entry); log «прицел лука: вход / выход».
Without AQS no hook — the wheel zooms in the aim as in the game. `[TESTED: 2026-11-02 · W2, W3 · testcases/reports/2026-11-02_conan-wheel-in-bow-aim.md]`.

## Numpad keys — the hero's game-thread event, not RegisterKeyBind (bug 85, 2026-11-07)

`bind` / `bind_ctrl` only fill `key_actions[<engine key name>] = { plain, ctrl }` (`VK_KEY_NAME`: NumPadZero…NumPadNine, Multiply, Add, Subtract, Decimal, Divide);
a `RegisterHook` on `/Game/Characters/BasePlayerChar.BasePlayerChar_C:InpActEvt_AnyKey_K2Node_InputKeyEvent_1` (name read from the cooked asset) runs the action on
the game thread; Ctrl by the controller's `IsInputKeyDown(LeftControl / RightControl)`. Installed inside the hero-birth delayed action of the neck hooks — a
SEPARATE delayed action of the same 1600 ms never ran (21:39 run, K4 fail). Log «клавиши камеры: событие героя «любая клавиша» подписано». Cases K4–K8 of
`testcases/TC_conan_keybind_lua_off_input_thread_2026-11-07.md` — at the next launch. Note: a deploy of this mod OVERWRITES the owner's `config.lua` (seen 21:38) — copy out, restore.

## The first-person shadow (bug 98, 2026-11-13, NOT RUN in game yet)

The game's `SwitchToFirstPersonCamera` turns `CastShadow` OFF on every body piece, the held bow and its nocked arrow (remote read 17:16, `_config/fp-shadow-flags.lua`).
**The hook order (corrected 2026-11-13 19:5x — an earlier line here said the opposite):** UE4SS calls a hook on a BLUEPRINT function (`/Game/…`) AFTER its body
(RegisterHook docs; judge round 2; seen in game 19:49 — a record in the first-person hook found the shadows already off). So `record_tp_shadows` keeps the full names
of the meshes WITH a shadow when shadows are surely on — in the `SwitchToThirdPersonCamera` hook and at the hero's appearance — keyed by the hero's full name; the
`SwitchToFirstPersonCamera` hook lights at once the recorded ones that are now off (`restore_fp_shadows`). No delay, no `CastHiddenShadow`. Seen 19:52: after a
third-person switch «записано 11», then first person «вернули 10» — body, bow, arrow `cast 1`. **Open:** the game's own third-person switch at the hero's creation
records an unbuilt tree (1 of 12 nodes), and the delayed «герой собран» record (6 s after the birth) did not run — the pawn is not possessed yet during the load;
a first-person switch right after loading lit 0 (19:59) — since 20:04 a record at the HUD's birth (Hosav W_NewHealthUI_C + 2 s): seen 20:05 «записано 11», then «вернули 10». The head's shadow — the section below (2026-11-22).

## The head's shadow and the sheathed weapon in first person (bug 114 · issues #13 and #4, 2026-11-22)

The owner 2026-11-22 09:40: the head's shadow in first person, and the bow on the back in the view with an axe in hand. Both live in the first-person section
of `Scripts/main.lua` (`fp_pass`, `sync_view`, `fp_cam_tick`, `fp_weapon_changed`, the hooks in `install_fp_hooks`).
- **What the view is — asked of the game:** `not GetIsInThirdPerson()` at `EventOnThirdPersonChange`. The idle vanity camera (`SwitchToVanityCamera`, ≈ 4 min
  without input) goes to third person via `EventOnThirdPersonChange` / `HandleThirdPersonChange` / `SetThirdPerson` and never calls `SwitchToThirdPersonCamera`
  (remote 2026-11-22 10:1x) — a flag kept by the Switch* hooks alone left the bow invisible and the old code left the heroine headless in that view.
- **The owner's word 2026-11-22 13:10–13:11 (verbatim in `bugs/114_*`):** the head's shadow must exist ALWAYS, from any light; the game is multiplayer — other
  players see the bow and every body part always; for the player himself the head and the bow on the back may be invisible but cast a shadow.
- **The head:** the game hides the head and the hair in first person (`SetVisibility(false)` inside `SwitchToFirstPersonCamera`); those meshes get
  `CastHiddenShadow` (only if they had a shadow in the third-person record). **No bone is hidden any more** (until 13:3x `b_neck_1` was hidden above 70° — it
  collapsed the head and hair with their shadow).
- **The neck and the armour collar (since 2026-11-22 13:3x):** with no armour the open neck never enters the view at 74–85°; a chest piece's collar does
  (52442 at 78–85°). The first-person camera `AdjustableCamera` (child of the spring arm `FirstPersonCameraArm`, relative location 0 0 0) moves forward along its
  X with the pitch: 0 below 55°, linear to 10 cm at 75° (`CAM_PUSH_FROM`, `CAM_PUSH_FULL`, `CAM_PUSH_CM`); 5 cm already clears 52442. `fp_cam_tick` in the
  per-frame hold loop, first person only: the controller's `ControlRotation` and the camera's `RelativeLocation` read (properties), a write only on a
  difference over 0.5 cm; the pawn of the controller compared by address (a corpse's camera is left alone); reset to 0 out of first person and for a new hero.
  Rejected: `r.SetNearClipPlane` 20+ cuts the hand in the view.
- **The sheathed weapon (since 2026-11-22 13:3x):** a VISIBLE mesh on or under a `sheath*` socket (`sheath_bow`) gets `OwnerNoSee` + `CastHiddenShadow` — hidden only
  from the owner's camera; other players, other views and the shadow keep it. `CastShadow` is lit for it when it had a shadow in the third-person record or is the
  item's main mesh (the actor's root). A mesh the game hides itself (`VisibleSheathedWeapons` = None: not `IsVisible()`, or the actor `bHidden`) is not touched,
  and our flags come off if the game hides it later. The pair OwnerNoSee + CastHiddenShadow is the mod's marker: after a mod reload it is adopted on a sheath and
  cleared off one. Cleared when drawn into the hand and on every exit of the own hero from first person. **Correction:** the 10:0x probe set `OwnerNoSee` +
  `CastShadow` only and lost the shadow — that line here said «removes the shadow too in this game»; with `CastHiddenShadow` the shadow stays (13:2x).
  Re-passes 0.8 s and 1.6 s after `OnWeaponUnequip` (the bow reaches the back 0.3–1 s later), timed by the per-frame loop.
- **The item in hand:** the game turns `CastShadow` off on a held weapon in first person; the item's main mesh (owner `IsA` `/Script/ConanSandbox.InventoryItemBase`,
  the actor's root component) gets it back; child meshes (torch fire) stay as they are.
- **Own hero only:** `player_hero()` takes the pawn of the controller whose `IsLocalController()` is true (a listen-server host has every player's controller;
  `FindFirstOf` could return another's); the search runs at most once a second until found, one log line on failure.
- **Respawn straight into first person:** no third-person record exists, the mesh tree is unbuilt at creation — the pass runs again at the HUD's birth + 2 s,
  and without a record the hero's own skinned meshes count as body (their shadow back, the head's hidden shadow).
- Cases and frames: `testcases/TC_conan_fp_head_shadow_sheathed_bow_2026-11-22.md`; the before/after frames in `KUMM/.work/fp_bow_back/` and `KUMM/.work/fp_v2/`.

## EAA's camera components — learned by birth, not searched (bug 118 · issue #50, 2026-11-22)

`mute_foreign_camera` (once a second inside the 30 ms target watch) used to `FindAllOf("EAA_CamDistance_C")` and `FindAllOf("EAA_Zoom_C")` and call
`IsComponentTickEnabled` / `SetComponentTickEnabled(false)` on everything found; with EAA's settings window open over the hub the game crashed in UE4SS in 6 of 7
sessions, and never with this mod off (bisection, bug 118). Now: `NotifyOnNewObject` on `/Game/Mods/EnhancedArmoryAndArsenal/Cam/EAA_CamDistance.EAA_CamDistance_C`
and `…/Cam/EAA_Zoom.EAA_Zoom_C` once the class is loaded (`StaticFindObject`), one `FindAllOf` per class per session for the ones born before, a registry
`FOREIGN_CAM_CLASSES.reg` of `{ c, full name }`, the tick calls only on a same-name object. Seen 17:16:32 and 17:41:26: «слежка за рождением встала» ×2, «чужая камера
заглушена: EAA_Zoom_C». The kept spring arm is compared with its full name at adoption (`arm_full`) every tick; another name → the recovery branch.
**The crash came back with this change in** (17:45:04, 7 s after EAA's window opened) — the search was not the whole cause. Owed: the
variant `mute_foreign_camera = false` with the camera on (is the tick call itself the crash?), a death / respawn and a world reload with the registry, and the
judge's A2 — the birth callback runs Lua on the thread that constructs the object.
**2026-11-22 19:31 — this mod is NOT the crash's cause (proven, bug 118 «Root cause»):** the crash is the agent's Esc probe `esc_listen.lua` (a
`ListenForInputAction` bind with a Lua-table delegate); reproduced on demand with every mod on AND with this mod off, the stack equal to all seven crashes.
The registry stays as the cheaper design; the code comment says so. `mute_foreign_camera = false` ran 10 min clean plus 15 EAA reopen cycles (no probe).

## Checks

- In game 2026-10-31 16:41: `[KrinikConanCamera]` 81 log lines, «config.lua прочитан», «ВЫБРАН компонент: SpringArmComponent …». Cases of the camera work —
  `testcases/TC_conan_*camera*`, `TC_conan_bow_camera_rmb_matrix_2026-10-27.md`.
