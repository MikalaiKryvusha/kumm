# 08 — TMP font assets, synthesized bold, SDF material properties

> Sources: TMP 3.2 manual pages (same 3.x line; the 3.0 manual has no per-topic pages), TMP 3.0 API reference, TMP 3.0.6
> source and the SDF shaders from the 3.0.6 "TMP Essential Resources" package (read in memory with
> `tools/read_unitypackage.py`).

---

## Font asset = atlas texture + material + tables
TAG: tmp.font.asset-structure
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/FontAssets.html
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/FontAssetsProperties.html

"Every TextMesh Pro font Asset has two sub-Assets: Font atlas: a black and white or grayscale texture file that contains
all of the characters included in the font Asset. Font material: a material that controls the appearance of TextMesh Pro
text using one of the TextMesh Pro shaders."
Inspector sections: Face Info, Generation Settings, Atlas & Material, Font Weights, Fallback Font Assets, Character Table,
Glyph Table (per glyph: X/Y/W/H in atlas, OX/OY bearing, **ADV** advance, SF scale), Glyph Adjustment Table (kerning
pairs: OX, OY, AX).
Atlas types: "Distance Field: ... recommended Font Asset type for most applications because SDF atlases produce text that
is smooth when transformed"; Smooth/Hinted Smooth (antialiased bitmap; "Transforming text generated from a smooth atlas
blurs the text edges"); Raster/Raster Hinted ("almost always produce text with jagged, pixellated edges").

## Face Info / line metrics
TAG: tmp.font.faceinfo-metrics
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/FontAssetsProperties.html
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/FontAssetsLineMetrics.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/TextCore.FaceInfo.html

| Field (`fontAsset.faceInfo.*`) | Meaning (quoted) |
|---|---|
| `pointSize` | "The font size in points. TextMesh Pro bakes this value into the atlas texture" — the sampling size; all metrics below are in atlas pixels at this size. |
| `scale` | "Scales the font by this amount. For example, a value of 1.5 scales glyphs to 150% of their normal size." |
| `lineHeight` | "The distance between the tops of consecutive lines. If you set the line height to a value greater than the combined size of the Ascender and Descender, it creates a gap between lines." |
| `ascentLine` | "how far characters can extend above the baseline. It corresponds to the top of a line." |
| `capLine` | "The height of capital letters from the baseline." |
| `meanLine` | "maximum height for non-ascending lowercase glyphs" |
| `baseline` | "The baseline is the horizontal line that characters sit on." |
| `descentLine` | "how far characters can extend below the baseline" (negative value) |
| `underlineOffset`, `underlineThickness`, `strikethroughOffset`, super/subscript offset & size, `tabWidth` | as named |

"Most line metric values are relative to the Baseline ... Values for above-the-baseline metrics ... are greater that the
Baseline value. Values for below-the-baseline metrics ... are less than Baseline value."
How TMP uses them: line pitch = `lineHeight` (+ lineSpacing), one-line box = `ascentLine − descentLine`
(`tmp.text.line-advance`, `tmp.text.single-line-height`). Scale to canvas units: `× fontSize / pointSize × scale`.

## Generation settings and render modes
TAG: tmp.font.atlas-render-modes
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/FontAssetsProperties.html
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/Shaders.html

