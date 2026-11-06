# Plan 48 — Conan hub: the old page stays until the new one is complete, then one frame

> **Created:** 2026-11-06 · on the owner's word (bug 64 items 15/17, his decision of 2026-11-06 22:10 — verbatim in the bug)
> **Parent:** `bugs/64_conan_mod_ui_wave_overlaps_untranslated.md`; measured basis — `testcases/reports/2026-11-06_conan-hub-instant-switch.md`
> **Status:** 🔲 recon (step 1) · **Outbound:** —

## Goal vector (Achieve)

The owner: «клик выполнен, видуального переключения не происходит, пока новая страница полностью не соберётся. Как только она полностью собралась - она дергает
колбек, или сигнал посылает - выполняется рендер - предыдущая страница закрыватся, новая мгновенно одним кадром открывается. Да, будет задержка в переключении
табов, но будет КРАСИВО!» Today every page assembles over 2–6 frames after the click (vanilla — proven with no mod paks).

## Acceptance criteria

- Situation. The hub open on any of the 9 tabs. Action. A real mouse click on another tab. Result. Every recorded frame between the click and the switch
  shows the OLD page unchanged; one frame later the NEW page is complete; nothing on it changes afterwards (4.5 s window). Check. `hub_switches.py` on a
  144 fps recording of the TC sequence: per switch exactly 1 changed frame, blend frames 0, late changes 0 above noise (except the hovered tab label).
- The delay click → switch is measured and reported (the owner accepts a delay; the number goes into the report).
- CPU: the work runs only between a click and its switch (opening windows — «лаг допустим», MASTER_PLAN); no cost while the hub stays on one page.

## Constraints known

- UE4SS hooks cannot cancel a native call: `CarouselWindow:Next/Prev/SetCarouselIndex` switch the module natively; the old window is removed and the new one
  created in the same native call (game map «Hub tab switching»).
- No native «page complete» event exists (tab windows have no animations, no fade fields — `kit-probe-hub-windows.json`); the signal must be built from what
  the engine tells: widget births inside the new window, its desired size, the item grids' counts.
- Never call a hub widget's ubergraph resume points from outside (EXP-0371 crash).

## Progress 2026-11-06 22:39 +03:00 (prototype `ConanExiles/_config/hub-hold-proto.lua`, a remote dofile — NOT in the build)

- Recon (`_config/hub-switch-probe.lua`, 22:13): the native switch REMOVES the old tab window from the viewport and later COLLAPSES it (vis 1) — the object
  stays valid; the new window is born in the same call; ≈ 100–300 UserWidgets are born over 50–500 ms, then none.
- **A mouse click goes `CarouselWindow:ButtonPressed` → native `SetCarouselIndex`: no UE4SS hook on Next/Prev/SetCarouselIndex fires.** `OnChildActivated`
  fires for every switch (click or remote) after the new window exists — the hook point.
- Signal «complete»: two samples in a row (`ExecuteInGameThreadWithDelay(1)`) with no UserWidget born — waits 26–555 ms (log `[hubhold]`).
- **Works (run 7, 22:35):** the new page held at `RenderOpacity` 0 until quiet → the late assembly GONE on Таланты, Хар-ки, Параметры, Клан, Спутники, Карта,
  Базар (late changes 0 or < 1k px).
- **Does not work yet (3 tries — v2, v3, v4 — the 3-attempts rule, stop):** to and from «Снаряжение» the bare world shows 50–160 ms: the old window re-added by
  `AddToViewport(40)` + `SetVisibility(4)` is not seen, and setting `MaskOffset` on `Background:GetDynamicMaterial()` does not hold the backing. NEXT — read,
  not guess: after the re-add, the old window's visibility / parent / in-viewport / render opacity by the remote; which material instance the carousel's
  animation track drives (the track may create its own MID — then set the parameter on THAT one, or play the instant animation forward/reverse ourselves).
- **The cause, not the symptom (`[OWNER]` 2026-11-06 23:05 +03:00 «а может нам подход изменить? Править именно то КАК игра собирает сраницы хаба. Не симптомы лечить, а
  причины»):** the game DESTROYS a tab window when it is left and builds it again (100–300 widgets) on every visit — one instance at a time (remote count
  22:59). Experiment 22:59 (run 8): `IsPersistent = true` on the 9 hub rows of `DT_UIModuleTable` by a live `dt:ForEachRow` edit at the MAIN MENU — no effect
  (windows still destroyed, numbers as run 2): the flag is taken earlier, at the module registration. NEXT: the flag in the table from the start —
  a native edit of the vanilla `DT_UIModuleTable` (the 9 rows `IsPersistent`, maybe `PreloadOnStartup`) by the mod-reconciliation guide (every mod merges rows
  into this table — kind 6 risk), then the same run; if the pages stop rebuilding, the prototype is not needed.
