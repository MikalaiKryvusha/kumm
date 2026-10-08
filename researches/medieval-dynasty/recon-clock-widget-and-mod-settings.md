# Recon: HUD clock and KrinikModManager for Medieval Dynasty (UE 4.27, UE4SS 3.0.1 exp. build 1161)

Written 2026-10-08 16:17 +03:00. Read-only recon: web, GitHub source, local files. No game launch.
Raw downloads are in `recon-clock/src/` (UE4SS `LuaMod.cpp`, example mods, the API docs of the settings frameworks, Nexus descriptions).
**[GUESS]** marks my inference. Everything else is tied to a source.

---

## 0. The three facts that decide everything

1. **UE4SS maintainers recommend Lua-built UMG for player-facing UI.** The `UE4SS` account (repo collaborator), issue #1072, 2025-11-02:
   "The tab system might be exposed to Lua one day, but it's not supposed to be used by players. It's for debugging purposes only, and comes with a performance penalty. You can make widgets entirely in Lua, without involving BPs. You can see an example of that here: https://github.com/joric/SupraTools/blob/60c2e02.../Scripts/GameStats.lua. If you don't want to make a BP mod, or a C++ mod, this is your best option for UIs that are meant to be used by players."
   https://github.com/UE4SS-RE/RE-UE4SS/issues/1072
2. **Our own history: in Conan Exiles, all five widget attempts from Lua crashed the game** (`ConanExiles/docs/06-интерфейс-модов.md`, `KUMM/EXPERIENCE.md` EXP-0060, EXP-0061). The approaches were `StaticConstructObject` TextBlock + `AddChild` into the menu canvas, `SetText` on a class-template subobject, and `UWidgetBlueprintLibrary::Create` + `AddToViewport` (twice). **This recon found a likely common cause that the Conan post-mortem did not consider.** Every attempt ran from `ExecuteWithDelay` (`ConanModPackStatus/Scripts/main.lua:1176,1182`). In UE4SS source, `ExecuteWithDelay` does not run on the game thread. It queues into `m_pending_actions`, and `update_async()` runs that queue on `m_async_thread` (`UE4SS/src/Mod/LuaMod.cpp` lines 3074–3100 and 7231–7290, main branch). Issue #168 (open): "async APIs will execute the same lua_state in a separate OS thread … All async APIs will eventually crash because of this." https://github.com/UE4SS-RE/RE-UE4SS/issues/168. Building Slate/UMG off the game thread is undefined behaviour in UE **[GUESS: standard UE rule, not tested here]**. So "widgets from Lua crash" is **not proven**. What is proven is narrower: "widgets created from the async thread crashed in Conan's build." Caveat: SupraTools also creates its widget from inside `ExecuteWithDelay` and works for its users, so off-thread is a race, not a guaranteed crash.
3. **Our build has the game-thread API.** `UE4SS.dll` (log: `v3.0.1 Beta #0 - Git SHA #5418fa4e`) contains `ExecuteInGameThread`, `ExecuteInGameThreadWithDelay`, `LoopInGameThreadWithDelay`, `LoopInGameThreadAfterFrames`, `IsInGameThread`, `RegisterCustomEvent`, `NotifyOnNewObject`, `RestartMod`, `RegisterLoadMapPostHook`, `SetSharedVariable`, `LoadAsset`. `RegisterHUDPostRenderHook` is absent. I checked this with a byte search of the DLL. KrinikPilot and KrinikColor already run on `ExecuteInGameThreadWithDelay`.

