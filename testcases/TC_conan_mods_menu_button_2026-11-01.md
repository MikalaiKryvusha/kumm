# TC — «Настройки модов» in the inventory's bottom bar (plan 40.3, step 1: the button opens «Моды Krinik'а»)

> **Created:** 2026-11-01 · **Basis:** `plans/40_epic40_phase3_inventory_button_list.md` (criteria 1, 3 — the first slice); `[OWNER]` 2026-10-31 19:09 «в окне
> персонажа внизу кнопка Настройки модов» · 2026-11-01 15:43 «когда кнопки для настройки модов переделывать будешь?»

## Stand

The game in front, world entry by the remote, the inventory by a real Tab (after the world settles), clicks by the real mouse (`mouse-seq.ps1`), frames 1080p.

| ID | Situation | Action | Expected | Status | Observed |
|---|---|---|---|---|---|
| B1 | the inventory open on «Снаряжение» | frame of the bottom bar | «Настройки модов» in the vanilla look, beside «Настройки интерфейса» and «Настройка рыбалки» | pass | 15:47 frame `b1d.webp`: the button in the row, gap 20; label by the button's own `SetLabel` (`TxtLabel:SetText` is overridden — 15:46) |
| B2 | as B1 | a real click on «Настройки модов» | the «Моды Krinik'а» window opens over the inventory | pass | 15:48 frame `b2.webp`: the hub over the inventory, the button visible below; log «window … opened: filled ok in 9.00 ms» |
| B3 | the inventory closed and opened again (three times, real Tab) | the remote counts visible `WBP_ButtonBase_C` in the left bar | one button, not two | pass | 15:51: 1 |
| B4 | the inventory closed, the world | a real LMB at the button's screen place | nothing opens | pass | 15:51: hub openings in the log by that click — 0 |

## Step 2 — the list and the bar cleared (plan 40.3 R3, R4, I1–I4; `[OWNER]` 2026-11-01 15:49 «она там одна должна остаться» · «настройки рыбалки и настройки интерфейса оттуда уходят» · «красная справа вертикальная по модам ксавьера - тоже уходит»)

Stand: as above; god on (`_config/god-on.sh`), food and water refilled; the place — the live save's spot (no enemy within 60 m checked by a frame before the run).
Dimensions: the bar (3 removed + 1 kept), the list (4 entries, order), each entry's window, the sub-lists (Xevyr, «Прочее»), Esc, one-window rule, closing the list
by a click outside, cost while closed. Not covered here: 720p / 2K / 4K frames (plan 40 phase 6 gate).

| ID | Situation | Action | Expected | Status | Observed |
|---|---|---|---|---|---|
| B5 | the inventory open on «Снаряжение» | frame of the bottom bar and the right edge | only «Настройки модов» in the bar; no «Настройки интерфейса», no «Настройка рыбалки»; no red vertical «Моды Xevyr» tab | pass | 16:37 frame (1080p) and 17:02 4K: only «Настройки модов» at the left of the bar; log «кнопка Hosav … скрыта (1)». Xevyr side tab: the first two builds failed (root collapse — re-shown by the window's Open; birth + next tick — the 17:13 60 fps video showed the tab for at least 2 frames on the return from «Таланты»); fixed by the post-hook on the window's `Construct` — the 17:15 video (ddagrab, every frame of the first open and two returns) shows no tab |
| B6 | as B5 | a real click on «Настройки модов» | a vertical list: «Моды Krinik'а» · «Моды Xevyr'а» · «Рыбалка» · «Прочее» | pass | 16:38 real click: the list above the button in that order; 17:02 4K frame: one font (Noto Sans) in every entry, the list exactly the button's width (the first build mixed Cardo SC capitals and a sans in one word — fixed) |
| B7 | the list open | a click on «Моды Krinik'а» | the Krinik hub opens, the list closes | pass | batches 16:53 and 17:03 (real mouse, all 12 windows): KrinikModSettings opened, the list closed |
| B8 | the list open | a click on «Моды Xevyr'а» | the list shows Xevyr's mods with settings; a click on one opens its settings window | pass | sub-list «‹ Назад», Al-Merayah Reborn, Lore & Loot Highlight, Proximity Party, Simple Minimap, The Damage Meter (4K frame 17:00); each of the five opened its window by the real mouse (two batches) |
| B9 | the list open | a click on «Рыбалка» | the fishing settings window opens | pass | 16:45 and both batches: ExilesFishingTuning open over the inventory |
| B10 | the list open | a click on «Прочее» | the list shows the other authors' mods; Hosav's entry opens Hosav's settings window | pass | 16:42 «Прочее» → «Hosav's Custom UI» → Hosav's window over the inventory; both batches: Emberlight, EAA, Hosav, Night Terrors, PIFC each opened |
| B11 | an entry's window open over the inventory | real Esc | the window closes, the inventory stays | pass | after the native row edit (Modal + CloseOnESC, 8 mods): 12 of 12 windows — Esc closes the window, `CharacterInventory` stays active (16:53, again 17:03). Before the edit Esc also closed the inventory under Damage Meter, Proximity Party, Simple Minimap (Popup, CloseOnESC false), EAA (Popup), Emberlight and PIFC (Fullscreen). Live row edits on modules not yet created proved the pair: CloseOnESC alone fixed Lore & Loot (already Modal); EAA with CloseOnESC but Popup failed |
| B12 | «Рыбалка» window open | the list → «Моды Krinik'а» | one mod window open, not two | pass | 16:56: fish=false krinik=true inv=true, log «закрыто других окон: 1» |
| B13 | the list open | a click outside the list | the list closes, nothing opens | pass | 16:58 and 17:03: a click on the sand at (0.33, 0.62) — the list Collapsed (vis 1), no window opened |
| B14 | the inventory closed | the remote: 1000 calls of the LMB bind body | < 0.02 ms per call | skipped | not measured: with the inventory closed the bind body is `if not shown then return end` (one upvalue test); 17:04 a real LMB at the button's place with the inventory closed opened nothing |
