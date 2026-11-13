# Plan 53 — move the Krinik Conan build (1.0.0 WIP) onto Conan Exiles Enhanced 3.1.0

> **Created:** 2026-11-13 · on the owner's word (chat 2026-11-13 18:50 +03:00, under `resume`): `[OWNER]` «через 10 минут докачается версия 3.1.0 - можно смело
> приступать к переносу сборки 1.0.0 WIP на неё» · 18:52 «комп твой, работай автономно. Замерами не занимаемся, занимаемся развитием сборки» · 18:53 «новая версия
> для сборки тут D:\Instals\<…>\» (the folder's name stays out of this public repository; it is in the pack's `targets.json`) · 18:53 «можешь уже пойти в Нексус и Стим и посмотреть, какие моды из нашей сборки
> обновились» · **Parent:** `researches/conan_patch_3_1_0/README.md` §3 (the move checklist); the previous move — `plans/33_conan_pereezd_3.0.1.md`
> · **Status:** 🔧 started 2026-11-13 18:52 — step 1 done 18:57 · **Outbound:** —

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
- [ ] 2. **Download the 12** — steamcmd anonymous into `D:\Games\Conan Exiles Mods\workshop-3.1.0` (a separate folder; the old copies stay until the move is accepted).
- [ ] 3. **Library:** the old copies of the 8 plain mods → `mods/OLD/_workshop-3.0.1/<id>`, the new → `mods/_workshop/<id>`; the 4 patched: new original into
      `_patch-originals/<Container>.pak` (old one kept as `<Container>.3.0.1.pak` until accepted), then `patch-mod-asset.py build` by each `krinikBuild` recipe;
      every recipe that fails on the new pak is a finding (the author changed the patched asset).
- [ ] 4. **Our Lua against late classes** (research §3 A.1): `KrinikConanUI/krinik_hub_controller.lua:80` and `krinik_mod_settings.lua:1046, 1054` reach other
      mods' classes by `StaticFindObject` alone — load first (`LoadAsset`, the line-110 pattern of the hub controller), then find; grep every other
      `StaticFindObject("/Game/Mods/` and `RegisterHook` on another mod's class.
- [ ] 5. **The new install read-only:** the exe build string (`++exiles+release-CL-…`), the pak header UE version, the default `modlist.txt`/`Mods` folder; the
      vanilla tables our whole-table mods ship (research §3 A.3) — hashes against 3.0.1.
- [ ] 6. **`targets.json`:** the 3.1.0 target = the download folder (the owner's word), the 3.0.1 target `enabled: false` (kept on disk until the owner says).
- [ ] 7. **Deploy:** `-Deploy -DryRun`, then `-Deploy -WithEngineIni` and every config of the pack (EXP-0324: all configs + launch in one move), `-Verify`.
- [ ] 8. **First launch** under the machine lock: UE4SS log, game log, the main menu, the mod list; the «missing imports» baseline.
- [ ] 9. **New game → world**: the Krinik mods' cases, the hub pages, the map page, the localization (`deploy-localization.py --check`; vanilla overrides
      `vanilla-override.py --check` against 3.1.0's `ru/Exiles_UI.locres`, research §3 C.8).
- [ ] 10. **Whole-asset vanilla overrides of the kit** (research §3 A.3a): re-run every `kit-*-edit.py` that saves a vanilla asset on the 3.1.0 kit — only when
      Funcom ships a 3.1.0 devkit; until then the 3.0.1 copies stay and the list of what they may undo is written here.
- [ ] 11. `modpack.json` `builtFor` → 3.1.0; the guide's version line; STATUS.

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
