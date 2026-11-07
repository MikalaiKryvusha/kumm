# Bug 67 — Conan 3.0.1: shadows of palm leaves flicker

**Status:** 🔴 OPEN · **Severity:** S2 · **Version/build:** Conan Exiles Enhanced 3.0.1 (UE 5.8), the 3.0.1 build of the pack
**When/context:** raised by the owner 2026-10-29 00:2x while playing in the agent's run: `[OWNER]` «и очень сильно бесит баг с мерцающими
тенями от листвы пальм...» · «нужна повторная разведка, как это можно исправить» · «это беды UE5, как я понимаю...». The same symptom was raised
2026-09-16 on 2.1.1 («я стою под пальмами, и тени от их листьев мерцают»).
**Fixing:** this session — a new recon (`researches/conan-shadow-flicker/2026-10-29_recon.md`), then A/B runs by its plan, the owner's eye decides.

## The owner's requirement (2026-10-29, after the 2.0 revert)

`[OWNER]` «МОЙ ВЫБОР: ПЛАВНОЕ СОЛНЦЕ И НЕ МЕРЦАЮЩИЕ ТЕНИ!!!!!!!!» — both, neither bought with the other: `DynamicSky.SolarUpdateAngleDelta`
stays 0.003 (or any value whose steps are not seen), and the leaf shadows do not flicker. Search order: levers that do not touch the sun
(recon R3 DLSS model/mode — now Balanced, preset F; R4 `ResolutionLodBiasDirectional` −1.0 → −1.5/−2.0; R7 `UseReceiverMaskDirectional`), then any
cvar that keeps VSM pages from invalidating on a small light rotation; verify each by a 60 fps clip under palms and the owner's eye.
The bar is other games: `[OWNER]` «как в других ИГРАХ!!!!» · «и плавно, и не мерцает!» — first recon step: how shipped UE5 games with a moving sun and
VSM (and their community fixes) keep both — Epic's guidance on time-of-day with VSM, the settings those games ship.
`[OWNER]` «эти ебучие тени не должны перерисовываться и пересчитываться так часто!» — the target design: the visible sun moves smoothly, the
shadow-casting light (and the VSM cache) updates rarely. Recon of that question — `researches/conan-shadow-flicker/2026-10-29_light-rotation-cache.md`.

## The owner's word 2026-11-06 19:22 +03:00 (verbatim) — the 2.0 step is NOT the answer

> Я тебе скажу честно, что я думаю по этому поводу: это какоё-то полный дибилизм!!! Я видел множество игру, где тени плавно динамически двигаются, при этом в старых играх! И нет никаких мерчаний. А эта игра на суппер современном UE 5.8!!! И вы блять вынуждены тени перерисовывать раз в несолько секунд - ЭТО ЧТО-ТО ВОПИЮЩЕ НЕПРАВИЛЬНО ИЛИ В УСТРОЙСТВЕ ТЕНЕЙ В ИГРЕ, ИЛИ В НАШЕМ ПОНИМАНИИ УСТРОЙСТВА ИГРЫ!

`[OWNER]` 2026-11-06 19:23 «по этим ебучим теням - нужна глубокая разведка кода. устройства игры, устройство UE 5,8 d bynthytnt!» («в интернете» typed in the
English layout) → three recon tracks: the internet (Epic docs, shipped games), the GAME's own setup (palm assets, foliage material WPO, the sky blueprint and its
directional light — Dev Kit + paks), the ENGINE's code (UE 5.8 VSM cache invalidation, if the EpicGames source is reachable).

`[OWNER]` 2026-11-06 19:26 (verbatim): «Ты уже находил и утверждал ранее, что тень листьем пальм мерчает из-за перерисвовывания кеша. Кеш перерисовывается из-за
нашего плавного движения света. Я МИЛЛИОН РАЗ видел играх ДИНАМИЧЕСКИЕ тени и свет. Где И солнце плавно двигает, И ничего не мерцает, И КЕШ не жрёт
вычислительные ресурсы из-за постоянных перерисовок. НУЖНО ПОНЯТЬ, КАК ЭТО СДЕЛАТЬ У НАС В КОНАНЕ!» → **the acceptance, all three at once: the sun moves
smoothly · the leaf shadows do not flicker · the shadow cache is not re-rendered constantly.**

