# Bug 73 — Conan build: arrows shot into the ground hang in the air before the hit point and vanish fast

**Status:** 🔧 «in the air» fixed and seen 2026-11-01 15:26 (cause: our ×3 arrow mesh); «vanish fast» fixed 2026-11-01 17:41 (5 min, hub row 1–30 — the owner 16:18); the ×3 visual arrow joined at the tip — built and seen 2026-11-01 17:50 (cases V1–V3), its look waits for the owner (review folder 50) · **Severity:** S2 · **Version/build:** Conan Exiles 3.0.1 build 1.0.0 (pre-release), KrinikConanArchery 1.0.0
**When/context:** 2026-11-01 15:06, seen by the owner on his screen while the agent shot six arrows into the sand (plan 40.2, row «Стрелы не ломаются»)
**Fixing:** this session — the control case first (HOUSE_RULES rule 24)

## Symptom

`[OWNER]` 2026-11-01 15:06 «ты сейчас тестирвоал стрелы об землю · вижу баги · 1) стрелы быстро исчезают · 2) стрелы висят в воздухе».

## Repro (deterministic)

Stand: oasis, god on, bow in slot 1. `pult.sh "lua … pc:SetControlRotation({Pitch=-35.0, …})"` (look at the sand), `bash _config/aim-shot.sh 300` ×6.
Log: «#N из лука … щуп — LandscapeHeightfieldCollisionComponent_17 … копия стрелы #N: удар в …»; 2–3 s later only 2 live `BP_DummyProjectile_C` remain.

## Forensics

- KrinikConanArchery notes (2026-10-31): the stuck copy is born ≈ 1.8 m SHORT of the hit's `ImpactPoint`, «where the arrow was before its last flight step»;
  for creatures a push «в тушку» moves it after its birth (`sink_into_body`, `main.lua` ≈ 444–506); for every other surface the function returned early —
  so in the ground the copy stays 1.8 m before the hit, in the air.
- The control case was NEVER run: does the game without our Lua archery (no velocity redirect, no speed by draw) put the copy at the hit point?

## Root cause / Hypotheses

1. (most likely) Our mod: the arrow's velocity is rewritten after the game spawned it (the redirect onto the camera probe line, the draw speed); the game's
   copy placement reads a position / velocity pair that our change made inconsistent — the copy lands one flight step short.
2. The game itself places the copy one step short at high speed (5000 cm/s ≈ 83 cm per frame at 60 fps; 1.8 m ≈ two frames).
3. Vanish: the copy's own `ProjectileDummyLifetime` for a ground hit — vanilla value unknown; or the game's break chance 0.65 (`CanBreakOnImpact` true when
   «Стрелы не ломаются» is off).

## Fix plan

1. Control: archery Lua off (`enabled.txt` moved out) — shots into the sand and into a frozen Kappa, side frames: where the copy stands, how long it lives.
2. By the result: our cause → fix the redirect so the game places the copy right (and remove `sink_into_body` — a crutch by rule 24); the game's cause →
   fix the placement at its source (`BP_BaseProjectile.SpawnDummyProjectile` / its position read) natively.
3. Re-run both surfaces with the build mod on; frames.

## Result (2026-11-01 15:08–15:27, cases A1–A6 of `testcases/TC_conan_hub_rows_audit_2026-11-01.md`)

- Control (our Lua off): the copy stands 62 cm from the hit — right. With the mod: 187 cm, also with our ballistics off; with `mesh_scale` 1: 62.
- Cause: `dress_arrow` grew `ProjectileMesh` ×3; the game's `GetAdjustedProjectileImpactPosition` backs the copy off the hit by that mesh's bounds.
- Restoring the size in a pre-hook of `SpawnDummyProjectile` did not help (bounds read earlier) — dropped.
- Fix: `mesh_scale` 1.0; the push «в тушку» (`sink_into_body`, numbers per creature) removed — the game places every copy itself. Seen: sand and a Kappa's head at 62 cm.
- Vanish: the copy lives 15 s with or without our mod (`ProjectileDummyLifetime`) — the game's behaviour.

## The owner's answers 2026-11-01 16:17–16:18

- `[OWNER]` «Да» (16:17) to «Вернуть ли стреле трёхкратный размер в полёте» — the big arrow in flight returns, by a route that does not grow `ProjectileMesh`.
- `[OWNER]` 16:18 «срок жизни стрел везде, и в земле, и в трупах, и в стенах нужжжжжжжжжен 5 минут - с возможностью настроить в модах стрельбы из лука - в
  минутах, от 1, до 30» — the copy's life 5 min by default, a hub row 1–30 min on the archery page.

- `[OWNER]` 16:23 «значит лететь в воздухе должна физическая оригинальная стрела x1 размера, а визуальная модель лететь должна x3. Физическая стрела и
  визуальная модель сввввввввввввввввязаны в наккооооооооооооооооонечникееееееее» — the route: physical ×1 + a separate visual ×3, joined at the tip.

## The life applied (2026-11-01 17:42 +03:00)

The hero's arrow gets `DummyProjectileOnGroundLifetime` and `DummyProjectileAttachedToCharacterLifetime` = the hub row `arc_stuck_min` × 60 at the shot (the copy's
own `ProjectileDummyLifetime` is filled by the game from them); the row «Сколько стрела торчит в цели», 1–30 min, default 5. Seen: 299.9 s by default, alive past
15 s, 59.9 s at 1 min, back to 299.9 s (report `testcases/reports/2026-11-01_conan-arrow-stuck-life.md`, cases L1–L5). Open in this bug: the ×3 visual arrow joined
at the tip (16:23); corpses keep their arrows — plan 40 phase 4.

## Decisions made without the owner

- `[AI]` the arrow mesh back to native size (1.0) until his word — the ×3 was his «до x3»; the choice put to him in chat 15:2x (answered 16:17 — the route above).
- `[AI]` the life is set for the HERO's arrows only (the code that dresses the hero's shot); NPC archers' arrows keep the game's life.
- `[AI]` the row's words: «Сколько стрела торчит в цели» · «в минутах» · «Сколько воткнутая стрела героя остаётся в земле, в стене или в противнике, прежде чем исчезнуть.»

## Links

`games/ConanExiles/mods/KrinikConanArchery.md` (stuck arrow copies); plan 36 W13; epic 40 phase 4 (arrows in the corpse — same copy mechanics).
