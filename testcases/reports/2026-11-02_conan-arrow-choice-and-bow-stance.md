# Run report — the arrow-choice list on a draw; the bow pose after a stamina break; the shock-wave hunt

**Work.** (1) The shock wave «not seen at 100 %» (STATUS item 0) — control captures; (2) the arrow-choice list (bug 64 item 29 reopened by the owner
12:49–12:56: show it on a draw when there is a choice, never with one kind or with the row off) — cases L1–L4; (3) bug 76 «the bow stays drawn when stamina
runs out» — cases S1–S5. Basis: `testcases/TC_conan_hub_rows_audit_2026-11-01.md` (W3–W5), `testcases/TC_conan_aim_flicker_and_stamina_2026-11-02.md`
(F1, L1–L4, S1–S5).

**Contour.** Conan Exiles 3.0.1, `D:\Games\Conan Exiles 3.0.1`, the full build (66 paks + UE4SS Lua) and its controls: Archery Lua out; Archery pak out;
every pak out with only the remote Lua; every mod out. The owner's oasis save, a quiet stand (`quiet-stand.lua`), god mode (`god-on.sh`), the game in front
(checked by `scratchpad/w/fg-is-game.ps1` before any real input since 12:52). New code: KrinikConanArchery `on_aqs_display` + `CFG.ammo_list`; KrinikConanUI
hub row `arc_ammo_list` (Lua `krinik_mod_settings.lua` + kit `kit-krinik-modsettings.py`, pak 13 257 553 B, built 12:59–13:05).

**Runs.**
- 12:32–12:37 — W3: Archery Lua out, `scratchpad/w/shot.sh` (ddagrab 120 fps whole screen + `mouse-seq.ps1 -Seq "rdown,wait:2800,lclick,wait:900,rup"`); the
  tracer's ring emitter toggled by the remote (`fx_toggle.lua`); `P_bow_powercharge_release` spawned before the camera (`fx_front.lua`, `fx_side.lua`).
- 12:42–12:48 — W4/W5: the owner shot himself, every mod off (`modlist.txt.off`, `dwmapi.dll.off`), then the full build at `arc_wave` 1 and 0.
- 12:52 — F1: `scratchpad/w/rec.sh f1.mkv 5 "rdown,wait:2500,rup,…"`.
- 13:06–13:13 — L1–L4: `Deploy-ModPack.ps1 -Deploy -Only KrinikConanArchery` / `-Only KrinikConanUI`, `launch-fg.ps1`, `enter-world-remote.sh`; L1 `rec.sh l1.mkv`;
  L3 the store `arc_ammo_list = false` + `ModRef:SetSharedVariable('KrinikSettingsVersion', 777)` and `aqs_wheel.lua` mid-draw; L2 `drop_iron.lua`
  (`ShortcutBarInventory:RemoveItem(1, FName("None"), nil)`), the same draw; L4 the hub by the remote + a real click.
- 13:12–13:21 — S1–S5: `AdjustStaminaCurrent(-200.0)` mid-draw with a 60 fps capture; restarts with the Archery Lua out (13:15), its pak out (13:17), every
  pak and Lua mod out but the remote (13:18); a 30 s 10 fps capture after a plain draw (13:21). The build restored 13:22 (9 Lua mods, 66 paks).

**Checks.**
- Hygiene: Lua syntax of both edited files (`luac -p`), the kit script parses; the kit build exit 0 (hub pass 1 exit 1 — the known GUID trap; pass 2 exit 0).
- Functional run: walked in the live game by the user's path (real RMB / LMB / click, the game in front), screen captured at 60–120 fps, the logs read.
- W3 pass — vanilla shows rings and a dome over the arrow (tracer E4); `P_bow_powercharge_release` draws nothing (no pixel changed). The owner: «нет, не то».
- W4 fail / W5 not reproduced — the owner saw no sprite by the bow with every mod off, nor in the full build at 100 % and ВЫКЛ.
- F1 pass — no list flash in 48 frames of an aim entry.
- L1 pass — two kinds: the list fades in on the draw, ≈ 2 s, fades out; meter 102 / 403 frames.
- L2 pass — one kind: meter 0 / 495, window opacity 0.0 after the wheel's own reveal.
- L3 pass — row off: meter 0 / 503, opacity 0.0 after the wheel's reveal.
- L4 pass — the row «Выбор стрел при натяжении» with its «i», checked by default.
- S1 reproduced — the owner's pose after a stamina break; S2, S3 — the same without our Lua and our pak; S4 — the same in vanilla after a PLAIN draw; the
  stance lasts ≈ 10–11 s, then the hero lowers the bow: the pose is the game's own combat-ready stance.
- S5 fail (ours) — the aim zoom kept through the stamina break by `hold_aim_on_redraw`.

**Found.**
- The shock-wave row scales an effect that never shows on screen (`P_bow_powercharge_release`); the sprite the owner remembers was not reproduced (W5).
- Bug 76 is vanilla behaviour (the stance), the owner's choice of what to do is asked.
- New defect, ours: the aim zoom held through a stamina break (S5) — not fixed yet.

**Traces.** Scratchpad `D:\Temp\claude\d--work-ai-sandbox-KUMM\03118042-689e-4a54-8ba0-f295ff725b9d\scratchpad\w\` — `w3_ctrl.mkv`, `w3b_norings.mkv`,
`l1.mkv`, `l2.mkv`, `l3.mkv`, `s1b.mkv`, `s2.mkv`, `s3.mkv`, `s4.mkv`, `van_stance.mkv`, frame sheets and `idle_vs_after.webp`, `van_pair.webp`; review folder 61
(`D:\Games\Conan Exiles Mods\НА ОТСМОТР НИКОЛАЕМ\61_volna_eto_kolca`); `UE4SS.log` lines «выбор стрел …» 13:06–13:12.

**Verdict.** partial — the arrow-choice list passes L1–L4; the shock wave and the bow stance are answered by observation (vanilla) and wait for the owner's
word; S5 (ours) is open.
