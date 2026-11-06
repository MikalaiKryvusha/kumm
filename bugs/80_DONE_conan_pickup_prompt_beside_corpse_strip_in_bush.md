# Bug 80 — over a corpse lying in a bush both the corpse strip and our «E Взять» show; only one of them is what E does

**Status:** ✅ DONE (a real E over a corpse in a bush opened the corpse — the status section) · was 🔧 fix built and seen 2026-11-03 23:03 +03:00 (KrinikConanUI `krinik_pickup_prompt`: our plate off while the game's corpse strip is on screen); the real E over a
corpse in a bush NOT observed yet · **Severity:** S2 (a prompt that lies about the key) · **Version/build:** pack ConanExiles `37ed9e8`, KrinikConanUI
`krinik_pickup_prompt` (bug 77 version) · **When/context:** seen by the agent 2026-11-02 15:18 (STATUS, «Seen 15:18 (to check)»); the guide's 1.0.0 chapter
lists it · **Fixing:** this session, after the study below
`[OWNER]` 2026-11-03 19:57 «над трупом в кустах - чинить» · «нужно ту плашку показывать, которая сработает,или взятие куста, или открытие трупа - это нужно изучить».

## Goal vector (Achieve)

Over any spot the player looks at, exactly the prompt of what E will do is shown: the corpse strip when E opens the corpse, «E Взять» when E takes the
bush — never both.

## Symptom

A corpse lying in a bush: the game's corpse strip («Труп … нажмите E») and our «E Взять» plate are on screen together.

## Forensics (code, 2026-11-03 19:5x)

- **What E does** — `FunCombat_PlayerController::UpdateHighlightTarget` (kit 3.0.1 bytecode; game map, «Order of the targets»): the actor hits of a sphere
  + line trace first (corpse, container, lore item — with `CheckLineOfSight`), `HasValidTarget` → the actor is highlighted; ONLY with no actor target the
  foliage probe `PickupGatheringOneInstance` (our plate calls the same probe once a second).
- **When it runs** — from the controller's ubergraph in the interaction flow (`OnInteractKeyDown` → … `InteractLastStep`, offsets ≈ 21 100–21 600), i.e. at
  the E press (the game map's hook count agrees: 1 call per press).
- **What shows the corpse strip while merely looking** — NOT the controller (`uaj grepfn … ContainerInfo` → no function); the native interaction manager
  (`GetInteractionManager`, `SetHighlightedObject` in the ubergraph). Its own target choice is not read yet.
- So «the strip is on screen» is not yet proven to mean «E opens the corpse».

## Study (the next step)

1. A corpse in a bush by the remote: a living humanoid teleported onto a spot where our probe says `true` (the hero looking at a fibre bush), killed there.
2. With the crosshair on that spot: frame — which prompts show; then a REAL E (`mouse-seq.ps1`) — what happened: the corpse loot window opened (corpse) or
   the hero's inventory gained the bush's item (bush); the remote reads both.
3. Vary: the crosshair on the body's middle / its edge over the bush.
4. Then the fix by the observed rule — most likely «our plate hides while the game highlights an actor» if E took the corpse.

## The fix (2026-11-03 23:0x)

The rule taken from the controller's code (forensics above: an actor target first, the foliage probe only without one): while the corpse strip is on
screen, E opens the corpse — so `krinik_pickup_prompt.check` shows our «E Взять» only when the module `ContainerInfo` is NOT active AND no live
`WBP_ContainerInfo_C` (remembered at birth by `NotifyOnNewObject`, no search) is in the viewport and visible (the module flag alone missed the strip —
`aim-sweep.lua`, 20:4x). Seen 23:05 (the oasis, the hero over the bush `bush-corpse.lua` found, the strip opened by `strip-open.sh`): over the bush the plate
visibility 3 / opacity 1.00 → strip on → 1 / 0.00 → strip removed → 3 / 1.00. Owed: one REAL E over a corpse lying in a bush, to see that the corpse opens
(the code says so). Stand fix of the same minute: `bush-corpse.lua` called a non-existent `IsDead` and found «no living humanoid» among ten.

## Decisions made without the owner

- `[AI]` by mandate (`[OWNER]` 22:39 «аналогичный вопрос про автономность работы»): the strip wins (the game's own order), our plate yields.

## ✅ STATUS: DONE (2026-11-06 22:03 +03:00)

`[OWNER]` 2026-11-06 21:01 «тестируем E Взять над кустом с трупом». Run 2026-11-06 22:00–22:03 (cases `testcases/TC_conan_bush_corpse_real_e_2026-11-06.md`,
report `testcases/reports/2026-11-06_conan-bush-corpse-real-e.md`):
- Hygiene: none new (no code changed — the 2026-11-03 fix is what was tested).
- Functional run: the oasis stand, `bush-corpse.lua` moved the humanoid boss «Нурус Тихорез» onto a spot the game's foliage probe answers yes for and killed
  him there; `loot-aim.sh` put the crosshair on the body by the game's answer. B1 pass — only the corpse strip and the quick-loot window, our plate
  visibility 1 / opacity 0.00 (frame `b1.jpg`). B2 pass — a REAL E opened the corpse's loot window (its 7 items), no bush item taken (frame `b2.jpg`). B3 pass —
  five views around the body: strip on → plate hidden (2 views), strip off → plate shown (3 views, visibility 3 / opacity 1.00); a real E over «E Взять»
  took a branch («Ветка +1», frame pair `b3_pair.jpg`). The strip and our plate never showed together; each said what E did.
REAL WORLD: accumulated — the owner's working game folder with the full build and the oasis save; data and machine — his game, his PC; path — the real E key.

## Links

Bug 77 (the plate asks the game's own probe), game map «Order of the targets», `games/ConanExiles/mods/KrinikConanUI.md` (`krinik_pickup_prompt`).
