<template>
  <div v-if="loading" :class="$style.loader">
    <div :class="[$style.loader_indicator, $style.color]"></div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    loading: boolean;
    color?: string;
  }>(),
  { color: '#3f51b5' }
);
</script>

<style lang="scss" module>
.color {
  background-color: v-bind(color);
}

.loader {
  top: 0;
  width: 100%;
  height: 2px;
  animation-duration: 5s;
  z-index: 10000;
  position: fixed;

  & .loader_indicator {
    height: 100%;
    width: 95%;
    animation: l 5s linear;
  }
}

@keyframes l {
  from {
    width: 10%;
  }

  to {
    width: 95%;
  }
}
</style>
