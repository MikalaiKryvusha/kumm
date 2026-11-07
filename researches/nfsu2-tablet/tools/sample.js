// Samples the page's #fps counter every 250 ms for N seconds (window.__N, default 10): median and worst of fps and frame ms.
(async () => {
  const N = (window.__N || 10) * 4
  const read = () => {
    const el = document.getElementById('fps'); if (!el) return null
    const o = {}
    const head = el.textContent.match(/^\s*(\d+)\s*fps/); if (head) o.fps = +head[1]
    const dts = el.querySelectorAll('dt')
    dts.forEach(dt => { const dd = dt.nextElementSibling; if (dd) o[dt.textContent.trim()] = dd.textContent.trim() })
    return o
  }
  const s = []
  for (let i = 0; i < N; i++) { const r = read(); if (r) s.push(r); await new Promise(r => setTimeout(r, 250)) }
  const num = v => parseFloat(String(v).replace(/,/g, ''))
  const fps = s.map(r => r.fps).filter(x => !isNaN(x)).sort((a, b) => a - b)
  const ms = s.map(r => num(r.frame)).filter(x => !isNaN(x)).sort((a, b) => a - b)
  const med = a => a.length ? a[Math.floor(a.length / 2)] : null
  const last = s[s.length - 1] || {}
  return JSON.stringify({ n: s.length, fpsMed: med(fps), fpsMin: fps[0], fpsMax: fps[fps.length - 1], msMed: med(ms), msMax: ms[ms.length - 1], roamCars: last['roam cars'], roamNear: last['roam near'], tris: last['tris/frame'], drive: last.drive, pause: last.pause, keys: Object.keys(last).slice(0, 40).join(',') })
})()
