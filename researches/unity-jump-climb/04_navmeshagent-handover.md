# 04 — NavMeshAgent handover: take the hero off the mesh and give it back

> Sources: Unity 2020.3 Scripting API and Manual pages for `UnityEngine.AI` (fetched as text on 2026-10-14), the C#
> reference source `UnityCsReference` branch 2020.3 (`Modules/AI/Components/NavMeshAgent.bindings.cs`,
> `Modules/AI/NavMesh/NavMesh.bindings.cs`, `Modules/AI/Public/NavMeshBuildSettings.bindings.cs`), Unity's sample
> `AgentLinkMover.cs` (NavMeshComponents, master) and Unity Discussions threads (read through WebFetch's summarizer, so
> forum quotes are as that tool returned them). Extra label: **(project)** = observed in our game (task brief).

---

## updatePosition: the coupling switch
TAG: nav.agent.update-position
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent-updatePosition.html
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/UnityCsReference/2020.3/Modules/AI/Components/NavMeshAgent.bindings.cs

"Gets or sets whether the transform position is synchronized with the simulated agent position. The default value is
true." "When false: the simulated position will not be applied to the transform position and vice-versa." "Setting
updatePosition to false can be used to enable explicit control of the transform position via script." **The trap:**
"When enabling the updatePosition (from previously being disabled), the transform will be moved to the simulated
position. This way the agent stays constrained to the navmesh surface." **(source)** plain extern property.

## updateRotation and updateUpAxis
TAG: nav.agent.update-rotation-upaxis
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent-updateRotation.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent-updateUpAxis.html

updateRotation: "Should the agent update the transform orientation?" updateUpAxis: "the agent will always be aligned
to the local up-axis of the NavMesh or link that it is currently on." **(derived)** Off the mesh set
`updateRotation = false` too, or the agent keeps turning the hero toward its steering target.

## nextPosition and Move: on-mesh only
TAG: nav.agent.next-position
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent-nextPosition.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent.Move.html

"Gets or sets the simulation position of the navmesh agent." "When updatePosition is turned back on, the
Transform.position will be immediately move to match nextPosition." "By setting nextPosition you can directly control
where the internal agent position should be. The agent will be moved towards the position, but is constrained by the
navmesh connectivity and boundaries. As such it will be useful only if the positions are continuously updated and
assessed." Doc sample for a transform driven by something else: `agent.updatePosition = !agentIsControlledByOther;` and,
when controlled, `agent.nextPosition = transform.position;` every Update. **(source)** `[NativeProperty("Position")]`.
Move: "Apply relative movement to current position. If the agent has a path it will be adjusted." **(derived)** A
target across a gap or up a cliff does not teleport the agent: it slides along the mesh and stops at the edge.

## Warp: teleport the simulated agent
TAG: nav.agent.warp
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent.Warp.html
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/UnityCsReference/2020.3/Modules/AI/Components/NavMeshAgent.bindings.cs
SOURCE: https://discussions.unity.com/threads/navmesh-agent-internal-position.283709/

`public bool Warp(Vector3 newPosition);` "True if agent is successfully warped, otherwise false." "Warps agent to the
provided position." That is the whole page (2020.3 and current docs); what Warp resets is not documented. **(source)**
the declaration carries the comment `//*undocumented*`. **(project)** Warp drops the current path; click-to-move had to
be restarted with SetDestination. **(secondary)** Jakob_Unity (staff, 2014): "When (re)enabling 'updatePosition' the
transform position goes to the internal agent position", because "we can't guarantee that the simulation position
(constrained) can move to the transform position (unconstrained)."

## velocity and desiredVelocity
TAG: nav.agent.velocity
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent-velocity.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent-desiredVelocity.html

"Reading the variable will return the current velocity of the agent based on the crowd simulation." Setting it "will
override the simulation (including: moving towards destination, collision avoidance, and acceleration control)"; "its
movement is still constrained on the NavMesh." "if releasing the control to the simulation, set the velocity to zero."
"If you set the value, the effect will show up in the next update." desiredVelocity: "The desired velocity of the agent
including any potential contribution from avoidance. (Read Only)". **(derived)** The game's PlayerController feeds
`agent.velocity` to the animator; off the mesh that value describes the ghost, so the mod drives air/climb animation.

