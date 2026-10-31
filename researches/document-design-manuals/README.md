# Research — Design rules for user manuals, explanatory notes and booklets
> **Created:** 2026-10-31 · **Parent:** the owner's word 2026-10-31 17:21 (quoted above, Russian) · plan 35 G11
> **Status:** recon done 2026-10-31 17:28
> **Outbound:** the rules → the Conan user guide layout (KUMM plan 35 G11)

The owner's words (verbatim):

- 2026-10-31 17:21 — «иди в интернет изучать правила красивого оформления буклетов и пояснительных записок и юзер мануалов!»
- 2026-10-31 17:19 (title sheet) — «На титульном листе это НЕ ПАРАГРАФЫ!!! … подзаголовки пунктов»
- 2026-10-31 (running line «CONAN EXILES ENHANCED 3.0.1 · СБОРКА МОДОВ · ВЕРСИЯ 1.0.0» above a heading that said the same) — «нахуя ты повторяешься????»

Subject: the PDF «Руководство пользователя» of the Conan Exiles Enhanced mod pack (11 A4 sheets, HTML → Chrome → PDF): storefront title sheet, crash-report sheet, clickable contents, numbered chapters and points, mod tables, "old paper" background, strict technical register, «вы».

**Source grades.** **[P]** = primary text read by me (the standard or the author's own page). **[S]** = secondary source quoting or summarising the primary; the rule is recorded but its exact wording is not verified first-hand. **[T]** = only the title of the clause is confirmed (from the standard's own table of contents), the content is not.

---

## 1. Explanatory notes and technical documents (Russian standards)

Primary texts read:

- ГОСТ Р 2.105-2019 «ЕСКД. Общие требования к текстовым документам», official edition with Amendment No. 1 (Standartinform 2021) — PDF at https://fmp.msu.ru/attachments/article/935/06.%20Общие%20требования%20к%20текстовым%20документам.pdf (text extracted with pdftotext and read) **[P]**
- ГОСТ 7.32-2017 «Отчёт о научно-исследовательской работе. Структура и правила оформления» — PDF at https://miem.hse.ru/mirror/pubs/share/1019235132.pdf **[P]**
- ГОСТ 19.106-78 «ЕСПД. Требования к программным документам, выполненным печатным способом» — https://meganorm.ru/Data2/1/4294850/4294850038.htm **[P]** (read through a fetch summary with verbatim quotes)
- ГОСТ Р 2.610-2019 «ЕСКД. Правила выполнения эксплуатационных документов» — https://ru.wikisource.org/wiki/ГОСТ_Р_2.610—2019 **[P]** (first 100 000 characters read)

### 1.1 Numbering

1. Sections are numbered with Arabic numerals **without a point**: «Разделы должны иметь порядковые номера в пределах всего документа (части, книги), обозначенные арабскими цифрами без точки и записанные с абзацного отступа». — ГОСТ Р 2.105-2019, 6.5.4 [P]; the same wording in ГОСТ 7.32-2017, 6.4.1 [P].
2. A subsection number is "section.subsection" and **carries no point at the end**: «Номер подраздела состоит из номеров раздела и подраздела, разделенных точкой. В конце номера подраздела точка не ставится». — ГОСТ Р 2.105-2019, 6.5.4 [P]; ГОСТ 7.32-2017, 6.4.1 [P].
3. A point number inside a section without subsections is "section.point", **no point at the end** («В конце номера пункта точка не ставится»); the standard's own example is `1 Типы и основные размеры` / `1.1` / `1.2`. — ГОСТ Р 2.105-2019, 6.5.5 [P]; ГОСТ 7.32-2017, 6.4.2 [P].
4. In ГОСТ Р 2.105-2019 a section or subsection consisting of one point is **still numbered** (6.5.7); ГОСТ 7.32-2017 says the opposite — a single point is not numbered (6.4.3). [P, both] — see Divergences.
5. Sub-points continue the chain: 4.2.1.1, 4.2.1.2 … — ГОСТ Р 2.105-2019, 6.5.9 [P].
6. All points and sub-points start from the paragraph indent. — ГОСТ Р 2.105-2019, 6.5.10 [P].
7. Older software-documentation standard: «Разделы, подразделы, пункты и подпункты следует нумеровать арабскими цифрами с точкой»; its examples are written «(1, 2 и т.д.)», «(2.1, 3.1 и т.д.)». — ГОСТ 19.106-78, 2.1.9 [P]. «С точкой» here is ambiguous (trailing point vs dot-separated); its own examples show no trailing point.
8. Pages are numbered with Arabic numerals, continuous; number at the bottom centre, without a point; the title page counts in the numbering but **carries no number**. — ГОСТ 7.32-2017, 6.3.1–6.3.2 [P].

### 1.2 Headings

