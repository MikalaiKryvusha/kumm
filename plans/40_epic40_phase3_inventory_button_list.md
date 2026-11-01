# Plan 40.3 — one «Настройки модов» button in the inventory bar and its list of four entries

> **Created:** 2026-11-01 · **Parent:** `plans/40_EPIC_conan_1.0.0_unfinished_six.md` phase 3 (criterion 3); plan 38 phase 1 (criteria 1, 2, 5); plan 39 B2; plan 36 W24
> **Status:** written 2026-11-01 by a helper agent; R2 done 15:43 (the route proven live); STEP 1 DONE 15:48 — section `krinik_mods_button.lua`, the button in the bar
> opens «Моды Krinik'а» (cases `testcases/TC_conan_mods_menu_button_2026-11-01.md` B1, B2 pass); NEXT: the list (R3, I1–I4) and Hosav / fishing buttons out (R4) in ONE step — `[OWNER]` 2026-11-01 15:49 «соответственно, она там одна должна остаться» ·
> «настройки рыбалки и настройки интерфейса оттуда уходят» · «красная справа вертикальная по модам ксавьера - тоже уходит» (the `XCS_Panel` side tab); B3–B4; starts after phase 2 (the hub must be honest before the door to it is built)
> **STEP 2 DONE 2026-11-01 17:19 +03:00** (report `testcases/reports/2026-11-01_conan-mods-menu-list.md`, cases B5–B13 pass, B14 skipped): the bar keeps only «Настройки модов»
> (Hosav collapsed, fishing not grafted, Xevyr's side tab collapsed in its window's `Construct`); the list «Моды Krinik'а · Моды Xevyr'а · Рыбалка · Прочее»
> (Lua-built from vanilla buttons, Noto Sans, the button's width); Xevyr and «Прочее» are INTERIM sub-lists that open the mods' own windows (5 + 5); Esc keeps
> the inventory in all 12 windows after a native module-row edit of 8 paks (Modal + CloseOnESC). NEXT (the owner's 13:40 decision): «Моды Xevyr'а» and «Прочее»
> as our hub windows with real rows — recon per mod (its window's options and where each value lives), then the kit pages; until then the sub-lists stay.
> Left out of the list (rule 23): ModControlPanel (empty window), Pickup+ (window drawn in pieces), Edit Appearance (not a settings window).
> **Outbound:** interview `interviews/interview_030_conan_xevyr_and_other_hubs.md` (step R5) — the shape of «Моды Xevyr'а» and «Прочее»
> **DECIDED 2026-11-01 13:40 — replaces interview 030:** `[OWNER]` «Окна «Моды Xevyr'а» - пооткрываешь его моды, посмотришь, какие он опции дает - вот они и должны быть не в его кривых косых окнах, а в нашем красивом» · «и «Прочее» - аналогично, но по "ручкам" настроек модов других авторов». So: both are hub windows in OUR look (as «Моды Krinik'а») with REAL rows — every option each mod's own window offers, bound to the mod's own settings (its SaveGame fields + its apply path); not rows that only open the mod's window. Recon per mod first: open its window, list its options, find where each value lives (mod notes in games/ConanExiles/mods/).

Basis, verbatim: `[OWNER]` 2026-10-31 19:09 «а попасть в конкретный хаб модов - в окне персонажа внизу кнопка Настройки модов - клик по ней открывает вертикальный
скролящсок-дроп-даун» · 19:10 «кликаешь по Моды Krinik'а - открывается его окно-хаб» · 19:14 «если у автора один мод - ему отдельную кнопку не делаем, а
объединяем их в Прочее» · 19:16 «рыбалка над прочим, прочее всегда внизу».

## Goal vector (Achieve)

Today the inventory bar carries Hosav's «Настройки интерфейса» button and the fishing button, «Моды Krinik'а» opens only by the agent's remote, and «Моды
Xevyr'а» / «Прочее» do not exist. Where we want to be: ONE button «Настройки модов» in the inventory's bottom bar in the vanilla button look; a click opens a
vertical list «Моды Krinik'а» · «Моды Xevyr'а» · «Рыбалка» · «Прочее» (that order, «Прочее» always last; scrolls when longer than the space); each entry
opens its window; Hosav's and fishing buttons are gone from the bar; Esc closes only the top window; nothing of it runs while the inventory is closed.

## Acceptance criteria (scenario form)

1. **One button.**
   - Situation. The inventory is open on the «Инвентарь» tab.
   - Action. The player looks at the bottom bar.
   - Result. One «Настройки модов» button in the vanilla look; no «Настройки интерфейса» (Hosav) and no fishing button.
   - Check. Frame of the bar at 1080p; the remote: `FindAllOf('W_UI_SettingsButton_C')` visible count 0, `FindAllOf('W_EFT_AdminButton_C')` visible count 0,
     our button `GetVisibility()` = 0 inside `ButtonContainerLeft|Right`.
2. **The list.**
   - Situation. The inventory is open.
   - Action. The player clicks «Настройки модов» (real mouse).
   - Result. A vertical list with the four entries in the order above.
   - Check. Frame; the remote reads the four entry texts in order.
3. **Each entry opens its window** (four scenarios: Krinik, Xevyr, Рыбалка, Прочее).
   - Situation. The list is open.
   - Action. The player clicks the entry.
   - Result. That window opens over the inventory; the list closes.
   - Check. `GUIModuleController:IsModuleActive(FName('<module>'))` true for `KrinikModSettings` / the Xevyr hub module / `ExilesFishingTuning` / the
     «Прочее» hub module; a frame.
4. **Esc closes only the top window.** Situation: an entry's window open over the inventory. Action: Esc (real key). Result: the window closes, the inventory stays.
   Check: `IsModuleActive(<window>)` false, `IsModuleActive('CharacterInventory')` true.
5. **One window at a time.** Situation: «Рыбалка» open. Action: the list → «Моды Krinik'а». Result: only Krinik's window open. Check: the remote counts open
   mod windows over `MOD_WINDOWS` of the pause section = 1.
6. **No cost while closed.** Check: the new section's minute summary `n=0` with the inventory closed; the LMB bind's early return < 0.02 ms per call (1000 calls
   by the remote, `os.clock`).
7. **Every entry of «Моды Xevyr'а» / «Прочее» works** (after the interview): each row opens or drives its mod. Check: per mod, `IsModuleActive(<its module>)`
   after the row's click; frame.

## The stand (HOUSE_RULES rule 11)

| Part | Value | Set up by |
|---|---|---|
| Save | the live save | `save-restore.sh` from the 10-31 16:56 copy if entry breaks |
| Place | a safe spot, no enemies within 60 m (the world slows to 0.03 in the inventory, but a hit still breaks the run) | teleport + `tp_ground.sh` |
| Hero | god on; food and water 100 read back | `god-on.sh`; `GetHungerSystem()` write |
| UI | inventory opened by the remote `ActivateModule(FName('CharacterInventory'), true, false)`; the hub pause armed (game map: the pause arms after it sees the hero in the world) | remote |
| Admin | `exec MakeMeAdmin` ONLY in a case that checks the fishing button hides (the game inserts `W_EFT_AdminButton` only when `bAdminLocal`) | remote |
| Input | real mouse and Esc (`wait-input-idle.ps1 -Min 10` → `mouse-seq.ps1`) | — |

## Steps

### Recon

- [x] R1. Read `games/ConanExiles/mods/UIMod_Hosav.md`, `JaarFishing.md` (the fishing mod's notes — confirm it is Exiles Fishing: `grep -n "EFT\|Exiles" games/ConanExiles/mods/JaarFishing.md`),
      `ModControlPanel.md`, `Simple_Minimap.md`, `DamageNumber.md`; the game map block «Hub bottom row: Hosav and fishing buttons» (≈ line 513).
- [x] R2. **Our button's route.** DONE 2026-11-01 15:4x (probe below the step). Facts: a moved Hosav button stops clicking; a `WidgetBlueprintLibrary:Create` copy never fires its handler; FLX buttons have no
      Lua-hookable click; the hub's own buttons work by `RegisterKeyBind(LEFT_MOUSE_BUTTON)` + `IsHovered()` (feedback plate, hub). Candidate `[AI]`: a kit
      widget `W_KrinikModsButton` (a `WBP_ButtonBase` in the vanilla look, label «Настройки модов») added by Lua into `ButtonContainerLeft` at the inventory's
      `ActivateModule` post-hook, click by the LMB bind + `IsHovered`. Probe live first by the remote: `Create` a vanilla `WBP_ButtonBase_C`, `AddChild` into
      the bar, read `IsHovered()` under the real cursor — record yes/no.
      **Result 2026-11-01 15:43 (live, game in front, inventory by a real Tab):** `WidgetBlueprintLibrary:Create(pc, WBP_ButtonBase_C, pc)` + 
      `CraftingGUI_C.ButtonBar.ButtonContainerLeft:AddChild` → an empty vanilla button right of «Настройка рыбалки» (the fishing button lives in the LEFT
      container in our build); the real cursor on it → `IsHovered()` true, away → false. YES — the route «Create + AddChild + LMB bind + IsHovered» holds.
      The inventory opens only after the world settles: a Tab pressed right after world entry did nothing (no `CraftingGUI_C` instance).
- [x] R3. **The list widget.** DONE 2026-11-01 — a Lua-built VerticalBox of vanilla buttons in the bar Overlay (no kit asset).** Kit `W_KrinikModsMenu` (a `ScrollBox` of four flat buttons in the hub's look — the hub's `Brd_KrinikBtn_*` style) placed above the
      button, or a module row `KrinikModsMenu` in `DT_KrinikUIModule` (`Category Modal`). Decide by one probe: does a second row in our module table merge and
      open (`MergeDataTables` already proven for one row).
- [x] R4. **Hiding the two buttons natively** — DONE 2026-11-01: fishing natively (Graft not called), Hosav and the Xevyr tab by Lua once per event (assets shared or re-shown — notes KrinikConanUI.md) (rule 8): Hosav's button — its visibility is ours today (`krinik_pause_in_menu`, `XCS_Panel`); fishing's — the
      game inserts it in `ButtonContainerRight` only for admins. Route by notes: a pak edit of each mod's insertion (KRINIK MODIFIED, `patch-mod-asset.py`
      `bool:` row) or, if the asset will not yield, a Lua `SetVisibility(1)` once at the inventory's `ActivateModule` (event, no poll) with an A-B note.
- [ ] R5. **Interview** `interviews/interview_030_conan_xevyr_and_other_hubs.md` (Russian, the owner answers inside): the epic's default `[AI]` — «Моды Xevyr'а» and
      «Прочее» are the same hub window (mockup 5 look) whose rows are «Открыть окно мода» buttons, one per mod; alternatives — map the mods' own settings fields
      (plan 38 phase 3, heavy). Work continues with the default while he has not answered (memory: questions pile up in interviews, work goes on).
- [x] R6. **The live module list** — DONE 2026-11-01 (live `ForEachRow` scan; 12 windows usable, 3 left out — plan header) for those two hubs (author-hub-inventory «Open» §1): `pult.sh "lua …"` over `DT_UIModuleTable` row names matching
      `Settings|Config|Tuning|Panel|Options` → the mod of each widget path; resolve «Horti», PvE Plus Ambush's module, Emberlight's and Pickup+'s; update
      `researches/conan-mod-settings-hub/author-hub-inventory.md`.

### Implementation

- [ ] I1. Kit (`_config/devkit/kit-krinik-modsettings.py` or a new block in it): `W_KrinikModsButton`, `W_KrinikModsMenu`, a second hub mode — either a new
      Widget Blueprint per hub or `W_KrinikModSettings` reused with a `mode` the section fills (decide in R3/R5); new assets listed in `Local/CookInfo.ini`
      (`FilesToCook=`, copy in `_unpacked/KrinikConanUI/kit/CookInfo.ini`); run TWICE; `kit-buildmod.py KrinikConanUI <out>`; `mod-overrides.py` lists them.
- [x] I2. Section `ConanExiles/_unpacked/KrinikConanUI/ue4ss/Scripts/krinik_mods_menu.lua`: post-hook `GUIModuleController:ActivateModule` (inventory) → add the
      button once per bar instance, hide Hosav / fishing (R4 route); LMB bind returns on one boolean unless the inventory is open; clicks → open the list /
      `ActivateModule(<entry module>)` and close the list; minute summary with its own error counter.
- [x] I3. INTERIM DONE 2026-11-01 (step 2): «Моды Xevyr'а» / «Прочее» are sub-lists (`TOP`, `SUB` in `krinik_mods_button.lua`) opening the mods' own windows.
- [ ] I6. **STEP 3 — our hub windows with real rows** (the owner's 13:40 decision). `[AI]` design draft, to check against the recon
      `researches/conan-mod-settings-hub/xevyr-settings-recon.md` before code: ONE window class `W_KrinikModSettings` and ONE module, a `hub` value set by the
      list before `ActivateModule` («krinik» · «xevyr» · «other»); `PAGES` gains a `hub` field per page, the left list and the title («Моды Xevyr'а · Настройки»)
      show only that hub's pages; a page of another author's mod binds each row to the mod's own value: read at fill from its SaveGame object (or the
      window's variables), write at «Сохранить» through the mod's own save/apply function — never our store; a row whose value lives only server-side or
      cannot be applied without the author's window is listed as «нет механики» on the mockup (rule 23) and left out. Kit: the new pages and rows by
      `kit-krinik-modsettings.py` (ids only), run twice. The sub-lists of step 2 go when every mod of the hub has its page. Mockup to the owner first (taste).
- [x] I4. The pause section's Esc map `MOD_WINDOWS` (`krinik_pause_in_menu.lua`) gains the new module rows; «one window at a time» — opening an entry calls
      `TryCloseWindow()` on any open mod window first.
- [x] I5. Hygiene: `loadfile`, `check-lua-game-thread.py` 0, `check-lua-templates.py` 0.

### Test in the live game

- [x] T1. Cases B1–B12 (criteria 1–7, each entry, Esc, one-window, cost, each «Прочее» / Xevyr row) into `testcases/TC_conan_mods_menu_button_<YYYY-MM-DD>.md`
      first, stand block included.
- [x] T2. Lock (`--what "epic40 p3 mods menu" --minutes 90`), deploy (P2), launch by the owner's last path, world entry; cases by the real mouse; frames at 1080p
      and 4K; a clip of button → list → each entry → Esc (rule 4), watched before the verdict.
- [x] T3. `close-game.ps1`, lock released; run report `testcases/reports/<YYYY-MM-DD>_conan-mods-menu-button.md`; a review folder
      `НА ОТСМОТР НИКОЛАЕМ/<N> кнопка настройки модов/` for the owner's eye (taste).

### Packaging into the build

- [x] P1. Sources: `_unpacked/KrinikConanUI/ue4ss/Scripts/krinik_mods_menu.lua`, `main.lua`, `krinik_pause_in_menu.lua`, the rebuilt `KrinikConanUI.pak`, the kit
      script, `kit/CookInfo.ini`; for a pak-edit route of Hosav / fishing — the edit script next to the mod's pak and the entry marked **KRINIK MODIFIED**.
- [x] P2. `modpack.json`: `KrinikConanUI` `verify` += `krinik_mods_menu.lua`; the Hosav / fishing entries' `$comment` and KRINIK MODIFIED mark if edited.
      `Deploy-ModPack.ps1 -PackDir D:/work/ai_sandbox/ConanExiles -Deploy -Only KrinikConanUI` (and `-Only <Hosav entry>`, `-Only <fishing entry>` if edited),
      then `-Verify` → exit 0.
- [ ] P3. Same commit (rule 20): `KrinikConanUI.md` (assets, section), `UIMod_Hosav.md`, `JaarFishing.md`, the game map's hub-bar block, plan 38 phase 1 row,
      plan 36 W24, plan 39 B2, the guide's «Настройки модов» section. Pack commit + push; KUMM commit + push.

## Risks

- (a) Our button in the bar does not report `IsHovered` → the button lives in its own viewport layer aligned to the bar (Hosav's way), click by the LMB bind.
- (a) Two modal windows at once (W20 class) — criterion 5 guards it.
- (b) The interview answer turns «Прочее» into mapped settings (heavy) — the phase ships the «Открыть окно мода» form and the mapping moves to plan 38 phase 3.
- (b) Mods whose windows do not open by code (AMR, Emberlight, Pickup+, Horti — plan 39 C) — those rows stay out of the list until their window opens, and the
  report names each one left out (rule 23).
- (c) The kit GUID trap on new widgets — run twice, never delete a widget.
