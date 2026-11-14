# Idea B, hi-fi direction: build notes

**Run:** `node server.js` in this folder (or `python3 -m http.server 8765` if you do not need real replies), open `http://localhost:8765` (Safari or Chrome).
Add `?fast` to skip the typing delay, `?policy=baseline` to run the baseline help policy.
**Rebuild:** edit the parts in `src/`, then run `./build.sh`. `index.html` is the single self-contained file.

## What changed
- **Help policy object** (`HELP_POLICIES` in `src/js1.js`): `[band][difficulty] = { levels, startLevel, attemptsBeforeSolution, offerNextAfter }`. Hand-made `adaptive` default and a `baseline` policy. All ladder logic reads it through `policyCell()`. A Milestone 3 policy can be added as data (`__proto.registerPolicy`, then `__proto.setPolicy`).
- **Trust:** each answer sentence has a kind (from your slides, derived, not in your slides). Click, hover or focus a sentence to highlight its passage on the slide. Read-only Source match (Strong, Partial, None) with a reason on hover, a count line, a "Not in your slides" banner with "Check in the lecture", and a "Why this match" dialog. The percentage chip is gone.
- **Right level of help:** ladder card in each help answer (current step, skipped steps, time to read), "Show more detail", next level offered after a few failed attempts, "Try it myself again" after the solution.
- **Visible learning:** "Your step" versus "AI note", result line after each problem, mastery bars that move, a no-help check with a "solved on your own" mark, history per topic, a light progress card.
- **Other:** chat pills instead of a select, toasts with Undo (tab close, ratings), typing indicator, transitions, dialog focus trap and focus restore, ARIA meters, `prefers-reduced-motion`, plainer intro text.

## Behaviour changes to know about
- The chat select is now a row of chat pills.
- Document tab close icon is a separate labelled button.
- Mastery changes after practice are a hand-made rule (no help +2, hint or concept or example +1, solution 0, check +1). It is prototype logic, not measured.

## AI use (for the report)
Claude (Sonnet 5.5, Claude Code) restructured the front end, wrote the CSS and JS above, and ran a scripted browser check of the main flows. Scripted answers, source matches and the help policy values are prototype content. No real users or measurements are involved.

## Account, real replies and Exercise mode (src/js7.js, src/js8.js, server.js)
- **Sign-in:** email only, no password. Saved state is kept per email in this browser (localStorage) and saved every 1.5 s. "Open the demo workspace" (demo@local.test) opens Calculus I with both lectures and a rating on every topic. Sign out is in the profile screen. Ported in spirit from Nicolas's `app-building` (login, profile, contexts); the code is new and sits in this prototype's own state.
- **Real replies:** a switch in the chat header. Off (default) = scripted answers with slide sources and confidence. On = `server.js` writes the question and the notes of the added files to `agent/log.md`, and a terminal agent (see `agent/PROMPT.md`) writes the reply under the same id. The page polls `/log`. Real replies are not matched to slides. If the Node server is not running the switch turns itself off with a message. `agent/log.md` is in `.gitignore`.
- **Exercise mode:** header button, separate from the chat. Setup (time, topics, source, challenge level), plan (which exercises, in what order, with a reason each), session (one exercise at a time, one hint, solution on request, skip) and summary. The plan is made again after every result. Contract: `EXERCISE_MODE_CONTRACT.md`. The planner in the page is a beam search of the objective in `EXERCISE_PATH.md` (the notebook uses Gurobi).
- **Prototype content:** the 21 exercises, their difficulty and minutes, the "Exercise sheet 3" source and the rating rule are made up for the demo.
- **AI use (for the report):** Claude (Sonnet 5.5, Claude Code) wrote the sign-in, saved state, real-reply toggle, server and Exercise mode code and checked the flows in a browser. Nothing here comes from real users.

## Not in this folder
- The knowledge map (kept locally for now), the optimization notebook and its tests, and the course PDF used for the HCI demo context. Without `material/computational-design.pdf` the HCI context is dropped automatically and Calculus I is used.
