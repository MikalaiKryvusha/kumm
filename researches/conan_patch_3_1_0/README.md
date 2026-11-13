# Research — Conan Exiles Enhanced patch 3.1.0: what changed and what our build must check on the move

> **Created:** 2026-11-13 · on the owner's word (chat 2026-11-13 08:57: a short recon of the new Conan version before we update) · **Parent:** `plans/33_conan_pereezd_3.0.1.md`
> (the previous move, its order of work) · **Status:** web recon done 2026-11-13 09:07 +03:00; the game 3.1.0 is NOT downloaded yet (only `D:\Games\Conan Exiles 3.0.1` on disk) —
> every item of §3 is a check to run on the new install, none is observed · **Outbound:** the move plan (a new `plans/NN_conan_pereezd_3.1.0.md` when the owner starts it)
>
> Read-only recon: web pages + a read of our Lua sources (`D:\work\ai_sandbox\ConanExiles\_unpacked`). No game run, no edit.

## 1. Sources (read 2026-11-13)

| Source | Loaded | What it gave |
|---|---|---|
| Funcom forum, «Conan Exiles Enhanced - Patch 3.1.0» (Kamil, 2026-11-12 15:00): https://forums.funcom.com/t/conan-exiles-enhanced-patch-3-1-0/303790 | yes | the full notes (post 2), the modding block |
| Funcom forum, «Patch 3.1.0 Discussion Megathread»: https://forums.funcom.com/t/patch-3-1-0-discussion-megathread/303791 | yes | player reports only; no staff hotfix, no known-issues list yet |
| Funcom forum, Community Update #8 (Dana, 2026-10-29): https://forums.funcom.com/t/conan-exiles-enhanced-community-update-8/303477 | yes | the date was 10 Nov, moved to 2026-11-11 23:00 UTC; console Enhanced in 2027 |
| MMOHuts, 2026-11-12: https://mmohuts.com/news/conan-exiles-enhanced-wraps-legacy-of-the-giant-kings-with-patch-3-1-0 | yes | the same modding summary |
| conan-exiles.com mirror of the Steam announcement: https://conan-exiles.com/blog/1353/legacy-of-the-giant-kings-part-three-live-now/ | yes | story only |
| SteamDB patchnotes 26391219 (public beta of 3.1.0, 2026-11-03) | **no — 403** | no build id, no depot sizes |
| UE4SS docs: https://docs.ue4ss.com/lua-api/global-functions/notifyonnewobject.html · `registerhook.html` · RE-UE4SS `assets/Changelog.md` | yes | how our hooks behave on a class that loads late (§2.1) |

Not stated anywhere read: the Unreal version, a client build number, a new `devkitRevisionNumber`, save compatibility, whether existing mods must be re-cooked.

## 2. What changed — the lines that touch a modded build

### 2.1 Modding block (verbatim fragments, post 2 of the notes)

1. **Class loading:** «Only ModController classes are loaded at startup now, matching the original Conan Exiles Legacy behaviour.» Escape hatch:
   «Force load all classes in a mod with `-dpcvars=dw.LoadAllModClassesAtStartup=1`». Note the spelling `-dpcvars` here and `-dpcvar` in item 2 — verbatim on the page;
   which one the game reads is a check (§3).
2. **Mount in place (opt-in):** «Experimental support for mounting mod paks directly, without extracting platform-specific files.» — faster launch, less disk.
   «Run with `-dpcvar=dw.MountModsInPlace=1` to try.» Default unchanged (the extraction stays). Our EXP-0338 (the game «skip extracting … correct hash» keeps an
   old container) is a property of the extraction path; with in-place mount that path is gone.
3. **Missing imports are logged:** mods «referencing content that is in neither the base game cook nor another mod will now log warnings about missing imports
   when starting a game»; Funcom's advice — copy such packages into the mod and cook them explicitly.
4. **Crash forensics:** «The Blueprint script stack is now output on critical errors and crashes to aid debugging.»
5. Devkit: new toolbar icons for the mod build and mod info windows; the mod dropdown shows the selected mod; a function to add items to a character's mail from
   Blueprint; deleting a World Partition actor in a mod's own map deletes the file; an editor stack overflow in asset discovery fixed (empty `Content/Mods`).
   The notes do not say whether a new devkit was released or whether its revision number changed.

