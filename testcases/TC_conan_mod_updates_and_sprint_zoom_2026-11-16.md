# TC — Conan 3.1.0: the two newer author uploads in the build (EAA, TDI_LegendaryRepair) and the aim zoom vs the sprint

> **Created:** 2026-11-16 · on the owner's words 18:40 (the zoom order, bug 93) and 18:47 («давай тогда моды сборки обновлять от тех авторов, кто выпустил обновляения,
> адаптируем их свежие версии под нашу сборку» · «других авторов не жёдем, продолжаем сборку разрабатывать») · **Parent:** plan 53 steps 2–3b / 12 · bug 93 ·
> **Status:** 🔧 in progress · **Outbound:** —

## Test basis

- Plan 53 acceptance 1–3, 6: the game enters the world; every enabled pak mounts («СБОРКА: моды N/N»); UE4SS starts; no «too old» / missing imports.
- EAA's notes: our two edits survive an author update — the spawn merge with BMNB (21 `copyprop:` lines, 7/7 rows) and the crafting station = the game's own chunk.
- TDI's notes: its repair kit stays in the tier-4 crafters' `BonusRecipes` next to Ancient Civilization's group.
- Bug 93 Z1–Z6 (the owner's order 18:40): the zoom off in a sprint, back by itself when the sprint ends with RMB held, none when the aim starts in a sprint.

## Stand

The owner's last save (Continue), background path while he works, the machine lock; god on. Z1–Z6 — real RMB / Shift / W by `mouse-seq.ps1` on a FREE PC with the game
in front (HOUSE_RULES rule 30), the crafted bow in hand, open sand (the oasis spot of 2026-11-16, 18182 244749).

## Cases

| # | Case | Expected | Status |
|---|---|---|---|
| U1 | Build EAA on the 2026-11-16 upload, `--against-original` | only the recipe's assets differ from the NEW original; the crafting station = the 3.1.0 game chunk | **pass** 18:51 — 1474 chunks byte for byte, 5 intentionally changed (AC_EAA_Inventorybutton, AC_acs_AccessorySystem_Persistent, DT_EAA_UIModule, DT_EAA_Spawntable, BP_PL_Crafting_Station), wrapper 5 equal; installed 18:5x |
| U2 | Launch: the mounts | «СБОРКА: моды 66/66»; `ConanSandbox.log` — EAA and TDI mounted, 0 «too old», 0 missing imports | **pass** 18:54 — «СБОРКА: моды 66/66», «[Enhanced] Armory and Arsenal v1.3.13» and «TDI_LegendaryRepair [Enhanced]» mounting lines, 0 / 0 |
| U3 | EAA spawn merge live | the 7 shared spawn rows carry both mods' fields (BMNB profession / stat templates + EAA tags / loot) | **by build only** — `DT_EAA_Spawntable` is among the recipe's 5 changed chunks (the `copyprop:` lines applied on the new original); the live row read — not run |
| U4 | TDI repair kit live | `Armorer_4` / `Blacksmith_4` bonus recipes include 22120501 / 22120500 | not run (the mounted pak only) |
| Z0 | KrinikConanArchery loads with the new section | `UE4SS.log`: «зум и спринт: перехват … поставлен», no Lua error | **pass** 18:53 / 18:57 — the BasePlayerChar_C path «не встал», the BaseBPCombat_C path «поставлен» |
| Z1 | Aim (RMB) standing | zoom in (75°) | **pass by the remote** 18:59 — `FieldOfViewChange(0.1, 1)` → mode 1, 75.0° (the real RMB — owed) |
| Z2 | Aim, then sprint (Shift + W) | the zoom goes | **pass by the remote** 18:59 — the forward run (`sprint-run-probe.lua`) → mode 2, 102.1° (the game's own); real keys owed |
| Z3 | Aim held, the sprint ends | the zoom comes back by itself | **fail (blocked)** 19:05 by real keys — at the Shift release the DRAW itself ends (substates 15 / 16 gone, mode 0) with RMB held: the bow sprint on 3.1.0, not the zoom; Z1 / Z2 pass by real keys in the same series |
| Z4 | Sprint first, then RMB | no zoom while sprinting | **pass by the remote** 18:59 — the aim asked in the sprint: the angle stayed 102.1°, mode back to 2 within 0.3 s, log «прикладка в спринте — без зума»; real keys owed |
| Z5 | Then the sprint stops, RMB held | the zoom comes in by itself | **fail (blocked)** 19:06 by real keys — an RMB in a sprint starts NO draw on 3.1.0 (no 15 / 16 in the whole series), mode 2 all along |
| Z6 | RMB released | the normal view, as before | NOT RUN — real keys |
