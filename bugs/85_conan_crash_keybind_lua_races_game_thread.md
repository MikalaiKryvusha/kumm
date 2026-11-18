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
- **A second crash of the same SHAPE, 2026-11-10 19:17 +03:00, in the agent's run (no bow kill, no real input from the agent; the owner typing in VS Code):** `EXCEPTION_ACCESS_VIOLATION
  reading address 0x000000000000000a`, folder `UECC-Windows-67A04B4E49867DEF115B83A157440469_0000` (19:14:34), crash-report window closed, PID 13820. Stack mapped by the
  same method (the script re-made in the session scratchpad: `map_offsets.py <UE4SS.dll> <offsets…>`, pefile): game tick (`466aba`, `45d2ca`) → LuaMod delayed-action
  dispatcher (`2fd818` / `2fc9d0` / `2fcb79`) → `Lua::call_function` (`b9f485`) → TWO nested Lua VM entries → `process_lua_function` (`ba2b5c`) → a LuaMod.cpp global
  (`2f3dcb`) → `LuaType::auto_construct_object` (`2c6d04`) → `2ae670` → Lua VM (`c6a2ff`, the crash). About 1 s before, the agent sent the dev remote `funcs
  BasePlayerChar_C` (`find_widget` = `FindAllOf("Widget")` + `pcall(GetFullName)` per widget — a run → pcall(funcs) nesting); its «исполнено» line never came. 0.7 s
  before, KrinikConanArchery logged «стрелы в трупе: родился Corpse_C … копий 0» (an NPC died nearby). So: the same victim position as the 2026-11-07 crash — the Lua VM
  dies while UE4SS builds a Lua value (a UObject wrapper here, a struct table there) inside a delayed game-thread action. Not settled: a heap race (which off-thread Lua
  ran then?) or a wrapper of a dying object. Lesson kept for the stand: `funcs` is for WIDGETS only (it walks every live widget) — never aim it at a pawn class.
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

## 2026-11-18 18:58 — the five KrinikConanUI binds: what the replacement can hook

Still open for 0.9.1 (the guard `check-lua-game-thread.py` lists 5: `krinik_feedback.lua:91`, `krinik_mods_button.lua:285`, `krinik_mod_settings.lua:1380`,
`krinik_pause_in_menu.lua:680`, `krinik_hub_controller.lua:354`). Every LMB in gameplay runs the feedback bind's Lua off the game thread while this mod runs
game-thread Lua often (the FPS counter every 250 ms, the pickup check every second) — the class of the 2026-11-07 crash. Read 18:58: the native `FLXButtonBase`
(under `WBP_ButtonBase`) has NO click UFunction — `SignalClicked/Pressed/Released` are delegate properties and the click is native C++
(`researches/conan-mod-settings-hub/vanilla-settings-widgets.md` line 23), so a RegisterHook on «the button's click» does not exist. Replacement candidates for
the next chat: a kit-bound custom event per OUR button (the attribute page arrows' way, `kit-attribute-paging-step2.py` — the click calls a BP event, Lua hooks
it on the game thread); for Esc / Tab — the game's own handling (`GUIModuleController:ActivateModule` is already hooked by the hub controller); gameplay keys —
the hero's AnyKey event (KrinikConanCamera's way). Fixing: the next chat, first item (STATUS NOW).

## 2026-11-18 19:3x–19:4x — recon R1, R2 (TC `testcases/TC_conan_keybinds_to_game_events_2026-11-18.md`), background game, the remote + posted keys

Tool born for it: `ConanExiles/_config/post-key.ps1 -Key Escape|Tab` — PostMessage WM_KEYDOWN / WM_KEYUP into the game's window: the game ACTS on it in the background
(the hub closed), and UE4SS key binds do NOT see it (our Esc bind left our window open) — a clean probe of the game's native path with our binds bypassed.
Probes (KUMM `.work/bug85/`, recon only): `close-hooks-probe.lua` (post-hooks on the close / escape / toggle UFunctions, counters), `escape-stack.lua`, `func-params.lua`,
`class-props.lua`.

- **R1 — what the game offers.** `GUIModuleController`: an ESCAPE STACK — `m_EscapeStack` (array of `EscapeStackNode`: delegates `SignalActivated`, `SignalActivatedBP`,
  bool `ShouldEatInput`), `PushEscapeStackNode()`, `PopEscapeStackNode()`, `RemoveEscapeStackNode(Node)`, `ProcessEscapeStack()`; also `ToggleModule(ModuleName)`,
  `MainMenuPressed()`, `DeactivateFullscreenModules(moduleToIgnore)`, the multicast `ModulesChanged`. `WindowRoot`: `Close(Force)`, `Open`, multicast `SignalClosing(Window)`,
  `SignalOpened`. `FLXButtonBase`: multicast `SignalClicked` (one parameter, the button — the main menu's `…B_Continue…_SignalClicked__DelegateSignature` takes it),
  `SetKeyShortcutName(Name)`; NO click UFunction; `WBP_ButtonBase_C` has no functions of its own — a click is seen only by a blueprint binding of `SignalClicked`.
- **R2 — the hub's close.** Hub open: 1 node on the escape stack (pushed in C++ — the Push hook stays silent). A posted Esc → `WindowRoot:Close` on `CraftingGUI_C`
  and `GUIModuleController:ActivateModule` (post-hooks, game thread); a posted Tab → `ActivateModule`. So the hub controller's existing `ActivateModule` hook already sees
  both closes: its ESCAPE / TAB key binds (`krinik_hub_controller.lua:354`) are redundant. `ProcessEscapeStack` / `ToggleModule` hooks stay silent (called in C++).
- **R2 — Esc in a mod window over the hub (posted Esc, the game's native path):** the vanilla `InventorySettingsPopup` closes (its cancel button carries
  `KeyShortcutName` Escape and is bound in its blueprint), the hub stays. Close by themselves: `SM_UI_Settings` (Simple Minimap), `NightTerrorsSettings`. Swallow Esc —
  the window stays, the hub stays: `KrinikModSettings` (OUR window: `B_KrinikClose` has the Escape shortcut but no binding), `AMR_Settings`, `LLH_Settings`,
  `PrP_Settings`, `DN_UI_Settings`, `EmberlightMasterConfig`, `EAA_Armorsettings` (the owner's report of 19:40, the same class), `PIFC_Settings`, `ExilesFishingTuning`,
  `HosavUIsettings`. `LBPRWidgetID`: Esc closes the HUB and leaves the LBPR window open (module active, the hub gone) — a separate defect of the same class.
  Today the two Lua Esc binds (`krinik_pause_in_menu.lua:680` MOD_WINDOWS — fishing, Hosav, ours; `krinik_mods_button.lua` `__krinik_mods_menu_esc` — the list's
  modules) close some of them on a REAL Esc.

**The fix (FORK closed in chat 19:3x: kit-bound blueprint events, the project's proven path of the attribute arrows and wheel; the game's own pattern of vanilla
popups binding their buttons):** kit script `_config/devkit/kit-krinik-click-events.py`:
1. `W_KrinikButton` — a child blueprint of `WBP_ButtonBase`: Construct binds its own `SignalClicked` to the custom event `KrinikClicked`. Lua creates it where it
   created `WBP_ButtonBase` (the mods button, the list entries) and as an invisible Esc closer (`SetKeyShortcutName('Escape')`) inside every mod window of the list
   when it opens; a `RegisterHook` on `KrinikClicked` (game thread) tells by the context which one.
2. `W_KrinikClickCatcher` — a transparent full-size widget whose `OnMouseButtonDown` calls `KrinikMouseDown` and returns Handled: under the mods list in the
   inventory's root `Overlay_0` (2282 × 1272 — the whole window) while the list is open — the click outside.
3. `W_KrinikModSettings`: `OnPreviewMouseButtonDown` → `KrinikMouseDown` (Unhandled — the routing by hover stays in Lua); `B_KrinikClose.SignalClicked` →
   `TryCloseWindow` (its Escape shortcut and the «Закрыть» click — both dead until now).
4. `W_MainMenu_MainMenu`, `W_IngameMenu`: `Btn_KrinikFeedback.OnClicked` → `KrinikFeedbackClicked`.
5. Lua: the five `RegisterKeyBind` removed; the hub controller keeps `ActivateModule` only.

## 2026-11-18 20:1x–20:3x — judge round 1 and what it changed

Judge round 1 (fresh helper on the Lua + kit + post-key diff; report kept in the session scratchpad `judge_bug85_r1.md`): **D1** refuted by then (kit run 5
saved W_KrinikButton); **D2 CONFIRMED by a run** (20:22, `KUMM/.work/bug85/esc-closer-test.lua`): a Lua-made FLX button never pressed on Esc — owner the
GameInstance and owner the window (its outer then IS the window's WidgetTree) — so the design moved to a plain-UserWidget wrap (`W_KrinikClickWrap`,
preview press → `KrinikPreview` → the old IsHovered route) and our window's own `OnPreviewKeyDown` → `KrinikEsc`; other mods' windows lose Esc → bug 108;
**D3, R1, R2, R6** (address-keyed armed set, the 100 × 30 hidden button, the nested ActivateModule, box names) — moot: the closer buttons are gone; **R3**
(a broad `NotifyOnNewObject(WindowRoot)`, possibly off the game thread) — gone with them; **R4** (Esc skipping `close_window`) — fixed: `KrinikEsc` calls
`close_window`; **R5** (the outside press narrower) — accepted: the catcher covers the inventory window, a press elsewhere (the tab row) changes the tab and
closes the list by its event; in our window a press outside the frame no longer closes an open option list or palette (the next press inside does);
**R7** — accepted (a failed part never saves); **R8** — fixed (LoadAsset by the asset path first); cosmetics fixed (post-key header). A recon probe of mine
crashed the game 20:20 (`GetPropertyClass` on a struct return — EXP-0570), not the build.
