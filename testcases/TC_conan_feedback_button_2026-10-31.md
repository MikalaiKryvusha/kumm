# Test cases — Conan: the «ОТЗЫВ» plate in the main and Esc menus (plan 36 W37)

> **Created:** 2026-10-31 · **Parent:** plan 36 W37
> **Status:** 2026-10-31 01:08 +03:00 — written before the first run · run 1 01:15–01:35 · run 2 07:44–07:56 (all cases pass or reasoned skip)
> **Outbound:** the look — the owner's eye

**Basis.** `[OWNER]` «чтобы они легко могли мне на почтку отправлять логи и крешлитику» · «высота 40 принята» · «и на меню паузы ESC тоже нужна будет
кнопка отзыва» · 2026-10-31 00:37–01:04. Expected: a bronze plate «ОТЗЫВ» 40 units high centred under «1.0.0»; it lightens under the cursor; a click
puts a zip of the logs on the desktop, shows it in Explorer and opens a mail to the author.

**Stand.** Game `D:\Games\Conan Exiles 3.0.1`, FOREGROUND path (`launch-fg.ps1` — the owner gave the screen 00:52 «экран твой»): a real mouse is the
only way to test a click on a widget. The Esc menu needs a world: the oasis save, `_config/enter-world-remote.sh`, a real Esc. The mail client —
whatever `mailto:` opens on this machine. The zip on the desktop is deleted after the case.

