<template>
  <div ref="container" :class="[$style.container, 'row', 'justify-center', 'items-center']">
    <slot v-if="mute.video" />
    <div v-show="!mute.video" :class="[$style.video_block, 'fit']">
      <video ref="$el" :="$attrs" :class="$style.video" />
      <div :class="$style.controls">
        <QBtn
          v-if="btns.fullscreen"
          flat
          dense
          color="white"
          :icon="sets.fullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="toggleFullscreen"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, watchEffect, onMounted, onUnmounted } from 'vue';

interface Props extends /* @vue-ignore */ Partial<HTMLVideoElement> {
  stream: MediaStream | null;
  btns?: { fullscreen: boolean };
  mute?: { audio: boolean; video: boolean };
}

const props = withDefaults(defineProps<Props>(), {
  btns: () => ({ fullscreen: false }),
  mute: () => ({ audio: false, video: false }),
});
const $el = ref<HTMLVideoElement | null>(null);
const container = ref<HTMLDivElement | null>(null);
const sets = reactive({ fullscreen: false });
const mute = reactive({ video: props.mute.video, audio: props.mute.audio });

defineExpose({ $el, mute, muteTrack });
onMounted(() => document.addEventListener('fullscreenchange', onFullScreenChange));
onUnmounted(() => document.removeEventListener('fullscreenchange', onFullScreenChange));
watchEffect(() => props.stream && $el.value && ($el.value.srcObject = props.stream));
watch(mute, watchMute, { immediate: true });

function watchMute() {
  props.stream?.getAudioTracks().forEach((track) => (track.enabled = !mute.audio));
  props.stream?.getVideoTracks().forEach((track) => (track.enabled = !mute.video));
}

function muteTrack(track: 'audio' | 'video') {
  mute[track] = !mute[track];
}

function onFullScreenChange(e: Event) {
  sets.fullscreen = !sets.fullscreen;
}

function toggleFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    container.value?.requestFullscreen();
  }
}
</script>

<style module lang="scss">
.container {
  height: 300px;
  width: 300px;
  position: relative;
}

.video_block {
  &:hover .controls {
    opacity: 1;
  }
}

.video {
  width: 100%;
  height: 100%;
  position: absolute;
  object-fit: contain;
  z-index: 0;
}

.controls {
  position: absolute;
  bottom: 0;
  right: 0;
  opacity: 0;
  transition: opacity 150ms ease-in-out;
  z-index: 100;
  width: 100%;
  display: flex;
  justify-content: end;
}
</style>
