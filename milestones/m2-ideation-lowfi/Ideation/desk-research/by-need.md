# Sources by Need

Needs are from [needs_final.md](../../../m1-need-finding/needs/needs_final.md). Insights match [sources.md](sources.md). Basis for each source is stated there.

## Need 1: Short, step-by-step help that goes deeper on request

### S1: Help Helps, But Only So Much

- Coaching students on how they seek help made them use on-demand help more deliberately, but did not improve learning outcomes.
- The authors now see on-demand help as less central than they once did, though still useful in some circumstances.

### S2: Segmentation of Worked Examples

- Pre-segmented examples gave equal learning with less effort. Asking students to segment them themselves added effort without better results.
- A related 2011 study by the same group found segmentation helped low-prior-knowledge learners but not high-prior-knowledge ones, which links Needs 1 and 2.
- Implication: the tool should split help into steps, not make students do it. The study used worked examples, not AI chat.

### S17: Thetawise

- Gives hints and step-by-step math help, with a choice between "Tutor Mode" and "Answer Directly". The student picks the mode, the tool does not adapt on its own. Details come from a directory listing, not the company site.

## Need 2: Help that matches what the student already knows

### S3: TeachLM

- Tested Anthropic's Learning mode, OpenAI's Study Mode and Google's Guided Learning by hand.
- Current study modes tend to rephrase a problem when a student is confused instead of diagnosing the confusion, and spend practically no time on the student's level, goal or motivation.
- Fine-tuning on 100,000 hours of real tutoring raised student talk time, dialogue turns and personalization. These are the authors' own evaluation results.

### S4: Learning Context framework

- A white paper arguing that AI tutors should model the learner's cognitive, affective and sociocultural context.
- Proposes stored context shared through the Model Context Protocol, so tools can personalize over time.

### S16: Khanmigo

- Built to guide students with questions instead of handing over answers (Need 4). A review cites a 2024 analysis where it ignored a student's correct work and questioned them as if they knew nothing, which is a Need 2 gap.

### S10 and S11: Gemini Guided Learning and ChatGPT Study Mode

- Both open with questions about the student's goal and level before teaching.
- Gemini adds a diagnostic quiz tied to uploaded class material.

## Need 3: Help grounded in the course material

No dedicated section in the original doc. Covered by S12, S13, S18 and S4.

### S13: Claude

- Lets you upload documents as course context.

### S18: ScrollToStudy

- Builds a feed of flashcards, quizzes and summaries from the student's own materials. Made for passive review, not for getting unstuck on a problem.

### S12: NotebookLM

- See Need 5 below for the full findings.

## Need 4: Support that keeps students doing the thinking

### S8: The Rundown post

- The author built a "thought-partner agent" that interviews the user before producing any recommendation or draft, asking one focused question at a time about reasoning, evidence, assumptions, audience and uncertainty, then hands a structured synthesis to a separate agent.
- Meta-information: shows how people are approaching AI as a partner in guiding how to discuss or complete tasks, not just as an answer generator.
- Caveats: a community post about writing and decision-making, not research. No data, no examples and no comments. It interviews about reasoning, not knowledge level, and it delays output rather than refusing it.

### S9: Claude Code learning output style

- The mode does not perform everything. It leaves TODOs in the templates so the user makes decisions. The docs say it also applies to design decisions (`/output-style learning`).

## Need 5: Knowing when not to trust the AI

### S12: NotebookLM

- Answers come only from uploaded sources (PDFs, Docs, Slides, web pages, audio, YouTube transcripts) and carry inline citations that open the highlighted passage. It also generates summaries, flashcards, quizzes and mind maps from the same sources.
- One small study (40 responses) reported about 13% hallucinations versus about 40% for Gemini and ChatGPT. A University of Michigan review says it feels lower but would need research to prove.
- A citation does not guarantee a correct answer. A preprint reports it sometimes inventing content or using "general knowledge", and another source reports "source blindness" (saying "not found" when the material exists).
- It also has a Learning Guide mode (rolled out September 2025) that asks probing, open-ended questions in a Socratic style instead of answering directly, and adapts explanation depth to follow-up prompts. I found no up-front check of the student's knowledge level and no hint ladder, so these gaps remain.

### S14: Scite

- A research search and verification tool. It helps judge how trustworthy or contested a scientific claim is, beyond finding papers.

### S5: Beyond the Benefits

- A systematic review of 224 papers (2022 to 2025) on the harms of generative AI in computing education, coded by category such as academic integrity, cognitive effects and trust issues. Detailed findings not checked.

### S6: Evolution of Programmers' Trust

- 71 upper-division CS students used Copilot. Trust was measured after one hour and after 10 days, and rose on average.
- Seeing Copilot be correct, understanding how it uses codebase context and learning NLP basics raised trust. Incorrect suggestions were a main reason for distrust. Students concluded it still needs a competent programmer.
- Limits: measured attitudes, not behavior; only students with programming backgrounds; 10 days.

### S19: GitHub Copilot

- The tool studied in S6. A general coding assistant: files, repositories and issues can be attached as context (`@` and `#`), and `/explain` explains code. Visual Studio asks clarifying questions when context is unclear and lists the instruction files it used under References.
- A 2021 technical-preview study showed a per-completion score ("mean prob."), but I could not confirm that today's product shows a confidence marker.
- Not built for learning: no staged help or knowledge check found.

### S7: Trust and Reliance on AI in Education

- 432 undergraduates solved Python problems with a chatbot that gave accurate and deliberately misleading suggestions.
- Higher trust went with lower appropriate reliance (accepting correct advice and rejecting incorrect advice), moderated by AI literacy and need for cognition.

## Baseline only

### S15: Turbo AI

- Turns lectures and uploads into notes, flashcards, quizzes and audio summaries. It produces study material rather than guiding the student through problems, so it relates little to our needs.
