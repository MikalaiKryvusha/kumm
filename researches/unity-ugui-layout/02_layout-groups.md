# 02 — Horizontal / Vertical / Grid Layout Group: exact algorithm

> The exact distribution algorithm is quoted from the uGUI 1.0.0 source as shipped with Unity 2020.3.18f1
> (`HorizontalOrVerticalLayoutGroup.cs`, `LayoutGroup.cs`). Axis 0 = horizontal (width), axis 1 = vertical (height).
> "Main axis" = the axis the group stacks along (X for Horizontal, Y for Vertical); "cross axis" = the other one.

---

## Properties and their DEFAULT values (runtime vs Editor)
TAG: ugui.hvgroup.properties-defaults
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/HorizontalOrVerticalLayoutGroup.cs (L12-80, L241-255)
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/LayoutGroup.cs (L16-31)
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-HorizontalLayoutGroup.html
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-VerticalLayoutGroup.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/RectOffset-ctor.html

| C# property | Inspector name | Default (field initializer = what `AddComponent` gives in a built game) | Meaning |
|---|---|---|---|
| `padding` (`RectOffset`, **int**) | Padding | `new RectOffset()` = 0,0,0,0 | "The padding inside the edges of the layout group." Constructor order is `RectOffset(left, right, top, bottom)`. |
| `spacing` (float) | Spacing | `0` | "The spacing between the layout elements." Main axis only. |
| `childAlignment` (`TextAnchor`) | Child Alignment | `TextAnchor.UpperLeft` | "The alignment to use for the child layout elements if they don't fill out all the available space." |
| `childControlWidth` | Control Child Size: Width | **`true`** | Group drives children's widths from min/preferred/flexible. |
| `childControlHeight` | Control Child Size: Height | **`true`** | Same for heights. |
| `childScaleWidth` | Use Child Scale: Width | `false` | Multiply child sizes by `localScale.x` when laying out. |
| `childScaleHeight` | Use Child Scale: Height | `false` | Same with `localScale.y`. |
| `childForceExpandWidth` | Child Force Expand: Width | **`true`** | "Whether to force the children to expand to fill additional available horizontal space." |
| `childForceExpandHeight` | Child Force Expand: Height | **`true`** | Same, vertical. |
| `reverseArrangement` | Reverse Arrangement | `false` | "If True the last child object will be positioned first." |

**Runtime vs Editor default — important for mods.** The Editor-only `Reset()` (inside `#if UNITY_EDITOR`) sets
`m_ChildControlWidth = false; m_ChildControlHeight = false;` when the component is added in the Editor:
"For new added components we want these to be set to false ... However, for existing components that were added before
this feature was introduced, we want it to be on be default for backwardds compatibility." In a player build (a BepInEx
mod calling `AddComponent<VerticalLayoutGroup>()`), `Reset()` does not exist, so you get **all four of
childControlWidth/Height and childForceExpandWidth/Height = true**. Set every one of them explicitly.

```csharp
var v = go.AddComponent<VerticalLayoutGroup>();
v.padding = new RectOffset(12, 12, 10, 10);   // left, right, top, bottom (ints)
v.spacing = 6f;
v.childAlignment = TextAnchor.UpperLeft;
v.childControlWidth = true;      v.childControlHeight = true;
v.childForceExpandWidth = true;  // children fill the column width (cross axis "stretch")
v.childForceExpandHeight = false; // do NOT hand out spare height to every row, and do not report flexibleHeight upward
v.childScaleWidth = false;       v.childScaleHeight = false;
```

## CalcAlongAxis — what the group reports to its parent
TAG: ugui.hvgroup.calc-along-axis
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/HorizontalOrVerticalLayoutGroup.cs (L87-137)

