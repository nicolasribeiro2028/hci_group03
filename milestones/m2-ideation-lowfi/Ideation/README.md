# Ideation

Ideation combines the understanding of the problem space and the people we design for with imagination, to generate solution concepts. The output is one PDF, **Ideation Report**, built from the Markdown files in [sections/](sections/).

## Task

1. Desk research (slide 7 of `HCI26-Week03-2-Prototype.pdf`)
   - Find at least 2 x N sources of related work (N = 5 group members): research papers, products, blogs, videos, editorials, news articles, customer reviews.
   - Identify the closest baseline apps and compare their features.
2. Brainstorming process and outcomes
   - Write at least 5 "How might we" statements.
   - Brainstorm with one of the two methods from the lecture. Aim for at least 15 ideas.
   - Visualize the ideas (mind-map or similar).
3. Affinity diagram that maps
   - the user needs identified in Milestone 1,
   - the insights from field research,
   - all brainstormed ideas.

   Group related findings visually and identify key themes that inform design opportunities.

Consistency matters: the ideas must match the user needs from the need-finding phase.

## Report sections

- **A.0 Declaration of Use of AI:** short declaration of which AI tools were used and how. If none were used, say so explicitly.
- **A.1 Field Research Summary:** key insights for each related work or baseline app (links and pictures welcome), plus one short paragraph on the most related solution(s), with images or examples if applicable.
- **A.2 Brainstorming Summary:** the "How might we" statements as bullets; one short paragraph on the brainstorming method and why it was chosen; images of the ideas, each with a 1 to 2 sentence description (2 to 3 ideas per page, clearly labeled).
- **A.3 Affinity Diagram Summary:** one image or document of the affinity diagram, plus a brief summary of the key themes and how they guide the next design steps.

## Submission

- One PDF named "Ideation Report" (here: `g3-ideation-report.pdf`).
- Official location: `Deliverables/Ideation`.

## Folder structure

| Path | Purpose |
|---|---|
| `sections/` | One Markdown file per report section. This is where the text is edited |
| `figures/` | Images for the report (brainstorm images, affinity diagram). Link them as `figures/name.png` |
| `main.tex` | LaTeX wrapper: cover page, layout and the list of sections. Rarely needs editing |
| `Makefile` | Builds the PDF |
| `desk-research/` | Helper notes behind A.1. Not submitted |

## Who edits what

Edit only your own section file, so changes do not collide.

| File | Section | Owner |
|---|---|---|
| `sections/a0-ai-declaration.md` | A.0 Declaration of Use of AI | Nicolas |
| `sections/a1-field-research.md` | A.1 Field Research Summary | Nicolas |
| `sections/a2-brainstorming.md` | A.2 Brainstorming Summary | TODO |
| `sections/a3-affinity-diagram.md` | A.3 Affinity Diagram Summary | TODO |

## Build the PDF

From this folder:

```bash
make        # builds g3-ideation-report.pdf
make clean  # removes build/ and the PDF
```

- Needs `pandoc` and `xelatex` (see section 10 of [FORMATTING_GUIDELINE.md](../../../FORMATTING_GUIDELINE.md)).
- Each Markdown file in `sections/` is converted to LaTeX by Pandoc and included by `main.tex`.
- To add a section, create `sections/<name>.md` and add a matching `\input{build/<name>}` line to `main.tex`.
- Keep one `#` heading per section file, then `##` and `###` below it. Tables: set column widths with the dashes in the separator row, otherwise columns come out equal.
- The generated PDF is git-ignored. Commit the final one only when it is ready, with `git add -f`.
