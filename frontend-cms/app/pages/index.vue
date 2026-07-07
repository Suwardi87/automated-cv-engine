<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const token = useCookie('auth_token').value
onMounted(() => {
  navigateTo(token ? '/dashboard' : '/login')
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-zinc-950">
    <div class="text-zinc-500">Mengalihkan...</div>
  </div>
</template>
