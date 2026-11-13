# Research — the bow-kill crash: code recon of weak points (2026-11-10)

> **Created:** 2026-11-10 · **Parent:** bugs/85 · **Status:** recon done · **Outbound:** fixes to the owner's build
>
> Read-only recon. No game run, no build, no edit to mod code. Source tree read: `ConanExiles/_unpacked/Krinik*` (`ue4ss/Scripts` or `Scripts`);
> deployed tree compared: `D:\Games\Conan Exiles 3.0.1\ConanSandbox\Binaries\Win64\ue4ss\Mods`. `diff -rq` found that source and deployed match for
> Archery, Camera, Graphics, Locomotion, ModPackManager and the harness. They differ only in `KrinikConanUI/krinik_mod_settings.lua` (the
> PLACEHOLDER_PERKS switch, which is not on the kill path) and `KrinikConanMusic`. During this recon the deployed `krinik_mod_settings.lua` changed
> under me: the guard first reported line 1355, and a later grep found 1362. Someone deployed in between. Line numbers below are from the source tree.
>
> Enabled in the game: by `enabled.txt` — KrinikAgentRemote, KrinikConanArchery, KrinikConanBench, KrinikConanCamera, KrinikConanGraphics,
> KrinikConanLocomotion, KrinikConanModPackManager, KrinikConanMusic, KrinikConanUI, KrinikMenuProbe. By `mods.txt` — CheatManagerEnablerMod,
> ConsoleCommandsMod, ConsoleEnablerMod, BPML_GenericFunctions, **Keybinds** (all `: 1`). HosavRU, ConanAttributeProbe and ConanProjectileProbe
> exist only in `_unpacked`. They are not deployed.

## 0. The guard's run and its gaps

`python -B -I -X utf8 ConanExiles/_config/check-lua-game-thread.py` (default = the game's enabled mods) gave exit 1, 5 lines:

```
KrinikConanUI\Scripts\krinik_feedback.lua:91: RegisterKeyBind(Key.LEFT_MOUSE_BUTTON, function() ExecuteInGameThread(on_click) end)
KrinikConanUI\Scripts\krinik_mods_button.lua:18: - клик — RegisterKeyBind(LMB) → … (a comment inside a --[[ ]] block: false positive)
KrinikConanUI\Scripts\krinik_mods_button.lua:285: RegisterKeyBind(Key.LEFT_MOUSE_BUTTON, function()
KrinikConanUI\Scripts\krinik_mod_settings.lua:1355: RegisterKeyBind(Key.LEFT_MOUSE_BUTTON, function()
KrinikConanUI\Scripts\krinik_pause_in_menu.lua:630: RegisterKeyBind(Key.ESCAPE, function()
```

Camera and Archery are clean, so their bug-85 fixes are in the deployed build. The guard has three gaps, and each one hides a live site:

| Gap | Evidence | Hidden site |
|---|---|---|
| The regex needs `RegisterKeyBind\s*\(`, so a call written as `pcall(RegisterKeyBind, …)` passes | `BAD = re.compile(r"\b(ExecuteWithDelay\|LoopAsync\|ExecuteAsync\|RegisterKeyBind\|RegisterKeyBindAsync)\s*\(")` | `krinik_hub_controller.lua:279` `local ok, e = pcall(RegisterKeyBind, Key[key], function() ExecuteInGameThread(check_soon) end)` — ESCAPE and TAB, **two more key binds in KrinikConanUI** |
| It checks only mods with `enabled.txt`, not mods enabled by `mods.txt` | `if only_enabled and not os.path.exists(os.path.join(d, "enabled.txt")): continue` | `Mods/Keybinds/Scripts/main.lua:26` `RegisterKeyBindAsync(Keybinds[KeyBindName].Key, Keybinds[KeyBindName].ModifierKeys, Callable)` (`mods.txt`: `Keybinds : 1`) |
| On a source tree laid out as `<mod>/ue4ss/Scripts`, it must be given the mod folder, not `ue4ss` | `ue4ss` as the root gives «вызовов 0» for KrinikConanUI; the mod folder as the root gives 5 | the source-tree run can silently pass |

## (a) Every off-game-thread entry point

The criterion used here is stricter than «is it wrapped in `ExecuteInGameThread`?». By bug 85's root cause (UE4SS `8333063`: one `lua_State` per mod,
callbacks in `lua_newthread` threads, no lock between a key-bind callback and `RegisterHook` or the delayed-action batch), a key-bind callback that ONLY
calls `ExecuteInGameThread(f)` still runs Lua on UE4SS's event-loop thread. It enters the VM, may create a closure, and may extend a CallInfo; each of
those allocates in the shared heap and can step the GC. So a wrapped key bind is **unsafe**, just less often. Only the absence of off-thread Lua is safe.