Verbatim (source):
```csharp
protected void CalcAlongAxis(int axis, bool isVertical)
{
    float combinedPadding = (axis == 0 ? padding.horizontal : padding.vertical);
    bool controlSize = (axis == 0 ? m_ChildControlWidth : m_ChildControlHeight);
    bool useScale = (axis == 0 ? m_ChildScaleWidth : m_ChildScaleHeight);
    bool childForceExpandSize = (axis == 0 ? m_ChildForceExpandWidth : m_ChildForceExpandHeight);

    float totalMin = combinedPadding;
    float totalPreferred = combinedPadding;
    float totalFlexible = 0;

    bool alongOtherAxis = (isVertical ^ (axis == 1));
    ...
        GetChildSizes(child, axis, controlSize, childForceExpandSize, out min, out preferred, out flexible);
        if (useScale) { float scaleFactor = child.localScale[axis]; min *= scaleFactor; preferred *= scaleFactor; flexible *= scaleFactor; }

        if (alongOtherAxis)
        {
            totalMin = Mathf.Max(min + combinedPadding, totalMin);
            totalPreferred = Mathf.Max(preferred + combinedPadding, totalPreferred);
            totalFlexible = Mathf.Max(flexible, totalFlexible);
        }
        else
        {
            totalMin += min + spacing;
            totalPreferred += preferred + spacing;
            // Increment flexible size with element's flexible size.
            totalFlexible += flexible;
        }
    ...
    if (!alongOtherAxis && rectChildren.Count > 0) { totalMin -= spacing; totalPreferred -= spacing; }
    totalPreferred = Mathf.Max(totalMin, totalPreferred);
    SetLayoutInputForAxis(totalMin, totalPreferred, totalFlexible, axis);
}
```
Read as formulas (n = number of laid-out children):
- Main axis: `min = padding + Σmin_i + spacing·(n-1)`; `preferred = padding + Σpref_i + spacing·(n-1)`;
  `flexible = Σflex_i`.
- Cross axis: `min = padding + max(min_i)`; `preferred = padding + max(pref_i)`; `flexible = max(flex_i)`.
- These become the group's own `minWidth/preferredWidth/flexibleWidth` (etc.) as an `ILayoutElement` with
  priority 0 (`LayoutGroup.cs` L89-119).
- Children counted (`rectChildren`): active-in-hierarchy RectTransform children, minus those whose `ILayoutIgnorer`
  components all report `ignoreLayout == true` (`LayoutGroup.CalculateLayoutInputHorizontal`, L52-82).
  **Inactive children take no space and no spacing.**

## GetChildSizes and childForceExpand — the flexible ≥ 1 rule
TAG: ugui.hvgroup.force-expand-flexible
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/HorizontalOrVerticalLayoutGroup.cs (L221-239)
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/HOWTO-UIFitContentSize.html

Verbatim (source):
```csharp
private void GetChildSizes(RectTransform child, int axis, bool controlSize, bool childForceExpand,
    out float min, out float preferred, out float flexible)
{
    if (!controlSize)
    {
        min = child.sizeDelta[axis];
        preferred = min;
        flexible = 0;
    }
    else
    {
        min = LayoutUtility.GetMinSize(child, axis);
        preferred = LayoutUtility.GetPreferredSize(child, axis);
        flexible = LayoutUtility.GetFlexibleSize(child, axis);
    }

    if (childForceExpand)
        flexible = Mathf.Max(flexible, 1);
}
```
Manual: "if the Layout Group has the Child Force Expand option enabled, it will always make the flexible sizes of all the
children be at least 1."

**Consequence for the group's OWN reported size (the leak):** because `CalcAlongAxis` sums (main axis) or maxes
(cross axis) these already-forced values, a group with `childForceExpandX = true` and at least one child reports
`flexibleX ≥ 1` to *its* parent:
- HorizontalLayoutGroup with `childForceExpandHeight = true` → its `flexibleHeight = max(1, ...) = 1`.
- HorizontalLayoutGroup with `childForceExpandWidth = true` and n children → its `flexibleWidth = Σ max(flex_i, 1) ≥ n`.
- VerticalLayoutGroup with `childForceExpandHeight = true` → `flexibleHeight ≥ n`; with `childForceExpandWidth = true`
  → `flexibleWidth ≥ 1`.

