<template>
  <QIcon :class="$style.icon" name="eva-loader-outline" />
</template>

<script setup lang="ts"></script>

<style lang="scss" module>
.icon {
  animation-name: rotate;
  animation-duration: 3s;
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
