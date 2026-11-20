# GitHub issues of the Conan build

> The public tracker `MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack` holds every bug of the build (HOUSE_RULES 44). This table maps each issue to
> its local working notes; an issue with «—» has no local document yet (it gets one when its work starts). Filed 2026-11-20.

| Issue | Title | Local document |
|---|---|---|
| [#2](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/2) | Archery: the bow in the hands vanishes during an animation and abruptly reappears | — |
| [#3](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/3) | Dialogues: the world pauses during NPC dialogues (check whether this is intended and whether it breaks dialogues) | `testcases/TC_conan_hub_game_pages_map_journey_2026-11-20.md` D0–D3, report `testcases/reports/2026-11-20_conan-dialogue-world-pace.md` — fixed (pack `29a612b`), my reply-option retest (D2) owed |
| [#4](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/4) | First-person view: the bow slung on the back is visible in front of the camera | — |
| [#5](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/5) | Archery: the bow model in the hands is invisible after the knife is used | — |
| [#6](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/6) | Combat: enemies deal no damage to the hero | `testcases/TC_conan_immortal_heroine_2026-11-20.md`, report `testcases/reports/2026-11-20_conan-immortal-heroine-save.md` — cause: the save keeps my god mode; guard at entry (pack `29a612b`); retest open |
| [#7](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/7) | Quick loot: the selection rim stands on the first item as soon as the window appears | — |
| [#8](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/8) | Archery: drawing the bow from a crouch makes the hero stand up | — |
| [#9](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/9) | Archery: after a draw from a crouch every standing draw lifts the hero slightly off the ground | — |
| [#10](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/10) | Name plate: a character's name shows replacement diamonds and katakana instead of letters | `bugs/111_conan_name_plate_mojibake.md` |
| [#11](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/11) | UI: the «Start adventure» button (Space) does nothing | `bugs/112_conan_start_adventure_button_dead.md` |
| [#12](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/12) | Map: the first marker lands away from the click, a second marker is not placed, the marker reset does nothing | `bugs/113_conan_map_markers_offset_reset_dead.md` |
| [#13](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/13) | Shadows: the hero's shadow has no head | `bugs/114_conan_hero_shadow_without_head.md` |
| [#14](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/14) | Character creation: the «Confirm» label runs over its «Enter» key badge on the name plate | — |
| [#15](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/15) | Launcher: the install progress counts 72 of 74 mods while the installer reports 74/74 installed | — |
| [#16](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/16) | Uninstaller: ConanSandbox/Saved/ExtractedMods with 12.8 GB of the build's extracted mod paks stays in the game folder | — |
| [#17](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/17) | Nexus Mods page: the author's e-mail shows as raw BBCode [email=…]…[/email] instead of a link | — |
| [#18](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/18) | Mod UI: overlaps, untranslated text and late elements (open items) | `bugs/64_conan_mod_ui_wave_overlaps_untranslated.md` |
| [#19](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/19) | Pickup prompt: the «E Take» plate does not show over nest eggs that E picks up | `bugs/74_conan_pickup_prompt_missing_on_nest_eggs.md` |
| [#20](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/20) | Quick loot: the selection rim jumps to the last cell for a moment when an item is taken with F | `bugs/75_conan_quick_loot_selection_jumps_on_f_take.md` |
| [#21](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/21) | Hub pause: the in-game loading screen is taken for an open menu and the world freezes | `bugs/79_conan_pause_freezes_on_ingame_loading_screen.md` |
| [#22](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/22) | Interaction prompts: the NPC talk prompt stays centred, full size and on a dense backing, unlike the corpse strip | `bugs/83_conan_interaction_prompts_not_like_corpse_strip.md` |
| [#23](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/23) | Hub: the full-screen map sticks without the hub tabs and does not close | `bugs/84_conan_trait_choice_dialog_under_attribute_tree.md` |
| [#24](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/24) | Crash: the game rarely crashes in UE4SS after a bow kill | `bugs/85_conan_crash_keybind_lua_races_game_thread.md` |
| [#25](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/25) | Combat: beasts walk into the hero's body to attack | `bugs/87_conan_beasts_walk_into_the_hero_to_attack.md` |
| [#26](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/26) | Status effects: the heavy corruption debuff line mixes two font sizes and wraps | `bugs/88_conan_corruption_debuff_line_mixed_fonts.md` |
| [#27](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/27) | Graphics: distant water reflections flicker | `bugs/89_conan_water_reflection_flicker.md` |
| [#28](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/28) | Camera: the third-person camera goes inside creature bodies | `bugs/90_conan_camera_enters_creature_models.md` |
| [#29](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/29) | Attributes: the «Corrupted Attributes» hover caption has no plate and overlaps the perk column | `bugs/91_conan_corruption_button_hover_tooltip.md` |
| [#30](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/30) | Bow sprint: the draw drops by itself in a sprint, the camera jerks, a sprint jump zooms in | `bugs/93_conan_bow_sprint_breaks_when_drawing_during_sprint.md` |
| [#31](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/31) | Crafting: items started in the hub finish instantly when the hub closes | `bugs/94_conan_hub_craft_speedup_finishes_instantly_after_close.md` |
| [#32](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/32) | Gathering: no «E Take» prompt over a bush that was gathered once | `bugs/96_conan_no_take_prompt_over_bush.md` |
| [#33](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/33) | Hub: the «Journey» page keeps showing journeys locked after they open | `bugs/97_conan_journeys_locked_after_tutorial.md` |
| [#34](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/34) | First person: the hero's body, arms and bow cast no shadow | `bugs/98_conan_first_person_no_body_shadow.md` |
| [#35](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/35) | Hub: after the Esc menu the hub can open with the Esc menu's time slowdown | `bugs/100_conan_hub_taken_for_esc_menu_after_esc_cycle.md` |
| [#36](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/36) | Hub: switching to and from the «Equipment» tab shows intermediate frames | `bugs/101_conan_hub_switch_bare_world_gear_tab.md` |
| [#37](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/37) | Archery: keep the standing draw pose while walking in the bow aim | `bugs/104_conan_bow_aim_right_hand_drifts_when_moving.md` |
| [#38](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/38) | Climbing: a hero who touches a wall in a jump grabs it | `bugs/105_conan_jump_into_wall_does_not_grab.md` |
| [#39](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/39) | Climbing: the jump off a wall and the hang on a wall cost no stamina | `bugs/106_conan_wall_jump_and_hang_cost_no_stamina.md` |
| [#40](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/40) | Archery: after a jump off a wall the bow cannot be drawn in flight | `bugs/107_conan_bow_not_ready_in_flight_after_wall.md` |
| [#41](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/41) | Hub: Esc does not close other mods' settings windows | `bugs/108_conan_esc_does_not_close_mod_windows_over_hub.md` |
| [#42](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/42) | Mod settings: a fast double click in the «Krinik's mods» window counts as one click | `bugs/109_conan_settings_window_double_click_counts_once.md` |
| [#43](https://github.com/MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack/issues/43) | Launcher: buttons and screens respond slowly | `bugs/110_conan_launcher_slow_button_feedback.md` |