| file:line | Callback kind | Touches UObject off-thread? | Wrapped? | Verdict |
|---|---|---|---|---|
| KrinikConanUI `krinik_feedback.lua:91` `RegisterKeyBind(Key.LEFT_MOUSE_BUTTON, function() ExecuteInGameThread(on_click) end)` | key bind, LMB, **ungated: fires on every LMB press, every bow shot and every swing** | no | yes | **UNSAFE — the open twin, the worst of them** |
| KrinikConanUI `krinik_mods_button.lua:285` `RegisterKeyBind(Key.LEFT_MOUSE_BUTTON, function()` → `if not shown then return end` | key bind, LMB, every press (the gate itself is Lua run off-thread) | no | yes (inside) | **UNSAFE — open twin** |
| KrinikConanUI `krinik_mod_settings.lua:1362` `RegisterKeyBind(Key.LEFT_MOUSE_BUTTON, function()` → `if not win then return end` · `log("LMB (window open)")` | key bind, LMB, every press; while the window is open it also builds a string and prints off-thread | no | yes | **UNSAFE — open twin** |
| KrinikConanUI `krinik_pause_in_menu.lua:630` `RegisterKeyBind(Key.ESCAPE, function()` | key bind, Esc | no | yes | **UNSAFE — open twin** |
| KrinikConanUI `krinik_hub_controller.lua:279` `pcall(RegisterKeyBind, Key[key], function() ExecuteInGameThread(check_soon) end)` for `'ESCAPE', 'TAB'` | key bind ×2 | no | yes | **UNSAFE — open twin the guard does not see** |
| UE4SS sample `Keybinds/Scripts/main.lua:26` `RegisterKeyBindAsync(…)` — Ctrl+J `DumpAllObjects`, Ctrl+H `GenerateSDK`, Ctrl+Num9 `GenerateUHTCompatibleHeaders`, Ctrl+Num8 `DumpStaticMeshes`, Ctrl+Num7 `DumpAllActors`, Ctrl+Num6 `DumpUSMAP`, Ctrl+Num5 `DumpJMAP` | async key bind (no mutex at all) in its OWN Lua state | the dumpers walk the whole object array off the game thread | no | **UNSAFE.** It does not corrupt our mods' heaps, but see finding F3 |
| KrinikConanArchery `main.lua:933` `NotifyOnNewObject(CORPSE_CLASS, function(corpse)` → `if corpse:GetFullName():find("Default__", 1, true) then return end` · `last_corpse, last_corpse_t = corpse, os.clock()` · `ExecuteInGameThreadWithDelay(…)` | birth notify, **not** wrapped | `GetFullName` on the newborn | no | safe when the constructor runs on the game thread (an NPC death spawns the corpse there). Unsafe if a corpse class/CDO is constructed on the async loading thread (see (d)) |
| KrinikConanArchery `main.lua:1410` `NotifyOnNewObject(CROSSHAIR_WIDGET, function()` → `ExecuteInGameThreadWithDelay(100, …)` | birth notify, not wrapped | no | — | conditional, same as above |
| KrinikConanArchery `main.lua:346, 548, 1114, 1427, 1550, 1558` (`NotifyOnNewObject(…, function(…) ExecuteInGameThread(…) end)`) | birth notify, wrapped | no | yes | conditional — only a closure is created on the constructing thread |
| KrinikConanUI `krinik_hub_controller.lua:184` `NotifyOnNewObject('/Script/UMG.UserWidget', function(w)` → `if S.closed then return end` … `w:GetClass():GetFName():ToString()` | birth notify on EVERY widget of the game | yes, while the hub is open | no | conditional; fires during the kill (corpse prompt, damage and XP widgets) |
| KrinikConanUI `krinik_ui_fixes.lua:294` `NotifyOnNewObject("/Script/UMG.SizeBox", function(box)` → `on_sizebox`: `box:GetFName()`, `o = o:GetOuter()` ×4, `box.MaxDesiredWidth = GLYPH_MAX_W` | birth notify on EVERY SizeBox | yes, including **property writes** | no | conditional; widget-blueprint archetypes are constructed by the loader |
| KrinikConanUI `krinik_ui_fixes.lua:105` (INFO_CLASSES → `w:GetFullName()`, `infos[name] = w`), `:123` (`tracker = w`), `:247` (`hook(WIDGET_EVENT…)` = **RegisterHook inside a construction callback**) | birth notify | yes | no | conditional |
| KrinikConanUI `krinik_shout_fade.lua:176` `NotifyOnNewObject(ENTRY_NATIVE, function(entry)` → `entry.RenderOpacity = 0.0` · `hook_once()` (RegisterHook) | birth notify | **writes a property** | no | conditional |
| KrinikConanUI `krinik_feedback.lua:42`, `krinik_pickup_prompt.lua:171, 175, 238`, `krinik_hud_outline.lua:139, 159, 308`, `krinik_fps_counter.lua:106`, `krinik_hud_blink.lua:168`, `krinik_vignette.lua:104`, `krinik_minimap_coords.lua:66`, `krinik_mod_settings.lua:332, 357`, `krinik_attr_pips.lua:115`, `krinik_mods_button.lua:229` | birth notify | partly (GetFullName, storing raw refs) | mixed | conditional |
| KrinikConanMusic `main.lua:158-159` `NotifyOnNewObject("/Game/Systems/Audio/BP_SoundStage.BP_SoundStage_C", take_stage)` → `valid(s)`, `s:GetFullName()`, `set_hook()` (RegisterHook) | birth notify | yes | no | conditional; it also stores the CDO as `stage` when the CDO comes first |
| KrinikConanGraphics `main.lua:227`, Camera `main.lua:1036, 2033`, Locomotion `krinik_air_combat.lua:94`, `krinik_oblivion_locomotion.lua:317`, ModPackManager `main.lua:1300, 1310` | birth notify | — | mostly wrapped or delayed | conditional |
| Our `LoopAsync` / `ExecuteAsync` / `ExecuteWithDelay` in deployed mods | — | — | — | **none** (guard: 0). Present only in the non-deployed ConanAttributeProbe, ConanProjectileProbe and HosavRU (`HosavRU/Scripts/main.lua:136` `LoopAsync(cfg.interval_ms, function()`) |
| KrinikAgentRemote `main.lua:227-228` `local env = setmetatable({ find_widget = find_widget, log = log }, { __index = _G })` · `load(code, "agent", "t", env)` | any Lua the agent sends, run inside the REMOTE's state | whatever the chunk does | — | **unbounded**: a chunk may arm `LoopAsync`, `NotifyOnNewObject` or `RegisterHook`, and they stay armed for the whole session. The guard never sees them (see §e) |

