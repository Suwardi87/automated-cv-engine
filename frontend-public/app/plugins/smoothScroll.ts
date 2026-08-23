import Lenis from 'lenis'

export default defineNuxtPlugin((nuxtApp) => {
  if (process.server) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6,
  })

  let rafId = 0
  const raf = (time: number) => {
    lenis.raf(time)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)

  const anchorHandler = (e: Event) => {
    const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
    if (!a) return
    const id = a.getAttribute('href')
    if (!id || id === '#') return
    const target = document.querySelector(id)
    if (!target) return
    e.preventDefault()
    lenis.scrollTo(target as HTMLElement, { offset: -72 })
  }
  document.addEventListener('click', anchorHandler)

  nuxtApp.provide('lenis', lenis)
})
