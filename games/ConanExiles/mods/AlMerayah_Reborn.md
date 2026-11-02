# Mod notes — Al-Merayah Reborn (another author's — Xevyr)

> **Created:** 2026-11-02 · **Parent:** plan 40.3 I6.3 (its page in the Xevyr hub); facts from `researches/conan-mod-settings-hub/xevyr-settings-recon.md` §5
> **Status:** living notes — the ONE place for this mod's internals
> **Outbound:** —

**What it is.** The Al-Merayah fortress siege (or the old ruins when off): waves of defenders with their respawn timers, counter-attacks, a boss hall with gold
piles, Musashi's katana, explosive pots and battering rams to loot. Pak `AlMerayah_Reborn.pak`.

## Settings — where each value lives

No `.sav`: the values are fields of the mod controller actor `AMR_MC_AlmerayahReborn_C` (defaults on its CDO; a `PersistenceComponent` → the world database
[inferred]). The author's window `AMR_UI_AdminSettings_C` (module `AMR_Settings`) reads them at `Construct`; «ОК» → the player controller's component
`AMR_AC_PlayerCont_C.ServerSaveSettings(Enabled, NoFatality, corpseC, FieldCD, ArcherCD, BattlementCD, BaileyCD, CounterCD, CounterSize, spawnKatana,
spawnExplosives, spawnBatteringRam, maxGoldPerPile)` — a server RPC (Net + NetReliable + NetServer).

| Row (our hub) | Controller field | Range | Default |
|---|---|---|---|
| Включено | `isFortActive` (replicated, `OnRep_isFortActive`) | — | true |
| Уборка трупов | `corpseCleanup` | — | true |
| Без добиваний | `disableFatalities` | — | true |
| Легендарная катана · Взрывчатка · Таран | `spawnKatana` · `spawnExplosives` · `spawnBatteringRam` (read live 2026-11-02) | — | true |
| Золота в куче, не больше | `maxGoldPerPile` (int) | 10–10000, step 10 | 3000 |
| Возрождение: поле боя · лучники · стены · двор цитадели | `FieldRespawnCD` · `ArcherRespawnCD` · `BattlementRespawnCD` · `BaileyRespawnCD` | 5–600 s, step 0.5 | 30 · 30 · 20 · 20 |
| Перерыв между контратаками | `CounterAttackCD` | 5–600 s | 25 |
| Размер отряда контратаки | `CounterAttackSize` (int) | 1–10 | 3 |

«Bailey» is the inner courtyard of the Keep by the author's own tooltip — our label «двор цитадели» (`locres-fixes-2026-11-01.tsv`).

## Our use

- The Xevyr hub page `amr` (`KrinikConanUI` `krinik_mod_settings.lua`, `AUTHORS.amr`): reads the controller; writes by `ServerSaveSettings` in the order above.
  Case X6 of `testcases/TC_conan_hub_rows_audit_2026-11-01.md` read the controller back: the argument order above is right (battlement 40 → `BattlementRespawnCD`,
  `BaileyRespawnCD` unchanged; 2026-11-02 07:53).

## Open

- Who may open the «AdminSettings» window on a dedicated server — not read.