9. Sections and subsections must have headings; points as a rule have none. Headings «должны четко и кратко отражать содержание разделов, подразделов». — ГОСТ Р 2.105-2019, 6.6.1 [P]; ГОСТ 7.32-2017, 6.2.2, 6.4.7 [P].
10. Headings: capital first letter, **no point at the end**, **bold**, not underlined; section headings in a larger size; subsection headings may be larger too, but smaller than section headings; subsection headings may be non-bold. — ГОСТ Р 2.105-2019, 6.6.2 [P]. ГОСТ 7.32-2017, 6.2.3: section and subsection headings start from the paragraph indent, after the number, capital first letter, bold, no point [P].
11. **No hyphenation in headings**; a two-sentence heading separates them with a point. — ГОСТ Р 2.105-2019, 6.6.2 and 5.1.2 [P]; ГОСТ 7.32-2017, 6.2.4 [P]; ГОСТ 19.106-78, 2.1.7 [P].
12. Space between a section (subsection) heading and the text before or after it, and between section and subsection headings, is **at least two heights of the body font**. — ГОСТ Р 2.105-2019, 6.6.3 [P].
13. Each section is recommended to start on a new sheet (ГОСТ Р 2.105-2019, 6.6.5 [P]); in a research report each structural element and each section **must** start on a new page (ГОСТ 7.32-2017, 6.2.1 [P]).
14. Headings of structural elements (СОДЕРЖАНИЕ, ВВЕДЕНИЕ, ЗАКЛЮЧЕНИЕ …) are **not numbered**, placed in the middle of the line, in capitals, no point, not underlined. — ГОСТ 7.32-2017, 6.2.1 [P]. ГОСТ 19.106-78, 2.1.4: «СОДЕРЖАНИЕ» «не нумеруют как раздел» [P].

### 1.3 Contents

15. The contents lists the numbers and headings of sections (subsections if needed) and appendices; after each heading a **leader (отточие)** and the page number where the element starts. — ГОСТ Р 2.105-2019, 6.2.2 [P]; ГОСТ 7.32-2017, 5.4.1 [P].
16. Subsection numbers in the contents are indented by **two characters** relative to section numbers (ГОСТ Р 2.105-2019, 6.2.3 [P]); points by four characters (ГОСТ 7.32-2017, 5.4.1 [P]).
17. A wrapped contents line continues from the start of the heading text on the first line, not from the number. — ГОСТ Р 2.105-2019, 6.2.4 [P].
18. The word «Содержание» is placed at the top of its page, centred, capital first letter, bold. — ГОСТ Р 2.105-2019, 6.2.5 [P].
19. The contents is required for large documents — «как правило … если объем документа превышает 24 листа» (ГОСТ Р 2.105-2019, 6.2.1 note [P]); a report of ≤10 pages may omit it (ГОСТ 7.32-2017, 5.4.3 [P]).

### 1.4 Enumerations (lists)

20. Enumerations start from the paragraph indent; each item is preceded by a **hyphen**, or — if the text refers to an item — by a lowercase Russian or Latin letter with a bracket «а)»; the next level uses Arabic numerals with a bracket «1)». Letters Ё, З, Й, О, Ч, Ь, Ы, Ъ are not used. — ГОСТ Р 2.105-2019, 6.7.2 and 6.3.5 [P].
21. ГОСТ 7.32-2017, 6.4.6: each item is preceded by a **dash (тире)**; simple items are separated by commas, complex ones by semicolons; numbered items «1)» are allowed when the number of items is fixed; items in a column from the paragraph indent [P].
22. ГОСТ 19.106-78, 2.1.6: items «рекомендуется обозначать арабскими цифрами со скобкой: 1), 2)»; a hyphen is allowed; references to list items are not recommended [P].

### 1.5 Tables

23. The table name is placed **above** the table; when the table breaks, the name stands only above the first part. — ГОСТ Р 2.105-2019, 6.8.1 [P].
24. Format of the caption: «Таблица Номер таблицы — Наименование таблицы», above the table on the left, without paragraph indent, capital first letter, **no point at the end**. — ГОСТ 7.32-2017, 6.6.3 [P].
25. Tables are numbered with Arabic numerals, continuously through the document (per-section numbering "2.3" allowed); a single table is still «Таблица 1». — ГОСТ Р 2.105-2019, 6.8.2 [P]; ГОСТ 7.32-2017, 6.6.4 [P].
26. Every table must be referenced in the text by the word «таблица» and its number. — ГОСТ Р 2.105-2019, 6.8.3 [P]; ГОСТ 7.32-2017, 6.6.2 [P].
27. Column and row headings: capital first letter, **no point at the end**, **singular**. — ГОСТ Р 2.105-2019, 6.8.4 [P]; ГОСТ 7.32-2017, 6.6.5 [P].
28. No diagonal lines in headings; inner row/column rules may be omitted if reading stays easy; side rules may be omitted; **the table head is separated from the body by a double line**; row height ≥ 8 mm. — ГОСТ Р 2.105-2019, 6.8.5 [P]. Column headings centred, row headings left-aligned. — ГОСТ 7.32-2017, 6.6.6 [P].
29. A continued table: «Продолжение таблицы N» over the following parts (may be omitted when the document is produced with software). — ГОСТ Р 2.105-2019, 6.8.7 [P]; ГОСТ 7.32-2017, 6.6.3 [P].
30. **No «№ п/п» column**: «Графу «Номер по порядку» в таблицу включать не допускается»; if numbering is needed, put the number in the first column right before the name. — ГОСТ Р 2.105-2019, 6.8.8 [P].
31. Table font may be smaller than the body (ГОСТ 7.32-2017, 6.6.7 [P]); tables, notes, footnotes, examples 1–2 pt smaller than the body (ГОСТ Р 2.105-2019, 5.1.1 [P]).
32. A missing value in a table cell is a dash. — ГОСТ Р 2.105-2019, 6.8.19 [P].

