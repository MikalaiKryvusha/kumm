// Rewrites live "key = value" lines of /save/settings.ini; a key set to null is commented back to its template default.
// The changes come from window.__nfsChanges (set by the wrapper text prepended by setini.sh).
(async () => {
  const changes = window.__nfsChanges
  const root = await navigator.storage.getDirectory()
  const save = await root.getDirectoryHandle('save')
  const fh = await save.getFileHandle('settings.ini')
  let text = await (await fh.getFile()).text()
  const done = []
  for (const [k, v] of Object.entries(changes)) {
    const live = new RegExp('^' + k + '\\s*=.*$', 'm')
    const tmpl = new RegExp('^#' + k + '\\s*=.*$', 'm')
    if (v === null) { if (live.test(text)) { text = text.replace(live, '#' + k + ' ='); done.push(k + ' -> template') } continue }
    if (live.test(text)) text = text.replace(live, k + ' = ' + v)
    else if (tmpl.test(text)) text = text.replace(tmpl, m => m + '\n' + k + ' = ' + v)
    else text += '\n' + k + ' = ' + v + '\n'
    done.push(k + ' = ' + v)
  }
  const w = await fh.createWritable(); await w.write(text); await w.close()
  const back = await (await fh.getFile()).text()
  return JSON.stringify({ done, live: back.split(/\r?\n/).filter(l => l.trim() && !/^\s*[#;]/.test(l)) })
})()
