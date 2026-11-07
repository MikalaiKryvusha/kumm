# Plan 49 — Conan: attributes without the cap of 20, their effects by formula past 20, and the attribute screen that pages past 20

> **Created:** 2026-11-07 · on the owner's words of 2026-11-07 19:50 – 22:02 (verbatim below)
> **Parent:** STATUS «FIRST NEXT CHAT» items (b), (c) and the owner's queue item 2; bugs 84, 86 (the same screen)
> **Status:** 🔲 recorded 2026-11-07 22:03 +03:00 — not started
> **Outbound:** —

## Goal vector (Achieve)

The build's levelling is endless (KrinikConanGameplay, 10 000 levels, XP curve base 1000 since 2026-11-07 21:06). The hero's attributes follow it: the «+» stays past
20, every point keeps adding to the hero's stats by the game's own per-point formulas, and the attribute screen shows the rows and their perks past 20 page by page.

## The owner's words

- `[OWNER]` 2026-11-07 19:50 «я прокачал проворство до 20, и провал плюсик - это нужно убрать, так как прокачка у нас бесконечная» · «можно сколь угодно повышать дальше атрибут».
- `[OWNER]` 2026-11-07 20:50 «И откобчаем лимит на прокачку атрибутов. Делаем её бесконечной.» · «И она бесконечно будет по фотмулам влиять на характеристики героя».
- `[OWNER]` 2026-11-07 22:02 (a frame of the attribute screen: rows «Сила 20», «Проворство 20», each a golden scale with perk nodes at 5, 10, 15, 20, the
  «Осквер…» corrupted column on the right edge) «вот эти ряды навыков нужно научиться делать листаемыми, или скролл бар, или переключение "страницы шкалы"».
- `[OWNER]` 2026-11-07 22:02 (a frame of the right column «Живучесть»: the attribute's line, then the perks «Жажда жизни», «Второе дыхание» (greyed), «Быстрая
  регенерация», «Полнокровность», «Последний бой» cut at the bottom) «Эти списки с описанием перков нужно соответствующем образом уметь переключать на следующую
  страницу в соответствие со станицей шкалы перков».

- `[OWNER]` 2026-11-07 22:03 «в будущем будем сильно развивать систему перков, создавать новые перки для уровеней аттрибутов выше 20-го» — the paging is built for
  future perks past 20: a page is driven by the perk data (nodes at the levels the data names), not by hard-coded 5/10/15/20; pages without perks yet show the bare scale.

## Acceptance criteria

1. An attribute at 20 with free points shows «+»; a click raises it to 21; the screen shows 21 (frame at 4K and 1080p — HOUSE_RULES rule 17).
2. Each attribute's stat effect past 20 follows the game's own per-point curve (read from the game's data first — game map); a measured stat at 25 matches the formula.
3. The scale of a row pages (a scroll bar or page switch — the owner's pick of the two, shown as a mockup with statuses, rule 23): page 1 = 1–20, page 2 = 21–40, …
4. The perk-description column switches to the same page as the scale.
5. No overlap of the caption, nodes and the description column (bug 86) at all four resolutions.

## Steps

- [ ] Recon: where the cap 20 lives (the attribute data table / `StatHolder` / the UI's `+` condition), and the per-point curves (game map, attributes section).
- [ ] Recon: the attribute screen's widgets (`W_Paperdoll…` / the attribute tree), how a row draws its scale and perk nodes, and the perks' data (are there perks past 20 — the
      game has none; `[AI]` what a page past 20 shows goes to him as a mockup).
- [ ] Mockup of the paging (scroll bar vs page switch) on our own frame, statuses on every element — to the owner.
- [ ] Build, cases, frames at four resolutions.
