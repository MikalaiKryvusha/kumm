# 09 — Colour space: UI in a LINEAR project vs CSS/browser sRGB

> Official sources first; forum threads are marked **(secondary)**. Formulas marked **(derived)** were computed for this
> handbook from the official statements, not taken from a page.

---

## Blending happens in the framebuffer's colour space
TAG: color.linear.blending
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/LinearRendering-LinearOrGammaWorkflow.html

Verbatim (section "Linear and gamma blending"): "When blending into a framebuffer, the blending occurs in the color space
of the framebuffer. When you use gamma space rendering, nonlinear colors get blended together. This is not the
mathematically correct way to blend colors, and can give unexpected results, but it is the only way to do a blend on some
graphics hardware. When you use linear space rendering, blending occurs in linear color space: This is mathematically
correct and gives precise results."
Inputs: "Selecting Color Space: Linear assumes your Textures are in gamma color space. Unity uses your GPU's sRGB sampler
by default to crossover from gamma to linear color space." "For colors, this conversion is applied implicitly, because the
Unity Editor already converts the values to floating point before passing them to the GPU as constants."
A browser composites CSS colours with alpha in sRGB (gamma) values — the "gamma blending" case above. So the same RGBA
gives a different result in a Linear Unity project whenever alpha is between 0 and 1.

## UI vertex colours are linearised by the canvas (2020.3)
TAG: color.linear.ui-vertex-colors
SOURCE: https://docs.unity3d.com/2022.3/Documentation/ScriptReference/Canvas-vertexColorAlwaysGammaSpace.html
SOURCE: https://raw.githubusercontent.com/chsxf/unity-built-in-shaders/2020.3/Shaders/DefaultResourcesExtra/UI/UI-Default.shader (L105)
SOURCE: https://raw.githubusercontent.com/chsxf/unity-built-in-shaders/v2022.3.0f1/Shaders/DefaultResourcesExtra/UI/UI-Default.shader (L88-112)

- 2022.3 API (the option does **not** exist in 2020.3): `Canvas.vertexColorAlwaysGammaSpace` — "Should the Canvas vertex
  color always be in gamma space before passing to the UI shaders in linear color space work flow. Keeping the Canvas
  vertex color in gamma space will allow the gamma to linear conversion to happen in UI shaders, where colors have higher
  precision. This enhances UI color precision in linear color space workflow, especially for darker colors. Buit-in UI
  shaders include gamma to linear conversion."
- The 2022.3 UI/Default shader converts only when that flag is on:
  `if (_UIVertexColorAlwaysGammaSpace) { if(!IsGammaSpace()) { v.color.rgb = UIGammaToLinear(v.color.rgb); } }`.
- The 2020.3 UI/Default shader has no conversion at all (`OUT.color = v.color * _Color;`).
- (derived) Therefore in a 2020.3 Linear project `Graphic.color` / TMP vertex colours (authored as sRGB, like CSS hex) are
  converted to linear by the canvas **before** the shader, stored with 8-bit vertex precision — hence the "darker colors"
  precision remark. Opaque colours come out as authored (the sRGB framebuffer write re-encodes them), but very dark
  shades can band or shift by a step.
- Runtime check: `QualitySettings.activeColorSpace` — "Active color space (Read Only). This is the active color space based
  on player settings (PlayerSettings.colorSpace) and hardware support." (SOURCE:
  https://docs.unity3d.com/2020.3/Documentation/ScriptReference/QualitySettings-activeColorSpace.html)

## UI shaders blend premultiplied "over"
TAG: color.linear.ui-shader-blend
SOURCE: https://raw.githubusercontent.com/chsxf/unity-built-in-shaders/2020.3/Shaders/DefaultResourcesExtra/UI/UI-Default.shader (L45, L111-124)
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Package%20Resources/TMP%20Essential%20Resources.unitypackage (TMP_SDF-Mobile.shader L79, TMP_SDF.shader L110)

UI/Default: `Blend One OneMinusSrcAlpha` with `color.rgb *= color.a` in the fragment shader; TMP SDF shaders: also
`Blend One OneMinusSrcAlpha`. Result per channel, computed on **linear** values:
`dst' = src.rgb·src.a + dst·(1 − src.a)`. Neither shader contains gamma code (grep for Gamma/Linear/COLORSPACE in the TMP
shaders returns nothing).

## Why a CSS-tuned translucent overlay looks lighter in Unity
TAG: color.linear.semi-transparent-mismatch
SOURCE: derived from color.linear.blending and color.linear.ui-shader-blend (sRGB transfer function, standard)

