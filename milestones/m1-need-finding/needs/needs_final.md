# Identified Needs

This section presents the needs we identified from the twelve interviews. Participant counts are based on the interview summaries, not on a formal coding of transcripts. Each key need is connected to our three personas: Sofia (the efficiency-seeking learner), Peter (the deadline-driven learner) and Max (the validation-seeking learner).

## Key needs

### Need 1: Short, step-by-step help that goes deeper on request

AI explanations are often too long or too in-depth and arrive all at once. Students want a short first answer, a check that the question was understood, and then the option to go deeper.

> "It's helpful when the help comes step by step and not all at once."\
> — P11

- **Evidence (4 of 12):** P5, P6, P11, P12.
- P12 wants a summary first and, once the question is confirmed, a deeper prompt, because "often it's so much text and you only need a small part of the explanation".
- P5 called answers that are too long or complex unhelpful, and P6 wanted more concise support.
- **Why it matters:** a long answer that goes in a slightly different direction than expected confuses the student instead of helping. Several participants said an answer only became useful after multiple prompts, so a tool could be built around that pattern from the start.
- **Personas:** Sofia (efficiency-seeking) is frustrated by explanations that are too long or complicated.

### Need 2: Help that matches what the student already knows

Help is unhelpful when it assumes knowledge the student does not have yet. The student then has to explain what they know and prompt again.

- **Evidence (4 of 12):** P2, P5, P6, P11.
- P5 and P6 both said the first answer assumes too much prior knowledge. P2 sometimes "lacked the basics" to understand the help and blamed themselves, not the tool. P11 found an explanation too difficult and had to give the AI the model solution to explain instead.
- **Why it matters:** uploading all lecture slides does not solve this. A professor may post 100 slides while the student only needs help with 20 of them, so a tool that assumes all of them are known skips the basics the student is missing. A few quick opening questions about what is understood, and simple examples that build up from basics, could address this.
- **Personas:** Sofia is also held back by answers that assume too much prior knowledge and by having to explain the context of a problem again and again.

### Need 3: Help grounded in the course material

Students want the AI to know their lecture material and to point back to it instead of bringing in outside content.

> "It brought in topics that weren't from the class to answer a problem."\
> — P9

- **Evidence (4 of 12):** P3, P4, P9, P11.
- P3 asked for more subject-specific context (slides, scripts) and for AI to advise where in the course material to look. P4 noted that AI uses correct theorems but formulates them differently from the script. P11 always uploads lecture notes, because chemistry answers are weaker without them.
- P9 got the most out of a setup where the AI had all of the professor's notes and pointed to which lecture to look up without giving the solution.
- **Why it matters:** an answer that also points to the slides gives the student two ways to check it, by reading the AI response and by finding the content in professor-approved material. It also keeps answers inside what the exam covers.
- **Personas:** Max (validation-seeking) is let down by explanations that do not match the course context, and Sofia by the need to repeat the context.

### Need 4: Support that keeps the student doing the thinking

Students want help that guides and supervises their work instead of solving it for them. A finished answer feels fast but leaves less understanding behind. The strongest pattern is that the student starts the work and the AI follows their reasoning, instead of imposing its own approach.

> "I was still trying to solve the problem, even with help."\
> — P9

- **Evidence (10 of 12):** P2, P3, P4, P6, P7, P8, P9, P10, P11, P12.
- P3 wants AI to point to where to look in the course material instead of giving the solution, and P4 finds AI too focused on solutions. P7 said a complete code fix created an illusion of competence that backfired in pen-and-paper exams. P8 adopted an AI explanation without forming their own arguments and could not defend it. P6 named cognitive offloading as a concern.
- P2, P8 and P9 already use AI to check their own steps. P10 prefers being walked through the line of thinking, and P11 feels they solve the problem themselves when the AI gives a formula and they do the calculation.

