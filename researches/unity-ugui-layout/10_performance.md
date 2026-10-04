# 10 — Performance: rebuild cost, canvases, layout groups

> Sources: Unity's "Optimization tips for Unity UI" page (fetched as text), Unity Learn "Optimizing Unity UI" (the Learn
> site renders with JavaScript; it was read through WebFetch's summarizer, so quotes from it are as returned by that tool),
> and the uGUI source.

---

## Split canvases by update frequency
TAG: perf.canvas.split
SOURCE: https://unity.com/how-to/unity-ui-optimization-tips
SOURCE: https://learn.unity.com/tutorial/optimizing-unity-ui

"Problem: When a single element changes on the UI Canvas, it dirties the whole Canvas." "when one or more elements change
on a Canvas, the whole Canvas has to be analyzed once again, to figure out how to optimally draw its elements." "Many users
build their entire game's UI on a single Canvas with thousands of elements. When they change one element, they can
experience a CPU spike costing multiple milliseconds."
"Each Canvas is an island that isolates its elements from those of other Canvases." "Child Canvases also isolate content
from both their parent and sibling Canvases. They maintain their own geometry and perform their own batching." "Keep
static UI Elements on a separate Canvas, and dynamic Elements that update at the same time on smaller sub-Canvases. Also,
ensure that all UI Elements on each Canvas have the same Z value, materials, and textures."
Learn: "A Sub-canvas is simply a Canvas component that is nested inside another Canvas component. Sub-canvases isolate
their children from their parent; a dirty child will not force a parent to rebuild its geometry, and vice versa."
"it is generally best to split any non-trivial Canvas into at least two parts".

## The rebuild pipeline
TAG: perf.canvas.rebuild-pipeline
SOURCE: https://learn.unity.com/tutorial/optimizing-unity-ui
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/CanvasUpdateRegistry.cs (L162-231)

Learn: "The batch building process is the process whereby a Canvas combines the meshes representing its UI elements and
generates the appropriate rendering commands." It involves "sorting the meshes by depth and examining them for overlaps,
shared materials and so on." The rebuild runs in `CanvasUpdateRegistry`: dirty layouts rebuild, clipping culls, dirty
graphics rebuild meshes (source order in `ugui.autolayout.frame-timing`).

## Layout dirtying walks up the hierarchy
TAG: perf.layout.dirty-walk
SOURCE: https://unity.com/how-to/unity-ui-optimization-tips
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.ugui/1.0.0/Unity-2020.3.18f1/Runtime/UI/Core/Layout/LayoutRebuilder.cs (L169-207)

"Every UI Element that marks its layout as "dirty" will perform, at minimum, one GetComponent call. This call looks for a
valid layout group on the layout element's parent. If it finds one, it continues walking up the Transform hierarchy until
it stops seeking layout groups or reaches the hierarchy root; whichever comes first. As such, each layout group adds one
GetComponent call to each child layout element's dirtying process, making the nested layout groups extremely bad for
performance." (Matches the source loop in `MarkLayoutForRebuild`.) Then the whole tree under the topmost group is
recalculated: Learn — Layout Groups "must recompute the sizes and positions of their child elements each time they are
marked dirty."

## Avoid layout groups on hot, frequently changing UI
TAG: perf.layout.avoid-groups-hot
SOURCE: https://unity.com/how-to/unity-ui-optimization-tips
SOURCE: https://learn.unity.com/tutorial/optimizing-unity-ui

"Solution: Avoid layout groups when possible. Use Anchors for proportional layouts. On hot UIs with a dynamic number of UI
Elements, consider writing your own code to calculate layouts. Be sure to use this on demand, rather than for every single
change." Learn: "If there is a relatively small and fixed number of elements within a given Layout, and the Layout has a
relatively simple structure, it may be possible to replace the Layout with a RectTransform-based layout."
Pattern for a mod window (derived): build with layout groups (correctness), let one layout pass run (or
`ForceRebuildLayoutImmediate`), then leave the groups on if the window is rebuilt rarely (an item tooltip), or compute
positions yourself for per-frame content (timers, bars, numbers that tick). A number that changes every frame inside a
TMP that sits in a layout group re-runs the whole window's layout every frame (`tmp.text.layout-element`: `text` setter →
`SetLayoutDirty`). Give such labels a fixed size (LayoutElement min = preferred) — it still marks dirty, but the result is
stable — or move them out of the group / onto their own sub-canvas.