Black overlay, alpha a, over a background whose sRGB value is b:
- Browser (gamma blend): `result = b · (1 − a)`.
- Unity Linear: `result = srgb( lin(b) · (1 − a) )`.
Example, a = 0.5: background 0.5 → browser **0.25**, Unity **0.361**; background 0.2 → browser 0.10, Unity 0.136.
A "50% black" dimmer is visibly weaker in Unity; light text glows/fringes look heavier; semi-transparent panels look more
washed. Opaque colours are unaffected.

Matching alpha for a **black** overlay (exact sRGB curve; depends a little on the background):

| CSS alpha | Unity alpha, bg 0.2 | bg 0.5 | bg 0.8 | approx. `1 − (1 − a)^2.2` |
|---|---|---|---|---|
| 0.3 | 0.475 | 0.531 | 0.546 | 0.544 |
| 0.5 | 0.697 | 0.762 | 0.780 | 0.782 |
| 0.7 | 0.852 | 0.908 | 0.922 | 0.929 |

Other values of the approximation: 0.1 → 0.207, 0.2 → 0.388, 0.4 → 0.675, 0.6 → 0.867, 0.8 → 0.971, 0.9 → 0.994.
For a coloured overlay c over a known background b, solve per channel (use the channel that matters, or luminance):
```csharp
// Unity alpha that reproduces the browser's (gamma-blended) composite of colour c at alpha aCss over background b.
static float LinearAlphaFor(float cSrgb, float bSrgb, float aCss)
{
    float target = Mathf.Lerp(bSrgb, cSrgb, aCss);                 // what the browser shows (sRGB)
    float lt = Mathf.GammaToLinearSpace(target);
    float lb = Mathf.GammaToLinearSpace(bSrgb), lc = Mathf.GammaToLinearSpace(cSrgb);
    return Mathf.Abs(lc - lb) < 1e-5f ? aCss : Mathf.Clamp01((lt - lb) / (lc - lb));
}
```
(`Mathf.GammaToLinearSpace`, `Color.linear` — "A linear value of an sRGB color ... with inverse of sRGB gamma curve
applied" — SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Color-linear.html)
When the background varies (scene behind a HUD), no single alpha matches everywhere; tune against the dominant background
and check by eye in game.

## Gradients and vertex-colour interpolation
TAG: color.linear.gradients
SOURCE: derived from color.linear.ui-vertex-colors and color.linear.blending

Vertex colours reach the shader already linear, and the GPU interpolates them across the quad in that space; a two-colour
TMP gradient or a vertex-coloured Image therefore has a different (lighter) midpoint than a CSS `linear-gradient` between
the same hex colours, which interpolates sRGB values by default. Bake the gradient into an sRGB sprite texture (each
opaque texel then displays as painted, `color.linear.textures-srgb`) or add intermediate stops when the midpoint matters.

## Textures and sprites
TAG: color.linear.textures-srgb
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/LinearRendering-LinearOrGammaWorkflow.html

"Gamma color space Texture inputs to the linear color space Shader program are supplied to the Shader with gamma correction
removed from them." "If your Textures are authored in linear color space, you need to bypass the sRGB sampling." For a
runtime `Texture2D` the constructor's `bool linear = false` decides this; the default constructor gives a texture "with an
RGBA32 TextureFormat, with mipmaps and in sRGB color space" (SOURCE:
https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Texture2D-ctor.html) — sRGB is the right choice for UI art,
so opaque sprite pixels display as painted. The alpha
channel is not converted (forum, secondary: "The colors are being corrected (they are being degammaed), the alpha channel
is not touched though since it intended to be linear.").

## Forum threads (secondary sources)
TAG: color.linear.forum
SOURCE: https://discussions.unity.com/threads/linear-vs-gamma-color-space-for-ui-font-rendering.689296/ (secondary)
SOURCE: https://discussions.unity.com/t/png-transparency-is-different-in-unity-than-photoshop-924017/924017 (secondary)

- bgolus (community expert, not staff): "Alpha blending no longer acts the way one would expect as the blending is being
  done in linear space and not sRGB space." Suggested custom-shader approach: blend in gamma space by converting
  background and UI colour with `LinearToGammaSpace` before the premultiplied blend, or render the UI into a separate
  linear render target with sRGB conversion disabled and composite it (both need a custom pipeline step — heavy for a mod).
- A user reports SDF/antialiased font edges looking "more or less cut" in Linear; no staff answer in that thread.
- Photoshop: "Edit → Color Settings → check Blend RGB Colors Using Gamma" (1.00) lets artists preview Unity's linear
  blending (user tip).
- AcidArrow (user): "50% from white to black is a different grey in Linear and in Gamma."
Practical choice for a mod (derived): keep colours opaque where possible (solid dark panels instead of black-50% veils),
tune alphas with `color.linear.semi-transparent-mismatch`, and judge every translucent element in a game screenshot,
not against a browser mock-up.
