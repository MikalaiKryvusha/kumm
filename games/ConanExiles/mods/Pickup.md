# Mod notes — Pickup+ (Steam 864199675): pick a placed item back up instead of breaking it

> **Created:** 2026-11-14 · the knowledge-hook's demand before the first work on the mod (the 3.1.0 admin-widget error) · **Parent:** `modpack.json` entry
> «Pickup+» (pak, `_workshop/864199675`), `ConanExiles/docs/08-мастерская-steam.md` §1, `docs/16` (the owner's «да» of 2026-10-25)
> **Status:** 🟢 in the build since 2026-10-25 (a quality-of-life mod, the owner's agreement — `docs/16`) · **Outbound:** —

## What it does

Picks any placed object back up into the inventory instead of demolishing it. The quick-pickup key works only after an `ActionMappings=(ActionName="QuickPickup",…)`
line is added to `Input.ini` (then it shows in the controls). Thrall / pet pickup is off by default and should stay off (it resets their stats). The author warns
against playing with admin rights (an admin picks up things that must not be picked up). The most subscribed Conan mod (446–448 thousand), marked Enhanced.

## Assets and functions

- One pak `Pickup+.pak` (1 365 064 bytes in the 3.1.0 `Mods` folder, 2026-11-14) — a kit-1002 mod; it ships no vanilla asset except the empty service map
  `Dev/AlmostEmpty` (three other mods ship it too — harmless, `docs/12`).
- UI module rows: `Pickup+_Settings` opens its settings window by a bare `ActivateModule` (game map, «The mods' UI modules, live list»).
- `/Game/Mods/Pickup+/Widgets/Pickup+_Widget_AdminSettings` — the admin settings widget. **On 3.1.0** the game log at every start:
  `LogStreaming: Error: CreateExport: … Pickup+_Widget_AdminSettings … Could not find class object ( - '') for ComboBox_SpawnThrallNaked` and the same for
  `ComboBox_DrawDebugline` — two combo boxes whose class import no longer resolves (new on 3.1.0, `researches/conan_patch_3_1_0/README.md` row «not in §3»).

**The cause (recon 2026-11-14 17:2x):** both combo boxes are instances of the game's `/Game/UI/Framework/W_FCComboBoxString` — present in 3.0.1 (package id
`E74E07CCEC0447E7`), **removed by the 3.1.0 patch** (no `*ComboBox*` widget left under `/Game/UI/Framework/`; only `T_ComboBoxArrow` remains). The widget's
other imports (`Kelson_Sans_Regular` / `_Bold`, `T_PopUpBg`, `W_FullScreenEffectContainer`, the mod's own `Pickup+_ActorComponent`) exist in 3.1.0. Read from
the zen header (`UnrealPak … -Extract -Filter=*/Pickup+_Widget_AdminSettings.*` → `.uheader`) and the 3.1.0 / 3.0.1 package indexes (`researches/ue5-iostore-index/package-ids.py`).
What it costs: the widget's functions (`Construct`, «Save & Exit», «Cancel») all enter the ubergraph, which calls `GetSelectedOption` on the two missing combo
boxes — the admin options «DrawDebug?» and «NakedThrall» cannot be shown or changed (the reads return an empty string); the remote-pickup distance and the
rest of the window are unaffected. Not seen in game yet: the admin window behind the hub carousel in the 17:26 run.
TWINS: searched the game logs of today's three starts for `Could not find class object` — found only these two exports of Pickup+; a mod widget loads when
it opens, so a window not opened in those runs is not covered (a full sweep needs every mod's `.uheader`, `UnrealPak … -Extract`).
Fix ways: (1) the author's update for 3.1.0 (check with plan 53 step 12, `check-mod-updates.py`); (2) a compatibility copy of the 3.0.1 `W_FCComboBoxString`
in our pak (risky: its own dependencies, and a clash if Funcom brings the path back) — not taken; the two options are admin-only and niche.

## Our edits

None.

## How to look inside

`python -I -X utf8 ConanExiles/_config/devkit/patch-mod-asset.py extract "Pickup+" "Pickup+_Widget_AdminSettings" <work>` → legacy asset + JSON (imports,
exports); the hook `mod-reconciliation-gate` wants `researches/mod-reconciliation/GUIDE.md` read within the hour first.

## Open

- The two combo boxes of the admin widget: the class is known (above); a look at the admin window in game, and the author's update (plan 53 step 12).
