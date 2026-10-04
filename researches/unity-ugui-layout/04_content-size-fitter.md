# 04 — ContentSizeFitter and AspectRatioFitter (self controllers)

---

## ContentSizeFitter: properties and DEFAULT values
TAG: ugui.csf.properties-defaults
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-ContentSizeFitter.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/ContentSizeFitter.cs (L19-47)

| C# property | Default | Values |
|---|---|---|
| `horizontalFit` (`ContentSizeFitter.FitMode`) | `Unconstrained` | `Unconstrained` — "Do not drive the width based on the layout element."; `MinSize` — "Drive the width based on the minimum width of the layout element."; `PreferredSize` — "Drive the width based on the preferred width of the layout element." |
| `verticalFit` | `Unconstrained` | same for height |

"The size is determined by the minimum or preferred sizes provided by layout element components on the Game Object. Such
layout elements can be Image or Text components, layout groups, or a Layout Element component."

## What it actually does
TAG: ugui.csf.behavior
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/ContentSizeFitter.cs (L86-120)
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-ContentSizeFitter.html

(source)
```csharp
private void HandleSelfFittingAlongAxis(int axis)
{
    FitMode fitting = (axis == 0 ? horizontalFit : verticalFit);
    if (fitting == FitMode.Unconstrained) { m_Tracker.Add(this, rectTransform, DrivenTransformProperties.None); return; }
    m_Tracker.Add(this, rectTransform, (axis == 0 ? DrivenTransformProperties.SizeDeltaX : DrivenTransformProperties.SizeDeltaY));
    if (fitting == FitMode.MinSize)
        rectTransform.SetSizeWithCurrentAnchors((RectTransform.Axis)axis, LayoutUtility.GetMinSize(m_Rect, axis));
    else
        rectTransform.SetSizeWithCurrentAnchors((RectTransform.Axis)axis, LayoutUtility.GetPreferredSize(m_Rect, axis));
}
```
- It reads the **resolved** values of its own GameObject (`LayoutUtility`, so a LayoutElement on the same object wins).
- It runs in the `SetLayoutHorizontal` / `SetLayoutVertical` passes, before the layout group on the same object
  (`ugui.autolayout.order`), so a group + fitter on one object first resizes itself, then lays out children.
- Resizing happens **around the pivot**: "when the pivot is in the center, the Content Size Fitter will expand the Rect
  Transform out equally in all directions. And when the pivot is in the upper left corner, the Content Size Fitter will
  expand the Rect Transform down and to the right." For a window that grows downward from a fixed top edge use
  pivot (0.5, 1) or (0, 1).
- Unconstrained still registers the object with the tracker but drives nothing.

## Fit a single TMP text
TAG: ugui.csf.fit-text
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/HOWTO-UIFitContentSize.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_Text.cs (L3736-3834)

Manual: put the Content Size Fitter on the same GameObject as the text and "set both the Horizontal Fit and Vertical Fit
dropdowns to the Preferred setting."
TMP specifics (source):
- Horizontal Preferred → width = text measured **without wrapping** (longest hard line). With Horizontal Preferred the
  text never wraps by itself.
- For a wrapping paragraph of fixed width: horizontalFit = Unconstrained (width set by you/anchors/parent),
  verticalFit = PreferredSize → height = wrapped height at the current width.
```csharp
var tmp = go.AddComponent<TextMeshProUGUI>();
tmp.enableWordWrapping = true;
var fit = go.AddComponent<ContentSizeFitter>();
fit.horizontalFit = ContentSizeFitter.FitMode.Unconstrained;  // width comes from outside
fit.verticalFit   = ContentSizeFitter.FitMode.PreferredSize;  // height hugs the wrapped text
((RectTransform)go.transform).pivot = new Vector2(0.5f, 1f);   // grow downward
```

## Fit a container to its child content (button, tooltip)
TAG: ugui.csf.fit-group-with-child-text
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/HOWTO-UIFitContentSize.html

Manual: "first add a Horizontal Layout Group to the UI element, then add a Content Size Fitter too. Set the Horizontal
Fit, the Vertical Fit, or both to the Preferred setting. You can add and tweak padding using the padding property in the
Horizontal Layout Group." ... "it could have been a Vertical Layout Group as well - as long as there is only a single
child, they produce the same result."
How it works (manual): the group "listens to the layout information provided by the children ... and it functions as a
Layout Element that provides this information about its minimum and preferred size. The Content Size Fitter listens to
layout information provided by any Layout Element on the same Game Object".

Tooltip recipe (max width + wrap) — derived:
```csharp
// Tooltip root: VerticalLayoutGroup (padding) + ContentSizeFitter(Preferred, Preferred)
// Body text: TMP with wrapping; LayoutElement.preferredWidth = 320 caps the width,
// so the group's preferred width = 320 + padding and the TMP preferred height is computed at that width.
var le = bodyText.gameObject.AddComponent<LayoutElement>();
le.preferredWidth = 320f;   // short texts are still 320 wide; for "shrink-to-fit up to 320" measure:
// float w = Mathf.Min(320f, bodyText.GetPreferredValues(text, 9999f, 9999f).x); le.preferredWidth = w;
```

## Never put a ContentSizeFitter on a child of a layout group
TAG: ugui.csf.not-on-group-children
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/HOWTO-UIFitContentSize.html

"You can't put a Content Size Fitter on each child. The reason is that the Content Size Fitter wants control over its
own Rect Transform, but the parent Layout Group also wants control over the child Rect Transform. This creates a conflict
and the result is undefined behavior."
"However, it isn't necessary either. The parent Layout Group can already make each child fit the size of the content.
What you need to do is to disable the Child Force Expand toggles on the Layout Group."
The only fitter that belongs inside a layout tree is the one on the **root** of that tree (the outermost group).
(If the parent group has childControlWidth = false on an axis, the group does not drive that axis's size, and a fitter on
the child for that axis does not fight it — derived from `ugui.hvgroup.child-control-off`; still prefer letting the
group control size.)

## AspectRatioFitter: properties and DEFAULT values
TAG: ugui.aspectfitter.properties-defaults
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-AspectRatioFitter.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/AspectRatioFitter.cs (L41-48)

| Property | Default | Values |
|---|---|---|
| `aspectMode` | `None` | `None`; `WidthControlsHeight` — "The height is automatically adjusted based on the width."; `HeightControlsWidth`; `FitInParent` — "The width, height, position, and anchors are automatically adjusted to make the rect fit inside the rect of the parent while keeping the aspect ratio."; `EnvelopeParent` — "...cover the entire area of the parent while keeping the aspect ratio. This rect may extend further out than the parent rect." |
| `aspectRatio` | `1` | "This is the width divided by the height." |

"The Aspect Ratio Fitter does not take layout information into account such as minimum size and preferred size."
Resizing is around the pivot. Typical use: a square icon slot whose width comes from a grid/row — WidthControlsHeight
with aspectRatio 1. Like the ContentSizeFitter it is a self controller: do not put it on a child whose size the parent
group controls on the same axis.
