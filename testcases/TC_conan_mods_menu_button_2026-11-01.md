# TC — «Настройки модов» in the inventory's bottom bar (plan 40.3, step 1: the button opens «Моды Krinik'а»)

> **Created:** 2026-11-01 · **Basis:** `plans/40_epic40_phase3_inventory_button_list.md` (criteria 1, 3 — the first slice); `[OWNER]` 2026-10-31 19:09 «в окне
> персонажа внизу кнопка Настройки модов» · 2026-11-01 15:43 «когда кнопки для настройки модов переделывать будешь?»

## Stand

The game in front, world entry by the remote, the inventory by a real Tab (after the world settles), clicks by the real mouse (`mouse-seq.ps1`), frames 1080p.

| ID | Situation | Action | Expected | Status | Observed |
|---|---|---|---|---|---|
| B1 | the inventory open on «Снаряжение» | frame of the bottom bar | «Настройки модов» in the vanilla look, beside «Настройки интерфейса» and «Настройка рыбалки» | pass | 15:47 frame `b1d.webp`: the button in the row, gap 20; label by the button's own `SetLabel` (`TxtLabel:SetText` is overridden — 15:46) |
| B2 | as B1 | a real click on «Настройки модов» | the «Моды Krinik'а» window opens over the inventory | pass | 15:48 frame `b2.webp`: the hub over the inventory, the button visible below; log «window … opened: filled ok in 9.00 ms» |
| B3 | the inventory closed and opened again | frame | one button, not two | not run | |
| B4 | the inventory closed, the world | a real LMB anywhere | nothing opens | not run | |
