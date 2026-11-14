(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); };
  var REDUCED = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var QS = location.search;
  var INSTANT = REDUCED || /[?&]fast(=|&|$)/.test(QS);
  var DELAY = INSTANT ? 0 : 450;

  /* ---------------- content (scripted) ----------------
     Every sentence of an AI answer has a kind:
       s = from your slides (the sentence is in, or paraphrases, a slide passage)
       d = derived from your slides (applies a slide rule to this problem)
       g = general knowledge that is not in your slides
     slide + p point to the slide number and the paragraph index that supports it. */
  function T(k, slide, p, t, q) { return { k: k, slide: slide, p: p, t: t, q: q }; }
  var L3 = 'Calculus I – Lecture 3: Derivatives.pdf', L4 = 'Calculus I – Lecture 4: Applications of derivatives.pdf';
  var FILE_DEFS = {
    calc: [
      { id: 'l3', name: L3, short: 'Lecture 3', mb: '2.4', pages: 34, kind: 'lecture', preview: 12, slides: [10, 11, 12, 13], topics: ['basic', 'pq', 'chain'] },
      { id: 'l4', name: L4, short: 'Lecture 4', mb: '1.9', pages: 28, kind: 'lecture', preview: 20, slides: [20, 21], topics: ['tangent', 'optim'] }
    ],
    hci: [
      { id: 'realpdf', name: 'HCI Week 8 – Computational Design.pdf', short: 'Week 8', mb: '4.9', pages: 60, kind: 'pdf', url: 'material/computational-design.pdf', slides: [], topics: [] }
    ],
    linalg: [
      { id: 'scan', name: 'Linear Algebra – Scanned lecture notes.pdf', short: 'Scanned notes', mb: '5.2', pages: 41, kind: 'scan', slides: [], topics: [] }
    ]
  };
  var TOPIC_DEFS = {
    basic: { id: 'basic', name: 'Basic derivative rules', slide: 10 },
    pq: { id: 'pq', name: 'Product and quotient rule', slide: 11 },
    chain: { id: 'chain', name: 'Chain rule', slide: 12 },
    tangent: { id: 'tangent', name: 'Tangent lines', slide: 20 },
    optim: { id: 'optim', name: 'Optimization', slide: 21 }
  };
  var SLIDES = {
    10: { t: 'Basic derivative rules', p: ['Power rule: d/dx xⁿ = n · xⁿ⁻¹', 'Constant multiple: (c · f)′ = c · f′', 'Sum rule: (f + g)′ = f′ + g′'] },
    11: { t: 'Product and quotient rule', p: ['Product: (f · g)′ = f′ · g + f · g′', 'Quotient: (f / g)′ = (f′ · g − f · g′) / g²'] },
    12: { t: 'The chain rule', p: ['If y = f(g(x)), then', 'y′ = f′(g(x)) · g′(x)', 'Differentiate the outside, then multiply by the derivative of the inside.'], f: 1 },
    13: { t: 'Worked example', p: ['g(x) = (2x + 5)³', 'Outside: 3(2x + 5)². Inside: 2x + 5, with derivative 2.', 'g′(x) = 3(2x + 5)² · 2 = 6(2x + 5)²'] },
    20: { t: 'Tangent lines', p: ['The tangent line to f at x = a is', 'y = f(a) + f′(a)(x − a)', 'Its slope is the derivative f′(a).'], f: 1 },
    21: { t: 'Optimization', p: ['Maxima and minima occur where f′(x) = 0 or where f′ is undefined.', 'Check the sign of f′ on both sides, or use the second derivative.'] }
  };
  var SLIDE_FILE = { 10: 'l3', 11: 'l3', 12: 'l3', 13: 'l3', 20: 'l4', 21: 'l4' };
  var LV = ['Hint', 'Concept', 'Example', 'Solution'];
  var LTIME = { 1: 'about 1 min', 2: 'about 2 min', 3: 'about 3 min', 4: 'about 2 min' };
  var PROBLEMS = {
    p1: {
      topic: 'chain', slide: 12, name: 'Chain rule', difficulty: 'hard', similar: 'p3', next: 'p2', text: 'Find f′(x) for f(x) = (3x² + 1)⁴',
      fn: function (x) { return 24 * x * Math.pow(3 * x * x + 1, 3); },
      close: [{ fn: function (x) { return 4 * Math.pow(3 * x * x + 1, 3); }, msg: 'You applied the power rule to the outside, which is right.' }],
      hints: [
        { s: [T('d', 12, 2, 'Look at what is inside the brackets. After the power comes down, is there anything else to multiply by?'), T('s', 12, 2, 'The chain rule says to multiply by the derivative of the inside.')],
          more: [T('d', 12, 0, 'Here f(g(x)) has g(x) = 3x² + 1 inside the power.')] },
        { s: [T('s', 12, 0, 'The chain rule is for a function inside another function: y = f(g(x)).'), T('s', 12, 1, 'Then y′ = f′(g(x)) · g′(x).'), T('s', 12, 2, 'Differentiate the outside, then multiply by the derivative of the inside.')],
          more: [T('d', 12, 2, 'Keep the inside, 3x² + 1, unchanged while you differentiate the outside power.')] },
        { s: [T('s', 13, 0, 'Take g(x) = (2x + 5)³.'), T('s', 13, 1, 'The outside gives 3(2x + 5)², and the inside 2x + 5 has derivative 2.'), T('s', 13, 2, 'So g′(x) = 3(2x + 5)² · 2 = 6(2x + 5)².')],
          more: [T('d', 12, 2, 'Your problem has the same shape, with a fourth power and the inside 3x² + 1.')] },
        { s: [T('d', 12, 1, 'Let u = 3x² + 1, so f = u⁴.'), T('d', 12, 1, 'Then f′ = 4u³ · u′. Since u′ = 6x, f′(x) = 4(3x² + 1)³ · 6x = 24x(3x² + 1)³.')],
          more: [T('g', null, null, 'You could also expand the bracket first and differentiate term by term, but that takes much longer.')] }
      ],
      done: 'The outer power comes down first, then you multiply by the derivative of what is inside the brackets: 4(3x² + 1)³ · 6x = 24x(3x² + 1)³.', doneP: 1
    },
    p2: {
      topic: 'pq', slide: 11, name: 'Product rule', difficulty: 'easy', similar: 'p4', next: 'p1', text: 'Find h′(x) for h(x) = (x² + 1)(x³ − 2x)',
      fn: function (x) { return 5 * Math.pow(x, 4) - 3 * x * x - 2; },
      close: [{ fn: function (x) { return (2 * x) * (3 * x * x - 2); }, msg: 'The derivative of a product is not the product of the derivatives.' }],
      hints: [
        { s: [T('d', 11, 0, 'You have two factors multiplied together.'), T('s', 11, 0, 'The product rule combines the derivative of each factor with the other factor left as it is.')],
          more: [T('d', 11, 0, 'Here the factors are x² + 1 and x³ − 2x.')] },
        { s: [T('s', 11, 0, 'Product rule: (f · g)′ = f′ · g + f · g′.'), T('d', 11, 0, 'Here f = x² + 1 and g = x³ − 2x. Find f′ and g′ first.')],
          more: [T('s', 10, 0, 'The power rule gives you each derivative: d/dx xⁿ = n · xⁿ⁻¹.')] },
        { s: [T('d', 11, 0, 'Try (x)(x + 1). Then f′ = 1 and g′ = 1.'), T('d', 11, 0, 'The product rule gives 1 · (x + 1) + x · 1 = 2x + 1.')],
          more: [T('d', 11, 0, 'Your problem works the same way, with longer factors.')] },
        { s: [T('d', 11, 0, 'f′ = 2x and g′ = 3x² − 2.'), T('d', 11, 0, 'So h′ = 2x(x³ − 2x) + (x² + 1)(3x² − 2) = 5x⁴ − 3x² − 2.')],
          more: [T('d', 10, 0, 'Expanding h first and using the power rule gives the same result.')] }
      ],
      done: 'The product rule gives 2x(x³ − 2x) + (x² + 1)(3x² − 2). Expanding and collecting terms: 5x⁴ − 3x² − 2.', doneP: 0
    },
    p3: {
      topic: 'chain', slide: 12, name: 'Chain rule', difficulty: 'hard', check: true, next: 'p2', text: 'Find g′(x) for g(x) = (5x − 2)³',
      fn: function (x) { return 15 * Math.pow(5 * x - 2, 2); },
      close: [{ fn: function (x) { return 3 * Math.pow(5 * x - 2, 2); }, msg: 'You applied the power rule to the outside, which is right.' }],
      hints: [],
      done: 'The outside gives 3(5x − 2)², and the inside 5x − 2 has derivative 5. So g′(x) = 15(5x − 2)².', doneP: 1
    },
    p4: {
      topic: 'pq', slide: 11, name: 'Product rule', difficulty: 'easy', check: true, next: 'p1', text: 'Find k′(x) for k(x) = (x + 3)(x² − 1)',
      fn: function (x) { return 3 * x * x + 6 * x - 1; },
      close: [{ fn: function (x) { return 2 * x; }, msg: 'The derivative of a product is not the product of the derivatives.' }],
      hints: [],
      done: 'The product rule gives 1 · (x² − 1) + (x + 3) · 2x = 3x² + 6x − 1.', doneP: 0
    }
  };

  /* ---------------- help policy (one configuration object) ----------------
     HELP_POLICY[band][difficulty] = { levels, startLevel, attemptsBeforeSolution, offerNextAfter }
       band: low (rating 0 to 3), mid (4 to 6, or not rated), high (7 to 10)
       levels: help levels offered, from 1 Hint, 2 Concept, 3 Example, 4 Solution
       startLevel: level shown right after the first wrong attempt (0 = wait until the student asks)
       attemptsBeforeSolution: wrong attempts before the solution opens without a confirmation question
         (the student is never blocked from the solution)
       offerNextAfter: wrong attempts after which the next level is offered as the main action
     To run a different policy (for example the one from Milestone 3), add an entry here, or call
     window.__proto.registerPolicy(id, label, cells) and window.__proto.setPolicy(id), or open ?policy=id. */
  var ALL = [1, 2, 3, 4];
  function cell(levels, start, att, offer) { return { levels: levels, startLevel: start, attemptsBeforeSolution: att, offerNextAfter: offer }; }
  var HELP_POLICIES = {
    adaptive: {
      label: 'Adaptive (hand-made default)',
      cells: {
        low: { easy: cell(ALL, 1, 3, 1), hard: cell(ALL, 2, 2, 1) },
        mid: { easy: cell([1, 2, 4], 1, 3, 2), hard: cell(ALL, 1, 3, 2) },
        high: { easy: cell([1, 4], 0, 4, 3), hard: cell([1, 2, 4], 1, 3, 2) }
      }
    },
    baseline: {
      label: 'Baseline (all levels everywhere)',
      cells: {
        low: { easy: cell(ALL, 1, 2, 1), hard: cell(ALL, 1, 2, 1) },
        mid: { easy: cell(ALL, 1, 2, 1), hard: cell(ALL, 1, 2, 1) },
        high: { easy: cell(ALL, 1, 2, 1), hard: cell(ALL, 1, 2, 1) }
      }
    }
  };
  var POLICY_ID = (/[?&]policy=([a-z0-9_-]+)/i.exec(QS) || [])[1];
  if (!POLICY_ID || !HELP_POLICIES[POLICY_ID]) POLICY_ID = 'adaptive';
  function bandOf(r) { return r == null ? 'mid' : r <= 3 ? 'low' : r <= 6 ? 'mid' : 'high'; }
  function policyCell(r, diff) { return JSON.parse(JSON.stringify(HELP_POLICIES[POLICY_ID].cells[bandOf(r)][diff])); }
  function nextLevelOf(m) { return m.cell.levels.filter(function (l) { return l > m.level; })[0] || null; }

  /* ---------------- trust helpers ---------------- */
  var MATCH_NAME = { strong: 'Strong', partial: 'Partial', none: 'None' };
  var KIND_LABEL = { s: 'From your slides', d: 'Derived from your slides', g: 'Not in your slides' };
  function counts(sents) { var c = { s: 0, d: 0, g: 0 }; sents.forEach(function (x) { c[x.k]++; }); return c; }
  function matchOf(sents) { var c = counts(sents); if (!c.s && !c.d) return 'none'; return c.g ? 'partial' : 'strong'; }
  function countLine(sents) {
    var c = counts(sents), n = sents.length;
    var s = c.s + ' of ' + n + (n === 1 ? ' step comes' : ' steps come') + ' from your slides';
    if (c.d) s += ', ' + c.d + ' derived from them';
    if (c.g) s += ', ' + c.g + ' general knowledge';
    return s;
  }
  function matchReason(sents) {
    var c = counts(sents), n = sents.length, mt = matchOf(sents);
    if (mt === 'none') return 'Nothing in your slides supports this answer.';
    var base = c.s + ' of ' + n + (n === 1 ? ' step is' : ' steps are') + ' in your slides' + (c.d ? ', ' + c.d + ' derived from them' : '') + '.';
    return mt === 'strong' ? base + ' No general knowledge was added.' : base + ' ' + c.g + (c.g === 1 ? ' is' : ' are') + ' general knowledge that is not in your material.';
  }
  var MATCH_ADVICE = { strong: 'Safe to build on. Click a sentence to see the passage it relies on.', partial: 'Check the outlined sentences yourself before relying on them.', none: 'Treat this as a guess. Check it in the lecture or ask your instructor.' };

