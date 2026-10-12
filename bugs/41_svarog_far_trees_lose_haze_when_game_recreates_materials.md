# Bug 41 — Svarog's Dream: far trees lose the haze — the game recreates their materials and our mod does not notice

**Status:** 🔧 fixed 2026-10-12 22:02 — after restart the guard caught two recreations during load (log «materials recreated … rescan» ×2 for trees, ×2 for grass), `mats BillboardTree` 38 of 38 ours (was 0 of 38); far forest pale in a low frame. Control by `TreeMeshDistance` 300→250→300 did NOT recreate materials — the real trigger is still unknown (only seen at load). Awaiting the owner's eye over a session
**Severity:** S1 — the owner's trust: `[OWNER]` «и какогого хуя опять дальшие деревлья не покрыты дымкой!!!» · «три раза у тебя этот мод
отваливался сегодня!!!!!!!» · 2026-10-12 — the third return of one defect in a day
**When/context:** 2026-10-12 21:58, the owner in the live game (restart 21:39 with the bug 39 fix).

## Symptom
Far trees (Unity tree billboards beyond `TreeMeshDistance = 300`) are crisp, not in the haze, while the mountain behind them is hazed.

## Forensics
- Log: `billboard fog on: 24 materials, held 24` once after load (line 195) — no later event.
- Pult `mats BillboardTree` 21:58: **38 materials, all `Hidden/TerrainEngine/BillboardTree`, ours (`Krinik/TerrainEngine/BillboardTree`) 0** —
  the 24 swapped materials are gone (destroyed), new ones are on the game shader.
- `BillboardFog.Update` rescans only when the terrain SET changes (`TerrainKey`) or the setting flips. Unity rebuilds the billboard
  materials when tree settings of a terrain change (the camera mod sets tree/billboard distances after load) — same terrains, new
  materials, no rescan.

## Root cause
The trigger of the rescan watched the wrong event: the set of terrains, not the materials themselves.

## Fix
Every `CheckSeconds` (2 s) — check only OUR held materials (tens): one destroyed or back on the game shader → one rescan
(`FindObjectsOfTypeAll<Material>` once, event-driven, bug 39 class respected). Twin with the same trigger — `GrassCoverage.cs`
(detail grass materials are created by Unity too) — same guard. Other material swappers (`RoofFog`, `FoliageFog`, `NightParticles`)
change asset materials the game does not recreate — not twins (to confirm by the same `mats` count after a settings change).

## Check (testcases/TC_svarog_hero_card_2026-10-12.md, C36)
After restart: `mats BillboardTree` — ours > 0, game 0; then change `TreeMeshDistance` on the fly (`cfg … camerarework DrawDistance
TreeMeshDistance 250`, back to 300) → log `billboard fog: materials recreated … rescan`, `mats` again — ours > 0, game 0; frame of a far
forest — hazed.

## Decisions made without the owner
(filled at closing)

## Links
`bugs/39_svarog_frame_hitch_twice_per_second.md` (no full-memory scans in a tick) · `testcases/reports/2026-10-11_svarog-billboard-haze.md`
