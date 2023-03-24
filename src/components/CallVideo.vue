<template>
  <div class="container">
    <video ref="$el" class="video" :="$attrs"></video>
    <div class="controls">
      <QBtn dense flat round :icon="muted ? 'mic_off' : 'mic'" @click="mute" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const $el = ref<HTMLVideoElement | null>(null);
const muted = ref(false);

defineExpose({ $el });

function mute() {
  if ($el.value) {
    $el.value.muted = !$el.value.muted;
    muted.value = $el.value?.muted;
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 90%;
  max-width: 1000px;
  max-height: 800px;
  display: flex;
  justify-content: center;
  margin-inline: auto;
  position: relative;

  &:hover .controls {
    opacity: 1;
  }

  & .video {
    width: 100%;
    object-fit: cover;
  }

  & .controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0;
    transition: opacity 150ms ease-in-out;
  }
}
</style>
