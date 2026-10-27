# Ideation Report

## A.0 Declaration of Use of AI

We used AI in this report in the following ways.

- **Finding related work.** We described our needs and key ideas to an AI assistant (Claude, through Claude Code), which searched the web for related papers, products and articles.
- **Organizing and synthesizing reading.** We used the assistant to summarize sources, compare multiple articles and identify the most relevant ones for each need. The paper summaries were based on abstracts and web search results, not full texts, and the product descriptions on documentation and reviews, not hands-on use.
- **Writing Markdown.** We used the assistant to organize our notes and write them as Markdown files, including the structure of this report.
- **Dictation.** Some team members used dictation tools, such as Wispr Flow, to type faster.

The research questions, the choice of baselines, the needs and the conclusions are the team's. The team reviewed and edited the AI-assisted text.

## A.1 Field Research Summary

We reviewed 19 sources (7 papers, 10 products and 2 other posts or docs), organized by the five key needs from Milestone 1. Findings from papers are based on abstracts. Product findings come from documentation, reviews and web searches, not hands-on use.

### Related work

| Source | Type | Need | Key insight |
|---|---|---|---|
| [Help Helps, But Only So Much](https://doi.org/10.1007/s40593-015-0089-1) | Paper | 1 | Coaching students on how to seek help made them use it more deliberately but did not improve learning. |
| [Segmentation of Worked Examples](https://onlinelibrary.wiley.com/doi/10.1002/acp.1832) | Paper | 1 | Pre-segmented examples gave equal learning with less effort, but making students segment them backfired. |
| [Thetawise](https://thetawise.ai/) | Product | 1 | Hints and step-by-step math help, but the student picks Tutor Mode or Answer Directly. |
| [TeachLM](https://arxiv.org/abs/2510.05087) | Paper | 2 | Current study modes rephrase a problem instead of diagnosing the confusion and barely establish the student's level. |
| [Learning Context framework](https://arxiv.org/abs/2512.24362) | Paper | 2, 3 | AI tutors should keep a model of the learner's cognitive, affective and sociocultural context. |
| Gemini Guided Learning | Product | 2 | Asks about goal and level first, plus a diagnostic quiz tied to uploaded class material. |
| ChatGPT Study Mode | Product | 2 | Asks about goal and level before teaching. |
| Claude document upload | Product | 3 | Course documents can be uploaded as context. |
| [ScrollToStudy](https://scrolltostudy.com/) | Product | 3 | Builds a feed of flashcards and quizzes from the student's own material, for passive review. |
| [Rundown thought-partner post](https://app.therundown.ai/community/posts/c67d40aa-6810-47f6-bc66-a558f16872b8) | Post | 4 | An agent interviews the user one question at a time before drafting. Shows people using AI as a partner that guides the discussion. |
| [Claude Code learning style](https://code.claude.com/docs/en/output-styles#learning) | Docs | 4 | Leaves TODOs so the user makes the decisions. |
| [Turbo AI](https://www.turbo.ai/) | Product | baseline | Produces notes, flashcards and quizzes but does not guide students through problems. |
| [Beyond the Benefits](https://arxiv.org/abs/2510.04443) | Paper | 5 | Review of 224 papers on the harms of generative AI in computing education, including cognitive effects and trust. |
| [Evolution of Programmers' Trust](https://arxiv.org/abs/2509.13253) | Paper | 5 | Students' trust in Copilot rose over 10 days. Seeing it be right raised trust and wrong suggestions lowered it. |
| [Trust and Reliance on AI in Education](https://arxiv.org/abs/2604.01114) | Paper | 5 | Higher trust went with worse judgment of when the AI was wrong. |
| [Scite](http://scite.ai) | Product | 5 | Helps judge how trustworthy or contested a scientific claim is. |

### Related work in depth

Two papers shaped our design most directly.

**Segmentation of Worked Examples** ([Spanjers, van Gog and van Merriënboer, 2012](https://onlinelibrary.wiley.com/doi/10.1002/acp.1832)). This study compared three ways of studying worked examples: shown whole, pre-divided into segments by blank lines, and divided into segments by the students themselves. Pre-segmented examples led to the same learning with less mental effort, while asking students to segment actively added effort without improving performance. A related study by the same group found that segmentation helped learners with low prior knowledge more than those with high prior knowledge. For our concept this supports splitting help into short steps (Need 1), and suggests the tool should do the splitting instead of leaving it to the student. The prior-knowledge result also links Need 1 to Need 2, since the right step size may depend on what the student already knows. The study tested worked examples, not AI chat, so it supports the design direction without proving it.

**Evolution of Programmers' Trust in Generative AI Programming Assistants** ([Shah et al.](https://arxiv.org/abs/2509.13253)). This study followed 71 upper-division computer science students using GitHub Copilot, measuring their trust after one hour and again after 10 days. Trust rose on average. Students said it grew when they saw Copilot be correct, understood how it uses the surrounding code as context, and learned some basics of how language models work. Incorrect suggestions were a main reason for distrust, and students concluded that Copilot still needs a competent programmer for some tasks. For our concept (Need 5), it shows that students build trust from what they can see the tool get right or wrong, which supports showing sources and confidence for each answer. The study measured attitudes rather than behavior, involved only students with programming backgrounds, lasted 10 days and concerned code completion, not help with STEM problems in general.

The three baselines are covered in the next part: [NotebookLM](https://notebooklm.google.com), [Khanmigo](https://www.khanmigo.ai/) and [GitHub Copilot](https://github.com/features/copilot).

### Baseline apps

**NotebookLM.** Answers only from the sources the student uploads, with inline citations that open the cited passage, and a Learning Guide mode that asks Socratic questions. Its strength is grounding in the student's own material. Its weaknesses are that the student still has to verify each answer, it does not check what the student already knows, and it shows no confidence marker. The key insight I get from the product is that it's a good opportunity for students to centralize all materials and have an AI assistant that goes over it, still delegating most of the autonomy to the user.

**Khanmigo.** A tutor built into Khan Academy, so it has the exercise context built in and guides with hints and questions instead of answers. Its strength is focused, question-led help. Its weaknesses are that it only covers Khan Academy content, a review found it ignored a student's correct work, and it has no source references. This tool offers a great opportunity as a reference on how to use AI as guardrails, given that it understands the material and is able to communicate information. There are still some worries about how much correctness the AI provides to the user when asking questions and whether it should be able to respond fully to a question.

**GitHub Copilot.** A general coding assistant, included because it is widely used and because one study measured students' trust in it. Its strength is adoption and evidence on how trust forms. Its weaknesses are that it is not built for learning, it has no staged help or knowledge check, and its context is code, not course material. This is different from agentic coding in some sense: it's much more active coding than agentic coding, where you're only sitting. In this instance, you have to still write some guidelines very specifically and see the code changing in front of you.

None of the three checks what the student already knows before helping, and none marks how sure an answer is.

### Most related solution

The closest existing solution is NotebookLM. Students upload their own course material, and answers come only from it, with inline citations that open the cited passage. Its Learning Guide mode also guides in a Socratic style instead of answering directly. What it does not do, as far as we could find, is check what the student already knows before helping, stage support from a hint up to a full solution, or mark how sure an answer is. Khanmigo comes closest on guided help and has its course context built in, but only for Khan Academy content. Our concept combines the three: the student's own course material with source markers, an up-front knowledge check, and help that escalates only as the student needs it.

## A.2 Brainstorming Summary

### How might we statements

At least 5, each traceable to a user need from Milestone 1.

- TODO

### Brainstorming method

TODO — one short paragraph: which method from the lecture was used and why.

### Brainstormed ideas

At least 15 ideas. Give each a label and a 1 to 2 sentence description. Group 2 to 3 ideas per page. Store images in [../../../assets/](../../../assets/).

TODO

## A.3 Affinity Diagram Summary

TODO — embed one image of the affinity diagram. It must map the Milestone 1 user needs, the field research insights and all brainstormed ideas.

### Key themes and insights

TODO — brief summary of the themes that emerged and how they guide the next design steps.
