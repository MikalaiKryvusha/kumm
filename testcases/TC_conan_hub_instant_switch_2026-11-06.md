# TC — Conan hub: a tab switch is instant, no dark wave, nothing late (bug 64 items 15/17)

> **Created:** 2026-11-06 · **Parent:** `bugs/64_conan_mod_ui_wave_overlaps_untranslated.md` items 15/17 · **Status:** run 2026-11-06 21:26–21:53 — W1, W2 pass (build 2); S1 fail — vanilla page assembly, the owner's fork; L1 partial. Report `testcases/reports/2026-11-06_conan-hub-instant-switch.md`
> **Outbound:** —

## Test basis

The owner's acceptance, verbatim (2026-11-06 21:00): «и ещё там есть такой эффект темной волны на неёокторых страниах хаба - он нахуй не нужен. Страницы
должны переключаться четко и мгновенно. Однга закрылась - в следующем кадре полностью отрисованная новая в полноценном виде, на ней ничего не прялет, не
открывается, не дорисовывается.» His test design (20:59): every tab, random order, a REAL mouse click on the tab, clips long enough for elements that come
seconds later (the hero's page first).

Findings this rests on (review folder 69, measured 2026-11-06 21:0x by `scratchpad/hub_anatomy.py` — per-frame luma, diff to the previous frame, blend
coefficient between the old and the new page): every switch shows 2–10 frames where both pages are drawn; «Снаряжение» ↔ «Таланты» adds a dark band sliding
over the screen for 280 ms (forward) / 430 ms (back) — the vanilla `W_Carousel.AnimBackgroundFadeOut` (`MaskOffset` 0 → 1, 0.5 s), made one tick long in
`KrinikConanUI` (kit pak, 2026-11-06 21:20).

## Stand

- Game: `D:\Games\Conan Exiles 3.0.1`, the build with the new `KrinikConanUI.pak`; HDR off for the recording (`hdr.ps1 off`), on after.
- The hero in the world, the hub opened by the remote (`ActivateModule(CharacterInventory)`); the game in FRONT (real clicks — `mouse-seq.ps1`).
- Recording: `ffmpeg -f lavfi -i ddagrab=framerate=144:draw_mouse=0` (the game renders ≈ 90 fps), one file for the whole click sequence.
- Measure: `hub_anatomy.py` over a 4.5 s window after each click; frames at full resolution where the numbers move.

## Dimensions

Tabs (9 — `W_Carousel.CarouselWindowNames`): CharacterInventory «Снаряжение», FeatWindow «Таланты», Attributes «Хар-ки», CharacterStatsWindow «Параметры»,
ExilesJourney «Путешествие», Guild «Клан», Followers «Спутники», FullscreenMap «Карта», Stores «Базар». Entry points: mouse click (this run); Q/E — not
covered (synthetic keys do not reach the game, 2026-11-06). Direction: to and from «Снаряжение» (the only tab without the dark backing) — both. Not covered:
controller input, 1080p / 2K (the hub layout does not change with the switch effect).

## Cases

| # | Situation | Action | Expected (observable) | Status |
|---|---|---|---|---|
| W1 | Hub open on «Снаряжение» | a real click on «Таланты» | no dark band: luma settles within 1 frame of the switch (no rise-then-fall over ≥ 3 frames) | build 1 FAIL 21:26 — no band (luma 46 → 32 in one frame), BUT the backing stayed on «Снаряжение» (frame 21:31; the owner 21:30). **Build 2 PASS 21:41** (`run2.mp4`): no luma walk on any of 11 switches; «Снаряжение» see-through again (frame `inv_b2.jpg` 21:40); the vanilla control (`run4.mp4`, no mod paks 21:52) shows the band back — luma 89 → 77 → 68 → 62 → 57 → 53 → 45 → 34 over ≈ 260 ms. Left: 2–6 frames of the bare world under the empty new page on leaving «Снаряжение» — vanilla too (S1) |
| W2 | Hub on «Таланты» | a real click on «Снаряжение» | the same, back | build 1 FAIL 21:26 — a one-frame switch, but the backing not removed (the see-through hub lost). **Build 2 PASS 21:41** — «Снаряжение» arrives in one frame with the world showing, no band (switches @13.97, @48.17 of `run2.mp4`) |
| S1 | Each of the 9 tabs reached by a click, random order (sequence below) | the click | the change after the click lasts ≤ 2 frames (blend coefficient 0 → 1 with no frame between 0.1 and 0.9), and no frame differs from the previous one above noise (mean diff ≤ 0.3, < 300 px over 24) from +3 frames to +4.5 s | build 1 FAIL 21:26 (`run1.mp4`, 11 clicks): the carousel switch is 1 frame, but every page assembles 4–6 frames after it (Хар-ки perks on one line, then unfold; Таланты empty cells, the header row jumps; Снаряжение panels missing 4 frames) — bisect next. **Bisect 21:46–21:53: FAIL, VANILLA** — the same late changes with the hub slowdown off (`run3.mp4`, `ui_menu_slow` 1, no «замедление времени» line in the log) and with NO mod paks (`run4.mp4`, `modlist.txt` → `.off`): «Хар-ки» +21/+42 ms 14.8k/11.4k px (build: +28/+56/+69), «Параметры» +21 ms 22.7k px. The page assembly is the game's own; a fix is a fork for the owner (asked in chat 21:5x) |
| L1 | «Снаряжение» after a switch | watch 4.5 s | no element appears, moves or changes later (the hero's page: mod icons, «Аксессуары», the emblem) | build 1 21:26 partial: on «Снаряжение» nothing changes after +62 ms (both arrivals); on «Параметры» a 76-px-wide strip changes at +3.3 s — to read in build 2 |
| C1 | Control: a hub switch with the OLD KrinikConanUI pak (folder 69 clips c01, c10) | — | the band present (280 / 430 ms) — proves the measure catches the defect | pass (folder 69, measured 21:0x) |

Click sequence (random, every tab at least once, «Снаряжение» left and entered twice): Снаряжение → Карта → Таланты → Снаряжение → Базар → Хар-ки → Спутники
→ Параметры → Клан → Путешествие → Снаряжение → Таланты.
