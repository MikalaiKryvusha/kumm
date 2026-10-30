# Test cases — Conan: the «ОТЗЫВ» plate in the main and Esc menus (plan 36 W37)

> **Created:** 2026-10-31 · **Parent:** plan 36 W37
> **Status:** 2026-10-31 01:08 +03:00 — written before the first run
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
