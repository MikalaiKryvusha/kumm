# 06 — Driving a game's Animator from a mod: runtime API, frame order, poses without a clip

> A BepInEx mod cannot edit the game's AnimatorController asset (no new states, transitions, parameters, layers or IK Pass
> flags). This file collects what it CAN do at runtime with Unity 2020.3: play and cross-fade existing states by name or hash, read
> state progress, freeze a pose with `speed`, own root motion in `OnAnimatorMove`, match a hand to a ledge with `MatchTarget`, use
> IK only where the controller already has an IK pass, step the Animator by hand, swap clips with an `AnimatorOverrideController`,
> play a foreign clip through Playables, and pose bones after the Animator in `LateUpdate` or through `HumanPoseHandler`. It ends
> with three ways to get a climbing look without a climbing clip. Every API below was checked present (string search) in the game's
> `UnityEngine.AnimationModule.dll` (2020.3.49f1). Pages fetched 2026-10-14.

---

## What we already know about the hero's Animator (local)
TAG: anim.local.hero-animator
SOURCE: local D:/work/ai_sandbox/KUMM/ideas/17_svarog_pryzhok_na_probel.md (L90-104, clip recon and in-game probe)
SOURCE: local D:/work/ai_sandbox/SvarogsDream/src/KrinikFixes/Jump.cs (L59, L105-127, L143, L196)
SOURCE: local D:/work/ai_sandbox/SvarogsDream/src/KrinikDevHarness/Plugin.cs (L508-535, `clipcurve`)
SOURCE: local D:/work/ai_sandbox/KUMM/testcases/reports/2026-10-14_svarog-jump-space.md (steps 1, 5; case L0)

- The Animator is on `Player/ModelSelector`. Controllers in the bundle: `PlayerAnimator`, `PlayerAnimatorDualWeapons`,
  `PlayerBowAnimator` (the recon calls it a substitute for `5-Bow`). States include `Anim_BowJumpShot_Fwd`, `Jump Back`,
  `Double_Jump_ALL`; parameters `Jump`, `IsJumpOver`, `IsBowJump`. No climb, hang or ledge clip is known ([recon] risk 1).
- **Humanoid:** harness `clipcurve` refuses with "no humanoid Animator" unless `isHuman`; it ran (exit 0, pelvis/foot curve
  printed), so `isHuman == true` and `GetBoneTransform` returns real bones (hierarchy not optimized away).
- **Short names work:** `Jump.cs` hashes the bare name (`Animator.StringToHash("Anim_BowJumpShot_Fwd")`); `HasState(0, hash)` and
  `Play(hash, 0, t)` work in game (log `clip yes`), as did the console `Play Anim_BowJumpShot_Fwd`. Observed, not documented.
- **Held pose already shipped:** take-off frame frozen by `anim.Play(ClipHash, 0, TakeoffAt); anim.speed = 0f;`, restored by
  `anim.speed = speed; anim.Play(ClipHash, 0, LandFrom);`.
- **Synchronous sampling works:** `clipcurve` sets `speed = 0`, then per step `ca.Play(cclip, 0, t); ca.Update(0f);` and reads bone
  positions at once; it picked the 0.14/0.65 pose pair that removed the landing hop (case L0: +0.52 → 0.00).

## Play and PlayInFixedTime
TAG: anim.play
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Animator.Play.html · .../Animator.PlayInFixedTime.html

```csharp
public void Play(string stateName,   int layer = -1, float normalizedTime = float.NegativeInfinity);
public void Play(int stateNameHash,  int layer = -1, float normalizedTime = float.NegativeInfinity);
public void PlayInFixedTime(string stateName,  int layer = -1, float fixedTime = float.NegativeInfinity);  // seconds
public void PlayInFixedTime(int stateNameHash, int layer = -1, float fixedTime = float.NegativeInfinity);
```
- "it should include the name of the parent layer. For example, if you have a `Bounce` state in the `Base Layer`, the name is
  `Base Layer.Bounce`." (Short names worked here, `anim.local.hero-animator`.)
- "If stateNameHash is 0, it changes the current state time." "If layer is -1, it plays the first state with the given state name or
  hash." `normalizedTime` "varies between 0 and 1"; Play is a jump, not a blend: "If no transition is set up then Play will continue
  to 1.0 with no changes"; then the state's own exit transitions take over.