- **The owner's design 2026-11-06 23:07 +03:00 (verbatim):** «от 100 до 300 виджетов. Пульт это подтвердил: каждое окно живёт в одном экземпляре, окна покинутой вкладки нет
  вовсе. - ну это тупо и не правильно. Предлагаю сделать ленивую сборку - когда хаб открываешь на какой-то сранице - в фоне лениво собираются все остальные
  страницы в направлении от текущей вправо и влево.» → the hub opens on its page as now; the other 8 pages are built in the background ONE at a time, nearest
  first, alternating right and left; built pages are KEPT hidden; a switch hides one ready page and shows another in one frame. `[AI]` assumption to confirm:
  the pages live while the hub is open and are released at its close.
- **IsPersistent from the start 2026-11-06 23:15 +03:00 (the owner 23:08 «этот флаг постоянное окно давай попробуем включить»):** a dev UE4SS mod set the flag on the 9 rows
  at `NotifyOnNewObject(GUIModuleController)` (log: «GUIModuleController born … IsPersistent set on 9 rows», 23:09:24) — the left tabs' windows now SURVIVE
  (CraftingGUI_C 1 / W_FeatWindow_C 1 alive off-screen, 0 before). BUT run 9 (click pass) has the SAME late assembly (Хар-ки +21/+35/+49 ms, Таланты
  +28/+56): a page REBUILDS ITS CONTENT on every show even when its window is kept. The real cause is the pages' refresh on activation (lists, cells, perks
  rebuilt). NEXT: which function each page runs on activation and what it re-creates (births per show with the window kept); then the owner's lazy build =
  run that refresh for the hidden pages ahead of time, and show without a second refresh. The test mod is saved in `ConanExiles/_config/hubswitch/
  KrinikHubPersistTest/` (removed from the game).
- **What a kept page re-creates on every show (2026-11-06 23:35 +03:00, background game, windows kept by the dev mod, `hubswitch/page-births-probe.lua`, UserWidget births
  600 ms after `OnChildActivated`; the same numbers on the 1st and the 2nd visit):** Таланты 141 (InventoryGridSlotView 71, InventoryIconView 51, buttons 10,
  InventoryGridView 3); Снаряжение 288 (grid slots 80, icons 68, hotkey icons 42, buttons 16, action tutorials 12, help entries 12, item stats 8, hotbar 8);
  Карта 66 (hotkey icons, help entries, tutorials 16 each, map markers 13); Базар 24; Хар-ки 16 (attributes 6, perk views 2 …); Клан 12; Путешествие 8;
  Спутники 9; Параметры 0. `WBP_ButtonBar_C` (the hub's bottom bar) is born on EVERY switch. The windows themselves are not reborn. NEXT (no game needed):
  read the open handler of the heavy pages (`W_FeatWindow`, `CraftingGUI`, `W_FullscreenMap`, `W_Attributes`) — what event rebuilds the grid/list
  (`SignalOpened` / `SendWindowOpenedNotifications` of `WindowRoot`, or the page's own Construct-like event) — by `kismet-trace.py` on the extracted assets.
- **Who rebuilds (2026-11-06 23:40 +03:00, `hubswitch/page-calls-probe.lua`, every UFunction of `CraftingGUI_C` hooked, windows kept):** leaving «Снаряжение» runs its
  `Destruct` (the kept window is still REMOVED from the viewport); returning runs `BP_HandleCenterPanelWidgetCreated`, `BP_HandleRightPanelWidgetCreated`,
  `HandleShortcutBarActivated`, `UpdateTutorialUnderlayVisibility` — the NATIVE window code creates the centre and right panels anew on every show and only
  notifies the blueprint. So the rebuild is the engine's C++ reaction to remove-from-viewport → add-to-viewport (Destruct → Construct), not a blueprint
  we could patch. (The probe found no class at `/Game/UI/Inventory/W_FeatWindow.W_FeatWindow_C` / `…/W_Attributes_C` — their real paths to read.)
  Consequence for the owner's lazy build: a built page must NEVER leave the viewport — hidden pages stay added and are only collapsed / made transparent;
  the native switch removes them, so the switch path itself must change (the next fork: intercept the carousel's activation so our Lua shows/hides kept
  pages instead of the module controller removing/adding them — recon of `GUIModuleController` deactivation and whether `IsPersistent` windows can be
  kept in the viewport collapsed).
- **The decisive test (2026-11-06 23:45 +03:00, background game, kept windows; `hubswitch/readd-test.lua`, `collapse-test.lua`):** the panel re-creation
  (`BP_Handle*PanelWidgetCreated`) is triggered by the MODULE ACTIVATION, not by a plain `AddToViewport` (0 calls); a re-added page still fills its
  grids on Construct (67–93 births) and on its first show (25). **A page that STAYS in the viewport and is only Collapsed (1) / shown (4): 0 births on every
  later show (3 cycles)** — it appears complete at once. So the owner's lazy build works as: each page built once (added, shown at RenderOpacity 0 until no
  births, then collapsed), kept IN the viewport; a tab switch = collapse one, show the other. The open fork: taking the switch from the module controller —
  the native `ButtonPressed` → `SetCarouselIndex` (and Q/E) still deactivates/activates modules (remove/add + panel rebuild); and other mods listen to the
  module events (`XCS_Panel`, EAA / EoT / Accessory injections on `CharacterInventory`). Recon next: what the native switch does to a page that is already
  in the viewport and visible; whether the module events can be kept while our layer shows the kept pages.
- **Native switch onto kept pages (23:48–23:50, `hubswitch/native-on-kept.lua`, background):** every kept page held in the viewport (re-added collapsed after
  each switch) — the NATIVE activation still rebuilds the heavy pages: lap 2 Таланты 118 births (141 without), Снаряжение 289 (288), Карта 66; light pages 0
  (Хар-ки, Параметры, Путешествие). So instant heavy pages need OUR controller to do the switch (collapse/show), not the module controller — the owner's
  decision below is confirmed by numbers.
- **The owner's decision 2026-11-06 23:48 +03:00 (verbatim): «из-за этих ебучих "сигналов" UI модов открывается с задержками» · «наконец-то сможем это починить, сделав свой
  контроллер хаба АДЕКВАТНЫЙ» · «и к нему попривязывав UI модов других авторов»** → the plan's direction: OUR hub controller (KrinikConanUI) owns the pages —
  built lazily once, kept in the viewport, switched by collapse/show in one frame; the other authors' hub UI (Era of Trials icons, EAA emblem and buttons, the
  Accessory System button, Xevyr's side tab, fishing) is bound to OUR controller's events (page built / page shown), not to the game's module signals and
  their delays. `[OWNER]` 2026-11-06 23:48 +03:00 (verbatim): «а встройки модов привязываю к нему напрямую. через интерфесы» · «но чтобы это работало быстро» → the binding
  contract is an INTERFACE: one adapter per mod with the same calls (page built → embed its widgets; page shown; page hidden), called by our controller
  directly in the same frame — no polling, no delays, no game signals; the cost of each call measured (MASTER_PLAN 1 ms rule; opening windows may lag).
  `[OWNER]` 2026-11-06 23:48 +03:00 «контроллер определяет стандартный понятный API» → the controller DEFINES the API (one documented table of calls and their arguments);
  every mod adapter implements it — the API is written first, in the mod notes, before any adapter. `[OWNER]` 2026-11-06 23:49 +03:00 «на него переделываем UI модов» → the
  other authors' hub UI is REWORKED onto the API (their delay/poll paths removed natively, as the EAA / EoT / fishing delays were — HOUSE_RULES rule 8,
  KRINIK MODIFIED), not wrapped from outside.
