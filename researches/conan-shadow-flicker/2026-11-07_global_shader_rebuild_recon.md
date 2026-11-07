# Recon — can the shipped game run a modified Nanite rasterizer / VSM projection shader?

> **Created:** 2026-11-07 (helper agent, read-only on game and kit, no game or editor run; written 18:34 +03:00) · **Parent:** bug 67 ·
> **Status:** recon done; nothing built or tested · **Outbound:** the round-trip test in §6 → the main session (bug 67)
>
> Marks: **[SRC: …]** observed · *[INF]* inference. Listings by `retoc-5.8 list` and `repak list/get` (copies went to the scratchpad only).

## 1. Where the shipped global shaders live

- No loose shader files in the game folder. Paks hold 110 files: `global.utoc/ucas` (only `ScriptObjects`) + 36 × `pakchunk*.pak/utoc/ucas`, no `.sig` files **[SRC: `ls Paks`; `retoc list global.utoc`]**.
- The global shader **code library** is an IoStore chunk inside `pakchunk0-Windows.utoc`: `1680bae1ae38d5b900000008 ShaderCodeLibrary 307060 ../../../ConanSandbox/Content/ShaderArchive-Global-PCD3D_SM6-PCD3D_SM6.ushaderbytecode`; the bytecode is 3,081 `ShaderCode` chunks in the same container **[SRC: retoc list pakchunk0]**.
- The global shader **map** is a legacy pak file: `Engine/GlobalShaderCache-PCD3D_SM6.bin` (5,190,445 B) and `ConanSandbox/Content/ShaderTypeInfo-Global-PCD3D_SM6-PCD3D_SM6.stinfo` (140,412 B) in `pakchunk0-Windows.pak` (V11, Oodle, index not encrypted) **[SRC: repak info/list/get]**.
- Log: `Using IoDispatcher for shader code library Global. Total 11666 unique shaders` **[SRC: `Saved/Logs/ConanSandbox.log:1111`]**.

## 2. The key finding: the rasterizer is not a global shader

- `GlobalShaderCache-PCD3D_SM6.bin` names 1,542 shader types. It has `FVirtualShadowMapProjectionCS`, `…CompositePS`, `…CompositeTileVS`, and many `FNanite*` types, but **no `FMicropolyRasterizeCS` / `FHWRasterizeVS/PS`** **[SRC: string scan of the copied .bin]**.
- `NaniteRasterizer.usf` includes `NaniteRasterizationCommon.ush`, which includes `NaniteRasterizer.ush` and, when `NANITE_MATERIAL_INCLUDES` (default 1) is set, `/Engine/Generated/Material.ush` **[SRC: `F:/CEUE5Devkit/Engine/Shaders/Private/Nanite/NaniteRasterizationCommon.ush:8,15-21`]**.
- *[INF]* Since UE 5.1 (programmable raster), the Nanite raster shaders are **material shaders**, compiled into each material's shader map. Masked/WPO foliage (our leaflets) rasterizes in its own programmable bin, whose code lives in the `ShaderArchive-ConanSandbox_Chunk*` libraries. Replacing the global cache **cannot** change lines 143/157 for leaves.
- `FVirtualShadowMapProjectionCS` (VSM projection) **is** global, so the global-cache route applies to it **[SRC: same scan]**.

## 3. The kit can compile and cook global shaders