**Proof that it works in this exact game:** *Animal Labels* (Nexus MD #106, v1.6.4, 2026-10-06). It is a UE4SS Lua mod for MD 2.7.0.3 that "draws a small text label with name and distance above every animal". The "*" prefix "is drawn as a small dot by the game's font". "Config is hot-reloaded every 2 seconds". Requirement: "UE4SS 3.0.1 or newer (Lua scripting enabled)". So on-screen text from Lua works in MD 2.7.0.3. **How it draws is not disclosed.** The archive sits behind a Nexus login and I did not read its code. Source: Nexus GraphQL `legacyModsByDomain(medievaldynasty, 106)`, saved in `src/nexus_md.txt`.

---

## 1. How UE4SS Lua mods put text on screen

| # | Approach | How | Proven by | Effort | Risks |
|---|---|---|---|---|---|
| a | **Lua-built UMG** (recommended) | `StaticConstructObject(/Script/UMG.UserWidget, GameInstance)`, then `.WidgetTree = StaticConstructObject(/Script/UMG.WidgetTree, widget)`, then `CanvasPanel` as `RootWidget`, then `Border`, then `TextBlock`. Place it with `canvas:AddChildToCanvas(bg)` and set slot anchors/alignment/position. Then `text:SetText(FText(..))` and `widget:AddToViewport(z)`. Re-add when `not widget:IsInViewport()` | joric/SupraTools `Scripts/GameStats.lua` (the maintainers' reference; has a `topright` anchor preset): https://github.com/joric/SupraTools/blob/main/Scripts/GameStats.lua · abevol/PickupRangeXpBoost `Scripts/main.lua` (same recipe, health check, re-create on level change) · Nichologeam/StrayAP `main.lua` (Stray is UE4 **[GUESS: 4.27]**; builds UI inside `ExecuteInGameThread`) · Mian-K/PseudoregaliaSavestates `Scripts/Utils.lua` (TextBlock as root) · dicene/DiUI (Oblivion Remastered window framework; sets `textBlock.Font.FontObject` to a game font found by `FindAllOf("Font")`) · mattdavida/ue4ss-ModMenu (a whole settings UI built this way, MIT) | Small: ~60 lines for a clock | Must run on the game thread (fact 0.2). Re-add after map load (examples poll `IsInViewport`; **[GUESS]** UE's `LoadMap` clears viewport widgets). `RichTextBlock` "starts with nil font. Trying to set it always instantly crashes the engine" (StrayAP comment): use plain `TextBlock`. Our Conan record says `pcall` does not catch engine crashes |
| b | **BP mod via BPModLoaderMod** | In the UE **4.27** editor, create a project named like the game's content root (`Medieval_Dynasty`). Add `Content/Mods/<Name>/ModActor` (Actor BP); on BeginPlay it does Create Widget → Add to Viewport of `WBP_Clock`. Cook, then pak as `<Name>.pak` into `Content/Paks/LogicMods/`. The loader spawns `/Game/Mods/<Name>/ModActor.ModActor_C` on every map load and calls `PreBeginPlay`/`PostBeginPlay` | Local `ue4ss/Mods/BPModLoaderMod/Scripts/main.lua` (default `AssetPath = "/Game/Mods/%s/ModActor"` line 161, `World:SpawnActor` line 223, `RegisterLoadMapPostHook` line 292) · Dmgvol guides: https://github.com/Dmgvol/UE_Modding/blob/main/AdvancedModding/BpModsIntro.md, `BPModding/CreateWidget.md`, `ExpertModding/GameMenus.md` | Large: UE 4.27 editor install, project setup, cook/pak pipeline. The clock itself is small after that | **No public MD mod uses LogicMods** (`researches/medieval-dynasty/web-recon.md` A.3). `Content/Paks/LogicMods` is empty here. The game pak is encrypted and signed (`.sig`). Pak mods for MD document `-fileopenlog` or a `_P.pak` suffix (web-recon A.3). Issue #527: `SpawnActor` crashes in a 3.0.1 UE5.1 game after 3–10 spawns (one ModActor is fewer). Pros: designer-made look, the editor's font and anchors, native Construct/Tick |
| c | **AHUD `ReceiveDrawHUD` + `Canvas:DrawText`** | `RegisterHook(".../HUD:ReceiveDrawHUD", function(hud, sx, sy) hud:DrawText(...) end)` | Srlimao/Palword-mods (`StatMonitor`, `FreeCam`, `PresetSwitch`; Palworld's HUD BP implements the event) · Klauensprung/StormDopplerRadar `hud:DrawText(text, color, x, y, font, scale, false)` | Small | **Weak for MD.** No MD asset references `ReceiveDrawHUD`, and no MD game mode sets a custom HUDClass (I searched the bytes of `_vanilla/.../Blueprints` and `GM_MedievalDynasty*`). So the HUD is the engine default with no BP implementation, and a hook may never fire **[GUESS]**. The Lua callback also runs every frame |
| d | **UE4SS GUI / ImGui tab** | `register_tab` from a **C++** mod; the console GUI is set in `UE4SS-settings.ini [Debug] GuiConsoleEnabled` | `docs/guides/creating-gui-tabs-with-c++-mod.md` · issue #1072 quote above | Medium (C++) | Not for players: "for debugging purposes only, and comes with a performance penalty". Lua cannot add tabs (#1072 is an open request). In our install it is `GuiConsoleEnabled = 0`. **[GUESS]** It draws in the UE4SS console window, not inside the game frame |
| e | Rewrite text of a live game widget | Find a live `UI_*_C` instance and `SetText` its child | Conan: worked for `SetVisibility`/`RemoveFromParent`. Writing into `<Class>_C:WidgetTree.X` (the class template) crashed (docs/06) | Small | Takes over a game element; MD's HUD has no clock text to take over (game-internals line 792: "The UI shows no numeric clock — only the sun on the compass") |

**Verdict for UE 4.27 player overlay:** (a) Lua-built UMG, created and updated **only on the game thread**. It needs no editor and no pak. The maintainers recommend it, it has many working mods across engines, and one MD mod already draws text from Lua. (b) is the fallback if (a) misbehaves in MD, or if the look later needs designer work.

### MD-specific anchors for the clock (offline, `D:\Games\Medieval Dynasty Mods\_vanilla`)
- Main HUD widget: `/Game/Blueprints/UI/HUD/UI_HUD` (`UI_HUD_C`). Its names include `HUDPanel`, `CompassPanel`, `CanvasPanel`, `HideHUD`, `ShowHUD`, `TimeManagerReference`, `UI_SeasonProgress`, `F_Medieval`. Pause menu: `/Game/Blueprints/UI/MainMenu/UI_GameMenu`. Options rows: `UI_HorizontalOptionButton`, `UI_HorizontalOptionButton_Checkbox`, `UI_HorizontalOptionButton_Slider`, `UI_OptionsVerticalMenu`. String table `Blueprints/StringTables/HUDSettings` (the game has HUD toggles).
- Fonts: `/Engine/EngineFonts/Roboto` is cooked (Faces Regular/Bold/…). That is the `TextBlock` default **[GUESS from UE4 `UTextBlock` constructor: Roboto Bold 24]**. The game font is `/Game/Fonts/F_Medieval`, plus `Kingthings_Petrock_Pro`, `Vinque_rg`. Use the game font by `FindObject`/`FindAllOf("Font")` **after** the HUD loaded it (DiUI pattern). **Do not `LoadAsset`**: in Conan it caused a delayed abort (EXP-0059).
- Time already reads from `BP_TimeManager_C.Time`. The game clock runs at 1 game minute = 2 real seconds (game-internals line 1642). Menus pause game time (line 792).

---

## 2. In-game mod configuration menus that exist

| Framework | Game / engine | Registration | Storage | Live reload | UI tech | Reusable for us? |
|---|---|---|---|---|---|---|
| **ue4ss-ModMenu** (mattdavida, MIT, pushed 2026-09-01) https://github.com/mattdavida/ue4ss-ModMenu | Generic UE4SS. Tested: Mortal Shell 2, Code Vein 2, Wuchang, Thymesia, Fatal Claw (README; **[GUESS]** mostly UE5) | `ModMenu.Register({ id, items = { checkbox / dropdown / number / textinput / button / fold … } })` in Lua | Optional `ModMenu.ConfigManager`, at "`Mods/<id>/config.json`". "Hosts own what is written; ModMenu does not auto-save" | Callbacks `onChange`; host applies | Lua-built UMG docked panel, hotkey toggle, GameAndUI cursor. Uses `ExecuteInGameThread`/`LoopInGameThreadWithDelay` only (`shell/lifecycle.lua`, `core/input.lua`) | **Yes, as a UI kit.** It is pure Lua and uses game-thread APIs only. Note: "each Lua mod has its own ModMenu state (`require` is not shared across mods)", so a central manager hosts it in one mod. UE 4.27 is untested |
| **Mod Options Framework** (Elvlin, MIT, Palworld) https://github.com/Elvlin/Mod-Options-Framework · API: `DEVELOPER_API.md` | Palworld (UE5) | Consumer copies an SDK and calls `register_when_ready(schema, cb)`. Schema: `id, title, version, apply_mode = event / restart_mod / game_restart, options = { section, boolean, integer, decimal, enum, text }` | `PalModOptions\Scripts\config\<id>.ini`, "Each value is JSON-encoded on its own namespaced line. Writes use a temporary file and backup/replace sequence." | Publishes values plus a **generation counter** through `ModRef:SetSharedVariable`. The consumer calls `options.sync(gen, fn)` from an event it already has: "Do not add LoopAsync, a per-frame callback, an actor scan, or a recurring timer just to watch settings." | Injects a button into the game's Esc menu (hooks `WBP_MenuESC_C` `Construct`/`Destruct`, `NotifyOnNewObject`) and reuses the game's own `WBP_OptionSettings`/button classes via `WidgetBlueprintLibrary::Create` (`source/Scripts/main.lua` 25–33, 803–809, 1873–2148) | The **protocol** is reusable (schema + generation + atomic file). The UI is Palworld-bound |
| **DarnMenu** (Nexus Palworld #4245, v1.8.11) | Palworld | "write `shared/DarnMenu_schema_YourMod.lua` … and add your name to `shared/DarnMenu_schema_index.lua`". "Your tab appears at the next menu open — no restart." | `*_user.lua` targets under `Mods\shared\` ("settings that survive updates") | `Darn.watchConfig` + green/amber dots for live vs relaunch | ESC → Mod Options, native look. Known issue: the game "rebuilds its ESC menu constantly … removing or hiding widgets inside the game's own panels … is what causes the crashes" | Pattern only. Strong lesson: **schema is a data file, not a call**, so the order of mod loading doesn't matter |
| **Mod Menu** (one UE5 game's UE4SS mod section on CurseForge, MIT, v1.0.15, 2026-10-07; link withheld by the project's identity gate) | a UE5 game | "one small JSON file next to your enabled.txt" | "Changes save right into that mod's config file" (config.txt, JSON, or top-of-main.lua values) | "Most changes apply immediately". About 15 lines of author code for live pickup | "uses the game's own sliders and checkboxes" | Pattern only (no source link) |
| SN2ModSettings (Subnautica 2) | UE5 | Mods appear under Settings → Mods; load-order line in `mods.txt` needed | — | — | — | GitHub repo README is empty; nothing to reuse |
| Satisfactory SML config (not UE4SS) | — | C++/BP config classes | — | — | — | Pattern only, not researched further |

**Summary:** there is no drop-in manager for UE 4.27 that I could verify. All mature ones agree on four things:
- a per-mod **schema as data** (types: bool / int with min, max, step / float / enum / text / section);
- **one value file per mod, written atomically**;
- **apply modes** (live / restart mod / restart game);
- a cheap **change signal** (generation counter or file re-read), not a heavy poll.

---

## 3. Talking between mods in UE4SS Lua

- **Separate Lua states.** Each mod has its own Lua state, and `require`d modules are per mod (ModMenu README note 1). Tables cannot be passed between mods directly.
- **Shared variables.** `ModRef:SetSharedVariable(name, v)` / `GetSharedVariable(name)` accept only "`nil`, `string`, `number`, `bool`, `UObject` (+derivatives), `lightuserdata`". "These variables do not get reset when hot-reloading." "Any mod is able to override the value for any shared variable." "It's a very bad idea to share transient objects like actors." https://github.com/UE4SS-RE/RE-UE4SS/blob/main/docs/lua-api/classes/mod.md. Practical shape: `KMM.<modId>.gen = <number>` plus the values in a file, or a serialized string. MOF uses exactly this and fences stale sessions after hot reload with a 3.85 s startup window.
- **Files.** Plain `io` (KrinikColor already re-reads `color.txt` every second on the game thread; Animal Labels every 2 s). Folder enumeration without a shell: `IterateGameDirectories()` (BPModLoaderMod uses `Dirs.Game.Content.Paks.LogicMods` and `ModDirectory.__files`, local main.lua 115–129).
- **BP → Lua.** `RegisterCustomEvent("Name", fn)` fires when "a blueprint function or event is called with the name" (docs). It is already used by the installed `BPML_GenericFunctions` (`PrintToModLoader`, `ConstructPersistentObject`).
- **Lua → BP.** Find the mod actor and call its function. All BP mods share the short class name `ModActor_C`, so filter by full path (`/Game/Mods/<Name>/ModActor.ModActor_C`) **[GUESS from the naming convention]**.
- **Hot reload is off** in our install (`EnableHotReloadSystem = 0`), which avoids issue #1445 (restart deadlocks or heap corruption) and stale shared variables.

---

## 4. Pitfalls with Lua widgets in UE4SS 3.0.x

1. **Thread.** Create and touch widgets only inside `ExecuteInGameThread` / `ExecuteInGameThreadWithDelay` / `LoopInGameThreadWithDelay` or a `RegisterHook` callback. Never inside `ExecuteWithDelay` / `LoopAsync` / `ExecuteAsync` (LuaMod.cpp; issue #168). This is the most likely reason Conan crashed (fact 0.2). Issue #1180 (closed Feb 2026, v3.0.1-932): overlapping `ExecuteInGameThread` callbacks crashed with "Ref was not function". Keep **one** self-rearming chain per mod (house rule EXP-0052).
2. **Lifetime / GC.**
   - Outer = `GameInstance` (SupraTools, PickupRange, ModMenu) survives map loads.
   - Lua references are not GC roots: check `IsValid()` before every use and re-create when invalid (PickupRange `EnsureXpBoostWidget`).
   - **[GUESS from UE4 source]** while in the viewport, the widget is kept alive by its Slate wrapper (`SObjectWidget` is an `FGCObject`). After `RemoveFromParent` it can be collected.
   - Re-add after a map load: the examples re-add on `not IsInViewport()`.
   - Clear all cached UObjects on level change (PickupRange `ResetLevelState`: "UE objects/structs from the previous level may be GC'd; any cached reference … becomes a dangling pointer").
3. **Templates vs instances.** Never write into `<Class>_C:WidgetTree.X` (Conan crash #3). Write only into children of a widget **we** constructed, or of a live instance.
4. **Fonts.**
   - The `TextBlock` default works (Roboto is cooked into MD).
   - Change the size via `text.Font.Size = N` (SupraTools, StrayAP: the default "is 25, which is quite large").
   - Use a game font only if already loaded (`FindAllOf("Font")`, DiUI). Do not `LoadAsset` (EXP-0059).
   - `RichTextBlock` is a crash (StrayAP).
   - `FText(...)` works on 4.27. SupraTools needs the `FText_Constructor.lua` signature only for UE ≥ 5.4.
5. **Input for a menu.** A settings panel needs a cursor and `GameAndUI` mode (ModMenu handles it). MD's **LeftAlt = inspector mode** (game-internals line 1636), so menu keys must avoid Alt.
6. **`pcall` does not catch engine crashes** (Conan docs/06). Roll out step by step: construct only and log, then add to viewport, then text updates. Watch the time of the `ue4ss/*.dmp` dump against the planned step (EXP-0060 repro).
7. **Visibility codes:**
   - `SetVisibility`: 0 Visible · 1 Collapsed · 2 Hidden · 3 HitTestInvisible · 4 SelfHitTestInvisible (SupraTools uses 4/2; Conan used 3 so clicks pass through).
   - A clock should be 3 or 4 so it never eats clicks.

---

## 5. Recommendation

### (A) Clock: simplest path first
1. **Read Animal Labels' `Scripts/main.lua` first.** It is the only proof in MD 2.7.0.3 itself. It needs a manual Nexus download (login), then reading only. Copy its drawing technique if it differs from below.
2. **KrinikClock as a Lua-built UMG widget.**
   - Structure: `UserWidget` (outer GameInstance) → `WidgetTree` → `CanvasPanel` → `Border` (semi-transparent) → `TextBlock`.
   - Placement: slot anchors (1,0), alignment (1,0), position (−margin, +margin), so it sits top-right. This is SupraTools' `topright` preset.
   - Update: one `LoopInGameThreadWithDelay(1000)`. The game minute lasts 2 s, so 1 s is enough. Call `SetText` only when the string changes.
   - On every tick: if invalid → re-create; if `not IsInViewport()` → `AddToViewport(z)`.
   - **[GUESS]** hide it when the `UI_HUD_C` instance is hidden (mirror its `GetVisibility`, or post-hook `UI_HUD_C:HideHUD`/`ShowHUD`) and when menus are open. Confirm live.
   - Font: Roboto by default. Optionally use `F_Medieval` once `FindAllOf("Font")` sees it.
   - Settings (show/hide, 12/24 h, day/season, corner, size): a key=value file re-read every second, the KrinikColor house pattern, until (B) exists.
3. **Fallback if (2) crashes on the game thread:** the BP mod (b). It costs a UE 4.27 editor and the cook pipeline.

### (B) KrinikModManager: in three steps, each usable alone
- **B0, protocol first (no UI):**
  - A shared library `Mods/shared/KrinikMM/` (like `UEHelpers`).
  - Each mod ships `kmm.schema.lua` (data: id, title, version, apply mode, options).
  - Values go in `Mods/<Mod>/settings.json`, written atomically (temp + rename, the MOF pattern).
  - Each mod gets `KMM.load(schema)` and `KMM.changed()`. The latter checks the shared variable `KMM.<id>.gen`, with a file re-read as fallback, from the mod's **existing** game-thread tick.
  - This alone gives persistence and live pickup for the clock.
- **B1, in-game panel:**
  - The `KrinikModManager` mod enumerates `Mods/*/kmm.schema.lua` via `IterateGameDirectories`. Because the schema is a file, load order doesn't matter (DarnMenu, RS:DW Mod Menu).
  - It builds one Lua-UMG panel: a list of mods on the left, controls on the right.
  - It saves the file and bumps `KMM.<id>.gen`.
  - Cheapest build: adopt **mattdavida/ue4ss-ModMenu** (MIT, pure Lua, game-thread only) as the widget kit inside this one host mod. UE 4.27 compatibility is the first thing to test.
- **B2, optional native look:** inject a "Mods" entry into `UI_GameMenu` and reuse `UI_HorizontalOptionButton_Checkbox/_Slider` via `UWidgetBlueprintLibrary::Create` (the MOF pattern). This is the highest risk: DarnMenu reports crashes from touching the game's own panels, and Conan crashed on `Create` (from the async thread). Do it only if the owner wants it to look native.

---

## 6. Open questions for the owner (UI look only)
1. **Clock text format:**
   - time only `14:05`;
   - time + day `14:05 · Day 12`;
   - full `14:05 · Day 12 · Spring · Year 3`.
   And 24 h by default?
2. **Style:**
   - bare text with a shadow;
   - text on a dark semi-transparent plate;
   - framed like the game's compass.
   Font: game-like (`F_Medieval`) or clean (Roboto)?
3. **Placement:** top-right corner, or right under/next to the compass? And should it hide with the HUD and in menus?
4. **Settings menu look:**
   - a simple panel of our own (docked to a screen edge, opened by a key);
   - a "Mods" entry inside the game's pause menu that looks native (B2, slower and riskier).
5. **Which key opens the settings menu** (not Alt: Alt is the inspector)? Should the panel also be reachable from the pause menu?

## 7. Not verified / gaps
- How Animal Labels draws (archive not read).
- Whether `ReceiveDrawHUD` fires in MD at all.
- Whether ModMenu runs on UE 4.27.
- Whether `UI_HUD_C:HideHUD` is hookable.
- Whether paks in `LogicMods` load despite the game's pak signing.
- That Stray is 4.27 (from memory).
- The Conan thread diagnosis is a strong hypothesis from source, not a reproduced fact.
