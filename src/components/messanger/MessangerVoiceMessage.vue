<template>
  <div :class="$style.audio">
    <QBtn
      round
      dense
      flat
      rounded
      no-caps
      size="20px"
      :icon="isPlaying ? 'stop_circle' : 'play_circle'"
      @click="playOrStop"
    />
    <div :class="$style.audio_info">
      <QLinearProgress :value="progress" :class="$style.audio_progress" instant-feedback color="amber-6" ref="barRef" />
      <div :class="$style.audio_time">{{ durationString ? currentTime + ' / ' + durationString : '' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QLinearProgress } from 'quasar';
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useAudioDuration } from '@/hooks';

const props = defineProps<{
  src: string;
}>();

const duration = useAudioDuration(props.src);
const audio = new Audio(props.src);
const barRef = ref<QLinearProgress | null>(null);
const isPlaying = ref(false);
const progress = ref(0);
const currentTime = ref<string | number>('0:00');
const durationString = ref<string | number>(0);


const unwatch = watch(duration, () => {
  durationString.value = (duration.value / 100).toFixed(2).replace('.', ':');
  unwatch();
});

onMounted(() => {
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
});



function playOrStop() {
  isPlaying.value ? audio.pause() : audio.play();
}

function onPlay() {
  isPlaying.value = true;
}

function onPause() {
  isPlaying.value = false;
}

function onLoadedMetadata(this: HTMLAudioElement) {
  barRef.value?.$el.addEventListener('click', onRewindAudio);
}

function onTimeUpdate(this: HTMLAudioElement) {
  durationString.value = (duration.value / 100).toFixed(2).replace('.', ':');
  currentTime.value = (this.currentTime / 100).toFixed(2).replace('.', ':');
  progress.value = this.currentTime / duration.value;
}

function onEnded() {
  progress.value = 0;
}

function onRewindAudio(this: HTMLElement, event: MouseEvent) {
  if (audio && audio.duration !== Infinity) {
    const { left } = this.getBoundingClientRect();
    const width = this.offsetWidth;
    const clickX = event.clientX - left;
    audio.currentTime = (clickX / width) * audio.duration;
  }
}

onBeforeUnmount(() => {
  audio.removeEventListener('play', onPlay);
  audio.removeEventListener('pause', onPause);
  audio.removeEventListener('loadedmetadata', onLoadedMetadata);
  audio.removeEventListener('timeupdate', onTimeUpdate);
  audio.removeEventListener('ended', onEnded);
  barRef.value?.$el.removeEventListener('click', onRewindAudio);
});
</script>

<style lang="scss" module>
.audio {
  width: 100%;
  display: flex;
  place-items: center;
  place-content: center;
  border-radius: 20px;

  & .audio_info {
    width: 100%;
  }

  & .audio_time {
    font-size: 0.75rem;
    margin-top: 10px;
    line-height: 0.75rem;
    height: 0.75rem;
  }

  & .audio_progress {
    margin-top: 10px;
    cursor: pointer;
    height: 5px;

    &:hover {
      box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    }
  }
}
</style>
