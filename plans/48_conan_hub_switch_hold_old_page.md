# Plan 48 — Conan hub: the old page stays until the new one is complete, then one frame

> **Created:** 2026-11-06 · on the owner's word (bug 64 items 15/17, his decision of 2026-11-06 22:10 — verbatim in the bug)
> **Parent:** `bugs/64_conan_mod_ui_wave_overlaps_untranslated.md`; measured basis — `testcases/reports/2026-11-06_conan-hub-instant-switch.md`
> **Status:** 🟡 in the build since 2026-11-07 07:35 +03:00 — KrinikConanUI section `krinik_hub_controller` (pack `374b90d`); proven by the remote's switches in a
> background game; the player's path (real clicks, Esc/Tab, a 144 fps recording) waits for the game in front · **Outbound:** —

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

## The controller's core proven: OUR code builds the pages (2026-11-06 23:57 +03:00, background, `hubswitch/create-page-test.lua`)

`WidgetBlueprintLibrary:Create(pc, <page class>, pc)` + `AddToViewport(41)` at RenderOpacity 0, WITHOUT the module controller: `W_FeatWindow_C` — 183 births
at create + 382 in 1 s, the page COMPLETE on the frame (grid, icons, category row, bottom bar); `CraftingGUI_C` — 114 + 322, COMPLETE (inventory, paperdoll,
craft panel, hotbar, bottom bar) — only the mods' embeds missing (they come by the game's signals → the API). **Design that needs no input takeover
(«shadow pages»):** the game still opens the hub and switches tabs natively (carousel, backing, mouse mode — all its own); our controller keeps its own built
instance of every page, collapsed; on `OnChildActivated` (inside the native call, before the frame renders) it collapses the game's fresh page and shows
ours. The game's rebuild still runs, but invisibly. Next: this prototype in the background game — births and frames per switch.

## Shadow-pages prototype — crashes and the bisect (2026-11-07 00:00–00:16, background; the rule HOUSE_RULES 29 born here)

- v1 (00:00) and v2 (00:08) crashed the game on the first native switch; bisect 00:10 in one game: 9 extra pages collapsed — OK; page-class notify — OK (but it
  never fires for page windows); UserWidget counter + empty `OnChildActivated` hook — OK; our extra `CraftingGUI` visible — OK; **`SetVisibility` inside the
  `OnChildActivated` hook — CRASH** (game map, crash rule; EXP-0474).
- v3 (00:16: visibility moved to the next tick; inside the hook only `SetRenderOpacity` on the game's newborn page, the previous and our page; hidden pages
  kept at opacity 0 + HitTestInvisible, not collapsed) — CRASH on the first switch. Three prototype attempts → stop, bisect next (one ingredient per step,
  alive-check after each): (a) 9 extra pages NOT collapsed (opacity 0, HitTestInvisible) + native switch; (b) `SetRenderOpacity` on the game's newborn page
  inside the hook (worked without extra pages in the hold prototype v3/v4 22:2x); (c) opacity on our page inside the hook. Helpers: `hubswitch/extra-pages-switch.lua`
  (`_G.__ep`), `pult.sh` exit 4.
- **Bisect 2 (00:18–00:21, one background game; hooks installed AFTER several native switches): every ingredient survives, alone and all together** —
  (a) 9 extra pages at opacity 0 + HitTestInvisible; (b) opacity 0 on the game's newborn page inside the hook; (c) opacity on our page inside the hook;
  (d) next-tick `SetVisibility` on our page; (e) next-tick `SetVisibility` on the game's newborn page — 12+ switches alive with (b)–(e) active at once.
  **v3 re-run in a CLEAN game (00:22) crashes again on switch 1 — reproducible.** The remaining difference: in v3 the FIRST native opening of a page (e.g.
  FeatWindow never opened by the game before) happens with the hooks and our instance of that class already present; in bisect 2 every page had been opened
  natively before the hooks. NEXT (one step each, alive-check after each): clean game → our 9 pages → hooks (b)–(e) → the first native switch; then the
  same with each page visited natively once BEFORE our pages are created (if that survives, the controller builds its pages after the game has opened each
  class once — or preloads the classes).
