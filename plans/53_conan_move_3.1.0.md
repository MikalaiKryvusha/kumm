# Plan 53 — move the Krinik Conan build (1.0.0 WIP) onto Conan Exiles Enhanced 3.1.0

> **Created:** 2026-11-13 · on the owner's word (chat 2026-11-13 18:50 +03:00, under `resume`): `[OWNER]` «через 10 минут докачается версия 3.1.0 - можно смело
> приступать к переносу сборки 1.0.0 WIP на неё» · 18:52 «комп твой, работай автономно. Замерами не занимаемся, занимаемся развитием сборки» · 18:53 «новая версия
> для сборки тут D:\Instals\<…>\» (the folder's name stays out of this public repository; it is in the pack's `targets.json`) · 18:53 «можешь уже пойти в Нексус и Стим и посмотреть, какие моды из нашей сборки
> обновились» · **Parent:** `researches/conan_patch_3_1_0/README.md` §3 (the move checklist); the previous move — `plans/33_conan_pereezd_3.0.1.md`
> · **Status:** 🔧 started 2026-11-13 18:52 — step 1 done 18:57 · steps 3b, 5–9 (partly) done 20:07 · step 12: 3 of 11 done 21:3x, PARKED 21:44 for a couple of days
> (the owner gives the other authors time to update; our own mods meanwhile) · **Outbound:** —

## Goal vector (Achieve)

The build that lives on 3.0.1 (`D:\Games\Conan Exiles 3.0.1`) runs on 3.1.0, installed in place at the owner's folder (the owner's 18:53 word — the target is the
download folder itself, no copy): other authors' mods at their newest versions (our patches re-applied on them), our Lua mods and paks accepted by the game, a
new game enters the world without a crash, every mod's function intact. No frame-time measurements in this plan (the owner's 18:52 word).

## Acceptance criteria

1. **The game enters the world.** Check: a new game on 3.1.0 reaches the world; `ConanSandbox/Saved/Logs/ConanSandbox.log` has no `too old`; a frame in the world.
2. **Every enabled pak mounts.** Check: `ConanSandbox.log` — one `Mounting mod pak` per line of `modlist.txt`; the build's status line «СБОРКА: моды N/N» of
   KrinikConanModPackManager.
3. **UE4SS starts on the new exe.** Check: `ue4ss/UE4SS.log` — `Using engine version`, `Event loop start`, the start lines of every Krinik Lua mod, no
   signature-scan failure.
4. **No mod silently loses its function** (the build's criterion 2, `MASTER_PLAN.md`): every Krinik mod's notes case and every hub page shows values; the late-class
   risk of 3.1.0 (only ModController classes load at startup) is closed in our Lua (research §3 A.1).
5. **The engine's `-Verify` on the new target exits 0.**
6. **The «missing imports» warnings of the first start are recorded as a baseline** (research §3 A.4), each one read: ours fixed, another author's — noted.

## Steps

- [x] 1. **Which mods changed** (18:53–18:57): `python -I -X utf8 ConanExiles/_config/check-mod-updates.py --since 2026-11-03 --all` — the tool now sees all 66 mods
      (it skipped the 21 we patch, `_krinik-modified`) and compares the author's date with OUR copy (for a patched mod — its original in `_patch-originals`),
      to the minute. Nexus: 6 of 6 unchanged since our copies. Workshop: **12 newer than ours** — after the 3.1.0 beta: Severe Weather Enhanced*, Hair We Go,
      Less Building Placement Restrictions*, Beyond Decor: Rustic Edition, Thrall_Peeper, Female New Faces; before it: Immersive Warriors Enhanced*, Rideable
      Pets, Shemite City State, Highmane's Arsenal, Enhanced Armory and Arsenal* (23:01 vs our 18:04 copy of the same day), Riding Thralls (* = KRINIK MODIFIED —
      our patch to re-apply). Doubled Storage Size is still gone from the Workshop (Double Storage Space replaces it).