- Present: `ShaderCompileWorker.exe` + `ShaderFormatD3D`, `dxc.exe`/`dxil.dll` (`Binaries/ThirdParty/ShaderConductor/Win64`), `UnrealEditor-Cmd.exe`, `UnrealPak.exe`, full shader sources (`NaniteRasterizer.ush` 7,594 B, seven `VirtualShadowMapProjection*` files) **[SRC: `F:/CEUE5Devkit/Engine/...`]**.
- The kit's mod cook **already emits** a complete global set: `UE4/Saved/Mods/_Cooked/Windows/Engine/GlobalShaderCache-PCD3D_SM6.bin` (5,191,189 B), `ShaderArchive-Global-PCD3D_SM6-PCD3D_SM6.ushaderbytecode` (157,315,413 B, monolithic), `.stinfo` 140,436 B (2026-11-07 11:19) **[SRC: ls]**. The same 1,542 type names as the shipped map, but different bytes (+744 B, MD5 differs) **[SRC: diff in scratchpad]**. `kit-buildmod.py` drops this Global archive from mods **[SRC: `ConanExiles/_config/devkit/kit-buildmod.py:117`]**.
- Version gap: kit `5.8.2`, CL 378787 **[SRC: `UnrealEditor.version`]**; game `5.8.2-379176+++exiles+release` **[SRC: log:543]**. *[INF]* 389 CLs apart. If any global shader's parameter struct changed in between, a kit-built map can bind wrongly or fail. The +744 B may be that gap, or only cook settings.
- The kit has 68,801 `.uasset` (uncooked game content), so it can recook game materials **[SRC: find]**.

## 4. Loading order and override

- All `Content/Paks/*.pak` mount at PakPlatformFile init with `Order=3` (lines 4–~1100). The Global library opens at 15:01:33.034. Funcom's mod manager mounts `Mods/*.pak` from 15:01:36.710 with `Order=1000+` **[SRC: log:5-12, 1111, 1524-1529]**. So **a Mods/ pak comes too late to replace global shaders**. It does work for material shaders: each mod brings its own `ShaderArchive-<Mod>` **[SRC: kit-buildmod.py:117-123; log `FShaderPipelineCache … 'UIMod_Hosav'`]**.
- *[INF, UE source knowledge, not verified here]* A pak dropped into `Content/Paks` is mounted at init. A `_P` suffix raises its order above 3. For IoStore, a duplicate chunk ID (`ShaderCodeLibrary` IDs come from library name + format) resolves to the highest-order container. A legacy-pak file at the same path likewise resolves to the higher order. No `.sig` files suggests pak signing is off.
- *[INF]* The `.bin` map refers to shaders by hash, which the library must contain; a missing type is fatal (`Missing global shader …'s permutation 0, Please make sure cooking was successful` **[SRC: https://forums.unrealengine.com/t/…/2720773]**). Map, `.stinfo` and archive must ship together from one cook. Material shader maps do not reference global ones.

## 5. Precedents

- No public mod for a shipped UE5 game was found that replaces `GlobalShaderCache`/`ShaderArchive-Global`. UE5 "Lumen/VSM" mods are cvar/UE4SS presets (e.g. https://nexusmods.com/silenthillf/mods/23) **[SRC: web search, 2026-11-07]**.

## 6. Verdict and next step

**VSM projection (global):** feasible in principle, **unknown in practice**. The tools exist and the override path is plausible. Two things are unproven: `_P` priority for the Global library chunk, and the CL 378787 vs 379176 compatibility.
**Rasterizer lines 143/157 for leaves:** **not feasible through global shaders.** It is feasible only as a **material override mod**: recook the leaf master material(s) and their static-permutation instances in the kit, built against a modified `NaniteRasterizer.ush`, and ship them through `Mods/` with their own shader library. This is heavy but uses the same machinery as ordinary Conan mods *[INF]*.

**Concrete next step (the main session decides on writing into `Content/Paks`):**
1. Round-trip with no shader change. Take the kit's existing global trio (§3), pack the `.bin` + `.stinfo` into `pakchunk9000-Windows_P.pak` and the archive into a matching `_P` utoc/ucas with kit `UnrealPak`. Launch once and check the log for the Global library line, the container order and the absence of a `Missing global shader` fatal. Then remove it.
2. If it holds, make one visible edit in `VirtualShadowMapProjection.usf` (e.g. a tint) to prove the edit reaches the game.
3. In parallel, for leaves: find the palm-leaf master material in kit content and confirm it uses programmable raster (masked/WPO). That is the target for a material override mod.
