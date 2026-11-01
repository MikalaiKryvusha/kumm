# TC — the launcher's «Руководство» button and the guide edits of 2026-11-01

> **Created:** 2026-11-01 · **Basis:** `[OWNER]` 2026-11-01 09:18–09:19 «в лаунчер нужно добавить» · «кнопку открытия мануала пользователя» · «не текста»;
> 09:06 «тут масло масленное…» (the features block); 09:14 «это ложь, уже есть одна наша сборка на плейграунд»; 09:18 «Отзывы и обратная связь — давай так
> переименуем вторую главу»; 09:18 «Это идет в мануал пользователя» (rights holders + license)

## Stand

- Pack `ConanExiles`, `python -X utf8 _config/release/build-docs.py` (PDF + launcher); a scratch folder with the built exe and the PDF next to it
  (the export layout: the guide in the archive root beside the launcher) and a fake game folder (`ConanSandbox.exe` stub).
- Snapshots: `KRINIK_LAUNCHER_STATE=fresh|installed` + `KRINIK_LAUNCHER_SNAPSHOT=<file>;<dpi>` (384 = the owner's TV at 400 %, 96).

## Cases

| ID | Situation | Action | Expected | Status | Observed |
|---|---|---|---|---|---|
| L1 | not installed, PDF beside the exe | look at the window | column «Руководство», «Отзыв», gold «Установить сборку»; nothing overlaps | pass | 09:22 snapshot 384 dpi: the three in that order, the path line between, no overlap |
| L2 | installed | look | «Руководство», «Отзыв», «Удалить сборку», gold «Играть»; nothing overlaps | pass | snapshot 384 dpi (3840×2160): four buttons, even gaps, the path line clears them |
| L3 | PDF beside the exe | a click on «Руководство» (BM_CLICK) | the system PDF viewer starts with `Krinik-Conan-3.0.1-guide.pdf` | skipped | a real click opens a PDF window on the owner's screen; the call is ShellExecute of the path L1 found (enabled) — the owner's click is the first real one |
| L4 | no PDF beside the exe | look | «Руководство» greyed out (no crash) | pass | snapshot 96 dpi: greyed, the rest live |
| G1 | the printed PDF | read pages: contents, features, chapter 2, history, the last pages | contents «Отзывы и обратная связь», «Правообладатели…», «Лицензия»; the six rewritten feature paragraphs; history says an early beta was on PlayGround | pass | PyMuPDF text: old titles 0, new 2; «Мир стал шире» 0; «Ранняя бета-версия» 1; pages 2 and 12 rendered and read: chapter 2 «Отзывы и обратная связь», chapters 10–11 rights and license on page 12 |
