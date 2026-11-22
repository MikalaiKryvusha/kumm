# Mod notes — KrinikConanHarness (ours: the agent's modding instruments, DEV-ONLY)

> **Created:** 2026-10-30 · **Parent:** plan 36 W34; `[OWNER]` «и ещё будет KrinikConanHarness - все инструменты, которые мы используем для моддинга» ·
> «хорошо, в поставку сборки не включаем» · 2026-10-30 ≈13:0x
> **Status:** living notes — the ONE place for this entry's internals; the knowledge-hook refuses work on it until this file is read in the session
> **Outbound:** —

**What it is.** One manifest entry with `"export": false` (installed on this machine by the deploy, left out of the players' archive by `-Export`) that
holds three UE4SS Lua mods, each its own folder in `ue4ss/Mods`. Source `ConanExiles/_unpacked/KrinikConanHarness/<Mod>/` (until 2026-10-30 three
loose folders in `_unpacked/`, deployed by hand). Why not shipped: the remote runs any Lua written into a text file in the game folder.

| Mod | What | Files | Facts |
|---|---|---|---|
| `KrinikAgentRemote` | the remote: one command line in `ue4ss/Mods/KrinikAgentRemote/cmd.txt` → reply in `done.txt` (`lua` → `result.txt`, `dump` → `dump.txt`) | `Scripts/main.lua` (284 lines), `Scripts/ui_check.lua` | command table, world entry without the mouse, cheats — `HOUSE_RULES_REFERENCE.md` §6 row «Conan remote» (one copy, not repeated here); call it by `bash _config/pult.sh` from `ConanExiles/_config` |
| `KrinikConanBench` | the fly-through bench: a CameraActor along a route, PresentMon outside | `Scripts/main.lua` (511), `Scripts/routes.lua` (147) | NO `enabled.txt` in the source — switched on in the game folder when a bench run needs it; log `bench.log`, position `bench-pos.txt` in its game folder; driver scripts `_config/bench-flight.sh`, `bench-scout.sh`; docs `ConanExiles/docs/18-бенч-облёт.md` |
| `KrinikMenuProbe` | a read-only probe of live UserWidgets in the main menu (25 s after start → `menu-report.txt`) | `Scripts/main.lua` (49) | made 2026-10-25 for one question (plan 33). Reads only since 2026-10-31 — until then it ALSO collapsed the game's `WBP_QueuedNotificationWindow_C` 25 s after every start (experiment 2 of 10-25, refuted the same day, never removed; this line said «reads only» meanwhile) |

## Deploy and export

- `Deploy-ModPack.ps1 -PackDir ConanExiles -Deploy -Only KrinikConanHarness` installs the three folders (copy over: files the game folder holds and the
  source does not — the bench's `enabled.txt`, logs — stay).
- `-Export` prints «dev-only, not exported: KrinikConanHarness» and leaves it out (engine 2026-10-30, fixture checks «экспорт: …»).
- One entry per `-Only` call: `-Only KrinikConanLocomotion,KrinikConanHarness` passed through `powershell -File` installed neither (2026-11-22 20:0x, the game
  copies stayed old — checked by diff); two calls installed both.
- **The remote's guards** (`Scripts/main.lua`, `lua_chunk`): `no-component-sweep` (EXP-0330) and since 2026-11-22 `no-table-delegate` — a command, or a file it
  loads by `dofile('…')`, that calls `ListenForInputAction(` with a `{` on the same line is refused («отказ: ListenForInputAction с делегатом-таблицей…»): that call
  crashed UE4SS natively in all the crashes of KUMM bug 118 (EXP-0613). Cases G1–G3 of `testcases/TC_conan_rc4_scope_2026-11-22.md` pass.

## Open

- A new agent instrument for Conan goes into this folder and this entry, never as a loose mod.
