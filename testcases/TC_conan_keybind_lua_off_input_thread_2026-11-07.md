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
| K4 | Camera key hook | world entry, log | «клавиши камеры: событие героя «любая клавиша» подписано» | FAIL 21:39:36 — no line at all: the separate 1600 ms delayed action never ran while the neck one of the same delay did (UE4SS skips a ready action while another executes); fix — called inside the neck action, file copied 21:40, waits for the next launch |
| K5 | Numpad 8 (plain) | real Num8 once | log «offset_x = <old + step>» | [NOT-RUN] |
| K6 | Ctrl + Num9 | real Ctrl+Num9 | log «camera_pitch = …», NOT «offset_z = …» | [NOT-RUN] |
| K7 | Num9 alone | real Num9 | log «offset_z = …», NOT «camera_pitch» | [NOT-RUN] |
| K8 | Other keys untouched | real W / Space / LMB in the world | the hero walks, jumps, attacks; no camera log line | [NOT-RUN] |
| K10 | Arrow into an already dead body (`[OWNER]` 21:41 «когда моб умер, но в его тело ещё стреляют - эти стрелы тоже нужно класть в добычу моба») | kill a creature, then 2 more shots into the corpse | log «стрела в мёртвом теле: … в добычу трупа (в добыче N)» per shot, N grows by 1; the shafts stay in the body; E on a shaft takes nothing; taking the arrows from the loot removes the shafts | [NOT-RUN] — code in the game folder 21:42, loads at the next launch |
| K9 | The owner's camera config kept | compare `config.lua` before / after the deploy | byte-equal | pass 21:38 — the deploy DID overwrite it (`29ea2dd…`), restored from the copy (`3dced17…` = before) |
