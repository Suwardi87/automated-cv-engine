export default defineNuxtPlugin(async () => {
  const token = useCookie('auth_token').value
  if (token) {
    const auth = useAuthStore()
    const api = useApi()
    auth.setLoading(true)
    try {
      const { data } = await api.get<{ data: User }>('/user')
      auth.setUser(data)
    } catch {
      auth.clearAuthCookie()
      auth.setUser(null)
    } finally {
      auth.setLoading(false)
    }
  }
})

interface User {
  id: number
  name: string
  email: string
  bio: string | null
  avatar_url: string | null
  created_at: string
}
