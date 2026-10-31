# TC — the build install is undone to the pre-build state (undo journal, uninstaller, launcher button)

> **Created:** 2026-10-31 · **Parent:** bug 72 (the owner's words verbatim there)
> **Status:** U1–U9 run 2026-10-31 15:5x–16:0x — report `testcases/reports/2026-10-31_build-install-undo-journal.md`; U10 (the live Conan folder) open
> **Outbound:** —

**Dimensions.** File state before the build: replaced (a vanilla movie, Engine.ini, modlist with the player's own pak) · created (a pak, a file in an existing EMPTY
vanilla folder, a file in new nested folders); repeat deploy; entry points: the player's `.cmd`, `-Restore`, `-Remove`; control without a journal.

| # | Case | Expected | Status |
|---|---|---|---|
| U1 | deploy a fixture with `uninstall` in the manifest | `_kumm-backup\journal.txt` and `Uninstall.cmd` | pass |
| U2 | the uninstaller from a UTF-8 template with Cyrillic | Cyrillic intact, `{BACKUP}` → `_kumm-backup` | pass |
| U3 | precondition | the deploy replaced the vanilla movie and Engine.ini | pass |
| U4 | deploy again | one `replaced` line per path, the stored copy still vanilla | pass |
| U5 | `cmd /c Uninstall.cmd` (the player's path) | the game tree byte-equal to before, empty vanilla folder kept, `_kumm-backup` and the `.cmd` gone | pass |
| U6 | control: `-Restore` with no journal | exit 1, «no install journal» | pass |
| U7 | deploy, then `-Remove` | the same tree as before, the uninstaller deleted | pass |
| U8 | the 27 older fixture checks | still pass | pass |
| U9 | the launcher rebuilt with «Удалить сборку» | compiles; button off when the game or the `.cmd` is absent | pass (compile + the `bin/` run without a game) |
| U10 | the live Conan folder: full deploy → «Удалить сборку Krinik.cmd» → `-Verify` / tree compare | the folder returns to its state before the deploy | open |