## CrossFade and CrossFadeInFixedTime
TAG: anim.crossfade
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Animator.CrossFade.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Animator.CrossFadeInFixedTime.html

```csharp
public void CrossFade(string stateName, float normalizedTransitionDuration, int layer = -1,
                      float normalizedTimeOffset = float.NegativeInfinity, float normalizedTransitionTime = 0.0f);
public void CrossFade(int stateHashName, float normalizedTransitionDuration, int layer = -1,
                      float normalizedTimeOffset = 0.0f, float normalizedTransitionTime = 0.0f);
public void CrossFadeInFixedTime(int stateHashName, float fixedTransitionDuration, int layer = -1,   // also a string overload,
                                 float fixedTimeOffset = 0.0f, float normalizedTransitionTime = 0.0f); // same defaults
```
- "Creates a crossfade from the current state to any other state using normalized times" / "using times in seconds"; same naming rule.
- As printed, the string `CrossFade` defaults `normalizedTimeOffset` to `NegativeInfinity`, the hash overload to `0.0f`.
  **(derived)** Always pass the offset. `CrossFadeInFixedTime(hash, 0.15f, 0, t)` blends where `Play` pops.

## Hashes and state lookup
TAG: anim.hash
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Animator.StringToHash.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Animator.HasState.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AnimatorStateInfo-shortNameHash.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AnimatorStateInfo-fullPathHash.html

`StringToHash(string)`: "Ids are used for optimized setters and getters on parameters." `HasState(int layerIndex, int stateID)`:
"Returns true if the state exists in this layer". `shortNameHash`: "does not include the name of the parent layer";
`fullPathHash`: "The full path hash for this state." **(derived)** Cache hashes as `static readonly int` (as `Jump.cs`), probe
candidates with `HasState` once at load and log the result; never pass strings per frame.

## Reading state progress
TAG: anim.stateinfo
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Animator.GetCurrentAnimatorStateInfo.html · .../AnimatorStateInfo.html · .../Animator.IsInTransition.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AnimatorStateInfo-normalizedTime.html · .../AnimatorStateInfo-length.html · .../AnimatorStateInfo.IsName.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/ExecutionOrder.html

- `GetCurrentAnimatorStateInfo(int layerIndex)` → `fullPathHash, length, loop, normalizedTime, shortNameHash, speed,
  speedMultiplier, tagHash`, methods `IsName`, `IsTag`. `GetNextAnimatorStateInfo(layer)` and `IsInTransition(layer)` cover blends.
- `normalizedTime`: "The integer part is the number of time a state has been looped. The fractional part is the % (0-1) of progress
  in the current loop." `length`: "In seconds. Can vary when the State contains a Blend Tree." `IsName`: "in the form Layer.Name".
- A `Play` shows up on the next evaluation: a state started from `FireAnimationEvents` "will play on the next frame, and not right
  away" (manual). `Jump.cs` waits one frame after `Play` before reading `normalizedTime`.

## speed
TAG: anim.speed
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Animator-speed.html

"The playback speed of the Animator. 1 is normal playback speed." "Negative playback speed is only supported when the recorder is
enabled." It scales all layers. `speed = 0` freezes the pose (shipped here). Per-state speed is in the asset.

## Root motion: applyRootMotion and OnAnimatorMove
TAG: anim.rootmotion
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Animator-applyRootMotion.html · .../MonoBehaviour.OnAnimatorMove.html · .../Animator.ApplyBuiltinRootMotion.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/RootMotion.html

- "`applyRootMotion` has no effect when the script implements a MonoBehaviour.OnAnimatorMove function." "Changing the value of
  applyRootMotion at runtime will re-initialize the animator." **(derived)** Never toggle it per frame.
- `OnAnimatorMove` is "invoked at each frame after the state machines and the animations have been evaluated, but before
  OnAnimatorIK". `ApplyBuiltinRootMotion()`: for frames "where you don't want to handle the root motion manually".
- Manual: Body Transform = "the mass center of the character"; Root Transform "is a projection on the Y plane of the Body Transform
  and is computed at runtime".
