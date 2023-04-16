<template>
  <QCard class="row justify-center items-center">
    <QBtn v-close-popup :class="$style.btn" icon="close" color="negative" dense flat round />
    <QImg :class="$style.img" :src="src" fit="scale-down" height="100%" />
  </QCard>
</template>

<script setup lang="ts">
defineProps<{
  src: string;
}>();
</script>

<style module lang="scss">
.img {
  max-width: 900px;
  max-height: calc(100% - 50px);
}

.btn {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 1;
}
</style>
