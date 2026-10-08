# Identified Needs

This section presents the needs we identified from the twelve interviews. Participant counts are based on the interview summaries, not on a formal coding of transcripts.

## Key needs

### Need 1: Short, step-by-step help that goes deeper on request

AI explanations are often too long or too in-depth and arrive all at once. Students want a short first answer, a check that the question was understood, and then the option to go deeper.

> "It's helpful when the help comes step by step and not all at once."\
> — P11

- **Evidence (4 of 12):** P5, P6, P11, P12.
- P12 wants a summary first and, once the question is confirmed, a deeper prompt, because "often it's so much text and you only need a small part of the explanation".
- P5 called answers that are too long or complex unhelpful, and P6 wanted more concise support.
- **Why it matters:** a long answer that goes in a slightly different direction than expected confuses the student instead of helping. Several participants said an answer only became useful after multiple prompts, so a tool could be built around that pattern from the start.

### Need 2: Help that matches what the student already knows

Help is unhelpful when it assumes knowledge the student does not have yet. The student then has to explain what they know and prompt again.

- **Evidence (4 of 12):** P2, P5, P6, P11.
- P5 and P6 both said the first answer assumes too much prior knowledge. P2 sometimes "lacked the basics" to understand the help and blamed themselves, not the tool. P11 found an explanation too difficult and had to give the AI the model solution to explain instead.
- **Why it matters:** uploading all lecture slides does not solve this. A professor may post 100 slides while the student only needs help with 20 of them, so a tool that assumes all of them are known skips the basics the student is missing. A few quick opening questions about what is understood, and simple examples that build up from basics, could address this.

### Need 3: Help grounded in the course material

Students want the AI to know their lecture material and to point back to it instead of bringing in outside content.

> "It brought in topics that weren't from the class to answer a problem."\
> — P9

- **Evidence (4 of 12):** P3, P4, P9, P11.
- P3 asked for more subject-specific context (slides, scripts) and for AI to advise where in the course material to look. P4 noted that AI uses correct theorems but formulates them differently from the script. P11 always uploads lecture notes, because chemistry answers are weaker without them.
- P9 got the most out of a setup where the AI had all of the professor's notes and pointed to which lecture to look up without giving the solution.
- **Why it matters:** an answer that also points to the slides gives the student two ways to check it, by reading the AI response and by finding the content in professor-approved material. It also keeps answers inside what the exam covers.

### Need 4: Support that keeps the student doing the thinking

Students want help that guides and supervises their work instead of solving it for them. A finished answer feels fast but leaves less understanding behind. The strongest pattern is that the student starts the work and the AI follows their reasoning, instead of imposing its own approach.

> "I was still trying to solve the problem, even with help."\
> — P9

- **Evidence (10 of 12):** P2, P3, P4, P6, P7, P8, P9, P10, P11, P12.
- P3 wants AI to point to where to look in the course material instead of giving the solution, and P4 finds AI too focused on solutions. P7 said a complete code fix created an illusion of competence that backfired in pen-and-paper exams. P8 adopted an AI explanation without forming their own arguments and could not defend it. P6 named cognitive offloading as a concern.
- P2, P8 and P9 already use AI to check their own steps. P10 prefers being walked through the line of thinking, and P11 feels they solve the problem themselves when the AI gives a formula and they do the calculation.

- **Why it matters:** when students only ask for the next part, they cannot tell whether their own work is correct, and the AI never sees their method. If the AI first walks through the student's attempt, it can correct them along the way, which is especially useful for open-ended questions. A formula can be fine to receive, but students still need to understand where it comes from.

### Need 5: Knowing when not to trust the AI

Students need support judging when an AI answer may be wrong. Trust varies strongly between participants, and both extremes cause problems.

> "My peers make mistakes, unlike AI, hence I go directly to it."\
> — P2

- **Evidence (5 of 12):** P1, P2, P4, P11, P12.
- P1 trusts AI completely, over friends, and could not submit homework after AI-generated code failed and they could not fix it. P11 reported hallucinated answers and wrong source references, and uses another tool for sources. P4 saw AI repeatedly give wrong base cases in a dynamic programming exercise. P12 got poor answers from two assistants on a circuits question and skipped it after 30 minutes.
- **Why it matters:** an AI can be wrong with the same confidence as when it is right, and hallucinations matter more in some fields, such as chemistry or proofs. Pointing to course material (Need 3) is one way to check an answer, and tools should make checking easier, for example through references.

