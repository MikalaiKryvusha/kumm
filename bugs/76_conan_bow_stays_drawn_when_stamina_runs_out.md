# Bug 76 — the bow stays in the hero's hands with the string drawn when stamina runs out mid-draw

**Status:** 🔧 FIXED 2026-11-02 13:5x, verified B1–B3 in the build (the owner's own play pending) · **Severity:** S2 (a visible stuck pose in core gameplay) · **Version/build:** pack ConanExiles `c817b4e`, KrinikConanArchery 1.0.0
(Lua 0.7.0: aim kept on a new draw, leaving the aim on RMB release, the native draw montage edited in the kit pak) · **When/context:** 2026-11-02 12:50 +03:00,
the owner's play in the full build (tossed mid-task, during the shock-wave hunt)
**Fixing:** this session, right after the arrow-choice flicker recording

`[OWNER]` «баг, когда герой натягивает лук, но у него заканчивается выносливость - герой пркращает натяжение, но лук остаётся в руках героя с натянутой
титевой» · 2026-11-02 12:50 (with a screenshot: third person, the hero holds the bow low before him, the string pulled back to his chest, no arrow).

## Symptom

The hero draws the bow (RMB held); stamina reaches zero; the draw stops, yet the bow stays in the drawn pose — the string stretched to the chest.
Expected: when stamina ends the draw, the hero lowers the bow with a relaxed string (the vanilla behaviour, to be confirmed by the control case).

**The owner's frame — the reference** («Снимок экрана 2026-11-02 124938.png» in his Pictures\Screenshots, 1101×752, opened for him 13:39): the hero faces
the camera, BOTH hands on the bow's grip low before the belly, and the string runs from both bow tips UP to the chest strap ring — a deep triangle with no
hand on the string. The defect is the string left at the drawn point, not the stance. Every comparison is made from THIS angle (front), side by side with
this frame — a frame from behind hides the string's shape (the 13:2x «vanilla stance» conclusion was drawn from behind and is unproven).

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
**So the pose is the game's own combat-ready stance after any draw, not a stamina defect.** Found on the way — OURS: with RMB held through the break, **CORRECTED 2026-11-02 13:5x: the conclusion above was drawn from BEHIND and is WRONG for the owner's case — his front frame shows the string frozen at the drawn point (a triangle to the chest, hands on the grip): the bow's string animation `A_combat_bow_string_heavy_charge` stuck on its last frame after a draw cut by exhaustion; fixed in KrinikConanArchery (bug 76, B1–B3 pass). Vanilla from the front — not checked.**
`hold_aim_on_redraw` (KrinikConanArchery `on_fov_target`) reads the montage's FOV reset as a re-draw and keeps the aim zoom while the hero no longer draws
(log «прицел: новое натяжение с ПКМ — обзор держим 75.0°», case S5). Candidates: our pak's montage edit (the aim notify runs to the montage end — an interrupted draw may never reach the end), our Lua «aim kept on a
new draw» / `watch_release` keeping the aim while RMB is held, or vanilla.

## Root cause / Hypotheses

Vanilla: the bow's combat-ready stance (≈ 10–11 s after any draw). Hypotheses (1) our montage edit and (2) our Lua — refuted by S2/S3. The owner decides **CORRECTED 2026-11-02 13:5x: the conclusion above was drawn from BEHIND and is WRONG for the owner's case — his front frame shows the string frozen at the drawn point (a triangle to the chest, hands on the grip): the bow's string animation `A_combat_bow_string_heavy_charge` stuck on its last frame after a draw cut by exhaustion; fixed in KrinikConanArchery (bug 76, B1–B3 pass). Vanilla from the front — not checked.**
what he wants (asked 2026-11-02 13:2x in chat): keep the game's stance · lower the bow at once when stamina breaks a draw · shorten the stance after any shot.
Independent of his answer: the aim zoom kept through the break (S5, ours) — FIXED 2026-11-02 13:2x: the re-draw hold needs a shot since the aim entry (S6, S7 pass).

## Root cause — found 2026-11-02 13:45–13:47 (the owner's repros under a remote log)

The bow's string is the bow's OWN skeletal animation (`BP_bow_2h_C` → `SkeletalMeshComponent`, `AnimSingleNodeInstance`), driven by the hero's montage
`AM_combat_2h_bow_combo_heavy_c0` notifies through `AB_human_male_C`: `bow_secondary_draw` @0.067 starts `A_combat_bow_string_heavy_charge` (1.833 s),
`bow_secondary_loop` @1.833 → `…heavy_loop`, the shot → `…heavy_fire`, `bow_secondary_settle` @6.843 → `A_bow_3rd_secondary_special_settle`; a plain RMB up
also ends on the settle animation. A draw started at LOW stamina (the owner: «ПКМ прицел при низкой выносливости»; at ≈ 5 of 99, not below zero — then no
draw starts) is cut by exhaustion (substate 14) at 0.41–0.46 of the montage, before the charge hold (0.517): the charge animation keeps running to its last
frame (1.833/1.833) and nothing settles it — the string stays at the drawn point on the chest, the hands back on the grip (the triangle).
Whether the vanilla game has the same defect was NOT checked from the front; the fix is ours either way.

## Fix (pack after `51da102`)

KrinikConanArchery `settle_if_stuck`: a post-hook of `/Game/Characters/BasePlayerChar.BasePlayerChar_C:OnSubstateChanged_Attacking` (Entered = false),
100 ms later — if the bow montage no longer plays and the bow's string animation is still `…string_heavy_charge`, the game's own
`AB_human_male_C:AnimNotify_bow_secondary_settle()`. No setting (`[OWNER]` 13:49 «доп настройка этому фиксу не нужна, он просто идет в поставке мода Archery»).
Seen: B1 pass (the string settles, frame `b1.webp`), B2 and B3 pass (a shot and a long hold — untouched). Report
`testcases/reports/2026-11-02_conan-arrow-choice-and-bow-stance.md`.
Hygiene: Lua syntax. Functional run: B1–B3 in the live build by real RMB/LMB with the game in front, the string state read by the remote, a frame.

## Decisions made without the owner

— (filled at closing)

## Links

`games/ConanExiles/mods/KrinikConanArchery.md` · bug 64 item 29 (arrow-choice flicker, the same draw).
