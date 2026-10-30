# Run report — Conan: the broken save after a crash, `save-restore.sh`, world entry by both launch paths

**Work.** The stand repair the owner ordered 2026-10-30 ≈15:50 («ну так чини, пожалуйста»): world entry died after the 15:38 crash of spike run 3.
Basis: the game log (`UConanGameInstance::ContinuePreviousClientSession: No save game profiles found`, `GetSaveGameSlots: Query not ok 1` on every
«Продолжить»). Cases: R1 `--check` sees the damaged live save · R2 a backup restored intact · R3 refused while the game runs · R4 a stale `-wal` removed ·
R5 a damaged source refused · W1 world entry on the background path · W2 world entry on the front path.

**Contour.** Conan Exiles 3.0.1 with the build; `D:/Games/Conan Exiles 3.0.1/ConanSandbox/Saved/Game_0.db`; backups `_save-backup/2026-10-30_1534-before-spike3`
(= `…1502-before-spike`, md5 a7ab7b2f…); lock 15:52–15:56.

**Runs.**
- 15:50 `python sqlite3 pragma integrity_check` on copies: live `Game_0.db` (659 456 B, written by the game 15:40:05) — «database disk image is malformed»;
  the 15:34 and 15:02 copies — ok, equal md5.
- 15:51 `bash save-restore.sh --check` (R1) · `bash save-restore.sh <scratch copy of the damaged db>` (R5) · `: > Game_0.db-wal; bash save-restore.sh <1534 dir>`
  (R4 + R2) · `bash save-restore.sh --check`.
- 15:53 `launch-bg.ps1` · `save-restore.sh <1534 dir>` while it runs (R3) · `enter-world-remote.sh` · `god-on.sh` · `capture-window.ps1` (W1) · `close-game.ps1` · restore.
- 15:54 `launch-fg.ps1` · `enter-world-remote.sh` · `god-on.sh` · frame · `GetForegroundWindow` (W2) · `close-game.ps1` · restore.

**Checks.**
- Hygiene: `bash -n save-restore.sh` ok.
- Functional run: the real save files and the real game on both launch paths; read — the tool's lines and exit codes, the game log, two frames by eye.
- R1 pass (malformed, rc 4) · R2 pass (integrity ok, rc 0) · R3 pass (rc 2) · R4 pass («removed stale Game_0.db-wal») · R5 pass (rc 3) · W1 pass (world in 24 s,
  frame: the hero at the oasis, HUD; 0 «No save game profiles» lines) · W2 pass (world in 24 s, game in front: True, the same frame).

**Found.**
- Cause: after the 15:38 crash the run copied ONLY `Game_0.db` back; the game (WAL mode) replayed its stale write-ahead log onto the restored file at the
  next start → malformed database → «Продолжить» does nothing. Fixed by the tool (deletes `-wal/-shm/-journal`, checks before and after) and by the
  rule: a restore is only `save-restore.sh` (game map, `GAME_STRUCTURE_EXTERNAL_MAP.md`).
- No crash-report window from these runs (`close-game.ps1`: none since 15:52:30 / 15:54:08).

**Traces.** Frames `bg.webp`, `fg.webp` (session scratchpad, deleted after the commit); the damaged db copy `now.db` (scratchpad); game log
`ConanSandbox/Saved/Logs/ConanSandbox.log` of the 15:39 session (lines 3877–3934).

**Verdict.** pass — the save is intact (equal to the 15:34 copy), world entry works on both paths.
