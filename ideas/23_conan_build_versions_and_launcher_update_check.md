# Idea 23 — the build's versions on GitHub and an update check in the launcher

> **Created:** 2026-10-31 · by the owner's question 19:18 `[OWNER]` «можем нашей сборке ввести контроль версий, чтобы в будущем привязать ее к нашему репозиторию
> ГитХаб, и чтобы лаунчер мог проверять самостоятельно, есть ли более свежая версия?» · **Parent:** idea 22 (the launcher «grows into a launcher that updates
> itself and the build») · **Status:** ❓ awaiting the owner's approval and two answers (below) · **Outbound:** the two questions to the owner

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
4. Later: self-update (download + run the installer) — on the same feed.

## Questions to the owner

- The public repo's name (identity — the owner's to name).
- Where the build archive is published for download (the link the line opens).

## Decisions made without the owner

None yet — the idea waits for approval.
