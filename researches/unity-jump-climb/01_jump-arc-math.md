# 01 — Jump arc math: gravity and launch speed from height and time

> How a designer's jump (height h plus time to apex t_h, or plus distance to apex x_h at foot speed v_x) becomes code
> constants: Kyle Pittman's GDC 2016 derivation quoted from his slides, piecewise gravity (fast fall, variable height,
> heavier fall), the integration step and its frame-rate error, coyote time and jump buffering (Celeste source, GMTK
> devlog), air control, fall-speed caps with numbers, the Oblivion and Skyrim jump-height settings in metres, and a
> (derived) table for our MVP (height = 1 + Agility/25 m). Pages fetched 2026-10-14. Quoted code: y up, g negative
> (Celeste: y down). Derived formulas: g is the positive magnitude.

---

## Talk premise and assumptions
TAG: jump.pittman.premise
SOURCE: http://www.mathforgameprogrammers.com/gdc2016/GDC2016_Pittman_Kyle_BuildingABetterJump.pdf
SOURCE: https://gdcvault.com/play/1023148/Math-for-Game-Programmers-Building

- Vault overview (GDC 2016, Kyle Pittman, Minor Key Games): "we show how to construct natural-feeling jump trajectories
  from designer-friendly input like desired height and distance, modeled programmatically using one of a few available
  integration methods. We extend these principles to facilitate irregular or non-parabolic jumps, such as varying jump
  height based on player input or falling rapidly beyond the peak of a jump."
- Slides: "Avoid hardcoding, guessing games" · "Design jump trajectory on paper" · "Derive constants to model jump in
  code". Assumptions: "Model player as a simple projectile" · "Position, velocity integrated on a timestep" ·
  "Acceleration from gravity" · "No air friction / drag". Projectile: `f(t) = ½gt² + v0t + p0` (PDF read as text).

## g and v0 from jump height and time to apex
TAG: jump.pittman.height-time
SOURCE: http://www.mathforgameprogrammers.com/gdc2016/GDC2016_Pittman_Kyle_BuildingABetterJump.pdf
SOURCE: https://raw.githubusercontent.com/ValveSoftware/halflife/master/pm_shared/pm_shared.c (L2592-2604)
SOURCE: https://gmtk.itch.io/platformer-toolkit/devlog/395523/behind-the-code

