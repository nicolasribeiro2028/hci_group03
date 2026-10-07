# Markdown Formatting Guideline

Every Milestone 1 section is written in Markdown and converted to PDF (e.g. with Pandoc). Follow these rules so all sections look consistent when combined. Paste this file into any Claude session before asking it to write a section.

## 1. File basics

- Work in the existing files listed in the [README](README.md) (`need-finding-report.md`, `persona-template.md`, `supplementary-materials.md`, `interviews/`). Keep the template's headings; fill in the TODOs rather than restructuring.
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

- Store images in `milestones/m1-need-finding/images/` and link with relative paths: `![Caption](images/persona_1.png)`.
- Every image needs a caption in the alt text.
- Use PNG or JPG, with a width that fits the page (about 1600 px maximum).

## 8. Length and page limits

- Respect the page limit for your section (the interview summary must fit on **one page**).
- Check the generated PDF, not the Markdown, to verify the length.
- Prefer cutting content over shrinking the layout. Do not change fonts, margins, or spacing to squeeze text in.

## 9. Links and references

- Use inline links: `[text](url)`. Do not paste bare URLs in the body.
- Link to interview files with relative paths (e.g. `interviews/...`) only in supplementary materials, not in the main sections.

## 10. Instructions for Claude sessions

Include these lines when prompting Claude:

> Write the section as a single Markdown file following `FORMATTING_GUIDELINE.md`. One H1 title, `##`/`###` headings only, hyphen bullets, `>` blockquotes for quotes, pipe tables, no HTML, no emojis, no participant names. Stay within the page limit and output only the Markdown, with no commentary before or after.

## 11. Pre-commit checklist

- [ ] One H1, no skipped heading levels
- [ ] Blank lines around headings, lists, tables
- [ ] No participant names, no emojis, no HTML
- [ ] Quotes in English with participant codes
- [ ] PDF generated and page limit checked
