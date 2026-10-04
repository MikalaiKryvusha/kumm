# 07 — TextMeshPro text: sizes, spacing units, line height, alignment, wrapping, preferred values

> TMP 3.0.x is the package line for Unity 2020.x. The 3.0 manual is a single overview page; the detailed per-property
> manual pages are taken from the **3.2** manual (same 3.x line, next minor). Code facts come from the TMP **3.0.6**
> source (official package contents via needle-mirror). The target game's `Unity.TextMeshPro.dll` contains
> `isTextObjectScaleStatic` (added in the 3.0.x line); its exact patch version was not determined.
> `TextMeshProUGUI` = the canvas component (this file); `TextMeshPro` = the MeshRenderer 3D component.

---

## Components and where the code lives
TAG: tmp.text.components
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.0/manual/index.html
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/TMPObjectUIText.html

"The second TMP text component is of type <TextMeshProUGUI> and designed to work with the CanvasRenderer and Canvas
system. This component is an ideal replacement for the UI.Text component."
A UI text object = RectTransform + CanvasRenderer + TextMeshPro UGUI + a TMP material (font asset's default material
unless overridden). `TextMeshProUGUI : TMP_Text : MaskableGraphic`, implements `ILayoutElement`.
Source files: `TMP_Text.cs` (properties, preferred values, tag parsing), `TMPro_UGUI_Private.cs` (`GenerateTextMesh`),
`TextMeshProUGUI.cs` (layout/dirty plumbing).

## Defaults come from the game's TMP Settings asset
TAG: tmp.text.defaults-from-settings
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_Text.cs (L5946-5996)
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_Text.cs (L453-904)

(source) On a freshly added component (`m_fontSize == -99`), `LoadDefaultSettings()` copies from `TMP_Settings`:
`enableWordWrapping`, `enableKerning`, `enableExtraPadding`, `tintAllSprites`, `parseCtrlCharacters`,
`fontSize = TMP_Settings.defaultFontSize`, `fontSizeMin/Max = fontSize × defaultTextAutoSizingMin/MaxRatio`,
`raycastTarget = TMP_Settings.enableRaycastTarget`, `isTextObjectScaleStatic`; and if `sizeDelta == (100,100)` replaces
it with `TMP_Settings.defaultTextMeshProUITextContainerSize`. These values belong to **the game's** TMP Settings asset,
not to Unity's shipped defaults. Field initializers in `TMP_Text` (used only when no settings apply):
`fontStyle = Normal`, `fontWeight = Regular`, horizontal `Left` / vertical `Top` (i.e. TopLeft), `overflowMode = Overflow`,
`enableWordWrapping = false`, `richText = true`, `margin = (0,0,0,0)`, all spacings `0`, `wordWrappingRatios = 0.4`,
`enableExtraPadding = false`, `parseCtrlCharacters = true`.
Rule: in a mod, **set every property you care about explicitly** (font asset, size, style, alignment, wrapping,
overflow, margins, spacings, raycastTarget).

## Font size units
TAG: tmp.text.font-size-units
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/TMPObjectUIText.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMPro_UGUI_Private.cs (L1729-1731)

Manual: Font Size — "Specify the text display size, in points." (source) for the UI component `m_isOrthographic = true`
(`TMPro_UGUI_Private.cs` L94) and
```csharp
float baseScale = (m_fontSize / m_fontAsset.m_FaceInfo.pointSize * m_fontAsset.m_FaceInfo.scale * (m_isOrthographic ? 1 : 0.1f));
float currentEmScale = m_fontSize * 0.01f * (m_isOrthographic ? 1 : 0.1f);
```
Glyph metrics are stored at the atlas sampling size `faceInfo.pointSize`, so on a canvas **1 em = fontSize canvas units**
(× `faceInfo.scale`, normally 1). With CanvasScaler factor 1, `fontSize 18` ≈ CSS `font-size: 18px`.
`currentEmScale` = fontSize/100 — the unit used by every spacing property (next section).

