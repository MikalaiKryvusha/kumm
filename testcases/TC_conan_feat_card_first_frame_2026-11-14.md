# TC — Conan hub «Таланты»: the selected-feat card is complete on the page's first frame (bug 101 item 4)

> **Created:** 2026-11-14 · **Parent:** `bugs/101_conan_hub_switch_bare_world_gear_tab.md` item 4, plan 48 G1 (the owner's goal: a page complete on its first frame)
> **Status:** 🔧 written 2026-11-14 14:5x, not run · **Outbound:** —

## Test basis

The owner's design of the hub (plan 48, verbatim in `krinik_hub_controller.lua` header): «клик выполнен, визуального переключения не происходит, пока новая страница
полностью не соберётся … новая мгновенно одним кадром открывается». Bug 101 item 4: after a switch to «Таланты» our kept page's right column («Уровень -- · Стоимость:
--») fills with the feat card 66–69 ms later — a late change on every visit (`fix3.mp4` 53.46 / 53.53).

## Stand

The 3.1.0 game, the owner's world (slot `Game_1`), background launch (`launch-bg.ps1`), god on, the hub opened by the remote on «Карта» (carousel 7); switches by the
native `CarouselWindow:SetCarouselIndex(1)` (the function a tab click reaches); probe `ConanExiles/_config/feat-select-probe.lua` — a post-hook on
`/Script/ConanSandbox.FeatWindow:SlotFeatSelectionChanged` (context name, opacity, the card's `FeatNameView` text of every live feat page) and a per-tick sampler for
40 ticks after a switch. Real-click recording (F4) — `hubswitch/hub_run.sh`, the game in front, the PC free (rule 30).

## Cases

| # | Case | Steps | Expected | Status | Observation |
|---|---|---|---|---|---|
| F0 | the defect, mechanism | controller ON; Карта / Параметры / Клан / Снаряжение → Таланты by the remote; probe log | the sequence of selection events per page and the card text per tick: when our page is shown its card is «--»/empty, filled ≈ 66 ms later (reproduces item 4) | **partial 15:03** | Карта, Параметры, Клан → Таланты: card at tick 1 = card at tick 40 (no change). Снаряжение → Таланты: card at tick 1, empty from tick 2 (CraftingGUI destroyed that tick) — reproduced as filled → empty, the mirror of the recording; details in bug 101 «Item 4 measured» |
| F1 | control: the game alone | controller section OFF (`krinik_hub_controller` out of `main.lua` SECTIONS for one launch); Карта → Таланты | what the vanilla newborn page shows on its first ticks (card empty or filled, and when) | — | — |
| F2 | the fix: shown only complete | controller ON with the fix; Карта → Таланты ×3, Клан → Таланты, Снаряжение → Таланты | our page's FIRST shown tick carries the final card text (equal to the text 300 ms later); the switch delay ≤ 150 ms | — | — |
| F3 | no hang | fast burst through Таланты (`hubswitch/fast-burst.lua`, 6 bursts) | the final page is always the last target, «ошибок 0», hold timeouts counted, never an empty hub | — | — |
| F4 | the player's path | real clicks at 144 fps, every tab, `hub_switches.py` | the switch to «Таланты»: one changed frame, no late change in the right column | — | — |

Not covered: the gamepad path; a feat bought between visits (bug 97 class — covered by `TC_conan_hub_kept_tabs_stale_2026-11-14.md`).
