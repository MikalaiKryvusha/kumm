# Register — judged overlaps between the mods of a build

> **Created:** 2026-11-06 · moved out of `GUIDE.md` the same day: the guide is gated by a read hook, and every register line made it «changed after reading»
> **Parent:** `researches/mod-reconciliation/GUIDE.md` (the method, step 6 «Record»)
> **Status:** living register — one line per judged overlap
> **Outbound:** outcome C lines → the owner's choice (recorded in the line)

| Game · kind · what | Sides (wins last) | Outcome | Resolution | Date |
|---|---|---|---|---|
| Conan · table · `Items/ItemTable` 51420 «Grey One Mask» | SevereWeatherEnhanced → Mines_of_Set | **C** (`row-diff.py`, 2026-11-06 09:43 +03:00): Severe Weather makes the vanilla mask a SANDSTORM BREATHER (`ItemClass` `BPGameItemArmor_C` → `BP_SandstormBreather_C` — the game's own class `/Game/Items/Sandstorm/`, armour 35 → 38, modifier «Light» → «Light Armor», its own `Icon` with `IconLayers` emptied, tags cut to `Item.Armor`, `RepairXP` 2000 → 12665); Mines of Set re-declares the vanilla mask (`ShortDesc` «Grey One» → «Grey Ones», `RepairXP` → 3710). Mines of Set loads later → **the breather function of this mask was LOST in the build**. Both turn `<LoreItalics>` into `<span style="italic">` (identical). Same field, different values: `RepairXP`, `IconLayers` | merge: Severe Weather's breather fields (`copyprop:` ×6 in Mines of Set's map) + Mines of Set's texts; `RepairXP` 3 710 — `[OWNER]` 2026-11-06 09:55 «Предлагаю 3 710» (the field is the XP for REPAIRING the item — Funcom's «Item Table Primer») | 2026-11-06 |
