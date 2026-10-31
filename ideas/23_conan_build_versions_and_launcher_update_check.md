# Idea 23 — the build's versions on GitHub and an update check in the launcher

> **Created:** 2026-10-31 · by the owner's question 19:18 `[OWNER]` «можем нашей сборке ввести контроль версий, чтобы в будущем привязать ее к нашему репозиторию
> ГитХаб, и чтобы лаунчер мог проверять самостоятельно, есть ли более свежая версия?» · **Parent:** idea 22 (the launcher «grows into a launcher that updates
> itself and the build») · **Status:** ✅ APPROVED 2026-10-31 20:11 (interview 028 Q3 = A); **the repo answered 21:09** — the existing pack repo `MikalaiKryvusha/conan-exiles-modpack`
> made public, with a README: `[OWNER]` «у нас уже есть репа сборки, можем просто сделать её публичной и написать ридми и в ридми обязательно написать дисклеймер
> и отказ об ответственности, все моды в сборке принежат их законным правоооообладателяммм, а игра конан - ффффокскон и законным правообладатеелям, Криник не
> притендует на владение тем, на что у него нет прав владения, мы лись собрали сборку под лицензией МИТ для ознокомления для всего человечества» · «Ридми
> красивый, по стилометрии на основе примера того, как он написан у других публичныхх реп криника на двух языках» (2026-10-31 21:09). Before the visibility flip:
> an audit of every tracked file AND the history for the owner's identity and the game's origin (memory rule; correction 21:20: the pack manifest has NO `steamEmu` key, now or in history — my 21:09 line said otherwise) — findings to
> the owner first. **Changed 21:10:** `[OWNER]` «можем приватную репу удалить, сделано новую публичную Krinik ModPack for Conan Exilex Enchanced» — a NEW public
> repository with a fresh history (the old history's traces stop mattering; the audit covers the tree that goes there). `[AI]` recommended keeping the private
> repo as the working one (deleting it is irreversible and loses the history) and asked the slug (`Krinik_ModPack_Conan_Exiles_Enhanced` proposed, rule 18)
> · **NAMED 21:15:** `[OWNER]` «Krinik's Conan Exiles Enhanced ModPack» и адрес Kriniks_Conan_Exiles_Enhanced_ModPack · **Outbound:** keep-or-delete of the
> private repo (`[AI]` keep — not answered)

## Goal vector (Achieve)

A player with build 1.0.0 should learn that 1.0.1 exists without reading forums: the launcher says so and gives the download link. The maintainer should
release a version in one step that also updates what the launchers see.

## Acceptance criteria

1. Situation: a release `v1.0.1` exists on the public feed; the player's launcher is 1.0.0. Action: the player starts the launcher. Result: within 3 s a line
   «Доступна версия 1.0.1 — Скачать» under the buttons; the link opens the download page. Check: the launcher against a test feed with a higher tag; a frame.
2. Situation: no network. Action: start. Result: no line, no error, no delay of the window. Check: the launcher with the network cut; the window shows in the usual time.
3. The launcher sends nothing about the player (one anonymous GET of a public URL). Check: the code — one `GET`, no query parameters.

## What is already there

`modpack.json` → `packVersion` 1.0.0; `_config/release/build-docs.py` writes it into `BuildInfo.PackVersion` of `KrinikConanLauncher.exe`; the pack repo
`conan-exiles-modpack` is PRIVATE (a launcher cannot read it without a key) and holds other authors' mods (the archive must not go public — KUMM README).

## Proposed steps (≈ 2–3 h for 1–3)

1. SemVer tags `vX.Y.Z` in the pack repo at each release; the changelog lines from the guide's version history.
2. A small PUBLIC repo (name — the owner's) whose GitHub Releases are the feed: tag = version, body = what's new, a link to the download page (PlayGround or
   wherever the owner publishes). `build-docs.py` gains `--release` that prints the release body.
3. The launcher: at start, async, timeout 3 s, `GET https://api.github.com/repos/<owner>/<repo>/releases/latest`, compare `tag_name` with `BuildInfo.PackVersion`
   (SemVer), show the line; silent on any failure.
4. Later: self-update (download + run the installer) — on the same feed. `[OWNER]` 2026-10-31 19:19 «в будущем через сам лаунчер добавим возможность обновлять
   и сам лаунчер и саму сборку» — the future scope: the launcher updates ITSELF and the BUILD (the mods), both from this feed; the install's undo journal
   (`_kumm_backup`) makes a build update reversible.

## Questions to the owner

- The public repo's name (identity — the owner's to name).
- Where the build archive is published for download (the link the line opens).

## Decisions made without the owner

None yet — the idea waits for approval.

## Public repo — audit and README draft (2026-10-31 21:2x)

- **Audit of the private pack repo** (helper, read-only; the report lives in the PRIVATE pack `_config/public_release/audit_2026-10-31.md` — it quotes the traces,
  so it never enters this public repo): NOT SAFE to open as is — the game's origin is named in about 15 tracked files, in deleted files and in commit
  messages; a home path in two files; no SteamID, host, keys or blobs over 50 MB. The owner's 21:10 route (a NEW public repo) is the clean one: one squashed
  commit of a cleaned tree, the private repo kept as the working one.
- **README draft** (helper, by the portrait's writing sections; the KAIF README as the model; Russian first): pack `_config/public_release/README.draft.md`,
  generated from `README.template.md` by `mods-table.mjs` (every shipped mod exactly once). The portrait's machine check is SKIPPED (the portrait's §8 has no
  pattern table); the independent §7B pass by a clean helper is still owed before the owner sees it.
- **Open for the owner:** a promise to remove a rights holder's material on request (not written — his policy); whether the public tree carries the strings
  extracted from other authors' mods (our translations sit on them); 41 of 64 mod authors still TODO in the table; a `LICENSE` file (MIT) to add.
- **Answered 2026-10-31 21:2x (chat question form):** the translations of other authors' mods (strings extracted from their mods, Hosav overlays) GO into the
  public repo, with the rights note — `[OWNER]` «Да, с отказом»; NO promise to remove material on request — `[OWNER]` «Нет».
- **The public tree — plan for the next step `[AI]`:** a staging copy of the tracked tree WITHOUT the internal dev records that carry the origin (the audit's
  list: `docs/03`, `docs/04`, `docs/05`, `docs/13-era-of-trials`, `docs/dw-cvars/debug-db.md`, `docs/guide/playground-post.md`, `_config/verify-*`,
  `_config/test-verify-baseline.py`, `_config/read-fileset-index.py`, the tracked `__pycache__` pyc, the root jpg, `_config/nexus/logo.py`'s font path),
  with `modpack.json` comment lines and the camera mod's `NEXUS_PAGE.md` / `main.lua:28` reworded, the README from the checked draft, an MIT `LICENSE`;
  a scan of the staging tree for the audit's patterns must print zero before `gh repo create MikalaiKryvusha/Kriniks_Conan_Exiles_Enhanced_ModPack --public`.
