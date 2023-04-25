<template>
  <div ref="container" :class="[$style.container, { [$style.fullscreen]: sets.fullscreen }]">
    <UserAvatar v-if="!mute.video" :avatar="avatar" :name="name" size="200px"/>
    <video v-else ref="$el" :class="$style.video" autoplay playsinline />
    <div :class="$style.controls">
      <QBtn
        v-if="fullscreenBtn"
        flat
        dense
        color="white"
        :icon="sets.fullscreen ? 'fullscreen_exit' : 'fullscreen'"
        @click="toggleFullscreen"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import UserAvatar from '~/UserAvatar.vue';
import { ref, watchEffect, watch, reactive, onMounted, onUnmounted } from 'vue';

const props = withDefaults(
  defineProps<{
    stream: MediaStream;
    fullscreenBtn?: boolean;
    enableAudio?: boolean;
    enableVideo?: boolean;
    avatar?: string;
    name?: string;
  }>(),
  { fullscreenBtn: false, enableAudio: false, enableVideo: false, name: 'User' }
);

const container = ref<HTMLDivElement | null>(null);
const $el = ref<HTMLVideoElement | null>(null);
const sets = reactive({ fullscreen: false });
const mute = reactive({ video: props.enableVideo, audio: props.enableAudio });

defineExpose({ $el, mute, toggleTrackMute });
watchEffect(() => ($el.value && props.stream) && ($el.value.srcObject = props.stream));
watch([mute, () => props.stream], () => {
  if (props.stream) {
    props.stream.getTracks().forEach((t) => (t.enabled = mute[t.kind as keyof typeof mute]));
  }
}, { immediate: true });
onMounted(() => document.addEventListener('fullscreenchange', onFullScreenChange));
onUnmounted(() => document.removeEventListener('fullscreenchange', onFullScreenChange));

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

function toggleTrackMute(type: 'video' | 'audio') {
  mute[type] = !mute[type];
}
</script>

<style lang="scss" module>
.container {
  max-width: 500px;
  width: 100%;
  min-height: 250px;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  & .video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  & .controls {
    position: absolute;
    bottom: 0;
    right: 0;
    opacity: 0;
    transition: opacity 150ms ease-in-out;
    z-index: 100;
    width: 100%;
    display: flex;
    justify-content: end;

    & .btns {
      margin: 0 auto;
    }
  }

  &:hover .controls {
    opacity: 1;
  }
}

.fullscreen {
  max-width: 100vw;
  width: 100%;
  height: 100vh;

  & .video {
    object-fit: contain;
  }
}

video::-webkit-media-controls {
  display: none !important;
}
</style>