## Spacing properties and their UNITS (character / word / line / paragraph)
TAG: tmp.text.spacing-units
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/TMPObjectUIText.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.9/CHANGELOG.md
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMPro_UGUI_Private.cs (L3228-3250, L2638-2642, L3357-3363)
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.0/api/TMPro.TMP_Text.html

Changelog (2.1.0-preview.1 / 1.5.0-preview.1, inherited by 3.0): "Revised Character, Word, Line and Paragraph spacing
adjustments to be in font units (em) where a value of 1 represents 1/100 em."

| C# property | Inspector | Default | Unit | Added where (source) |
|---|---|---|---|---|
| `characterSpacing` | Spacing: Character | 0 | 1 = 0.01 em = fontSize/100 units | after **every** character's advance |
| `wordSpacing` | Spacing: Word | 0 | 0.01 em | after whitespace / U+200B only |
| `lineSpacing` | Spacing: Line | 0 | 0.01 em | added to every line break advance |
| `paragraphSpacing` | Spacing: Paragraph | 0 | 0.01 em | extra, only after `\n` (10) or U+2029 |
| font asset `normalSpacingOffset` | (Font Weights: Spacing Offset) | 0 | 0.01 em | every character, regular and bold |
| font asset `boldSpacing` | (Font Weights: Bold Spacing) | **7** | 0.01 em | every **synthesized-bold** character (`tmp.font.bold-synthesis`) |

Character advance, verbatim (`GenerateTextMesh`, left-to-right branch):
```csharp
m_xAdvance += ((currentGlyphMetrics.horizontalAdvance * scaleFXMultiplier + glyphAdjustments.m_XAdvance) * currentElementScale
             + (m_currentFontAsset.normalSpacingOffset + characterSpacingAdjustment + boldSpacingAdjustment) * currentEmScale
             + m_cSpacing) * (1 - m_charWidthAdjDelta);

if (isWhiteSpace || charCode == 0x200B)
    m_xAdvance += m_wordSpacing * currentEmScale;
```
(`characterSpacingAdjustment = m_characterSpacing`, zeroed for kerning pairs flagged `IgnoreSpacingAdjustments`;
`m_cSpacing` = the `<cspace>` tag in absolute units; `m_charWidthAdjDelta` = auto-size width squeeze.)
API names: `characterSpacing` — "The amount of additional spacing between characters."; `wordSpacing` — "The amount of
additional spacing between words."; `lineSpacing` — "The amount of additional spacing to add between each lines of text."
Conversion: CSS `letter-spacing: 0.05em` → `characterSpacing = 5`; CSS `letter-spacing: 1px` at font-size 16 →
`characterSpacing = 100 × 1/16 = 6.25`.

## Line advance (distance from one baseline to the next)
TAG: tmp.text.line-advance
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMPro_UGUI_Private.cs (L1798, L2633-2644, L3355-3364)
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/FontAssetsLineMetrics.html

Verbatim (source):
```csharp
float lineGap = m_currentFontAsset.m_FaceInfo.lineHeight - (m_currentFontAsset.m_FaceInfo.ascentLine - m_currentFontAsset.m_FaceInfo.descentLine);
...
// on a line break (hard break shown; word-wrap break is the same without paragraphSpacing):
if (m_lineHeight == TMP_Math.FLOAT_UNSET)
{
    float lineOffsetDelta = 0 - m_maxLineDescender + lastVisibleAscender + (lineGap + m_lineSpacingDelta) * baseScale
                          + (m_lineSpacing + (charCode == 10 || charCode == 0x2029 ? m_paragraphSpacing : 0)) * currentEmScale;
    m_lineOffset += lineOffsetDelta;
}
else
    m_lineOffset += m_lineHeight + (m_lineSpacing + (charCode == 10 || charCode == 0x2029 ? m_paragraphSpacing : 0)) * currentEmScale;
```
For a uniform font and size (descender is negative, `m_lineSpacingDelta` = 0 unless auto-size squeezes lines):
`advance = (ascentLine − descentLine + lineGap) × s + lineSpacing × F/100 = faceInfo.lineHeight × s + lineSpacing × F/100`,
where `s = F / faceInfo.pointSize × faceInfo.scale` and F = fontSize.
Manual: Line Height — "The distance between the tops of consecutive lines." Mixed sizes in a line (`<size>`, sprites,
fallback fonts with taller metrics) raise that line's ascender/descender and push lines apart.
`<line-height=X>` replaces the font part with a fixed pitch: `m_lineHeight + lineSpacing·F/100`
(`tmp.text.rich-tags-layout`).

