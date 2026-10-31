# Test cases — Conan build: one script builds the README (guide → PDF) and the launcher exe; author links from author_links.txt

> **Created:** 2026-10-31 · **Parent:** the owner's words 2026-10-31 15:36–15:40 (verbatim in `plans/35_conan_build_turnkey_quality.md`, G11) · idea 22
> **Status:** cases L1–L9 run 2026-10-31 15:4x — report `testcases/reports/2026-10-31_conan-readme-launcher-build.md`
> **Outbound:** —

**Basis.** `[OWNER]` «нужно сделать, чтобы скрипт сборки ридми клал в него ссылки из author_links.txt» · format `"Текст до двоеточия"[OpenAI](https://openai.com)` →
«Текст до двоеточия; OpenAI», OpenAI clickable · «пусть этот парсер в ридми в секцию ссылок автора закидывает ссылки, и в лаунчер» · «один, который Ридпи собирает
и рендерит в пдф, и собирает лаунчер exe» · «иногда буду пересобирать я сам скриптом» (2026-10-31 15:36–15:39).

**Dimensions.** Parser input partitions (valid · malformed bracket · disallowed scheme · empty file · three quote styles); guide markers present / absent; repeat run
(idempotence); PDF content (text and link annotations); launcher with the game found / not found; the feedback panel. Not covered: a click on a link or on
«Собрать отчёт» (would open the mail client / browser / collector on the owner's screen); the launcher at 2K and 4K × 300 % (the session runs 1920×1080 at
100 % over remote desktop) — the release gate, rule 17.

| # | Case | Expected | Status |
|---|---|---|---|
| L1 | `author_links.py` on the owner's own example line | prints «Текст до двоеточия; OpenAI  ->  https://openai.com», exit 0 | pass |
| L2 | a line with a broken bracket | exit 1, the file:line and the line quoted | pass |
| L3 | `ftp://` address | exit 1, «адрес должен начинаться с https://, http:// или mailto:» | pass |
| L4 | only comments and blank lines | exit 1, «ни одной ссылки» | pass |
| L5 | «ёлочки», “лапки”, straight quotes | all three parsed | pass |
| L6 | `build-docs.py` with the guide markers absent | exit 1, «нет меток … некуда класть ссылки» (control: the guide is never written without the section) | pass |
| L7 | `build-docs.py` full run, then `--no-pdf --no-launcher` again | 2 `<li>` rows between the markers, mailto + https hrefs; the second run changes nothing (diff = markers + 2 rows + css) | pass |
| L8 | the PDF | «Автор сборки» section on its last page (10), link annotations — the `mailto:` and the `https://` address of the two lines of `author_links.txt`, the page looked at | pass |
| L9 | the launcher exe from `bin/` (no game) and from a fake layout `<game>/pack/` with `ConanSandbox.exe` one level up | not found: «Играть» off, the hint line; found: «Играть» on, the game path shown; «Отзыв» (BM_CLICK) opens the instruction and «Собрать отчёт» (on when the `.cmd` lies beside); «Автор сборки» rows «Почта; <the author's mail>», «Личные сообщения на PlayGround; <his profile>» — the two lines of the pack's `author_links.txt` | pass |