Atlas Population Mode: Dynamic / Static. Atlas Render Mode: SMOOTH, RASTER, SMOOTH_HINTED, RASTER_HINTED, SDF ("slower,
but more accurate SDF generation mode, and no oversampling"), SDFAA ("faster, but less accurate ... sufficient for most
situations"), SDFAA_HINTED, SDF8, SDF16, SDF32 ("Use this setting for fonts with complex or small characters").
Sampling Point Size, Padding ("The amount of padding between characters in the font atlas texture"), Atlas Width/Height,
Multi Atlas Textures.
Padding matters for effects: "data from adjacent characters in the font atlas will bleed into the current character. You
can increase the padding when importing a font to give the effects more space." The shader's Gradient Scale "is equal to
Padding +1".

## Dynamic font assets
TAG: tmp.font.dynamic
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/FontAssetsDynamicFonts.html
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/FontAssets.html

"Instead of baking characters into an atlas in advance, you start with an empty atlas to which characters are added
automatically as you use them." Costs: "Dynamic fonts require more computational resources than static fonts."; "Dynamic
font assets maintain a link to the original font file used to created them"; "Source fonts of any dynamic font assets in
your game are included in builds". Reset / "Clear Dynamic Data" empty the character and glyph tables and resize the atlas
to 0×0 (the latter keeps font-feature tables).
API: `TryAddCharacters(string characters, bool includeFontFeatures = false)` — "Try adding the characters from the
provided string to the font asset." `HasCharacter(char character, bool searchFallbacks = false, bool tryAddCharacter =
false)`; `HasCharacters(string text, out uint[] missingCharacters, bool searchFallbacks = false, bool tryAddCharacter =
false)`.

## Creating a font asset at runtime
TAG: tmp.font.create-runtime
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.0/api/TMPro.TMP_FontAsset.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_FontAsset.cs (L432-527)

```csharp
public static TMP_FontAsset CreateFontAsset(Font font)
{   return CreateFontAsset(font, 90, 9, GlyphRenderMode.SDFAA, 1024, 1024, AtlasPopulationMode.Dynamic); }

public static TMP_FontAsset CreateFontAsset(Font font, int samplingPointSize, int atlasPadding, GlyphRenderMode renderMode,
    int atlasWidth, int atlasHeight, AtlasPopulationMode atlasPopulationMode = AtlasPopulationMode.Dynamic,
    bool enableMultiAtlasSupport = true)
