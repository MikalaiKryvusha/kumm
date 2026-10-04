# Research — Unity uGUI + TextMeshPro layout handbook (Unity 2020.3)

> **Created:** 2026-10-04 (owner's order, chat)
> **Parent:** SvarogsDream item window parity work
> **Status:** reference
> **Outbound:** —

A local, grep-first handbook for writing Unity UI (uGUI 1.0) layouts **in C# at runtime** inside a BepInEx mod for a
Unity 2020.3 Mono game (built-in pipeline, **Linear** colour space, Screen Space - Overlay canvases, TextMeshPro 3.0.x).
Built from the real pages and the real source code, fetched on 2026-10-04 — not from memory. Owner's order, verbatim
(`[OWNER]` · chat 2026-10-04 ≈21:46): «и сходи в интернет за методическим пособием по вот этому языку вёрстки, которым ты
пользуешься. Скачай его локально подробно с греп дружелюбными ярлыками, чтобы ты мог к этому пособию обращаться при работе,
чтобы верстать красиво и хорошо!»

## How to use it

- Every section starts with `## <title>`, then `TAG: <area>.<topic>`, then one or more `SOURCE: <url>` lines.
- Find a topic: `grep -rn "TAG: ugui.hvgroup" researches/unity-ugui-layout/` · read a section:
  `grep -n -A40 "TAG: pitfall.force-expand-leak" researches/unity-ugui-layout/12_pitfalls.md`.
- Before building or fixing a window, read **`12_pitfalls.md`** top to bottom (26 traps, symptom → cause → fix).
- Tag prefixes: `ugui.*` uGUI layout/rendering · `tmp.*` TextMeshPro · `color.*` colour space · `perf.*` performance ·
  `css2ugui.*` CSS → uGUI mapping (derived) · `pitfall.*` checklist.
- Trust levels inside sections: quoted text = official page or source; **(source)** = read in the uGUI/TMP C# source;
  **(derived)** = the author's conclusion from those; **(secondary)** = forum thread.
- `tools/check_tags.py` lints the files (every section has TAG + SOURCE, no duplicate or dangling tag references) and
  prints this index (`--index`). `tools/fetch_text.py <url>` re-fetches any page as plain text;
  `tools/read_unitypackage.py <url> <file> [regex]` reads a file out of a `.unitypackage` in memory (TMP shaders).

## Files

| File | Lines | Covers |
|---|---|---|
| `01_auto-layout.md` | 255 | layout model, the four passes, rebuild marking/forcing, traversal gaps, priority rule, built-in reported values |
| `02_layout-groups.md` | 384 | Horizontal/Vertical group defaults (runtime vs Editor), CalcAlongAxis / SetChildrenAlongAxis verbatim, force-expand leak, worked numeric examples, Grid group |
| `03_layout-element.md` | 113 | LayoutElement defaults (-1), units, 0 vs unset, equal columns, fixed size, ignoreLayout |
| `04_content-size-fitter.md` | 115 | ContentSizeFitter source and recipes, the "not on group children" rule, AspectRatioFitter |
| `05_rect-transform-canvas.md` | 270 | RectTransform, script positioning, world corners vs screen pixels, draw order, nested canvas sorting, CanvasScaler math, CanvasGroup, masks |
| `06_image-sliced-sprites.md` | 162 | Image defaults and types, pixels-per-unit formula, 9-slice border size and multiplier, preferred size, runtime sprites, UI/Default shader |
| `07_tmp-text.md` | 313 | TMP defaults, font-size and spacing UNITS (1/100 em), line advance and one-line height formulas, alignment, wrapping, margins, preferred values, rich-text units |
| `08_tmp-fonts-bold-spacing.md` | 271 | font assets, FaceInfo, dynamic/runtime assets, fallback chain, weight table, **synthesized bold = +0.07 em per letter**, SDF material properties and weight formula |
| `09_color-space.md` | 128 | linear blending, linearised vertex colours, CSS-vs-Unity alpha table and solver |
| `10_performance.md` | 136 | canvas splitting, rebuild pipeline, layout dirty walk, raycast targets, hiding, pooling, text costs |
| `11_css-to-ugui.md` | 244 | DERIVED CSS → uGUI/TMP mapping (flex, grid fr, intrinsic sizes, line-height, letter-spacing, z-index, radius, rgba, opacity) |
| `12_pitfalls.md` | 295 | the checklist |
| `tools/*.py` | 177 | fetch / unitypackage reader / lint (write nothing outside stdout) |

## Versions this handbook is pinned to

- Game: Unity **2020.3.49f1** (read from `globalgamemanagers`); its `UnityEngine.UI.dll` contains `m_ReverseArrangement`
  (uGUI 1.0.0 of late 2020.3); its `Unity.TextMeshPro.dll` contains `boldSpacing` and `isTextObjectScaleStatic`
  (TMP 3.0.x; exact patch not determined).
- uGUI source quoted: package 1.0.0 as shipped with **Unity 2020.3.18f1** (needle-mirror tag `1.0.0/Unity-2020.3.18f1`;
  mirror of the official package contents).
- TMP source quoted: **3.0.6** (needle-mirror tag `3.0.6`); the 3.0.x changelog read up to 3.0.9 lists no layout change after
  3.0.6.
- UI/Default shader: Unity built-in shaders, 2020.3 branch of the chsxf archive (copies of Unity's official
  `builtin_shaders-*.zip`).

## Sources actually fetched

Unity UI package manual (com.unity.ugui@1.0) — `https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/`:
toc.html, UIAutoLayout.html, script-LayoutElement.html, script-ContentSizeFitter.html, script-AspectRatioFitter.html,
script-HorizontalLayoutGroup.html, script-VerticalLayoutGroup.html, script-GridLayoutGroup.html, UICanvas.html,
UIBasicLayout.html, class-RectTransform.html, class-Canvas.html, script-CanvasScaler.html, script-Image.html,
script-Mask.html, script-RectMask2D.html, class-CanvasGroup.html, class-CanvasRenderer.html, UIVisualComponents.html,
HOWTO-UIMultiResolution.html, HOWTO-UIFitContentSize.html, HOWTO-UICreateFromScripting.html, script-Shadow.html,
script-Outline.html, script-ScrollRect.html; also `com.unity.ugui@2.0/manual/class-Canvas.html` (checked for sort-order
text; none).

uGUI scripting API (com.unity.ugui@1.0/api): UnityEngine.UI.HorizontalOrVerticalLayoutGroup.html,
UnityEngine.UI.LayoutRebuilder.html, UnityEngine.UI.ILayoutElement.html, UnityEngine.UI.Image.html.

Unity 2020.3 Scripting API (`https://docs.unity3d.com/2020.3/Documentation/ScriptReference/`): Canvas.html,
Canvas-overrideSorting.html, Canvas-sortingOrder.html, Canvas-pixelPerfect.html, Canvas-renderOrder.html,
Canvas.ForceUpdateCanvases.html, CanvasRenderer.GetInheritedAlpha.html, RectTransform.html,
RectTransform.GetWorldCorners.html, RectTransformUtility.ScreenPointToLocalPointInRectangle.html, Renderer-sortingOrder.html,
RectOffset-ctor.html, RectOffset.html, TextAnchor.html, Sprite-border.html, Sprite.Create.html, TextCore.FaceInfo.html,
QualitySettings-activeColorSpace.html, Color-linear.html, Color-gamma.html, Mathf.GammaToLinearSpace.html,
Texture2D-ctor.html. Other versions: 6000.0 `RectTransformUtility.WorldToScreenPoint.html`; 2022.3 and 6000.0
`Canvas-vertexColorAlwaysGammaSpace.html`.

Unity 2020.3 Manual (`https://docs.unity3d.com/2020.3/Documentation/Manual/`): LinearRendering-LinearOrGammaWorkflow.html,
2DSorting.html, SL-MultipleProgramVariants.html (served current-manual text). LinearLighting.html and
LinearRendering-GammaTextures.html were requested too, but their text was not read or used.

TextMeshPro: `https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.0/manual/index.html` (+ toc.html);
`com.unity.textmeshpro@3.2/manual/`: toc.html, TMPObjectUIText.html, FontAssets.html, FontAssetsProperties.html,
FontAssetsLineMetrics.html, FontAssetsSDF.html, FontAssetsDynamicFonts.html, FontAssetsFallback.html, RichText.html,
RichTextSupportedTags.html, RichTextCharacterSpacing.html, RichTextLineHeight.html, RichTextMargins.html,
RichTextSize.html, RichTextBoldItalic.html, RichTextFontWeight.html, Shaders.html, ShadersDistanceField.html;
`com.unity.textmeshpro@3.0/api/`: TMPro.TMP_Text.html, TMPro.TMP_FontAsset.html, TMPro.FaceInfo_Legacy.html.

Source code (raw GitHub):
- `https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/` —
  Layout/HorizontalOrVerticalLayoutGroup.cs, Layout/HorizontalLayoutGroup.cs, Layout/VerticalLayoutGroup.cs,
  Layout/LayoutGroup.cs, Layout/LayoutUtility.cs, Layout/LayoutElement.cs, Layout/ContentSizeFitter.cs,
  Layout/LayoutRebuilder.cs, Layout/CanvasScaler.cs, Layout/GridLayoutGroup.cs, Layout/AspectRatioFitter.cs,
  CanvasUpdateRegistry.cs, Image.cs, Graphic.cs, RectMask2D.cs, Mask.cs, MaskUtilities.cs.
- `https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/` — TMP_Text.cs,
  TMPro_UGUI_Private.cs, TextMeshProUGUI.cs, TMP_FontAsset.cs, TMP_FontAssetCommon.cs, TMP_FontAssetUtilities.cs,
  TMP_ShaderUtilities.cs, TMP_MaterialManager.cs, TMP_Settings.cs, TMPro_EventManager.cs; plus
  `.../3.0.6/Package%20Resources/TMP%20Essential%20Resources.unitypackage` (TMP_SDF-Mobile.shader, TMP_SDF.shader,
  TMPro.cginc) and `.../3.0.9/CHANGELOG.md`.
- `https://raw.githubusercontent.com/Unity-Technologies/UnityCsReference/2020.3/` —
  Modules/UI/ScriptBindings/RectTransformUtility.cs, Runtime/2D/Common/ScriptBindings/SpriteDataUtility.cs.
- `https://raw.githubusercontent.com/chsxf/unity-built-in-shaders/` — `2020.3/.../UI/UI-Default.shader`,
  `v2022.3.0f1/.../UI/UI-Default.shader`, `v2022.3.0f1/Shaders/CGIncludes/UnityUI.cginc`.

Best-practice guides: `https://unity.com/how-to/unity-ui-optimization-tips` (full text);
`https://learn.unity.com/tutorial/optimizing-unity-ui` (JavaScript page; read via WebFetch summary — quotes as returned).

Forum (secondary): `https://discussions.unity.com/threads/linear-vs-gamma-color-space-for-ui-font-rendering.689296/`,
`https://discussions.unity.com/t/png-transparency-is-different-in-unity-than-photoshop-924017/924017` (both via WebFetch
summary).

## Not fetched / gaps (stated plainly)

- The TMP **3.0** manual has no per-topic pages (only the overview); detailed manual text is from the **3.2** manual.
- `RectTransformUtility.WorldToScreenPoint` has no 2020.3 (nor 2019.4/2021.3/2022.3) Scripting API page (HTTP 404); used
  the 6000.0 page plus the 2020.3 C# reference source.
- No official page states how a nested override-sorting canvas's `sortingOrder` compares with other root overlay
  canvases — marked "verify in a frame capture".
- The Unity Learn "Optimizing Unity UI" article could not be read as raw text (client-rendered); its quotes came through
  WebFetch's summarizer, which reported that it has no dedicated pooling / CanvasGroup / fitter-performance sections.
- No official statement for Unity **2020.3** says in words that canvas vertex colours are linearised on the CPU; it is
  inferred from the 2022.3 `vertexColorAlwaysGammaSpace` documentation and the two UI/Default shader versions
  (marked derived).
- `WorldToScreenPoint`, sorting and colour behavior were not tested in the game here; this is a reading handbook.

## TAG INDEX

| Tag | File | Meaning |
|---|---|---|
| `ugui.autolayout.model` | 01_auto-layout.md | Layout elements report min/preferred/flexible; controllers (fitters, groups) set sizes |
| `ugui.autolayout.interfaces` | 01_auto-layout.md | ILayoutElement / ILayoutController / ILayoutGroup / ILayoutSelfController / ILayoutIgnorer |
| `ugui.autolayout.order` | 01_auto-layout.md | Four passes: widths (bottom-up input, top-down set), then heights |
| `ugui.autolayout.rebuild-traversal` | 01_auto-layout.md | Rebuild recursion stops at rects without layout components |
| `ugui.autolayout.rebuild-mark` | 01_auto-layout.md | MarkLayoutForRebuild walks up to the top group, rebuild at end of frame |
| `ugui.autolayout.rebuild-force` | 01_auto-layout.md | ForceRebuildLayoutImmediate: downward only, from the given root |
| `ugui.autolayout.frame-timing` | 01_auto-layout.md | CanvasUpdateRegistry on willRenderCanvases; ForceUpdateCanvases |
| `ugui.autolayout.driven-properties` | 01_auto-layout.md | Groups force child anchors to (0,1) and drive position/size |
| `ugui.autolayout.priority` | 01_auto-layout.md | GetLayoutProperty: highest priority wins, negatives ignored, ties take max |
| `ugui.autolayout.preferred-floor` | 01_auto-layout.md | preferred = max(min, preferred) |
| `ugui.autolayout.builtin-values` | 01_auto-layout.md | What Image, TMP, groups, LayoutElement report |
| `ugui.hvgroup.properties-defaults` | 02_layout-groups.md | Group properties; runtime AddComponent defaults = all control/expand TRUE |
| `ugui.hvgroup.calc-along-axis` | 02_layout-groups.md | Verbatim CalcAlongAxis: sums on main axis, max on cross axis |
| `ugui.hvgroup.force-expand-flexible` | 02_layout-groups.md | childForceExpand ⇒ flexible ≥ 1 per child AND for the group itself |
| `ugui.hvgroup.main-axis-distribution` | 02_layout-groups.md | lerp(min, pref, t) + flex share of the surplus; alignment only when Σflex = 0 |
| `ugui.hvgroup.cross-axis` | 02_layout-groups.md | clamp(innerSize, min, flex > 0 ? size : pref) per child |
| `ugui.hvgroup.alignment` | 02_layout-groups.md | TextAnchor → 0 / 0.5 / 1 per axis; overflow direction |
| `ugui.hvgroup.child-control-off` | 02_layout-groups.md | childControl false: sizeDelta used, LayoutElement ignored on that axis |
| `ugui.hvgroup.padding-spacing` | 02_layout-groups.md | RectOffset ints, (l, r, t, b) ctor; mutating fields doesn't dirty |
| `ugui.hvgroup.child-scale` | 02_layout-groups.md | Use Child Scale multiplies sizes by localScale |
| `ugui.hvgroup.reverse-arrangement` | 02_layout-groups.md | reverseArrangement positions last child first |
| `ugui.hvgroup.example-basic` | 02_layout-groups.md | Numeric example: preferred sizes and alignment |
| `ugui.hvgroup.example-force-expand` | 02_layout-groups.md | Numeric example: force-expand gives 70/120/170, zero base gives equal |
| `ugui.hvgroup.example-leak` | 02_layout-groups.md | Numeric example: nested group's forced flexible steals height |
| `ugui.hvgroup.recipes` | 02_layout-groups.md | Column of hugging rows, label+value row, toolbar spacer |
| `ugui.grid.properties-defaults` | 02_layout-groups.md | GridLayoutGroup defaults; ignores min/pref/flex |
| `ugui.grid.content-size-fitter` | 02_layout-groups.md | Grid + fitter: fixed column/row count recipes |
| `ugui.layoutelement.properties-defaults` | 03_layout-element.md | LayoutElement fields default -1, priority 1 |
| `ugui.layoutelement.units` | 03_layout-element.md | min/pref in canvas units, flexible is a relative weight |
| `ugui.layoutelement.zero-vs-unset` | 03_layout-element.md | 0 overrides the content, -1 lets it through |
| `ugui.layoutelement.flexible-vs-preferred` | 03_layout-element.md | Flexible without preferred waits until others reach preferred |
| `ugui.layoutelement.equal-columns` | 03_layout-element.md | Equal tiles: min 0, preferred 0, flexible 1 |
| `ugui.layoutelement.fixed-size` | 03_layout-element.md | Fixed child needs the parent's force-expand off |
| `ugui.layoutelement.ignore-layout` | 03_layout-element.md | ignoreLayout = absolute child inside a group |
| `ugui.csf.properties-defaults` | 04_content-size-fitter.md | horizontalFit/verticalFit default Unconstrained |
| `ugui.csf.behavior` | 04_content-size-fitter.md | Fitter sets size from resolved min/pref, around the pivot |
| `ugui.csf.fit-text` | 04_content-size-fitter.md | Fit a TMP: width from outside, height Preferred |
| `ugui.csf.fit-group-with-child-text` | 04_content-size-fitter.md | Button/tooltip: group + fitter on the container |
| `ugui.csf.not-on-group-children` | 04_content-size-fitter.md | Fitter on a group child = undefined behavior |
| `ugui.aspectfitter.properties-defaults` | 04_content-size-fitter.md | AspectRatioFitter modes, default None / 1 |
| `ugui.rect.properties` | 05_rect-transform-canvas.md | anchors, pivot, anchoredPosition, sizeDelta, offsets |
| `ugui.rect.script-positioning` | 05_rect-transform-canvas.md | SetParent(…, false); fixed vs stretched positioning code |
| `ugui.rect.timing` | 05_rect-transform-canvas.md | Rect values computed at end of frame |
| `ugui.rect.world-corners` | 05_rect-transform-canvas.md | GetWorldCorners order BL, TL, TR, BR |
| `ugui.rect.screen-points` | 05_rect-transform-canvas.md | WorldToScreenPoint(null) = world X/Y on overlay canvases |
| `ugui.canvas.draw-order` | 05_rect-transform-canvas.md | Hierarchy order = paint order; later sibling subtree on top |
| `ugui.canvas.render-modes` | 05_rect-transform-canvas.md | Overlay / Camera / World |
| `ugui.canvas.overlay-top-level` | 05_rect-transform-canvas.md | Overlay canvas must be a root object |
| `ugui.canvas.nested-override-sorting` | 05_rect-transform-canvas.md | Nested Canvas + overrideSorting + sortingOrder (+ GraphicRaycaster) |
| `ugui.canvas.override-sorting-escapes-mask` | 05_rect-transform-canvas.md | Override-sorting canvas drops ancestor RectMask2D |
| `ugui.canvas.pixel-perfect` | 05_rect-transform-canvas.md | pixelPerfect sharpness vs smooth motion |
| `ugui.canvasscaler.modes-defaults` | 05_rect-transform-canvas.md | CanvasScaler defaults (ConstantPixelSize, 800×600, match 0, refPPU 100) |
| `ugui.canvasscaler.match-math` | 05_rect-transform-canvas.md | Log-space width/height match formula |
| `ugui.canvasgroup.properties` | 05_rect-transform-canvas.md | alpha multiplies, interactable, blocksRaycasts, ignoreParentGroups |
| `ugui.canvasgroup.inherited-alpha` | 05_rect-transform-canvas.md | CanvasRenderer.GetInheritedAlpha |
| `ugui.mask.stencil` | 05_rect-transform-canvas.md | Mask: stencil, showMaskGraphic default true |
| `ugui.rectmask2d.properties` | 05_rect-transform-canvas.md | RectMask2D: no stencil, rectangular, padding/softness |
| `ugui.image.properties-defaults` | 06_image-sliced-sprites.md | Image defaults (Simple, raycastTarget true, multiplier 1) |
| `ugui.image.types` | 06_image-sliced-sprites.md | Simple / Sliced (needs border) / Tiled / Filled |
| `ugui.image.pixels-per-unit` | 06_image-sliced-sprites.md | 1 sprite px = refPPU / (spritePPU × multiplier) units |
| `ugui.image.ppu-multiplier` | 06_image-sliced-sprites.md | pixelsPerUnitMultiplier scales 9-slice border thickness |
| `ugui.image.border-shrink` | 06_image-sliced-sprites.md | Borders shrink when the box is smaller than their sum |
| `ugui.image.preferred-size` | 06_image-sliced-sprites.md | Image preferred = sprite size or border sum |
| `ugui.image.runtime-sprite` | 06_image-sliced-sprites.md | Sprite.Create with border (l, b, r, t) |
| `ugui.image.ui-default-shader` | 06_image-sliced-sprites.md | UI/Default: premultiplied blend, no colour-space code |
| `tmp.text.components` | 07_tmp-text.md | TextMeshProUGUI vs TextMeshPro; source files |
| `tmp.text.defaults-from-settings` | 07_tmp-text.md | New TMP takes defaults from the game's TMP Settings |
| `tmp.text.font-size-units` | 07_tmp-text.md | 1 em = fontSize canvas units |
| `tmp.text.spacing-units` | 07_tmp-text.md | character/word/line/paragraph spacing = 1/100 em; advance formula |
| `tmp.text.line-advance` | 07_tmp-text.md | Baseline pitch = faceInfo.lineHeight·s + lineSpacing·F/100 |
| `tmp.text.single-line-height` | 07_tmp-text.md | One-line height = (ascent − descent)·s, no half-leading |
| `tmp.text.font-style` | 07_tmp-text.md | FontStyles flags, FontWeight values |
| `tmp.text.auto-size` | 07_tmp-text.md | Auto size cost; preferred computed at fontSizeMax |
| `tmp.text.alignment` | 07_tmp-text.md | TextAlignmentOptions; Middle vs Midline vs Capline |
| `tmp.text.wrapping-overflow` | 07_tmp-text.md | enableWordWrapping, overflow modes |
| `tmp.text.margins` | 07_tmp-text.md | margin = (left, top, right, bottom); setter doesn't dirty layout |
| `tmp.text.preferred-values` | 07_tmp-text.md | preferredWidth unwrapped; preferredHeight at current width; GetPreferredValues |
| `tmp.text.layout-element` | 07_tmp-text.md | TMP reports min 0, flexible -1, priority 0; which setters dirty layout |
| `tmp.text.change-propagation` | 07_tmp-text.md | text setter → SetLayoutDirty; TEXT_CHANGED_EVENT / OnPreRenderText |
| `tmp.text.rich-text` | 07_tmp-text.md | Tag syntax; bare number = px, em, % |
| `tmp.text.rich-tags-layout` | 07_tmp-text.md | cspace, line-height, margin, size, font-weight units |
| `tmp.text.extra-settings` | 07_tmp-text.md | Raycast target, kerning, extra padding, escapes |
| `tmp.text.force-mesh-update` | 07_tmp-text.md | ForceMeshUpdate before reading textInfo/bounds |
| `tmp.font.asset-structure` | 08_tmp-fonts-bold-spacing.md | Atlas + material + tables; atlas types |
| `tmp.font.faceinfo-metrics` | 08_tmp-fonts-bold-spacing.md | pointSize, scale, lineHeight, ascent/descent and how TMP uses them |
| `tmp.font.atlas-render-modes` | 08_tmp-fonts-bold-spacing.md | SDF/SDFAA/… modes, padding, gradient scale |
| `tmp.font.dynamic` | 08_tmp-fonts-bold-spacing.md | Dynamic atlas behavior; TryAddCharacters / HasCharacters |
| `tmp.font.create-runtime` | 08_tmp-fonts-bold-spacing.md | CreateFontAsset defaults: 90 pt, pad 9, SDFAA, 1024², Dynamic |
| `tmp.font.fallback-chain` | 08_tmp-fonts-bold-spacing.md | Seven-step fallback order |
| `tmp.font.weights-table` | 08_tmp-fonts-bold-spacing.md | fontWeightTable[7].regularTypeface = real bold |
| `tmp.font.bold-synthesis` | 08_tmp-fonts-bold-spacing.md | Fake bold = _WeightBold dilation + boldSpacing (7 → 0.07 em) per letter |
| `tmp.font.bold-spacing-math` | 08_tmp-fonts-bold-spacing.md | +1.26 units per letter at size 18 |
| `tmp.font.bold-fixes` | 08_tmp-fonts-bold-spacing.md | Real bold asset / negative characterSpacing / asset field / material instance |
| `tmp.sdf.material-properties` | 08_tmp-fonts-bold-spacing.md | _FaceDilate, _Outline*, _Underlay*, _Weight*, keywords |
| `tmp.sdf.weight-formula` | 08_tmp-fonts-bold-spacing.md | Shader: weight = lerp(_WeightNormal, _WeightBold, bold)/4 + dilate |
| `tmp.sdf.effects-padding` | 08_tmp-fonts-bold-spacing.md | Effects enlarge quads; artifacts and padding |
| `color.linear.blending` | 09_color-space.md | Linear project blends in linear space (official) |
| `color.linear.ui-vertex-colors` | 09_color-space.md | Canvas linearises vertex colours in 2020.3 (derived from 2022.3 docs + shaders) |
| `color.linear.ui-shader-blend` | 09_color-space.md | Premultiplied "over" in UI and TMP shaders |
| `color.linear.semi-transparent-mismatch` | 09_color-space.md | CSS alpha → Unity alpha table and solver |
| `color.linear.gradients` | 09_color-space.md | Vertex-colour gradients interpolate in linear space |
| `color.linear.textures-srgb` | 09_color-space.md | sRGB textures, alpha untouched |
| `color.linear.forum` | 09_color-space.md | Forum workarounds (secondary) |
| `perf.canvas.split` | 10_performance.md | One change dirties the whole canvas; split static/dynamic |
| `perf.canvas.rebuild-pipeline` | 10_performance.md | Batch building and rebuild steps |
| `perf.layout.dirty-walk` | 10_performance.md | Each nested group adds a GetComponent per dirty child |
| `perf.layout.avoid-groups-hot` | 10_performance.md | Anchors or own code for hot UIs |
| `perf.layout.force-rebuild-cost` | 10_performance.md | Force rebuild once, not per frame |
| `perf.raycast.target` | 10_performance.md | Turn off raycastTarget on decorations and labels |
| `perf.canvas.hide` | 10_performance.md | Disable the Canvas component to hide cheaply |
| `perf.pool.reparent-order` | 10_performance.md | Disable then reparent into pool |
| `perf.animator` | 10_performance.md | Animators dirty every frame |
| `perf.overdraw` | 10_performance.md | Overlapping elements and big lists |
| `perf.text` | 10_performance.md | Text change costs; auto size; SetText |
| `css2ugui.units` | 11_css-to-ugui.md | px ≈ canvas unit, em ≈ fontSize, TMP spacing in 1/100 em |
| `css2ugui.box-model` | 11_css-to-ugui.md | padding/margin/border/gap equivalents |
| `css2ugui.flex-container` | 11_css-to-ugui.md | flex row/column, reverse, wrap, display none vs visibility hidden |
| `css2ugui.align-items` | 11_css-to-ugui.md | align-items / justify-content via force-expand + childAlignment |
| `css2ugui.flex-grow` | 11_css-to-ugui.md | flex-grow/basis/shrink/min-width mapping |
| `css2ugui.grid-fr` | 11_css-to-ugui.md | repeat(N, 1fr) = HLG + LayoutElement(0, 0, 1) |
| `css2ugui.intrinsic-sizes` | 11_css-to-ugui.md | max-content, min-content, minmax(), fit-content() |
| `css2ugui.line-height` | 11_css-to-ugui.md | CSS line-height → lineSpacing / <line-height> / margins |
| `css2ugui.letter-spacing` | 11_css-to-ugui.md | letter-spacing em/px → characterSpacing |
| `css2ugui.font-weight` | 11_css-to-ugui.md | 700 → bold asset or synthesized (+0.07 em) |
| `css2ugui.text-align` | 11_css-to-ugui.md | text-align and vertical centering |
| `css2ugui.text-overflow` | 11_css-to-ugui.md | nowrap, ellipsis, overflow-wrap, line clamp |
| `css2ugui.z-index` | 11_css-to-ugui.md | sibling order; nested canvas = stacking context |
| `css2ugui.position` | 11_css-to-ugui.md | absolute = ignoreLayout + anchors; inset; transform |
| `css2ugui.overflow` | 11_css-to-ugui.md | RectMask2D / Mask / ScrollRect |
| `css2ugui.border-radius` | 11_css-to-ugui.md | 9-slice rounded sprite; radius via pixelsPerUnitMultiplier |
| `css2ugui.border-shadow` | 11_css-to-ugui.md | border, box-shadow, text-shadow, outline equivalents |
| `css2ugui.rgba-opacity` | 11_css-to-ugui.md | rgba under linear blending; opacity vs CanvasGroup |
| `pitfall.force-expand-leak` | 12_pitfalls.md | Inner group's forced flexible soaks up the parent's space |
| `pitfall.runtime-addcomponent-defaults` | 12_pitfalls.md | Runtime AddComponent: childControl/ForceExpand all true |
| `pitfall.unequal-tiles-flexible-only` | 12_pitfalls.md | flexible shares only the surplus → unequal tiles |
| `pitfall.tmp-synth-bold-spacing` | 12_pitfalls.md | Fake bold adds 0.07 em per letter |
| `pitfall.linear-semi-transparent` | 12_pitfalls.md | Translucent colours lighter than in the browser |
| `pitfall.sibling-overflow-overdraw` | 12_pitfalls.md | Next sibling paints over this sibling's overflow |
| `pitfall.world-corners-not-screen` | 12_pitfalls.md | World corners ≠ screen pixels on Camera/World canvases |
| `pitfall.read-before-rebuild` | 12_pitfalls.md | Sizes read before the end-of-frame layout pass |
| `pitfall.translator-after-layout` | 12_pitfalls.md | Translated text arrives after you measured |
| `pitfall.csf-on-group-child` | 12_pitfalls.md | Fitter on a group child fights the group |
| `pitfall.padding-mutation-not-dirty` | 12_pitfalls.md | group.padding.left = x does not re-layout |
| `pitfall.tmp-margin-not-dirty` | 12_pitfalls.md | tmp.margin does not re-layout |
| `pitfall.force-rebuild-wrong-root` | 12_pitfalls.md | Force rebuild from a child or through a bare container |
| `pitfall.image-preferred-is-sprite-size` | 12_pitfalls.md | Image asks for its texture size |
| `pitfall.layoutelement-zero-vs-unset` | 12_pitfalls.md | 0 kills the content's value, -1 keeps it |
| `pitfall.force-expand-overrides-layoutelement` | 12_pitfalls.md | Parent force-expand beats LayoutElement flexible 0 |
| `pitfall.override-sorting-escapes-mask` | 12_pitfalls.md | Sorting canvas inside a scroll view is not clipped |
| `pitfall.override-sorting-raycaster` | 12_pitfalls.md | Nested canvas needs its own GraphicRaycaster |
| `pitfall.tmp-preferred-width-unwrapped` | 12_pitfalls.md | Horizontal Preferred on TMP never wraps |
| `pitfall.tmp-autosize-preferred` | 12_pitfalls.md | Auto-size TMP reports fontSizeMax size |
| `pitfall.tmp-line-box-height` | 12_pitfalls.md | One-line TMP is shorter than a CSS line box |
| `pitfall.sliced-border-scale` | 12_pitfalls.md | 9-slice corners too big/small/squashed |
| `pitfall.overlay-canvas-not-root` | 12_pitfalls.md | Overlay canvas not at root disappears |
| `pitfall.inactive-children` | 12_pitfalls.md | Inactive children take no space; disabled Graphic does |
| `pitfall.canvasscaler-assumptions` | 12_pitfalls.md | Canvas units ≠ pixels under the game's CanvasScaler |
| `pitfall.csf-pivot` | 12_pitfalls.md | Fitter grows around the pivot |
