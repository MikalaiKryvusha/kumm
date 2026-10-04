# 01 — Auto Layout: the model, the passes, the rebuild

> Unity UI (uGUI) 1.0 as used by Unity 2020.3. Manual text is quoted from the package manual; behavior
> marked **(source)** comes from the uGUI 1.0.0 C# source as shipped with Unity 2020.3.18f1 (official
> package contents, read via the needle-mirror GitHub mirror). The target game runs 2020.3.49f1, and its
> `UnityEngine.UI.dll` contains `m_ReverseArrangement`, so it has this same code generation.
> Line numbers refer to the raw files listed in SOURCE.

---

## Layout elements and layout controllers
TAG: ugui.autolayout.model
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/UIAutoLayout.html

- A **layout element** is any GameObject with a RectTransform. It *reports* six numbers and does not size itself:
  min width, min height, preferred width, preferred height, flexible width, flexible height.
- A **layout controller** reads those numbers and sets sizes/positions:
  - `ContentSizeFitter`, `AspectRatioFitter` drive **their own** RectTransform (`ILayoutSelfController`).
  - `HorizontalLayoutGroup`, `VerticalLayoutGroup`, `GridLayoutGroup` drive **their children** (`ILayoutGroup`).
  - A layout group is *also* a layout element: it reports min/preferred/flexible computed from its children.
    "A layout group doesn't control its own size. Instead it functions as a layout element itself which may be
    controlled by other layout controllers or be set manually."
- Allocation order inside a group, verbatim from the manual:
  - "First minimum sizes are allocated."
  - "If there is sufficient available space, preferred sizes are allocated."
  - "If there is additional available space, flexible size is allocated."
- Default reported values: "Any Game Object with a Rect Transform on it can function as a layout element. They will
  by default have minimum, preferred, and flexible sizes of 0." Image and Text (and TMP) change the preferred size to
  match their content (exact values: `ugui.autolayout.builtin-values`).
