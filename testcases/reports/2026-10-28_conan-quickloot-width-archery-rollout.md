# Run report — Conan 3.0.1, 2026-10-28 22:00–22:18: one-mod archery rollout, quick-loot window width (builds 3 and 4)

## 1. Work

The handover's three ready edits (STATUS «ПЕРВЫМ В НОВОМ ЧАТЕ», 21:59): `KrinikConanArchery` as one mod (kit pak + Lua), `KrinikUIFixes`
quick-loot window of one width on the quest panel's edge, full-charge ding only for the hero. Case set
`testcases/TC_conan_corpse_prompt_left_of_quickloot_2026-10-28.md` — Q1, Q2 (build 3), Q1b, Q2b (build 4), S3; bug 06 (`-Only`) live.

## 2. Contour

`D:\Games\Conan Exiles 3.0.1`, the agent's own runs under the machine lock (kumm, 22:02:47–22:18), UE4SS v3.0.1 Beta, 66 paks + 8 Lua mods.
`KrinikConanArchery.pak` built 22:01 (`kit-buildmod.py`, 219 891 bytes), `KrinikBowFixes.pak` and its `modlist.txt` line removed by hand;
`KrinikUIFixes` build 3 (pak 21:22) then build 4 (`kit-uifixes-edit.py` grid 35, tooltip row 20, gap before Esc 20; pak 22:15). Meters:
`capture-window.ps1` (4K, background), pult (`ActivateModule`, `SetObject(Corpse_C)`, `WidgetSwitcherTooltips:SetActiveWidgetIndex(1)`,
`GetDesiredSize` of the rows, `GetViewportScale`), scratchpad `cols.py` (gold frame and quest white edge columns) and `crops.py`.

## 3. Runs

- 2026-10-28 22:01 `python -I -X utf8 _config/check-lua-game-thread.py` (0); `.\Deploy-ModPack.ps1 -Deploy -Only KrinikConanArchery -PackDir <pack>`
  and `-Only KrinikUIFixes` — `verify 97 present, 0 missing`.
- 22:02:50 `launch-bg.ps1`, `enter-world-remote.sh` (world in 26 s); 22:04–22:05 `exec God`, `KillCharacter` on two attackers, Q1/Q2 frames
  `q1_open`, `q1_wheel`; 22:07 row widths by the pult; 22:08 S3 attempt by the pult; 22:09 `close-game.ps1` (clean, 6,2 s).
- 22:10–22:15 kit edit (`UnrealEditor-Cmd … -run=PythonScript -Script=kit-uifixes-edit.py -ModDevKit -NullRHI`), `kit-buildmod.py KrinikUIFixes`,
  `-Deploy -Only KrinikUIFixes`.
- 22:15:22 relaunch, world in 22 s; 22:17 `KillCharacter` on three attackers, frames `b4_open`, `b4_wheel`; 22:18 `close-game.ps1` (clean, 6,1 s),
  lock released.

## 4. Checks

- `Hygiene:` Lua game-thread guard 0; kit edit report `ok: true` with the three padding steps; new pak differs from build 3 (90 904 bytes).
- `Functional run:` the game in the background, read from 4K frames and the pult. Q1 build 3 — fail (open 2236–3697, wheel 2205–3727); Q2
  build 3 — fail (−25 / +5 px against the quest edge 3722). Q1b — pass (right 3721–3723 and left ≈ 2211 in both states); Q2b — pass
  (3721–3723 vs 3717–3722); «Забрать все [Esc] Отмена» with a gap. Archery: UE4SS log `[KrinikConanArchery]` hooks set once, aim at 75°,
  no `[KrinikBowFixes]`. S3 — blocked (only a real held RMB draws; the owner was at the machine). Bug 06 — `modlist.txt` 65 → 66 lines, old
  lines in place.

## 5. Found

- build 3 padding computed with 4,2 px per unit instead of the real 2,09 (EXP-0362) — fixed by build 4;
- «Забрать всеEsc» glued (label right padding 0 in the vanilla widget) — fixed by build 4;
- `-Only` appends a new pak after `KrinikLevelUncapped`, which must stay last — order fixed by hand; noted in bug 06 (DONE).

## 6. Traces

`D:\Temp\claude\q1q2\` (`scene0.jpg`, `q1_open.jpg`, `q1_wheel.jpg`, `edges_sheet.webp`, `scene1.jpg`, `b4_open.jpg`, `b4_wheel.jpg`,
`b4_edges.webp`); `D:\Temp\claude\kit-uifixes-edit4.log`, `kit-uifixes-build4.log`, `kit-archery-build2.log`;
`ConanExiles/_config/devkit/kit-uifixes-edit.json`; UE4SS.log of both runs.

## 7. Verdict

partial — the archery rollout, Q1b and Q2b pass; S3 blocked until real input is possible without taking the owner's screen.
