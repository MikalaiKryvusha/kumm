# Run report — 2026-10-29 — Conan: the map hint row in the hub «Карта» tab on fast switches

## 1. Work

Cases `testcases/TC_conan_hub_map_tab_hint_row_no_flicker_2026-10-29.md` (H1–H3) — the owner's check after the item-5 fix:
`[OWNER]` «карта красивая, хорошо. проверь, что оно не мерчает при быстрых переключениях в хабе» · 2026-10-29.

## 2. Contour

Conan Exiles 3.0.1, the owner's save, 4K, the build with Simple Minimap KRINIK MODIFIED (pack `ca3793c`); game in the background.

## 3. Runs

- 15:55:36 lock · `launch-bg.ps1` · 15:56:4x `enter-world-remote.sh`; `pult.sh "lua … ActivateModule(FName('CharacterInventory'), true, false)"`; Next ×8 to «Карта»
- 15:57 `capture-window.ps1 -Width 3840` (H1)
- 15:57 `capture-burst.ps1 -Count 60 -IntervalMs 70 -Width 1920` + 6 × `pult.sh "call W_Carousel_C_2147455276 Next|PrevCarouselWindow"` (H2)
- 15:58 `wait-input-idle.ps1 -Min 5` (41 s) · `capture-burst.ps1 -Count 45 -IntervalMs 50` + `mouse-seq.ps1 -Seq "kdown:E,…,kup:Q"` (E,Q,Q,E,E,Q ≈ 230 ms apart) (H3)
- sheets: scratchpad `bar_sheet.py <burst> <sheet.webp>` (bottom bar of every frame with its ms)
- 15:58:3x `close-game.ps1`, release, `deploy-config.py`

## 4. Checks

Hygiene: none new (no code changed).
Functional run: the hub on the owner's save, tabs switched by the game's own calls and by real keys, every frame's bottom bar read.

- H1 pass — the row right of «Сброс маркеров X», apart from the region selector.
- H2 pass — three returns to «Карта», the row at its place from the first frame.
- H3 pass — real Q/E: the row at its place in every map frame.

## 5. Found

none (the vanilla region selector shifts in the first frame of one return — the game's own, not the mod's row).

## 6. Traces

Scratchpad `h1.jpg`, `burst_h2/`, `burst_h3/`, `h2_sheet.webp`, `h3_sheet.webp`; the H3 sheet in
`SvarogsDream/НА ОТСМОТР НИКОЛАЕМ/23 Конан — карта, XP, счётчик кадров/5 …`.

## 7. Verdict

pass.
