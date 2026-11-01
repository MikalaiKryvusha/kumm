# Plan 41 · phase 2 — the mod windows the code does not open: AMR, Emberlight, Pickup+, Horti, Edit Appearance — by the player's path

> **Created:** 2026-11-01 · **Parent:** `plans/41_EPIC_conan_1.0.0_defects_and_stability.md` phase 2; `[OWNER]` 2026-11-01 13:28 «Окна модов, которые код не открывает:
> AMR, Emberlight, Pickup+, Horti»
> **Status:** written 2026-11-01 13:30 +03:00; not started
> **Outbound:** found defects → new bug 64 rows → phase 4

## Goal vector (Achieve)

The window walk of 2026-10-26 18:03 (`walk-mod-windows.sh`, 17 modules of `DT_UIModuleTable`) did not open AMR, Emberlight, Pickup+ and Horti by
`ActivateModule`; Edit Appearance has no module row (U6, opens from its own station). Nobody has opened these windows the way a player does. Where we want to be:
each window opened by the player's path, framed, its text Russian and inside its frame — or its defect filed — and the player's entry itself working.

## Acceptance criteria

1. **Entry exists.** Situation: in the world, hero equipped as the mod needs (station placed, item in the inventory). Action: the player's entry the mod
   provides (inventory button, key, station interaction, console `DataCmd <name>`). Result: the window opens. Check: a frame; the live widget class read by the
   remote (`dump <class>`); no crash.
2. **Russian and fits.** Situation: the window open. Action: frame at 4K and at 1080p (`r.SetRes 1920x1080f` by the remote). Result: no English line, no text
   past its frame. Check: frames looked at by eye; each defect → a bug 64 row with the frame.
3. **Works.** Situation: the window open. Action: change one setting / use one function (by the window's own handler or a real click). Result: the effect the
   mod promises. Check: the value read back by the remote, or a frame of the effect.
4. **No entry.** Situation: the mod's entry is absent in 3.0.1 (button never born). Result: the cause found and fixed natively (as Hosav's button, row 16) or the
   fork to the owner. Check: the frame of the entry after the fix.

## Stand (house rule 11)

- Machine lock; launch by the owner's last path; `enter-world-remote.sh`; `god-on.sh`; admin `exec MakeMeAdmin`; `tp_ground.sh` to a clear flat spot.
- Stations / items the windows need — SPAWNED by the remote (`exec SpawnItem <id> <n>`, then the station placed by the build system or by a direct spawn —
  recon in step 1), never searched for in the world (rule 11.5a).
- Real clicks by `mouse-seq.ps1` after `wait-input-idle.ps1 -Min 10`; background frames `capture-window.ps1 -Width 3840`.

## Steps

- [ ] 1. **RECON — who they are.** `.\Deploy-ModPack.ps1 -ListMods -PackDir D:\work\ai_sandbox\ConanExiles` → the full names and workshop ids of AMR, Emberlight,
      Pickup+, Horti, Edit Appearance (AMR and Horti are abbreviations — recon: find them by `grep -i "amr\|horti" D:/work/ai_sandbox/ConanExiles/modpack.json`
      and the `AMR_DT_SettingsApi` container name from bug 64 row 20). For each: the asset list (`repak unpack` the outer pak → `retoc-5.8 list --path <…>-Windows.utoc`),
      its UI assets, its `*_DT_SettingsAPI` table if any, its Workshop page text (the player's entry, the key) — `WebFetch` of the Steam Workshop page by id.
- [ ] 2. **Mod notes first** — `games/ConanExiles/mods/<Mod>.md` for each of the five (what it is, how the player opens it, assets, our edits, open) — the hook
      requires them before any work.
- [ ] 3. **RECON — the entry.** Per mod: how its window is born (`patch-mod-asset.py extract <Mod> <Asset> <work>` + `kismet-trace.py` on the controller /
      component that creates the window: a key bind, an inventory module signal, a station `OnInteract`, a `DataCmd`). Mark whether it depends on a 3.0 hub
      event that no longer comes (row 16 class) or on the `_DT_SettingsAPI` / ModControlPanel host (phase 3 class).
- [ ] 4. **Case file** `testcases/TC_conan_mod_windows_player_path_<date>.md` — per mod: entry · window · Russian/fit · one function; stand section first.
- [ ] 5. **TEST IN THE LIVE GAME** — one session: each entry by the player's path, frames at 4K and 1080p, one function used; `UE4SS.log` and the game log read
      once at the end (`Accessed None`, script errors of these mods).
- [ ] 6. **FIX** (only for a broken ENTRY; text and layout defects go to phase 4 as bug 64 rows): native first — the entry's event / delay constant in the
      mod's pak (`flt:` / `dbl:` / `bool:` rows of `patch-mod-asset.py build`, asset-strings TSV `<Mod>__<Asset>.tsv`); Lua on a game event only if the asset
      will not yield (rule 8), one call, no polling (rule 7), `check-lua-game-thread.py` 0.
- [ ] 7. **TEST the fix** — the entry case re-run after a relaunch; frame.
- [ ] 8. **PACKAGING** (only if step 6 edited a pak): pak into `ConanExiles/_krinik-modified/<id>`; `modpack.json` entry `krinikModified` «KRINIK MODIFIED …»;
      `rebuild-krinik-paks.py --only <Mod> --install`; `.\Deploy-ModPack.ps1 -Deploy -Only "<Mod>" -PackDir D:\work\ai_sandbox\ConanExiles`; `-Verify` green.
- [ ] 9. **Run report** `testcases/reports/<date>_conan-mod-windows-player-path.md`; in the SAME commit: the five mod notes, the TC stability file rows U3–U6
      (the «not opened» line closed), new bug 64 rows for the text defects, the guide section if it names these windows.

## Risks

- (a) A bare module without the mod's entry can crash (`PRMainMenu` PackRat 2026-10-26 18:03) — this phase never calls `ActivateModule` on these five; only the entry.
- (a) A station-bound window (Emberlight, Edit Appearance) needs the station placed — the build-system spawn route is unknown; recon in step 1, fallback a
  direct `SpawnActor` of the station blueprint by the remote.
- (b) A Workshop page may be unreachable or silent — then the controller's bytecode (step 3) is the only source.

## Effort

3–5 h (recon and notes 1.5–2 h, session 1–1.5 h, a possible entry fix 1–1.5 h).

## Decisions made without the owner

(filled at the phase's close)
