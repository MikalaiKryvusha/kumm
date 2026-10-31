# Research — launcher design recon for the Krinik Conan build
> **Created:** 2026-10-31 · **Parent:** the owner's word 2026-10-31 18:06 «лаунчер некрасивый … иди в интернет в разведку и 10 макетов с вариантами давай разными» · **Status:** recon done · **Outbound:** 10 mockups to the owner

**Evidence marks.** `[seen]` — read on the cited page this session. `[memory]` — the agent's prior knowledge of how
that launcher/game looks; not re-verified this session (WebFetch returns page text, not screenshots, so the visual
look of most launchers could not be observed directly — verify against real screenshots before quoting to the owner).
`[inferred]` — the agent's own design reasoning.

**Fixed content to place (from the task):** game logo (Conan Exiles Enhanced), pack logo (Krinik Mod Pack, metal
letters), wallpaper (barbarian from behind, desert oasis, castle, sunset — warm orange/gold), four actions
«Установить сборку» · «Играть» · «Отзыв» (opens a 3-step panel + «Собрать отчёт») · «Удалить сборку», a title
line, a status line «Игра: <path>» / «Игра не найдена…», an author block with two links (email, PlayGround PM).
Window ~960x540 logical px, borderless WinForms, DPI up to 300 % (4K TV).

---

## 1. Sources

Launchers and launcher design
- Funcom new game launcher (Conan Exiles) — https://forums.funcom.com/t/new-game-launcher/106084 `[seen]`: launcher
  shows "all the games by funcom with their content pages", a **Continue** button that jumps "to where you left off",
  only "the most recent announcement"; users called it "clean and efficient".
- Funcom launcher "More" gear bottom-right, buttons cut off at some Windows scaling —
  https://steamcommunity.com/app/440900/discussions/0/133256080234121402 `[seen, via search summary]`.
- BUGLE, a third-party Conan launcher — https://forums.funcom.com/t/bugle-butt-ugly-game-launcher-for-exiles/225208 ;
  Conay mod launcher — https://forums.funcom.com/t/conay-conan-exiles-mod-launcher/291616 (titles seen; not opened).
- Nolvus Dashboard (Skyrim modlist installer) docs — https://www.nolvus.net/appendix/installer/introduction `[seen]`
  (text only; the dashboard UI itself is not described on the page).
- LoreRim readme (launch = MO2 → profile dropdown → Run) — https://lorerim.com/read-me.html `[seen, via search]`.
- Fallout London: Overwolf launcher + GOG launcher — https://www.gamingonlinux.com/2025/09/fallout-london-mod-gets-a-huge-upgrade-with-rabbit-pork/page=1/ `[seen, via search]`.
- Battle.net 2021 redesign ("much more expansive layout for news and game content in full-page view", favourites) —
  https://www.invenglobal.com/datalab/articles/13065/battlenet-to-receive-aesthetic-functional-upgrade `[seen]`;
  2014 Battle.net "glass-like blur atop a background image" — https://pcper.com/2014/09/blizzards-new-battle-net-launcher-feels-slick/ `[seen, via search]`.
- Wargaming Game Center redesign, March 2026 — https://worldoftanks.asia/news/general-news/wgc-update-march-2026/ `[seen]`:
  top bar, game switcher, Play button beside a game-client selector + a second dropdown, hero carousel
  "Highlights", dated news cards below.
- Paradox launcher playsets (dropdown under Play) — https://admin-forum.paradoxplaza.com/forum/threads/launcher-feature-highlight-playsets.1500999 `[seen, via search]`.
- ESO new launcher: gamepad navigation, single loading bar, **4K resolution scaling**, news feed with larger text —
  https://forums.elderscrollsonline.com/en-gb/discussion/632782 `[seen, via search]`; a player asks PTS Play be a
  different colour from Live so the wrong one is not launched — https://forums.elderscrollsonline.com/en/discussion/comment/7867671/ `[seen, via search]`.
