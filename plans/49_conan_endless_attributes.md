# Plan 49 — Conan: attributes without the cap of 20, their effects by formula past 20, and the attribute screen that pages past 20

> **Created:** 2026-11-07 · on the owner's words of 2026-11-07 19:50 – 22:02 (verbatim below)
> **Parent:** STATUS «FIRST NEXT CHAT» items (b), (c) and the owner's queue item 2; bugs 84, 86 (the same screen)
> **Status:** 🟡 recorded 2026-11-07 22:03 +03:00 · recon done 2026-11-08 13:1x · the cap removed by a pak edit 2026-11-08 23:47 (criteria 1–2 seen live) — the
> screen paging (criteria 3–5) not started
> **Outbound:** —

## Goal vector (Achieve)

The build's levelling is endless (KrinikConanGameplay, 10 000 levels, XP curve base 1000 since 2026-11-07 21:06). The hero's attributes follow it: the «+» stays past
20, every point keeps adding to the hero's stats by the game's own per-point formulas, and the attribute screen shows the rows and their perks past 20 page by page.

## The owner's words

- `[OWNER]` 2026-11-07 19:50 «я прокачал проворство до 20, и провал плюсик - это нужно убрать, так как прокачка у нас бесконечная» · «можно сколь угодно повышать дальше атрибут».
- `[OWNER]` 2026-11-07 20:50 «И откобчаем лимит на прокачку атрибутов. Делаем её бесконечной.» · «И она бесконечно будет по фотмулам влиять на характеристики героя».
- `[OWNER]` 2026-11-07 22:02 (a frame of the attribute screen: rows «Сила 20», «Проворство 20», each a golden scale with perk nodes at 5, 10, 15, 20, the
  «Осквер…» corrupted column on the right edge) «вот эти ряды навыков нужно научиться делать листаемыми, или скролл бар, или переключение "страницы шкалы"».
- `[OWNER]` 2026-11-07 22:02 (a frame of the right column «Живучесть»: the attribute's line, then the perks «Жажда жизни», «Второе дыхание» (greyed), «Быстрая
  регенерация», «Полнокровность», «Последний бой» cut at the bottom) «Эти списки с описанием перков нужно соответствующем образом уметь переключать на следующую
  страницу в соответствие со станицей шкалы перков».

- `[OWNER]` 2026-11-07 22:03 «в будущем будем сильно развивать систему перков, создавать новые перки для уровеней аттрибутов выше 20-го» — the paging is built for
  future perks past 20: a page is driven by the perk data (nodes at the levels the data names), not by hard-coded 5/10/15/20; pages without perks yet show the bare scale.

## Acceptance criteria

