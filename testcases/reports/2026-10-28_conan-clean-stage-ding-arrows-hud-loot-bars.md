# Run report — Conan 3.0.1, 2026-10-28 22:20–23:03: clean stage — ding once per draw, arrows in a big beast, HUD XP row, loot F3, spread bars

## 1. Work

The owner's words of the evening after the first report (`2026-10-28_conan-quickloot-width-archery-rollout.md`): S3 «не проверен - почему?»,
«комп твой», the test-environment rule («героя стоят и лупят мечами три раба, а ты в это время звук дзинь слушать мытаешь»), debts «висящие в
воздухе стрелы от больших зверей», HUD XP («двинуть XP и всю эту строку с опытом левее»), «линии разброса у прицела вернулись». Cases —
`testcases/TC_conan_corpse_prompt_left_of_quickloot_2026-10-28.md`: S3, S3b, S4, S5, H3, F3, B2; plan 36 item 42; bug 64 items 33–35.

## 2. Contour

`D:\Games\Conan Exiles 3.0.1`, the agent's own runs under the machine lock (kumm, five takes 22:20–23:03), UE4SS v3.0.1 Beta. Stage by the pult
(HOUSE_RULES §1 «Тестовое окружение»): `exec God`, `K2_DestroyActor` of every `Character` within 60 m, hero moved to sleeping creatures to wake
them, `CustomTimeDilation`, `bCanBeDamaged=false`, `DetachFromControllerPendingDestroy`. Real input `_config/mouse-seq.ps1` after ≥ 10 s of
input idle; audio `SvarogsDream/tools/rec_audio.py` (WASAPI loopback); scratchpad `find_ding.py`, `s3run.sh`, `idle.ps1`.
Builds: `KrinikConanArchery` main.lua — one ding per draw (22:38), bars on every aim (23:00); Hosav pak — XP row `CanvasPanelSlot_17` −260
(22:50) then −250 (22:52).

## 3. Runs

- 2026-10-28 22:20 launch (`launch-bg.ps1`, `enter-world-remote.sh`); 22:22–22:25 S3 on a noisy stage (void); 22:24 S5 first try (void); 22:27 close.
- 22:31:04 launch; 22:32–22:36 stage cleared; 22:32 RMB dropped (owner's typing opened the Journey hub), 22:36 S3b — two dings per hold; 22:37 close.
- 22:38:33 launch with the one-ding fix; 22:39 S4; 22:41 S5; 22:43–22:46 item 42 (crocodile); 22:46 close.
- 22:50:39 launch (Hosav −260), frame; 22:52 close; 22:52:30 launch (−250), frame; 22:53 close.
- 22:54:44 launch; 22:56 F3 (corpse loot taken with real Q); 22:57 close. 23:00:48 launch (bars fix); 23:01–23:02 B2; 23:02 close.
- Every close by `close-game.ps1`: clean, no crash reporter.

## 4. Checks

- `Hygiene:` `check-lua-game-thread.py` 0 before each Lua deploy; `-Verify` 97 present, 0 missing after each deploy.
- `Functional run:` the game walked by real input and read from audio, 4K frames and UE4SS.log — S3b fail (two dings per hold: audio ncc 0,77 at
  4,21 s and 0,65 at 8,08 s); S4 pass (one ding per draw: 4,27 s and 14,71 s); S5 pass (NPC montage 7,05 s, ncc ≤ 0,02, no 3,2 kHz); item 42 —
  3 of 3 body hits attached to `CharacterMesh0` and sunk 15 cm, no hanging arrow seen at 10 and 6 m (look — the owner's eye); H3 pass at −250
  (−260 put «X» on the level diamond); F3 fail (strip stays left: empty loot panel Hidden = 2); B2 pass (no spread bars in 3 aims, no
  «вернулись» line).

## 5. Found

- the ding repeated every 3,9 s of a held draw (fixed, S4);
- the earlier «S3 pass» at 22:23 was measured while enemies hit the hero — void, corrected in the case table (the commit message `3c11641`
  still says «S3 pass»);
- sleeping creatures (beyond ≈150 m) cannot be woken by moving them — the hero goes to them (game map);
- the owner's typing reaches the game window during real input — the Journey hub opened; wait for input idle;
- F3: after «Забрать все» the empty quick-loot panel is Hidden, not Collapsed — the corpse strip stays (bug 64 item 35);
- two killed targets were `BP_HumanoidDialogueNPC_C` («Поборник Внешней тьмы» at 22:56; another at ≈23:05 during the item-34 recon, which
  returned nothing — `LootActionTooltip` not reachable by the pult): `FindAllOf('HumanoidNPCCharacter_C')` returns subclasses; the stage now
  filters by the exact class name (game map).

## 6. Traces

`D:\Temp\claude\q1q2\` — audio `s3.wav`, `s3c.wav`, `s3n.wav`, `s3clean*.wav`, `s4.wav`, `s5.wav`; frames `stage0/1.jpg`, `s5_stage.jpg`,
`a42_*.jpg`, `a42_crop.webp`, `h3_xp.webp`, `h3_diamond.webp`, `h3b_corner.webp`, `f3_full.jpg`, `f3_empty.jpg`, `b2_sheet.webp`; UE4SS.log of
each launch; `D:\Temp\claude\hosav-build3\UIMod_Hosav.before-xp-left.pak` (the pak before the XP move).

## 7. Verdict

partial — S4, S5, H3, B2 pass; item 42 seen without hanging arrows on one beast (the owner's eye and other beasts pending); F3 fail with the cause
found.
