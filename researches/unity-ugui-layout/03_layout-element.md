# 03 — LayoutElement: overriding what a child reports

---

## Properties and DEFAULT values
TAG: ugui.layoutelement.properties-defaults
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-LayoutElement.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/LayoutElement.cs (L11-28)

| C# property | Default | Inspector meaning (manual) |
|---|---|---|
| `ignoreLayout` | `false` | "When enabled, the layout system ignores this layout element." |
| `minWidth` | **-1** (unset) | "The minimum width this layout element should have." |
| `minHeight` | **-1** | "The minimum height this layout element should have." |
| `preferredWidth` | **-1** | "The preferred width this layout element should have before additional available width is allocated." |
| `preferredHeight` | **-1** | "The preferred height this layout element should have before additional available height is allocated." |
| `flexibleWidth` | **-1** | "The relative amount of additional available width this layout element should fill out relative to its siblings." |
| `flexibleHeight` | **-1** | same, height |
| `layoutPriority` | **1** | "If a GameObject has more than one component with layout properties ... the layout system uses the property values from the component with the highest Layout Priority." |

- In the Inspector an unticked checkbox = -1 in code. Any negative value means "not set": `LayoutUtility` skips it
  (`if (prop < 0) continue;`), so the next lower-priority component (Image, TMP, group) supplies that value.
- Every setter calls `SetDirty()` → `LayoutRebuilder.MarkLayoutForRebuild(transform)` only when the value changed
  (`SetPropertyUtility.SetStruct`). `OnEnable`, `OnDisable`, `OnTransformParentChanged`, `OnBeforeTransformParentChanged`
  also mark dirty.
- The API remark for `flexibleWidth` literally says "Setting preferredWidth to -1 removed the preferredWidth."
  (ILayoutElement API page) — i.e. -1 is the documented "remove override" value.

## Units
TAG: ugui.layoutelement.units
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-LayoutElement.html

"Minimum and preferred sizes are defined in regular units, while the flexible sizes are defined in relative units. If any
layout element has flexible size greater than zero, it means that all the available space will be filled out. The relative
flexible size values of the siblings determines how big a proportion of the available space each sibling fills out. Most
commonly, flexible width and height is set to just 0 or 1."
"Regular units" = canvas units = the units of `RectTransform.rect` under the CanvasScaler (one unit = one screen pixel at
scaleFactor 1). Flexible is a weight: 2 gets twice the *surplus* of 1, not twice the size.

## 0 is a value, -1 is "unset"
TAG: ugui.layoutelement.zero-vs-unset
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/LayoutUtility.cs (L142-187)

(source, derived) Because LayoutElement has priority 1 and the content components have priority 0:
- `preferredWidth = 0` **forces** preferred to 0 even if the TMP text inside is 180 wide.
- `preferredWidth = -1` lets the TMP/Image/group value through.
- `flexibleHeight = 0` on a nested group's GameObject **cancels** the `flexibleHeight ≥ 1` that the group reports because
  of its own childForceExpandHeight (`ugui.hvgroup.force-expand-flexible`).
- Preferred is floored by min (`GetPreferredWidth = max(min, preferred)`), so `minWidth = 100, preferredWidth = 0`
  yields preferred 100.

## Flexible with and without a preferred size
TAG: ugui.layoutelement.flexible-vs-preferred
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-LayoutElement.html

Verbatim: "Specifying both a preferred size and a flexible size can make sense in certain cases. Flexible sizes are only
allocated after all preferred sizes have been fully allocated. Thus, a layout element which has a flexible size specified
but no preferred size will keep its minimum size until other layout elements have grown to their full preferred size,
and only then begin to grow based on additional available space. By also specifying a flexible size, this can be avoided
and the element can grow to its preferred size in tandem with the other layout elements that have preferred sizes, and
then grow further once all flexible sizes have been allocated."

(Exact mechanics: every child gets `lerp(min, preferred, t)` with one shared `t`, then `flex · surplus / Σflex` once the
group exceeds its total preferred — `ugui.hvgroup.main-axis-distribution`.)

## Equal columns / tiles (CSS `repeat(N, 1fr)`)
TAG: ugui.layoutelement.equal-columns
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/HorizontalOrVerticalLayoutGroup.cs (L180-217)
SOURCE: derived (worked example ugui.hvgroup.example-force-expand)

All tiles must have the **same base** (min and preferred) so that only the surplus is distributed, and the same flex:
```csharp
var row = rowGo.AddComponent<HorizontalLayoutGroup>();
row.childControlWidth = true;  row.childControlHeight = true;
row.childForceExpandWidth = false;          // flex comes from the LayoutElements, explicitly
row.childForceExpandHeight = true;          // tiles fill the row height
row.spacing = 4f;

foreach (var tile in tiles)
{
    var le = tile.GetComponent<LayoutElement>() ?? tile.gameObject.AddComponent<LayoutElement>();
    le.minWidth = 0f;          // overrides TMP/Image min (0 anyway, but be explicit)
    le.preferredWidth = 0f;    // overrides the content's preferred width -> no content-based base
    le.flexibleWidth = 1f;     // equal share of everything
}
```
Each tile width = `(rowWidth - padding.horizontal - spacing·(N-1)) / N`, independent of the text inside.
If the tile contents must never be squeezed below their natural width, CSS `minmax(auto, 1fr)` behavior is NOT what this
gives — set `minWidth` to the content minimum instead, and accept that tiles then differ when the row is too narrow.

## Fixed-size child inside a controlling group
TAG: ugui.layoutelement.fixed-size
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-LayoutElement.html
SOURCE: derived from ugui.hvgroup.main-axis-distribution

```csharp
var le = icon.AddComponent<LayoutElement>();
le.minWidth = le.preferredWidth = 32f;   // never smaller, never larger than 32 at the base
le.minHeight = le.preferredHeight = 32f;
le.flexibleWidth = 0f; le.flexibleHeight = 0f;   // parent force-expand still lifts this to 1 — see below
```
Caution: the parent's `childForceExpandX = true` applies `flexible = max(flexible, 1)` **after** reading the
LayoutElement, so a LayoutElement cannot opt a child out of force-expand. A truly fixed child needs the parent's
force-expand off on that axis (and other children get their flex from their own LayoutElements).

## ignoreLayout: absolute child inside a group
TAG: ugui.layoutelement.ignore-layout
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/LayoutGroup.cs (L52-82)
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-LayoutElement.html

`ignoreLayout = true` removes the child from `rectChildren`: the group neither sizes nor positions it, and it adds
nothing to the group's min/preferred/flexible. The child keeps its own anchors (stretch anchors work again). Use it for
badges, overlays, selection frames and backgrounds that must sit inside a laid-out parent (CSS `position: absolute`).