So the parent group hands this child a share of its spare space even if the *parent's* force-expand is off and nobody
set a flexible value. Worked example: `ugui.hvgroup.example-leak`. Fixes: turn off force-expand on the inner group, or put
a `LayoutElement` with `flexibleHeight = 0` (priority 1 beats the group's priority 0) on the inner group's GameObject.

## SetChildrenAlongAxis — main axis distribution (the "stack" axis)
TAG: ugui.hvgroup.main-axis-distribution
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/HorizontalOrVerticalLayoutGroup.cs (L144-219)
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-HorizontalLayoutGroup.html

Verbatim (source, main-axis branch):
```csharp
float pos = (axis == 0 ? padding.left : padding.top);
float itemFlexibleMultiplier = 0;
float surplusSpace = size - GetTotalPreferredSize(axis);          // size = rectTransform.rect.size[axis]

if (surplusSpace > 0)
{
    if (GetTotalFlexibleSize(axis) == 0)
        pos = GetStartOffset(axis, GetTotalPreferredSize(axis) - (axis == 0 ? padding.horizontal : padding.vertical));
    else if (GetTotalFlexibleSize(axis) > 0)
        itemFlexibleMultiplier = surplusSpace / GetTotalFlexibleSize(axis);
}

float minMaxLerp = 0;
if (GetTotalMinSize(axis) != GetTotalPreferredSize(axis))
    minMaxLerp = Mathf.Clamp01((size - GetTotalMinSize(axis)) / (GetTotalPreferredSize(axis) - GetTotalMinSize(axis)));

for (each child, in order or reversed)
{
    GetChildSizes(child, axis, controlSize, childForceExpandSize, out min, out preferred, out flexible);
    float scaleFactor = useScale ? child.localScale[axis] : 1f;

    float childSize = Mathf.Lerp(min, preferred, minMaxLerp);
    childSize += flexible * itemFlexibleMultiplier;
    if (controlSize)
        SetChildAlongAxisWithScale(child, axis, pos, childSize, scaleFactor);
    else
    {
        float offsetInCell = (childSize - child.sizeDelta[axis]) * alignmentOnAxis;
        SetChildAlongAxisWithScale(child, axis, pos + offsetInCell, scaleFactor);
    }
    pos += childSize * scaleFactor + spacing;
}
```
In words:
1. `t = clamp01((size - totalMin) / (totalPreferred - totalMin))` — one global fraction for all children (0 if
   totalMin == totalPreferred). Every child gets `lerp(min_i, pref_i, t)`. Manual: "The closer the Horizontal Layout
   group is to its preferred width, the closer each child layout element will also get to their preferred width."
2. If the group is larger than its total preferred: surplus = `size - totalPreferred`; each child adds
   `flex_i * surplus / Σflex`. Children keep their preferred base, so **flexible distributes only the surplus** — two
   children with flex 1 but preferred 50 and 150 end up 100 apart (example `ugui.hvgroup.example-force-expand`).
3. If surplus > 0 and Σflex == 0: children stay at preferred and the **whole block** is shifted by `childAlignment`
   (this is the only case where main-axis alignment does anything).
4. If the group is smaller than total min: `t = 0`, children get `min_i` and overflow the group (nothing shrinks
   below min).
5. Positions are cumulative from `padding.left` (horizontal) or `padding.top` (vertical, measured downward).

## SetChildrenAlongAxis — cross axis (the "other" axis)
TAG: ugui.hvgroup.cross-axis
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/HorizontalOrVerticalLayoutGroup.cs (L156-179)

Verbatim (source, cross-axis branch):
```csharp
float innerSize = size - (axis == 0 ? padding.horizontal : padding.vertical);
for (each child)
{
    GetChildSizes(child, axis, controlSize, childForceExpandSize, out min, out preferred, out flexible);
    float scaleFactor = useScale ? child.localScale[axis] : 1f;

    float requiredSpace = Mathf.Clamp(innerSize, min, flexible > 0 ? size : preferred);
    float startOffset = GetStartOffset(axis, requiredSpace * scaleFactor);
    if (controlSize)
        SetChildAlongAxisWithScale(child, axis, startOffset, requiredSpace, scaleFactor);
    else
    {
        float offsetInCell = (requiredSpace - child.sizeDelta[axis]) * alignmentOnAxis;
        SetChildAlongAxisWithScale(child, axis, startOffset + offsetInCell, scaleFactor);
    }
}
```
In words, per child, independently:
- flexible > 0 (including forced by childForceExpand on this axis) → child size = `max(min, innerSize)`: it **stretches**
  to the inner width/height (CSS `align-items: stretch`).
- flexible == 0 → child size = `clamp(innerSize, min, preferred)` = its preferred if it fits, else shrunk to the inner
  size, never below min. Then it is placed by `childAlignment` inside the padded area.

## Alignment math
TAG: ugui.hvgroup.alignment
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/LayoutGroup.cs (L191-211)
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/TextAnchor.html

```csharp
protected float GetStartOffset(int axis, float requiredSpaceWithoutPadding)
{
    float requiredSpace = requiredSpaceWithoutPadding + (axis == 0 ? padding.horizontal : padding.vertical);
    float availableSpace = rectTransform.rect.size[axis];
    float surplusSpace = availableSpace - requiredSpace;
    float alignmentOnAxis = GetAlignmentOnAxis(axis);
    return (axis == 0 ? padding.left : padding.top) + surplusSpace * alignmentOnAxis;
}
protected float GetAlignmentOnAxis(int axis)
{
    if (axis == 0) return ((int)childAlignment % 3) * 0.5f;   // Left 0, Center 0.5, Right 1
    else           return ((int)childAlignment / 3) * 0.5f;   // Upper 0, Middle 0.5, Lower 1
}
```
`TextAnchor` values: UpperLeft 0, UpperCenter 1, UpperRight 2, MiddleLeft 3, MiddleCenter 4, MiddleRight 5,
LowerLeft 6, LowerCenter 7, LowerRight 8.
Overflow direction (source): on the **cross axis** `GetStartOffset` is always used, so a child bigger than the inner
area gets a negative surplus and Center/Right/Lower alignment pushes it out on both sides / the start side. On the
**main axis** alignment is applied only when `surplus > 0 && Σflex == 0`; otherwise `pos` starts at `padding.left` /
`padding.top`, so overflowing content always runs past the right / bottom edge whatever the alignment.

## childControlSize = false
TAG: ugui.hvgroup.child-control-off
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/HorizontalOrVerticalLayoutGroup.cs (L35-43, L169-177, L207-215, L224-229)
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/api/UnityEngine.UI.HorizontalOrVerticalLayoutGroup.html

- API: "If set to false, the layout group will only affect the positions of the children while leaving the widths
  untouched. The widths of the children can be set via the respective RectTransforms in this case."
- (source) The child's min = preferred = its current `sizeDelta[axis]`, flexible = 0 — **its LayoutElement, Image and
  TMP values are ignored on that axis**.
- With `childForceExpand` on the same axis still true, flexible becomes 1: the *cell* grows by the surplus share, but the
  child keeps its size and is placed inside the cell by `childAlignment` (`offsetInCell`). Visible result: children
  spread apart with gaps — usually not what you want; turn force-expand off together with control-size off.
- `sizeDelta` equals the size only for non-stretched anchors; the group forces anchors to (0,1) anyway
  (`ugui.autolayout.driven-properties`), so set `sizeDelta` on such children.

## Padding and spacing
TAG: ugui.hvgroup.padding-spacing
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/LayoutGroup.cs (L16-21, L345-351)
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/RectOffset.html

- `padding` is a `RectOffset` of **ints** (left, right, top, bottom; `horizontal = left + right`,
  `vertical = top + bottom`). Fractional padding is impossible; use a spacer child or a `LayoutElement` on a wrapper.
- The setter is `SetProperty(ref m_Padding, value)` which marks dirty only on **assignment**. Mutating the existing object
  (`group.padding.left = 8;`) changes the numbers but does **not** mark the layout dirty (source: `SetProperty` compares
  and calls `SetDirty`). Always assign a new `RectOffset`, or call `LayoutRebuilder.MarkLayoutForRebuild`.
- `spacing` is a float, applied between laid-out children only (n-1 gaps), main axis only. Negative spacing overlaps
  children (legal).
- There is no per-child margin. Emulate it with a wrapper GameObject that has its own group + padding, or with spacer
  children carrying a `LayoutElement` (min = preferred = gap, flexible = 0).

## Use Child Scale
TAG: ugui.hvgroup.child-scale
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-HorizontalLayoutGroup.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/LayoutGroup.cs (L289-315)

Manual: "Whether the Layout Group considers the scale of its child layout elements when sizing and laying out elements.
Width and Height correspond to the Scale > X and Scale > Y values in each child layout element's Rect Transform
component." (source) With it on, `min/preferred/flexible` are multiplied by `localScale[axis]` and positions advance by
`childSize * scaleFactor`; the child's own `sizeDelta` stays unscaled ("sizeDelta must stay the same but the size used in
the calculation of the position must be scaled by the scaleFactor"). Default off: a scaled child (e.g. a hover pop
`localScale = 1.1`) overlaps its neighbours without moving them — usually desirable for animations.

