# Web sweep: how the industry builds ONE "Mod settings" hub for many third-party mods

> **Created:** 2026-10-30 · **Parent:** KUMM plan 36 W24 (the owner's epic) · **Status:** web sweep done · **Outbound:** rung 1 research doc of the epic

**Question.** One "Mod settings" button in Conan Exiles Enhanced opens one window that holds the settings of many third-party mods, in the game's own visual style. How do mature mod-configuration hubs in other games do this, what do their communities complain about, and which design rules have they converged on?

**Method and trust marks.**
- I read primary sources wherever I could reach them: project wikis, GitHub READMEs, API files, official docs.
- Nexus Mods pages returned HTTP 403 to the fetcher, and Steam Community pages returned HTTP 429. Claims about those pages come from the search engine's index summary of the page, not from my own read. Each such claim is marked **[index]**.
- **[unverified]** marks a claim I could not tie to any source. **[inference]** marks my own reasoning.
- No numbers here are invented. Every number is quoted from the source named next to it.
- Prior local recon on UE4SS settings frameworks: `D:\work\ai_sandbox\KUMM\researches\medieval-dynasty\recon-clock-widget-and-mod-settings.md` §2 (2026-10-08). Where this sweep re-checked a claim from that file, it says so.

---

## 1. Per-framework findings

### 1.1 SkyUI MCM (Skyrim): the original hub

- **Registration is code, not data.** A mod writes a Papyrus script that `extends SKI_ConfigBase` and attaches it to a dedicated quest. The `ModName` property sets the name shown in the list. A `PlayerAlias` with `SKI_PlayerLoadGameAlias` is required because "Each config menu has to run some maintenance code when the game is reloaded." https://github.com/schlangster/skyui/wiki/MCM-Quickstart
- **Pages are rebuilt every time they open.** `OnPageReset(page)` fires on every page selection, and the panel clears the page each time, so the mod re-adds all options there. Events: `OnOptionSelect`, `OnOptionDefault`, `OnOptionHighlight` (info text appears after about a second of hover, via `SetInfoText`). Source: same page.
- **Widgets.** `Add*Option` for toggle, text, slider, menu, color, keymap, plus header and empty spacer. Each call returns an option ID that the mod compares in its handlers. Layout is a 2-column grid of up to 128 entries per page, and a menu has up to 128 pages. Source: same page.
- **State belongs to the mod.** "The panel stores very little state". The script keeps its own variables and must call setters such as `SetToggleOptionValue` itself, or the display drifts out of sync with the real value. Source: same page.
- **Soft dependency.** A mod can ship an MCM script without requiring SkyUI. Without SkyUI "there will be no Mod Configuration Menu, so your menu will simply do nothing." Mods must not ship the `SKI_*` scripts themselves, because that "might lead to conflicts with future MCM updates." https://github.com/schlangster/skyui/wiki/MCM-FAQ
- **Robust to install order.** The FAQ says the MCM is designed to survive installing the mod and SkyUI in either order, and adding or removing either one (or SKSE) at any time. Source: same FAQ.
- **Handlers must return.** `Utility.Wait` inside a handler freezes the menu until it closes. Source: same FAQ.
- **Persistence.** The values live in the mod's Papyrus script variables. **[inference]** Papyrus state is saved in the savegame, so the values are per-save. The whole MCM Recorder / MCM Memory ecosystem in §2 exists for that reason.

### 1.2 MCM Helper (Skyrim) and Fallout 4 MCM: the declarative generation

- **What it is.** MCM Helper sits on top of SkyUI's MCM and "streamlines access to SkyUI's API". Its API is modeled on Fallout 4's MCM (F4MCM). https://github.com/Exit-9B/MCM-Helper/wiki
- **Registration is a data file per mod.**
  - `Data/MCM/Config/<ModName>/config.json` (required) holds the menu layout.
  - `keybinds.json` (optional) holds hotkeys.
  - `settings.ini` (optional) holds defaults.
  - User values go to `Data/MCM/Settings/<ModName>.ini`. A quest with a small config script still registers the menu with SkyUI.
  - Source: same wiki. A JSON schema for editor validation is published at https://raw.githubusercontent.com/Exit-9B/MCM-Helper/main/docs/config.schema.json
- **The same layout in Fallout 4 MCM** **[index]**: `Data\MCM\Config\ModName\config.json` "(Required) Menu Layout", `keybinds.json` "(Optional)", user settings in `Data\MCM\Settings\ModName.ini`. It requires F4SE and is opened from the Pause menu. https://www.nexusmods.com/fallout4/mods/21497 · https://github.com/reg2k/f4mcm
- **Fallout 4 live apply** **[index]**, from forum posts, not official docs:
  - The mod registers `RegisterForExternalEvent("OnMCMSettingChange|ModName", "Callback")` and reads values with `MCM.GetModSettingInt("ModName", "id:Main")`.
  - Source: https://forums.nexusmods.com/topic/13493125-mcm-switch-globalvalue-callfunction-on-the-same-button-is-it-possible
- **Twelve control types** (https://github.com/Exit-9B/MCM-Helper/wiki/Control-Types):
  - Layout and display: Empty, Header, Text (works as a button when given an `action` such as `CallFunction`).
  - Values: Toggle, HiddenToggle (drives group conditions and is not drawn), Slider (`min`/`max`/`step`/`formatString`, opens a dialog), Stepper, Menu (string), Enum (int index), Color (0xRRGGBB), Keymap (warns on conflicts unless `ignoreConflicts`), Input (text).
  - Most value types take a `help` string.
- **Persistence is a per-control choice** (https://github.com/Exit-9B/MCM-Helper/wiki/Setting-Types,-Storage,-and-Persistence):
  - **ModSetting** values live in the INI. They "persist for the game installation, not per save" and can be shared as config files.
  - **GlobalValue** values are "saved with the savegame" (per-save). Large integers lose precision because they are stored as floats.
  - **PropertyValue** reads and writes Papyrus auto-properties.
  - **Rationale stated by the page:** use ModSettings for install-wide and shareable values, and GlobalValues for values that must travel with the save.
- **Conditional visibility.** `groupCondition`/`groupControl` show or hide controls depending on another value. https://github.com/Exit-9B/MCM-Helper/wiki/Group-Conditions (index page, not read in detail)
- **Localization** (https://github.com/Exit-9B/MCM-Helper/wiki/Localization):
  - Labels are `$KEY` strings, looked up in `Data/Interface/Translations/<mod>_<LANGUAGE>.txt`, UTF-16 LE with BOM.
  - The whole field must match the key. Long keys should carry a mod prefix.
  - Only the current language loads, with no fallback to English.

### 1.3 Starfield MCM

- I found no confirmed Starfield port of MCM or its `config.json` format. **[unverified]** whether one exists. The searches returned only Fallout 4 MCM pages and generic SFSE setup.

### 1.4 Baldur's Gate 3: Mod Configuration Menu (Volitio / AtilioA)

Sources: https://github.com/AtilioA/BG3-MCM (README) and its author guide https://raw.githubusercontent.com/AtilioA/BG3-MCM/main/wiki.md (mirrored at https://wiki.bg3.community/Tutorials/Mod-Frameworks/mod-configuration-menu, which rendered empty for the fetcher).

- **Registration is a data file.**
  - `MCM_blueprint.json` sits next to the mod's `meta.lsx`. The mod either declares MCM as a dependency or sets `"Optional": true`.
  - The blueprint holds `SchemaVersion`, `ModName`, `HiddenFromList`, then `Tabs`, which contain `Sections` or `Settings`.
  - Each setting has a unique `Id`, `Name`, `Type`, `Default`, and at least one of `Description`/`Tooltip`.
  - `VisibleIf` (AND by default, `"or"` optional) hides UI only and does not change stored values.
  - A `schema.json` is published for editor validation.
- **Widgets.**
  - Numbers: `int`, `float`, `slider_int`, `slider_float` (Min/Max/Step), `drag_int`, `drag_float`.
  - Choices and text: `checkbox`, `text` (multiline option), `enum` (static or `Dynamic` choices), `radio`.
  - Other: `list_v2`, `color_picker`, `color_edit`, `keybinding_v2`, `event_button`.
  - `list` and `keybinding` are deprecated, and old `list` values "migrate automatically when the ID stays the same."
- **Persistence.**
  - Default storage is JSON, global across saves, under `%LOCALAPPDATA%/Larian Studios/Baldur's Gate 3/Script Extender/BG3MCM/Profiles/Default/<mod>/`.
  - `storage = "modvar"` makes a value save-scoped, but that option is "still a WIP."
  - **Profiles:** create, save, load, delete, export, and restore.
  - The README's stated rationale: "Modifications are done in-memory and saved to JSON files, leaving save files untouched."
- **Validation and self-repair.**
  - Values are validated on load, on programmatic set, and on UI input. Invalid values revert to the blueprint default.
  - Settings that are no longer in the blueprint are removed from the JSON, and new ones are added.
  - An unparsable JSON is left untouched, logged, and defaults are served until it is fixed.
- **Live apply.** "Settings update instantly without needing to reload saves" (README). Events go through `Ext.ModEvents.BG3MCM`:
  - `MCM_Setting_Saved` carries `modUUID`, `settingId`, `value`, `oldValue`. Listeners must "always check `modUUID`".
  - Others: `MCM_Setting_Reset`, `MCM_Profile_*`, `MCM_Mod_Tab_Added`, `MCM_Window_Opened` / `Closed`, and more.
- **Escape hatch for custom UI.** `MCM.InsertModMenuTab(tabName?, tabCallback, modUUID?, …)` lets a mod draw its own content inside a tab. This is how a mod with non-standard UI still lives in the hub.
- **Keybindings.**
  - `keybinding_v2` carries a keyboard or mouse default and flags such as `ShouldTriggerOnKeyDown`, `PreventAction`, and `AllowConflict` (default false).
  - The hub "detects exact combo clashes between its actions."
- **Access and layout.**
  - The hub opens from the ESC menu or `INSERT` by default.
  - The README describes the UI as "a single, dynamic and configurable interface, with smart sidebar and detach functionalities."
  - The core is "technically independent of IMGUI".
- **Localization.** A `Handles` object (`NameHandle` and similar) points to loca entries. If a handle does not resolve, the hub falls back to the plain `Name`/`Description`.
- **Stability contract.** Touching `Mods.BG3MCM` internals triggers a one-time warning and has no compatibility guarantee.

### 1.5 Cyberpunk 2077: Mod Settings (jackhumbert) and Native Settings UI (repo justarandomguyintheinternet)

**Mod Settings** (RED4ext plugin). Sources: https://github.com/jackhumbert/mod_settings · https://wiki.redmodding.org/scripting-cyberpunk/mod-settings/introduction · https://wiki.redmodding.org/scripting-cyberpunk/mod-settings/usage

- **Registration is declarative annotations on a script class.**
  - Each field carries `@runtimeProperty("ModSettings.mod", …)`, `ModSettings.displayName`, `ModSettings.description`, `ModSettings.category` (+ `.order`), `ModSettings.min` / `max` / `step`, `ModSettings.dependency` (shown only while a named bool is on), and `ModSettings.displayValues.<Value>` for enum labels.
  - The field's initial value is its default. Fields without annotations stay hidden.
- **Types:** `Bool` (toggle), `Int32`/`Float` (slider), `Enum` (selector), and `EInputKey` (keybind, keyboard or controller).
- **Native look.** The settings appear "using native UI of the game", inside the game's own settings screen. The dev tooling swaps the game's `SettingsMainGameController` classes, which shows the hub is built from the game's own settings controllers.
- **Apply.** Changes commit on the game's own **Accept** button.
  - Listeners: `ModSettings.RegisterListenerToClass(this)` or `RegisterListenerToModifications(this)`, with exactly named `cb` methods such as `OnModSettingsChange`.
  - The plugin writes values to its own configuration file. Changes made in code are saved only after `ModSettings.AcceptChanges()`.
  - The file path is not stated on the pages I read **[unverified]**.
- **Localization.** Any string can be a localization key.

**Native Settings UI** (a CET Lua framework). Source: https://github.com/justarandomguyintheinternet/CP77_nativeSettings

- **Placement.** A "fully native UI `Mods` settings menu". Mods add tabs, and several mods may share one tab.
- **Imperative API.**
  - Structure: `addTab`, `addSubcategory`.
  - Widgets: `addSwitch`, `addRangeInt`, `addRangeFloat`, `addSelectorString`, `addKeyBinding`, `addButton`.
  - `addCustom` returns the raw `inkCompoundWidget`. This is the escape hatch for custom UI.
- **Live apply** through a per-widget callback.
- **Persistence is left to the mod.** The examples tell the mod to read its own file in `onInit` and save in the callback.
- **Defaults.** A `Defaults` button resets to `defaultValue`, and `registerRestoreDefaultsCallback` lets a mod override the reset.
- **Limitation:** "The menu does not sync external changes automatically". The mod must call `setOption` after changing a value elsewhere.

**Fragmentation signal.** Two separate hubs coexist in one game. A third Nexus mod adds Mod Settings pages into Native Settings UI **[index]** https://nexusmods.com/cyberpunk2077/mods/20779

### 1.6 Minecraft: Mod Menu + Cloth Config / YACL (separated list and pages)

- **Mod Menu only lists mods and launches screens.** Source: https://github.com/TerraformersMC/ModMenu
  - Layout: the mod list on the left with search and filters, details on the right with a config button.
  - Badges: `Client`, `Library`, `Deprecated`. Mods can be grouped under a parent.
  - A mod opts in through the `"modmenu"` entrypoint and `ModMenuApi.getModConfigScreenFactory`.
  - A library can supply screens for other mods through `getProvidedConfigScreenFactories`.
  - Name and description translate through language keys such as `modmenu.nameTranslation.<modid>`.
  - The README only says config is available "if supported by the mod". It does not show what a mod without a screen looks like.
- **Cloth Config is a builder library.** Sources: https://shedaniel.gitbook.io/cloth-config/using-cloth-config/creating-a-config-option.md · https://shedaniel.gitbook.io/cloth-config/using-cloth-config/saving-the-config.md
  - Structure: `ConfigBuilder`, then categories, then `ConfigEntryBuilder` entries.
  - `setDefaultValue` is used by Reset. `setSaveConsumer` writes the value back on save. `setSavingRunnable` runs after Save and "Serialise[s] the config into the config file". Writing the file is the mod's job.
  - Names are `TranslatableText` keys.
  - Its own docs index has an "Auto Config" section that generates the screen from an annotated class (not read in detail).
- **YACL is a newer builder with the same shape.**
  - Structure: `YetAnotherConfigLib.createBuilder()`, then `ConfigCategory`, then `OptionGroup`, then `Option`, with `binding(default, getter, setter)` + `controller(...)`. https://docs.isxander.dev/yet-another-config-lib/gui-builder/getting-started.md
  - Controllers: Boolean, TickBox, Int/Long/Float/Double slider and field, Enum, String, Color. https://docs.isxander.dev/yet-another-config-lib/gui-builder/controllers.md
  - Special options: List, Label, Button. https://docs.isxander.dev/yet-another-config-lib/gui-builder/special-options.md
  - Persistence: `ConfigClassHandler` + `@SerialEntry` + GSON/JSON5 file in the loader's config folder. https://docs.isxander.dev/yet-another-config-lib/config-api/basic-usage-of-config-api.md
  - Positioning: "designed to fit right in vanilla Minecraft". The docs call Cloth Config "stale", say Spruce UI "isn't designed for configuration", and say MidnightLib "has cosmetics built-in". https://docs.isxander.dev/yet-another-config-lib/overview.md

### 1.7 Stardew Valley: Generic Mod Config Menu (GMCM)

- **Registration is code through a copied interface.** Interface copy: https://raw.githubusercontent.com/holy-the-sea/LightSwitch/main/IGenericModConfigMenuApi.cs (the canonical file in spacechase0's repo moved and returned 404).
  - `Register(mod, reset, save, titleScreenOnly)`: the mod supplies its own "Reset the mod's config to its default values" and "Save the mod's current config to the `config.json` file" callbacks.
  - Widgets: `AddBoolOption`, `AddNumberOption` (int and float, with min/max/interval/format), `AddTextOption` (with `allowedValues`, which makes it a dropdown), `AddKeybind`, `AddKeybindList`.
  - Layout: `AddSectionTitle`, `AddParagraph`, `AddImage`, `AddPage`/`AddPageLink` (sub-pages).
  - `AddComplexOption`: custom draw plus lifecycle hooks. This is the escape hatch.
  - Other calls: `SetTitleScreenOnlyForNextOptions` ("different values per-field"), `OnFieldChanged`, `OpenModMenu(mod)`, `Unregister`.
  - All labels are `Func<string>`, so they are re-read for the current language.
- **Player side.** Source: https://www.curseforge.com/stardewvalley/mods/generic-mod-config-menu
  - Opens from a cog on the title screen and from the in-game options menu.
  - "Changes are live after saving, no need to restart the game"
  - "some mods may only allow editing their config from the title screen"
  - "This only works for mods which were designed to support Generic Mod Config Menu." No fallback for mods that do not integrate.

### 1.8 Unreal Engine games (the closest to us)

**Satisfactory: SML configuration system** (C++/Blueprint, not UE4SS)

Sources: https://docs.ficsit.app/satisfactory-modding/latest/Development/ModLoader/Configuration.html · https://docs.ficsit.app/satisfactory-modding/latest/ForUsers/ConfiguringMods.html

- **Registration is a schema asset.**
  - A Blueprint extends `ModConfiguration`, with a Root Section of `BP Config Property Section` holding typed properties: bool, int, float, string, class, color, array, nested section.
  - It is registered in a Game Instance Module. `RegisterModConfiguration` "Should only be called on start-up."
- **Schema and value are separate.** The schema holds DisplayName, Description, and Tooltip. A `ConfigurationManager` (GameInstance subsystem) loads, saves, and dirty-tracks the values. `FlushPendingSaves()` writes them.
- **UI is generated, with custom widgets allowed.** SML builds the editor widget from the property type, and a mod can supply a custom widget.
- **Player side.**
  - Opens from a "Mods" button on the main menu and the pause menu.
  - Some options are main-menu-only, and the tooltip explains why.
  - A separate "Mod Savegame Settings" category lives inside the save (per-save) and is set at new-game time or from the pause menu.
  - The config files are JSON **[index]**: `FactoryGame/Configs/<ModID>.cfg`.

**Palworld (UE5, UE4SS Lua): three competing hubs**

- **Native Mod Options** (tlechien). Sources: https://github.com/tlechien/Palworld-Undepresso-NativeModOptions/wiki · `/wiki/Schema-Reference` · `/wiki/Troubleshooting`
  - **Placement:** Options → Mod Options, on both the title menu and the ESC menu. It is built from the game's own options widgets: switch, slider, left/right selector, key-config. The `warning`/`disabled` states are native calls on the row frame, so they "look exactly like the game's own."
  - **Registration:**
    - Lua `ModOptionsClient.new({id, title, options}):register()` + `:subscribe(cb)`.
    - Types: `boolean`, `number` (min/max required), `enum` (`choices`), `keybind`, `section`, `warning`, `image`. There is no text type because there is no native text row.
    - The schema is validated, and a rejected schema removes the whole tab (logged as `Rejected schema`).
  - **Apply:** vanilla Apply semantics, with a confirm prompt when leaving with unsaved changes. The callback fires once per changed key, with no polling and no mid-drag slider events.
  - **Persistence:** `<UE4SS Mods>/NativeModOptions/<id>.ini`. The schema `id` is the filename, so renaming it orphans the old values. "Don't edit the `.ini` yourself."
  - **Soft dependency:** without the framework, `client.values` holds the defaults, `register`/`subscribe` do nothing, and "Nothing raises an error."
  - **Lessons it documents:**
    - An old build saved inside the watched `Scripts/` folder and triggered UE4SS hot reload. Config now lives in the mod root.
    - UE4SS cannot unregister key binds.
    - Keybind callbacks run off the game thread, so UObject work must go through `ExecuteInGameThread`.
- **Mod Options Framework** (Elvlin, MIT). Source: https://github.com/Elvlin/Mod-Options-Framework/blob/main/DEVELOPER_API.md (re-checked in this sweep)
  - **Schema:** `id`, `title`, `version`, `apply_mode` = `event` / `restart_mod` / `game_restart`, and `options` with 1–128 items of `section` / `boolean` / `integer` / `number` / `enum` / `keybind` / `text` (256 chars).
  - **Storage:** `PalModOptions\Scripts\config\<id>.ini`. "Writes use a temporary file and backup/replace sequence."
  - **Change signal:** a generation counter read through `options.generation()` / `options.sync(gen, cb)`, called from an event the consumer already has. "Do not add `LoopAsync`, a per-frame callback, an actor scan, or a recurring timer just to watch settings."
  - **Localization:** labels take locale keys (`en`, `zh-Hans`, `ja`, `ko`) with fallback to English.
  - **Soft dependency:** "framework absence or a registration failure must not block the consumer's normal gameplay operation." Also: "Do not copy the framework's Esc-menu injection code". Only the hub touches the game menu.
- **DarnMenu** **[index]** (Nexus Palworld 4245): https://www.nexusmods.com/palworld/mods/4245
  - **Placement:** ESC → Mod Options, in the game's own style. Registration is pure data files.
  - **Fallback:** a read-only "Other Mods" list that links to config files of mods without a DarnMenu page.
  - **Known issue:** the first click on Mod Options occasionally does nothing.
  - The prior local recon quotes its page: the game "rebuilds its ESC menu constantly … removing or hiding widgets inside the game's own panels … is what causes the crashes". It also notes green and amber dots that mark live versus relaunch settings (`recon-clock-widget-and-mod-settings.md` §2).

**Oblivion Remastered (UE5 + UE4SS)** **[index]**

- **MadMCM** (https://www.nexusmods.com/oblivionremastered/mods/4810): a Skyrim-style MCM for UE4SS mods.
  - Opens with key "L", rebindable in its own "MCM Settings" tab.
  - Its docs cover sliders, checkboxes, string sliders, and hotkeys.
- **CosmicMCM** (https://www.nexusmods.com/oblivionremastered/mods/5497): F10, mods appear as tabs, toggles/sliders/keybinds, values in an `.ini`. The author says it was built for their own mods, not as a public framework.

**Generic UE4SS: ue4ss-ModMenu** (mattdavida, MIT). Source: https://github.com/mattdavida/ue4ss-ModMenu (re-checked)

- **API:** `ModMenu.Register({id, title, tab, items})`. Item types: checkbox, button, dropdown (searchable, `maxVisible`), label, separator, number, textinput, row, fold.
- **Persistence is opt-in.** `ConfigManager` writes `Mods/<id>/config.json`, and "ModMenu does not auto-save."
- **Layout:** each mod gets its own docked panel and hotkey; this is not one hub. "each Lua mod has its own ModMenu state". So a single hub has to host it inside one mod.
- **Warning:** "Heavy work on the click stack can hitch or crash."

**Hogwarts Legacy**

- The studio shipped an official in-game Mod Manager with CurseForge on 2025-01-30. https://blog.curseforge.com/official-in-game-mods-are-coming-to-hogwarts-legacy/
- I found nothing on per-mod settings inside it, and no community settings hub **[unverified]**.

### 1.9 The Binding of Isaac: Mod Config Menu Pure (a cautionary fork)

Source: https://github.com/Zamiell/isaac-mod-config-menu

- **Why it was forked.** The fork "removes all of the hacks that override internal Lua functionality". After game patch v1.7.9b, "other version of Mod Config Menu will not work anymore."
- **Integration contract.** Mods detect the global `ModConfigMenu` rather than `require` a copy.
- **Bundling breaks it.** Two copies of the library, or a mod that bundles a standalone copy, conflict.
- **Persistence belongs to each mod.** "Mod Config Menu Pure is not responsible for saving the configuration data of other mods."

### 1.10 Conan Exiles itself: is there a shared hub?

**Finding: no shared, cross-author mod settings hub or control panel was found** (searches of Steam Workshop and Funcom forums through the search engine, Nexus Conan pages). Each mod brings its own entry point:

- **Hosav's Custom UI** **[index]** (changelog https://steamcommunity.com/sharedfiles/filedetails/changelog/1797359985):
  - v1.3 (Oct 2019) rebuilt its settings as a custom "UI Settings Menu" opened from the inventory's UI-settings button.
  - v2.1.1 changed the mod to avoid crashes from other mods editing the same UI files. It still recommends loading after any other UI-editing mod, and it shows a first-open warning that other UI mods can cause crashes.
  - v2.4.3 (2024-04-04) can show or hide a **mod list in the Esc menu**, with a Steam-page link button per mod. This is the nearest thing to a hub in Conan, but it lists mods and does not configure them.
- **Emberlight** **[index]** (changelog https://steamcommunity.com/sharedfiles/filedetails/changelog/1369802940):
  - 3.0.3 (2020-05-29) "Added Mod Settings Menu", reached from the radial menu of its placeables. The per-item radial options were moved into that one tabbed menu.
  - Chat command `/emberlight settings <feature>` opens it straight on the `<feature>` tab. This is deep-linking to a page.
  - Its commands must be enabled in Pippi's Commands tab.
- **Fashionist** **[index]**: own configuration interface since 4.0, opened from a button in the character inventory or `DataCmd Fashionist Config`. https://testerle.net/fashionist-configuration/
- **A mod's config button lost under another HUD mod** **[index]**. In a Steam Workshop thread, a player reports that with Smaller_Hud active the mod's configuration button disappeared. It was reachable only through an NPC inventory, where the menu sat behind the window. https://steamcommunity.com/workshop/filedetails/discussion/1185321962/2264691117425511144 (the search summary calls it a minimap mod; the mod's name is unconfirmed, page 429).
- **Pippi** replaces the admin panel with its own server-manager section **[index]**. https://steamcommunity.com/app/440900/discussions/0/3198115500365626654. The search summary also quotes a Pippi changelog fix for a "Pippi Settings panel", but I could not tie it to a URL **[unverified]**.
- **Out-of-game tools** (not hubs): Conan Config Editor (https://www.nexusmods.com/conanexilesenhanced/mods/32) and Conan Mod and Server Manager (https://www.nexusmods.com/conanexiles/mods/155) edit config files from the desktop **[index]**.
- **Compatibility context** **[index]**: Conan Exiles Enhanced (UE5), shipped 2026-05-05, broke UE4-era mods until their authors recompiled against the new Dev Kit. https://website.prod.nexus.low.ms/blog/top-conan-exiles-mods-dedicated-servers

---

## 2. Comparison at a glance

| Hub | Registration | Widgets beyond bool/number/enum | Values live | Scope | Apply | Fallback / escape hatch | Native look |
|---|---|---|---|---|---|---|---|
| SkyUI MCM | Papyrus class (code) | color, keymap, text | mod's script vars | per-save [inference] | immediate in handlers | none (soft dep) | yes (SkyUI is the menu) |
| MCM Helper / F4MCM | `config.json` (data) | stepper, color, keymap, input, text-as-button | `MCM/Settings/<mod>.ini` or GlobalValue | per-control: global or per-save | change event | Text `action: CallFunction` | yes |
| BG3 MCM | `MCM_blueprint.json` (data) | radio, drag, list, color, keybind, event_button | JSON profiles, opt. ModVars | global by default, profiles | instant + events | `InsertModMenuTab` custom tab | no (IMGUI window) |
| CP2077 Mod Settings | annotations (declarative code) | keybind | plugin's own file | global | on Accept | none | yes (game settings) |
| CP2077 Native Settings UI | Lua calls (code) | keybind, button, custom widget | the mod's own job | — | per-widget callback | `addCustom` | yes |
| Minecraft Mod Menu + Cloth/YACL | entrypoint + builder (code) | color, string, list, button | mod's own file | global | on Save | the mod supplies any Screen | vanilla-like |
| Stardew GMCM | C# API calls (code) | keybind list, image, paragraph, pages | mod's `config.json` | global | on Save; some title-screen-only | `AddComplexOption` | yes |
| Satisfactory SML | Blueprint schema asset | color, class, array, section | `Configs/<ModID>.cfg` [index] + save-scoped category | global + per-save | ConfigurationManager | custom widget per property | yes |
| Palworld Native Mod Options | Lua schema | keybind, warning, image | `NativeModOptions/<id>.ini` | global [unverified] | on Apply, event per key | soft dep, defaults | yes (game widgets) |
| Palworld Mod Options Framework | Lua schema + SDK | keybind, text | `config/<id>.ini`, atomic | global | `apply_mode` event / restart_mod / game_restart | soft dep | yes (game widgets) |
| Palworld DarnMenu [index] | data file | — | shared `*_user.lua` | — | live / relaunch marks | "Other Mods" list → config files | yes |

---

## 3. Anti-patterns and pain points the communities report

1. **Settings trapped in the savegame.**
   - SkyUI MCM values sit in per-save script state [inference, §1.1].
   - Players needed MCM Recorder to record MCM choices and replay them in a new game **[index]** https://www.nexusmods.com/skyrimspecialedition/mods/61719. Its successor MCM Memory adds "restore the active profile when starting a new game" **[index]** https://www.nexusmods.com/skyrimspecialedition/mods/189722.
   - The declarative successors moved values to INI/JSON outside the save: MCM Helper "persist for the game installation", BG3 MCM "leaving save files untouched" (§1.2, §1.4).
2. **Menus that do not appear, or appear late.**
   - Missing MCM menus are a standing FAQ. It is "not uncommon for SKYui to wait 2+ minutes before refreshing a menu", with the console fix `setStage SKI_ConfigManagerInstance 1` **[index]** https://nexusmods.com/skyrim/articles/50246.
   - Whole helper mods exist to force registration, for example MCM Kicker for "modders [who] forget to implement proper initialization" **[index]**. The search returned https://www.nexusmods.com/skyrim/mods/82002/ next to that quote; that this URL is MCM Kicker is **[unverified]**.
   - Root cause [inference]: registration is runtime code that has to run at the right moment.
   - Data-file registration avoids this, because a file is found regardless of load order (DarnMenu, `recon-clock-widget-and-mod-settings.md` §2). Native Mod Options also states "Load order in `mods.txt` doesn't matter."
3. **Long, unmanaged mod lists.**
   - Skyrim grew an add-on to hide/show "any installed MCM menu" (https://nexusmods.com/skyrimspecialedition/mods/29437 **[index]**). The search also mentioned a reordering add-on, but I could not tie it to a URL **[unverified]**.
   - Mod Menu ships search, filters, library badges, and parent grouping (§1.6).
4. **Touching the game's own menu is the crash surface.**
   - DarnMenu: the game "rebuilds its ESC menu constantly … removing or hiding widgets inside the game's own panels … is what causes the crashes" (§1.8).
   - Mod Options Framework forbids consumers from copying its Esc-menu injection (§1.8).
   - Isaac MCM Pure was forked to remove "hacks that override internal Lua functionality" (§1.9).
   - In Conan, Hosav warns that other UI-editing mods can crash its settings (§1.10).
5. **Fighting over the same screen space or button bar.**
   - In Conan, one HUD mod hid another mod's config button (§1.10).
   - Every Conan mod adds its own entry point: inventory button, radial menu, chat command, Esc list.
   - ue4ss-ModMenu gives every mod its own panel and hotkey and "recommends a unique key per mod" (§1.8). That is the opposite of one hub.
6. **Hub fragmentation.**
   - Cyberpunk has two hubs plus a bridge mod (§1.5).
   - Palworld has three hubs (§1.8). Oblivion Remastered has at least two (§1.8).
   - The Isaac MCM forks conflict when more than one copy is installed (§1.9).
   - **[inference]** A hub only wins if it is the one place, and if it reaches mods that never integrated.
7. **No path for mods that did not integrate.**
   - GMCM: "This only works for mods which were designed to support" it (§1.7).
   - SML: "it is up to the mod developer to communicate this information to you" (§1.8).
   - Only DarnMenu offers a read-only "Other Mods" list **[index]**.
8. **Display and value drift.**
   - SkyUI requires the mod to call setters, or display and state desync (§1.1).
   - Native Settings UI "does not sync external changes automatically" (§1.5).
   - Mod Settings does not persist code-side changes without `AcceptChanges()` (§1.5).
9. **Blocking or heavy work while the page is built.**
   - SkyUI: `Utility.Wait` inside a handler freezes the menu (§1.1), and pages rebuild on every open (`OnPageReset`).
   - ue4ss-ModMenu: "Heavy work on the click stack can hitch or crash" (§1.8).
   - Mod Options Framework bans polling loops to watch settings (§1.8).
10. **Fragile identity and hand edits.**
    - Native Mod Options: renaming the schema `id` "orphans the old file", and hand edits to its `.ini` are overwritten on the next Apply.
    - An early build saved inside the hot-reload-watched folder and lost the settings (§1.8).
    - BG3 MCM has to auto-migrate deprecated types (§1.4).
11. **Inconsistent styles.**
    - YACL markets itself as fitting "right in vanilla Minecraft" against libraries it calls cluttered or cosmetic (§1.6).
    - BG3 MCM is an IMGUI window, not the game's UI. The author lists IMGUI issues "beyond their control" **[index]** https://www.nexusmods.com/baldursgate3/mods/9162.
    - Native-look hubs (CP2077, Palworld Native Mod Options) make native style their headline feature.
12. **Keybind collisions.**
    - MCM Helper keymaps warn on conflicts (§1.2), and BG3 MCM detects exact combo clashes (§1.4).
    - Native Mod Options: UE4SS cannot unregister binds, so an offered key "becomes a permanent global bind" (§1.8).

---

## 4. Synthesis: the design rules the industry converged on

1. **Registration is data, read by the hub; code is optional.**
   - The second generation of every lineage moved from code to a schema file or declaration: MCM Helper/F4MCM `config.json`, BG3 `MCM_blueprint.json`, CP2077 annotations, SML schema asset, Palworld schema tables, DarnMenu data files.
   - Data needs no correct runtime moment, so it removes the missing-menu and load-order failures of §3.2.
   - Sources: §1.2, §1.4, §1.5, §1.8.
2. **The hub owns the list, the frame, and persistence; the mod owns its meaning.**
   - The mature hubs store values themselves: MCM Helper INI, BG3 JSON profiles, NMO/MOF ini, SML ConfigurationManager.
   - The older ones leave saving to each mod and inherit drift and loss: GMCM `save` callback, Cloth `setSavingRunnable`, Native Settings UI, Isaac Pure ("not responsible for saving").
   - One value file per mod, keyed by a stable id, written atomically (MOF temp + backup/replace).
   - Sources: §1.2, §1.4, §1.6, §1.7, §1.8, §1.9.
3. **Values live outside the savegame by default; per-save is an explicit opt-in.**
   - MCM Helper ModSetting vs GlobalValue, BG3 JSON vs `modvar`, SML config vs "Mod Savegame Settings".
   - Profiles and export answer "same settings on a new character" (BG3, and the MCM Recorder/Memory history).
   - Sources: §1.2, §1.4, §1.8, §3.1.
4. **A small, fixed widget set, drawn by the hub, matching the game.**
   - The shared core: toggle, int/float slider with min/max/step, enum/dropdown, keybind, text input, color, plus display-only header/section, paragraph/warning, and a button that runs an action.
   - Every hub listed has nearly this set. Style comes from the hub, not from each mod, which is why native-look hubs reuse the game's own option rows (CP2077 Mod Settings, Palworld NMO/MOF, SML-generated widgets).
   - Sources: §1.1, §1.2, §1.4, §1.5, §1.6, §1.8.
5. **Declare when a change takes effect, and say it in the UI.**
   - Apply modes are first-class: MOF `event` / `restart_mod` / `game_restart`; DarnMenu live/relaunch marks; SML and GMCM main-menu-only fields with a tooltip reason; CP2077 and NMO commit on the game's own Accept/Apply with a leave-unsaved prompt.
   - Change notification is an event or generation counter, never a poll.
   - Sources: §1.5, §1.7, §1.8.
6. **Always provide an escape hatch inside the hub for custom UI and for mods that did not integrate.**
   - Custom tabs or widgets: BG3 `InsertModMenuTab`, Native Settings UI `addCustom`, GMCM `AddComplexOption`, SML custom widgets, MCM Helper Text `action`, Mod Menu's own-Screen launch.
   - The clear industry gap is a reach-through for mods that never integrated. Only DarnMenu's "Other Mods" list tries **[index]**.
   - **[inference]** For us, "a row that opens the mod's own window" is the natural equivalent.
   - Sources: §1.2, §1.4–§1.8, §3.7.
7. **Only the hub touches the game's menus; mods never inject.**
   - The crash reports come from touching or rebuilding the game's own panels (DarnMenu, Isaac, Hosav).
   - Frameworks centralize the one injection point and forbid copies (MOF "Do not copy the framework's Esc-menu injection code", SkyUI FAQ "don't ship SKI_* scripts").
   - One button, one owner.
   - Sources: §1.1, §1.8, §1.9, §1.10, §3.4.
8. **Soft dependency: a mod must work without the hub.**
   - The SkyUI FAQ, NMO ("Nothing raises an error"), MOF ("must not block … normal gameplay"), and BG3 `"Optional": true` all require it.
   - Without the hub, the mod runs on its built-in defaults.
   - Sources: §1.1, §1.4, §1.8.
9. **Validate the schema and the values; heal, don't crash.**
   - BG3 reverts invalid values to defaults, drops removed keys, adds new ones, and leaves a broken file intact while serving defaults.
   - NMO rejects a bad schema with a log line instead of a broken tab.
   - Ids are stable, and renames are migrations.
   - Sources: §1.4, §1.8, §3.10.
10. **Navigation scales: mod list on the left, pages and tabs on the right, search, hide/sort, labels as translation keys.**
    - Mod Menu's list + details + search + badges, BG3 sidebar + tabs + sections, GMCM pages, SkyUI pages.
    - Community add-ons exist to hide and sort long lists.
    - Every hub resolves labels through a translation key with a fallback: MCM `$KEY`, BG3 `Handles` → plain text, MOF locale keys → English, GMCM `Func<string>`, CP2077 loc keys.
    - Deep links let other entry points open a specific page: GMCM `OpenModMenu(mod)`, Emberlight `/emberlight settings <feature>`.
    - Sources: §1.1, §1.2, §1.4, §1.6, §1.7, §1.10, §3.3.

**What this means for the Conan hub** [inference, for the next rungs, not decided here]:
- Our hub would be the only owner of the one "Mod settings" button. That is rule 7, and it directly answers the Conan button-bar fights in §3.5.
- It would read one schema per mod (rules 1 and 4) and draw rows with the game's own option widgets (rule 4).
- It would store values in one file per mod, outside the save (rules 2 and 3).
- For every mod that has its own window (Hosav, Damage Meter, Proximity Party, Simple Minimap, Lore & Loot, Exiles Fishing, the Xevyr panel), it would show at least a row that opens that window through `GUIModuleController:ActivateModule`. That row is the rule-6 fallback.
- No hub found in this sweep pairs native look with reach-through to mods that never integrated. That pairing is where we would differ.

---

## 5. Not verified / gaps

- I did not read the Nexus pages for F4MCM, DarnMenu, MadMCM, CosmicMCM, MCM Recorder/Memory, or BG3 MCM, or the Steam threads (Hosav, Emberlight, Smaller_Hud, Pippi) myself: the fetcher got 403/429. Their claims are **[index]**.
- I did not find a Starfield MCM.
- I did not find whether Hogwarts Legacy's official Mod Manager has per-mod settings.
- I did not find the file path for Cyberpunk Mod Settings values.
- Whether Native Mod Options values are global or per-world is not stated.
- The SkyUI per-save claim is an inference from "the panel stores very little state" plus Papyrus saving script state. It is not stated on the pages read.
- A 128-mod MCM menu limit appears in forum lore but is **not confirmed** by any source read (the search summary quotes one forum post with missing menus at "about ~150 .esps"; no URL tied).
- The canonical GMCM API file moved (404). The method list comes from a verbatim copy in another mod's repo.

---

## 6. Sources

**SkyUI / Skyrim / Fallout 4**
- https://github.com/schlangster/skyui/wiki/MCM-Quickstart
- https://github.com/schlangster/skyui/wiki/MCM-FAQ
- https://github.com/Exit-9B/MCM-Helper/wiki
- https://github.com/Exit-9B/MCM-Helper/wiki/Control-Types
- https://github.com/Exit-9B/MCM-Helper/wiki/Setting-Types,-Storage,-and-Persistence
- https://github.com/Exit-9B/MCM-Helper/wiki/Localization
- https://github.com/Exit-9B/MCM-Helper/wiki/Group-Conditions
- https://raw.githubusercontent.com/Exit-9B/MCM-Helper/main/docs/config.schema.json
- https://www.nexusmods.com/fallout4/mods/21497 [index]
- https://github.com/reg2k/f4mcm
- https://forums.nexusmods.com/topic/13493125-mcm-switch-globalvalue-callfunction-on-the-same-button-is-it-possible [index]
- https://nexusmods.com/skyrim/articles/50246 [index]
- https://www.nexusmods.com/skyrim/mods/82002/ [index]
- https://www.nexusmods.com/skyrimspecialedition/mods/61719 [index]
- https://www.nexusmods.com/skyrimspecialedition/mods/189722 [index]
- https://nexusmods.com/skyrimspecialedition/mods/29437 [index]

**Baldur's Gate 3**
- https://github.com/AtilioA/BG3-MCM
- https://raw.githubusercontent.com/AtilioA/BG3-MCM/main/README.md
- https://raw.githubusercontent.com/AtilioA/BG3-MCM/main/wiki.md
- https://wiki.bg3.community/Tutorials/Mod-Frameworks/mod-configuration-menu
- https://www.nexusmods.com/baldursgate3/mods/9162 [index]

**Cyberpunk 2077**
- https://github.com/jackhumbert/mod_settings
- https://wiki.redmodding.org/scripting-cyberpunk/mod-settings/introduction
- https://wiki.redmodding.org/scripting-cyberpunk/mod-settings/usage
- https://github.com/justarandomguyintheinternet/CP77_nativeSettings
- https://nexusmods.com/cyberpunk2077/mods/20779 [index]

**Minecraft**
- https://github.com/TerraformersMC/ModMenu
- https://shedaniel.gitbook.io/cloth-config/using-cloth-config/creating-a-config-option.md
- https://shedaniel.gitbook.io/cloth-config/using-cloth-config/saving-the-config.md
- https://docs.isxander.dev/yet-another-config-lib/overview.md
- https://docs.isxander.dev/yet-another-config-lib/gui-builder/getting-started.md
- https://docs.isxander.dev/yet-another-config-lib/gui-builder/controllers.md
- https://docs.isxander.dev/yet-another-config-lib/gui-builder/special-options.md
- https://docs.isxander.dev/yet-another-config-lib/config-api/basic-usage-of-config-api.md

**Stardew Valley**
- https://raw.githubusercontent.com/holy-the-sea/LightSwitch/main/IGenericModConfigMenuApi.cs
- https://www.curseforge.com/stardewvalley/mods/generic-mod-config-menu

**Unreal Engine games**
- https://docs.ficsit.app/satisfactory-modding/latest/Development/ModLoader/Configuration.html
- https://docs.ficsit.app/satisfactory-modding/latest/ForUsers/ConfiguringMods.html
- https://github.com/tlechien/Palworld-Undepresso-NativeModOptions/wiki
- https://github.com/tlechien/Palworld-Undepresso-NativeModOptions/wiki/Schema-Reference
- https://github.com/tlechien/Palworld-Undepresso-NativeModOptions/wiki/Troubleshooting
- https://github.com/Elvlin/Mod-Options-Framework/blob/main/DEVELOPER_API.md
- https://www.nexusmods.com/palworld/mods/4245 [index]
- https://www.nexusmods.com/palworld/mods/4408 [index]
- https://www.nexusmods.com/oblivionremastered/mods/4810 [index]
- https://www.nexusmods.com/oblivionremastered/mods/5497 [index]
- https://github.com/mattdavida/ue4ss-ModMenu
- https://blog.curseforge.com/official-in-game-mods-are-coming-to-hogwarts-legacy/

**The Binding of Isaac**
- https://github.com/Zamiell/isaac-mod-config-menu

**Conan Exiles**
- https://steamcommunity.com/sharedfiles/filedetails/changelog/1797359985 [index]
- https://steamcommunity.com/sharedfiles/filedetails/changelog/1369802940 [index]
- https://steamcommunity.com/workshop/filedetails/discussion/1185321962/2264691117425511144 [index]
- https://steamcommunity.com/app/440900/discussions/0/3198115500365626654 [index]
- https://testerle.net/fashionist-configuration/ [index]
- https://www.nexusmods.com/conanexilesenhanced/mods/32 [index]
- https://www.nexusmods.com/conanexiles/mods/155 [index]
- https://conanexiles.fandom.com/wiki/Modding [index]
- https://website.prod.nexus.low.ms/blog/top-conan-exiles-mods-dedicated-servers [index]

**Local**
- `D:\work\ai_sandbox\KUMM\researches\medieval-dynasty\recon-clock-widget-and-mod-settings.md` §2 (prior UE4SS hub recon, 2026-10-08)