## Height of a single line = ascent − descent (not lineHeight)
TAG: tmp.text.single-line-height
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_Text.cs (L4172-4235, L4525-4527, L4648, L4792-4800)
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/TextCore.FaceInfo.html

(source, `CalculatePreferredValues`) `renderedHeight = m_maxTextAscender - m_ElementDescender` — from the first line's
ascender down to the last line's descender, then `+ margin.y + margin.w` (positive margins only), then rounded:
`renderedHeight = (int)(renderedHeight * 100 + 1f) / 100f`.
So preferred height of one line = `(ascentLine − descentLine) × F / pointSize`; of n lines =
that + (n−1) × line advance. The font's `lineGap` part of `lineHeight` is **not** added above the first or below the last
line — unlike CSS, where `line-height` leading is split above and below every line box. FaceInfo API: `ascentLine` —
"typically located at the top of the tallest glyph in the typeface"; `descentLine` — "at the bottom of the glyph with the
lowest descender"; `lineHeight` — "the distance between consecutive lines of text".

## Font style flags
TAG: tmp.text.font-style
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/TMPObjectUIText.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_Text.cs (L102-104)

`[Flags] enum FontStyles { Normal = 0x0, Bold = 0x1, Italic = 0x2, Underline = 0x4, LowerCase = 0x8, UpperCase = 0x10,
SmallCaps = 0x20, Strikethrough = 0x40, Superscript = 0x80, Subscript = 0x100, Highlight = 0x200 }`;
`enum FontWeight { Thin = 100, ExtraLight = 200, Light = 300, Regular = 400, Medium = 500, SemiBold = 600, Bold = 700,
Heavy = 800, Black = 900 }`. Manual: B — "Bold the text. The appearance of bold text is defined in the font Asset
properties." casing options "are mutually exclusive". `fontWeight` (API): "Control the weight of the font if an
alternative font asset is assigned for the given weight in the font asset editor." Bold mechanics and width effect:
`tmp.font.bold-synthesis`.

## Auto Size
TAG: tmp.text.auto-size
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/TMPObjectUIText.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_Text.cs (L3736-3834, L4767-4784)

Manual: "TextMesh Pro lays out the text multiple times to find a good fit. This is a resource intensive process, so avoid
auto-sizing dynamic text that changes frequently." Options: Min / Max (points), WD% ("maximum acceptable amount to reduce
character width ... usually only acceptable for digits"), Line (line spacing reduction).
(source) **preferredWidth/preferredHeight are computed at `fontSizeMax`** when auto-size is on
(`float fontSize = m_enableAutoSizing ? m_fontSizeMax : m_fontSize;`), so a layout group sizes an auto-sized label for
the largest size; the shrink happens later inside that box.

## Alignment
TAG: tmp.text.alignment
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/TMPObjectUIText.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_Text.cs (L23-84, L576-620)

