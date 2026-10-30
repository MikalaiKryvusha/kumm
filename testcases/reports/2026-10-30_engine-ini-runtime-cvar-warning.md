# Run report — the engine warns when a mod sets again at runtime a cvar the pack's Engine.ini sets

**Work.** The autonomous pool item of `STATUS.md` «Warn when a mod overrides `Engine.ini` at runtime» — its cheap first slice (mods' sources, no running game);
the new `Find-RuntimeCvarOverrides` / `Get-PackCvars` in `Deploy-ModPack.ps1`, called by `-Verify`; the fixture checks in `tools/fixture-pack.mjs`.

**Contour.** The engine at KUMM HEAD of 2026-10-30 16:33; the fixture pak pack in the OS temp; the real Conan pack `D:\work\ai_sandbox\ConanExiles` (78 manifest entries,
Engine.ini of the pack = `_unpacked/KrinikConanGraphics/Engine.ini`, 12 cvars); read-only (`-Verify`).

**Runs.**
- 16:3x `node tools/fixture-pack.mjs` on the OLD engine with the two new checks — the warning check FAILED (no such section), the control passed; «СТЕНД: 1 провал(ов)».
- 16:3x the same on the new engine — «стенд: все проверки прошли» (all old checks plus the two new).
- 16:3x `powershell -File Deploy-ModPack.ps1 -PackDir D:\work\ai_sandbox\ConanExiles -Verify` — «no mod source sets again any of the 12 cvars of the pack's Engine.ini»,
  «105 present, 0 missing», «Verify clean».
- 16:3x an independent `grep -rn` over the pack's Lua for console commands and `<prefix>.<cvar> <number>` — only `KrinikConanBench` sets `dw.DisableWeatherSystem`
  (not one of the 12) — agrees with the engine's «none».

**Checks.**
- Hygiene: PSParser 0 errors.
- Functional run: the real `-Verify` on the fixture pack and on the real Conan pack; read — the new section's lines, the summary, the grep.
- Fixture: a Lua line `ExecuteConsoleCommand("r.ViewDistanceScale 3")` against the pack's `r.ViewDistanceScale=2` → «[warn] Gamma Gear sets r.ViewDistanceScale=3 at runtime
  (ue4ss\Scripts\main.lua:3); the pack's Engine.ini sets 2» — pass; a cvar not in Engine.ini (`r.NotInPack`), a comment line, and the pack's own Engine.ini inside
  the mod's folder — no warning — pass. Real pack: none — pass (confirmed by the grep).

**Found.** none in the real pack. Gaps of this slice (not defects): only `source.folder` mods are scanned (archives and Workshop paks are not unpacked
for this); cvars set by a mod's blueprint bytecode or by the game itself are not seen.

**Traces.** Command output in the chat transcript of session 5db69748.

**Verdict.** pass.
