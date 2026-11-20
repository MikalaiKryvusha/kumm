# Bug 113 — map markers: the first lands away from the click, a second one is not placed, the reset does nothing

**Status:** 🔴 OPEN — recorded only; the chat is paused by the owner, no investigation started
**Severity:** S2 by the ladder; CRITICAL by HOUSE_RULES 38 (a function that does not work: the reset and the second marker)
**Version/build:** Krinik Mod Pack 0.9.1-RC1 (the release build), Conan Exiles Enhanced 3.1.1, the owner's working game `D:\Games\Conan Exiles 3.1.1`
**When/context:** 2026-11-20 18:38 +03:00, the owner's own play of the RC1 build, after bugs 111 and 112; his words (verbatim): «на карте не работает сборос маркеров и
установка второго маркера. Первый поставился не там, где я кликал.»
**Fixing:** after the pause, after bug 112 (owner's debt; critical first)

## Symptom

1. The first marker on the map is placed, but not at the point the owner clicked.
2. A second marker is not placed.
3. The reset of the markers does nothing.

## Repro (deterministic)

Not known yet. To find first: which map — the game's full-screen map, the map page of our hub (the «Карта» tab), or the map of Simple Minimap (it keeps
`SaveGames/SimpleMinimap_MarkerData.sav`) — and which control places and resets a marker. The display: the owner's TV 3840×2160 at 300 % (an offset of the click
point is a classic scale / DPI or a wrong-widget-geometry defect).

## Forensics

None yet. To read: the `UE4SS.log` of the owner's session ≈18:3x, the marker save file's time and size before / after a placement.

## Root cause / Hypotheses

Not investigated (the pause). Cheapest first:
1. Our hub hosts the map page inside its own window: the click is converted with the hub's geometry or scale, not the map widget's — the offset; the second
   placement and the reset fail on the same wrong geometry or on input the hub consumes. Control case: the same clicks on the game's own map with our UI mod off
   (HOUSE_RULES 24).
2. Simple Minimap's marker data (one marker limit, a save it cannot write).
3. An input mapping of the build (KrinikConanUI after bug 85) eating the right / middle click or the reset key.

## Fix plan

The map and the control by the control case → the cause at its source → neighbours (HOUSE_RULES 39: the other map controls, the minimap) → a stand case that
places two markers at named points and resets them, checked by a frame at 4K / 300 % → the owner's own clicks.

## Decisions made without the owner

- `[AI]` Treated as critical by HOUSE_RULES 38.

## Links

- `bugs/111_…`, `bugs/112_…` — the same session of the owner's play
- the chronicle (entry 2026-11-09 22:45) names an older open item «the hub duplicates pages / the full-screen map twice» — a possible neighbour; its bug file
  is not found under the number the chronicle gives (84 is another bug), to locate when the work starts
