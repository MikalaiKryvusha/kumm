# Bug 30 — Medieval Dynasty: the pilot's `buttons` step stalls the game-thread Lua (bridge stops answering)

**Status:** ✅ DONE · **Severity:** S2 (a run lost; the game had to be closed) · **Version/build:** Medieval Dynasty 2.7.0.3,
UE4SS 1161, `KrinikPilot` v1 with the `buttons` step (written 2026-10-08 10:53, stand P5 green) · **When/context:**
autonomous hour, plan 17 step 17.3 — looking for the «Start game» anchor

## Symptom

Route of 9 steps; steps 1–8 logged «ок» at 10:54:21–10:54:25; step 9 `buttons UI_SessionCodeNewGame_C` never logged —
neither «ок» nor «сбой» (the step runs inside `pcall`, so a Lua error would have been logged). At 10:54:57 the bridge did
not consume `in.txt` within 5 s (it answers within 2 s normally); `Process.Responding` = True; two screen grabs 2 s apart
identical (inconclusive — the menu art may be static). `CloseMainWindow` closed the game normally at ≈10:55:30.

## Repro

`tools/route-restart-load.ps1` is NOT used; start the game, then `pilot.txt`: `call UI_MainMenu_C Load` · `wait
UI_LoadMenu_C 10` · `sleep 1500` · `pickslot Autosave2_Ox` · `confirmslot` · `wait UI_NetworkModeSelectingMenu_C 5` · `call
UI_NetworkModeSelectingMenu_C ConfirmAction` · `sleep 1500` · `buttons UI_SessionCodeNewGame_C`.

## Hypotheses (ranked, not verified)

1. ~~`b.ParentPanel` is an interface-typed property~~ — weakened by the asset (offline, same hour): `ParentPanel` of
   `UI_SessionCodeNewGame` is an `ObjectProperty`, `ButtonFunction` a `StrProperty`. Remaining form of the hypothesis: a null
   or not-yet-constructed `ParentPanel` (the row exists before its panel is wired) — `:GetClass()` on a null UObject is a
   native fault, invisible to `pcall` (EXP-0113).
2. `FindAllOf("UI_SessionCodeNewGame_C")` during the menu transition — less likely (the same call worked at 10:47:02 for
   `wait`).

## Fix plan

Log before each sub-step of `buttons` (count, then per row: function read, parent read) to see where it stops; read
`ParentPanel` as an object property first (`:IsValid()`), skip `GetClass` if not an object; one row per tick. Guard: stand
case for a parent that errors on `GetClass` (already partly — P5).

## Decisions made without the owner

- `[AI]` The stalled run was closed by `CloseMainWindow` (own run, owner not in it) — no kill needed.
- `[AI]` The fix reads `ParentPanel` only when `IsValid()` and prints «нет родителя» instead of probing a null object; full name instead of class name (simpler, one call).

## Links

`plans/17_md_anchor_pilot.md` (17.3) · `testcases/reports/2026-10-08_md-anchor-pilot.md` · EXP-0113 (native UE4SS faults
are invisible to Lua `pcall`).

## Fix written offline (2026-10-08 10:57)

`KrinikPilot` `buttons`: a log line BEFORE each sub-step (count, function, parent), `ParentPanel` used only when
`IsValid()`, otherwise «нет родителя»; `GetFullName` instead of `GetClass():GetFName()`. Stand `tools/test-pilot.lua` P5 with
an orphan row (null parent) — ALL OK. **Not run in the game yet** — status stays OPEN until a live run passes.

## ✅ STATUS: DONE (2026-10-08 10:58)

Hygiene: stand `tools/test-pilot.lua` ALL OK; P5 with an orphan row (null `ParentPanel`) — the old code would print «?» there,
the new one prints «нет родителя» (the check reddens on the old version).
Functional run: the same 9-step route on the owner's game at 10:57:37 — every sub-step logged, step 9 answered «3 шт.: 1:
CopyToClipboard -> нет родителя; 2: … ; 3: …», the bridge answered `where` right after (thread alive), the game closed
normally. Cause confirmed: rows of `UI_SessionCodeNewGame_C` exist with a NULL `ParentPanel`; a method call on it stalled
the game thread (native fault, invisible to `pcall` — EXP-0113). These rows are «copy session code», not «Start game».
REAL WORLD: accumulated — owner's saves (only read, the route stops before loading); data and machine — his game and PC;
path — the menu path he uses. Verified on the real world.
