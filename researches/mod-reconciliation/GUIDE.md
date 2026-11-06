# Guide 01 — reconciling the mods of a build: every mod brings what it needs, none silently loses it to another

> **Created:** 2026-11-06 · on the owner's word: `[OWNER]` 2026-11-06 09:33 «ЭТО МОЖНО РАЗВЕСТИ? ЧТО БЫ КАЖДЫЙ МОД ПРИНОСИЛ СВОЕ, ЕМУ НУЖНОЕ И НЕ КОНФЛИКТОВАЛ
> С ДРУГИМИ? или тут есть нерешаемые конфликты?» · 09:34 «Заведи под это руководство» · «и когда занимаешься сведением водов друг с другом - пускай ХУК тебе
> напоминает прочесть это руководство» · 09:35 «не только таблицы» · «это обобщенное правило и ркуоводство» · «таблицы, код, ассеты, ресурсы, и механики» ·
> 09:36 «моды должны быть согласованные» · «НЕ ПЯТЬ» · «ЭТО Я ПРИМЕР ПРИВЕЛ ТЕБЕ» · «МОЙ ПРИМЕР МОЖЕТ БЫТЬ НЕ ИСЧЕРПАЕМЫМ»
> **Parent:** the build's acceptance criterion 2 (`MASTER_PLAN.md`: no row where a mod silently loses its change); `MASTER_PLAN.md` Phase 3 «compatibility»;
> first findings — `researches/conan-table-conflicts/README.md` (143 shared rows of the Conan build, 2026-11-06)
> **Status:** 🔧 the method for any game; Conan tools proven for tables (step 1, the reading of step 2 on row 51420); a field classifier script and a
> merged-row build are not written yet
> **Outbound:** outcome C of any kind → the owner's choice; the guard — `tools/hooks/style-gate.mjs` «mod-reconciliation-gate» (`HOUSE_RULES.md` rule 27)

## Goal vector (Maintain)

**The mods of a build are CONSISTENT with each other** (`[OWNER]` «моды должны быть согласованные»): every mod brings its own changes and keeps them, no change
of one mod is silently lost to another or fights another — in ANYTHING two mods share. Acceptance per build: each overlap found carries a recorded outcome
(`REGISTER.md` next to this guide), and none is «not judged».

## The rule

1. Reconciling mods (finding overlaps, reading both sides, choosing an outcome, merging) is done BY THIS GUIDE — the hook refuses the work until it is read.
2. An overlap is judged by READING BOTH SIDES against the game's own original (vanilla), never by a guess from names.
3. The outcome is one of four — A identical · B different parts · C same part, different values · D one name, two different things — and it is recorded.
4. A merge is native and re-appliable: a script or a map next to the pak (`HOUSE_RULES.md` rule 8), the mod marked KRINIK MODIFIED; never a runtime patch that
   re-sets the value after the game (rule 24).
5. Outcome C is the owner's choice — one question per group of rows, the two values side by side as a scenario of what the player sees.

## Kinds of overlap — an OPEN list

Anything two mods share is an overlap. The rows below are the owner's examples (tables, code, assets, resources, mechanics) — NOT the whole list
(`[OWNER]` «НЕ ПЯТЬ» · «МОЙ ПРИМЕР МОЖЕТ БЫТЬ НЕ ИСЧЕРПАЕМЫМ»). Others already known: the screen place of two HUD widgets, the same localization key, the load
order a mod's author demands (Hosav after other UI mods), save data both write, console variables / `Engine.ini` keys both set, server settings. A new kind
found in work gets its row here the same day, with its detector.

| Kind | What two mods share | Who wins without us | Detector (Conan) |
|---|---|---|---|
| **1. Tables** | a row of a game data table (an item id, a spawn row, a recipe, a UI module row) merged by both mods' controllers | Conan — DEPENDS ON HOW THE LATER MOD MERGES, seen only live (the log says «overwriting» either way): WHOLE ROW — Mines of Set (item 51420 over Severe Weather, live 2026-11-06 11:13), EAA (7 spawn rows over BMNB, 11:33), Era of Trials' `*_Add` recipes; FIELD BY FIELD (a field the later mod keeps at the original or leaves empty does not overwrite; arrays appended) — Heritage (17 spawn rows over BMNB, 11:06), Era of Trials' `*_Merge` tables (54 weapons over LegitReligious, 2 NPCs over Heritage, 11:2x–11:33), TDI / Ancient Civilization (profession rows, 2026-10-26, `ConanExiles/docs/17`). The same table can go either way — every pair is proved live | `who-overwrites-table.py --shared-rows` over a world start's log (finds the rows), `_config/live-rows.lua` (the live value per field — the judge) |
| **2. Code** | a game function / event both hook or replace (UE4SS Lua `RegisterHook`, a blueprint override, a mod controller re-setting the same variable; a key binding both claim) | both run, in an order nobody chose; a key — the last binder | grep the mods' Lua for the same `RegisterHook` target / `RegisterKeyBind` key; the game map's tables of keys (e.g. the numpad of the camera mod) |
| **3. Assets** | the same vanilla asset path shipped in two paks (a widget, a blueprint, a texture, a sound) | the pak LATER in `modlist.txt` — the whole file, the other's edits vanish | `mod-overrides.py <out.tsv> <Mods folder>` — rows `override` with the same path in two mods |
| **4. Resources** | the same scarce runtime budget: CPU per frame (polling Lua, per-frame searches), GPU (fog, lights), memory, load time, the HUD's screen space | nobody «wins» — the game slows or the screen crowds | A-B-A flights (`MsCPUBusy`, stutters), the 1 ms rule of `HOUSE_RULES.md` rule 7; frames of the HUD with both mods on |
| **5. Mechanics** | the same gameplay feature done twice (two ambush systems, two loot boosts, two XP pop-ups, two weather systems; balance stacking: two mods each ×2 → ×4) | both act — the feature doubles or fights itself | the mods' descriptions + our catalog notes per mod; a gameplay case that measures the result (drops per kill, ambushes per hour) |
| **6. A mod vs the GAME** (found 2026-11-06) | not two mods: one mod ships a vanilla asset WHOLE, copied from an OLDER game version — the newer game's rows / fields vanish (LegitReligious' stat table: 51 rows of 3.0.1; Storage Reach Expanded's console table: 5 commands) | the mod's stale copy | the `override` rows of `mod-overrides.py` that are data tables → `uaj rows` + a value diff against the game-only view's copy (KUMM EXP-0460); fix — `patch-mod-asset.py` `vanilla:` / `vanilla+own:` |

