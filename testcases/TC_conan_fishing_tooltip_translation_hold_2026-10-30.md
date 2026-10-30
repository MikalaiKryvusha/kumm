# TC — fishing panel tooltips: no flicker, profile-slot hover in Russian; «(удерж.)» in the game's hold prompts

> **Created:** 2026-10-30 · **Parent:** plan 36 W17, W18, W10a; owner's words 2026-10-30 (W17 «по хочеру поп-апы … такой же баг мерцания», W18
> «остались непереведённые строки», W10a «длинное (удерживайте) можно и нужно сократить до (удерж.)»)
> **Status:** run 2026-10-30 08:40–09:10 — report `testcases/reports/2026-10-30_conan-fishing-tooltip-translation.md`
> **Outbound:** —

**Basis.** The fishing tooltip `W_EFT_Tooltip.Txt_Tip` had `AutoWrapText` True inside a SizeBox (max 380) — wrap at the previous frame's width; fix
`AutoWrapText` False + `WrapTextAt` 380 (pack `3fd2ccd`, built 08:4x: 1 chunk of 754 differs). Five profile-slot tips (UTF-16 source) added to
`Game.locres` (54441 → 54446, regress: lost 0, changed 0); the vanilla hold suffix → «(удерж.)» (4 keys, `vanilla-overrides-ru.tsv`).

**Stand.** The owner's save, 4K full screen, the game in front (owner's word 2026-10-29); the machine lock taken 08:34. After launch — a frame of the
main menu by eye BEFORE any automation (EXP-0375); then `enter-world-remote.sh`; the hub by a real Tab on «Снаряжение», the fishing panel by a real
click on «Настройка рыбалки». Hover — the real cursor (`hover-watch.ps1` / `input.ps1 -Move`), frames ≈45/s, the rectangle by `tooltip-bbox.py`.
Techniques: state transitions (no tooltip → tooltip → settled), partitions (short tip, long tip, a profile slot), control case (auto-wrap back on by
the remote on the class template — the flicker must return).

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| S1 | Smoke | launch; frame of the main menu | no «Incompatible Mods Detected»; the menu as usual | pass — menu frames 08:41, 08:51, 09:07, no «Incompatible Mods» |
| S2 | World | `enter-world-remote.sh`; `ConanSandbox.log` / `UE4SS.log` read once | in the world; no mount error for JaarFishing, no new Lua errors | pass on the final build (world 22 s); the 08:41 build CRASHED at mod load — the addprop pak, removed |
| T1 | Short tip | hover «Холод» (biome) three times | «Где рыбачит пробный рыбак.»; first rectangle = settled on 3 of 3 | pass — 490×80 from the first frame, 3 of 3 re-opens (0.13.0) |
| T2 | Long tip | hover the difficulty slider (the longest tip) three times | wraps within ≈380 units from the first frame; first = settled on 3 of 3 | partial — 844×215 settled; in 1 of 3 the first frame has the background one line tall under 4 lines of text (≈22 ms) |
| T3 | Profile slot | hover a profile slot | «Ячейка набора: нажмите, чтобы выбрать её. Точкой (•) отмечен набор, который сейчас действует на сервере.» | pass — «Ячейка набора: нажмите, чтобы выбрать её. Точкой (•) отмечен набор, который сейчас действует на сервере.» |
| T4 | Control | remote: `Txt_Tip` AutoWrapText True on the class template; repeat T2 | first ≠ settled on ≥ 1 of 3 (the flicker is back) — then restored False | pass — the jump before the fix: 553×96 → 457×125 (first hover; and after re-opens with the template reset) |
| H1 | Hold suffix | quick-loot window over a corpse or a container | «Забрать все (удерж.)» | not walked — no corpse/container at the stand; 4 entries in the deployed Game.locres |
