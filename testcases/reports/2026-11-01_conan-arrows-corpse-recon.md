# Test run report — Conan: arrows stuck in an enemy should stay in its corpse (recon, not done)

**Created:** 2026-11-01 13:13 +03:00 · **Run by:** the agent (Claude Opus 5.5) · **Version/build:** Conan 3.0.1 build; KrinikConanArchery `main.lua` section «стрелы в трупе», six deploys 12:49–13:12

## 1. Work

`[OWNER]` 2026-11-01 09:11 «После смерти - регдол труп врага не должен уничтожать воткнутые в него стрелы - все стрелы сохраняются, торчат из трупа, их можно
собрать.» Cases A1–A5 of `testcases/TC_conan_arrows_stay_in_corpse_2026-11-01.md`.

## 2. Contour

The owner's machine, the live build, game behind; save restored from `_save-backup/2026-10-31_1656-before-manager-check` (armour and a bow in slot 1); god on,
food and water filled; a green Kappa summoned, placed 8 m ahead and frozen (`arrow-stand.sh`), 2–3 real shots (`aim-shot.sh 1200`), the kill by `KillCharacter`.
REAL WORLD: accumulated — the owner's install and an older save of his; data and machine — his PC; path — real shots, a real death.

## 3. Runs

| # | Moment | Command / change | Outcome |
|---|---|---|---|
| 1 | 2026-11-01 12:51 +03:00 | pre-hook on `DestroyDummyIfAttachedObjectIsDestroyed` → new copy on the nearest corpse | the hook stood; after the kill 3 copies detached at 0 0 0, life 0; no hook call |
| 2 | 2026-11-01 12:53 +03:00 | remote probe: `NotifyOnNewObject(/Game/Characters/Corpse.Corpse_C)` | at corpse birth 2 copies still attached to the Kappa |
| 3 | 2026-11-01 12:55 +03:00 | section on corpse birth (class `Corpse_C`) | no birth seen: the blueprint class is not loaded at mod start |
| 4 | 2026-11-01 12:59 +03:00 | class → native `/Script/ConanSandbox.CorpseBase` + an entry log | births seen («копий 2», «копий 0»); nothing moved — the creature still valid at +150 ms |
| 5 | 2026-11-01 13:02 +03:00 | distance criterion | the corpse ACTOR stands 3 700 cm from the body; per-copy errors drowned by the section's shared error counter (5 used) |
| 6 | 2026-11-01 13:04–13:07 +03:00 | own error counter; bone distance; then location by `K2_GetActorLocation` (GetTransform gave zeros) | new copies spawned from Lua at 0 0 0, attach false — a copy without its own hit leaves at once |
| 7 | 2026-11-01 13:09 +03:00 | re-attach the OLD copies to the corpse bone, life = the corpse's (600 s) | log: 3 re-attached, place kept, attach true; 10 s later 0 copies |
| 8 | 2026-11-01 13:10 +03:00 | remote hooks on `DestroyDummyIfAttachedObjectIsDestroyed` and `Actor:K2_DestroyActor` | 2 × «K2_DestroyActor on a copy» + «destroy-event» ≈ 1–2 s after the death |
| 9 | 2026-11-01 13:11 +03:00 | `kismet-trace.py … DestroyDummyIfAttachedObjectIsDestroyed` / ubergraph from 3484 | the event jumps to ubergraph 3484 = `K2_DestroyActor` FIRST, no condition |

## 4. Checks

Hygiene: `lua loadfile`, `check-lua-game-thread.py` (0), `check-lua-templates.py` (0) on every change.
Functional run: real shots and a real death in the live game; read — the section's log, the copies' attach parents, places and life spans by the remote, the
probe hooks' file.

| Case | Status | Observed |
|---|---|---|
| A1 the hook / subscription stands | pass | «родился Corpse_C, прицепленных к существам копий 3» |
| A2 arrows move to the corpse | fail | re-attached (attach true, place kept) and then destroyed by the game's own event 1–2 s later |
| A3 seen on the ragdoll | blocked | no copy survives |
| A4 picked up | blocked | — |
| A5 humanoid | not run | — |

## 5. Found

- **Why arrows leave the corpse (bytecode, final):** the copy binds `DestroyDummyIfAttachedObjectIsDestroyed` to the HIT ACTOR's `OnDestroyed`; that event enters the
  ubergraph at 3484 = `K2_DestroyActor` with no check. Re-attaching cannot save a copy; it must be unbound from the creature (no Lua tool found) or replaced by a copy
  that has its own hit on the corpse mesh (a Lua-spawned copy without one dies at once).
- **A leak of our own, closed:** with our «в тушку» push, the copies of a killed creature were NOT destroyed — they hung at 0 0 0 with no life span for the rest of
  the session (runs 1, 3–6: 3–6 orphans). With the corpse re-attach they are destroyed by the game's event — 0 copies 10 s after the kill (run 7).
- `GetTransform()` read from Lua returns zeros; `K2_GetActorLocation/Rotation` work.
- The corpse actor's location is not the body's (3 700 cm off) — match by the same bone on the corpse mesh (131–165 cm on a Kappa ragdoll).
- `NotifyOnNewObject` on a blueprint class not yet loaded never fires; the native parent (`CorpseBase`) does.
- A section's shared error counter (5) silenced the new section's errors — the new code has its own.

## 6. Traces

`UE4SS.log` 12:49–13:12 (`[KrinikConanArchery]` «стрелы в трупе»); probe files `corpse_probe.txt`, `destroy_probe.txt`, bytecode `dummy_bp/uber.txt` in the session
scratchpad. Crash-report window: none (six launches, all closed cleanly).

## 7. Verdict

fail for the feature (A2–A4), pass for the leak fix (A1 and the orphan count) — the next step and its two routes are in the mod notes, Open.
