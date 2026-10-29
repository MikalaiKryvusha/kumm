# TC — rapid fire in first person does not crash the game (bug 66, plan 36 W2)

> **Created:** 2026-10-29 · **Parent:** `bugs/66_DONE_conan_lua_worker_thread_delays_crash_on_rapid_fire.md`
> **Status:** run 2026-10-29 11:19–11:23 — pass (R1–R3)
> **Outbound:** —

**Basis.** The crash of 2026-10-28 20:06: nine LMB draws in FP within 10 s, then «Ref was not function», `EXCEPTION_ACCESS_VIOLATION` in UE4SS.dll.
Fix (pack `854a9e8`): every Lua timer on the game thread.

**Stand.** The beach, god mode, no enemies within 60 m (`K2_DestroyActor`), bow in hand, first person by the REAL wheel; shots by the REAL left
button (`mouse-seq.ps1`), the camera mod and the archery mod live. Dimensions: FP rapid LMB (the crash path), TP rapid LMB, mixed RMB+LMB.

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| R1 | FP rapid LMB ×20 | `lclick` every 450 ms ×20 | the game alive 30 s after; no «Ref was not function» in UE4SS.log; no new crash folder | pass 11:23 — first run 11:19 was TP (6 wheel notches too few); FP confirmed (neck hidden = true), short clicks gave 1 draw, so the crash path was repeated as the owner did it: `ldown 900 ms, lup` ×12 → 9 «натяжка без ПКМ», alive 30 s after, «Ref was not function» 0, crash folders 15 → 15 |
| R2 | TP rapid LMB ×20 | the same in third person | same | pass 11:20 — 20 clicks, alive, 0, 15 → 15 |
| R3 | Mixed ×10 | `rdown,wait:700,lclick,rup` ×10 fast | same | pass 11:20 — alive, 0, 15 → 15 |
