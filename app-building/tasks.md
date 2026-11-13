# Tasks

Work from this file. `AGENTS.md` holds the rules. `DESIGN.md` holds color, type, and layout.

Take the first task under Unclaimed, in the order login, profile, workspace, material, chat, graph. Move that whole task into Claimed before you edit code, and write your name on its claim line. When it works in the browser, move it into Done and clear the claim line. Do not start the next task until the one you claimed is in Done. Leave tasks you are not doing under Unclaimed.

## Gitignore

Two files are local state. They are already listed in the repo `.gitignore` and must stay that way.

- `app-building/master.local.json` holds the master email, `{ "email": "master@local.test" }`. It already exists on this machine. Read it. Do not edit the email unless the person asks. Do not commit it, and do not run `git add -f` on it.
- `app-building/agent/log.md` is the question and reply log. The chat task creates it at runtime. Do not add a copy of the log to the repo. Do not commit it.

Before you move a task to Done, run `git status` from the repo root. Those two paths must not appear as untracked or staged. `git check-ignore -v app-building/master.local.json app-building/agent/log.md` should name `.gitignore` for both. If a task needs a new secret or a new log, add the path to `.gitignore` in the same change. Do not put an API key anywhere.

## Unclaimed

### 3. workspace

Claim: unclaimed

Build the shell around the empty states. Match the 1512 by 982 frame in `DESIGN.md`: header 72 tall, then course material 260, document 480, and chat 692, with a 24px page margin and 16px gaps.

- Header: the muted label "Context:", a course dropdown 200 by 36, "+ Add context", and Profile on the right.
- The dropdown lists every context for this email. Choosing one shows only that context's files, topics, open documents, and chats.
- "+ Add context" opens a dialog on a `#222222` cover. The white panel is 760 by 223, radius 14, centered. Title "Add a course context". Line "Each context keeps its own course material, topics and chats." One text field, Cancel, and Add context. Add context creates an empty context with that name and switches to it. Cancel closes the dialog. An empty name does nothing.
- A new email's first context can be created here. The master login already has Calculus I.
- Empty document column: "No document open" and "Add your course material on the left, then click a file to read it here."
- Empty chat: a switcher reading "Chat: Getting started", "+ New chat", the profile greeting, and a composer. "+ New chat" adds an empty thread and selects it. Sending a message waits for the chat task.
- Footer, centered, 11px, `#6b6b6b`: "Lo-fi prototype · AI answers and confidence scores are scripted".

Done when two contexts keep separate files and chats, and the add-context dialog creates an empty one.

### 4. material

Claim: unclaimed

This task fills `data/lectures.js` and the course-material and document columns.

`data/lectures.js` exports the two known lectures and nothing else:

- `Calculus I – Lecture 3: Derivatives.pdf`. Note: "Differentiate the outside, then multiply by the derivative of the inside." Topics: Basic derivative rules, Product and quotient rule, Chain rule.
- `Calculus I – Lecture 4: Applications of derivatives.pdf`. Note: "The tangent line to f at x = a is y = f(a) + f'(a)(x − a). Its slope is the derivative f'(a)." Topics: Tangent lines, Optimization. Slide label: "Slide 20 of 28 · preview". Slide title: "Tangent lines".

Upload:

- The left column has the heading "Course material", the file list, a drop zone ("Drag and drop your files here", "PDF, slides or documents", "Choose files"), and "Add sample lectures".
- Choose files and the drop zone use one `<input type="file" accept=".pdf" multiple>`. A file whose name does not end in `.pdf` is refused with "Please choose a PDF".
- Store only the file name on the open context in `localStorage`. Discard the bytes. After a refresh the name is still in the list.
- The same name twice in one context is skipped. The same name may exist on another context.
- "Add sample lectures" adds the two known names without a file picker.
- A known name adds that lecture's topics, each "Not rated". An unknown PDF is listed by name and adds no topics.

Topics and the reader:

- Under the files, the heading "Topics found" and a "Rate my knowledge" control. The line under the list: "Ratings come from your self-assessment and update as you practice."
- Rate my knowledge opens a panel of 0 to 10 sliders, one per topic. The legend is "0 = never seen it" and "10 = could explain it to someone". Save stores the scores on that context. The list then shows values such as "7/10".
- Clicking a file opens a tab in the document column. A tab can be closed. A known lecture shows its slide card on `#fafafa`. Lecture 4 shows the tangent-line text and "Slide 20 of 28 · preview". Any other PDF shows its name and "This prototype does not open the file."
- The active file row and the active tab use `#f0f0f0`.

Done when a known lecture name shows its topics and slide card, an unknown PDF shows the name only, and a refresh keeps the names.

### 5. chat

Claim: unclaimed

A question is general. The person does not choose a file, a slide, or a topic. This task fills `agent/PROMPT.md` and the log routes in `server.js`.

