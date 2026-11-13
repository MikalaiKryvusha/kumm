# Bug 96 — Conan: looking at a bush, the «E Взять» prompt does not show

**Status:** 🔧 fix pending verification — filed 2026-11-13 11:10; cause found and fixed 12:4x (pack `26f4cfa`, deployed); judge round 2 owed (API 403 twice),
then the owner's play · **Severity:** S2 (gathering — a core loop of the owner's test play) ·
**Version/build:** Conan Exiles 3.0.1 build, KrinikConanUI as of pack `ca3cdef` · **When/context:** the owner's play of 2026-11-13 11:09, his frame · **Fixing:** first
in the next session

## Goal vector

Maintain: every object the hero can take or gather by hand shows the game's interaction prompt when the crosshair is on it. Acceptance: the crosshair on the bush of
the owner's frame shows «E …» (vanilla wording); the same with KrinikConanUI's prompt edits off (control) tells whose defect it is.

## Symptom (the owner's words, verbatim)

`[OWNER]` 2026-11-13 11:09 «смотрю на куст, нет E Взять - баг» · «проверь». His frame (third person, the hero with the bow, a large leafy bush in front, the crosshair
dot on the bush, no prompt on screen) — sent in the chat; the place: the stand area near `tp_ground.sh 98739 205258` (the oasis shore, his test save `Game_1`).

## Leads (not yet observed)

- Bug 83 (DONE-path work of 2026-11-06): KrinikConanUI restyled all five interaction prompts (`W_SimpleInfo`, `W_PlaceableInfo`, `W_DialogueNPCInfo`, `W_ThrallInfo`,
  `W_DBNORevive` — render scale 0.70, shifted left by the Lua half `krinik_ui_fixes`); a prompt placed off-screen or never shown would look exactly like this.
- Bug 80 (a corpse in a bush) and bug 82 (no «E Взять» over nest eggs — another object kind): the same family; bug 82's notes say snake eggs work, nest eggs do not.
- Vanilla first: is this bush hand-gatherable at all (some bushes need a tool)? Check by the game's own trace — the remote's interaction target under the crosshair.

## Forensics (2026-11-13 11:47–12:09, background path, the owner's save `Game_1`, cases `testcases/TC_conan_no_take_prompt_bush_2026-11-13.md`)

- **The owner's log of his play** (`UE4SS.log`, 11:08:53–11:09:26): 60 checks of the plate, 30 found, no gate stall — the checks ran without pause, so at the frame
  (11:09:24) the plate's question, the game's foliage probe `PickupGatheringOneInstance`, answered «nothing». Before that he gathered for a minute (found 13 · 36 · 60 × 5 ·
  58 per window, 11:07:44–11:08:53).
- **The bush kind:** `GFL_Sarcobatus_Jungle01` — a `PickupFoliageComponent_C` (hand-pickable); all 14 within 60 m of the save are pickup foliage, no decoration twin.
  An untouched one shows the plate (frame `b96_03`), the probe finds it from up to 5 m off its centre (instance scale 2.14; a 7.5 m control answers nothing).
- **What one E does** (real E, PC free): instance #130 of `PickupFoliageComponent_C_5` → scale 0 (taken), item 13013 ×2 into the hot bar, and the game SPAWNS
  `BP_ResourceActor_C` at the same place (0 cm), drawing the same mesh at the same scale (`StaticMeshComponent` `GFL_Sarcobatus_Jungle01`, 2.14). The eye still sees the
  bush; the foliage probe now answers false; **the plate goes dark** — frame `b96_05` = the owner's frame (bush, crosshair on it, no plate).
- **What the next E does there:** a third real E → backpack 12001 ×7 → ×9 and 13015 ×3 → ×5; the foliage probe false, the nearby aloe untouched (scale 1). So E keeps
  gathering from the resource actor while our plate stays dark — **the defect is ours: the plate asks only the foliage branch of the game's E target.**
- **The game's E target (kit 3.0.1 bytecode, `FunCombat_PlayerController::UpdateHighlightTarget`, read 12:06 by `uaj func` + `kpseudo.py`):** (1) `InteractTargetOverride`;
  (2) `SphereTraceMulti` (radius `TraceSphereRadius` 20) + `LineTraceMulti`, trace channel 6, the pawn ignored, camera → camera + view × (`InteractionDistance` 330 + the
  arm); per hit the actor (or its component) implementing `InteractableInterface`, the one nearest the crosshair (largest |dot|) that passes
  `CheckLineOfSight(actor, impact + view × 10, component, item, false)` is the target; (3) only without an actor target — the foliage probe. At the converted bush the
  actor branch (remote copy, `bush96m.lua`) returns `BP_ResourceActor_C` (interface true, line of sight true); `GetIsPickupResource(out)` → `Value = true`.
- **Ruled out:** the gates (`ContainerInfo` inactive, no prompt widget in the viewport); a decoration twin of the mesh; the render state (an `UpdateInstanceTransform` with
  the render flag on the taken instance changes nothing — the visible bush is the actor; a palm hidden the same way vanishes, so instance updates do reach the screen);
  `Pickup+` (placeables only).

## Root cause

`krinik_pickup_prompt.lua` copies only step 3 of the game's E target. A pickup bush touched once becomes a `BP_ResourceActor_C` (the same picture); E then targets
that actor by step 2 and keeps gathering, while the plate's foliage-only question answers false.

INTENT: code does «ask the foliage probe only»; the failing case expects «E Взять» over the converted bush that E gathers; the spec (the plate's header, the owner's
2026-11-02 14:20 rule «ЩУП ИЗ ПРИЦЕЛА … КОТОРЫМ И ПОДНИМАЮТ») says the plate asks what E does — all three agree: the code is wrong.

