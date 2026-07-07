<template>
  <section id="cta" class="relative overflow-hidden bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 py-24">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.12),transparent_50%)]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.08),transparent_50%)]"></div>
    <div class="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
      <h2 class="text-4xl font-bold tracking-tight text-white sm:text-5xl">Siap Membangun Portofolio-mu?</h2>
      <p class="mx-auto mt-4 max-w-2xl text-lg text-gray-300">Bergabunglah dengan ribuan developer yang memamerkan karya mereka.</p>
      <form @submit.prevent="handleSubmit" class="mx-auto mt-10 flex max-w-md flex-col items-center gap-4 sm:flex-row">
        <div class="relative w-full">
          <input v-model="email" type="email" placeholder="Masukkan email" class="w-full rounded-xl border border-gray-700 bg-gray-800/50 px-5 py-3.5 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20">
        </div>
        <button type="submit" class="w-full shrink-0 rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-600/30 sm:w-auto">
          Mulai
        </button>
      </form>
      <p class="mt-4 text-xs text-gray-500">Tidak perlu kartu kredit. Gratis selamanya.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
const email = ref('')
function handleSubmit() {
  navigateTo('/cms/login', { external: true })
}
</script>