## Path state: destination, hasPath, pathPending, isPathStale, remainingDistance
TAG: nav.agent.path-state
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent-destination.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent-hasPath.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent-isPathStale.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent-remainingDistance.html

destination getter: "If the agent has no path or requested path - returns the agents position on the navmesh." "If
the agent is not mapped to the navmesh ... returns a position at infinity." Setter: "If it's not possible to find a
valid nearby navmesh position ... no path is requested." hasPath: "true if the agent has a path calculated to the
desired destination". isPathStale is set on "changes to the areaMask, if any OffMeshLink is enabled or disabled".
remainingDistance: "If the remaining distance is unknown then this will have a value of infinity." **(derived)** Restore
a click target only when `hasPath || pathPending`; otherwise `destination` is the agent's own spot.

## SetDestination and its "not on a NavMesh" error
TAG: nav.agent.set-destination
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent.SetDestination.html
SOURCE: https://discussions.unity.com/t/setdestination-can-only-be-called-on-an-active-agent-that-has-been-placed-on-a-navmesh-77880/77880
SOURCE: https://discussions.unity.com/t/setdestination-can-only-be-called-on-an-active-agent-that-is-on-a-navmesh/725268
SOURCE: https://community.gamedev.tv/t/setdestination-error-after-disabling-nav-mesh-agent/198679

"True if the destination was requested successfully, otherwise false." "the path may not become available until after
a few frames later. While the path is being computed, pathPending will be true." **(secondary)** Error text:
`"SetDestination" can only be called on an active agent that has been placed on a NavMesh.` Reported causes: a disabled
agent, placing by `transform.position` ("Use NavMeshAgent.Warp instead of transform.position"), an agent type other than
the baked one, no bake. Guards used: `agent.isActiveAndEnabled`, `agent.isOnNavMesh`.

## isStopped and ResetPath
TAG: nav.agent.is-stopped-reset-path
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent-isStopped.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent.ResetPath.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent.SetPath.html

isStopped: "If set to True, the NavMesh agent's movement will be stopped along its current path. If set to False after
the NavMesh agent has stopped, it will resume moving along its current path." ResetPath: "the agent will not start
looking for a new path until SetDestination is called." "if the agent is on an OffMeshLink when this function is called,
it will complete the link immediately." SetPath: "If the path cannot be assigned the path will be cleared". **(source)**
`Stop()`/`Resume()` are `[Obsolete("Set isStopped to true instead.")]`. **(derived)** No page says SetDestination or
Warp clears isStopped: set it back to false yourself.

## isOnNavMesh
TAG: nav.agent.is-on-navmesh
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent-isOnNavMesh.html
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/UnityCsReference/2020.3/Modules/AI/Components/NavMeshAgent.bindings.cs

"Is the agent currently bound to the navmesh? (Read Only)" "false if the agent, for some reason, could not bind to the
navmesh." **(source)** the getter is `[NativeName("InCrowdSystem")]`. **(derived)** It reports crowd membership, not
where the transform is: with `updatePosition = false` the ghost stays bound, so it stays true in the air.

## Off-mesh links on the agent
TAG: nav.agent.offmesh-links
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent-isOnOffMeshLink.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent.CompleteOffMeshLink.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.OffMeshLinkData.html

isOnOffMeshLink: "useful when autoTraverseOffMeshLink is false and custom movement is needed when crossing the link."
CompleteOffMeshLink: "The agent will move to the closest valid navmesh position on the other end of the current
OffMeshLink." "When autoTraverseOffMeshLink is disabled an agent will pause at an off-mesh link until this function is
called." currentOffMeshLinkData is "marked as invalid" off a link; fields `startPos`, `endPos`, `valid`, `linkType`.

## Unity sample AgentLinkMover.cs
TAG: nav.sample.agent-link-mover
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/NavMeshComponents/master/Assets/Examples/Scripts/AgentLinkMover.cs