- Units: min and preferred are in canvas units (the same units as `RectTransform.rect`); flexible is a **relative
  weight**, not a size ("Min and Preferred sizes are in regular units, while the Flexible sizes are in relative
  units" — Layout Element page).

## Layout interfaces
TAG: ugui.autolayout.interfaces
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/UIAutoLayout.html
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/api/UnityEngine.UI.ILayoutElement.html

| Interface | Meaning |
|---|---|
| `ILayoutElement` | "A component is treated as a layout element by the auto layout system if it implements the interface ILayoutElement." Members: `CalculateLayoutInputHorizontal/Vertical()`, `minWidth`, `preferredWidth`, `flexibleWidth`, `minHeight`, `preferredHeight`, `flexibleHeight`, `layoutPriority`. |
| `ILayoutController` | `SetLayoutHorizontal()`, `SetLayoutVertical()`. |
| `ILayoutGroup : ILayoutController` | "A component is expected to drive the Rect Transforms of its children if it implements the interface ILayoutGroup." |
| `ILayoutSelfController : ILayoutController` | "A component is expected to drive its own RectTransform if it implements the interface ILayoutSelfController." |
| `ILayoutIgnorer` | `ignoreLayout` — implemented by `LayoutElement`; a child with `ignoreLayout == true` is skipped by its parent group. |

API remarks worth keeping (ILayoutElement page):
- "The minWidth, preferredWidth, and flexibleWidth properties should not rely on any properties of the RectTransform of
  the layout element, otherwise the behavior will be non-deterministic."
- "The minHeight, preferredHeight, and flexibleHeight properties may rely on horizontal aspects of the RectTransform,
  such as the width or the X component of the position." (This is why wrapped text height works: width first.)
- `layoutPriority`: "values less than zero are ignored. This way a component can override only select properties by
  leaving the remaning values to be -1 or other values less than zero."

## Calculation order: widths first, then heights
TAG: ugui.autolayout.order
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/UIAutoLayout.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/LayoutRebuilder.cs (L75-90)

The four passes, in order (manual):
1. `CalculateLayoutInputHorizontal` on `ILayoutElement`s — **bottom-up** (children before parents).
2. `SetLayoutHorizontal` on `ILayoutController`s — **top-down** (parents before children). "After this step the Rect
   Transforms of the layout elements have their new widths."
3. `CalculateLayoutInputVertical` — bottom-up.
4. `SetLayoutVertical` — top-down.

"the auto layout system evaluates widths first and then evaluates heights afterwards. Thus, calculated heights may
depend on widths, but calculated widths can never depend on heights."

The code (source, `LayoutRebuilder.Rebuild`):
```csharp
case CanvasUpdate.Layout:
    PerformLayoutCalculation(m_ToRebuild, e => (e as ILayoutElement).CalculateLayoutInputHorizontal());
    PerformLayoutControl(m_ToRebuild, e => (e as ILayoutController).SetLayoutHorizontal());
    PerformLayoutCalculation(m_ToRebuild, e => (e as ILayoutElement).CalculateLayoutInputVertical());
    PerformLayoutControl(m_ToRebuild, e => (e as ILayoutController).SetLayoutVertical());
```
Within one GameObject, `PerformLayoutControl` first calls every `ILayoutSelfController` (ContentSizeFitter,
AspectRatioFitter), then the other controllers (layout groups) — so a fitter on a group resizes the group *before*
the group lays out its children (source L109-129).

## Traversal rules that silently skip subtrees
TAG: ugui.autolayout.rebuild-traversal
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/LayoutRebuilder.cs (L92-163)

(source) Two recursive walkers, with different stop conditions:
- `PerformLayoutCalculation(rect)` recurses into children **only if** `rect` has at least one enabled `ILayoutElement`
  **or** an `ILayoutGroup`:
  ```csharp
  if (components.Count > 0  || rect.GetComponent(typeof(ILayoutGroup)))
  {   for (int i = 0; i < rect.childCount; i++) PerformLayoutCalculation(rect.GetChild(i) as RectTransform, action);
      for (int i = 0; i < components.Count; i++) action(components[i]); }
  ```
- `PerformLayoutControl(rect)` recurses **only if** `rect` has an enabled `ILayoutController`
  ("If there are no controllers on this rect we can skip this entire sub-tree ... since they will be their own roots").
- A `ScrollRect` does not run its controller pass on its own `content` from the content's side (special-case L118-124).

Consequences:
- A bare container (RectTransform only, no Image/TMP/LayoutElement/group) between two layout groups stops the
  bottom-up input calculation for everything below it *when the rebuild starts above it*. Deeper groups are rebuilt
  only when they are marked themselves (they are "their own roots").
- `ForceRebuildLayoutImmediate(x)` where `x` has no layout component does nothing for its subtree controllers.
- Disabled components (`isActiveAndEnabled == false`) are stripped and ignored.

## Marking a layout dirty (the normal path)
TAG: ugui.autolayout.rebuild-mark
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/UIAutoLayout.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/LayoutRebuilder.cs (L169-236)
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/api/UnityEngine.UI.LayoutRebuilder.html

`LayoutRebuilder.MarkLayoutForRebuild(RectTransform rect)` — manual: "The rebuild will not happen immediately, but at
the end of the current frame, just before rendering happens."

(source) What it does:
1. Walks **up** the parents while each parent has an active+enabled `ILayoutGroup`; the topmost such parent becomes the
   *layout root*. (One `GetComponents` call per level — this is the cost the optimization guide warns about.)
2. If no parent group was found and `rect` itself has no enabled `ILayoutController`, it returns without doing anything.
3. Registers one `LayoutRebuilder` for that root in `CanvasUpdateRegistry` (deduplicated by the root's hash).

Who calls it for you (source): every setter on `LayoutElement`, `ContentSizeFitter`, `LayoutGroup` (through
`SetProperty` → `SetDirty`), `OnEnable`/`OnDisable`, `OnTransformChildrenChanged` (group), `OnRectTransformDimensionsChange`
(root groups and fitters), `TMP_Text.text`/`fontSize`/spacing setters (`SetLayoutDirty`), `Graphic.SetLayoutDirty`, and
`RectTransform.reapplyDrivenProperties`. Manual guideline list: property setters, `OnEnable`, `OnDisable`,
`OnRectTransformDimensionsChange`, `OnValidate` (editor only), `OnDidApplyAnimationProperties`.

```csharp
// After changing something the layout system cannot see (e.g. mutating padding fields in place):
LayoutRebuilder.MarkLayoutForRebuild((RectTransform)group.transform);
```

## Forcing an immediate rebuild
TAG: ugui.autolayout.rebuild-force
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/api/UnityEngine.UI.LayoutRebuilder.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/LayoutRebuilder.cs (L67-73)

`LayoutRebuilder.ForceRebuildLayoutImmediate(RectTransform layoutRoot)` — API: "Forces an immediate rebuild of the
layout element and child layout elements affected by the calculations." Remarks (verbatim): "Normal use of the layout
system should not use this method. Instead MarkLayoutForRebuild should be used instead, which triggers a delayed layout
rebuild during the next layout pass." ... "Usage should be restricted to cases where multiple layout passes are
unavaoidable despite the extra cost in performance."

(source) It runs the 4 passes **from `layoutRoot` downward only** — it does **not** walk up to the parent group.
If the parent group's size depends on this subtree, rebuild the parent (or the top of the window) instead.

```csharp
// Build the window, then measure it in the same frame:
LayoutRebuilder.ForceRebuildLayoutImmediate(windowRoot);   // windowRoot must carry the top layout group/fitter
float h = windowRoot.rect.height;                          // now valid
```
Nested groups that are separated from `windowRoot` by a bare RectTransform are not reached
(`ugui.autolayout.rebuild-traversal`); call it on each such sub-root bottom-up, or add a layout component to the bridge.

## When layout actually runs in a frame
TAG: ugui.autolayout.frame-timing
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/CanvasUpdateRegistry.cs (L89-231)
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Canvas.ForceUpdateCanvases.html
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/class-RectTransform.html

(source) `CanvasUpdateRegistry` subscribes `PerformUpdate` to `Canvas.willRenderCanvases`. `PerformUpdate`:
1. sorts the queued layout roots by depth (`ParentCount`, shallow first);
2. runs `Prelayout`, `Layout`, `PostLayout` on every queued layout rebuilder;
3. runs clipping (`ClipperRegistry.instance.Cull()` — RectMask2D);
4. runs `PreRender`, `LatePreRender` graphic rebuilds (mesh generation; TMP builds its mesh here).

So everything set during `Update`/`LateUpdate`/coroutines is laid out once, just before the canvas renders.

`Canvas.ForceUpdateCanvases()` (API): "A canvas performs its layout and content generation calculations at the end of a
frame, just before rendering ... This means that in the Start callback and the first Update callback, the layout and
content under the canvas may not be up-to-date. Code that relies on up-to-date layout or content can call this method".
RectTransform manual: "some RectTransform calculations are performed at the end of a frame, just before calculating UI
vertices ... they haven't yet been calculated for the first time in the Start callback and first Update callback."

A layout group that is marked dirty **while** layout is being rebuilt defers itself to the next frame (source,
`LayoutGroup.SetDirty`: `StartCoroutine(DelayedSetDirty(rectTransform))` → `yield return null`). Changing layout
inputs from inside `SetLayoutHorizontal/Vertical` therefore costs a frame of visible wrong layout.

## Driven RectTransform properties
TAG: ugui.autolayout.driven-properties
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/UIAutoLayout.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/LayoutGroup.cs (L247-315)

- Manual: values driven by a layout controller "would just get reset by the layout controller on the next layout
  calculation anyway", and "the values of driven properties are not saved as part of the Scene".
- (source) A layout group drives on **each child**: `Anchors` + `AnchoredPositionX/Y` always, plus `SizeDeltaX/Y` when
  it controls size on that axis. It **forces the child's anchors to top-left**:
  ```csharp
  rect.anchorMin = Vector2.up;   // (0,1)
  rect.anchorMax = Vector2.up;
  ```
  and positions the child from the parent's top-left corner, honoring the child's pivot. Any anchors you set on a
  child of a layout group are overwritten. Stretch-anchoring a child inside a group is impossible; use
  `LayoutElement.ignoreLayout = true` for an absolutely positioned child.
- A `ContentSizeFitter` drives `SizeDeltaX`/`SizeDeltaY` of its own RectTransform on the axes it fits.

## Priority resolution: which component's number wins
TAG: ugui.autolayout.priority
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/LayoutUtility.cs (L128-187)
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/manual/script-LayoutElement.html

(source) `LayoutUtility.GetLayoutProperty(rect, property, defaultValue)` — exact rule, per property separately:
```csharp
float min = defaultValue;                 // 0 for every built-in query
int maxPriority = System.Int32.MinValue;
foreach (ILayoutElement layoutComp on rect)          // GetComponents order
{
    if (layoutComp is Behaviour && !((Behaviour)layoutComp).isActiveAndEnabled) continue;
    int priority = layoutComp.layoutPriority;
    if (priority < maxPriority) continue;            // lower priority than one already used: ignore
    float prop = property(layoutComp);
    if (prop < 0) continue;                          // negative = "not set": ignore
    if (priority > maxPriority) { min = prop; maxPriority = priority; }   // higher priority overwrites
    else if (prop > min) { min = prop; }                                  // same priority: largest wins
}
return min;
```
Manual wording: "the layout system uses the property values from the component with the highest Layout Priority. If the
components have the same Layout Priority, the layout system uses the highest value for each property, regardless of
which component it comes from."

Built-in priorities: `LayoutElement` = **1** (default, settable); `Image`, `Text`, `TextMeshProUGUI`, `LayoutGroup`,
`ScrollRect` = **0**. So a `LayoutElement` value ≥ 0 always beats the content's own value; a `LayoutElement` value of
-1 ("unset") lets the content's value through.

## Preferred is floored by min
TAG: ugui.autolayout.preferred-floor
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/LayoutUtility.cs (L68-71, L104-107)

(source)
```csharp
public static float GetPreferredWidth(RectTransform rect)
{   return Mathf.Max(GetLayoutProperty(rect, e => e.minWidth, 0), GetLayoutProperty(rect, e => e.preferredWidth, 0)); }
```
Same for height. Setting `minWidth = 120` with `preferredWidth` unset makes the preferred width at least 120.
Min and flexible are returned as resolved; preferred is `max(min, preferred)`.

## What the built-in components report
TAG: ugui.autolayout.builtin-values
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Image.cs (L1695-1755)
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/UnityCsReference/2020.3/Runtime/2D/Common/ScriptBindings/SpriteDataUtility.cs (L27-34, GetMinSize = border.x+border.z, border.y+border.w)
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/LayoutGroup.cs (L89-119)
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/LayoutElement.cs (L13-20)
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.6/Scripts/Runtime/TMP_Text.cs (L1327-1416, L3736-3834)

| Component | min W/H | preferred W | preferred H | flexible W/H | priority |
|---|---|---|---|---|---|
| bare RectTransform | 0 | 0 | 0 | 0 | — |
| `Image` (sprite set) | 0 | Simple/Filled: `sprite.rect.width / pixelsPerUnit`; Sliced/Tiled: sprite **border sum** (`DataUtility.GetMinSize`) / pixelsPerUnit | same on Y | -1 (unset) | 0 |
| `Image` (no sprite) | 0 | 0 | 0 | -1 | 0 |
| `TextMeshProUGUI` | 0 | width of the text laid out **without wrapping**, infinite box, + left/right margins | height of the text wrapped at the **current** rect width minus margins, + top/bottom margins | -1 | 0 |
| `Horizontal/VerticalLayoutGroup` | sum/max of children's min + padding (+spacing) | same with preferred | same | sum/max of children's flexible (≥1 per child if force-expand) | 0 |
| `GridLayoutGroup` | from cellSize, spacing, constraint | | | | 0 |
| `LayoutElement` | value or -1 | value or -1 | value or -1 | value or -1 | 1 |

Image `pixelsPerUnit = sprite.pixelsPerUnit / canvas.referencePixelsPerUnit` (`ugui.image.pixels-per-unit`).
TMP details: `tmp.text.preferred-values`.
