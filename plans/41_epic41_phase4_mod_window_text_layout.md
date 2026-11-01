# Plan 41 · phase 4 — mod window text and layout: the minimap marker tutorial, wide Russian in fixed buttons, the EAA tooltip, the Damage Meter shkala

> **Created:** 2026-11-01 · **Parent:** `plans/41_EPIC_conan_1.0.0_defects_and_stability.md` phase 4; bug 64 rows 4, 13 (part), 18, 21 + the finds of phase 2;
> `[OWNER]` 2026-10-26 «беда с нашими текстами · нужно учить кнопки расширяться а текста переноситься» · «поп-ап подсказка не в стиле игры - нужно в стиле игры сделать»
> **Status:** written 2026-11-01 13:30 +03:00; not started; the scope is corrected by phase 1 (rows already fixed drop out)
> **Outbound:** the owner's eye on the EAA tooltip style (taste); frames in a review folder

## Goal vector (Achieve)

Our Russian is longer than the authors' English and several mod windows still show it cut, overlapping or late: the minimap marker tutorial (bullet lines
late, black slide area), buttons sized for English in EAA / EoT menus (98 candidates in `ConanExiles/_config/compat/ui-overflow-candidates.tsv`), the EAA
menu button tooltip drawn as a plain grey UMG box, the Damage Meter opacity shkala running under «Масштаб». Where we want to be: every mod window of the
build reads whole, nothing overlaps, the tooltip looks like the game's — each seen on a frame of the same window.

## Acceptance criteria

1. **Marker tutorial (row 4).** Situation: the minimap marker tutorial opened (`SM_MarkerTutorial`). Action: burst from the open. Result: the bullet lines
   arrive with the page (or the author's fade is ≤ 0.5 s and the same as without our build — A-B against the original pak); the slide area shows its picture,
   not black. Check: `capture-burst.ps1 -Count 30 -IntervalMs 100` sheet; A-B frame with the original pak from `_patch-originals/`.
2. **Wide Russian (row 13).** Situation: each window holding a candidate of the TSV. Action: open it, frame at 4K and 1080p. Result: every label inside its
   button, wrapping or the button growing — no cut. Check: the candidate list annotated per row (fits / fixed / not reachable + why); frames.
3. **EAA tooltip (row 18).** Situation: the inventory, the EAA menu button. Action: hover. Result: the tooltip is the game's own tooltip widget (its frame,
   font, colours), not a grey UMG box. Check: `hover-watch.ps1 -At <fx/fy> -Dir <dir>` frame beside a vanilla hub button's tooltip.
4. **Damage Meter shkala (row 21).** Situation: `DN_UI_Settings` open. Action: frame at 4K and 1080p. Result: the opacity shkala ends left of «Масштаб» with a
   visible gap; «Непрозрачность» and «Масштаб» at the window's own font size. Check: frames; pixel gap measured on the 4K frame.
5. **No regressions.** Situation: every changed window. Result: its controls still work (one value changed and read back). Check: remote read-back per window.

## Stand (house rule 11)

- Machine lock; launch by the owner's last path; `enter-world-remote.sh`; `god-on.sh`; `exec MakeMeAdmin`; items the EAA / EoT menus need — spawned
  (`exec SpawnItem`); windows by `walk-mod-windows.sh <dir> <module>…` (only modules that opened safely before) or the player's entry from phase 2.
- 1080p frames: `r.SetRes 1920x1080f` by the remote, `deploy-config.py GameUserSettings.ini` after exit to restore the owner's resolution.

## Steps

- [ ] 1. **RECON — scope.** Take the rows phase 1 left open; add the phase 2 finds. Mod notes read first: `Simple_Minimap.md`, `DamageNumber.md`; notes for EAA
      and Era of Trials do not exist — write `games/ConanExiles/mods/EAA.md` and `EraOfTrials.md` before editing their paks.
