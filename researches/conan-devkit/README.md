# Research — Conan Exiles Enhanced Dev Kit: what it is, what it gives us, how to drive it without a GUI

> **Created:** 2026-09-12 (session after the camera mod went to Nexus; owner's ask: "study the Dev
> Kit we downloaded and write plans for the tools and machinery you will need to work with it")
> **Parent:** `plans/04_conan_ochered_zakazov.md` items 5 (XP curve) and 6 (russification) —
> both blocked on "no Dev Kit"; owner's questions in chat 2026-09-12: "can we find the XP curve?",
> "has anyone attached an MCP or a CLI to it?"
> **Status:** 🟢 disk recon complete 2026-09-12 · 🟡 headless smoke run in progress (section 7) ·
> 🟡 web recon pending (section 8)
> **Outbound:** → `plans/06_EPIC_conan_devkit_toolchain.md` (the meta-plan) · → correction to
> `plans/04` item 6 ("Conan has no .locres" is wrong, see §5) · → `STATUS.md` (the kit's location
> and state were recorded nowhere)

Every fact below was read from the disk or from a run. Nothing is recalled. Where a fact is
still missing it says `NOT YET`.

## 1. Where it is and what state it is in

| Fact | Value | Probe |
|---|---|---|
| Location | `F:\CEDevKit\CEUE5Devkit` — **169 GB** on F: (152 GB free after it) | `du -sh /f/CEDevKit` |
| Downloaded | 2026-09-10 12:39–18:10 (folder mtimes); **not from the Epic launcher** — the launcher's manifests know only Tribes of Midgard's kit and ESO | `ls /c/ProgramData/Epic/EpicGamesLauncher/Data/Manifests` |
| Ever launched? | **No.** `UE4/Saved` is empty, `UE4/Intermediate` 20 KB, no DDC anywhere, no shader cache | `ls UE4/Saved` |
| Launcher | `RunDevKit.bat` = `UnrealEditor.exe UE4\ConanSandbox.uproject -ModDevKit` | `cat RunDevKit.bat` |
| Engine | **UE 5.8.2**, licensee build, branch `++exiles+release-beta`, CL **374980**, Zen 5.8.13 | `Engine/Build/Build.version` |
| Game on disk | `++exiles+release-CL-373655` (from the shipping exe) — the kit is **NEWER** than the game and from a **beta** branch | `buildstr.py` over the exe |
| Assets stamped | `++exiles+integrate` (in every uasset header) | strings of any `.uasset` |
| Layout | `Engine/` 9.8 GB (975 files in `Binaries/Win64`, 967 engine plugins) · `UE4/` 160 GB — the project is still called `UE4` and `ConanSandbox.uproject` | `du -sh Engine UE4` |
| Content | `UE4/Content` **154 GB uncooked**: Environment 50 G · Items 38 G · Characters 30 G · Maps 11 G · Sound 9.7 G · `ProtectedAssets.pak` 13 G · Localization 134 M · UI 380 M · Systems 639 M | `du -sh UE4/Content/*` |
| Data tables | **543** `DT_*.uasset` in the project | `find UE4/Content -iname 'DT_*.uasset' \| wc -l` |
| Docs shipped | none for modders — `Engine/Documentation` is 17 MB of engine source docs; the kit's own notes are `UE4/Plugins/DreamworldMods/changes.txt` (two entries) and `UE4/Build/ModDevKit.Automation/README.md` | — |
| Python | the kit embeds **Python 3.11** (`Engine/Binaries/ThirdParty/Python3/Win64/python.exe`); the machine has 3.14.4 and 3.11.8 system-wide | `python --version` |

**Version mismatch is the first named risk (tier a).** The game is CL 373655; the kit is CL 374980
on a beta branch. A modder in the wild (Xevyr, `modinfo.json` of Chest Labels) writes: *"'Outdated'
warnings from hosts only compare version numbers between the game and the devkit, which don't
matter unless basegame files are altered."* — so a mod that only ADDS content survives a mismatch;
a mod that OVERRIDES base-game assets (exactly what an XP-curve or localization mod does) is where
a mismatch bites. The kit's own UI carries the string *"Cannot upload the mod to steam now as it
is incompatible with the game on retail. Try using the Public Beta Client workshop instead"* — the
kit knows about this state. What to do: `NOT YET` — web recon §8 question 3; the only honest
answer is an experiment (cook a trivial mod, load it in the live game, read the log).

## 2. The owner's first question: the XP curve — YES, it is on disk, uncooked

```
UE4/Content/Systems/Progression/
  DT_ExperienceSystemLevel.uasset   7.5 KB   the level → XP range table (imported from
                                              D:/perforce/exiles_docs/DesignDocs/Budgets/XPRange.csv
                                              on 2020-06-19 — the import stamp is inside the asset)
  STR_ExperienceSystemLevel.uasset  4.9 KB   its row struct: LevelStart (int), LevelEnd (int)
  DT_FeatsPerLevel.uasset           5.7 KB   feat points per level
  DT_MonsterXP.uasset              80 KB      XP per creature
  DT_ExilesJourneyXPTable.uasset   14 KB      journey XP
  DT_AttributeSystem.uasset         7.5 KB   the table EAA writes row 7 into (plans/04 §5)
  BP_ProgressionSystem.uasset       1.9 MB   the blueprint that reads them
```

These are **editor-format packages, not cooked, not Oodle-compressed** — the strings above were
read with a 20-line Python script (`strings.py`) in a second. The row struct names are visible
raw; the numeric values are binary tagged-property data and need a parser: either the editor
itself (headless commandlet, §7) or a UE5 uasset library (UAssetAPI — support for a 5.8
licensee build is `NOT YET` known, §8 question 6). The headless run is the proven-path choice:
it uses the kit's own serializer and cannot misread a licensee format.

This one directory answers plans/04 §5 ("a flat curve cannot be bought") at the source: the curve
is a table with two ints per level, and a mod that overrides it is a data-only mod.

## 3. What the kit can DO — the five capabilities, each with the evidence

### 3.1 Read the game's truth without the game running

154 GB of the game's own sources: every data table, blueprint, widget, material, map, string.
Where the pack until now had an offline catalog of NAMES (`utoc-index.py`, 128 555 paths) and the
rule "raw search in paks is always false-negative (Oodle)", the kit gives the CONTENT. The
`Dev/DataTableTests`, `Tools/` and `Dev/AssetUtility` folders hold Funcom's own editor utilities
(blutilities, sanity checks) — reusable examples of scripting this project.

### 3.2 Build our own pak mods — fully scripted, the source of the pipeline is on disk

The GUI's "Cook / Pak / Upload" buttons call **UAT** (`RunUAT.bat`) with a project-local
automation module whose C# source ships in the kit:

```
UE4/Build/ModDevKit.Automation/
  BuildMod.cs          the whole pipeline, ~400 lines, readable
  ModDevKitCommand.cs  -Project= defaults to ConanSandbox; -Mod= is required
  SetActiveMod.cs
  README.md            "It should potentially live in Plugins/DreamworldMods instead, but there are
                        some shenanigans to get that showing up in the AutomationTool without
                        additional commandline args" — i.e. the -ScriptDir workaround is BY DESIGN
```

The three command lines the kit's UI actually issues (strings of `UnrealEditor-DWModDevKit.dll`):

```
RunUAT.bat -NoCompile BuildMod -Mod="<Mod>" -Project="<uproject>" -Cook           -ScriptDir="<UE4/Build/ModDevKit.Automation>"
RunUAT.bat -NoCompile BuildMod -Mod="<Mod>" -Project="<uproject>" -Pak -Compress  -ScriptDir="…"
RunUAT.bat            BuildMod -Mod="<Mod>" -Project="<uproject>" -FinalPak       -ScriptDir="…"
```

What `BuildMod.cs` does, step by step (this is the pipeline we will drive):

1. **Inputs:** `UE4/Content/Mods/<Mod>/` with `modinfo.json` and `Local/CookInfo.ini`
   (`[/CookInfo]` + `FilesToCook=` lines — the GUI writes it via "Choose Assets For Cook";
   nothing stops a script from writing it). `active.txt` marks the active mod.
2. **Path remap (the modding model):** `Mods/<Mod>/Local/<x>` → new asset `/Game/Mods/<Mod>/<x>`;
   `Mods/<Mod>/Content/<x>` → **override of the base asset `/Game/<x>`**;
   `Mods/<Mod>/Shared/<Mod>/<x>` → `/Game/ModsShared/<Mod>/<x>`.
3. **Cook:** `UnrealEditor-Cmd.exe <uproject> -run=Cook -OutputDir=Saved/Mods/_Cooked/[Platform]
   -ModDevKit -NoAssetRegistryCache -TargetPlatform=Windows+WindowsServer+LinuxServer
   -NoGameAlwaysCook -NoDefaultMaps -SkipSoftReferences -SkipHardReferences -SkipZenStore
   -ini:Game:[/Script/UnrealEd.ProjectPackagingSettings]:bGenerateNoChunks=True
   -PackagesList=<file>` — versioned cook ("we are using versioned cooks for better mod
   workflows"), three platforms every time.
4. **Pak:** per platform two `UnrealPak` calls — a loose `.pak` with `AssetRegistry.bin` +
   `ModCompat.bin` (a *schema-compatibility manifest* the game validates before mounting —
   `ModCompat: empty cook output folder`, `ValidateMod`), then the IoStore container
   (`-CreateDLCContainer`, Oodle Kraken level 7 / Optimal3, shader archive renamed
   `ShaderArchive-<Mod>-…`).
5. **FinalPak:** wrapper `<Mod>.pak` (uncompressed) = `modinfo.json` + `manifest.json` (MD5 and
   XXH128 of every file) + the nine platform files. Output: `UE4/Saved/Mods/<Mod>/Output/<Mod>.pak`
   (or `-Output=`). Comment in the source: *"UnrealPak in 5.8 won't overwrite"*.
6. **Env:** `UE_SKIP_UBT_SDK_SETUP=1` is set by the script — Linux cross-toolchain is NOT
   needed for the LinuxServer cook.

The public story "RunUAT BuildMod fails with *Found no script module records*" (pack
`docs/02`, §4) is consistent with a missing `-ScriptDir=`: the automation module is not where UAT
looks by default, and the kit's UI always passes `-ScriptDir`. `NOT YET` verified by a run.

Also present: a commandlet `UCookModCommandlet` (`-run=CookMod`, log category
`LogCookModCommandlet`) in the same DLL — a second, in-process route to the same cook; its switches
are `NOT YET` known (no readable source; strings show `-ModDevKit`, `TargetPlatforms`,
`ModWithDLCFile`).

### 3.3 The kit's UnrealPak reads EVERY mod pak — Oodle included — read-only, in milliseconds

Proven 2026-09-12 on `ChestLabels.pak` (271 KB) from the live game, output to the scratchpad only:

```
UnrealPak.exe "<mod>.pak" -List                → 11 files: 3×(pak+utoc+ucas) + manifest.json + modinfo.json
UnrealPak.exe "<mod>.pak" -Extract <scratch>   → the eleven files on disk, 0.3 s
UnrealPak.exe "<Mod>-Windows.utoc" -List       → 12 entries with mount point, size, hash, "compression: Oodle"
```

What this replaces and what it adds:

- Our `utoc-index.py` (a hand-written parser of the IoStore directory index, guarded by a
  count check — `EXP` lessons about "anchor parsing needs a countable guard") is now a
  fallback; the authoritative tool ships with the kit and knows the licensee format.
- `modinfo.json` is readable for every mod: name, author, version, Steam ids, `devkitRevisionNumber`
  (Chest Labels: 1001), `minimumVersion: "Enhanced"` — a machine-readable mod registry the pack
  never had.
- `-Extract` on the inner container is `NOT YET` tried; if it works, cooked assets of ANY mod are
  readable, and "which mod overrides which base asset" becomes a computed table instead of a
  guess (MASTER_PLAN Phase 3 — compatibility). The cooked-package (Zen) format still needs a
  reader for CONTENTS; names and overrides need none.
- `iostore_analysis.exe` (`-help` works) — Epic's container comparison tool: diff two sets of
  containers, patch analysis. Useful for "what changed between game versions".

### 3.4 Headless editor: commandlets + Python, no window

`UnrealEditor-Cmd.exe` is present; `Engine/Plugins/Experimental/PythonScriptPlugin` ships with
its Python 3.11 and the standard scripts (`remote_execution.py`, `unreal_core.py`,
`debugpy_unreal.py`); `EditorScriptingUtilities` ships too. The plugin is not in the uproject's
list → enable per run with `-EnablePlugins=PythonScriptPlugin`. The proven launch shape (§7):

```
UnrealEditor-Cmd.exe <uproject> -run=PythonScript -Script=<file.py> -EnablePlugins=PythonScriptPlugin
                     -unattended -nopause -NullRHI -nosplash -stdout -FullStdOutLogOutput -abslog=<log>
```

This is the channel for every "read the game's truth" tool: export a data table, list assets by
class, dump a blueprint's defaults, diff two tables, check what a mod folder references before a
cook.

### 3.5 Channels into a RUNNING editor — the raw material for a CLI or an MCP (owner's second question)

Nothing Conan-specific is attached to this kit (no MCP, no CLI beyond `RunUAT`). What the kit
DOES ship — checked plugin by plugin for a `Binaries/` folder (an installed licensee build has
no compiler, so a plugin without binaries is a stub that cannot be loaded):

| Channel | What it is | State in the kit (`ls <plugin>/Binaries`) |
|---|---|---|
| **Python remote execution** | `remote_execution.py`: UDP multicast discovery (`239.0.0.1:6766`) + TCP command socket (`127.0.0.1:6776`); modes ExecuteFile / ExecuteStatement / EvaluateStatement. This is what the remote-exec-based "UE MCP servers" wrap. | **HAS BINARIES — the one live channel.** Enable per run with `-EnablePlugins=PythonScriptPlugin`; "Remote Execution" itself is a project setting (no `RemoteExecution` key in the kit's ini yet) |
| **Commandlets** | the headless route above — no live editor needed at all | proven (§7) |
| **Epic "Unreal MCP"** | `Engine/Plugins/Experimental/ModelContextProtocol` — *"Anthropic MCP (Model Context Protocol) server implementation for Unreal Engine"*, HTTP+SSE on `127.0.0.1:8000/mcp`, console `ModelContextProtocol.StartServer` (Epic docs, `web-recon.md` §8) | **NO BINARIES** — `.uplugin` + `Resources` only; same for its `ToolsetRegistry`/`AllToolsets` dependencies. A stub. |
| **AI Assistant** | `Engine/Plugins/Experimental/AIAssistant` — Epic's hosted-LLM editor assistant (5.7+); an MCP *client*, not a server | **NO BINARIES** — stub |
| **Remote Control API** | HTTP `:30010` / WebSocket `:30020` property and function access (`Engine/Plugins/VirtualProduction/RemoteControl`) | **NO BINARIES** — stub |
| **CmdLink** | `CmdLink.exe` client is in `Binaries/Win64`; server is `Engine/Plugins/CmdLinkServer` | client present, **server NO BINARIES**; also `"CmdLinkServer": false` in the uproject |

Conclusion for the owner: **a CLI we get today by wrapping commandlets (no editor window ever
opens). An interactive, MCP-shaped channel is possible ONLY through Python remote execution
into a running `-ModDevKit` editor — and that editor's first windowed launch compiles shaders
for 30–60 min and takes the screen over the remote desktop.** Of the community MCP servers,
the ones that need no plugin compile (they drive remote execution) are the only candidates for
this licensee build — `web-recon.md` §8 lists them; the compiled-plugin ones are out.

## 4. The mod's anatomy on disk (what our tools must produce and consume)

```
<Mod>.pak                       wrapper, uncompressed, mounted at <Game>/ConanSandbox/Mods
├── modinfo.json                name · description (BBCode) · version · author · Steam ids ·
│                               folderName · devkitRevisionNumber · minimumVersion
├── manifest.json               MD5 (+ "<xxh128>" block) of every file below
├── <Mod>-Windows.pak           loose: AssetRegistry.bin, ModCompat.bin, pipeline caches
├── <Mod>-Windows.utoc/.ucas    IoStore: the cooked assets (Oodle) + ShaderArchive-<Mod>-…
├── <Mod>-WindowsServer.*       same for the dedicated server
└── <Mod>-LinuxServer.*
```

The game *"extracts, verifies, and mounts the set of paks for the current platform at runtime"*
(`BuildMod.cs` comment) — which is why the pack's rule "never rename a mod's `.pak`" holds and why
`modlist.txt` names the wrapper only. It also means the in-game `Mods/` folder holds ONE file per
mod, and the `.utoc/.ucas` companions described in pack `docs/02` §2 come from OLDER tooling —
every one of the 44 live mods is a single wrapper `.pak` (checked: `ls Mods/`).

## 5. Localization — the kit corrects plans/04 §6

`plans/04` §6 states *"Conan has no `.locres`; texts live in StringTables and data tables inside
paks."* The kit shows the game's full Unreal localization pipeline:

```
UE4/Content/Localization/<Target>/           18 targets: Exiles_UI, Exiles_Items, Exiles_Dialogues,
  <Target>.manifest   (UTF-16 JSON)            Exiles_Code, 13 DLC targets, LocTest
  <Target>.csv        (word-count history since 2016)
  <Target>_Conflicts.txt
  de en es fr it ja ko pl pt-BR ru tr-TR zh-Hans zh-Hant/
    <Target>.locres   (compiled)
UE4/Config/Localization/<Target>_{Gather,Export,Import,Compile,GenerateReports}.ini
UE4/Content/Localization/README - Localiziation.txt   (Funcom's 6-line how-to: edit the ini,
                                                        run GatherText.bat, edit .po, run again)
```

Sizes: `Exiles_UI.manifest` 8.1 MB (every source string with its key and the asset path that
owns it), `ru/Exiles_UI.locres` 1.9 MB, `Exiles_Items` manifest 11.9 MB / ru 3.6 MB. The
`.archive` per-culture source files are NOT shipped (only compiled `.locres`), so editing Russian
means: decompile `.locres` (the format is public; `UnrealLocres`/`locres` tools exist) or import
via the kit's `GatherText` commandlet pipeline. Mods that show English where the game shows
Russian (MrS in §5 of plans/04) most likely ship assets whose `FText` carry no localization key,
or ship their own target — checkable now by reading the mod's cooked assets (§3.3) and the
manifest. The `check-mod-localization.py` finding "44 of 44 without any localization mechanism"
stays true for the MODS; the GAME has the mechanism, and a translation mod can use it.

## 6. What a run touches on the machine (side effects seen on the first headless run)

- `%LOCALAPPDATA%\UnrealEngine\Common\DerivedDataCache` — created, writable, 305 MB after 1 minute.
- `%LOCALAPPDATA%\UnrealEngine\Common\Zen\{Install,Data}` — the kit **installs and starts
  `zenserver.exe`** (port 8558, GC every 6 h, keeps a cache 14 days, low-disk threshold 2 GB) and
  migrates `C:\ProgramData\Epic\Zen\Data` if present. It stays running after the commandlet exits
  (standard UE behaviour). Stop: `zen.exe service down` or kill `zenserver.exe`. C: had 85 GB free.
- Tries `fileserver.ci-net.internal` (Funcom's shared DDC) and times out after ~10 s — harmless,
  but every run pays the timeout unless `-ddc=NoShared` (`NOT YET` tried).
- Warns *"NTFS Journal is not active for volume F:"* — the asset registry gatherer wants a USN
  journal for fast rescans: `fsutil usn createJournal F: m=0x40000000` from an elevated console
  (owner's call — it is a volume setting).
- `UE4/Intermediate/CachedAssetRegistry` gets created (the 154 GB scan's cache) — the second
  run should be much faster than the first.

## 7. The headless smoke run — 2026-09-12 00:17

Command (PowerShell `Start-Process`, hidden window, stdout to the scratchpad):

```
UnrealEditor-Cmd.exe F:\CEDevKit\CEUE5Devkit\UE4\ConanSandbox.uproject -run=PythonScript
  -Script=<scratch>\dump_xp.py -EnablePlugins=PythonScriptPlugin -unattended -nopause -NullRHI
  -nosplash -stdout -FullStdOutLogOutput -abslog=<scratch>\devkit-smoke.log
```

`dump_xp.py` loads `/Game/Systems/Progression/DT_ExperienceSystemLevel` and writes row names,
column names, columns-as-strings and a CSV export next to itself.

Timeline: 00:17:05 start → 00:17:16 Zen installed and up → 00:17:28 shared DDC timeout →
00:17:38 `Executing Class /Script/PythonScriptPlugin.PythonScriptCommandlet` → 00:18:56
`XP_DUMP_DONE ok=True` → 00:18:57 `Exiting`. **Total 1 min 52 s; the script itself 20 ms.**
No full asset-registry scan was needed (`load_asset` by path), no shader compilation
(`-NullRHI`). Second-run cost is `NOT YET` measured.

**Result — the XP curve, read from the kit's own serializer** (`xp_curve.raw.json`,
`DT_ExperienceSystemLevel.csv` next to this file):

| Level | LevelStart | LevelEnd | XP for the level |
|---|---|---|---|
| 1 | 0 | 175 | 175 |
| 2 | 175 | 750 | 575 |
| 5 | 4075 | 7300 | 3225 |
| 10 | 35550 | 47500 | 11950 |
| 12 | 61825 | 78725 | 16900 |
| 20 | 285775 | 330375 | 44600 |
| 30 | 949150 | 1045475 | 96325 |
| 40 | 2212850 | 2379250 | 166400 |
| 50 | 4257625 | 4511875 | 254250 |
| 60 | 7259525 | 7619025 | 359500 |

60 rows, two int columns (`LevelStart_3_AA3E…`, `LevelEnd_6_6DE7…` — column names carry the
UserDefinedStruct GUID suffix). **Level 12's start, 61 825, is the exact number measured in the
live game on 2026-09-10 (`plans/04` §5) — the table on disk is the live curve.** Per-level cost
grows roughly quadratically (175 → 359 500); "flat or linear" (the owner's word) is a two-column
rewrite of this file.

API notes for the tool: `DataTableFunctionLibrary.get_data_table_row_names`,
`get_data_table_column_names`, `get_data_table_column_as_string` exist;
`export_data_table_to_csv` does **not** (`AttributeError`) — build the CSV from the columns.

### 7.1 Second experiment — a live UI mod unpacked and read (owner's ask: "unpack the UI mod, do you see EN strings, can you localize it?")

`UIMod_Hosav.pak` (26 MB, "Hosav's Custom UI Enhanced 2.5.3", devkit revision 1001) →
wrapper extracted → `UIMod_Hosav-Windows.utoc` **extracted with the kit's UnrealPak in
0.06 s: 404 files, 46 MB, Oodle removed** — 200 assets as Zen-split `.uheader` + `.uexp`,
3 `.ubulk`, one shader archive. 402 of 404 files live under `Content/Mods/UIMod_Hosav/`; **two
override a base path: `Content/Systems/EEWA/`** (a hook into another mod's system, not vanilla).
No `.locres`, no StringTable in the mod.

`textscan.py` over the `.uexp` files: **46 files carry 369 English phrases**. The settings
panel `UI_Exported/W_ExampleWidget_User.uexp` alone has 101 ("Additional HUD Settings", "Ally
Health Color Picker", "Buff Timer", "Centered UI Stats / Custom Position", …); twelve
`ColorPickerWidget_*` clones carry 10 each ("Alpha Channel", "Click to restore old color",
"Hexadecimal Value"). The same widget holds **174 32-hex GUID strings, 1 066 across 57 files** —
the shape of `FText` localization keys (`NSLOCTEXT`-style key per text), i.e. the texts are
`FText`, not bare strings.

**Can it be localized? In principle yes, by two routes, one still to be proven:**

1. **Locres route (proper):** an `FText` with a key resolves through the localization manager;
   a `.locres` for culture `ru` that maps the mod's (namespace, key) pairs to Russian would
   translate them **without touching the mod** and would survive the mod's updates as long as
   keys stay. Open question (`NOT YET`, web recon Q5 + an experiment): does the Enhanced game
   load a `.locres` shipped inside a mod pak, and under which target/path.
2. **Runtime route (already ours):** the UE4SS Lua layer that already rescales this very HUD
   (`hud_pin`, `W_SmoothHP_C`) can `SetText` on named widgets at spawn — a translation table in
   `config.lua`. Works today, per-widget, breaks when the author renames widgets.

Route 3 — re-cooking the author's widgets with Russian text — is possible with the kit but is
the worst: it forks the mod and dies on every update.

### 7.2 The localization experiment — 2026-09-12 10:40–12:45, what each door said

The owner accepted the table (interview 002) and asked for the mod the same morning. Run as
atomic steps; every verdict below is a log line, not a guess.

| step | done | verdict |
|---|---|---|
| game's own `ru/Exiles_UI.locres` extracted from `pakchunk0-Windows.pak` (index unencrypted, pak v11) | `UnrealPak -Extract -Filter` | 13 cultures + locmeta, 1.87 MB |
| `.locres` v3 reader/writer (`ConanExiles/_config/devkit/locres.py`) | selftest on the game's file | **round trip byte-identical, 15 553 entries** |
| SourceStringHash algorithm = `FCrc::StrCrc32` over UTF-16 code units, 4 rounds per unit | kit manifest sources vs game locres | **15 282 of 15 282 match** |
| KeyHash algorithm | 19 CRC variants tried against engine-written hashes | **none match — unknown**; not needed: the engine writes it |
| overlay compiled by the kit itself: `UnrealEditor-Cmd -run=GatherText -config=<Compile.ini>` with a private target `UE4/Saved/Loc/HosavRU` (manifest + en/ru archives from `hosav-ru-entries.py`) | headless, 2 min | **260 keys / 238 strings → `ru/HosavRU.locres`, 123 ms** |
| merged locres (game 15 553 + ours 260) inside a mod wrapper built with the kit's `UnrealPak` | game launch | ❌ `Invalid pak file version (12)` — **the 5.8 UnrealPak writes pak v12, the game reads ≤ 11**; no switch to lower it |
| same, repacked with `repak` 0.2.3 `--version V11` (`_tools/repak`, sha256 verified) | game launch | pak accepted; ❌ `Mod pak file … failed check … (Error: Filename '../../../ConanSandbox/Content/Localization/Exiles_UI/ru/Exiles_UI.locres' is not allowed in pak)` — **the mod loader whitelists file names in the platform pak; overriding a game file by path is refused by design** (`ValidateMod_FilenameNotAllowed`) |
| runtime route: UE4SS Lua mod `HosavRU` (sweep `TextBlock`/`RichTextBlock` owned by `/Game/Mods/UIMod_Hosav/`, `SetText` from `ru_table.lua`) | deployed to `ue4ss/Mods/HosavRU`, `luac -p` green | ❓ **UNTESTED** — UE4SS itself died on both launches (`FName::StaticAlignment` fatal, bug 10) before any Lua mod ran; the mod is deployed with `enabled.txt.off` for an A/B |

What the game's strings say about the proper pak route: `PolyglotDataToText` (Kismet, BP-callable)
registers translations at runtime from an `FPolyglotTextData`; `LocalizationTargetsToChunk` /
"Skipped loading localization data for chunk %d (from PAK '%s')" show chunked-localization
loading from paks, but only for targets the game already knows, and the loader's filename
whitelist blocks that path for mods. So a pak-based translation = a cooked ModController that
calls `PolyglotDataToText` for each key — phase 1 of the epic (needs a cook, hence the version
check first). Until then the Lua sweep is the only route that needs no cook.

Side facts: mods without `ModCompat.bin` mount fine ("skipping compatibility check" — 12 of 44
live mods); the loader extracts platform paks to `Saved/ExtractedMods/` and skips re-extraction
by hash; `AssetRegistry.bin` is required in the platform pak (`ValidateMod_MissingAssetRegistry`),
a foreign one (Chest Labels') passed the manifest stage.

### 7.3 The localization experiment — SOLVED 2026-09-12 14:43, and the door was the plainest one

Two more doors were tried after §7.2, one per launch, each answered by a screenshot of the mod's
own settings panel (`Tab` → the character screen → **UI Settings**, bottom-left):

| door | verdict |
|---|---|
| our merged `Exiles_UI.locres` LOOSE at the game's own path | ❌ pointless by design — in Unreal a **pak beats a loose file** (`FPakPlatformFile::FileExists` searches the mounted paks first), and `Exiles_UI` lives in `pakchunk0` |
| a private target registered by config: `[Internationalization] +LocalizationPaths=%GAMEDIR%Content/Localization/HosavRU` in `Saved/Config/Windows/Engine.ini`, files loose | ❌ no effect. The game read the section and preserved it across its own exit rewrite, so the config layer is live — the localization manager still did not take the target. Launch 14:27, panel English |
| **the engine's DEFAULT game target, loose: `Content/Localization/Game/{Game.locmeta, ru/Game.locres}`** | ✅ **works, no config change at all.** Launch 14:35 → panel fully Russian. Re-verified 14:41 with BOTH `+LocalizationPaths` lines removed and `UE4SS-settings.ini` restored byte-for-byte |

Why this one is allowed where §7.2's was not: `%GAMEDIR%Content/Localization/Game` is in the
engine's localization paths **by default**; the target exists in **no pak of the game**, so the
"pak wins" rule never fires; and a `.locres` is readable loose — the shipping exclusion list for
non-pak files is `uasset/umap/uexp/ubulk/upipelinecache/ushaderbytecode`, localization is not in it.
**Neither the mod loader nor UE4SS takes part**, which is what makes it survive bug 10.

**Attribution is not an impression — the Lua route reported itself out.** `HosavRU` was running
during both successful launches, and with the panel OPEN it logged: *«тик 40: надписей мода в
памяти 199, английских из таблицы среди них нет»* — 199 mod TextBlocks seen, zero replacements
made. The `.locres` had already translated them. The Lua mod is therefore **removed from the game**
and kept in `_unpacked/HosavRU/` as the fallback for the day a patch puts a `Game` target in a pak.

What the translation reaches, after the second pass: **585 mod keys across 33 widgets** (242
distinct strings) — the settings panel, all twenty colour-picker widgets, **and the HUD header**
(«Лёгкая / 0 / 0% сниж.», «3 / 0% / 6 ур/с», verified 15:08).

The header needed §7.4: `Light`/`Medium`/`Heavy` and the format strings themselves live in
**Kismet bytecode**, not in asset data, and `ftext_extract.py` was blind to that shape. Only the
numbers and the `{}` placeholders stay untranslatable — the engine substitutes those.

Pack-side: `ConanExiles/_config/localization/` (source + README with the rebuild recipe) and
`ConanExiles/_config/deploy-localization.py` (`--check` · `--remove`), because a game integrity
check or a reinstall wipes those two files **silently** — the symptom is an English panel and no
error anywhere.

### 7.4 The second shape of FText — 145 keys the extractor walked straight past (2026-09-12 15:00)

The owner looked at the finished panel and asked the one question that broke the assumption:
*«а класс брони Light — это можешь перевести?»*. The answer on file was "no — `Light` is in no
`FText` key of the mod, it is composed at runtime". **That answer was wrong, and the tool was why.**

`FText` reaches a cooked package in **two shapes**, and `ftext_extract.py` only knew the first:

| shape | where | layout |
|---|---|---|
| A — asset data | property data of a widget | `[int32 nsLen][ns\0][int32 33][<32 hex>\0][int32 srcLen][src\0]` — length-prefixed |
| **B — Kismet bytecode** | a Blueprint's compiled graph | `EX_TextConst (0x29)` + literal type `0x01` (LocalizedText) + **three** `EX_StringConst (0x1F)` null-terminated ANSI strings, in the order **SourceString, Key, Namespace** — **no length prefixes at all** |

Shape B is where a widget's *format* strings live and where the words they interpolate live:
`{armortype} / {armor}{suffix} / {damagereduction}% dr `, `Light`, `Medium`, `Heavy`, `DEAD`,
the whole party system's messages. Scanning for shape A's length prefix cannot see any of them.

Numbers: **794 keys / 294 sources → 939 / 359** on the same mod. Of the 65 new sources, five were
approved by the owner in chat the same minute (armour classes; `dr` → «сниж.», `dps` → «ур/с»),
compiled, deployed and **verified on screen at 15:08: «Лёгкая / 0 / 0% сниж.», «3 / 0% / 6 ур/с»**.
The remaining 61 went to `interviews/interview_003_hosav_hud_bytecode.md` for the owner's reading —
23 with a proposed translation, 38 marked "do not translate" (pure `{}` templates, three of the
author's debug strings, and the `k`/`m` number suffixes, which are a question of their own).

**The lesson is about the instrument, not the mod:** a "there is no such string" verdict is only
as good as the shapes the scanner knows. Before answering "it cannot be done", check what the
extractor is blind to — here it was one of two serialisation forms, and it hid the very line the
owner looks at most.

## 8. Web recon — done 2026-09-12, full digest in `web-recon.md` (every claim with its URL)

What changed the plans, in order of weight:

1. **The version rule, from the game's own strings and the kit's:** a package cooked by a NEWER
   engine/licensee/custom version is refused — the shipping exe carries *"Package is unloadable:
   %s. Reason: Version is too new / LicenseeVersion is too new / Custom version is too new"* and
   *"Incompatible Mods Detected … The following mods failed mounting"*; the kit's UI carries
   *"Mod is too new and incompatible for this game version"* (via `ModCompat.bin`, which records
   "cooked against engine %s"). **Exact match is not required; "not newer" is.** Our kit is
   newer → phase 1 opens with an OFFLINE compatibility check: read the versioning block of a
   `.uheader` from a mod that loads today (Chest Labels, kit revision 1001) and compare with a
   header our kit cooks. Funcom re-cooks are routine ("major update, most mods will need a
   re-cook" — three times in 2026).
2. **Prior art exists and is MIT:** `jvdberg1/exileforge` — a PowerShell + Unreal-Python CLI
   that builds a level-cap mod headlessly on `5.6.1-366792`; verified command line
   `RunUAT.bat -NoCompile BuildMod -Mod=<M> -Project="<kit>/UE4/ConanSandbox.uproject" -Cook -Pak
   -Compress -ScriptDir="<kit>/UE4/"` (note: `-ScriptDir` is the **`UE4/` root**, not the
   automation folder), and `ef_editor.py` using
   `unreal.DataTableFunctionLibrary.export_data_table_to_csv_file` / `fill_data_table_from_csv_string`
   (a different name from the one our smoke tried — use this one). Its gotchas: long paths break
   cooks; `LogModController: Invalid class` → drop the ModController and use the overlay override.
3. **Two ways to change a table:** overlay override (author the table at
   `Mods/<M>/Content/Systems/Progression/DT_…`, the cooker remaps it onto `/Game/…` — whole-table
   replace, conflicts with any other mod touching it) or a `ModController` blueprint with
   `Merge Data Tables (With Control Table)` — row/column-level merge, the legacy-documented
   Conan way (wiki pages in the digest). Level-cap mods on Nexus do not say which they use.
4. **Localization for mods — no official Enhanced doc.** The generic UE5 mechanism: a mod ships
   `Content/Localization/<Target>/<culture>/<Target>.locres` inside its pak at the same path as
   the game's; CSV round-trip tools exist (`ue-localization-tools`, `UEExtractor`). Still an
   experiment (§7.1).
5. **Readers for cooked Enhanced packages:** `retoc` (UE 5.3+, zen↔legacy), `UAssetGUI` 1.1.0
   (5.6/5.7, opens `.utoc/.ucas`); no public `.usmap` for Enhanced — a licensee 5.8.2 needs a
   self-generated mapping. The kit's own editor stays the authority.
6. **"Found no script module records"** is documented by one repo (`aegis-ue5-modkit`) that is
   **404 today**; the record file exists in our kit (`UE4/Intermediate/ScriptModules/ModDevKit.Automation.json`).
   Treat the breakage as unconfirmed until our own run.
7. **Disk truth from the store:** Epic lists the kit at 145 GB download / 166 GB installed
   (ours: 169 GB on disk). First-launch duration: not published anywhere.

## 9. Risks, tiered (Murphy)

- **(a) Kit newer than the game (beta branch).** An override mod may be refused or crash the
  live game. Defence: the first mod is a data-only override, tested on a throwaway save, with the
  game log read for `ModCompat`/`ValidateMod` lines. Rollback = remove one line from `modlist.txt`.
- **(a) Disk.** F: 152 GB free, C: 85 GB. A cook writes `Saved/Mods/_Cooked` (three platforms)
  plus DDC on C:. Guard: free-space check before every cook; DDC path movable via
  `-ddc=…`/`Engine.ini` if C: fills.
- **(b) The GUI editor and the remote desktop.** A window launch takes the owner's screen
  (memory: owner-works-over-remote-desktop) and the first launch compiles shaders for 30–60
  min. Everything in phase 0–2 stays headless; a live editor is a scheduled event with the owner.
- **(b) `ProtectedAssets.pak` (13 GB).** Content Funcom keeps out of the editor's plain files;
  `-IniKeyDenylist=aes.key` in `DefaultGame.ini` says keys are stripped from shipped ini. Some
  assets may be unreadable — acceptable until one we need turns out to live there.
- **(c) Zen server stays resident**, shared-DDC timeout per run, USN-journal warning — known,
  cheap, listed.

## 10. Bottom line for the plans

The kit turns three "impossible without Dev Kit" items into data work: the XP curve (§2), a
translation mod (§5), and precise mod-conflict tables (§3.3). The machinery to build is small and
deterministic: a headless runner, a table exporter, a pak inspector, a mod skeleton + `BuildMod`
driver, and a localization auditor. The interactive channel (CLI/MCP against a live editor) is
real but second in line — everything above it works with no editor window at all.
