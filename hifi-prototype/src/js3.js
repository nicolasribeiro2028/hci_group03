
  /* ---------------- workspace layout: sidebar, dockable slides, exercise focus ----------------
     Sidebar views (Chats, Material, Self-assess) sit behind an icon bar. The slides panel can be dragged
     wider, docked right or bottom, or hidden. Starting an exercise gives the chat the whole width. */
  var saved = null;
  $('#b-addctx').innerHTML = UI.plus; $('#b-slides').innerHTML = UI.slides; $('#b-profile').innerHTML = UI.user; $('#send').innerHTML = UI.send;
  var MK = [['x', 'x'], ['x<sup>2</sup>', '^2'], ['x<sup>n</sup>', '^'], ['(', '('], [')', ')'], ['×', '*'], ['÷', '/']];
  $('#mkeys').innerHTML = MK.map(function (k) {
    return '<button type="button" class="mk" data-mk="' + k[1] + '" aria-label="Insert ' + (k[1] === '^2' ? 'squared' : k[1] === '^' ? 'power' : k[1] === '*' ? 'times' : k[1] === '/' ? 'divided by' : k[1]) + '">' + k[0] + '</button>';
  }).join('');

  function applyLayout() {
    var ws = $('#ws'); if (!ws) return;
    ws.classList.toggle('focus', !!S.focus);
    ws.classList.toggle('noview', !!S.vmin);
    ws.classList.toggle('dock-bottom', S.dock === 'bottom');
    var ed = $('#editor');
    ed.style.setProperty('--vw', S.vw ? S.vw + 'px' : '55%');
    ed.style.setProperty('--vh', S.vh ? S.vh + 'px' : '42%');
    $('#split').hidden = !!S.vmin;
    $('#split').setAttribute('aria-orientation', S.dock === 'bottom' ? 'horizontal' : 'vertical');
    $('#b-exit').hidden = !S.focus;
    var sb = $('#b-slides'); if (sb) { sb.setAttribute('aria-pressed', !S.vmin); sb.setAttribute('title', S.vmin ? 'Show slides' : 'Slides'); sb.setAttribute('aria-label', S.vmin ? 'Show slides' : 'Hide slides'); }
  }
  function markCited() {
    var c = C.cited;
    $$('.msgs .sent[data-evid]').forEach(function (b) { b.classList.toggle('cited', !!c && b.getAttribute('data-evt') === c.text); });
  }
  function setFocus(on) {
    on = !!on;
    if (on === !!S.focus) { applyLayout(); renderTop(); return; }
    if (on) { saved = { side: S.side, vmin: S.vmin }; S.side = null; S.vmin = true; }
    else if (saved) { S.side = saved.side; S.vmin = saved.vmin; saved = null; }
    S.focus = on;
    renderLeft(); renderViewer(); renderTop();
    if (on) { var i = $('#inp'); if (i) i.focus(); }
  }
  function renderTop() {
    var b = $('#b-practice'); if (!b) return;
    var ex = S.ex && S.ex.phase === 'run' && S.ex.ctx === S.ctx;
    b.textContent = ex ? 'Continue exercises' : 'Exercise mode';
    b.classList.toggle('pulse', !ex && hasMaterial() && !C.log.length && !S.focus && !S.exOn && !(S.ex && S.ex.hist.length));
  }
  function offerProblems() {
    var rec = (C.ratings.pq == null ? 0 : C.ratings.pq) < (C.ratings.chain == null ? 0 : C.ratings.chain) ? 'p2' : 'p1';
    setFocus(true);
    post({ r: 'ai', text: 'Which exercise do you want to try? I suggest the one for your lower-rated topic.', acts: [
      { label: 'Chain rule', act: 'practice', arg: 'p1', dark: rec === 'p1' }, { label: 'Product rule', act: 'practice', arg: 'p2', dark: rec === 'p2' }] });
  }

  /* splitter between chat and slides */
  (function () {
    var split = $('#split'), drag = false;
    function setSize(px) {
      var ed = $('#editor').getBoundingClientRect(), bottom = S.dock === 'bottom';
      if (bottom) S.vh = Math.max(160, Math.min(ed.height - 220, px)); else S.vw = Math.max(300, Math.min(ed.width - 400, px));
      applyLayout();
    }
    function fromPointer(e) {
      var ed = $('#editor').getBoundingClientRect();
      return S.dock === 'bottom' ? ed.bottom - e.clientY - 6 : ed.right - e.clientX - 6;
    }
    split.addEventListener('pointerdown', function (e) { drag = true; split.setPointerCapture(e.pointerId); split.classList.add('drag'); document.body.classList.add('dragging'); e.preventDefault(); });
    split.addEventListener('pointermove', function (e) { if (drag) setSize(fromPointer(e)); });
    var end = function () { drag = false; split.classList.remove('drag'); document.body.classList.remove('dragging'); };
    split.addEventListener('pointerup', end); split.addEventListener('pointercancel', end);
    split.addEventListener('dblclick', function () { S.vw = null; S.vh = null; applyLayout(); });
    split.addEventListener('keydown', function (e) {
      var bottom = S.dock === 'bottom', step = e.shiftKey ? 80 : 24, cur = bottom ? $('#viewer').offsetHeight : $('#viewer').offsetWidth;
      var grow = bottom ? 'ArrowUp' : 'ArrowLeft', shrink = bottom ? 'ArrowDown' : 'ArrowRight';
      if (e.key === grow) { e.preventDefault(); setSize(cur + step); } else if (e.key === shrink) { e.preventDefault(); setSize(cur - step); }
    });
  })();

  document.addEventListener('mousedown', function (e) { if (e.target.closest && e.target.closest('.mk')) e.preventDefault(); });
  document.addEventListener('keydown', function (e) {
    if (!(e.metaKey || e.ctrlKey) || e.altKey || $('#ov') || $('#intro') && !$('#intro').hidden) return;
    if (e.key === 'b' || e.key === 'B') { e.preventDefault(); S.side = S.side ? null : (S.lastSide || 'material'); renderLeft(); }
    else if (e.key === '\\') { e.preventDefault(); S.vmin = !S.vmin; renderViewer(); }
  });
  document.addEventListener('click', function (e) {
    var o = e.target.closest && e.target.closest('[data-mk]');
    if (o) {
      var inp = $('#inp'), k = o.getAttribute('data-mk');
      var s = inp.selectionStart == null ? inp.value.length : inp.selectionStart, e2 = inp.selectionEnd == null ? s : inp.selectionEnd;
      inp.value = inp.value.slice(0, s) + k + inp.value.slice(e2);
      inp.focus(); try { inp.setSelectionRange(s + k.length, s + k.length); } catch (x) { }
      return;
    }
    if (e.target.closest && e.target.closest('#b-exit')) { setFocus(false); return; }
    if (e.target.closest && e.target.closest('#b-practice')) {
      if (S.exOn) { exExit(); return; }
      if (!hasMaterial()) { toast('Add your course material first, then open exercise mode.'); S.side = 'material'; renderLeft(); openPicker(); return; }
      exOpen();
    }
  });
