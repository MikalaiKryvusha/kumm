# TC — key binds leave UE4SS's input thread (bug 85)

> **Created:** 2026-11-07 · **Parent:** `bugs/85_conan_crash_keybind_lua_races_game_thread.md`
> **Status:** cases written 2026-11-07 21:37 +03:00; run below
> **Outbound:** —

## Test basis

- Bug 85, root cause: a `RegisterKeyBind` callback runs Lua on UE4SS's event-loop thread while the same mod's game-thread Lua runs → shared Lua heap corrupted → crash.
- Expected after the fix: no enabled Krinik mod registers a key bind; KrinikConanArchery keeps the arrows-in-corpse feature; KrinikConanCamera's numpad keys work
  as before (plain vs Ctrl), driven by the hero blueprint's `InpActEvt_AnyKey_K2Node_InputKeyEvent_1` on the game thread.

## Stand

- Game: `D:/Games/Conan Exiles 3.0.1`, background launch (`launch-bg.ps1`), world entry by the remote; machine lock taken.
- Hero: god mode, a bow + arrows by the remote; creature: a spawned Imp or Kappa 8–10 m in front, frozen; stand keeper on (rule 11 6a).
- Shots: the remote's `LaunchProjectile()` on the hero (background twin of a real shot); numpad cases need real keys — only when `owner-idle.ps1` says FREE.
- The owner's camera `config.lua` copied out before the deploy and put back after it.

## Dimensions

Equivalence: plain key / Ctrl+key / an unbound key; mods: Archery, Camera (UI — open twin, not in this set). Not covered: the race itself (rare, not
deterministic — judged by the guard and the source, not by a repro).

