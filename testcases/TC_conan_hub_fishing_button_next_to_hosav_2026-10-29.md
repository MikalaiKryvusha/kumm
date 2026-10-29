# TC — «Настройка рыбалки» next to «Настройки интерфейса», in its style, on the bar line (plan 36 item 7, plan 35 Б7)

> **Created:** 2026-10-29 · **Parent:** plan 36 item 7 (W9); `[OWNER]` «кнопку настройка интнрфейса поравнять в нижнем баре. в её стиль и рядом поставить
> Настройка рыбалки» · 2026-10-26; «кнопку рыбалки делаем» · 2026-10-29 22:0x
> **Status:** run 2026-10-29 22:37–22:4x on `KrinikPauseGameInMenu` 0.10.0 — R1–R5 pass, R6 FAIL (no hover glow on the fishing button); waits for the owner's eye
> **Outbound:** —

**Basis.** Hosav's «Настройки интерфейса» is a vanilla `WBP_ButtonBase` in Hosav's own viewport widget (click → its BP handler → `ActivateModule('HosavUIsettings')`);
Exiles Fishing's «Настройка рыбалки» is a plain button (`W_EFT_AdminButton`: click → `CustomEvent` → `ActivateModule('ExilesFishingTuning')`) put into the bar's
right container by `BPC_EFT_Tuning.Graft`. Plan: both into the bar's left container in a row; the fishing one is the `WBP_ButtonBase` of a second Hosav widget
instance (same look and hover), its click caught by a post-hook on the Hosav BP handler and turned into the fishing panel; the original fishing button collapsed.

**Stand.** The owner's save, the hero in the world, 4K; the hub opened by the remote on «Снаряжение»; the game in front for clicks and frames (the owner's word
2026-10-29 22:1x: «комп твой … Игру в форграунд выводи при тестах»); every remote UI edit in ONE call with `IsModuleActive` + `IsValid` checks (EXP-0372).
Techniques: state transitions (hub open on «Снаряжение» / another tab / back / closed and reopened), use case (click each button), error guessing (tab switch
while the buttons are moved, hub closed).

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| R1 | Row | open the hub on «Снаряжение» | «Настройки интерфейса» and «Настройка рыбалки» side by side at the left of the bottom bar, the same look, on the line of «Закрыть»; no plain fishing plate on the right | pass 22:37 (frame `r8_bar.webp`): both frames 40…88 of the strip, same size (fishing scaled ×1.094 like Hosav's layer), gap 15 units; NOTE the plan changed — Hosav stays in its own layer (moved into the bar it stopped clicking), the fishing button goes into the bar's left container right after it |
| R2 | Interface click | real click on «Настройки интерфейса» | Hosav's settings window opens (as before) | pass 22:38: «модуль HosavUIsettings: открыт» |
| R3 | Fishing click | real click on «Настройка рыбалки» | the fishing panel opens; Hosav's window does NOT open or flash | pass 22:39: «модуль ExilesFishingTuning: открыт», no Hosav module line |
| R4 | Other tabs | «Таланты» and back, three times | the two buttons only on «Снаряжение»; no jump, no crash | pass: row re-placed on every return (7 log lines over the cycles), no errors |
| R5 | Close and reopen | close the hub, reopen it 3 times | the row is back each time; no duplicates; no crash | pass: hub closed by a real Esc and reopened, one live fishing button, frame `r9_bar.webp` |
| R6 | Hover | the cursor over each button | both light up the same way | FAIL 22:3x: Hosav's frame turns gold on hover, the fishing look does not (it is HitTestInvisible inside the mod's own button; the hover goes to the mod's button) — `hover_cmp.webp` |
