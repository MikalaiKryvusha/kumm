# Bug 76 — the bow stays in the hero's hands with the string drawn when stamina runs out mid-draw

**Status:** 🔴 OPEN · **Severity:** S2 (a visible stuck pose in core gameplay) · **Version/build:** pack ConanExiles `c817b4e`, KrinikConanArchery 1.0.0
(Lua 0.7.0: aim kept on a new draw, leaving the aim on RMB release, the native draw montage edited in the kit pak) · **When/context:** 2026-11-02 12:50 +03:00,
the owner's play in the full build (tossed mid-task, during the shock-wave hunt)
**Fixing:** this session, right after the arrow-choice flicker recording

`[OWNER]` «баг, когда герой натягивает лук, но у него заканчивается выносливость - герой пркращает натяжение, но лук остаётся в руках героя с натянутой
титевой» · 2026-11-02 12:50 (with a screenshot: third person, the hero holds the bow low before him, the string pulled back to his chest, no arrow).

## Symptom

The hero draws the bow (RMB held); stamina reaches zero; the draw stops, yet the bow stays in the drawn pose — the string stretched to the chest.
Expected: when stamina ends the draw, the hero lowers the bow with a relaxed string (the vanilla behaviour, to be confirmed by the control case).

## Repro

Stand: quiet place (`quiet-stand.lua`), the bow in hand, stamina set low by the remote. RMB held until stamina is 0; a frame of the hero (third person) and
the archery log. Control (HOUSE_RULES rule 24): the same with KrinikConanArchery's Lua out, then with its pak out — who keeps the pose.

## Forensics

**Control runs 2026-11-02 13:12–13:21** (cases S1–S5 of `testcases/TC_conan_aim_flicker_and_stamina_2026-11-02.md`; stand: oasis, quiet, god mode; the
break made by `AdjustStaminaCurrent(-200)` mid-draw — HUD stamina −60/99):
- full build: the stuck-looking pose after RMB up — bow horizontal before the hero, the string at his right hand (the owner's screenshot);
- KrinikConanArchery Lua out — the same pose; its pak out too — the same; NO paks and only the remote Lua — the same, AND the same pose after a plain
  1.2 s draw with full stamina;
- vanilla timing (30 s at 10 fps): the stance holds ≈ 10–11 s after RMB up, then the hero lowers the bow himself (left hand, slanted, string straight).
**So the pose is the game's own combat-ready stance after any draw, not a stamina defect.** Found on the way — OURS: with RMB held through the break, **CORRECTION 2026-11-02 13:39 — UNPROVEN: the poses were compared from BEHIND the hero, where the string's shape is hidden; the owner's screenshot (front) shows a TRIANGULAR string (`[OWNER]` 13:38 «ТАК А ТИТЕВУ ТЫ ВИДЕЛ ИЗ СКРИНА … ОНА ТРЕУГОЛЬНАЯ!!!»). Re-check from the front pending.**
`hold_aim_on_redraw` (KrinikConanArchery `on_fov_target`) reads the montage's FOV reset as a re-draw and keeps the aim zoom while the hero no longer draws
(log «прицел: новое натяжение с ПКМ — обзор держим 75.0°», case S5). Candidates: our pak's montage edit (the aim notify runs to the montage end — an interrupted draw may never reach the end), our Lua «aim kept on a
new draw» / `watch_release` keeping the aim while RMB is held, or vanilla.

## Root cause / Hypotheses

Vanilla: the bow's combat-ready stance (≈ 10–11 s after any draw). Hypotheses (1) our montage edit and (2) our Lua — refuted by S2/S3. The owner decides **CORRECTION 2026-11-02 13:39 — UNPROVEN: the poses were compared from BEHIND the hero, where the string's shape is hidden; the owner's screenshot (front) shows a TRIANGULAR string (`[OWNER]` 13:38 «ТАК А ТИТЕВУ ТЫ ВИДЕЛ ИЗ СКРИНА … ОНА ТРЕУГОЛЬНАЯ!!!»). Re-check from the front pending.**
what he wants (asked 2026-11-02 13:2x in chat): keep the game's stance · lower the bow at once when stamina breaks a draw · shorten the stance after any shot.
Independent of his answer: the aim zoom kept through the break (S5, ours) — FIXED 2026-11-02 13:2x: the re-draw hold needs a shot since the aim entry (S6, S7 pass).

## Fix plan

Control case first, then the cause fix at its source (HOUSE_RULES rule 24) — no pose patch after the fact.

## Decisions made without the owner

— (filled at closing)

## Links

`games/ConanExiles/mods/KrinikConanArchery.md` · bug 64 item 29 (arrow-choice flicker, the same draw).