TWINS: searched «a pickup whose visible look outlives the foliage instance» — the open prompt bug `bugs/74_…` (nest eggs) checked 12:2x at a snake-egg nest:
E takes the egg instance and spawns no actor (eggs 3 → 2, item 13011 +1) — not this class. Other actor targets E takes by hand — only `ResourceActorBase`
pickups are known; covered by the fix through the game's own `GetIsPickupResource`.

## Fix plan

1. `krinik_pickup_prompt.lua` `check()`: before the foliage probe, the game's actor branch (step 2, the bytecode's numbers); an actor target → the plate shows only when
   it is a resource actor whose `GetIsPickupResource` says true (any other actor target — corpse, chest, NPC — gets E for its own action, the plate stays dark); no actor
   target → the foliage probe as before.
2. Cases F1–F6 in the TC; deploy KrinikConanUI; frames; a real E under the plate; the cost line of the plate's self-measure.

## Fix (2026-11-13, working tree of the pack — committed after the judge)

`krinik_pickup_prompt.lua`: `actor_target()` (the game's step 2) and `is_pickup_resource()`; `check()` asks them before the foliage probe. Deployed by
`Deploy-ModPack.ps1 -Only KrinikConanUI`. Hygiene: none (no build step). Functional run: the game, the owner's save, the player's path — F1 (touched bush, plate on),
F2 (real E under it, 12001 +1, 13015 +1), F3 (untouched bush), F4 (sand, dark), F5 (corpse, dark), F7 (cost: worst 1 ms; the branch 0.125 ms a call) pass; F6 (a resource
actor of the tool kind) not run — no such actor at the stand. Report `testcases/reports/2026-11-13_conan-bush-prompt-resource-actor.md`.

**Judge round 1 (12:2x–12:35, a fresh helper on the diff, the kit decoded by it):** 9 findings, no defect. Verified and fixed: (1) the game targets the COMPONENT when it
has the interface — `PickupFoliageComponent_C` does (live: interface, `IsA PickupFoliage`, `GetIsPickupResource` true, profile `ResourceNoCollision`); the regression it
predicted (a stone as an actor target → plate dark) did not reproduce live — at a stone, an egg and an untouched bush the traces hit only the landscape — but the copy
now follows `SelectObject` and asks `GetIsPickupResource` of a `PickupFoliage` target too; (2) a Lua error in a check froze the plate — now `show(false)` on error;
(3)(4)(6) comments: `InteractTargetOverride` (only the downed-ally revive), the sphere-hit gate, the channel's name `Trace_Interactable`; (5) the marker flipped to
`[TESTED]` after run 3; (7) the hit shapes are written as observed; (8) `out.value` accepted too; (9) the stale header (5/s → 10/s, the cost). Refuted: none — all nine taken.
Run 3 re-ran the cases on the revised code (TC «Run 3»).
Cost watch after run 3: the plate's minute lines 12:47:49 · 12:48:49 · 12:49:50 — worst 1 · 2 · **8** ms; the 8 ms minute is shared with `KrinikConanUI:HudBlink` worst
**15** ms (12:49:38) — a whole-game stall that landed on every Lua callback running through it, not the plate's branch (0.125 ms by 200 repeats); the game then
closed cleanly at 12:50:01 («Event loop end», no crash folder). Watch the line in the owner's next play.

**Judge round 2 (a fresh helper on pack `26f4cfa`, report 13:3x — after the chat's force-closure, recorded unverified):** NO defect; the copy matches the game at
every deciding step (trace arguments, hit order, filter, |cos| choice, `CheckLineOfSight` order, the final target, lore, the foliage fallback; `GetIsPickupResource` =
`HarvestableComponent_v2.isPickup` = what `InteractableActivate` checks). To VERIFY, then apply, next session:
1. risk — cost grows with the hits: every hit pays 3–4 UFunction calls before the cosine test; the 0.125 ms was measured at a spot with few hits, and the minute sums
   (22–35 ms / 60) put a check near 0.4–0.6 ms. Exact-equivalent fix: compute `c` from `h.ImpactPoint` first and skip the hit when `c <= best_cos`, only then
   `Component` / `GetOwner` / interface / line of sight; measure at a camp with many interactables (repeats, not the 1 ms clock); an A-B-A per rule 7.
2. quality — a check that keeps failing goes silent after 3 log lines and stops the minute summary: count errors in the summary.
3. quality — a failing `GetIsPickupResource` call is silent: log its first failure once.
4. risk, low — the traces ignore the cached hero, the game ignores the current pawn: use `pc:K2_GetPawn()` per check.
5. cosmetic — the summary's «щуп нашёл предмет» now also counts actor targets → «плашка горела»; outside the diff: the game also checks
   `CameraThirdPerson:IsActive()` (uht 73–76) — the code does not.

## Decisions made without the owner

- `[AI]` The plate copies the game's actor branch from the 3.0.1 kit bytecode instead of calling `UpdateHighlightTarget` itself: calling the game's function once a
  second would set the highlighted object and fire its server and client RPCs (`ServerSetHighlightedObject`) outside an E press.
- `[AI]` Over an actor target that is not a pickup resource (corpse, chest, NPC, lore item) the plate stays dark even if a foliage pickup lies in the probe's sphere —
  the game gives E to the actor in that case (its own order), so «E Взять» there would promise the wrong action.
- `[AI]` Water and the `InteractTargetOverride` step of the game's function are not copied: water gives E a drink, not a take, and the override is a scripted target.

## Links

bugs/83, 80, 82 · `games/ConanExiles/mods/KrinikConanUI.md` (the interaction prompts)
