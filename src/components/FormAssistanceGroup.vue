<template>
  <div :class="['q-pa-lg', 'q-mb-sm', 'shadow-2', 'rounded-borders', {[$style.border]: error}]">
    <h6 class="q-mb-lg">{{ title }}</h6>
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ title: string; error?: boolean }>(), { error: false });
</script>

<style lang="scss" module>
.border {
  border: 1px solid $negative;
}
</style>
