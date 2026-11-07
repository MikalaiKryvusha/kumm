# Bug 85 — the game crashes in UE4SS when a key-bind Lua callback runs while the same mod's game-thread Lua runs (bow kill → «arrows in the corpse»)

**Status:** 🔧 fix pending verification — cause found by source; KrinikConanArchery keybinds removed; twins in KrinikConanUI and KrinikConanCamera open
**Severity:** S2 (the owner's play session lost to a crash; the class already cost a crash on 2026-10-28)
**Version/build:** Conan Exiles 3.0.1 build, UE4SS 3.0.1 experimental build 1181 (`g83330635`, 2026-10-17) · **When/context:** 2026-11-07, the owner playing (bow kills of Imps), 21:17 +03:00
**Fixing:** this session

## Symptom

`EXCEPTION_ACCESS_VIOLATION reading address 0xffffffffffffffff`, GameThread, every frame of the crashing stack inside `UE4SS.dll` (crash folder
`ConanSandbox/Saved/Crashes/UECC-Windows-C5493B5C4C0160FDB433D0AA28FC898C_0000`, 2026-11-07 21:17). The owner had made many bow kills before without a crash —
a rare crash.

## Forensics

- `UE4SS.log` tail: three Imp kills by arrows at 21:17:40, :47 and :54. Each kill logs the same pair «стрелы в трупе: родился Corpse_C … копий 1» and, 20–40 ms later,
  «… копий 0» — the SECOND line is the late-copy path re-running `on_corpse_born` for the SAME corpse (the killing arrow's copy is born after the corpse,
  `CORPSE_LATE_S`), not a second corpse. The first two kills then log `rebirth` («копия у кости … прицеплена true») ≈150 ms later; the third kill (21:17:54.36/.38)
  never reaches that line — the game log ends at 18:17:54.519 UTC (frame 757), i.e. the crash falls in the window of the scheduled `rebirth`
  (`ExecuteInGameThreadWithDelay(CFG.corpse_find_ms)`).
- The crashing stack (`CrashContext.runtime-xml` → `<PCallStack>`), UE4SS offsets mapped to the nearest preceding export of `UE4SS.dll` (the DLL exports its C++ API;
  script `scratchpad/map_offsets.py`, `pefile`): game tick hook (`466aba` ← `StartCallbackGarbageCollector` region, `45d2ca`) → LuaMod delayed-action dispatcher
  (`2fdb75`) → `Lua::call_function` (`b9f485`) → three nested Lua VM entries (callback → `pcall(rebirth)` → `pcall(inner)`) → `process_lua_function` (`ba2b5c`)
  → a UFunction call (`2c59fd`) → `push_structproperty` (`2c8db9`) → `convert_struct_to_lua_table` (`2c80dc`) → Lua VM (`c68759` → `c78437` → `c77a80`, the crash).
  So the crash is in the Lua VM while UE4SS fills a Lua table from a struct returned by a game function — NOT inside the game function.
- Refuted on the way: (1) «two corpses race» (the pair of lines is one corpse, above); (2) «garbage in the out `FHitResult` of `K2_SetRelativeLocationAndRotation`»
  — UE4SS `Memzero`s the param buffer (`LuaUObject.cpp:160` at `8333063`); (3) «the out table is collected mid-fill» — `Lua::get_table` leaves it on the stack.

## Root cause

Source of UE4SS at the build's commit `8333063595fa3c49ad307f3b0f732accbb760d25` (`UE4SS/src/Mod/LuaMod.cpp`, `UE4SSProgram.cpp`, `deps/first/Input/src/Handler.cpp`):

1. `RegisterKeyBind` / `RegisterKeyBindAsync` callbacks run on UE4SS's event-loop thread (`m_event_loop = std::jthread{&UE4SSProgram::update}` →
   `m_input_handler.process_event()` → `callback()`); `RegisterKeyBind` takes `m_thread_actions_mutex`, the Async variant nothing.
2. Game-thread Lua does NOT take that mutex: `process_delayed_actions` moves the ready batch out under the mutex and runs the Lua calls OUTSIDE it
   (lines 4017–4029); `lua_unreal_script_function_hook_pre` (every `RegisterHook`) takes no lock at all.