Game-thread-only loops (safe by thread, listed because they keep a mod's Lua busy, which is what makes a key bind collide): UI `krinik_fps_counter.lua:123`,
`krinik_hud_blink.lua:180`, `krinik_pause_in_menu.lua:589` (`LoopInGameThreadWithDelay`); UI `krinik_pickup_prompt.lua` `tick` chain; Camera `main.lua:1620`
(30 ms), `:2944` (`LoopInGameThreadAfterFrames(1, …)` every frame), `:3341`; Music `main.lua:263`; Locomotion `krinik_oblivion_locomotion.lua:252`; harness
`KrinikAgentRemote/main.lua:272`, `KrinikConanBench/main.lua:502` (every frame).

## (b) Kill-path hooks: what runs at the moment of a bow kill

Order in UE4SS 1181: a BLUEPRINT function's hook callback runs **after** the function body (EXP-0487). So for `TakeProjectileDamage`, `ApplyDamageAll`
and `GetProjectileDamageOverDistance`, the callbacks run with the kill already done inside the body.

| file:line | Hook | What it does at the kill | Risk |
|---|---|---|---|
| Archery `main.lua:539` `RegisterHook(PDOD_FUNC, function(ctx, mult)` → `on_projectile_multiplier` | `BP_BaseProjectile_C:GetProjectileDamageOverDistance` | `SphereOverlapActors` 300 cm; for each NPC `a.Mesh:FindClosestBone_K2(…)`; on a head bone `mult:set(m * CFG.head_damage_mult)` and `holder.xpToGive = native_xp * CFG.head_xp_mult`, restored by `ExecuteInGameThreadWithDelay(100, function() restore_xp(key) end)` | `a.Mesh` is used without `IsValid`; it is pcall'd, but a native fault is not caught by pcall |
| Archery `main.lua:531, 535` `RegisterHook(HEAD_HIT_FUNC / HEAD_HIT_ALL_FUNC, …)` → `on_apply_damage` | `BP_CollisionComponent_C:ApplyDamageSpecific / ApplyDamageAll` | `damaged:get()`, `victim:GetFullName()`, a table write | low |
| Archery `main.lua:554` `pcall(RegisterHook, STOP_FUNC, function(ctx)` | `BP_BaseProjectile_C:StopProjectileInternal` | `visuals[a:GetAddress()]` → `vis:SetVisibility(false, false)`; `alert_near(a)`: `SphereOverlapActors` 10 m, `npc:GetComponentByClass(tdc_class)`, `tdc:UpdatedHeardActors({ hero })` on every NPC near the impact, **including the just-killed victim** | AI events run on a dead NPC inside the projectile's stop. The outer callback has no pcall; only `alert_near` is pcall'd. The registry is keyed by a raw address (address reuse) |
| Archery `main.lua:933-943` corpse birth → `+150 ms` `on_corpse_born` (`main.lua:879`) → `+150 ms` `rebirth` (`main.lua:793`) | `NotifyOnNewObject(CorpseBase)` + delayed actions | `FindAllOf("BP_DummyProjectile_C")`; for each copy `GetAttachParent():GetOwner()`, `GetSocketLocation`, `owner.OnDestroyed:Remove(dummy, "DestroyDummyIfAttachedObjectIsDestroyed")`; then `K2_DetachFromActor`, `K2_AttachToComponent`, `a.RootComponent:K2_SetRelativeLocationAndRotation(rec.rel_loc, rec.rel_rot, false, {}, true)`, `SetLifeSpan`, `inv:AddItemTemplate(…)` | this is the bug-85 crash window (`rebirth`). The calls are on the game thread, but they move actors and loot. `on_corpse_born` does not check `corpse:IsValid()` |
| Archery `main.lua:346-372` dummy birth → `ExecuteInGameThread` → `+100 ms` | `NotifyOnNewObject(BP_DummyProjectile_C)` | when `os.clock() - last_corpse_t < CORPSE_LATE_S` it calls `pcall(on_corpse_born, last_corpse)` **again** (the «копий 0» second pass, `FindAllOf` again), then `on_corpse_hit(dummy)` (`AddItemTemplate` into the corpse), then the copy log | `last_corpse` is a cached raw ref, used without `IsValid` |
| Archery `main.lua:786` `RegisterHook("/Script/ConanSandbox.QuickLootPanel:SlotItemAddedOrRemoved", function() sync_later(50) end)` | quick-loot slot change (any container) | `sync_corpse_arrows`: for EVERY remembered corpse `rec.corpse:IsValid() and rec.inv:IsValid()`, `GetNumberOfItemsByTemplate`, `c:K2_DestroyActor()` on copies | the refs are held for the corpse's lifetime (finding F4) |
| Archery `main.lua:1104` `RegisterHook(ATTACK_EVENT, function(ctx, _sub, entered)` | `BasePlayerChar_C:OnSubstateChanged_Attacking` | `+100 ms` `settle_if_stuck(pawn)`: `FindAllOf("BP_bow_2h_C")`, `anim:AnimNotify_bow_secondary_settle()` | low; one `FindAllOf` per attack end |
| Graphics `main.lua:220` `RegisterHook(ARROW.hook, function(self, attackData, combo, actorToDamage, …, bLocked)` | `BP_CollisionComponent_C:TakeProjectileDamage` (the body has already applied the kill) | on the dying target: `target.CapsuleComponent:GetScaledCapsuleHalfHeight()`, `gs:SpawnDecalAtLocation(target, …)`, then `d:SetFadeOut(0.0, ARROW.life, true)`, which **re-enters Graphics' own `SetFadeOut` hook** (`main.lua:154`) synchronously from inside a Lua→UFunction call. The first `FindAllOf("MaterialInstanceConstant")` / `FindAllOf("Material")` scan runs once on the first arrow hit | nested hook Lua inside Lua; the first-hit full-material scan is a hitch |
| Music `main.lua:150` `RegisterHook(".../BP_AC_AudioController_C:UpdateCombatMusicStateWithNewActor", function() end, function() update_measured(true) end)` | combat music state | `update_measured` touches the cached `stage`/`audio` refs | low (hero-owned objects) |
| UI `krinik_ui_fixes.lua:228` (hook on `LOOT_EVENT` / `WIDGET_EVENT`) | the corpse prompt `WBP_ContainerInfo_C:SetObject`, `QuickLootPanel:SlotItemAddedOrRemoved` | align, split prompt, tracker opacity, a 250 ms watch chain | UI game-thread Lua right after the kill: **the twin's collision partner** |
| UI `krinik_hub_controller.lua:184`, `krinik_ui_fixes.lua:294` | every UserWidget / SizeBox birth (damage numbers, XP, corpse prompt) | a few Lua lines per widget | same: UI game-thread Lua bursts at the kill |
| Locomotion `krinik_air_combat.lua:100` (`HandleOnMovementModeChanged`, `StartJump`) | hero combat | `LaunchCharacter` on a mid-air shot | not kill-specific |

No hook on `OnDeath` / `KillCharacter` / `TakeDamage` exists in our Lua. The death is reached only through the corpse birth notify and the damage hooks above.

## (c) Ranked findings

**F1 · likely crash · KrinikConanUI (the known open twins, plus two unknown ones).**
`krinik_feedback.lua:91` `RegisterKeyBind(Key.LEFT_MOUSE_BUTTON, function() ExecuteInGameThread(on_click) end)`; also `krinik_mods_button.lua:285`,
`krinik_mod_settings.lua:1362`, `krinik_pause_in_menu.lua:630`, `krinik_hub_controller.lua:279` (ESCAPE + TAB, not seen by the guard).
*Scenario:* every LMB press (each bow shot, each swing) runs KrinikConanUI Lua on UE4SS's event-loop thread. At the same moment, KrinikConanUI's game-thread
Lua is active: its loops every few hundred ms, and a burst right after a kill (corpse-prompt `SetObject` hook, UserWidget and SizeBox birth notifies for
damage, XP and prompt widgets). Both run in one `lua_State` with no shared lock, the bug-85 mechanism. The crash then lands in KrinikConanUI's next
allocation (`FindAllOf`, a struct return).
*Minimal fix:* remove all six. Clicks on our windows: route LMB through the hero's game-thread `InpActEvt_AnyKey_K2Node_InputKeyEvent_1` (`RegisterHook`, as
Camera does at `main.lua:1931`), or through the windows' own widget events. Esc/Tab for the hub: `krinik_hub_controller.lua:282` already runs `check_soon`
on `GUIModuleController:ActivateModule`, so the ESCAPE/TAB binds are redundant. Esc for mod windows (`pause_in_menu.lua:630`): the same AnyKey hook (key
name `Escape`), or the ActivateModule hook. Guard: change the regex to `\bRegisterKeyBind(Async)?\b` (no `\(`), so `pcall(RegisterKeyBind, …)` is caught.