## Secondary needs

These needs were raised by fewer participants or with thinner evidence than the key needs. Each is stated as a problem the student has, not as a feature.

### Students under time pressure still need to learn, not just finish

When deadlines or workload increase, students ask for help sooner and accept more complete answers, even when they would rather learn the material.

- **Evidence (5 of 12):** P5 uses AI more when time is limited, P7 drops from 15 to 20 minutes of independent effort to a couple of minutes near a deadline, P8 welcomed a finished structure to speed up completion, and P11 and P12 ask for help when they are falling behind or it is getting late.
- **Why it matters:** the same students said that complete answers reduce what they remember, so the moments when they rely on AI most are the moments when it helps learning least.

### Students need room to struggle before help arrives

Some students ask for help before they have really tried, and only notice afterwards that they could have solved the problem themselves.

- **Evidence (4 of 12):** P1 tries for under a minute before asking, and sometimes regrets it. P6 realized they could have solved a problem themselves if they had struggled longer. P11 wished they had spent more time on problems they wanted to learn. P9 said "I feel like sometimes maybe I give up a bit before I really need to".
- **Why it matters:** productive struggle is where much of the learning happens, and quick answers make it easy to skip. P6 named cognitive offloading as a concern and said they can solve a similar problem on their own only about half the time after receiving help.

### Students need to understand the core idea well enough to solve similar problems alone

Getting an answer is not the same as being able to solve the next problem. Students described the difference between speeding through a problem set and the moment the core idea clicks.

- **Evidence (4 of 12):** P12 said they probably recognize a problem the next time only when they had an "aha moment", and not when they were speeding through. P11 can solve it alone next time when they really tried to understand it. P10 handles very similar problems, but a change in wording or framing makes applying the idea hard. P6 solves similar problems alone about half the time.
- **Why it matters:** if help produces answers without understanding of the underlying idea, students have to ask again for each variation, and they struggle on exams where no help is available.

### Students need to work out what they are actually stuck on

Before asking for help, students often have to clarify the question for themselves, and how well they do this affects the answer they get.

- **Evidence (2 of 12):** P12 often finds the solution while writing out the problem for the AI. P3 first works out what the question to ChatGPT will be, and puts effort into formulating it so the AI gives the explanation they want.
- **Why it matters:** a vague question leads to a vague or too-long answer (see Needs 1 and 2). Students who cannot yet pin down what they do not understand may be the ones helped least.

### Students need to ask basic questions without feeling judged

Students hold back questions they think they should already know the answer to, especially with professors.

- **Evidence (2 of 12):** P12 is afraid to admit they do not fully understand a professor's answer, and described good help as help where they are allowed to ask "stupid" questions without judgement. P9 values that "you can ask it the dumbest question and it will answer you".
- **Why it matters:** unasked basic questions leave gaps that make later material harder. AI currently removes this barrier, so any change to how AI helps should keep it.

### Students need to understand code they did not write

Code from an AI is only useful if the student can follow it and fix it when it breaks.

- **Evidence (2 of 12):** P1 did not know how to correct the code the AI gave them and could not submit the homework. P7 received a complete code fix, skipped the hands-on debugging, and later had mental blocks in pen-and-paper exams.
- **Why it matters:** working code without understanding leaves students stuck as soon as something changes, and it gives a false sense of competence.

### Students need help that fits the kind of subject and task

What counts as helpful differs by subject, so one style of help does not suit every course.

- **Evidence (3 of 12):** P11 studies mostly by memorizing and needs active recall, not explanations. P4 finds that for general concepts without a "recipe", help from a person is more valuable than from AI. P1 relies on AI for maths and physics but found it failed on coding.
- **Why it matters:** a tool tuned to step-by-step problem solving may not help students whose courses are mainly about memorizing or about open-ended reasoning. Our sample covers only STEM students.

### Students need a way to recover when they are stuck or frustrated

Frustration pushes students to hand the whole problem to AI, and some students found that stepping back works better.

- **Evidence (2 of 12):** P12 sometimes gets so frustrated that they do everything with an AI, and otherwise tries to calm down and reread the question first. P11 takes a break or solves a different problem and returns with a fresh mind.
- **Why it matters:** this has the thinnest support among our needs, since only two participants described it. It suggests that the point where a student is most likely to ask for a full answer may be the point where a pause would help most.
