# Mod notes — UE4SS (the Lua mod loader of the build)

> **Created:** 2026-11-10 · from the manifest comments (`ConanExiles/modpack.json`, entry `UE4SS`), bug 85 and the bow-kill crash recon
> **Status:** living notes · **Outbound:** —

**What it is.** Not a pak: a proxy DLL `dwmapi.dll` next to `ConanSandbox-Win64-Shipping.exe` plus the folder `ConanSandbox/Binaries/Win64/ue4ss` (UE4SS.dll,
`UE4SS-settings.ini`, `VTableLayout.ini`, `Mods/`). It runs every Lua mod of the build (ours: Camera, Archery, Locomotion, UI, Graphics, Music, ModPackManager;
the dev-only Harness: `KrinikAgentRemote`, `KrinikConanBench`, `KrinikMenuProbe`). Build: UE4SS 3.0.1 experimental 1181 (`g83330635`, 2026-10-17).

## Where things are

- Source: `ConanExiles/_unpacked/UE4SS/` (edited by hand on purpose); deploy `Deploy-ModPack.ps1 -PackDir ConanExiles -Deploy -Only UE4SS` (game closed).
- Log: `ConanSandbox/Binaries/Win64/ue4ss/UE4SS.log` (overwritten at every start; lines can arrive late).
- `Mods/mods.txt` — the built-in mods on/off; our mods are switched by their own `enabled.txt`.

## Our edits against the stock archive (repeat them all on a UE4SS update)

1. `UE4SS-settings.ini` and `VTableLayout.ini` from `zCustomGameConfigs/Conan Exiles Enhanced`, placed in the ROOT of `ue4ss` (the auto-pick by folder name
   would not fire: the owner's folder is «Conan Exiles 3.0.1»).
2. Both consoles enabled.
3. `BPModLoaderMod : 0` — UE4SS issue #1391 crashes the process after each map load through it; a pure Lua mod does not need it.
4. **`Keybinds : 0` (2026-11-10)** — the sample mod's `RegisterKeyBindAsync` on Ctrl+Num9 / Ctrl+Num7 / Ctrl+Num5 (header, actor and JMAP dumpers) shared the
   chords of KrinikConanCamera, and a dumper would run on UE4SS's worker thread (the bug 85 class). `researches/conan-bow-kill-crash-recon/README.md` F3.

## Threading rules that paid for themselves (bug 85, EXP-0062, EXP-0486, EXP-0487, EXP-0504)

- All Lua of ONE mod lives in one `lua_State`; Lua run off the game thread (`RegisterKeyBind`, `RegisterKeyBindAsync`, `LoopAsync`, `ExecuteAsync`,
  `ExecuteWithDelay`) races that mod's game-thread Lua and crashes UE4SS — even a callback that only checks a flag. Guard:
  `python -I -X utf8 ConanExiles/_config/check-lua-game-thread.py` (does not see `pcall(RegisterKeyBind, …)` nor `mods.txt` — recon F1, F3).
- Game-thread timing: `ExecuteInGameThreadWithDelay`, `LoopInGameThreadWithDelay`; two delayed actions of the same delay — one may be skipped (EXP-0486).
- A callback on a BLUEPRINT function runs after its body (EXP-0487); on a NATIVE function a single callback is a PRE-hook, the post one is the 2nd argument (EXP-0504).

## Open

- The remaining `RegisterKeyBind` sites of KrinikConanUI (LMB ×3, Esc ×2, Tab) — recon F1, waits for the owner's word on the fix route.
- Upstream: the key-bind vs `RegisterHook` race (bug 85 «Fix», item 4).
