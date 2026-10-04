# 12 — Pitfalls checklist (symptom → cause → fix)

> Run this list before declaring a uGUI/TMP layout done, and again when a screenshot looks wrong. Each entry points to
> the handbook section with the evidence. Causes are from official docs or the quoted source; fixes are the author's
> conclusions from those sources unless they are quoted.

---

## Force-expand defaults leak flexible size upward
TAG: pitfall.force-expand-leak
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/HorizontalOrVerticalLayoutGroup.cs (L87-137, L221-239)

- **Symptom:** a header/row/footer inside a window grows taller (or wider) than its content; spare space is split between
  sections that should hug their content; changing the window height changes the header height.
- **Cause:** `childForceExpandWidth/Height` default to **true**. `GetChildSizes` makes every child's flexible ≥ 1, and
  `CalcAlongAxis` sums/maxes those values into the group's **own** `flexibleWidth/Height`, so the inner group reports
  flexible ≥ 1 to its parent, which then hands it surplus space. Example with numbers: `ugui.hvgroup.example-leak`.
- **Fix:** on every group you create set all four booleans explicitly; turn force-expand off on any axis where children
  should hug content. Where an inner group must keep force-expand for its own children, put
  `LayoutElement { flexibleHeight = 0 }` (and/or `flexibleWidth = 0`) on the inner group's GameObject (priority 1 beats
  the group's 0).

## AddComponent at runtime gives different defaults than the Editor
TAG: pitfall.runtime-addcomponent-defaults
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/HorizontalOrVerticalLayoutGroup.cs (L19-55, L241-255)

- **Symptom:** a layout that matched an Editor prototype or a tutorial screenshot behaves differently in the mod: children
  resized, sizes you set on children ignored.
- **Cause:** `Reset()` (Editor only, `#if UNITY_EDITOR`) switches `childControlWidth/Height` to false for components added
  in the Editor. In the player, `AddComponent<HorizontalLayoutGroup>()` keeps the field initializers:
  childControlWidth/Height = **true**, childForceExpandWidth/Height = **true**.
- **Fix:** set `childControlWidth`, `childControlHeight`, `childForceExpandWidth`, `childForceExpandHeight`,
  `childScaleWidth/Height`, `spacing`, `padding`, `childAlignment` explicitly in code, every time.

## A row of "equal" tiles comes out with unequal widths
TAG: pitfall.unequal-tiles-flexible-only
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/HorizontalOrVerticalLayoutGroup.cs (L180-217)
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-LayoutElement.html

- **Symptom:** four stat tiles / tab buttons with `flexibleWidth = 1` (or force-expand) have different widths; longer
  captions make their tile wider.
- **Cause:** a child's width is `lerp(min, preferred, t) + flexible · surplus/Σflex`. Flexible distributes only the
  **surplus beyond Σpreferred**; each tile's base is its own preferred width (TMP text width, sprite size). Equal flexible ⇒
  equal *extra*, not equal width (`ugui.hvgroup.example-force-expand`: 70/120/170).
- **Fix:** on every tile `LayoutElement { minWidth = 0, preferredWidth = 0, flexibleWidth = 1 }` (zero base), group
  `childControlWidth = true`; or a GridLayoutGroup with a computed `cellSize`. Long captions then need
  `overflowMode = Ellipsis` or auto-size, because the tile no longer grows for them.

## Synthesized TMP bold widens letter spacing
TAG: pitfall.tmp-synth-bold-spacing
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMPro_UGUI_Private.cs (L2202-2236, L3246)
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_FontAsset.cs (L389-414)

- **Symptom:** bold titles look letter-spaced/airy compared with the design; bold labels are wider than expected and push
  layouts; a bold run inside a sentence looks tracked out.
- **Cause:** when the font asset has no weight-700 asset in `fontWeightTable[7]`, TMP fakes bold: thicker SDF via
  `_WeightBold` **plus** `boldSpacing × fontSize / 100` added to every character's advance (default `boldSpacing = 7`
  ⇒ +0.07 em per letter, +1.26 units per letter at size 18). Preferred width includes it too.
- **Fix:** assign a real bold font asset to `fontWeightTable[7].regularTypeface`; or cancel per text with
  `characterSpacing = -fontAsset.boldSpacing` (fully bold labels) / `<cspace=-0.07em>` inside `<b>` runs; editing
  `fontAsset.boldSpacing` changes every text of the game using that asset (`tmp.font.bold-fixes`).

## Semi-transparent colours look different from the browser mock-up
TAG: pitfall.linear-semi-transparent
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/LinearRendering-LinearOrGammaWorkflow.html
SOURCE: https://docs.unity3d.com/2022.3/Documentation/ScriptReference/Canvas-vertexColorAlwaysGammaSpace.html

