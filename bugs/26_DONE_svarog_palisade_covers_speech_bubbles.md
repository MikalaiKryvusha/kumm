# Bug 26 — Svarog's Dream: частокол перекрывает пузыри речи над головами

**Status:** ✅ DONE 2026-10-09 09:17 — буквы пузыря шейдером TMP Overlay (ZTest Always зашит), проверено в сейве владельца с контролем
**Severity:** S2 — реплики жителей у ограды не читаются; данные не задеты
**Version/build:** SvarogsDream `2a4ed60` (KrinikUIRework, после правки бага 23) · **When/context:** 2026-10-07 ≈21:50, сообщено
владельцем из своей игры во время закрытия чата

## Symptom

`[OWNER]` «баг - частагол перекрывает пузыри с речью над головой пурсонажей» · 2026-10-07 ≈21:50.
Ожидается: пузырь речи (плашка и текст) поверх всего мира, как поверх крыш после бага 23.

## Repro (deterministic)

Не воспроизведено агентом. Кадр игры владельца 21:51 (`SvarogsDream/_harness/owner2.webp`, вне git): ворота Бора, два стража у
частокола, пузыря в момент снимка нет — место, где воспроизводить. План: житель у частокола (Бор, у таверны — наёмник `[25]Mercenary2` стоит у ограды) → реплика над
головой → кадр.

## Root cause / Hypotheses (ranked)

1. Частокол рисуется ПОСЛЕ холста пузыря (прозрачная очередь — альфа-обрез/прозрачный шейдер с renderQueue выше UI мира), а
   «поверх всего» у пузыря — только ZTest Always (`BubbleOnTop`, `BubbleBox.Fit`): глубину он не проверяет, но порядок рисования
   не меняет — что рисуется позже, ложится сверху.
2. Крыши — непрозрачная геометрия (рисуется раньше UI), поэтому баг 23 с ZTest их победил, а частокол — нет.

## Fix plan

Кадр у частокола → `mats` материала частокола (renderQueue, шейдер) → поднять очередь холста пузыря (`Canvas.sortingOrder` /
`material.renderQueue` выше прозрачной очереди мира) — проверить, что плашка и текст поверх частокола и крыш.

## Fix — по коду, в игре у частокола не проверено (2026-10-07 22:11)

`KrinikUIRework/BubbleBox.cs`: корневому холсту пузыря в мире — `sortingOrder = 30000` (порядок игры хранится, выгрузка мода его
возвращает). Прозрачные объекты Unity сортирует по слою и порядку прежде расстояния, поэтому пузырь рисуется последним среди
прозрачного; непрозрачное (крыши, вырезные колья с очередью ≤ 2500) рисуется раньше и уже побеждено ZTest Always (баг 23).

Проверка 22:08–22:16: в сейве владельца герой душой в подземном мире, частокол Бора не загружен (`findall Palisade` — только
разрушаемая стена другой области, выключена). Переносить героя не стал: игра пишет сейв на событиях квестов и подземного мира
(`QuestManager:393`, `UnderworldManager:270`), а это сейв владельца. После правки пузырь над героем рисуется как прежде (кадр
`c8c9`) — порядок холста показ не сломал. Материал частокола (очередь, шейдер) не снят: гипотеза о прозрачной очереди не подтверждена.

**До DONE:** у частокола Бора с живым героем — реплика жителя или героя (`call PlayerCommentsManager MakeComment Bor 1`) так, чтобы
колья были между камерой и пузырём; кадр; при неудаче — `mats <имя материала частокола>` (очередь, шейдер).

## Reproduced 2026-10-09 08:59 — the plate wins, the LETTERS lose

Run `testcases/TC_svarog_grooming_run_2026-10-09.md` (owner's save restored after; hero made immortal by the new harness
command `static WorldState isGodMode True` — Faith soldiers and a werewolf killed him twice at the gate). At the Bor gate a
guard's bubble lay over the gate leaf: the white PLATE is drawn over the stakes (the 30000 sorting order + ZTest Always of the
plate work), but the TEXT is cut out wherever stakes stand in front — «Будь н… заметишь что подозрительное.», «…й.» (frames
`SvarogsDream/_harness/q2_c.webp`, `q3_c.webp`). So the defect is depth, not order: the glyphs are drawn by the TMP sub-object
(`TMP UI SubObject [Manrope-Medium Material (Instance)]`), `Fit()` set ZTest Always on that sub-object's material ONCE, and the
next mesh rebuild of TMP re-assigns the shared fallback material (ordinary depth test). Bug 23's fix had the same hole — it
passed at the tavern because no rebuild followed.

