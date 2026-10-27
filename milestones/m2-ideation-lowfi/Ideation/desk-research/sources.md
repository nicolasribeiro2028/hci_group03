# Master Source List

IDs are for cross-referencing only. Basis: S1 to S7 and S12 from abstracts and web search results (full texts not read), S8 from the post itself, S9 to S11 and S13 to S14 from the team Google Doc, S15 to S18 from app-store listings and reviews. Verify before citing.

| ID | Source | Type | Need | Insight |
|---|---|---|---|---|
| S1 | Help Helps, But Only So Much: Research on Help Seeking with Intelligent Tutoring Systems ([DOI](https://doi.org/10.1007/s40593-015-0089-1)) | Paper | 1 | Coaching students on how to seek help made them use it more deliberately but did not improve learning, so the design of the help itself matters more. |
| S2 | Segmentation of Worked Examples: Effects on Cognitive Load and Learning ([link](https://onlinelibrary.wiley.com/doi/10.1002/acp.1832)) | Paper | 1 | Pre-segmented examples gave equal learning with less effort, but making students segment them themselves backfired, so the tool should do the splitting. Segmentation helped low-prior-knowledge learners more (a related 2011 study), which links Needs 1 and 2. |
| S3 | TeachLM (2025) ([arXiv](https://arxiv.org/pdf/2510.05087)) | Paper | 2 | Current study modes rephrase a problem instead of diagnosing the confusion and barely establish the student's level. Training on real tutoring raised student talk time and personalization (the authors' own evaluation). |
| S4 | Learning Context: A Unified Framework and Roadmap for Context-Aware AI in Education ([arXiv](https://arxiv.org/abs/2512.24362)) | Paper | 2, 3 | AI tutors should model the learner's cognitive, affective and sociocultural context and keep it stored, so they personalize over time. |
| S5 | Beyond the Benefits: A Systematic Review of the Harms and Consequences of Generative AI in Computing Education ([arXiv](https://arxiv.org/abs/2510.04443)) | Paper | 5 | A review of 224 papers codes the harms of generative AI in computing education, including cognitive effects and trust issues. Detailed findings not checked. |
| S6 | Evolution of Programmers' Trust in Generative AI Programming Assistants ([arXiv](https://arxiv.org/abs/2509.13253)) | Paper | 5 | 71 CS students' trust in Copilot rose over 10 days. Seeing it be correct and understanding how it uses context raised trust, and incorrect suggestions lowered it. Attitudes were measured, not behavior. |
| S7 | Trust and Reliance on AI in Education: AI Literacy and Need for Cognition as Moderators ([arXiv](https://arxiv.org/abs/2604.01114)) | Paper | 5 | Higher trust went with less appropriate reliance (students were worse at telling correct from wrong AI advice), moderated by AI literacy and need for cognition. |
| S8 | The Rundown community post on a thought-partner agent ([link](https://app.therundown.ai/community/posts/c67d40aa-6810-47f6-bc66-a558f16872b8)) | Blog / post | 4 | Has the AI interview the user one question at a time about their reasoning before drafting. Shows how people treat AI as a partner that guides how to discuss or complete tasks. A community post, not research. |
| S9 | Claude Code "learning" output style ([docs](https://code.claude.com/docs/en/output-styles#learning)) | Product docs | 4 | The mode leaves TODOs for the user, so the user makes the decisions. |
| S10 | Gemini Guided Learning | Product | 2 | It asks about goal and level before teaching, and adds a diagnostic quiz tied to uploaded class material. |
| S11 | ChatGPT Study Mode | Product | 2 | It asks about goal and level before teaching. |
| S12 | NotebookLM (Gemini Notebook) | Product | 2, 3, 5 | Answers come only from uploaded sources, with citations that open the highlighted passage. One small study found about 13% hallucinations versus 40% for general chatbots, but citations do not guarantee correctness. Its Learning Guide mode asks probing questions in a Socratic style, but no hint ladder or up-front knowledge check was found. |
| S13 | Claude (document upload as course context) | Product | 3 | Course documents can be uploaded as context. |
| S14 | Scite ([scite.ai](http://scite.ai)) | Product | 5 | It helps judge how trustworthy or contested a scientific claim is, not just where to find papers. |
| S15 | Turbo AI ([link](https://www.turbo.ai/)) | Product | baseline only | It produces notes, flashcards, quizzes and audio summaries but does not guide students through problems. |
| S16 | Khanmigo, Khan Academy ([link](https://www.khanmigo.ai/)) | Product | 4, 2 | It guides with questions instead of answers, but a review found it ignored a student's correct work. |
| S17 | Thetawise ([link](https://thetawise.ai/)) | Product | 1 | It gives hints and step-by-step math help, but the student picks Tutor Mode or Answer Directly. |
| S18 | ScrollToStudy ([link](https://scrolltostudy.com/)) | Product | 3 | It builds a feed of flashcards and quizzes from the student's own material, for passive review. |
| S19 | GitHub Copilot ([link](https://github.com/features/copilot)) | Product | 5 | A general coding assistant, the tool studied in S6. It can attach files and repos as context and explain code (`/explain`), but it is not built for learning and it does not stage help or check what the student knows. |

## Counts

- Papers: 7
- Products: 10
- Blog posts and docs: 2
- Total: 19 (requirement: at least 10)
