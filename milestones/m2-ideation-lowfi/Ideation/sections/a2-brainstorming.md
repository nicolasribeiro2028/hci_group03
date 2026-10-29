# A.2 Brainstorming Summary

## How might we statements

Each statement maps to one key need from Milestone 1.

- How might we make AI provide step-by-step solutions for educational prompts? (Need 1)
- How might we find out what a student already understands without making it feel like a boring test? (Need 2)
- How might we ensure that AI answers are based on the course material, and make good use of uploaded course material? (Need 3)
- How might we adapt AI so that it does not only provide the answer but instead supports the student more? (Need 4)
- How might we help students verify whether AI-generated help is trustworthy? (Need 5)

## Brainstorming method

The brainstorming method we used was round-robin brainstorming. Initially everyone wrote down their own ideas and after the time was up and everyone felt ready we compared and discussed the ideas. We sorted the ideas to match the "how might we" questions. After one round of round-robin we had already found a decent number of ideas so we did not do a second round.

We chose this brainstorming method because it seemed like the most efficient way to quickly collect a big number of ideas. Everyone could write down all that was in their head without being restricted to the previous person's ideas (as it would have been the case in 6-3-5 brainwriting).

## Brainstormed ideas

These are the ideas we came up with, sorted by their corresponding how might we question.

```{=latex}
\begin{hmwbox}
\textbf{HMW 1: How might we make AI provide step-by-step solutions for educational prompts?} (Need 1)
\begin{itemize}
\item The Moodle to Markdown tool should outline exercise solutions by steps, and thus go one by one guiding the user, hence following the approach of the course.
\item Generate a breakdown of the problem and give small inputs to each step.
\item Create a harness that penalizes lengthy responses (user defined).
\item Reveal one step at a time. The AI shows step 1, and the student taps ``next step'' or ``I'll try the next one'' to continue. Maybe have intermediate questions to go to the next step.
\item Force the AI answers to have some specific format. There could be multiple formats, like one for ensuring that the question was understood correctly and one for a deep-dive answer.
\item Go through the steps until a solution is reached. The user is guided through the solution steps and can give input.
\end{itemize}
\end{hmwbox}

\begin{hmwbox}
\textbf{HMW 2: How might we find out what a student already understands without making it feel like a boring test?} (Need 2)
\begin{itemize}
\item Generate a summary based on provided material and ask the student to self-rate.
\item Have an expand option in a step-by-step answer.
\item Start from the student's own attempt. The student pastes their partial work or a one-line explanation, and the AI infers their level from it.
\item Have a record of courses taken, performance, and current lecture notes.
\item Interview the user in the way Tony Ojeda goes about starting a project.
\item Make a fun and exciting test to find out what a student already knows.
\item Track learning progress by writing down a user's confidence levels for subtopics of their studies.
\item Have a user\_profile file that is updated with each chat and contains info about the user's knowledge level about subjects.
\item Just test them and see if they can solve the tests for specific subjects or problems.
\item Strongly incentivise the student to do a test before going into the topic (a firewall of some sort).
\end{itemize}
\end{hmwbox}

\begin{hmwbox}
\textbf{HMW 3: How might we ensure that AI answers are based on the course material, and make good use of uploaded course material?} (Need 3)
\begin{itemize}
\item Responses need to point to a line, slide or section.
\item Upload material and make guardrails to avoid answering outside of the scope.
\item A Moodle to Markdown tool that gives the AI the necessary course material without saturating the context window.
\item Upload your own documents and the AI references them, so one knows where the response was generated.
\end{itemize}
\end{hmwbox}

\begin{hmwbox}
\textbf{HMW 4: How might we adapt AI so that it does not only provide the answer but instead supports the student more?} (Need 4)
\begin{itemize}
\item Give a hint based on course material, and only give the solution when specifically asked (not as the default).
\item Intermediate exercise solving to see if the student comprehends.
\item Khan Academy style guardrails.
\item Instead of immediately giving the answer, the AI progressively increases its support from a small hint, to a concept explanation, to a similar example and eventually a full solution (a learning ladder).
\end{itemize}
\end{hmwbox}

\begin{hmwbox}
\textbf{HMW 5: How might we help students verify whether AI-generated help is trustworthy?} (Need 5)
\begin{itemize}
\item When gathering outside sources, have a list of good websites and a blacklist of bad websites (user defined?).
\item Confidence and source markers. The confidence score is based on our judgment (human judgment). Each claim is labeled as ``from your course material'', ``general knowledge'' or ``unsure''.
\item Go back to the Moodle to Markdown file and give a cross-reference on the course material of the produced answers, or some level of source that the user can go and check for themselves.
\item Upload your own documents and the AI references them, so one knows where the response was generated. Use Scite if an outside source is used.
\end{itemize}
\end{hmwbox}
```