Reading (`[AI]`): the sun-step 2.0 is a compensating patch (HOUSE_RULES rule 24) — it hides the symptom. Next, in this order: (1) recon of Epic's
VSM guidance and shipped UE5 games with a moving sun and wind-swayed foliage (cache invalidation by WPO, WPO disable distance for shadows) — sources,
not reasoning; (2) the never-run discriminating run `r.Shadow.Virtual.Enable=0` under palms (VSM vs the temporal upscaler), 60 fps video; (3) the cause
fix with the sun smooth again. Fixing: right after the KrinikConanMusic run of 2026-11-06 evening.

**Recon and measurement 2026-11-06 19:40 +03:00:** the game separates the sun disk from the shadow light (`SolarUpdateAngleDelta` help); the web recon (Epic, Fortnite):
the light's turn re-samples the pages — the cause is the rotation, not the re-draw. Measured at the oasis (report `testcases/reports/2026-11-06_conan-palm-shadow-sun-step.md`):
0.003 flickers ≈ 2× more; 0.1 and 0.25 are as calm as 2.0 with steps 8–20× smaller; our bias −1.0 is coarser than the game's −1.5. Candidate fix:
0.1 or 0.25 + bias −1.5 — clips for the owner's eye in review folder 68; the build unchanged until his word. **INVALID (20:37, the owner rejected folder 68 — the clips are overexposed: HDR desktop <!-- attribution-ok: a choice still waiting for the owner, no decision of his is claimed -->
captured without `hdr.ps1 off`); the build stays at 2.0 / −1.0.** Also: the series ran without a fixed time
of day (≈ one game hour passed, EXP-0469) — re-run with `SetTimeOfDay` before each clip after the 19:42 long run.

## Measurement 2026-11-07 14:2x–14:4x +03:00 — clean stand (report `testcases/reports/2026-11-07_conan-palm-shadow-levers-wind-steps.md`)

Fixed CameraActor, time 14.0 before each clip, window capture (no HDR overexposure), wind off and on. `[OWNER]` 14:19 «хотя мерцания во много вызванны ветром» ·
«так как это сдвигает лист - и он от появляется в тени, то исчезает». Seen: the every-frame light (0.003) flickers with AND without wind; a still light is
the calmest; finer texels (−1.5/−2.0) do not help (lever 1 of 13:04 refuted); steps 0.1° and 0.25° are as calm as 2.0, 0.05° blinks per step. Candidate:
0.1° — review folder 71 for the owner's eye; the build stays at 2.0 until his word. Open: is the sun DISK smooth at a stepped light (help says yes, not seen);
path B (crossfade in the kit) if he sees the 0.1° steps.

