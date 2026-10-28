# Test cases — Conan quick loot: the strip after «Забрать все» (bug 64 item 35) and the «(удерживайте)» order (item 34)

> **Created:** 2026-10-28 · **Basis:** STATUS queue (0a) — after «Забрать все» the corpse strip stays left (F3 fail of
> `TC_conan_corpse_prompt_left_of_quickloot_2026-10-28.md`; the empty `W_QuickLootPanel` reads Visibility 2 = Hidden, which keeps layout space);
> (0b) `[OWNER]` «у окна квик лута нужно местами поменять текста "Забрать всё" и "Удерж."».
> **Facts found offline (2026-10-28 23:4x):** `Default__W_QuickLootPanel_C` has `Visibility = Hidden` as its class default; «(удерживайте)» is
> `TextBlockHoldPrompt` inside the shared `UI/Framework/W_HotkeyIcon` (HBox: binding-name text · hold prompt · primary icon · secondary icon),
> shown by native code for hold actions (`QuickLootNavTakeAll` icons `W_HotkeyIcon_3`, `W_HotkeyIcon_4`).
> **Contour:** `D:\Games\Conan Exiles 3.0.1`, the agent's own run under the machine lock, game in the background; pult `KrinikAgentRemote`
> (`bash ConanExiles/_config/pult.sh`); frames — `capture-window.ps1` in the background.

**Stand (HOUSE_RULES §1 rule 11):** god mode; time 12:00; teleport to the sleeping camp of the 22:56 run (≈ −82957, 231307); remove every
`Character` within 60 m except ONE target whose class name is exactly `HumanoidNPCCharacter_C` (never a subclass — `BP_HumanoidDialogueNPC_C`
are dialogue NPCs); kill it with `KillCharacter`; open the module on its corpse (`ActivateModule('ContainerInfo')` + `SetObject(corpse, 0)`);
close the module after the case (`ActivateModule('ContainerInfo', false, false)`).

| # | Case | Steps | Expected | Status | Observation |
|---|---|---|---|---|---|
| P1 | Is the panel recreated? | read the panel object's full name while it shows loot; take all by the pult (the take-all function, or real Q after idle); read it again | same name → the game writes Hidden on the same instance (a class-default edit will not help); new name → recreated from the class default (`Collapsed` default fixes item 35) | pass (answered) | 23:49 own run, kappa-baby corpse (exact class `BP_NPC_Wildlife_KappaBaby_C`), pult `SlotTakeAll()`: the SAME instance (`…WBP_ContainerInfo_C_2147454276…W_QuickLootPanel`) goes Visibility 4 → 2 — native code writes Hidden; a class-default edit will not help |
| P2 | Does Collapsed bring the strip back? | after take-all: frame; pult `SetVisibility(1)` (Collapsed) on the panel; frame | the strip returns to the centre (E3 of the old cases) on the second frame | fail (theory refuted) | 23:50: `SetVisibility(1)` → `Overlay_Main` desired size 1141×144 (the panel no longer counted), but the strip did NOT move (frames `p1_empty` vs `p2_collapsed`, same x). `WBP_ContainerInfo_C` has no UMG parent (outer = the game instance): the module system places it on screen itself, from its size at activation — a later visibility change does not re-place it |
| P3 | Does the game re-write Hidden? | after P2 wait 3 s, read the panel's visibility; look away and back at the corpse | stays Collapsed, or the moment the game writes Hidden again is named | pass | 23:50: stayed Collapsed 3 s after the pult set it (the game wrote Hidden once, at take-all); look-away/back not walked — moot after P2 |
| P4 | Native properties of the hotkey icon | pult: list the properties of `W_HotkeyIcon_4` (class chain up to `UserWidget`) | a native property that turns the hold prompt off per instance — found or "none" | pass | 23:51: native class `HotkeyIcon` has the instance property `HoldPromptVisibility` (also `ShowOnlyText`, `BindingLabel`, `NoPresentationVisibility`); live `HoldPromptVisibility=1` on `W_HotkeyIcon_3/4` + label text «Забрать все (удерживайте)» → the row reads «Q Забрать все (удерживайте)» (frame `p4_compare.webp`, 23:55; the hold words turn white like the label) |
| P5 | Who shows the hold prompt | pult: `TextBlockHoldPrompt` visibility of `W_HotkeyIcon_4` vs a non-hold icon (`W_HotkeyIcon_2`) | Visible vs Collapsed — confirms the native switch by action type | pass | 23:51: `W_HotkeyIcon_4`/`_3` (`QuickLootNavTakeAll`) hold prompt Visibility 3, `W_HotkeyIcon_2` (`QuickLootCycleSelectionNext`) 1 — native switch by action type |