**F2 · likely crash (in agent runs) · the remote's state.** `KrinikAgentRemote/main.lua:227-228`
`local env = setmetatable({ find_widget = find_widget, log = log }, { __index = _G })` / `local fn, err = load(code, "agent", "t", env)`.
*Scenario:* a probe chunk that armed `LoopAsync` / `ExecuteWithDelay` / `NotifyOnNewObject` / `RegisterHook` keeps running in the remote's `lua_State` for the
rest of the session. A `LoopAsync` stops only when its callback returns `true`. That loop races the remote's own game-thread poll (`main.lua:272`) and its
`FindAllOf("Widget")` commands (see §e).
*Minimal fix:* in `lua_chunk`, refuse chunks that contain `LoopAsync|ExecuteAsync|ExecuteWithDelay|RegisterKeyBind|NotifyOnNewObject|RegisterHook` (the
same kind of pattern guard as `COMPONENT_SWEEP` at `main.lua:222`). Probes that need delays use `ExecuteInGameThreadWithDelay` only.

**F3 · possible crash / long freeze · UE4SS's sample `Keybinds` (enabled by `mods.txt`) on Camera's keys.** `Keybinds/Scripts/main.lua:26`
`RegisterKeyBindAsync(Keybinds[KeyBindName].Key, Keybinds[KeyBindName].ModifierKeys, Callable)`, with the table
`["UHTCompatibleHeaderGenerator"] = {["Key"] = Key.NUM_NINE, ["ModifierKeys"] = {ModifierKey.CONTROL}}`, `["DumpAllActors"] = {… Key.NUM_SEVEN …}`,
`["DumpJMAP"] = {… Key.NUM_FIVE …}`, while Camera binds the same chords: `main.lua:2216` `bind_ctrl(VK.NUM9, nudge("camera_pitch",  cfg.step_pitch))`,
`:2221` `bind_ctrl(VK.NUM5, function()`, `:2479` `bind_ctrl(VK.NUM7, probe_cam_mode_settings)`. Since bug 85, Camera no longer calls `RegisterKeyBind`, so
`IsKeyBindRegistered` returns false and Keybinds takes these chords (the log shows «Starting Lua mod 'Keybinds'»).
*Scenario:* Ctrl+Num9 for camera pitch also starts UHT header generation, and Ctrl+Num7 / Ctrl+Num5 start a full actor dump or a JMAP dump. Each walks
every object on the event-loop thread while the game thread mutates them, and writes files into the game folder.
*Minimal fix:* `Keybinds : 0` in the build's `ue4ss/Mods/mods.txt` (dumpers are a developer tool). Extend the guard to mods enabled by `mods.txt`.