Log:

- On Send, `server.js` appends one entry to `agent/log.md` and does not call a model. The entry has an id, the question, the context name, and one note per file on that context. A known lecture includes the note from `data/lectures.js`. An unknown PDF is a name with an empty note. Files from other contexts are not included.
- Shape of an entry:

```
## q-1
question: What is the chain rule?
context: Calculus I
notes:
- Calculus I – Lecture 3: Derivatives.pdf: Differentiate the outside, then multiply by the derivative of the inside.
```

- The reply, written later by the terminal agent, uses the same id:

```
## q-1 reply
The chain rule is for a function inside another function. From Calculus I – Lecture 3: Derivatives.pdf.
```

- `agent/PROMPT.md` tells that agent: watch `agent/log.md`; when a question id has no reply, answer only from the notes in that entry; name the file used; say when the question is not in the material; append the reply under that id. The page does not start the agent.
- The page polls `GET /log` until a reply with the same id exists, then shows that text as the assistant message. Until then the thread says it is waiting. One question at a time. No streaming and no API key.
- The student's message is a `#d9d9d9` bubble on the right. The reply is a `#f0f0f0` bubble on the left. The composer placeholder is "Write your attempt or ask a question…". Send stays disabled while a question is waiting.
- "+ New chat" starts a thread that does not include the previous questions. The greeting still uses the profile courses.
- `agent/log.md` stays gitignored. Do not commit a log that contains questions.

Done when a sent question appears in `agent/log.md`, the thread shows the reply text once a matching reply block is in that file, and `git status` does not list the log.

### 6. graph

Claim: unclaimed

Add a Graph control in the header. It replaces the document column only. The header, course material, and chat stay put. Closing Graph shows the document column again.

- Nodes are the files and topics on the open context. Files and topics use two different fills.
- Draw them on a circle with plain SVG lines. Do not add a physics library. Nodes do not move.
- Links are fixed. A known lecture links to its own topics. Also link Chain rule to Basic derivative rules, Tangent lines to Basic derivative rules, and Optimization to Tangent lines. An unknown PDF is a node with no links.
- Clicking a node highlights it and its neighbors and shows the name. Clicking a file node opens that file when Graph is closed.
- A context with no files shows "Add course material to see how the topics connect."

Done when the master Calculus I context shows both lectures, their topics, and those links, and an empty context shows the empty line.

## Claimed

### 1. login

Claim: Nicolas

Build the first screen in `index.html`, `styles.css`, and `app.js`. A person types an email and presses Continue. There is no password, no Auth0, and no account server.

- One email field and a Continue button. Continue is `#222222` with white text, radius 8. An empty field does nothing.
- Save the signed-in email in `localStorage`. A later visit with the same email opens that person's saved state.
- Read the master email from `master.local.json` through the local server. Do not hardcode the address in `app.js`. If the file is missing, show that the master login is not set, and still accept any other email.
- The master email skips profile setup and opens a seeded Calculus I workspace: the context is named Calculus I and already lists `Calculus I – Lecture 3: Derivatives.pdf` and `Calculus I – Lecture 4: Applications of derivatives.pdf`. Topics and notes for those names come from `data/lectures.js` once the material task fills that file. Until then, show the file names and leave topics empty.
- Any other email with no saved profile goes to the profile screen. An email that already has a profile goes to the workspace.
- `server.js` may grow a static file server and `GET /master` that returns only `{ "email" }` from `master.local.json`. It must not call a model and must not write the master file into git.

Done when a new email reaches profile setup, the master email reaches the seeded workspace, and `git status` does not list `master.local.json`.

## Done

### 2. profile

Claim:

Build the profile screen and the way back to it. This is a centered column, 560 wide, on the white page, not the three-column shell. See `DESIGN.md`.

- Title: "Hey, ready to study?"
- Line under it: "Tell us a little about you, so the help can start at the right place."
- Label "About you" and a text area. The sample text in the design is "I'm a first year cs student. I struggle with maths".
- Label "Math courses you took before". Chips, fully round: Calculus I, Calculus II, Linear Algebra, Statistics, Probability, Discrete Mathematics, Differential Equations, Numerical Methods, and None of these. Calculus I starts selected. A selected chip is `#222222` with white text. The others are white with a `#bdbdbd` border. "None of these" clears the other chips.
- A field labeled "Add another course" and an Add button. Add appends a chip and selects it.
- Continue stores the bio and the selected course names on that email in `localStorage`, then opens the workspace. The workspace starts empty for a new email.
- The Profile button in the header opens this same form with the saved values. Saving again updates the chat greeting. The greeting names the saved courses and says the help will not start from zero.

Done when Continue stores the profile, Profile in the header edits it, and the greeting uses the saved course names.
