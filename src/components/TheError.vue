<template>
  <div class="window-height column items-center justify-center">
    <h1>{{ code }}</h1>
    <h3>{{ message }}</h3>
    <QBtn class="q-mt-md" color="primary" label="На главную" @click="$router.push('/')" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  code: number;
  message: string;
}>();
</script>
