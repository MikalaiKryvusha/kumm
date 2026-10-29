# TC — re-entering the world does not crash the game (bug 65, plan 36 W1)

> **Created:** 2026-10-29 · **Parent:** `bugs/65_DONE_conan_camera_mod_writes_into_departed_hero_crash.md`
> **Status:** run 2026-10-29 11:24–11:35 — pass (E1–E4)
> **Outbound:** —

**Basis.** Bug 65: after «menu → world again» the camera mod wrote into the departed hero → crash. Before DONE: a re-entry plus ≈ 10 min of
play. The agent's path to the menu (new, 2026-10-29): Esc by real input → remote `call W_IngameMenu_C_<N> CloseAndReturnToMainMenu`.

**Stand.** The owner's save, god mode, no enemies near; actions by real input (wheel FP/TP, bow draws and shots). Dimensions: two re-entries,
camera mod and archery after each, the FP neck hook on the new hero. Not covered: death and respawn.

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| E1 | Exit to the menu by the agent | Esc + `CloseAndReturnToMainMenu` | the main menu, the game alive | pass 11:25:03 — `LoadMap: /Game/Maps/Startup`; again 11:28:57 |
| E2 | Re-enter, play 3 min | `enter-world-remote.sh`, wheel in/out ×3, 10 shots, idle | alive; no new crash folder; no «TrivialObject» errors of our mods in UE4SS.log | pass 11:25:14–11:28:33 — alive, crash folders 15 → 15; the only «TrivialObject» lines are the bug-65 guard «не живой герой, запись пропущена» while in the menu |
| E3 | Second re-entry, play 7 min | same | same; 10 min of play in total after re-entries | pass 11:29:05–11:35:15 — alive, 15 → 15, «Ref was not function» 0; ≈ 9.5 min of play after the two re-entries |
| E4 | FP neck on the new hero | wheel into FP after re-entry | neck hidden = true | pass 11:25 — true on the new hero |
