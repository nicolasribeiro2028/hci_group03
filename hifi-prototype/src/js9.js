
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
  function graphHtml() {
    var head = '<div class="vhead"><div class="tabs"><div class="tab on"><span class="tabb">Graph</span></div></div><div class="vtools"><button type="button" class="btn small" data-graph="close">Close graph</button></div></div>';
    if (!C.files.some(function (f) { return f.status === 'added'; })) return head + '<div class="empty-v"><div>Add course material to see how the topics connect.</div></div>';
    var g = graphModel(), sel = S.gNode, hot = {};
    if (sel) { hot[sel] = 1; g.edges.forEach(function (e) { if (e[0] === sel) hot[e[1]] = 1; if (e[1] === sel) hot[e[0]] = 1; }); }
    var lines = g.edges.map(function (e) { var a = g.byId[e[0]], b = g.byId[e[1]], h = sel && (e[0] === sel || e[1] === sel); return '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" class="gline' + (h ? ' hot' : '') + '"/>'; }).join('');
    var circles = g.nodes.map(function (n) {
      var lit = !sel || hot[n.id], label = n.kind === 'file' ? (n.name.length > 26 ? n.name.slice(0, 24) + '…' : n.name) : n.name;
      return '<g class="ghit' + (lit ? '' : ' dim') + (n.id === sel ? ' sel' : '') + '" tabindex="0" role="button" data-gnode="' + esc(n.id) + '" aria-label="' + esc(n.name) + (n.kind === 'file' ? ', file' : ', topic') + '"><circle class="gnode ' + n.kind + '" cx="' + n.x + '" cy="' + n.y + '" r="' + (n.kind === 'file' ? 18 : 14) + '"/><text class="glab" x="' + n.x + '" y="' + (n.y + 34) + '" text-anchor="middle">' + esc(label) + '</text></g>';
    }).join('');
    var sn = sel ? g.byId[sel] : null, cap = 'Click a node to see what it connects to.';
    if (sn) {
      var r = sn.tid ? C.ratings[sn.tid] : null;
      cap = '<b>' + esc(sn.name) + '</b>' + (sn.kind === 'topic' ? ' · ' + (r == null ? 'not rated' : 'rated ' + fmt(r) + '/10') : ' · file') + (sn.kind === 'file' ? ' <button class="btn small" data-graph="open" data-fid="' + sn.fid + '">Open file</button>' : '');
    }
    return head + '<div class="gwrap"><svg class="gsvg" viewBox="0 0 560 560" role="img" aria-label="Graph of files and topics">' + lines + circles + '</svg><div class="gkey"><span><i class="gnode file"></i>File</span><span><i class="gnode topic"></i>Topic</span></div><p class="gcap" role="status">' + cap + '</p></div>';
  }
  function graphToggle(on) {
    S.gOn = on === undefined ? !S.gOn : !!on; S.gNode = null;
    var b = $('#b-graph'); if (b) { b.setAttribute('aria-pressed', !!S.gOn); b.classList.toggle('on', !!S.gOn); }
    if (S.gOn && S.exOn) exExit();
    renderViewer();
  }
  document.addEventListener('click', function (e) {
    var t = e.target; if (!t.closest) return; var o;
    if (t.closest('#b-graph')) { graphToggle(); return; }
    if ((o = t.closest('[data-gnode]'))) { S.gNode = o.getAttribute('data-gnode'); renderViewer(); return; }
    if ((o = t.closest('[data-graph]'))) {
      var a = o.getAttribute('data-graph');
      if (a === 'close') graphToggle(false);
      else if (a === 'open') { var fid = o.getAttribute('data-fid'); graphToggle(false); openFile(fid); }
    }
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.getAttribute && e.target.getAttribute('data-gnode')) { e.preventDefault(); S.gNode = e.target.getAttribute('data-gnode'); renderViewer(); }
  });
