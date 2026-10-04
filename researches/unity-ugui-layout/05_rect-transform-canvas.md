# 05 — RectTransform, Canvas, CanvasScaler, CanvasGroup, masks, draw order

---

## RectTransform: anchors, pivot, offsets
TAG: ugui.rect.properties
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/class-RectTransform.html
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/UIBasicLayout.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/RectTransform.html

| Property (C#) | Meaning (quoted) |
|---|---|
| `anchorMin` | "The normalized position in the parent RectTransform that the lower left corner is anchored to." 0,0 = parent lower-left, 1,1 = parent upper-right. |
| `anchorMax` | "...that the upper right corner is anchored to." |
| `pivot` | "Location of the pivot point around which the rectangle rotates, defined as a fraction of the size of the rectangle itself. 0,0 corresponds to the lower left corner while 1,1 corresponds to the upper right corner." |
| `anchoredPosition` | "The position of the pivot of this RectTransform relative to the anchor reference point." |
| `sizeDelta` | "The size of this RectTransform relative to the distances between the anchors." (= size when anchors coincide) |
| `offsetMin` / `offsetMax` | "The offset of the lower left corner of the rectangle relative to the lower left anchor." / "...upper right corner ... relative to the upper right anchor." |
| `rect` | "The calculated rectangle in the local space of the Transform." (`rect.width/height` = actual size) |

- Y grows **up** in RectTransform space (0 = bottom). Layout groups measure their `padding.top` and child positions
  downward from the top edge.
- Anchors together → fixed size (Pos X/Y, Width, Height). Anchors apart → stretch: "the fields can change partially or
  completely to Left, Right, Top and Bottom. These fields define the padding inside the rectangle defined by the
  anchors."
- Resizing vs scaling: changing width/height does not touch `localScale`; "This resizing will not affect font sizes,
  border on sliced images, and so on." `localScale` scales everything including text and 9-slice borders.
- "UI elements are by default anchored to the center of the parent rectangle" (multi-resolution how-to). TMP's
  `LoadDefaultSettings` treats `sizeDelta == (100, 100)` as "freshly created" and replaces it with the TMP Settings
  default container size (`tmp.text.defaults-from-settings`). Never rely on creation defaults: set anchors, pivot and
  size explicitly on every RectTransform you create.

## Positioning from script
TAG: ugui.rect.script-positioning
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/HOWTO-UICreateFromScripting.html

Verbatim: "When setting the parent of the instantiated UI element, it's recommended to do it using the Transform.SetParent
method with the worldPositionStays parameter set to false."
"For a non-stretching Rect Transform, the position is set most easily by setting the anchoredPosition and the sizeDelta
properties." "For a stretching Rect Transform, it can be simpler to set the position using the offsetMin and offsetMax
properties."
```csharp
var rt = go.AddComponent<RectTransform>();
rt.SetParent(parent, false);                       // worldPositionStays = false
// fixed 300x40 box, top-left corner 16px from parent's top-left:
rt.anchorMin = rt.anchorMax = new Vector2(0, 1);
rt.pivot = new Vector2(0, 1);
rt.anchoredPosition = new Vector2(16, -16);        // y negative = downward
rt.sizeDelta = new Vector2(300, 40);
// full-stretch with 8px inset (CSS inset: 8px):
rt.anchorMin = Vector2.zero; rt.anchorMax = Vector2.one;
rt.offsetMin = new Vector2(8, 8); rt.offsetMax = new Vector2(-8, -8);
```
`RectTransform.SetSizeWithCurrentAnchors(axis, size)` and `SetInsetAndSizeFromParentEdge(edge, inset, size)` are the
helper forms (listed on the RectTransform API page).

## Rect values are computed at end of frame
TAG: ugui.rect.timing
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/class-RectTransform.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Canvas.ForceUpdateCanvases.html

"some RectTransform calculations are performed at the end of a frame, just before calculating UI vertices ... they haven't
yet been calculated for the first time in the Start callback and first Update callback. You can work around this by
creating a `Start()` callback and adding `Canvas.ForceUpdateCanvases()` method to it."
For layout-driven sizes use `LayoutRebuilder.ForceRebuildLayoutImmediate(root)` (`ugui.autolayout.rebuild-force`).

## GetWorldCorners
TAG: ugui.rect.world-corners
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/RectTransform.GetWorldCorners.html

`void GetWorldCorners(Vector3[] fourCornersArray)` — "Get the corners of the calculated rectangle in world space."
"The returned array of 4 vertices is clockwise. It starts bottom left and rotates to top left, then top right, and finally
bottom right." Index: `[0]` bottom-left, `[1]` top-left, `[2]` top-right, `[3]` bottom-right. "If the RectTransform is
rotated in Z then the dimensions of the GetWorldCorners will be changed." `GetLocalCorners` gives the same in local space.

## World point → screen pixels
TAG: ugui.rect.screen-points
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/UnityCsReference/2020.3/Modules/UI/ScriptBindings/RectTransformUtility.cs (L64-70)
SOURCE: https://docs.unity3d.com/6000.0/Documentation/ScriptReference/RectTransformUtility.WorldToScreenPoint.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/RectTransformUtility.ScreenPointToLocalPointInRectangle.html

(source, 2020.3 C# reference)
```csharp
public static Vector2 WorldToScreenPoint(Camera cam, Vector3 worldPoint)
{
    if (cam == null)
        return new Vector2(worldPoint.x, worldPoint.y);
    return cam.WorldToScreenPoint(worldPoint);
}
```
- Screen Space - Overlay: pass `cam = null`; world X/Y **are** screen pixels (origin bottom-left). So on an overlay canvas
  `GetWorldCorners` already returns screen pixels.
- Screen Space - Camera / World Space: world coordinates are scene units; convert with
  `RectTransformUtility.WorldToScreenPoint(canvas.worldCamera, corner)`.
- Reverse: `ScreenPointToLocalPointInRectangle(rect, screenPoint, cam, out local)` — "For a RectTransform in a Canvas set
  to Screen Space - Overlay mode, the cam parameter should be null." (The `WorldToScreenPoint` page is not published for
  2020.3; the 6000.0 page documents the same signature, and the 2020.3 source above is authoritative.)
- Canvas units vs pixels (derived): on an overlay canvas, `pixels = units × canvas.scaleFactor`
  (`ugui.canvasscaler.match-math`).

## Draw order inside a canvas = hierarchy order
TAG: ugui.canvas.draw-order
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/UICanvas.html

"UI elements in the Canvas are drawn in the same order they appear in the Hierarchy. The first child is drawn first, the
second child next, and so on. If two UI elements overlap, the later one will appear on top of the earlier one."
"The order can also be controlled from scripting by using these methods on the Transform component: SetAsFirstSibling,
SetAsLastSibling, and SetSiblingIndex."
Consequence (derived): a whole later sibling subtree draws over the whole earlier sibling subtree. A child that overflows
its row (dropdown, tooltip, glow) is covered by the next row and by the next row's children. There is no per-element
z-index inside one canvas. Fixes: move the overflowing element to a later position in the hierarchy (a top-level "popup
layer" child of the window), or give it a nested Canvas with `overrideSorting` (`ugui.canvas.nested-override-sorting`).

## Render modes
TAG: ugui.canvas.render-modes
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/class-Canvas.html
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/UICanvas.html

- **Screen Space - Overlay**: "the Canvas is scaled to fit the screen and then rendered directly without reference to the
  scene or a camera (the UI will be rendered even if there is no camera in the scene at all)." "The UI will be drawn over
  any other graphics such as the camera view."
- **Screen Space - Camera**: rendered by a camera at `planeDistance`; 3D objects closer than the plane draw in front.
- **World Space**: the canvas is a plane in the scene.
- Properties: `renderMode`, Pixel Perfect (screen modes), Render Camera / Plane Distance (camera mode), Event Camera
  (world mode), Receives Events. "A nested Canvas uses the same Render Mode as its parent."

## Overlay canvases must be root objects
TAG: ugui.canvas.overlay-top-level
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/class-Canvas.html

"Note: The Screen Space - Overlay canvas needs to be stored at the top level of the hierarchy. If this is not used then
the UI may disappear from the view. This is a built-in limitation. Keep the Screen Space - Overlay canvas at the top level
of the hierarchy to get expected results." (A canvas placed under another canvas is a *nested* canvas, which is fine.)

## Nested canvas and overrideSorting
TAG: ugui.canvas.nested-override-sorting
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Canvas-overrideSorting.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Canvas-sortingOrder.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Renderer-sortingOrder.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Canvas-renderOrder.html
SOURCE: https://unity.com/how-to/unity-ui-optimization-tips

- `Canvas.overrideSorting` (bool): "Override the sorting of canvas. Allows for nested canvas's to ignore the parent draw
  order and draw ontop or below."
- `Canvas.sortingOrder` (int): "Canvas' order within a sorting layer. See Renderer." Renderer page: "The lower the number
  you give it, the further back the GameObject appears. The higher the number, the closer the GameObject looks to the
  Camera." "The value must be between -32768 and 32767."
- `Canvas.renderOrder` (read only): "Currently only `Screen Space - Overlay` canvases are ordered correctly".
- A nested canvas needs its own `GraphicRaycaster` to receive clicks: "You need a Graphic Raycaster on every Canvas that
  requires input, including sub-Canvases." (optimization tips page)
```csharp
// Make a popup draw above everything else in its window without reparenting it:
var c = popup.AddComponent<Canvas>();
c.overrideSorting = true;
c.sortingOrder = rootCanvas.sortingOrder + 10;   // relative to the other canvases
popup.AddComponent<GraphicRaycaster>();          // otherwise its buttons are not clickable
```
A Canvas component on an object that has a Canvas above it is a nested canvas (class-Canvas manual: "nested Canvases,
where one Canvas is placed as a child of another"). Verify in a frame capture that the popup really draws on top — the
pages above do not spell out how `sortingOrder` of a nested override canvas compares with other root overlay canvases.

## overrideSorting escapes RectMask2D and stencil masks above it
TAG: ugui.canvas.override-sorting-escapes-mask
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/MaskUtilities.cs (L56-73, L140-174)

(source) `GetRectMaskForClippable`: walking the graphic's parent canvases, if any canvas with `overrideSorting == true`
is NOT a descendant-or-self of the RectMask2D's transform, that RectMask2D is dropped for this graphic:
```csharp
if (!IsDescendantOrSelf(canvasComponents[i].transform, componentToReturn.transform) && canvasComponents[i].overrideSorting)
{ componentToReturn = null; break; }
```
`FindRootSortOverrideCanvas` stops at the first override-sorting canvas for stencil depth too. Practical effect: a
popup given its own sorting canvas is **not clipped** by a scroll view's mask — good for dropdowns, wrong for list rows.

## Pixel Perfect
TAG: ugui.canvas.pixel-perfect
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Canvas-pixelPerfect.html

"Force elements in the canvas to be aligned with pixels. Only applies with renderMode is Screen Space. Enabling
pixelPerfect can make elements appear sharper and prevent blurriness. However, if many elements are scaled or rotated, or
use subtle animated position or scaling, it may be advantageous to disable pixelPerfect". `overridePixelPerfect` lets a
nested canvas differ.

## CanvasScaler: modes and DEFAULT values
TAG: ugui.canvasscaler.modes-defaults
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-CanvasScaler.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/CanvasScaler.cs (L48-217)

| Property | Default | Meaning |
|---|---|---|
| `uiScaleMode` | `ConstantPixelSize` | also `ScaleWithScreenSize`, `ConstantPhysicalSize` |
| `scaleFactor` | `1` | Constant Pixel Size: "Scales all UI elements in the Canvas by this factor." |
| `referencePixelsPerUnit` | `100` | "If a sprite has this 'Pixels Per Unit' setting, then one pixel in the sprite will cover one unit in the UI." |
| `referenceResolution` | `(800, 600)` | "The resolution the UI layout is designed for." |
| `screenMatchMode` | `MatchWidthOrHeight` | also `Expand`, `Shrink` |
| `matchWidthOrHeight` | `0` (width) | "Determines if the scaling is using the width or height as reference, or a mix in between." |
| `physicalUnit` | `Points` | Constant Physical Size |
| `fallbackScreenDPI` | `96` | |
| `defaultSpriteDPI` | `96` | |
| `dynamicPixelsPerUnit` | `1` | World space |

"This scaling affects everything under the Canvas, including font sizes and image borders." Without a CanvasScaler a
canvas behaves as Constant Pixel Size, factor 1: canvas units = screen pixels.

## CanvasScaler: exact scale math
TAG: ugui.canvasscaler.match-math
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/CanvasScaler.cs (L301-347)
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/HOWTO-UIMultiResolution.html

(source)
```csharp
case ScreenMatchMode.MatchWidthOrHeight:
    float logWidth  = Mathf.Log(screenSize.x / m_ReferenceResolution.x, kLogBase);   // kLogBase = 2
    float logHeight = Mathf.Log(screenSize.y / m_ReferenceResolution.y, kLogBase);
    float logWeightedAverage = Mathf.Lerp(logWidth, logHeight, m_MatchWidthOrHeight);
    scaleFactor = Mathf.Pow(kLogBase, logWeightedAverage);
case ScreenMatchMode.Expand: scaleFactor = Mathf.Min(screenSize.x / ref.x, screenSize.y / ref.y);
case ScreenMatchMode.Shrink: scaleFactor = Mathf.Max(screenSize.x / ref.x, screenSize.y / ref.y);
```
Example: reference 1920×1080, screen 2560×1440, match 0.5 → factor 4/3; the canvas is 1920×1080 units.
Manual: with the default Match = 0 "it compares the current screen width with the Canvas Scaler width"; Match 0.5 lets a
1.5× wider and 1.5× shorter screen "even out and produce a final scale factor of 1". When modding, read the game's own
CanvasScaler (`GetComponent<CanvasScaler>()` on the root canvas) instead of assuming 1 unit = 1 pixel.

## CanvasGroup
TAG: ugui.canvasgroup.properties
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/class-CanvasGroup.html

| Property | Meaning (quoted) |
|---|---|
| `alpha` | "The opacity of the UI elements in this group. The value is between 0 and 1 ... Note that elements retain their own transparency as well, so the Canvas Group alpha and the alpha values of the individual UI elements are multiplied with each other." |
| `interactable` | "Determines if this component will accept input. When it is set to false interaction is disabled." |
| `blocksRaycasts` | "Will this component act as a collider for Raycasts?" (graphic raycaster only) |
| `ignoreParentGroups` | "Will this group also be affected by the settings in Canvas Group components further up in the Game Object hierarchy, or will it ignore those and hence override them?" |

Typical uses (manual): fade a whole window via alpha; grey out a set of controls with interactable = false; make
elements click-through with blocksRaycasts = false. CanvasGroup alpha is a per-vertex multiply of each element's alpha;
it does **not** composite the group as one layer (overlapping children inside a half-transparent group show through
each other — derived).

## Inherited alpha
TAG: ugui.canvasgroup.inherited-alpha
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CanvasRenderer.GetInheritedAlpha.html

`float CanvasRenderer.GetInheritedAlpha()` — "Get the final inherited alpha calculated by including all the parent
alphas from included parent CanvasGroups. Alpha is calculated by getting the alpha from all parent CanvasGroups (if
GetIgnoreParentGroups is false) and multiplying the original alpha."
Use it to check whether something is really visible (a window at CanvasGroup alpha 0 is still active and raycastable
unless blocksRaycasts is false).

## Mask (stencil)
TAG: ugui.mask.stencil
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-Mask.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Mask.cs (L29)

"The mask restricts (ie, "masks") the child elements to the shape of the parent." Property `showMaskGraphic` (default
**true**): "Should the graphic of the masking (parent) object be drawn with alpha over the child object?"
"Masking is implemented using the stencil buffer of the GPU." "Nested Masks will write incremental bit masks into the
buffer". Shape follows the mask Image's sprite (non-rectangular masks are possible); costs extra draw calls/material
changes.

## RectMask2D
TAG: ugui.rectmask2d.properties
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-RectMask2D.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/RectMask2D.cs (L49-76)

"The mask restricts the child elements to the rectangle of the parent element." Limitations: "It only works in 2D space",
"It will not properly mask elements that are not coplanar". Advantages: "It does not use the stencil buffer", "No extra
draw calls", "No material changes", "Fast performance". In this version it also has `padding` (Vector4, default 0) and
`softness` (Vector2Int, default 0) for soft edges (source). This is CSS `overflow: hidden` for rectangles.
