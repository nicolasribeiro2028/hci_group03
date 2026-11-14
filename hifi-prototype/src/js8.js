
  /* ---------------- Exercise mode ----------------
     A separate mode from the chat. The student sets a time budget, topics, where exercises may come from and how hard it
     should feel. A planner then chooses WHICH exercises and in WHAT ORDER, and plans again after every exercise.
     The planner here follows the objective of the optimization notebook (version 4: learning gained over the session,
     the level rising along the plan, a bonus for recovering what was just missed, penalties for near-duplicates and for
     AI-generated exercises). The notebook solves it exactly with Gurobi. This page cannot run Gurobi, so it searches the
     same objective with a beam search, which is enough for a pool of this size.
     Prototype content: the exercises, their difficulty, minutes and element tags are made up for this demo.
     Contract between the screens and the planner: see EXERCISE_MODE_CONTRACT.md. */
  var EXQ = 'Exercise sheet 3';
  var HINTS = { basic: 'Power rule (slide 10): d/dx xⁿ = n · xⁿ⁻¹. Apply it to each term and keep constant multiples in front.', pq: 'Product rule (slide 11): (f · g)′ = f′ · g + f · g′. Quotient rule: (f / g)′ = (f′ · g − f · g′) / g².', chain: 'Chain rule (slide 12): differentiate the outside, keep the inside, then multiply by the derivative of the inside.', tangent: 'The slope of the tangent line at x = a is the derivative f′(a) (slide 20).', optim: 'Maxima and minima occur where f′(x) = 0 (slide 21). Check the sign of f′ on both sides.' };
  function XE(id, topic, d, min, src, el, q, fn, sol) { return { id: id, topic: topic, d: d, min: min, src: src, el: el, q: q, fn: fn, sol: sol }; }
  var EXB = [
    XE('b1', 'basic', 2, 3, 'up', ['power'], 'Find f′(x) for f(x) = x⁵.', function (x) { return 5 * Math.pow(x, 4); }, 'f′(x) = 5x⁴.'),
    XE('b2', 'basic', 3, 4, 'up', ['power', 'sum', 'cm'], 'Find f′(x) for f(x) = 4x³ − 2x + 7.', function (x) { return 12 * x * x - 2; }, 'f′(x) = 12x² − 2. The constant 7 has derivative 0.'),
    XE('b3', 'basic', 4, 5, 'up', ['power', 'sum', 'cm'], 'Find f′(x) for f(x) = 3x⁴ + x²/2 − 5x.', function (x) { return 12 * Math.pow(x, 3) + x - 5; }, 'f′(x) = 12x³ + x − 5.'),
    XE('b4', 'basic', 5, 5, 'ai', ['power', 'sum', 'cm'], 'Find f′(x) for f(x) = 5x⁷ − 3x⁵ + 2x³.', function (x) { return 35 * Math.pow(x, 6) - 15 * Math.pow(x, 4) + 6 * x * x; }, 'f′(x) = 35x⁶ − 15x⁴ + 6x².'),
    XE('q1', 'pq', 4, 5, 'up', ['power', 'product'], 'Find f′(x) for f(x) = x² · (x + 3).', function (x) { return 3 * x * x + 6 * x; }, 'Product rule: 2x(x + 3) + x² · 1 = 3x² + 6x.'),
    XE('q2', 'pq', 5, 6, 'up', ['power', 'product', 'sum'], 'Find f′(x) for f(x) = (2x + 1)(x² − 4).', function (x) { return 6 * x * x + 2 * x - 8; }, 'Product rule: 2(x² − 4) + (2x + 1)(2x) = 6x² + 2x − 8.'),
    XE('q3', 'pq', 6, 7, 'ai', ['power', 'quotient'], 'Find f′(x) for f(x) = x / (x + 1).', function (x) { return 1 / ((x + 1) * (x + 1)); }, 'Quotient rule: ((x + 1) − x) / (x + 1)² = 1 / (x + 1)².'),
    XE('q4', 'pq', 7, 8, 'ai', ['power', 'quotient', 'sum'], 'Find f′(x) for f(x) = (x² + 1) / (x − 2).', function (x) { return (x * x - 4 * x - 1) / ((x - 2) * (x - 2)); }, 'Quotient rule: (2x(x − 2) − (x² + 1)) / (x − 2)² = (x² − 4x − 1) / (x − 2)².'),
    XE('c0', 'chain', 2, 3, 'up', ['power', 'chain', 'sum'], 'Find f′(x) for f(x) = (x + 1)³.', function (x) { return 3 * Math.pow(x + 1, 2); }, 'Outside: 3(x + 1)². Inside: x + 1, derivative 1. So f′(x) = 3(x + 1)².'),
    XE('c1', 'chain', 4, 4, 'up', ['power', 'chain', 'sum'], 'Find f′(x) for f(x) = (4x − 1)³.', function (x) { return 12 * Math.pow(4 * x - 1, 2); }, 'Outside: 3(4x − 1)². Inside: 4x − 1, derivative 4. So f′(x) = 12(4x − 1)².'),
    XE('c2', 'chain', 5, 5, 'up', ['power', 'chain'], 'Find f′(x) for f(x) = (x² + 3)⁵.', function (x) { return 10 * x * Math.pow(x * x + 3, 4); }, 'Outside: 5(x² + 3)⁴. Inside derivative: 2x. So f′(x) = 10x(x² + 3)⁴.'),
    XE('c3', 'chain', 6, 6, 'ai', ['power', 'chain', 'cm'], 'Find f′(x) for f(x) = (5x² − 2)³.', function (x) { return 30 * x * Math.pow(5 * x * x - 2, 2); }, 'Outside: 3(5x² − 2)². Inside derivative: 10x. So f′(x) = 30x(5x² − 2)².'),
    XE('c4', 'chain', 8, 8, 'ai', ['power', 'chain', 'product'], 'Find f′(x) for f(x) = x · (x² + 1)³.', function (x) { return Math.pow(x * x + 1, 2) * (7 * x * x + 1); }, 'Product and chain rule: (x² + 1)³ + x · 3(x² + 1)² · 2x = (x² + 1)²(7x² + 1).'),
    XE('c5', 'chain', 7, 7, 'ai', ['power', 'chain', 'sum'], 'Find f′(x) for f(x) = (x³ − x)⁴.', function (x) { return 4 * Math.pow(x * x * x - x, 3) * (3 * x * x - 1); }, 'Outside: 4(x³ − x)³. Inside derivative: 3x² − 1. So f′(x) = 4(x³ − x)³(3x² − 1).'),
    XE('t1', 'tangent', 3, 3, 'up', ['power', 'sum', 'tangent'], 'Find the slope of the tangent line to f(x) = x² + 3x at x = 2.', function () { return 7; }, 'f′(x) = 2x + 3, so the slope at x = 2 is 7.'),
    XE('t2', 'tangent', 5, 6, 'ai', ['power', 'chain', 'tangent'], 'Find the slope of the tangent line to f(x) = (x² + 1)³ at x = 1.', function () { return 24; }, 'f′(x) = 3(x² + 1)² · 2x, so at x = 1 the slope is 3 · 4 · 2 = 24.'),
    XE('t3', 'tangent', 6, 5, 'up', ['power', 'sum', 'tangent'], 'Find the slope of the tangent line to f(x) = x³ − 4x at x = 2.', function () { return 8; }, 'f′(x) = 3x² − 4, so at x = 2 the slope is 8.'),
    XE('o0', 'optim', 2, 3, 'up', ['power', 'sum', 'critical'], 'At which x does f(x) = x² − 4x have its smallest value?', function () { return 2; }, 'f′(x) = 2x − 4 = 0 gives x = 2.'),
    XE('o1', 'optim', 4, 4, 'up', ['power', 'sum', 'critical'], 'At which x does f(x) = x² − 6x + 4 have its smallest value?', function () { return 3; }, 'f′(x) = 2x − 6 = 0 gives x = 3.'),
    XE('o2', 'optim', 6, 6, 'up', ['power', 'sum', 'critical'], 'At which x > 0 does f(x) = x³ − 12x have a local minimum?', function () { return 2; }, 'f′(x) = 3x² − 12 = 0 gives x = 2. The sign of f′ changes from negative to positive there.'),
    XE('o3', 'optim', 5, 5, 'ai', ['power', 'critical'], 'What is the largest possible product of two numbers whose sum is 20?', function () { return 100; }, 'With the numbers x and 20 − x, the product x(20 − x) is largest at x = 10, so the product is 100.')
  ];
  var SRC = { both: 'Uploaded and AI-generated', up: 'Uploaded only', ai: 'AI-generated only' };
  var PM = { QPEAK: 0.6, S: 1.5, W0: 2, W1: 2, B0: 2, FLOOR: 0.05, BETA: 0.5, TREF: 5, ETA: 0.35, LREM: 0.8, LRED: 0.4, LGEN: 0.15, LHRED: 0.3, SIMR: 0.6, WIDTH: 250 };
  function cl(x, a, b) { return Math.min(b, Math.max(a, x)); }
  function sg(x) { return 1 / (1 + Math.exp(-x)); }
  function lgt(p) { return Math.log(p / (1 - p)); }
  function xById(id) { return EXB.filter(function (e) { return e.id === id; })[0]; }
  function xSim(a, b) {
    if (a === b) return 1;
    var i = a.el.filter(function (t) { return b.el.indexOf(t) >= 0; }).length, u = a.el.length + b.el.length - i;
    return u ? i / u : 0;
  }
  /* what the planner believes about the student: topic level from the self-rating, corrected by results so far */
  function xAbility(e, rat, hist) {
    var rd = hist.map(function (h) { var x = xById(h.id); return { x: x, a: x.d + PM.S * lgt(cl(h.r, 0.1, 0.9)) }; });
    var r0 = rat[e.topic], base = r0 == null ? 5 : r0, w0 = r0 == null ? 0.3 : PM.W0, bias = 0;
    if (rd.length) { var sm = 0; rd.forEach(function (q) { var rr = rat[q.x.topic]; sm += q.a - (rr == null ? 5 : rr); }); bias = sm / (PM.B0 + rd.length); }
    var tj = rd.filter(function (q) { return q.x.topic === e.topic; }), st = 0; tj.forEach(function (q) { st += q.a; });
    var at = (w0 * (base + bias) + st) / (w0 + tj.length), num = PM.W1 * at, den = PM.W1;
    rd.forEach(function (q) { var k = xSim(e, q.x); num += k * q.a; den += k; });
    return num / den;
  }
  function xValue(e, a, qp) {
    var p = sg((a - e.d) / PM.S), room = cl((10 - a) / 10, 0, 1);
    var q = Math.pow(p, 5 * qp) * Math.pow(1 - p, 5 * (1 - qp)) / (Math.pow(qp, 5 * qp) * Math.pow(1 - qp, 5 * (1 - qp)));
    return { v: (q * (0.4 + 0.6 * room) + PM.FLOOR) * Math.pow(e.min / PM.TREF, PM.BETA), p: p };
  }
  /* inp: { remaining, topics:[ids], source:'both'|'up'|'ai', rat:{topic:rating}, hist:[{id, r}] } */
  function xPlan(inp) {
    var done = {}; inp.hist.forEach(function (h) { done[h.id] = 1; });
    var cand = EXB.filter(function (e) { return !done[e.id] && inp.topics.indexOf(e.topic) >= 0 && e.min <= inp.remaining && (inp.source === 'both' || e.src === inp.source); });
    if (!cand.length) return { items: [], obj: 0 };
    var est = {}, last = inp.hist.length ? inp.hist[inp.hist.length - 1] : null, lastE = last ? xById(last.id) : null;
    var sev = last ? cl((0.5 - last.r) / 0.4, 0, 1) : 0;
    var solved = inp.hist.filter(function (h) { return h.r >= 0.5; }).map(function (h) { return xById(h.id); });
    cand.forEach(function (e) {
      var mx = 0; solved.forEach(function (s) { mx = Math.max(mx, xSim(e, s)); });
      est[e.id] = { a: xAbility(e, inp.rat, inp.hist), rem: lastE ? PM.LREM * sev * xSim(lastE, e) * Math.pow(e.min / PM.TREF, PM.BETA) : 0, hp: mx > PM.SIMR ? PM.LHRED * mx : 0 };
    });
    var layer = [{ seq: [], t: 0, A: {}, obj: 0, info: [] }], best = null;
    for (var step = 0; step < cand.length; step++) {
      var nxt = [];
      layer.forEach(function (s) {
        cand.forEach(function (e) {
          if (s.seq.indexOf(e) >= 0 || s.t + e.min > inp.remaining) return;
          var A = s.A[e.topic] || 0, v = xValue(e, est[e.id].a + A, PM.QPEAK), gain = v.v;
          var add = gain - est[e.id].hp - (e.src === 'ai' ? PM.LGEN : 0) + (s.seq.length === 0 ? est[e.id].rem : 0);
          s.seq.forEach(function (o) { var k = xSim(e, o); if (k > PM.SIMR) add -= PM.LRED * k; });
          var A2 = {}; for (var k2 in s.A) A2[k2] = s.A[k2]; A2[e.topic] = A + PM.ETA * gain;
          nxt.push({ seq: s.seq.concat([e]), t: s.t + e.min, A: A2, obj: s.obj + add, info: s.info.concat([{ p: v.p, rem: s.seq.length === 0 ? est[e.id].rem : 0 }]) });
        });
      });
      if (!nxt.length) break;
      nxt.sort(function (a, b) { return b.obj - a.obj; });
      layer = nxt.slice(0, PM.WIDTH);
      if (!best || layer[0].obj > best.obj) best = layer[0];
    }
    if (!best) return { items: [], obj: 0 };
    var items = best.seq.map(function (e, i) { return { id: e.id, min: e.min, p: best.info[i].p, rem: best.info[i].rem }; });
    return { items: items, obj: best.obj };
  }
  function xWhy(it, i, items, inp) {
    var e = xById(it.id), prev = i ? xById(items[i - 1].id) : null, parts = [];
    if (it.rem > 0.05) parts.push('Close to the one you just missed, so you can recover it.');
    else {
      var lowest = inp.topics.slice().sort(function (a, b) { var ra = inp.rat[a] == null ? 5 : inp.rat[a], rb = inp.rat[b] == null ? 5 : inp.rat[b]; return ra - rb; })[0];
      var firstOfTopic = !items.slice(0, i).some(function (o) { return xById(o.id).topic === e.topic; });
      if (prev && prev.topic === e.topic && e.d >= prev.d) parts.push('Builds on the previous exercise.');
      else if (e.topic === lowest && firstOfTopic) parts.push('Your lowest-rated topic.');
      else if (firstOfTopic) parts.push('Keeps this topic in the session.');
      else parts.push('Practice in the same topic at a similar level.');
    }
    return parts.join(' ');
  }
  function xFeel(p) { return p >= PM.QPEAK + 0.2 ? 'Easier than usual' : p >= PM.QPEAK - 0.15 ? 'About right' : 'A stretch'; }

  /* ---------------- state and flow ---------------- */
  /* Asks the local server to solve the integer program with Gurobi (solver/plan.py). If that is not available, searches in the page. */
  function exPlanner(inp) {
    var body = JSON.stringify({ bank: EXB.map(function (e) { return { id: e.id, topic: e.topic, d: e.d, min: e.min, src: e.src, el: e.el }; }), remaining: inp.remaining, topics: inp.topics, source: inp.source, rat: inp.rat, hist: inp.hist });
    var ctl = window.AbortController ? new AbortController() : null, to = setTimeout(function () { if (ctl) ctl.abort(); }, 15000);
    return fetch('/plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body, signal: ctl ? ctl.signal : undefined })
      .then(function (r) { clearTimeout(to); if (!r.ok) return r.json().then(function (j) { throw new Error(j.error || 'solver error'); }); return r.json(); })
      .then(function (j) { return { items: j.items, solver: 'gurobi', info: j.status + ', ' + j.runtime + ' s, ' + j.nvars + ' variables' }; })
      .catch(function (err) { clearTimeout(to); var r = xPlan(inp); return { items: r.items, solver: 'search', info: String(err && err.message || 'not available') }; });
  }
  function solverNote() {
    var s = S.ex; if (!s || !s.solver) return '';
    return s.solver === 'gurobi' ? '<p class="fine exsolver">Planned with Gurobi (' + esc(s.solverInfo) + ').</p>' : '<p class="fine exsolver">Planned with the in-page search, not Gurobi (' + esc(s.solverInfo) + '). Start the Node server with the solver to use Gurobi.</p>';
  }
  function exTopicsAvail() { return C.topics.filter(function (t) { return EXB.some(function (e) { return e.topic === t.id; }); }); }
  function exNew() {
    var av = exTopicsAvail(), tp = {}; av.forEach(function (t) { tp[t.id] = true; });
    return { phase: 'setup', time: 30, topics: tp, source: 'both', plan: [], hist: [], cur: 0, used: 0, rat0: null, tries: 0, hint: false, sol: false, input: '', fb: '', res: null, note: '', ctx: S.ctx };
  }
  function exInput() { var s = S.ex, tp = Object.keys(s.topics).filter(function (k) { return s.topics[k]; }); return { remaining: s.time - s.used, topics: tp, source: s.source, rat: s.rat0 || C.ratings, hist: s.hist.map(function (h) { return { id: h.id, r: h.r }; }) }; }
  function exOpen() {
    if (!S.ex || S.ex.ctx !== S.ctx) S.ex = exNew();
    if (S.focus) setFocus(false);
    S.gOn = false; renderViewer();
    S.exOn = true; exRender(); var b = $('#exview .exh h2'); if (b) b.focus();
    announce('Exercise mode open');
  }
  function exExit() { S.exOn = false; exRender(); renderTop(); }
  function exBuild() {
    var s = S.ex, inp = exInput();
    if (s.busy) return;
    if (!inp.topics.length) { s.note = 'Pick at least one topic.'; exRender(); return; }
    s.rat0 = JSON.parse(JSON.stringify(C.ratings)); inp.rat = s.rat0; s.busy = true; s.note = ''; exRender();
    exPlanner(inp).then(function (r) {
      s.busy = false;
      if (!r.items.length) { s.note = 'No exercise fits these settings. Try more time, another source or more topics.'; exRender(); return; }
      s.solver = r.solver; s.solverInfo = r.info;
      s.plan = r.items.map(function (it, i, a) { it.why = xWhy(it, i, a, inp); return it; }); s.phase = 'plan'; exRender();
    });
  }
  function exStart() { var s = S.ex; s.phase = 'run'; s.cur = 0; s.hist = []; s.used = 0; s.tries = 0; s.hint = false; s.sol = false; s.input = ''; s.fb = ''; s.res = null; exRender(); var i = $('#ex-in'); if (i) i.focus(); }
  function exCur() { var s = S.ex; return s.plan[s.cur] ? xById(s.plan[s.cur].id) : null; }
  function exSubmit() {
    var s = S.ex, e = exCur(), inp = $('#ex-in'); if (!e || s.res) return;
    var f = parseFn(inp.value); s.input = inp.value;
    if (!inp.value.trim()) { s.fb = 'Write your answer first.'; exRender(true); return; }
    if (!f) { s.fb = 'I could not read that. Use x, numbers, + − × ÷, ^ and brackets.'; exRender(true); return; }
    if (same(f, e.fn)) { exFinish(s.sol ? 'solution' : s.hint ? 'hint' : s.tries ? 'retry' : 'clean'); return; }
    s.tries++; s.fb = s.tries === 1 ? 'Not quite yet. Try again, or ask for a hint.' : 'Still not right. A hint can help, or you can look at the solution.'; exRender(true);
  }
  var RES = { clean: [0.9, 1, 'Solved with no help.'], retry: [0.8, 1, 'Solved after another try, with no help.'], hint: [0.7, 0.5, 'Solved with a hint.'], solution: [0.4, 0, 'Solution seen.'], skip: [0.1, 0, 'Skipped.'] };
  function exFinish(kind) {
    var s = S.ex, e = exCur(), r = RES[kind], tp = e.topic;
    s.hist.push({ id: e.id, r: r[0], kind: kind, min: e.min }); s.used += e.min;
    var old = C.ratings[tp], base = old == null ? 5 : old, nv = Math.max(0, Math.min(10, base + r[1]));
    if (C.start[tp] == null) C.start[tp] = base;
    C.ratings[tp] = nv; C.last[tp] = nv - base; C.pulse[tp] = true; renderLeft();
    var inp = exInput(), oldNext = s.plan[s.cur + 1] ? s.plan[s.cur + 1].id : null, kept = s.plan.slice(0, s.cur + 1);
    s.res = { kind: kind, text: r[2], rating: [base, nv], note: 'Planning the next exercises…', more: false, pending: true }; s.fb = '';
    exRender();
    exPlanner(inp).then(function (rest) {
      if (S.ex !== s || !s.res) return;
      rest.items.forEach(function (it, i, a) { it.why = xWhy(it, i, a, inp); });
      var newNext = rest.items[0] ? rest.items[0].id : null, note;
      if (!newNext) note = 'No exercise fits in the time left.';
      else if (oldNext && newNext !== oldNext) note = 'The plan changed. Next is now ' + exTitle(xById(newNext)) + ' instead of ' + exTitle(xById(oldNext)) + why(kind, e, xById(newNext));
      else note = 'The plan was checked again. The next exercise stays.';
      s.plan = kept.concat(rest.items); s.solver = rest.solver; s.solverInfo = rest.info;
      s.res.note = note; s.res.more = !!newNext; s.res.pending = false; exRender();
    });
  }
  function why(kind, cur, nx) {
    if ((kind === 'solution' || kind === 'skip') && xSim(cur, nx) > 0.4) return ', because it is related to the one you just missed.';
    return ', because your estimated level changed after this result.';
  }
  function exTitle(e) { return e ? ({ basic: 'Basic rules', pq: 'Product and quotient', chain: 'Chain rule', tangent: 'Tangent lines', optim: 'Optimization' })[e.topic] + ' (' + e.min + ' min)' : ''; }
  function exNext() {
    var s = S.ex; if (!s.res) return;
    if (!s.res.more) { s.phase = 'done'; exRender(); return; }
    s.cur++; s.tries = 0; s.hint = false; s.sol = false; s.input = ''; s.fb = ''; s.res = null; exRender(); var i = $('#ex-in'); if (i) i.focus();
  }

  /* ---------------- rendering ---------------- */
  function seg(attr, items, on) {
    return '<div class="seg" role="group">' + items.map(function (it) { return '<button type="button" class="' + (String(it[0]) === String(on) ? 'on' : '') + '" data-ex="' + attr + '" data-v="' + it[0] + '" aria-pressed="' + (String(it[0]) === String(on)) + '">' + esc(it[1]) + '</button>'; }).join('') + '</div>';
  }
  function exHead(sub) {
    return '<div class="exh"><div><h2 tabindex="-1">Exercise mode</h2><p class="soft small">' + esc(sub) + '</p></div><span class="spacer"></span><button class="btn small" data-ex="exit">Back to chat</button></div>';
  }
  function bar(r) { return '<span class="exbar" aria-hidden="true"><i style="width:' + (r == null ? 0 : r * 10) + '%"></i></span>'; }
  function exSetup() {
    var s = S.ex, av = exTopicsAvail(), ctxName = (S.ctxs.filter(function (c) { return c.key === S.ctx; })[0] || {}).name;
    if (!av.length) return exHead(ctxName) + '<div class="exbody"><div class="excard narrow"><h3>No exercises for this course yet</h3><p class="soft">The exercise bank in this prototype covers Calculus I. Add the Calculus I lectures in Material and rate your topics, then come back.</p><div class="row" style="gap:8px;margin-top:14px"><button class="btn dark" data-ex="material">Open material</button></div></div></div>';
    var rows = av.map(function (t) {
      var r = C.ratings[t.id], n = EXB.filter(function (e) { return e.topic === t.id; }).length;
      return '<label class="extopic"><input type="checkbox" data-ex="topic" data-v="' + t.id + '"' + (s.topics[t.id] ? ' checked' : '') + '><span class="tn">' + esc(t.name) + '</span><span class="tc soft small">' + n + ' exercises</span>' + bar(r) + '<span class="tr small">' + (r == null ? 'Not rated' : fmt(r) + '/10') + '</span></label>';
    }).join('');
    var nup = EXB.filter(function (e) { return e.src === 'up'; }).length, nai = EXB.length - nup;
    return exHead(ctxName + ' · set up your session') + '<div class="exbody"><div class="excard">' +
      '<div class="exsec"><h3>How much time do you have?</h3>' + seg('time', [[15, '15 min'], [30, '30 min'], [45, '45 min'], [60, '60 min']], s.time) + '</div>' +
      '<div class="exsec"><h3>Which topics?</h3><div class="extopics">' + rows + '</div><p class="fine">Your ratings come from Self-assess. They update as you practice.</p></div>' +
      '<div class="exsec"><h3>Where can exercises come from?</h3>' + seg('src', [['both', SRC.both], ['up', SRC.up], ['ai', SRC.ai]], s.source) + '<p class="fine">' + nup + ' uploaded from ' + EXQ + ', ' + nai + ' AI-generated for this demo. AI-generated exercises are used when they add something the sheets do not.</p></div>' +
      (s.note ? '<p class="exwarn" role="alert">' + esc(s.note) + '</p>' : '') +
      '<div class="row" style="gap:10px;margin-top:6px"><button class="btn dark" style="height:40px;padding:0 22px" data-ex="build"' + (s.busy ? ' disabled' : '') + '>' + (s.busy ? 'Planning…' : 'Build my plan') + '</button><span class="soft small">The plan picks exercises and their order for ' + s.time + ' minutes.</span></div></div>' +
      '<aside class="exside"><h3>How it works</h3><ol><li>You choose time, topics and how hard it should feel.</li><li>The planner picks which exercises to do and in what order.</li><li>After every exercise it plans again with what happened.</li></ol><p class="fine">Plans are made for you from your ratings and results, not from a fixed list.</p></aside></div>';
  }
  function itemRow(it, i, state) {
    var e = xById(it.id), h = S.ex.hist[i];
    return '<li class="exit ' + state + '"><span class="exn">' + (state === 'done' ? '✓' : i + 1) + '</span><span class="exm"><b>' + esc(exTitle(e)) + '</b><span class="soft small">' + esc(e.q) + '</span>' +
      '<span class="exmeta small"><span class="exsrc ' + e.src + '">' + (e.src === 'up' ? 'Uploaded · ' + EXQ : 'AI-generated') + '</span>' + (state === 'done' ? '<span class="soft">' + esc(RES[h.kind][2]) + '</span>' : '<span class="soft">' + xFeel(it.p) + ' · about ' + Math.round(it.p * 10) + ' in 10 solved on your own (estimate)</span>') + '</span>' +
      (state !== 'done' && it.why ? '<span class="exwhy small">' + esc(it.why) + '</span>' : '') + '</span></li>';
  }
  function exPlanView() {
    var s = S.ex, tot = s.plan.reduce(function (a, b) { return a + b.min; }, 0);
    return exHead('Your plan for ' + s.time + ' minutes') + '<div class="exbody"><div class="excard"><div class="exsum"><b>' + s.plan.length + ' exercises, about ' + tot + ' of ' + s.time + ' minutes</b><span class="exbudget"><i style="width:' + Math.round(100 * tot / s.time) + '%"></i></span></div>' +
      '<ol class="exlist">' + s.plan.map(function (it, i) { return itemRow(it, i, 'todo'); }).join('') + '</ol>' +
      '<p class="fine">Minutes are estimates. Only the next exercise is certain: after each one, the plan is made again with your result.</p>' + solverNote() +
      '<div class="row" style="gap:10px;margin-top:8px"><button class="btn dark" style="height:40px;padding:0 22px" data-ex="start">Start</button><button class="btn" style="height:40px" data-ex="back">Change settings</button></div></div></div>';
  }
  function exRun() {
    var s = S.ex, e = exCur(), r = s.res;
    var list = s.plan.map(function (it, i) { return itemRow(it, i, i < s.cur || (i === s.cur && r) ? 'done' : i === s.cur ? 'now' : 'todo'); }).join('');
    var keys = [['x', 'x'], ['x²', '^2'], ['xⁿ', '^'], ['(', '('], [')', ')'], ['×', '*'], ['÷', '/']].map(function (k) { return '<button type="button" class="mk" data-ex="key" data-v="' + k[1] + '" aria-label="Insert ' + esc(k[0]) + '">' + k[0] + '</button>'; }).join('');
    var main = '<div class="excur"><div class="exmeta small"><span class="exsrc ' + e.src + '">' + (e.src === 'up' ? 'Uploaded · ' + EXQ : 'AI-generated') + '</span><span class="soft">' + esc(exTitle(e)) + ' · exercise ' + (s.cur + 1) + '</span></div><p class="exq">' + esc(e.q) + '</p>';
    if (!r) {
      main += '<div class="exans"><div class="mkeys" role="group" aria-label="Math keys">' + keys + '</div><div class="row" style="gap:8px"><input class="inp" id="ex-in" autocomplete="off" placeholder="Write your answer…" aria-label="Your answer" value="' + esc(s.input) + '" style="height:40px"><button class="btn dark" style="height:40px;padding:0 20px" data-ex="submit">Check</button></div></div>';
      if (s.fb) main += '<p class="exfb" role="status">' + esc(s.fb) + '</p>';
      if (s.hint) main += '<div class="exhint"><b>Hint</b> ' + esc(HINTS[e.topic]) + '</div>';
      if (s.sol) main += '<div class="exhint sol"><b>Solution</b> ' + esc(e.sol) + '</div>';
      main += '<div class="row" style="gap:8px;margin-top:12px"><button class="btn small" data-ex="hint"' + (s.hint ? ' disabled' : '') + '>Show a hint</button><button class="btn small" data-ex="sol"' + (s.sol ? ' disabled' : '') + '>Show the solution</button><button class="btn small ghost" data-ex="skip">Skip</button></div>';
    } else {
      main += '<div class="exres ' + r.kind + '"><b>' + esc(r.text) + '</b><span class="small">' + (r.rating[1] > r.rating[0] ? 'Your rating for this topic went from ' + fmt(r.rating[0]) + ' to ' + fmt(r.rating[1]) + ' of 10.' : 'Your rating for this topic stays at ' + fmt(r.rating[1]) + ' of 10.') + '</span>' + (r.kind !== 'clean' && r.kind !== 'retry' ? '<span class="small">Solution: ' + esc(e.sol) + '</span>' : '') + '</div>' +
        '<div class="explan"><b>Plan updated</b><span>' + esc(r.note) + '</span></div><div class="row" style="gap:8px;margin-top:12px"><button class="btn dark" style="height:40px;padding:0 20px" data-ex="next"' + (r.pending ? ' disabled' : '') + '>' + (r.pending ? 'Planning…' : r.more ? 'Next exercise' : 'See summary') + '</button></div>';
    }
    main += '</div>';
    var left = S.ex.time - s.used;
    return exHead('Session in progress') + '<div class="exbody run"><aside class="exrail"><div class="exsum"><b>' + s.used + ' of ' + s.time + ' min</b><span class="exbudget"><i style="width:' + Math.min(100, Math.round(100 * s.used / s.time)) + '%"></i></span></div><ol class="exlist small">' + list + '</ol><p class="fine">' + left + ' min left. Exercises below may change after your next answer.</p>' + solverNote() + '</aside>' + main + '</div>';
  }
  function exDone() {
    var s = S.ex, solved = s.hist.filter(function (h) { return h.r >= 0.5; }).length, clean = s.hist.filter(function (h) { return h.kind === 'clean' || h.kind === 'retry'; }).length, tp = {};
    s.hist.forEach(function (h) { tp[xById(h.id).topic] = 1; });
    var rows = Object.keys(tp).map(function (k) { var a = s.rat0[k] == null ? 5 : s.rat0[k], b = C.ratings[k]; return '<li><span>' + esc(TOPIC_DEFS[k].name) + '</span><span class="soft">' + fmt(a) + ' → ' + fmt(b) + ' of 10</span></li>'; }).join('');
    return exHead('Session finished') + '<div class="exbody"><div class="excard narrow"><h3>' + s.hist.length + ' exercises in ' + s.used + ' of ' + s.time + ' minutes</h3><ul class="exstats"><li><b>' + solved + '</b> solved</li><li><b>' + clean + '</b> with no help</li><li><b>' + s.hist.filter(function (h) { return h.kind === 'skip'; }).length + '</b> skipped</li></ul>' +
      '<h3 style="margin-top:18px">Your ratings</h3><ul class="exrates">' + rows + '</ul><p class="fine">Rating changes follow a simple prototype rule, not a measurement.</p><div class="row" style="gap:8px;margin-top:12px"><button class="btn dark" data-ex="again">Plan another session</button><button class="btn" data-ex="exit">Back to chat</button></div></div></div>';
  }
  function exRender(keepFocus) {
    var v = $('#exview'); if (!v) return;
    v.hidden = !S.exOn;
    var b = $('#b-practice'); if (b) b.classList.toggle('on', !!S.exOn);
    if (!S.exOn) return;
    var had = keepFocus && document.activeElement && document.activeElement.id === 'ex-in', pos = had ? document.activeElement.selectionStart : 0;
    var ph = S.ex.phase;
    v.innerHTML = ph === 'setup' ? exSetup() : ph === 'plan' ? exPlanView() : ph === 'run' ? exRun() : exDone();
    if (had) { var i = $('#ex-in'); if (i) { i.focus(); try { i.setSelectionRange(pos, pos); } catch (x) { } } }
  }
  document.addEventListener('click', function (e) {
    var o = e.target.closest && e.target.closest('[data-ex]'); if (!o || !S.ex && o.dataset.ex !== 'open') return;
    var a = o.getAttribute('data-ex'), v = o.getAttribute('data-v'), s = S.ex;
    if (a === 'exit') exExit();
    else if (a === 'time') { s.time = +v; exRender(); }
    else if (a === 'src') { s.source = v; exRender(); }
    else if (a === 'topic') { s.topics[v] = o.checked; s.note = ''; }
    else if (a === 'build') exBuild();
    else if (a === 'back') { s.phase = 'setup'; exRender(); }
    else if (a === 'start') exStart();
    else if (a === 'submit') exSubmit();
    else if (a === 'hint') { s.hint = true; exRender(true); }
    else if (a === 'sol') { s.sol = true; s.hint = true; exRender(true); }
    else if (a === 'skip') exFinish('skip');
    else if (a === 'next') exNext();
    else if (a === 'again') { var keep = { time: s.time, source: s.source, topics: s.topics }; S.ex = exNew(); S.ex.time = keep.time; S.ex.source = keep.source; S.ex.topics = keep.topics; exRender(); }
    else if (a === 'material') { S.exOn = false; S.side = 'all'; exRender(); renderLeft(); }
    else if (a === 'key') {
      var inp = $('#ex-in'); if (!inp) return;
      var st = inp.selectionStart == null ? inp.value.length : inp.selectionStart, en = inp.selectionEnd == null ? st : inp.selectionEnd;
      inp.value = inp.value.slice(0, st) + v + inp.value.slice(en); inp.focus(); try { inp.setSelectionRange(st + v.length, st + v.length); } catch (x) { }
    }
  });
  document.addEventListener('mousedown', function (e) { if (e.target.closest && e.target.closest('#exview .mk')) e.preventDefault(); });
  document.addEventListener('keydown', function (e) {
    if (e.target.id === 'ex-in' && e.key === 'Enter') { e.preventDefault(); exSubmit(); }
    if (e.key === 'Escape' && S.exOn && !$('#ov')) exExit();
  });
  document.addEventListener('input', function (e) { if (e.target.id === 'ex-in' && S.ex) S.ex.input = e.target.value; });
  window.__ex = { bank: EXB, plan: xPlan, planner: exPlanner, ability: xAbility, S: function () { return S.ex; }, open: exOpen };