**(source)** `agent.autoTraverseOffMeshLink = false;` then a coroutine loop: `if (agent.isOnOffMeshLink)` run a move
(`NormalSpeed`, `Parabola(agent, 2.0f, 0.5f)`, `Curve(agent, 0.5f)`), then `agent.CompleteOffMeshLink();`. Moves write
`agent.transform.position` with `updatePosition` left true; target `data.endPos + Vector3.up * agent.baseOffset`; arc
`height * 4.0f * (t - t * t)` over `Vector3.Lerp(startPos, endPos, t)`. **(derived)** The transform sits `baseOffset`
above the mesh point. A jump along a baked link keeps the path without Warp; free jumps need the recipe below.

## baseOffset, agentTypeID, avoidance
TAG: nav.agent.base-offset-type-avoidance
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent-baseOffset.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/class-NavMeshAgent.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent-agentTypeID.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent-avoidancePriority.html

baseOffset (manual): "Offset of the collision cylinder in relation to the transform pivot point." agentTypeID:
"Changing this ID will reset the Agent's current path." ObstacleAvoidanceType runs from `NoObstacleAvoidance` "Disable
avoidance." to `HighQualityObstacleAvoidance` "Highest performance impact."; none "will only resolve collision".
Priority: "agents of lower priority are ignored." "Most important = 0. Least important = 99. Default = 50."

## enabled = false / true
TAG: nav.agent.enabled-toggle
SOURCE: https://discussions.unity.com/t/continually-getting-placed-on-a-navmesh-errors-despite-warping-to-known-point-on-mesh/758075
SOURCE: https://community.gamedev.tv/t/setdestination-error-after-disabling-nav-mesh-agent/198679

No fetched Unity page says what a disabled-then-enabled agent does (snap, path loss). **(secondary)** Calls on a
disabled agent raise the "can only be called on an active agent" error; one answer: "try assigning the sample
hit.position to the agent's transform.position" "Then you should be able to re-enable the agent." **(derived)** Keep the
hero's agent enabled: the game's PlayerController calls it on every click, and each call on a disabled agent is an error.

## Manual: Using NavMesh Agent with Other Components
TAG: nav.manual.mixing-components
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/nav-MixingComponents.html

"Turn on kinematic (Is Kinematic) - this is important!" "If both NavMesh Agent and Rigidbody (non-kinematic) are active
at the same time, you have race condition". "Information should always flow in one direction". "Disable
NavMeshAgent.updatePosition and NavMeshAgent.updateRotation to detach the simulation from the game objects locations".
Agent + Obstacle: "Do not mix well!" "Enabling both will make the agent trying to avoid itself".

## Manual: Coupling Animation and Navigation (LocomotionSimpleAgent)
TAG: nav.manual.coupling-animation
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/nav-CouplingAnimationAndNavigation.html

`Start`: `agent.updatePosition = false;`. `Update`: `worldDeltaPosition = agent.nextPosition - transform.position;`,
low-pass `Mathf.Min(1.0f, Time.deltaTime/0.15f)`. `OnAnimatorMove`: `transform.position = agent.nextPosition;`. Drift
limit, agent side: `if (worldDeltaPosition.magnitude > agent.radius) agent.nextPosition = transform.position +
0.9f*worldDeltaPosition;`. Its ClickToMove: `agent.destination = hitInfo.point;` on a click.

## NavMesh.SamplePosition
TAG: nav.navmesh.sample-position
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMesh.SamplePosition.html
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/UnityCsReference/2020.3/Modules/AI/NavMesh/NavMesh.bindings.cs

"The value of `hit.normal` is never computed. It is always (0,0,0)." "The nearest point is found by projecting the input
point onto nearby NavMesh instances along the vertical axis." "If this step does not find a projected point within the
specified distance, then sampling is extended to surrounding NavMesh positions." "This function does not consider
obstructions" (a point on a ceiling may sample the floor above). Cost: "This function may reduce the frame rate if a
large search radius is specified. To avoid frame rate issues, it is recommended that you specify a maxDistance of twice
the agent height." **(source)** only the `NavMeshQueryFilter` overload passes an agent type
(`SamplePositionFilter(..., filter.agentTypeID, filter.areaMask)`); the int-mask overload has none.

