# Markdown Formatting Guideline

Every milestone document in this repo is written in Markdown and converted to PDF (e.g. with Pandoc). Follow these rules so all documents look consistent. Paste this file into any Claude session before asking it to write one.

## 1. File basics

- Work in the existing files listed in the milestone's `README.md` (e.g. `milestones/m1-need-finding/need-finding-report.md`). Keep the template's headings; fill in the TODOs rather than restructuring.
- Exported PDFs are prefixed `g3-` (e.g. `g3-need-finding-report.pdf`).
- UTF-8 plain text, `.md` extension.
- Write in English.
- Keep the file free of raw HTML, since it may not render in the PDF.

## 2. Structure

- Exactly one `#` (H1) per file: the section title, on the first line.
- Use `##` for main parts and `###` for sub-parts. Do not go deeper than `###`.
- Never skip heading levels (no `#` followed directly by `###`).
- Put a blank line before and after every heading, list, table, and code block.
- No manual numbering in headings unless the section requires it.

```markdown
# Section Title

## Main part

### Sub-part
```

## 3. Text

- Short paragraphs (2 to 4 sentences), separated by one blank line.
- No hard line breaks inside a paragraph, and no trailing double spaces.
- Use `**bold**` for key terms and `*italics*` for emphasis or titles. Do not combine them or overuse either.
- Use plain punctuation. Avoid emojis and decorative symbols.
- Refer to participants by code or role (e.g. "P03", "a mechanical engineering student"), never by full name.

## 4. Lists

- Bullets: `-` (always a hyphen). Numbered lists: `1.`, `2.`, `3.`.
- Indent nested lists by 2 spaces, one level of nesting at most.
- Keep list items parallel in form and similar in length.

## 5. Quotes

- Use `>` blockquotes for direct participant quotes.
- Quotes must be in English; note "(translated)" if the interview was in another language.
- Attribute each quote with the participant code on its own line after the quote.

```markdown
> "I focus on learning first, then I solve it."
>
> — P02 (translated)
```

## 6. Tables

- Use pipe tables with a header row and a separator row.
- Keep cells short (a few words). Put long text in paragraphs instead.
- No more than 5 columns, so tables fit the PDF page width.

```markdown
| Persona | Goal | Pain point |
|---------|------|------------|
| Alex    | ...  | ...        |
```

## 7. Images and figures

- Store images in the repo's `assets/` folder and link with relative paths from your file (e.g. `![Caption](../../assets/persona_1.png)`).
- Every image needs a caption in the alt text.
- Use PNG or JPG, with a width that fits the page (about 1600 px maximum).

## 8. Length and page limits

- Respect the page limit for your section (the interview summary must fit on **one page**).
- Check the generated PDF, not the Markdown, to verify the length.
- Prefer cutting content over shrinking the layout. Do not change fonts, margins, or spacing to squeeze text in.

## 9. Links and references

- Use inline links: `[text](url)`. Do not paste bare URLs in the body.
- Link to interview files with relative paths only in supplementary materials, not in the main sections.

## 10. Converting Markdown to PDF

We use [Pandoc](https://pandoc.org/) with the XeLaTeX engine.

### Setup (once)

- macOS: `brew install pandoc` (a LaTeX distribution such as MacTeX or BasicTeX must also be installed, so that `xelatex` works).
- Check with `pandoc --version` and `xelatex --version`.

### Convert one file

Run from the folder that contains the Markdown file, so relative image paths resolve:

```bash
pandoc need-finding-report.md -o g3-need-finding-report.pdf \
  --pdf-engine=xelatex \
  -V geometry:margin=2.5cm \
  -V fontsize=11pt
```

- The output name must start with `g3-` (e.g. `g3-supplementary-materials.pdf`).
- Use the same options for every document so the PDFs look alike. Do not tweak margins or font size per document (see section 8).
- To merge several Markdown files into one PDF, list them in order: `pandoc 01.md 02.md -o g3-report.pdf --pdf-engine=xelatex`.

### Check the result

- Open the PDF and check page count, heading hierarchy, table widths and image placement.
- If a table runs off the page, shorten the cell text or drop a column (section 6).
- If an image is missing, check the relative path from the Markdown file.
- Non-ASCII characters (e.g. accents) are handled by XeLaTeX. If a character is missing, remove it rather than changing fonts.

### What to commit

- Commit the `.md` source. Commit the final `g3-*.pdf` only when it is ready to submit, in the milestone folder named in its `README.md`.
- Do not commit intermediate or test PDFs.

## 11. Instructions for Claude sessions

Include these lines when prompting Claude:

> Write the section as a single Markdown file following `FORMATTING_GUIDELINE.md`. One H1 title, `##`/`###` headings only, hyphen bullets, `>` blockquotes for quotes, pipe tables, no HTML, no emojis, no participant names. Stay within the page limit and output only the Markdown, with no commentary before or after.

## 12. Pre-commit checklist

- [ ] One H1, no skipped heading levels
- [ ] Blank lines around headings, lists, tables
- [ ] No participant names, no emojis, no HTML
- [ ] Quotes in English with participant codes
- [ ] PDF generated and page limit checked