`alignment` (`TextAlignmentOptions`) = horizontal | vertical, e.g. `TopLeft`, `Top` (= top-center), `Left`
(= middle-left), `Center`, `BottomRight`, `BaselineLeft`, `MidlineLeft`, `CaplineLeft`, `...Justified`, `...Flush`,
`...GeoAligned`. Also `horizontalAlignment` (`Left, Center, Right, Justified, Flush, Geometry`) and `verticalAlignment`
(`Top, Middle, Bottom, Baseline, Geometry` = "Midline", `Capline`). Default = TopLeft.
Manual meanings: Justified/Flush "Stretch the text to fill the width ... Justified mode does not stretch the last lines of
paragraphs, while Flush mode does"; Geometry Center "Centers the text based on the mesh rather than the text metrics";
Baseline "Position the text so the baseline of the line is aligned with the middle of the display area"; Midline
"determine vertical placement using the bounds of the text mesh, rather than line metrics. This is useful in tight spaces
when ascenders and descenders might otherwise extend too far."; Capline "Position the text so the middle of the first the
line is aligned with the middle of the display area." `wordWrappingRatios` (Wrap Mix, default 0.4) balances word vs
character stretching for Justified/Flush.
Practical (derived): Middle centers the **ascent..descent box**, so caps-only labels look low in a button; try Midline
or Capline for single-line button captions.

## Wrapping and overflow
TAG: tmp.text.wrapping-overflow
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/TMPObjectUIText.html
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.0/api/TMPro.TMP_Text.html

`enableWordWrapping` — "Controls whether or not word wrapping is applied. When disabled, the text will be displayed on a
single line." Manual: "Lines are normally wrapped at word boundaries, but words that are longer than an entire line are
split as well." "Some overflow options supersede wrapping. For example, if Overflow is set to truncate, the text is
truncated when it reaches the edge of the display area, irrespective of whether Wrapping is enabled."
`overflowMode` (`TextOverflowModes`): `Overflow` (default) — "Extends the text beyond the bounds of the display area, but
still wraps it if Wrapping is enabled."; `Ellipsis` — "Cuts off the text and inserts an ellipsis (…)"; `Masking` — "Like
Overflow, but the shader hides everything outside of the display area."; `Truncate`; `ScrollRect` (legacy); `Page`;
`Linked` (continue in another text object).

## Margins
TAG: tmp.text.margins
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/TMPObjectUIText.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMPro_UGUI_Private.cs (L1487-1495)
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_Text.cs (L1109-1115, L4792-4796)

Manual: "Set positive values to increase the distance between the text and the boundaries of the text container ...
Negative values make the text extend beyond the boundaries of the text container."
`margin` is a `Vector4` = **(x = left, y = top, z = right, w = bottom)** (source: `m_marginWidth = rect.width -
m_margin.x - m_margin.z; m_marginHeight = rect.height - m_margin.y - m_margin.w;`). Default (0,0,0,0).
Preferred size includes positive margins only.
(source) The `margin` setter calls `ComputeMarginSize(); m_havePropertiesChanged = true; SetVerticesDirty();` — **no
`SetLayoutDirty()`**: a parent layout group does not learn that the preferred size changed. Set margins before the text,
or call `tmp.SetLayoutDirty()` / `LayoutRebuilder.MarkLayoutForRebuild(tmp.rectTransform)` after changing them.

## Preferred values: what a layout group or fitter sees
TAG: tmp.text.preferred-values
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_Text.cs (L3644-3868)
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.0/api/TMPro.TMP_Text.html

(source)
- `preferredWidth` → `GetPreferredWidth()`: margins = infinity, `CalculatePreferredValues(ref fontSize, margin, false, false)`
  — **no wrapping, no auto-size**: the width of the longest hard line (+ left/right margins). Cached until
  `SetLayoutDirty()` sets `m_isPreferredWidthDirty`.
- `preferredHeight` → `GetPreferredHeight()`: width = `m_marginWidth` (current rect width − margins; infinity if 0),
  wrapping per `enableWordWrapping`, auto-size per settings — the height **at the current width**. This is why
  "width first, height second" (`ugui.autolayout.order`) gives correct paragraph heights.