## ForceRebuildLayoutImmediate cost
TAG: perf.layout.force-rebuild-cost
SOURCE: https://docs.unity3d.com/Packages/com.unity.ugui@1.0/api/UnityEngine.UI.LayoutRebuilder.html

"Usage should be restricted to cases where multiple layout passes are unavaoidable despite the extra cost in
performance." Call it once after building a window, not per frame; the end-of-frame pass will run anyway if anything is
still dirty.

## Raycast targets and Graphic Raycasters
TAG: perf.raycast.target
SOURCE: https://unity.com/how-to/unity-ui-optimization-tips
SOURCE: https://learn.unity.com/tutorial/optimizing-unity-ui

"Remove Graphic Raycasters from non-interactive UI Canvases and turn off the Raycast Target for static or non-interactive
elements. In particular, text on a button turning off the Raycast Target will directly reduce the number of intersection
checks that the Graphic Raycaster must perform on each frame." "You need a Graphic Raycaster on every Canvas that requires
input, including sub-Canvases." Learn: "it is a best practice to only enable the 'Raycast Target' setting on UI components
that must receive pointer events." Defaults to remember: `Graphic.raycastTarget = true` (Image), TMP takes it from TMP
Settings.

## Hiding UI: disable the Canvas component
TAG: perf.canvas.hide
SOURCE: https://unity.com/how-to/unity-ui-optimization-tips
SOURCE: https://learn.unity.com/tutorial/optimizing-unity-ui

"Disabling the Canvas component will stop the Canvas from issuing draw calls to the GPU ... the Canvas won't discard its
vertex buffer, it will keep all of its meshes and vertices. Then when you re-enable it, it won't trigger a rebuild"
"disabling the Canvas component does not trigger the expensive OnDisable/OnEnable callbacks via the Canvas hierarchy."
Learn: disabling the GameObject instead "causes the Canvas to discard its VBO data" and requires a full rebuild on
re-enable. A hidden-by-alpha window (CanvasGroup alpha 0) still renders and raycasts unless `blocksRaycasts = false`.

## Pooling order
TAG: perf.pool.reparent-order
SOURCE: https://unity.com/how-to/unity-ui-optimization-tips

"People often pool UI objects by reparenting and then disabling them, which causes unnecessary dirtying. Solution:
Disable the object first, then reparent it into the pool." "If you're removing an object from the pool, reparent it
first, update your data, and then enable it."

## Animators on UI
TAG: perf.animator
SOURCE: https://unity.com/how-to/unity-ui-optimization-tips

"Animators will dirty their UI Elements on every frame, even if the value in the animation does not change." "Only put
animators on dynamic UI Elements that always change. For Elements that rarely change or that change temporarily in
response to events, write your own code or use a tweening system."

## Overdraw and stacked elements
TAG: perf.overdraw
SOURCE: https://unity.com/how-to/unity-ui-optimization-tips
SOURCE: https://learn.unity.com/tutorial/optimizing-unity-ui

"Large List and Grid views are expensive, and layering numerous UI Elements (i.e., cards stacked in a card battle game)
creates overdraw." "consider reusing a smaller pool of UI Elements rather than a single UI Element for each item."
Learn: high overdraw comes from "a large number of overlapping UI elements and/or having multiple UI elements that occupy
significant portions of the screen"; fixes include "disabling elements that are not visible to the player" and baking
"decorative/invariant elements of the UI into its background texture". Full-screen UI: "disable the Camera rendering the
3D scene" (not applicable to a mod overlaying a running game).

## Text costs
TAG: perf.text
SOURCE: https://learn.unity.com/tutorial/optimizing-unity-ui
SOURCE: https://docs.unity3d.com/Packages/com.unity.textmeshpro@3.2/manual/TMPObjectUIText.html
SOURCE: https://raw.githubusercontent.com/needle-mirror/com.unity.textmeshpro/3.0.9/CHANGELOG.md

Learn on TextMeshPro: "making changes to the text displayed by the component will trigger calls to
Canvas.SendWillRendererCanvases and Canvas.BuildBatch which can be costly." On legacy Text: "In general, the UI Text
component's Best Fit setting should never be used". TMP manual on Auto Size: "This is a resource intensive process, so
avoid auto-sizing dynamic text that changes frequently. Tip: For static text, you can enable Auto Size, note the calculated
font size ... then disable Auto Size and apply the calculated size manually."
Use `SetText(...)` overloads / avoid string allocations for per-frame numbers (TMP API; changelog 3.0.4 notes "using the text
property getter when the text was updated via one of the SetText methods will results a string allocation").