## Reverse arrangement
TAG: ugui.hvgroup.reverse-arrangement
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/HorizontalOrVerticalLayoutGroup.cs (L71-80, L153-155)

`reverseArrangement` (default false): iterate children last→first when positioning. Draw order is unchanged (still
hierarchy order). Present in the target game's UnityEngine.UI.dll (checked: the string `m_ReverseArrangement` is in it).

## Worked example — preferred sizes, no flexible
TAG: ugui.hvgroup.example-basic
SOURCE: derived by hand from the source quoted in ugui.hvgroup.main-axis-distribution

HorizontalLayoutGroup, width 400, padding left/right 10/10, spacing 10, childControlWidth = true,
childForceExpandWidth = **false**, three children with min 0 and preferred 50 / 100 / 150, flexible 0.
- totalMin = 20 + 0·3 + 10·2 = 40; totalPreferred = 20 + 300 + 20 = 340; Σflex = 0.
- surplus = 60 > 0, Σflex = 0 → widths stay 50 / 100 / 150; block start = `10 + 60·align`
  (UpperLeft → 10; MiddleCenter → 40; Right → 70).
- If the group were 240 wide: t = (240-40)/(340-40) = 0.667 → widths 33.3 / 66.7 / 100.

## Worked example — force expand makes unequal "equal" tiles
TAG: ugui.hvgroup.example-force-expand
SOURCE: derived by hand from the source quoted in ugui.hvgroup.force-expand-flexible

