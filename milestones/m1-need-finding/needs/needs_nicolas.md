# Needs: Nicolas's Perspective

Notes toward Section 5 (Identified Needs) of the need-finding report, written from my reading of the interview summaries. Participant codes follow the report (P1 to P12, the same order as Interviews 1 to 12 in the supplementary materials). This document is separate from [needs_reto.md](needs_reto.md), and the two are to be merged into the report.

## Participant key

Reto's notes and the interview files use interviewer-based codes (for example franco_1). This table maps them to the report's P1 to P12. Participants themselves are identified only by role.

| Code | Interview code | Interviewed by | Role | Summary file |
|---|---|---|---|---|
| P1 | franco_1 | Franco | Medicine BSc student | interview_summaries_franco_fierro.md |
| P2 | franco_2 | Franco | Mechanical Engineering graduate | interview_summaries_franco_fierro.md |
| P3 | valentin_1 | Valentin | Mathematics BSc student | Summary_interview_valentin_fontana.md |
| P4 | valentin_2 | Valentin | Quantitative Finance MSc student | Summary_interview_valentin_fontana.md |
| P5 | noah_1 | Noah | Mechanical Engineering student | interview_summaries_noah_faoro.md |
| P6 | noah_2 | Noah | Robotics student | interview_summaries_noah_faoro.md |
| P7 | rafael_1 | Rafael | Computer Science BSc student | interview_summaries_rafael.md |
| P8 | rafael_2 | Rafael | Information Systems BSc student | interview_summaries_rafael.md |
| P9 | nicolas_1 | Nicolas | Industrial Engineering student | summary_nicolas_interview_01.md |
| P10 | nicolas_2 | Nicolas | Computational Biology student | nicolas_interview_02.md |
| P11 | reto_1 | Reto | Pharmacy BSc student | interview_summaries_reto_russmann.md |
| P12 | reto_2 | Reto | Electrical Engineering student | interview_summaries_reto_russmann.md |

All summary files are in `interviews/summaries/`.

## Key needs

### Walk through my own attempt before solving

AI tends to fit a student's work into its own approach. Students get more from AI when it first understands their reasoning and method, and then corrects them as they go. This matters most for open-ended questions.

- **Evidence:** P2 uses AI to check what they have done so far and where they got stuck. P8 asks the tool to check the sequence of their analytical steps. P9 guided the AI with all the professor's notes and felt in control. P10 prefers being walked through the line of thinking rather than receiving only the answer.
- **Why it matters:** "Solve the next part" leaves the student unsure whether their own work is correct, and the AI never sees their thinking.

### Short answers first, then step by step

Help works better in small steps with room to go deeper than as one long response. Step by step with pauses can be more effective than firing prompts one after another.

- **Evidence:** P11 said help is best when it arrives step by step. P12 wants a summary first, then a deeper prompt once the question is confirmed. P5 and P6 found long or complex answers unhelpful.
- **Why it matters:** a long block of text can overwhelm a student who is already struggling.

### Help that does not assume prior knowledge

If a student uploads all lecture slides, the AI may assume they know everything in them, while they may only know part of the material.

- **Evidence:** P5 and P6 said the first answer assumes too much prior knowledge. P2 "lacked the basics" to understand the help.
- **Why it matters:** the student has to explain what they know and prompt again. A few quick opening questions about what the student understands could fix this. For hard analytical topics, a mode that asks more questions and builds simple examples first could provide building blocks.

### Course material as the reference

The AI needs the lecture material to give relevant answers. It should also point to the place in the slides, so students can read the AI's response and find the professor-based content themselves.

- **Evidence:** P9 said the AI brought in formulas that did not belong to the course. P11 always uploads lecture notes because chemistry answers are weaker without them. P3 wants AI to advise where to look in the course material.
- **Why it matters:** cautious students can check the AI against trusted, professor-based information.

### Know when to trust the AI

Students trust AI over friends because friends may be wrong, but hallucinations matter a lot in some fields.

- **Evidence:** P2 said peers make mistakes, unlike AI. P11 reported hallucinated answers and wrong source references and uses another tool for sources.
- **Why it matters:** prompting for references can help students notice hallucinations. Tools should make checking easier.

## Secondary needs and observations

- **Formulas versus calculations.** P11 feels they solve the problem themselves when AI provides the formula and they calculate. This is nuanced: students still need to understand where the formula comes from, and only memorizing it is something to revisit later.
- **Fear of asking professors.** P12 said professors assume students already know the basics, and students are afraid to ask trivial questions. AI removes that barrier (P9: "you can ask it the dumbest question").
- **The aha moment.** P12 recognizes a problem next time when they had an aha moment. Emphasizing the core idea could help students understand more.
- **Time pressure.** Students with time use AI less. P5, P7 and P8 ask earlier under deadlines.
- **Clarity before studying.** Is the content clear to the student before they start, or is there vagueness in what they want to do? P12 often finds the solution while writing the prompt.
- **Taking a break.** P11 returns to a problem after a break or another problem. Asking AI for an answer after already overflowing with information may be less effective than a break.
- **Subject dependence.** In STEM, working back and forth with AI resembles working with an expert, which is more efficient than a book alone, since TAs and professors are rarely at hand. Satisfaction probably depends on the person and subject. We interviewed only STEM students.
- **Distraction.** P9 said the time between prompts may increase distraction.

## Ideas without direct interview support

These came up as my own thoughts and need to be checked before they go into the report as needs.

- People without a paid subscription may get worse answers from free models (P11 and P12 had bad answers, but neither said which plan they had).
- Students who are not AI-literate may benefit less. P9 and P10 use specific setups (tutor prompt, full notes).
- Large blocks of AI text may distract students.
