<template>
  <ul class="list-inside list-disc space-y-0.5">
    <li v-for="item in items" :key="item" class="text-xs leading-relaxed text-zinc-700">
      {{ item }}
    </li>
  </ul>
</template>

<script setup lang="ts">
defineProps<{ items: string[] }>()
</script>
