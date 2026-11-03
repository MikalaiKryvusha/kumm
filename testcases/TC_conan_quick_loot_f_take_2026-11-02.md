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
| B2 | control: `krinik_ui_fixes` hooks and the archery loot sync out (Lua `enabled.txt` moved out), the same take | the jump present (vanilla) or gone (ours) | pass — the jump is the GAME's | 2026-11-03 21:43 +03:00 (both `enabled.txt` moved out, a fresh start, `loot-stand.sh` + `loot-aim.sh`, clip `b2.mkv`): after F the rim stands on the bottom-right cell (row 3, column 6) for 3 frames at 15 fps, then on the taken place. Earlier tries (19:34, 20:23) failed on the stand: a Kappa corpse has no loot, the hero 3 m off never opened the window |
| B3 | after the fix — `krinik_loot_rim` 0.1.0 loaded hot by the remote (the owner's way 2026-11-03 21:26: the other cells' rims invisible while the old one would flicker): humanoid corpse, wheel to a middle cell, F | no frame with the rim on another cell; the rim back on the same place, on the item that slid in | pass (hot load) | 2026-11-03 21:40 +03:00 clip `fix5.mkv`: wheel to row 1 col 4 (arrows ×22), F → no rim anywhere for ≈ 0.4 s (rows 2–3 in the crop clean), then the rim on row 1 col 4 (the next item, slid into the taken place); counters «selections 7 reads 6 last row 1, column 4». Before the fix the same stand (`take4.mkv`, `take6.mkv`): 3–4 frames of 50 ms with the rim in row 3 |
| B4 | edge: the LAST item of the row taken (nothing slides in) | no rim elsewhere; the rim then on the previous item | pass (hot load) | 2026-11-03 21:40 +03:00 clip `fix6.mkv`: the amulet at row 1 col 5 taken — no rim for ≈ 0.2–0.3 s, then the rim on row 1 col 4 (the game's own choice); no frame in rows 2–3 |
| B5 | B3 after a normal game start (the section loaded by `main.lua` from the deployed mod, not by the remote) | as B3; the log line «section krinik_loot_rim: loaded» | pass | 2026-11-03 21:49 +03:00 after `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI` and a fresh start: the log «section krinik_loot_rim: loaded»; clip `b5.mkv` — the helmet at row 1 col 2 taken, no rim ≈ 0.3 s, no frame in rows 2–3, then the rim on row 1 col 2. Report `testcases/reports/2026-11-03_conan-quick-loot-rim-hold.md` |