**Build cases — `KrinikUIFixes` with item 34 (kit edit 2026-10-29 00:0x: `HoldPromptVisibility = NEVER` on `W_HotkeyIcon_3/4`, labels
«Забрать все (удерживайте)`):**

| # | Case | Steps | Expected | Status | Observation |
|---|---|---|---|---|---|
| B1 | Navigation row with loot | corpse with loot, module open (stand above), frame | «Q Забрать все (удерживайте)»; no orange «(удерживайте)» between Q and the label | pass | 00:06 build (pak md5 4fa496…, deployed `-Only`, verify 97/0), crocodile corpse with loot: «Q Забрать все (удерживайте)», no orange prompt between Q and the label (frame `b1.jpg`, crop `b1b2.webp`) |
| B2 | Action row | `SlotCycleSelectionNext()` by the pult (the wheel), frame | the same order in the action row; Esc label not glued | pass | 00:07 pult `SlotCycleSelectionNext()`: «F Забрать · Q Забрать все (удерживайте) · Esc Отмена» — order kept, Esc not glued (`b2.jpg`) |
| B3 | Window width holds (regression of Q1b/Q2b) | frames of B1 and B2, the window frame edges | right edge on the quest-panel edge, same in both rows (± 3 px at 4K) | pass | 00:07 frame edges on row y 1300 of the 4K frames: left 2211, right 3724 in BOTH rows (quest edge 3722; Q1b had 2211 / 3721–3723) |
| B4 | Take all still works | `SlotTakeAll()`; weight/inventory count | items moved to the hero | pass (caveat) | 00:08 pult `SlotTakeAll()`: the panel empties and hides (Visibility 2); the weight readout stayed 124/145 — crocodile loot is lighter than one unit, so the weight is no evidence; the take-all path is native and untouched by the edit |
| B5 | Other hold prompts untouched | any other hotkey icon with a hold action outside the loot window (e.g. the hub) — or the class default by the pult | `HoldPromptVisibility` default (0) elsewhere | pass | 00:08 the other five icons of the panel (`W_HotkeyIcon`, `_0`, `_1`, `_2`, `_C_1`) read 0 (default); only `_3`/`_4` read 1 (NEVER) |

**Lua-half cases — `KrinikUIFixes` 1.1.0 (pak strip back to Center; `ue4ss/Mods/KrinikUIFixes` sets Left while the window shows):**

| # | Case | Steps | Expected | Status | Observation |
|---|---|---|---|---|---|
| L1 | Hooks set | launch, enter the world, open the module once; read UE4SS.log | «hook SetObject set», «… HandleInventoryChanged set», «… HandleLootContainerInventoryChanged set»; no «failed», no «error» | pass (2nd build) | 1st build 00:18: the three blueprint hooks set, but a DEFERRED registration missed the first `SetObject` and `HandleInventoryChanged` never fired on a corpse (counters on nine candidates around a real Q hold, 00:2x: only native `QuickLootPanel:SlotItemAddedOrRemoved` fired). 2nd build 00:21: «hook …QuickLootPanel:SlotItemAddedOrRemoved set» at load, «hook …WBP_ContainerInfo_C:SetObject set» at the first widget, no errors |
| L2 | Corpse WITH loot | stand: crocodile corpse, module opened (`SetObject`), frame | strip left of the window, ≥ 8 px gap at 4K (E1 of the old cases) | pass | 00:24 2nd build, crocodile corpse with loot: strip ends ≈ 1055, window from 1105 (1920 frame) — gap ≈ 100 px at 4K; row «Q Забрать все (удерживайте)» (`l2c_strip.webp`) |
| L3 | Corpse WITHOUT loot | kappa-baby corpse (empty), module opened, frame | strip centred on the screen (± 10 px of 1920 at 1080 scale) — not at the left edge | pass | 00:23 2nd build, the FIRST widget of the run on a crocodile corpse without loot: strip centred (text «Разделать труп» centre ≈ 955 of 1920), log «events 1» (`l2b_strip.webp`) |
| L4 | After «Забрать все» | on L2's corpse `SlotTakeAll()`, frame after 0.5 s | the window hides and the strip returns to the centre | pass | 00:35 2nd build, crocodile corpse with loot, REAL Q held 1.65 s after input idle: the window hid (2), the strip back to Center (alignment 2), frame `l4b_strip.webp`. (1st build 00:20: fail — no event on take-all; fixed by the native hook) |
| L5 | Cost | a minute with ≥ 3 events; read the summary line | worst handler ≤ 0.5 ms; no line without events | pass (partial) | 00:46 session: 2 corpses opened + `SlotTakeAll` each (≥ 4 events); the summary prints on the first event after 60 s: «events 1, alignment changes 1, handler sum 0.000 ms, worst 0.000 ms» (00:46:00) — below `os.clock` resolution; no line was printed without events. A-B frame-time measurement (rule 7) not done — needs the owner's «кино выключено» |
| L6 | Control: Lua half off | remove `enabled.txt`, relaunch, L2 | the strip stays centred and runs under the window (the vanilla overlap) — proves the Lua half does the move | pass (equivalent) | not a separate relaunch: the 1st build (deferred registration, no loot hook) WAS the Lua half off for those paths — first corpse with loot 00:18: strip centred and under the window (`l3_strip.webp`); after take-all 00:20: strip stayed (`l4_strip.webp`); the pak alone gives vanilla Center |

**Spread bars returned (owner 2026-10-29 00:2x: «опять полоски разброса появились!!!!!!» · «ну чтор за пиздец с этими полосками!», in the
agent's run with the game in front — he was playing in it):** the log of that run has no «полоски прицела скрыты» line — `KrinikConanArchery`
hid the bars only on the aim-view entry (`on_fov_target`), never on a draw without it. Fix: `hide_bars()` also at the start of every draw
(`on_charge_begin`).

| # | Case | Steps | Expected | Status | Observation |
|---|---|---|---|---|---|
| SB1 | Draw by the heavy attack (middle button), no aim view, first draw of the run | fresh launch; real `mdown`, hold 1.5 s, frame mid-draw | no spread bars at the crosshair; log «полоски прицела скрыты в начале натяжки: true» | not reproduced | 00:35 real `mdown` 2.5 s: no crosshair at all on the mid-draw frame (`sb1_small.webp`), no charge-begin line (the heavy attack does not run `BP_PowerCharge`). 00:37 fresh launch, FIRST draw by real `ldown` 2.2 s: crosshair dot only, no bars (`sb1b_center.webp`), still no charge-begin line — `on_charge_begin` did not fire on either draw; bars hidden by the first arrow (00:37:37 «шаблоны … полоски прицела скрыты») |
| SB2 | RMB aim after SB1 | real `rdown` 1.5 s, frame | no bars | pass | 00:36 real `rdown` 2.2 s, frame at 1.4 s: crosshair dot, no bars (`sb2_center.webp`) |
| SB3 | Ten draws over 3 min (mixed RMB / MMB) | real input, frames on draws 5 and 10; log | no bars on any frame; «вернулись» lines, if any, name the reload | pass | 00:51 build with the crosshair hook: real input — 5 aimed shots (RMB + LMB) and 5 hip draws (LMB), then an 11th draw framed mid-draw: dot only (`sb3_center.webp`); no «вернулись» line in the log |
| SB4 | Bow in hand right after the world loads, nothing pressed (REPRODUCED 00:40, frame `sh0.jpg`: «— • —») | fresh launch with the crosshair-creation hook, frame 4 s after the world | dot only; log «полоски прицела скрыты при создании прицела» | pass | 00:44 build with `NotifyOnNewObject(WBP_Crosshair_C)` → `hide_bars` a tick later: dot only (`bars_entry.webp`), the log line at 00:44:26 |

T1 result (00:34): the override WINS over the vanilla target (our Game target is read later), but the widget lays the prompt out as one row
«text before the key · E icon · text after»: the break left «или нажмите» as a second line of the FIRST piece, right-aligned, left of the icon
(`t1_strip.webp`) — **T1 fail (layout)**; T2/T3 moot. The two-line prompt needs a different layout — variants to the owner.

**Corpse prompt on two lines (owner 2026-10-29 00:2x: «было бы хорошо текст переносить на две строки в виджете подсказке о трупе со слова
"или" - на второй строке писать»):** the string is vanilla (target `Exiles_UI`, key `DA4E821B4EE35B69F5E9128CF11CB58F`); our `Game.locres` gets
the same key with «…ресурсы\nили нажмите {0}…» by `_config/devkit/vanilla-override.py` (+1 entry, regress 0 lost / 0 changed).

| # | Case | Steps | Expected | Status | Observation |
|---|---|---|---|---|---|
| T1 | The override wins over the vanilla target | deploy «Krinik Russian Translation» (`-Only`), launch, corpse with loot, frame | two lines: «Разделайте труп и получите ресурсы» / «или нажмите [E], чтобы забрать предметы»; the E icon in place | fail (layout) | 00:34: the override wins (our Game target over vanilla Exiles_UI), but the row «text · E · text» keeps «или нажмите» as a 2nd line of the first piece, left of the icon (`t1_strip.webp`); reverted 00:38 (Game.locres md5 273467aa back) |
| T2 | Strip vs window | same frame | the narrower strip still left of the window with a gap; nothing clipped | skipped | moot after T1 fail — the override is reverted; re-run with the next layout variant |
| T3 | Corpse without loot | kappa corpse (empty) | «Разделать труп» unchanged (another key), strip centred | pass (part) | the override touches only key DA4E…; «Разделать труп» (another key) and the centred strip seen on the empty corpses 00:23 (`l2b_strip.webp`) — the override itself reverted |

**Item 35 — what the run showed (00:05–00:07):** `Overlay_Main` of `WBP_ContainerInfo` spans the whole screen width, so the strip's `Left`
alignment pins it to the SCREEN's left edge (+ padding 120) in every state: with loot it happens to stand left of the window; on a corpse
WITHOUT loot (window Hidden from the start, or after take-all) it stands at the left edge (frame `b1_small.webp` of the kappa corpse, strip at
x 140–310 of 1920) — a regression of our build-2 fix against vanilla (centre). Live: `SetHorizontalAlignment(Center)` on `OverlaySlot_5`
centres it at once (`h2_strip.webp`). The fix therefore needs the strip alignment to FOLLOW the window: Left while the window shows loot,
Center otherwise — an event of the game, not a layout constant (`HOUSE_RULES.md` §1 rule 8: Lua only when the asset will not yield, once, no
polling).

**Run note:** 23:52:22 the game crashed (UE4SS access violation at 0xffffffffffffffff) on MY stand script — `K2_GetActorLocation` on a killed kappa
kept in `_G`; the crash-report window closed by PID 57076; relaunched 23:54, game closed and the lock released 23:55. Frames: `D:/Temp/claude/lp/`.
