# Bug 91 — Conan «Хар-ки»: hovering the purple corruption «+» shows a stray «Оскверненные Характеристики» label in mid-screen

**Status:** 🔴 OPEN · **Severity:** S2 · **Fixing:** after the attribute arrows look pass (plan 49 step 2), same screen
**Version/build:** Conan 3.0.1 build, pack `ba5b348` · **When/context:** tossed by the owner mid-task, 2026-11-10 10:04 +03:00, with a crop of the purple diamond «+» right of the
Сила / Живучесть rows

## The owner's words

`[OWNER]` 2026-11-10 10:04 «вот с этим ещё баг будет, наведи на неё курсор, увидишь» (his crop: the purple circle with the diamond «+» — `LevelCorruptionButton`).

## Symptom (seen by the agent before the note)

On frames of 2026-11-10 09:33–09:35 (`attr_plus.jpg`, `attr_plus10.jpg` of the trait-dialog runs) the text «Оскверненные Характеристики» floats at x ≈ 1170–1515,
y ≈ 572 (1080p), over the right perk column, with no plate behind it — the cursor had passed over the corruption button of the Авторитет row.

## Recon (2026-11-10 12:4x, remote reads, no input)

- The label is the ROW's own text: `W_Attribute_C:WidgetTree.CorruptionLabel` (GeneralText, «Оскверненные Характеристики», Collapsed by default) in
  `CorruptionButtonOverlay` (Overlay: `CorruptionButtonBG` Image, `LevelCorruptionButton` Button, `CorruptionLabel`) inside the SizeBox the game's authors named
  `Danger_IDK_Why_This_Is_Here`, inside `SizeBox_Corruption_Button` (a child of `HB_Info`). The row's EventGraph reads `CorruptionLabel` (show on hover). Every
  live row has it (12 instances — two `W_Attributes` live on the remote path); `W_SorceryRadial.CorruptText` carries the same string (another widget).
- So the label is drawn by the game's widget in an overlay of a small SizeBox — it overflows the box with no plate: the frame of 09:33 (text over the right
  column) matches. Our kit edit of `W_Attribute` (page arrows) does not touch this branch — the control case (vanilla `W_Attribute`) is still owed.
- **Reproduced 2026-11-10 12:4x by a REAL hover** (`hover-watch.ps1 -At 0.635/0.449`, the game in front, owner-idle FREE; frame `hw91/f_01187.jpg` of the
  session scratchpad): the label starts at the purple diamond of Живучесть and runs right over the perk column's text, no plate; the row glows (the game's hover).
  The fix is a LOOK (taste class): variants on a frame for the owner (a plate over / under the diamond, the label to the left, the label hidden) after the control.
- **Control (static), 2026-11-10 12:5x — the defect is the GAME's:** the vanilla `W_Attribute` (`retoc to-legacy` from the game's paks) vs ours (the kit's cooked
  asset), `uaj tojson` both, a script compared the six exports of the branch (`SizeBox_Corruption_Button`, `Danger_IDK_Why_This_Is_Here`, `CorruptionButtonOverlay`,
  `CorruptionButtonBG`, `LevelCorruptionButton`, `CorruptionLabel`) and their slots by content: all the same (only export numbers shift). Our page arrows do not
  touch it. Rule 8: fixed natively in our kit edit of `W_Attribute` once the owner picks the look.
- 12:58 the label shows on hovering the ROW (the cursor on Живучесть's bar, not on the diamond — frame `whl/w1.jpg` of the wheel case W1): the game shows it
  with the row's hover glow, so the fix covers the row hover too.
- **DECIDED 2026-11-10 13:04 +03:00 by the owner — V1** `[OWNER]` «v1 оскверненная плашка над» — the label on a dark plate ABOVE the diamond, centred
  (`81_podpis_oskverneniya/01_V1_plashka_nad_rombom.webp`). To build in the kit: a plate Border around `CorruptionLabel`, shown and hidden with the label.
- **BUILT and seen 2026-11-10 13:47 +03:00** (`_config/devkit/kit-corruption-label-plate.py`, build 2): build 1 put the Border in the narrow overlay — clamped to its width, the
  plate covered «Оскверненн» only (frame `pl1c`); build 2 puts it on a HitTestInvisible CanvasPanel `Cnv_KrinikCorruptionPlate` (auto size, anchored at the
  diamond, aligned (0.5, 1), 26.7 units above) — frame `pl2c` 13:47 (the row's own `Select` by the remote, both live rows): the whole label on the plate,
  centred over the diamond. Left: a REAL hover frame (the PC was busy) and the plate's side padding by the owner's eye (the text sits close to the edges).
- **Bug 86 is the same defect** (the owner's frame of 2026-11-07 21:45: the caption over a perk icon of the right column) — one fix closes both.
- **Variants for the owner 2026-11-10 12:5x:** review folder `НА ОТСМОТР НИКОЛАЕМ/81_podpis_oskverneniya` (V1 plate above · V2 under · V3 the game's place with a
  plate · V4 no label; `ConanExiles/_config/mockups/corruption_label_mockup.py` over a real 4K frame). Waiting for his pick (STATUS «Awaiting human review»).

## Plan

Stand: a hero with a corruption point available (the button shows), «Хар-ки» opened by keys, the real cursor over `LevelCorruptionButton` (`hover-watch.ps1`),
frames; control — our `krinik_hub_controller` off and the KrinikConanUI pak out (rule 24): is the label the game's tooltip drawn without its plate, or ours.

## Decisions made without the owner

- none yet
