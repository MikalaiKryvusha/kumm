# Run report — 2026-10-29 — Conan: fullscreen map hint row (bug 64 item 5), the hero's Agility in the character window

## 1. Work

Cases `testcases/TC_conan_map_hint_and_agility_window_2026-10-29.md` (M1, A1, A2 before the fix; M2, M3, R1 after it).

## 2. Contour

Conan Exiles 3.0.1, the owner's save, 4K, the Conan build; game in the background. Changed: Simple Minimap pak (KRINIK MODIFIED, third asset
`SM_UI_MapHelper`), library `_krinik-modified/3719513784`.

## 3. Runs

- Run 1: 15:44:56 lock · 15:45:00 `launch-bg.ps1` · 15:46:06 `enter-world-remote.sh` · `esc-when-idle.ps1 -Key 0x4D` + `capture-window.ps1 -Width 3840`
  (map) · `esc-when-idle.ps1` · `pult.sh "lua FindFirstOf('GUIModuleController'):ActivateModule(FName('CharacterInventory'), true, false) …"` ·
  `pult.sh "call W_Carousel_C_2147459013 NextCarouselWindow"` ×2 · `capture-window.ps1` · 15:47 `close-game.ps1`, release, `deploy-config.py`
- Fix: `python -X utf8 _config/devkit/patch-mod-asset.py extract Simple_Minimap SM_UI_MapHelper <work>` (tree read); then
  `patch-mod-asset.py build Simple_Minimap SM_UI_Minimap <work> …SM_UI_Minimap.tsv …SM_UI_Settings.tsv SM_UI_Settings …SM_UI_MapHelper.tsv SM_UI_MapHelper`
  → 11 635 435 bytes; copied to the library (the old pak kept in the scratchpad)
- Run 2: 15:50:10 lock · `Deploy-ModPack.ps1 -Deploy -Only "Simple Minimap"` (1/1, verify 99/0) · `launch-bg.ps1` · 15:51:21 world ·
  `capture-window.ps1` (minimap) · `esc-when-idle.ps1 -Key 0x4D` · `capture-window.ps1` · `pult.sh "lua … SM_UI_MapHelper_C … btn_Search, btn_Info …"` ·
  15:51:5x `close-game.ps1`, release, `deploy-config.py`

## 4. Checks

Hygiene: the build's own guards (write without edits = the source byte for byte; 1 + 2 replacements + 1 bytecode number found); Deploy `-Verify` 99/0.
Functional run: the game on the owner's save — the map opened by a real M, the hub by the remote, 4K frames read.

- M1 fail (before) — the mod's «Shift + мышь Новый маркер» on the vanilla «Сброс маркеров [X]».
- A1, A2 pass — «Хар-ки»: all six attributes 0, «Доступные очки 52»; `GetIntStat(19, 0)` = 0 agrees.
- M2 pass — the vanilla button clean; the mod's row right of it, ends before the region selector.
- M3 pass — `btn_Search`, `btn_Info` valid and visible (the click not run).
- R1 pass — minimap and its coordinates unchanged.

## 5. Found

- The «?» on the map bar is the mod's `btn_Info`, not vanilla (it moved with the row).
- The hero's attributes are all 0 with 52 unspent points — not a defect of `KrinikOblivionLocomotion`; told to the owner.

## 6. Traces

`SvarogsDream/НА ОТСМОТР НИКОЛАЕМ/23 Конан — карта, XP, счётчик кадров/` (before/after map, XP line); scratchpad `m1.jpg`, `m2.jpg`, `a1.jpg`, `r1.jpg`.

## 7. Verdict

pass — item 5 fixed (M2, M3, R1); the look — the owner's eye.