## NavMesh.Raycast, FindClosestEdge, CalculatePath
TAG: nav.navmesh.raycast-edge-path
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMesh.Raycast.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMesh.FindClosestEdge.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMesh.CalculatePath.html

Raycast: "True if the ray is terminated before reaching target position." "The source and destination points are first
mapped on the NavMesh" "If the raycast terminates on an outer edge, `hit.mask` is 0". It "can detect all kind of
navigation obstructions, such as holes in the ground". FindClosestEdge: "This can be used to query how much extra space
there is around the agent." CalculatePath: "This function is synchronous." "It is recommended to only perform a few path
finds per frame". "For SetPath to work, the agent must be close to the starting point." **(derived)** FindClosestEdge
`hit.distance` is a cheap on-mesh ledge sensor.

## NavMeshBuildSettings via GetSettingsByID
TAG: nav.navmesh.build-settings
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMesh.GetSettingsByID.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshBuildSettings-agentSlope.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshBuildSettings-agentClimb.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshBuildSettings-agentRadius.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshBuildSettings-agentHeight.html
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/UnityCsReference/2020.3/Modules/AI/Public/NavMeshBuildSettings.bindings.cs

GetSettingsByID: no match gives "agentTypeID set to -1"; "A default entry will always exist for the agentTypeID being
0." agentSlope: "The valid range is 0–60 degrees." "higher than 45 can give artifacts due to the voxelization process".
agentClimb: "The maximum vertical step size an agent can take. Must be less than agent height." agentRadius: "The
resulting NavMesh will be shrunk by this radius". agentHeight: "NavMesh will be removed from areas with a ceiling lower
than this height." **(source)** private `m_LedgeDropHeight; // Not exposed`. **(derived)** Log
`NavMesh.GetSettingsByID(agent.agentTypeID)` at start: that slope and step are walkable already; go physical above them.

## NavMeshQueryFilter and AllAreas
TAG: nav.navmesh.query-filter
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshQueryFilter.html
SOURCE: https://raw.githubusercontent.com/Unity-Technologies/UnityCsReference/2020.3/Modules/AI/NavMesh/NavMesh.bindings.cs

"Specifies which agent type and areas to consider when searching the NavMesh." AllAreas: "Area mask constant that
includes all NavMesh areas." **(source)** `public const int AllAreas = ~0;`; the filter allocates its 32-float `costs`
array only on the first `SetAreaCost`. **(derived)** Build one filter at start: `new NavMeshQueryFilter { agentTypeID =
agent.agentTypeID, areaMask = agent.areaMask }`.

## The mesh height is approximate; auto jump/drop links
TAG: nav.navmesh.height-and-links
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/nav-HeightMesh.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/nav-BuildingOffMeshLinksAutomatically.html

"Since the NavMesh is an approximation of the walkable space, some features are evened out when the NavMesh is being
built. For example, stairs may appear as a slope in the NavMesh." Height Mesh is the bake option for "accurate
placement". Auto links: "Drop-Down links are created to drop down from a platform." "Jump-Across links are created to
jump across a crevice." Drop: vertical travel "more than bake settings' Step Height ... and less than Drop Height".
**(derived)** At hand-back the hero snaps to the mesh height, not the collider height: log that delta before calling it
a bug. If the game baked drop/jump links, click paths cross ledges via `isOnOffMeshLink` and can use AgentLinkMover.

## Pitfall: snap-back when updatePosition is turned on again
TAG: nav.pitfall.updateposition-snapback
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent-updatePosition.html
SOURCE: https://discussions.unity.com/threads/navmesh-agent-internal-position.283709/

Symptom: at landing the hero pops back to the take-off spot. Cause: "the transform will be moved to the simulated
position", and the simulated agent stayed behind or kept walking its path. **(secondary)** Carpe-Denius: "with
'updatePosition' set to false, the agent still had a desired velocity, but didn't move." Fix **(derived)**: Warp to the
landing point first, then turn updatePosition on in the same frame.

