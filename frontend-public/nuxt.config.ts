export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'OmniSync Portfolio',
      meta: [
        { name: 'description', content: 'Portfolio website powered by OmniSync' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap' }
      ]
    }
  },
  runtimeConfig: {
    apiBaseSsr: process.env.NUXT_API_BASE_SSR || 'http://nginx/api',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8082/api'
    }
  }
})