Same group, but childForceExpandWidth = **true** → each flex = max(0, 1) = 1, Σflex = 3, surplus 60 → +20 each →
widths **70 / 120 / 170**. Flexible spreads only the surplus on top of the different preferred bases.
Equal tiles need a zero base: on each tile a `LayoutElement` with `minWidth = 0, preferredWidth = 0, flexibleWidth = 1`
→ totalMin = totalPreferred = 40, surplus = 360, each tile **120**. (`ugui.layoutelement.equal-columns`)

## Worked example — the force-expand leak through a nested group
TAG: ugui.hvgroup.example-leak
SOURCE: derived by hand from the source quoted in ugui.hvgroup.calc-along-axis and ugui.hvgroup.force-expand-flexible

Window = VerticalLayoutGroup, height 600, childControlHeight = true, childForceExpandHeight = false, padding 0, spacing 0.
Children: `Header` = HorizontalLayoutGroup left at **runtime defaults** (childForceExpandHeight = true) holding a TMP label
with preferred height 30; `Body` with a LayoutElement preferredHeight 200, flexibleHeight 1.
- Header's own vertical input (cross axis of a horizontal group): preferred = max(30) = 30, flexible = max(max(0,1)) = **1**.
- Window: totalPreferred = 230, Σflex = 1 (Header) + 1 (Body) = 2, surplus 370 → +185 each.
- Result: Header **215** tall (label stretched or floating in it), Body 385. Expected: Header 30, Body 570.
- Fix: `header.childForceExpandHeight = false` (Header flexible becomes 0), or a `LayoutElement { flexibleHeight = 0 }`
  on the Header GameObject.