- **Symptom:** a `rgba(0,0,0,0.5)` dimmer is too weak; translucent panels look washed out/lighter; colour fades and
  gradients have a different midpoint; opaque colours match.
- **Cause:** the project renders in Linear: "When you use linear space rendering, blending occurs in linear color space".
  The browser blends sRGB values. UI vertex colours are linearised before the shader (2020.3 has no
  `vertexColorAlwaysGammaSpace`).
- **Fix:** raise alpha per the table in `color.linear.semi-transparent-mismatch` (CSS 0.5 black ≈ 0.76–0.78), or solve with
  `LinearAlphaFor(...)`; prefer opaque dark fills over black veils; judge in a game screenshot. Check the project with
  `QualitySettings.activeColorSpace`.

## A later sibling (and its children) paints over an earlier sibling's overflow
TAG: pitfall.sibling-overflow-overdraw
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/UICanvas.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Canvas-overrideSorting.html
SOURCE: https://unity.com/how-to/unity-ui-optimization-tips

- **Symptom:** a dropdown, tooltip, glow or enlarged hover icon belonging to row 1 is cut by row 2's background or text;
  a badge sticking out of a slot is hidden under the next slot.
- **Cause:** "UI elements in the Canvas are drawn in the same order they appear in the Hierarchy ... the later one will
  appear on top of the earlier one." The whole subtree of the later sibling draws after the whole subtree of the earlier
  one; there is no z-index inside a canvas.
- **Fix:** (a) reparent the overflowing element to a container that is drawn last (a popup layer as the window's last
  child, `SetAsLastSibling()`), positioned from the source element's corners; or (b) put a nested `Canvas` on it with
  `overrideSorting = true`, a higher `sortingOrder`, and a `GraphicRaycaster` if it must be clickable — this also
  escapes ancestor RectMask2D clipping (`ugui.canvas.override-sorting-escapes-mask`).

## GetWorldCorners is not screen pixels on Camera/World canvases
TAG: pitfall.world-corners-not-screen
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/RectTransform.GetWorldCorners.html
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/UnityCsReference/2020.3/Modules/UI/ScriptBindings/RectTransformUtility.cs (L64-70)

- **Symptom:** a popup/tooltip positioned from `GetWorldCorners` lands far away or at a tiny offset; screenshots cropped
  from those coordinates are wrong; correct on one canvas, wrong on another.
- **Cause:** `GetWorldCorners` returns **world space**. Only on a Screen Space - Overlay canvas does world X/Y equal
  screen pixels (`WorldToScreenPoint(null, p)` returns `(p.x, p.y)`). On Screen Space - Camera / World Space canvases world
  units are scene units. Also: canvas units ≠ screen pixels when CanvasScaler.scaleFactor ≠ 1; and the corner order is
  BL, TL, TR, BR.
- **Fix:** `RectTransformUtility.WorldToScreenPoint(canvas.renderMode == RenderMode.ScreenSpaceOverlay ? null :
  canvas.worldCamera, corner)`; to place something in another canvas use
  `ScreenPointToLocalPointInRectangle(targetParent, screenPoint, targetCam, out local)`.

## Layout values read before the layout pass ran
TAG: pitfall.read-before-rebuild
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/UIAutoLayout.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Canvas.ForceUpdateCanvases.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/LayoutRebuilder.cs (L67-73)

- **Symptom:** `rect.width/height` is 0 or the previous value right after building; a tooltip clamped to the screen is
  clamped using a stale size; `preferredHeight` of a group is 0; first frame of a window is mis-positioned, second is fine.
- **Cause:** layout runs at end of frame: "The rebuild will not happen immediately, but at the end of the current frame,
  just before rendering happens." RectTransform values are not calculated in `Start` / first `Update`.
- **Fix:** after building, `LayoutRebuilder.ForceRebuildLayoutImmediate(topLayoutRoot)` (it rebuilds only downward from
  the given root — pass the outermost object with the group/fitter), then read sizes; for TMP mesh data
  (`textInfo`, `textBounds`) also `tmp.ForceMeshUpdate()`. Or defer the measurement one frame.

## Text changed by a translator after layout
TAG: pitfall.translator-after-layout
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_Text.cs (L114-135)
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMPro_EventManager.cs (L35, L75-77)

- **Symptom:** in English the window is fine; with the translation plugin (which replaces `text` later, sometimes a few
  frames later after an async lookup) labels overflow, wrap into a third line under the next row, or get cut; widths
  computed at build time are too small.
- **Cause:** the `text` setter calls `SetLayoutDirty()` → a layout rebuild **only re-sizes what the layout system owns**.
  Sizes you computed yourself from `preferredWidth`/`GetPreferredValues` at build time (or fixed `sizeDelta`) stay.
  The replacement string can be longer than the one you measured.
