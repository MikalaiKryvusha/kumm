# TC — Fishing panel: difficulty captions separated by bars, evenly spaced (plan 36 W18a)

> **Created:** 2026-10-30 · **Parent:** plan 36 W18a; `[OWNER]` «вот тут подписи сложности нужно чем-то разделить, может вертикальными чертами и расставить
> на равномерном расстоянии, это подпись к ползунку» · 2026-10-30 ≈08:15
> **Status:** cases written 16:42 before the run
> **Outbound:** the look — the owner's eye

**Basis.** `KrinikConanUI:PauseGameInMenu` 0.14.0 `fix_fishing_captions` (1 s after `ActivateModule ExilesFishingTuning`): `Txt_Preset0` gets the four
words joined by « | », centred; `Txt_Preset1..3` collapsed. Before: frame 16:39 — «Легко Спокойно      Строже Ваниль». Techniques: before/after on one
stand, a re-open (the panel class reloads), a control (the big current-difficulty label and the slider untouched), the log line.

**Stand.** Background launch path; the owner's save copied and restored by `save-restore.sh`; the panel by `ActivateModule('ExilesFishingTuning')`;
frames by `capture-window.ps1` (4K) after ≥ 1.5 s.

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| C1 | Captions on the first open | open the panel, wait 1.5 s, frame + crop | one line «Легко  \|  Спокойно  \|  Строже  \|  Ваниль», equal gaps, centred under the slider, nothing overlaps | pass (16:46) — one line, equal gaps, exactly the slider width (separator: one space each side of the bar; two spaces or thin spaces overflowed the column by 17 px — tried live 16:44) |
| C2 | Log | UE4SS.log | «подписи сложности рыбалки: одной строкой через черты в 1 панелях», no error line | pass — one line per open (2), no error |
| C3 | Re-open | close the panel (`TryCloseWindow` of the live panel), open again, wait 1.5 s, frame | the same one line (the fix re-applied to the new instance) | pass — the same line after TryCloseWindow + a new open |
| C4 | Control | the same frames | the big label of the current difficulty («Ваниль») and the slider unchanged; the «Своё» button in place | pass — label «Ваниль», slider, «Своё» unchanged on all frames |