### 1.6 Figures, notes, examples

33. Figure caption: «Рисунок 1 — Наименование», centred under the figure, capital first letter, no point at the end, no hyphenation; every figure is referenced in the text. — ГОСТ 7.32-2017, 6.5.1, 6.5.4, 6.5.7, 6.5.8 [P].
34. A note goes right after the material it explains, capital first letter, from the paragraph indent, **in a smaller font**; one note: «Примечание — текст», unnumbered; several: «Примечания» and 1, 2, …; **notes must not contain requirements**. — ГОСТ Р 2.105-2019, 6.12.1–6.12.3 [P]; ГОСТ 7.32-2017, 6.7 [P].
35. Examples are laid out like notes but in bold italic, smaller font. — ГОСТ Р 2.105-2019, 6.14.2 [P].

### 1.7 Page, font, spacing

36. Body font 11–14 pt when produced by computer; appendices, notes, tables, footnotes, examples 1–2 pt smaller; serif proportional fonts allowed for mainly continuous text; **one font family per document is recommended**; fonts with an open licence are recommended (Amendment 1 warns that proprietary Windows fonts — Arial, Times New Roman, Courier New, Verdana — may render wrongly elsewhere). — ГОСТ Р 2.105-2019, 5.1.1 [P].
37. Line spacing: 1.5 recommended; allowed 1; 1.15; 1.25; 1.75; 2. Hyphenation in body text allowed (not in headings). — ГОСТ Р 2.105-2019, 5.1.2 [P].
38. Paragraph indent equal to five characters (12.5–17 mm), the same through the whole document. — ГОСТ Р 2.105-2019, 5.1.4 [P]. 1.25 cm in ГОСТ 7.32-2017, 6.1.1 [P].
39. Research report: A4, black text, ≥12 pt, Times New Roman recommended, 1.5 spacing; margins left 30, right 15, top and bottom 20 mm; **bold only for headings of sections, subsections and structural elements**; emphasis by another style of the same size and family. — ГОСТ 7.32-2017, 6.1.1 [P].
40. Uniform density and contrast of all lines, letters, digits through the document. — ГОСТ 7.32-2017, 6.1.3 [P].

### 1.8 Wording

41. «Текст документа должен быть кратким, четким и не допускать различных толкований». — ГОСТ Р 2.105-2019, 5.2.2 [P].
42. Mandatory requirements use «должен», «следует», «необходимо», «не допускается» …; other provisions — «могут быть», «как правило», «при необходимости», «допускается»; the narrative form («применяют», «указывают») is allowed. — ГОСТ Р 2.105-2019, 5.2.2 [P].
43. Forbidden in text: colloquial turns and professional jargon; **different terms (synonyms) for the same concept**; foreign words when an equal Russian term exists; invented word forms; abbreviations other than the established ones or those defined in the document. — ГОСТ Р 2.105-2019, 5.2.3 [P].
44. Forbidden in running text (outside tables/formulas): the signs «№», «%», «>», «<», «=» without a number; «−» before a value (write «минус»). — ГОСТ Р 2.105-2019, 5.2.4 [P].
45. The product name is the same on the title page and at first mention in the text; names in text and in figures must be the same. — ГОСТ Р 2.105-2019, 5.2.1 [P].
46. Names of commands, modes, signals in text are put in quotes: «Сигнал +27 включено»; labels printed on the product are set by font (without quotes). — ГОСТ Р 2.105-2019, 5.2.5 [P].

### 1.9 Operation manual (РЭ) specifics