- RSI Launcher 2.0: "fresh, modernized UI", looping **video background** with an accessibility switch to stop it —
  https://robertsspaceindustries.com/spectrum/community/SC/forum/1/thread/rsi-launcher-2-0-3-release-notes `[seen, via search]`.
- EVE patcher: "an unnecessarily huge button allows you to play the game once it is ready" —
  https://www.engadget.com/2011-11-09-new-eve-online-launcher-will-simplify-patching.html `[seen, via search]`.
- Thrive launcher redesign proposal — https://forum.revolutionarygamesstudio.com/t/proposal-modernizing-the-thrive-launcher-ui-ux/1220 `[seen]`:
  "The PLAY button needs to be larger, distinct, and centrally or prominently placed"; full-bleed game art instead of
  boxed panels; news as image cards; reviewers warn that adding a social bar "will just steal the little breathing room".
- LaunchBox request: separate always-visible Play/Install control; **label reflects state** (Play, Install, Resume,
  Update) — https://feedback.launchbox-app.com/p/separate-playinstall-and-options-buttons-in-game-views `[seen, via search]`.
- Game Launcher (white-label) changelog: play-button variants single / dropdown / double / pill, left-panel links,
  news builder — https://gamelauncher.cloud/help/changelog/2026/april-08-2026 `[seen, via search]`.
- Lust Launcher redesign devlog (side menu, separate social block) — https://wanderergame.itch.io/guardians-and-dungeons/devlog/633391/lust-launcher-designing-a-new-interface-survey `[seen]`.
- FTB App (green install / "View Instance" buttons; editable pack artwork) — https://flathub.org/apps/dev.ftb.ftb-app ,
  https://nodecraft.com/support/games/minecraft/mods/how-to-use-the-ftb-launcher `[seen, via search]`.

Dark-fantasy UI language
- Diablo IV quarterly update Feb 2020 (UI moved to screen centre; painterly icons did not read at small sizes;
  inventory colours balanced against the gritty art) — https://news.blizzard.com/en-us/article/23308274/diablo-iv-quarterly-updatefebruary-2020 ,
  https://www.rpgsite.net/news/9492-diablo-iv-discusses-ui-design-co-op-controller-support-and-cannibals-in-first-quarterly-update `[seen, via search]`.
- Diablo IV art direction "darkness does not mean bleakness", Renaissance/medieval painting references —
  https://www.pcgamesn.com/diablo-4/diablo-2-art-style `[seen, via search]`.
- Interview with Fernando Forero (Diablo IV senior UI artist): letterforms as shapes; look judged by immersion —
  https://interfaceingame.com/articles/interview-with-fernando-forero `[seen]`.
- Elden Ring minimal UI discussions — https://kotaku.com/elden-ring-ui-ux-user-experience-interface-fromsoftware-1848637410 ,
  https://automaton-media.com/en/news/20220307-10300/ `[seen, via search]`; font-pairing advice (Cormorant headlines,
  EB Garamond body) — https://madegooddesigns.com/?p=9052 `[seen, via search; secondary source]`.
- BG3 gold UI piping — players: "the inner gold frame might contrast a bit too much" —
  https://steamcommunity.com/app/1086940/discussions/0/3471730015126690544 `[seen, via search]`.
- Game UI Database (55 000+ menu screenshots, free; best place to pull real references for the mockups) —
  https://www.gameuidatabase.com/ `[seen, via search]`.

Typography (Google Fonts metadata, read directly)
- Cinzel — Natanael Gama — subsets **latin, latin-ext only — no Cyrillic** — https://raw.githubusercontent.com/google/fonts/main/ofl/cinzel/METADATA.pb `[seen]`
- Uncial Antiqua — Astigmatic — **latin only** — https://raw.githubusercontent.com/google/fonts/main/ofl/uncialantiqua/METADATA.pb `[seen]`
- Forum (Denis Masharov) — **cyrillic** — https://raw.githubusercontent.com/google/fonts/main/ofl/forum/METADATA.pb `[seen]`
- Cormorant (Christian Thalmann) — **cyrillic** — https://raw.githubusercontent.com/google/fonts/main/ofl/cormorant/METADATA.pb `[seen]`
- EB Garamond — **cyrillic** — https://raw.githubusercontent.com/google/fonts/main/ofl/ebgaramond/METADATA.pb `[seen]`
- Ruslan Display — **cyrillic** — https://raw.githubusercontent.com/google/fonts/main/ofl/ruslandisplay/METADATA.pb `[seen]`
- Philosopher, Yeseva One (Jovanny Lemonad) — **cyrillic** — .../ofl/philosopher/METADATA.pb , .../ofl/yesevaone/METADATA.pb `[seen]`
- Kurale (Eduardo Tunni) — **cyrillic** — https://raw.githubusercontent.com/google/fonts/main/ofl/kurale/METADATA.pb `[seen]`

