# Exercise mode: data contract between the screens and the planner

**Version 0.1.** This is the current agreement, not a frozen one. The screens (`src/js8.js`) and the optimization (`EXERCISE_PATH.md`, `optimization-test/`) depend on each other, so either side may change it. To change it: edit this file first, bump the version, then change both sides. A field that is not listed here is not part of the contract.

## What the student sets before a session (inputs from the screen)

| Field | Values in the prototype | Meaning |
|---|---|---|
| `remaining` | 15, 30, 45 or 60 minutes at the start | Time budget left. Falls as exercises are finished. |
| `topics` | ids of the topics chosen | Only these topics are planned. |
| `source` | `both`, `up` (uploaded only), `ai` (AI-generated only) | Where exercises may come from. |
| `chal` | 0.75 gentle, 0.6 balanced, 0.5 stretch | The chance of success the plan aims at for the typical exercise. |
| `rat` | topic id to 0 to 10, or missing | Self-rating at the start of the session. A missing rating counts as 5 with little weight. |
| `hist` | list of `{ id, r }` | What already happened in this session. `r` is the result score below. |

## What each exercise in the bank has

`id`, `topic`, `d` (difficulty 1 to 10), `min` (estimated minutes), `src` (`up` or `ai`), `el` (knowledge-element tags, used only to measure how similar two exercises are). In the notebook the similarity comes from embeddings and an LLM rating. In the prototype it is a Jaccard overlap of the tags. All values in the prototype bank are made up.

## What the planner returns

An ordered list `items`, each `{ id, min, p, rem }`:

- `p`: estimated chance that the student solves it unaided, shown as an estimate, never as a fact.
- `rem`: bonus the item got for being related to the exercise just missed (0 when none). Used only to explain the choice on screen.
- The screen adds a one-line reason from these values. It never shows the score.

Only the first item is certain. The rest is a forecast that is replaced after every result.

## What the screen sends back after each exercise

`{ id, r }` with the result score `r`:

| Result | `r` | Rating change in the prototype |
|---|---|---|
| Solved with no help | 0.9 | +1 |
| Solved after another try, no help | 0.8 | +1 |
| Solved with a hint | 0.7 | +0.5 |
| Solution seen | 0.4 | 0 |
| Skipped | 0.1 | 0 |

`r < 0.5` counts as a failure for the "recover what was just missed" bonus. The rating change is a hand-made prototype rule, not a measurement.

## Where the solver runs

| Where | Solver |
|---|---|
| Notebook (`ui_optimization.ipynb`, Milestone 3) | Gurobi, exact |
| This page | A beam search of the same objective (`xPlan` in `js8.js`). Gurobi cannot run in a browser. |

To use the real solver in the page later, replace `xPlan` by a call to a small local server that returns the same `items`. The rest of the screens does not change.

## What may change later (open on purpose)

- The set of settings (for example whether challenge level stays a user setting, or is learned).
- Whether `hist` also carries time spent, hints used per exercise and the student's own rating of difficulty.
- Whether the plan shows its reasons, and how much.
- The objective itself (see `EXERCISE_PATH.md`). The screens only depend on the shape above.
