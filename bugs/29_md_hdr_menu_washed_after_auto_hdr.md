# Bug 29 — Medieval Dynasty: menu turns washed-out once the Windows Auto HDR toast closes

**Status:** 🔴 OPEN · **Severity:** S2 (the owner's picture is worse than promised; an agent's «fixed» stood on a wrong proxy)
**Version/build:** Medieval Dynasty 2.7.0.3 (UE 4.27, DX12), UE4SS 1161, pack `MedievalDynasty` (`tools/hdr.py on` since
2026-10-08 00:59) · **When/context:** 2026-10-08 ≈09:20, the owner's report right after the meta-plan discussion

## Symptom

`[OWNER]` «Когда игра только-только запустилась - отображается оверлей Нвидиа и нотификация Windows о том, что примеенён
авто HDR к игре. Как только нотификация Виндовс закрывается - меню становится тусклым, высветшим, пересвеченым!» ·
2026-10-08 ≈09:20. Expected: the menu looks as good as in the first seconds (or better).

## Repro

Config as set by `python -I tools/hdr.py on` (`bUseHDRDisplayOutput=True`, `HDRDisplayOutputNits=1000`, `r.AllowHDR=1`);
launch `Medieval_Dynasty.exe`; watch the main menu for ~30 s. Cases: `testcases/TC_md_hdr_washed_menu_2026-10-08.md`.

## Forensics

- Last night's acceptance measured only the PEAK (`hdr-stats.py`: p99 266 → 798 nit) and read «brighter» as «fixed».
  «Washed-out» is a raised black level / flat contrast — invisible to a peak metric. Wrong proxy (class of EXP-0176).

- 09:30 run H1 (game HDR on, Auto HDR on, window in front from t+3 s): t+4–6 black (mode switch); t+7…t+44 the desktop
  capture is ONE constant signal — p5 0.1, p50 5, p99 798 nit; the Auto HDR toast is on frame t+7. **The DDA capture does
  not show the wash.** It sees the DWM composition; when the toast closes, a fullscreen game goes to direct (independent)
  flip and bypasses that composition — so what changes on the TV is downstream of anything we can grab.
- Game log: `LogD3D12RHI: Found a custom swapchain provider: 'FXeFGDXGISwapChainProvider'` (Intel XeSS FG plugin, libxess_fg
  1.3.1.78) wraps the swap chain; `FullscreenMode=0` (exclusive). Windows shows «Auto HDR on» = it treats the game's swap
  chain as SDR although UE logs «Setting HDR meta data … DisplayGamut 2».
- Web: Steam thread on Medieval Dynasty — washed-out grey with Windows 11 Auto HDR; «disabling Windows Auto HDR was the only
  solution that worked» for some (steamcommunity.com/app/1129580/discussions/7/4361248648376422860).
- 09:34 run H5 (Auto HDR OFF for this exe only — `HKCU\Software\Microsoft\DirectX\UserGpuPreferences`, value for
  `D:\Games\Medieval Dynasty (2021)\…\Medieval_Dynasty-Win64-Shipping.exe` `AutoHDREnable=2097;` → `2096;`, original
  recorded here for rollback): no toast; peak 360 nit instead of 798 → last night's «798» was Auto HDR stacked on the game.
  The owner's eye on the TV decides whether the wash is gone.

## Hypotheses (ranked, not yet observed)

1. **Two HDR paths in sequence.** The swap chain starts SDR → Windows applies Auto HDR (toast). Then UE reads
   `bUseHDRDisplayOutput` and switches to its own HDR10 output; Auto HDR steps aside; UE4's native HDR (ACES ST2084,
   UI composited at its own level) gives the grey look. Predicts: series frames before/after the switch differ in p5 and p99/p5.
2. NVIDIA RTX HDR (the overlay at start) also acts on the SDR phase — a third mapper. Predicts: same as 1; tell apart only by
   toggling it (owner's NVIDIA app).

## Fix plan

Measure H1 (current) vs H3 (game HDR off → SDR + Auto HDR all the time). If H3 holds the good early look — `hdr.py off` is the
fix candidate, shown to the owner for his eye (taste class). Otherwise tune UE HDR (`r.HDR.Display.OutputDevice`,
`r.HDR.UI.Level`, `HDRDisplayOutputNits`) by series numbers, then the owner's eye.

## Decisions made without the owner

Filled at closing.

## Links

`testcases/reports/2026-10-08_md-hdr-intro-faststart-probe.md` (last night's HDR run) · `plans/16` step 0.6 · EXP-0176.