- **Why it matters:** when students only ask for the next part, they cannot tell whether their own work is correct, and the AI never sees their method. If the AI first walks through the student's attempt, it can correct them along the way, which is especially useful for open-ended questions. A formula can be fine to receive, but students still need to understand where it comes from.
- **Personas:** all three: Sofia gets a full solution when a hint was enough, Max is given help that replaces his reasoning instead of checking it, and Peter (deadline-driven) later finds he cannot solve a similar problem without AI.

### Need 5: Knowing when not to trust the AI

Students need support judging when an AI answer may be wrong. Trust varies strongly between participants, and both extremes cause problems.

> "My peers make mistakes, unlike AI, hence I go directly to it."\
> — P2

- **Evidence (5 of 12):** P1, P2, P4, P11, P12.
- P1 trusts AI completely, over friends, and could not submit homework after AI-generated code failed and they could not fix it. P11 reported hallucinated answers and wrong source references, and uses another tool for sources. P4 saw AI repeatedly give wrong base cases in a dynamic programming exercise. P12 got poor answers from two assistants on a circuits question and skipped it after 30 minutes.
- **Why it matters:** an AI can be wrong with the same confidence as when it is right, and hallucinations matter more in some fields, such as chemistry or proofs. Pointing to course material (Need 3) is one way to check an answer, and tools should make checking easier, for example through references.
- **Personas:** Max relies on AI as external confirmation of his reasoning, which can leave him less confident, and Peter gets AI solutions that work but do not explain the reasoning.

## Secondary needs

These needs were raised by fewer participants or with thinner evidence than the key needs. Each is stated as a problem the student has.

### Students under time pressure still need to learn, not just finish

When deadlines approach, students ask for help sooner and accept more complete answers, even when they would rather learn. Evidence: P7 drops from 15 to 20 minutes of independent effort to a couple of minutes near a deadline (also P5, P8, P11, P12).

### Students need room to struggle before help arrives

Some students ask before they have really tried, and only afterwards realize they could have solved the problem themselves. Evidence: P9 said "I feel like sometimes maybe I give up a bit before I really need to".

### Students need to understand the core idea well enough to solve similar problems alone

Getting an answer is not the same as being able to solve the next problem. Evidence: P12 probably recognizes a problem next time only after an "aha moment" and not when speeding through, and P10 struggles when the wording of a similar problem changes.

### Students need to work out what they are actually stuck on

Students often have to clarify the question for themselves before asking, and this shapes the answer they get. Evidence: P12 often finds the solution while writing out the problem for the AI.

### Students need to ask basic questions without feeling judged

Students hold back questions they think they should already know, especially with professors. Evidence: P9 said "you can ask it the dumbest question and it will answer you".

### Students need to understand code they did not write

Code from an AI is only useful if the student can follow it and fix it when it breaks. Evidence: P1 did not know how to correct the code the AI gave them and could not submit the homework.

### Students need help that fits the kind of subject and task

What counts as helpful differs by subject, so one style of help does not suit every course. Evidence: P11 mostly memorizes and needs active recall, while P4 finds human help more valuable for concepts without a "recipe".

### Students need a way to recover when they are stuck or frustrated

Frustration pushes students to hand the whole problem to AI, while stepping back worked for some. Evidence: P11 takes a break or solves a different problem and returns with a fresh mind (only P11 and P12 described this).

## Critical reflection

The needs emerged from comparing twelve interview summaries across eleven fields and grouping what kept recurring. We never mentioned AI in our questions, yet every participant brought it up on their own, so the needs describe how students already use AI as their main source of help. The main aha moment was that, beyond occasional wrong answers, the most common complaint is not accuracy but fit, because the help does not match the student: it is too long, assumes knowledge they lack, ignores their course, or finishes the work they wanted to do themselves. We also did not expect to find both complete trust (P1, P2) and active distrust (P11) of the same tools, or that the most valued use was students leading while the AI follows their reasoning (P2, P8, P9). These findings connect directly to our goal of understanding when help is actually helpful. They show that help is useful when it is sized to the student, grounded in their material and leaves the thinking to them, which matters because the speed of AI makes it easy to gain an answer and lose the learning, as P7 and P8 experienced in exams and discussions. These needs will guide ideation in the next milestone.
