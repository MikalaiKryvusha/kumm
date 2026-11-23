# Run report — Conan 0.9.1-RC5 fixes: the uninstaller's game copies (#16), the launcher's mod counter (#47/#15) and feedback plate (#43), one walk per view switch (#53)

**Work.** The four RC5 fixes accepted by the owner 2026-11-23 11:49 (`plans/62_conan_0_9_1_release_readiness.md`): the engine journals the copies the game
extracts from each new pak (manifest `gameCache`), the uninstaller deletes them, an upgrade keeps them and deletes the dropped paks' copies; the launcher
folds the dashes and quotes the console code page loses before it matches mod names; the launcher prepares the «Отзыв» plaque in its idle and bakes the
window's picture into the plaque's face; KrinikConanCamera makes one walk of the hero's mesh tree per view switch. Cases: the fixture stand's «копии паков»
rows (`tools/fixture-pack.mjs`), the launcher stand's FB3–FB5 and the dashed ModB (`_config/launcher/test/self.mjs`, `stand.mjs`),
`testcases/TC_conan_rc5_camera_one_walk_2026-11-23.md` (K1–K8).

**Contour.** The engine `KUMM/Deploy-ModPack.ps1` on the fixture stand (fake packs and games in `.work/tmp`); the launcher 1.1.2 built by
`make_variant.py` into `.work/rc5/l112*` and run off-screen at 288 DPI (300 %); the working game `D:\Games\Conan Exiles 3.1.1` (RC4 mods,
KrinikConanCamera `main.lua` copied from the pack, the owner's save), the game IN FRONT (`launch-fg.ps1`), the machine lock `kumm` from 12:12 until its
release after the last game run.

**Runs.**
- 11:59 and 12:34 `node tools/fixture-pack.mjs` (logs `.work/rc5/logs/fixture_1.log`, `fixture_2.log`).
- 12:05 `node self.mjs perf-report …/fb1 …/l112/KrinikConanLauncher.exe --dpi 288`; 12:05 the same on 1.1.1 (`_config/launcher/bin/`) — the control;
  12:36 the same on the round-1 fixes (`…/l112b`, `…/fb3`).
- 12:06 `node stand.mjs …/st112 --launcher …/l112/…` + `node self.mjs fresh-beside …`; 12:07 the same on 1.1.1 — the control; 12:36 on `l112b`.
- 12:13–12:38 the game: `launch-fg.ps1` ×4, `enter-world-remote.sh`, `god-on.sh`, real keys by `mouse-seq.ps1` (`kdown:P`, `kdown:1`, `kdown:2`, `rdown`),
  `pult.sh` (view, rotation, `SpawnItem`, `SetThirdPerson`, `fp-shadow-flags.lua`, `.work/rc5/walk_bench.lua`, `write_bench.lua`), `capture-window.ps1`;
  a temporary probe in the GAME COPY only (`.work/rc5/apply_probe.mjs`), removed before K8; `god-on.sh off`, `exec quit`.

**Checks.**
- Hygiene: the PowerShell parser over `Deploy-ModPack.ps1` (0 errors), `node --check` of the stands, `luac -p` of the camera mod (the first draft broke
  Lua's 200-locals limit of the main chunk — found by `luac`, fixed by one table), the launcher compiled by `make_variant.py`; judge round 1
  (`.work/rc5/judge/round1.md`, no defect, 13 risks / cosmetic; F1–F10 and F12 addressed), judge round 2 — see the commit.
- Functional run: the fixture stand by the player's path (the uninstaller `.cmd`, `-Remove`, `install.ps1 -Upgrade`), the launcher by BM_CLICK on its
  real window and a real install through it, the game by real keys with the log and frames read.

| Case | Result |
|---|---|
| copies: journal | pass — three `cache` lines per new pak, one each after two deploys; none for the player's pak |
| copies: uninstaller | pass — «deleted 3 file(s) the game had extracted»; the player's `PlayerOwn-Windows.pak` stays; the folder byte-equal to before |
| copies: upgrade | pass — Alpha's copies kept, Beta's (dropped in 1.0.1) deleted, also when Beta's `cache` lines are missing (a pre-RC5 journal) |
| copies: after upgrade | pass — the uninstaller deletes the copies the new install journaled; the stand 78 / 78 |
| FB3–FB5 (1.1.2) | pass — prepared 89.7 / 91.0 ms in the idle; the FIRST open 8.4 / 9.3 ms, later opens 5.9–9.6 ms, 0 face rebuilds in the first open |
| FB control (1.1.1) | fail as expected — no preparation, the first open 87.2 ms |
| counter (1.1.2) | pass — «модов в строках установщика 2 из 2», the installer's line «ModB - dashed» (the dash folded on this machine) |
| counter control (1.1.1) | fail as expected — «1 из 2» |
| K1, K2, K7, K8 | pass — one pass per switch in both directions and for the event alone |
| K4, K5, K6 | pass — the head's shadow, no sheathed bow in view, the weapon pass walks 7–9 nodes; the bow in hand is below the view (issue #52) |
| K3, K3b, K3c | fail — one walk costs 0.67–1.38 ms (mean ≈ 1.0–1.15, one 3.06 spike); the owner's 1 ms is not reached |

**Found.** (1) One walk of 22–25 nodes costs ≈ 1 ms inside the camera's hook, while the remote's benchmark of the same walk with the same reads costs
0.1–0.35 ms and a shadow write 0.02 ms; the garbage collector and the full-name strings are ruled out (K3b, K3c) — the cause is open. (2) The first draft of
the camera change exceeded Lua's 200 locals of the main chunk (caught by `luac -p` before the game). (3) The launcher stand refuses every case while a
Conan game runs (seen 12:35) — the order «stands first, game after» holds.

**Traces.** `.work/rc5/logs/fixture_1.log`, `fixture_2.log`; `.work/rc5/k3_lines.txt`, `k3b_lines.txt`, `k3c_lines.txt`; frames `.work/rc5/frames/k4_*.jpg`,
`k5_*.jpg`, `k6_*.jpg`; `.work/rc5/judge/round1.md`; the launcher logs under `.work/rc5/fb*`, `fresh112*`.

**Correction 2026-11-23 14:27.** The #43 stand pass of the table above did not hold on the owner's screen: in the A-B of 1.1.1 vs 1.1.2 (`.work/rc5/ab43.mjs`) the owner saw the first open of 1.1.2 still slow, while its log spans said 19.3 ms; #43 is not fixed (EXP-0621).

**Verdict.** partial — #16, #47/#15 and #43 pass with their controls red; #53 is three walks → one walk (≈ 3–4.5 ms → ≈ 1 ms), not under 1 ms, and
accepted by the owner 2026-11-23 12:44: a view switch is a one-off action, outside the 1 ms budget (`MASTER_PLAN.md`).
