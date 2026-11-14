# TC — Conan hub: every mod element is on its page's FIRST frame (plan 48, goal G2a)

> **Created:** 2026-11-14 · **Parent:** `plans/48_conan_hub_switch_hold_old_page.md` («The owner's words 2026-11-14», criterion G2a) · **Status:** written 13:42,
> not run · **Outbound:** —

**Test basis:** `[OWNER]` 2026-11-14 12:32 «и элементы модов должны показываться мгновенно при открытии соответствующих страниц хаба, а не с задержкой ни в десятки
ни в тысячи миллисекунд» (verbatim in plan 48); bug 64 item 17 (elements appearing late in the hub, the Era of Trials icons). The list below is from the mod notes
(`games/ConanExiles/mods/KrinikConanUI.md` and the mods' own notes) — the first step of G2; a page walk by the probe may add rows.
**Stand:** the 3.1.0 game in front, the owner's world, real input (mouse on the tab row, Tab to open), a 144 fps capture (`hub_run.sh`-style ddagrab), HDR off.
**Method per case:** open the page by the player's input; find the page's first frame (the switch frame of `hub_switches.py`); crop the element's region and
compare it with the same region 0.5 s later — the element must be present (equal) on the first frame; a frame without it = fail with the delay in ms.
**Dimensions covered:** each embed × the way the page opens (a tab click · the hub's opening onto that page · a return from another tab); control: the same
page with the mod's pak off shows no element (the crop changes). Not covered: the mods' own windows opened from the list (they are not hub pages).

| # | Page | Mod element (who puts it there) | Expected | Status | Observed |
|---|---|---|---|---|---|
| M1 | Параметры | Era of Trials magic-school icons on the hero portrait (`krinik_pause_in_menu` `inject_eot_stats`, 4–8 ms at the portrait's birth) | on the first frame | [NOT-TESTED] | |
| M2 | Снаряжение | «Настройки модов» button of the inventory bar (`krinik_mods_button`) | on the first frame | [NOT-TESTED] | |
| M3 | Снаряжение | Hosav's «Настройки интерфейса» (collapsed on every open by `krinik_pause_in_menu`, retry ≤ 4 × 250 ms) — must NOT flash | never on any frame | [NOT-TESTED] | |
| M4 | Снаряжение | Inventory Compactor's split / compact buttons and their tooltips (`krinik_ui_fixes` 1.7.0) | on the first frame | [NOT-TESTED] | |
| M5 | Снаряжение | Xevyr's side tab (`XCS_W_Container`, collapsed by the `Construct` post-hook) — must NOT flash | never on any frame | [NOT-TESTED] | |
| M6 | Карта | Simple Minimap's helper row in the bottom bar (`add_minimap_helper` adapter) and its custom-marker overlay (`SM_UI_CustomMapOverlay_C`; our page lacks `markerPing` — TC kept tabs H8) | on the first frame; the ping works | [NOT-TESTED] | |
| M7 | Хар-ки | our page arrows and the gold «+» (kit), the placeholder perk pips (`krinik_attr_pips`) | on the first frame | [NOT-TESTED] | |
| M8 | any | the hub's late emblem / icons of bug 64 item 17 — find which by a 144 fps pass over all 9 tabs and a per-region late-change list (`hub_switches.py` «late» boxes) | none late | **partial — from `fix3.mp4`** | the late-change boxes of the 13:26 pass (real clicks, all 9 tabs): Параметры +35 / +69 / +104 ms over 1760–2936 × 124–1492 px (the hero portrait — bug 101 item 3, the game's page); Клан → Путешествие +28 ms over 2060–2636 × 120–1208 (read 13:4x: the journeys card «Выживший» identical on 43.60 / 43.65 — the change sits in the tab underline glow at the box's top, the native tab indicator, not a page or mod element); Снаряжение → Таланты +69 ms over 308–3664 × 120–436 (our feat page's selection card — bug 101 item 4); the rest of the switches clean. Which of these are MOD elements — to read by frames |