```
(source) Defaults: sampling **90 pt**, padding **9**, **SDFAA**, **1024×1024**, **Dynamic**, multi-atlas **on**.
If `FontEngine.LoadFontFace(font, samplingPointSize)` fails it logs "Unable to load font face for [name]. Make sure
"Include Font Data" is enabled in the Font Import Settings." and returns null. The created material uses
`ShaderUtilities.ShaderRef_MobileSDF` (TextMeshPro/Mobile/Distance Field) for SDF modes and gets
`_WeightNormal = fontAsset.normalStyle`, `_WeightBold = fontAsset.boldStyle`. The new asset's style fields are the class
defaults (`normalStyle 0`, `normalSpacingOffset 0`, `boldStyle 0.75`, `boldSpacing 7`, `italicStyle 35`, `tabSize 10`).

## Fallback chain
TAG: tmp.font.fallback-chain
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/FontAssetsFallback.html
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/FontAssetsProperties.html

Search order for a missing glyph: 1 the text's primary font asset; 2 that asset's Fallback Font Assets ("in the order
they're listed ... The search is recursive"); 3 the text object's Sprite Asset; 4 General Fallback Font Assets (TMP
Settings); 5 Default Sprite Asset; 6 Default Font Asset; 7 Missing glyphs character. "The fallback chain search is designed
to detect circular references so each Asset in the chain is only searched once."
Cost: "searching the list for missing characters requires extra computing resources, and ... using additional fonts
requires additional draw calls." A fallback font with different ascent/descent metrics changes line heights of lines
that use it (`tmp.text.line-advance`).

## Font weights table (real bold assets)
TAG: tmp.font.weights-table
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/FontAssetsProperties.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_FontAsset.cs (L371-377)
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_FontAssetCommon.cs (L125-129)
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_FontAssetUtilities.cs (L65-140)

Manual: two ways — "Create different bold and italic variants of the font Asset, and add them to the Font Table." or
"Define "fake" bolding and italicization by setting the Font Weight > Italic Style and Bold Weight properties." "If you
don't specify font assets, TextMesh Pro "fakes" bolding and italicization ... Using "faked" font weights limits you to
regular and italic versions of normal and bold text (equivalent to weights of 400 and 700 respectively)."
(source) `TMP_FontWeightPair[] fontWeightTable` (length 10, index = weight/100: 1 Thin … 4 Regular … 7 Bold … 9 Black);
`TMP_FontWeightPair` is a **struct** `{ TMP_FontAsset regularTypeface; TMP_FontAsset italicTypeface; }`; the getter returns
the array itself, so in-place assignment works:
```csharp
regularAsset.fontWeightTable[7].regularTypeface = boldAsset;   // <b> and FontWeight.Bold now use real bold glyphs
regularAsset.fontWeightTable[6].regularTypeface = semiBoldAsset; // <font-weight=600>
```
Lookup (source): for italic or non-Regular weight, `temp = isItalic ? fontWeights[i].italicTypeface :
fontWeights[i].regularTypeface`; if `temp` has the glyph (or is Dynamic and can add it) → `isAlternativeTypeface = true`.
Otherwise the regular glyph is used and the style is synthesized.

## Synthesized bold: dilation + extra advance (why bold text gets wider letter spacing)
TAG: tmp.font.bold-synthesis
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMPro_UGUI_Private.cs (L1731, L1741, L2202-2236, L3246)
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_Text.cs (L4326-4331, L4600)
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_FontAsset.cs (L389-414)
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.0/api/TMPro.TMP_FontAsset.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.9/CHANGELOG.md

Font asset fields (source, class defaults): `normalStyle = 0` ("dilation of the text when using regular style"),
`normalSpacingOffset = 0`, `boldStyle = 0.75f` ("Defines the dilation of the text when using bold style"),
`boldSpacing = 7f` (API text says "The spacing between characters when using regular style" — a copy-paste error; the
code uses it for bold), `italicStyle = 35`, `tabSize = 10`. Manual: "Bold Spacing — Add space between characters when
using the fake bold text style (meaning you haven't specified a Bold font Asset)."

Mesh generation, verbatim (`GenerateTextMesh`):
```csharp
// Set Padding based on selected font style
if (m_textElementType == TMP_TextElementType.Character && !isUsingAltTypeface && ((m_FontStyleInternal & FontStyles.Bold) == FontStyles.Bold))
{
    if (m_currentMaterial != null && m_currentMaterial.HasProperty(ShaderUtilities.ID_GradientScale))
    {
        float gradientScale = m_currentMaterial.GetFloat(ShaderUtilities.ID_GradientScale);
        style_padding = m_currentFontAsset.boldStyle / 4.0f * gradientScale * m_currentMaterial.GetFloat(ShaderUtilities.ID_ScaleRatio_A);
        // Clamp overall padding to Gradient Scale size.
        if (style_padding + padding > gradientScale)
            padding = gradientScale - style_padding;
    }
    else
        style_padding = 0;

    boldSpacingAdjustment = m_currentFontAsset.boldSpacing;
}
...
m_xAdvance += ((currentGlyphMetrics.horizontalAdvance * scaleFXMultiplier + glyphAdjustments.m_XAdvance) * currentElementScale
             + (m_currentFontAsset.normalSpacingOffset + characterSpacingAdjustment + boldSpacingAdjustment) * currentEmScale
             + m_cSpacing) * (1 - m_charWidthAdjDelta);
