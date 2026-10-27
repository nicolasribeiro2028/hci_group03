# Baseline Apps

Three baselines, chosen by the team: NotebookLM, Khanmigo and GitHub Copilot. Each profile gives the idea of the product, its strengths and weaknesses, and the key insights for our concept. Basis: web searches (documentation, reviews, university guides, papers), not hands-on use. Check against the products before submitting.

## NotebookLM (Gemini Notebook)

**Idea:** a research and study assistant that answers only from the sources the student uploads (PDFs, Docs, Slides, web pages, audio, YouTube). The student owns the context, and the answers are tied to it.

**Strengths**
- Answers carry inline citations that open the exact passage in the source.
- Learning Guide mode asks probing, Socratic questions instead of answering directly.
- Generates summaries, study guides, flashcards, quizzes and mind maps from the same sources.
- One small study found about 13% hallucinations versus about 40% for general chatbots (40 responses only).

**Weaknesses**
- A citation does not guarantee a correct answer, and the student has to check it.
- No up-front check of what the student already knows, and no hint ladder.
- No confidence marker, only citations.
- Reported cases of "source blindness" (says "not found" when the material is there) and of falling back on general knowledge.
- Quality depends on the uploaded material, and long PDFs work less well.

**Key insights**
- Grounding in the student's own material is the closest existing answer to Need 3, and citations help with Need 5.
- Verification is left to the student. We can go further by labeling each claim as course material, general knowledge or unsure.
- Closest overall to our concept, but it does not adapt the amount of help to the student.

## Khanmigo

**Idea:** an AI tutor built into Khan Academy. It works inside Khan Academy's own exercises and courses, so it already has the context of what the student is working on. It is not a general assistant like Claude: it does not need uploads or a setup, because the content comes with the product.

**Strengths**
- Context is built in. It knows the exercise, so help stays on the task, which is what our course-material step tries to achieve.
- Guides with hints and Socratic questions instead of giving the answer.
- Writing Coach keeps the student doing the writing, with feedback at each stage.
- Teachers and parents can see the student's interactions.

**Weaknesses**
- Limited to Khan Academy content, so it cannot use a student's own university course material. I found no upload feature.
- A review cites a 2024 analysis where it ignored a student's correct work and questioned them as if they knew nothing.
- Reviews report trouble with harder math, and the knowledge base is thinner above school level.
- No source references or confidence marker found.
- The student version is paid.

**Key insights**
- Having the course context built in is what makes the help focused. Our concept has to recreate this for university courses through upload.
- Guiding without answering is not enough if the tool does not read the student's actual work. This is the gap our knowledge check and attempt-first flow address (Needs 2 and 4).
- It is the best reference for staged, question-led help, but it does not show the student how sure it is.

## GitHub Copilot

**Idea:** a general coding assistant inside the editor. It completes code and answers questions in chat, using the open files as context. It is not built for learning, and is included because S6 studied how students trust it.

**Strengths**
- Very widely used, so students already know how it behaves.
- Files, repositories and issues can be attached as context, and `/explain` explains code.
- Visual Studio asks clarifying questions when context is unclear and lists the instruction files it used.
- S6 gives evidence on how students form trust in it.

**Weaknesses**
- Not designed for learning: no staged help, no attempt-first flow and no check of what the student knows.
- Context is code, not course material, so it cannot tie answers to a course.
- Incorrect suggestions were a main reason students distrusted it (S6).
- A 2021 preview showed a per-completion score, but I could not confirm that the current product shows any confidence marker.

**Key insights**
- Students' trust followed what they saw the tool get right or wrong (S6), so a tool that shows its evidence gives them something to base trust on.
- A tool that gives complete answers can leave students unable to solve similar problems alone. This matches Need 4 from the interviews (P1, P7).
- It shows the gap for general tools: nothing in it helps the student judge when not to trust the output.

## Across the three

- None of them checks what the student already knows before helping.
- None marks how sure an answer is. A 2021 Copilot preview showed a score, but the current product is unconfirmed.
- Each covers part of the concept: NotebookLM has course material and citations, Khanmigo has built-in context and guided help, Copilot has wide adoption and trust evidence. None combines them.

## Most related solution

DRAFT, for the team to review.

The closest existing solution is NotebookLM. Students upload their own course material, and answers come only from it, with inline citations that open the cited passage. Its Learning Guide mode also guides in a Socratic style with probing questions instead of direct answers. What it does not do, as far as we could find, is check what the student already knows before helping, stage support from a hint up to a full solution, or mark how sure an answer is. Khanmigo comes closest on guided help and has its course context built in, but only for Khan Academy content, and Copilot is a general coding tool. Our concept combines the three: the student's own course material with source markers, an up-front knowledge check, and help that escalates only as the student needs it.
