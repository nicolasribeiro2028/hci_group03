
  /* ---------------- state ---------------- */
  var S, C;
  var Q = [], qbusy = false;
  function newChat(title) { return { title: title, msgs: [], mode: null, topics: [], shown: 0, last: '' }; }
  function newCourse() {
    return { files: [], nid: 1, loading: 0, empty: false, topics: [], ratings: {}, start: {}, last: {}, pulse: {}, own: {}, streak: 0, log: [], openHist: {}, tags: [], tabs: [], active: null, slide: 12, cited: null,
      chats: [newChat('Getting started')], chat: 0, stats: { attempts: 0, level: 0, solved: 0 }, timers: [] };
  }
  /* The HCI context needs a course PDF that is not kept in the shared repository. Without the file it is left out. */
  var HAS_PDF = (function () { try { var x = new XMLHttpRequest(); x.open('HEAD', 'material/computational-design.pdf', false); x.send(); return x.status === 200; } catch (e) { return false; } })();
  function fresh() {
    var ctxs = [{ key: 'calc', name: 'Calculus I' }, { key: 'linalg', name: 'Linear Algebra' }], courses = { calc: newCourse(), linalg: newCourse() };
    if (HAS_PDF) { ctxs.unshift({ key: 'hci', name: 'HCI (real PDF test)' }); courses.hci = newCourse(); }
    S = { side: 'all', sbc: {}, vw: null, vmin: false, started: false, profile: { desc: '', courses: [], custom: [] }, ctx: HAS_PDF ? 'hci' : 'calc', ctxs: ctxs, extraDefs: {}, courses: courses };
    C = S.courses[S.ctx];
    if (HAS_PDF) {
      var h = S.courses.hci, d = FILE_DEFS.hci[0];
      h.pdfDemo = true; h.nid = 2; h.pdfPage = 1;
      h.files.push({ id: 'f1', defId: d.id, name: d.name, short: d.short, mb: d.mb, pages: d.pages, kind: 'pdf', url: d.url, slides: [], topics: [], status: 'added', pct: 100 });
      h.tabs = ['f1']; h.active = 'f1';
      h.chats[0].msgs.push({ r: 'ai', text: 'Ask about the slides. I mark the passage I used.', acts: [{ label: 'What is Moore’s law?', act: 'ask', arg: 'What is Moore’s law?', dark: true }, { label: 'What are the goals of the course?', act: 'ask', arg: 'What are the goals of the course?' }, { label: 'Who proposed Moore’s law?', act: 'ask', arg: 'Who proposed Moore’s law?' }] });
    }
    greet(S.courses.calc); greet(S.courses.linalg);
  }
  var PAST = ['Calculus I', 'Calculus II', 'Linear Algebra', 'Statistics', 'Probability', 'Discrete Mathematics', 'Differential Equations', 'Numerical Methods'];
  var NONE = 'None of these';
  function greetText() {
        return 'Hi! Add your course material to get started. I can answer without it, but I cannot point to your slides.';
  }
  function greet(c) { c.chats[0].msgs.push({ r: 'ai', text: greetText() }); }
  function chat() { return C.chats[C.chat]; }
  function hasMaterial() { return C.files.some(function (f) { return f.status === 'added'; }); }
  function fileById(id) { return C.files.filter(function (f) { return f.id === id; })[0]; }
  function fileForSlide(n) { if (typeof n === 'string' && n.charAt(0) === 'P') return C.files.filter(function (f) { return f.status === 'added' && f.kind === 'pdf'; })[0]; return C.files.filter(function (f) { return f.status === 'added' && f.defId === SLIDE_FILE[n]; })[0]; }
  function hasSlideFile(n) { return !!fileForSlide(n); }
  function slideSrcName(n) { var id = SLIDE_FILE[n], d = FILE_DEFS.calc.filter(function (x) { return x.id === id; })[0]; return d ? d.name : null; }
  function defsFor(key) { return FILE_DEFS[key] || S.extraDefs[key] || []; }
  function defById(id) { var all = FILE_DEFS.calc.concat(FILE_DEFS.linalg, FILE_DEFS.hci); Object.keys(S.extraDefs).forEach(function (k) { all = all.concat(S.extraDefs[k]); }); return all.filter(function (d) { return d.id === id; })[0]; }

  /* ---------------- feedback: toasts and announcer ---------------- */
  var tn = 0, undos = {};
  function toast(msg, undo) {
    var id = 'toast' + (++tn), el = document.createElement('div');
    el.className = 'toast'; el.id = id;
    el.innerHTML = '<span>' + esc(msg) + '</span>' + (undo ? '<button class="link" data-undo="' + id + '">Undo</button>' : '');
    if (undo) undos[id] = undo;
    $('#toasts').appendChild(el);
    setTimeout(function () { dismissToast(id); }, undo ? 7000 : 3500);
  }
  function dismissToast(id) {
    var el = document.getElementById(id); delete undos[id];
    if (!el) return;
    el.classList.add('out'); setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, INSTANT ? 0 : 220);
  }
  function announce(t) { var el = $('#sr'); el.textContent = ''; setTimeout(function () { el.textContent = t; }, 30); }

  /* ---------------- left panel ---------------- */
  var UI = {
    plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    user: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c.8-3.6 3.6-5.4 7-5.4s6.2 1.8 7 5.4"/></svg>',
    slides: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v4M8 20h8"/></svg>',
    hide: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
    send: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
    sliders: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 7h9M18 7h1M5 17h1M10 17h9"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg>',
    info: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8v.01"/></svg>',
    upload: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V5M12 5l-4 4M12 5l4 4M5 17v2h14v-2"/></svg>',
    chev: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>',
    chevR: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
    warn: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.01"/></svg>'
  };
  var DROP_HTML = '<div class="drop" id="drop" role="button" tabindex="0" aria-label="Add course material" title="Add course material">' + UI.upload + '<span>Add files</span></div>';
  var shownW = {};
  function animateBars() {
    $$('#left i[data-bk]').forEach(function (el) {
      var k = el.getAttribute('data-bk'), to = +el.getAttribute('data-bw'), from = shownW[k];
      if (from == null || REDUCED || from === to) { el.style.width = to + '%'; }
      else { el.style.width = from + '%'; void el.offsetWidth; requestAnimationFrame(function () { el.style.width = to + '%'; }); }
      shownW[k] = to;
    });
  }
  function fmt(n) { return String(Math.round(n * 10) / 10); }
  var ICONS = {
    side: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M9.5 4.5v15"/></svg>',
    chev: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>'
  };
  function renderActbar() {
    var b = $('#b-side'); if (!b) return;
    b.innerHTML = ICONS.side; b.hidden = !!S.side;
  }
  function filesHtml() {
    var h = C.files.map(function (f) {
      var st = f.status === 'added' ? '' : f.status === 'uploading' ? f.pct + '%' : 'Problem';
      var row = '<button type="button" class="file' + (C.active === f.id ? ' on' : '') + '" data-open="' + f.id + '"><span class="ico"></span><span class="nm" title="' + esc(f.name) + '">' + esc(f.name) + '</span><span class="st">' + st + '</span></button>';
      if (f.status === 'uploading') row += '<div class="bar" style="margin:-2px 10px 8px"><i style="width:' + f.pct + '%"></i></div>';
      if (f.status === 'problem') row += '<div class="small soft" style="margin:-2px 10px 8px">' + esc(f.note) + ' <button class="link" data-retry="' + f.id + '">Try again</button></div>';
      return row;
    }).join('');
    if (C.loading > 0) h += '<div class="row soft small" style="margin:6px 0"><span class="spin"></span> Reading your material…</div>';
    return h;
  }
  function topicsHtml() {
    var h = '';
    if (!C.topics.length && C.empty) {
      h += '<div class="small" style="margin-bottom:8px"><strong>We could not find any topics.</strong> The file may be a scan or have very little text. Add another file, or list the topics you want to work on.</div>' +
        '<input class="inp" id="manual" placeholder="Type a topic and press Enter" aria-label="Add a topic">';
    } else if (!C.topics.length && C.loading === 0) h += '<div class="small soft">Add a file in Material and its topics show up here.</div>';
    h += C.topics.map(function (t) {
      var r = C.ratings[t.id], on = chat().mode && chat().mode.topic === t.id;
      return '<div class="topic' + (on ? ' on' : '') + '"><button type="button" class="tmain" data-topic="' + t.id + '"><span class="t1"><span' + (on ? ' style="font-weight:600"' : '') + '>' + esc(t.name) + (C.own[t.id] ? '<span class="own">On my own</span>' : '') + '</span></span>' +
        '<span class="t2"><span class="bar" role="meter" aria-label="' + esc(t.name) + ', your rating" aria-valuemin="0" aria-valuemax="10" aria-valuenow="' + (r == null ? 0 : r) + '" aria-valuetext="' + (r == null ? 'Not rated' : fmt(r) + ' of 10') + '"><i data-bk="' + S.ctx + ':' + t.id + '" data-bw="' + (r == null ? 0 : r * 10) + '"></i></span><span class="val">' + (r == null ? 'Not rated' : fmt(r) + '/10') + '</span></span></button></div>';
    }).join('');
    return h;
  }
  function chatsHtml() {
    return C.chats.map(function (c, i) {
      var sub = c.mode && c.mode.solved ? (c.last || 'Solved') : c.mode ? 'In progress' : (c.msgs.length > 1 ? 'Conversation' : 'New');
      return '<button type="button" class="chatrow' + (i === C.chat ? ' on' : '') + '" data-chat="' + i + '"' + (i === C.chat ? ' aria-current="true"' : '') + '><span class="ct">' + esc(c.title) + '</span><span class="cs">' + esc(sub) + '</span></button>';
    }).join('');
  }
  function sbSection(key, title, action, body) {
    var open = !(S.sbc && S.sbc[key]);
    return '<section class="sbs"><div class="sbh"><button type="button" class="sbt" data-sbt="' + key + '" aria-expanded="' + open + '"><span class="chv' + (open ? '' : ' shut') + '">' + ICONS.chev + '</span><span class="h">' + title + '</span></button>' + (action || '') + '</div>' + (open ? '<div class="sbb">' + body + '</div>' : '') + '</section>';
  }
  function materialHtml() {
    var added = C.files.some(function (f) { return f.status === 'added'; }), defs = defsFor(S.ctx), more = defs.some(function (d) { return !C.files.some(function (f) { return f.defId === d.id; }); });
    var h = filesHtml();
    if (!C.files.length) h += '<div class="sbempty"><strong>Start here</strong><span>Add a PDF of your slides. The topics, the graph and Exercise mode build on it.</span><button class="btn dark small" data-addfiles="1">Choose PDF files</button></div>';
    if (C.files.length) h += DROP_HTML;
    if (more) h += '<button class="link sbsample" type="button" data-act="samples">' + (added ? 'Add more sample files' : 'Or add sample files') + '</button>';
    return h;
  }
  function renderLeft() {
    renderActbar();
    var ws = $('#ws'); if (ws) ws.classList.toggle('sb-off', !S.side);
    var pad0 = $('#left .p-pad'), scroll = pad0 ? pad0.scrollTop : 0, h = '';
    if (S.side) {
      h = '<div class="p-pad"><div class="sbtop"><button type="button" class="btn icon sbtog" data-side="all" aria-label="Hide sidebar" title="Hide sidebar (Ctrl or Cmd + B)">' + ICONS.side + '</button></div>' +
        sbSection('chats', 'Chats', '<button class="btn small icon" data-newchat="1" title="New chat" aria-label="New chat">' + UI.plus + '</button>', chatsHtml()) +
        sbSection('material', 'Material', '<button class="btn small" data-addfiles="1">Add files</button>', materialHtml()) +
        sbSection('assess', 'Self-assessment', C.topics.length ? '<button class="btn small icon" data-act="assess" title="Rate my knowledge" aria-label="Rate my knowledge">' + UI.sliders + '</button>' : '', topicsHtml()) + '</div>';
    }
    $('#left').innerHTML = h;
    var pad = $('#left .p-pad'); if (pad) pad.scrollTop = scroll;
    animateBars(); renderTop();
  }

  /* ---------------- viewer ---------------- */
  function renderViewer() {
    if (S.gOn) { S.vmin = false; applyLayout(); $('#viewer').innerHTML = graphHtml(); return; }
    var tabs = C.tabs.map(function (id) {
      var f = fileById(id); if (!f) return '';
      return '<div class="tab' + (C.active === id ? ' on' : '') + '"><button type="button" class="tabb" data-tab="' + id + '" title="' + esc(f.name) + '">' + esc(f.short || f.name) + '</button><button type="button" class="x" data-close="' + id + '" aria-label="Close ' + esc(f.short || f.name) + '" title="Close this tab (the file stays in your material)">×</button></div>';
    }).join('');
    var body = '', f = C.active ? fileById(C.active) : null;
    if (!f) body = '<div class="empty-v"><div><div class="h" style="margin-bottom:6px">No document open</div>Add your course material on the left, then click a file to read it here.</div></div>';
    else if (f.status !== 'added') body = '<div class="empty-v"><div>This file is not ready yet.</div></div>';
    else if (f.kind === 'lecture') {
      if (f.slides.indexOf(C.slide) < 0) C.slide = f.preview;
      var sl = SLIDES[C.slide], cit = C.cited && C.cited.slide === C.slide ? C.cited : null;
      var ix = f.slides.indexOf(C.slide);
      body = '<div class="p-pad"><div class="slide"><div class="no">Slide ' + C.slide + '</div><h3>' + esc(sl.t) + '</h3><div class="body' + (cit ? ' dim' : '') + '">' +
        sl.p.map(function (p, k) { return '<p class="' + ((sl.f && k === 1) ? 'f ' : '') + (cit && cit.p === k ? 'hl k-' + cit.kind : '') + '"' + (cit && cit.p === k ? ' data-tag="' + (cit.kind === 'd' ? 'Used to derive your answer' : 'Source of your answer') + '"' : '') + '>' + esc(p) + '</p>'; }).join('') + '</div></div>' +
        (cit ? '<div class="evstrip" role="status"><span>' + esc(cit.text || '') + '</span><button class="iconlink" data-clearev="1" aria-label="Clear highlight" title="Clear highlight">×</button></div>' : '') +
        '<div class="slidenav"><button class="btn small ghost icon" data-nav="-1"' + (ix <= 0 ? ' disabled' : '') + ' aria-label="Previous slide">' + UI.chev + '</button><span>' + C.slide + ' / ' + f.pages + '</span><button class="btn small ghost icon" data-nav="1"' + (ix >= f.slides.length - 1 ? ' disabled' : '') + ' aria-label="Next slide">' + UI.chevR + '</button></div></div>';
    } else if (f.kind === 'pdf') body = pdfBodyHtml();
    else body = '<div class="p-pad"><div class="soft small" style="margin-bottom:14px">Scanned pages. Short preview only.</div><div class="sk"><i style="width:90%"></i><i style="width:100%"></i><i style="width:78%"></i><i style="width:100%"></i><i style="width:86%"></i></div></div>';
    applyLayout();
    if (S.vmin) { $('#viewer').innerHTML = ''; return; }
    $('#viewer').innerHTML = '<div class="vhead"><div class="tabs">' + tabs + '</div><div class="vtools"><button type="button" class="vbtn icon" data-vtoggle="1" aria-label="Hide slides" title="Hide slides">' + UI.hide + '</button></div></div>' + body;
    markCited();
    if (f && f.kind === 'pdf' && f.status === 'added') pdfRender(f);
    var hl = $('#viewer p.hl');
    if (hl && hl.scrollIntoView) setTimeout(function () { hl.scrollIntoView({ block: 'nearest', behavior: REDUCED ? 'auto' : 'smooth' }); }, 30);
  }
  function openFile(id, slide, cited, keepMin) {
    if (!keepMin) S.vmin = false;
    if (C.tabs.indexOf(id) < 0) C.tabs.push(id);
    C.active = id;
    var ff = fileById(id);
    if (slide) { C.slide = slide; C.cited = cited || null; }
    else if (ff && ff.preview) { C.slide = ff.preview; C.cited = null; }
    renderLeft(); renderViewer();
  }
  function openSlide(n) { var f = fileForSlide(n); if (f) openFile(f.id, n, null); }
  function showEvidence(slide, p, kind, text, keepMin) {
    var f = fileForSlide(slide); if (!f) return;
    openFile(f.id, slide, { slide: slide, p: p, kind: kind, text: text }, keepMin);
  }

  /* ---------------- chat rendering ---------------- */
  function sentHtml(x) {
    var lab = '<span class="sr">' + KIND_LABEL[x.k] + ': </span>';
    if (x.k !== 'g' && x.slide && hasSlideFile(x.slide)) {
      var pg = String(x.slide).replace('P', '');
      return '<button type="button" class="sent k-' + x.k + '" data-evid="' + x.slide + '|' + x.p + '|' + x.k + '" data-evt="' + esc(x.t) + '"' + (x.q ? ' data-evq="' + esc(x.q) + '"' : '') + ' title="' + (x.k === 'd' ? 'Derived from' : 'From') + ' your slides, p.' + pg + '. Click to see it.">' + lab + esc(x.t) + '<span class="cite" aria-hidden="true">' + pg + '</span></button> ';
    }
    return '<span class="sent k-g" title="Not in your slides">' + lab + esc(x.t) + '<span class="cite" aria-hidden="true">!</span></span> ';
  }
  function evidenceHtml(m, i, pr) {
    var all = m.sents.concat(m.moreOpen && m.more ? m.more : []), mt = matchOf(all), c = counts(all);
    var slides = []; all.forEach(function (x) { if (x.k !== 'g' && x.slide && hasSlideFile(x.slide) && slides.indexOf(x.slide) < 0) slides.push(x.slide); });
    var grounded = c.s + c.d, n = all.length;
    var h = '<div class="evsum"><span class="match m-' + mt + '" tabindex="0" aria-describedby="tip-' + i + '"><span class="m3" aria-hidden="true"><i></i><i></i><i></i></span><b>' + MATCH_NAME[mt] + '</b><span class="cnt" title="' + esc(countLine(all)) + '">' + c.s + '/' + n + '</span><span class="tip" role="tooltip" id="tip-' + i + '">' + esc(matchReason(all)) + '</span></span>';
    if (!pr) h += '<button class="iconlink" data-why="' + i + '" title="Why this match" aria-label="Why this match">' + UI.info + '</button>';
    h += '</div>';
    if (mt === 'none' && !pr) h += '<div class="banner">' + UI.warn + '<span>Not in your slides</span><button class="btn small" data-act="lecture">Check lecture</button></div>';
    return h;
  }
  function ladderHtml(m) {
    var hp = m.help;
    var steps = [1, 2, 3, 4].map(function (n) {
      var st = hp.levels.indexOf(n) < 0 ? 'off' : n < hp.lv ? 'done' : n === hp.lv ? 'cur' : 'todo';
      return '<li class="st ' + st + '"' + (st === 'cur' ? ' aria-current="step"' : '') + (st === 'off' ? ' title="Skipped at your level"' : '') + '><span class="dot">' + (st === 'done' ? '✓' : n) + '</span><span>' + LV[n - 1] + '</span></li>';
    }).join('');
    return '<div class="ladcard"><ol class="lad" aria-label="Help steps">' + steps + '</ol></div>';
  }
  function renderMsgs(opt) {
    var ch = chat(), el = $('#msgs'), keep = opt && opt.keep, top = el.scrollTop;
    var pending = Q.some(function (q) { return q.ch === ch; });
    var h = ch.msgs.map(function (m, i) {
      var enter = i >= (ch.shown || 0) ? ' enter' : '';
      if (m.r === 'user') return '<div class="msg user' + enter + '"><div class="bubble">' + (m.attempt ? '<div class="who">Your step</div>' : '') + '<div class="btext">' + esc(m.text) + '</div></div></div>';
      var o = '<div class="msg ai' + enter + '"><span class="av" aria-hidden="true">AI</span><div class="bubble">';
      var kick = m.kick && m.kick !== 'AI note' ? m.kick : '';
      if (kick) o += '<div class="kick">' + esc(kick) + '</div>';
      if (m.title) o += '<div class="btitle">' + esc(m.title) + '</div>';
      if (m.sub) o += '<div class="bsub">' + esc(m.sub) + '</div>';
      if (m.help) o += ladderHtml(m);
      if (m.strong) o += '<div class="btext strong">' + esc(m.strong) + '</div>';
      if (m.text) o += '<div class="btext">' + esc(m.text) + '</div>';
      if (m.sents) o += '<div class="btext sents">' + m.sents.map(sentHtml).join('') + '</div>';
      if (m.more) {
        o += '<button type="button" class="link" data-more="' + i + '" aria-expanded="' + !!m.moreOpen + '" style="margin-top:6px">' + (m.moreOpen ? 'Hide detail' : 'Show more detail') + '</button>';
        if (m.moreOpen) o += '<div class="btext sents" style="margin-top:6px">' + m.more.map(sentHtml).join('') + '</div>';
      }
      if (m.note) o += '<div class="bnote">' + esc(m.note) + '</div>';
      if (m.sents) o += evidenceHtml(m, i);
      if (m.result) o += '<div class="result"><b>' + esc(m.result.line) + '</b><div class="rd2">' + esc(m.result.sub) + '</div></div>';
      if (m.acts && i === ch.msgs.length - 1 && !pending) o += '<div class="acts">' + m.acts.map(function (a) { return '<button class="btn small' + (a.dark ? ' dark' : '') + '" data-act="' + a.act + '"' + (a.arg != null ? ' data-arg="' + esc(a.arg) + '"' : '') + '>' + esc(a.label) + '</button>'; }).join('') + '</div>';
      return o + '</div></div>';
    }).join('');
    if (pending) h += '<div class="msg ai enter" aria-hidden="true"><span class="av">AI</span><div class="bubble typing"><i></i><i></i><i></i></div></div>';
    el.innerHTML = h;
    ch.shown = ch.msgs.length;
    el.scrollTop = keep ? top : el.scrollHeight;
    renderChatbar(); renderCompose(); markCited();
  }
  function renderChatbar() {
    $('#ctitle').textContent = chat().title;
    if (S.side) renderLeft();
  }
  function renderCompose() {
    var m = chat().mode;
    renderHeat(m);
    var t;
    if (!m) t = 'Ask a question about your material.';
    else if (m.solved) t = 'Solved. Ask a question or start another problem.';
    else if (m.check) t = 'Check: no help in this one. Type your answer.';
    else t = 'Type your attempt for: ' + PROBLEMS[m.pid].name;
    $('#hintline').textContent = '';
    var mk = $('#mkeys'); if (mk) mk.hidden = !(m && !m.solved);
    $('#inp').placeholder = m && !m.solved ? 'Your answer, e.g. 4(3x^2+1)^3' : 'Ask a question…';
  }
  function closeness(f, p) {
    if (same(f, p.fn)) return 100;
    if (p.close.some(function (c) { return same(f, c.fn); })) return 62;
    var es = [];
    for (var i = 0; i < PTS.length; i++) {
      var a = f(PTS[i]), b = p.fn(PTS[i]);
      if (!isFinite(a) || !isFinite(b)) return 8;
      es.push(Math.abs(a - b) / (Math.abs(b) + 1e-9));
    }
    es.sort(function (x, y) { return x - y; });
    return Math.max(5, Math.round(85 * Math.exp(-3 * es[2])));
  }
  function heatWord(sc) { return sc >= 100 ? 'Solved' : sc >= 75 ? 'Hot' : sc >= 50 ? 'Warm' : sc >= 25 ? 'Cool' : 'Cold'; }
  function renderHeat(m) {
    var el = $('#heat');
    if (!el) return;
    if (!m || m.check) { el.hidden = true; return; }
    el.hidden = false;
    var p = heatParts(m); el.className = p.cls; el.innerHTML = p.html;
  }
  function heatParts(m) {
    var hs = m.heat || [], sc = m.solved ? 100 : hs.length ? hs[hs.length - 1] : null, note;
    if (sc === null) note = 'Make an attempt to see how close you are.';
    else if (m.solved) note = 'You got there.';
    else if (hs.length > 1) { var d = hs[hs.length - 1] - hs[hs.length - 2]; note = d > 5 ? 'Warmer than your last try.' : d < -5 ? 'Colder than your last try.' : 'About the same as your last try.'; }
    else note = 'First try. Keep going.';
    return { cls: 'heat' + (sc === null ? ' none' : ''), html: '<div class="hrow"><span>How close is your answer?</span><span class="hword">' + (sc === null ? 'No attempt yet' : heatWord(sc)) + '</span></div>' +
      '<div class="htrack" role="meter" aria-label="How close your answer is" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + (sc === null ? 0 : sc) + '" aria-valuetext="' + (sc === null ? 'No attempt yet' : heatWord(sc)) + '">' +
      (sc === null ? '' : '<span class="hmark" style="left:' + sc + '%"></span>') + '</div>' +
      '<div class="hends"><span>Cold</span><span>' + esc(note) + '</span><span>Hot</span></div>' };
  }

  /* ---------------- posting (with a short typing indicator) ---------------- */
  function plain(m) {
    return (m.title ? m.title + '. ' : '') + (m.strong ? m.strong + '. ' : '') + (m.text || '') + ' ' + (m.sents ? m.sents.map(function (x) { return x.t; }).join(' ') : '') + ' ' + (m.result ? m.result.line : '');
  }
  function deliver(ch, m) { ch.msgs.push(m); if (m.r === 'ai') announce(plain(m)); }
  function pump() {
    if (qbusy || !Q.length) return;
    qbusy = true;
    setTimeout(function () {
      var it = Q.shift(); qbusy = false;
      if (!it) return;
      deliver(it.ch, it.m);
      if (it.ch === chat()) renderMsgs(); else renderChatbar();
      pump();
    }, DELAY);
  }
  function post(m) {
    var ch = chat();
    if (m.r !== 'ai' || !DELAY) { deliver(ch, m); renderMsgs(); return; }
    Q.push({ ch: ch, m: m }); renderMsgs(); pump();
  }
  function flush() { while (Q.length) { var it = Q.shift(); deliver(it.ch, it.m); } qbusy = false; renderMsgs(); }
  function userSay(t, attempt) { chat().msgs.push({ r: 'user', text: t, attempt: !!attempt }); }

  /* ---------------- practice ---------------- */
  function startProblem(pid) {
    if (!hasMaterial()) { post({ r: 'ai', text: 'Add your course material first, so I can start from your slides.', acts: [{ label: 'Add course material', act: 'upload', dark: true }] }); return; }
    var p = PROBLEMS[pid], ch = chat(), rating = C.ratings[p.topic], cl = policyCell(rating, p.difficulty);
    ch.mode = { pid: pid, topic: p.topic, level: 0, used: [], fails: 0, solved: false, ok4: false, sawSol: false, check: !!p.check, cell: cl, band: bandOf(rating), heat: [], helps: [], fb: null, input: '', result: null, confirm4: false };
    if (ch.topics.indexOf(p.topic) < 0) ch.topics.push(p.topic);
    if (/^(Getting started|New chat)$/.test(ch.title)) ch.title = p.name + (p.check ? ' check' : '');
    var intro;
    if (p.check) intro = 'This is a short check with no hints. If you solve it, this topic gets a mark for solved on your own. Write your answer below.';
    else {
      intro = 'Try it yourself first. Write your attempt below. ' + (rating == null ? 'You have not rated this topic yet, so ' : 'You rated this topic ' + fmt(rating) + ' of 10, so ') +
        (cl.startLevel ? 'after a wrong try I will start with ' + (cl.startLevel === 1 ? 'a hint' : 'the ' + LV[cl.startLevel - 1].toLowerCase()) + '.' : 'I will wait until you ask for help.');
    }
    post({ r: 'ai', kick: p.check ? 'Check' : 'Problem', strong: p.text, text: intro });
    renderLeft(); setFocus(true);
  }
  function help(lv) {
    var ch = chat(), m = ch.mode; if (!m || m.solved || m.check) return;
    var p = PROBLEMS[m.pid], cl = m.cell;
    if (lv === 4 && !m.ok4 && m.fails < cl.attemptsBeforeSolution) {
      var left = cl.attemptsBeforeSolution - m.fails;
      m.confirm4 = true;       post({ r: 'ai', text: 'Want the full solution now? You usually learn more if you try ' + (left === 1 ? 'one more time' : 'a couple more times') + ' first. You can still see it whenever you choose.', acts: [{ label: 'Show the solution anyway', act: 'ok4' }, { label: 'I’ll try again', act: 'focus', dark: true }] });
      return;
    }
    m.confirm4 = false; m.level = Math.max(m.level, lv); C.stats.level = Math.max(C.stats.level, lv);
    if (m.used.indexOf(lv) < 0) m.used.push(lv);
    if (lv === 4) m.sawSol = true;
    var h = p.hints[lv - 1], nx = nextLevelOf(m), acts = null;
    if (lv === 4) acts = [{ label: 'Try it myself again', act: 'retry', dark: true }, { label: 'Try another problem', act: 'practice', arg: p.next }];
    else if (nx) acts = [{ label: 'Next: ' + LV[nx - 1], act: 'next', arg: nx }];
    m.helps.push({ lv: lv, sents: h.s, more: h.more, moreOpen: false });     post({ r: 'ai', kick: 'AI note', title: LV[lv - 1], sents: h.s, more: h.more, help: { lv: lv, levels: m.cell.levels.slice() }, acts: acts });
  }
  function resultLine(m) {
    if (m.check) return 'Solved on your own, with no help.';
    var u = m.used;
    if (!u.length) return 'Solved with no help. You did every step yourself.';
    if (m.sawSol) return 'Solved after seeing the solution. Try the check below to see if it stuck.';
    if (u.indexOf(3) > -1) return 'Solved after an example. You applied it to this problem yourself.';
    return 'Solved with ' + u.length + (u.length === 1 ? ' hint' : ' hints') + ', you did the main step yourself.';
  }
  function applyMastery(m) {
    var old = C.ratings[m.topic], base = old == null ? 0 : old;
    var d = m.check ? 1 : m.sawSol ? 0 : !m.used.length ? 2 : 1;
    var nv = Math.max(0, Math.min(10, base + d));
    if (C.start[m.topic] == null) C.start[m.topic] = base;
    C.ratings[m.topic] = nv; C.last[m.topic] = nv - base; C.pulse[m.topic] = true;
    if (m.check) C.own[m.topic] = true;
    if (!m.check) C.streak = m.used.length ? 0 : C.streak + 1;
    C.log.push({ pid: m.pid, topic: m.topic, hints: m.used.length, sawSol: m.sawSol, check: !!m.check });
    return { from: base, to: nv, d: nv - base };
  }
  function solve(m, p) {
    m.solved = true; C.stats.solved++;
    var line = resultLine(m), r = applyMastery(m), name = TOPIC_DEFS[m.topic].name;
    chat().last = line;
    var sub = r.d > 0 ? 'Your rating for ' + name + ' moved from ' + fmt(r.from) + ' to ' + fmt(r.to) + ' of 10.' : 'Your rating for ' + name + ' stays at ' + fmt(r.to) + ' of 10.';
    if (m.check) sub += ' This topic now has the mark solved on your own.';
    var acts = [];
    if (!m.check && p.similar) acts.push({ label: 'Check: a similar problem, no help', act: 'check', arg: p.similar, dark: true });
    acts.push({ label: 'Try another problem', act: 'practice', arg: p.next });
    acts.push({ label: 'Rate my knowledge', act: 'rate1', arg: m.topic });
    renderLeft(); renderTop();
    post({ r: 'ai', title: 'Correct', sents: [T('d', p.slide, p.doneP, p.done)], result: { line: line, sub: sub }, acts: acts });
  }
  function attempt(text, f) {
    var ch = chat(), m = ch.mode, p = PROBLEMS[m.pid], cl = m.cell;
    C.stats.attempts++;
    userSay(text, true);
    m.heat.push(closeness(f, p));
    if (same(f, p.fn)) { solve(m, p); return; }
    m.fails++;
    var close = p.close.filter(function (c) { return same(f, c.fn); })[0];
    var head = 'Not quite yet' + (close ? ', but you are close.' : '.') + (close ? ' ' + close.msg : '');
    m.input = '';
    if (m.check) { m.fb = { kind: close ? 'close' : 'wrong', text: head + ' This is a check, so there are no hints.' }; post({ r: 'ai', text: head + ' This is a check, so there are no hints. Try again when you are ready.', acts: [{ label: 'Stop the check', act: 'stopcheck' }] }); return; }
    m.fb = { kind: close ? 'close' : 'wrong', text: head };
    if (m.level === 0 && cl.startLevel > 0) { post({ r: 'ai', text: head }); help(cl.startLevel); return; }
    var nx = nextLevelOf(m), ready = !!nx && m.fails >= cl.offerNextAfter;
        post({ r: 'ai', text: head + (nx ? (ready ? ' You have tried a few times, so the next step is ready if you want it.' : ' You can try again, or ask for the next level.') : ' You can try again.'),
      acts: nx ? [{ label: nx === 1 ? 'Give me a hint' : 'Next: ' + LV[nx - 1], act: 'next', arg: nx, dark: ready }] : null });
  }
  function answer(q) {
    var t = q.toLowerCase(), mat = hasMaterial(), r, up = false;
    if (mat && /practice|exercise|problem/.test(t)) { post({ r: 'ai', text: 'Which problem would you like to try?', acts: [{ label: 'Chain rule problem', act: 'practice', arg: 'p1', dark: true }, { label: 'Product rule problem', act: 'practice', arg: 'p2' }] }); return; }
    if (mat && C.pdfDemo && (r = pdfAnswer(t))) { }
    else if (!mat) { r = { s: [T('g', null, null, 'I do not have your course material yet, so this is general knowledge.')], note: 'Add your slides and I can point to them.' }; up = true; }
    else if (/root|sqrt/.test(t)) r = { s: [T('g', null, null, 'Yes. Write the root as a power, such as (3x² + 1)^(1/2).'), T('d', 12, 1, 'Then apply y′ = f′(g(x)) · g′(x) in the same way.')], note: 'Your slides cover whole-number powers only, so step 1 is not in them.' };
    else if (/quiz|exam|test|midterm/.test(t)) r = { s: [T('g', null, null, 'I can only see your slides, and they do not say what the quiz covers.'), T('g', null, null, 'Chain rule questions are common, but that is a guess.')], note: 'Ask your instructor what the quiz covers.' };
    else if (/chain/.test(t)) r = { s: [T('s', 12, 0, 'The chain rule is for a function inside another function.'), T('s', 12, 2, 'Differentiate the outside, keep the inside as it is, then multiply by the derivative of the inside.')] };
    else if (/product|quotient/.test(t)) r = { s: [T('s', 11, 0, 'Product rule: (f · g)′ = f′ · g + f · g′.'), T('s', 11, 1, 'Quotient rule: (f / g)′ = (f′ · g − f · g′) / g².')] };
    else if (/power|basic|sum/.test(t)) r = { s: [T('s', 10, 0, 'Power rule: d/dx xⁿ = n · xⁿ⁻¹.'), T('s', 10, 1, 'A constant multiple stays in front.'), T('s', 10, 2, 'The derivative of a sum is the sum of the derivatives.')] };
    else if (/tangent/.test(t)) r = { s: [T('s', 20, 1, 'The tangent line to f at x = a is y = f(a) + f′(a)(x − a).'), T('s', 20, 2, 'Its slope is the derivative f′(a).')] };
    else if (/maxim|minim|optimi/.test(t)) r = { s: [T('s', 21, 0, 'Maxima and minima occur where f′(x) = 0 or where f′ is undefined.'), T('s', 21, 1, 'Check the sign of f′ on both sides, or use the second derivative.')] };
    else r = { s: [T('g', null, null, 'I could not find this in your material, so I can only give a general answer.')], note: 'Try asking about one of the topics on the left.' };
    var note = r.note, dg = false;
    r.s = r.s.map(function (x) { if (x.slide && !hasSlideFile(x.slide)) { dg = true; return T('g', null, null, x.t); } return x; });
    if (dg) { note = 'This topic is not in your current material. Add the lecture to get an answer I can point to.'; up = true; }
    post({ r: 'ai', sents: r.s, note: note, q: q, acts: up ? [{ label: 'Add course material', act: 'upload', dark: true }] : null });
  }
  function send() {
    var inp = $('#inp'), text = inp.value.trim();
    if (!text) { $('#hintline').textContent = 'Write something first.'; return; }
    if (Q.length || realWait) { $('#hintline').textContent = 'One moment, the AI is still writing.'; return; }
    inp.value = '';
    var m = chat().mode;
    if (m && !m.solved) {
      var f = parseFn(text);
      if (f) { attempt(text, f); return; }
    }
    userSay(text);
    if (REAL) realAsk(text); else answer(text);
  }

  /* ---------------- files (demo: the upload area only offers example files) ---------------- */
  function addFile(def) {
    if (C.files.some(function (f) { return f.defId === def.id; })) return;
    var f = { id: 'f' + C.nid++, defId: def.id, name: def.name, short: def.short, mb: def.mb, pages: def.pages, kind: def.kind, preview: def.preview, slides: def.slides, topics: def.topics, status: 'uploading', pct: 0 };
    C.files.push(f); renderLeft();
    var c = C;
    (function tick() {
      if (c.files.indexOf(f) < 0) return;
      f.pct += 14 + Math.round(Math.random() * 16);
      if (f.pct >= 100) {
        f.pct = 100; f.status = 'added';
        if (c === C) { renderLeft(); if (!C.active || f.kind === 'lecture' || f.kind === 'scan') openFile(f.id, null, null, true); else renderViewer(); toast(def.short + ' added.'); }
        afterAdd(c, f); return;
      }
      if (c === C) renderLeft();
      c.timers.push(setTimeout(tick, 150));
    })();
  }
  function afterAdd(c, f) {
    c.loading++; if (c === C) renderLeft();
    c.timers.push(setTimeout(function () {
      c.loading--;
      var had = c.topics.length;
      var fr = (f.topics || []).filter(function (id) { return !c.topics.some(function (t) { return t.id === id; }); }).map(function (id) { return TOPIC_DEFS[id]; });
      c.topics = c.topics.concat(fr);
      var d = defById(f.defId), msgs = c.chats[0].msgs;
      if (f.kind === 'lecture') {
        if (!had) msgs.push({ r: 'ai', text: 'I found ' + fr.length + ' topics.', acts: [{ label: 'Rate my knowledge', act: 'assess', dark: true }, { label: 'Practice the chain rule', act: 'practice', arg: 'p1' }, { label: 'Practice the product rule', act: 'practice', arg: 'p2' }] });
        else msgs.push({ r: 'ai', text: 'I found ' + fr.length + ' new topics in ' + d.short + ': ' + fr.map(function (t) { return t.name; }).join(', ') + '.', acts: [{ label: 'Rate my knowledge', act: 'assess', dark: true }] });
      } else if (f.kind === 'scan') {
        c.empty = !c.topics.length;
        msgs.push({ r: 'ai', text: 'I could not find topics in that file.', acts: [{ label: 'Add another file', act: 'upload' }] });
      }
      if (c === C) { renderLeft(); renderMsgs({ keep: false }); }
    }, 1300));
  }

  /* ---------------- modals ---------------- */
  var lastFocus = null;
  function setInert(on) { ['#app', '#intro'].forEach(function (s) { var e = $(s); if (e) { if (on) e.setAttribute('inert', ''); else e.removeAttribute('inert'); } }); }
  function closeModal() {
    var ov = $('#ov'); if (!ov) return;
    var done = function () { var o = $('#ov'); if (o && o.classList.contains('out')) $('#modal-root').innerHTML = ''; setInert(false); if (lastFocus && document.body.contains(lastFocus)) lastFocus.focus(); };
    ov.classList.add('out');
    if (INSTANT) done(); else setTimeout(done, 150);
  }
  function modal(html) {
    lastFocus = document.activeElement;
    $('#modal-root').innerHTML = '<div class="overlay" id="ov"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="mtitle">' + html + '</div></div>';
    setInert(true);
    var x = $('#modal-root .xbtn'); if (x) x.focus();
  }
  function openPicker() { var i = $('#file-input'); if (i) i.click(); }
  function ticksHtml() { var s = ''; for (var i = 0; i <= 10; i++) s += '<span>' + i + '</span>'; return '<div class="ticks">' + s + '</div>'; }
  function openAssess(only) {
    var topics = only ? C.topics.filter(function (t) { return t.id === only; }) : C.topics;
    if (!topics.length) { post({ r: 'ai', text: 'Add your course material first. Then I can show the topics I found and you can rate them.', acts: [{ label: 'Add course material', act: 'upload', dark: true }] }); return; }
    var h = '<div class="mhead"><div><h2 id="mtitle">' + (only ? 'How confident do you feel now?' : 'What do you already know?') + '</h2><p class="lead">Drag the slider for each topic, from 0 to 10, so the help starts at the right level. You can change it later.</p></div><button class="xbtn" id="m-x" aria-label="Close">×</button></div>';
    h += '<div class="legend"><span>0 = never seen it</span><span>10 = could explain it to someone</span></div><div class="list">';
    h += topics.map(function (t) {
      var r = C.ratings[t.id];
      return '<div class="lrow"><div class="nm">' + esc(t.name) + '</div><div class="sl"><input type="range" min="0" max="10" step="1" value="' + (r == null ? 0 : Math.round(r)) + '" data-rt="' + t.id + '" class="' + (r == null ? 'untouched' : '') + '" aria-label="' + esc(t.name) + '">' + ticksHtml() + '</div><div class="rd" id="rd-' + t.id + '">' + (r == null ? '–' : Math.round(r)) + '</div></div>';
    }).join('') + '</div>';
    if (!only) h += '<div style="margin-top:16px"><span class="h">Anything else you already know? (optional)</span><div class="tags" id="tags"></div></div>';
    h += '<div class="mfoot"><span class="fine">' + (only ? 'Your answer updates the topic bar.' : 'Your answers only set the starting point. They are never graded.') + '</span><button class="btn ghost" id="m-skip">Skip for now</button><button class="btn dark" id="m-save">' + (only ? 'Save' : 'Save and continue') + '</button></div>';
    modal(h);
    $$('#modal-root input[type=range]').forEach(function (r) { r.style.setProperty('--p', (r.value * 10) + '%'); });
    if (!only) renderTags();
  }
  function renderTags() {
    var box = $('#tags'); if (!box) return;
    box.innerHTML = C.tags.map(function (t, i) { return '<span class="chip">' + esc(t) + '<button data-tagx="' + i + '" aria-label="Remove ' + esc(t) + '">×</button></span>'; }).join('') + '<input id="taginp" placeholder="Type and press Enter to add…" aria-label="Add something you know">';
  }
  function openWhy(m) {
    var all = m.sents.concat(m.moreOpen && m.more ? m.more : []), mt = matchOf(all);
    var rows = all.map(function (x) {
      var link = (x.k !== 'g' && x.slide && hasSlideFile(x.slide)) ? ' <button class="link" data-evid="' + x.slide + '|' + x.p + '|' + x.k + '" data-evt="' + esc(x.t) + '"' + (x.q ? ' data-evq="' + esc(x.q) + '"' : '') + '>Show in slide ' + String(x.slide).replace('P', '') + '</button>' : '';
      return '<li><span class="tlabel ' + x.k + '">' + KIND_LABEL[x.k] + '</span>' + esc(x.t) + link + '</li>';
    }).join('');
    modal('<div class="mhead"><div><h2 id="mtitle">Why this match?</h2><p class="lead">Every sentence is checked against the slides you added. This is a read-only summary, not a score you set.</p></div><button class="xbtn" id="m-x" aria-label="Close">×</button></div>' +
      '<div class="two"><div class="card"><div class="row" style="gap:10px"><span class="match m-' + mt + '"><span class="m3" aria-hidden="true"><i></i><i></i><i></i></span>Source match: <b>' + MATCH_NAME[mt] + '</b></span></div>' +
      '<p style="margin:8px 0 0">' + esc(matchReason(all)) + '</p><ul class="sl">' + rows + '</ul><div class="advice">' + esc(MATCH_ADVICE[mt]) + '</div></div>' +
      '<div class="card"><div class="h">What the styles mean</div><div class="lg" style="flex-direction:column;gap:10px;font-size:13px;margin-top:10px;color:var(--ink)"><span><i class="sw s"></i>From your slides. Solid underline.</span><span><i class="sw d"></i>Derived from your slides. Dashed underline.</span><span><i class="sw g"></i>General knowledge, not in your slides. Outlined.</span></div></div></div>' +
      '<div class="fine" style="margin-top:14px">Source matches in this prototype are scripted. In a real product they would come from comparing each sentence with the course material.</div>');
  }

  /* ---------------- events ---------------- */
  document.addEventListener('click', function (e) {
    var t = e.target, o;
    if ((o = t.closest('[data-undo]'))) { var uid = o.getAttribute('data-undo'); if (undos[uid]) undos[uid](); dismissToast(uid); return; }
    if (t.closest('[data-vtoggle]')) { S.vmin = !S.vmin; renderViewer(); return; }
    if ((o = t.closest('[data-side]'))) { S.side = S.side ? null : 'all'; renderLeft(); return; }
    if ((o = t.closest('[data-sbt]'))) { var sk = o.getAttribute('data-sbt'); S.sbc = S.sbc || {}; S.sbc[sk] = !S.sbc[sk]; renderLeft(); return; }
    if (t.closest('[data-addfiles]')) { openPicker(); return; }
    if ((o = t.closest('[data-close]'))) {
      var id = o.getAttribute('data-close'), prevTabs = C.tabs.slice(), prevActive = C.active, cc = C, f0 = fileById(id);
      C.tabs = C.tabs.filter(function (x) { return x !== id; }); if (C.active === id) C.active = C.tabs[C.tabs.length - 1] || null;
      renderLeft(); renderViewer();
      toast((f0 ? f0.short || f0.name : 'Tab') + ' closed. The file is still in your material.', function () { cc.tabs = prevTabs; cc.active = prevActive; if (cc === C) { renderLeft(); renderViewer(); } });
      return;
    }
    if ((o = t.closest('[data-tab]'))) { C.active = o.getAttribute('data-tab'); renderLeft(); renderViewer(); return; }
    if ((o = t.closest('[data-open]'))) { var f = fileById(o.getAttribute('data-open')); if (f && f.status === 'added') openFile(f.id); return; }
    if ((o = t.closest('[data-retry]'))) { var rid = o.getAttribute('data-retry'); C.files = C.files.filter(function (x) { return x.id !== rid; }); renderLeft(); return; }
    if ((o = t.closest('[data-topic]'))) { var tid = o.getAttribute('data-topic'); var tf = C.files.filter(function (x) { return x.status === 'added' && x.topics.indexOf(tid) > -1; })[0]; if (tf) openFile(tf.id, TOPIC_DEFS[tid] && TOPIC_DEFS[tid].slide, null); return; }
    if ((o = t.closest('[data-chat]'))) { C.chat = +o.getAttribute('data-chat'); renderLeft(); renderMsgs(); var inp0 = $('#inp'); if (inp0 && !t.closest('#left')) inp0.focus(); return; }
    if ((o = t.closest('[data-evid]'))) {
      var v = o.getAttribute('data-evid').split('|'); if (t.closest('#modal-root')) closeModal();
      evidenceGo(o, false); return;
    }
    if ((o = t.closest('[data-clearev]'))) { C.cited = null; renderViewer(); return; }
    if ((o = t.closest('[data-nav]'))) { var fa = fileById(C.active); if (fa) { var ni = fa.slides.indexOf(C.slide) + (+o.getAttribute('data-nav')); if (fa.slides[ni]) { C.slide = fa.slides[ni]; C.cited = null; renderViewer(); } } return; }
    if ((o = t.closest('[data-more]'))) { var mi = +o.getAttribute('data-more'); var mm0 = chat().msgs[mi]; if (mm0) { mm0.moreOpen = !mm0.moreOpen; renderMsgs({ keep: true }); var b0 = $('[data-more="' + mi + '"]'); if (b0) b0.focus(); } return; }
    if ((o = t.closest('[data-cite]'))) { var cv = o.getAttribute('data-cite'); if (/^P/.test(cv)) { var pf = fileForSlide(cv); if (pf) { C.pdfPage = +cv.slice(1); C.cited = null; openFile(pf.id, null, null, false); renderViewer(); } } else openSlide(+cv); return; }
    if ((o = t.closest('[data-why]'))) { var m = chat().msgs[+o.getAttribute('data-why')]; if (m && m.sents) openWhy(m); return; }
    if ((o = t.closest('[data-opens]'))) { var n = +o.getAttribute('data-opens'); closeModal(); openSlide(n); return; }
    if ((o = t.closest('[data-tagx]'))) { C.tags.splice(+o.getAttribute('data-tagx'), 1); renderTags(); return; }
    if ((o = t.closest('[data-act]'))) {
      var a = o.getAttribute('data-act'), arg = o.getAttribute('data-arg');
      if (a === 'assess') openAssess();
      else if (a === 'rate1') openAssess(arg);
      else if (a === 'practice' || a === 'check') startProblem(arg);
      else if (a === 'next') help(+arg);
      else if (a === 'ok4') { var m4 = chat().mode; if (m4) { m4.ok4 = true; help(4); } }
      else if (a === 'focus') $('#inp').focus();
      else if (a === 'upload') openPicker();
      else if (a === 'samples') { defsFor(S.ctx).forEach(function (d) { addFile(d); }); }
      else if (a === 'ask') { userSay(arg); answer(arg); }
      else if (a === 'retry') { var mr = chat().mode; if (mr && !mr.solved) { mr.heat = []; post({ r: 'ai', kick: 'Problem', strong: PROBLEMS[mr.pid].text, text: 'Your turn. Write your own attempt now. I will note that you saw the solution first.' }); $('#inp').focus(); } }
      else if (a === 'stopcheck') { chat().mode = null; post({ r: 'ai', text: 'Check stopped. Nothing was marked. You can try it again whenever you like.', acts: [{ label: 'Practice the chain rule', act: 'practice', arg: 'p1' }, { label: 'Practice the product rule', act: 'practice', arg: 'p2' }] }); renderLeft(); }
      else if (a === 'lecture') {
        var lf = C.files.filter(function (x) { return x.status === 'added' && x.kind === 'lecture'; })[0];
        if (lf) { openFile(lf.id); toast('Your slides do not cover this. Check the lecture itself or ask your instructor.'); } else openPicker();
      }
      return;
    }
    if (t.id === 'm-x' || t.closest('#m-x')) { closeModal(); return; }
    if (t.id === 'ov') { closeModal(); return; }
    if (t.id === 'm-skip') { closeModal(); return; }
    if (t.id === 'm-save') {
      var snap = JSON.stringify({ r: C.ratings, s: C.start }), cs0 = C;
      $$('#modal-root input[type=range]').forEach(function (r) {
        if (!r.classList.contains('untouched')) { var id2 = r.getAttribute('data-rt'), v2 = +r.value; if (C.start[id2] == null) C.start[id2] = C.ratings[id2] != null ? C.ratings[id2] : v2; C.ratings[id2] = v2; C.last[id2] = 0; }
      });
      closeModal(); renderLeft();
      toast('Ratings saved.', function () { var o2 = JSON.parse(snap); cs0.ratings = o2.r; cs0.start = o2.s; if (cs0 === C) renderLeft(); });
      post({ r: 'ai', text: 'Thanks. I will start the help at the level you set. You can change your ratings any time.', acts: [{ label: 'Practice the chain rule', act: 'practice', arg: 'p1', dark: true }, { label: 'Practice the product rule', act: 'practice', arg: 'p2' }] });
      return;
    }
    if (t.closest('#drop')) { openPicker(); return; }
    if (t.id === 'p-cancel') { closeModal(); return; }
    if (t.id === 'p-add') {
      var ids = $$('#modal-root [data-pick]:not(:disabled):checked').map(function (c) { return c.getAttribute('data-pick'); });
      closeModal(); ids.forEach(function (i2) { addFile(defById(i2)); }); return;
    }
    if ((o = t.closest('[data-pc]'))) {
      var nm = o.getAttribute('data-pc'), cs = S.profile.courses, ix = cs.indexOf(nm);
      if (ix >= 0) cs.splice(ix, 1); else { if (nm === NONE) cs.length = 0; else if ((ix = cs.indexOf(NONE)) >= 0) cs.splice(ix, 1); cs.push(nm); }
      $$('#pcs .pc').forEach(function (b) { var on = cs.indexOf(b.getAttribute('data-pc')) >= 0; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
      return;
    }
    if (t.id === 'pc-add') { addPc(); return; }
    if (t.id === 'b-profile') { S.snap = JSON.parse(JSON.stringify(S.profile)); S.editing = true; renderIntro(); return; }
    if (t.id === 'b-pcancel') { S.profile = S.snap; S.editing = false; renderIntro(); return; }
    if (t.id === 'b-start') {
      S.profile.desc = $('#prof-desc').value.trim(); S.started = true; S.editing = false;
      Object.keys(S.courses).forEach(function (k) { var c = S.courses[k]; if (!c.pdfDemo && c.chats[0].msgs.length === 1 && !c.chats[0].msgs[0].user) c.chats[0].msgs[0].text = greetText(); });
      renderAll(); return;
    }
    if (t.id === 'send') { send(); return; }
    if (t.id === 'b-addctx') { openAddCtx(); return; }
    if (t.id === 'ctx-add') { doAddCtx(); return; }
    if (t.closest('#newchat, [data-newchat]')) {
      var nc = newChat('New chat'); nc.msgs.push({ r: 'ai', text: 'What would you like to work on?', acts: [{ label: 'Practice the chain rule', act: 'practice', arg: 'p1' }, { label: 'Practice the product rule', act: 'practice', arg: 'p2' }] });
      C.chats.push(nc); C.chat = C.chats.length - 1; renderLeft(); renderMsgs(); $('#inp').focus(); return;
    }
  });
  document.addEventListener('change', function (e) {
    if (e.target.matches && e.target.matches('[data-pick]')) {
      var n = $$('#modal-root [data-pick]:not(:disabled):checked').length;
      $('#p-add').disabled = !n; $('#pick-n').textContent = n ? n + ' selected' : 'Select one or more files.';
    }
  });
  document.addEventListener('input', function (e) {
    if (e.target.id === 'pc-new') { $('#pc-add').disabled = !e.target.value.trim(); }
    if (e.target.id === 'ctx-name') { $('#ctx-add').disabled = !e.target.value.trim(); }
    var r = e.target;
    if (r.matches && r.matches('input[type=range][data-rt]')) {
      r.classList.remove('untouched'); r.style.setProperty('--p', (r.value * 10) + '%');
      var rd = $('#rd-' + r.getAttribute('data-rt')); if (rd) rd.textContent = r.value;
    }
  });
  document.addEventListener('keydown', function (e) {
    var t = e.target;
    if (e.key === 'Escape' && $('#ov')) { closeModal(); return; }
    if (e.key === 'Tab' && $('#ov')) {
      var fs = $$('#ov button:not(:disabled), #ov input:not(:disabled), #ov [href]').filter(function (x) { return x.offsetParent !== null; });
      if (fs.length) {
        var first = fs[0], last = fs[fs.length - 1];
        if (e.shiftKey && (document.activeElement === first || !$('#ov').contains(document.activeElement))) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && (document.activeElement === last || !$('#ov').contains(document.activeElement))) { e.preventDefault(); first.focus(); }
      }
      return;
    }
    if (t.id === 'inp' && e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); return; }
    if (t.id === 'pc-new' && e.key === 'Enter') { e.preventDefault(); addPc(); return; }
    if (t.id === 'ctx-name' && e.key === 'Enter') { e.preventDefault(); doAddCtx(); return; }
    if (t.id === 'taginp' && e.key === 'Enter') { e.preventDefault(); var v = t.value.trim(); if (v) { C.tags.push(v); renderTags(); $('#taginp').focus(); } return; }
    if (t.id === 'manual' && e.key === 'Enter') { e.preventDefault(); var n = t.value.trim(); if (n) { C.topics.push({ id: 'u' + (C.topics.length + 1), name: n, slide: null }); renderLeft(); var mi = $('#manual'); if (mi) mi.focus(); } return; }
  });
  /* hover or focus on a sentence shows its passage in the slides */
  var hovT = null;
  function peek(o) {
    var v = o.getAttribute('data-evid').split('|'), txt = o.getAttribute('data-evt');
    if (C.cited && String(C.cited.slide) === v[0] && String(C.cited.p) === v[1] && C.cited.text === txt && C.active) return;
    evidenceGo(o, true);
  }
  document.addEventListener('mouseover', function (e) {
    var o = e.target.closest && e.target.closest('.msgs [data-evid]'); clearTimeout(hovT);
    if (o) hovT = setTimeout(function () { peek(o); }, 220);
  });
  document.addEventListener('focusin', function (e) { var o = e.target.closest && e.target.closest('.msgs [data-evid]'); if (o) peek(o); });
  $('#ctx').addEventListener('change', function (e) { S.ctx = e.target.value; C = S.courses[S.ctx]; if (C.chats[0].msgs.length === 0) greet(C); renderAll(); });
  var dz = $('#left');
  ['dragenter', 'dragover'].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); var d = $('#drop'); if (d) d.classList.add('over'); }); });
  ['dragleave', 'drop'].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); var d = $('#drop'); if (d) d.classList.remove('over'); }); });
  dz.addEventListener('drop', function (e) { if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) addUploads(e.dataTransfer.files); });
  dz.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.id === 'drop') { e.preventDefault(); openPicker(); } });

  function renderCtx() {
    $('#ctx').innerHTML = S.ctxs.map(function (c) { return '<option value="' + c.key + '"' + (c.key === S.ctx ? ' selected' : '') + '>' + esc(c.name) + '</option>'; }).join('');
  }
  function openAddCtx() {
    modal('<div class="mhead"><div><h2 id="mtitle">Add a course context</h2><p class="lead">Each context keeps its own course material, topics and chats.</p></div><button class="xbtn" id="m-x" aria-label="Close">×</button></div>' +
      '<input class="inp" id="ctx-name" placeholder="e.g. Physics II" maxlength="40" aria-label="Course name" style="height:40px;margin-top:4px">' +
      '<div class="mfoot"><button class="btn ghost" id="p-cancel">Cancel</button><button class="btn dark" id="ctx-add" disabled>Add context</button></div>');
    $('#ctx-name').focus();
  }
  function doAddCtx() {
    var inp = $('#ctx-name'), name = inp ? inp.value.trim() : '';
    if (!name) return;
    var key = 'c' + (S.ctxs.length + 1);
    S.extraDefs[key] = [{ id: 'scan_' + key, name: name + ' – Lecture notes.pdf', short: 'Lecture notes', mb: '3.1', pages: 30, kind: 'scan', slides: [], topics: [] }];
    S.courses[key] = newCourse(); greet(S.courses[key]);
    S.ctxs.push({ key: key, name: name });
    S.ctx = key; C = S.courses[key];
    lastFocus = $('#b-addctx'); closeModal(); renderAll(); toast(name + ' added as a new context.');
  }
  function addPc() {
    var inp = $('#pc-new'), n = inp.value.trim();
    if (!n) return;
    var all = PAST.concat(S.profile.custom), dup = all.filter(function (x) { return x.toLowerCase() === n.toLowerCase(); })[0];
    if (dup) n = dup; else S.profile.custom.push(n);
    var cs = S.profile.courses, ix = cs.indexOf(NONE); if (ix >= 0) cs.splice(ix, 1);
    if (cs.indexOf(n) < 0) cs.push(n);
    S.profile.desc = $('#prof-desc').value;
    inp.value = ''; $('#pc-add').disabled = true; renderIntro(); inp.focus();
  }
  function renderIntro() {
    var ed = !!S.editing;
    $('#intro').hidden = S.started && !ed;
    $('#ititle').textContent = ed ? 'Your profile' : 'Hey, ready to study?';
    $('#isub').textContent = ed ? 'Change anything. The AI will use it from now on.' : 'Practice with help that comes only from your own course slides.';
    $('#how').hidden = ed;
    $('#b-start').textContent = ed ? 'Save changes' : 'Continue';
    $('#b-pcancel').hidden = !ed;
    $('#pcs').innerHTML = PAST.concat(S.profile.custom, [NONE]).map(function (n) { var on = S.profile.courses.indexOf(n) >= 0; return '<button type="button" class="pc' + (on ? ' on' : '') + '" data-pc="' + esc(n) + '" aria-pressed="' + on + '">' + esc(n) + '</button>'; }).join('');
    $('#prof-desc').value = S.profile.desc;
  }
  function renderAll() { renderIntro(); renderCtx(); renderLeft(); renderViewer(); renderMsgs(); renderTop(); }