```
and `float currentEmScale = m_fontSize * 0.01f * ...` (set once from the **component** font size, L1731).
The same `boldSpacingAdjustment` term is in `CalculatePreferredValues` (TMP_Text.cs L4328-4330, L4600), so **preferred
width grows too**.
So a synthesized-bold character:
1. keeps the regular glyph's advance (`horizontalAdvance` is not changed),
2. gets **+ boldSpacing × fontSize / 100** units of extra advance → default **+0.07 em per character**,
3. is drawn thicker by the shader (`_WeightBold`, next section) inside a quad enlarged by `style_padding` (quad size only,
   not advance).
Glyph shapes get thicker but the extra advance is a fixed 7% of an em added after every letter, so bold words look
"letter-spaced", most visibly in narrow scripts and in Cyrillic lowercase. When the weight-700 asset supplies the glyph
(`isUsingAltTypeface`), neither the dilation nor `boldSpacing` is applied.
Changelog 3.0.4/2.1.4/1.5.4: "Revised how the Bold Spacing which is defined per font asset will affect spacing between bold
characters to ensure more uniform spacing. This change may require users to manually adjust the bold spacing value of
their font assets to maintain similar spacing / layout results."

## Worked numbers for synthesized bold
TAG: tmp.font.bold-spacing-math
SOURCE: derived from tmp.font.bold-synthesis

fontSize 18, boldSpacing 7 → +7 × 0.18 = **+1.26 units per character**. A 24-character bold title is **+30 units** wider
than the regular title. A typical lowercase advance near 0.5 em = 9 units → the gap grows by ~14% of a letter.
fontSize 14 → +0.98 per character. With a real bold face assigned (`tmp.font.weights-table`) the advances come from
the bold glyphs and this term disappears.

## Fixing too-wide synthesized bold
TAG: tmp.font.bold-fixes
SOURCE: derived from tmp.font.bold-synthesis and tmp.font.weights-table

In order of preference:
1. **Real bold face**: build a TMP_FontAsset from the bold font file (`TMP_FontAsset.CreateFontAsset(boldFont)`) and put it
   in `regularAsset.fontWeightTable[7].regularTypeface`. Correct shapes and advances; no boldSpacing, no dilation.
2. **Cancel the advance per text**: on a fully bold label set `tmp.characterSpacing = -fontAsset.boldSpacing` (both terms
   are multiplied by the same `currentEmScale`, so they cancel exactly, kerning-flagged pairs excepted). For a bold run
   inside mixed text: `<b><cspace=-0.07em>…</cspace></b>` (`<cspace>` em uses the *current* `<size>` font size, boldSpacing
   uses the component size — equal when there is no `<size>` tag).
3. **Change the asset field**: `fontAsset.boldSpacing = 0..2`. This is shared by every text that uses the asset — in a mod
   that means the game's own bold texts change too. (Copying the asset with `Object.Instantiate` would duplicate tables
   that reference the same atlas texture; not tested here — avoid for Dynamic assets.)
4. **Lighter look**: the stroke thickness comes from the material's `_WeightBold` (set from `boldStyle`); lower it on a
   material **instance** used only by your texts. (source: `fontMaterial` getter → `GetMaterial(m_sharedMaterial)` →
   `CreateMaterialInstance(mat)` when the cached instance is not of that material — TMP_Text.cs L215-218,
   TMPro_UGUI_Private.cs L760-772; `fontSharedMaterial` is the shared one.)

## SDF material properties (Distance Field shaders)
TAG: tmp.sdf.material-properties
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/ShadersDistanceField.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Package%20Resources/TMP%20Essential%20Resources.unitypackage (Assets/TextMesh Pro/Shaders/TMP_SDF-Mobile.shader L9-79, TMP_SDF.shader L8-110)

| Shader property | Default (Mobile SDF shader) | Manual meaning |
|---|---|---|
| `_FaceColor` | (1,1,1,1) | "multiplied with the vertex Colors you set in the TextMeshPro component" |
| `_FaceDilate` | 0, range -1..1 | "Adjust the position of the text contour in the font distance field. A value of 0 places the contour halfway, which corresponds to the contour of the original font. Negative values thin the characters, while positive values thicken them." |
| `_OutlineColor` | (0,0,0,1) | |
| `_OutlineWidth` | 0, range 0..1 | "The outline is drawn on the text contour, with half its thickness inside the contour and half of it outside the contour." |
| `_OutlineSoftness` | | |
| `_UnderlayColor` | (0,0,0,0.5) | "The default is a semi-transparent black." |
| `_UnderlayOffsetX/Y` (range -1..1), `_UnderlayDilate`, `_UnderlaySoftness` (0..1) | 0 | drop shadow offset, thickness, blur — only compiled in when the material has keyword `UNDERLAY_ON` or `UNDERLAY_INNER` (`#pragma shader_feature __ UNDERLAY_ON UNDERLAY_INNER`); outline needs `OUTLINE_ON` (`#pragma shader_feature __ OUTLINE_ON`) |
| `_WeightNormal` | 0 | dilation for non-bold glyphs |
| `_WeightBold` | 0.5 (shader default; the font asset sets it to `boldStyle`, 0.75 by default) | dilation for bold-flagged glyphs |
| `_ScaleRatioA/B/C` | 1 | computed by TMP to keep effects inside the padding |
| `_GradientScale` | 5 | "Represents the spread / range of the font's signed distance field ... equal to Padding +1" |
| `_Sharpness` | 0, range -1..1 | |
| `_Stencil*`, `_ClipRect` | | masking (set by Mask / RectMask2D) |