**F4 · possible crash · KrinikConanArchery, corpse records held for the corpse's whole life.** `main.lua:829`
`corpse_arrows[key] = corpse_arrows[key] or { corpse = corpse, inv = inv, items = {} }` and `main.lua:832` `table.insert(per[rec.item], a)`. They are
touched in `main.lua:766` `if not (rec.corpse:IsValid() and rec.inv:IsValid()) then` and `main.lua:773` `if c:IsValid() then c:K2_DestroyActor() end`, on
every quick-loot slot event of ANY container (`main.lua:786`).
*Scenario:* the game destroys the copies and, minutes later, the corpse. A record is removed only after `IsValid()` on its raw pointer returns false, so
the first quick-loot after the memory is freed and reused reads freed memory. That is the class of the project's STALE-REF RULE
(`GAME_ARCHITECTURE_INTERNAL_MAP.md:632`, EXP-0475: «touching the dead ref crashes inside UE4SS»).
*Minimal fix:* store `corpse:GetFullName()` and the copies' full names. Before each touch, re-find them (`StaticFindObject(fullname)` or a `FindAllOf`
filtered by name), and expire records by time (corpse lifespan). This is the pattern `krinik_hub_controller.lua` already uses.

**F5 · possible crash · KrinikConanArchery, `last_corpse` cached raw ref on the late-copy path.** `main.lua:349`
`if on_corpse_born and last_corpse and os.clock() - last_corpse_t < CORPSE_LATE_S then` → `pcall(on_corpse_born, last_corpse)`. Inside, `main.lua:883`
`local cmesh = corpse_mesh(corpse)` → `corpse:K2_GetComponentsByClass(...)` runs with no `IsValid` (`on_corpse_born` has none; only `rebirth` checks at
`main.lua:794`).
*Scenario:* any copy born within 2 s of the LAST corpse anywhere (an NPC killing another NPC nearby, as in the 19:14 run) re-runs the corpse pass. If that
corpse was already destroyed (a quick despawn, a harvest), the call goes through a dead pointer. pcall does not catch an access violation.
*Minimal fix:* keep `last_corpse_name`, re-find the corpse before the pass, and add `if not (corpse and corpse:IsValid()) then return end` at the top of
`on_corpse_born`.

