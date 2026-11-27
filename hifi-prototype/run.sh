#!/bin/sh
# One command to run the prototype:   ./run.sh
# First run: sets up the Gurobi solver for Exercise mode (needs python3 and internet). If that fails the page still works,
# it just plans the exercise path with its own search instead of Gurobi.
cd "$(dirname "$0")" || exit 1
if ! command -v node >/dev/null 2>&1; then echo "Node.js is needed to run the prototype (https://nodejs.org)."; exit 1; fi
if [ ! -x solver/.venv/bin/python ]; then
  echo "Setting up the Gurobi solver (first time only)..."
  PY=python3; for c in python3.15 python3.14 python3.13 python3.12 python3.11; do command -v $c >/dev/null 2>&1 && { PY=$c; break; }; done   # a recent Python gets the newest gurobipy, whose bundled licence runs longer
  if $PY -m venv solver/.venv && solver/.venv/bin/pip install -q -r solver/requirements.txt; then echo "Solver ready."; else echo "Solver setup failed. Exercise mode will use its own search."; rm -rf solver/.venv; fi
fi
echo "Open http://localhost:${PORT:-8765}/"
exec node server.js