47. An operation manual has an introduction **without a heading** (purpose of the manual, required reader skill) and parts such as «Описание и работа», «Использование по назначению», «Техническое обслуживание» … — ГОСТ Р 2.610-2019, 5.1–5.2 [P].
48. «Использование по назначению» covers operating limits (recommended as tables), preparation for use, use, and actions in emergencies (failures that create hazardous situations). — ГОСТ Р 2.610-2019, 5.4.1–5.4.4 [P].
49. Repair information is recommended as a table «failure — cause — detection — remedy». — ГОСТ Р 2.610-2019, 5.6.2 (Table 4) [P].
50. The phrase «Установку проводить в обратной последовательности» **is not allowed** — the reverse procedure is written out. — ГОСТ Р 2.610-2019, 5.5.2.2 [P].
51. User manual of an automated system (ГОСТ Р 59795-2021 / formerly РД 50-34.698-90): purpose and conditions of use, preparation for work, description of operations, emergency situations, recommendations for learning. — section list seen in a manual stating conformance to ГОСТ Р 59795-2021, https://fabit.ru/wp-content/uploads/2023/06/rukovodstvo-polzovatelya.pdf [S]; the standard's own text not read.

---

## 2. User manuals (international standards and style guides)

### 2.1 IEC/IEEE 82079-1:2019 «Preparation of information for use (instructions for use) of products»

Clause titles confirmed from the standard's own preview (table of contents), https://assets.vde-verlag.de/iec-normen/preview-pdf/info_iecieee82079-1%7Bed2.0%7Db.pdf [T]; content from the summary at https://instrktiv.com/en/82079/ [S].

52. Information quality has eight named properties: 5.3.2 Completeness, **5.3.3 Minimalism**, 5.3.4 Correctness, **5.3.5 Conciseness**, **5.3.6 Consistency**, 5.3.7 Comprehensibility, 5.3.8 Accessibility. [T]
53. Minimalism in 82079-1 rests on four principles: action-oriented approach; anchoring in the task domain; supporting error recognition and recovery; supporting reading to do, study and locate — «not rules to be followed blindly or rigorously». [S]
54. Consistency = consistent terminology and consistent format (also clause 9.9 «Consistency of format» [T]). [S]
55. Step-by-step instructions (8.3.4 «Detailed structure of step-by-step instructions» [T]) consist of preliminary information, instructional steps, completion information. [S]
56. Safety-related information (7.11): signal words DANGER / WARNING / CAUTION for harm to persons, NOTICE for property damage; warnings between steps must not distract from the instructions; warning design consistent. [S] Clause titles 7.11.4 «Safety notes», 7.11.5 «Warning messages» [T].
57. Navigation in printed information (8.4.2 [T]): page numbering if more than two pages, a table of contents if more than 12 pages, an index. [S]
58. Legibility (9.10 [T]): Table 4 gives minimum text font sizes (values not obtained); 9.10.2 «Maximum brightness contrast» [T]. [S]
59. Colour (9.13 [T]): colour is used to draw attention to particular sections of information; tables (9.12 [T]) clear and consistently designed. [S]

### 2.2 ISO/IEC/IEEE 26514:2022 «Design and development of information for users»

60. Scope only: how to establish what information users need, how to present it, how to prepare it; media-independent requirements for structure, content and format of printed and on-screen documentation; replaced ISO/IEC 26514:2008. — https://www.boutique.afnor.org/en-gb/standard/iso-iec-ieee-265142022/systems-and-software-engineering-design-and-development-of-information-for-/xs138951/329338 [S]. **No clause text was obtained.**

### 2.3 Microsoft Writing Style Guide

Source pages: https://learn.microsoft.com/en-us/style-guide/procedures-instructions/writing-step-by-step-instructions [P], https://learn.microsoft.com/en-us/style-guide/scannable-content/headings [P].

61. Multi-step procedures: «Use a numbered list.» «Use a separate step for each instruction. It's OK to combine short steps that occur in the same place in the UI.» «Don't overwhelm customers with too many steps in a single procedure.» [P]
62. A single-step procedure needs no number; use a bullet if consistency is wanted. [P]
63. Each step is a complete sentence, capital first letter, point at the end; start with an imperative verb; say **where** before **what** («On the **Design** tab, select **Header Row**»). [P]
64. «An introductory sentence shouldn't just repeat what the heading says.» [P]
65. «Avoid having two headings in a row without text in between—that might indicate a problem with organization or that the headings are redundant. But don't insert filler text just to separate the headings.» [P]
66. «If you can't find at least two distinct topics, skip the second-level headings.» «One heading level is usually plenty for a page or two of content.» [P]
67. «Use parallel sentence structure for all headings at the same level.» [P]
68. Headings: sentence-style capitalization; «Don't end headings with a period»; avoid hyphens; break two-line headings at a phrase boundary, keep prepositions with their words; more space above a heading than below it. [P]
69. UI labels in the examples are set in bold (**Start**, **Design**). [P]

### 2.4 Google developer documentation style guide

Source pages: https://developers.google.com/style/procedures [P], https://developers.google.com/style/headings [P].