- **Fix:** let layout groups + LayoutElements (+ a root ContentSizeFitter) own every text-dependent size; give labels
  wrapping or `Ellipsis` plus a `minWidth`; if a size must be manual, recompute it on
  `TMPro_EventManager.TEXT_CHANGED_EVENT` (filter by your objects) or `OnPreRenderText`; test with the longest
  translated strings and with the plugin on.

## ContentSizeFitter on a child of a layout group
TAG: pitfall.csf-on-group-child
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/HOWTO-UIFitContentSize.html

- **Symptom:** sizes jitter or depend on frame order; children randomly the wrong size.
- **Cause:** "the Content Size Fitter wants control over its own Rect Transform, but the parent Layout Group also wants
  control over the child Rect Transform. This creates a conflict and the result is undefined behavior."
- **Fix:** remove the child fitter; turn off the parent's Child Force Expand; let the group size the child from its
  preferred size. Keep a fitter only on the root of the layout tree.

## Mutating padding in place does nothing
TAG: pitfall.padding-mutation-not-dirty
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/LayoutGroup.cs (L16-21, L345-365)

- **Symptom:** `group.padding.left = 20;` has no visible effect until something else changes.
- **Cause:** only the `padding` *setter* calls `SetDirty()`; changing a field of the existing `RectOffset` is invisible
  to the layout system. `RectOffset` is also int-only.
- **Fix:** `group.padding = new RectOffset(l, r, t, b);` or `LayoutRebuilder.MarkLayoutForRebuild(groupRect)` after
  mutation.

## TMP margin change does not re-layout
TAG: pitfall.tmp-margin-not-dirty
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_Text.cs (L1109-1115)

- **Symptom:** after setting `tmp.margin` the parent group keeps the old size until the text changes.
- **Cause:** the `margin` setter calls `SetVerticesDirty()` only — no `SetLayoutDirty()`, preferred values stay cached.
  `margin` is (left, top, right, bottom), unlike `RectOffset(left, right, top, bottom)`.
- **Fix:** set margins before the text, or call `tmp.SetLayoutDirty()` afterwards.

## ForceRebuildLayoutImmediate on the wrong root / through a bare container
TAG: pitfall.force-rebuild-wrong-root
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/LayoutRebuilder.cs (L67-163)

- **Symptom:** forcing a rebuild "doesn't work": nested sizes stay stale, or the parent window doesn't grow.
- **Cause:** it rebuilds only **downward** from the given rect; calculation recursion stops at a rect that has no
  `ILayoutElement`/`ILayoutGroup` component; control recursion stops at a rect with no `ILayoutController`. A bare
  RectTransform between two groups cuts the tree.
- **Fix:** call it on the outermost layout root; avoid bare containers inside layout trees (give them a group, an Image,
  or a LayoutElement), or rebuild each sub-root bottom-up.

## Image inside a group asks for its sprite size
TAG: pitfall.image-preferred-is-sprite-size
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Image.cs (L1700-1755)

- **Symptom:** an icon Image in a row is 256 px wide because its texture is 256 px; a Sliced background makes a row
  only as tall as its border sum.
- **Cause:** Image preferred = `sprite.rect.size / pixelsPerUnit` (Simple/Filled) or border sum (Sliced/Tiled), priority 0.
- **Fix:** LayoutElement with explicit min/preferred on such children, or put the Image on a child with
  `ignoreLayout = true` stretched behind the content.

## LayoutElement 0 vs -1
TAG: pitfall.layoutelement-zero-vs-unset
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/LayoutUtility.cs (L142-187)

- **Symptom:** text column collapses to nothing after adding a LayoutElement "just to set flexible"; or an override seems
  ignored.
- **Cause:** fields default to **-1 = unset**; 0 is a real value with priority 1 that overrides the content. Setting
  `preferredWidth = 0` by habit kills the text's preferred width; leaving -1 lets it through.
- **Fix:** only assign the properties you mean to override; reset others to -1.

## A LayoutElement cannot opt out of the parent's force-expand
TAG: pitfall.force-expand-overrides-layoutelement
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/HorizontalOrVerticalLayoutGroup.cs (L221-239)

- **Symptom:** an icon with `flexibleWidth = 0, preferredWidth = 32` is still stretched.
- **Cause:** `if (childForceExpand) flexible = Mathf.Max(flexible, 1);` is applied after reading the LayoutElement.
- **Fix:** turn the parent's force-expand off on that axis; give flexible to the children that should grow.

## override-sorting canvas escapes masks
TAG: pitfall.override-sorting-escapes-mask
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/MaskUtilities.cs (L140-174)

