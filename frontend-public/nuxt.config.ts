export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  app: {
    head: {
      title: 'OmniSync Portfolio',
      meta: [
        { name: 'description', content: 'Portfolio website powered by OmniSync' }
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
