<template>
  <div class="window-height column items-center justify-center">
    <h1 class="q-py-md">{{ code }}</h1>
    <h3 class="q-py-md">{{ message }}</h3>
    <QBtn class="q-mt-lg" color="primary" label="На главную" @click="$router.push('/')" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  code: number;
  message: string;
}>();
</script>
