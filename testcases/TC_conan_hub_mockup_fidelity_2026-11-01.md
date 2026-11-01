pass 05:11 — a real click on KrinikConanUI: page ui, the dark box and bar moved (frame g2) |pass 05:12 — closed, log «closed (без сохранения)», store unchanged |pass 05:12 — reset: 90 %, «Крафт» checked, store unchanged (frame g4, log «reset to defaults (not saved)») |pass 05:12 — reopened: 70 %, «Крафт» unchecked (frame g5) |pass 05:11:57 — KrinikSettings.lua holds exactly ui_blink_weight 0.7 and ui_craft false; log «store written: 2 keys» |pass 05:11 — a real click on «Крафт…» box: the inner square gone, log «click: check ui_craft → false» |pass 2026-11-01 05:11 (pak 1) — real drag on «Мигание веса» 90 → 70 %, the value text followed (frame g3) |# Test cases — the «Моды Krinik'а» window reaches mockup 5 (the fidelity pass)

> **Created:** 2026-11-01 · **Parent:** `[OWNER]` «из этого кадра явно видно, что макет красивый, а реализация в игре - нет» · 2026-11-01 04:40 (frame
> `39_hub_look/2_maket_i_igra.webp`); plan 38 phase 2; the mockup — pack `_config/settings_hub/mockups/mockups.html?v=5` (CSS = the reference numbers)
> **Status:** ALL PASS 2026-11-01 05:20 (report testcases/reports/2026-11-01_conan-hub-mockup-fidelity.md); F1–F7 first on pak 1 (2026-11-01 05:11–05:12); P-rows after pak 2 (sizes). Cases written 2026-11-01 04:56 +03:00, not run
> **Outbound:** — (the owner's eye on the side-by-side frame)

## Test basis

The approved mockup 5 (`[OWNER]` «макет одобрен» · 2026-10-31 19:09) is the reference; its CSS is read for every number (colours, sizes, spacing).
Parity inventory — one row per element of the mockup; delivery is judged BY THE ROWS and by one side-by-side 4K frame (mockup | game).

## Stand

Conan Exiles 3.0.1 with the full build; the owner's save restored from the latest `_save-backup/` copy after the run; `Saved/SaveGames/` copied first
(EXP-0417); background launch `launch-bg.ps1`, `enter-world-remote.sh`, `god-on.sh`, the inventory open; the window opened by the remote
`ActivateModule('KrinikModSettings')`; real mouse by `mouse-seq.ps1` (a dummy click first, EXP-0412); frames by `capture-window.ps1 -Width 3840`.
`KrinikSettings.lua` of the owner copied before and restored after (saves in the cases write it).

## Parity inventory (mockup 5 → game)

| Id | Element | Mockup 5 (CSS) | Expected in game | Status |
|---|---|---|---|---|
| P1 | panel | `rgba(30,31,33,.94)`, 1 px rim `rgba(200,196,186,.38)`, no texture | flat near-black neutral plate, thin light rim, no blue-grey texture | pass 2026-11-01 (pak 2, report 2026-11-01_conan-hub-mockup-fidelity.md) |
| P2 | font | Cambria / Georgia serif | PT Serif (Cyrillic and Latin both serif) in every text of the window | pass 2026-11-01 (pak 2, report 2026-11-01_conan-hub-mockup-fidelity.md) |
| P3 | title | caps, `.08em`, «МОДЫ KRINIK'А» bold · «·» grey `#9a968d` · «НАСТРОЙКИ» regular | three parts, letter-spaced | pass 2026-11-01 (pak 2, report 2026-11-01_conan-hub-mockup-fidelity.md) |
| P4 | rules | 1 px `rgba(200,196,186,.22)`; list rule `.16` | thin neutral-light lines, not warm brown | pass 2026-11-01 (pak 2, report 2026-11-01_conan-hub-mockup-fidelity.md) |
| P5 | list | names `#b5b1a8` 12 px; selected: bg `#18191a`, text `#f2eee5`, a 2 px light bar at the left | the same | pass 2026-11-01 (pak 2, report 2026-11-01_conan-hub-mockup-fidelity.md) |
| P6 | slider | track 2 px `#6d6a64`, thumb 4×10 `#e8e4da`, 120 px | thin track, small light rectangle thumb, no diamond | pass 2026-11-01 (pak 2, report 2026-11-01_conan-hub-mockup-fidelity.md) |
| P7 | value | plain bold text right-aligned `#ece8df`, with the unit («10 %») | no edit box, the unit shown | pass 2026-11-01 (pak 2, report 2026-11-01_conan-hub-mockup-fidelity.md) |
| P8 | checkbox | 12 px square rim `#bdb9b0`, ON = inner square `#e8e4da` inset 2 | no yellow tick | pass 2026-11-01 (pak 2, report 2026-11-01_conan-hub-mockup-fidelity.md) |
| P9 | buttons | flat `#18191a`, rim `rgba(200,196,186,.18)`, text `#e6e2d8`, no key glyph | flat dark buttons with a thin rim | pass 2026-11-01 (pak 2, report 2026-11-01_conan-hub-mockup-fidelity.md) |
| P10 | «i» | 12 px circle rim `#8e8a82`, letter `#bdb9b0` | a thin grey circle | pass 2026-11-01 (pak 2, report 2026-11-01_conan-hub-mockup-fidelity.md) |
| P11 | plate | `rgba(18,19,20,.98)`, rim `rgba(200,196,186,.45)`, caps title | dark plate, light rim (not gold), caps title | pass 2026-11-01 (pak 2, report 2026-11-01_conan-hub-mockup-fidelity.md) |

## Functional cases

| Id | Action | Expected | Status |
|---|---|---|---|
| F1 | drag a slider thumb with the real mouse | the thumb follows, the value text changes in steps of the row (≤ 100 ms) | pass 2026-11-01 05:11 (pak 1) — real drag on «Мигание веса» 90 → 70 %, the value text followed |
| F2 | click a checkbox | the inner square appears / disappears | pass 05:11 — a real click on the «Крафт…» box: the inner square gone, log «click: check ui_craft → false» |
| F3 | «Сохранить» after F1/F2 | `KrinikSettings.lua` holds the new values; the section reads them (its log line) | pass 05:11:57 — KrinikSettings.lua holds exactly ui_blink_weight 0.7 and ui_craft false; log «store written: 2 keys» |
| F4 | reopen the window | the controls show the stored values | pass 05:12 — reopened: 70 %, «Крафт» unchecked |
| F5 | «Сбросить к исходным» | the page's controls go to their defaults (not saved) | pass 05:12 — reset: 90 %, «Крафт» checked, store unchanged (log «reset to defaults (not saved)») |
| F6 | «Закрыть без сохранения» | the window closes, the store unchanged | pass 05:12 — closed, log «closed (без сохранения)», store unchanged |
| F7 | a mod name click | its page shows, the selected look moves | pass 05:11 — a real click on KrinikConanUI: page ui, the dark box and the bar moved |
| F8 | «i» hover and click | the plate at the cursor, pinned by a click | pass 05:18 by a click (pinned plate); hover not observable via mouse-seq (focus returns) |
| F9 | 720p · 1080p · 2K · 4K | every text readable, nothing cut (house rule 17) | pass 05:19 — one layout at all four, nothing cut |
| F10 | the window closed | the LMB bind and the watch chain idle (log «watch stopped») | pass 05:19:46 — «watch stopped», a world click logged nothing |
| V1 | the side-by-side 4K frame mockup 5 | game, same page and plate | looked at by the agent; the owner's eye | looked at by the agent 05:20 — the same look; the owner's eye: folder 41_hub_kak_maket |
