# TC — Conan: a new frame-time baseline after the owner's overclock, and the cost of reflections variant 6 «pure rays»

> **Created:** 2026-11-08 · on the owner's word `[OWNER]` 2026-11-08 23:05 «2 - замер делаем, да» · 23:16 «пока ты изучаешь моды - ты мог бы прогон производительности запустить»
> **Parent:** STATUS «NOW 2026-11-08 22:58» quick win (2); `TC_conan_xp1000_and_water_reflections_2026-11-08.md` R3 (the pre-overclock rtb batch)
> **Status:** 🔲 written 2026-11-08 23:17 +03:00 — not run
> **Outbound:** the numbers → the owner in chat

## 1. Goal vector

Achieve: know (a) what the CPU + DDR4 overclock gave the build on `krinik-show` against the pre-overclock flights of 2026-11-08 12:5x (rtb-A1 / rtb-A2:
47.9 / 51.6 avg FPS, 53.9 / 57.0 median, CPU 18.10 / 17.11 ms, GPU 13.02 / 12.40 ms) and (b) what variant 6 «pure rays» costs against the build as shipped.

## 2. Stand

Background path (`launch-bg.ps1`), world entered by the remote, `no-power-throttle.ps1` on the game PID BEFORE the first flight (EXP-0491), stand keeper OFF
(as rtb), machine lock `kumm`. Variant switch live by `set-reflections.sh now|6` with read-back. Order A-6-A-6 (pesticide: the pair order guards against warm-up drift).
The game is closed by its PID after the batch.

## 3. Cases

| # | Case | Expected | Status |
|---|---|---|---|
| P1 | `set-reflections.sh now` → `bench-flight.sh krinik-show oc-A1` | read-back «0 1»; a PresentMon line with avg / median / CPU / GPU / hitches | — |
| P2 | `set-reflections.sh 6` → `bench-flight.sh krinik-show oc-6a` | read-back «1 0» | — |
| P3 | `now` → `oc-A2` | as P1 | — |
| P4 | `6` → `oc-6b` | as P2 | — |
| P5 | compare oc-A vs rtb-A (overclock) and oc-6 vs oc-A (variant 6) | numbers side by side; a flight with «Undermesh / Delaying playing state» in its window is not counted | — |
