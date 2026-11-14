# TC — Conan: the hub's journey page shows the journeys' CURRENT unlock state (bug 97 — our hub controller kept a stale page)

> **Created:** 2026-11-14 · **Parent:** `bugs/97_conan_journeys_locked_after_tutorial.md` · **Status:** written 10:14 after J0–J1; J1 withdrawn 10:4x (method), J1b–J6 run
> 10:39 — the fix is `REFRESH` in `krinik_hub_controller.lua` (the page's native `RefreshGrid` on every show; the first fix «rebuild at every close» reverted) ·
> **Outbound:** — (the owner's own play is the final check)

**Test basis:** `[OWNER]` 2026-11-13 16:01 «Вот я прошёл обучение, мне сказано нажать J, чтобы выбрать путешествие - но все, кроме рыбалки, петешествия под замком» ·
2026-11-14 09:56 «очень важно разобраться с закрытыми путешесьвиями». The game's rule (bug 97 recon, re-read live 10:0x on 3.1.0): a journey opens by a learned
feat, a level, a found map marker or the previous journey's completion; the hero's journey data `NewJourneyComponent.m_JourneyData` (61 rows) and
`GetJourneyUnlockStatus` agree. `krinik_hub_controller.lua` builds OUR page of 7 tabs (Таланты, Хар-ки, Путешествие, Клан, Спутники, Карта, Базар) once and kept it
until the world was left, hiding the game's freshly born page.
**Stand:** the 3.1.0 target, the owner's world `Game_1` (rule 6 — the agent changes it freely: a journey unlocked by the remote stays unlocked), machine lock «kumm»;
the hub by `.work/arrows/open-tab.lua` (`ActivateModule(Inventory)` + `SetCarouselIndex(4)`), closed by `ActivateModule(Inventory, false)`; a journey unlocked by
`.work/arrows/journey-unlock.lua` (`UnlockJourney(name, false)`); frames by `capture-window.ps1 -Width 3840`, the card crop compared by eye.
**Dimensions covered:** a journey unlocked while the hub is closed after its page was built (the owner's case: the tutorial finished after the first hub
opening) · the same tab reopened · the class — the other kept tabs rebuilt (a build counter per opening) · fast switching after the change (the controller's
own regression) · the minimap helper row on our rebuilt «Карта». Not covered: a journey unlocked while the hub is OPEN (the game's own page has the same timing);
a fresh new game through the tutorial (the data path is the game's; the defect is the page).

| # | Case | Expected | Status | Observed |
|---|---|---|---|---|
| J0 | the data vs the window on a fresh world entry | the journey tab's locks = `m_JourneyData.Unlocked` | **pass** | 10:0x: 13 rows Unlocked=true (Survivor done, SurvivalShelter, Warrior, Archer, Blacksmith, Mason, Homesteader, Acolyte, RegionTravel_EL, ExilesFishing, InvocationsAndDesecration, RelicsOfFaith, IronlightFounding); frame `.work/arrows/journey_tab_4k.jpg` — Укрытие, Воин, Лучник, Кузнец, Каменщик, Поселенец coloured, Кожевник / Алхимик / Бронник / Умелец locked; feats 4, 6 known, 8, 9 not — the game's rule holds |
| J1 | before the fix: a journey unlocked after the page was built | the page shows the old lock (the defect) | **INVALID (method)** | 10:1x «reproduced» — WITHDRAWN 10:4x: (a) the remote «close» `ActivateModule(Inventory, false)` does not close the hub (EXP-0520; no «хаб закрыт» line in UE4SS.log), so no switch and no rebuild happened; (b) `UnlockJourney` sets the data flag, but the cards follow it only after a delay — the game's own fresh page showed «Алхимик» locked right after the same call. Not evidence either way |
| J1b | before the fix, honest: a feat learned with the hub open, our page kept | the game's newborn page shows the journey open, our kept page still locked | **pass (defect reproduced)** | 10:3x: «Путешествие» shown (our page `…449717` built) → tab «Снаряжение» → `ServerPurchaseFeat(9)` (the knowledge window's own call; feat 9 known after) → «Путешествие»: the game's newborn `…445390` «Кожевник» icon Collapsed (open), ours `…449717` lock Visible; `RefreshGrid(GetHideCompletedJourneys())` on ours (17 ms) → open; frame `.work/arrows/j1h_cards.webp` |
| J2 | after the fix (refresh on show), within one hub opening | our page shows a feat learned between two switches | **pass** | 10:34: «Путешествие» → «Снаряжение» → `ServerPurchaseFeat(8)` → «Путешествие»: «Бронник» open on the game's newborn `…445388` AND on our kept `…454883` |
| J3 | after the fix, across a REAL close | after the close button and a reopen our page = the game's newborn page, every card | **pass** | 10:35 the hub closed by its own close-button event (`…OnCloseClicked`, UE4SS «хаб закрыт … ошибок 0»); `UnlockJourney('Farmer')`; reopened 10:3x: `.work/arrows/journey-compare.lua` (pages in the viewport only) — 40 rows, 0 differ; control: the off-screen OLD game page differed on «Земледелец» (the compare can fail); frame `.work/arrows/j3_cards.webp` — Кожевник, Бронник, Земледелец open |
| J4 | fast switching still clean | `_config/hubswitch/fast-burst.lua`: every burst ends on a shown page, 0 errors | **pass** | 10:5x seed 7: 6 / 6 OK, bare 0, overlay 0 (bursts through «Путешествие» included) |
| J5 | the minimap helper row on our «Карта» | the close line counts the helper | **pass** | «строка миникарты 1» (the edit does not touch it) |
| J6 | the hub close log | «хаб закрыт: … ошибок 0» in UE4SS.log | **pass** | 10:35:56 «… построено страниц 7 (худшая 116.0 мс), обновлено страниц 2, потеряно 0, строка миникарты 1, обработчики: худший 164.0 мс, всего 830.0 мс, ошибок 0» — the worst handler is the opening's page builds (lag at a window's opening is allowed) |
