export default defineNuxtPlugin(() => {
  if (process.server) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (window.matchMedia('(pointer: coarse)').matches) return

  const dot = document.createElement('div')
  dot.className = 'cursor-dot'
  const ring = document.createElement('div')
  ring.className = 'cursor-ring'

  document.body.appendChild(dot)
  document.body.appendChild(ring)

  let mx = window.innerWidth / 2
  let my = window.innerHeight / 2
  let rx = mx
  let ry = my
  let raf = 0
  let hovering = false

  const render = () => {
    rx += (mx - rx) * 0.16
    ry += (my - ry) * 0.16
    dot.style.transform = `translate3d(${mx - 3}px, ${my - 3}px, 0)`
    ring.style.transform = `translate3d(${rx - 20}px, ${ry - 20}px, 0) scale(${hovering ? 1.6 : 1})`
    raf = requestAnimationFrame(render)
  }
  raf = requestAnimationFrame(render)

  const onMove = (e: MouseEvent) => {
    mx = e.clientX
    my = e.clientY
    const t = e.target as HTMLElement
    hovering = !!t.closest('a, button, [data-cursor="hover"]')
  }

  window.addEventListener('mousemove', onMove, { passive: true })

  const style = document.createElement('style')
  style.textContent = `
    .cursor-dot, .cursor-ring { position: fixed; top: 0; left: 0; z-index: 9999; pointer-events: none; border-radius: 9999px; }
    .cursor-dot { width: 6px; height: 6px; background: #55b3ff; }
    .cursor-ring { width: 40px; height: 40px; border: 1px solid rgba(85,179,255,0.55); transition: transform 0.05s linear, border-color 0.25s ease, background 0.25s ease; }
    body { cursor: none; }
    a, button { cursor: none; }
  `
  document.head.appendChild(style)
})
