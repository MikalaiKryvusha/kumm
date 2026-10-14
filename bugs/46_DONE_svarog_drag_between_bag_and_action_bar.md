# Bug 46 — Svarog: dragging an item between the bag and the quick-action bar does not work, both ways

**Status:** 🔴 OPEN
**Severity:** S2 (core inventory action broken for the player)
**Version/build:** SvarogsDream `e5795ac` (KrinikUIRework as deployed 2026-10-13 evening) · **When/context:** 2026-10-14, owner in game
during the camera work; owner's words: `[OWNER]` «и не работает перенос из рбкзака на панель квик экшенов предметов» · «и из панели квик
экшенов в рюкзак» · 2026-10-14

## Symptom
Dragging an item from the bag onto a quick-action slot does nothing; dragging an item from a quick-action slot back into the bag does
nothing either.

## Repro (deterministic)
Not yet reproduced by the agent. Plan: real mouse drag (`tools/mouse.ps1`) from a bag slot (food/potion) onto the food/potion quick slots
and back; control — the same with KrinikUIRework unloaded (or its HUD row off), to tell a game rule from our regression.

## Hypotheses (ranked, not verified)
1. Our HUD changes of 2026-10-13 put a raycast-blocking graphic over the slots or moved the slots away from the game's drop targets
   (HudRow re-layout, KrinikTip on empty slots, SpellPicker dressing).
2. The game accepts drops only on specific slot types (food/potion), and the owner tried others.

## Decisions made without the owner
none yet

## ✅ STATUS: DONE (2026-10-14) — not a defect, the game has no such feature

Game code (full decompile, 2026-10-14): quick-action cells are `UISpellSlot : UISlotBase`; `UISlotBase.OnDrop` swaps only with another
`UISlotBase` — bag cells are not of that kind, so bag ↔ bar dragging was never part of the game. Food and potions reach the bar through
the equipment cells `SlotType.Food` and `Potion1–4` (`PlayerEquipment` → `SpellsActionManager.AssignFood` / potion assign). Weapons: two
sets — `BackupMainWeapon` / `BackupSecondaryWeapon`, swapped by `ControllsManager.KeyCodes[10]` (X by default) → `SwapWeapons`.
The owner's wish — bows on quick cells, eating from a quick cell — is a new feature: `ideas/18_svarog_predmety_v_bystryh_yacheykah.md`.

## Decisions made without the owner

- `[AI]` Read the report as a feature request, not a regression, on the evidence above; the owner asked «этот перенос может должен рабоать? или нет?».
