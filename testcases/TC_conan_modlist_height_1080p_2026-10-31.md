# Test cases — Conan: the Esc-menu mod list does not cover the vanilla menu lines at 1080p (bugs/64 item 8, reopened)

> **Created:** 2026-10-31 · **Parent:** `bugs/64_conan_mod_ui_wave_overlaps_untranslated.md` item 8; plan 35 release gate (1080p / 2K / 4K)
> **Status:** written 2026-10-31 08:28 +03:00, before the run
> **Outbound:** the 2K and 4K frames — the release gate

**Basis.** The 07:53 frame at 1080p: the «ID модов» box (≈ 862–924 of 1080) over «Играть без подключения» (from ≈ 882). Fix: Simple Modlist
`SizeBox_2/MaxDesiredHeight` 620 → 540 (KRINIK MODIFIED, `SimpleModlist__SML_UI_ModList.tsv`), the box 80 units higher.

**Stand.** Game 1920×1080 over the stream, background launch, the oasis save, world by the remote, real Esc (`esc-when-idle.ps1`), a window frame.

| # | Case | Expected | Status | Observation |
|---|---|---|---|---|
| H1 | Esc menu at 1080p | the «ID модов» box ends above «Играть без подключения» with a visible gap; the list still shows ≥ 20 lines and scrolls | pass | 08:30 frame (1600-wide): the ID box ends ≈ 697, «Играть Без Подключения» starts ≈ 737 — a clear gap; 20 lines shown, the scroll bar present; review folder 23 |
| H2 | nothing else moved | «Список модов», Krinik on top, the right column, our logo and the plate — as in the 08:05 frame | pass | same frame: title, «Всего модов: 66», Krinik three on top, the right column, our logo and «ОТЗЫВ» unchanged against 07:53 |
