# Test run report — the Conan launcher's main button by the build state

## 1. Work

`ConanExiles/_config/launcher/KrinikConanLauncher.cs` — the gold main button follows the build state. Basis: interview 028 Q2, the owner's
answer 2026-10-31 20:11 «кнопки играть нет, пока сборка не уставнолена, на ее месте золотая Установить сборку», and 19:57 (STATUS) — «Установить сборку»
hidden once the build is installed, the column closes up. Expected: NOT installed → column «Отзыв», «Удалить сборку» (greyed), the path line with
« · сборка не установлена», gold «Установить сборку» (22 px, one line, mockup `state=fresh`), no «Играть» at all; INSTALLED → column «Отзыв»,
«Удалить сборку», gold «Играть»; after the installer window closes, the launcher re-reads the state by itself.

## 2. Contour

The launcher exe built by `python -X utf8 _config/release/build-docs.py --no-pdf` (pack `ConanExiles`, tree of 2026-10-31 20:14); Windows 11, the
owner's TV at 300 %; a fake game folder in the session scratchpad (`ConanSandbox.exe` stub, `install.cmd` stub that writes `uninstall_krinik_build.cmd`).
The installed-detection mark is the uninstaller in the game root (the deploy writes it, the undo removes it).

## 3. Runs

Moments — the modification times of the files each run wrote.

1. 2026-10-31 20:14 — `KRINIK_LAUNCHER_STATE=fresh|installed` + `KRINIK_LAUNCHER_SNAPSHOT=<png>;384` (forced state, 4K at 400 %).
2. 2026-10-31 20:14 — the exe copied into the fake game folder, `KRINIK_LAUNCHER_SNAPSHOT=<png>;96`, without and then with `uninstall_krinik_build.cmd`.
3. 2026-10-31 20:16 — `powershell -File click_install.ps1`: the live window, UI Automation tree read, `PostMessage(BM_CLICK)` on the lowest named
   button, 4 s, tree read again; the window closed by PID.

## 4. Checks

Hygiene: the C# compiler built the exe (4149 KB) with no error.
Functional run: the launcher walked by the player's path on the live window — opened in a game folder without the build, the gold button pressed, the button tree READ before and after; the two states read by eye on 4K frames.

- Case 1 (not installed, 384 dpi) — pass: gold «Установить сборку» in one line, «Удалить сборку» greyed, no «Играть».
- Case 2 (installed, 384 dpi) — pass: «Отзыв», «Удалить сборку», gold «Играть»; the column is two buttons, no gap.
- Case 3 (real detection, 96 dpi) — pass both ways; the path line wraps to 3 lines on the long scratch path and still clears the buttons.
- Case 4 (switch after install) — pass: BEFORE `Отзыв | Удалить сборку (disabled) | Установить сборку`; the installer wrote the uninstaller;
  AFTER `Отзыв | Удалить сборку (enabled) | Играть`, the hidden button absent from the automation tree.
- Not covered: a real `install.cmd` over a real game (its deploy is covered by the fixture pack and plan 36 item 28), the uninstall click.

## 5. Found

none.

## 6. Traces

Review folder `D:\Games\Conan Exiles Mods\НА ОТСМОТР НИКОЛАЕМ\36_launcher_main_button_by_state\` (`1_not_installed.webp`, `2_installed.webp`,
`README.txt`); the automation log and the 96-dpi frames — the session scratchpad (not kept).

## 7. Verdict

pass.
