# TC — Conan: the hub's other kept tabs show the truth after the state changes (bug 97 — the twin list)

> **Created:** 2026-11-14 · **Parent:** `bugs/97_conan_journeys_locked_after_tutorial.md` (section «The class — the other kept tabs») · **Status:** written 12:22,
> run 12:23–12:31 (game PID 37712) — H0–H5 pass, notes H1 / H6; **H0–H5 ran with probe v1, which did not reach list entries
> (judge round 2, 12:47) — re-run with v2 12:49–12:52: H0b, H8** · **Outbound:** —

**Test basis:** bug 97's mechanism — `KrinikConanUI/krinik_hub_controller.lua` builds OUR instance of seven tabs once per world session and hides the game's page
that is born fresh at every switch; a page that reads its data only at its birth goes stale on ours. Journeys proved it (case J1b of
`TC_conan_journeys_stale_hub_page_2026-11-14.md`). The owner levels up, learns knowledge and gets thralls all the time — a stale count or lock on those
pages would mislead him exactly as the journeys did.
**Stand:** the 3.1.0 game, the owner's world `Game_1` (Continue), machine lock «kumm», `stand-keeper.sh`; the hub by `.work/arrows/open-tab.lua`
(`_G.__tab` = carousel index: 1 Таланты, 2 Хар-ки, 4 Путешествие, 5 Клан, 6 Спутники, 7 Карта, 8 Базар; the controller's index is one more); the compare by
`_config/hub-page-compare.lua` (`_G.__hpc_tab` = the controller's index) — ours = the instance at opacity 1, the game's newborn = at 0.
**Method per tab:** show the tab (our page built) → switch to «Снаряжение» → change the state by the game's own call → switch back → compare. A difference that
the game's newborn page has and ours lacks = stale.
**Dimensions covered:** each kept tab at rest (baseline: both instances equal) · Таланты and Хар-ки after a level-up and after a learned feat · the probe's own
control (a text of OUR page changed by the remote must show as a difference). Not covered: Клан (single player — no clan), Базар (offline store), Спутники
with a new thrall (needs a thrall placed — a later case if the baseline shows the page reads followers live).

| # | Case | Expected | Status | Observed |
|---|---|---|---|---|
| H0 | probe control: on tab Хар-ки, set one TextBlock of OUR page to «PROBE» by the remote, compare | one line only-ours «PROBE», one only-game | **pass** | 12:24 a collapsed text (`Txt_KrinikPageLo` «21» → «PROBE») and 12:28 a visible one (`TextBlock_1` «Доступные Очки» → «PROBE»): one line each side both times; texts restored |
| H1 | baseline: each kept tab (2, 3, 6, 7, 8, 9) shown in a fresh hub, compare | 0 differences (both born from the same state) | **pass, one note** | Хар-ки 134 / 134 equal; Клан 76, Спутники 43, Карта 76, Базар 40 — equal; Таланты 145 / 145 with 3 lines — our page kept the previous selection's card («Строительство: Highmane's A…», cost 1, level 1), the game's newborn shows none («--») — gone after the next state change (H3); recheck by the player's path |
| H2 | Хар-ки: shown → «Снаряжение» → the hero gains a level (`BP_ConanCheatManager_C:LevelUp()`) → Хар-ки again, compare | the free attribute points equal on both | **pass** | first read: one line — `A_Strength.CorruptionLabel` own flag coll (ours) vs hti (game); the frames of both pages identical («Доступные Очки 2») — the label sits in a collapsed branch; the probe now judges what the player sees (a widget in a Collapsed / Hidden branch = «hidden branch») → 0 differences. The same line stayed after a clean switch with no state change and after the page's own `UpdateAttributeInfo`, `UpdateSoulEssenceCounter`, `UpdateExperienceValue` on ours |
| H3 | Таланты: shown → «Снаряжение» → a feat learned by `ServerPurchaseFeat(<id>)` (the window's own call) → Таланты again, compare | the feat shown learned on both; the free knowledge points equal | **pass** | `ServerPurchaseFeat(41020)` did not learn it (known false after; cause not read — prerequisites?); `ServerPurchaseFeat(51961)` (Thralltaker): known true, points used 11 → 14; compare 0 differences; frames of both pages identical («Очки: 17») |
| H4 | Таланты after the level-up of H2 | the free knowledge points equal on both | **pass** | the H1 Таланты read came after the level-up: the only lines were the selection card |
| H5 | control: Путешествие after H3 (`REFRESH[5]` in place) | 0 differences | **pass** | 64 / 64 equal |
| H0b | probe v2 control on a LIST ENTRY: `_G.__hpc_poison='Entry'` on Путешествие | one line each side inside a card | **pass** | 12:49 `…/ScrollBox/GridPanel/W_NewJourneyEntry_C/…/JourneyName` «PROBE» vs «Выживший»; tab 5 now 459 widgets a side (v1 saw 64) |
| H8 | **re-run with probe v2** (game PID 39416): all kept tabs at rest, then `LevelUp()` + Таланты / Хар-ки / Путешествие | equal | **pass, two notes** | Хар-ки 626 / 626, Путешествие 459 / 459, Спутники 43 / 43, Базар 40 / 40 — equal at rest and after the level-up (the feat call bought nothing new: feat 8 was known). **Карта 93 / 94:** the game's page carries Simple Minimap's `SM_UI_CustomMapOverlay_C/MainLayer/markerPing` (collapsed now), ours lacks it — the mod's map ping may not work on our page (a G2 embedding item of plan 48). **Таланты 2330 / 1768:** ours has 37 more feat grid slots (visible icons) — the feat list is a ListView that builds rows for the shown part; ours keeps the rows it built, the first screens of both looked identical (frame pair 12:30) — to confirm by a scrolled compare; and ours keeps the last selection card («--» on the game's) |
| H6 | the remote's carousel switch: which tab the header lights | the shown tab | **note** | after `SetCarouselIndex` by the remote the header stays lit on «Снаряжение» while «Хар-ки» / «Таланты» show — on the GAME's page too (frames `.work/keybinds/h_*_pair.jpg`); not seen with real input — a case for the real-input run of plan 48 |