Legibility
- NN/g "Ensure High Contrast for Text Over Images" — https://www.nngroup.com/articles/text-over-images/ `[seen]`.
- Scrim gradient values (transparent → 40 % black; transparent to 60 % height then 80 % off-black) —
  https://dev.to/joruch/simple-styling-tricks-and-how-to-css-them-image-overlays-ioh ,
  https://nhbp-nsn.gov/elements/scrims-overlays/ `[seen, via search]`; Material "text protection … scrims are
  lightweight, translucent material layers" (quoted second-hand) — https://b4x.com/android/forum/threads/howto-apply-scrim-to-image-according-to-material-design-principles.67362 `[seen, via search]`.

---

## 2. Archetypes

Each: what it is · real examples · why it works · how our content maps onto it.

**A1. Full-bleed hero art + bottom action bar.** Art fills the window; a dark gradient floor carries one large
Play button (usually bottom-right or bottom-centre) plus secondary controls. Examples: Battle.net game page
`[memory]` (blue Play bottom-left over game art), Riot Client `[memory]`, Epic library page `[memory]`, Thrive
proposal "full, immersive background" `[seen]`. Why it works: the art sells the mood; all decisions sit in one
horizontal band where the eye lands last (bottom), so the art above stays clean. Mapping: logos top-left over a
top vignette; bar = Play (dominant) · Install (secondary) · Feedback / Uninstall (text links); status line just
above the bar; author block small in the bar's far corner.

**A2. Centred vertical button stack (Bethesda pre-game launcher).** Small fixed window: a banner image on top,
a column of equal-width buttons (Play, Data Files, Options, Tech Support, Exit) `[memory; button names seen in
Steam/Nexus troubleshooting threads]`. Why it works: zero learning, one column, clear order; feels "classic PC RPG"
to our owner (Oblivion fan). Weakness: all buttons equal — no hierarchy unless Play is visibly different.
Mapping: art banner top 45 %, stack of four below; Play first and gold, Uninstall last and visually quieter.

**A3. Split screen — art | solid side panel.** One side is pure art; the other an opaque panel holding everything.
Examples: Paradox launcher game page `[memory]` (art header, Play with playset dropdown under it `[seen]`), modlist
dashboards (Nolvus Dashboard, Wabbajack) `[memory]`, Prism/CurseForge instance pages `[memory]`. Why it works:
text never touches the painting — legibility is solved by construction; the panel can hold the Feedback steps
without covering art. Mapping: right panel ~38 % width: logo, status card, Play full-width, three secondary rows.

**A4. Left sidebar nav + content.** Narrow vertical nav (games or sections), content pane. Examples: Battle.net
game list `[memory]`, Lust Launcher "side menu … switch between pages of games faster" `[seen]`, Vortex/MO2
`[memory]`. Why it works for many games; **why it fails for us** `[inferred]`: we have four actions, not sections —
it degenerates into exactly the "big dark buttons in a left column" the owner rejected. Use only as an icon rail.

