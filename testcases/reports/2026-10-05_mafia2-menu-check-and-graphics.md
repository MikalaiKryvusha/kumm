# Test run report — Mafia II: build seen in the menus, graphics set to maximum

**Created:** 2026-10-05 20:38 +03:00 · **Run by:** агент (Claude Opus 5.5)

## 1. Work

After the owner's `update5` step — does Friends for Life load (the owner's list in `games/Mafia2/README.md`), and the
owner's ask «мне очень высокую графику настрой» (2026-10-05 ≈20:26). The owner's limit: «не нужно игру начинать».

## 2. Contour

`D:\Games\Mafia II` (GOG Director's Cut, RU) with the build installed; RTX 5070 Ti, driver 616.92; the 4K TV panel;
profile files in `%LOCALAPPDATA%\2K Games\Mafia II\Saves`.

## 3. Runs

- 2026-10-05 20:24:58 – 20:26:29 — `Start-Process D:\Games\Mafia II\pc\mafia2.exe`; frames `python tools\shot.py`;
  closed by `CloseMainWindow` → `Stop-Process` (the owner took the focus to VS Code at ≈20:25).
- 2026-10-05 20:33 — `videoconfig.cfg` set to `0 0 3840 2160 1 0 0 1` (backup first in `backup\settings-before-graphics`).
- 2026-10-05 20:33:30 – 20:37:16 — second launch; menus driven by `tools\di.ps1 -Scan …` (scan-code SendInput);
  Settings → Video, «Размытие окружения» → Вкл, Esc; DLC list scrolled; closed by `Stop-Process`.

## 4. Checks

- Hygiene: `python tools\install.py verify` — 1025/1025 files match the stage (pass); `nvidia-smi` driver 616.92 ≥
  591.44, the driver that restored 32-bit GPU PhysX for Mafia II (pass).
- Functional run: walked the main menu at 1920×1080 and at 3840×2160 as the player does, read the screens — no
  «DLC not purchased» dialog; «ДРУЗЬЯ НА ВСЮ ЖИЗНЬ» in the main menu; «FRIENDS FOR LIFE BY ZAHAR ✓ Готов к игре» in
  Загружаемый контент (pass). Video menu read back at maximum on every row after the edit (pass); `profile.dat`
  rewritten 20:36:26, 5 bytes differ from the backup (1 option + 4-byte tail) — settings persisted (pass).
  Epilog, crosshair, radio, FPS with APEX PhysX High — not reached: they live inside the story (not tested).

## 5. Found

- The menus ignore `keybd_event` without a scan code and the absolute cursor; a mouse click fires the HIGHLIGHTED item
  (one click opened the slot screen of «История»; backed out, no save written). Worked around with `tools\di.ps1`.

## 6. Traces

Frames `D:\Games\Mafia II Mods\_harness\r01–r19.webp` (r02 menu 1080p, r07 menu 4K, r15 video settings, r19 DLC
list); backup `D:\Games\Mafia II Mods\backup\settings-before-graphics\`.

## 7. Verdict

partial — Friends for Life loads and the graphics are at maximum; Epilog, crosshair, radio and FPS need the story,
which the owner asked not to start.
