# Plan 44 — rebuild 0.9.0: the collapsed meter fixed, the pause on loading screens fixed, a clean in-game mod list

> **Created:** 2026-11-03 12:59 +03:00 · **Parent:** plan 43 (release 0.9.0), bug 79 · **Status:** started
> **Outbound:** the GitHub release v0.9.0 (parts re-uploaded), the Nexus draft 65 (file and two gallery frames replaced)

## The owner's words (verbatim, 2026-11-03 12:55–12:59)

`[OWNER]` «почему ты сейчас запустил игру, а она некорректно работает?» · «вод DPS вверху старый» · «мы его переделывали» · «ты в каком-то не последнем
состоянии запустил сборку» · «ты и в таком виде, что ли, её упаковал в релиз 0.9.0 ?» · «мы делали его пррозрачным, писали ему F1 - где эти
изменения????» · «2-го ноября блять был финальный вариант!!!» · «так, пересобираем по-новой» · «со всеми финальными правками от 2-го ноября» · «и ещё
нужно все моды KRINIK описать, авторство, и остальные поля» · «которые встроенный мод менеджер игры принимает и отображает» · «и всем модам переписать
описания правильно, без лишних символов.Ю которые не рендерятся» · (a frame of the game's mod list: `[h1][b]CONTENT[/b][/h1]`, a raw URL) · «а наших
модов здесь я всех не нашёл, почему-то, и описаний нет!» · (a frame: KrinikConanUI — «Автор --», «URL автора --», «Список изменений --»).

## What is established (12:55–12:59)

- The working game's files equal the pack (`-Verify` 108/0; 13 of 14 Krinik Lua files byte-equal, the 14th differs in a comment only) — the 0.9.0 archive
  holds every committed edit up to 2026-11-02. The collapsed Damage Meter look (minus + «F1», 20 % fill, soft rim — commit `be512bd`, review 49 variant 5) IS in
  the code and its log line fired at 12:47:26, but 10 minutes later `KrinikF1Box` no longer exists: the Damage Meter rebuilds its widget and our label is lost —
  a runtime defect, not a stale build.
- The game's mod list shows only paks: 3 Krinik paks (Archery, UI, Gameplay) with empty author / author URL / change note; the Lua mods (Camera, Graphics,
  ModPackManager, the translation) have no pak and are absent. Other mods show the Workshop description raw (BBCode, URLs).
- A pak's fields live in `modinfo.json` inside the outer wrapper (`name`, `description`, `changeNote`, `author`, `authorUrl`, version); `set-pak-version.py`
  already edits that file without a re-cook.

## Steps (each closes with its check)

- [x] 1. **Collapsed meter look survives.** DONE 13:11 — the label on the meter widget's own birth; seen «— F1» after a teleport (frame). Find what rebuilds the Damage Meter widget (hub, Esc, teleport, save) and re-apply the label on THAT event
      (rule: events, not polling). Check: the label present after hub, Esc menu, teleport, 10 min idle — frames at 4K.
- [x] 2. **Bug 79** DONE 13:11 on the teleport stand (time 1.00, landed in 4 s); waystone / respawn — later in this plan; — `PauseGameInMenu` skips `W_IngameLoadingScreen_C`. Check: the teleport stand, then a waystone travel and a death/respawn — time 1.0
      within 5 s, log lines.
- [ ] 3. **Mod list fields.** A tool `set-pak-modinfo.py` (from `set-pak-version.py`): writes `description`, `changeNote`, `author`, `authorUrl` from a table;
      descriptions — the README's Russian «Что делает» text, plain (no BBCode, no URLs, no `\r`). Krinik paks: author «Кот Криник (KOT KRINIK)», URL — the
      Nexus page, change note 0.9.0. Check: every pak's modinfo read back; the game's list — frames of several entries.
- [ ] 4. **The Lua-only Krinik mods in the list** — a modinfo-only wrapper pak per mod (Camera, Graphics, ModPackManager, the translation) if the game lists a
      pak without content; first one mod as a probe, the game's log clean. Check: the list shows all 7 Krinik mods.
- [ ] 5. The export excludes `KrinikConanCamera/nexus-screenshots/`, `nexus-logo/`.
- [ ] 6. Deploy into the working game, `-Verify`, smoke by eye (menu, world, hub, meter).
- [ ] 7. `make_volumes.sh` (configs backed up and restored), the 7 GitHub parts and the Nexus zip cut and checked; uploads: GitHub (old parts removed first),
      Nexus file replaced; the hub and Esc frames replaced in the Nexus gallery; the city and waystone frames (`[OWNER]` 12:47–12:48).
