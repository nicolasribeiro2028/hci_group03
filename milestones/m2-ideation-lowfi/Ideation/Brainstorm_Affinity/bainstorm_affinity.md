# Brainstorming Summary

### How might we questions:
- How might we make AI provide step-by-step solutions for educational prompts?
- How might we find out what a student already understands without making it feel like a boring test?
- How might we ensure that AI answers are based on the course material?
- (how might we make good use of uploaded course material)
- How might we adapt AI so that it doesn't only provide the answer but instead supports the student more?
- How might we help students verify whether AI-generated help is trustworthy?


The brainstorming method we used was Round-Robin Brainstorming. Initially everyone wrote down their own Ideas and after the time was up and everyone felt ready we compared and discussed the ideas. We sorted the ideas to match the “How might we” questions. After one round of round-robin we had already found a decent number of ideas so we did not do a second round.
We chose this brainstorming method because it seemed like the most efficient way to quickly collect a big number of ideas. Everyone could write down all that was in their head without being restricted to the previous person’s ideas (as it would’ve been the case in 6-3-5 Brainwriting).



These are the ideas we came up with, sorted by their corresponding how might we question:



### HMW 1: How might we make AI provide step-by-step solutions for educational prompts?
The moodle to markdown should outline exercise solutions by steps, and thus go one by one guiding the user, hence following the approach of the course
Generate a breakdown of the problem and give small inputs to each step
Create a harness that penalizes lengthy responses (user defined)
Reveal one step at a time. The AI shows step 1, and the student taps “next step” or “I’ll try the next one” to continue. Maybe have intermediate questions to go to next step
Force the AI answers to have some specific format, there could be multiple formats. like one for ensuring that the question was understood correctly and one for a deep dive answer.
Goes through the steps until solution is reached. User is guided through the solution steps and can give input.


### HMW 2: How might we find out what a student already understands without making it feel like a boring test?
Generate a summary based on provided material and ask student to self rate
Have expand option in a step by step answer
Start from the student’s own attempt. The student pastes their partial work or a one-line explanation, and the AI infers their level from it.
having a record of courses taken; performance; and current lecture notes
Interview the user in the way Tony Ojeda goes about starting a project
Make a fun and exciting test to find out what a student already knows.
track learning progress by writing down a user's confidence levels for subtopics of their studies.
Have a user_profile file that is updated with each chat that contains info about the user's knowledge level about subjects
Just test them and see if they can solve the tests for specific subjects/problems.
Strongly incentivise the student to do a test before going into the topic (firewall of some sort)


### HMW 3: How might we ensure that an AIs answers are based on the course material? (how might we make good use of uploaded course material)
Responses need to point to a line or slide or section
Upload material and make guardrails to avoid answering outside of the scope
Moodle to markdown tool that gives the AI the necessary course material without saturating context window
Upload your own documents and the AI references them thus one knows from where the response was generated.


### HMW 4: How might we adapt AI so that it doesn’t only provide the answer but instead supports the student more?
Give hint based on course material, only give the solution when specifically asked (not as the default)
Intermediate exercise solving to see if the student comprehends
Khan academy style guardrails
Instead of immediately giving the answer, the AI progressively increases its support from a small hint, to a concept explanation, to a similar example and eventually a full solution. Learning ladder


### HMW 5: How might we help students verify whether AI-generated help is trustworthy?
When gathering outside sources, have a list of good websites and a blacklist of bad websites (user defined?)
Confidence and source markers. Confidence score is based on our judgment (human-judgment). Each claim is labeled as “from your course material”, “general knowledge” or “unsure”.
Go back to the moodle to markdown file and give cross reference on the course material of the produced answers, or some level of source that the user can go and check for themselves
Upload your own documents and the AI references them thus one knows from where the response was generated. Use Scite if an outside source is used.



---

# Affinity Diagram Summary

The following image shows the affinity diagram we ended up with.
Green sticky notes represent ideas from our brainstorming session
Red sticky notes represent findings from our desk research
Yellow sticky notes represent our how might we questions




















Link to the figma diagram:
https://www.figma.com/board/dYRAUKB9vxvuUj4JEBFl6F/Affinity-Diagram---HCI-Group-03?node-id=0-1&p=f&t=66Yvrv9Wp6h7vfVy-0
The key sections that emerged from the affinity diagram are
- Memory of student’s knowledge
- Testing the student
- Trusting the source
- References (although this one is closely related to “Trusting the source”)
- Adding course context
- AI Answer format
- Step-by-step guidance / support

We also grouped a few of those into larger sections as can be seen in the image of the diagram. We made sure not to group the sticky notes based on the how might we questions again. After grouping the sticky notes each team member was given a budget of four stars to place on the sections that they thought should be focused on for our prototypes. The main insight we gained from this diagram is that we want to focus on the following topics when designing our prototypes:
- Step-by-step guidance
- Memory of Student’s knowledge
- Adding course context
- Trusting the source