Slide steps (h = peak height, t_h = duration to peak, p0 = 0; the derivative's prime mark is lost in the PDF text):
```
Solve for v0:  f'(t) = gt + v0 ;  f'(th) = 0 ;  0 = gth + v0 ;  v0 = -gth
Solve for g:   f(th) = h ;  h = ½gth² + (-gth)th + 0 ;  h = -½gth² ;  g = -2h / th²
Review:        v0 = 2h / th        g = -2h / th²
```
- **(derived)** With g > 0: `g = 2h/t_h²`, `v0 = sqrt(2gh)`, `t_h = v0/g`; flat-ground air time `T = 2t_h`, so
  `g = 8h/T²`, `v0 = 4h/T`. Example: h = 2 m, t_h = 0.35 s → g = 32.653 m/s², v0 = 11.429 m/s.
- Half-Life ships `v0 = sqrt(2gh)`: `pmove->velocity[2] = sqrt(2 * 800 * 45.0);` (long jump `sqrt(2 * 800 * 56.0)`):
  gravity 800 units/s², apex 45 units.
- GMTK Platformer Toolkit (Unity): `Vector2 newGravity = new Vector2(0, (-2 * jumpHeight) / (timeToJumpApex *
  timeToJumpApex));` and at the jump `jumpSpeed = Mathf.Sqrt(-2f * Physics2D.gravity.y * body.gravityScale *
  jumpHeight);`.

## g and v0 from height and horizontal distance at foot speed
TAG: jump.pittman.height-distance
SOURCE: http://www.mathforgameprogrammers.com/gdc2016/GDC2016_Pittman_Kyle_BuildingABetterJump.pdf

- Slides: "Design with x-axis as distance in space" · "Introduce lateral (foot) speed" · "Keep horizontal and vertical
  velocity components separate". Verbatim: `th = xh / vx`, then `v0 = 2hvx / xh` and `g = -2hvx² / xh²`.
- **(derived)** Flat jump length = `2·x_h`. With an assumed (not measured) run speed v_x = 6 m/s, h = 2 m and x_h = 2.1 m
  give t_h = 0.35 s and the same g = 32.65 m/s²; the whole jump covers 4.2 m. In 3D, v_x is the horizontal speed at
  takeoff; air control that changes it breaks the x_h guarantee, not the height guarantee.

## Piecewise gravity: fast fall, variable height, heavier fall
TAG: jump.pittman.piecewise-gravity
SOURCE: http://www.mathforgameprogrammers.com/gdc2016/GDC2016_Pittman_Kyle_BuildingABetterJump.pdf
SOURCE: https://gmtk.itch.io/platformer-toolkit/devlog/395523/behind-the-code
SOURCE: https://raw.githubusercontent.com/NoelFB/Celeste/master/Source/Player/Player.cs (L23-28, L2901-2925)

- Slides: "Game world: We can break the rules in interesting ways." · "Break our path into a series of parabolic arcs of
  different shapes." "Breaks": "Maintain continuity in position and velocity" · "Trivial in implementation" · "Choose a
  new gravity to shape our jump". Then "Fast falling", "Variable height jumping", "Double jumping" (plots only).
- GMTK: "when coming down, we can set a downward gravity multiplier for a snappier landing." `if (body.velocity.y < -0.01f)
  { gravMultiplier = downwardMovementMultiplier; }` · `body.gravityScale = (newGravity.y / Physics2D.gravity.y) *
  gravMultiplier;`
- Celeste fast fall raises the speed cap, not gravity: `MaxFall = 160f`, `FastMaxFall = 240f`, `FastMaxAccel = 300f`,
  `if (Input.MoveY == 1 && Speed.Y >= mf) { maxFall = Calc.Approach(maxFall, fmf, FastMaxAccel * Engine.DeltaTime);`
- **(derived)** At a break keep p and v, swap g. From upward speed v_r under g2: extra rise `v_r²/(2·g2)`. From apex H
  under g_down: `t_down = sqrt(2H/g_down)`, landing speed `sqrt(2·g_down·H)`. Minimum hop h_min on an instant release:
  `g_release = v0²/(2·h_min)`; v0 = 11.43 m/s, h_min = 0.5 m → 130.6 m/s² (4 x 32.65).
- **(derived)** H = 2 m, g_up = 32.65 m/s² (t_up 0.35 s), fall multiplier m → t_down / total air time / landing speed:
  m = 1.0 → 0.350 s / 0.700 s / 11.43 m/s; m = 1.5 → 0.286 / 0.636 / 14.00; m = 2.0 → 0.247 / 0.597 / 16.16.

## Variable jump height in shipped code
TAG: jump.variable-height
SOURCE: https://raw.githubusercontent.com/NoelFB/Celeste/master/Source/Player/Player.cs (L24-25, L49-52, L1660-1673, L2952-2967)
SOURCE: https://maddymakesgames.com/articles/celeste_and_forgiveness/index.html
SOURCE: https://gmtk.itch.io/platformer-toolkit/devlog/395523/behind-the-code

- Celeste, sustain while held: `Gravity = 900f`, `JumpSpeed = -105f`, `VarJumpTime = .2f`; `Jump()` sets `varJumpTimer =
  VarJumpTime;` and `varJumpSpeed = Speed.Y;`. Each frame, after gravity: `if (varJumpTimer > 0) { if (AutoJump ||
  Input.Jump.Check) Speed.Y = Math.Min(Speed.Y, varJumpSpeed); else varJumpTimer = 0; }` (y down: the full launch speed
  is kept for up to 0.2 s while held).
- Celeste half-gravity apex: `float mult = (Math.Abs(Speed.Y) < HalfGravThreshold && (Input.Jump.Check || AutoJump)) ?
  .5f : 1f;`, `HalfGravThreshold = 40f`. Maddy Thorson: "If you hold the jump button, the top of your jump has half
  gravity applied. It's subtle, but this gives you more time to adjust for landing, and also just looks/feels pleasant."
- GMTK, cut by gravity while rising (`body.velocity.y > 0.01f`): `if (pressingJump && currentlyJumping) { gravMultiplier
  = 1f; } else { gravMultiplier = jumpCutoff; }`.
- **(derived)** Celeste held jump: 105 px/s x 0.2 s = 21 px, + (105² - 40²)/(2·900) = 5.24 px, + 40²/(2·450) = 1.78 px
  → apex ~28.0 px = 3.5 tiles in ~0.36 s (8 px tile: "2 pixels ... 320x180-resolution game so that's a quarter of a
  tile"). A tap: 105²/(2·900) = 6.1 px = 0.77 tile. Ratio ~4.6x. Frame steps ignored.
- **(snippet)** Double Fine, "Designing Raz's Jump" (page 403): multi-phase gravity; "They allow the first two phases to
  end early (with a minimum duration) if the jump button is released".

## Integration: Euler, velocity Verlet, exact constant-acceleration step
TAG: jump.integration
SOURCE: http://www.mathforgameprogrammers.com/gdc2016/GDC2016_Pittman_Kyle_BuildingABetterJump.pdf
SOURCE: https://raw.githubusercontent.com/ValveSoftware/halflife/master/pm_shared/pm_shared.c (L747-786)
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CharacterController.Move.html

- "Euler": `pos += vel * Δt` / `vel += acc * Δt` — "Easy" · "Unstable" · "We can do better". "Runge-Kutta (RK4)": "Too
  complex for our needs." "Velocity Verlet": `pos += vel*Δt + ½acc*Δt*Δt` / `new_acc = f(pos)` /
  `vel += ½(acc+new_acc)*Δt` / `acc = new_acc`.
- "Assuming constant acceleration": `pos += vel*Δt + ½acc*Δt*Δt` / `vel += acc*Δt` — "Trivially simple change from
  Euler" · "100% accurate as long as our acceleration is constant". "Near-constant acceleration": "The error we
  accumulate when our acceleration does change (versus Velocity Verlet) will be:" `∆acc * ∆t * ∆t` · "Acceptable?"
- Half-Life splits the kick: `PM_AddCorrectGravity` ("// yes, this 0.5 looks wrong, but it's not.") does
  `pmove->velocity[2] -= (ent_gravity * pmove->movevars->gravity * 0.5 * pmove->frametime );` before the move;
  `PM_FixupGravityVelocity` ("// Get the correct velocity for the end of the dt") applies the other half after.
- Unity's `CharacterController.Move` example: `playerVelocity.y += gravityValue * Time.deltaTime;
  controller.Move(playerVelocity * Time.deltaTime);` = **(derived)** semi-implicit Euler.
- **(derived)** Simulated apex, H = 2 m, g = 32.653 m/s², v0 = 11.429 m/s, frame by frame:

| fps | semi-implicit (vel, then pos) | explicit (pos, then vel) | constant-acc step |
|---|---|---|---|
| 30 | 1.814 m (-9.3%) | 2.195 m (+9.8%) | 1.996 m (apex falls between frames) |
| 60 | 1.905 m (-4.8%) | 2.095 m (+4.8%) | 2.000 m |
| 144 | 1.961 m (-2.0%) | 2.040 m (+2.0%) | 2.000 m |

  Semi-implicit Euler lags by `g·Δt·t/2` (0.095 m at the apex at 60 fps). Plain Euler in `Update` makes jump height
  depend on frame rate; the constant-acceleration step does not.

## Unity's CharacterController.Move example uses 3, not 2
TAG: jump.unity-cc-example
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/CharacterController.Move.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/Manual/class-PhysicsManager.html
SOURCE: https://docs.unity3d.com/2020.3/Documentation/ScriptReference/Physics-gravity.html

- "CharacterController.Move does not use gravity." Example: `private float jumpHeight = 1.0f;` `private float
  gravityValue = -9.81f;` `playerVelocity.y += Mathf.Sqrt(jumpHeight * -3.0f * gravityValue);`.
- **(derived)** `sqrt(3gh)` peaks at `1.5h`: the example jumps 1.5 m, not 1.0 m. Use `-2.0f`.
- Physics Manager: "Gravity is defined in world units per seconds squared." `Physics.gravity`: "The gravity applied to
  all rigid bodies in the Scene." **(derived)** It is global: the hero's air mode keeps its own g.

## Coyote time
TAG: jump.coyote-time
SOURCE: https://maddymakesgames.com/articles/celeste_and_forgiveness/index.html
SOURCE: https://raw.githubusercontent.com/NoelFB/Celeste/master/Source/Player/Player.cs (L48, L713-720, L1660-1663, L2970-2975)
SOURCE: https://gmtk.itch.io/platformer-toolkit/devlog/395523/behind-the-code

- Maddy Thorson: "You can still jump for a short time after leaving a ledge." · "All are centered around widening timing
  or positioning windows, so that everything is fudged a tiny bit in the player's favor."
- Celeste: `JumpGraceTime = 0.1f`; `if (onGround) { ... jumpGraceTimer = JumpGraceTime; } else if (jumpGraceTimer > 0)
  jumpGraceTimer -= Engine.DeltaTime;` · `if (Input.Jump.Pressed) { ... if (jumpGraceTimer > 0) { Jump(); }` ·
  `Jump()` sets `jumpGraceTimer = 0;`. **(derived)** 0.1 s = 6 frames at 60 fps.
- GMTK: `if (!currentlyJumping && !onGround) { coyoteTimeCounter += Time.deltaTime; } else { coyoteTimeCounter = 0; }`;
  jump allowed `if (onGround || (coyoteTimeCounter > 0.03f && coyoteTimeCounter < coyoteTime))` (page shows `| |`);
  coyote time is "usually something like 0.2". **(derived)** 0.2 s = 12 frames at 60 fps.
- **(derived)** For us: start the timer when the hero leaves the NavMesh edge without jumping; clear it on jump.

## Jump buffering
TAG: jump.jump-buffer
SOURCE: https://maddymakesgames.com/articles/celeste_and_forgiveness/index.html
SOURCE: https://raw.githubusercontent.com/NoelFB/Celeste/master/Source/Player/Player.cs (L1662)
SOURCE: https://gmtk.itch.io/platformer-toolkit/devlog/395523/behind-the-code

- Maddy: "If you press and hold the jump button a short time before landing, you will jump on the exact frame that you
  land." Celeste `Jump()` starts with `Input.Jump.ConsumeBuffer();`; the buffer length lives in the unpublished input
  class.
- GMTK: "we can press jump a few frames before hitting the ground, and it will still trigger the jump when we land."
  `jumpBufferCounter += Time.deltaTime; if (jumpBufferCounter > jumpBuffer) { desiredJump = false;` (value not stated).
- **(secondary)** Devlog comment on a "super jump" from a buffered jump: "JumpSpeed should calulate base on ground
  gravityScale, not current gravityScale". **(derived)** Compute v0 from the base rise g, never the current fall/cut g.

## Air control
TAG: jump.air-control
SOURCE: https://raw.githubusercontent.com/NoelFB/Celeste/master/Source/Player/Player.cs (L30-33, L50, L1670, L2884-2894)
SOURCE: https://gmtk.itch.io/platformer-toolkit/devlog/395523/behind-the-code
SOURCE: https://cs.uesp.net/wiki/FJumpMoveBase
SOURCE: https://cs.uesp.net/wiki/FJumpMoveMult
SOURCE: https://en.uesp.net/w/index.php?title=Oblivion:Acrobatics&action=raw

- Celeste: `MaxRun = 90f`, `RunAccel = 1000f`, `AirMult = .65f`; `float mult = onGround ? 1 : AirMult;` ·
  `Speed.X = Calc.Approach(Speed.X, max * moveX, RunAccel * mult * Engine.DeltaTime);`; jump adds `Speed.X += JumpHBoost
  * moveX;` (`JumpHBoost = 40f`).
- GMTK: `acceleration = onGround ? maxAcceleration : maxAirAcceleration;` · `velocity.x = Mathf.MoveTowards(velocity.x,
  desiredVelocity.x, maxSpeedChange);`
- Oblivion: fJumpMoveBase (0.0000) "is the base value of how much control you have over moving/controlling the direction
  of your character while in the air"; fJumpMoveMult (0.3000) is "a multiplier or 'weight'" (combining formula not
  documented). UESP: "At high levels, you can actually jump one direction and completely change directions mid-jump."

## Max fall speed / terminal velocity
TAG: jump.terminal-velocity
SOURCE: https://raw.githubusercontent.com/NoelFB/Celeste/master/Source/Player/Player.cs (L23-28, L2927-2957)
SOURCE: https://minecraft.wiki/w/Entity
SOURCE: https://en.wikipedia.org/wiki/Terminal_velocity
SOURCE: https://raw.githubusercontent.com/ValveSoftware/halflife/master/pm_shared/pm_shared.c (L670-700)
SOURCE: https://cs.uesp.net/wiki/FJumpFallVelocityMin

- Celeste: `MaxFall = 160f` px/s (fast fall `240f`), approached by `Speed.Y = Calc.Approach(Speed.Y, max, Gravity * mult
  * Engine.DeltaTime);`. **(derived)** 20 tiles/s, reached after 160/900 = 0.18 s.
- Minecraft players: order "Position, Acceleration, Drag"; gravity "-0.08" m/tick², drag "0.98"; terminal "3.92" m/tick
  = "78.4" m/s; Slow Falling "9.80" m/s.
- Real world: skydiver belly-to-earth "about 55 m/s (180 ft/s)", "15 seconds to reach 99%"; head-down "150 m/s".
- Half-Life: `PM_CheckVelocity` clamps each component to `pmove->movevars->maxvelocity` (engine cvar, value not in SDK).
- Oblivion fJumpFallVelocityMin (600.0000): "This seems to influence how quickly actors fall through the air."
- **(derived)** At g = 32.653 m/s² a cap v_c is reached after `v_c²/(2g)`: 40 m/s after 24.5 m, 55 m/s after 46.3 m.
  A cap under 53.6 m/s changes speed-based fall damage at Agility 100 (`fall.terminal-cap-trap`).

## The Elder Scrolls IV: Oblivion jump height
TAG: jump.oblivion-height
SOURCE: https://cs.uesp.net/wiki/FJumpHeightMin
SOURCE: https://cs.uesp.net/wiki/FJumpHeightMax
SOURCE: https://cs.uesp.net/wiki/Category:Jumping
SOURCE: https://en.uesp.net/w/index.php?title=Oblivion:Acrobatics&action=raw
SOURCE: https://cs.uesp.net/wiki/Oblivion_Units

- fJumpHeightMin (64.0000): "This number sets absolute minimum for any jump the player under any circumstances,
  including the case when Acrobatics skill is 0." fJumpHeightMax (164.0000): "This number sets the height of a jump made
  by a character with an Acrobatics skill of 100." `jump height = fJumpHeightMin + (Acrobatics * (fJumpHeightMax -
  fJumpHeightMin) / 100)`; example `JumpHeight = 64 + (164 - 64) * 10/100 = 74`.
- UESP: `JumpHeight = 64 + AcrobaticsSkill`; "The value of AcrobaticsSkill is not limited to a maximum value of 100";
  "up to a maximum base value of 255".
- Units: "21.3 'units' to a foot, or 7 units to 10 centimeters (or to put it another way 64 units per yard [~70 units per
  metre])"; "any race at height 1.0 will be 128 'units' tall".
- **(derived)** At 64 units/yard, assuming game units and apex rise (the pages state neither): Acrobatics 0 → 64 u =
  0.91 m (0.50 of a 128 u body); 10 → 74 u = 1.06 m; 50 → 114 u = 1.63 m; 100 → 164 u = 2.34 m (1.28 bodies).
  Range x2.56 over 0-100; ours (1 → 5 m) is x5.

## The Elder Scrolls V: Skyrim jump height
TAG: jump.skyrim-height
SOURCE: https://en.uesp.net/w/index.php?title=Skyrim:Damage&action=raw
SOURCE: https://steamcommunity.com/sharedfiles/filedetails/comments/19343
SOURCE: https://ck.uesp.net/wiki/Unit

- UESP has no Skyrim jump-settings page (Skyrim:Jumping, Skyrim:Acrobatics: 404). Skyrim:Damage: "The internal height
  units are 64 per yard."
- **(secondary)** Steam comment, 30 Apr 2012: "(default value) player.setgs fJumpHeightMin 76 / player.setgs
  fJumpFallHeightMin 600 / player.setgs fJumpFallHeightMult 0.1 / player.setgs fJumpFallVelocityMin 700"; "don't set
  the jump height above 500 without also adjusting the fall velocity and multiplier."
- **(snippet)** CK wiki "Unit" (Cloudflare 403): "128 world units is equal to 6 feet"; "wu × 0.046875 = ft".
- **(derived)** 76 units = 1.1875 yd = 1.09 m (3.56 ft). No skill-based Skyrim jump formula was found.

## MVP worked example: tuned 2 m in 0.7 s, then H from Agility
TAG: jump.mvp-table
SOURCE: derived by hand from jump.pittman.height-time (numbers computed in Python)

- **(derived)** Tuning: H = 2 m, T = 0.7 s flat air time, t_h = 0.35 s → `g = 8H/T²` = 32.653 m/s² (3.33 x 9.81),
  `v0 = sqrt(2gH)` = 11.429 m/s. Then at that g:

| Agility | H = 1 + Agility/25 (m) | v0 = sqrt(2gH) (m/s) | t_apex = v0/g (s) | flat air time (s) | frames at 60 fps |
|---|---|---|---|---|---|
| 0 | 1 | 8.081 | 0.247 | 0.495 | 30 |
| 25 | 2 | 11.429 | 0.350 | 0.700 | 42 |
| 50 | 3 | 13.997 | 0.429 | 0.857 | 51 |
| 100 | 5 | 18.070 | 0.553 | 1.107 | 66 |

- **(derived)** v0 and air time grow as sqrt(H): 5x the height = 2.24x the air time. At real g = 9.81 m/s² the 2 m jump
  needs v0 = 6.26 m/s and lasts 1.277 s (floaty); 5 m lasts 2.02 s.
- **(derived)** Sketch (exact step from `jump.integration`; v0 from the base g per `jump.jump-buffer`):
```csharp
const float G = 32.653f;                 // tuned: 2 m apex, 0.7 s flat air time
float h  = 1f + agility / 25f;           // MVP jump height
float v0 = Mathf.Sqrt(2f * G * h);       // launch speed
// each airborne frame, dt = Time.deltaTime, constant g:
pos.y += vel.y * dt - 0.5f * G * dt * dt;
vel.y -= G * dt;
```

## Not fetched / gaps
TAG: jump.gaps
SOURCE: (this file)

- Pittman talk video / transcript: not read (GDC Vault video members-only; no transcript found). The slides' "Fast
  falling" / "Variable height jumping" / "Double jumping" curves are images: the talk's own gravity values are unsourced.
- Celeste jump-buffer length: `Source/Input.cs` is not in the NoelFB/Celeste repo (HTTP 404; only `Player.cs` and
  PICO-8 files). GMTK's downloadable scripts (defaults for coyoteTime, jumpBuffer, jumpCutoff) were not downloaded.
- Not readable: Sonic Physics Guide `info.sonicretro.org/SPG:Jumping` (Anubis proof-of-work wall); Double Fine
  `doublefine.com/news/devin-article-raz-jump` (403, snippet only); JCCC talk recap `blogs.jccc.edu/dpatter/2016/03/15`
  (403); CK wiki `ck.uesp.net/wiki/Unit` (Cloudflare 403, snippet only).
- Skyrim fJumpHeightMin = 76 rests on a Steam comment (secondary); search snippets also show forum claims of 100.
- Oblivion: the pages do not say fJumpHeight* is in game units or is the apex rise. The units page also says
  "multiplying game units by 0.1428767293691635" gives centimetres, but 64 units then give 9.14 (decimetres), which
  contradicts its own 64 units/yard; this file uses 64 units/yard.
- Half-Life `sv_gravity` / `sv_maxvelocity` defaults are engine cvars, not in the SDK; 800 is the literal in the jump
  code. Nothing here was tested in the game; Unity world units are assumed to be metres.
