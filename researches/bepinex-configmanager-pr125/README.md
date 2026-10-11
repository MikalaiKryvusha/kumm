# Research — BepInEx.ConfigurationManager PR #125: the maintainer's answer and the path to a merge

> **Created:** 2026-10-11 · **Parent:** `testcases/reports/2026-10-10_bepinex-configmanager-localization.md` (the PR run) ·
> **Status:** recon done 2026-10-11 10:35; reworking the PR waits for the owner's word (an outward reply in another project's tracker) ·
> **Outbound:** a reply on https://github.com/BepInEx/BepInEx.ConfigurationManager/pull/125 — the owner's decision

## What the maintainer said

ManlyMarco (MEMBER), review `COMMENTED`, 2026-10-11T07:10:48Z, on commit `c70d20e`:

> I am still not a fan of putting translations directly into plugins.
>
> It sounds like you didn't use the plugin translation feature in AutoTranslator - the translations can be scoped just to IMGUI
> code running in a specific dll, see https://github.com/bbepis/XUnity.AutoTranslator/#plugin-specific-manual-translations
> This will resolve the issue of conflicting with the game's own translations.
>
> I think adding scoped translation files to this repository would be the best way to do this. If AutoTranslator is installed,
> they would automatically be picked up. It would also be much easier to add new translations.

Read: not a rejection of Russian — a rejection of the FORM. He wants no dictionary in code (`Localization.cs`, the `Language`
setting); he wants plain XUnity translation files in the repo, scoped to `ConfigurationManager.dll`. "Still" — he said the same
in #39/#81.

## Our two arguments vs. what the source says

| Our argument (PR body) | Verdict | Source |
|---|---|---|
| Global XUnity dictionary collides with the game ("Close" ×3 in level1) | **His point stands** — scoped files fix it | XUnity README → "Plugin-specific Manual Translations": `Translation/{Lang}/Text/Plugins/<dll name without .dll>/*.txt`, optional `#enable fallback` |
| Translated buttons are clipped to the English width ("Закрыт…") | **Ours stands** — scoping does not touch it | Observed 2026-10-10 22:42–22:47, frames cm1, cm3, cm5 (`SvarogsDream/src/KrinikModMenu/ConfigWindowRu.cs` header). Mechanism in XUnity source `Hooks/Managed/IMGUIHooks.cs`: hooks only `GUI.DoButton(Rect, …)`, `GUI.DoLabel(Rect, …)`, `DoToggle`, `DoWindow`… — all receive an already computed `Rect`; the prefix `Hook_TextChanged(content)` rewrites `content.text` in place. `GUILayout.Button(string)` → `GUIContent.Temp(text)` (one static object, reset to English every call) → `GUILayoutUtility.GetRect(content, …)` measures English → `GUI.Button` → hook → Russian drawn into the English-width rect |

## How he would merge it (the path)

1. **Drop the code dictionary.** Revert `Localization.cs`, the `Language` setting and the `Tr()` calls.
2. **Add the files he asked for** — e.g. `Translations/ru/Text/Plugins/ConfigurationManager/ConfigurationManager.txt` in the
   repo (XUnity `key=value` format, our 24 strings from `ConfigWindowRu.cs`), plus a README line on where to drop the folder
   (`BepInEx/Translation/ru/Text/Plugins/…`). Exact layout of the release zip — ask him in the reply, his call.
3. **Clipping — a separate, tiny, translator-neutral code change, proposed, not forced.** Hypothesis `[NOT-TESTED]`: if the window
   passes CACHED `GUIContent` objects instead of strings, XUnity's in-place rewrite survives to the next frame and the Layout pass
   measures the translated word (the first frame is English-width, from the second on — correct). No translation logic in the
   plugin, works for any language and any IMGUI translator. Must be proved in the game before it is offered: enable IMGUI
   translation + the scoped file, frame with and without the cached-content change.
4. **Reply in the PR** — agree on the form, show the clipping frame, offer step 3 as a separate commit he may drop.

## The owner's decisions (2026-10-11)

- Rework by the path above: `[OWNER]` «делаем. Возможно с языком нужно поставлять и отдельный dll для ширин UI, чтобы не было
  обрезок. Но не шить это в сам плагин, а поставлять языковым пакетом и сообществующими модулями, как он хочет» — then
  `[OWNER]` «или да, передавать постоянные объекты текста - ты прав» · 2026-10-11, до 10:41. Order: step 3 as the cached-content
  change in the plugin (translator-neutral); if it fails in the game — the fallback is a companion dll in the language pack.
- **A second, separate PR — game themes as pluggable modules.** `[OWNER]` «и мы ещё сделали тему под игру - это важно для модеров,
  котоорые хотят, чтобы БипИн Екс выглядел в стиле игры, которую они модят - можно тоже поставлять отдельными модулями, не вшивать
  прямо в плагин, а сборку - кому нужно - тот автивирует тему под игру - это я бы отдельным ПР оформил» · 2026-10-11. Shape: the
  plugin gets only a small extension point (a skin/theme hook other plugins can set); the theme itself (ours: dark paper, old gold,
  Manrope — `SvarogsDream/src/KrinikModMenu`) ships as a separate module. Recon of the plugin's drawing code first; it waits until
  PR #125 is settled, so the maintainer reviews one thing at a time.

## Risks

- (a) Step 3 may not hold (e.g. some controls rebuild content per call) → then offer only the files and name clipping as a known
  XUnity limitation with the frame; our local `ConfigWindowRu` patch stays for Svarog's Dream either way.
- (b) Plugin-scoped translation needs `EnableIMGUI=True` in XUnity — it then also translates every other IMGUI mod globally;
  in Svarog's Dream that is a separate decision (our own menus are uGUI; check before turning it on).
- (c) He may prefer the files in a separate translations repo — the reply asks rather than guesses.
