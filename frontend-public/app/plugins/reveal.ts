interface RevealOptions {
  delay?: number
  y?: number
}

const REVEAL_ELEMENTS = new Set<HTMLElement>()

function checkReveals() {
  const viewportHeight = window.innerHeight
  const toReveal: HTMLElement[] = []

  for (const el of REVEAL_ELEMENTS) {
    if (el.classList.contains('is-revealed')) continue
    const rect = el.getBoundingClientRect()
    if (rect.top < viewportHeight - 120 && rect.bottom > 0) {
      toReveal.push(el)
    }
  }

  for (const el of toReveal) {
    const delay = parseFloat(el.dataset.revealDelay ?? '0')
    const y = parseFloat(el.dataset.revealY ?? '28')
    el.style.setProperty('--reveal-y', `${y}px`)
    el.style.transitionDelay = `${delay}ms`
    el.classList.add('is-revealed')
    REVEAL_ELEMENTS.delete(el)
  }

  if (REVEAL_ELEMENTS.size === 0) {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  }
}

let scrollRaf = 0
function onScroll() {
  if (scrollRaf) return
  scrollRaf = requestAnimationFrame(() => {
    scrollRaf = 0
    checkReveals()
  })
}

export default defineNuxtPlugin((nuxtApp) => {
  if (process.server) {
    nuxtApp.vueApp.directive('reveal', {
      getSSRProps() {
        return {}
      },
    })
    return
  }

  let io: IntersectionObserver | null = null
  try {
    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const delay = parseFloat(el.dataset.revealDelay ?? '0')
            const y = parseFloat(el.dataset.revealY ?? '28')
            el.style.setProperty('--reveal-y', `${y}px`)
            el.style.transitionDelay = `${delay}ms`
            el.classList.add('is-revealed')
            REVEAL_ELEMENTS.delete(el)
            io?.unobserve(el)
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -120px 0px' },
    )
  } catch {
    io = null
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })

  nuxtApp.vueApp.directive('reveal', {
    mounted(el: HTMLElement, binding) {
      const opts = (binding.value ?? {}) as RevealOptions
      el.classList.add('reveal-target')
      el.dataset.revealDelay = String(opts.delay ?? 0)
      el.dataset.revealY = String(opts.y ?? 28)
      REVEAL_ELEMENTS.add(el)
      io?.observe(el)
      requestAnimationFrame(() => checkReveals())
    },
    unmounted(el: HTMLElement) {
      REVEAL_ELEMENTS.delete(el)
      io?.unobserve(el)
    },
  })
})
