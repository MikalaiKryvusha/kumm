# Test cases — Conan: Krinik mods on top of the Esc-menu mod list (plan 36 W11)

> **Created:** 2026-10-30 · **Parent:** plan 36 W11, interview 027 → A (`[OWNER]` «это только отображение, не ордер загрузки, наши моды вверху
> для красоты» · 2026-10-30 21:08)
> **Status:** written 2026-10-30 23:42 +03:00, before the run · run 23:42–23:46: L1 L2 L3 pass
> **Outbound:** the owner's eye on the list at a real Esc

**Basis.** The owner's answer above; the remote probe 23:4x: `SML_UI_ModList_C.ModListBox` (MultiLineEditableTextBox) holds the shown text, set
once; `modlistText` is not bound. The fix: `krinik_pause_in_menu.lua` 0.15.0 — on `ActivateModule(SML_ModList | IngameMenu, true)` + 100 ms, move the
lines starting «Krinik» to the top of `ModListBox`.

**Stand.** Background launch, world entry by `enter-world-remote.sh`, the Esc menu by `ActivateModule(FName('IngameMenu'), true, false)` (a real Esc
needs focus — the remote path is the background twin); frame `capture-window.ps1`; the UE4SS log.

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| L1 | Order | open the Esc menu, frame + log | lines 1–3: KrinikConanArchery, KrinikConanUI, KrinikConanGameplay; then More Katanas… in load order; «Всего модов: 66» unchanged; the log line «список модов: Криник наверху (3 из 66 строк), N мс» | **pass** 23:44: frame — the three Krinik lines on top, then More Katanas…; «Всего модов: 66»; log «Криник наверху (3 из 66 строк), 3.00 мс» (once, at opening) |
| L2 | Idempotent | close and open the Esc menu again | the same order, no second log line (already on top) | **pass**: the log line count stays 1 after close + reopen |
| L3 | Load order untouched | `modlist.txt` | Krinik paks still last | **pass**: the last three lines are KrinikConanArchery / KrinikConanUI / KrinikConanGameplay |

Not covered: a real Esc press (needs focus — the owner's eye); the remote opened `IngameMenu`, the real Esc brings `SML_ModList` (the same hook branch).
