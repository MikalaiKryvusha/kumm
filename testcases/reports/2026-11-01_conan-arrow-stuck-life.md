# Test run report — a stuck arrow lives 5 minutes; the hub row «Сколько стрела торчит в цели» (bug 73, the owner's decision 16:18)

**Created:** 2026-11-01 17:42 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** pack ConanExiles after `1422b91` (uncommitted at the run; committed with this
report): KrinikConanArchery Lua (`dress_arrow`), KrinikConanUI hub row `arc_stuck_min` (kit pak rebuilt)

## 1. Work

`[OWNER]` 2026-11-01 16:18 «срок жизни стрел везде, и в земле, и в трупах, и в стенах нужжжжжжжжжен 5 минут - с возможностью настроить в модах стрельбы из лука -
в минутах, от 1, до 30». Cases L1–L5 of `testcases/TC_conan_hub_rows_audit_2026-11-01.md` (section «Bug 73, the owner's decision 16:18»). Corpses — with plan 40
phase 4 (the game destroys the copies with the creature; not in this run).

## 2. Contour

The live game 3.0.1 in front at 4K; the live save at the oasis; god on, hunger and thirst frozen by the remote; a green Kappa summoned, placed 8 m ahead and frozen
(`_config/arrow-stand.sh`); shots by real mouse buttons (`mouse-seq.ps1`), the hub by the real mouse. Machine lock `kumm` 17:29–17:41.
REAL WORLD: accumulated — the owner's live save and his settings store `Saved/KrinikSettings.lua` (the run ended with the store as it was: the default writes no
key); data and machine — his machine and game; path — the player's door: the bow → a shot; the inventory → «Настройки модов» → «Моды Krinik'а» → the archery page.

## 3. Runs

| # | Moment | Command | Exit / outcome |
|---|---|---|---|
| 1 | 2026-11-01 17:26 +03:00 | `UnrealEditor-Cmd … -Script=…kit-krinik-modsettings.py -ModDevKit -NullRHI` ×2, `kit-buildmod.py KrinikConanUI <out>`, `Deploy-ModPack.ps1 -Deploy -Only KrinikConanUI,KrinikConanArchery` | run 1 exit 1 (the GUID ensure on the new row — the known trap), run 2 exit 0; deploy 2/2, verify 108/108 |
| 2 | 2026-11-01 17:30 +03:00 | `launch-fg.ps1`, `enter-world-remote.sh`, `arrow-stand.sh summon / place 8 / freeze`, `aim-shot.sh 1000` | L1 frame pass; the copy 14.9 s — FAIL (the field set does not exist on the flying arrow) |
| 3 | 2026-11-01 17:34 +03:00 | `pult.sh "props <BP_Visual_BowProjectileBase_C_N>"` | the arrow's fields `DummyProjectileOnGroundLifetime` 30, `DummyProjectileAttachedToCharacterLifetime` 15 |
| 4 | 2026-11-01 17:35 +03:00 | the fix deployed (`-Only KrinikConanArchery`), relaunch, a shot | L2 pass (299.9 s), L3 pass (279.7 s left at 20 s) |
| 5 | 2026-11-01 17:40 +03:00 | the row to 1 by the real mouse, save, `exec MakeMeAdmin` + `exec SpawnItem 51405 1` (the save's bow broke), a shot | L4 pass (59.9 s) |
| 6 | 2026-11-01 17:41 +03:00 | the row back to 5, save, a shot | L5 pass (299.9 s) |

## 4. Checks

Hygiene: `lua -e "assert(loadfile(…))"` for the archery `main.lua` and the hub section; the kit report lists `arc_stuck_min` (2 entries).
Functional run: shots at a frozen Kappa by real mouse buttons, the hub row moved and saved by the real mouse; read — the archery log lines «настройки окна … стрела
торчит N мин» and «копия стрелы #N … срок X с», the copy's `GetLifeSpan()` by the remote, frames of the hub page.
L1 pass · L2 pass · L3 pass · L4 pass · L5 pass.

## 5. Found

1. The flying arrow has no `ProjectileDummyLifetime` (only the copy has it) — the first build set a non-existent field and changed nothing; fixed: the arrow's
   `DummyProjectileOnGroundLifetime` and `DummyProjectileAttachedToCharacterLifetime`.
2. Stand: the first key of each `mouse-seq.ps1` sequence is eaten by the window's activation (EXP-0412) — the key 1 toggles looked random; an F13 opener fixes it.
3. Stand: the save's bow broke in the stands; a spawned bow landed in quick slot 3.
4. Stand: the frozen Kappa walked up to the hero after an inventory visit — re-placed and re-frozen before each shot.

## 6. Traces

The UE4SS log lines `[KrinikConanArchery] настройки окна …` (17:34:55, 17:40:50, 17:41:33) and `копия стрелы #1..#3` (17:36:32, 17:40:51, 17:41:34); frames in
the session scratchpad (`f/l1.jpg`, `l4ac.jpg`, `l5c.jpg`, `state.jpg`, `inv2s.jpg`); the kit report `ConanExiles/_config/devkit/kit-krinik-modsettings.json`.

## 7. Verdict

pass — L1–L5 seen working on the player's path; corpses stay with plan 40 phase 4.
