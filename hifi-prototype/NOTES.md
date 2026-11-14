# Idea B, hi-fi direction: build notes

**Run:** `node server.js` in this folder (or `python3 -m http.server 8765` if you do not need real replies), open `http://localhost:8765` (Safari or Chrome).
Add `?fast` to skip the typing delay, `?policy=baseline` to run the baseline help policy.
**Rebuild:** edit the parts in `src/`, then run `./build.sh` (`./build.sh --no-map` builds `index.nomap.html` without the knowledge map, which is what goes to the group repository). `index.html` is the single self-contained file. `src/original-lofi.html` is the untouched lo-fi prototype.

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

## Knowledge map (src/js6.js)
- Activity-bar icon opens a canvas graph (Obsidian-like): pan by dragging, zoom with the wheel, +/- buttons, fit button, a "Find a concept" box. Node size grows with the number of links; hovering a node dims everything except its neighbours.
- Semantic zoom, relative to the fitted view: zoomed out = one circle per lecture (W1-W14), joined by the course order and by the number of concept links between them. Medium = 6-7 concepts as dots inside each circle plus the links between lectures. Zoomed in = labels and "needs this first" arrows inside a lecture.
- Guidance without a rigid diagram: the course order is drawn as arrows between lectures; inside a lecture arrows mean "needs this first"; a yellow dot is the next concept to explore.
- Prototype content: only W8 is real. Its 7 concepts were picked from the PDF; each has a page and a slide quote ("Open in slides" marks it). Lecture titles come from the course-overview slide (p.2). The concepts and links of W1-W7 and W9-W14 are SIMULATED, shown dashed and tagged Simulated. Two cross-lecture links are written on the W8 slides (p.6 UCD, p.18 user models) and show that evidence.
- Node state: opened (from the map or from a cited chat answer on that page), next, not yet. No mastery state yet: it needs exercises per concept.
- Real version: extract the main concepts and links per uploaded PDF with an LLM, keep only those a slide passage supports.
- Debug hook: `__proto.map()` returns the camera state.
- AI-use note: the map code and layout were written with Claude's help; W8 concepts were checked against the PDF text.

## Account, sidebar, graph, uploads, real replies and Exercise mode (src/js7.js, js8.js, js9.js, server.js, solver/)
- **Sign-in:** email only, no password. Saved state is kept per email in this browser (localStorage) and saved every 1.5 s. "Open the demo workspace" (demo@local.test) opens Calculus I with both lectures and a rating on every topic. Sign out is in the profile screen. Ported in spirit from Nicolas's `app-building` (login, profile, contexts); the code is new and sits in this prototype's own state.
- **Real replies:** a switch in the chat header. Off (default) = scripted answers with slide sources and confidence. On = `server.js` writes the question and the notes of the added files to `agent/log.md`, and a terminal agent (see `agent/PROMPT.md`) writes the reply under the same id. The page polls `/log`. Real replies are not matched to slides. If the Node server is not running the switch turns itself off with a message. `agent/log.md` is in `.gitignore`.
- **Exercise mode:** header button, separate from the chat. Setup (time, topics, source), plan (which exercises, in what order, with a reason each), session (one exercise at a time, one hint, solution on request, skip) and summary. The plan is made again after every result. Contract: `EXERCISE_MODE_CONTRACT.md`. The planner in the page is a beam search of the objective in `EXERCISE_PATH.md` (the notebook uses Gurobi).
- **Prototype content:** the 37 exercises, their difficulty and minutes, the "Exercise sheet 3" source and the rating rule are made up for the demo.
- **AI use (for the report):** Claude (Sonnet 5.5, Claude Code) wrote the sign-in, saved state, real-reply toggle, server and Exercise mode code and checked the flows in a browser. Nothing here comes from real users.

## Update: sidebar, uploads, graph, Gurobi
- **One sidebar** with three collapsible sections: Chats, Material (files, Add files, sample files) and Self-assessment. An empty Material section shows a "Start here" card. The icon rail only shows or hides the sidebar (Ctrl or Cmd + B).
- **Uploads:** any PDF can be added (button, drop zone, or "Add files"). Anything else is refused with "Please choose a PDF." The same name twice in one context is skipped. A file whose name matches a known lecture opens as that lecture (slides and topics). Any other PDF opens in the PDF viewer and is kept in this browser (IndexedDB), so it is still there after a reload. It adds no topics. Chat answers about an uploaded PDF are not grounded in it yet: the scripted answers only know the course material.
- **Graph:** header button. Files and topics on a circle, plain SVG, fixed links (lecture to its topics, Chain rule and Tangent lines to Basic derivative rules, Optimization to Tangent lines). Click a node to highlight it and its neighbours, "Open file" for a file node. Layout and links follow the group prototype (`app-building`); the styling is ours.
- **Gurobi:** Exercise mode asks `POST /plan` (see `solver/README.md` for set-up and the licence) and shows on screen whether Gurobi or the in-page search made the plan.
- **Knowledge map:** not in this repository.

## Update: clean path, bigger bank, team-only details
- **Exercise mode, what the student sees:** setup (time, topic pills, source), then the path drawn as a winding road of stops, one stop per exercise, each shown by its topic symbol, name and minutes. Then one exercise at a time with a step line on top. A short summary at the end. Neutral colours with one accent.
- **What the student does not see:** estimated chance of success, "stretch / about right", why a stop was chosen, planner messages and which solver ran. They are kept as code comments and appear only when the address has `?dev` (for example `http://localhost:8765/?dev`).
- **Path end:** when the plan does not use all the time, the road ends in "More ahead" instead of a flag. The first plan only sees what suits the current level. After each result the plan is made again, so new stops appear as the student progresses.
- **Bank:** 96 exercises, 18 to 20 per topic (80 to 117 minutes per topic). Most are generated from parameter lists in `js8.js`, so every answer is computed and was checked numerically. Tags that measure similarity keep what tells exercises apart.
- **Page scroll:** the app is fixed to the window. The exercise view stays inside the editor area.

## Update: layout, new accounts, cleaner help
- **Layout:** the sidebar now runs the full height of the window (the toggle sits at its top-left). The header sits over the main area: the course menu is the page title (Calculus I, Linear Algebra, HCI), then the buttons on the right. When the sidebar is hidden its toggle moves into the header.
- **New accounts** open Calculus I (HCI is only a choice in the course menu, and only on a machine that has the course PDF). Empty Material shows "Use sample lectures". Exercise mode opens even without material and offers "Add sample lectures" itself.
- **Exercise mode:** "Cancel" in the header while a path is planned or running (asks first if exercises were already done; earned ratings stay). Each stop on the road shows a glimpse of the exercise (the expression, not the answer).
- **Chat help:** an answer shows only a small coloured tag with its own level (Hint, Concept, Example, Solution). The four-step ladder is gone.
