# Bug 38 — Svarog's Dream: a traveler from Bara runs along the lake bottom and vanishes in mid-air

**Status:** 🔴 OPEN
**Severity:** S2 — visible break of the world in the owner's view, every day a Bara traveler passes the pond
**When/context:** 2026-10-12 ≈09:38, tossed by the owner mid-task while the agent's run was open: `[OWNER]` «в этом сейве запиши видео. Видно.
как какой-то берой выбегает из Бара, пробегает ПО ДНУ ВОДОЕМА, а затем исчезает в воздуХЕ» · «ИСЧЕЗАНИЕ ЕГО - ПЛОХО» · «ЧТО БЕГАЮТ ПО ДНУ
ОЗЕРА - ПЛОХО!». Earlier the same morning: «иногда по миру пробегают герои, кто они» — answered: game travelers
(`researches/svarogs-dream/simulation.md`, «Путники»).

## Symptom
1. A traveler leaves Bara, walks across the pond **under the water surface** (along the bottom).
2. Then the traveler **disappears in the middle of the view**.

## Forensics (2026-10-12 09:39–09:40, owner's save copy `_backups/svarog-saves-2026-10-11_2342-owner-exit`)
- Traveler of the day: `WorldAreas/Travelers/WorldTravelers/StandardTravelers/Bara/BaraTrainer2/Adventurer (1)` (`comps Traveler 600`).
- Track every 2.5 s (`callon … Transform get_position`): stands at (120.7, 90.1, −564.6) ≈10 s, then (124.9, 89.5, −514.5) → **(106.4, 84.6,
  −457.1) → (159.9, 82.1, −428.6) → (206.0, 83.9, −388.8)** → (240.1, 90.1, −333.6) … — height drops 6–8 m below the shore (90.1): the
  lake bottom. Step ≈55–60 m per 2.5 s — **correction 09:47:** this is his own run speed, seen also 58 m from the hero in the second run;
  the first wording «once farther than 100 m» tied it to the long-run mode, and that was not observed.
- Game code (`Traveler.cs`, decompiled): every 3 s, if farther than **100 m** from the hero → `_model.SetActive(false)`,
  `isTravelerOnLongRun = true` (fast run, no avoidance); destroyed beyond 500 m if `isDestroyAway`. 100 m was the edge of the vanilla
  camera; ours sees ≈300 m and draws characters to 300 m (`DrawDistance.CharacterMeters`) — so the traveler vanishes mid-screen. Same class as
  EXP-0207 (game distances computed for the vanilla camera).
- Video: `SvarogsDream/gallery/game/2026-10-12_путник-по-дну/01 путник из Бары - по дну и исчезает.mp4` (desktop capture `gdigrab`, 45 s;
  brightness of desktop capture is not the owner's eye — EXP-0213). The camera did not follow the traveler; the bottom crossing is proven by
  the height track above.

## Fix plan
1. **Vanishing:** Harmony transpiler on `Traveler.Update` / `Traveler.Start` / `Traveler.Awake`: the constant 100 → our visible character
   range (`CharacterMeters`, 300) — like `PatchMouseRayReach`. Check: a traveler walks out of view without vanishing; no fast run inside 300 m.
2. **Lake bottom — the owner's direction:** `[OWNER]` «Бег по дну водоёма - может это разметкой карты на зоны пофиксится? сможем сделать в
   разметке области с тегом Вода?» · 2026-10-12. `[AI]` Unity's built-in way: `NavMeshObstacle` with carving, placed at runtime over the
   water polygons of the zone markup — agents path around it, no rebake. Water as the first layer of «зоны мира» (owner's list: зоны мира →
   карта температур). Path of a traveler = `AIDailyRoutine` hourly points (24 × place + action) walked by `NavMeshAgent`.
   Recon still to do: the navmesh is baked over the terrain under the water plane. Recon first: NavMesh areas (`NavMesh.GetAreaFromName`), the
   travelers' path points (`Points` children of each traveler), whether the water has a NavMeshObstacle / modifier. Options to weigh with
   the owner if no cheap fix: route points around the pond, or an area cost for the underwater region.

## Fix, part 1 — vanishing (2026-10-12, KrinikCameraRework `PatchTravelerReach`)
`Traveler.Awake/Start/Update`: 100 m → «Дальность персонажей» (300). Log: `traveler reach: Traveler.Update — 1 × 100 -> 300` (and Awake,
Start). Traveler at 267 m: `NPCController.isTravelerOnLongRun=False` (model shown); control `CharacterMeters 100` → `True` within 3 s, back
to 300 → `False`. Run: `testcases/reports/2026-10-12_svarog-traveler-reach.md`. **Open:** part 2 — the lake bottom.

## Decisions made without the owner
- `[AI]` The traveler's hide distance follows our «Дальность персонажей» (one setting for «how far characters are seen»), not a new knob.

## Links
`researches/svarogs-dream/simulation.md` (Путники) · EXP-0207 (distances under our camera) · EXP-0213 (desktop capture brightness).
