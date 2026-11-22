# Plan 61 — Esc closes the other mods' settings windows over the hub (bug 108 · issue #41)

> **Created:** 2026-11-22 20:5x · **Parent:** `bugs/108_conan_esc_does_not_close_mod_windows_over_hub.md`; the RC4 scope by the owner's word 2026-11-22 15:07
> («чиним остальное все это … и это будет скоуп на RC4»; issue #41 in it)
> **Status:** 🔲 planned — no code; the Lua paths are closed (see «Known»), the native path needs a spike first
> **Outbound:** —

## Goal vector (Achieve)

**A player who opens a mod's settings window over the hub closes it with Esc, and the hub stays open** — the same as the game's own pop-ups
(`InventorySettingsPopup`) and as our «Моды Krinik'а» window (its kit event `KrinikEsc`). Fit: for every window of the «Настройки модов» list, one Esc → the
window closes, the hub stays, one log line names the window; no crash, no key bind (bug 85 class), nothing re-set at runtime against the mod (rule 24).

## Acceptance criteria

1. Every window of the list (13 modules — `krinik_mods_button.lua` `TOP` / `SUB`) has a recorded result: closes by Esc natively already / closes by our fix / left
   with a known-issue line (the owner told which and why).
2. For each fixed window: case «hub open → the window opened from the list → Esc» passes by REAL input (`mouse-seq.ps1`), and by the posted key in the
   background (`post-key.ps1`), three times in a row, no crash (`crash-forensics.py` after the run shows nothing new).
3. The fix is native and survives a mod update: a script next to the pak re-applies it (`patch-mod-asset.py` / a kit script), the mod marked KRINIK MODIFIED
   in `modpack.json`, or the fix lives entirely in OUR kit pak.
4. Neighbours (HOUSE_RULES 39): Esc in our own window (one close, no double), Esc with no mod window (the hub closes), typing into a mod window's text
   field (the keys still reach it).

## Known (do not repeat — bug 108 points 1–7)

- A posted Esc reaches the game's escape stack; the vanilla pop-up closes; with EAA focused nothing happens and the hub does not close either — the focused
  mod window swallows the key.
- `SM_UI_Settings_C` (Simple Minimap) and Night Terrors close by Esc themselves (an `InpActEvt_Escape` input-action event in their own blueprint).
- Dead ends: UE4SS hooks on `UserWidget:OnPreviewKeyDown`, `GUIModule:SlotESCPressed` never fire; a Lua-made FLX button with the Escape shortcut is dead;
  `ListenForInputAction` from Lua with a table delegate CRASHES UE4SS natively (bug 118, proven 2026-11-22 19:31) — the remote refuses it now;
  `WindowRoot`, `GUIModule`, `EscapeStackNode` carry no Lua-hookable Esc event (recon 2026-11-22 20:44).
- `kismet-graft.py` grafts edits INSIDE one vanilla function shared by two mods; it does not add a new function to a mod's own blueprint.

## Options for the spike (decide by evidence, cheapest first)

| # | Idea | What it costs | Main risk |
|---|---|---|---|
| A | **Our kit «Esc catcher»:** when a mod window opens over the hub (our existing `ActivateModule` hook), OUR invisible kit widget takes keyboard focus; its `OnPreviewKeyDown` (kit graph, as `W_KrinikModSettings`) raises our event `KrinikEsc` for Escape, Unhandled for other keys; Lua closes the top mod window by its close handler (`BndEvt__Button_81_…` closes EAA) or `ActivateModule(false)` | one kit widget + one Lua handler; no foreign asset touched | a click inside the mod window moves the focus back to it (Esc dead until refocused); text fields of the mod window lose the keys while we hold focus |
| B | **Per window: an `InpActEvt_Escape` like Simple Minimap's** — the window's own input-action binding to its close handler, added to the mod's cooked blueprint | binary edit of a cooked BP class: a new function export + the class's input-delegate binding data; one patch script per window | the heaviest; the tooling (`uaj`, the kit) has no «add a function» yet |
| C | **Per window: the close button as a `WBP_ButtonBase` with `KeyShortcutName` Escape** in the window's WidgetTree (the game's buttons react to their shortcut natively) | a widget-tree edit of the mod's asset (replace / add a child) + its click wired to the window's close | the shortcut needs the FLX input routing that a Lua-made button lacked (spike S11) — may be dead in a cooked edit too |
| D | Leave it: the windows close by their own «Закрыть» button; a known-issue line in the release notes | none | the owner's RC4 scope named it — his word decides |