- `GetPreferredValues()` — "Function to Calculate the Preferred Width and Height of the text object." Always recomputes.
- `GetPreferredValues(float width, float height)` — measure the current text in a box of that size.
- `GetPreferredValues(string text)` / `(string text, float width, float height)` — measure another string without
  displaying it (fixed in 3.0.5: "incorrectly changing the text").
- Values are rounded up to 0.01 (`(int)(x * 100 + 1f) / 100f`).
- `renderedWidth/renderedHeight`, `textBounds` — the actual mesh extents after generation (need a mesh update first).
```csharp
Vector2 one = label.GetPreferredValues("Длинное название предмета", 9999f, 9999f); // one-line width and height
float h280 = label.GetPreferredValues(longText, 280f, 9999f).y;                    // height when wrapped at 280
// .x of the second call is still the UNWRAPPED width (see note below)
```
Note: in `GetPreferredValues(text, w, h)` the **width** result is computed unwrapped (`CalculatePreferredValues(...,
false, false)` in `GetPreferredWidth(margin)`), the **height** result wraps at `w` when `enableWordWrapping` is on.

## TMP as a layout element
TAG: tmp.text.layout-element
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_Text.cs (L1327-1416)
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TextMeshProUGUI.cs (L84-129)

(source) `minWidth = minHeight = 0` (fields never set), `flexibleWidth = flexibleHeight = -1` (unset → 0 in a group),
`layoutPriority = 0`. `CalculateLayoutInputHorizontal/Vertical()` are empty — values are computed lazily in the getters.
`SetLayoutDirty()` sets both preferred-dirty flags and calls `LayoutRebuilder.MarkLayoutForRebuild(this.rectTransform)`.
Setters that call it: `text`, `fontSize`, `fontWeight`, `fontStyle`, `enableAutoSizing`, `fontSizeMin/Max`, all four
spacings, `enableWordWrapping`, `wordWrappingRatios`, `overflowMode`, `enableKerning`, `richText`,
`parseCtrlCharacters`. Vertices only (no layout dirty): `margin`, `enableExtraPadding`, `color`, `alignment`,
`horizontalAlignment`, `verticalAlignment` (source L256-259, L561-617, L852, L1112).
Because min = 0, a text in a squeezed layout group can be shrunk to nothing; give it `LayoutElement.minWidth` if it must
stay readable.

## Text changes re-layout automatically — if layout owns the size
TAG: tmp.text.change-propagation
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_Text.cs (L114-135, L1271)
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMPro_EventManager.cs (L35, L75-77)
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMPro_UGUI_Private.cs (L1707, L3550, L4421 `OnPreRenderText?.Invoke(m_textInfo)`, L4485 `TMPro_EventManager.ON_TEXT_CHANGED(this)`)

(source) `text` setter: `m_havePropertiesChanged = true; SetVerticesDirty(); SetLayoutDirty();` — so any later text
change (a translator plugin, a localization pass, a value update) re-runs the layout at the end of that frame **for
layout-group/fitter-driven sizes**. Sizes you computed yourself from `preferredWidth` at build time are not updated.
Hooks if you size manually: `TMPro_EventManager.TEXT_CHANGED_EVENT.Add(Action<Object>)` (fired from mesh generation) or
the instance event `OnPreRenderText` (`Action<TMP_TextInfo>`).

## Rich text: syntax and units
TAG: tmp.text.rich-text
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/RichText.html
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/RichTextSupportedTags.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_Text.cs (L6846-6926)

- `<tag>`, `<tag=value>`, `<tag attribute=value>`; closing `</tag>`. "A tag, including its attributes, can be up to 128
  characters long." Value types: decimals `0.5`, percentages `25%`, pixels `5px`, font units `1.5em`, hex colors
  `#FFFFFF` / `#FFFFFFFF` / `#FF` (alpha).
