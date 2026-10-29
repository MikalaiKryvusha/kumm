# TC — the map hint row in the hub «Карта» tab does not flicker on fast tab switches (bug 64 item 5, after the fix)

> **Created:** 2026-10-29 · **Parent:** bug 64 item 5; `[OWNER]` «карта красивая, хорошо. проверь, что оно не мерчает при быстрых переключениях в хабе» · 2026-10-29
> **Status:** run 2026-10-29 15:55–15:58 — H1, H2, H3 pass (report `testcases/reports/2026-10-29_conan-hub-map-tab-no-flicker.md`)
> **Outbound:** —

**Basis.** The fix moved the Simple Minimap hint row (`SM_UI_MapHelper`) right of the vanilla «Сброс маркеров [X]». The hub has the same map as a tab
(«Карта»); the owner asks that fast switches do not make it flicker.

**Stand.** The owner's save, the beach, 4K, game in the background. The hub by the remote `ActivateModule(FName('CharacterInventory'), true, false)`;
tabs by the remote `W_Carousel_C:NextCarouselWindow()` / `PrevCarouselWindow()` (the same calls Q/E make), back to back; a frame series
`capture-burst.ps1 -Count 40 -IntervalMs 80 -Width 1920` during the switches, a contact sheet `burst-sheet.py`. Techniques: state transitions
(«Спутники» ↔ «Карта» ↔ «Базар»), frame-by-frame reading.

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| H1 | The row in the hub map tab, at rest | hub → «Карта», 4K frame of the bottom bar | the row right of «Сброс маркеров [X]», no overlap — the same as the fullscreen map | pass 15:57 — 4K frame: «Сброс маркеров X» · «Shift + мышь Новый маркер ?» · «Shift + мышь Свои маркеры» · magnifier · «◁ Земли изгнанников ▷» apart |
| H2 | Fast switches into and out of «Карта» | burst; Next, Prev, Prev, Next, Next, Prev back to back | in every frame where the map tab shows, the row stands at its new place — never a frame with the row on the vanilla button, never a jump left → right | pass 15:57 — 60 frames over 9.1 s, 6 remote switches ≈ 1 s apart: the map tab came back 3 times (1329, 3497, 5480 ms), the row at its place from the first frame each time; only the vanilla region selector shifts in the first frame of one return |
| H3 | Fast Q/E by real keys | burst; real E, Q, Q, E after the owner's input idle | the same as H2 | pass 15:58 — `mouse-seq.ps1` E,Q,Q,E,E,Q ≈ 230 ms apart after 41 s of idle; 45 frames: Спутники → Карта → Базар → Карта seen, the row at its place in every map frame |
