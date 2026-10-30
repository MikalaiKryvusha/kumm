# Mod notes — SimpleModlist (Steam Workshop 3719546290, «Simple Modlist»; KRINIK MODIFIED)

> **Created:** 2026-10-30 · **Parent:** plan 36 W11 (Krinik mods at the top of the list, versions 3.0.1); the mod-notes lock (KAIF #186)
> **Status:** living notes — written from what the project already recorded (manifest entry, plan 35 А5, bugs/64 items 8–9, plan 36 W11); the bytecode
> trace of `AppendModlist` — next
> **Outbound:** —

**What it does.** Shows the list of active mods right on the Esc (pause) menu, with version numbers, a scroll, and selectable/copyable text. The owner's
choice 2026-09-09 (manifest `$comment`). Opens with the pause menu module `IngameMenu` (game map, `GAME_ARCHITECTURE_INTERNAL_MAP.md` line ≈68).

## Where things are

- Original pak: `D:\Games\Conan Exiles Mods\_patch-originals\SimpleModlist.pak` (= `_workshop/3719546290`); our patched pak — built into the library
  by `_config/devkit/rebuild-krinik-paks.py --only SimpleModlist` (manifest field `krinikBuild`: `SimpleModlist SML_UI_ModList
  _config/localization/asset-strings/SimpleModlist__SML_UI_ModList.tsv`).
- Manual rebuild: `python -I -X utf8 _config/devkit/patch-mod-asset.py build SimpleModlist SML_UI_ModList <work> <tsv>` → `<work>/out/SimpleModlist.pak`.
- Assets: `SML_UI_ModList` (42 exports; the list widget), `SML_BP_ModController` (holds `ModInfo` array from `/Script/DWModKitPostConfigInit`,
  `modIDList`, `modCount` — the list order lives there).

## Our edits (KRINIK MODIFIED, 2026-10-26, bugs/64 items 8–9)

| Asset | Edit | Why |
|---|---|---|
| `SML_UI_ModList` | list height 800 → 620; font 12 → 15; panel width 420 → 680 | the panel covered the bottom rows of the 3.0 Esc menu («Играть без подключения», «Организатор совместной игры», «Версия»); the owner: «текст списка модов нужно крупнее для читаемости»; long names fit (case U2d pass, 2026-10-26 14:36) |
| translation | strings via `SimpleModlist__SML_UI_ModList.tsv` | «Список модов», «ID модов» Russian |

## How to look inside

`python -I -X utf8 _config/devkit/patch-mod-asset.py extract SimpleModlist SML_UI_ModList <work>` (legacy JSON) → `kismet-trace.py <asset> <exports.tsv>
<asset.json> AppendModlist` (a function as a tree). Live: `ActivateModule('IngameMenu')`, frame.

## How the list text is built (traced 2026-10-30 16:3x, `kismet-trace.py … AppendModlist`, 1243 bytes)

`AppendModlist(ModName, Version)` — one call per mod: strips the version from the name (`Contains` / `Replace` of `" " + Version`, `Trim`,
`TrimTrailing`), then **appends** the entry to the END of the string variable `modlistText` (`Concat_StrStr(modlistText, …)`, a newline only when
the text is not empty). So the list shows mods in the order of the calls = the order of `ModInfo` (the load order of `modlist.txt`); our paks are
last there and therefore at the bottom. The version shown is the `Version` argument from the mod's info — for our kit paks the three numbers
`versionMajor/Minor/Build` of `modinfo.json` inside the outer wrapper pak (`kit-buildmod.py` step 4: `modinfo.json` + `manifest.json` MD5 + the
platform files, `repak pack --version V11 --mount-point ../../../ConanSandbox/Mods/`) — **inferred, not yet seen in the game**.
To put Krinik on top without touching the load order: in `AppendModlist`, PREPEND the entry when the name starts with «Krinik» — a bytecode
insertion (a branch + `Concat(entry, modlistText)`), not an in-place number patch.

## Open

- W11: the display order — the list text is built in `AppendModlist` from `SML_BP_ModController.ModInfo`; our paks are LAST in `modlist.txt` on purpose
  (load order: later overrides earlier) — reorder the DISPLAY, never the load order. Versions: where the list reads a mod's version (the pak's mod info).
