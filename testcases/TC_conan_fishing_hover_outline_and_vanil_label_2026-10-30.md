# TC — «Настройка рыбалки» lights up gold on hover like «Настройки интерфейса»; the fish card says «ваниль» instead of «исходно» (plan 36 W9, STATUS items 2–3)

> **Created:** 2026-10-30 · **Parent:** STATUS handover 2026-10-29 22:58 items 2–3; `[OWNER]` «да, не хватает обводки» · 2026-10-29
> **Status:** run 2026-10-30 00:31–00:33 on `KrinikPauseGameInMenu` 0.12.0 + `JaarFishing.pak` (fish card 92/66, «ваниль») — H1–H5, V1 pass; waits for the
> owner's eye. Report `testcases/reports/2026-10-30_conan-fishing-hover-vanil.md`
> **Outbound:** —

**Basis.** Hover: the owner's eye 2026-10-29 — the row is right, the gold outline on hover is missing on the fishing button (case R6 of
`TC_conan_hub_fishing_button_next_to_hosav_2026-10-29.md`). The vanilla look (`WBP_ButtonBase`, native `FLXButtonBase`) lights up when the mouse is over IT:
the materials of `ImgFrame` and `ImgBackground` get `PercentHover = 1`; hit-testable, it also eats the click. Fix: the mod's `Btn_Open` (transparent) goes on top
of the look inside the look's own `Overlay_16` — Slate sends mouse-enter to every widget on the cursor path, so the look lights up, the click stays the mod's.
«Ваниль»: the mod's «table» weight is the weight of its «Vanilla» preset (at Ваниль with multipliers 1.00 every tier equals its «(ваниль …)», the per-fish fields
show the table number, «Сбросить на ваниль» returns to it; the author: «Vanilla = the original game») → the owner's term «ваниль».

**Stand.** The owner's save, hero in the world, 4K, game in front; hub by a real Tab; hover by the real cursor (`input.ps1 -Move` + a 4K frame of the bottom row);
the remote for widget-tree reads and one-step UI edits with `IsModuleActive` + `IsValid` checks (EXP-0372). Techniques: state (normal / hovered / after tab switch),
use case (hover each of the two buttons, click), comparison (the two frames in one strip).

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| H1 | Normal look | hub on «Снаряжение», cursor away | both buttons look the same as before (frame, text, size, line) | pass 00:32 — `m-away`: both frames dim, the row unchanged |
| H2 | Hover fishing | cursor on «Настройка рыбалки» | gold frame like Hosav's on hover | pass 00:32 — `m-fish`, `m-fish2`: fishing frame gold, Hosav dim |
| H3 | Hover Hosav | cursor on «Настройки интерфейса» | gold frame (unchanged vanilla behaviour) | pass 00:32 — `m-hosav`: Hosav gold, fishing dim |
| H4 | Click | click «Настройка рыбалки» | the fishing panel opens (the click stays the mod's) | pass 00:32:15 — log «модуль ExilesFishingTuning: открыт», frame of the panel |
| H5 | Tab cycle | «Таланты» and back ×2, hover again | the outline still works after the bar is rebuilt | pass 00:33 — Esc, E ×2, Q ×2 (row re-placed 00:33:01), `t-fish` gold, `t-click` panel open |
| V1 | Fish card word | open the fishing panel, look at the per-fish rows | «ваниль 80,0» etc. instead of «исходно», nothing cut | pass 00:32 — «ваниль 80 / 100 / 90…» in full; the longest names «Обыкновенная форель», «Трясинный глотатель», «Пустынная луна-рыба» whole (widths found live: 100 cut a name, 88 and 93 touched; label 92 + field 66). «ваниль 100» stands close to the field — the only three-digit weight |
