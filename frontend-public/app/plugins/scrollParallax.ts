const REDUCED = '(prefers-reduced-motion: reduce)'

export default defineNuxtPlugin((nuxtApp) => {
  if (process.server) return
  if (window.matchMedia(REDUCED).matches) return

  let els: HTMLElement[] = []
  let raf = 0

  const collect = () => {
    els = Array.from(document.querySelectorAll<HTMLElement>('[data-plx]'))
  }

  const apply = () => {
    raf = 0
    const vh = window.innerHeight
    for (const el of els) {
      const r = el.getBoundingClientRect()
      if (r.bottom < -240 || r.top > vh + 240) continue
      const speed = parseFloat(el.dataset.plx || '0.2')
      const center = r.top + r.height / 2 - vh / 2
      el.style.transform = `translate3d(0, ${(-center * speed).toFixed(1)}px, 0)`
    }
  }

  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(apply)
  }

  const init = () => {
    collect()
    apply()
  }

  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
  nuxtApp.hook('page:finish', () => {
    setTimeout(init, 60)
    return undefined
  })

  if (document.readyState === 'complete') init()
  else window.addEventListener('load', init, { once: true })
})
