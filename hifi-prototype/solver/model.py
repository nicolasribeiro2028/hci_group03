"""The student model and the integer program (Gurobi) for the exercise path.

All parameters are assumptions. V1 is the first version we tested, V2 the rejected corrections, V3 the version chosen
after the first round of tests, V4 adds progress INSIDE the plan: the student's level rises as they practice, so the
value of a later exercise depends on what was done before it.
"""
import math
import itertools
import gurobipy as gp
from gurobipy import GRB

sig = lambda x: 1 / (1 + math.exp(-x))
logit = lambda p: math.log(p / (1 - p))
clamp = lambda x, a, b: min(b, max(a, x))

V1 = dict(S=1.5, W0=1.0, W0_SKIP=0.3, PSTAR=0.7, BAND=0.5, RHO=0.9, FLOOR=0.05,
          L_REM=0.8, L_RED=0.4, L_GEN=0.15, GAMMA=0.5, SIM_RED_MIN=0.6,
          KAPPA=0.0,      # caution while the evidence is thin (0 = off)
          ALPHA=0.0,      # value grows with minutes ** (ALPHA + BETA) (0 = every exercise is worth the same)
          BETA=0.0,
          TREF=5.0, L_INFO=0.0, K_CAND=None, TIME_LIMIT=10.0,
          EST='local',    # 'local': kernel over similar attempts only. 'hier': topic level + shared bias + local correction
          W1=2.0,         # (hier) weight of the topic-level estimate against similar attempts
          B0=0.0,         # (hier) strength of the prior that the self-rating is right in every topic (0 = no shared bias)
          FAILSHIFT=0.0,  # raise the target chance of success by this much per failure in a row
          L_HRED=0.0,     # penalty for being a near-duplicate of an exercise the student already SOLVED (not one they failed)
          VFORM='band',   # 'band': fit to a target chance of success. 'q': 4 p (1 - p), largest at 50%
          DYN=False,      # progress inside the plan: the level of a topic rises with the learning of earlier exercises
          ETA=0.35,       # ability points gained per unit of learning
          BIGM=4.0)
V2 = dict(V1, GAMMA=None, KAPPA=3.0, ALPHA=1.0, K_CAND=40)
V3 = dict(V1, GAMMA=None, K_CAND=40, EST='hier', B0=2.0, W0=2.0, W1=2.0, PSTAR=0.6, KAPPA=0.0, ALPHA=0.0, FAILSHIFT=0.0, L_HRED=0.3)
V4 = dict(V3, VFORM='q', DYN=True, BETA=0.5, RHO=1.0)


