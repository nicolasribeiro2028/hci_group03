#!/bin/sh
# One command to run the prototype:   ./run.sh
# First run: sets up the Gurobi solver for Exercise mode (needs python3 and internet). If that fails the page still works,
# it just plans the exercise path with its own search instead of Gurobi.
cd "$(dirname "$0")" || exit 1
if ! command -v node >/dev/null 2>&1; then echo "Node.js is needed to run the prototype (https://nodejs.org)."; exit 1; fi
if [ ! -x solver/.venv/bin/python ]; then
  echo "Setting up the Gurobi solver (first time only)..."
  if python3 -m venv solver/.venv && solver/.venv/bin/pip install -q -r solver/requirements.txt; then echo "Solver ready."; else echo "Solver setup failed. Exercise mode will use its own search."; rm -rf solver/.venv; fi
fi
echo "Open http://localhost:${PORT:-8765}/"
exec node server.js
