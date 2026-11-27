
  /* ---------------- graph: files and topics of this context (layout and links as in the group prototype) ----------------
     Files and topics are drawn on a circle with plain SVG lines, nothing moves. A known lecture links to its own topics.
     Topic links are fixed: Chain rule and Tangent lines build on Basic derivative rules, Optimization builds on Tangent lines.
     An uploaded PDF the prototype does not know is a node with no links. The graph replaces the document column only. */
  var TOPIC_LINKS = [['chain', 'basic'], ['tangent', 'basic'], ['optim', 'tangent']];
  function graphModel() {
    var files = C.files.filter(function (f) { return f.status === 'added'; });
    var nodes = files.map(function (f) { return { id: 'file:' + f.id, kind: 'file', name: f.name, fid: f.id }; })
      .concat(C.topics.map(function (t) { return { id: 'topic:' + t.id, kind: 'topic', name: t.name, tid: t.id }; }));
    var ids = {}; nodes.forEach(function (n) { ids[n.id] = n; });
    var edges = [];
    files.forEach(function (f) { (f.topics || []).forEach(function (tid) { if (ids['topic:' + tid]) edges.push(['file:' + f.id, 'topic:' + tid]); }); });
    TOPIC_LINKS.forEach(function (l) { if (ids['topic:' + l[0]] && ids['topic:' + l[1]]) edges.push(['topic:' + l[0], 'topic:' + l[1]]); });
    nodes.forEach(function (n, i) { var a = -Math.PI / 2 + i * 2 * Math.PI / Math.max(nodes.length, 1); n.x = 280 + Math.cos(a) * 180; n.y = 270 + Math.sin(a) * 180; });
    return { nodes: nodes, edges: edges, byId: ids };
  }
  function graphQuestionNode() {
    if (!S || !S.gNode) return null;
    var n = graphModel().byId[S.gNode];
    if (!n || n.kind !== 'topic') return null;
    if (!EXB.some(function (e) { return e.topic === n.tid; })) return null;
    return n;
  }
  function graphSelect(id) {
    S.gqBubble = null;
    S.gNode = id;
    if (STUDY !== 'free' && !graphQuestionNode()) { S.gqOn = false; S.gqBubble = null; }
    renderViewer();
  }
  function graphHead() {
    var topic = graphQuestionNode();
    var on = !!S.gqOn && !!topic;
    var qbtn = STUDY === 'free' ? '' : '<button type="button" class="btn small' + (on ? ' on' : '') + '" data-graph="questions" aria-pressed="' + (on ? 'true' : 'false') + '"' + (topic ? '' : ' disabled title="Select a topic first"') + '>Graph question</button>';
    return '<div class="vhead"><div class="tabs"><div class="tab on"><span class="tabb">Graph</span></div></div><div class="vtools">' +
      qbtn +
      '<button type="button" class="btn small" data-graph="close">Close graph</button></div></div>';
  }
  /* A study link opens one module and leaves the other one out. */
  function openStudyModule() {
    if (!STUDY || !S || !S.started) return;
    if (STUDY === 'optimized') {
      S.gqOn = false;
      if (!S.exOn) exOpen();
      return;
    }
    S.gqOn = true;
    if (S.exOn) exExit();
    if (!S.gOn) graphToggle(true);
    else { renderViewer(); renderTop(); }
  }
  function chainBubbleById(id) {
    for (var i = 0; i < CHAIN_BUBBLES.length; i++) if (CHAIN_BUBBLES[i].id === id) return CHAIN_BUBBLES[i];
    return null;
  }
  /* How many questions from the start of this bubble are already done. The next index is the one that opens. */
  function chainDoneCount(b) {
    var done = S.gqDone || {}, n = 0;
    while (n < b.ids.length && done[b.ids[n]]) n++;
    return n;
  }
  function chainAskAllowed(qid) {
    for (var i = 0; i < CHAIN_BUBBLES.length; i++) {
      var at = CHAIN_BUBBLES[i].ids.indexOf(qid);
      if (at < 0) continue;
      return at <= chainDoneCount(CHAIN_BUBBLES[i]);
    }
    return true;
  }
  function chainBubblesHtml() {
    return '<div class="gqbubbles">' + CHAIN_BUBBLES.map(function (b) {
      var n = chainDoneCount(b), label = n >= b.ids.length ? b.ids.length + ' of ' + b.ids.length : 'q' + (n + 1) + ' of ' + b.ids.length;
      return '<button type="button" class="gqbubble" data-graph="bubble" data-bid="' + b.id + '"><b>' + esc(b.name) + '</b><span>' + esc(b.note) + '</span><span class="gqmeta">' + label + '</span></button>';
    }).join('') + '</div>';
  }
  function chainBubbleList(id) {
    var b = chainBubbleById(id);
    if (!b) return chainBubblesHtml();
    var n = chainDoneCount(b);
    var rows = b.ids.map(function (qid, i) {
      var e = xById(qid);
      if (!e) return '';
      var state = i < n ? 'done' : i === n ? 'next' : 'locked';
      var btn = state === 'locked'
        ? '<button type="button" class="btn small" disabled>Locked</button>'
        : '<button type="button" class="btn small' + (state === 'done' ? '' : ' dark') + '" data-graph="ask" data-qid="' + esc(e.id) + '">' + (state === 'done' ? 'Do again' : 'Do this') + '</button>';
      return '<div class="gqitem ' + state + '" role="listitem"><span class="gqnum">q' + (i + 1) + '</span><p>' + esc(e.q) + '</p><span class="gqmeta">2 min' + (state === 'done' ? ' · done' : '') + '</span>' + btn + '</div>';
    }).join('');
    return '<div class="gqback"><button type="button" class="btn small" data-graph="bubbles">All types</button></div><div class="gqlist ordered" role="list" aria-label="' + esc(b.name) + ', questions in order">' + rows + '</div>';
  }
  /* Questions of one topic, easiest first. Chain rule uses the bubbles above instead. */
  function graphQuestionList(tid) {
    var list = EXB.filter(function (e) { return e.topic === tid; }).slice().sort(function (a, b) { return a.d - b.d || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0); });
    if (!list.length) return '<p class="gcap">No questions for this topic yet.</p>';
    var done = S.gqDone || {};
    return '<div class="gqlist" role="list" aria-label="Questions you can choose">' + list.map(function (e) {
      var was = done[e.id];
      return '<div class="gqitem' + (was ? ' done' : '') + '" role="listitem"><p>' + esc(e.q) + '</p><span class="gqmeta">2 min' + (was ? ' · done' : '') + '</span><button type="button" class="btn small' + (was ? '' : ' dark') + '" data-graph="ask" data-qid="' + esc(e.id) + '">' + (was ? 'Do again' : 'Do this') + '</button></div>';
    }).join('') + '</div>';
  }
  function graphHtml() {
    var head = graphHead();
    if (!C.files.some(function (f) { return f.status === 'added'; })) return head + '<div class="empty-v"><div>Add course material to see how the topics connect.</div></div>';
    var g = graphModel(), sel = S.gNode, hot = {};
    if (sel) { hot[sel] = 1; g.edges.forEach(function (e) { if (e[0] === sel) hot[e[1]] = 1; if (e[1] === sel) hot[e[0]] = 1; }); }
    var lines = g.edges.map(function (e) { var a = g.byId[e[0]], b = g.byId[e[1]], h = sel && (e[0] === sel || e[1] === sel); return '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" class="gline' + (h ? ' hot' : '') + '"/>'; }).join('');
    var circles = g.nodes.map(function (n) {
      var lit = !sel || hot[n.id], label = n.kind === 'file' ? (n.name.length > 26 ? n.name.slice(0, 24) + '…' : n.name) : n.name;
      return '<g class="ghit' + (lit ? '' : ' dim') + (n.id === sel ? ' sel' : '') + '" tabindex="0" role="button" data-gnode="' + esc(n.id) + '" aria-label="' + esc(n.name) + (n.kind === 'file' ? ', file' : ', topic') + '"><circle class="gnode ' + n.kind + '" cx="' + n.x + '" cy="' + n.y + '" r="' + (n.kind === 'file' ? 18 : 14) + '"/><text class="glab" x="' + n.x + '" y="' + (n.y + 34) + '" text-anchor="middle">' + esc(label) + '</text></g>';
    }).join('');
    var sn = sel ? g.byId[sel] : null, cap = S.gqOn ? 'Graph question is on. Click a topic, then pick any question of that type.' : 'Click a node to see what it connects to.';
    var list = '';
    if (sn) {
      var r = sn.tid ? C.ratings[sn.tid] : null;
      cap = '<b>' + esc(sn.name) + '</b>' + (sn.kind === 'topic' ? ' · ' + (r == null ? 'not rated' : 'rated ' + fmt(r) + '/10') : ' · file') + (sn.kind === 'file' ? ' <button class="btn small" data-graph="open" data-fid="' + sn.fid + '">Open file</button>' : '');
      if (S.gqOn && sn.kind === 'topic' && sn.tid === 'chain') {
        var bub = S.gqBubble && chainBubbleById(S.gqBubble);
        cap += bub ? ' · ' + esc(bub.name) : ' · choose a type';
        list = bub ? chainBubbleList(bub.id) : chainBubblesHtml();
      } else if (S.gqOn && sn.kind === 'topic') { cap += ' · pick any question'; list = graphQuestionList(sn.tid); }
    }
    return head + '<div class="gwrap' + (list ? ' asking' : '') + '"><svg class="gsvg" viewBox="0 0 560 560" role="img" aria-label="' + (S.gqOn ? 'Graph of files and topics, question choice on' : 'Graph of files and topics') + '">' + lines + circles + '</svg><div class="gkey"><span><i class="gdot gdf"></i>File</span><span><i class="gdot gdt"></i>Topic</span></div><p class="gcap" role="status">' + cap + '</p>' + list + '</div>';
  }
  function graphToggle(on) {
    if (STUDY === 'optimized') return;
    S.gOn = on === undefined ? !S.gOn : !!on; S.gNode = null;
    if (STUDY === 'free') S.gqOn = true;
    var b = $('#b-graph'); if (b) { b.setAttribute('aria-pressed', !!S.gOn); b.classList.toggle('on', !!S.gOn); }
    if (S.gOn && S.exOn) exExit();
    renderViewer();
  }
  document.addEventListener('click', function (e) {
    var t = e.target; if (!t.closest) return; var o;
    if (t.closest('#b-graph')) { if (STUDY === 'optimized') return; graphToggle(); return; }
    if ((o = t.closest('[data-gnode]'))) { graphSelect(o.getAttribute('data-gnode')); return; }
    if ((o = t.closest('[data-graph]'))) {
      var a = o.getAttribute('data-graph');
      if (a === 'close') graphToggle(false);
      else if (a === 'open') { var fid = o.getAttribute('data-fid'); graphToggle(false); openFile(fid); }
      else if (a === 'questions') { if (STUDY === 'free' || !graphQuestionNode()) return; S.gqOn = !S.gqOn; if (!S.gqOn) S.gqBubble = null; renderViewer(); announce(S.gqOn ? 'Graph question is on. Choose your own questions.' : 'Graph question is off. The graph is files and topics only.'); }
      else if (a === 'bubble') { S.gqBubble = o.getAttribute('data-bid'); renderViewer(); }
      else if (a === 'bubbles') { S.gqBubble = null; renderViewer(); }
      else if (a === 'ask') { var qid = o.getAttribute('data-qid'); if (chainAskAllowed(qid)) exStartFree(qid); }
    }
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.getAttribute && e.target.getAttribute('data-gnode')) { e.preventDefault(); graphSelect(e.target.getAttribute('data-gnode')); }
  });
