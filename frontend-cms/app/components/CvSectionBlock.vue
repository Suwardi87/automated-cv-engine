<template>
  <div class="mb-5">
    <h2 class="mb-2 border-b border-zinc-300 pb-1 text-xs font-bold uppercase tracking-widest text-zinc-900">
      {{ title }}
    </h2>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>