class Model:
    def __init__(self, bank, P):
        self.b, self.P = bank, P
        self.meta, self.raw, self.hp = {}, {}, {}

    # ---------- the student model: what the optimizer believes about this student
    def estimate(self, st, i):
        P, X, SIM = self.P, self.b.X, self.b.SIM
        c = X[i]['c']
        rating = st['rating'].get(c)
        w0 = P['W0'] if rating is not None else P['W0_SKIP']
        base = 5.0 if rating is None else rating
        readings = [(h['i'], X[h['i']]['d'] + P['S'] * logit(clamp(h['r'], 0.1, 0.9))) for h in st['hist']]
        if P['EST'] == 'local':
            num, den, ev = w0 * base, w0, 0.0
            for j, aj in readings:
                k = SIM[i][j]
                num += k * aj
                den += k
                ev += k
            a = num / den
            evw = ev + w0
        else:
            bias = 0.0
            if P['B0'] > 0 and readings:      # how far the results are from the self-ratings, shared across topics
                devs = [aj - (5.0 if st['rating'].get(X[j]['c']) is None else st['rating'][X[j]['c']]) for j, aj in readings]
                bias = sum(devs) / (P['B0'] + len(devs))
            tj = [aj for j, aj in readings if X[j]['c'] == c]
            a_topic = (w0 * (base + bias) + sum(tj)) / (w0 + len(tj))
            num, den = P['W1'] * a_topic, P['W1']
            for j, aj in readings:
                k = SIM[i][j]
                num += k * aj
                den += k
            a = num / den
            evw = w0 + len(tj) + (0.5 * (len(readings) - len(tj)) if P['B0'] > 0 else 0.0)
        return a, evw

    def core(self, i, a, evw, cf):
        """Value of exercise i for a student whose ability near i is `a`. Returns (value before the minutes scale, chance of success)."""
        P, X = self.P, self.b.X
        a_eff = a - (P['KAPPA'] / math.sqrt(evw) if P['KAPPA'] else 0.0)
        p = sig((a_eff - X[i]['d']) / P['S'])
        room = clamp((10 - a) / 10, 0, 1)
        if P['VFORM'] == 'q':
            qp = P.get('QPEAK')
            if qp:      # asymmetric: largest at chance of success qp (a smaller loss for being a bit too easy than a bit too hard)
                q = (p ** (5 * qp)) * ((1 - p) ** (5 * (1 - qp))) / ((qp ** (5 * qp)) * ((1 - qp) ** (5 * (1 - qp))))
            else:
                q = 4 * p * (1 - p)
            v = q * (0.4 + 0.6 * room) + P['FLOOR']
        else:
            pstar = min(0.9, P['PSTAR'] + P['FAILSHIFT'] * cf)
            v = max(0.0, 1 - abs(p - pstar) / P['BAND']) * (0.4 + 0.6 * room) + P['FLOOR']
        if P['L_INFO']:
            v += P['L_INFO'] * 4 * p * (1 - p) / evw
        return v, p

    def scale(self, i):
        e = self.P['ALPHA'] + self.P['BETA']
        return (self.b.X[i]['t'] / self.P['TREF']) ** e if e else 1.0

    def prepare(self, st, remaining, concepts, pool='all'):
        P, X, SIM = self.P, self.b.X, self.b.SIM
        done = {h['i'] for h in st['hist']}
        cand = [i for i in range(self.b.N) if i not in done and X[i]['c'] in concepts and X[i]['t'] <= remaining
                and (pool == 'all' or not X[i]['gen'])]
        cf = 0
        for h in reversed(st['hist']):
            if h['r'] < 0.5:
                cf += 1
            else:
                break
        val, pr, rem, self.raw, self.hp, self.meta = {}, {}, {}, {}, {}, {}
        last = st['hist'][-1] if st['hist'] else None
        sev = clamp((0.5 - last['r']) / 0.4, 0, 1) if last else 0.0
        solved = [h['i'] for h in st['hist'] if h['r'] >= 0.5]
        for i in cand:
            a, evw = self.estimate(st, i)
            v, p = self.core(i, a, evw, cf)
            sc = self.scale(i)
            self.meta[i] = (a, evw, cf)
            self.raw[i] = v * sc
            pr[i] = p
            rem[i] = P['L_REM'] * sev * SIM[last['i']][i] * sc if last else 0.0
            mx = max([SIM[i][j] for j in solved] or [0.0])
            self.hp[i] = P['L_HRED'] * mx if (P['L_HRED'] and mx > P['SIM_RED_MIN']) else 0.0
            val[i] = self.raw[i] - self.hp[i]
        if P['K_CAND'] and len(cand) > P['K_CAND']:        # keep the most promising candidates (keeps the model small)
            cand = sorted(cand, key=lambda i: -(val[i] + rem[i]))[:P['K_CAND']]
        return cand, val, pr, rem

    def slopes(self, cand):
        """First-order change of the learning value of an exercise per ability point (central difference)."""
        out = {}
        for i in cand:
            a, evw, cf = self.meta[i]
            hi = self.core(i, a + 0.5, evw, cf)[0]
            lo = self.core(i, a - 0.5, evw, cf)[0]
            out[i] = (hi - lo) * self.scale(i)
        return out

    # ---------- the integer program
    def plan(self, st, remaining, concepts, pool='all'):
        P, X, SIM = self.P, self.b.X, self.b.SIM
        cand, val, pr, rem = self.prepare(st, remaining, concepts, pool)
        res = dict(order=[], val=val, pr=pr, obj=None, status='no candidate', nvars=0, ncons=0, runtime=0.0, ncand=len(cand))
        if not cand:
            return res
        S = min(len(cand), int(remaining // min(X[i]['t'] for i in cand)), 24)
        m = gp.Model('path')
        m.Params.OutputFlag = 0
        m.Params.Threads = 1
        m.Params.TimeLimit = P['TIME_LIMIT']
        m.Params.MIPGap = P.get('MIPGAP', 1e-4)
        x = {(i, t): m.addVar(vtype=GRB.BINARY) for i in cand for t in range(S)}
        z = {i: gp.quicksum(x[i, t] for t in range(S)) for i in cand}
        for t in range(S):
            m.addConstr(gp.quicksum(x[i, t] for i in cand) <= 1)                                   # one exercise per position
        for t in range(S - 1):
            m.addConstr(gp.quicksum(x[i, t + 1] for i in cand) <= gp.quicksum(x[i, t] for i in cand))   # no gaps
        for i in cand:
            m.addConstr(z[i] <= 1)                                                                  # each exercise at most once
        m.addConstr(gp.quicksum(X[i]['t'] * z[i] for i in cand) <= remaining)                       # time budget
        m.addConstr(gp.quicksum(z[i] for i in cand) >= 1)
        if P['GAMMA'] is not None:                                                                  # optional hard cap on generated share
            m.addConstr(gp.quicksum(((1 if X[i]['gen'] else 0) - P['GAMMA']) * z[i] for i in cand) <= 0)
        y = {}
        for a, b in itertools.combinations(cand, 2):                                                # near-duplicates, linearized product
            if SIM[a][b] > P['SIM_RED_MIN']:
                y[a, b] = m.addVar(lb=0.0)
                m.addConstr(y[a, b] >= z[a] + z[b] - 1)
        if not P['DYN']:
            obj = gp.quicksum((P['RHO'] ** t) * (val[i] + (rem[i] if t == 0 else 0)) * x[i, t] for i in cand for t in range(S))
        else:
            # progress inside the plan. g[c,t] = learning gained in topic c at position t, A[c,t] = ability already gained in topic c.
            # The value of exercise e at position t is its value now plus (its slope) x (ability already gained): a first-order model.
            M = P['BIGM']
            slope = self.slopes(cand)
            topics = sorted({X[i]['c'] for i in cand})
            g = {(c, t): m.addVar(lb=-M, ub=M) for c in topics for t in range(S)}
            A = {(c, t): m.addVar(lb=-10.0, ub=10.0) for c in topics for t in range(S + 1)}
            for c in topics:
                m.addConstr(A[c, 0] == 0)
                for t in range(S):
                    m.addConstr(A[c, t + 1] == A[c, t] + P['ETA'] * g[c, t])
                    m.addConstr(g[c, t] <= M * gp.quicksum(x[i, t] for i in cand if X[i]['c'] == c))
                    for i in cand:
                        if X[i]['c'] == c:
                            m.addConstr(g[c, t] <= self.raw[i] + slope[i] * A[c, t] + 2 * M * (1 - x[i, t]))
            obj = gp.quicksum((P['RHO'] ** t) * g[c, t] for c in topics for t in range(S))
            obj += gp.quicksum(rem[i] * x[i, 0] for i in cand)
            obj -= gp.quicksum((P['RHO'] ** t) * self.hp[i] * x[i, t] for i in cand for t in range(S) if self.hp[i])
        obj -= P['L_GEN'] * gp.quicksum((1 if X[i]['gen'] else 0) * z[i] for i in cand)
        obj -= P['L_RED'] * gp.quicksum(SIM[a][b] * y[a, b] for (a, b) in y)
        m.setObjective(obj, GRB.MAXIMIZE)
        try:
            m.optimize()
        except gp.GurobiError as e:
            res.update(status='too large for license' if 'too large' in str(e) else 'solver error', nvars=m.NumVars, ncons=m.NumConstrs)
            return res
        res.update(nvars=m.NumVars, ncons=m.NumConstrs, runtime=m.Runtime, status={GRB.OPTIMAL: 'optimal', GRB.TIME_LIMIT: 'time limit', GRB.INFEASIBLE: 'infeasible'}.get(m.Status, str(m.Status)))
        if m.SolCount == 0:
            return res
        res['obj'] = m.ObjVal
        res['gap'] = m.MIPGap if m.IsMIP else 0.0
        order = []
        for t in range(S):
            for i in cand:
                if x[i, t].X > 0.5:
                    order.append(i)
        res['order'] = order
        return res

    # ---------- exact enumeration, for small pools only (a check on the solver)
    def enum_objective(self, st, remaining, concepts, pool='all'):
        P, X, SIM = self.P, self.b.X, self.b.SIM
        cand, val, pr, rem = self.prepare(st, remaining, concepts, pool)
        if P['DYN']:
            return self._enum_dynamic(cand, val, rem, remaining)
        best = -1e9
        sel = []

        def evalset():
            nonlocal best
            n = len(sel)
            gen = sum(1 for i in sel if X[i]['gen'])
            if P['GAMMA'] is not None and gen > P['GAMMA'] * n + 1e-9:
                return
            pen = P['L_GEN'] * gen
            for a, b in itertools.combinations(sel, 2):
                if SIM[a][b] > P['SIM_RED_MIN']:
                    pen += P['L_RED'] * SIM[a][b]
            srt = sorted(sel, key=lambda i: -val[i])
            bt = -1e9
            for f in sel:
                rest = [i for i in srt if i != f]
                tot = val[f] + rem[f] + sum(P['RHO'] ** (k + 1) * val[i] for k, i in enumerate(rest))
                bt = max(bt, tot)
            best = max(best, bt - pen)

        def rec(start, time):
            if sel:
                evalset()
            for k in range(start, len(cand)):
                i = cand[k]
                if time + X[i]['t'] > remaining:
                    continue
                sel.append(i)
                rec(k + 1, time + X[i]['t'])
                sel.pop()
        rec(0, 0)
        return best if best > -1e8 else None

    def _enum_dynamic(self, cand, val, rem, remaining):
        P, X, SIM = self.P, self.b.X, self.b.SIM
        slope = self.slopes(cand)
        M = P['BIGM']
        best = -1e9

        def total(seq):
            A = {}
            tot = 0.0
            for t, i in enumerate(seq):
                c = X[i]['c']
                gv = min(M, self.raw[i] + slope[i] * A.get(c, 0.0))
                tot += P['RHO'] ** t * (gv - self.hp[i])
                A[c] = A.get(c, 0.0) + P['ETA'] * gv
            tot += rem[seq[0]]
            gen = sum(1 for i in seq if X[i]['gen'])
            if P['GAMMA'] is not None and gen > P['GAMMA'] * len(seq) + 1e-9:
                return None
            tot -= P['L_GEN'] * gen
            for a, b in itertools.combinations(seq, 2):
                if SIM[a][b] > P['SIM_RED_MIN']:
                    tot -= P['L_RED'] * SIM[a][b]
            return tot

        def rec(seq, time):
            nonlocal best
            if seq:
                v = total(seq)
                if v is not None:
                    best = max(best, v)
            for i in cand:
                if i in seq or time + X[i]['t'] > remaining:
                    continue
                seq.append(i)
                rec(seq, time + X[i]['t'])
                seq.pop()
        rec([], 0)
        return best if best > -1e8 else None

    def linear_total(self, order):
        """The first-order learning value of an order (what the integer program maximizes), without penalties. Call prepare() first."""
        P, X = self.P, self.b.X
        slope = self.slopes(list(order))
        A, tot = {}, 0.0
        for i in order:
            c = X[i]['c']
            gv = min(P['BIGM'], self.raw[i] + slope[i] * A.get(c, 0.0))
            tot += gv
            A[c] = A.get(c, 0.0) + P['ETA'] * gv
        return tot

    def exact_total(self, st, order):
        """Learning value of a given order when the ability is updated exactly (not first order), for checking the approximation."""
        P, X = self.P, self.b.X
        A, tot = {}, 0.0
        for i in order:
            a, evw = self.estimate(st, i)
            cf = 0
            v, p = self.core(i, a + A.get(X[i]['c'], 0.0), evw, cf)
            gv = v * self.scale(i)
            tot += gv
            A[X[i]['c']] = A.get(X[i]['c'], 0.0) + P['ETA'] * gv
        return tot