## Cases

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| K1 | Guard after the fix | `python -I -X utf8 ConanExiles/_config/check-lua-game-thread.py` on the deployed mods | no line of KrinikConanArchery or KrinikConanCamera; KrinikConanUI lines (the open twin) remain | pass 21:38 — 5 lines left, all KrinikConanUI (one a false hit in a block comment, `krinik_mods_button.lua:18`) |
| K2 | Archery loads | world entry, `UE4SS.log` | Archery lines «стрелы в трупе: копии цепляются…», no Lua error of the mod | pass 21:38:24 — the line present, 0 Archery error lines |
| K3 | Arrows stay in a corpse | 2–3 remote shots into the creature, then kill it with a shot | log «прицеплено N», N ≥ 1; the corpse loot holds N arrows (remote `GetNumberOfItemsByTemplate`) | pass 21:40:29–21:40:50 — run by the OWNER's own bow kills (his word 21:39: «я вылет при убийстве буду проверять сам»), 5 corpses, «прицеплено 1» each (bones pelvis/spine/head); his quick loot 21:40:54 → «древко убрано» — the sync without keys works; game alive after |
| K4 | Camera key hook | world entry, log | «клавиши камеры: событие героя «любая клавиша» подписано» | pass 22:08:14 (3rd launch) — «клавиши камеры: событие героя «любая клавиша» подписано» + RegisterHook line; installed from try_install_zoom_hook (the hero-birth NotifyOnNewObject never fires in this UE4SS build — runs 21:39 and 22:05 failed) |
| K5 | Numpad 8 (plain) | real Num8 once | log «offset_x = <old + step>» | pass 22:09:28 — real Num8 (mouse-seq, one process) → «offset_x = 5.0» |
| K6 | Ctrl + Num9 | real Ctrl+Num9 | log «camera_pitch = …», NOT «offset_z = …» | pass 22:09:28 — real Ctrl+Num9 → «camera_pitch = 3.0», no offset_z line |
| K7 | Num9 alone | real Num9 | log «offset_z = …», NOT «camera_pitch» | pass 22:09:29 — real Num9 → «offset_z = 55.0», no camera_pitch; reverts Num2 / Ctrl+Num3 / Num3 → 0 / 2 / 50; a remote counter on the same event saw all 9 presses with names |
| K8 | Other keys untouched | real W / Space / LMB in the world | the hero walks, jumps, attacks; no camera log line | [NOT-RUN] |
| K10 | Arrow into an already dead body (`[OWNER]` 21:41 «когда моб умер, но в его тело ещё стреляют - эти стрелы тоже нужно класть в добычу моба») | kill a creature, then 2 more shots into the corpse | log «стрела в мёртвом теле: … в добычу трупа (в добыче N)» per shot, N grows by 1; the shafts stay in the body; E on a shaft takes nothing; taking the arrows from the loot removes the shafts | [NOT-RUN] — code in the game folder 21:42, loads at the next launch |
| K11 | Draw time by Agility (`[OWNER]` 21:43, base 5 s decided 21:46) | world entry; read the hero's Agility n; one full draw with RMB held | log «натяжение: Проворство n → полное за 5×0.99^n с (заряд … вместо родных 1.28)»; the «дзинь» comes at ≈ that time from the press (60 fps clip + audio) | pass 22:14 (after a fix) — first build gave charge 0.36 at a 4.5 s hold (the game stamps the charge end at the notify end, 22:10); with the draw montage slowed ×0.362 during the charge: charge 1.00, «звук полного заряда» exactly 3.54 s after the charge start |
| K12 | Early shot is weak | release at ≈ 1.8 s with n = 20 | the shot's charge ≈ (1.8 − 0.552) / 3.54 ≈ 0.35 (Archery shot log «заряд») | pass 22:14:39 — release 1.36 s into the charge → charge 0.36 (expected ≈ 0.38), no ding |
| K13 | A missed arrow wakes the mob (`[OWNER]` 21:50) | a passive / unaware creature (not yet aggro), a hero arrow into the ground 5 m from it; control — 15 m from it | 5 m: log «стрела упала: мобов в 10 м — ≥1, «услышали» ≥1 (… мс)», the creature turns and runs at the hero (60 fps clip); 15 m: «мобов … — 0», it stays; cost ≤ 1 ms per arrow | [NOT-RUN] — next launch |
| K14 | Head hit ×2 damage (`[OWNER]` 21:57) | hero arrow into a creature's head, then one into its body (same charge) | log «выстрел в голову: … кость b_head — урон ×2.0 (множитель m → 2m)»; the damage numbers (DamageNumber mod) of the head hit ≈ 2× the body hit | **FAIL** (corrected 2026-11-07 22:43 +03:00 — the «pass 22:39» written here was false): the log line «урон ×2.0» appears, but the write comes TOO LATE — UE4SS runs the callback of a Blueprint function AFTER its body: the one-shot hyena 2147453068 died at 22:42:09.131 (game log, KillCharacterWithRagdoll), our callback wrote ×2 at 22:42:09.136 (same frame 161); diag order inner→outer (ApplyDamageModifiers before ApplyDamageAll before TakeProjectileDamage). Neither damage nor XP is doubled. Fix: write in a function that RETURNS before the damage is dealt (`GetProjectileDamageOverDistance` out param) |
| K16b | Hit before → no ×2 XP (seen) | the owner's body arrow then a head arrow, two hyenas 22:39 | «первый удар героя: false», no «опыт →» | the flag logic is right (22:39:24, 22:39:29, 22:42:24); the doubling itself is broken — see K14 |
| K15 | One-shot headshot kill → ×2 XP | a fresh creature the hero never hit; one head arrow that kills | log «первый удар героя: true · опыт X → 2X»; the kill-XP widget (UIMod_Hosav) shows 2X; the hero's `ExperiencePoints` grows by 2X | [NOT-RUN] |
| K16 | Hit before → no ×2 XP | a sword hit (or a body arrow), then a killing head arrow | log «первый удар героя: false», no «опыт →»; the widget shows X | [NOT-RUN] |
| K17 | Headshot that does not kill | a head arrow into a tough creature that survives; later kill it by body hits | its `xpToGive` back to X 100 ms after the head hit (remote read); the later kill gives X | [NOT-RUN] |
| K9 | The owner's camera config kept | compare `config.lua` before / after the deploy | byte-equal | pass 21:38 — the deploy DID overwrite it (`29ea2dd…`), restored from the copy (`3dced17…` = before) |
