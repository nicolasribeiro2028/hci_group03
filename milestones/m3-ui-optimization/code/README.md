# Optimization code (Milestone 3)

| File | What it is |
|---|---|
| `ui_optimization.ipynb` | The optimization notebook: problem, student model, integer program (Gurobi), reference designs, simulation, what-if analysis, checks. Runs on its own, in about 5 minutes. |
| `exercise_bank.json` | The 100 made-up exercises of the prototype's Exercise mode (topic, difficulty, minutes, source, knowledge tags). |
| `requirements.txt` | `gurobipy`, `numpy`, `matplotlib`. Running the notebook also needs Jupyter (`pip install notebook`). |

## Run

```bash
python3 -m venv venv && ./venv/bin/pip install -r requirements.txt notebook
./venv/bin/jupyter notebook ui_optimization.ipynb
```

Use a recent Python (3.12 or newer). Gurobi from pip comes with a restricted license (2000 variables and constraints, non-production use). The newest `gurobipy` has a restricted license that runs until 2028; older versions (for example 12.0.3, the last one for Python 3.9) carry a license that expired on 2026-11-23, so install a recent one.

The same model runs in the prototype: `../../../hifi-prototype/solver/model.py` and `plan.py`. In the notebook it is the function `solve_path`.

**All data in the notebook are made up** (bank, simulated students, learning rules). See section 9 of the notebook for the limits.
