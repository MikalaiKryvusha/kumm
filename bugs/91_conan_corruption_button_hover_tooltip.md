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

## Plan

Stand: a hero with a corruption point available (the button shows), «Хар-ки» opened by keys, the real cursor over `LevelCorruptionButton` (`hover-watch.ps1`),
frames; control — our `krinik_hub_controller` off and the KrinikConanUI pak out (rule 24): is the label the game's tooltip drawn without its plate, or ours.

## Decisions made without the owner

- none yet