## Pitfall: Warp or binding fails far from the mesh
TAG: nav.pitfall.warp-off-mesh
SOURCE: https://discussions.unity.com/t/setdestination-can-only-be-called-on-an-active-agent-that-is-on-a-navmesh/725268
SOURCE: https://bugnet.io/blog/fix-unity-navmesh-agent-warp-fails-off-mesh

**(secondary)** Related error in threads: "Failed to create agent because it is not close enough to the NavMesh". Blog
(cites no sources): Warp "returns false and the agent has no valid location" for a point "slightly above the floor or just
past the navmesh edge"; sample radius "1–3 units". No official distance limit was found. **(derived)** Never Warp to a
raw physics point: SamplePosition, Warp to `hit.position`, check the bool, retry next frame on false.

## Pitfall: other agents avoid the ghost
TAG: nav.pitfall.ghost-avoidance
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/nav-InnerWorkings.html

Manual: "Unity is using reciprocal velocity obstacles (RVO) to predict and prevent collisions." "the simulated agent
location is moved and constrained to NavMesh." No fetched page or thread says the rest. **(derived)** Avoidance runs on
simulated agents; with `updatePosition = false` the hero's agent stays at take-off, so NPCs steer around that empty spot
and ignore the airborne body. Short jumps: ignore it. Long climbs: `avoidancePriority = 99` for the duration (restore
after), or keep feeding `nextPosition` toward the hero's ground projection.

## Recipe: take the hero off the mesh and hand it back
TAG: nav.recipe.handover
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent-updatePosition.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent-destination.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMesh.SamplePosition.html

**(derived)** from the sections above; log every bool. Take-off (one frame):
1. Guard `agent.isActiveAndEnabled && agent.isOnNavMesh`, else no jump. Save `wasStopped = agent.isStopped`,
   `savedPrio = agent.avoidancePriority`.
2. `agent.isStopped = true; agent.velocity = Vector3.zero;` so the ghost holds still if the game calls SetDestination
   on a mid-air click (isStopped: "movement will be stopped along its current path").
3. `agent.updatePosition = false; agent.updateRotation = false;` (long climb: `agent.avoidancePriority = 99;`).
Air / climb (each frame): move `transform` yourself; no Warp, no Move. Landing (first frame with ground underfoot):
4. `feet = transform.position - Vector3.up * agent.baseOffset;` `found = NavMesh.SamplePosition(feet, out hit,
   2f * agent.height, filter);` false: stay in Fall, sample again next frame (one sample per frame).
5. Read the click target now (a mid-air click counts): `hadPath = agent.hasPath || agent.pathPending;`
   `dest = agent.destination; before = transform.position;`
6. `ok = agent.Warp(hit.position);` false: log, keep Fall, retry next frame.
7. `agent.updatePosition = true; agent.updateRotation = true;` (the transform moves to the simulated position); log the
   snap `(transform.position - before).magnitude`.
8. `agent.velocity = Vector3.zero; agent.avoidancePriority = savedPrio; agent.isStopped = wasStopped;`
9. `if (hadPath) restarted = agent.SetDestination(dest);` The path arrives after `pathPending` clears; later
   `hadPath && !agent.pathPending && !agent.hasPath` means the target was unreachable: log once.
Check in game (undocumented): does Warp move the transform while `updatePosition` is false; does the game's click
handler write `isStopped = false` (read its code); the landing snap height.

## Not fetched / gaps
TAG: nav.gaps
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/AI.NavMeshAgent.Warp.html

- What Warp resets (path, velocity, isStopped, link state) is undocumented; "drops the path" is our own observation.
- Enable/disable behaviour (snap on enable, path kept or lost) has no official page; threads read did not state it.
- "Other agents avoid the ghost" has no source; it is derived from the RVO description.
- Issue tracker slugs "navmeshagent-updates-position-even-when-updateposition-is-false" and
  "navmeshagent-error-when-warping-disabled-navmeshagent": "This page doesn't exist". uMod thread: HTTP 403.
- No official maximum distance for Warp or binding ("1–3 units" is an unsourced blog figure); GetSettingsByID in a
  player build is assumed to return the baked values: verify by logging at start.
