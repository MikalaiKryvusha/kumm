# TC — fullscreen map hint vs «Сброс маркеров» (bug 64 item 5); the hero's Agility in the character window (plan 36 W16 finding)

> **Created:** 2026-10-29 · **Parent:** bug 64 item 5 (SMM hint over the vanilla «Сброс маркеров [X]»), the finding of
> `TC_conan_quick_batch_xp_space_locomotion_fps_events_2026-10-29.md` (int stats 14–40 read 0)
> **Status:** run 1 2026-10-29 15:45–15:47: M1 fail (overlap confirmed), A1/A2 pass (not a defect); fix — Simple Minimap pak, `SM_UI_MapHelper`
> padding; run 2 15:50–15:51: M2, M3, R1 pass; frames to the owner — «НА ОТСМОТР НИКОЛАЕМ/23 Конан — карта, XP, счётчик кадров»
> **Outbound:** —

**Basis.** Item 5: rows 4514/4515 are already short in the built `Game.locres` («Новый маркер», «Свои маркеры»); the owner's frame of 26.10 showed the
old long text over the vanilla button. Finding: `GetIntStat(14..19, 0)` = 0 on the level-50 hero — what does the game itself show?
Fix after M1: `_config/localization/asset-strings/Simple_Minimap__SM_UI_MapHelper.tsv` — `AddMarkerSection.HorizontalBoxSlot_5/Padding/Left` 30 → 355
(the first element of the mod's row; +325 UI units = 680 px at 4K), pak rebuilt by the manifest recipe with the third asset.

**Stand.** The owner's save, the beach, 4K, game in the background. The map by a real M (`_config/esc-when-idle.ps1 -Key 0x4D`, after the owner's
input idle); the hub by the remote `ActivateModule(FName('CharacterInventory'), true, false)` and `W_Carousel_C:NextCarouselWindow()` ×2 to «Хар-ки».
Techniques: frame reading; comparison of the game's own number with the remote read; before/after from the same screen.

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| M1 | Map hint row does not overlap the vanilla button (before the fix) | M, 4K frame of the bottom bar | «Новый маркер», «Свои маркеры» and «Сброс маркеров [X]» each readable, no glyph on another | **fail** 15:46 — «Shift + мышь Новый маркер» lies on «Сброс маркеров [X] ?» (vanilla frame x 22…703 px, the mod's row from x≈65) |
| A1 | Agility in the character window | hub → «Хар-ки», 4K frame | the six attributes with numbers; Agility = N | pass 15:46 — all six 0, «Доступные очки 52», «Опыт: 119 535 / 123 087» |
| A2 | The remote read vs the window | compare A1 with `GetIntStat(19, 0)` | equal → the hero's Agility is really N; different → 3.0.1 keeps attributes elsewhere | pass — 0 = 0: the read is right, the points are unspent after the 3.0 reset (not a defect) |
| M2 | After the fix: the row clears the vanilla button | rebuilt pak deployed, M, 4K frame | the mod's row starts right of x 703 px; «Сброс маркеров [X] ?» clean; the row ends left of the region selector | pass 15:51 — «Сброс маркеров [X]» clean; the row «Shift + мышь Новый маркер ?» · «Shift + мышь Свои маркеры» · magnifier starts right of the button and ends before «◁ Земли изгнанников»; the «?» is the mod's `btn_Info` (not vanilla) |
| M3 | After the fix: the mod's buttons still work | the remote: the row's `btn_Search` / `btn_Info` exist and are visible; Shift + click is the mod's own path (not run) | both buttons present and visible | pass 15:51 — remote: `btn_Search=true btn_Info=true` (valid and visible); the click itself not run |
| R1 | Minimap HUD unchanged by the rebuild | world, 4K frame top-right | coordinates above the minimap whole, minimap at its place (bug 64 item 19 kept) | pass 15:51 — «-80231, 252474» whole above the circle, the circle at its corner, clock 15:51 |