**A5. Hero carousel + news cards (portal).** Top hero with promo, Play near a game selector, dated news cards below.
Examples: WGC 2026 `[seen]`, Funcom launcher content pages `[seen]`, REDlauncher (players: "just keep getting
articles when clicking around for the play button" `[seen]` — a warning). Why it works for publishers with news;
for a fixed offline pack it is overkill — but a single "card" row can hold our four actions as tiles.

**A6. Minimal glass panel.** A single frosted/blurred translucent card over the art. Examples: Battle.net 2014
"glass-like blur atop a background image" `[seen]`, Riot Client panels `[memory]`. Why it works: keeps the art
visible around the card; NN/g lists blur as "an alternative to darkening every image" `[seen]`. Mapping: one card,
bottom-left third, all actions inside.

**A7. Parchment / book page.** A paper sheet with ink text and wax-seal or ribbon buttons. Examples: BG3 / Dragon
Age codex and journal screens, Kingdom Come: Deliverance menus `[memory]`. Why it works: dark ink on light paper
reverses the problem — perfect contrast, strong diegetic mood. Mapping: page on the right, art on the left.

**A8. Diegetic material frame (stone / bronze / iron).** The whole UI is carved or forged; buttons are plaques.
Examples: Conan Exiles in-game menus and Age of Conan `[memory]` (sandstone, bronze, leather, Hyborian glyphs),
Diablo IV (black iron, blood-red accents) `[memory]`, Grim Dawn (rusted metal) `[memory]`. Why it works: material
= genre signal; buttons look physically pressable. Risk: heavy ornament at small size — Diablo IV found painterly
detail does not read small `[seen]`; BG3 players found its gold frame too contrasty `[seen]`.

**A9. Cinematic letterbox / title screen.** Art in a wide band, black bars top and bottom carry minimal text.
Examples: Elden Ring title screen and menus (sparse, serif, no boxes) `[memory; "sparse UI" seen]`, Witcher 3 /
Cyberpunk launchers' dark chrome `[memory]`. Why it works: black bars are guaranteed legible space; restraint reads
as premium. Mapping: top bar = logos + title, bottom bar = actions as text, Play centred and larger.

**A10. Old MMO patcher / private-server launcher.** Fixed-size skinned bitmap window with an ornate metal frame,
a news/patch-notes box, a progress bar, a big START bottom-right. Examples: Lineage II / Ragnarok private-server
patchers, EVE's "unnecessarily huge button" `[seen]`, private launchers with server status `[seen, wow-custom-launcher]`.
Why it works for our audience `[inferred]`: nostalgic, unmistakably "a game thing", and a news box is a natural
home for the Feedback steps and status line.

**A11. Tile grid.** Actions as large image tiles. Examples: FTB/CurseForge browse pages `[memory]`, WGC offer cards
`[seen]`, Windows/Xbox tile UIs `[memory]`. Why it works: big hit targets, icons + one line each — good on a TV.

---

## 3. Material & typography language of dark fantasy

Materials `[memory + inferred]`:
- **Sandstone / weathered stone** — Conan Exiles native (Exiled Lands desert, Stygian/Hyborian ruins). Warm
  ochre, matches our sunset art. Good for slabs and tablets; edges chipped, inner bevel.
- **Bronze / brass** — Conan's metal (not steel-blue). Trims, rivets, plaque buttons. Hover = brighter rim.
- **Black iron** — Diablo IV. Near-black with a thin lighter edge; accents of ember red/orange. Strong for
  borders, weak for large fills (reads as "empty dark box" — what the owner already dislikes).
- **Leather** — tooled dark brown with stitched border; good side panels (Skyrim/Dragon Age inventories).
- **Parchment / vellum** — BG3, Kingdom Come. Light warm paper, dark sepia ink, ragged edge.
- **Ornament rules** `[inferred, backed by D4 / BG3 notes seen]`: ornament on corners and dividers only; never
  behind text; one accent metal, not three; frames 1–3 px thin at 100 % with a single highlight line.

Typography — **the decisive constraint: the actions are Cyrillic.** `[seen]` Cinzel and Uncial Antiqua have no
Cyrillic; a Trajan-like Latin face will fall back to a system font on «Играть». Cyrillic-capable display faces:
- **Forum** — Roman-inscription capitals feel, closest Trajan/Cinzel substitute `[style: memory]`. Titles, buttons.
- **Ruslan Display** — Old-Russian display caps `[style: memory]`; strong but very Slavic, may fight Hyborian mood.
- **Cormorant / Cormorant SC / Cormorant Unicase** — high-contrast Garamond; elegant, needs ≥ 18 px to stay crisp.
- **EB Garamond** — body/status/author text; Elden-Ring-like restraint.
- **Philosopher** — semi-serif humanist, readable at small sizes; good for status line.
- **Yeseva One** — fat-face display; poster-like headers.
- **Kurale** — calligraphic serif, good on parchment.
- The project already ships **Gabriela** (handwritten, Cyrillic) for Svarog — an option for the author signature.
- Rule `[inferred]`: one display face (caps, tracked +5–10 %) for title and Play; one text face for everything
  else; button labels in small caps or caps; never italic decorative for status/paths.

---

## 4. Legibility over painted art

Rules, with sources:
1. **Contrast target 4.5:1, 3:1 for large text** (NN/g `[seen]`). Measure on the *worst* pixel under the text,
   not the average — NN/g: test the "worst-case background image and text placement" `[seen]`.
2. **Floor fade (bottom gradient)** — text near the lower edge on a darkening gradient is the least disruptive
   (NN/g `[seen]`). Values seen: transparent → 40 % black over the lower half (light), or transparent until 60 %
   height then 80 % off-black (strong) `[seen]`. For our painterly sunset use the strong one: 0 % at 55 % height
   → 85 % warm black (#0E0905) at the bottom `[inferred]`.
3. **Radial vignette** — darken corners/centre region while keeping tone (NN/g Spire example `[seen]`). A corner
   vignette behind the logos frees the top-left without a box.
4. **Panel opacity ≥ 50 %** — NN/g's REI example: 30 % was too faint, 50 % worked `[seen]`. For warm busy art
   use 65–80 % `[inferred]`.
5. **Blur** behind a panel evens out the background (NN/g `[seen]`). WinForms has no live backdrop blur — bake a
   blurred crop of the wallpaper at load and draw it under the panel `[inferred]`.
6. **Text shadow / outline** as a supplement, not the main fix (NN/g `[seen]`): 1–2 px offset, 3–4 px soft, 60–70 %
   black; outline only on display caps.
7. **Keep text off the sun.** In our wallpaper the brightest zone is the sunset sky/oasis glare `[inferred from
   the task's description; check the actual image]` — put text on the darker foreground (the barbarian's back,
   dunes, frame edges).
8. **4K / 300 % DPI** `[inferred]`: draw gradients, panels and borders in code (vector), not baked into the
   wallpaper; frame bitmaps as 9-slice at 3× resolution; ESO's new launcher explicitly added 4K scaling `[seen]`,
   and Funcom's own launcher lost its buttons at some Windows scalings `[seen]` — a known failure to avoid.

---

## 5. Button hierarchy in launchers

- **One primary.** "PLAY button needs to be larger, distinct, and centrally or prominently placed" (Thrive `[seen]`);
  EVE's "unnecessarily huge button" `[seen]`; Battle.net / Epic / Riot all have exactly one saturated filled button
  `[memory]`. Ours: «Играть» = filled, warm accent (gold/bronze/ember), ~1.6–2× the height of the others, the only
  saturated element on screen.
- **State decides the primary** (LaunchBox: label "reflects state … Play, Install, Resume, Update" `[seen]`;
  Funcom's "Continue" `[seen]`). Proposal `[inferred]`: pack not installed → «Установить сборку» is primary and
  «Играть» disabled; installed → «Играть» primary, install becomes secondary (re-install). Content stays the
  same four actions — only emphasis moves. Needs the owner's word.
- **Secondary** («Установить сборку» when installed, «Отзыв») — outline/ghost or material plaque without fill.
- **Destructive** («Удалить сборку») — tertiary text or small icon button, placed apart from Play (not adjacent,
  no mis-click), neutral colour at rest, red only on hover, a confirm dialog. ESO players asked for colour
  distinction between Live and PTS Play precisely to avoid mis-launch `[seen]` — the same logic separates
  Play from Uninstall.
- **States**: rest / hover (rim light, +8 % brightness) / pressed (1 px down, inner shadow) / disabled (desaturated,
  50 % opacity) / busy (progress inside the button). Every direction below must define all five.
- **Keyboard/gamepad**: ESO added gamepad navigation `[seen]`; owner sometimes sits at the TV — focus ring visible,
  Enter = primary `[inferred]`.

---

## 6. Ten distinct directions for our launcher

Each differs in LAYOUT and MATERIAL. Fonts: display = Cyrillic-capable (see §3).

**1. «Кинопостер» — full-bleed hero + bottom command bar** (Battle.net / Riot / Epic).
Layout: art edge to edge, strong floor fade over the bottom 40 %, soft top-left vignette for the two logos stacked.
Actions: one horizontal bar at the bottom — far right a huge filled bronze-gold «Играть» (~220x64), to its left
«Установить сборку» as outline; far left, small text links «Отзыв» · «Удалить сборку». Status line sits just above
the bar, left; author links tiny in the bar's bottom-right corner under Play. Feedback opens as a panel sliding up
from the bar. Material: none — pure gradient. Fonts: Forum caps (Play, title), Philosopher (status). Palette:
warm black #0E0905, gold #D9A441, ivory text #F2E6CF.

**2. «Обливион» — the Bethesda pre-game stack, remastered** (Oblivion / Skyrim / Fallout 3 launchers).
Layout: art cropped to a top banner (~45 % height) with both logos on it; below, a dark carved-stone slab with a
centred column of four equal-width plaques. Play: first plaque, gold-filled and taller; Install and Feedback as
plain stone plaques; Uninstall last, as a smaller plaque in muted stone. Status line under the banner inside the
slab; author block as a footer line. Material: dark granite with bevel and a thin bronze inlay. Fonts: Forum caps,
EB Garamond for status. Palette: granite #2A2622, bronze #A87B3D, cream #EDE0C4.

**3. «Свиток» — parchment page beside the painting** (BG3 / Dragon Age codex, Kingdom Come).
Layout: art occupies the left ~60 %; the right ~40 % is a parchment sheet with a torn left edge and a soft drop
shadow. On it, in sepia ink: pack logo (metal letters stand out on paper), title, status as a handwritten note.
Actions as an inked list with ruled dividers; Play is a red wax-seal button with «Играть» embossed; Uninstall a
small crossed-out-style ink link at the very bottom. Feedback replaces the list with the three steps as a numbered
recipe. Author block as a signature (Gabriela/Kurale). Palette: vellum #E9D8B4, ink #3B2414, seal #8E1F14.

**4. «Скрижаль Изгнанных земель» — sandstone tablet, bottom-centre** (Conan Exiles in-game menus, Age of Conan).
Layout: full art; a wide carved sandstone tablet anchored bottom-centre (about 70 % width, 30 % height), chipped
edges, Hyborian-glyph border. Play: a large bronze plaque in the tablet centre; Install left and Feedback right as
smaller bronze discs with icon + caption; Uninstall a tiny engraved glyph link in the tablet's corner. Logos float
above the tablet on a radial vignette; status line engraved along the tablet's top edge; author on the bottom rim.
Fonts: Forum caps (engraved: dark fill + 1 px light bottom edge). Palette: sandstone #B9925E, shadow #4A3220, bronze #C48A3A.

**5. «Чёрное железо» — gothic forged frame, centre-bottom bar** (Diablo IV, Grim Dawn).
Layout: art framed by a thin black-iron border with ember-lit corner ornaments; centred at the bottom a single wide
iron bar with flared ends. Play is the bar itself — ember-orange glow text «ИГРАТЬ» that brightens on hover. Around
it, three square iron icon buttons (install / feedback / uninstall) with captions under them; uninstall sits
separate on the far right with a red glyph on hover. Logos top-centre, status line under the bar in small caps.
Fonts: Cormorant SC (titles), Philosopher (body). Palette: iron #15130F, edge #5A5246, ember #E2701E.

**6. «Стекло на закате» — one frosted card** (Battle.net 2014 glass, Riot Client).
Layout: full art untouched except a single frosted card bottom-left (~40 % x 60 %), corners rounded 12 px, made from
a baked blur of the wallpaper + 55 % warm-black tint + 1 px light border. Inside, top to bottom: pack logo, title,
status pill (green dot / amber «Игра не найдена»), a wide solid gold Play pill, a row of two ghost buttons (Install,
Feedback), and Uninstall as a text link. Feedback flips the card's content. Author as two icon links in the card
footer. Fonts: Philosopher + Forum for Play. Palette: tint #140C06 @55 %, gold #E3B04B, white text.

**7. «Командный шатёр» — split screen with a leather side panel** (Paradox launcher, Nolvus/Wabbajack dashboards, Prism).
Layout: art fills the left ~62 % (barbarian and castle stay visible); right ~38 % is an opaque tooled-leather panel
with a stitched border. Panel: pack logo at the top, game logo small beneath, status card, a full-width Play button
(bronze, 72 px), then three row-cards each with icon + title + one-line description (Install / Feedback /
Uninstall, the last with muted text and a divider above). Feedback expands inline as an accordion. Author block at
the panel foot. Fonts: Forum (titles), EB Garamond (descriptions). Palette: leather #3A2618, stitch #C9A46A, gold #D8A23E.

**8. «Широкий экран» — cinematic letterbox** (Elden Ring title screen, REDlauncher dark chrome).
Layout: art shown as a 2.39:1 band in the middle; solid black bars top (~18 %) and bottom (~22 %). Top bar: game
logo left, pack logo right, title centred in tracked caps. Bottom bar: actions as text only — «Играть» centred,
larger, flanked by thin gold ornamental rules; Install and Feedback left of it, Uninstall at the far right in grey.
Hover = thin gold underline + glow. Status line as a small grey line under the actions; author links in the bottom
corners. No boxes anywhere. Fonts: Cormorant (light weights) + Forum. Palette: black #000, gold #C9A25B, grey #8A8478.

**9. «Патчер старой школы» — skinned MMO patcher window** (Lineage II / Ragnarok private-server launchers, EVE).
Layout: a fixed ornate frame (bronze with rivets, 9-slice at 3×) around the whole window; top ~55 % art with logos;
bottom ~45 % split: left a recessed "news box" (dark, scrollable) holding the title, the status line and — in
Feedback mode — the three steps with «Собрать отчёт»; right a column with a huge START-style «Играть» on top
(bevelled bronze, the classic big patcher button), then Install and Feedback as smaller bevelled buttons, Uninstall
as a tiny button in the frame's corner. Author in the frame's bottom edge. Fonts: Ruslan Display (Play), Philosopher.
Palette: bronze #9C6B2E, inset #1B140E, parchment text #E8D9B8.

**10. «Четыре плиты» — tile row over a floor fade** (FTB / CurseForge cards, WGC offer cards, console dashboards).
Layout: full art, logos top-left; at the bottom a row of four tall tiles (each a cropped, darkened slice of the
wallpaper with an icon and a two-word label). The Play tile is double width, brighter, with a gold border and a
soft pulse on focus; Install and Feedback tiles normal; the Uninstall tile narrowest, desaturated, red only on
hover. Status line above the tiles; author line under them. Feedback turns its tile into a wide expanded card. Best
for TV + gamepad (big targets, arrow-key focus). Fonts: Forum caps on tiles, Philosopher. Palette: tile tint #120B06
@70 %, gold #E0AA45, desaturated #6E6A64.

Notes for the mockup round `[inferred]`:
- Directions 1, 6, 8, 10 keep the art dominant; 3 and 7 trade art area for perfect legibility; 2, 4, 5, 9 are
  "material" directions — the owner's Oblivion/Diablo references point there.
- Every mockup must show both states (installed / not installed) and the Feedback panel open — otherwise the
  hierarchy cannot be judged.
- Before drawing: check the real wallpaper for its brightest zone (the sun) and put no text there.