3. All of a mod's Lua runs in `lua_newthread` threads of ONE `lua_State` (`m_hook_lua`, `m_async_lua`, `m_main_lua` = `new_thread()`; upstream's own comment
   «until we switch to lua_newstate instead of lua_newthread») — one heap, one GC, one string table.

So a key press handled by a mod's `RegisterKeyBind` runs Lua concurrently with that mod's game-thread Lua: the shared Lua heap is corrupted and the next table fill
crashes. KrinikConanArchery had `RegisterKeyBind(Key.E / Key.Q / Key.LEFT_MOUSE_BUTTON)` (the shafts-in-corpse sync, main.lua:616–626) — LMB is pressed on EVERY bow
shot, and every bow kill runs `on_corpse_born` / `rebirth` on the game thread: a rare overlap, exactly the observed pattern.

Upstream fixed half of it AFTER our build: commit `97c5642a` (2026-11-04, «Wait for running game-thread actions before closing a mod's Lua state», refs #1445) adds
`m_game_thread_execution_mutex`, held by the delayed-action batch and taken by the key-bind wrapper — «Key-bind Lua also no longer runs while a game-thread batch does».
`RegisterHook` callbacks still take no lock on `main` (`4fb9b615`, 2026-11-07), so key-bind vs hook stays racy upstream.

This is the twin of the 2026-10-28 class (`ExecuteWithDelay` / `LoopAsync` on UE4SS's worker thread, guard `ConanExiles/_config/check-lua-game-thread.py`): any Lua a
mod runs off the game thread races with its game-thread Lua. The guard did not know key binds.

## Fix

1. `ConanExiles/_config/check-lua-game-thread.py` — `RegisterKeyBind` / `RegisterKeyBindAsync` join the forbidden calls (red on the pre-fix tree first).
2. KrinikConanArchery — the three key binds removed. The shafts sync keeps its game-thread trigger (`QuickLootPanel:SlotItemAddedOrRemoved`); the full loot window and the
   beast harvest have no game-thread trigger yet → until found, their shafts stay in the corpse until it vanishes (cosmetic; logged in the mod notes «Open»).
3. Twins (the guard's list after step 2): KrinikConanUI — LMB in `krinik_feedback.lua`, `krinik_mods_button.lua`, `krinik_mod_settings.lua`, Esc in
   `krinik_pause_in_menu.lua`; KrinikConanCamera — numpad / Ctrl+numpad. Replacement: game-thread input events — the player blueprint's
   `InpActEvt_AnyKey_K2Node_InputKeyEvent_1` (`BasePlayerChar_C`, read from the cooked asset 2026-11-07) for gameplay keys; widget events for clicks on our windows.
   Whether E / Q reach the pawn's AnyKey (the controller may consume them) — a live case with real input.
4. Upstream: report the remaining key-bind vs `RegisterHook` race to UE4SS (after the twins, with the source lines above); consider the 1217 build (`4fb9b615`) for the
   delayed-batch half — a UE4SS build change is its own A-B (builds regress, issue #1405).

TWINS: searched `RegisterKeyBind(Async)?\(` over `ConanExiles/_unpacked/Krinik*` — found 9 call sites: Archery 3 (removed), UI 4, Camera 2 (open, step 3). Third-party
Lua mods of the build: only UE4SS's own samples (`BPModLoaderMod`, `Keybinds`, `LineTraceMod`, `SplitScreenMod`) — their enabled state checked by the guard's default run.

## Decisions made without the owner

- `[AI]` The shafts of the full-loot-window and harvest paths stay in the corpse until it vanishes, until a game-thread trigger is found — a crash outweighs a cosmetic
  shaft (the owner's first build criterion: «она 1_ должна работать стабильно», MASTER_PLAN).

## Links

- `games/ConanExiles/mods/KrinikConanArchery.md` (the corpse-arrows section) · `ConanExiles/_config/check-lua-game-thread.py` · EXP-0062 (UE4SS #1180) · STATUS item 00.