Render state: `Blend One OneMinusSrcAlpha` (premultiplied), `ZTest [unity_GUIZTestMode]`.
Changing these on `fontSharedMaterial` changes every text using that material; use a preset/duplicate material per style.

`shader_feature` keywords in a shipped game (mods): the Unity manual's directive table describes `shader_feature` as
"Variants for keyword combinations you enable at build time" (SOURCE:
https://docs.unity3d.com/2020.3/Documentation/Manual/SL-MultipleProgramVariants.html — the URL served the current-manual
text). If no material in the game's build used `UNDERLAY_ON`/`OUTLINE_ON` with this shader, `EnableKeyword("UNDERLAY_ON")`
from a mod may have no variant to switch to. Verify by eye in game; fall back to a second offset text or an Image
shadow.

## SDF weight formula in the shader
TAG: tmp.sdf.weight-formula
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Package%20Resources/TMP%20Essential%20Resources.unitypackage (Assets/TextMesh Pro/Shaders/TMP_SDF-Mobile.shader L130-151)
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMPro_UGUI_Private.cs (L3889-3890)

Vertex shader, verbatim:
```hlsl
float bold = step(input.texcoord1.y, 0);
...
float weight = lerp(_WeightNormal, _WeightBold, bold) / 4.0;
weight = (weight + _FaceDilate) * _ScaleRatioA * 0.5;
...
float bias = (0.5 - weight) * scale - 0.5;
float outline = _OutlineWidth * _ScaleRatioA * 0.5 * scale;
```
The bold flag travels in the sign of `uv2.y` (C#: `if (!characterInfos[i].isUsingAlternateTypeface && (characterInfos[i].style
& FontStyles.Bold) == FontStyles.Bold) xScale *= -1;`). So bold thickness = `_WeightBold / 4` added to `_FaceDilate`;
regular = `_WeightNormal / 4`. Raising `_FaceDilate` thickens everything, bold or not.

## Effects and atlas padding
TAG: tmp.sdf.effects-padding
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/Shaders.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_ShaderUtilities.cs (L258)

"SDF shaders can use the distance data to generate special effects, like outlines, underlays, and bevels. These effects
often increase the visual size of the text. When taken to their extremes, you might see artifacts appear around the edges
of character sprites. If this happens, scale down the effects." (source) mesh padding uses
`Mathf.Max(mat.GetFloat(ID_WeightNormal), mat.GetFloat(ID_WeightBold)) / 4.0f` among other terms — heavy weights/outlines
enlarge every quad. The regular and Overlay variants are unlit; "Distance Field Overlay variant always renders the
TextMesh Pro object on top of everything else in the Scene" (3D text only matters).
