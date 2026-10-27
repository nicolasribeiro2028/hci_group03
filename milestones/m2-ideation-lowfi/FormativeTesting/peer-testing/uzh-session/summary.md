# UZH learning assistant — Usability test report

**Date:** October 27, 2026
**Recording length:** 8 minutes 18 seconds
**Source:** Transcript of the session, [UZH.txt](UZH.txt). Audio: [UZH.m4a](UZH.m4a).
**AI use:** This summary was generated with AI (Claude) from the transcript and has not been checked against the audio.

## Overview

The participant explored a prototype learning assistant by setting up a student profile, reviewing suggested math topics, rating their knowledge, and working through a chain-rule exercise. They responded positively to the staged hints and step-by-step solution. The clearest unresolved usability question was where to find previous chats.

## Session walkthrough

### 1. Setting up a learning profile

The participant understood that the opening page asked for information to tailor the learning experience. They used the example prompts to identify what to enter: their subject, year of study, and where they get stuck. They chose a CS-student profile and a difficulty with math.

The request for **courses taken before** caused a brief reconsideration of the year of study they had entered. They then listed prior courses, including discrete math, linear algebra, and statistics. They interpreted the profile as a way to communicate both formal coursework and broader background knowledge.

**Observation:** The examples helped the participant get started, but the relationship between current year, current difficulty, and *previously taken* courses prompted some uncertainty.

### 2. Adding materials and reviewing the setup

The participant identified a way to select lecture materials and understood that they could ask the assistant to refer to those materials when helping them. They also noticed a message summarizing their inputs and thought it might provide a place to correct a misclick.

The transcript does not establish whether they successfully uploaded a file or tested an edit to that summary.

### 3. Finding and rating topics

The assistant surfaced topics and possible next steps, including rating knowledge and practicing the chain rule or product rule. The participant interpreted "topics found" as topics suggested from their inputs whose mastery had not yet been established. They rated topics and noticed they could add comments.

**Observation:** The participant could distinguish between a topic being identified and their knowledge of it being assessed.

### 4. Working through an exercise

The participant opened a practice exercise and noted that the interface encouraged them to try it themselves first. When stuck, they requested a hint. They appreciated that the hint pointed them toward the next step without immediately supplying the answer, and they noticed a linked source for the chain-rule information.

They then moved through additional help: an example followed by a step-by-step solution. They liked that reaching the solution required intermediate steps, giving them another chance to think before revealing it.

> "I really have to think twice if I want it."

The participant also valued seeing *how* to solve the exercise, rather than receiving only the final answer.

### 5. Interpreting the confidence display

The participant paused at a displayed score and asked what it represented. After being told it reflected the AI's confidence, they understood the label and considered asking why it was not 100% confident. They also noticed another reference to sources.

**Observation:** The score's meaning was not immediately apparent without explanation. The transcript does not show whether the participant fully understood how the confidence was calculated.

### 6. Navigating and returning later

The participant expected "change context" to let them switch subjects or chapters, choose more files, or add a class. They also found the option to start a new chat. However, they could not tell whether old chats would remain accessible.

Their concrete use case was returning to an earlier chain-rule conversation to check what they had done previously. They named finding old chats as the main thing they were unsure about at the end of the test.

## Key findings

| Finding | Evidence from the session | Implication to investigate |
|---|---|---|
| Staged help was well received | The participant used a hint, saw a further example, and praised the steps before the solution. | Preserve the distinction between hints, examples, and the full worked solution. |
| Source visibility was noticed | The participant identified sources alongside the hint and confidence explanation. | Check whether users understand what each source supports. |
| The confidence score needed clarification | The participant asked what the score meant before it was explained. | Test a clearer label or explanation at the point where the score appears. |
| Previous chats were hard to locate | The participant explicitly asked where to revisit an older chain-rule chat. | Clarify whether chat history exists and, if it does, make its entry point discoverable. |
| Profile wording prompted reconsideration | "Courses you took before" led the participant to reconsider their initial year-of-study entry. | Check whether the setup makes the timeframe for courses clear. |

## Suggested priorities

1. **Clarify access to previous chats.** This was the participant's explicit unanswered question and had a specific return-use case.
2. **Explain the confidence score where it appears.** The participant needed a verbal explanation to interpret it.
3. **Review profile prompts for temporal clarity.** In particular, test whether "courses taken before" is clear alongside year of study.

## Limits of this report

This report reflects **one short, exploratory session**. It records the participant's interpretations and reactions, not proof that every feature worked as they assumed. In particular, the transcript does not confirm successful file upload, correction of the setup summary, or access to chat history. The positive closing assessment, "great and very well done", should be read alongside the specific points of confusion above.

**Coverage note:** Based solely on the 8-minute-18-second transcript; no other sessions or product materials were reviewed.
