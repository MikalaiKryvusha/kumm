# Bug 83 — the NPC talk prompt (and other interaction strips) still sits centred, large, on a dense backing — not like the corpse strip

**Status:** 🔴 OPEN · **Severity:** S2 (the owner's standing ask not carried to every widget) · **Version/build:** pack ConanExiles `1d6a62c`, KrinikConanUI
`krinik_ui_fixes` (the corpse strip only) · **When/context:** the owner's frame 2026-11-03 23:30, recorded 2026-11-03 23:31 +03:00 (chat cb012770)
**Fixing:** the next chat, first after the owner's queue

`[OWNER]` 2026-11-03 23:30 «вот это баг» · «я просил все виджеты интеракици - влево, меньше, прозрачнее фон» · «как ты сделал для трупов».

## Goal vector (Achieve)

Every interaction prompt the game shows over an object or an NPC (talk «Нажмите E, чтобы говорить» + the NPC's name, containers, crafting stations, doors…)
stands where the corpse strip stands and looks like it: left of the hero (−22 % of the width), 30 % smaller (render scale 0.70), the backing at 0.60.
Acceptance: frames of an NPC talk prompt, a campfire / crafting station and a chest — each on the corpse strip's place, size and backing.

## Symptom

His frame (the oasis, «Поборник Внешней тьмы», a campfire behind): «Нажмите [E], чтобы говорить» and the name centred over the NPC, full size, the dark
torn-edge backing — over the hero and the NPC.

## What exists

`krinik_ui_fixes.place_strip` moves / scales / fades ONLY `WBP_ContainerInfo`'s `Border_Underlay` (the corpse / container strip; hub rows «Плашка трупа:
по горизонтали / по высоте / размер / фон», store keys `ui_strip_x/y/scale/back`, defaults −22 / 0 / 0.70 / 0.60 — `[OWNER]` 2026-11-02 08:54–10:54). The talk
prompt is another widget (not read yet — likely the game's interaction module for NPCs).

## Study → fix

1. Read the talk prompt's widget class by the remote over a living NPC (the module / the widget in the viewport while the prompt shows).
2. List the other interaction prompt widgets (campfire, chest, door, workbench) — one class or several.
3. Apply the same place / scale / backing as the strip, from the same hub rows (one setting for all — «все виджеты интеракции»), event-driven as `align`.
4. Frames of each before / after.

## Decisions made without the owner

— (open)

## Links

`games/ConanExiles/mods/KrinikConanUI.md` (`krinik_ui_fixes`, the strip rows), bug 64 items 32–35, plan 36 W6.
