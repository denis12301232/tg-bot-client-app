<template>
  <div class="q-pa-lg q-mb-sm shadow-2 rounded-borders">
    <h6 class="q-mb-lg">{{ title }}</h6>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>();
</script>
