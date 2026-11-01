# Plan 41 · phase 6 — enemy health bars over the mobs (row 12) and the EAA class cards with English painted into textures (row 23)

> **Created:** 2026-11-01 · **Parent:** `plans/41_EPIC_conan_1.0.0_defects_and_stability.md` phase 6; bug 64 rows 12 and 23; `[OWNER]` 2026-10-26 «нужно выше» (the bars)
> **Status:** written 2026-11-01 13:30 +03:00; not started
> **Outbound:** the fork texture vs overlay for row 23 → `interviews/` with frames of both

## Goal vector (Achieve)

Two world/menu defects the player meets: health bars above mobs sit over the mob's body and hide it (row 12 — the owning mod not even identified), and the
EAA class menu shows English class names and descriptions painted into the card textures (row 23 — «Iron Warden… An oath-bound defender…»), which no
`.locres` reaches. Where we want to be: the bar floats above the head at any distance; every class card reads Russian.

## Acceptance criteria

1. **Whose bar.** Situation: a hostile mob spawned 5 m ahead, frozen. Action: the remote reads the widget component over it. Result: the owning mod and widget
   class named (Hosav `W_EnemyHealthbar*`, SudoExile `TotNameplate` are the candidates). Check: `dump` output in the case; the class's container by `retoc list`.
2. **Bar above the head.** Situation: the same mob, then a large one (a spawned rhino / bear) and a humanoid, at 3, 8 and 15 m. Action: frames. Result: the bar's
   bottom edge above the head on every frame, the body uncovered. Check: frames at 4K; the bar's screen rect vs the head bone's projected point
   (`ProjectWorldLocationToScreen` of the head socket by the remote).
3. **Cards Russian.** Situation: the EAA class menu open. Action: frame of every card page. Result: names and descriptions Russian, readable, in the card's
   style, no English trace behind them. Check: frames at 4K and 1080p.
4. **No side effects.** Bars of tamed thralls / bosses keep their place logic; the class menu still selects a class. Check: a thrall frame; a class selected
   and read back.

## Stand (house rule 11)

- Machine lock; launch by the owner's last path; `enter-world-remote.sh`; `god-on.sh`; `exec MakeMeAdmin`; `tp_ground.sh` to a flat clear spot.
- Mobs: `arrow-stand.sh summon / place <m> / freeze` (the Kappa stand of 2026-10-31); a large creature and a humanoid — `exec SpawnNPC <row>` (rows — recon
  from the game map); peaceful / frozen so they do not hit the hero (rule 11.6).
- EAA class menu: its item / station spawned (recon in step 3).

## Steps

- [ ] 1. **RECON — row 12.** The remote: the widget components on the spawned mob (`dump WidgetComponent` on that actor only — NOT `FindAllOf('WidgetComponent')`,
      which the pult guard refuses and which crashed before); the owning mod; does the mod have its own setting for the bar height (rule 8 step 0 — its
      settings window, `*_DT_SettingsAPI`)? Mod notes `games/ConanExiles/mods/<Mod>.md` (`UIMod_Hosav.md` exists; others — write first).
- [ ] 2. **FIX row 12** — the mod's own setting default in our shipment, else the asset: the widget component's relative location Z / the screen-space offset /
      the head-socket attach in the mod's blueprint (`patch-mod-asset.py extract` → `prop:` / `dbl:` rows, TSV `<Mod>__<Asset>.tsv`); a distance-scaled offset
      only if the asset already has one.
- [ ] 3. **RECON — row 23.** The card textures: `retoc-5.8 list --path` of the EAA containers, grep `T_*Class*` / `Card`; the card widget (which Image brushes,
      any TextBlock already on the card). Tool for UE 5.8 IoStore textures: recon — does `retoc to-legacy` + UAssetGUI export / import a Texture2D (BC7/DXT)
      for 5.8? search `D:/work/ai_sandbox/_tools` and the web (`WebSearch "UE5 texture2d import uasset retoc"`); EXP check first (`/experience` recall «texture»).
- [ ] 4. **Decide row 23** — `FORK: options <A: re-paint the textures with Russian (tool from step 3, our font matching the card's) | B: native overlay — a
      dark plate over the painted text + Russian TextBlocks in the card widget asset | C: both names Russian via B, descriptions via a tooltip> · price of error
      <A: a wrong format crashes the menu or blurs the art, needs a texture round-trip tool; B: the English may show around the plate's edges; text styling
      must match> · consulted <step 3 findings>` — frames of A and B mock-ups (house rule 23: each marked «нет механики — предложение» until built) to the owner.
- [ ] 5. **FIX row 23** by the owner's choice; translations of the eight-or-so class names / descriptions written into the source table (`dm-fish-ru.tsv`
      rows or the asset-strings TSV) per `KUMM/researches/russian-writing/RUSSIAN_RULES.md` (hook russian-gate).
- [ ] 6. **Case file** `testcases/TC_conan_enemy_bars_eaa_cards_<date>.md` — criteria 1–4, stand first.
- [ ] 7. **TEST IN THE LIVE GAME** — one session after the rebuild; frames at the three distances; card pages at 4K and 1080p.
- [ ] 8. **PACKAGING** — paks into `ConanExiles/_krinik-modified/<id>`; `modpack.json` `krinikModified` notes (EAA — new or extended; the bar's mod); `rebuild-krinik-paks.py
      --only "<Mod>" --install`; `.\Deploy-ModPack.ps1 -Deploy -Only "<Mod>" -PackDir D:\work\ai_sandbox\ConanExiles`; `-Verify`.
- [ ] 9. **Run report** `testcases/reports/<date>_conan-enemy-bars-eaa-cards.md`; review folder «НА ОТСМОТР НИКОЛАЕМ/<N> полоски врагов и карточки EAA/»; same commit:
      bug 64 rows 12 and 23, the mod notes, plan 39 C.

## Risks

- (a) The bar may be placed at run time by code (as the minimap was, row 19) — then the constant is in bytecode (`dbl:` / `flt:`), found by `kismet-trace.py`.
- (a) No texture round-trip tool for 5.8 — route B is the fallback; the owner chooses.
- (b) A big creature's head is far above its capsule — check all three body types, not one.

## Decisions made without the owner

(filled at the phase's close)
