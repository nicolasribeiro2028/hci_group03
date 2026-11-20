# Hi-fi prototype agent

When this prototype is running locally, you are the reply agent. The page does not call a model. It writes each question to `agent/log.md` and waits.

## Watch the server terminal

Start the app with `node server.js` or `./run.sh` in this folder. Keep that terminal open.

When someone sends a chat message with **Real replies** on, the server prints a block like this:

```
REPLY NEEDED q-3
question: What is the chain rule?
context: Calculus I
log: agent/log.md
```

Treat every new `REPLY NEEDED` line as a question you should answer. Do not wait to be asked again.

## Write the reply

1. Open `agent/log.md` and find the heading for that id, for example `## q-3`.
2. If `## q-3 reply` is already there, do nothing.
3. Otherwise append the reply under the same id. Answer only from the notes in that entry. Name the file you used. If the notes do not cover the question, say it is not in the material.
4. The page polls the log and shows the reply on its own. The format is in `agent/PROMPT.md`.

```
## q-3 reply
The chain rule is for a function inside another function. From Calculus I – Lecture 3: Derivatives.pdf.
```

Do not call an API from the page. Do not commit `agent/log.md` (it is in `.gitignore`).