70. «In most cases, introduce a procedure with an introductory sentence.» «In general, use one step for each action.» The first sentence of a step contains an imperative verb. [P]
71. «Tell the reader where to complete an action … before you state the action.» «State the action first and the result second.» «Keep the result in the same paragraph as the action.» [P]
72. Optional step starts with «Optional:»; sub-steps use lowercase letters, sub-sub-steps lowercase Roman numerals. [P]
73. Headings: «Use sentence case»; «Don't skip levels of the heading hierarchy»; «Make sure headings are followed by content»; **«Avoid repeating the exact page title in a heading on the page»**; «Don't use numbers in headings to indicate a sequence of sections». [P]

### 2.5 Minimalism (Carroll)

74. Principles as summarised: «Allow learners to start immediately on meaningful tasks»; «Minimize the amount of reading and other passive forms of training by allowing users to fill in the gaps themselves»; «Include error recognition and recovery activities»; «Make all learning activities self-contained and independent of sequence». — https://www.instructionaldesign.org/theories/minimalism/ [S]. Original: van der Meij H., Carroll J. M. Principles and heuristics for designing minimalist instruction // Technical Communication 42(2), 1995, pp. 243–261 (not read).

---

## 3. Booklets and print layout

### 3.1 Bringhurst, «The Elements of Typographic Style»

Rule numbers and titles from https://webtypography.net/toc/ (Rutter's web adaptation of the book) [S]; the measure quote from https://clagnut.com/blog/2432/ and https://tachyons.io/docs/typography/measure/ [S].

75. 2.1.2 «Choose a comfortable measure»: «anything from 45 to 75 characters is widely regarded as a satisfactory length of line», 66 ideal (serif text face at text size). [S]
76. 2.1.3 «Set ragged if ragged setting suits the text and page»; 2.1.10 «Don't stretch the space until it breaks». [S]
77. 2.1.4 «Use a single word space between sentences»; 2.1.6 «Letterspace all strings of capitals and small caps». [S]
78. 2.2.1 «Choose a basic leading that suits the typeface, text and measure»; 2.2.2 «Add and delete vertical space in measured intervals». [S]
79. 2.3.1 «Set opening paragraphs flush left»; 2.3.2 indent all following paragraphs by at least one en. [S]
80. 2.4.1 at hyphenated line ends leave at least two characters behind, take at least three forward; 2.4.3 no more than three consecutive hyphenated lines; 2.4.6 «Link short numerical and mathematical expressions with hard spaces»; 2.4.8 «Never begin a page with the last line of a multi-line paragraph». [S]
81. 3.1.1 «Don't compose without a scale» (a fixed set of type sizes). [S]

### 3.2 Butterick, «Practical Typography»

82. Print body text 10–12 pt; line spacing 120–145 % of the point size; line length 45–90 characters; printed page margins usually larger than one inch. — https://practicaltypography.com/typography-in-ten-minutes.html [P]
83. Headings: emphasise by space above and below; keep with next paragraph; smallest size increment that is visibly different; bold, not italic; no all caps; **at most three levels, two is better**; no hyphenation; don't centre. — https://practicaltypography.com/headings.html [P]
84. All caps only for text shorter than one line (headings, headers, footers, captions, labels); always letterspaced (5–12 %); lowercase is not letterspaced. — https://practicaltypography.com/all-caps.html, https://practicaltypography.com/letterspacing.html [P]
85. Widow and orphan control on. — https://practicaltypography.com/widow-and-orphan-control.html [P]

### 3.3 Composition (Robin Williams)

86. Four principles: proximity, alignment, repetition, contrast. — «The Non-Designer's Design Book», 4th ed., table of contents, https://pearson.com/us/higher-education/program/Williams-Non-Designer-s-Design-Book-The-4th-Edition/PGM240391.html [S, names only].

### 3.4 Contrast over a background (texture)

87. Text contrast at least 4.5:1, large text (≥18 pt, or ≥14 pt bold) at least 3:1; «contrast is measured with respect to the specified background over which the text is rendered»; failure F83 — «using background images that do not provide sufficient contrast with foreground text». — WCAG 2.2 SC 1.4.3, https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html [P]
88. Visual presentation (AAA): width ≤ 80 characters; text not justified; line spacing ≥ 1.5 within paragraphs; paragraph spacing ≥ 1.5 × line spacing. — WCAG 2.2 SC 1.4.8, https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html [P]

### 3.5 Russian typography