- **The pages' lifetime — decided by measurement (`[OWNER]` 2026-11-06 23:18 +03:00 verbatim):** «можно было бы до выхода из мира держать. Вряд ли они будут много ОЗУ
  занимать. А вообще, нужно измерять. Может есть смысл их убирать при закрытии хаба, и пересоздавать вновь лениво на следующем открытии» → acceptance step:
  the game's working set (private bytes) with the hub closed — before the first open, with all 9 pages kept, after 5 open/close cycles (no growth = no
  leak); the two policies compared: keep until the world is left vs release at the hub close and rebuild lazily at the next open (the first-switch delay
  measured for each). The number decides; the default until measured — keep until the world is left (his first choice).
- Review folder 70 (`70_hub_dergaetsya_x15`): the four «Снаряжение» switches of run 7 slowed ×15 (`[OWNER]` 22:56 «покажи, что дергается, замедли в 15 раз»).
- Measure tool: `scratchpad/hub_run.sh <tag>` + `hub_switches.py` (to move into the pack `_config/` with the build).

## Steps

1. [ ] **Recon (remote, read-only):** at a switch, in order with timestamps — the old window's fate (removed from the viewport? destroyed? still valid one
   frame later?), the new window's birth, the births of widgets inside it until quiet, its `GetDesiredSize` per frame. Cases in a TC file; frames at 144 fps.
2. [ ] **FORK — how the old page stays:** (a) keep the old window object alive and in the viewport until the new one is ready (re-add / hold a ref, Z-order);
   (b) a frozen copy of the screen under the hub (render target of the viewport); (c) another engine way found by recon. `FORK:` line with the recon doc.
3. [ ] **The «complete» signal:** from step 1's numbers — e.g. no widget born in the new window for N frames and its desired size unchanged; the new window at
   `RenderOpacity` 0 (laid out and ticking, not drawn) until then.
4. [ ] **Build** in `KrinikConanUI` (a section next to `krinik_pause_in_menu`, which already hooks the carousel), log lines per switch (delay, frames waited).
5. [ ] **Test** by the acceptance on all 9 tabs, both directions, random order, real clicks; control — the section off; crash watch.
