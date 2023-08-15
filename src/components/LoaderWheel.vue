<template>
  <QIcon :class="$style.icon" name="eva-loader-outline" />
</template>

<script setup lang="ts">
interface Props {
  duration?: number;
}

withDefaults(defineProps<Props>(), { duration: 3 });
</script>

<style lang="scss" module>
.icon {
  animation-name: rotate;
  animation-duration: v-bind(duration) s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
