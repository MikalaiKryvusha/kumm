# Bug 83 — the NPC talk prompt (and other interaction strips) still sits centred, large, on a dense backing — not like the corpse strip

**Status:** 🔧 FIXED 2026-11-06 09:0x (functional pass, the owner's eye pending — review folder 65) · **Severity:** S2 (the owner's standing ask not carried to every widget) · **Version/build:** pack ConanExiles `1d6a62c`, KrinikConanUI
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

1. Read the talk prompt's widget class by the remote over a living NPC (the module / the widget in the viewport while the prompt shows). The line «Нажмите E,
   чтобы говорить» is most likely the shared `W_ActionTutorial` (game map); the fork to read first: is its container the same `WBP_ContainerInfo` (then
   `place_strip` misses it because of a condition) or another module (then the strip code needs a second target).
2. List the other interaction prompt widgets (campfire, chest, door, workbench) — one class or several.
3. Apply the same place / scale / backing as the strip, from the same hub rows (one setting for all — «все виджеты интеракции»), event-driven as `align`.
4. Frames of each before / after.

## Recon log

- 2026-11-06 08:42 +03:00 — `retoc list --path` over the 3.0.1 paks (`_paksview-3.0.1`): the interaction-info family lives in `/Game/UI/HUD/FloatingNames/` —
  `W_DialogueNPCInfo` (the NPC talk prompt — candidate), `W_PlaceableInfo`, `W_SimpleInfo`, `W_ThrallInfo`, `W_DBNORevive`, `W_CastingInfo`, their switch
  `W_OnScreenInfoContainer`; the container strip `WBP_ContainerInfo` sits apart in `/Game/UI/Widgets/HUD/Interact/`. A campfire already uses
  `WBP_ContainerInfo` (`strip-open.sh … BP_PL_Crafting_CampFire_C`) — so chests and crafting stations are covered by `place_strip` today; the talk prompt is
  not. Trees of the six read by `kit-probe-tree.py` (KIT_WIDGETS) — next step. Cases: `testcases/TC_conan_interaction_prompts_like_corpse_strip_2026-11-06.md`.

## Fix (2026-11-06)

- **Kit** (`kit-conanui-edit.py`, `INFO_WIDGETS`): the five prompts' `Container` border — render scale `STRIP_SCALE` 0.70, brush alpha `STRIP_BACKING_ALPHA` 0.6 (vanilla
  already 0.6 there); six CookInfo lines (the five + `W_EnemyHealthbar`); `kit-missing-refs.py` 0 missing.
- **Lua** `krinik_ui_fixes` 1.5.0: the five classes remembered at birth (`NotifyOnNewObject`), one tick later `place_strip` on their `Container` — the strip's
  shift / scale / backing from the SAME hub rows; re-applied on a hub save. `krinik_pickup_prompt`: «E Взять» off while any of the five shows (found by the
  run: the talk prompt and «E Взять» lit together).
- Hub labels «Плашка трупа: …» → «Плашки: …», the «i» texts list corpse, chest, building, thrall and the person to talk to.
- Run: cases I1–I4, P1 pass (I2 — the control with neutral rows: centred, 1.00, 0.80), report `testcases/reports/2026-11-06_conan-interaction-prompts-perks-enemy-bar.md`.
  Status 🔧 — functional pass; the look waits for the owner's eye (review folder 65).

## Decisions made without the owner

- `[AI]` One setting for all prompts (the existing strip rows) — from the owner's «все виджеты интеракции … как ты сделал для трупов».
- `[AI]` The hub labels shortened to «Плашки: по горизонтали / по высоте / размер / фон» (the label column fits ≈ 28 characters; «Плашки взаимодействия: …» would not).
- `[AI]` The downed-ally prompt `W_DBNORevive` included — same family, same shape.

## Links

`games/ConanExiles/mods/KrinikConanUI.md` (`krinik_ui_fixes`, the strip rows), bug 64 items 32–35, plan 36 W6.
