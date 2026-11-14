  fresh(); acctBoot(); renderAll();
  window.__proto = {
    S: function () { return S; }, parseFn: parseFn, same: same, flush: flush,
    HELP_POLICIES: HELP_POLICIES, policyId: function () { return POLICY_ID; },
    setPolicy: function (id) { if (HELP_POLICIES[id]) POLICY_ID = id; return POLICY_ID; },
    registerPolicy: function (id, label, cells) { HELP_POLICIES[id] = { label: label, cells: cells }; },
    policyCell: policyCell, map: function () { return MV; }
  };
})();
</script>
