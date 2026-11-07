// Sets DWORDs in /save/registry.txt (window.__reg = {name: value}); the game must not be running.
(async () => {
  const vals = window.__reg
  const root = await navigator.storage.getDirectory()
  const save = await root.getDirectoryHandle('save')
  const fh = await save.getFileHandle('registry.txt')
  let t = await (await fh.getFile()).text()
  for (const [k, v] of Object.entries(vals)) {
    const re = new RegExp('^d ' + k + '=\\d+$', 'm')
    t = re.test(t) ? t.replace(re, 'd ' + k + '=' + v) : t + 'd ' + k + '=' + v + '\n'
  }
  const w = await fh.createWritable(); await w.write(t); await w.close()
  return (await (await fh.getFile()).text()).replace(/\n/g, ' | ')
})()
