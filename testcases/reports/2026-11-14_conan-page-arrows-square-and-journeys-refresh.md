# Run report — Conan: square page arrows (plan 49) + the hub's journey page refreshed (bug 97)

## Work

Two owner items of the dayloop of 2026-11-14 (`[OWNER]` 09:55 «наши стрелки листания проверь чтобы ромбы были ровными, не сплющенными» · 09:56 «очень важно
разобраться с закрытыми путешесьвиями»). Basis — the case sets `testcases/TC_conan_page_arrows_square_2026-11-14.md` (Q1–Q8) and
`testcases/TC_conan_journeys_stale_hub_page_2026-11-14.md` (J0–J6), bug 97, plan 49.

## Contour

The 3.1.0 game (`D:\Games\Conan Exiles 3.1.0`, junction), the owner's world `Game_1`, machine lock «kumm»; KrinikConanUI rebuilt on the 3.1.0 kit (CL 383024)
— `kit-attribute-paging-look.py` (the arrow buttons without content, brushes `ImageSize` 34.27²) + `krinik_hub_controller.lua` (`REFRESH[5]` → the journey
page's native `RefreshGrid` on every show, skipped for a page built in the same call); remote `ConanExiles/_config/pult.sh`, probes `KUMM/.work/arrows/*.lua`,
frames `capture-window.ps1`, real input `mouse-seq.ps1` (owner-idle FREE only).

## Runs

- 2026-11-14 10:00–10:12 — launch 1 (`launch-fg.ps1`, PID 9320; `enter-world-remote.sh`): live sizes `arrow-size.lua`, font sweep, `arrow-square-live.lua`,
  `arrow-nochild-live.lua`, 4K frame `after_live_4k.jpg`; journey recon `journey-recon.lua`, `journey-funcs.lua`, `journey-state.lua`, `feat-check.lua`.
- 10:12–10:21 — kit runs `bash .work/arrows/run-arrows-kit.sh` (runs 1–2 failed on `ImageSize` typing — EXP-0522; run 3 ok, pak 7/7 manifest hashes).
- 10:22–10:31 — launch 2 (PID 3476) after `bash .work/arrows/deploy-ui.sh`: Q4 sizes, Q5 4K frame, Q6 `exec r.SetRes 1920x1080f` frame, 4K back; J2 (old method).
- 10:32–10:46 — launch 3 (PID 40688): `journey-cards.lua`, J1b (`ServerPurchaseFeat(9)`), `RefreshGrid` on our page, J2 (`ServerPurchaseFeat(8)`), J3 (close by the
  page's `…OnCloseClicked`, `UnlockJourney('Farmer')`, reopen, `journey-compare.lua`), J4 `hubswitch/fast-burst.lua` seed 7; kit test `run-step2-look.sh`.
- 10:47–10:49 — launch 4 (PID 18952) after the judge round-2 fixes: the J2 path again, `journey-compare.lua`, close by `TryCloseWindow`, the close log line;
  kit test `run-step2-look.sh` again (background).

## Checks

- Hygiene: kit compile + save every run; the pak's manifest 7/7 (`check_manifest_hashes.py`); two independent judge rounds (round 1: 5 Lua findings — all on the
  reverted first fix — and 3 Python findings, fixed; round 2: no correctness defect, 4 low findings, fixed).
- Functional run: the real game with the owner's world, read by the remote and by eye: Q1 34.27 × 39.08 → Q4 34.27 × 34.27; Q5 Next 55 × 54 px at 4K (was 55 × 61),
  «+» 70 × 70; Q6 ≈ 26 × 26 at native 1080p; Q7 centre unchanged; Q8 step2 + look idempotent. J0 data = window on a fresh entry; J1 WITHDRAWN (method); J1b the
  stale page reproduced by a feat bought with the knowledge window's own call; J2 a feat between two switches — our page open; J3 after a real close — 40 / 40
  cards equal to the game's newborn page (control: the old off-screen game page differed); J4 6 / 6 bursts OK; J5 the minimap helper counted; J6 «ошибок 0»;
  launch 4: 40 / 40 equal, «обновлено страниц 1» (the fresh first show skipped), «ошибок 0».

## Found

- The arrow buttons sized by an emptied TextBlock's line height (fixed, plan 49).
- Our hub controller's kept journey page stale (fixed, bug 97); the other kept tabs — a twin list in bug 97, unchecked.
- Caverns of Set overwrites the vanilla journey row `Mountaineer` (recorded in bug 97 and the game map; plan 53 step 12).
- My own wrong claim of 10:15 (J1) — corrected in the bug, the TC, the mod notes, the game map, `EXPERIENCE.md` (EXP-0523) and by voice.

## Traces

Frames and probes `KUMM/.work/arrows/` (the zooms and crops `q5_zoom.webp`, `q6_zoom.webp`, `j1h_cards.webp`, `j3_cards.webp`, `arrows_native_zoom.webp`; the full 4K /
1080p jpg frames were deleted 11:30 when the work was committed — HOUSE_RULES rule 15); kit logs `KUMM/.work/arrows/look1.log`, `s2test.log`, `looktest.log`, run outputs `run-arrows-kit3.out`, `run-step2-look.out`; the game's
`UE4SS.log` lines «[KrinikConanUI:HubController] хаб закрыт …» 10:35:56 and 10:49. Window closures: launches 1–3 closed by PID, no crash-report window.

## Verdict

pass — both items work in the owner's world on 4K and 1080p; the owner's own play is the final check of the journeys.
