# Baseline Apps

Three baselines, chosen by the team: NotebookLM, Khanmigo and GitHub Copilot. Copilot is a general coding assistant, not a study tool. It is included because S6 gives evidence on how students build trust in it.

## Why each one

| Tool | Why it is relevant | Needs |
|---|---|---|
| NotebookLM (Gemini Notebook) | Answers grounded in uploaded sources with citations, plus a Socratic Learning Guide mode | 2, 3, 5 |
| Khanmigo | Guides students with hints and questions instead of answers | 4, 2 |
| GitHub Copilot | Most widely used AI assistant for students who code, studied in S6 | 5 |

## Feature comparison

Our concept features come from the "Prototype Structure" tab of the team doc. Marks: **Yes**, **Partial**, **Not found** (no evidence in the sources checked, which is not proof the feature is absent). All marks come from web searches (documentation, reviews, university guides), not hands-on use. Check against the products before submitting.

| Feature | NotebookLM | Khanmigo | GitHub Copilot |
|---|---|---|---|
| Upload course material | Yes. PDFs, Docs, Slides, web pages, audio, YouTube | Not found | Partial. Attach files and repos as code context, not course material |
| Asks what the student knows | Not found. Learning Guide adapts to follow-ups, no up-front check | Not found. Teacher-side differentiation only | Not found. Asks clarifying questions about context, not knowledge |
| Step-by-step help on request | Partial. Learning Guide breaks problems down through questions, no hint ladder found | Yes. Guided hints and Socratic questions | Partial. `/explain` explains code, no staged help found |
| Student attempts first | Partial. Learning Guide asks questions before answering | Partial. Tutor avoids direct answers and Writing Coach has the student write, no attempt gate confirmed | Not found |
| Source references | Yes. Inline citations open the highlighted passage | Not found | Partial. Visual Studio lists instruction files used under References |
| Confidence marker | Not found. Citations only | Not found | Unverified. A 2021 preview showed a score, current product not confirmed |

## Findings

- No baseline checks what the student already knows before helping, and none marks how sure it is (apart from a 2021 Copilot preview). These are the two features our concept adds on top of staged help.
- NotebookLM and Khanmigo each cover half of the concept: NotebookLM has course material and citations, Khanmigo has guided help. Neither combines them.
- Copilot is the weakest baseline for learning features. Its value here is S6: students' trust followed what they saw the tool get right or wrong.

## Most related solution

DRAFT, for the team to review.

The closest existing solution is NotebookLM. Students upload their own course material, and answers come only from it, with inline citations that open the cited passage. Its Learning Guide mode also guides in a Socratic style with probing questions instead of direct answers. What it does not do, as far as we could find, is check what the student already knows before helping, stage support from a hint up to a full solution, or mark how sure an answer is. Khanmigo comes closest on guided help but has no course-material upload or source references, and Copilot is a general coding tool. Our concept combines the three: course material with source markers, an up-front knowledge check, and help that escalates only as the student needs it.
