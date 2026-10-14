Adds 23 translations of the Configuration Manager window for XUnity.AutoTranslator, following the contributing section of the README:
each is a copy of the `ru` folder with the same 23 lines (same keys, same order, the "Plugins with no options available" regex line
included). Plugin names, setting names and descriptions are not translated, as in `ru`.

| Folder | Language |
|---|---|
| `zh-CN` | Chinese (Simplified) |
| `zh-TW` | Chinese (Traditional, Taiwan) |
| `es` | Spanish |
| `fr` | French |
| `pt` | Portuguese |
| `id` | Indonesian |
| `de` | German |
| `ja` | Japanese |
| `tr` | Turkish |
| `vi` | Vietnamese |
| `tl` | Filipino (Tagalog) |
| `ko` | Korean |
| `it` | Italian |
| `sw` | Swahili |
| `pl` | Polish |
| `uk` | Ukrainian |
| `be` | Belarusian |
| `lt` | Lithuanian |
| `lv` | Latvian |
| `et` | Estonian |
| `ms` | Malay |
| `nl` | Dutch |
| `ro` | Romanian |

Folder names are XUnity `Language=` codes (the Google-style codes XUnity uses: `zh-CN`, `zh-TW`, `pt`).

How the languages were picked: the most spoken languages (Ethnologue order) whose scripts IMGUI can draw as-is. Hindi, Bengali,
Marathi, Telugu and Tamil are left out because Unity's IMGUI/legacy text does not do the glyph shaping these scripts need, and
right-to-left languages because IMGUI has no RTL layout (#128 handles Arabic with pre-shaped text; I did not want to guess that for
Urdu/Persian). All files are UTF-8, NFC, with no combining diacritics.

How they were checked: every line was back-translated to English with a machine translator and then reviewed line by line for
meaning in this window (e.g. "Clear" clears the search box, "Reset" restores the default), natural UI wording in that language and
consistent terms within each file. Native speakers are very welcome to suggest better wording — each language is one small file.

Testing: not run in a game yet. The files use the same mechanism and the same key set as `ru`, which I tested in #125 (Unity 2020.3 Mono, BepInEx 5.4.23.5, XUnity.AutoTranslator with EnableIMGUI=True). A script checked that every file has exactly the keys of `ru`, in the same order, and that the regex line keeps `$1`.
