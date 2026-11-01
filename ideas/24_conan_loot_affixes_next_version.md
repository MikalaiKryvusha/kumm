# Idea 24 — random item properties (affixes) for the Conan build, after 1.0.0

> **Created:** 2026-11-01 · on the owner's word (chat 08:58) during the Caverns of Set chest discussion
> **Parent:** interview #029 option 3; the game map → «Loot generation» (`games/ConanExiles/GAME_ARCHITECTURE_INTERNAL_MAP.md`)
> **Status:** ✅ WANTED by the owner for the NEXT build version (not 1.0.0) — `[OWNER]` «а 3 делаем в новой версии сборки. систему афиксов я ОЧЕНЬ ОЧЕНЬ ОЧЕНЬ
> ХОЧУ, но сейчас делать если возьмемся - это нахуй еще на неделю затянет работу над 1.0.0» · 2026-11-01 08:58
> **Outbound:** — (epic planning with `/plan-epic` after the 1.0.0 release)

## Goal vector (Achieve)

Loot in the build stops being «the same item again»: a dropped weapon or armour piece comes with random properties, as in Diablo-like games, so every chest
and every kill can bring something new worth looking at.

## What is already there

The game's loot rows carry `IntStatModifier` / `FloatStatModifier` — random stat changes on the dropped item — next to the tag-query pools, chances,
amounts and rolls (read 2026-11-01 from `DT_LC_RelicHunter`). How far these fields go (which stats, ranges, whether the item keeps them and shows them) is
the first recon question.

## Acceptance criteria — to be written at the epic's start

Recon first (`/plan-epic`): the game's stat-modifier fields in practice, how mods of the genre did affixes in Conan, how the item tooltip shows them.