**Dimensions.** Two menus × (look · hover · click); the debounce (two clicks in 5 s); the cost per call (the section's minute summary).

| # | Case | Set-up | Expected | Status | Observation |
|---|---|---|---|---|---|
| F1 | the plate in the main menu | launch | «ОТЗЫВ» 40 units, centred under «1.0.0», crisp | pass | 01:15 4K frame: the plate under «1.0.0», centred; the game's logo crisp (the new texture) |
| F2 | hover in the main menu | the real cursor onto the plate, then off | the plate lightens, then returns | pass | 01:31 Button build: plate mean luma 56.6 under the cursor vs 45.9 off (the Image build of 01:15: 46.4 = 46.4 — the hooks never fired → Button + LMB key bind) |
| F3 | click in the main menu | a real click | log «click in W_MainMenu_MainMenu_C»; a zip on the desktop; the game minimized; Explorer shows it; the address box on top; then the mail | pass | 01:32–01:35: log «click in W_MainMenu_MainMenu_C», zip 785 KB, game minimized (after the fix), Explorer with the zip selected, the address box ON TOP (after the fix — under Outlook before); mailto opens new Outlook at its sign-in screen on this machine |
| F4 | debounce | two clicks within 5 s | one zip; log «click ignored» | pass (by the path) | 01:32: two real clicks 1.5 s apart → ONE zip, ONE «click in …» line; the second click never reached the game — the collector's console window takes the focus at once. On the player's path a double click makes one archive; the 5 s debounce is a backstop the path does not reach |
| F5 | the plate in the Esc menu | world, Esc | the plate under our logo on the left side | — | not run: needs the world (next chat) |
| F6 | click in the Esc menu | a real click | as F3, the log names W_IngameMenu_C | — | not run: needs the world (next chat) |
| F7 | cost | the click check | well under a frame on a gameplay LMB; ≤ 100 ms on the menu click | partial | the menu click logged «slow click check: 63 ms» — `os.execute` of `start` blocks the game thread once per feedback click (menu — lag allowed); a gameplay LMB checks two remembered menus — not measured yet |

**Run 2 (2026-10-31 morning) — after three fixes:** (a) the collector starts by `io.popen` (the pipe closed 3 s later) instead of `os.execute`;
(b) the 500 ms menu wait and the fishing-tips wait of `krinik_pause_in_menu` moved to `ExecuteInGameThreadWithDelay` (the UE4SS crash class, guard
`check-lua-game-thread.py` — it named both plus `KrinikMenuProbe` in the live game folder); (c) `KrinikMenuProbe` no longer collapses the game's
`WBP_QueuedNotificationWindow_C` 25 s after start (a refuted experiment of 10-25 left live).

| # | Case | Set-up | Expected | Status | Observation |
|---|---|---|---|---|---|
| F8 | the guard on the game folder | after the deploy | `check-lua-game-thread.py` exit 0 | pass | 07:44: «вызовов рабочего потока: 0», exit 0 (before the fix: 3 — krinik_feedback:43, krinik_pause_in_menu:485, KrinikMenuProbe:57) |
| F9 | the menu click stall after the fix | a real click on the main-menu plate | the zip, Explorer, the box, the mail as F3; NO «slow click check» line (≤ 1 ms) or a figure far under 63 ms | pass | 07:46:37 «slow click check: 3.000 ms» (was 63); zip 786 KB, game minimized, Explorer. The box went UNDER VS Code (`topmost=False`) when the owner typed — F11 |
| F10 | the pipe closes | 3 s after F9 | no error line of the section; no `cmd.exe` child of the game left | pass | 07:47: no child process of the game; no «collector start failed» line |
| F5b | the plate in the Esc menu | world (oasis save), real Esc | the plate under our logo on the left | pass | 07:53 frame at 1080p: «ОТЗЫВ» under «1.0.0» under KRINIK MOD PACK, left of the game's logo; log «menu W_IngameMenu_C remembered» |
| F6b | click in the Esc menu | a real click | as F3; the log names `W_IngameMenu_C` | pass | 07:53:32 «click in W_IngameMenu_C», «slow click check: 4.000 ms»; zip 879 KB; screen frame: game minimized, Explorer with the zip selected, the box in front |
| F7b | gameplay LMB cost | the remote times 1000 × (`IsVisible` + `IsHovered`) on both live menus | per check well under 0.1 ms | pass | 07:54 «1000 checks 9.00 ms total, 0.0090 ms each» (menu open, cursor over the plate — the dearest case) |
| N1 | the notification window is not collapsed | main menu after 30 s; in the world | `WBP_QueuedNotificationWindow_C` instances: visibility not Collapsed; the probe log has no «свёрнут» line | pass (menu) | 07:46 one instance under the GAME INSTANCE, `vis=4` (SelfHitTestInvisible); probe «отчёт записан: 595 строк», no «свёрнут». The instance outlives the menu — so until today the collapse held in the world too. The world read was not taken (the remote was silent after the 07:49 crash) |
| F11 | the address box stays on top | after the Esc-menu click, another window takes the foreground (the agent's shell) | the box window `topmost=True` and over the other window; OK opens the mail | pass (top) | 07:54 box `topmost=True`, over Explorer on the screen frame, after `mouse-seq.ps1` gave the foreground back to the owner's window. OK not pressed (the mail would open over the owner's work; mailto seen in run 1) |
| M0 | the 07:49 crash, reproduced | the game minimized in the main menu (`ShowWindow` 6, as the collector does), the remote enters the world | D3D12 fatal «Dest width out of bounds … [8, 8, 1] … [1920, 1080, 1]» at «Starting Login» — or no crash | skipped | seen ONCE 07:49:03; the control the same minute (game not minimized, same stream session) entered the world fine (07:52). Not reproduced on purpose: only the remote can press «Продолжить» under a minimized window — a player cannot click it. The agent path is guarded instead (`enter-world-remote.sh` restores the window first) |
| M1 | minimized IN the world | world, game restored; minimize 10 s, restore | the game lives, the log has no RHI error | pass | 07:52:41–07:52:57 minimized 10 s, restored by SW_SHOWNOACTIVATE, alive, no RHI error — the Esc-menu click (F6b) minimized it again 07:53 and the game lived on |
| P1 | fishing tips still laid out | open the fishing tuning window (`ActivateModule ExilesFishingTuning`) | the log line «подписи сложности рыбалки: одной строкой … в N панелях», N ≥ 1 | pass | 07:54:38 «перенос по ширине 380 поставлен 34 текстам», «одной строкой через черты в 1 панелях» — 1 s after the open (the game-thread delay fired) |

**Run 3 — the plate 10 lower (the owner 07:47: «можно кнопку отзыва чуть ниже» · «10 пикселей»), the enter-world guard.** Kit
`FEEDBACK_BELOW_VERSION` 34 → 44 (1 unit = 1 px at 1080p).

| # | Case | Set-up | Expected | Status | Observation |
|---|---|---|---|---|---|
| L1 | main menu, the plate lower | launch, frame at the game's resolution | the plate's top 10 px lower than in the 07:45 frame (menu1), still centred under «1.0.0», nothing else moved | pass | 08:02 frame: plate top 268 → 277 in the 1600-wide frame = 10.8 px at 1080p (±1 measuring); centred under «1.0.0»; the owner 08:22 «отступ на 10 ниже хорошо, нравится» |
| L2 | Esc menu, the plate lower | world, real Esc, frame | as L1 against the 07:53 frame (esc1) | pass | 08:05 frame: plate top 293 → 303 (1600-wide) = 12 px at 1080p (±1); pair in review folder 21 |
| L3 | the click still lands | a real click on the NEW place, main menu | «click in W_MainMenu_MainMenu_C» | pass | 08:03:24 «click in W_MainMenu_MainMenu_C», «slow click check: 6.000 ms» at the new place (0.378/0.321) |
| G1 | enter-world under a minimized window | game minimized in the main menu, `enter-world-remote.sh` | the script prints «restored minimized game window», the world loads, no RHI error | pass | 08:03–08:04: the L3 click minimized the game; `enter-world-remote.sh` printed «restored minimized game window (SW_SHOWNOACTIVATE)», world in 22 s, alive, 0 RHI errors |
