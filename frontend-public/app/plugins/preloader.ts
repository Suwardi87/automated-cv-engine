export default defineNuxtPlugin(() => {
  if (process.server) return

  const params = new URLSearchParams(window.location.search)
  if (params.get('noloader') === '1') return

  const overlay = document.createElement('div')
  overlay.className = 'preloader'
  overlay.innerHTML = `
    <div class="preloader__count">0</div>
    <div class="preloader__label">MEMUAT PORTOFOLIO</div>
    <div class="preloader__bar"></div>
  `
  const style = document.createElement('style')
  style.textContent = `
    .preloader {
      position: fixed; inset: 0; z-index: 10000;
      background: #040506;
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px;
      transition: opacity 0.6s ease, visibility 0.6s ease;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }
    .preloader.is-done { opacity: 0; visibility: hidden; }
    .preloader__count {
      font-size: 56px; font-weight: 700; color: #55b3ff;
      letter-spacing: -0.02em; font-variant-numeric: tabular-nums;
    }
    .preloader__label {
      font-size: 10px; letter-spacing: 0.42em; color: #5e5f61; text-transform: uppercase;
    }
    .preloader__bar {
      position: absolute; bottom: 0; left: 0; height: 2px; background: #55b3ff; width: 0%;
    }
  `
  document.head.appendChild(style)
  document.body.appendChild(overlay)

  const countEl = overlay.querySelector('.preloader__count') as HTMLElement
  const bar = overlay.querySelector('.preloader__bar') as HTMLElement

  let done = false
  let val = 0

  const finish = () => {
    if (done) return
    done = true
    countEl.textContent = '100'
    bar.style.width = '100%'
    overlay.classList.add('is-done')
    setTimeout(() => overlay.remove(), 700)
  }

  const tick = () => {
    if (done) return
    val += Math.max(2, (100 - val) * 0.09)
    if (val >= 100) {
      finish()
      return
    }
    countEl.textContent = String(Math.floor(val))
    bar.style.width = `${val}%`
    requestAnimationFrame(tick)
  }

  const start = () => {
    requestAnimationFrame(tick)
    setTimeout(finish, 2200)
  }

  if (document.readyState === 'complete') start()
  else {
    window.addEventListener('load', start, { once: true })
    setTimeout(start, 1600)
  }
})
