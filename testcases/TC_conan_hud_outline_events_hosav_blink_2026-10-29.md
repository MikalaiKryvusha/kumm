# TC — HUD outline on the HUD-creation event; Hosav blink ×4 slower (plan 34 / W16; plan 36)

> **Created:** 2026-10-29 · **Parent:** plan 34 (`[OWNER]` «да, но аккуратно. чтобы не сломать... нужно будет ретестировать после рефакторинга их») ·
> `[OWNER]` «мерчание голода и перегрузки и жады в Худ ещё в 2 раза медленнее» (2026-10-29)
> **Status:** run 2026-10-29 11:55–11:58 — pass (O1–O3, B1); B2 (the blink by eye) — the owner's eye
> **Outbound:** —

**Basis.** `KrinikHudOutline` searched the HUD by `FindFirstOf` every 2 s (3 ms); now `NotifyOnNewObject(/Game/Mods/UIMod_Hosav/W_NewHealthUI.W_NewHealthUI_C)`,
passes at 0.5 s and 5 s. Hosav blink: `PlayAnimation` speed 0.5 → 0.25 (`asset-strings/UIMod_Hosav__W_SmoothHP.tsv`, pak rebuilt by its recipe).

**Stand.** The owner's save, the beach, 4K, fresh launch and one re-entry by the agent (Esc + `CloseAndReturnToMainMenu`).

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| O1 | Outline on world entry by the event | launch, enter, `UE4SS.log` | «новый HUD: …», «поставлено 51 полям» | pass 11:56:22 — 51 fields, F1 label, second pass «уже стояло у 51» |
| O2 | Outline after re-entry (new HUD object) | re-enter, log | a NEW HUD name, 51 fields again | pass 11:57:02 — `W_NewHealthUI_C_2147432817` (was `…58920`), 51 fields |
| O3 | Outline seen | frame of the HUD | bold outlined text as before | pass 11:57 — frame: Roboto Bold with the dark outline |
| B1 | Blink speed in the loaded asset | extract `W_SmoothHP` from `ExtractedMods`, `kismet-trace` | `PlayAnimation` speed 0.25 in `Progress_Food`, `Progress_Drink`, `Get_WeightText` | pass 11:57 — 0.25 in all three |
| B2 | Blink by eye | hunger/thirst at 0 %, a clip | twice slower than 28.10 | not run by the agent — the owner's eye (taste) |
