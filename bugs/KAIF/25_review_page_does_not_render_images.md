# KAIF bug 25 — the review page (contour) does not render markdown images: an interview «with pictures» shows «!link» text

**Severity:** S2 (an owner's review round lost: the owner asked «что тут ты хочешь, чтобы я тебе ответил?»)
**Version:** KAIF 2.9, `.kaif/tools/contour/review.mjs` · **When:** 2026-10-31 19:5x, KUMM interview #028
**Delivered upstream:** https://github.com/MikalaiKryvusha/KAIF/issues/187

## Symptom

The owner asked for an interview «с картинками» (19:52). The interview carried `![caption](assets/028/title_oswald.webp)` lines. `review.mjs --check` passed;
the opened page showed each image as a plain link with a leading «!» («!Название шрифтом Oswald — как сейчас»), so the options «верхняя картинка» /
«нижняя картинка» pointed at nothing and the owner could not answer.

## Expected

The page renders `![alt](relative/path)` as an image (resolved against the document's folder; WebP/JPEG), scaled to the column width, clickable to open full size.
`--check` warns when a referenced image file is missing.

## Local remediation

A local fix of 20:0x (images embedded as data URIs into the md before rendering, also in gateForOpen/checkDoc) BROKE the page: the page's stale-document guard compared the embedded text with the file and refused to record answers («Документ переписан после того, как страница открылась»), the owner saw it twice; REVERTED 20:04 (files back to 0ec3a15). FIXED 20:07: core.mjs inline() renders the image line as <img>; review.mjs embedPageImages() embeds the files into the FINISHED HTML of buildPage only — docHash untouched; seen on the reopened page (4 images, no stale banner). Lesson for the origin fix: embed images at HTML render time only, never in the text the page hashes. Until then: questions in the chat as text, pictures opened in ImageGlass.

## Guard

A contour selftest case: a document with one `![a](img.webp)` line renders an `<img>` element with that `src`.