**UE4SS behaviour on a late class** (docs and changelog, read 2026-11-13): `NotifyOnNewObject` — «The provided class does NOT need to exist before this calling this
function» (changelog: «now works even if the supplied class hasn't yet been loaded», UE4SS #1134); `RegisterHook` — «Any UFunction that you attempt to register with
RegisterHook must already exist in memory when you register it»; `StaticFindObject` does not load a package — a miss gives an invalid object (check with `IsValid`).

### 2.2 Gameplay, UI, performance (verbatim fragments)

- Crafting: «Crafting stations now pause a queue when the output inventory is full, keeping inventories within their item limit.»
- Thralls / pets: «Hovering over a thrall or pet's diet icons now shows the stat bonuses for that food.» · «Fixed certain T4 thralls being impossible to knock out.»
- UI: missing inventory icons for the Guard Dog, Elite Guard Dog, Elite Black Lion fixed · «Dropdowns in the settings menu now switch language as soon as you change
  languages.» · the Join / Back overlap in the server browser at low resolutions · fonts in the title screen's What's New · the Protective Shell stack counter under the
  caster's health bar · healing arrows filling an ally's health bar with regeneration icons (client on a listen server).
- Performance / hangs: «Fixed a hitch when placing building pieces.» · a server hang when events or mods streamed in a level before the previous one had fully
  unloaded · a lock-up opening the player list as an admin · «The large camp near The Ashen Core now loads in from farther away.»
- Building: bowls that could not be removed; wall paint like other paint decals; objects near painted walls pick up less paint; snow on Vanir pieces; static placeables
  (Akhamet's sacrifice anvil) failing to spawn in single-player and co-op.
- Audio: hits on unarmored parts, armour jingling after unequip, burning sounds of inactive stations, overlapping screams in acid pools, Sunken City dialogue.
- Nothing about: movement, sprint, jump, climbing, attributes, perks, levels, corruption, archery mechanics, map and markers, loot, purges, graphics settings, upscalers.

### 2.3 New content

The Legacy of the Giant-Kings: Part Three — Akhamet's quest through Rifts; the choice shapes his abilities as a companion. The arc ends at three parts. Players in the
megathread name a new armour set (hillstalker) and OuterDark armour items → new rows in the item and armour tables (not listed in the notes). A community moderator:
the new content is English only for the first few days.

### 2.4 Known issues

«Known issues will be added as soon as we get them from the Inflexion team.» — none listed on 2026-11-13. Players report random crashes (one: 4 fatal errors in 2 hours),
a spear-speed hotfix they expect, Rift / thrall teleport and fall problems, a disconnect after several Rifts, dye channels on the hillstalker set. None confirmed by staff.

## 3. What our build must check on the move — ranked by the price of a silent break

**A. Silent breaks (a mod loses its function, the log may stay quiet).**

1. **Late classes of other mods.** Our Lua reaches other mods' classes by path in ~15 places (grep `/Game/Mods/` over `ConanExiles/_unpacked/**/*.lua`, 28 hits,
   2026-11-13). By the UE4SS docs the `NotifyOnNewObject` ones survive a late class (Hosav HUD in `krinik_hud_blink`, `krinik_hud_outline`, `krinik_vignette`,
   `krinik_fps_counter`; Simple Minimap in `krinik_minimap_coords`; Inventory Compactor in `krinik_ui_fixes`; Arrow Quick Swap in Camera and Archery). At risk:
   - `KrinikConanUI/krinik_hub_controller.lua:80` — `StaticFindObject(SM_HELPER_CLASS)`; an invalid result reads as «the mod is not installed» → Simple Minimap's
     helper row silently leaves our map page. Line 110 of the same file already has the right pattern (`LoadAsset` then `StaticFindObject`).
   - `KrinikConanUI/krinik_mod_settings.lua:1046, 1054` — `StaticFindObject(a.cdo)` on other mods' save-game CDOs (Damage Meter, Proximity Party, Simple Minimap,
     LLHighlight) → the settings hub pages of those mods may show no values.
   - every `RegisterHook` our code arms at script start on a class of another mod (none with a literal `/Game/Mods/` path found by the grep; hooks armed through
     variables — read case by case).
   Check: on 3.1.0 open each hub page and our map page; `UE4SS.log` for hook-registration errors. Two cures: (a) native — `LoadAsset` before `StaticFindObject`
   wherever we reach another mod's class (the line-110 pattern); (b) global — `dw.LoadAllModClassesAtStartup=1` (Enhanced 3.0.1 behaviour back) in the launcher's
   arguments — costs startup time and memory, hides the problem for other authors' mods as well. FORK for the move plan.