- **(derived)** An `OnAnimatorMove` must sit on `Player/ModelSelector` and takes root motion of ALL states; add the component only
  while off-mesh, or call `ApplyBuiltinRootMotion()` when not climbing. Off-mesh the mod moves `player` (the model's parent), so the
  model's root motion should be zero anyway; the game's setting is unread (gaps).

## MatchTarget
TAG: anim.matchtarget
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Animator.MatchTarget.html · .../MatchTargetWeightMask.html · .../Animator.InterruptMatchTarget.html · .../AvatarTarget.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/TargetMatching.html
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/UnityCsReference/2020.3/Modules/Animation/ScriptBindings/Animator.bindings.cs (L742-755)

```csharp
public void MatchTarget(Vector3 matchPosition, Quaternion matchRotation, AvatarTarget targetBodyPart,
                        MatchTargetWeightMask weightMask, float startNormalizedTime, float targetNormalizedTime = 1);
// 2020.3 source: also an overload with `bool completeMatch = true`; all route to one native call
public MatchTargetWeightMask(Vector3 positionXYZWeight, float rotationWeight);
```
- Limits, verbatim: "Target matching only works on the base layer (index 0)." "You can only queue one match target at a time and you
  must wait for the first one to finish, otherwise your target matching will be discarded." "Animator.applyRootMotion must be enabled
  for MatchTarget to take effect." A start time below the current time on a looping clip moves to the next loop.
- `completeMatch` true: "the GameObject to immediately move to the matchPosition if interrupted". `isMatchingTarget`: "If automatic
  matching is active." `InterruptMatchTarget(bool completeMatch = true)`.
- `AvatarTarget`: `Root, Body, LeftFoot, RightFoot, LeftHand, RightHand`. The page does not say "humanoid only"; hand/foot targets
  are humanoid body parts **(derived)**.
- Manual case = ours, "jump and grab an overhead beam"; example matches the left foot between 0.141 and 0.78 of "Jump Up":
  `animator.MatchTarget(jumpTarget.position, jumpTarget.rotation, AvatarTarget.LeftFoot, new MatchTargetWeightMask(Vector3.one, 1f),
  0.141f, 0.78f);`. The API example returns early `if (animator.isMatchingTarget)` or when the state is past the end time.
- **(derived)** Call it once `GetCurrentAnimatorStateInfo(0)` is the target state and `!IsInTransition(0)` (transitions:
  undocumented). Useful only with a mantle-like clip with root motion; a held pose or bone posing has nothing to match.

## IK: OnAnimatorIK needs an IK Pass we cannot set
TAG: anim.ik
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/MonoBehaviour.OnAnimatorIK.html · .../Animator.SetIKPosition.html · .../Animator.SetIKPositionWeight.html · .../Animator.SetBoneLocalRotation.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/InverseKinematics.html · https://docs.unity3d.com/2020.3/Documentation/Manual/ExecutionOrder.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Animations.AnimatorControllerLayer.html
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/UnityCsReference/2020.3/Modules/Animation/ScriptBindings/Animator.bindings.cs (L1095-1099)

- "OnAnimatorIK() is called by the Animator Component immediately before it updates its internal IK system." Execution order: "This
  is called once for each Animator Controller layer with IK pass enabled. This event executes only if you are using a Humanoid rig."
- Manual set-up: "click the cog settings icon of the Layer and enable the IK Pass checkbox". The flag is `AnimatorControllerLayer.
  iKPass`, a class in **`UnityEditor.Animations`**, absent from a player build. **(derived)** A mod cannot turn the IK pass on; this
  settles the [recon] "unverified" note. IK works only if the game's controller already has an IK-pass layer.
- `SetIKPosition(AvatarIKGoal, Vector3)` "in world space"; weight "(0 = at the original animation before IK, 1 = at the goal)"; "This
  function should always be called in MonoBehaviour.OnAnimatorIK." `SetBoneLocalRotation`: "Sets local rotation of a human bone during
  a IK pass." Outside the pass the wrapper warns "... should only be done in OnAnimatorIK or OnStateIK" (if `logWarnings`).
- **(derived)** Probe once: a component with `OnAnimatorIK(int layer)` on `Player/ModelSelector` that logs the first call per layer.
  A log line = hand goals usable; silence = bone posing (`anim.fallbacks`).

## Disabling the Animator without losing its state
TAG: anim.disable-keep-state
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Animator-keepAnimatorControllerStateOnDisable.html · .../Animator-keepAnimatorStateOnDisable.html · .../Animator-writeDefaultValuesOnDisable.html
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/UnityCsReference/2020.3/Modules/Animation/ScriptBindings/Animator.bindings.cs (L1226-1241)

- `keepAnimatorControllerStateOnDisable`: "Set to true to keep the current state of the Animator controller. Set to false to clear
  the current state ... The default value is false." 2020.3 source marks it `[Obsolete("... use keepAnimatorStateOnDisable instead.
  (UnityUpgradable)", false)]` and forwards to `keepAnimatorStateOnDisable`; both names are in the game's DLL.
- `keepAnimatorStateOnDisable` = true "also keeps animated values when a GameObject is disabled". `writeDefaultValuesOnDisable` true
  resets "the playable graph to its default values when the Animator is disabled"; false (default) preserves them.

## Stepping the Animator by hand: Animator.Update
TAG: anim.manual-update
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Animator.Update.html
SOURCE: https://discussions.unity.com/t/prevent-animator-from-auto-updating/633734
SOURCE: https://discussions.unity.com/t/animator-update-has-no-effect/865744
SOURCE: local D:/work/ai_sandbox/KUMM/testcases/reports/2026-10-10_svarog-tails-anim-rate.md · D:/work/ai_sandbox/KUMM/researches/svarogs-dream/main-thread-recon.md (L214-228)

- `public void Update(float deltaTime);` "Evaluates the animator based on deltaTime. Updating the animator with this function might
  not work well with the physics engine or any other system that is normaly evaluated by the Game loop."
- **(secondary)** 2016 thread: `animator.enabled = false;` then `animator.Update(deltaTime);`, or `speed = 1`, `Update`, `speed = 0`;
  "your animators will run single-threaded"; "Calling Animator.Update will run the update for that Animator right away" while "the
  other threads will sit idle". 2021 thread: with a custom PlayableGraph, "Don't disable the Animator"; "Animator.Update does nothing
  while using playables".
- Local: `Play(t)` + `Update(0f)` on the ENABLED hero Animator at `speed = 0` posed the skeleton at once (`clipcurve`). The
  2026-10-10 "animrate" test (enable 1 frame of N) gave no gain.
- **(derived)** For climbing, manual stepping is a sampling tool (capture poses at load), not a per-frame driver.

## AnimatorOverrideController: runtime clip swap
TAG: anim.override-controller
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AnimatorOverrideController.html · .../AnimatorOverrideController-ctor.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AnimatorOverrideController.ApplyOverrides.html · .../AnimatorOverrideController.GetOverrides.html · .../AnimatorOverrideController.Index_operator.html

- It can "override Animation Clips from a controller". "Swapping Animator.runtimeAnimatorController with an AnimatorOverrideController
  based on the same AnimatorController at runtime doesn't reset state machine's current state."
- `new AnimatorOverrideController(animator.runtimeAnimatorController)`: nesting is unsupported, but "this constructor will find the
  right controller for you".
- `aoc["shot"] = clip;`: "each call will trigger a reallocation of the animator's clip bindings". `ApplyOverrides(IList<KeyValuePair<
  AnimationClip,AnimationClip>>)` "will notify the Animator to update all the internal bindings after processing the whole list";
  `GetOverrides` "is allocation-free if you pre-allocate the overrides list with ... overridesCount".
- Cannot **(derived from "override Animation Clips")**: add states, transitions, parameters, layers or IK Pass. A new clip plays only
  where the state machine already goes: replace the clip of a state we can `Play` and the game does not use off-mesh (a rare emote),
  swap back on return. One binding reallocation per swap: on mode change only.

## Culling and update mode
TAG: anim.culling
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AnimatorCullingMode.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AnimatorUpdateMode.html

`AlwaysAnimate`: "Object is animated even when offscreen." `CullUpdateTransforms`: "Retarget, IK and write of Transforms are disabled
when renderers are not visible." `CullCompletely`: "Animation is completely disabled when renderers are not visible." Update modes:
`Normal`, `AnimatePhysics` ("during the physic loop"), `UnscaledTime`. **(derived)** The hero is on screen, so culling does not bite;
if his renderers are ever hidden, a culled Animator stops writing bones and LateUpdate posing sits on a stale pose.

## Frame order: why LateUpdate posing wins
TAG: anim.execution-order
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/ExecutionOrder.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/AnimationScripting.html
SOURCE: https://discussions.unity.com/t/override-mecanim-animation-with-manual-bone-rotation/67170 (search summary only)
SOURCE: https://docs.unity3d.com/6000.0/Documentation/ScriptReference/DefaultExecutionOrder.html (2020.3 page is 404; the type is in the game's `UnityEngine.CoreModule.dll`)

- "LateUpdate is called once per frame, after Update has finished." Animation loop markers: "State Machine Update", "ProcessGraph:
  Evaluates all animation graphs. This includes sampling all animation clips ... and computing Root Motion.", "ProcessAnimation: Blends
  the results of the animation graph.", `OnAnimatorMove`, `OnAnimatorIK`, "WriteTransforms: Writes all animated transforms to the
  scene from a worker thread." "A Humanoid rig with multiple layers that have IK pass enabled can have multiple WriteTransforms passes".
- The loop's place between Update and LateUpdate is in the flowchart image; in words it is on the Legacy page: "the animation system
  updates Transforms after the Update() function and before the LateUpdate() function. Thus if you want to do a LookAt() function you
  should do that in LateUpdate() to make sure that you are really overriding the animation."
- **(derived)** `updateMode = Normal`: Update (game + mod) → Animator writes bones → LateUpdate (our pose) → render. The Animator
  rewrites every animated bone next frame, so SET absolute `localRotation` every frame in LateUpdate; incremental `Rotate()` compounds.
  **(snippet)** forum advice says the same. `DefaultExecutionOrder`: "Scripts are executed in order from lowest first to highest
  last"; with equal order "the order of execution between them is not deterministic". Give the posing component
  `[DefaultExecutionOrder(10000)]` so the game's LookAt/camera LateUpdates run before it.

## HumanPoseHandler: muscle-space pose read and write
TAG: anim.humanposehandler
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/HumanPoseHandler.html · .../HumanPoseHandler-ctor.html · .../HumanPoseHandler.GetHumanPose.html · .../HumanPoseHandler.SetHumanPose.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/HumanPose-muscles.html · .../HumanTrait.MuscleName.html

- `new HumanPoseHandler(Avatar avatar, Transform root)`: "The avatar must be a humanoid"; `root` is "The top most parent of the
  skeleton hierarchy defined in the humanoid `avatar`. This must match the `avatar` definition."
- `GetHumanPose(ref HumanPose)` "Computes a human pose from the avatar skeleton"; `bodyPosition` is the "approximate center of mass",
  "normalized: the position is divided by `avatar` human scale". `SetHumanPose(ref HumanPose)`: "the human pose is applied to the
  transform hierarchy"; there `bodyPosition` "is relative to the humanoid root transform and it is normalized".
- `HumanPose.muscles`: "A muscle value moves a bone for one axis in the range [min,max] define in Humanoid Rig"; names in
  `HumanTrait.MuscleName`.
- **(derived)** In LateUpdate: `GetHumanPose` first, change limb muscles only, write body position/rotation back unchanged (no
  sliding). Reuse one `HumanPose` (its `muscles` array): no allocations. Root = `Player/ModelSelector`, to confirm in game.

## Finding clips and states at runtime
TAG: anim.find-clips
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/RuntimeAnimatorController-animationClips.html · .../Resources.FindObjectsOfTypeAll.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Animator.GetCurrentAnimatorClipInfo.html · .../AnimationClip-humanMotion.html · .../AnimationClip.SampleAnimation.html

- `runtimeAnimatorController.animationClips`: "Retrieves all AnimationClip used by the controller." Clip names only; state names are
  not exposed at runtime, test them with `HasState`.
- `Resources.FindObjectsOfTypeAll<AnimationClip>()` "can return any type of Unity object that is loaded" and "will also list disabled
  objects": every clip in memory, NPC controllers included. `AnimationClip.humanMotion`: "Returns true if the animation contains curve
  that drives a humanoid rig" (retargets onto our hero).
- `GetCurrentAnimatorClipInfo(layer)`: clips of the current state. `layerCount`, `GetLayerName(i)`, `SetLayerWeight(i, w)` list and
  weight the controller's layers.
- `AnimationClip.SampleAnimation(GameObject go, float time)`: "Any component properties that are animated in the clip will be replaced
  with the sampled value"; "It is recommended to use the Animation interface instead for performance reasons." Humanoid clips through
  it: untested **(derived risk)**.

## Playables: a foreign clip on the game's Animator
TAG: anim.playables
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Playables.AnimationPlayableUtilities.PlayClip.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/Playables-Examples.html

- `public static AnimationClipPlayable PlayClip(Animator animator, AnimationClip clip, out PlayableGraph graph);` "Creates a
  PlayableGraph to be played on the given Animator."
- Manual example "Blending an AnimationClip and AnimatorController": an `AnimationMixerPlayable` takes an `AnimationClipPlayable` and an
  `AnimatorControllerPlayable` that "wraps the RuntimeAnimatorController"; weights via `SetInputWeight()`.
- **(derived risk)** An `AnimatorControllerPlayable` is a second controller instance; the game's `animator.SetFloat/SetTrigger` would
  not reach it. Use a graph only for the off-mesh window, `graph.Destroy()` on return. Unverified here.

## Three fallbacks for a climbing look without a climbing clip
TAG: anim.fallbacks
SOURCE: derived from anim.local.hero-animator, anim.play, anim.speed, anim.execution-order, anim.humanposehandler, anim.ik

| # | Method | Per-frame main-thread cost | Risk | Looks like |
|---|---|---|---|---|
| A | **Held pose**: `CrossFadeInFixedTime(hash, 0.15f, 0, t)`, then `speed = 0`; restore speed and state on exit | ~0: one `GetCurrentAnimatorStateInfo` to re-assert the state | `speed` freezes ALL layers; a game transition (Any State on a parameter the game sets) may still leave the state → re-`Play` when `shortNameHash` differs; agent velocity must be 0 or locomotion parameters drive a run | a statue on the wall: "hanging", no climbing motion |
| B | **Bone posing in LateUpdate** on top of A: absolute `localRotation` for 8–12 bones (`GetBoneTransform`: shoulders, arms, hands, legs, spine) from two key poses lerped by a climb phase that advances with movement (left hand up ↔ right hand up) | 10–20 transform writes + a few `Slerp`: microseconds | key rotations depend on this rig: capture them in game, do not guess; a later LateUpdate (game LookAt, camera) can override unless the order is set; re-apply every frame | a cheap climb cycle; hands can aim at ray hits with a hand-rolled two-bone IK |
| C | **HumanPoseHandler**: capture muscle arrays once at load (`Play(t)` + `Update(0)` + `GetHumanPose`, the `clipcurve` technique) from frames of existing clips; each LateUpdate `GetHumanPose` → lerp limb muscles between two snapshots → `SetHumanPose` | two full-skeleton solves per frame (unmeasured; measure before shipping) | writes the whole skeleton incl. body position: keep the read body values; muscle limits clamp poses; capture costs one synchronous evaluation per snapshot | rig-independent poses, smooth blends between any two captured frames |

- **(derived)** Try A first (proven by `Jump.cs`), B when the owner wants motion on the wall, C if B's rig-specific rotations look
  wrong. IK goals only if the `OnAnimatorIK` probe (`anim.ik`) fires.
- **(derived)** First scan `Resources.FindObjectsOfTypeAll<AnimationClip>()` for `climb|hang|ledge|ladder|wall` with
  `humanMotion == true`; a hit turns A–C into `anim.override-controller` or `anim.playables`.
- Mantle look: A with the take-off pose of `Anim_BowJumpShot_Fwd` during the raise, then its landing part (`LandFrom`) on the ledge;
  body motion is scripted (`climb.ledge.mantle-motion`).

## Not fetched / gaps
TAG: anim.gaps
SOURCE: this file

- `MatchTarget` during a transition and on a generic rig: neither the 2020.3 nor the 6000.0 page states the behaviour.
- The execution-order flowchart image was not read; the Update → animation → LateUpdate placement is quoted from the Legacy
  "Animation Scripting" page and applied to Mecanim as **(derived)**.
- `Animator.Update` on a DISABLED Animator in 2020.3: forum only (2016, 2021); the 5.x issue-tracker entry "Animator.Update broken when
  Animator.enabled toggled" was not opened (redirect not followed).
- Not read in game: the hero's `applyRootMotion`, `cullingMode`, `updateMode`, layer list, IK-pass layers; whether the live
  `runtimeAnimatorController` is already an override controller.
- `HumanPoseHandler` and `SampleAnimation` costs: no official numbers. Animation Rigging and animation jobs were not researched.