89. Em dash between words is spaced on both sides; **en dash for numeric ranges, unspaced** («1941–1945»); hyphen only inside words; minus is a separate sign. — Лебедев А., «Ководство», § 97 «Тире, минус и дефис, или Черты русской типографики», https://www.artlebedev.ru/kovodstvo/sections/97/ [P]
90. Use the quotation marks accepted for the language («Уважающий себя дизайнер … всегда будет использовать принятые для конкретного языка кавычки»). — «Ководство», § 104 «Кавычки», https://www.artlebedev.ru/kovodstvo/sections/104/ [P]. The concrete glyphs — outer «ёлочки», inner „лапки“ (Мильчин and Лопатин cited for it) — https://vk.ru/@1077823-universalnye-sovety-zaschischauschimsya-prodolzhenie-4 [S].
91. «Точку в заголовке, вынесенном в отдельную строку, опускают»; a run-in heading takes a point; «?», «!», «…» are kept. — Мильчин А. Э., Чельцова Л. К. «Справочник издателя и автора», 1.14.1, quoted at https://orfogrammka.ru/типографика/знак_препинания_в_конце_заголовков/ [S]
92. One-letter prepositions and conjunctions (в, к, и, с, у) and prepositions opening a sentence are not left at the end of a line (bound with a non-breaking space). — Гиленсон П. Г., «Справочник художественного и технического редактора» (1988), quoted in a Habr comment thread found by search (e.g. https://habr.com/en/articles/257415/comments) [S, comment not opened].

---

## 4. Applied to our guide — checklist

Each item: what to do in our PDF → source.

1. **Nothing is said twice.** No running line, eyebrow or kicker that repeats the title or the heading under it (the «CONAN EXILES ENHANCED 3.0.1 · СБОРКА МОДОВ · ВЕРСИЯ 1.0.0» line over a heading with the same content goes); no introductory sentence that retells its heading; no two stacked headings with nothing between. → Google headings «Avoid repeating the exact page title in a heading on the page» (#73); Microsoft «An introductory sentence shouldn't just repeat what the heading says» and «two headings in a row … redundant» (#64, #65); IEC/IEEE 82079-1, 5.3.3 Minimalism and 5.3.5 Conciseness (#52); ГОСТ Р 2.105-2019, 5.2.2 «кратким, четким» (#41); Carroll «Minimize the amount of reading» (#74). The version string lives in one place only (the title sheet).
2. **Title sheet = storefront, no numbers.** The title sheet is outside the section numbering: its item subheadings carry no «1.», «1.1»; the sheet carries no page number but counts in the page total. → ГОСТ 7.32-2017, 6.2.1 (structural elements unnumbered), 6.3.2 (title page counted, number not printed) (#8, #14); ГОСТ 19.106-78, 2.1.4 (#14).
3. **Storefront subheadings are parallel** — the same grammatical shape for every item (all noun phrases, or all «что вы получаете» phrases). → Microsoft headings «parallel sentence structure» (#67).
4. **Section numbers without a trailing point:** «1 Установка», «6.1 Название пункта», not «1.» / «6.1.». → ГОСТ Р 2.105-2019, 6.5.4–6.5.5; ГОСТ 7.32-2017, 6.4.1–6.4.2 (#1–#3). See Divergence A — this changes the «1., 2.» the owner saw.
5. **Headings:** capital first letter, no point at the end, bold, not underlined, no hyphenation, chapter headings larger than point headings. → ГОСТ Р 2.105-2019, 6.6.2 (#10, #11); Butterick (#83); Мильчин 1.14.1 (#91).
6. **At most two heading levels** in an 11-sheet guide (chapter + point); points without own text are not made into headings. → Butterick «Two is better» (#83); Microsoft «One heading level is usually plenty for a page or two» (#66); ГОСТ Р 2.105-2019, 6.6.1 «Пункты, как правило, заголовков не имеют» (#9).
7. **Space around headings ≥ 2 body-font heights, more above than below; heading never alone at the bottom of a page.** → ГОСТ Р 2.105-2019, 6.6.3 (#12); Microsoft (#68); Butterick keep-with-next (#83); CSS `break-after: avoid` is the HTML means.
8. **Each chapter starts on a new page.** → ГОСТ Р 2.105-2019, 6.6.5 (recommended), ГОСТ 7.32-2017, 6.2.1 (#13).
9. **Contents:** titled «Содержание» (centred, bold); numbers + headings + leader dots + page number; points indented two characters; wrapped lines aligned to the heading text; every entry a link. → ГОСТ Р 2.105-2019, 6.2.2–6.2.5 (#15–#18); IEC/IEEE 82079-1, 8.4.2 navigation (#57). An 11-sheet document does not require a contents by any standard (#19, #57) — it is kept because the owner asked for it; nothing forbids it.
10. **Steps of instructions:** numbered list; one action per step (short actions in the same window may join); imperative with «вы»-form («Откройте», «Нажмите»); where first, then what; the result in the same step after the action; a single-step instruction gets no number. → Microsoft (#61–#63); Google (#70–#71); ГОСТ Р 2.105-2019, 5.2.2 (#42).
11. **No «в обратном порядке»** — an uninstall or rollback is written out as its own steps. → ГОСТ Р 2.610-2019, 5.5.2.2 (#50).
12. **Lists:** column from the paragraph indent; dash before each item; «а)», «б)» only when the text refers to an item; never more than two list levels. → ГОСТ Р 2.105-2019, 6.7.2 (#20); ГОСТ 7.32-2017, 6.4.6 (#21). Dash vs hyphen: Divergence D.
13. **Tables:** caption above on the left «Таблица 3 — Моды интерфейса», no point; continuous numbering; each table referenced in the text («в таблице 3»); column headings capital first letter, singular, no point; header separated from the body by a double (or heavier) rule; no «№» column; empty cell = dash; table text 1–2 pt smaller. → ГОСТ Р 2.105-2019, 6.8.1–6.8.8, 6.8.19, 5.1.1; ГОСТ 7.32-2017, 6.6.3 (#23–#32).
14. **A table split across pages** repeats the head (`thead` repeats in Chrome print) and may carry «Продолжение таблицы N». → ГОСТ Р 2.105-2019, 6.8.7 (#29).
15. **Notes:** «Примечание — …» right after the thing explained, smaller font; a note holds no requirement (an order goes into the step itself). → ГОСТ Р 2.105-2019, 6.12 (#34).
16. **Warnings** (loss of a save, a crash): one consistent warning block design, the signal word first; the save-loss case is property damage → NOTICE-level word («ВНИМАНИЕ»), not «ОПАСНО»; a warning stands before the step it concerns and does not break the step flow. → IEC/IEEE 82079-1, 7.11 (#56) [S].
17. **The crash-report sheet** is written as an error-recovery procedure: what the player sees → numbered steps → what to send. → Carroll / 82079-1 minimalism «supporting error recognition and recovery» (#53, #74); ГОСТ Р 2.610-2019, 5.4.4 actions in emergencies (#48).
18. **One term — one concept** (one word for «сборка», one for «мод», one for «сохранение» through all 11 sheets); the pack name identical on the title sheet and at first mention. → ГОСТ Р 2.105-2019, 5.2.1, 5.2.3 (#43, #45); IEC/IEEE 82079-1, 5.3.6 (#54).
19. **Modal words:** «следует», «необходимо», «не допускается» for musts; «можно», «допускается», «при необходимости» for options; no colloquialisms or jargon. → ГОСТ Р 2.105-2019, 5.2.2–5.2.3 (#42, #43).
20. **Interface names** (menu items, buttons, mod names on screen): one convention throughout — quotes per ГОСТ, or bold per Microsoft (Divergence F). → ГОСТ Р 2.105-2019, 5.2.5 (#46); Microsoft (#69).
21. **No bare signs in running text:** «№», «%», «>» only with a number. → ГОСТ Р 2.105-2019, 5.2.4 (#44).
22. **Body font:** one open-licence serif family for the whole guide (a second face only for headings if at all), body 11–12 pt. → ГОСТ Р 2.105-2019, 5.1.1 (#36); Butterick 10–12 pt (#82).
23. **Line length ≤ 75 characters** — count on the rendered A4 page; if a full-width column exceeds it, widen the margins or set a narrower text block. → Bringhurst 2.1.2 (#75); Butterick (#82); WCAG 1.4.8 (#88).
24. **Leading 1.25–1.45 of the font size** (see Divergence C); vertical spaces in a fixed scale; one paragraph indent through the document or block paragraphs — not both. → ГОСТ Р 2.105-2019, 5.1.2, 5.1.4 (#37, #38); Butterick (#82); Bringhurst 2.2.2 (#78).
25. **No widows/orphans; no hyphenation in headings; in justified body text hyphenation on** (`hyphens: auto` with `lang="ru"`), otherwise ragged-right. → Butterick (#85); Bringhurst 2.4.8, 2.1.3, 2.1.10 (#76, #80); ГОСТ Р 2.105-2019, 5.1.2 (#37).
26. **"Old paper" background:** body text contrast ≥ 4.5:1 measured against the darkest patch of the texture under the text; the texture stays light and uniform under text blocks; contrast uniform through the document. → WCAG 1.4.3 and F83 (#87); ГОСТ 7.32-2017, 6.1.3 (#40); IEC/IEEE 82079-1, 9.10.2 [T] (#58).
27. **Colour** only to mark (warnings, links, the accent of headings) — one accent colour, used the same way everywhere. → IEC/IEEE 82079-1, 9.13 [S] (#59); ГОСТ 7.32-2017, 6.1.1 (black text) (#39).
28. **All-caps** only for one-line labels (running titles, table heads if any), always letterspaced 5–12 %. → Butterick (#84); Bringhurst 2.1.6 (#77).
29. **Russian typography:** «ёлочки» outside, „лапки“ inside; spaced em dash « — » between words; unspaced en dash in ranges «1–3»; hyphen only inside words; non-breaking space after one-letter prepositions and conjunctions, between a number and its unit, before a dash. → «Ководство» § 97, § 104 (#89, #90); Мильчин/Лопатин via secondary (#90); Гиленсон via secondary (#92); Bringhurst 2.4.6 (#80).
30. **Page numbers** bottom centre, no point; title sheet unnumbered but counted. → ГОСТ 7.32-2017, 6.3.1–6.3.2 (#8).

---

## 5. Where the sources disagree — and the choice

**A. Point after the heading number («1.» / «6.1.» vs «1» / «6.1»).** ГОСТ Р 2.105-2019 (6.5.4–6.5.5) and ГОСТ 7.32-2017 (6.4.1–6.4.2) say explicitly: no point after the section number and none at the end of «1.1». ГОСТ 19.106-78 (2.1.9) says «с точкой», but its own examples «(1, 2 и т.д.)», «(2.1, 3.1)» have no trailing point. Some university guides put the point (search excerpt only, e.g. HSE coursework requirements) — they are local rules, not standards. Google says not to number headings at all. **Choice: «1 Название», «6.1 Название» — the current national standard for text documents, the same in two standards, unambiguous.** This changes what the owner currently sees («1., 2.»); the decision is his. If the owner keeps «1.», then for consistency write «6.1.» too — never mix «1.» with «6.1».

**B. A single point in a section — numbered or not.** ГОСТ Р 2.105-2019, 6.5.7: numbered; ГОСТ 7.32-2017, 6.4.3: not numbered. **Choice: ГОСТ Р 2.105-2019** (newer, the text-document standard); in practice avoid sections with one point.

**C. Line spacing and line length.** ГОСТ Р 2.105-2019: 1.5 recommended, 1–2 allowed; ГОСТ 7.32-2017: 1.5; Butterick 120–145 %; WCAG AAA ≥ 1.5. Line length: Bringhurst 45–75, Butterick 45–90, WCAG ≤ 80. **Choice: 1.25–1.45 leading** (inside ГОСТ's allowed range and Butterick's; 1.5 doubles the vertical spread of an 11-sheet booklet) **and ≤ 75 characters** (the strictest common bound). The ГОСТ spacing values are word-processor multiples, not exactly CSS `line-height` — treated as approximate.

**D. List marker: hyphen or dash.** ГОСТ Р 2.105-2019, 6.7.2: «дефис»; ГОСТ 7.32-2017, 6.4.6: «тире»; «Ководство» § 97: the hyphen belongs inside words. **Choice: a dash** (ГОСТ 7.32 plus typographic convention); the dash glyph is the same in every list.

**E. Font: Times New Roman or not.** ГОСТ 7.32-2017 recommends Times New Roman; ГОСТ Р 2.105-2019 (Amendment 1) warns against proprietary Windows fonts and recommends open-licence ones; Butterick rejects Times New Roman and Arial. **Choice: an open-licence serif with full Cyrillic**, embedded in the PDF.

**F. Interface names: quotes or bold.** ГОСТ Р 2.105-2019, 5.2.5: command and mode names in quotes; Microsoft sets UI labels in bold. **Choice: bold for on-screen UI labels the player clicks** (findable at a glance in a step; quotes stay free for real quotations and names of files) — a deviation from ГОСТ, deliberate; or quotes if the owner wants strict ГОСТ. Either way, one convention.

**G. Headings: numbered or not; caps or not; centred or not.** Google: no numbers in headings; ГОСТ: numbered. ГОСТ 7.32-2017: structural-element headings (СОДЕРЖАНИЕ) in capitals, centred; ГОСТ Р 2.105-2019: «Содержание» with a capital first letter, centred, bold; Butterick: no all caps, don't centre. **Choice: numbered chapters (owner's order and ГОСТ), sentence-case headings, «Содержание» centred bold per ГОСТ Р 2.105-2019**; all caps only for one-line labels.

**H. Contents in a short document.** ГОСТ Р 2.105-2019: as a rule when > 24 sheets; ГОСТ 7.32-2017: optional for ≤ 10 pages; 82079-1 (via summary): when > 12 pages. **Choice: keep it** — no source forbids it, the owner asked for it, and in a PDF it is the clickable navigation.

---

## 6. Not found / not verified

- **ISO/IEC/IEEE 26514:2022** — no clause text; only the scope.
- **IEC/IEEE 82079-1:2019** — only the clause titles first-hand; every content rule above is from a secondary summary; the Table 4 font-size values were not obtained.
- **Мильчин** on the point after a heading number (e.g. «1.» vs «1») and on redundancy/repetition — not found; only 1.14.1 (point at the end of a heading) through a quoting site.
- **«Ководство»** — no first-hand rule on the glyph shape of nested quotes or on non-breaking spaces; the nbsp rule is from Гиленсон via a forum comment.
- **Владимир Ефимов** — nothing found within this recon.
- **Bringhurst** — book text not read; rules taken from webtypography.net and quoting sites.
- **ГОСТ Р 59795-2021** — the standard's text not read; section list from a manual claiming conformance.
- **Grid systems** (modular grid, Müller-Brockmann) — not researched; no rule recorded.
- **Carroll / van der Meij 1995 heuristics** (the "be brief" heuristic wording) — the original paper not read.
