<script setup lang="ts">
interface User {
  id: number
  name: string
  email: string
  bio: string | null
  avatar_url: string | null
  created_at: string
}

const auth = useAuthStore()
const api = useApi()

const token = useCookie('auth_token')

if (token.value) {
  try {
    const { data } = await api.get<{ data: User }>('/user')
    auth.setUser(data)
    await navigateTo('/dashboard', { replace: true })
  } catch {
    auth.clearAuthCookie()
    await navigateTo('/login', { replace: true })
  }
} else {
  await navigateTo('/login', { replace: true })
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-zinc-950">
    <div class="flex items-center gap-3 text-zinc-400">
      <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <span class="text-sm">Mengautentikasi...</span>
    </div>
  </div>
</template>