Fix (built, not yet deployed — the owner was recording a video in the running game): `KrinikBubbleFit.KeepTextOnTop()` in
`LateUpdate` sets ZTest Always every frame on the materials TMP actually uses now (`fontSharedMaterial` and every sub-object's
`sharedMaterial`) — on the shared material itself, which TMP re-assigns but does not recreate.

## Owner's word 2026-10-09

`[OWNER]` «26 — частокол закрывает пузыри речи - провтестировать» · 2026-10-09, до 08:36 — тестирует агент сам.

## The road to the fix 2026-10-09 09:00–09:17 — four refuted hypotheses, one that held

All in the owner's new save at the Bor gate (dawn), `testcases/TC_svarog_grooming_run_2026-10-09.md`:

| # | Hypothesis | Test | Result |
|---|---|---|---|
| 1 | Sub-object material loses ZTest Always on the next TMP mesh rebuild | `KeepTextOnTop` every frame on `sharedMaterial` (C16) | refuted — owner's word «крыша дома, частокол - пузырь видно, а текст перекрыт» |
| 2 | The drawn copy is `materialForRendering` (mask/stencil copy) | log «bubble mats …» before setting (C17) | refuted — one instance, `z8` (Always) already set; letters still hidden |
| 3 | TAA smears transparent letters | `SetAntiAliasing False` (K5) | refuted — still cut |
| 4 | Depth of field / post-processing | `PostProcessLayer.enabled = False` (K6) | refuted — still cut (owner, independently: «глубины резкости … я никакой не вижу в игре») |
| 5 | Shader built ignoring the property | UnityPy on `resources.assets` (K7) | refuted — `unity_GUIZTestMode` is read; BUT the build carries `TextMeshPro/Mobile/Distance Field Overlay` with ZTest Always baked in (8) |
| ✅ | Give the letters the Overlay shader | `Dialogue.BubbleOverlayShader` true vs false in one world (C19) | **holds** — true: «За преступление здесь карают смертью.», «Говорят, в округе видели диких зверей.», «С Домом Веры Бог.» whole over roof, stakes and pines; false: «Не ст[...]ера наша» cut. Owner: «ТЫ СДЕЛАЛ!!!» |

**Why the property route failed — NOT established.** The plate (UI/Default, same property) wins; TMP letters with the same
property value lose; the Overlay variant also sits in queue 4000 (after all transparent). The fix is by FORM (a shader with the
state baked in), so the unexplained part cannot return through a material property. Owner's own lead, unexplored: how the
building surfaces' shaders are compiled («может дело в том, как скомпилировны шейдеры поверхностей строений?»).

**Hygiene left:** the property writes of bugs 23/26 (`Dialogue.cs` 150, 212; `BubbleBox.cs` Fit) are now redundant; the
`BubbleTextQueue` experiment setting stays at 0 (off). Harness `cfg` without a value throws IndexOutOfRange (S3).

## ✅ STATUS: DONE (2026-10-09 09:17)

Hygiene: build green. Functional run: owner's save at the Bor gate, guards' greetings over the gate, stakes, a roof and a pine
with the Overlay shader on and off (C19) and again after (frames `now1`, `now2`, 09:17). REAL WORLD: accumulated — the owner's
own save of 09:12 and his live game; path — his game with the mod, the same window he watched.

## Decisions made without the owner

- `[AI]` Overlay shader ON by default (setting `Dialogue.BubbleOverlayShader`, can be switched off in the mod menu).
- `[AI]` Hero immortality for the run via the new harness command `static WorldState isGodMode True` — not saved to the save.
- `[AI]` Experiments ran in the owner's running game while he watched; the off-phase of the control briefly hid the letters again
  (he saw it: «потом опять стал прятаться!»).

## Links

Баг 23 (пузырь под крышей), `src/KrinikUIRework/BubbleBox.cs`, `Dialogue.cs` (`BubbleOnTop`).
