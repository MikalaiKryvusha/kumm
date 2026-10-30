# Test cases — Conan: the corpse prompt on two lines (plan 36 W6)

> **Created:** 2026-10-30 · **Parent:** plan 36 W6, bugs/64 item 36, T1 of `TC_conan_loot_panel_hidden_and_hold_prompt_2026-10-28.md` (fail: layout)
> **Status:** written 2026-10-30 18:32 +03:00, before the run · run 1 18:32–18:54 (B1, M1, P1 with pad 2) · pad 8 built 18:58, its run waits for the owner's game (he launched it himself at 18:55)
>
> **Correction of the fix idea (18:4x, before the build):** `PreText` stays justify RIGHT — LEFT would put the icon right of the whole line 1 and leave
> a gap after «или нажмите». Only the vertical alignment changes. Variant «…, или заберите предметы: [E]» dropped: the owner's word is the break before
> «или» (`vanilla-override.py` header: «переносить на две строки … со слова "или" - на второй строке писать»).
> **Outbound:** the owner's eye on the two-line frame

**Basis.** The target (T1, 2026-10-28): line 1 «Разделайте труп и получите ресурсы», line 2 «или нажмите [E], чтобы забрать предметы», the E icon in
place. The row is the shared `W_ActionTutorial` (`PreText` · `Icon` · `PostText`); kit probe 2026-10-30 18:3x (`_config/devkit/kit-probe-action-tutorial.json`):
`PreText` justification RIGHT, all three slots VAlign CENTER, paddings `PreText` R 4, `Icon` L/R −2, `PostText` L 4; font CrimsonPro 14.
**Fix idea:** `PreText` justification LEFT; `Icon` and `PostText` VAlign BOTTOM with bottom padding p = (icon height − text line height) / 2, so a
one-line prompt keeps its look and line 2 of a two-line `PreText` stands centred on the icon. Text: the vanilla-override row «…ресурсы\nили нажмите {0}…» on.

**Stand.** The owner's oasis save (copy `_save-backup/2026-10-30_1831-before-w6-corpse-prompt`), background launch (`launch-bg.ps1`, the owner's word 18:23),
god mode `god-on.sh`, a corpse by `corpse-stand.sh 50` (the oasis boss at 43 m), the hero walked/teleported to the corpse so the strip shows;
frames `capture-window.ps1` 4K in the background. Mixer: Conan 1 % (`set-app-volume.ps1`, the owner's word 18:21).

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| M1 | Measure the row | remote: live `W_ActionTutorial_C` in `WBP_ContainerInfo`, `GetDesiredSize` of `Icon`, `PreText` (one line) | two numbers → p | **blocked → by frame**: the remote cannot call `GetDesiredSize` / `GetCachedGeometry` («attempt to call a TrivialObject value»); B1 frame: icon 42 px tall = 20 units at scale 2.09; p guessed 2 |
| B1 | Baseline (before the edit) | corpse strip frame, one-line vanilla-pak text | «Разделайте … или нажмите [E], чтобы забрать предметы» on one line; the reference for S1 | **pass** 18:35 (`w6/b1b.jpg`, a crocodile on the hero killed first — interference): one line; icon rows 1059–1101, text ink 1066–1115 → icon centre 10.5 px ABOVE the text-ink centre |
| P1 | Two lines | after the kit pak + override: the same corpse, frame | line 1 «Разделайте труп и получите ресурсы» left; line 2 «или нажмите [E], чтобы забрать предметы», E centred on line 2 | **pass (layout), fail (icon height)** 18:51 (`w6/p1n.jpg`): two lines, line 2 continuous «или нажмите [E], чтобы забрать предметы», line 1 right-aligned above it (a staircase); icon centre 2 px BELOW the text centre — 12.5 px lower than B1 → pad 8 (= 2 + 12.5 / 2.09) |
| P1b | Two lines, pad 8 | the same, pak of 18:58 | icon centre ≈10 px above the text-ink centre, as B1 | waits (the owner's game) |
| S1 | One-line prompts unchanged | any other one-line action prompt (the same strip on a container or the hold prompt) before/after | text and icon on the same height as in B1 (≤ 1 px at 4K) | waits; with pad 2 it would FAIL (the icon 12.5 px low) |
| C1 | Control | override row off, kit pak on | one line again, as B1 (the layout edit alone changes nothing visible) | |

Not covered: 1080p (the layout is in UI units, scale-free); gamepad icons.