- **Bisect 3 (00:25, clean background game): our 9 pages + hooks (b)–(e) installed BEFORE the game ever opened those pages — the first native switches
  SURVIVE (3 of 3).** So no single operation and no combination of them crashes; what crashes is the v3 SCRIPT itself. Its remaining differences: the pages
  built one per 400 ms by a chain of `ExecuteInGameThreadWithDelay` with a `building` flag around `Create`, and `print` from delayed callbacks. NEXT: build the
  controller from the bisect-3 code (pages created at once, as `extra-pages-switch.lua`; the hook body of bisect 3), then add the lazy chain back alone.
- **v4 (00:28, `hubswitch/shadow-pages-v4.lua` = bisect-3 code for all 9 pages): switch 1 (to FeatWindow, our FeatWindow shown) survives; switch 2
  (to Attributes: our FeatWindow hidden, our W_Attributes shown) CRASHES.** In the bisects «ours» was always FeatWindow. NEXT bisect: (f) show our W_Attributes
  alone (no switch); (g) hide our FeatWindow, show our W_Attributes by opacity + next-tick visibility WITHOUT a native switch; (h) then with the switch.

## Bisect (f) and the crash cause found; v5 crash-proof (2026-11-07 06:26–06:46 +03:00, background, TC `testcases/TC_conan_hub_shadow_pages_bisect_2026-11-07.md`)

- **F1 (06:28:44):** our W_Attributes shown alone — alive, the page on the frame with the hero's data (every attribute 0 and 77 points unspent — the save's real
  values: the game's own page shows the same, frame 06:5x; the first reading «not bound» was wrong, corrected the same hour). **The crash (06:29:10) came on the NEXT command** — `SetRenderOpacity` over all of `_G.__ep` — no «исполнено» line for it;
  `EXCEPTION_ACCESS_VIOLATION` inside UE4SS (two nested Lua frames, a read of `0x400abf6ee53`): one of our pages had been DESTROYED and Lua still held its raw
  pointer. `hubswitch/page-census.lua` (live instances per class via `FindAllOf`, never through our refs): untouched, all 9 survive 90 s; after F1 our
  `W_CharacterStatsWindow` was gone (06:35:16). In a clean game stats + attributes alone survive the first show of attributes — the destroyer is not that.
- **The trace (06:46, `NotifyOnNewObject(UserWidget)` names + a mark per `OnChildActivated`):** each NATIVE activation of «Параметры» creates
  `W_CharacterStatsWindow_C` twice and our stats instance is destroyed every time (v5 counter `lost` +1 per visit) — the game keeps one stats window
  and kills the others. `OnChildActivated` fires TWICE per switch. The remote's `NextCarouselWindow` in the background game cycles only 4 tabs
  (Снаряжение → Таланты → Хар-ки → Параметры → Снаряжение) — the other 5 need `SetCarouselIndex` or real clicks.
- **v5 (`hubswitch/shadow-pages-v5.lua`): 27 native switches, 0 crashes, 0 Lua errors** (v4 crashed on the 2nd). Rules: a page is kept by its NAME and
  found alive by `FindAllOf` before every touch; a lost page is rebuilt on the next tick; inside the native switch only the game's newborn gets opacity 0;
  our previous page stays on screen through that frame. Frames: «Таланты» ours complete WITH the hero's data (level 76, 752 points); «Хар-ки» ours complete too; «Снаряжение» ours
  shows only the hotbar — no inventory, no paperdoll (the centre/right panels come from `BP_Handle*PanelWidgetCreated`, called by the MODULE ACTIVATION).
