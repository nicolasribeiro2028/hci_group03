# Need-Finding Report — Group 3

## 1. Topic & Motivation

Our topic is *When is help actually helpful?* in the context of STEM students who study and solve problems with the support of AI. Students now reach for AI first, often within minutes of getting stuck, yet it is unclear when that help leads to understanding and when it only produces an answer. Technical content makes this especially visible: even with a capable assistant, students can still struggle to follow an explanation, trust a result or transfer it to a new problem.

We framed the interviews around help in general rather than AI. Seeing how students judge help from peers, professors, course material and AI let us ask what AI would need to do to be more useful for learning.

## 2. Research Questions

- What makes help useful or unhelpful for STEM students who are learning or solving problems?
- How do students decide when to keep trying alone and when to ask for help, and from whom?
- What do students gain and lose when AI is their main source of help?

## 3. Methodology

- **Number of participants:** 12 STEM students and recent graduates (11 fields, mostly BSc, one Master's, one recent graduate).
- **Recruitment approach:** convenience sampling among friends and colleagues. We deliberately did not interview only Computer Science students.
- **Interview format:** semi-structured, following a 14-question script in four steps (profiling, a concrete example of getting stuck, useful versus unhelpful help, reflection). No question mentioned AI. Some interviews were held in another language and are translated. Duration and setting (in person or remote): TODO, team to confirm.
- **Analysis method:** we read all twelve interview summaries, grouped recurring statements into candidate needs, and counted for each need how many participants' summaries support it. Counts are based on the summaries, not on a formal coding of transcripts.

## 4. Participants Overview

| ID | Background | Relevant context | Supplementary |
|---|---|---|---|
| P1 | Medicine BSc | Asks for help in under 1 minute; trusts AI fully | Interview 1 |
| P2 | Mechanical Engineering BSc (graduate) | Tries about 15 minutes; uses AI to check progress | Interview 2 |
| P3 | Mathematics BSc | AI after 5 minutes, people after 90 | Interview 3 |
| P4 | Quantitative Finance MSc | Course material first, then AI | Interview 4 |
| P5 | Mechanical Engineering BSc | Rereads material, then ChatGPT | Interview 5 |
| P6 | Robotics BSc | AI after about 2 minutes | Interview 6 |
| P7 | Computer Science BSc | 15–20 minutes alone; terminal AI assistant | Interview 7 |
| P8 | Information Systems BSc | Paid ChatGPT tab as a validation partner | Interview 8 |
| P9 | Industrial Engineering BSc | AI after 10–15 minutes; shifted from people to AI | Interview 9 |
| P10 | Computational Biology BSc | About 1 hour alone; prompts AI to act as a tutor | Interview 10 |
| P11 | Pharmacy BSc | AI within 1 minute in semester, 20 minutes for exams | Interview 11 |
| P12 | Electrical Engineering BSc | 5–10 minutes on maths; asks AI for hints | Interview 12 |

## 5. Identified Needs

Each need lists the supporting evidence, how many of the 12 participants expressed it, and why it matters. Needs 1 to 5 are our key needs; further needs are listed after them.

### Need 1: Short, step-by-step help that goes deeper on request

AI explanations are often too long or too in-depth, and arrive all at once. Students want a short answer first, confirmation that the question was understood, and then the option to go deeper. This is the clearest "aha" need in our data.

- **Evidence (4 of 12):** P5, P6, P11, P12.

> "It's helpful when the help comes step by step and not everything at once."
>
> — P11 (translated)

- P12 would like AI to give a summary first and, once the question is confirmed, go deeper, because "often it's so much text and you only need a small part of the explanation".
- P5 called answers that are too long or complex unhelpful, and P6 wanted more concise support.
- **Why it matters:** a long answer that heads in a slightly different direction confuses instead of helps. Several participants said the answer only became useful after multiple follow-up prompts, so a tool could be built around that multi-step pattern from the start.

### Need 2: Help that matches what the student already knows

Help is unhelpful when it assumes knowledge the student does not have yet, and the student then has to explain what they know and prompt again.

- **Evidence (4 of 12):** P2, P5, P6, P11.
- P5 and P6 both said the first answer assumes too much prior knowledge. P2 said they sometimes "lacked the basics" to understand the help, and blamed themselves rather than the tool. P11 found Claude's explanation of a statistics problem too difficult and they had to give it the model solution to explain instead.
- P12 related: they usually cannot solve a problem because they lack part of the underlying theory.
- **Why it matters:** uploading the lecture slides is not enough. A professor may post 100 slides while the student only needs help with 20 of them, and a tool that assumes the student knows all of them will skip the basics the student is missing. A few quick opening questions about what is already understood could fix this, and building up from simple examples would give the student building blocks for hard topics.

### Need 3: Help grounded in the course material

Students want AI to know their lecture material and to point back to it, instead of bringing in outside content.

- **Evidence (4 of 12):** P3, P4, P9, P11.

> "It brought in topics that weren't from the class to answer a problem."
>
> — P9 (translated)

- P3 asked for more subject-specific context (slides, scripts) and for AI to advise where in the course material to look rather than just giving the answer. P4 noted that AI uses correct theorems but formulates them differently from the script. P11 always uploads lecture notes because without them AI performs worse, especially in chemistry.
- P9 got the most out of a setup where the AI had all of the professor's notes and pointed to which lecture to look up without giving the solution.
- **Why it matters:** an answer that also points to the slides gives the student two options, reading the AI response or finding the content in professor-approved material. That makes the answer easier to verify and more trustworthy, and keeps the answer inside what the exam will cover.

### Need 4: Knowing when not to trust the AI

Students need support in judging when an AI answer may be wrong. Trust varies a lot between participants, and both extremes cause problems.

- **Evidence (5 of 12):** P1, P2, P4, P11, P12.

> "My peers make mistakes, unlike AI, hence I go directly to it."
>
> — P2

- P1 completely trusts AI, over friends, and was left unable to submit homework after AI-generated code failed and they could not fix it. P11 reported hallucinated answers and wrong source references, and uses a different tool for sources. P4 saw AI repeatedly give wrong base cases in a dynamic programming exercise. P12 got poor answers from two different assistants on a circuits question and skipped it after 30 minutes.
- **Why it matters:** AI can be wrong with the same confidence as when it is right, and hallucinations matter more in some fields (for example chemistry or proofs) than in others. Pointing to course material (Need 3) is one way students can check an answer.

### Need 5: Support that keeps the student doing the thinking

Students want help that supervises and guides their own work instead of solving it for them. Giving the final answer feels fast but leaves the student with less understanding.

- **Evidence (9 of 12):** P3, P4, P6, P7, P8, P9, P10, P11, P12.
- P11 feels they are solving the problem themselves when AI gives the formula and they do the calculation. P7 said a complete code fix created an illusion of competence that backfired in pen-and-paper exams. P8 adopted an AI explanation without forming their own arguments and then could not defend it. P6 named cognitive offloading as a concern.
- P2, P8 and P9 already use AI to check their own steps or to be walked through a problem, and P9 felt they stayed in control of the process:

> "I was still trying to solve the problem, even with help."
>
> — P9 (translated)

- **Why it matters:** the most promising pattern is that the student starts the work and the AI follows their reasoning, instead of imposing its own approach. If the AI first walks through the student's attempt, it can see their method and correct them along the way, which is especially useful for open-ended questions. A related nuance is that being given a formula can be fine if the student also understands where it comes from.

### Further needs

- **A safe place to ask basic questions.** P9 values that "you can ask it the dumbest question and it will answer you", and P12 said they are afraid to admit not fully understanding a professor's answer. Tools should keep this low-judgment quality.
- **Help with formulating the question.** P12 often finds the solution while writing the prompt, and P3 invests effort in phrasing questions so that the AI gives the explanation they want. Clarifying what is unclear before studying may be part of the support.
- **Support for struggling productively and at the right time.** P1, P6 and P9 realized they gave up or asked sooner than they needed to, P11 wished they had spent more time on problems they were trying to learn, and P11 found that taking a break or switching problems helps. Time pressure pushes students to ask earlier (P5, P7, P8).
- **Help that works for hard analytical topics.** P5 and P6 needed several rounds of prompting before an explanation became usable, and P5 found guiding explanations and understandable examples most helpful.

## 6. Personas

We built three personas from the interview patterns. Each is delivered as a PDF in the milestone folder and summarized in the project blog.

- **Sofia, the Validation-Seeking Learner:** starts with her own approach and uses AI as a quick sanity check, but worries about depending on external confirmation. She reflects Need 5.
- **Braxton, the Deadline-Driven Learner:** wants to understand, but under time pressure asks for complete solutions and later wonders what he actually learned. He reflects Needs 1 and 5.
- **Kaj, the Efficiency-Seeking Learner:** tries first, then wants a quick hint, and gets frustrated by long answers or full solutions when a nudge was enough. He reflects Needs 1, 2 and 3.

## 7. Synthesis / Key Takeaways

- **Shorter and staged beats complete.** Students want a short first answer with the option to go deeper, because long explanations that assume too much are the most common reason help fails.
- **Course material is the missing context.** Help improves when the tool knows what the course covers and what the student already knows, and when it points back to the slides.
- **Students want to stay in charge of the solution.** Nine of twelve participants wanted hints, checks or guidance rather than a finished answer, and the strongest examples had the AI follow the student's own reasoning.
- **Trust needs calibration.** Some students trust AI over friends while others catch hallucinations, so students need ways to verify answers, for example through references to the course material.
- **Subject and goal change what helpful means.** Time pressure, the goal of learning versus finishing, and the difficulty of the topic all shift when students ask and what they need.

## 8. Limitations

- **Sampling:** convenience sampling of 12 friends and colleagues with one participant per field in most cases, so we cannot generalize to all STEM students or compare fields.
- **Self-report:** answers describe what participants remember and want to say, such as how long they try before asking, and were not observed.
- **Interview quality:** in at least one interview the interviewer suggested examples and re-phrased questions, so some confirmed answers may reflect the suggestion. Some topics, such as exam preparation, learning outside school and help from non-AI sources, were not covered in every interview.
- **Translation and summaries:** several interviews were held in another language, and our counts rely on summaries written by different team members rather than on full transcripts.
- **Tools not recorded:** we did not systematically record which AI tool or subscription tier each participant used, so we cannot say whether weaker answers came from free models or from how the tool was used.

### Hypotheses to test in the next milestones

These ideas came up in our discussion of the interviews but are not directly supported by participant statements.

- Students on free tiers may get weaker answers than students with paid subscriptions.
- Students who are less skilled at prompting may benefit less from AI.
- After a long struggle, a break may help more than another round of prompting (supported only by P11).
- Long blocks of AI text and waiting between prompts may distract students (only P9 mentioned the waiting).
