<template>
  <div class="mb-2">
    <div class="flex items-baseline justify-between">
      <h3 class="text-sm font-bold text-zinc-900">{{ degree }}</h3>
      <span class="shrink-0 text-[10px] text-zinc-400">{{ period }}</span>
    </div>
    <p v-if="school" class="text-xs font-medium text-violet-600">{{ school }}</p>
    <p v-if="note" class="text-xs text-zinc-600">{{ note }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  degree: string
  school: string
  period: string
  note: string
}>()
</script>