**F6 · possible · async-loading-thread births run unwrapped Lua that touches UObjects.** `krinik_ui_fixes.lua:294`
`NotifyOnNewObject("/Script/UMG.SizeBox", function(box)` (property writes `box.MaxDesiredWidth = GLYPH_MAX_W`); `krinik_shout_fade.lua:176`
(`entry.RenderOpacity = 0.0` plus RegisterHook); `krinik_hub_controller.lua:184` (every UserWidget); Archery `main.lua:933` (`corpse:GetFullName()`); Music
`main.lua:158`.
*Scenario:* when a widget blueprint or corpse class loads on demand at the kill (the first kill of a creature type, the first XP or damage widget), the
loader constructs its archetypes and CDO. If that happens on the async loading thread, UE4SS fires these callbacks there, which is again Lua off the game
thread in our states. The guard's GAP line names this case.
*Minimal fix:* every `NotifyOnNewObject` body becomes `ExecuteInGameThread(function() … end)`, with nothing but a name copy before it. Prefer class-specific
paths over `/Script/UMG.SizeBox` and `/Script/UMG.UserWidget`.

**F7 · hygiene → possible · Graphics re-enters its own hook inside a kill.** `KrinikConanGraphics/main.lua:220` → `arrow_blood` → `d:SetFadeOut(0.0, ARROW.life, true)`,
which fires `main.lua:154` `RegisterHook(HOOK, function() end, on_fade_out)` (the `busy` flag is set only inside `on_fade_out`). The callback runs after the
`TakeProjectileDamage` body, so `SpawnDecalAtLocation(target, …)` uses the dying target as world context. The comment at `main.lua:217` («Работа — в
ПРЕ-перехвате») contradicts EXP-0487 (callbacks of BP functions run after the body).
*Minimal fix:* spawn the decal in an `ExecuteInGameThread` on the next tick, copying only the location in the hook; call `SetFadeOut` there.

