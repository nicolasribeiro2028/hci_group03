
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
    XE('b2', 'basic', 3, 4, 'up', ['power', 'sum', 'cm', 'cubic'], 'Find f′(x) for f(x) = 4x³ − 2x + 7.', function (x) { return 12 * x * x - 2; }, 'f′(x) = 12x² − 2. The constant 7 has derivative 0.'),
    XE('b3', 'basic', 4, 5, 'up', ['power', 'sum', 'cm', 'fraction-coef'], 'Find f′(x) for f(x) = 3x⁴ + x²/2 − 5x.', function (x) { return 12 * Math.pow(x, 3) + x - 5; }, 'f′(x) = 12x³ + x − 5.'),
    XE('b4', 'basic', 5, 5, 'ai', ['power', 'sum', 'cm', 'odd-powers', 'three-terms'], 'Find f′(x) for f(x) = 5x⁷ − 3x⁵ + 2x³.', function (x) { return 35 * Math.pow(x, 6) - 15 * Math.pow(x, 4) + 6 * x * x; }, 'f′(x) = 35x⁶ − 15x⁴ + 6x².'),
    XE('q1', 'pq', 4, 5, 'up', ['power', 'product'], 'Find f′(x) for f(x) = x² · (x + 3).', function (x) { return 3 * x * x + 6 * x; }, 'Product rule: 2x(x + 3) + x² · 1 = 3x² + 6x.'),
    XE('q2', 'pq', 5, 6, 'up', ['power', 'product', 'sum', 'linear'], 'Find f′(x) for f(x) = (2x + 1)(x² − 4).', function (x) { return 6 * x * x + 2 * x - 8; }, 'Product rule: 2(x² − 4) + (2x + 1)(2x) = 6x² + 2x − 8.'),
    XE('q3', 'pq', 6, 7, 'ai', ['power', 'quotient'], 'Find f′(x) for f(x) = x / (x + 1).', function (x) { return 1 / ((x + 1) * (x + 1)); }, 'Quotient rule: ((x + 1) − x) / (x + 1)² = 1 / (x + 1)².'),
    XE('q4', 'pq', 7, 8, 'ai', ['power', 'quotient', 'sum'], 'Find f′(x) for f(x) = (x² + 1) / (x − 2).', function (x) { return (x * x - 4 * x - 1) / ((x - 2) * (x - 2)); }, 'Quotient rule: (2x(x − 2) − (x² + 1)) / (x − 2)² = (x² − 4x − 1) / (x − 2)².'),
    XE('c0', 'chain', 2, 3, 'up', ['power', 'chain', 'linear-inside'], 'Find f′(x) for f(x) = (x + 1)³.', function (x) { return 3 * Math.pow(x + 1, 2); }, 'Outside: 3(x + 1)². Inside: x + 1, derivative 1. So f′(x) = 3(x + 1)².'),
    XE('c1', 'chain', 4, 4, 'up', ['power', 'chain', 'linear-inside', 'sum'], 'Find f′(x) for f(x) = (4x − 1)³.', function (x) { return 12 * Math.pow(4 * x - 1, 2); }, 'Outside: 3(4x − 1)². Inside: 4x − 1, derivative 4. So f′(x) = 12(4x − 1)².'),
    XE('c2', 'chain', 5, 5, 'up', ['power', 'chain', 'quad-inside'], 'Find f′(x) for f(x) = (x² + 3)⁵.', function (x) { return 10 * x * Math.pow(x * x + 3, 4); }, 'Outside: 5(x² + 3)⁴. Inside derivative: 2x. So f′(x) = 10x(x² + 3)⁴.'),
    XE('c3', 'chain', 6, 6, 'ai', ['power', 'chain', 'quad-inside', 'cm'], 'Find f′(x) for f(x) = (5x² − 2)³.', function (x) { return 30 * x * Math.pow(5 * x * x - 2, 2); }, 'Outside: 3(5x² − 2)². Inside derivative: 10x. So f′(x) = 30x(5x² − 2)².'),
    XE('c4', 'chain', 8, 8, 'ai', ['power', 'chain', 'product'], 'Find f′(x) for f(x) = x · (x² + 1)³.', function (x) { return Math.pow(x * x + 1, 2) * (7 * x * x + 1); }, 'Product and chain rule: (x² + 1)³ + x · 3(x² + 1)² · 2x = (x² + 1)²(7x² + 1).'),
    XE('c5', 'chain', 7, 7, 'ai', ['power', 'chain', 'cubic-inside', 'sum'], 'Find f′(x) for f(x) = (x³ − x)⁴.', function (x) { return 4 * Math.pow(x * x * x - x, 3) * (3 * x * x - 1); }, 'Outside: 4(x³ − x)³. Inside derivative: 3x² − 1. So f′(x) = 4(x³ − x)³(3x² − 1).'),
    XE('t1', 'tangent', 3, 3, 'up', ['power', 'sum', 'tangent'], 'Find the slope of the tangent line to f(x) = x² + 3x at x = 2.', function () { return 7; }, 'f′(x) = 2x + 3, so the slope at x = 2 is 7.'),
    XE('t2', 'tangent', 5, 6, 'ai', ['power', 'chain', 'tangent'], 'Find the slope of the tangent line to f(x) = (x² + 1)³ at x = 1.', function () { return 24; }, 'f′(x) = 3(x² + 1)² · 2x, so at x = 1 the slope is 3 · 4 · 2 = 24.'),
    XE('t3', 'tangent', 6, 5, 'up', ['power', 'sum', 'tangent', 'cubic'], 'Find the slope of the tangent line to f(x) = x³ − 4x at x = 2.', function () { return 8; }, 'f′(x) = 3x² − 4, so at x = 2 the slope is 8.'),
    XE('o0', 'optim', 2, 3, 'up', ['power', 'sum', 'critical'], 'At which x does f(x) = x² − 4x have its smallest value?', function () { return 2; }, 'f′(x) = 2x − 4 = 0 gives x = 2.'),
    XE('o1', 'optim', 4, 4, 'up', ['power', 'sum', 'critical', 'constant'], 'At which x does f(x) = x² − 6x + 4 have its smallest value?', function () { return 3; }, 'f′(x) = 2x − 6 = 0 gives x = 3.'),
    XE('o2', 'optim', 6, 6, 'up', ['power', 'sum', 'critical', 'cubic'], 'At which x > 0 does f(x) = x³ − 12x have a local minimum?', function () { return 2; }, 'f′(x) = 3x² − 12 = 0 gives x = 2. The sign of f′ changes from negative to positive there.'),
    XE('o3', 'optim', 5, 5, 'ai', ['power', 'critical'], 'What is the largest possible product of two numbers whose sum is 20?', function () { return 100; }, 'With the numbers x and 20 − x, the product x(20 − x) is largest at x = 10, so the product is 100.')
  ];

  /* More made-up exercises, built by small helpers so the answers are computed, not typed. */
  function sup(n) { return String(n).replace(/\d/g, function (d) { return '⁰¹²³⁴⁵⁶⁷⁸⁹'.charAt(+d); }); }
  function ptxt(ts) { var z = ts.filter(function (t) { return t[0] !== 0; }); if (!z.length) return '0'; return z.map(function (t, i) { var c = t[0], e = t[1], a = Math.abs(c), b = e === 0 ? String(a) : (a === 1 ? '' : String(a)) + 'x' + (e === 1 ? '' : sup(e)); return i === 0 ? (c < 0 ? '−' : '') + b : (c < 0 ? ' − ' : ' + ') + b; }).join(''); }
  function pder(ts) { return ts.filter(function (t) { return t[1] > 0; }).map(function (t) { return [t[0] * t[1], t[1] - 1]; }); }
  function pev(ts, x) { return ts.reduce(function (sm, t) { return sm + t[0] * Math.pow(x, t[1]); }, 0); }
  function XP(id, d, min, src, el, ts) { var dr = pder(ts); return XE(id, 'basic', d, min, src, el, 'Find f′(x) for f(x) = ' + ptxt(ts) + '.', function (x) { return pev(dr, x); }, 'f′(x) = ' + ptxt(dr) + '.'); }
  function XT(id, d, min, src, el, ts, k) { var dr = pder(ts), v = pev(dr, k); return XE(id, 'tangent', d, min, src, el, 'Find the slope of the tangent line to f(x) = ' + ptxt(ts) + ' at x = ' + k + '.', function () { return v; }, 'f′(x) = ' + ptxt(dr) + ', so at x = ' + k + ' the slope is ' + v + '.'); }
  function XO(id, d, min, src, el, a, b, c) { var x0 = -b / (2 * a); el = el || ['critical', 'minimum'].concat(a > 1 ? ['cm'] : [], c !== 0 ? ['constant'] : [], b < 0 ? ['negb'] : ['posb']); return XE(id, 'optim', d, min, src, el, 'At which x does f(x) = ' + ptxt([[a, 2], [b, 1], [c, 0]]) + ' have its smallest value?', function () { return x0; }, 'f′(x) = ' + ptxt([[2 * a, 1], [b, 0]]) + ' = 0 gives x = ' + x0 + '.'); }
  EXB = EXB.concat([
    XP('b5', 4, 4, 'up', ['power', 'sum', 'cm', 'odd-powers'], [[6, 5], [-2, 3], [1, 1]]),
    XP('b6', 3, 3, 'up', ['power', 'sum', 'even-powers'], [[1, 6], [4, 2]]),
    XP('b7', 5, 5, 'ai', ['power', 'sum', 'cm', 'constant'], [[2, 4], [-1, 3], [5, 1], [-9, 0]]),
    XE('q5', 'pq', 3, 4, 'up', ['product', 'linear'], 'Find f′(x) for f(x) = (x + 2)(x − 5).', function (x) { return 2 * x - 3; }, 'Product rule: 1 · (x − 5) + (x + 2) · 1 = 2x − 3.'),
    XE('q6', 'pq', 5, 5, 'ai', ['power', 'product', 'cm'], 'Find f′(x) for f(x) = x³ · (2x − 1).', function (x) { return 8 * Math.pow(x, 3) - 3 * x * x; }, 'Product rule: 3x²(2x − 1) + x³ · 2 = 8x³ − 3x².'),
    XE('q7', 'pq', 6, 6, 'ai', ['quotient', 'power', 'quad-num'], 'Find f′(x) for f(x) = x² / (x + 1).', function (x) { return (x * x + 2 * x) / ((x + 1) * (x + 1)); }, 'Quotient rule: (2x(x + 1) − x²) / (x + 1)² = (x² + 2x) / (x + 1)².'),
    XE('q8', 'pq', 5, 5, 'up', ['quotient', 'linear'], 'Find f′(x) for f(x) = (x − 1) / (x + 2).', function (x) { return 3 / ((x + 2) * (x + 2)); }, 'Quotient rule: ((x + 2) − (x − 1)) / (x + 2)² = 3 / (x + 2)².'),
    XE('c6', 'chain', 3, 4, 'up', ['power', 'chain', 'linear-inside'], 'Find f′(x) for f(x) = (2x + 3)⁴.', function (x) { return 8 * Math.pow(2 * x + 3, 3); }, 'Outside: 4(2x + 3)³. Inside derivative: 2. So f′(x) = 8(2x + 3)³.'),
    XE('c7', 'chain', 4, 4, 'up', ['power', 'chain', 'quad-inside'], 'Find f′(x) for f(x) = (x² − 1)³.', function (x) { return 6 * x * Math.pow(x * x - 1, 2); }, 'Outside: 3(x² − 1)². Inside derivative: 2x. So f′(x) = 6x(x² − 1)².'),
    XE('c8', 'chain', 4, 4, 'ai', ['power', 'chain', 'linear-inside'], 'Find f′(x) for f(x) = (3x + 1)⁵.', function (x) { return 15 * Math.pow(3 * x + 1, 4); }, 'Outside: 5(3x + 1)⁴. Inside derivative: 3. So f′(x) = 15(3x + 1)⁴.'),
    XE('c9', 'chain', 6, 5, 'up', ['power', 'chain', 'cubic-inside'], 'Find f′(x) for f(x) = (x³ + 2x)².', function (x) { return 2 * (x * x * x + 2 * x) * (3 * x * x + 2); }, 'Outside: 2(x³ + 2x). Inside derivative: 3x² + 2. So f′(x) = 2(x³ + 2x)(3x² + 2).'),
    XT('t4', 2, 3, 'up', ['power', 'sum', 'tangent'], [[1, 2], [-5, 1]], 3),
    XT('t5', 4, 4, 'up', ['power', 'sum', 'tangent', 'cubic'], [[2, 3], [1, 1]], 1),
    XT('t6', 5, 5, 'ai', ['power', 'sum', 'tangent', 'quartic'], [[1, 4], [-2, 1]], 2),
    XO('o4', 3, 3, 'up', ['power', 'sum', 'critical'], 1, -8, 3),
    XO('o5', 5, 5, 'ai', ['power', 'sum', 'critical', 'coef'], 2, -12, 1)
  ]);

  /* ---- Bigger bank. Everything below is generated from small parameter lists, so the answers are computed, never typed. ----
     A polynomial is a list of [coefficient, exponent]. These helpers only exist for this demo bank. */
  function pneg(a) { return a.map(function (t) { return [-t[0], t[1]]; }); }
  function pmul(a, b) { var m = {}; a.forEach(function (x) { b.forEach(function (y) { var e = x[1] + y[1]; m[e] = (m[e] || 0) + x[0] * y[0]; }); }); return Object.keys(m).map(function (e) { return [m[e], +e]; }).sort(function (p, q) { return q[1] - p[1]; }); }
  function padd(a, b) { var m = {}; a.concat(b).forEach(function (t) { m[t[1]] = (m[t[1]] || 0) + t[0]; }); return Object.keys(m).map(function (e) { return [m[e], +e]; }).sort(function (p, q) { return q[1] - p[1]; }); }
  function wrap(ts) { return ts.length > 1 ? '(' + ptxt(ts) + ')' : ptxt(ts); }
  var DEGNAME = { 2: 'quadratic', 3: 'cubic', 4: 'quartic', 5: 'quintic' };
  function ptags(ts, extra) { /* tags only measure how alike two exercises are, so they keep what tells exercises apart (shape), not what they all share */
    var mx = Math.max.apply(null, ts.map(function (u) { return u[1]; })), t = [DEGNAME[mx] || 'linear', 'terms' + ts.length];
    if (ts.some(function (u) { return Math.abs(u[0]) > 1 && u[1] > 0; })) t.push('cm');
    if (ts.some(function (u) { return u[1] === 0; })) t.push('constant');
    return t.concat(extra || []);
  }
  function XPa(id, d, min, src, ts) { return XP(id, d, min, src, ptags(ts), ts); }
  function XQ(id, d, min, src, f, g) { /* product f · g */
    var df = pder(f), dg = pder(g), D = padd(pmul(df, g), pmul(f, dg));
    return XE(id, 'pq', d, min, src, ptags(f.concat(g), ['product']), 'Find f′(x) for f(x) = ' + wrap(f) + ' · ' + wrap(g) + '.', function (x) { return pev(D, x); },
      'Product rule: (' + ptxt(df) + ')(' + ptxt(g) + ') + (' + ptxt(f) + ')(' + ptxt(dg) + ') = ' + ptxt(D) + '.');
  }
  function XR(id, d, min, src, f, g) { /* quotient f / g */
    var df = pder(f), dg = pder(g), N = padd(pmul(df, g), pneg(pmul(f, dg)));
    return XE(id, 'pq', d, min, src, ptags(f.concat(g), ['quotient']), 'Find f′(x) for f(x) = ' + wrap(f) + ' / ' + wrap(g) + '.', function (x) { return (pev(df, x) * pev(g, x) - pev(f, x) * pev(dg, x)) / Math.pow(pev(g, x), 2); },
      'Quotient rule: ((' + ptxt(df) + ')(' + ptxt(g) + ') − (' + ptxt(f) + ')(' + ptxt(dg) + ')) / (' + ptxt(g) + ')² = (' + ptxt(N) + ') / (' + ptxt(g) + ')².');
  }
  function XC(id, d, min, src, inner, n) { /* (inner)^n */
    var di = pder(inner);
    return XE(id, 'chain', d, min, src, ptags(inner, ['chain', 'power' + n]), 'Find f′(x) for f(x) = (' + ptxt(inner) + ')' + sup(n) + '.', function (x) { return n * Math.pow(pev(inner, x), n - 1) * pev(di, x); },
      'Outside: ' + n + '(' + ptxt(inner) + ')' + (n - 1 > 1 ? sup(n - 1) : '') + '. Inside derivative: ' + ptxt(di) + '. So f′(x) = ' + n + '(' + ptxt(inner) + ')' + (n - 1 > 1 ? sup(n - 1) : '') + '(' + ptxt(di) + ').');
  }
  function XM(id, d, min, src, el, a, b) { /* −a x² + b x has its largest value at b / (2a) */
    var x0 = b / (2 * a);
    return XE(id, 'optim', d, min, src, el, 'At which x does f(x) = ' + ptxt([[-a, 2], [b, 1]]) + ' have its largest value?', function () { return x0; }, 'f′(x) = ' + ptxt([[-2 * a, 1], [b, 0]]) + ' = 0 gives x = ' + x0 + '.');
  }
  function XK(id, d, min, src, a, m) { /* a x³ − 3 a m² x has a local minimum at x = m (x > 0) */
    var ts = [[a, 3], [-3 * a * m * m, 1]];
    return XE(id, 'optim', d, min, src, ['critical', 'cubic', 'local', 'k' + m], 'At which x > 0 does f(x) = ' + ptxt(ts) + ' have a local minimum?', function () { return m; }, 'f′(x) = ' + ptxt(pder(ts)) + ' = 0 gives x = ' + m + ' for x > 0. The sign of f′ changes from negative to positive there.');
  }
  EXB = EXB.concat([
    XPa('b8', 2, 3, 'up', [[3, 4]]), XPa('b9', 2, 3, 'up', [[1, 7], [1, 1]]), XPa('b10', 3, 4, 'up', [[5, 3], [-4, 2]]), XPa('b11', 3, 4, 'ai', [[2, 6], [3, 1], [-7, 0]]),
    XPa('b12', 4, 4, 'up', [[4, 5], [-3, 4], [2, 2]]), XPa('b13', 4, 5, 'up', [[7, 3], [-1, 2], [6, 1]]), XPa('b14', 5, 5, 'ai', [[3, 6], [-2, 5], [5, 3], [-1, 1]]),
    XPa('b15', 6, 6, 'up', [[5, 8], [-3, 6], [2, 4], [-1, 2]]), XPa('b16', 6, 6, 'ai', [[9, 4], [-7, 3], [2, 2], [11, 1], [-5, 0]]),
    XPa('b17', 7, 7, 'ai', [[2, 9], [-5, 7], [3, 5], [-4, 3], [1, 1]]), XPa('b18', 3, 4, 'up', [[10, 2], [-6, 1], [1, 0]]),
    XQ('q9', 3, 4, 'up', [[1, 1], [1, 0]], [[1, 1], [-3, 0]]), XQ('q10', 4, 5, 'up', [[2, 1], [1, 0]], [[1, 2], [1, 0]]), XQ('q11', 4, 5, 'ai', [[1, 2]], [[1, 1], [4, 0]]),
    XQ('q12', 5, 5, 'up', [[3, 1], [-2, 0]], [[1, 2], [-1, 0]]), XQ('q13', 5, 6, 'ai', [[1, 3]], [[2, 1], [3, 0]]), XQ('q14', 6, 6, 'up', [[1, 2], [1, 0]], [[1, 2], [-3, 0]]),
    XQ('q15', 6, 7, 'ai', [[2, 1], [-1, 0]], [[1, 3], [1, 1]]), XQ('q16', 7, 7, 'up', [[1, 2], [2, 1]], [[1, 2], [-1, 0]]),
    XR('q17', 4, 5, 'up', [[1, 1], [3, 0]], [[1, 1], [1, 0]]), XR('q18', 6, 7, 'ai', [[1, 2]], [[1, 1], [3, 0]]), XR('q19', 7, 8, 'ai', [[1, 2], [1, 0]], [[1, 1], [1, 0]]), XR('q20', 5, 6, 'up', [[2, 1], [1, 0]], [[1, 1], [2, 0]]),
    XC('c10', 2, 3, 'up', [[1, 1], [2, 0]], 2), XC('c11', 3, 4, 'up', [[3, 1], [-2, 0]], 3), XC('c12', 3, 4, 'ai', [[5, 1], [1, 0]], 2), XC('c13', 4, 5, 'up', [[1, 2], [2, 0]], 4),
    XC('c14', 5, 5, 'ai', [[2, 2], [-1, 0]], 3), XC('c15', 5, 6, 'up', [[1, 3], [1, 0]], 3), XC('c16', 6, 6, 'ai', [[1, 2], [3, 1]], 3), XC('c17', 7, 7, 'up', [[2, 3], [-1, 1]], 2),
    XC('c18', 6, 6, 'up', [[1, 1], [-4, 0]], 5), XC('c19', 8, 7, 'ai', [[1, 3], [-1, 1]], 3),
    XT('t7', 2, 3, 'up', ptags([[1, 2], [2, 1]], ['tangent']), [[1, 2], [2, 1]], 1), XT('t8', 2, 3, 'up', ptags([[3, 2], [-1, 0]], ['tangent']), [[3, 2], [-1, 0]], 2),
    XT('t9', 3, 4, 'up', ptags([[1, 3], [-3, 1]], ['tangent']), [[1, 3], [-3, 1]], 2), XT('t10', 3, 4, 'ai', ptags([[2, 2], [-7, 1], [1, 0]], ['tangent']), [[2, 2], [-7, 1], [1, 0]], 3),
    XT('t11', 4, 4, 'up', ptags([[1, 3], [2, 2]], ['tangent']), [[1, 3], [2, 2]], 1), XT('t12', 4, 5, 'ai', ptags([[1, 4], [-1, 2]], ['tangent']), [[1, 4], [-1, 2]], 1),
    XT('t13', 5, 5, 'up', ptags([[3, 3], [-2, 1]], ['tangent']), [[3, 3], [-2, 1]], 2), XT('t14', 5, 5, 'ai', ptags([[1, 5], [-4, 2]], ['tangent']), [[1, 5], [-4, 2]], 1),
    XT('t15', 6, 6, 'up', ptags([[2, 4], [-3, 3]], ['tangent']), [[2, 4], [-3, 3]], 1), XT('t16', 6, 6, 'ai', ptags([[1, 3], [-6, 2], [9, 1]], ['tangent']), [[1, 3], [-6, 2], [9, 1]], 3),
    XT('t17', 7, 7, 'up', ptags([[1, 4], [-2, 3], [1, 1]], ['tangent']), [[1, 4], [-2, 3], [1, 1]], 2), XT('t18', 7, 7, 'ai', ptags([[2, 3], [-9, 2], [12, 1]], ['tangent']), [[2, 3], [-9, 2], [12, 1]], 1),
    XO('o6', 2, 3, 'up', null, 1, -2, 5), XO('o7', 2, 3, 'up', null, 1, -10, 0), XO('o8', 3, 3, 'ai', null, 1, 6, 1),
    XO('o9', 3, 4, 'up', null, 2, -8, 3), XO('o10', 4, 4, 'up', null, 3, -18, 2),
    XO('o11', 4, 4, 'ai', null, 1, -14, 7), XO('o12', 5, 5, 'up', null, 2, 8, 1), XO('o13', 5, 5, 'ai', null, 4, -16, 0),
    XK('o14', 6, 6, 'up', 1, 1), XK('o15', 6, 6, 'ai', 1, 3), XK('o16', 7, 7, 'up', 1, 4), XK('o17', 7, 7, 'ai', 2, 3),
    XM('o18', 3, 3, 'up', ['critical', 'maximum', 'o18'], 1, 8), XM('o19', 4, 4, 'up', ['critical', 'maximum', 'o19'], 2, 12)
  ]);
  /* Everything technical (why the planner chose a stop, the estimated chance of success, which solver ran) is kept out of the
     student's screen on purpose. Add ?dev to the address to see it while testing. */
  var DEV = /[?&]dev(=|&|$)/.test(location.search);
  var GLYPH = { basic: 'xⁿ', pq: 'f·g', chain: 'f∘g', tangent: '↗', optim: '▲' };
  var TNAME = { basic: 'Basic rules', pq: 'Product and quotient', chain: 'Chain rule', tangent: 'Tangent lines', optim: 'Optimization' };
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
  /* Internal wording for the team only (shown with ?dev). The student never sees these labels. */
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
    var s = S.ex; if (!DEV || !s || !s.solver) return '';
    return '<p class="fine exdev">' + (s.solver === 'gurobi' ? 'Gurobi: ' : 'In-page search, not Gurobi: ') + esc(s.solverInfo) + '</p>';
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
      s.plan = r.items.map(function (it, i, a) { it.why = xWhy(it, i, a, inp); return it; }); s.phase = 'plan';
      var tot = s.plan.reduce(function (a, b) { return a + b.min; }, 0), pool = EXB.filter(function (e) { return inp.topics.indexOf(e.topic) >= 0 && (s.source === 'both' || e.src === s.source); }), poolMin = pool.reduce(function (a, b) { return a + b.min; }, 0);
      s.limitNote = s.time - tot < 4 ? '' : poolMin < s.time ? 'Only ' + pool.length + ' exercises (' + poolMin + ' min) exist for these topics and this source, so the path cannot fill the time. Add topics or allow AI-generated exercises.' : 'The rest of the time is free: the planner left out exercises that nearly repeat ones already on the path, or that would teach you little right now.';
      exRender();
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
  var RES = { clean: [0.9, 1, 'Perfect. No help needed.'], retry: [0.8, 1, 'Got it on another try.'], hint: [0.7, 0.5, 'Solved with a hint.'], solution: [0.4, 0, 'Solution seen.'], skip: [0.1, 0, 'Skipped.'] };
  function exFinish(kind) {
    var s = S.ex, e = exCur(), r = RES[kind], tp = e.topic;
    s.hist.push({ id: e.id, r: r[0], kind: kind, min: e.min }); s.used += e.min;
    var old = C.ratings[tp], base = old == null ? 5 : old, nv = Math.max(0, Math.min(10, base + r[1]));
    if (C.start[tp] == null) C.start[tp] = base;
    C.ratings[tp] = nv; C.last[tp] = nv - base; C.pulse[tp] = true; renderLeft();
    var inp = exInput(), oldNext = s.plan[s.cur + 1] ? s.plan[s.cur + 1].id : null, kept = s.plan.slice(0, s.cur + 1);
    s.res = { kind: kind, text: r[2], rating: [base, nv], dev: '', adjusted: false, more: false, pending: true }; s.fb = '';
    exRender();
    exPlanner(inp).then(function (rest) {
      if (S.ex !== s || !s.res) return;
      rest.items.forEach(function (it, i, a) { it.why = xWhy(it, i, a, inp); });
      var newNext = rest.items[0] ? rest.items[0].id : null, note;
      if (!newNext) note = 'No exercise fits in the time left.';
      else if (oldNext && newNext !== oldNext) note = 'The plan changed. Next is now ' + exTitle(xById(newNext)) + ' instead of ' + exTitle(xById(oldNext)) + why(kind, e, xById(newNext));
      else note = 'The plan was checked again. The next exercise stays.';
      s.plan = kept.concat(rest.items); s.solver = rest.solver; s.solverInfo = rest.info;
      s.res.dev = note; s.res.adjusted = !!(newNext && oldNext && newNext !== oldNext); s.res.more = !!newNext; s.res.pending = false; exRender();
    });
  }
  function why(kind, cur, nx) {
    if ((kind === 'solution' || kind === 'skip') && xSim(cur, nx) > 0.4) return ', because it is related to the one you just missed.';
    return ', because your estimated level changed after this result.';
  }
  function exTitle(e) { return e ? TNAME[e.topic] + ' (' + e.min + ' min)' : ''; }
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
    return '<div class="exh"><div><h2 tabindex="-1">Exercise mode</h2>' + (sub ? '<p class="soft small">' + esc(sub) + '</p>' : '') + '</div><span class="spacer"></span><button class="btn small" data-ex="exit">Back to chat</button></div>';
  }
  function exSetup() {
    var s = S.ex, av = exTopicsAvail(), ctxName = (S.ctxs.filter(function (c) { return c.key === S.ctx; })[0] || {}).name;
    if (!av.length) return exHead(ctxName) + '<div class="exbody"><div class="excard narrow"><h3>No exercises for this course yet</h3><p class="soft">The exercises in this prototype cover Calculus I. Add the Calculus I lectures in Material, then come back.</p><div class="row" style="margin-top:14px"><button class="btn dark" data-ex="material">Open material</button></div></div></div>';
    var pills = av.map(function (t) {
      var r = C.ratings[t.id];
      return '<button type="button" class="expill' + (s.topics[t.id] ? ' on' : '') + '" data-ex="topic" data-v="' + t.id + '" aria-pressed="' + !!s.topics[t.id] + '"><span class="pgl">' + GLYPH[t.id] + '</span>' + esc(TNAME[t.id]) + '<span class="expr">' + (r == null ? '–' : fmt(r)) + '</span></button>';
    }).join('');
    return exHead(ctxName) + '<div class="exbody"><div class="excard narrow setup">' +
      '<h3 class="exbig">Plan your practice</h3>' +
      '<div class="exsec"><span class="exlab">Time</span>' + seg('time', [[15, '15 min'], [30, '30 min'], [45, '45 min'], [60, '60 min']], s.time) + '</div>' +
      '<div class="exsec"><span class="exlab">Topics</span><div class="expills">' + pills + '</div></div>' +
      '<div class="exsec"><span class="exlab">Exercises from</span>' + seg('src', [['both', 'Mine and AI'], ['up', 'Mine only'], ['ai', 'AI only']], s.source) + '</div>' +
      (s.note ? '<p class="exwarn" role="alert">' + esc(s.note) + '</p>' : '') +
      '<button class="btn dark exbigbtn" data-ex="build"' + (s.busy ? ' disabled' : '') + '>' + (s.busy ? 'Building your path…' : 'Build my path') + '</button></div></div>';
  }
  /* The path: a winding road of stops. Each stop is one exercise, drawn as its topic symbol. The student sees the topic and
     the minutes, nothing else. Order is the order of the road, from top to bottom. */
  function roadHtml(items, budget) {
    var n = items.length, DX = [0, -64, 0, 64], W = 360, cx = W / 2, GAP = 104, H = (n + 1) * GAP + 30;
    var pts = items.map(function (it, i) { return { x: cx + DX[i % 4], y: 52 + i * GAP }; }); pts.push({ x: cx, y: 52 + n * GAP });
    var d = 'M' + pts[0].x + ' ' + pts[0].y;
    for (var i = 1; i < pts.length; i++) d += ' C' + pts[i - 1].x + ' ' + (pts[i - 1].y + 52) + ' ' + pts[i].x + ' ' + (pts[i].y - 52) + ' ' + pts[i].x + ' ' + pts[i].y;
    var tot = items.reduce(function (a, b) { return a + b.min; }, 0);
    var h = '<div class="exroad" style="height:' + H + 'px"><svg viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true"><path d="' + d + '"/></svg>';
    items.forEach(function (it, k) {
      var e = xById(it.id), p = pts[k], right = p.x <= cx;
      h += '<span class="stop' + (k === 0 ? ' next' : '') + '" style="left:' + p.x + 'px;top:' + p.y + 'px" aria-hidden="true">' + GLYPH[e.topic] + '</span>' +
        '<span class="stoplab ' + (right ? 'r' : 'l') + '" style="left:' + (right ? p.x + 46 : p.x - 46 - 150) + 'px;top:' + (p.y - 20) + 'px" aria-hidden="true"><b>' + TNAME[e.topic] + '</b>' + e.min + ' min</span>';
    });
    var f = pts[n], more = budget - tot >= 5;   /* time is left: the path is not over, more stops appear as the student progresses */
    h += '<span class="stop finish' + (more ? ' more' : '') + '" style="left:' + f.x + 'px;top:' + f.y + 'px" aria-hidden="true">' + (more ? '…' : '⚑') + '</span><span class="stoplab r" style="left:' + (f.x + 46) + 'px;top:' + (f.y - 20) + 'px" aria-hidden="true"><b>' + (more ? 'More ahead' : 'Finish') + '</b>' + (more ? 'new stops appear as you go' : 'about ' + tot + ' min') + '</span></div>';
    h += '<ol class="sr">' + items.map(function (it, k) { var e = xById(it.id); return '<li>Stop ' + (k + 1) + ': ' + TNAME[e.topic] + ', ' + e.min + ' minutes</li>'; }).join('') + '</ol>';
    return h;
  }
  function devPlan(items) { /* for the team only (?dev): what the planner believes about each stop */
    if (!DEV) return '';
    return '<details class="exdevbox" open><summary>For the team</summary>' + solverNote() + (S.ex.limitNote ? '<p class="fine">' + esc(S.ex.limitNote) + '</p>' : '') + '<ol>' + items.map(function (it) { var e = xById(it.id); return '<li>' + e.id + ' · difficulty ' + e.d + ' · ' + (e.src === 'up' ? 'uploaded' : 'AI') + ' · estimated solve chance ' + Math.round(it.p * 100) + '% (' + xFeel(it.p) + ') · ' + esc(it.why || '') + '</li>'; }).join('') + '</ol></details>';
  }
  function exPlanView() {
    var s = S.ex, tot = s.plan.reduce(function (a, b) { return a + b.min; }, 0);
    return exHead('') + '<div class="exbody road"><div class="exroadwrap"><div class="exsumline"><b>Your path</b><span>' + s.plan.length + ' stops · about ' + tot + ' min</span></div>' + roadHtml(s.plan, s.time) + devPlan(s.plan) + '</div></div>' +
      '<div class="exfoot"><button class="btn" data-ex="back">Change</button><button class="btn dark exbigbtn" data-ex="start">Start</button></div>';
  }
  function stepperHtml(s, r) {
    var n = s.plan.length;
    return '<div class="exsteps" role="img" aria-label="Stop ' + (s.cur + 1) + ' of ' + n + '">' + s.plan.map(function (it, i) {
      var st = i < s.cur || (i === s.cur && r) ? 'done' : i === s.cur ? 'now' : 'todo';
      return (i ? '<i class="exstl' + (st === 'done' || st === 'now' ? ' on' : '') + '"></i>' : '') + '<span class="exst ' + st + '">' + (st === 'done' ? '✓' : '') + '</span>';
    }).join('') + '</div><p class="exclock soft small">' + s.used + ' of ' + s.time + ' min</p>';
  }
  function exRun() {
    var s = S.ex, e = exCur(), r = s.res;
    var keys = [['x', 'x'], ['x²', '^2'], ['xⁿ', '^'], ['(', '('], [')', ')'], ['×', '*'], ['÷', '/']].map(function (k) { return '<button type="button" class="mk" data-ex="key" data-v="' + k[1] + '" aria-label="Insert ' + esc(k[0]) + '">' + k[0] + '</button>'; }).join('');
    var main = '<div class="excur"><div class="excurtop"><span class="exchip"><span class="pgl">' + GLYPH[e.topic] + '</span>' + TNAME[e.topic] + '</span><span class="soft small">' + e.min + ' min</span></div><p class="exq">' + esc(e.q) + '</p>';
    if (!r) {
      main += '<div class="exans"><div class="mkeys" role="group" aria-label="Math keys">' + keys + '</div><div class="row" style="gap:8px"><input class="inp" id="ex-in" autocomplete="off" placeholder="Your answer" aria-label="Your answer" value="' + esc(s.input) + '" style="height:44px"><button class="btn dark" style="height:44px;padding:0 22px" data-ex="submit">Check</button></div></div>';
      if (s.fb) main += '<p class="exfb" role="status">' + esc(s.fb) + '</p>';
      if (s.hint) main += '<div class="exhint"><b>Hint</b> ' + esc(HINTS[e.topic]) + '</div>';
      if (s.sol) main += '<div class="exhint sol"><b>Solution</b> ' + esc(e.sol) + '</div>';
      main += '<div class="row exsub"><button class="btn small ghost" data-ex="hint"' + (s.hint ? ' disabled' : '') + '>Hint</button><button class="btn small ghost" data-ex="sol"' + (s.sol ? ' disabled' : '') + '>Solution</button><button class="btn small ghost" data-ex="skip">Skip</button></div>';
    } else {
      var up = r.rating[1] > r.rating[0];
      main += '<div class="exres ' + r.kind + '"><b>' + esc(r.text) + '</b>' + (up ? '<span class="exgain">' + esc(TNAME[e.topic]) + ' ' + fmt(r.rating[0]) + ' → ' + fmt(r.rating[1]) + '</span>' : '') + (r.kind !== 'clean' && r.kind !== 'retry' ? '<span class="small">' + esc(e.sol) + '</span>' : '') + '</div>' +
        (r.adjusted ? '<p class="exadj">✦ Your path was adjusted</p>' : '') + (DEV && r.dev ? '<p class="fine exdev">' + esc(r.dev) + '</p>' : '') +
        '<div class="row" style="margin-top:14px"><button class="btn dark exbigbtn" data-ex="next"' + (r.pending ? ' disabled' : '') + '>' + (r.pending ? 'One moment…' : r.more ? 'Next' : 'Finish') + '</button></div>';
    }
    main += '</div>';
    return exHead('') + '<div class="exbody run"><div class="exrunwrap">' + stepperHtml(s, r) + main + (DEV ? '<p class="fine exdev">' + solverNote().replace(/<[^>]+>/g, '') + '</p>' : '') + '</div></div>';
  }
  function exDone() {
    var s = S.ex, solved = s.hist.filter(function (h) { return h.r >= 0.5; }).length, clean = s.hist.filter(function (h) { return h.kind === 'clean' || h.kind === 'retry'; }).length, tp = {};
    s.hist.forEach(function (h) { tp[xById(h.id).topic] = 1; });
    var rows = Object.keys(tp).map(function (k) { var a = s.rat0[k] == null ? 5 : s.rat0[k], b = C.ratings[k]; return '<li><span class="pgl">' + GLYPH[k] + '</span><span>' + TNAME[k] + '</span><span class="soft">' + fmt(a) + ' → ' + fmt(b) + '</span></li>'; }).join('');
    return exHead('') + '<div class="exbody"><div class="excard narrow center"><div class="extrophy" aria-hidden="true">⚑</div><h3 class="exbig">Path complete</h3><ul class="exstats"><li><b>' + solved + '</b>solved</li><li><b>' + clean + '</b>on your own</li><li><b>' + s.used + '</b>minutes</li></ul>' +
      '<ul class="exrates">' + rows + '</ul><div class="row" style="gap:8px;margin-top:18px;justify-content:center"><button class="btn dark exbigbtn" data-ex="again">New path</button><button class="btn" style="height:44px" data-ex="exit">Back to chat</button></div></div></div>';
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
    else if (a === 'topic') { s.topics[v] = !s.topics[v]; s.note = ''; exRender(); }
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
