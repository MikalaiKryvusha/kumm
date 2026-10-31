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

Fixed locally 2026-10-31 20:0x (the owner: «переоткрывай починенную»): `.kaif/tools/contour/core.mjs` inline() renders `![alt](src)` as `<img>`; `review.mjs` `embedImages()` replaces a local image path by a data URI (resolved against the document folder) in the RENDERED copy only, at the five reads (buildPage, notice, proofread, gateForOpen, checkDoc). Seen: interview 028 page built with 4 embedded webp images (4.3 MB), reopened. Reconcile at the next /kaif-update.

## Guard

A contour selftest case: a document with one `![a](img.webp)` line renders an `<img>` element with that `src`.