## Step 1 result — the inventory (2026-11-22 20:51, the shipped state, a posted Esc in the background; `KUMM/.work/tmp/esc_inventory.sh`, rows `esc_inventory.txt`)

| Window (module) | Esc | The hub after |
|---|---|---|
| `KrinikModSettings` (ours), `SM_UI_Settings` (Simple Minimap), `NightTerrorsSettings` | closes | stays |
| `LBPRWidgetID` (LBPR) | the window stays | **the hub closes behind it** |
| `ExilesFishingTuning`, `AMR_Settings`, `LLH_Settings`, `PrP_Settings`, `DN_UI_Settings`, `EmberlightMasterConfig`, `EAA_Armorsettings`, `HosavUIsettings`, `PIFC_Settings` | nothing | stays |

So the fix covers 10 windows: nine that ignore Esc and LBPR, where Esc reaches the hub instead of the window. The spike target stays EAA; LBPR shows the key CAN
pass the window — a catcher (option A) must also stop the hub from taking that Esc.

## Steps

1. ✅ **Inventory (no code)** — done, the table above: for each of the 13 windows — open over the hub by the remote (`walk-mod-windows.sh` pattern), post Esc, record closes / not; a
   frame of each. Result table into bug 108.
2. **Spike A on EAA — the concrete recipe (read 2026-11-22 21:1x from `_config/devkit/kit-krinik-click-events.py`):**
   - kit: `new_widget("W_KrinikEscCatcher", unreal.CanvasPanel, VISIBLE-or-SELF_HIT_TEST_INVISIBLE)` + `custom_event(ed, "KrinikEsc", …)` + compile +
     `key_override(bp, gen, "OnKeyDown", "InKeyEvent", "/Script/Engine.KismetInputLibrary:GetKey", "Escape", "KrinikEsc", "Handled", part)` — Handled, so the
     hub does not take the same Esc (the LBPR row of the inventory); the widget must be focusable (find the kit property: `IsFocusable` on the generated
     class's default object); one more `FilesToCook` line in `Local/CookInfo.ini`; build by the KrinikConanUI recipe (notes «Where things are»), twice for GUIDs.
   - Lua (KrinikConanUI, the pause section's existing `ActivateModule` hook — no new timer): a module of the 10-window list opens → `WidgetBlueprintLibrary:
     Create` the catcher once, `AddToViewport` above the mod window, `SetKeyboardFocus`; `RegisterHook(…W_KrinikEscCatcher_C:KrinikEsc)` → `ActivateModule(<top
     mod module>, false)` (or the window's own close handler where `false` leaves state — EAA's `BndEvt__Button_81_…`); the module closes → the catcher leaves.
   - The focus risk measured FIRST: open EAA, click a slider by real input (`mouse-seq.ps1`), then Esc — does the key still reach the catcher? If the click
     moved focus to EAA's button, re-focus in the pause section's existing 250 ms poll (only while a list window is open) — but that steals keys from a text
     field: the neighbour case 4 decides whether A can ship.
   The old step text: **Spike A on EAA** (cheapest, all ours): the catcher widget by a kit script (`kit-krinik-click-events.py` style), focus taken on the mod window's open,
   the Esc event hooked from Lua; cases of acceptance 2 and neighbours 4 on EAA alone; the focus-after-click risk measured (click a slider, then Esc).
3. Decide by the spike: A holds → roll out to every window of the inventory that does not close natively; A fails on focus → spike C on one window; C
   fails → B needs a tooling step (a plan of its own) or D with the owner.
4. Judge round, the release notes line, issue #41 closed after the retest by real input.

## Risks

- Focus handling in UMG over another module's window (A): measured in step 2 before any roll-out.
- Kit rebuild of KrinikConanUI: ≈ 2.5 + 2.5 min per round (notes `KrinikConanUI.md` «Where things are»), the GUID trap (run the kit script twice).
