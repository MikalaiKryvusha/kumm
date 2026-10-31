# Plan 38 — EPIC: one «Настройки модов» button and one hub of mod settings in the game's style (Conan 3.0.1)

> **Created:** 2026-10-30 · **Parent:** plan 36 W24 (folds W19–W23, W28's slider); the owner's order ≈15:00 «с начало это» (this epic first)
> **Status:** meta-plan written 2026-10-30 15:1x; rung 1 research `researches/conan-mod-settings-hub/` (README local + `web-sweep.md`); phase 0 next —
> its operational plan `plans/38_epic38_phase0_widget_spike.md`
> **Outbound:** the look — a mock-up for the owner's eye (phase 0/1 frames); no open fork: Hosav's window is restyled by his word (W19), the archaeology search 15:1x found it
> **2026-10-31 18:54–18:55:** `[OWNER]` «нас ждет большой долг - окно настройки модов» · «рыболку можно не троггггггать, оно красивое» · «давай примерный макет, как ты
> видишь окно настройки модов Криника, 4 варианта макета» — 4 mockups of the «Моды Krinik» window in the fishing look (pack `_config/settings_hub/mockups/mockups.html`,
> pack `d48210b`; review folder `33_krinik_mods_settings_window_4_mockups`): 1 one scroll · 2 index + scroll · 3 two columns · 4 folding sections.
> **PICKED 19:02** `[OWNER]` «2 нравится, только справа нужно отображать только те опции, которые относятся к выбранному моду» · «вверху только заголовок, подзаголовок не
> нужен» · «названия модов отображаться полно - сле не помещается - как в радио бекущей строкой влево вправо двигать в левом колонк-списке» · «по каждому автору модов
> его моды, имеющие насройки - собирать в такое окно-хаб». So: ONE hub window PER MOD AUTHOR (Krinik, Xevyr, …); left — the author's mods that have settings, full names,
> a name that does not fit slides left-right like a car-radio display; right — ONLY the selected mod's options; the head — the title alone. This supersedes the
> «one scroll with a section per mod» wording of 2026-10-30 ≈11:00 for the right side.
> 19:03 `[OWNER]` «возле каждой опции (i) кнопка, тап или ховет по которой открывает поп-ап с пояснением подробным опции, так сделано во многих мобильных проектах
> Криника» — every option row carries an «i»; hover or click opens a popup with the option's detailed explanation. Mockups 5–7 of `settings_hub/mockups/mockups.html`
> (review folder `34_mods_settings_hub_by_author`, shown 19:04).
> 19:06 `[OWNER]` «Кнопки сохранить и закрыть - внизу справа» · «закрыть без сохранения - вверху справа» · «Название пода не капсом» — bottom right «Сохранить»
> and «Сохранить и закрыть» (`[AI]` read as two buttons; one «Сохранить и закрыть» if he says so), top right «Закрыть без сохранения», bottom left «Сбросить к
> исходным»; the mod name over the rows in normal case. So values are NOT applied live: changes wait for «Сохранить» (criterion 4 reads «saved by the button»).

## Goal vector (Achieve)

Today every mod brings its own button and its own window, each in its author's look: two buttons in the hub bar, a «Моды Xevyr» side panel, windows
that overlap each other and do not close on Esc. The player should find ALL mod settings behind ONE button in the inventory, and every window behind
it should look and behave like the game's own settings screen. Where we want to be: one button, one upward list of four entries, scrolling windows of
sections built from the game's own settings widgets, values that persist.

## Acceptance criteria (scenario form)

1. **One button.**
   - Situation. The hub (inventory) is open on any tab.
   - Action. The player looks at the bottom bar.
   - Result. One button «Настройки модов» in the vanilla button look; the separate Hosav and fishing buttons are gone.
   - Check. A frame of the bar; the remote: `FindAllOf('W_UI_SettingsButton_C')` and the fishing button not visible; one button of ours in `ButtonContainerRight|Left`.
2. **The upward list.**
   - Situation. The hub is open.
   - Action. The player clicks «Настройки модов».
   - Result. A list opens UPWARD from the button with four entries: «Настройка HUD», «Настройка рыбалки», «Моды Xevyr», «Моды Krinik»; a click outside or Esc closes it.
   - Check. A frame sequence; the list's entries read by the remote.
3. **Scrolling windows in the game's look.**
   - Situation. The list is open.
   - Action. The player clicks «Моды Krinik» (or «Моды Xevyr»).
   - Result. One window with a scroll; a section header per mod; rows made of the game's settings widgets (checkbox, slider, dropdown) — side by side with the
     game's own «Настройки» screen they look alike; all text Russian.
   - Check. Frames of our window and of the game's settings screen in one sheet; widget classes of the rows read by the remote (`WBP_Setting_*`, `W_*Slider`).
4. **Values persist and apply.**
   - Situation. A Krinik row (e.g. the blood time) is changed.
   - Action. The player closes the window, the game is restarted.
   - Result. The value is the same after the restart and the mod behaves by it.
   - Check. The settings file / save object read before and after; the mod's log line with the value.
5. **One window at a time; Esc closes only the top one.** Opening an entry closes any other mod window; Esc closes the mod window, the hub stays.
   Check: the remote's `IsOpen()` over the mod window classes after each step (0 or 1 open).
6. **No cost in play.** Nothing of the hub runs while it is closed: no polling, no timer. Check: the sections' minute summaries show 0 calls with the hub
   closed; an A-B fly-through pair within noise.

## Phases (order and why)

| Phase | What | Why this order | Gate to close |
|---|---|---|---|
| 0 — spike (R&D) | Lua builds a window from the game's own widgets: `WBP_Settings_Subheader`, `WBP_Setting_Checkbox`, a slider (`W_EditableLabeledSlider` / `WBP_ResetableEditableLabeledSlider`), `WBP_Setting_Dropdown` inside a `ScrollBox`; their change events reach Lua; the window opens over the hub, Esc closes it | the whole epic rests on this; a created mod widget once never fired its handler (2026-10-29) — retire that risk first | a prototype window with three working rows, frames by eye, cases in `testcases/`; if the widgets will not fire — the fallback decided (a kit widget pak, the KrinikConanUI route) |
| 1 — the entry | one «Настройки модов» button in the hub bar (the proven re-skin: vanilla `WBP_ButtonBase` look, our click on top) + the upward list; Hosav's and the fishing buttons leave the bar, their windows open from the list | the player-facing shell; it reuses phase 0's widgets | criteria 1, 2, 5 pass; frames |
| 2 — «Моды Krinik» | the author hub of 19:02 (mockup 5): left — our mods that have settings, full names, a marquee for a name that does not fit; right — only the selected mod's rows, each with an «i» popup (19:03); the head — the title alone; a settings store for our Lua mods (one file the sections read at start and on change); first rows: blood time (W28), the FPS counter on/off (lost in the merge), the HUD blink thresholds, the vignette sliders (W23 — recon of the vignette first) | our own mods — no foreign save formats; proves the store and the rows | criteria 3, 4 for our mods |
| 3 — «Моды Xevyr» | the same author hub (mockup 7) for Xevyr's mods (Damage Meter, Группа поблизости, Простая миникарта, Подсветка знаний и добычи): rows bound to each mod's SaveGame settings fields + the mod's apply call; a «Открыть окно мода» row where a setting is not mapped | foreign formats — each mod's save object read first (notes per mod, the lock) | criteria 3, 4, 5 for the four mods; the «Моды Xevyr» side panel retired |
| 4 — HUD (Hosav) | Hosav's settings window restyled natively in the fishing window's look (W19: «переверстать в стиле окна настроек мода рыбалки»), opened by «Настройка HUD» | his word decides the route; it follows phases 0–3 that prove the look | criterion 3 for the HUD entry |
| 5 — acceptance | the whole pass, translation sweep, the guide section, cost A-B | — | all six criteria; the owner's eye |

Fishing stays its own window (the owner's model of the look) — the list only opens it.

## Risks

- (a) Vanilla settings widgets created from Lua may not fire events or may need the settings screen's context (their parent `W_Settings` feeding them) — phase 0.
- (a) Foreign SaveGame objects: writing a field without the mod's own apply leaves the mod on the old value until restart — phase 3 reads each mod's apply path.
- (b) A Lua-built Overlay + brush copy crashed the game once (2026-10-30 00:22) — build widgets in small steps, one remote call each, frame after each.
- (b) Two mod windows at once (W20 defect) — criterion 5 guards it.
- (c) Mod updates re-ship their buttons (Hosav, fishing) — the hide is re-applied at hub open, by event.

## Decisions made without the owner

(filled at the epic's close)
