# 11 — CSS → uGUI/TMP mapping (DERIVED)

> **This whole file is derived** by the handbook author from the official pages and source quoted in files 01–09. No
> official page provides a CSS mapping. Each entry cites the uGUI/TMP page(s) that back the uGUI side. CSS behavior is
> stated only at the level needed for the comparison. Read the cited section before trusting a mapping in an edge case.

---

## Units: px, em, rem
TAG: css2ugui.units
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-CanvasScaler.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMPro_UGUI_Private.cs (L1729-1731)

- CSS `px` ≈ one **canvas unit**. Screen pixels = units × `canvas.scaleFactor` (CanvasScaler; Constant Pixel Size with
  factor 1 = no CanvasScaler = 1:1).
- CSS `em` for text-related lengths ≈ `tmp.fontSize` units (TMP: 1 em = fontSize units on a canvas).
- TMP spacing properties use **1/100 em** (`characterSpacing = 5` ≡ `0.05em`). TMP rich-text tags accept `px`, `em`, `%`;
  a bare number is px.
- There is no `rem`, `vw`, `%`-of-parent inside layout groups. Percent-of-parent exists only via anchors
  (`anchorMin/Max` fractions) on children that are **not** driven by a layout group (`ugui.rect.properties`).

## Box model: padding, margin, border
TAG: css2ugui.box-model
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-HorizontalLayoutGroup.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/LayoutGroup.cs (L16-21)

| CSS | uGUI |
|---|---|
| element box (`box-sizing: border-box`) | `RectTransform.rect` — the size is always the outer size |
| `padding` on a container | `LayoutGroup.padding` (`RectOffset`, **ints**, ctor order left, right, top, bottom) |
| `padding` on text | `TMP_Text.margin` Vector4 (left, top, right, bottom) — note the different order (`tmp.text.margins`) |
| `margin` on a child | none. Use the parent's `spacing` (uniform gap), a wrapper object with its own padding, or spacer children with a LayoutElement |
| `margin-left: auto` (push to the right) | spacer child with `LayoutElement.flexibleWidth = 1` |
| `border` | a Sliced frame Image (`fillCenter = false`) as background, or nested Images (`css2ugui.border-radius`) |
| `gap` | `HorizontalOrVerticalLayoutGroup.spacing` (float), `GridLayoutGroup.spacing` (Vector2) |

## Flexbox container
TAG: css2ugui.flex-container
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-HorizontalLayoutGroup.html
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-VerticalLayoutGroup.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/HorizontalOrVerticalLayoutGroup.cs (L144-219)

| CSS | uGUI |
|---|---|
| `display:flex; flex-direction: row` | `HorizontalLayoutGroup` with `childControlWidth = childControlHeight = true` |
| `flex-direction: column` | `VerticalLayoutGroup` |
| `flex-direction: row-reverse` | `reverseArrangement = true` (positions only; draw order stays hierarchy order) |
| `flex-wrap: wrap` | not supported. Use `GridLayoutGroup` (fixed cell size) or build rows yourself |
| `width: fit-content` on the container | `ContentSizeFitter` (Preferred) on the container itself — only on the root of a layout tree |
| `display: none` | `gameObject.SetActive(false)` — inactive children take no space and no spacing |
| `visibility: hidden` | keep the GameObject active, disable the Graphic(s) or set CanvasGroup alpha 0 — the space is kept |

## align-items and justify-content
TAG: css2ugui.align-items
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/HorizontalOrVerticalLayoutGroup.cs (L156-196)
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/LayoutGroup.cs (L191-211)

One `childAlignment` (`TextAnchor`) carries both axes:
- `align-items` (cross axis): `stretch` ⇔ `childForceExpand<cross> = true` (or child flexible > 0) with
  `childControl<cross> = true`. `flex-start | center | flex-end` ⇔ force-expand **off** on the cross axis and
  `childAlignment` Upper/Middle/Lower (row) or Left/Center/Right (column). Each child is aligned separately inside the
  padded area.
- `justify-content` (main axis): `flex-start | center | flex-end` ⇔ the main-axis component of `childAlignment`, **only
  effective when no child has flexible > 0** (and the content is smaller than the group). `space-between / space-around /
  space-evenly` do not exist: insert spacer children with `flexibleWidth = 1` (between ⇔ spacers only between items;
  around ⇔ half-weight spacers at the ends, derived).
