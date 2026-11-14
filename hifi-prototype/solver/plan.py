"""Exercise-mode planner that runs the integer program (version 4 of the model in model.py) with Gurobi.

Reads one JSON request on stdin, writes one JSON answer on stdout. Called by server.js for POST /plan.
Request:  { bank: [{id, topic, d, min, src, el}], remaining, topics, source, rat: {topic: rating|null}, hist: [{id, r}] }
Answer:   { items: [{id, min, p, rem}], solver: 'gurobi', status, gap, runtime, nvars, ncons, obj }
All numbers in the model are assumptions, see EXERCISE_PATH.md. gurobipy's pip license is size limited (2000 variables).
"""
import json
import os
import sys

from model import Model, V4


class Bank:                       # the small part of optimization-test/bank.py that the model reads
    pass


def jaccard(a, b):
    a, b = set(a), set(b)
    return len(a & b) / len(a | b) if (a | b) else 0.0


def solve(req):
    allowed = [e for e in req['bank'] if req.get('source', 'both') == 'both' or e['src'] == req['source']]
    b = Bank()
    b.X = [dict(id=e['id'], c=e['topic'], d=float(e['d']), t=float(e['min']), gen=(e['src'] == 'ai'), el=e['el']) for e in allowed]
    b.N = len(b.X)
    b.SIM = [[1.0 if i == j else jaccard(allowed[i]['el'], allowed[j]['el']) for j in range(b.N)] for i in range(b.N)]
    idx = {x['id']: i for i, x in enumerate(b.X)}
    topics = [t for t in req['topics']]
    P = dict(V4, K_CAND=int(os.environ.get('PLAN_KCAND', 12)), MIPGAP=float(os.environ.get('PLAN_GAP', 0.03)), TIME_LIMIT=float(os.environ.get('PLAN_TIME', 4)), QPEAK=0.6)   # candidates kept, optimality gap, seconds
    model = Model(b, P)
    st = dict(rating={t: (None if req['rat'].get(t) is None else float(req['rat'][t])) for t in topics},
              hist=[dict(i=idx[h['id']], r=float(h['r'])) for h in req['hist'] if h['id'] in idx])
    remaining = float(req['remaining'])
    cand, val, pr, rem = model.prepare(st, remaining, topics)
    res = model.plan(st, remaining, topics)
    items = [dict(id=b.X[i]['id'], min=b.X[i]['t'], p=res['pr'][i], rem=rem.get(i, 0.0)) for i in res['order']]
    return dict(items=items, solver='gurobi', status=res['status'], gap=res.get('gap'), runtime=round(res['runtime'], 3),
                nvars=res['nvars'], ncons=res['ncons'], obj=res['obj'], ncand=res['ncand'])


def main():
    print(json.dumps(solve(json.load(sys.stdin))))


if __name__ == '__main__':
    main()
