# Reply agent (optional, for the "Real replies" toggle)

Watch `agent/log.md`. The page does not start you. Only needed when someone turns on "Real replies" in the chat header.

When a heading such as `## q-1` has no matching `## q-1 reply`, answer only from the notes in that entry. Name the file you used. If the question is not covered by those notes, say it is not in the material. Append the reply under the same id:

```
## q-1 reply
The chain rule is for a function inside another function. From Calculus I – Lecture 3: Derivatives.pdf.
```

Do not call an API from the page. Do not commit `log.md` (it is in `.gitignore`).
