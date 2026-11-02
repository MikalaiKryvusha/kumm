# Bug 75 — the quick-loot selection rim jumps to the last cell for a moment when an item is taken with F

**Status:** 🔴 OPEN · **Severity:** S3 visual, filed as a document by the owner's word («это баг, нужно будет испрравить») · **Version/build:** pack ConanExiles
`4aca565`, KrinikConanUI 1.0.0 (kit edit of `W_QuickLootPanel` + `krinik_ui_fixes` hooks on `QuickLootPanel:SlotItemAddedOrRemoved`) · **When/context:**
2026-11-02 09:10 +03:00, the owner's play; recorded in STATUS the same minute, this document 2026-11-02 10:4x
**Fixing:** the next game run of this session, after the hub batch (cases B1–B3 below)

`[OWNER]` «при заборе предмета выделенного в окне квик лута по F на мгновение контур выбора перемещается в последнюю нижнюю правую клетку - некрасиво, он прыгает
туда сюда» · «это баг, нужно будет испрравить» · 2026-11-02 09:10.

## Symptom

In the quick-loot window (`W_QuickLootPanel`, a corpse or a chest), the player selects an item and takes it with F: for a moment the selection rim jumps to
the LAST (bottom-right) cell, then comes back. Expected: the rim stays on the taken cell (or moves straight to its neighbour), no flash.

## Repro

A corpse with ≥ 3 items (`corpse-stand.sh 200`), look at it — the quick-loot window opens; select the first item; press F. Seen by eye; a 60 fps clip is
needed (EXP-0430: a frame series misses a 1–2-frame jump).

## Forensics

None yet. Candidates: the game rebuilds the grid on `SlotItemAddedOrRemoved` and the focus lands on the last created cell before the selection is restored
(vanilla), or our hook on the same event (`krinik_ui_fixes` — alignment + the corpse line; `KrinikConanArchery` — the arrow sync) disturbs the focus.

## Hypotheses (ranked)

1. Vanilla: the panel re-creates its slots and the newest slot takes the focus for a frame.
2. Ours: a handler on `SlotItemAddedOrRemoved` (alignment / `SetVisibility` / the arrow sync) triggers a re-layout that moves the focus.

## Fix plan

1. Cases B1 (the jump on a 60 fps clip, our build), B2 (control: `krinik_ui_fixes` and the archery section off — HOUSE_RULES rule 24), B3 (after the fix).
2. Ours → fix our handler; vanilla → find the focus call in `W_QuickLootPanel` (kit) and keep the selection natively.

## Decisions made without the owner

— (open)

## Links

`games/ConanExiles/mods/KrinikConanUI.md` (the kit's `W_QuickLootPanel` row, `krinik_ui_fixes`), `KrinikConanArchery.md` (the loot sync), EXP-0430.
