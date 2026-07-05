import { defineStore } from 'pinia'

interface User {
  id: number
  name: string
  email: string
  bio: string | null
  avatar_url: string | null
  phone?: string | null
  location?: string | null
  website?: string | null
  linkedin?: string | null
  job_title?: string | null
  username?: string | null
  created_at: string
}

interface AuthState {
  user: User | null
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    loading: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    redirectOAuth(provider: 'github' | 'gitlab', apiBase: string) {
      window.location.href = `${apiBase}/auth/${provider}/redirect`
    },

    setAuthCookie(token: string) {
      const c = useCookie('auth_token', { sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 })
      c.value = token
    },

    clearAuthCookie() {
      const c = useCookie('auth_token')
      c.value = null
    },

    setUser(user: User | null) {
      this.user = user
    },

    setLoading(val: boolean) {
      this.loading = val
    },

    logout() {
      this.user = null
      const c = useCookie('auth_token')
      c.value = null
    },
  },
})
