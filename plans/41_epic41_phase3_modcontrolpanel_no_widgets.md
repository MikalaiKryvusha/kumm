# Plan 41 · phase 3 — ModControlPanel shows «Нет доступных виджетов»: LBPR's settings never appear

> **Created:** 2026-11-01 · **Parent:** `plans/41_EPIC_conan_1.0.0_defects_and_stability.md` phase 3; `[OWNER]` 2026-11-01 13:28 «ModControlPanel: в окне написано
> «Нет доступных виджетов»»; mod notes `games/ConanExiles/mods/ModControlPanel.md` → Open
> **Status:** written 2026-11-01 13:30 +03:00; not started
> **Outbound:** a fork to `interviews/` if MCP cannot host LBPR (keep / drop MCP)

## Goal vector (Achieve)

ModControlPanel (Workshop 3722388367) is in the build ONLY as the host of Less Building Placement Restrictions' settings (the owner's choice 2026-09-09).
The panel opens (Shift+End, `DataCmd ModControlPanel`) and says «Нет доступных виджетов» (cases U3 2026-10-31, the dropdown run 2026-11-01): the one reason
it ships does not work. Where we want to be: the panel lists LBPR with its settings and a changed value changes LBPR in game — or, if LBPR cannot register
with this MCP, the owner decides whether MCP leaves the build (and LBPR keeps its defaults).

## Acceptance criteria

1. **LBPR listed.** Situation: in the world, both mods mounted (log `MountMod` for both, MCP BEFORE LBPR in load order). Action: Shift+End. Result: the category
   list holds LBPR, its widgets shown instead of «Нет доступных виджетов». Check: frame; the remote reads the panel's widget list (`dump W_MCP_WidgetList`).
2. **A value acts.** Situation: LBPR's page open. Action: change one setting (e.g. a placement tolerance) by a real click, close. Result: building placement
   follows the new value. Check: the value read back from LBPR's settings object by the remote; a placement frame where the old value refused and the new
   allows (stand: a foundation spawned on a slope).
3. **Survives a restart.** Situation: the value saved. Action: relaunch. Result: the value is the new one. Check: the remote read after the relaunch; the
   MCP save file (`Saved/SaveGames/MCP_*.sav`) before / after.
4. **Or the fork.** Situation: recon proves LBPR does not register with MCP in this version. Result: an interview in `interviews/` with the options and the price
   of each; nothing removed before the owner's word.

## Stand (house rule 11)

- Machine lock; launch by the owner's last path; `enter-world-remote.sh`; `god-on.sh`; `exec MakeMeAdmin`; `tp_ground.sh` to a slope near the beach.
- A foundation and a wall item spawned by the remote (`exec SpawnItem <foundation id> 5`), building in front of the hero by real clicks (`mouse-seq.ps1`).

## Steps

- [ ] 1. **RECON — LBPR notes.** No notes file for LBPR exists: write `games/ConanExiles/mods/LessBuildingPlacementRestrictions.md` first (what it is,
      its asset list by `retoc-5.8 list --path`, how its settings are meant to be reached — Workshop page by `WebFetch` of its id from `-ListMods`).
- [ ] 2. **RECON — how MCP finds widgets.** `W_CP` functions `MakeCats`, `BuildWidgets(_Sorted)`, `AddWidget` are `RawExport` in UAssetAPI 1.1.0 (notes →
      Trap): read them by `kismet.py` (the Kismet 5.8 walker) or `kismet-trace.py`; find the discovery call (Asset Manager primary-asset scan of
      `DAC_ControlPanel`? a registry on `MDC_MCP`? a `GetAllActorsOfClass`?). Then: does LBPR ship the asset / call the registration MCP expects
      (`retoc-5.8 list --path` of LBPR's `.utoc` — grep `DAC_`, `MCP`, `ControlPanel`)?
- [ ] 3. **RECON — live.** In the world: the remote reads `MDC_MCP`'s registered list (its `Cats` / widgets array) and whether LBPR's controller is alive
      (`AddActiveModControllerClass` line for LBPR in the game log); the load order in `modlist.txt` (MCP before LBPR).
- [ ] 4. **Decide** — `FORK: options <fix the registration natively | register LBPR by a Lua call on MCP's own event | drop MCP from the build> · price of
      error <a native fix touches two authors' paks; Lua adds a cross-mod hook; dropping MCP leaves LBPR at defaults with no settings for the player> · consulted
      <step 2–3 findings>` — the first two are the agent's to do; dropping is the owner's (interview).
- [ ] 5. **Case file** `testcases/TC_conan_modcontrolpanel_lbpr_<date>.md` — criteria 1–3 as cases, stand first.
- [ ] 6. **FIX** — native first (rule 8): the missing data asset / registration constant in LBPR's or MCP's pak through `patch-mod-asset.py build`
      (TSV `ConanExiles/_config/localization/asset-strings/<Mod>__<Asset>.tsv`); Lua only if the asset will not yield — one call on MCP's own open event
      (no polling, rule 7).
- [ ] 7. **TEST IN THE LIVE GAME** — the cases after a relaunch; frames; the log read once.
- [ ] 8. **PACKAGING** — the edited pak into `ConanExiles/_krinik-modified/<id>` (MCP already has `_krinik-modified/3722388367` — merge with the «All» → «Все»
      edit, never overwrite it); `modpack.json` `krinikModified` note extended; `rebuild-krinik-paks.py --only "<Mod>" --install`; `.\Deploy-ModPack.ps1 -Deploy
      -Only "<Mod>" -PackDir D:\work\ai_sandbox\ConanExiles`; `-Verify`.
- [ ] 9. **Run report** `testcases/reports/<date>_conan-modcontrolpanel-lbpr.md`; same commit: ModControlPanel notes (Open line closed), LBPR notes, plan 39 C,
      the guide line on the panel (`ConanExiles/docs/guide/guide-3.0.1.html`).

## Risks

- (a) The LBPR version in the build may have dropped MCP support — then step 4 goes to the owner.
- (b) MCP's save holds «All» from before the «Все» edit (notes → Open) — a stale category can hide the list; delete the MCP save on the stand (rule 6) before
  concluding «no widgets».
- (b) Patching two authors' paks — every edit is a re-appliable TSV next to the pak (rule 8).

## Decisions made without the owner

(filled at the phase's close)
