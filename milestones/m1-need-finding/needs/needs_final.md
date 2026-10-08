# Identified Needs (merged)

This section merges two analyses of the same twelve interviews: `needs_reto.md`, which is organized around what the tool should do, and `needs_nicolas.md`, which is organized around how the student works. Needs found in both are stated once, and each need notes where the two perspectives agree or frame it differently. Participant counts are based on the interview summaries, not on a formal coding of transcripts.

## Participant key

Both source files and the interview files use interviewer-based codes (for example franco_1). This table maps them to P1 to P12. Participants are identified only by role.

| Code | Interview code | Interviewed by | Role |
|---|---|---|---|
| P1 | franco_1 | Franco | Medicine BSc student |
| P2 | franco_2 | Franco | Mechanical Engineering graduate |
| P3 | valentin_1 | Valentin | Mathematics BSc student |
| P4 | valentin_2 | Valentin | Quantitative Finance MSc student |
| P5 | noah_1 | Noah | Mechanical Engineering student |
| P6 | noah_2 | Noah | Robotics student |
| P7 | rafael_1 | Rafael | Computer Science BSc student |
| P8 | rafael_2 | Rafael | Information Systems BSc student |
| P9 | nicolas_1 | Nicolas | Industrial Engineering student |
| P10 | nicolas_2 | Nicolas | Computational Biology student |
| P11 | reto_1 | Reto | Pharmacy BSc student |
| P12 | reto_2 | Reto | Electrical Engineering student |

## Key needs

### Need 1: Short, step-by-step help that goes deeper on request

AI explanations are often too long or too in-depth and arrive all at once. Students want a short first answer, a check that the question was understood, and then the option to go deeper.

- **Evidence (4 of 12):** P5, P6, P11, P12.

> "It's helpful when the help comes step by step and not all at once."
>
> — P11 (translated)

- P12 wants a summary first and, once the question is confirmed, a deeper prompt, because "often it's so much text and you only need a small part of the explanation".
- P5 called answers that are too long or complex unhelpful, and P6 wanted more concise support.
- **Why it matters:** a long answer that goes in a slightly different direction than expected confuses the student instead of helping. Several participants said an answer only became useful after multiple prompts, so a tool could be built around that pattern from the start.
- **Perspectives:** both. Reto's analysis stresses that the AI should clarify the question before answering. Nicolas's analysis adds pacing, with pauses between steps instead of rapid prompts.

### Need 2: Help that matches what the student already knows

Help is unhelpful when it assumes knowledge the student does not have yet. The student then has to explain what they know and prompt again.

- **Evidence (4 of 12):** P2, P5, P6, P11.
- P5 and P6 both said the first answer assumes too much prior knowledge. P2 sometimes "lacked the basics" to understand the help and blamed themselves, not the tool. P11 found an explanation too difficult and had to give the AI the model solution to explain instead.
- **Why it matters:** uploading all lecture slides does not solve this. A professor may post 100 slides while the student only needs help with 20 of them, so a tool that assumes all of them are known skips the basics the student is missing. A few quick opening questions about what is understood, and simple examples that build up from basics, could address this.
- **Perspectives:** both. Reto frames it as tools being unaware of prior knowledge. Nicolas adds the slides case and the idea of a mode for hard analytical topics that asks more questions.

### Need 3: Help grounded in the course material

Students want the AI to know their lecture material and to point back to it instead of bringing in outside content.

- **Evidence (4 of 12):** P3, P4, P9, P11.

> "It brought in topics that weren't from the class to answer a problem."
>
> — P9 (translated)

- P3 asked for more subject-specific context (slides, scripts) and for AI to advise where in the course material to look. P4 noted that AI uses correct theorems but formulates them differently from the script. P11 always uploads lecture notes, because chemistry answers are weaker without them.
- P9 got the most out of a setup where the AI had all of the professor's notes and pointed to which lecture to look up without giving the solution.
- **Why it matters:** an answer that also points to the slides gives the student two ways to check it, by reading the AI response and by finding the content in professor-approved material. It also keeps answers inside what the exam covers.
- **Perspectives:** both, with different weight. Reto lists lecture context as a secondary need and noted that many participants mentioned it. Nicolas ranks it as a key need and adds pointing to the slides as a way to verify answers.

### Need 4: Support that keeps the student doing the thinking

Students want help that guides and supervises their work instead of solving it for them. A finished answer feels fast but leaves less understanding behind. The strongest pattern is that the student starts the work and the AI follows their reasoning, instead of imposing its own approach.

