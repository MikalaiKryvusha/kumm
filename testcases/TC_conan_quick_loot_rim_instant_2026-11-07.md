# TC — Conan quick loot: the selection rim moves instantly and never hides (the owner's word of 2026-11-07)

> **Created:** 2026-11-07 · on the owner's word 2026-11-07 10:57 (verbatim: «в окне квиклута мы мытались починить рамку выбора предмета. Сейчас у неё есть
> плавные анимации появления, исчезания, переката на следующий предмет - убираем анимации, белаем её переключения с предмета на предмет мгновенными, тем самым
> попробуем починить и баг, что она прыгала в последнюю ячейку - мы его починили но ценой того, что после взялия предмета - рамка на короткий момент исчезает -
> не нужно её прятать даже на короткий момент»)
> **Parent:** bug 75; `testcases/TC_conan_quick_loot_f_take_2026-11-02.md` (B1–B5 — the stand and the old patch)
> **Status:** run 2026-11-07 11:27–12:08 — R1, R2, R5 pass; R3 not run; report `testcases/reports/2026-11-07_conan-quick-loot-rim-instant.md` · **Outbound:** —

## Test basis

The owner's word above: (a) the rim switches from item to item in one frame — no fade in, no fade out, no roll; (b) after an F take the rim never lands on
another cell (bug 75) AND is never absent. Build: KrinikConanUI kit pak with `InventoryGridSlotView.AnimSelect` instant (`kit-conanui-edit.py`, GRIDSLOT
block); the Lua section `krinik_loot_rim` OFF.

## Stand

As B1–B5 (TC of 2026-11-02 § 4): god on, `bash loot-stand.sh` (a humanoid corpse with loot, the hero 1.5 m off), `bash loot-aim.sh` (a real Shift tap, the game
in front), `loot-take-clip.sh` — real wheel steps and a real F at 120 fps (`SEQ=…`); per-frame rim detection `scratchpad rim_yellow.py` (the rim's pixels ≈ RGB
255/250/200 in a 12 px band of each cell).

## Cases

| # | Situation | Action | Expected | Status | Observation |
|---|---|---|---|---|---|
| R1 | the window open (6 items in row 1, 1 in row 2) | the wheel down ×2 (real) | the rim on the next cell in the frame after each step — no frame with two rims or a half-lit one | pass | `rim1.mkv`: step 1 → the rim on cell (0,0) at 2.158 s; step 2 → on (0,1) at frame 239 (2.892 s) in ONE frame, no frame with two rims |
| R2 | the rim on (0,1) | F (real), 120 fps | the rim never on another cell, never absent | pass | F ≈ 3.8 s: the rim on (0,1) in every frame up to 6.125 s (the game went to the background), the next item slid into the taken place under it |
| R3 | the rim on the last item of the row | F | never absent, never elsewhere | not run | the second stand (11:41–11:44) failed: the aim missed, then a corpse with ONE item (taking it closes the window) |
| R4 | control | the vanilla `AnimSelect` | the vanilla jump to the last cell | pass (earlier) | B2 of 2026-11-03 (`b2.mkv`): the rim on row 3 col 6 for 3 frames at 15 fps |
| R5 | control of the open state, the KrinikConanUI pak OUT of the game (vanilla cells) | open the window (real Shift) | the same as with our pak: no rim until the first wheel step | pass | 12:08 frame: no rim on any cell at open (vanilla), as with our pak (`rim1.mkv` 0.9–2.15 s) — the open state is the game's, not ours; the pak back 12:1x |