## Recipes
TAG: ugui.hvgroup.recipes
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/HOWTO-UIFitContentSize.html
SOURCE: derived from the algorithm above

- **Column of rows that hug their content** (window body): VerticalLayoutGroup, childControlWidth = true,
  childControlHeight = true, childForceExpandWidth = true, childForceExpandHeight = **false**; window gets a
  ContentSizeFitter verticalFit = PreferredSize, or a fixed height with one filler row (`flexibleHeight = 1`).
- **Label + value row** ("Damage ........ 12"): HorizontalLayoutGroup, childControlWidth = true,
  childForceExpandWidth = false, childForceExpandHeight = false; label: LayoutElement flexibleWidth = 1 (takes the rest,
  left-aligned text); value: no LayoutElement (preferred = text width), right-aligned text.
- **Toolbar with a spacer**: buttons at preferred width; an empty child with LayoutElement flexibleWidth = 1 between the
  left and right groups (acts like CSS `margin-left: auto`).
- Manual, on content-hugging children: "What you need to do is to disable the Child Force Expand toggles on the Layout
  Group. If the children are themselves Layout Groups too, you may need to disable the Child Force Expand toggles on those
  too." ... "add a Layout Element component to the children you want to expand and enabling the Flexible Width or Flexible
  Height properties on those Layout Elements. The parent Layout Group should still have the Child Force Expand toggles
  disabled, otherwise all the children will expand flexibly."

## Grid Layout Group: properties and defaults
TAG: ugui.grid.properties-defaults
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-GridLayoutGroup.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/GridLayoutGroup.cs (L75-116)

| Property | Default | Meaning |
|---|---|---|
| `padding` | 0,0,0,0 | as above |
| `cellSize` | `(100, 100)` | "The size to use for each layout element in the group." |
| `spacing` (Vector2) | `(0, 0)` | gap between cells, X and Y |
| `startCorner` | `UpperLeft` | "The corner where the first element is located." |
| `startAxis` | `Horizontal` | "Horizontal will fill an entire row before a new row is started." |
| `childAlignment` | `UpperLeft` | alignment of the whole block of cells |
| `constraint` | `Flexible` | `FixedColumnCount` / `FixedRowCount` / `Flexible` |
| `constraintCount` | `2` | used with Fixed* constraints |

"Unlike other layout groups, the Grid Layout Group ignores the minimum, preferred, and flexible size properties of its
contained layout elements and instead assigns a fixed size to all of them which is defined with the Cell Size property".
There is no "1fr" in a grid: to get N equal columns that fill a width, compute
`cellSize.x = (width - padding.horizontal - spacing.x·(N-1)) / N` yourself, or use a HorizontalLayoutGroup per row
(`ugui.layoutelement.equal-columns`).

## Grid Layout Group with a Content Size Fitter
TAG: ugui.grid.content-size-fitter
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-GridLayoutGroup.html

"The auto layout system calculates the horizontal and vertical sizes independently. This can be at odds with the Grid
Layout Group, where the number of rows depends on the number of columns and vice versa."
- Grid grows **downward** (fixed width): Constraint = Fixed Column Count; Fitter Horizontal = Preferred or Unconstrained;
  Fitter Vertical = Preferred.
- Grid grows **sideways** (fixed height): Constraint = Fixed Row Count; Fitter Horizontal = Preferred;
  Fitter Vertical = Preferred or Unconstrained.
- Both flexible: Constraint = Flexible, both fits Preferred — "you will have no control over the specific number of rows
  and columns. The grid will attempt to make the row and column count approximately the same."