- **What the shadow design still needs:** our instances must be INITIALISED like the game's — recon of what the native activation calls on a window
  (the parent classes' UFunctions: activate / open / signal), then call it once on our instance at its build. Pages the game keeps single (stats) need
  that page's own path: adopt the game's instance instead of a second one.

## Our «Снаряжение» cannot live beside the hub; the far tabs by index (2026-11-07 06:47–07:01 +03:00, background)

- Native parents found (game map): our `CraftingGUI_C` builds its panels only with `SetInteractionActor`: the hero as the actor → the follower layout
  («Содержимое рюкзака», «Снаряжение питомца»); `nil` → the full hub inventory (bag, paperdoll, level, crafting — frame `craft_nil.jpg`).
- **But an inventory window with its actor set CLOSES the open hub** (three frames 06:58: hub open → our CraftingGUI + `SetInteractionActor(nil)` → the
  world and the HUD, hub closed → a native switch reopens it). Built while the hub is closed, ours survives; opening the hub takes ours OUT of the viewport;
  re-adding it closes the hub again, and its bag comes back empty (07:00). The game allows ONE open inventory window. v6 (`hubswitch/shadow-pages-v6.lua`,
  init + re-add after every switch) therefore kept the hub closed — 12 switches, 0 crashes, every switch «lost» our CraftingGUI. Three attempts on this
  sub-task → stop.
- **Consequence for the controller `[AI]`:** «Снаряжение» stays the GAME's own page (it also carries 6 of the 8 mod embeds); our controller holds the
  previous page (ours, kept in the viewport) until the game's «Снаряжение» is quiet, then swaps in one frame — the hold prototype's «complete» signal
  (no widget born for two samples). «Параметры» likewise the game's page (the game kills any second stats window). Shadow pages (ours) for the other
  seven — «Таланты» and «Хар-ки» proven complete with the hero's data; «Путешествие», «Клан», «Спутники», «Карта», «Базар» — to check as ours next.
- Remote tools learnt: `GUIModuleController:ActivateModule(FName('CharacterInventory'), false, false)` CLOSES the hub; `CarouselWindow:SetCarouselIndex(k)`
  (0-based, 4–8 = the five far tabs) switches natively but leaves the tab header's highlight on the old tab (frames 07:01) — a test path, not the player's.

## v7 — the mixed controller works on all 9 tabs (2026-11-07 07:03–07:05 +03:00, background, `hubswitch/shadow-pages-v7.lua`)

Ours for Таланты, Хар-ки, Путешествие, Клан, Спутники, Карта, Базар (built once, kept in the viewport, shown the tick after the native switch); the game's
page held at opacity 0 until quiet for Снаряжение and Параметры (2 and ≤ 4 ticks), the previous page on screen meanwhile. 13 switches by `SetCarouselIndex`
(1…8, then 0, 4, 0, 8, 3): 0 crashes, 0 Lua errors, 0 pages lost, 0 hold timeouts; every frame 1.5 s after a switch shows the right page complete (TC V7).
**Per-tick log (07:08, `hubswitch/tick-visibility-probe.lua`: per tick, which hub pages are drawn — in the viewport, not Collapsed/Hidden, opacity > 0;
11 switches):** 9 of 11 transitions show exactly ONE page every tick — the old page until the new one, the swap within one tick (Хар → Пар: Хар ×2 then
Пар; Пут → Снар: Пут ×4 then Снар; ours → ours: the swap on tick 1). **Open: from one GAME page to the other** (Пар → Снар 4 ticks, Снар → Пар 3 ticks
with NO page — the bare world): the native switch removes the old game page itself. v8 (`shadow-pages-v8.lua`, 07:09) tried an afterimage — our hidden
«Параметры» drawn while leaving the game's — and broke the hub: with our second stats window alive, the next «Параметры» visit shows its page one tick and
then the hub empties (probe runs of 30 ticks with no page). The game tolerates no second stats window, as no second inventory window. v7 stays the
design; the gap is limited to a direct click between «Снаряжение» and «Параметры» (Q/E never pass between them).
**Scope of the mods' adapters shrinks:** with «Снаряжение» and «Параметры» the game's own pages, their embeds (EoT, EAA, Accessory System, Xevyr, fishing,
Hosav, our «Настройки модов») keep working natively; of the inventory below only Simple Minimap's map overlay sits on a page of OURS («Карта»).
**v9 — the lifecycle (07:17–07:21, `hubswitch/shadow-pages-v9.lua`):** the carousel never dies or hides (one `W_Carousel_C` across close/open, its BP
has only `Construct`), so «closed» = the game's page of the current tab has left the viewport, checked 1 / 100 / 300 ms after Esc, Tab (key binds) and every
`ActivateModule` (the remote's path) — no timer. On close our pages are Collapsed; the next native switch (the reopening) puts them back. Remote close
from «Снаряжение» (`ActivateModule(CharacterInventory,false)`), from «Таланты» (`FeatWindow,false`) and «Карта» (`FullscreenMap,false`) — `CharacterInventory,false`
closes the hub ONLY on «Снаряжение»: 3 closes, 3 reopens, 0 errors; frames — the bare world with no page of ours after each close, the complete «Снаряжение»
after each reopen. Not yet: the player's Esc / Tab / «Закрыть» path (the game in front).
**v10 — lazy build + the RAM measurement (07:23–07:26, `hubswitch/shadow-pages-v10.lua`):** nothing is built at load; the first shown tab of ours is built on
demand, the other six one per tick, nearest first alternating right/left (from «Таланты»: 3, 9, 5, 8, 6, 7); build cost (os.clock) max 77 ms, sum 311 ms —
in the hub, «opening windows — lag allowed» (MASTER_PLAN). Private bytes: world 13 004 MB, hub 13 324, after the lazy build 13 189, after 5 close/open/sweep
cycles 13 217 · 13 212 · 13 218 · 12 979 · 12 981 MB — flat (noise ≫ the pages' cost), no leak → **the lifetime stays the owner's first choice: keep until the
world is left** (`[OWNER]` 2026-11-06 23:18, verbatim above). Frame after cycle 5: «Клан» complete.
**The Simple Minimap adapter (07:27–07:32):** our «Карта» lacked only the mod's helper row; created from its real class path
(`…/UI/CustomMarker/SM_UI_MapHelper`) and added to our page's bottom-bar `Overlay` with the game's slot settings, the row is identical on our page (the
first try used a wrong path; the note «the mod keeps one instance» was wrong — corrected 07:33). Open: its «Свои маркеры» click (dispatcher `SearchClicked`)
on our page — real clicks. Details — `games/ConanExiles/mods/Simple_Minimap.md` «The map helper and our hub controller».
NEXT: build lazily on open — the owner's design — instead of all at once; release by
the RAM measurement), the Simple Minimap adapter, then v7 as a section of KrinikConanUI; the 144 fps recording when the game may come to the front; real mouse clicks (`ButtonPressed`); the bottom-bar `WBP_ButtonBar_C` reborn per
switch; the mods' embeds on our pages (API, inventory below).

## The hub controller API — DRAFT `[AI]` (for the owner's review; the owner set the direction 23:48, the calls are the agent's proposal)

The controller (KrinikConanUI section `krinik_hub`) owns the 9 pages; a page id is the module name (`CharacterInventory`, `FeatWindow`, …).

| Call | Who calls whom | When | Contract |
|---|---|---|---|
| `Hub.register(adapter)` | a mod → the controller | once, at the mod's load | `adapter = { id, pages = {…}, on_built, on_shown, on_hidden, on_closed }`; any field optional except `id` |
| `adapter.on_built(page_id, window)` | controller → mod | once per page, right after the page is built (invisible) | the mod adds its widgets into `window` here — never later, never by a timer |
| `adapter.on_shown(page_id, window)` | controller → mod | the frame the page becomes visible | refresh values only (no widget creation) |
| `adapter.on_hidden(page_id, window)` | controller → mod | the frame the page is hidden | stop anything per-frame |
| `adapter.on_closed()` | controller → mod | the hub closes | release what the mod holds |
| `Hub.current()` / `Hub.is_open()` | any → controller | any time | the shown page id / whether the hub is open |

Rules: every adapter call is timed (`os.clock`) and logged once a minute with the worst call; an adapter call that creates widgets in `on_shown` is a defect.
Build order: the page the hub opens on first, then the others nearest first, alternating right and left, one per step. Open fork: how the controller
takes the switch from the module controller (tab clicks `ButtonPressed`, Q/E input) — recon next.

## Inventory — every mod UI embedded in the hub today (2026-11-06, from the game map and the mod notes; the adapters to write)

| # | Mod | Page | What it embeds | Today's trigger | Our patches today | Adapter call |
|---|---|---|---|---|---|---|
| 1 | Era of Trials | Снаряжение, Параметры | magic-school icons right of the paperdoll; stats-window rows | `EoT_AC_InterfaceInjectorComponent` on `SignalActivated` of `CharacterInventory` / `CharacterStatsWindow` / carousel → `Delay 0.1` | 1st Delay → 1e9 (KRINIK MODIFIED); `krinik_pause_in_menu` calls `ExecuteUbergraph(15)` on `W_UICharacterDisplay_C` birth | `on_built(CharacterInventory)` → the injector's own code path, once |
| 2 | Enhanced Armory and Arsenal | Снаряжение | the sword emblem (`Button_Axe`) and its gem indicator | `AC_EAA_Inventorybutton` on `CharacterInventory.SignalActivated` → `Delay 1.0` → resume 286 | Delay → 1e9; resume 286 called by our pause section | `on_built` → create once; `on_shown` → `UpdateIndicator` |
| 3 | Accessory System (the EAA copy in `ModsShared`) | Снаряжение | «Аксессуары» button under the boots | `AC_acs_AccessorySystem_Persistent` `Delay 0.2` | Delay → 0.0015 (its resume point must not be called from outside — EXP-0371) | `on_built` |
| 4 | Xevyr shared (`XCS_Panel`) | Снаряжение | side tab «Моды Xevyr» | its own module opens with «Снаряжение», window re-created per entry | collapsed by our `Construct` hook (`krinik_mods_button`) | none (stays collapsed) or `on_built` collapse once |
| 5 | Exiles Fishing (JaarFishing) | Снаряжение bottom bar | «Настройка рыбалки» button | `BPC_EFT_Tuning.Graft` (0.3 s poll — patched off) | polls off; Graft no longer called — entry in our «Настройки модов» list | none |
| 6 | UIMod Hosav | Снаряжение bottom bar | «Настройки интерфейса» button (a viewport layer) | `Delay 3.0` + `IsModuleActive` poll — patched off | collapsed on every inventory open by our pause section | none |
| 7 | Simple Minimap | Карта | `SM_UI_CustomMapOverlay`, `SM_UI_MapHelper` (markers, the hint row) | born with the map page (66 births per show) | `SM_UI_MapHelper` slot moved (KRINIK MODIFIED) | `on_built(FullscreenMap)` |
| 8 | KrinikConanUI (ours) | Снаряжение bottom bar | «Настройки модов» button + its list | `XCS_Panel` true (a game module event) | — | `on_built(CharacterInventory)` — the first adapter, written by us as the API's reference |

Also on every switch the hub's bottom bar `WBP_ButtonBar_C` is re-created (vanilla) — the controller keeps one per page.

## Steps

1. [x] **Recon** — DONE 2026-11-06 22:13–23:50 («Progress» above: the old window's fate, births until quiet, the native rebuild on activation).
2. [x] **FORK — how the old page stays** — DECIDED by the owner 2026-11-06 23:48 (our own controller, verbatim above); built as the mixed design 2026-11-07
   (our instances for 7 tabs; the game's held pages for Снаряжение / Параметры — the game tolerates no second inventory or stats window, v6 / v8).
3. [x] **The «complete» signal** — no UserWidget born for 2 samples (the game's held pages); our pages are complete when kept.
4. [x] **Build** — DONE 2026-11-07 07:35 (KrinikConanUI section `krinik_hub_controller`, pack `374b90d`; idle while closed `692460f`); one log line per hub close.
5. [ ] **Test** — by the remote in the background: DONE (S1–S5, one page per tick on every probed switch, 0 errors). OPEN: real clicks, Esc / Tab, a 144 fps
   recording by `hub_switches.py`, the control with the section off — the game in front (the owner's word; STATUS «Awaiting»).
6. [ ] **Open:** a direct click between Снаряжение and Параметры (3–4 bare ticks); the minimap helper's «Свои маркеры» click on our map; the API for the
   other mods' embeds stays a draft — only Simple Minimap needed an adapter in the mixed design.
