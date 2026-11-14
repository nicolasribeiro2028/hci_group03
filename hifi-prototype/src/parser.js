  /* ---------------- tiny safe math parser (so any correct form is accepted) ---------------- */
  function parseFn(str) {
    try {
      var s = String(str).toLowerCase().replace(/\s+/g, '')
        .replace(/[′’`]/g, "'").replace(/[·×⋅∙]/g, '*').replace(/[−–]/g, '-').replace(/÷/g, '/')
        .replace(/²/g, '^2').replace(/³/g, '^3').replace(/⁴/g, '^4').replace(/⁵/g, '^5');
      if (s.indexOf('=') > -1) s = s.split('=').pop();
      if (!s) return null;
      var toks = [], i = 0;
      while (i < s.length) {
        var c = s[i];
        if (/[0-9.]/.test(c)) { var j = i; while (j < s.length && /[0-9.]/.test(s[j])) j++; var v = parseFloat(s.slice(i, j)); if (isNaN(v)) return null; toks.push({ t: 'n', v: v }); i = j; }
        else if (c === 'x') { toks.push({ t: 'x' }); i++; }
        else if ('+-*/^()'.indexOf(c) > -1) { toks.push({ t: c }); i++; }
        else return null;
      }
      var out = [];
      for (var k = 0; k < toks.length; k++) {
        var a = toks[k - 1], b = toks[k];
        if (a && (a.t === 'n' || a.t === 'x' || a.t === ')') && (b.t === 'n' || b.t === 'x' || b.t === '(')) out.push({ t: '*' });
        out.push(b);
      }
      var p = 0;
      var peek = function () { return out[p]; };
      function expr() { var l = term(); while (peek() && (peek().t === '+' || peek().t === '-')) { var o = out[p++].t, r = term(), a = l; l = (o === '+') ? (function (a, r) { return function (x) { return a(x) + r(x); }; })(a, r) : (function (a, r) { return function (x) { return a(x) - r(x); }; })(a, r); } return l; }
      function term() { var l = unary(); while (peek() && (peek().t === '*' || peek().t === '/')) { var o = out[p++].t, r = unary(), a = l; l = (o === '*') ? (function (a, r) { return function (x) { return a(x) * r(x); }; })(a, r) : (function (a, r) { return function (x) { return a(x) / r(x); }; })(a, r); } return l; }
      function unary() { if (peek() && peek().t === '-') { p++; var u = unary(); return function (x) { return -u(x); }; } if (peek() && peek().t === '+') { p++; return unary(); } return power(); }
      function power() { var b = atom(); if (peek() && peek().t === '^') { p++; var e = unary(); return function (x) { return Math.pow(b(x), e(x)); }; } return b; }
      function atom() {
        var t = out[p++]; if (!t) throw new Error('end');
        if (t.t === 'n') return function () { return t.v; };
        if (t.t === 'x') return function (x) { return x; };
        if (t.t === '(') { var e = expr(); if (!(peek() && peek().t === ')')) throw new Error('paren'); p++; return e; }
        throw new Error('tok');
      }
      var f = expr(); if (p !== out.length) return null; return f;
    } catch (e) { return null; }
  }
  var PTS = [0.7, 1.3, -0.9, 2.1, 0.35];
  function same(f, g) {
    for (var i = 0; i < PTS.length; i++) {
      var a = f(PTS[i]), b = g(PTS[i]);
      if (!isFinite(a) || !isFinite(b)) return false;
      if (Math.abs(a - b) > 1e-6 * (1 + Math.abs(b))) return false;
    }
    return true;
  }
