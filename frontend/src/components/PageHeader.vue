<template>
  <header class="flex flex-col gap-1.5">
    <h1 class="text-2xl font-display font-bold text-gray-900 leading-tight">
      {{ title }}
    </h1>
    <p v-if="description" class="text-sm text-gray-600 font-medium leading-relaxed">
      {{ description }}
    </p>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>
