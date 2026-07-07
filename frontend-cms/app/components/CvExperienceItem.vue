<template>
  <div class="mb-3">
    <div class="flex items-baseline justify-between">
      <h3 class="text-sm font-bold text-zinc-900">{{ role }}</h3>
      <span class="shrink-0 text-[10px] text-zinc-400">{{ period }}</span>
    </div>
    <p v-if="company" class="text-xs font-medium text-violet-600">{{ company }}</p>
    <ul v-if="bullets.length" class="mt-1 list-inside list-disc space-y-0.5">
      <li v-for="(b, i) in bullets" :key="i" class="text-xs leading-relaxed text-zinc-700">
        {{ b }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  role: string
  company: string
  period: string
  bullets: string[]
}>()
</script>
