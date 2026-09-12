# Web recon — UE4SS `FName::StaticAlignment` fatal on Conan Exiles Enhanced (bug 10)

> **Created:** 2026-09-12 13:10 +03:00 (subagent sweep, 133 tool calls, 8 min) · **Parent:**
> `bugs/10_ue4ss_fname_alignment_fatal.md` · **Status:** living digest; the fix candidates below are
> UNTRIED as of writing · **Outbound:** → bug 10 "next steps" · → `STATUS.md` handover item 1
>
> Tags: `#ue4ss #bug10 #StaticAlignment #settings #rollback #patternsleuth`. Greps:
> `grep -n 'TRY' ue4ss-fatal-recon.md` (the candidate fixes) · `grep -n 'NOT FOUND'` (holes).
> Our build: `UE4SS - v3.0.1 Beta #0 - Git SHA #2bfa839f` = upstream `UE4SS-RE/RE-UE4SS` main,
> commit of 2026-09-08 "chore: update UE submodule" — NOT a Conan fork.

## 1. What the check is (inferred, the source is private)

- The fatal is thrown inside the `deps/first/Unreal` submodule (`Re-UE4SS/UEPseudo`, 404 for
  anonymous access); `UE4SSProgram.cpp` / `UE4SSRuntime.cpp` on main carry no "FName Size" /
  "Alignment" strings. Search of issues/PRs/commits for `StaticAlignment_Private`: **0 hits**
  (https://api.github.com/search/issues?q=repo:UE4SS-RE/RE-UE4SS+%22StaticAlignment_Private%22).
- Meaning of the value: issue #413 "[Investigation - Release] FName Alignment"
  (https://github.com/UE4SS-RE/RE-UE4SS/issues/413) and PR #703
  (https://github.com/UE4SS-RE/RE-UE4SS/pull/703): FName alignment is **4** for UE ≥ 4.22 (ours)
  or **8** for ≤ 4.21; the experimental release notes: "BREAKING: This also changes the default
  FName alignment from 8 to 4". A `_Private` static that is 0 until resolved + "is not valid" =
  the accessor fired before / after a failed resolution. **Inference, not read from source.**
  Bug 10's own observation agrees: the "healthy" values printed (0x2684C788, 0x997C788) are
  not 4 or 8 either — the field is garbage when it passes the "non-zero" test.

## 2. What changed upstream right before our build (plausible trigger)

Commits 2026-08-28 … 09-08 (https://api.github.com/repos/UE4SS-RE/RE-UE4SS/commits?since=2026-08-16T00:00:00Z):
- `053d2a61` "feat: tri-state DebugBuild setting with automatic build configuration detection";
  `7a608a63` "fix: detect STATS separately from the build configuration"; `e6d4c68c` Test build override.
- `33535fc6` "perf(UE4SS): search objects through the engine hash tables and retire the array
  cache"; `a118ad31` "run the hash table self test on the game thread"; `71007b8e` "schedule the
  hash table self test on IsConfigured, not IsAvailable".
- `68caddcf` "Increase default scan timeout from 30s to 120s"; PR #1408 "Wait some after every
  scan attempt in order to not hog the CPU". Seven submodule bumps (contents invisible).
- Build-configuration detection is patternsleuth string fingerprinting
  (https://raw.githubusercontent.com/trumank/patternsleuth/master/patternsleuth/src/resolvers/unreal/engine_version.rs);
  a run-to-run varying result of that detection or of the hash-table walk is the most likely
  reason the alignment resolves on some launches and not others. **Hypothesis.**

## 3. Fix candidates — one per launch, in this order (TRY)

All keys exist in the current shipped `assets/UE4SS-settings.ini`
(https://raw.githubusercontent.com/UE4SS-RE/RE-UE4SS/main/assets/UE4SS-settings.ini):

```
[General]
bForceGUObjectArrayForIteration = true   ; TRY 1 - "Force slow GUObjectArray iteration even if FUObjectHashTables is available."
[EngineVersionOverride]
DebugBuild = false                       ; TRY 2 - "Leave empty to detect it from the game ... false forces Shipping."
Stats = false                            ; TRY 3 - "Only needed when the scan gets it wrong"
```

- **TRY 1 is the maintainer's fix for the closest 2026 case**, issue #1405 "VEIN (UE 5.6.1): 1101
  crashes during init at the FUObjectHashTables read … 1009 works on the same build"
  (https://github.com/UE4SS-RE/RE-UE4SS/issues/1405). narknon: "The game is a test build, so
  offsets for the hashtables are different. you can set it to use guobjectarray in settings
  instead of hashtables"; UE4SS: "The option is `bForceGUObjectArrayForIteration = true`";
  reporter: "Added that line and now works with 1101."
- **TRY 4 — rollback to UE4SS build 1009 (2026-07-04)**: predates the DebugBuild/STATS detection
  and the hash-table path ("Build 1009 … Works reliably; no `[HashTables]` log line appears",
  same issue). Keep our `VTableLayout.ini` (PR #1316, mandatory: "3 additional virtuals in
  UObject") and `[EngineVersionOverride] 5.6` (PR #1392: without it "vtable offset calculations
  occurred before engine-version detection completed … crashing `TypeChecker::store_all_object_types`").
- `UseCache`, `DoEarlyScan`, `SecondsToScanBeforeGivingUp`: no source ties them to this error.
- No FName entry exists in `MemberVariableLayout` / `VTableLayout` ini — FName layout is not
  overridable that way.

## 4. Related facts

- "Constructed 0 of 0 objects" is **benign** — issue #1208
  (https://github.com/UE4SS-RE/RE-UE4SS/issues/1208), maintainer: "just means that all required
  objects were already constructed by the time we init so there are no objects to wait for."
  So bug 10's 12.09 race hypothesis built on that line is withdrawn.
- #1391 (Conan Exiles server, CL 373004): `RegisterLoadMapPostHook` receives garbage `Error`
  param, workaround `RegisterInitGameStatePostHook` — different symptom
  (https://github.com/UE4SS-RE/RE-UE4SS/issues/1391). #1233 (Bloodlines 2) — mismatched install.
- The repo's own Conan config: `MajorVersion = 5 / MinorVersion = 6`, `bUseUObjectArrayCache =
  false`, `DoEarlyScan = 0`, `DebugBuild =` (empty), no `Stats` key
  (https://raw.githubusercontent.com/UE4SS-RE/RE-UE4SS/main/assets/CustomGameConfigs/Conan%20Exiles%20Enhanced/UE4SS-settings.ini).
- Ratchet is a Lua plugin system for LEGACY Conan only ("incompatible with Conan Exiles
  Enhanced", https://steamcommunity.com/sharedfiles/filedetails/?id=3578032598) — not a fork.

## NOT FOUND
- The source of `FName::StaticAlignment` / `StaticAlignment_Private` (private submodule).
- Any issue, Nexus post, Steam/Reddit thread or quoted Discord message containing this error.
- Any Conan-specific UE4SS fork. Nexus pages returned 403.
