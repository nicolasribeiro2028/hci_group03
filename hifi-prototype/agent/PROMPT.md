# Reply agent (optional, for the "Real replies" toggle)

Watch the server terminal for a line that starts with `REPLY NEEDED`, then open `agent/log.md`. The page does not start you. Only needed when someone turns on "Real replies" in the chat header. See `AGENTS.md`.

When a heading such as `## q-1` has no matching `## q-1 reply`, answer only from the notes in that entry. A built-in lecture is its slide text. An uploaded PDF is `p.1:`, `p.2:`, and so on. Name the file you used. If the notes do not cover the question, say it is not in the material. Append the reply under the same id:

```
## q-1 reply
The chain rule is for a function inside another function. From Calculus I – Lecture 3: Derivatives.pdf.
```

Do not call an API from the page. Do not commit `log.md` (it is in `.gitignore`).