**The owner's word 2026-11-07 14:53 +03:00 (verbatim, after review folder 71):** `[OWNER]` «МЕНЯ НЕ ЕБЁТ КАК НА 2 ГРАДУСАХ!!! 2 ГРАЗУСА, 0.1 ГРАДУС - это
ЕПРИЕМЛЕМО РЕЗКОЕ ДВИЖЕНИЕ ТЕНЕ!» → **any light step is rejected (2°, 0.1°, 0.25° alike); the shadow moves continuously — the light turns every frame — and does
not flicker.** The 0.1° candidate above is withdrawn. Levers left that keep the light continuous: ray-traced sun shadows (recon pattern G), denser / softer
VSM sampling (SMRT rays, samples, light source angle), the leaf shadows themselves (the owner's 14:19 reading: a leaf moved by the wind pops in and out).

`[OWNER]` 2026-11-07 14:54 «нужно сделать ПЛАВНОЕ ПЕРЕМЕЩЕНИЕ СВЕТА И ТЕНЕЙ, РЕЗКИЕ ЧЕТКИЕ ТЕНИ, НА КОТОРЫХ ЛИСТЬСЯ НЕ МЕРЦАЮТ ОТ КАДРА К КАДРУ!!!!» · «ты там что-то
говорил про то, чтобы сделать листья плотнее, чтобы они не игнорировались в отрисвовщике теней - почему не сделал?» → acceptance: continuous light, SHARP
shadows (blur levers out), no frame-to-frame leaf flicker; next — lever 2: the palm leaf material's opacity-mask clip value in the shadow pass (kit asset edit).

**Refuted 2026-11-07 15:0x–15:2x at continuous light** (report, section 5a): SMRT 32/16; Nanite `MaxPixelsPerEdge` 0.5/0.25; ray-traced sun shadows (blobs from the
palms' baked RT proxies); the mask lever (the palm leaves are opaque geometry, `M_Foliage` blend 0). Three-attempts rule reached → `/bug-research` next.

**Open check (2026-11-07 15:3x, `[OWNER]` 15:30 «это сплошная геометрия, Так а какого хуя она то отбрасывает тень. то не отбрасывает?»):** the mechanism
told to him — a leaf thinner than one shadow texel hits or misses the texel sample points as the grid shifts with the turning light (and the wind). By that
mechanism −1.5 / −2.0 MUST calm it, yet the metric saw no change → first verify the lever took effect at all: one frame crop of a leaf shadow edge at −1.0
vs −2.0, same pose and hour (`fixed-cam.lua`); identical edges = the cvar did not reach those pages (clipmap level / `…Moving` / page pool), not «did not help».

**`[OWNER]` 2026-11-07 15:31 «МОЖНО ЛИСТЫ ПАЛЬМ СДЕЛАТЬ ТОЛСТЫМИ НАХУЙ?»** → the path: thicken the leaves ONLY in the shadow pass — `Shadow Pass Switch`
in the leaf material drives a WPO that widens each frond in its own plane (or pushes along the normal), so the shadow-casting leaf is wider than a shadow
texel and stops slipping between sample points; the visible leaf unchanged, the shadow stays sharp. The palms' parent material is
`/FLX_Materials/Materials/Environment/Core/M_Foliage` (read live 15:3x) and it IS in the kit: `F:/CEUE5Devkit/UE4/Plugins/FLX/FLX_Materials/Content/Materials/
Environment/Core/M_Foliage.uasset` (the palm MIs are not). `M_Foliage` is shared by all foliage → every tree / bush shadow gets the same treatment.
`[OWNER]` 15:32 «ДЕЛАЕМ» · «УЗНАТЬ ТЕКУЩУЮ ТОЛЩИНУ ЛИСТА» · «ЗАТЕМ ПОПРОБОВАТЬ ТОЛЩЕ в 2 раза в 3 раза в 4 раза в 5 раз и так далее, пока не будет найдена
толщина, при которой листы не мерцают!» → steps: (1) measure the leaflet width from the mesh (kit export), compare with the shadow texel; (2) a shadow-only
widening factor as a material parameter; (3) ×2, ×3, ×4, ×5… under the clean stand (continuous light 0.003) until the flicker is gone.
`[OWNER]` 15:35 «Частоту смещения теней ставим 0,03» · «зовешь меня голосом смотреть в игре тени, Я САМ БУДУ СМОТРЕТЬ! Ты ставишь толщину листа - зовешь меня» →
the tests run at `DynamicSky.SolarUpdateAngleDelta 0.03`; each thickness is judged by HIS eye live in the game, called by voice — not by the agent's metric.
**15:4x — the leaf can't be widened in the material yet** (kit 15:35–15:39: the kit holds only a 64-triangle fallback of the palm mesh; `M_Foliage`'s WPO lives in
`MF_FLX_UVPivot_WPO` / `MF_FLX-TreeMotion`, pivots baked in UV1/UV2, no «side of the midrib» data — `kit-probe-mf-graph.py`). Equivalent for the shadow: a texel 2×
finer = a leaf 2× thicker relative to the grid. Recon `researches/conan-shadow-flicker/2026-11-07_continuous_sun_crisp_foliage.md` found the confound of the −1.5/−2.0
refutation: the VSM dynamic-res throttle (live: `DynamicRes.MaxResolutionLodBias 2.0`, `MaxPagePoolLoadFactor 0.85`, pool `MaxPhysicalPages 4096`) can coarsen the
shadow by up to 2 steps while the sun re-renders the map. Live with the owner 15:43: delta 0.03, throttle 0 / 0, pool 8192, then bias −1 (×1), −2 (×2), −3 (×4),
−4 (×8) — his eye per step. `[OWNER]` 15:43 «смещение солнца ещё плавнее, 0,01» · 15:44 «еще плавнее в 2 раза» (→ 0.005) · 15:45 «вот теперь тени ПЛАВНЫЕ!!!! Но
листья мерцают!!! Делаем листья ЕЩЕ ТОЛЩЕ!» → **delta 0.005 = smooth by his eye**; leaf ×1 flickers → ×2 (bias −2.0) set 15:45. `[OWNER]` 15:43 «камеру мне отдай!!!»
**15:45–15:47 by his eye, throttle off, pool 8192, delta 0.005:** ×2 (−2.0) «мерцают листья», ×4 (−3.0) «мерцают», ×10 (−4.3; `Clipmap.FirstLevel` 6 — no floor hit)
flicker on → **the «leaf thinner than a texel» mechanism is REFUTED by the owner's eye** (the texel near the palms is sub-centimetre, a leaflet several cm). Bias back
to −1.0 at 15:48. `[OWNER]` 15:48 «толще листья ав 100 раз, не трогай точность» · 15:49 «ПРАВЬ НАУЙ МАТЕРИАЛ И ПЕРЕЗАПУСКАй!» · 15:50 «плавнасть солнца
запомнил какая нужна?» (→ 0.005 written into the pack's Engine.ini) · 15:51 «текперь нужно при этой плавности добиться - четких теней листвы пальм - без мерцания
отдельных листиков off/on его тени» → **acceptance now: delta 0.005 + crisp palm-leaf shadows + no leaflet shadow popping off/on**; the route — the leaf material
(`M_Foliage`, shadow-pass-only enlargement around each leaf's pivot, factor live), a kit build and a restart.
**15:5x — the material route is CLOSED by the data** (T3D export of the FLX functions, `devkit/kit-export-t3d.py`): the palm wind is mask-based —
`MF_BranchBend` = mask (UV / vertex-colour weights) × wind vector, `MF_LeafShimmer` = lerp × `VertexNormalWS`; no per-leaf pivot or axis exists in the palm data
(`MF_FLX_UVPivot_WPO` is behind `UVPivotWind_Enable`, default off), so a shader cannot know where a leaf's edges are → no true «thicker leaf». New lead for
the leaflet pop: Nanite re-selects simplified clusters for every shadow re-render, so edge leaflets drop in and out; `r.Nanite.MaxPixelsPerEdge` 1.2 → 0.25 set live
15:5x for the owner's eye (the earlier metric run of 0.5/0.25 was on a box of mostly solid shadow — not a verdict).
**16:00–16:08 live with the owner (11:00, review folder 72):** 144-fps captures (the game gives ≈ 40 fps) — `leaf_pop_finder.py` frames 73–78: a long frond tip
shadow present (73, 74), gone (75–77), back (78) — `kadry_73_80_ten_lista_strelki.webp`; `[OWNER]` 16:04 «вот, ты увидел» · «и таких мест ДОХУЯ» · 16:05 «Дело не в
кочниках» · «они пропадают ПО ВСЕМУ ПЯТНУ КРОНЫ ПАЛЬМЫ». Refuted by his eye: `Clipmap.WPODisableDistance 0` (still pops), `r.Shadow.Virtual.Cache 0` (still pops;
blink map `shadow_pop_map.py`: 1677 vs 1494 blinking ground pixels). `[OWNER]` 16:08 «это ебучий алгоритм какой-то, который решает, как луч проходит через лист, и
будет лист отбрасывать тень, или нет» · «нужно этот ебучий алгоритм переделывать!» · «чтобы КАЖДЫЙ ЛИСТ ВСЕГДА тень отбрасывал!» → that algorithm is SMRT (shadow-map
ray tracing: per-pixel rays with a NEW random direction and texel dither every frame — kit shader `VirtualShadowMapProjectionDirectional.ush`); set live 16:08:
`SMRT.RayCountDirectional 0` + `SMRT.TexelDitherScaleDirectional 0` (one fixed sample per pixel — every leaf casts every frame, a hard sharp edge), cache back on.
**REFUTED 16:09** `[OWNER]` «пиши видео, сейчас полный пиздец стал, сильно хуже стало!» · «этилистья начали рендерится как шкалы прогресса»; blink map: 50 851 blinking
ground pixels vs 1 677 with SMRT on (×30). Reading `[AI]`: the blinking is the shadow-map texel grid re-sampled at every light turn; SMRT's random rays + dither
HIDE it (blur the stair steps), they do not cause it — without them the grid crawls visibly («progress bars»). Restored 16 rays / dither 2 at 16:09.
16:10 SMRT 32 rays / 16 samples: `[OWNER]` 16:11 «мерцают и рендерятся, медленнее рендерятся, но всё равно» · «исчезают, появляются и заполняются» (blink map 2 276 vs
1 677 — no gain); restored 16 / 8. 16:12 DLSS off live (the «fill in» = temporal history?) — his verdict pending; `[OWNER]` 16:12 «иди в интренте в разведку, чем это
вызвано» → recon `researches/conan-shadow-flicker/2026-11-07_leaf_shadows_fill_in_recon.md` (a helper); «ставь 11 утра»; «тень нужно ещё плавнее в 2 раза» →
**delta 0.0025** (pack Engine.ini updated). Live now: 11:00, delta 0.0025, DLSS 0, throttle 0/0, pool 8192, SMRT 16/8, bias −1.0, Nanite MaxPixelsPerEdge 0.25.
16:13 DLSS off: `[OWNER]` «если сейчас ДЛСС выключен, то не помогло, мерцают»; blink map 15 391 vs 1 677 (raw SMRT noise without temporal AA) — DLSS back on.
Summary of the live day: every per-frame lever only hides or reveals the same thing — the shadow grid re-sampled at each light turn; the next step is the
helper's recon of WHY leaflets vanish for frames (page feedback one frame late, HZB/instance culling of casters, Nanite shadow raster budget).
**16:26 DECISIVE (recon `2026-11-07_leaf_shadows_fill_in_recon.md`, its first test):** the light STILL (delta 2.0) + `r.Shadow.Virtual.Cache.ForceInvalidateDirectional 1`
(the map re-rendered every frame) → 169 666 blinking ground pixels (25.6 %) vs 1 677 normally — **the leaflets are lost by the shadow RE-RENDER itself, not by the
rotation**. Prime suspect: Nanite cluster buffers overflow in the shadow pass (Funcom's Windows_HighVRAM profile halves MaxVisibleClusters 4194304 → 2097152 and
MaxCandidateClusters 16777216 → 8388608; an Epic VSM engineer on a Conan thread: «I'd focus on the Nanite buffer overflow investigation first»). NEXT, in order:
`nanitestats virtualshadowmaps` at delta 2.0 vs 0.0025; double MaxCandidateClusters / MaxVisibleClusters / MaxNodes (+ `r.Shadow.Virtual.Nanite.AllowMultipassViews 1`) and
re-run the forced re-render test; then `r.Nanite.Streaming.QualityScale.MinQuality 1`, StreamingPoolSize 1024; `r.Shadow.NaniteLODBias 0`. A winning value may need a
`[ConsoleVariables]` / Lua route — the device profile outranks SystemSettings. Values restored 16:27 (0.0025, ForceInvalidate 0).
**CORRECTION 2026-11-07 16:57 +03:00 — the 16:26 «decisive» count is NOT valid evidence.** It counted the old fixed «ground area», which on the owner's low
camera under the palm held the crown itself (wind on the visible fronds); the stand was not kept clean either (`[OWNER]` 16:45 «Что твоего героя пиздят со всех
сторон!» · «и камера вращается от неактивности!»). Re-run on a CLEAN stand (`stand-keeper.sh` 600 m / 20 s, god, `fixed-cam.lua` dz 350 pitch −55, 11:00, blinks
counted only in a box of bare sand with the palm shadow, `shadow_pop_map.py … 250,470,1500,940`): still light 534 px (0.09 %); still light + forced re-render
every frame 325 / 123 px (A / A2); + Nanite buffers ×2 157; + `r.Shadow.NaniteLODBias 0` 338; + `QualityScale.MinQuality 1` 1167 (0.20 %) — **all within noise:
the per-frame shadow re-render does NOT drop leaflets on the sand.** The Nanite-overflow lead (C1) loses its basis; the live symptom is under the TURNING sun —
series «T» (0.0025) vs «S» (still) with the same levers is next. The owner saw «переставало мерцать» (16:52) during clips C (LODBias 0) / D (MinQuality 1) of the
re-run, on the still light — the counts above do not single either out. The first series of 16:4x (hero beaten, camera orbiting, crown in the box) — void.
**17:0x — THE TURNING SUN IS THE TRIGGER (clean stand, same box):** sun 0.0025 → 156 929 / 154 473 blinking px (26.7 % / 26.3 %, T / T2); sun still → 1 106 (0.19 %);
turning + Nanite buffers ×2 → 25.2 %; turning + `NaniteLODBias 0` → 24.5 % (no help). The blink map (scratchpad c2/T.webp) shows WHOLE leaflet-shadow patches
popping, not edge crawl. Same geometry re-rendered with the SAME light direction is stable; a new direction every frame pops leaflets. `…ResolutionLodBiasDirectionalMoving`
is −1.0 like the static bias (no coarser «moving» resolution). Next on the same stand: bias −2 / −3 / 0 under the turning sun, and `r.Shadow.Virtual.Cache 0` with a still
light (is the forced re-render real?).
**17:0x — PROVEN on the clean stand (series c3):** still sun + `r.Shadow.Virtual.Cache 0` (full re-render every frame, wind on) → 38 px (0.01 %); still sun → 307 (0.05 %);
turning sun at bias 0 / −1 / −2 / −3 → 10.8 / 9.3 / 5.1 / 6.2 % (the same «turning, −1» gave 26 % in series c2 — ×3 between series). The owner's eye 17:06 «ну вот было в
порядке только что» = the still-sun clips. **Only a change of the light DIRECTION pops leaflets; re-render, cache, wind, Nanite buffers are not the trigger; finer texels
halve it, never remove it.** The code mechanism is NOT proven yet — two candidates: (a) rasterizing thin leaflets into the shadow map (an edge-on leaflet falls between
sample points under a new projection); (b) Nanite's cluster selection for the light's view changes with the projection. Discriminator running: `r.Nanite 0` (fallback
meshes, no cluster selection) under the turning sun. `r.Shadow.Virtual.Visualize` + `ShowFlag.VisualizeVirtualShadowMap 1` show nothing in this Shipping exe (17:09 frame).
**17:13 — `r.Nanite 0` is VOID as a discriminator:** 3 blinking px under the turning sun, but the frame (c4/nanite_on_off.webp) shows NO crown shadow at all — the palm's
Nanite fallback is a bare trunk, nothing left to flicker. Both candidates live inside Nanite (it selects the clusters AND rasterizes small triangles into the shadow);
next discriminator: `r.Nanite.MaxPixelsPerEdge` 0.25 / 1.2 / 4 / 16 under the turning sun (selection) against the bias series above (sample density, ×2).
**17:15 — Nanite selection REFUTED:** `MaxPixelsPerEdge` 0.25 / 1.2 / 4 → 6.5 / 7.2 / 5.3 % (c5), and the owner's eye 17:14 «мерцает на всех положиениях». Reading `[AI]`:
a blink is on-off-on within three frames — a monotonic geometric change under a slowly turning sun would leave a leaflet gone for a while, so the per-frame back-and-forth
points to per-frame noise re-drawn at every new direction (SMRT rays + texel dither) — series c6 (SMRT 0 + dither 0, still vs turning) running.
**Requirement `[OWNER]` 2026-11-07 17:16 «и еще колебания листов на ветру» · «но ещё шум дает колебание листов на ветру» · «но это НЕ ПРИЧИНА» · «ветер должен быть»:** the wind
and the leaf-shimmer noise (`MF_LeafShimmer`) stay — the fix keeps the leaves moving and their shadows steady; wind off is never the fix (a diagnostic at most, `_config/wind.lua`).
**17:1x–17:2x (clean stand):** SMRT 0 + dither 0 (c6): still sun 0.04 % → **3.5 %** without SMRT (the wind-moved leaf shadow DOES change every frame; SMRT + temporal hide
it while the sun stands), turning 4.8 % → 8.0 % without SMRT — SMRT is not the cause. The owner 17:20 «вот сейчас ровно» = the 2.0 still-sun window again; `[OWNER]` 17:21
«при неподвижном солнце, да, перцания пропадают - это ЗАЦЕПКА, а не способ починки» · «солнце должно двигаться плавно»; 17:23 «могут быть баги или в рендерере … или в
шейдерах». Shader reading → recon §4: a moving light's views are UNCACHED, which switches on receiver-mask caster culling, drops static caching, uses the previous-frame HZB.
**Receiver mask REFUTED (c7):** `r.Shadow.Virtual.UseReceiverMaskDirectional 0` → 3.5 / 3.3 % vs 1.7 / 2.9 % with it. `r.Shadow.Virtual.UseHZB` is already 0. Baseline «turning»
falls series by series (26 → 9 → 6.5 → 4.8 → 2 %) — compare inside a series only. Next (c8): `Clipmap.WPODisableDistance 0` (the leaf shadow without wind on coarse levels +
the coarser-level fallback for an unmapped page, `VirtualShadowMapProjectionDirectional.ush:59`). RenderDoc 1.47 installed (the owner's word 17:22 «разрешаю установить!»),
`_config/rdoc/launch-rdoc.sh` + `rdoc_trigger.py` ready for a frame capture.
**17:3x:** `Clipmap.WPODisableDistance 0` (c8) — 1.4 / 1.5 % vs 1.6 / 0.7 %: no effect. The wind varies by the weather (`wind.lua read`: WindIntensity 0.195 at 17:17, 0.167 at
17:33) but too little to explain the baseline 26 → 1 %. **Nanite streaming pool lead (c9):** before a flush 5.85 %; `StreamingPoolSize` 512 → 1024 (a resize flushes the pool)
→ 9.3 % at once, 3.7 % after 20 s, 2.1 % after 60 s — a flare and a decay below the start. Reading `[AI]`: under a turning light every shadow page is re-rendered every
frame, its GPU feedback asks for slightly different clusters each frame, and a 512 MB pool (4K + shadows) thrashes at the margin — leaflets swap between coarse and fine
clusters; a still (cached) light asks for nothing new. Running: A-B-A-B 512 / 2048 with 60 s settle each (c10), wind read per clip.
**17:39 — CRASH in the agent's run (my error):** `exec r.Nanite.Streaming.StreamingPoolSize 2048` → «Fatal error: NaniteStreamingManager.cpp:640 Streaming pool size (2048MB)
must be smaller than the largest allocation supported by the graphics hardware (2048MB)». The limit on this RTX 5070 Ti / driver: the pool must stay BELOW 2048 MB (1024 ran
fine). Crash-report window closed, PID 12680; machine lock released. The c10 series died after its first clip (pool 512, wind 0.152). Re-run with 512 / 1536. `[OWNER]` 15:47 «что такое точность? зачем ты её меняешь?» — explained: the texel size stood in for the leaf thickness the material cannot give. — during a live look the owner drives the camera; no fixed camera.

## Goal vector and acceptance

Avoid: leaf shadows on sand under palms visibly jitter frame to frame. Done when the owner, standing under palms at 4K, says the shadows do
not flicker, and the look of the shadows is not worse (his 16.09 verdict on a blur lever: «качество теней ужасное просто» — rejected).

## Symptom

Shadows of palm leaves shimmer/flicker while the leaves sway (wind WPO), at 4K output (DLSS), sun moving.

## What is known (pointers, not retold)

- Mechanism and three rejected levers (2.1.1, 16.09) — `researches/conan-shadow-flicker/README.md`: VSM pages invalidated every frame by WPO foliage.
- Never run: the discriminating run with `r.Shadow.Virtual.Enable=0` (VSM vs the temporal upscaler).
- New 5.8 candidates — pack `docs/03-cvars-конана.md`, «Мерцание теней листвы пальм — новые кандидаты 5.8».

## Fix (2026-10-29 00:4x)

Root cause (re-recon `researches/conan-shadow-flicker/2026-10-29_recon.md`): our own `Engine.ini` set `DynamicSky.SolarUpdateAngleDelta = 0.003`
(the game: 0.015) — the sun light turned ~50 times a second, each turn invalidating the VSM pages. Live A-B-A in one session under palms:
`2.0` → `[OWNER]` «ну сейчас словно тени в порядке»; back to `0.003` → «да, вернулось». The pack's `Engine.ini` now carries `2.0` (commit 24a500e);
the game log applies it after the quality group's 0.015. Run report `testcases/reports/2026-10-29_conan-loot-strip-hold-prompt-bars-shadows.md`.
Open: whether the sun's step every few seconds is noticed in play — then 1.0 or 0.5.

**Status:** 🟢 2.0 BY THE OWNER'S CHOICE 2026-10-29 01:10 (pack 1c70cb9; «все решаения - гавно. ставим 2.0 и закрываем чат»); history: 2.0 was reverted once (pack 6a12183): 0.003 was set on purpose for a smoothly moving sun (the comment above the
line in `Engine.ini`), and the owner: «мы же специально делали так, чтобы солнце плавно по небу двигалось...» · «ты блять взял и откатил это?».
The trade-off is the owner's: smooth sun (0.003, flicker) vs calm shadows (2.0, the light steps every few seconds). Next: 0.1 / 0.25 / 0.5 under palms
(video + his eye) and the recon levers that do not touch the sun (R3 DLSS preset, R4 LOD bias −1.5).

## Decisions made without the owner

- `[AI]` 2.0 written, not a middle value: it is the value the owner looked at; 1.0 / 0.5 are the named fallbacks if the step is visible.

## Next path — the kit (the owner, 2026-10-29 01:1x)

`[OWNER]` «в этой сборке - а разме не мы эту сборку собираем?» · «и целвый кит на 170 гигов есть!» — the search above covered engine cvars only. Next:
edit the sky blueprint in the kit (Ultra Dynamic Sky / `DynamicSky`): keep the visible sun moving smoothly, update the shadow-casting directional light
rarely (and, if possible, ease between its steps instead of jumping) — the same kit route as `KrinikUIFixes` / `KrinikConanArchery`. First step:
read the sky blueprint (which asset drives `DynamicSky.SolarUpdateAngleDelta`, where the light rotation is set).
