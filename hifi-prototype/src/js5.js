
  /* ---------------- real PDF viewer + marking by quote (PDF.js) ----------------
     The AI will return a page number and a quote. We find the quote in the PDF text layer and draw
     highlight boxes over the page. Matching is exact first, then tolerant (word overlap), so a slightly
     different quote still lands on the right passage. */
  var PDF = { promise: null, lib: null, doc: null, texts: {}, canvases: {}, tok: 0 };
  /* One document is open at a time. Opening another file resets the cached pages. */
  function pdfLoad(url) {
    if (PDF.promise && PDF.url === url) return PDF.promise;
    PDF.url = url; PDF.doc = null; PDF.texts = {}; PDF.canvases = {}; PDF.order = [];
    var lib = PDF.lib ? Promise.resolve(PDF.lib) : import('./vendor/pdf.min.mjs').then(function (l) { l.GlobalWorkerOptions.workerSrc = './vendor/pdf.worker.min.mjs'; PDF.lib = l; return l; });
    var p = lib.then(function (l) { return l.getDocument(url).promise; }).then(function (doc) { if (PDF.url === url) PDF.doc = doc; return doc; });
    PDF.promise = p; p.catch(function () { if (PDF.promise === p) { PDF.promise = null; PDF.url = null; } });
    return p;
  }
  function wordsOf(s) { return String(s).toLowerCase().split(/[^a-z0-9äöüéèàçñ′']+/i).filter(Boolean); }
  function pageData(n) {
    if (PDF.texts[n]) return PDF.texts[n];
    PDF.texts[n] = PDF.doc.getPage(n).then(function (page) {
      return page.getTextContent().then(function (tc) {
        var items = tc.items.filter(function (i) { return typeof i.str === 'string' && i.str.trim(); }), toks = [];
        items.forEach(function (it, idx) {
          var re = /[A-Za-z0-9äöüéèàçñ′']+/g, m;
          while ((m = re.exec(it.str))) toks.push({ w: m[0].toLowerCase(), item: idx, s: m.index, e: m.index + m[0].length });
        });
        return { page: page, items: items, toks: toks };
      });
    });
    return PDF.texts[n];
  }
  /* returns the token range [a, b] of the best match for quote on this page, or null */
  function matchOnPage(pd, quote) {
    var q = wordsOf(quote), t = pd.toks; if (!q.length || t.length < 1) return null;
    for (var i = 0; i + q.length <= t.length; i++) {
      var ok = true; for (var j = 0; j < q.length; j++) if (t[i + j].w !== q[j]) { ok = false; break; }
      if (ok) return { a: i, b: i + q.length - 1, score: 1 };
    }
    var best = null, qs = {}; q.forEach(function (w) { qs[w] = 1; });
    for (var s = 0; s + q.length <= t.length; s++) {
      var hit = 0; for (var k = 0; k < q.length; k++) if (qs[t[s + k].w]) hit++;
      var sc = hit / q.length; if (!best || sc > best.score) best = { a: s, b: s + q.length - 1, score: sc };
    }
    return best && best.score >= 0.7 ? best : null;
  }
  function findQuote(quote, hintPage) {
    var order = []; if (hintPage) order.push(hintPage);
    for (var p = 1; p <= PDF.doc.numPages; p++) if (p !== hintPage) order.push(p);
    var best = null, i = 0;
    function next() {
      if (i >= order.length) return Promise.resolve(best);
      var n = order[i++];
      return pageData(n).then(function (pd) {
        var m = matchOnPage(pd, quote);
        if (m && m.score === 1) return { page: n, score: 1 };
        if (m && (!best || m.score > best.score)) best = { page: n, score: m.score };
        return next();
      });
    }
    return next();
  }
  var IC = {
    search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>',
    x: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>'
  };
  function pdfBodyHtml() {
    var c = C.cited && C.cited.pdf ? C.cited : null;
    return '<div class="pdfwrap"><div class="pdfscroll" id="pdfscroll"><div class="pdfload"><span class="spin"></span></div></div>' +
      '<form class="markform" id="markform"><button class="mkbtn" type="submit" aria-label="Mark text in the slides" title="Mark text in the slides">' + IC.search + '</button><input id="mark-q" placeholder="Mark text" aria-label="Text to mark"></form>' +
      '<div class="pgpill" id="pgpill">' + (C.pdfPage || 1) + ' / ' + (PDF.doc ? PDF.doc.numPages : '…') + '</div>' +
      (c ? '<button class="srcchip" data-clearev="1" title="Clear highlight" aria-label="Clear highlight">Source · p.' + c.page + IC.x + '</button>' : '') + '</div>';
  }
  function updatePill(sc) {
    var pgs = sc.querySelectorAll('.pg'), y = sc.scrollTop + sc.clientHeight * 0.35, cur = 1;
    for (var i = 0; i < pgs.length; i++) { if (pgs[i].offsetTop <= y) cur = i + 1; else break; }
    C.pdfPage = cur; var p = $('#pgpill'); if (p) p.textContent = cur + ' / ' + PDF.doc.numPages;
  }
  function renderPg(n, el, w, token, cit) {
    if (el.getAttribute('data-done') === '1') return;
    el.setAttribute('data-done', '1');
    pageData(n).then(function (pd) {
      if (token !== PDF.tok) return;
      var base = pd.page.getViewport({ scale: 1 }), scale = w / base.width, vp = pd.page.getViewport({ scale: scale }), key = n + '@' + w;
      el.style.height = Math.floor(vp.height) + 'px';
      var done;
      if (PDF.canvases[key]) done = Promise.resolve(PDF.canvases[key]);
      else {
        var cv = document.createElement('canvas'), dpr = Math.min(window.devicePixelRatio || 1, 2);
        cv.width = Math.floor(vp.width * dpr); cv.height = Math.floor(vp.height * dpr); cv.style.width = '100%'; cv.style.height = '100%';
        done = pd.page.render({ canvasContext: cv.getContext('2d'), viewport: pd.page.getViewport({ scale: scale * dpr }) }).promise.then(function () {
          PDF.canvases[key] = cv; PDF.order = (PDF.order || []).filter(function (k) { return k !== key; }); PDF.order.push(key);
          while (PDF.order.length > 14) delete PDF.canvases[PDF.order.shift()];
          return cv;
        });
      }
      return done.then(function (cv) {
        if (token !== PDF.tok || el.getAttribute('data-done') !== '1') return;
        el.innerHTML = ''; el.appendChild(cv);
        var layer = document.createElement('div'); layer.className = 'pdfhls'; el.appendChild(layer);
        if (cit && cit.page === n) drawHighlight(layer, pd, vp, cit, el);
      });
    });
  }
  function pdfRender(f) {
    var token = ++PDF.tok;
    if (PDF.io) { PDF.io.disconnect(); PDF.io = null; }
    pdfUrl(f).then(pdfLoad).then(function () {
      var sc = $('#pdfscroll'); if (token !== PDF.tok || !sc) return;
      var cit = C.cited && C.cited.pdf ? C.cited : null, N = PDF.doc.numPages, w = sc.clientWidth || 600;
      return pageData(1).then(function (pd1) {
        if (token !== PDF.tok || !$('#pdfscroll')) return;
        var b = pd1.page.getViewport({ scale: 1 }), h = Math.floor(b.height * (w / b.width)), html = '';
        for (var n = 1; n <= N; n++) html += '<div class="pg" data-n="' + n + '" style="height:' + h + 'px"></div>';
        sc.innerHTML = html;
        if (cit) sc.scrollTop = sc.querySelector('.pg[data-n="' + cit.page + '"]').offsetTop - 6;
        else sc.scrollTop = C.pdfScroll || 0;
        updatePill(sc);
        PDF.io = new IntersectionObserver(function (ents) {
          ents.forEach(function (en) {
            var el = en.target, n2 = +el.getAttribute('data-n');
            if (en.isIntersecting) renderPg(n2, el, w, token, C.cited && C.cited.pdf ? C.cited : null);
            else if (el.getAttribute('data-done') === '1') { el.setAttribute('data-done', '0'); el.innerHTML = ''; }
          });
        }, { root: sc, rootMargin: '1200px 0px' });
        $$('.pg', sc).forEach(function (el) { PDF.io.observe(el); });
        var raf = 0;
        sc.addEventListener('scroll', function () { C.pdfScroll = sc.scrollTop; if (raf) return; raf = requestAnimationFrame(function () { raf = 0; updatePill(sc); }); });
      });
    }).catch(function (e) {
      var h = $('#pdfscroll'); if (h) h.innerHTML = '<div class="pdfload">Could not load this PDF. If you added it in another browser session, add it again.</div>';
      if (window.console) console.error(e);
    });
  }
  function drawHighlight(layer, pd, vp, cit, pgEl) {
    var m = matchOnPage(pd, cit.quote); if (!m) return;
    var T = PDF.lib.Util, byItem = {};
    for (var i = m.a; i <= m.b; i++) { var t = pd.toks[i], g = byItem[t.item] || (byItem[t.item] = { s: t.s, e: t.e }); g.s = Math.min(g.s, t.s); g.e = Math.max(g.e, t.e); }
    var first = null;
    Object.keys(byItem).forEach(function (k) {
      var it = pd.items[k], g = byItem[k], len = Math.max(1, it.str.length), tx = T.transform(vp.transform, it.transform);
      var h = Math.hypot(tx[2], tx[3]) || 12, wFull = it.width * vp.scale;
      var x = tx[4] + wFull * (g.s / len), w = wFull * ((g.e - g.s) / len), y = tx[5] - h * 0.86;
      var d = document.createElement('div'); d.className = 'pdfhl k-' + (cit.kind || 's');
      d.style.cssText = 'left:' + (x - 3) + 'px;top:' + (y - 2) + 'px;width:' + (w + 6) + 'px;height:' + (h * 1.1 + 4) + 'px';
      layer.appendChild(d); if (!first || y < first.y) first = { y: y, x: x };
    });
    var sc = $('#pdfscroll');
    if (first && sc && !cit.scrolled) {
      cit.scrolled = true;
      var top = pgEl.offsetTop + first.y - sc.clientHeight * 0.4;
      setTimeout(function () { sc.scrollTo({ top: Math.max(0, top), behavior: REDUCED ? 'auto' : 'smooth' }); }, 80);
    }
  }
  /* public: mark a quote. hint = page to try first. */
  function markQuote(quote, kind, text, hint, keepMin) {
    var f = C.files.filter(function (x) { return x.status === 'added' && x.kind === 'pdf'; })[0]; if (!f) return Promise.resolve(false);
    return pdfUrl(f).then(pdfLoad).then(function () { return findQuote(quote, hint); }).then(function (r) {
      if (!r) { toast('Not found in your slides. That is what a "not in your slides" answer would look like.'); return false; }
      C.pdfPage = r.page; C.cited = { pdf: true, slide: 'P' + r.page, page: r.page, quote: quote, kind: kind || 's', text: text || quote, scrolled: false };
      openFile(f.id, null, null, !!keepMin); renderViewer(); markCited(); return true;
    });
  }
  /* click or hover on a sentence in the chat: normal slide or PDF quote */
  function evidenceGo(o, keepMin) {
    var v = o.getAttribute('data-evid').split('|'), txt = o.getAttribute('data-evt'), q = o.getAttribute('data-evq');
    if (/^P/.test(v[0])) { markQuote(q, v[2], txt, +v[0].slice(1), keepMin); return; }
    var ps = (o.getAttribute('data-evps') || '').split(',').filter(Boolean).map(Number);
    showEvidence(+v[0], +v[1], v[2], txt, keepMin, ps.length ? ps : null);
  }
  document.addEventListener('submit', function (e) {
    if (e.target.id !== 'markform') return;
    e.preventDefault(); var q = $('#mark-q').value.trim(); if (q) markQuote(q, 's', q, C.pdfPage, false);
  });
  if (window.ResizeObserver) { var rt; new ResizeObserver(function () { clearTimeout(rt); rt = setTimeout(function () { var f = C && C.active ? fileById(C.active) : null; if (f && f.kind === 'pdf' && !S.vmin) pdfRender(f); }, 150); }).observe($('#viewer')); }

  /* scripted demo answers for this deck. The real version: retrieval + an LLM that returns page + quote per sentence. */
  function pdfAnswer(t) {
    if (/moore|transistor|exponential/.test(t) && !/who|propos|invent|found/.test(t)) return { s: [
      T('s', 'P8', 0, 'Moore’s law says that transistor counts double every two years.', 'transistor counts double every two years'),
      T('s', 'P8', 1, 'Computational power therefore grows exponentially.', 'computational power grows exponentially'),
      T('s', 'P8', 2, 'The same trend also applies to RAM size and pixel densities.', 'also applies to RAM size and pixel densities')] };
    if (/who|propos|invent|gordon|found/.test(t) && /moore/.test(t)) return { s: [
      T('s', 'P8', 0, 'The slide on Moore’s law shows a recap with a photo of its originator.', 'Moore’s Law Recap'),
      T('g', null, null, 'Gordon Moore, a co-founder of Intel, proposed it in 1965.')], note: 'The name and the date are not written on the slide. Check them in the lecture or a reliable source.' };
    if (/goal|learn|aim|objective/.test(t)) return { s: [
      T('s', 'P3', 0, 'The course aims to teach the basic notions of computational design in an HCI context.', 'students will learn the basic notions of computational design in a HCI context'),
      T('s', 'P3', 1, 'Students should also integrate cutting-edge approaches into their prototypes.', 'integrate cutting-edge approaches into their prototypes')] };
    if (/week|overview|schedule|w8|next/.test(t)) return { s: [
      T('s', 'P2', 0, 'This lecture is week 8 and covers computational design.', 'W8 Computational Design'),
      T('s', 'P2', 1, 'The next weeks move on to user modeling, starting with perception, cognition, and memory.', 'W9 User Modeling: Perception, cognition, and memory')] };
    if (/menu|task|usability|ucd/.test(t)) return { s: [
      T('s', 'P5', 0, 'The task is to arrange the elements in the menu to achieve the best usability.', 'arrange elements in the menu to achieve the best usability'),
      T('s', 'P6', 0, 'The follow-up asks how you would do it with user-centered design.', 'how would you do it with UCD')] };
    return null;
  }