- `align-self`: none; wrap the child in its own one-child group or use `ignoreLayout` + anchors.
- Baseline alignment of mixed text sizes: none at the group level; put the runs in one TMP with `<size>` tags.

## flex-grow, flex-shrink, flex-basis
TAG: css2ugui.flex-grow
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-LayoutElement.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/HorizontalOrVerticalLayoutGroup.cs (L180-217)

| CSS | uGUI |
|---|---|
| `flex-grow: n` | `LayoutElement.flexibleWidth = n` — shares only the space **beyond Σpreferred** |
| `flex-basis: auto` | `preferredWidth = -1` (content's preferred: TMP unwrapped width, sprite size, group sum) |
| `flex-basis: 0` | `preferredWidth = 0` |
| `flex: 1` (= `1 1 0%`) | `minWidth = 0, preferredWidth = 0, flexibleWidth = 1` |
| `flex-shrink` | no weights. Below Σpreferred every child gets `lerp(min, preferred, t)` with ONE shared t; nothing goes below `min` |
| `min-width` | `LayoutElement.minWidth` (CSS's default flex min is min-content; uGUI's default min for TMP/Image is **0**) |
| `max-width` | none in groups. Cap via `preferredWidth` + `flexibleWidth = 0`, or measure and clamp yourself |
| childForceExpand on | ≈ every child gets `flex-grow: max(own, 1)` — and the **container** then reports flex-grow ≥ 1 to its own parent (`ugui.hvgroup.force-expand-flexible`) |

## Grid with equal columns: repeat(N, 1fr)
TAG: css2ugui.grid-fr
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-GridLayoutGroup.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/HorizontalOrVerticalLayoutGroup.cs (L180-217)

`grid-template-columns: repeat(4, 1fr)`:
- **Option A (fills any width)**: one `HorizontalLayoutGroup` per row, `childControlWidth = true`,
  `childForceExpandWidth = false`; each cell `LayoutElement { minWidth = 0, preferredWidth = 0, flexibleWidth = 1 }`.
  Equal widths regardless of content (`ugui.layoutelement.equal-columns`). This equals CSS `repeat(4, minmax(0, 1fr))`;
  plain `1fr` in CSS has an automatic min-content minimum that uGUI does not reproduce.
- **Option B (fixed cells)**: `GridLayoutGroup` with `constraint = FixedColumnCount, constraintCount = 4` and
  `cellSize.x = (W − padding.horizontal − spacing.x·3) / 4` computed by you ("ignores the minimum, preferred, and flexible
  size properties of its contained layout elements").
- Row height = tallest cell: the row group reports the max preferred height of its cells (cross axis max).
- `grid-template-columns: 120px 1fr auto` → cell 1 `min = preferred = 120, flex 0`; cell 2 `pref 0, flex 1`;
  cell 3 `pref -1, flex 0` (content width) — in one HorizontalLayoutGroup with force-expand off.

## max-content, min-content, minmax(), fit-content()
TAG: css2ugui.intrinsic-sizes
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_Text.cs (L3736-3834)
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-ContentSizeFitter.html

| CSS | uGUI / TMP |
|---|---|
| `max-content` width of text | `tmp.preferredWidth` (laid out without wrapping) = what a group uses for the TMP child; `ContentSizeFitter.horizontalFit = PreferredSize` applies it to the object itself |
| `min-content` | no equivalent (TMP reports `minWidth = 0`). Measure the longest word with `GetPreferredValues(word)` if needed |
| `minmax(a, b)` | `LayoutElement { minWidth = a, preferredWidth = b, flexibleWidth = 0 }` — the group lerps between a and b as space shrinks |
| `minmax(a, 1fr)` | `{ minWidth = a, preferredWidth = 0 (or a), flexibleWidth = 1 }` |
| `fit-content(L)` | `preferredWidth = Mathf.Min(L, tmp.GetPreferredValues(text, 9999, 9999).x)` set by you, `flexibleWidth = 0`, wrapping on |
| `height: auto` (block) | the height a VerticalLayoutGroup/TMP reports as preferred; applied at the root by `ContentSizeFitter.verticalFit = PreferredSize` |

## line-height
TAG: css2ugui.line-height
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMPro_UGUI_Private.cs (L1798, L3355-3364)
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_Text.cs (L4525-4527, L4648, L8332-8356)
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/RichTextLineHeight.html

With F = fontSize, s = F / faceInfo.pointSize × faceInfo.scale:
- CSS `line-height: L` (px) sets the **pitch** between baselines to L and gives a single line a box of height L (half-leading
  above and below).
- TMP pitch = `faceInfo.lineHeight·s + lineSpacing·F/100`. To get pitch L:
  `lineSpacing = (L − faceInfo.lineHeight·s) · 100 / F`, or put `<line-height=Lpx>` at the start of the text (pitch = L,
  plus lineSpacing).
- TMP single-line box = `(ascentLine − descentLine)·s`; there is no half-leading. To reproduce a CSS line box of L around
  one line: `margin.y = margin.w = (L − (ascentLine − descentLine)·s) / 2` (TMP margins), or let the parent pad.
- Unitless CSS `line-height: 1.4` → L = 1.4·F.

## letter-spacing and word-spacing
TAG: css2ugui.letter-spacing
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMPro_UGUI_Private.cs (L3246-3249)
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/RichTextCharacterSpacing.html

`letter-spacing: X em` → `characterSpacing = 100·X`; `letter-spacing: Y px` → `characterSpacing = 100·Y / F`.
Inline: `<cspace=0.05em>` or `<cspace=1>` (px). `word-spacing` → `wordSpacing` (same unit). TMP adds the spacing after
every character including the last one on a line; the closing `</cspace>` removes it from the last character of the run.

## font-weight
TAG: css2ugui.font-weight
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/FontAssetsProperties.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMPro_UGUI_Private.cs (L2202-2236)

`font-weight: 700` → `FontStyles.Bold` / `<b>`; uses `fontWeightTable[7]` if assigned, otherwise **synthesized**: thicker SDF
(+`_WeightBold`) **and** `+boldSpacing·F/100` (default 0.07 em) after every character — wider than a browser bold
(`tmp.font.bold-synthesis`). `font-weight: 600` → `<font-weight=600>` only if a 600 asset exists (else regular glyphs).

## text-align, vertical centering
TAG: css2ugui.text-align
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/TMPObjectUIText.html

`text-align: left|center|right` → `horizontalAlignment = Left|Center|Right`; `justify` → `Justified` ("does not stretch the
last lines of paragraphs" — like CSS); `text-align-last: justify` → `Flush`. Vertical centering in a fixed box
(`display:flex; align-items:center` around text) → `verticalAlignment = Middle` (ascent/descent box) or `Geometry`
("Midline", mesh bounds) when caps look off-centre.

## white-space, text-overflow, overflow-wrap
TAG: css2ugui.text-overflow
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/TMPObjectUIText.html

| CSS | TMP |
|---|---|
| `white-space: nowrap` | `enableWordWrapping = false` (or `<nobr>` for a span) |
| `text-overflow: ellipsis` (+ `overflow:hidden; white-space:nowrap`) | `enableWordWrapping = false; overflowMode = TextOverflowModes.Ellipsis` with a bounded width (the width must come from the parent, not from a Horizontal Preferred fitter) |
| `overflow-wrap: anywhere` | default: "words that are longer than an entire line are split as well" |
| `overflow: hidden` on text | `overflowMode = Masking` or `Truncate` |
| `-webkit-line-clamp: n` | no direct option; `maxVisibleLines` / `Page` mode, or measure with `textInfo.lineCount` |

## z-index and stacking
TAG: css2ugui.z-index
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/UICanvas.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Canvas-overrideSorting.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/MaskUtilities.cs (L140-174)

- Within a canvas, paint order = hierarchy order (later sibling on top, a subtree paints as a block). `z-index` ⇔
  `SetSiblingIndex` / `SetAsLastSibling` among siblings only.
- A new stacking context with its own z-index ⇔ a nested `Canvas` with `overrideSorting = true` and `sortingOrder` (+ a
  `GraphicRaycaster` for input). Side effect: it escapes RectMask2D clipping of ancestors (`ugui.canvas.override-sorting-escapes-mask`).
- `position: fixed` top layer (tooltip, drag icon) ⇔ reparent to a top-level overlay container drawn last.

## position: absolute / relative
TAG: css2ugui.position
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/LayoutGroup.cs (L52-82, L247-315)
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/HOWTO-UICreateFromScripting.html

- Every RectTransform outside a layout group is "absolute" relative to its parent's rect via anchors + offsets.
- Inside a group: `LayoutElement.ignoreLayout = true` ⇔ `position: absolute` (the group stops driving it; anchors work again).
- `inset: 0` ⇔ `anchorMin = (0,0), anchorMax = (1,1), offsetMin = offsetMax = 0`.
- `position: relative; top: 4px` (visual nudge without affecting siblings) ⇔ not available on a group child itself
  (its anchoredPosition is driven every pass); put the visual in a child of that element and move the child.
- `transform: scale()` ⇔ `localScale` (does not affect layout unless the group's `childScaleWidth/Height` is on).

## overflow: hidden / scroll
TAG: css2ugui.overflow
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-RectMask2D.html
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-Mask.html
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-ScrollRect.html

`overflow: hidden` (rectangular) ⇔ `RectMask2D` (no stencil, no extra draw calls); non-rectangular clip (rounded) ⇔
`Mask` + sprite (stencil). `overflow: auto/scroll` ⇔ `ScrollRect` + viewport with a mask + content (often with a
VerticalLayoutGroup + ContentSizeFitter vertical Preferred on the content).

## border-radius
TAG: css2ugui.border-radius
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Image.cs (L698-719, L1025-1035, L1344-1374)
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Sprite.Create.html

There is no procedural rounding in uGUI. `border-radius: R` ⇔ a sprite whose corners are drawn with radius r px, sliced
with `border = r` (at least), `Image.type = Sliced`. On-screen radius in units = `r × referencePPU / (spritePPU ×
pixelsPerUnitMultiplier)` → choose `pixelsPerUnitMultiplier = r·referencePPU / (R·spritePPU)` to hit R from one source
sprite. A box smaller than `2R` squashes the corners (borders scale down to fit). Different radii per corner need
different sprites. A circle/pill ⇔ sliced sprite whose border = half its height with box height = 2R.

## border, outline, box-shadow, text-shadow
TAG: css2ugui.border-shadow
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-Shadow.html
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-Outline.html
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/ShadersDistanceField.html

| CSS | uGUI / TMP |
|---|---|
| `border: 1px solid c` | sliced frame sprite with `fillCenter = false`, or a background Image + inset child |
| `box-shadow` (hard) | uGUI `Shadow` component on the Image: "Effect Color", "Effect Distance" ("The offset of the shadow expressed as a vector"), "Use Graphic Alpha"; it "must be on the same GameObject as the graphic component" |
| `box-shadow` (blurred) | a blurred 9-slice sprite as an earlier sibling (drawn behind) — no blur in uGUI |
| `text-shadow` | TMP material Underlay (offset, dilate, softness = blur), or `Shadow` component |
| `-webkit-text-stroke` / outline | TMP material Outline (`_OutlineWidth`, half inside/half outside the contour) or uGUI `Outline` component |

## rgba() overlays and opacity
TAG: css2ugui.rgba-opacity
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/LinearRendering-LinearOrGammaWorkflow.html
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/class-CanvasGroup.html

- `background: rgba(0,0,0,0.5)` ⇔ Image color (0,0,0,a) — but the game blends in **linear** space: the same alpha looks
  lighter than in the browser. CSS 0.5 black ≈ Unity 0.76–0.78 (table in `color.linear.semi-transparent-mismatch`).
- Opaque hex colours match (`new Color32(r,g,b,255)` = CSS `#rrggbb`); very dark shades may shift a step because vertex
  colours are stored linearised in 8 bits (`color.linear.ui-vertex-colors`).
- `opacity: x` on a container ⇔ `CanvasGroup.alpha = x`, which multiplies each element's alpha ("the Canvas Group alpha and
  the alpha values of the individual UI elements are multiplied with each other") — it does not flatten the group first
  like CSS `opacity`, so overlapping children show through each other.
- `linear-gradient` ⇔ TMP Color Gradient / vertex colours (interpolated in linear space) or a baked sprite
  (`color.linear.gradients`).
