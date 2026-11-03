# Test cases — the quick-loot selection rim on an F take (bug 75)

**Created:** 2026-11-02 · **Under test:** the quick-loot window `W_QuickLootPanel` (kit edit of KrinikConanUI) on an F take; our hooks on
`QuickLootPanel:SlotItemAddedOrRemoved` (KrinikConanUI `krinik_ui_fixes`, KrinikConanArchery `sync_later`) · **Version/build:** pack ConanExiles `a848a58`
**Test basis:** `[OWNER]` 2026-11-02 09:10 «при заборе предмета выделенного в окне квик лута по F на мгновение контур выбора перемещается в последнюю нижнюю
правую клетку - некрасиво, он прыгает туда сюда» · «это баг, нужно будет испрравить».

## 1. Goal vector

Achieve: an F take leaves the selection rim on the taken cell (or moves it straight to the neighbour) — no frame with the rim on another cell.

## 2. Requirements under test

| # | Requirement (EARS sentence) | Fit criterion (Scale · Meter · Target) |
|---|---|---|
| R1 | WHEN the player takes the selected item with F, the window shall not draw the rim on any cell other than the taken one or its successor | frames of a 120 fps capture from the press to +0.5 s · count of frames with the rim elsewhere · 0 |

## 3. Coverage matrix

Partitions: the selected cell first / middle; window of a corpse (beast) with ≥ 3 stacks; our build vs control (our two hook sections out). Not covered: chests,
gamepad, a full grid with scrolling.

## 4. Stand

Noon by the remote, `quiet-stand.lua`, god on; `_G.__cf_dist=300` + `corpse-face.lua` + a Shift tap → the quick-loot window open; ≥ 3 stacks put into the
corpse's `ItemInventoryReplicateToAll` by `AddItemTemplate(id, −1, None, n, true, 1, 0)` (the proven call of KrinikConanArchery). Capture: ffmpeg `ddagrab`
120 fps 6 s while `mouse-seq.ps1` presses F (the game in front).

## 5. Cases

| ID | Steps | Expected | Status | Observed |
|---|---|---|---|---|
| B1 | our build: the window with ≥ 3 stacks, F on the first cell, 120 fps | the jump seen or not; frame numbers | fail | 2026-11-02 15:19–15:21: the rim on the last cell for 6 captured frames (≈ 70 ms); AGAIN 2026-11-03 20:15 on the boss corpse «Эника из Киммерии» (7 own items): after F the rim ≈ 5 sampled frames on an empty cell (row 2, col 6) |
| B2 | control: `krinik_ui_fixes` hooks and the archery loot sync out (Lua `enabled.txt` moved out), the same take | the jump present (vanilla) or gone (ours) | blocked — ждёт владельца: with the Lua out the window never opens on a stand; the probe fix waits for his F takes (voice call 2026-11-03 20:4x) | 2026-11-03 19:34: the window did not open over a Kappa corpse under the crosshair (game in front, 120 fps clip `loot-take-clip.sh`), F took nothing — stand notes in bug 75 |
| B3 | after the fix (if any): the same take | no frame with the rim elsewhere | | |