- [x] 2. **Download the 12** — steamcmd anonymous into `D:\Games\Conan Exiles Mods\workshop-3.1.0` (a separate folder; the old copies stay until the move is accepted).
      Done 19:12: 12 × «Success» (sizes changed most for Immersive Warriors 359 → 265 MB and Severe Weather 24 → 17 MB).
- [x] 3a. **Library swap** done 19:2x by the new tool `ConanExiles/_config/workshop-swap.py` (dry run clean — 24 moves, then `--apply`); `check-mod-updates.py` after:
      «Новее наших копий: 0». Severe Weather got its machine recipe `krinikBuild` (it had it in prose only); the recipe rebuilt our 3.0.1 pak byte for byte
      (196 chunks, `rebuild-krinik-paks.py --only SevereWeatherEnhanced`, 19:2x). The patcher's paks view now follows the target (`game_target.py` `PAKS_VIEW`).
- [x] 5–9 (partly) **done 19:3x–19:5x** (pack `ff30fb9`): target = junction `D:\Games\Conan Exiles 3.1.0`; deploy 75/75; first launch — UE4SS ok, menu
      Revision 383,024; the build line read 0/66 (3.1.0's new mount lines) → fixed → 66/66; `[Core.System]` paths of 3.1.0 = ours (90/90) → `-WithEngineIni`;
      Game.ini / GameUserSettings.ini; the owner's world, mod saves and `config.lua` files copied from 3.0.1; world entered; 0 «too old», 0 missing imports;
      Pickup+ admin widget error new (`ComboBox_DrawDebugline`); `patch-rollback.py`: 11 vanilla assets changed by the patch under mods' whole copies —
      BMNB AnimalPen, EAA `BP_PL_Crafting_Station`, OUR `M_Foliage`, LegitReligious `ItemStatModificationTable`, Caverns of Set / Shemite / Ymir's map tiles,
      LBPR `BP_BuildSystem_v2` + `BP_Master_Placeables` (old build), Storage Reach `CustomConsoleCommandsDataTable`; MSCasaDesFlores' `MI_Glass_Orb` gone from 3.1.0.
- [x] 3b. DONE 20:07 — all four rebuilt on the authors' new versions with `--against-original --install` (library = game: SW 10.4 MB, LBPR 3.7, EAA 131.5, IMM_WAR 253.4; the drafts removed = every one matched); seen in game 20:08 — each «mounted successfully», «СБОРКА: моды 66/66», 0 too old / missing imports / fatal, the error lines as before (Pickup+ 2, Emberlight 2). (20:1x: Severe Weather on its 11-13 version against the NEW original — 201 chunks, exactly 1 changed (`SW_ModController`), wrapper equal; the four with
      `--install` running) **Rebuild the 4 patched** on the 3.1.0 target, after the first launch (the view needs its `Saved/ExtractedMods`): `rebuild-krinik-paks.py --only <C>
      --against-original` for SevereWeatherEnhanced, No_Building_Placement_Restrictions, IMM_WAR, EnhancedArmoryAndArsenal.
