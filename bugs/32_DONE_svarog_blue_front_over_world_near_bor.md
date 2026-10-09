# Bug 32 — Svarog's Dream: a blue «front» covers the world when the camera faces Bor and tilts

**Status:** ✅ DONE 2026-10-10 01:52 — `[OWNER]` «бак ушел» · «и постройки были, и баг с синим фронтом ушли» (≈01:48, his own run with the
fix, camera zoomed out to the maximum) · **Severity:** S2 (a wall of sky over the world in plain view; the owner hit it while playing)
**Version/build:** Svarog's Dream (Unity 2020.3, BepInEx), KrinikCameraRework + KrinikColorRework of 2026-10-10 (sky v4, haze,
weather veil, MinPitch 10°) · **When/context:** 2026-10-10 ≈01:37, the owner in the game during the third autonomous hour

## Symptom

`[OWNER]` «там. где я стою - направь камеру на деревню Бор и наклоняй камеру вверх вниз - есть баг, синий какой-то фронт мир
перпекрываеет» · «нучно чинить баг с синим фронтом, который Бор перекрывает» · «для начала репро делай» · 2026-10-10 ≈01:37–01:39.
Expected: the world (Bor, the terrain, the forest) stays visible at every pitch from 10° to 90°; the distance fades into haze,
never into a sharp blue wall.

## Repro (to run)

The owner's save at the place he stood (the game was closed by him via the menu at ≈01:36 — his save is the starting point,
NOT to be replaced by the backup). Camera at Bor (on the map Bor is north-north-west of the hero: map offset −431, +839 →
yaw ≈ −27°), pitch series 10°, 15°, 20°, 30°, 45°, 60° (`TestFaceSun` has no «face a point» form yet — a pult command to face a
world point or a yaw sweep). Cases: `testcases/TC_svarog_sky_v3_2026-10-09.md` C45.

## Hypotheses (ranked, not yet observed)

1. **Far clip fitted to a flat ground.** `KrinikCameraRework/Plugin.cs` `FitFarClip`: far clip = height / sin(top-of-frame angle)
   × 1.15, assuming the ground is flat at the hero's height. Bor in a valley BELOW the hero → the top ray reaches the ground
   farther than that → the world past the far clip is cut and the sky (blue) shows in its place; tilting moves the clip →
   a «front» that walks over the world. Check: the front's distance follows the pitch; `cfg` far clip forced to 1500 → gone.
2. **Sky veil / horizon drop** (`_HorizonVeil`, `_HorizonDrop` in `KrinikSkyGradient.shader`): the sky below the horizon line
   painted in fog colour over a terrain that sits lower than the dropped line. Check: the front is a sky pixel (depth = far).
3. **Haze (EXP2 fog) too dense** at night/weather — a blue fog wall, not a sharp cut. Check: `HazeDensity` → 0.

More from the owner during the repro: «почему-то строения Бора не рисуются после загрузки, а он рядом» · «там сарай разрушенный» ·
«я камеру отдалял сильно на воспроизведении, ты не отдалял» · «поэтому ты мог не видеть» · «я отдалял максимально, наводил в сторону
бора, и менял угол наклона - появлялся синий фронт, а зданий бора не было видно, только круг на текстуре земли от него» · ≈01:47–01:50.

## Log

- 01:40 the game process is gone (log ends 01:36 on the pause menu, the owner left via the menu) → his save copied to
  `_backups/svarog-saves-2026-10-10_0136-owner` (sha256 beside it), relaunch with it.
- 01:43 the pult had no «face a point» → `KrinikCameraRework.Plugin.TestFaceNamed <pitch> <name>` (camera at an object by name,
  inactive ones too; answers distance, height difference, far clip).
- 01:44–01:45 **repro (C45, fail):** `TestFaceNamed <p> BorFastTravel` → Bor 221 horizontally and **36 below the hero**; far clip
  1500/1500/301/200/200/200 at 10/15/20/25/35/50°. At 20°, 25°, 35° the slope behind Bor ends in a straight edge with sky above it,
  and at 20° Bor's palisade and roofs are missing (only the ruined barn) — `bor20` vs `fix20`. Hypothesis 1 confirmed: the far clip is
  fitted to a flat ground at the hero's height; the ground beyond is lower, so the top of the frame reaches farther than computed.
- 01:46 **fix** (`KrinikCameraRework/Plugin.cs` `FitFarClip` + `TopRayGroundDistance`): five rays along the top edge of the frame
  march over the terrain heights (`Terrain.SampleHeight` of the tile under the point, 4 m step growing 4 % with distance, ≈100 probes
  per ray); the far clip is the farthest ground entry × 1.15 (never below the old flat estimate, never above 1500). A ray that finds
  no ground before 1500 → 1500.
- 01:47 **check (C47, pass):** same save, far clip 1500/1500/1500/510/295/307 at 10/15/20/25/35/50°; no straight edge on any pitch;
  Bor's palisade and roofs present at 15–35° (`fix_sheet`). The owner, in the same run at max zoom-out: «и постройки были, и баг с
  синим фронтом ушли».
- 01:51 **check at max zoom-out (C49, pass):** owner's 01:48 save (copy `_backups/svarog-saves-2026-10-10_0148-owner`),
  `callon Camera CameraFollow SetMaxZoom`; far 1500/1500/1500/699/420/307/283 at 10/15/20/25/35/50/55°; Bor visible at 20–35°, no
  front (`zm_sheet`). Frame at 55° max zoom: median 13.3 ms, 72 FPS, 720p (`perf 8`; no A/B against the old code).
- Not proven: why Bor's buildings were missing at 20° while the old far clip (301) was beyond Bor (221). The owner's «only a circle on
  the ground texture» fits the clip cutting buildings measured from a camera 240 units behind the hero. After the fix Bor is there
  from the first frame (C48).
