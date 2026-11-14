
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
    delete s.dock; delete s.vh; s.focus = false; s.map = false; s.exOn = false; s.gOn = false; s.gNode = null; s.editing = false; delete s.snap;
    if (s.ex) { s.ex.busy = false; if (s.ex.res && s.ex.res.pending) { s.ex.res.pending = false; s.ex.res.more = s.ex.plan.length > s.ex.cur + 1; s.ex.res.note = 'Planning was interrupted by a reload.'; } }
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
    if (!on) { REAL = false; realWait = null; lsSet(RK, '0'); syncReal(); toast('Scripted answers are back.'); return; }
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

  /* ---------------- uploads: any PDF, kept in this browser (IndexedDB) so it opens again after a reload ---------------- */
  var idbP = null, BURL = {};
  function idb() {
    if (!idbP) idbP = new Promise(function (res, rej) {
      var r = indexedDB.open('hifi-files', 1);
      r.onupgradeneeded = function () { r.result.createObjectStore('blobs'); };
      r.onsuccess = function () { res(r.result); }; r.onerror = function () { rej(r.error); };
    });
    return idbP;
  }
  function blobPut(k, blob) { return idb().then(function (db) { return new Promise(function (res, rej) { var tx = db.transaction('blobs', 'readwrite'); tx.objectStore('blobs').put(blob, k); tx.oncomplete = res; tx.onerror = function () { rej(tx.error); }; }); }); }
  function blobGet(k) { return idb().then(function (db) { return new Promise(function (res, rej) { var rq = db.transaction('blobs').objectStore('blobs').get(k); rq.onsuccess = function () { res(rq.result); }; rq.onerror = function () { rej(rq.error); }; }); }); }
  function pdfUrl(f) {
    if (!f.blobKey) return Promise.resolve(f.url);
    if (BURL[f.blobKey]) return Promise.resolve(BURL[f.blobKey]);
    return blobGet(f.blobKey).then(function (b) { if (!b) throw new Error('missing file'); BURL[f.blobKey] = URL.createObjectURL(b); return BURL[f.blobKey]; });
  }
  function shortName(n) { n = n.replace(/\.pdf$/i, ''); return n.length > 24 ? n.slice(0, 22) + '…' : n; }
  function knownDef(name) {
    var all = FILE_DEFS.calc.concat(FILE_DEFS.linalg, FILE_DEFS.hci); Object.keys(S.extraDefs).forEach(function (k) { all = all.concat(S.extraDefs[k]); });
    return all.filter(function (d) { return d.name === name; })[0];
  }
  function addUploads(list) {
    var files = Array.prototype.slice.call(list), refused = 0, dup = 0, added = 0, last = null;
    files.forEach(function (file) {
      if (!/\.pdf$/i.test(file.name)) { refused++; return; }
      if (C.files.some(function (f) { return f.name === file.name; })) { dup++; return; }
      var def = knownDef(file.name);
      if (def && !C.pdfDemo) { addFile(def); added++; return; }          /* a known lecture keeps its slides and topics */
      var f = { id: 'f' + C.nid++, defId: null, name: file.name, short: shortName(file.name), mb: (file.size / 1048576).toFixed(1), pages: null, kind: 'pdf', url: null, blobKey: 'b' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7), slides: [], topics: [], status: 'added', pct: 100 };
      blobPut(f.blobKey, file).catch(function () { toast('This browser could not keep ' + file.name + ' for later. It will open now but not after a reload.'); });
      BURL[f.blobKey] = URL.createObjectURL(file);
      C.files.push(f); last = f; added++;
    });
    if (refused) toast('Please choose a PDF.');
    else if (dup && !added) toast('That file is already in your material.');
    else if (added) toast(added === 1 ? 'File added.' : added + ' files added.');
    renderLeft();
    if (last) openFile(last.id);
  }
  document.addEventListener('change', function (e) {
    if (e.target.id !== 'file-input') return;
    addUploads(e.target.files); e.target.value = '';
  });