**F8 · hygiene · Archery `StopProjectileInternal` callback.** `main.lua:554` `local ok, err = pcall(RegisterHook, STOP_FUNC, function(ctx)`: the body is
not in a pcall. `main.lua:425` `tdc:UpdatedHeardActors({ hero })` runs on NPCs in the radius, including the dead victim. `visuals` is keyed by
`actor:GetAddress()` (`main.lua:595`), so it can hit a reused address.
*Minimal fix:* skip NPCs that are dead (`IsDead` / health 0) and defer `alert_near` to the next tick. Key `visuals` by full name.

**F9 · hygiene · KrinikConanCamera two delayed actions of the same delay.** `main.lua:2038` `ExecuteInGameThreadWithDelay(1600, function()` (neck hooks +
key hook) and `main.lua:2046` `ExecuteInGameThreadWithDelay(1600, function() pcall(try_install_zoom_hook) end)`. This is the EXP-0486 class: one of them
can be silently skipped, which would leave the keys or the zoom hook unarmed. Not a crash.
*Minimal fix:* fold both into one delayed action and log each step.

**F10 · hygiene · harness mods are enabled in the owner's build.** KrinikAgentRemote (runs arbitrary Lua from a file, `main.lua:272` poll),
KrinikConanBench (`main.lua:502` `LoopInGameThreadAfterFrames(1, …)` every frame), KrinikMenuProbe — each with `enabled.txt` in the game folder. They are
outside the five shipped mods. Keep them only for agent sessions.

