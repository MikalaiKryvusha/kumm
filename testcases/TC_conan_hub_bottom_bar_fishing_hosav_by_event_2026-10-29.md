# TC — hub bottom bar: the fishing button comes with the Equipment tab, the Hosav button leaves with it (bug 64 item 17)

> **Created:** 2026-10-29 · **Parent:** bug 64 item 17, plan 36 section 6 (`[OWNER]` «почти на всех страницах его что-то да пляшет · особенно внизу,
> где кнопки» · 2026-10-29 16:1x)
> **Status:** run 2026-10-29 16:53–17:00 — F4, C1, L1, E1 pass; F1–F3, H1, H2 pass by the owner's eye 17:5x («это ок»); the rest of the bar still dances and the hub opens late («но остальное пляшет» · «и открывается с задержкой») — next work
> **Outbound:** —

**Basis.** The 57 fps video of 2026-10-29 16:2x (bug 64 item 17): (2) leaving «Снаряжение» for «Таланты», the Hosav «Настройки интерфейса» stays
3 frames over «Показать контент из DLC»; (3) back on «Снаряжение», «Настройка рыбалки» appears ≈150 ms after the rest. Causes read in bytecode:
Exiles Fishing `BPC_EFT_Tuning` polls `IsModuleActive(CharacterInventory)` every 0.3 s (`CheckInventory`, looping timer set by BeginPlay and
`TryLocal`) and calls `Graft` on the rising edge; the Hosav button is hidden by `KrinikPauseGameInMenu` on `XCS_Panel` false, which arrives after
the tab changed (hypothesis — L1 measures it). Fix: Exiles Fishing KRINIK MODIFIED — both 0.3 s timers → 1e9 s; `KrinikPauseGameInMenu` 0.8.0 —
`Graft` on `XCS_Panel` true; the Hosav button hidden on entry of `W_Carousel_C:Next/PrevCarouselWindow`.

**Stand.** The owner's save, the hero in the world, 4K, no enemies near (the world slowed by the pause mod while the hub is open); the hub opened by
the remote; tabs switched by REAL E/Q (`mouse-seq.ps1`) after the owner's input idle ≥ 5 min (`wait-input-idle.ps1`), the game in front only for
the recording; screen video `ffmpeg ddagrab 60 fps` → frames of the bottom bar read one by one (sheet). Techniques: state transitions
(Equipment → Talents → Equipment, hub closed → open on Equipment), control case — the frames of the 16:2x video (before the fix).

| # | Case | Steps | Expected | Status |
|---|---|---|---|---|
| F1 | Fishing button on return to Equipment | E ×8 then Q ×8 at 1.2 s per tab, video | in every return to «Снаряжение» «Настройка рыбалки» is in the same frame as «Закрыть» and «Поправить биографию» | pass 17:5x by the owner's eye in the live hub — «это ок» (the video was paused by him) |
| F2 | Fishing button on hub open | hub closed → open on «Снаряжение» (remote) during a video | the button in the first frame of the bottom bar | pass 17:5x by the owner's eye in the live hub — «это ок» (the video was paused by him) |
| F3 | No fishing button on other tabs | frames of «Таланты», «Хар-ки», «Карта» | no «Настройка рыбалки» | pass 17:5x by the owner's eye in the live hub — «это ок» (the video was paused by him) |
| F4 | The button still opens the fishing panel | `call` of its click (or a real click) | the fishing settings panel opens, Russian | pass 16:57 — remote `call W_EFT_AdminButton_C_… CustomEvent` → module `ExilesFishingTuning`; frame: the panel in Russian, bottom bar «Настройки интерфейса» left, «Настройка рыбалки» right |
| H1 | Hosav button leaves with Equipment | the same video, frames of the switch Equipment → Talents | no frame with «Настройки интерфейса» over «Показать контент из DLC» | pass 17:5x by the owner's eye in the live hub — «это ок» (the video was paused by him) |
| H2 | Hosav button back on Equipment | the same video | «Настройки интерфейса» in every Equipment frame after the switch | pass 17:5x by the owner's eye in the live hub — «это ок» (the video was paused by him) |
| L1 | How late `XCS_Panel` false is | `UE4SS.log` lines «XCS_Panel закрыт через N мс после карусели» | N recorded; the carousel hooks «встал» | pass 16:56 (remote probes, log timestamps): `NextCarouselWindow` 17.535 → `XCS_Panel` false 17.681 = 146 ms; Prev → true 42 ms; after the fix the hooks on `/Script/ConanSandbox.CarouselWindow` (Next, Prev, SetCarouselIndex) «встал» 16:57:56 (the blueprint path gave «no UFunction») |
| C1 | The fishing poll is gone | remote `RegisterHook(BPC_EFT_Tuning_C:CheckInventory)` counter over 10 s with the hub open and closed | 0 calls | pass 16:56 — print hook on `CheckInventory`: 0 calls in 24 s with the hub open (≈80 from the 0.3 s loop before); control — one direct call printed at once |
| E1 | No new errors | `UE4SS.log`, `ConanSandbox.log` grep `KrinikPauseGameInMenu`, `JaarFishing`, `Graft`, «упал» | no error lines; «кнопка «Настройка рыбалки»: поставлена» | pass 17:0x — `UE4SS.log`: no «упал» / «НЕ встал» of the pause mod after the fix, «поставлена (… повторов 0, 2.00 мс)»; `ConanSandbox.log`: 0 JaarFishing error lines |
