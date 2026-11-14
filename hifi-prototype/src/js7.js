
  /* ---------------- account: email sign-in, saved state per email, real replies ----------------
     There is no password and no server account. The email only picks which saved state to open.
     State is kept in this browser (localStorage) and saved a moment after any change.
     Real replies: when the toggle in the chat header is on, a general question is written to agent/log.md by
     server.js and a terminal agent answers it from the notes. Scripted answers stay the default. */
  var AK = 'hifi-session', UK = 'hifi-users', RK = 'hifi-real', DEMO = 'demo@local.test';
  var REAL = false, realWait = null, lastSaved = '';
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }
  function lsDel(k) { try { localStorage.removeItem(k); } catch (e) { } }
  function acctEmail() { return lsGet(AK); }
  function acctUsers() { try { return JSON.parse(lsGet(UK)) || {}; } catch (e) { return {}; } }

  function acctSave() {
    var em = acctEmail(); if (!em || !S) return;
    var js; try { js = JSON.stringify(S); } catch (e) { return; }
    if (js === lastSaved) return;
    var us = acctUsers(); us[em] = JSON.parse(js); lastSaved = js;
    lsSet(UK, JSON.stringify(us));
  }
  function acctClean(s) {
    s.focus = false; s.map = false; s.exOn = false; s.editing = false; delete s.snap;
    Object.keys(s.courses).forEach(function (k) {
      var c = s.courses[k]; c.loading = 0; c.timers = [];
      c.files.forEach(function (f) { if (f.status === 'uploading') { f.status = 'added'; f.pct = 100; } });
      c.chats.forEach(function (ch) { ch.msgs = ch.msgs.filter(function (m) { return !m.waiting; }); });
    });
    return s;
  }
  function acctOpen(email) {
    var saved = acctUsers()[email];
    if (saved && saved.courses) { S = acctClean(saved); C = S.courses[S.ctx] || S.courses[Object.keys(S.courses)[0]]; }
    else { fresh(); if (email === DEMO) demoSeed(); }
    dropHci(); lsSet(AK, email); lastSaved = '';
    $('#login').hidden = true; $('#login').removeAttribute('inert');
    renderAll(); setFocus(false); applyLayout();
    var who = $('#whoami'); if (who) who.textContent = email;
  }
  /* A saved state from a machine that had the course PDF: drop that context when the file is missing. */
  function dropHci() {
    if (HAS_PDF || !S.courses.hci) return;
    delete S.courses.hci; S.ctxs = S.ctxs.filter(function (c) { return c.key !== 'hci'; });
    if (S.ctx === 'hci') { S.ctx = 'calc'; C = S.courses.calc; }
  }
  /* A ready workspace for demos: Calculus I with both lectures added and a rating on every topic. */
  function demoSeed() {
    S.started = true;
    S.profile = { desc: 'I am a first year CS student. I struggle with maths.', courses: ['Calculus I', 'Linear Algebra', 'Statistics'], custom: [] };
    S.ctx = 'calc'; C = S.courses.calc;
    FILE_DEFS.calc.forEach(function (d) {
      C.files.push({ id: 'f' + C.nid++, defId: d.id, name: d.name, short: d.short, mb: d.mb, pages: d.pages, kind: d.kind, preview: d.preview, slides: d.slides, topics: d.topics, status: 'added', pct: 100 });
    });
    C.topics = ['basic', 'pq', 'chain', 'tangent', 'optim'].map(function (id) { return TOPIC_DEFS[id]; });
    C.ratings = { basic: 7, pq: 4, chain: 2, tangent: 3, optim: 2 };
    C.tabs = [C.files[1].id]; C.active = C.files[1].id;
    C.chats[0].msgs = [{ r: 'ai', text: 'Hi! You have already taken Calculus I, Linear Algebra and Statistics, so I will not start from zero.' }];
  }
  function acctOut() {
    acctSave(); lsDel(AK); lastSaved = '';
    S.exOn = false; S.focus = false; setInert(false);
    $('#login').hidden = false; $('#login-email').value = ''; $('#login-email').focus();
    $('#intro').hidden = true;
  }
  function acctBoot() {
    REAL = lsGet(RK) === '1'; syncReal();
    var em = acctEmail();
    if (em) acctOpen(em); else { $('#intro').hidden = true; $('#login').hidden = false; }
    setInterval(acctSave, 1500);
    window.addEventListener('beforeunload', acctSave);
  }
  function loginSubmit() {
    var v = $('#login-email').value.trim();
    if (!v) { $('#login-note').textContent = 'Write an email first.'; return; }
    if (!/^\S+@\S+$/.test(v)) { $('#login-note').textContent = 'That does not look like an email address.'; return; }
    acctOpen(v.toLowerCase());
  }
  document.addEventListener('click', function (e) {
    var t = e.target; if (!t.closest) return;
    if (t.closest('#login-go')) { loginSubmit(); return; }
    if (t.closest('#login-demo')) { acctOpen(DEMO); return; }
    if (t.closest('#b-signout')) { acctOut(); return; }
  });
  document.addEventListener('keydown', function (e) { if (e.target.id === 'login-email' && e.key === 'Enter') { e.preventDefault(); loginSubmit(); } });

  /* ---- real replies ---- */
  function syncReal() {
    var t = $('#real-toggle'); if (t) { t.checked = REAL; t.setAttribute('aria-checked', REAL); }
    var f = $('.foot'); if (f) f.textContent = REAL ? 'Prototype · chat replies come from the reply agent (real), exercises are scripted' : 'Prototype · scripted answers';
  }
  document.addEventListener('change', function (e) {
    if (e.target.id !== 'real-toggle') return;
    var on = e.target.checked;
    if (!on) { REAL = false; lsSet(RK, '0'); syncReal(); toast('Scripted answers are back.'); return; }
    fetch('/log', { cache: 'no-store' }).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (d) {
      if (typeof d.text !== 'string') throw 0;
      REAL = true; lsSet(RK, '1'); syncReal(); toast('Real replies are on. A reply agent must be running.');
    }).catch(function () {
      REAL = false; lsSet(RK, '0'); syncReal();
      toast('Real replies need the Node server. Run: node server.js');
    });
  });
  function notesFor() {
    return C.files.filter(function (f) { return f.status === 'added'; }).map(function (f) {
      var note = (f.slides || []).map(function (n) { var s = SLIDES[n]; return s ? s.t + ': ' + s.p.join(' ') : ''; }).filter(Boolean).join(' | ');
      return { name: f.name, note: note };
    });
  }
  function replyFor(text, id) {
    var marker = '## ' + id + ' reply', i = text.indexOf(marker); if (i < 0) return null;
    var rest = text.slice(i + marker.length).replace(/^\n/, ''), n = rest.search(/\n## /);
    return (n < 0 ? rest : rest.slice(0, n)).trim() || null;
  }
  function realAsk(question) {
    var ch = chat(), wait = { r: 'ai', text: 'Waiting for the reply agent…', waiting: true };
    deliver(ch, wait); realWait = wait; renderMsgs();
    var fail = function (msg) { wait.waiting = false; wait.text = msg; wait.note = 'Real replies are on. Switch them off in the chat header to use scripted answers.'; realWait = null; renderMsgs(); };
    fetch('/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: question, context: (S.ctxs.filter(function (c) { return c.key === S.ctx; })[0] || {}).name || S.ctx, notes: notesFor() }) })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) {
        (function poll() {
          if (realWait !== wait) return;
          fetch('/log', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (j) {
            var rep = replyFor(j.text || '', d.id);
            if (!rep) { setTimeout(poll, 1000); return; }
            wait.waiting = false; wait.text = rep; wait.real = true;
            wait.note = 'Real reply from the reply agent. It is not matched to your slides.'; realWait = null; renderMsgs();
          }).catch(function () { setTimeout(poll, 1500); });
        })();
      }).catch(function () { fail('The question could not be saved. Is the Node server running?'); });
  }
