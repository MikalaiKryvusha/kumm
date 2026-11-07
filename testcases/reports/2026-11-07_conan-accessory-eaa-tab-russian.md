# Run report — Conan: the Accessory System «Снаряжение EAA» tab in Russian (bug 64 item 27)

## Work

Bug 64 item 27 (the owner's screenshot 2026-10-26 22:19 «смотри, какой ужас в аксессуарах»): cell captions wider than the cells, rows shifted, the legend past the
edge; the fix — shorter captions and a regrouped legend in the build's translation (`_config/localization/locres-fixes-2026-11-07.tsv`, source `dm-fish-ru.tsv`).

## Contour

Conan Exiles 3.0.1 build, background game at 3840×2160; translation `KrinikConanRussianTranslation` (pack `f007d6e`) deployed by
`Deploy-ModPack.ps1 -PackDir ConanExiles -Deploy -Only KrinikConanRussianTranslation`.

## Runs

- 2026-11-07 08:54–08:57 — before: inventory by `ActivateModule(CharacterInventory)`, the «Аксессуары» button by its click event, the tab by
  `W_acs_Wardrobe_C:ButtonToggled(<«Снаряжение EAA»>, true)`; frame `acs4.jpg`.
- 08:57–08:58 — `python -I -X utf8 devkit/locres-set-tr.py localization/Game/ru/Game.locres localization/locres-fixes-2026-11-07.tsv`, `locres-regress.py` (54 457 →
  54 457, lost 0, changed 8), the deploy.
- 08:59–09:00 — after: the same path, frame `acs5.jpg`.

## Checks

Hygiene: `locres-regress.py` — lost 0, changed 8; the tool's own source guard (it refused until `dm-fish-ru.tsv` carried the new text).
Functional run: the real build, the window opened by the button's own event and the tab by the window's own handler (the player's click path, called directly);
READ: the two frames.
- Before: «(ПРОСЛАВЛЕННЫЙ ТОРГОВЕЦ)» out of the cells, rows 2–3 shifted, the legend cut by the screen edge («прославленный торгове…», «выдает адми…»).
- After: captions «(ТОРГОВЕЦ)», «(АДМИН)» inside the cells, the rows aligned, the legend's 10 lines on screen.

## Found

- Left: the legend is still wider than its panel (it runs past the window's right edge, on screen); «АДМИРАЛЬСКИЙ» a few px wider than its cell; Latin A–E
  of the fame gems in another font.

## Traces

Frames `acs4.jpg`, `acs5.jpg` in the session scratchpad (working files); `Game.locres.before` there; no crash report.

## Verdict

partial — the cells and the legend read; the legend's width over its panel and the gem letters stay open in item 27.
