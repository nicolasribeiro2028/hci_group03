# Gurobi planner for Exercise mode

`plan.py` solves the integer program of the optimization notebook (version 4, `model.py`) for the exercises on screen. `server.js` calls it on `POST /plan`. If it is not available, the page falls back to its own search and says so.

## Set up

```
python3 -m venv solver/.venv
solver/.venv/bin/pip install -r solver/requirements.txt
node server.js
```

`server.js` uses `solver/.venv/bin/python` when it exists, or the interpreter in the `PYTHON` environment variable, or `python3`.

Settings (environment variables of the server): `PLAN_KCAND` (candidates kept, default 12), `PLAN_GAP` (accepted gap, 0.03), `PLAN_TIME` (seconds, 4). With 21 exercises, 12 candidates solves in about 1 second and the same exercises as 16 candidates. With all candidates it can take 8 seconds or hit the time limit.

## Licence

- `pip install gurobipy` comes with a **size-limited licence** (2000 variables and constraints, non-production). It is enough for this prototype (largest plan so far: about 230 variables). The copy installed here **expires on 2026-11-23**.
- Gurobi's licences for students and staff of degree-granting institutions are **free** for non-commercial use such as coursework and research ([Gurobi: academic licences](https://www.gurobi.com/academia/academic-program-and-licenses/)).
- **Named-User Academic:** valid one year, tied to one person and one computer. Register an academic account, then **connect to the university network** (VPN may work, check with the university) only for activation. In the user portal, go to License Request, "Generate now" in the Named-User Academic block, and run the `grbgetkey` command the portal shows. Afterwards it works offline ([how to get a free academic licence](https://support.gurobi.com/hc/en-us/articles/25770868793105)).
- **WLS Academic:** lasts 90 days and can be extended. It works on several computers and in containers, which suits a shared demo machine.
- Nothing to pay. The licence file is personal: do not commit it (`gurobi.lic` is in `.gitignore`).

## Online

`api/plan.py` and `vercel.json` (one folder up) run this same planner as a Vercel function. See `NOTES.md`.
