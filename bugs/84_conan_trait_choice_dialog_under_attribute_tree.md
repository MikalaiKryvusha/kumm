# Bug 84 — Conan: the «Выберите Черту» (choose a trait) dialog is drawn UNDER the attribute tree and the tutorial header

**Status:** 🔴 OPEN · **Severity:** S2 · **Fixing:** next item of the dayloop (after the control case)
**Version/build:** Conan 3.0.1 build, KrinikConanUI with `krinik_hub_controller` (plan 48), 2026-11-07 · **When/context:** the owner's screenshot in chat
2026-11-07 19:48 +03:00 (no words — the picture is the report; 75 attribute points available, «Опыт 251 100 / 254 230»)

## Goal vector and acceptance

Avoid: a modal the player must read is covered by the page behind it. Done when, on the hub's «Параметры» page with a trait choice pending, the dialog's two
choices («Верная рука …», «Точные удары …») and «Отложить выбор Esc» are fully readable — no tree icon, line or tutorial header over the dialog — at 4K, by frame.

## Symptom (read from the owner's frame)

- The tree of the attribute page (round perk icons, the connecting lines, the left «+» nodes) is drawn OVER the dialog: icons sit on «Точные удары — +10% к
  пробиванию брони…» and on «издалека.»; a lit line runs across the dialog's top row.
- The dialog panel looks semi-transparent — the tree shows through its whole body.
- The tutorial header «ЗАВЕРШЕНО ЭТАПОВ ПУТЕШЕСТВИЯ / Потратьте очки характеристик» sits over the dialog's top.

## Suspects (to be separated by the control case — HOUSE_RULES rule 24)

1. **Ours — `krinik_hub_controller`** (KrinikConanUI, plan 48): it holds the GAME's «Параметры» page at opacity 0 until quiet, then shows it; the dialog is born
   inside that page — a render opacity / ZOrder / visibility set on the page or its children may put the tree above the dialog or keep the dialog translucent.
2. **Ours — the KrinikConanUI kit pak edit of `W_ActionTutorial`** (the tutorial header) — the header over the dialog may come from our layout edit.
3. **Vanilla / another mod** (the trait window of the game, Era of Trials / Heritage perk mods) — only if the control case shows the same without our parts.

## Repro / control case (plan)

Stand: a hero with unspent points at a perk threshold (the owner's save has 75), the hub opened on «Параметры» by the remote (`KrinikHubRequest` / the carousel),
a perk node chosen so the game opens the trait dialog. Frames: (a) as shipped; (b) `krinik_hub_controller` off (its section disabled); (c) KrinikConanUI pak out.
The case is a UI case — a clip, watched (HOUSE_RULES rule 4).

## Decisions made without the owner

- `[AI]` Read as a defect report: the owner sent only the frame.

## Forensics — live read 2026-11-07 19:5x (remote, no input; `_config/widgets-like.lua`, the owner's session)

In the viewport at once: **two `W_Attributes_C`, both VISIBLE — one at render opacity 1.00, one at 0.00**; `W_FeatWindow_C` VISIBLE at opacity 0.00; 12 visible `W_Attribute_C`,
112 visible `W_AttributePerkPip_C` (the tree's round icons). The game keeps ONE attributes window (plan 48: «each native «Параметры» activation kills other stats
windows») — a second one in the viewport is our controller's. Reading `[AI]`: the trait dialog lives in one page while the other page (added later = higher in the
viewport) draws its tree over it; the opacity-0 page/window are the controller's «held until quiet» state left behind. Suspect 1 (`krinik_hub_controller`) is the
prime one; the control case (section off) decides. Fix in the controller (plan 48), not a patch over the dialog (rule 24).

## Twin — the map tab stuck (2026-11-07 20:19, the owner «я что-то нажал, что карда залипла»)

Live read: the hub open on «Карта» with **two `W_FullscreenMap_C` in the viewport — op 1.00 and op 0.00** (the same double-instance pattern). Recovery by the remote 20:20:
both removed from the viewport + `SetInputMode_GameOnly` — the hub then showed an empty «Карта» tab (the owner closes it with Esc / Tab). TWINS: the controller's pages —
«Параметры» (bug 84) and «Карта» — exist twice; the fix in `krinik_hub_controller` must cover every page it holds, not one.

**20:21–20:25 — the owner stuck again («опять!» · «словно ПКМ» · «не отлипло, не погу закрыть!» · «и вверху нет веладок хаба»):** the standalone fullscreen map (no hub
tabs) again with TWO `W_FullscreenMap_C` (op 1 / op 0); releases sent by `mouse-seq` (rup/lup/Shift/Space, then a full RMB and LMB click on the map) did NOT free it;
removing only the op-0 copy did NOT; removing the map and `W_Carousel_C` + `SetInputMode_GameOnly` + cursor off returned him to the world (frame 20:24). So the
stuck state is the duplicate page / modal stack, not a held button (EXP-0484 stays as a hygiene rule, not this cause). A game restart restores the hub. **This bug is
the owner's top debt now:** fix `krinik_hub_controller` so no page / the map exists twice; control case first (the section off → does the map still stick?).

**2026-11-10 03:0x — the same class seen on «Хар-ки» (plan 49 step 1 run, background, the window opened by `ActivateModule(FName('Attributes'), true, false)`):** every
attribute row exists TWICE among the live `W_Attribute_C` (12 rows for 6 attributes; both answer `UpdateView`) — a second attribute page under the shown one, the
dialog-under-the-tree of this bug would sit in the same stack. Control case still owed (the hub section off → one set of rows?). Probe `ConanExiles/_config/attr-page-probe.lua`.
**2026-11-10 03:18 — not reproduced in one try:** a fresh background launch, «Хар-ки» opened once by the remote → `attr-rows-owners.lua` lists SIX rows, all
visible, all owned by one `W_Attributes_C`. The 03:0x run (12 rows) differed by `attr-cap-probe.lua` first and three `attr-page-probe.lua` calls; one try is no verdict —
next variants: open/close/open the window, the hub tab switch, the level-up «+» path.