- **Evidence (10 of 12):** P2, P3, P4, P6, P7, P8, P9, P10, P11, P12.
- P3 wants AI to point to where to look in the course material instead of giving the solution, and P4 finds AI too focused on solutions. P7 said a complete code fix created an illusion of competence that backfired in pen-and-paper exams. P8 adopted an AI explanation without forming their own arguments and could not defend it. P6 named cognitive offloading as a concern.
- P2, P8 and P9 already use AI to check their own steps. P10 prefers being walked through the line of thinking, and P11 feels they solve the problem themselves when the AI gives a formula and they do the calculation.

> "I was still trying to solve the problem, even with help."
>
> — P9 (translated)

- **Why it matters:** when students only ask for the next part, they cannot tell whether their own work is correct, and the AI never sees their method. If the AI first walks through the student's attempt, it can correct them along the way, which is especially useful for open-ended questions. A formula can be fine to receive, but students still need to understand where it comes from.
- **Perspectives:** both, merged. Reto's analysis lists three separate secondary needs here (point the way, less solution-oriented, vague or answer-giving help). Nicolas's analysis adds walking the AI through the student's own attempt as a design direction.

### Need 5: Knowing when not to trust the AI

Students need support judging when an AI answer may be wrong. Trust varies strongly between participants, and both extremes cause problems.

- **Evidence (5 of 12):** P1, P2, P4, P11, P12.

> "My peers make mistakes, unlike AI, hence I go directly to it."
>
> — P2

- P1 trusts AI completely, over friends, and could not submit homework after AI-generated code failed and they could not fix it. P11 reported hallucinated answers and wrong source references, and uses another tool for sources. P4 saw AI repeatedly give wrong base cases in a dynamic programming exercise. P12 got poor answers from two assistants on a circuits question and skipped it after 30 minutes.
- **Why it matters:** an AI can be wrong with the same confidence as when it is right, and hallucinations matter more in some fields, such as chemistry or proofs. Pointing to course material (Need 3) is one way to check an answer.
- **Perspectives:** both. Reto frames it as over-trust. Nicolas frames it as making verification easier, for example through references.

## Secondary needs

Each item is tagged R (raised in Reto's analysis), N (Nicolas's) or R+N (both).

- **Pushback before answering (R+N).** P1 tries for under a minute before asking for help, and P9 said "I feel like sometimes maybe I give up a bit before I really need to" (translated). P6 realized they could have solved a problem themselves, and P11 wished they had spent more time on problems they wanted to learn. Time pressure pushes students to ask earlier (P5, P7, P8).
- **AI-generated code is hard to understand (R).** P1 did not know how to correct the code AI gave them.
- **A safe place to ask basic questions (N).** P9 said "you can ask it the dumbest question and it will answer you", and P12 is afraid to admit not fully understanding a professor's answer.
- **Help with formulating the question (N).** P12 often finds the solution while writing the prompt, and P3 puts effort into phrasing questions. Clarifying what is unclear before studying may be part of the support.
- **The aha moment (N).** P12 recognizes a problem the next time after having an aha moment, so emphasizing the core idea could help.
- **Breaks (N).** P11 takes a break or switches problems and comes back with a fresh mind. This is supported by one participant only.
- **Subject dependence (N).** In STEM, going back and forth with AI resembles working with an expert, and TAs and professors are rarely available. Satisfaction likely depends on the person and subject, and we interviewed only STEM students.
- **Vague or answer-giving help (R, to confirm).** Reto's note cites P2 here, but P2's summary says this about slides, other resources and people rather than AI.

## Where the two analyses differ

| Theme | Reto | Nicolas | Relationship |
|---|---|---|---|
| Short, step-by-step answers | Key need | Key need | Same need; Nicolas adds pacing |
| Prior knowledge | Key need | Key need | Same need; Nicolas adds the slides case |
| Course material | Secondary | Key need | Same need, ranked differently |
| Trust and hallucination | Key need | Key need | Same need, framed differently |
| Not solving for the student | Three secondary needs | Key need | Reframed; merged into Need 4 |
| Walk through the student's attempt | Not covered | Key need | Nicolas only; part of Need 4 |
| Pushback and early giving up | Secondary | Time pressure only | Reto catches more |
| AI code is hard to follow | Secondary | Not covered | Reto only |
| Safe to ask, aha moment, breaks, formulating the question | Not covered | Secondary | Nicolas only |

In short, Reto's analysis describes what the tool should do (clarify, push back, restrain), while Nicolas's describes how the student works (reasoning, pacing, time pressure). The merged needs keep both views.

## Hypotheses without interview support

These came up while discussing the interviews and need to be tested before they become needs.

- Students on free tiers may get weaker answers than students with paid subscriptions. P11 and P12 reported bad answers, but neither said which plan they used.
- Students who are less skilled at prompting may benefit less from AI. P9 and P10 use specific setups, such as the tutor prompt and uploading all notes.
- Long blocks of AI text and waiting between prompts may distract students. Only P9 mentioned the waiting.
- After a long struggle, a break may help more than another round of prompting (supported only by P11).
