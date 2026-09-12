**Branch or Release**

`UE4SS - v3.0.1 Beta #0 - Git SHA #2bfa839f` (upstream `main`, nightly build 1127, obtained 2026-09-08). Not a fork, no local patches. `UE4SS Build Configuration: Game__Shipping__Win64 (MSVC)`.

**Game and Engine Version**

Conan Exiles **Enhanced** 2.1.1, UE **5.6.1**, `LogInit: Build: ++exiles+release-CL-373655`, Windows 11 Pro 26200.

Config is this repository's own `assets/CustomGameConfigs/Conan Exiles Enhanced/` — I re-downloaded both files today and diffed them against mine: `VTableLayout.ini` and `UE4SS-settings.ini` are **line-for-line identical** to `main` (only CRLF/LF differs). So: `MajorVersion = 5`, `MinorVersion = 6`, `bUseUObjectArrayCache = false`, `DoEarlyScan = 0`, `UseCache = 1`, `DebugBuild` empty.

**Describe the bug**

UE4SS dies during its **own** initialisation, before any Lua mod runs — including the ones shipped with UE4SS:

```
FName Size: 0x8
Fatal Error: [FName::StaticAlignment] StaticAlignment_Private is not valid
```

It is **intermittent**: **10 of the 15 launches** I have logs or notes for (2026-09-10 and 2026-09-12) ended this way, the other 5 started normally. Nothing on disk changes between a failing and a succeeding launch.

Two observations that I think matter more than the error text itself:

**1. On the launches that DO work, the alignment that gets printed is not a plausible alignment.**

| launch | `FName Alignment:` | outcome |
|---|---|---|
| 2026-09-10 11:35 | `0x2684C788` | works |
| 2026-09-10 14:46 | `0x0997C788` | works |
| 2026-09-12 15:07 | `0x74ABC788` | works |
| 10 other launches | line absent | Fatal |

An FName alignment is 4 (or 8 on ≤ 4.21) — never a value like these. All three share the low 16 bits `C788`, which is what the low 32 bits of an **address inside the module** look like under ASLR (the base moves, the offset within the image does not). So the field appears to receive a truncated pointer, and the accessor's "is it non-zero" check lets that through; on the failing launches the same read yields 0 and it throws instead.

**2. The documented fallback never fires.** `UE4SS.dll` contains

```
Could not dynamically establish alignment of FName, defaulting to compile-time alignment: 0x{:X}
```

and that line is **absent from every failing log**. So the code does not think the dynamic resolution failed — it thinks it got a value, and the value is 0.

**To reproduce**

1. Install UE4SS (this build) into Conan Exiles Enhanced with the repo's own game config for that game.
2. Launch the game.
3. `grep 'StaticAlignment_Private' UE4SS.log` — about two launches in three it is there, and no mod (yours or mine) starts.

I could not find a deterministic trigger. It is not tied to a reboot: it survived one, and it has both failed and succeeded within the same boot.

**Expected behavior**

Either the dynamic resolution yields 4, or — when it cannot — the compile-time fallback that already exists in the code takes over, instead of a fatal.

**Screenshots, UE4SS Log, and .dmp file**

**Both full logs are here — a matched pair from the same machine, build and config, one failing (2026-09-12 12:39) and one succeeding (2026-09-12 15:07):** https://gist.github.com/MikalaiKryvusha/16bc129a36d89754d0966032910e4461 (only the Windows paths and my user name are replaced with placeholders; nothing technical was touched). Normalised for addresses and timestamps, **they are identical for all 798 lines up to the decision point**: same scans, same results, same order.

```
[PS] Scan finished in ~0.7-1.1s
[PS] Found BuildConfiguration: Shipping
[PS] Found Stats: Off
[PS] Found GUObjectArray / GMalloc / FName::ToString / FName::FName(wchar_t*)
[PS] Found StaticConstructObject_Internal / FUObjectHashTables::Get() / GNatives / GameEngineTick
PS scan successful
...
Constructed 0 of 0 objects
FText size detected as 0x10 bytes.
FSoftObjectPath layout: size 0x20, SubPathString at 0x10, FTopLevelAssetPath shape, from reflection
...
FAssetData Size: 0x68 / FVector 0x18 / FQuat 0x20 / FFieldVariant 0x8 / FText 0x10 / FName Size: 0x8
<-- here the successful run prints "FName Alignment: 0x74ABC788" and continues into
    "##### MEMBER OFFSETS START (Coalesced) #####"; the failing run throws instead
```

In the successful run, `UStruct::MinAlignment` and `UScriptStruct::ICppStructOps::Alignment` are printed **after** that point, in the coalesced member-offset dump.

One more line from every run, in case it is relevant: `WARNING: VTable and scan addresses differ for UGameEngine::Tick. Potentially customized vtables.` (the scan address is then used).

**Desktop**

 - OS: Windows 11 Pro 26200

**Additional context — what I ruled out, so you do not have to ask**

- Game install: the game's own checksum manifest — 490 files, 0 corrupt, 0 missing.
- UE4SS install: sha256 of all 20 shipped files against the download — identical.
- `[General] bForceGUObjectArrayForIteration = true` (your fix in #1405 for the closest-looking 5.6.1 start crash): **no effect at all** — the normalised log of that launch is identical to a launch without it.
- `[EngineVersionOverride] DebugBuild = false` and `Stats = false`: these cannot help here, because the scan already reports `Build configuration: shipping, detected` and `Stats: off, detected`.
- `Constructed 0 of 0 objects` — I know from #1208 that this is benign; noting it only so nobody re-derives it.
- No AOB cache exists on disk in this install, and `[PS] Reading image / Starting scan` runs on every launch, so a stale cache is not involved.

**One thing I have NOT proven, stated plainly:** on 2026-09-09 one of my own Lua mods looked like a deterministic trigger (3 fatals with it present, clean launches without it). The fatal later kept happening with that mod deleted, so I no longer believe that attribution — the earlier result was most likely the same intermittency. But I cannot rule out that a mod raises the probability, and I did not run a large enough no-mods sample to say otherwise.