## The four outcomes (any kind)

| Outcome | What the two sides say | Resolution |
|---|---|---|
| **A — identical** | both bring the same value / the same file / the same behaviour | nothing to do; record «identical» |
| **B — different parts** | each changes parts the other leaves at the original | MERGE: one result = original + A's changes + B's changes, shipped once (in the mod loaded last, or in our own pak), KRINIK MODIFIED — except a Conan table row the later mod merges by field (seen live): build nothing |
| **C — same part, different values** | both change one part differently (a field, one pixel of the same texture, one key, one gameplay number) | the OWNER chooses; then as B with his value |
| **D — one name, two different things** | the shared name is NOT the game's original and the two sides mean different things (two new items under one id, two mods' widgets at one path, one key for two actions) | SEPARATE: rename / renumber / rebind one side and every reference to it (recipes, loot, vendors, spawns, saves — an id stored in players' saves changes, the old item is lost there) |

Kind-specific notes:
- **Tables (Conan):** whether a field the later mod leaves at vanilla SURVIVES depends on how THAT MOD merges (row above): merged by field — it survives, B
  needs nothing built; whole row — it is LOST, B is a merge we build (51420, the 7 EAA spawn rows). Decide every pair by the LIVE table (`live-rows.lua`) with
  the mods unmodified — never by the files alone, never by another pair's rule: on 2026-11-06 the rule was generalized three times (whole row → «the game
  merges by field» → «per table»), and each was refuted by the next live pair (KUMM EXP-0458).
- **Code:** two hooks on one function are fine when they touch different state (B, nothing to merge); when both set the same state, one must own it (C) — usually
  ours yields to the mod's own setting first (rule 8).
- **Assets:** a whole-file override cannot be «merged at runtime»; B means building ONE asset carrying both mods' edits (our kit pak, or one mod's pak).
- **Resources:** the outcome is decided by measurement: A — within noise; B — each mod's cost cut (event instead of polling, rule 7); C — the owner chooses
  which mod keeps the budget; D does not apply.
- **Mechanics:** A — the same feature with the same numbers (keep one mod's, switch the other's part off); B — complementary parts (keep both, check the
  stacking numbers); C — the owner chooses the system; D — two features under one name in the UI → rename.

## Steps

0. **Ask what the two mods share** — beyond the kinds listed: what each mod changes, reads, draws, binds, spends, saves. Every answer is an overlap to judge;
   a new kind goes into the list above.
1. **Detect** with the kind's detector (table above); write the overlaps into the game's findings file (`researches/<game>-…/`).
2. **Read three versions:** the original, side A, side B. Conan: a mod's asset — `python -I -X utf8 ConanExiles/_config/devkit/patch-mod-asset.py extract
   <Container> <Asset> <work>` → JSON (`Exports[0].Table.Data[]` for a table: `{Name: <key>, Value: [{Name: <field>, Value: …}]}`); the original —
   `retoc-5.8 to-legacy --version UE5_7 --no-shaders --filter <Asset> D:/work/ai_sandbox/_paksview-3.0.1 <work>` → `uaj tojson … VER_UE5_8`. Before
   touching a mod, read its notes `games/<Game>/mods/<Mod>.md` (the knowledge-hook demands it; create them if missing).
3. **Classify** part by part against the original → A / B / C / D (a script for tables; by eye for assets and code, with frames).
4. **Resolve** by the outcome table; native, by a map or script next to the pak, KRINIK MODIFIED, `modpack.json` entry `krinikModified` names what was merged.
5. **Verify by the game:** the detector again (tables: the row still merges — check the VALUE live by the remote: `bash _config/pult.sh "lua _G.__lr={table=…,
   mod=…, rows={…}, fields={…}}; return dofile('D:/work/ai_sandbox/ConanExiles/_config/live-rows.lua')"` — SAME / DIFF per field against one mod's table); one in-game look or a measured case of what
   the player sees (the item's stats, the spawn, the drop rate, the frame time).
6. **Record** the outcome in `REGISTER.md` (next to this guide — kept apart so that a new line does not make the guide «changed after reading») and in both
   mods' notes.

Tools (Conan): `who-overwrites-table.py --shared-rows` (step 1, tables) · `row-diff.py <original.json> <row> <modA.json> <modB.json>` (step 3, tables; texts by
their source string) · `patch-mod-asset.py build` with `copyprop:<Row>/<Field>\t<Mod>:<Asset>:<Row>` (step 4 — a whole field from another mod's row, taken from
that mod's pak at every build).