- [ ] 2. **RECON — row 4.** `patch-mod-asset.py extract Simple_Minimap <tutorial widget> <work>` (the widget name — recon: `retoc-5.8 list --path` grep
      `Tutorial`); `kismet-trace.py` on `FadeInList` — the delay constant and the slide image binding; A-B with the original pak (`_patch-originals/`) to know
      whether the black area is ours (a texture lost in our rebuild) or the author's.
- [ ] 3. **RECON — row 13.** Re-run the overflow sweep over the current build (bug 64 «Process diagnosis» remedy 2: pult script over visible text/button widgets —
      desired width vs slot) for each reachable window; reduce the TSV to the rows that still overflow. The fix per class: `AutoWrapText` true + a wrap width
      / `SizeBox` min-width → size-to-content in the widget asset (`prop:` rows); a shorter string only when the layout will not yield.
- [ ] 4. **RECON — row 18.** Find the game's tooltip widget class used by vanilla hub buttons (hover a vanilla button, `dump` the live tooltip widget by the
      remote, or `retoc-5.8 list` of the game's `UI/` for `*Tooltip*`); find how the EAA button sets its tooltip (`ToolTipText` property in the EAA button
      widget asset — `patch-mod-asset.py extract`).
- [ ] 5. **RECON — row 21.** `uaj` learnt Vector2D members (TC DM1, 2026-10-26 21:3x): read the current `DamageNumber__DN_UI_SettingsWindow.tsv` and the
      deployed pak's values (`Spacer_17/Size/X`, `SizeBox_3` WidthOverride, label font); compare with the last frame of phase 1.
- [ ] 6. **Case file** `testcases/TC_conan_mod_window_text_layout_<date>.md` — criteria 1–5 as cases (one per window), stand first.
- [ ] 7. **FIX** — native (rule 8): row 4 — the fade constant / slide binding (`flt:` / `prop:` rows); row 13 — wrap / size-to-content per widget class, all
      windows of one mod in one TSV; row 18 — `ToolTipWidget` class or the tooltip delegate to the game's widget in the EAA button asset; if a widget
      reference cannot be added by `uaj` → `FORK` (a kit-built replacement widget vs Lua that sets the tooltip widget once on the button's birth event);
      row 21 — spacer / slider box widths, labels back to the window's size. Translation shortenings — in the source table `dm-fish-ru.tsv` (rule 21 lesson:
      the source, not only the built locres), `locres-regress.py` 0 lost.
- [ ] 8. **TEST IN THE LIVE GAME** — all cases in one session after `rebuild-krinik-paks.py --install`; frames 4K + 1080p; one control per window read back.
- [ ] 9. **PACKAGING** — each edited pak into `ConanExiles/_krinik-modified/<id>`; `modpack.json` `krinikModified` notes extended (Simple Minimap, The Damage
      Meter, Era of Trials already KRINIK MODIFIED — extend; EAA — new note); the locres if strings changed (`deploy-localization.py`); `.\Deploy-ModPack.ps1
      -Deploy -Only "<Mod>" -PackDir D:\work\ai_sandbox\ConanExiles` per mod; `-Verify`.
- [ ] 10. **Run report** `testcases/reports/<date>_conan-mod-window-text-layout.md`; review folder «НА ОТСМОТР НИКОЛАЕМ/<N> окна модов текст/» with «что смотреть»
      (4K, webp); same commit: bug 64 rows 4, 13, 18, 21 (+ phase 2 rows), the mod notes, the overflow TSV annotated, the guide where it shows these windows.

## Risks

- (a) Row 13's native wrap needed «a BP-safe build» in 2026-10-26 — the kit / `uaj` now edit properties in place; a widget whose layout is in bytecode needs
  `kismet.py` — slower per window.
- (a) Row 18 may need adding an object reference to the asset (not supported by `uaj` setstr) — the fork in step 7.
- (b) The black slides may be the author's (no image shipped) — then the row closes as «author's, not ours» with the A-B frame, or the slide area is collapsed.
- (b) Each window touched here is reframed by epic 40 phase 6 (16:9 gate) — land this phase before it.

## Decisions made without the owner

(filled at the phase's close)
