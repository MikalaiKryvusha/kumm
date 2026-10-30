# Run report — Conan: two launch paths, in front (`launch-fg.ps1`) and in the background (`launch-bg.ps1`)

**Work.** The owner's order 2026-10-30 15:3x — two paths of working with the game, in front and in the background, the agent masters both
(`HOUSE_RULES.md` §1 rule 16). Cases: F1 the front path leaves ONE game in front, also after the fullscreen switch; F2 a second launch while a game
runs is refused (front and background script); B1 the background path leaves the owner's window in front; B2 the save untouched.

**Contour.** Conan Exiles 3.0.1 with the build, main menu only (no world entry); lock 15:29–15:31; scripts in `ConanExiles/_config`.

**Runs.**
- 15:29:03 `powershell -File launch-fg.ps1` (first version) — «pulled to front 1 time(s); game in front: True»; then `Get-Process ConanSandbox*` showed TWO
  games: PID 8972 (15:26:33, left by the launch the owner interrupted) and 15476 — the script had pulled the OLD window forward. Both closed by PID.
- 15:30:13 `powershell -File launch-fg.ps1` (one-game guard, PID tracking) — «launched (foreground path), PID 24240» · «game in front: True», rc 0;
  15:30:33 the window still in front (`GetForegroundWindow` = the game's), closed by PID.
- 15:30:2x `launch-fg.ps1` and `launch-bg.ps1` again while 24240 ran — «game already running, PID 24240», rc 2 both.
- 15:30:44 `powershell -File launch-bg.ps1 -HoldSec 30` — «launched (background path), PID 14640, owner window 0x102DA» · «now 0x102DA», rc 0; 15:31:15 games 1,
  game in front: False; closed by PID; `cmp` of `Game_0.db` with the 15:22 copy — equal.

**Checks.**
- Hygiene: PSParser 0 errors and 0 non-ASCII bytes in both scripts; `test-after-code.mjs --selftest` OK; `node tools/test-guards.mjs` 180 of 180.
- Functional run: both scripts launched the real game on this machine; read — their output lines, `GetForegroundWindow` against the game's window, the process list.
- F1 pass (second version) · F2 pass · B1 pass · B2 pass.

**Found.**
- The first `launch-fg.ps1` took the first game window of any process — with a forgotten game running it pulled the wrong one; fixed (exit 2 when a game
  runs, only the started PID is touched), the same guard added to `launch-bg.ps1`.
- My liveness check used the wrong process name (`ConanSandbox.exe`; the game is `ConanSandbox-Win64-Shipping`) — the owner was told «игра не запущена»
  while one ran; corrected in the chat.

**Traces.** Command output in the chat transcript of session 5db69748; no frames.

**Verdict.** pass — both paths work on the real game; the background path's real-input tests are not covered (no instrument yet).