Stale raw refs that are lower risk (not on the bow-kill path, but they are the same class): UI `krinik_feedback.lua:51` `table.insert(menus, { menu = m, button = b })`;
`krinik_ui_fixes.lua:93` `infos[name] = w`, `:123` `tracker = w`; `krinik_pickup_prompt.lua:171` `strips[#strips + 1] = w` and `pc_cached` / `hero_cached`
(`:168`); Music `main.lua:156-157` `stage = s` / `audio = a`; Camera `main.lua:450` `local arm = nil` (the hero's spring arm, polled every frame and every
30 ms. After the hero's death the code itself relies on `arm:IsValid()` turning false, `main.lua:1049`).

## (d) What I could NOT determine

- **What UE4SS 1181's `IsValid()` does on a freed pointer.** If it reads `InternalIndex` from the object's memory, it is not a guard against stale refs,
  and F4/F5 become likely rather than possible. The UE4SS source is not on this machine (searched D: for `LuaMod.cpp` / `LuaUObject.cpp`, none found).
- **Whether Conan 3.0.1 runs the async loading thread** (`s.AsyncLoadingThreadEnabled`). It is not in `Saved/Config` or `_config/*.ini`. F6 depends on it.
- **Whether `owner.OnDestroyed:Remove(dummy, "…")` (`main.lua:905`) is supported by 1181 and safe on a multicast inline delegate.** It is pcall'd, and the
  log line «отвязано N из M» would answer whether it works, not whether it is safe.
- **Which KrinikConanUI game-thread Lua actually overlapped an LMB press in any crash.** This recon gives the mechanism and the sites, not a captured
  overlap. Only one crash stack exists per crash, and it shows only the victim thread.
- **The UE4SS session log of the 19:14 crash.** The game was restarted at 19:18 and `ue4ss/UE4SS.log` was overwritten. The crash folder's file list
  showed a `UE4SS.log` once and not a minute later. So the probe history in the remote's state could not be read.

## (e) The 2026-11-10 19:14:34 crash in the agent's run (datapoint from the coordinator)

Facts as given: `EXCEPTION_ACCESS_VIOLATION reading address 0x000000000000000a` (I checked `CrashContext.runtime-xml` `<ErrorMessage>`), crash folder
`UECC-Windows-67A04B4E49867DEF115B83A157440469_0000`. The crash folder's `ConanSandbox.log` last lines show `KillCharacterWithRagdoll_Implementation.
KillerNameInput: NPC_PREFIX_EAAWildlife_Scorpion_Feral` at 16:14:27.416 and 16:14:33.662 UTC: an NPC killed by a scorpion, no bow. The stack: game tick →
LuaMod delayed-action dispatcher → `Lua::call_function` → two Lua VM entries → `process_lua_function` → a LuaMod.cpp global → `LuaType::auto_construct_object`
→ the `HasAnyInternalFlags` region → **the crash inside the Lua VM**. The remote's pending command was `funcs BasePlayerChar_C` → `find_widget` →
`main.lua:102` `for _, w in ipairs(FindAllOf("Widget") or {}) do`.

**Off-thread Lua that could run in the REMOTE's state at that moment.** The remote's own code has none. The guard on `KrinikConanHarness` gave 0. Its only
loop is `main.lua:272` `LoopInGameThreadWithDelay(POLL_MS, …)`, which runs each command through `ExecuteInGameThread(function() run(cmd) end)`. It has no
key binds, notifies or hooks. **Agent-injected chunks are the only candidates** (`main.lua:227-228`, F2). Any earlier `lua` chunk that armed `LoopAsync`
keeps running until its callback returns `true`; «finished, I believe» does not stop it. Any chunk that armed `NotifyOnNewObject` or `RegisterHook` stays
armed for the session too, and fires on births. The EXP-0443 pattern was exactly this: a probe `NotifyOnNewObject` on particle components crashed the game
half a second after a kill (blood particles). An NPC death 0.7 s before this crash fits that pattern as well. Check the probe chunks of this session for
`LoopAsync` without `return true` and for any `NotifyOnNewObject` or `RegisterHook`.

**Off-thread Lua in ARCHERY's state at that moment.** None from Archery's code: no key binds (guard: 0), no async delays. The only possible case is the
F6 one: `main.lua:933` (corpse birth, unwrapped). The NPC corpse is spawned by the game thread during `KillCharacterWithRagdoll`, so that callback ran on
the game thread. Also, Archery's heap is not the remote's heap. Each mod has its own `lua_State`, so a race in Archery's state would crash in Archery's
Lua, not inside the remote's `FindAllOf`. The «копий 0» line 0.7 s earlier is most likely a coincidence of timing. (A Lua use-after-free can corrupt the
shared CRT heap, but that is a weaker link than a race inside the remote's own state.)

**Heap race or dead-object wrapper?** The stack fits a **corrupted Lua heap (a race in that state)** better:
- `FindAllOf` builds wrappers only for objects it has just read from the live object array (the `HasAnyInternalFlags` frame is that filter). It does not
  touch an old wrapper. A dead-object fault would crash in UE4SS's C++ while reading the UObject (in `HasAnyInternalFlags`, `auto_construct_object` or
  `GetFullName`). Here those frames returned, and the fault is **inside the Lua VM**, at a near-null address (0xa = a null base plus a small field
  offset), which looks like a broken Lua-internal pointer.
- `FindAllOf("Widget")` creates thousands of userdata in one call: the allocation pressure that drives GC steps, which traverse the whole heap and fault
  on the first corrupted object.
- **Bug 85's stack has the same shape:** delayed-action dispatcher → `call_function` → nested Lua → `process_lua_function` → UE4SS converting C++ data
  into NEW Lua objects (`convert_struct_to_lua_table` there, `auto_construct_object` here) → a fault in the Lua VM at a garbage address
  (0xffffffffffffffff there, 0xa here). Both are «a Lua allocation from a UE4SS conversion finds the heap already broken». Neither is «a read of a
  dead UObject». So the 19:14 crash is in the same class as bug 85, in the remote's state. The likely source is Lua the agent injected earlier that still
  runs off the game thread (or a probe notify still armed), not the `funcs` command itself.
- What would refute this: the session's probe chunks show no `LoopAsync`, `NotifyOnNewObject`, `RegisterHook` or key bind ever armed in the remote's
  state. Then the next suspects are the UE4SS-internal class (#1180, overlapping actions) and a genuinely half-constructed widget in the object array.

*Minimal fixes:* F2 (refuse arming calls in `lua_chunk`). For recon, `find_widget` should take a class (`FindAllOf("<ClassName>")`) instead of the whole
`Widget` base class: one call over all widgets is the largest single allocation burst the remote makes.