- (source) A numeric value with **no suffix is pixels** (`TagUnitType.Pixels` default); `em` → font units (× current font
  size); `%` → percentage.
- Scope: "If you use the same tag more than once in a text block, the last tag supersedes all previous tags of the same
  type." Nested tags need not be closed in order.
- `richText = false` disables parsing; `<noparse>` escapes a span.
- Supported tags (3.2 list): align, allcaps, alpha, b, br, color, cspace, font, font-weight, gradient, i, indent,
  line-height, line-indent, link, lowercase, margin, mark, mspace, nobr, noparse, page, pos, rotate, s, size, smallcaps,
  space, sprite, strikethrough, style, sub, sup, u, uppercase, voffset, width.

## Rich-text tags that affect layout
TAG: tmp.text.rich-tags-layout
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/RichTextCharacterSpacing.html
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/RichTextLineHeight.html
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/RichTextMargins.html
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/RichTextSize.html
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/RichTextFontWeight.html
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/RichTextBoldItalic.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_Text.cs (L7896-7926, L8332-8356)

| Tag | Units / behavior |
|---|---|
| `<cspace=X>` | "adjust character spacing, either absolute or relative ... You can use pixels or font units." (source) px: `m_cSpacing = value`; em: `value × currentFontSize`; `%` rejected. Added after every character in scope; `</cspace>` removes it from the last character. |
| `<line-height=X>` | "controls how far down from the current line the next line starts. It does not change the current line." px or em: absolute pitch; `%`: `faceInfo.lineHeight × value/100 × fontScale`. `</line-height>` reverts. |
| `<margin=X>`, `<margin-left>`, `<margin-right>` | "pixels, font units, and percentages. Negative values have no effect." Relative to the component margins. |
| `<size=X>` | pixels (`5px`), font units, percentage, or relative `+1`/`-1` ("Relative sizes are based on the original font size, so they're not cumulative"). |
| `<b>` | bold — font weight 700 asset if assigned, else synthesized (`tmp.font.bold-synthesis`). |
| `<font-weight=N>` | "You can only apply font weights defined in the Font Asset properties. If you have not defined any font weights, you can still use values of 400 and 700 to apply the multipliers set in the Normal Weight and Bold Weight properties." |
| `<space=X>`, `<mspace=X>`, `<voffset=X>`, `<indent=X>`, `<line-indent=X>`, `<pos=X>`, `<width=X>`, `<nobr>` | horizontal offset, monospace advance, baseline shift, indent until next hard break, first-line indent, caret position, text-area width, keep-together (supported-tags table). |

## Extra settings
TAG: tmp.text.extra-settings
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/TMPObjectUIText.html

Rich Text (toggle parsing), Raycast Target ("Disabling this option causes the UI to ignores this TextMesh Pro GameObject
when determining what the cursor interacts with" — turn it off on labels), Parse Escape Characters ("`\n` is interpreted as
a newline ... In code, escaped characters are already parsed by the compiler"), Kerning ("Kerning is defined in the
GameObject's Font Asset"), Extra Padding ("reduces the chances that glyphs are cut off at the boundaries of their
sprites" — use with heavy outlines/bold), Geometry Sorting, Visible Descender.

## Forcing a mesh update to read textInfo/bounds now
TAG: tmp.text.force-mesh-update
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.0/api/TMPro.TMP_Text.html

`ForceMeshUpdate(bool ignoreActiveState = false, bool forceTextReparsing = false)` — "Function to force regeneration of
the text object before its normal process time. This is useful when changes to the text object properties need to be
applied immediately." Needed before reading `textInfo` (line count, character positions), `textBounds`,
`renderedWidth/Height` in the same frame you set the text. It does not run the uGUI layout pass; size the RectTransform
first (or `LayoutRebuilder.ForceRebuildLayoutImmediate`), then `ForceMeshUpdate()`.