1. An attribute at 20 with free points shows «+»; a click raises it to 21; the screen shows 21 (frame at 4K and 1080p — HOUSE_RULES rule 17).
2. Each attribute's stat effect past 20 follows the game's own per-point curve (read from the game's data first — game map); a measured stat at 25 matches the formula.
3. The scale of a row pages (a scroll bar or page switch — the owner's pick of the two, shown as a mockup with statuses, rule 23): page 1 = 1–20, page 2 = 21–40, …
4. The perk-description column switches to the same page as the scale.
5. No overlap of the caption, nodes and the description column (bug 86) at all four resolutions.

## Steps

- [x] Recon: where the cap 20 lives — **2026-11-08 13:0x, bytecode of the 3.0.1 assets** (`retoc-5.8 to-legacy --filter BP_ProgressionSystem | UI/Inventory/Attributes`,
      `UAssetGUI tojson VER_UE5_8`, `kismet-trace.py`):
      - `BP_ProgressionSystem::CanGiveAttribute(Attribute) → CanGiveAttribute, HasBeenMaxed` = `Attribute < MaxAttributePointsSpent` AND `AttributePointsUndistributed ≥
        GetAttributePointCost(Attribute)`; `HasBeenMaxed` = NOT the first. **`MaxAttributePointsSpent` is a CDO int = 20**, used ONLY there.
      - `W_Attributes::AttributeViewUpdateRequested` reads the attribute by `StatHolder:GetIntStat`, calls `CanGiveAttribute`, passes its result to
        `W_Attribute::UpdateAttributeView(CanGiveAttribute, …)` → the ubergraph sets `LevelAttributeButton` («+») visible / collapsed by it.
      - `W_Attribute::UpdateView` scales the bar by `MaxAttributePointAllotment` (CDO int = **20**), `FClamp(value / 20, 0, 1)` — past 20 the bar stays full.
      - The stored value is not clamped (Agility 22 was accepted and shown on 2026-09-13, `ideas/03` :448).
      - Native `UAttributeSystem` per-point bonuses are flat floats (`BonusDamageMeleePercentagePerAttribute`, `BonusArmorPerAttribute`, `BonusHealthPercentagePerAttribute`,
        `BonusDamageRangedPercentagePerAttribute`, `BonusStaminaPerAttribute`, `BonusEncumbrancePerAttribute`) — linear per point; whether the native code clamps the
        attribute at 20 when applying them is NOT read (live check: an attribute at 25 → the stat). `BP_AttributeSystem` CDO overrides (read 2026-11-08):
        melee damage +0.05 (5 %) per point, armour +8, health +0.10 (10 %), encumbrance +15; ranged damage and stamina keep the C++ defaults (not in the CDO).
      - `ServerGiveAttribute` → the ubergraph (offset 1014): `IsServer` → `StatHolder:GetIntStat` → the SAME `CanGiveAttribute` — one variable gates the UI and
        the server. `GetAttributePointCost(A)` = `DT_AttributeSystem` row named `A` → `CostPerPoint` (our pak: 10 000 rows, cost 1 — no wall past 20).
      **Seen live 2026-11-08 13:1x (remote, no input; TC `TC_conan_xp1000_and_water_reflections_2026-11-08.md` A1–A2):** the lever — with
      `ps.MaxAttributePointsSpent = 2` three `ServerGiveAttribute(19)` stop Agility at 2; with 10 000 the next gives 3 (stat ids: `AttributeHealth` 14 = Vitality,
      `AttributeAthleticism` 19 = Agility, `StatHolder:GetIntStat(id, 1)`; `ServerResetAttributeAll` refunds). Effects past 20 continue (HUD, the hero at 50 %
      corruption, Vitality = Agility = n): health max shown 100 / 350 / 360 / 400 at n = 0 / 20 / 21 / 25 (+10 per point past 20, ×2 without the corruption),
      stamina 50 / 60 / 60 / 62, the speed line 71 / 78 / 78 / 80 — the native per-point bonuses have no cap; only the «+» (`CanGiveAttribute`) and the bar scale stop at 20.
      `FORK: options <a pak edit of the BP_ProgressionSystem CDO (MaxAttributePointsSpent → 10 000) and of W_Attribute (MaxAttributePointAllotment → the page size) |
      Lua sets ProgressionSystem.MaxAttributePointsSpent on the hero's spawn event> · price of error <a whole vanilla blueprint shipped in our pak overrides it for every
      mod that ships the same path and goes stale on a game update; a Lua assignment is one line per spawn> · consulted <HOUSE_RULES rules 8 and 24 (native data first;
      a value set once by an event is not a re-set after the game's work), the asset-override detector `mod-overrides.py` to run before the pak path>` — **DECIDED
      2026-11-08 23:05 by the owner: (A)** `[OWNER]` «(А) — правку пака скриптом». `mod-overrides.py` 23:2x: no mod of the build ships `BP_ProgressionSystem` or
      `BP_BaseProjectile`.
- [x] **DONE 2026-11-08 23:47, seen live (pack `121899e`, guide `bb00ad7`; report `testcases/reports/2026-11-08_conan-attributes-uncapped-dead-shot.md`):**
      cap 10000, Agility 25 → 26 accepted by the server, «+» on the 4K frame of «Хар-ки»; criterion 1 met (bar full past 20 — criteria 3–5 are the paging steps below).
      Build (A): `_config/devkit/vanilla_patches.py` — the GAME's chunk (`retoc get`) + `uaj setstr prop:Default__BP_ProgressionSystem_C/MaxAttributePointsSpent 10000`,
      same-size .uexp, `splice_chunk`; injected by `build-level-mod.py` step 4b into the three KrinikConanGameplay containers; step 6 checks the chunks. Cases
      `testcases/TC_conan_attributes_uncapped_and_dead_shot_2026-11-08.md` A1–A3. The same module carries the owner's Dead Shot change (×2 → ×1.2, D1–D2).
- [ ] Recon: the attribute screen's widgets (`W_Paperdoll…` / the attribute tree), how a row draws its scale and perk nodes, and the perks' data (are there perks past 20 — the
      game has none; `[AI]` what a page past 20 shows goes to him as a mockup).
- [x] Mockup of the paging (scroll bar vs page switch) on our own frame, statuses on every element — to the owner (review folder 79, 19:41).
      **DECIDED 2026-11-09 19:45 by the owner: B** `[OWNER]` «давай прокрутка каждого ряда отдельно» · «4 варианта этой идеи» → next: four variants of the
      per-row scroll on the same frame, review folder 80.
      **DECIDED 2026-11-09 19:58 by the owner: B2** `[OWNER]` «В2 хороший, примерно так и будем делать» — arrows ‹ › at both ends of a row past 20, the open window «21–40»
      over the right end, the wheel over the row pages by 20, every row on its own, the perk column follows the selected row (folder 80, `02_B2_strelki.webp`).
- [ ] Recon for B2: how `W_Attribute` draws the bar and its pips (`UpdateView`, `MaxAttributePointAllotment`), where the arrows and the window label can live
      (a kit edit of `W_Attribute` vs a Lua overlay — HOUSE_RULES rule 8 / rule 24: native first), how the perk column (`W_AttributeInfo`) is filled per page.
      **Read 2026-11-09 20:01** (`retoc-5.8 to-legacy --version UE5_7 --filter UI/Inventory/Attributes` of `_paksview-3.0.1` → `UAssetGUI tojson VER_UE5_8` →
      `uaj exports <asset> VER_UE5_8` → `kismet-trace.py`; 14 assets):
      - `W_Attribute::UpdateView` (594 bytes): `T_Current:SetText(Conv_IntToText(AttributeValue))`; the bar `IPB_ProgressBar:InterpolateToPercent(FClamp(FullValue /
        MaxAttributePointAllotment, 0, 1), 0.2)`; the corruption bar `IPB_CorruptionBar` the same with `CorruptionValue`. → the page is ONE shift in this formula:
        `(FullValue − Page × 20) / 20` — a native edit of the widget, not a post-hook re-set (rule 24).
      - The perk pips come from data: `SharedPerkPips` keyed by each perk's `AttributePointsRequired` (ubergraph, `UpdatePipIcons`, `PostPipsPlacedOnCanvas`) — a page shows
        the pips whose `AttributePointsRequired` fall in its window; future perks past 20 appear by data (the owner's 2026-11-07 22:03 word).
      - Functions of the row: `UpdateView`, `UpdateAttributeView`, `UpdateModifiers`, `UpdatePipIcons`, `PostPipsPlacedOnCanvas`, `Select` / `Deselect`, `OnMouseEnter` /
        `OnMouseLeave`, `IncreaseAttribute`, `GetFullAttributeValue`, `GetInvestedPoints`, the buttons `LevelAttributeButton`, `LevelCorruptionButton`.
      - The row's parent is the NATIVE `AttributeEntry` (`/Script/ConanSandbox`); the pips are native `AttributePerkPip` on a `CanvasPanel`, placed by C++ — no position
        maths in the blueprint; `W_AttributeProgressBar` is a bare `InterpolatedProgressBar` (no BP functions). The native code then calls the BP event
        `PostPipsPlacedOnCanvas` (→ the ubergraph) — the game's own hook point after placement, the native place to re-place the pips of a page (rule 24 holds: it is the
        game's event, not a timer re-set). The window `W_Attributes` relays it (`AttributePostPipsPlacedOnCanvas`) and owns `AttributeViewUpdateRequested`.
      Next: read how C++ places a pip (the X from `AttributePointsRequired` and the canvas width — a live read of the pip slots' positions at 20 vs a perk at 5), then the
      build route: a kit edit of `W_Attribute` (arrows · window label · `Page` var · `UpdateView` shift · pips re-placed in `PostPipsPlacedOnCanvas` · the wheel in
      `OnMouseWheel`), the perk column page in `W_AttributeInfo`.
      Spec (`[AI]`, 2026-11-09 19:06): base — a 4K frame of «Хар-ки» opened by the remote (`ActivateModule(FName('Attributes'))`) with an attribute past 20; two variants
      on the same frame, labelled A and B, into one flat review folder (HOUSE_RULES 11.6d):
      A «страницы шкалы» — under each row's scale a switch «‹ 1–20 · 21–40 ›», the current page lit; the perk column follows the page of the selected row.
      B «прокрутка» — the scale is a strip 20 points wide that scrolls along the row (a thin scroll bar under it, the wheel over the row); the perk column follows the
      visible range.
      Every element carries one of the rule-23 statuses: the row value past 20 and the «+» — «работает» (seen 2026-11-08); the page switch / scroll bar, the
      perk column following it, the bar re-scaled per page — «нет механики — будет сделано»; perk nodes on page 2+ — «нет механики — предложение» (the game has no perks
      past 20; the owner's future perks); a bare scale on a page without perks — «нет механики — будет сделано».
- [ ] **The build route of B2 — a FORK, recon first (2026-11-10).** The row needs NEW logic (a `Page` variable, the bar shift `(FullValue − Page × 20) / 20` in
      `UpdateView`, the arrows' clicks, the wheel, the window label, the pips of a page in `PostPipsPlacedOnCanvas`, the perk column per page).
      `FORK: options <A the kit graph: edit W_Attribute in the devkit (does the kit's Python create K2 nodes? — probe `_config/devkit/kit-probe-bp-graph-api.py`) |
      B bytecode authoring in the cooked asset (`_config/devkit/kismet.py` writes operators; `kismet-graft.py` only transplants an existing edit) |
      C a Lua half on the game's own events (post-hooks of `UpdateView` / `PostPipsPlacedOnCanvas`, widgets spawned once) — HOUSE_RULES rule 8: Lua UI only when the asset
      will not yield, rule 24: a re-set after the game's work is a crutch> · price of error <A/B — a broken widget asset breaks the whole «Хар-ки» screen for every player
      and goes stale on a game update; C — per-frame re-sets and a seam the owner sees> · consulted <the kit probe (pending), HOUSE_RULES rules 8 and 24, the earlier
      field route of KrinikConanUI kit edits (`kit-conanui-edit.py` — tree and properties only)>` — decided after the probe.
      Recon 2026-11-10 (files read): `kismet.py` parses UE 5.8 bytecode and lengthens string literals with the jumps re-based; `kismet-graft.py` inserts an existing
      donor's operators and new LOCAL variables into one function. Neither adds a CLASS variable (`Page`) or a widget. The widget TREE is editable by the kit's Python
      (proven: `kit-conanui-edit.py` added `T_CorpseText1` to `WBP_ContainerInfo`, 2026-10-30). So the likely shape is a hybrid: the arrows and the window label added to
      `W_Attribute`'s tree by the kit (A, tree only), the logic either as kit graph nodes (if the probe shows the API) or as a Lua half bound to the game's events (C).
      **Kit probes 2026-11-10 02:38–02:50** (`_config/devkit/kit-probe-bp-graph-api.py` · `kit-probe-w-attribute.py`, their `.json` next to them): the kit's Python has
      `BlueprintGraphEditor` — an editor object per graph (`BlueprintGraphEditor.get_graph_editor_by_name(bp, "<graph>")`), with `add_call_function_node`,
      `add_get_member_variable_node` / `add_set_member_variable_node`, `add_member_variable`, `add_branch_node`, `add_custom_event_node`, `add_component_bound_event_node`
      (a button's OnClicked), `list_all_nodes`; pins by `BlueprintEditorLibrary.find_input_pin/find_output_pin`, links by `BlueprintGraphPinLibrary.try_create_connection` /
      `break_pin_links`. **Route A is viable for the logic too** (`[AI]`; the FORK closes on the editor's own API as the domain authority).
      - The tree (26 widgets): `overlay` → `HB_Info` (HorizontalBox) holds `I_Icon`, `VerticalBox_0` (the label `T_Label`, the value `T_Current`), `Progress` (Overlay:
        `Overlay_3` = `IPB_ProgressBar` + `IPB_CorruptionBar` + `AttributeCanvas` (the pips), and the «+» `LevelAttributeButton`), `SizeBox_Corruption_Button`.
        The tree is reached by iterating `unreal.Widget` under `<asset>.W_Attribute:WidgetTree.` (`WidgetTree.RootWidget` is not exposed).
      - `UpdateView` (25 nodes): `FullValue` → two knots → `To Float (Integer)` → A of `float / float` (B = `To Float(MaxAttributePointAllotment)`) → `Clamp(0, 1)` →
        `IPB_ProgressBar.InterpolateToPercent(·, 0.2)`; then the corruption bar the same with `CorruptionValue`. **The page shift is one insertion**: between the second
        knot and `To Float` put `FullValue − Page × MaxAttributePointAllotment` (`Multiply_IntInt`, `Subtract_IntInt`, a new int member `Page`). The `UpdateAttributeView`
        is an event inside `EventGraph` (126 nodes), not a function graph.
      - [x] **Step 1 DONE 2026-11-10 03:0x** — `_config/devkit/kit-attribute-paging-edit.py`: member `Page` + the shift in `UpdateView`; `W_Attribute` added to
        KrinikConanUI's `CookInfo.ini`; built, deployed; live (TC `TC_conan_attribute_paging_step1_2026-11-10.md` P1–P4 pass): `Page` 1 → 25 shows 5 of 20, 39 shows
        19 of 20; `Page` 0 → vanilla. Every row lives twice among the live widgets (bug 84's duplicated pages?) — step 2 must drive the SHOWN instance.
      - [ ] Step 2 — arrows ‹ › at the row ends (`Progress`'s overlay or `HB_Info`), visible only past 20; the window label «21–40» over the right end; clicks and the
        wheel (`OnMouseWheel` override) set `Page` within 0…floor((FullValue−1)/20) and call `UpdateView`; the pips of a page (`PostPipsPlacedOnCanvas`); the perk
        column follows the selected row's page (`W_AttributeInfo`). Mockup statuses of folder 80 stay the acceptance.
        Design from the read graph (`kit-probe-w-attribute.json`, 2026-11-10; `[AI]`, to be built in the kit by a step-2 section of `kit-attribute-paging-edit.py`):
        - the game's own pattern to copy: the «+» is `LevelAttributeButton` (a Button in `Progress`, an OverlaySlot) with a `K2Node_ComponentBoundEvent` «On Clicked
          (LevelAttributeButton)» in `EventGraph` — the arrows are two more Buttons in the same overlay (`Btn_KrinikPagePrev` left-aligned, `Btn_KrinikPageNext`
          right-aligned) with their own bound `OnClicked` events (`add_component_bound_event_node`), each: `Page` ± 1, clamped to 0…floor((FullValue − 1) / 20),
          then the same `UpdateView` call the game makes;
        - `UpdateView` is called in `EventGraph` after `GetIntStat` ×3 (AttributeValue, FullValue, CorruptionValue) and before `UpdateModifiers` — the arrows' handler
          re-uses that node chain, so the bar, the value and the corruption bar stay the game's;
        - the arrows' and the label's visibility: in `UpdateView` after the bar (FullValue > 20 → Visible, else Collapsed), the label text «21–40» from `Page`;
        - `PostPipsPlacedOnCanvas` (the game's event after the C++ placed the pips) only signals `Signal Request Attribute View Update` — the pips of a page need
          the C++ placement rule read first (`AttributePerkPip` slots' X at 20 vs a perk at 5, a live read), then a re-place there;
        - every row exists twice live — the handler works on `self`, so the duplicate is harmless for the clicks; the remote's probe must pick the shown one.
        - **The pip placement, read live 2026-11-10 03:10** (`_config/attr-pips-probe.lua`, row Сила 18): `AttributeCanvas` children are `W_AttributePerkPip_C`
          100×30, slot X = `AttributePointsRequired` / 20 × 858.2 (5 → 214.5, 10 → 429.1, 15 → 643.6, 20 → 858.2); a branch level (two perks at one req) puts its
          pips at Y 0 and 32, a single one at Y 16; a second set of 4 pips at Y 16 follows (the corruption pips — to confirm). So a page p re-places a pip at
          X = (req − 20p) / 20 × 858.2 and hides it outside 1…20 of the page — done in `PostPipsPlacedOnCanvas` (the game's event after its own placement).
          Process slip of that run: the game was opened without the voice phrase (HOUSE_RULES rule 13) — the phrase line went to /dev/null by my mistake.
        - **The recipe for new widgets in an existing tree** (the field route, `kit-conanui-edit.py` :299–345): `tree = unreal.find_object(None, "<asset>.<name>:WidgetTree")`,
          `w = unreal.new_object(unreal.Button, outer=tree, name="Btn_KrinikPageNext")`, `slot = <parent overlay>.add_child_to_overlay(w)`; a re-run REUSES the widget
          found by name and never removes one (the GUID trap: run the script TWICE before a build after adding a widget — `KrinikConanUI.md`, «Kit Python traps»).
          FIRST probe of step 2: does `BlueprintGraphEditor.add_component_bound_event_node(<the Button>, "OnClicked")` accept a widget (its doc types `ActorComponent`)?
          If not — a custom event bound by `K2Node_AssignDelegate` / `add_dispatcher_event_node`, or the game's `Select` path.
          **Probed 2026-11-10 03:12 (`kit-probe-bound-event.py`, nothing saved): NO** — «Cannot nativize 'Button' as 'Object' (allowed Class type: 'ActorComponent')».
          Next probe: `ed.list_available_nodes([])` filtered by «Clicked» / «Bind Event» in EventGraph — then `create_node_from_name("<Category|Name>", pos, [])` for the
          button's «On Clicked» or a «Bind Event to On Clicked» + custom event in `Construct`.
          **Probed 03:14 (`kit-probe-node-catalog.py`, 60 519 nodes, categories localized in the kit's Russian UI):** `Кнопка|Событие|AssignOnClicked` (a Bind to
          OnClicked WITH its matching custom event) and `Кнопка|Событие|BindEventtoOnClicked` exist. Route for the arrows: in `Construct`, a `Get Btn_KrinikPage*`
          node, then `ed.create_node_from_name("Кнопка|Событие|AssignOnClicked", <pos>, [<the getter's output pin>])` — the custom event runs `Page` ± 1 and the game's
          `UpdateView` chain. Wheel: **probed 03:15 (`kit-probe-wheel-override.py`, nothing saved): `add_function_override(bp, "OnMouseWheel")` works** — a graph
          `OnMouseWheel` with the entry (`MyGeometry`, `MouseEvent`) and a return node (`Event Reply`): read the wheel delta from `MouseEvent`
          (`GetWheelDelta`), `Page` ± 1, `UpdateView` chain, return `Handled`. **The recon of step 2 is complete — next session builds it.**
        - **Build 2026-11-10 09:1x–09:4x — `_config/devkit/kit-attribute-paging-step2.py`** (9 kit runs, each stops before the save on any failed link; what the kit
          refused, and the way round, `[AI]`): (1) `bIsVariable` is not reflected to the kit's Python — new widgets are no blueprint variables; (2)
          `GetWidgetFromName` takes no FName literal (`set_pin_value` refuses it); so the arrows ‹ › (`Btn_KrinikPagePrev` right of the «+», which sits
          H_ALIGN_LEFT in `Progress`; `Btn_KrinikPageNext` at the right end) and the label `Txt_KrinikPage` are children 2, 3, 4 of `Progress`, reached in the graphs
          as `LevelAttributeButton.GetParent().GetChildAt(i)` + an exec «Cast To Button / TextBlock» (the TextBlock cast's pin is `AsText`); (3) the catalog
          offers no call of `SignalRequestAttributeViewUpdate` — each click's `Set Page` flows INTO the game's own signal node after `PostPipsPlacedOnCanvas`
          (an exec input takes many links); (4) **the wheel is NOT built**: in the `OnMouseWheel` function graph `create_node_from_name("Кнопка|Событие|CallOnClicked")`
          returns None with or without the declaring class (runs 7–8) — the code stays behind `KIT_TRY_WHEEL=1`; next route: the wheel sets `Page` and calls
          `UpdateView` with `GetFullAttributeValue` / `GetInvestedPoints` of the row itself, or an event-graph custom event called by name.
          The UpdateView prefix: `Page = Clamp(Page, 0, max(0, (FullValue − 1) / 20))`; arrows Visible + label SelfHitTestInvisible when that max > 0 (else all three
          Collapsed); label «Page×20+1–(Page+1)×20»; `AttributeCanvas` (the pips) shown only on page 0 — the game has no perks past 20 (the owner's future perks
          will need their own placement, X = (req − 20p) / 20 × 858.2). Cases `testcases/TC_conan_attribute_paging_step2_2026-11-10.md`.
- [ ] **The «Хар-ки» screen UI rework, with the paging** — `[OWNER]` 2026-11-09 22:48 «Нужно будет там сильно чинить UI на этом экране... я накидывал скриншоты, что там и
      диалог страшный когда на развилке перк выбираешь. и фиолетовые навыки страннос строчка выглядит»: (a) the branched-perk choice dialog (`W_PerkSelection`; also bug 84 — it
      opened UNDER the attribute tree), (b) the purple corruption row (`W_AttributeCorruptionBar`, the diamond right of the scale), (c) the caption under a node icon (bug 86).
      First: find his earlier frames in the chat history / review folders, then a mockup with statuses (rule 23) before any build.
- [ ] Build, cases, frames at four resolutions.
