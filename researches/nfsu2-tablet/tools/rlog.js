(() => {
  let log = ''
  try { log = JSON.parse(localStorage.getItem('nfsu2.lastgame.save')).log || '' } catch (e) { return 'no log ' + e }
  const lines = log.split('\n')
  const start = lines.map((l, i) => /^=== NFSU2 web/.test(l) ? i : -1).filter(i => i >= 0).pop() || 0
  const cur = lines.slice(start)
  return cur.filter(l => /render|resolution|NFSRES|\d{3,4}x\d{3,4}|phone graphics|display refresh/i.test(l) && !/loaded \./.test(l)).slice(0, 25).join('\n')
})()