- [ ] 12. **The 11 vanilla assets the patch changed under mods' whole copies** (`patch-rollback.py`, re-run 21:1x on the installed mods — the same 11 + one gone,
      the authors' post-beta uploads of EAA and LBPR still ship old copies). Read by the new `ConanExiles/_config/stale-copy-check.py` (the mod's INSTALLED copy vs the
      new game, `--old` = the three-way comparison by export and, for functions, by bytecode statements «by meaning» — kismet-graft's `sig`; «entry shift only» marks
      a stub whose only change is the event graph's entry offset). **PARKED 2026-11-13 21:44 by the owner's word** (`[OWNER]` 21:43 «давай пока нашши моды делать» ·
      21:44 «пару дней дадим остальным мөд5рам их моды обновить») — re-run `check-mod-updates.py --since 2026-11-03 --all` first when it resumes, then this table:

      | Asset (mod) | Read | Outcome · state |
      |---|---|---|
      | `Systems/Cheats/CustomConsoleCommandsDataTable` (Storage Reach) | table: copy 26 game rows + 3 own (3.1.0 added `FollowerPerk`) | DONE 21:2x — `vanilla+own:` rebuilt on 3.1.0, installed; the author's original lacks 6 |
      | `Items/ItemStatModificationTable` (LegitReligious) | table: 1725 = 3.1.0 (+21 rows vs 3.0.1) | DONE 21:2x — `vanilla:` rebuilt, installed; the original lacks 72 |
      | `Systems/Building/Placeables/BP_PL_Crafting_Station` (EAA) — the parent of every station | an older-devkit copy: every export = 3.0.1 except the «crafting ended» sound switch lacking recipe categories 13–15; 3.1.0 rewrote the event graph (+108 −89 ~47 of 262 — the queue pauses when the output is full) | DONE 21:3x — new plan line `game-chunk:` (the game's cooked chunk byte for byte, `patch-mod-asset.py` `game_chunks`), EAA rebuilt and installed; the rebuilt copy = 3.1.0 IDENTICAL. `[AI]` FORK: game's copy wins vs graft the 3 deleted cases · price: 3 categories hear the stock sound again · consulted: GUIDE kind 6 + the three-way read |
      | `…/Placeables/BP_PL_Crafting_Station_AnimalPen` (BMNB) | every export = 3.0.1 = 3.1.0 (by bytes and meaning); only the package header differs (its parent changed) | TO DO — `game-chunk:`; BMNB has no `krinikBuild` yet: original into `_patch-originals`, library copy `_krinik-modified/`, KRINIK MODIFIED |
      | `Systems/Building/Placeables/BP_Master_Placeables` (LBPR) | the mod edits `CanBePlaced` (+306 −77 ~493 of 583), `PreCanBePlacedSuccess` (+5); `SetupForBrush` differs from 3.0.1 exactly as 3.1.0 does (the author took the patch there) | TO READ — whether the copy = 3.1.0 + LBPR's edits (then nothing to do) |
      | `Systems/Building/BP_BuildSystem_v2` (LBPR) | the mod's event graph +87 −82 ~96 of 899 vs 3.0.1; the patch changed ~8 statements of it | TO READ — are the patch's 8 inside the author's copy (`--show ExecuteUbergraph_BP_BuildSystem_v2`) |
      | `FLX_Materials/…/M_Foliage` (OUR KrinikConanGraphics) | not read | our mod — taken into «our mods» work |
      | 4 map tiles `Heightmap_x2_y3` (Mines of Set), `x1_y4` (Shemite City State), `x2_y5`, `x3_y5` (Ymir's Respite) | not read | TO READ — level mods: actors of the mod vs the patch's terrain |
      | `Items/Weapons/Orbs/Materials/FLX/MI_Glass_Orb` (MSCasaDesFlores) — gone from 3.1.0 | not read | TO READ — its parent material still in 3.1.0? |

- [ ] 3. **Library (the description the steps above follow):** the old copies of the 8 plain mods → `mods/OLD/_workshop-3.0.1/<id>`, the new → `mods/_workshop/<id>`; the 4 patched: new original into
      `_patch-originals/<Container>.pak` (old one kept as `<Container>.3.0.1.pak` until accepted), then `patch-mod-asset.py build` by each `krinikBuild` recipe;
      every recipe that fails on the new pak is a finding (the author changed the patched asset).
- [ ] 4. **Our Lua against late classes** (research §3 A.1): `KrinikConanUI/krinik_hub_controller.lua:80` and `krinik_mod_settings.lua:1046, 1054` reach other
      mods' classes by `StaticFindObject` alone — load first (`LoadAsset`, the line-110 pattern of the hub controller), then find; grep every other
      `StaticFindObject("/Game/Mods/` and `RegisterHook` on another mod's class.
- [ ] 5. **The new install read-only:** the exe build string (`++exiles+release-CL-…`), the pak header UE version, the default `modlist.txt`/`Mods` folder; the
      vanilla tables our whole-table mods ship (research §3 A.3) — hashes against 3.0.1.
- [ ] 6. **`targets.json`:** the 3.1.0 target = the download folder (the owner's word), the 3.0.1 target `enabled: false` (kept on disk until the owner says).
- [ ] 7. **Deploy:** `-Deploy -DryRun` (done 19:3x on the download folder: 75 / 75 mods, 66 paks, «Dry run clean»), then `-Deploy` WITHOUT `-WithEngineIni` for the
      first launch, `-Verify`.
- [ ] 8. **First launch** under the machine lock: UE4SS log, game log, the main menu, the mod list; the «missing imports» baseline. The game writes its own
      `ConanSandbox/Saved/Config/Windows/Engine.ini` → its `[Core.System] Paths=` lines against our pack Engine.ini's (taken from 3.0.1 by
      `_config/swap-core-paths.py`, plan 33 step 12: 2.1.1 had 80 paths, 3.0.1 90) — differ → `swap-core-paths.py <pack Engine.ini> <3.1.0's>`; then
      `-Deploy -WithEngineIni` + `deploy-config.py` (Game.ini / GameUserSettings.ini, EXP-0324) and the second launch.
- [ ] 9. **New game → world**: the Krinik mods' cases, the hub pages, the map page, the localization (`deploy-localization.py --check`; vanilla overrides
      `vanilla-override.py --check` against 3.1.0's `ru/Exiles_UI.locres`, research §3 C.8).
- [ ] 10. **Whole-asset vanilla overrides of the kit** (research §3 A.3a): re-run every `kit-*-edit.py` that saves a vanilla asset on the 3.1.0 kit — only when
      Funcom ships a 3.1.0 devkit; until then the 3.0.1 copies stay and the list of what they may undo is written here.
      **The 3.1.0 kit EXISTS** (read 2026-11-13 21:5x in the Epic launcher log `%LOCALAPPDATA%\EpicGamesLauncher\Saved\Logs\EpicGamesLauncher.log`: «Conan
      Exiles Enhanced Dev Kit» `912a768dddac4142b862ad0fc2ad98df` **378787 → 383024**, «Action: Update», queued 21:50 after the owner's 21:47 «если да, запускай эпик
      лаунчер, обновляй»; our kit `F:\CEUE5Devkit` was CL 378787 — older than 3.0.1's game CL 379176). **INSTALLED 22:00:09** (the launcher log `HandleTaskComplete … AlertCode=[ok]
      IncompleteInstall=0`; the Epic manifest `AppVersionString` 383024, `bIsIncompleteInstall` false — `Build.version` alone was written mid-download). Then, in order: KrinikConanGraphics `M_Foliage` (`kit-foliage-wpo.py` + the Nanite raster shader
      patch, notes `KrinikConanGraphics.md` — the game's 3.1.0 `M_Foliage` changed, plan 53 step 12), KrinikConanUI (`kit-conanui-edit.py` — the «3.1.0» line and
      every vanilla widget it saves; `kit-attribute-*`, `kit-krinik-modsettings.py`), KrinikConanArchery (its kit overrides). Risk: the update replaces kit files our
      scripts patch in place (backups `kit_asset_backups/`, the shader `.orig`) — the scripts re-apply; our mod folders `UE4/Content/Mods/*` are user files.
      **2026-11-14 00:1x–00:2x (dayloop):** our four kit mod folders intact after the update. **Which overrides went stale — read, not guessed:** the launcher writes
      only the files a version changed (or it repairs), so every kit content file with a time in the update window (2026-11-13 21:53–22:00) = the 3.1.0 kit's
      changes: **1174 files**; intersected with our overrides (`Mods/<Mod>/Content/…` of KrinikConanUI — 13 widgets / 2 textures, KrinikConanArchery — the bow
      montage): **none**. The one hit is `M_Foliage` — the launcher REPAIRED our in-place edit (byte-equal to the old original, bound 0). So: KrinikConanUI and
      Archery need no re-basing on fresh vanilla, only a re-cook on the new kit (+ the «3.1.0» line); KrinikConanGraphics — the bound re-applied. **KrinikConanGraphics
      DONE 00:22** (`kit-foliage-wpo.py` → `kit-buildmod.py`; the cook read against the game's 3.1.0 `M_Foliage` by tagged property: only our bound and `StateId`
      differ — notes `KrinikConanGraphics.md`); installed into `_unpacked/`, not yet deployed. KrinikConanUI — in the kit (with plan 49 G1, the «+» in gold);
      Archery next; then one game run — `testcases/TC_conan_kit_310_our_mods_2026-11-14.md`.
- [ ] 11. `modpack.json` `builtFor` → 3.1.0; the guide's version line; STATUS.
- [ ] 13. **The game's own mod list lost our texts in the move (found 2026-11-14 00:4x).** `set-pak-modinfo.py` (plan 44: Russian description, author, URL,
      change note in each pak's `modinfo.json`) was run on 3.0.1's `Mods` folder by hand; the 3.1.0 deploy copied the library paks — read live: KrinikConanUI
      author «», EAA's description raw BBCode «[img]https:…», Frequent_meteors «- rebuilt for update». Its only caller is `_config/release/make_volumes.sh`. Before
      re-running it on the 3.1.0 `Mods`: read how `-Deploy` / `-Verify` treat a game pak that differs from the library — READ 00:4x: `Install-PakMod`
      (`Deploy-ModPack.ps1:538`) copies every pak with `Copy-Item -Force` on each deploy, so an edit made in the game folder dies at the next full deploy — the
      edit must live in what the deploy copies (the library copy, as `_krinik-modified/` does for patched paks) or in a step the deploy runs. Since 2026-11-14 the script also keeps the manifest's
      `<xxh128>` entry of `modinfo.json` right (`kit_manifest.py`; before it updated the MD5 only — the loader then keeps the OLD extracted file, the
      2026-10-26 lesson in `patch-mod-asset.py`); control run: the old script on a copy of Frequent_meteors left `modinfo.json` xxh128 DIFF, the new one 10 / 10.
      **01:1x — applied to the 3.1.0 `Mods`** (game closed): `set-pak-modinfo.py "<game>/ConanSandbox/Mods"` — 66 of 66 written (dry run first: 66 would); the scan
      of every wrapper's `modinfo.json` hashes (`.work/kit310/scan_modinfo_hashes.py`): 0 stale, 65 with `<xxh128>` + KrinikConanGameplay MD5-only (its own
      builder). The rule «re-run after every deploy» is in the game map. OPEN: the mod list seen in game (main menu «Моды», a frame); where the step lives for good
      (today: by hand after a deploy, as `deploy-localization.py`).

## Risks

- (a) Our kit-built whole-asset overrides of vanilla blueprints (`W_Attribute`, the archery montage, graphics) are 3.0.1 copies and undo any 3.1.0 change inside
  them — seen only by reading the assets (step 10).
- (a) A mod re-uploaded for 3.1.0 changed an asset we patch — the recipe breaks or silently patches the wrong row (step 3: every recipe's output read).
- (b) UE4SS 1181 misses a signature on the new exe — the log says so at once; cure: a newer UE4SS build.
- (b) The download still writes files while we deploy — deploy only after the folder stops changing (no file newer than 2 minutes).
- (c) The torrent client re-checks the folder and «repairs» files we changed (UE4SS `dwmapi.dll`, No-Intro-Splash movies) — the owner's client; noted, not ours.

## Decisions made without the owner

- `[AI]` The updated mods are downloaded into a separate `workshop-3.1.0` folder, not over the library — the 3.0.1 build stays restorable until 3.1.0 is accepted
  (the pattern of plan 33 step 3).
- `[AI]` EAA's stale `BP_PL_Crafting_Station`: the game's 3.1.0 copy wins whole (`game-chunk:`), the 3 missing sound cases are not grafted back — the read says an
  older devkit's enum, not a feature; the queue fix of 3.1.0 reaches every crafting station.
- `[AI]` Hair We Go re-uploaded 21:36 during the move — taken at once (21:43), deployed alone (`-Only`), not seen in game yet.