- **Symptom:** list items given their own sorting canvas draw outside the scroll view's RectMask2D.
- **Cause:** RectMask2D lookup drops a mask when an `overrideSorting` canvas lies between the graphic and the mask.
- **Fix:** don't put override-sorting canvases inside clipped content; reserve them for popups that should escape.

## Nested canvas without a GraphicRaycaster is not clickable
TAG: pitfall.override-sorting-raycaster
SOURCE: https://unity.com/how-to/unity-ui-optimization-tips

- **Symptom:** after adding a Canvas to a popup to fix draw order, its buttons stop reacting.
- **Cause:** "You need a Graphic Raycaster on every Canvas that requires input, including sub-Canvases."
- **Fix:** `popup.AddComponent<GraphicRaycaster>()`.

## TMP preferred width never wraps
TAG: pitfall.tmp-preferred-width-unwrapped
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_Text.cs (L3736-3765)

- **Symptom:** a description with `ContentSizeFitter.horizontalFit = PreferredSize` becomes one enormous line; a text in
  a row with flexible siblings squeezes them.
- **Cause:** `preferredWidth` is computed with infinite width and wrapping off.
- **Fix:** bound the width from outside (parent column width, `LayoutElement.preferredWidth`, or anchors) and fit only
  vertically.

## Auto-sized TMP reports its maximum size
TAG: pitfall.tmp-autosize-preferred
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_Text.cs (L3744, L3803)

- **Symptom:** a row with an auto-size label is as tall/wide as if the text were at `fontSizeMax`.
- **Cause:** `float fontSize = m_enableAutoSizing ? m_fontSizeMax : m_fontSize;` in both preferred getters.
- **Fix:** give auto-size labels a fixed box (LayoutElement min = preferred), or avoid auto-size inside fitted layouts.

## Single-line TMP height is not the font's lineHeight
TAG: pitfall.tmp-line-box-height
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_Text.cs (L4525-4527, L4648)

- **Symptom:** rows of one-line labels are tighter than the CSS mock-up with the same `line-height`; vertical rhythm off by
  a few pixels per row.
- **Cause:** preferred height = ascender of first line − descender of last line; no half-leading; `lineSpacing` only
  affects the gap between lines.
- **Fix:** add TMP top/bottom margins or group padding of `(L − (ascent − descent)·s)/2` (`css2ugui.line-height`).

## 9-slice borders are huge, tiny or squashed
TAG: pitfall.sliced-border-scale
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Image.cs (L698-719, L1025-1035, L1344-1374)

- **Symptom:** frame corners much thicker/thinner than the design; rounded corners turn into ellipses on small boxes;
  sliced sprite stretches like a Simple image.
- **Cause:** corner size = `border_px × referencePPU / (spritePPU × pixelsPerUnitMultiplier)`; borders shrink
  proportionally when the box is smaller than their sum; a sprite without `border` falls back to Simple.
- **Fix:** tune `pixelsPerUnitMultiplier`; keep boxes ≥ border sum; create runtime sprites with the `border` argument of
  `Sprite.Create`.

## Screen Space - Overlay canvas not at the hierarchy root
TAG: pitfall.overlay-canvas-not-root
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/class-Canvas.html

- **Symptom:** a mod's overlay UI does not appear.
- **Cause:** "The Screen Space - Overlay canvas needs to be stored at the top level of the hierarchy. If this is not used
  then the UI may disappear from the view."
- **Fix:** create the mod's overlay canvas as a root object (or deliberately as a nested canvas of the game's canvas).

## Inactive children take no space
TAG: pitfall.inactive-children
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/LayoutGroup.cs (L52-82)

- **Symptom:** hiding an optional row makes the window jump; or a disabled placeholder still reserves space.
- **Cause:** groups skip children with `!gameObject.activeInHierarchy` (and `ignoreLayout`); a disabled Graphic on an
  active object still counts.
- **Fix:** choose deliberately: `SetActive(false)` = `display:none`; disable the Graphic / CanvasGroup alpha 0 =
  `visibility:hidden`.

## CanvasScaler assumptions
TAG: pitfall.canvasscaler-assumptions
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/CanvasScaler.cs (L48-133, L301-347)

- **Symptom:** sizes tuned in pixels are wrong at another resolution; screenshots measured in pixels don't match the
  numbers in code.
- **Cause:** the game's root canvas may scale (Scale With Screen Size, match 0 = width by default); canvas units ≠ pixels.
- **Fix:** read the game's CanvasScaler and `canvas.scaleFactor` at runtime and log them; compare in canvas units.

## ContentSizeFitter grows from the pivot
TAG: pitfall.csf-pivot
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-ContentSizeFitter.html

- **Symptom:** a window that should grow downward grows equally up and down (title slides up off-screen).
- **Cause:** "the resizing is around the pivot."
- **Fix:** pivot (0.5, 1) or (0, 1) for windows anchored by their top edge.