2. **Other authors' mods that relied on all classes loading at startup** (a component or widget no ModController references). The game's new missing-imports
   warnings help (A.4). Check: every mod's in-game function after the move (the MASTER_PLAN acceptance criterion 2), the reconciliation register first.
3. **Stale vanilla tables** (EXP-0460, its own trigger «a game patch»): Part Three adds item / armour rows; a mod that ships a whole vanilla table drops them.
   Check: `python -I -X utf8 _config/mod-overrides.py <out.tsv> "<game>/ConanSandbox/Mods"` → every whole data table vs the 3.1.0 game (`uaj rows`); rebuild every
   `patch-mod-asset.py` mod whose map has `vanilla:` / `vanilla+own:` rows FROM the 3.1.0 tables; `KrinikLevelUncapped` — only if the level tables changed.
3a. **Our whole-asset overrides of vanilla blueprints** are 3.0.1 copies and silently undo any 3.1.0 change inside them: re-run every `kit-*-edit.py` that saves a vanilla
   asset on the 3.1.0 kit (`KrinikConanUI`, `KrinikConanGraphics`, the archery montage). Never a parent anim blueprint: the `AB_human_male` override of 2026-11-13 broke
   its children (bind pose, EXP-0511) and was rolled back the same hour; plan 52 adds a NEW post-process anim blueprint instead — rebuilt on the new kit, no override.
4. **New game log lines:** «missing imports» warnings will appear for some mods on the first start — read them as a free list of broken references, not as a new
   error of the move; record the baseline for the «no new errors in the log» criterion.

**B. Loud breaks (seen at once).**

5. **UE4SS on the new exe** — the game binary changed; UE4SS 1181's Conan Enhanced config may lose a signature. Check: the first lines of `UE4SS.log` (engine version,
   «Found …» signatures), our mods' «loaded» lines; a newer UE4SS build if the scan fails.
6. **The mod kit revision.** If 3.1.0 raised the minimum `devkitRevisionNumber`, every older pak gets «Mod is too old and needs to be updated for this game version»
   (seen with revision 0, EXP of 2026-10-2x). Check: the main menu with the full mod list; `modinfo.json` of the mods re-uploaded after 2026-11-12; Funcom's devkit
   on the Epic launcher — a new version and its revision number.
7. **Engine and build id:** read the new exe's build string (`++exiles+release-CL-…`, 3.0.1 was `CL-379176`) and the pak header UE version (EXP-0124), as in plan 33.

**C. Localization.**

8. Part Three strings come English-first; Funcom's Russian follows later. Our `Game.locres` carries vanilla overrides keyed by the game's source hashes
   (`_config/devkit/vanilla-override.py`, table `vanilla-overrides-ru.tsv`): re-run it with `--check` against 3.1.0's `ru/Exiles_UI.locres` — a changed source hash or a
   missing key (exit 1) means the override no longer applies.

**D. Mechanics close to ours (read, nothing collides by the notes).**

9. Crafting queue pause on a full output — Double Storage Space / Doubled Storage Size raise the limit; check one station at its new limit.
10. Thrall / pet diet hover — the thrall window is replaced or extended by Thrall Inventory x2, Bosses My New Besties, LBPR: check the hover on their windows.
11. Healing arrows UI fix (listen server) — KrinikConanArchery hooks arrows; single-player path unaffected by the notes.
12. The Blueprint script stack on crashes — bug 85 (the bow-kill crash) gets a new forensic line in the crash log; read it on the next crash.

**E. Opportunities.**

13. `dw.MountModsInPlace=1` — faster launch, no extracted copies: an A-B of the launch time and a check of our pak-patch route (the extraction cache is where EXP-0338
    bit). Experimental — not for the shipped build until measured.

## 4. When to move — the risk read

The previous move followed a hotfix (3.0.0 → 3.0.1, crashes, before our move on 2026-10-25). For 3.1.0 on 2026-11-13: no staff known-issues list yet, players report
random crashes and wait for a hotfix, the Russian of the new content is not out. The owner decides the moment; the recon's input: moving after the first hotfix costs
nothing of our work (all checks of §3 are the same) and removes the crash noise from the move's acceptance run.
