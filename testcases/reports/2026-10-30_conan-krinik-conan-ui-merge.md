# Run report — Conan: KrinikConanUI, four interface mods as one (plan 36 W31)

**Work.** Plan 36 W31 (the owner's Krinik mod set, W34): the kit pak `KrinikUIFixes` rebuilt as `KrinikConanUI`, the Lua mods KrinikUIFixes (Lua
half), KrinikFpsCounter, KrinikHudOutline, KrinikPauseGameInMenu made four sections of one Lua folder; basis —
`testcases/TC_conan_krinik_conan_ui_merge_2026-10-30.md` (U1–U8); behaviour must stay what the five old mods did.

**Contour.** Conan Exiles 3.0.1 with the build's paks and Lua mods; pack `ConanExiles` with the new manifest entry; the kit `F:\CEUE5Devkit` in mod
mode (new mod folder `UE4/Content/Mods/KrinikConanUI`, active.txt moved there); the owner's save copied to
`Conan Exiles Mods/_save-backup/2026-10-30_1410-before-conanui-run` and restored after; god on by `god-on.sh`; machine lock 14:02–14:14.

**Runs.**
- 14:02:54–14:05:28 kit edit: `UnrealEditor-Cmd.exe …ConanSandbox.uproject -run=PythonScript -Script=…kit-conanui-edit.py -EnablePlugins=PythonScriptPlugin -ModDevKit` → report `ok`, 4 of 4 saved.
- 14:05:53–14:08:26 `python -I -X utf8 kit-buildmod.py KrinikConanUI <scratch>` → `KrinikConanUI.pak` 3 097 761 B; `UnrealPak -List` against the old pak: the same files, `-Windows.ucas` 134 880 and `-WindowsServer.ucas` 134 640 B in both.
- 14:09 `Deploy-ModPack.ps1 -PackDir ConanExiles -Deploy -Only KrinikConanUI` — first run exit 1 («modlist names a missing pak: KrinikUIFixes.pak»), engine fixed, `node tools/fixture-pack.mjs` 23 of 23 (the two new checks red on the old engine), rerun exit 0 with «dropped KrinikUIFixes.pak»; `-Verify` 99 present, 0 missing.
- 14:10:38 `launch-bg.ps1`; 14:11:43 `enter-world-remote.sh` (world in 22 s); `god-on.sh`; `capture-window.ps1` 14:11 (menu) and 14:12:23 (HUD, 3840 wide);
  remote: `ActivateModule(FName('CharacterInventory'), true/false)` + `GetGlobalTimeDilation`; `StaticFindObject('/Game/UI/Widgets/HUD/Interact/WBP_ContainerInfo.WBP_ContainerInfo_C:WidgetTree.Overlay_Main.OverlaySlot_5').Padding`; 14:13:57 `close-game.ps1`.

**Checks.**
- Hygiene: `fixture-pack.mjs` 23 of 23 (engine); `-Verify` clean.
- Functional run: the live game by the player's path (menu, world, HUD, inventory) and the remote; read — the menu and HUD frames, `ConanSandbox.log`, `UE4SS.log`, the remote's values.
- U1 pass · U2 pass · U3 pass · U4 pass · U5 pass (expectation corrected: the inventory slows time to 0.03, 0.0001 is the Esc menu) · U6 pass (padding 120 vs vanilla 20) · U7 pass · U8 pass.

**Found.**
- Engine: `-Only` kept a modlist line whose pak no longer exists (a renamed mod) → `-Verify` failed after a good deploy. Fixed in `Deploy-ModPack.ps1` (the merge drops such a line with a warning), guarded by two fixture checks.
- Lost by the merge: the FPS counter can no longer be switched off alone (it was its own `enabled.txt`); told to the owner.

**Traces.** `D:\Games\Conan Exiles 3.0.1\ConanSandbox\Binaries\Win64\ue4ss\UE4SS.log` lines `[KrinikConanUI…]` 14:10:49–14:13; `ConanSandbox.log` line 2958 (mount);
`ConanExiles/_config/devkit/kit-conanui-edit.json`; frames in the session scratchpad (`u1-menu.webp`, `u4-hud.webp`, `u4-topright.webp`).

**Verdict.** pass — the merged mod loads, shows the counter and the outline, pauses the inventory and carries the kit overrides; the five old mods are gone from the game.
