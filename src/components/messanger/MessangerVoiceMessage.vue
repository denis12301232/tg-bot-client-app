<template lang="pug">
audio(ref="audio" :src="src" preload="metadata" :volume="1")
div(:class="$style.audio")
   QBtn(round dense flat rounded no-caps size="20px" :icon="isPlaying ? 'stop_circle' :'play_circle'" @click="playOrStop")
   div(:class="$style.audio_info")
      QLinearProgress(:value="progress" :class="$style.audio_progress" instant-feedback color="amber-6" ref="barRef")
      div(:class="$style.audio_time") {{ currentTime && duration ? currentTime + ' / '  + duration : '' }}
</template>

<script setup lang="ts">
import type { QLinearProgress } from 'quasar'
import { ref, onMounted, onBeforeUnmount } from 'vue'


defineProps<{
   src: string;
}>();

const audio = ref<HTMLAudioElement | null>(null);
const barRef = ref<QLinearProgress | null>(null);
const isPlaying = ref(false);
const progress = ref(0);
const currentTime = ref<string | number>(0);
const duration = ref<string | number>(0);

onMounted(() => {
   if (audio.value) {
      audio.value.addEventListener('play', onPlay);
      audio.value.addEventListener('pause', onPause);
      audio.value.addEventListener('loadedmetadata', onLoadedMetadata);
      audio.value.addEventListener('timeupdate', onTimeUpdate);
      audio.value.addEventListener('ended', onEnded);
   }
});

function playOrStop() {
   isPlaying.value ? audio.value?.pause() : audio.value?.play();
}

function onPlay() {
   isPlaying.value = true;
}

function onPause() {
   isPlaying.value = false;
}

function onLoadedMetadata() {
   barRef.value?.$el.addEventListener('click', onRewindAudio);
}

function onTimeUpdate(this: HTMLAudioElement) {
   duration.value = (this.duration / 100).toFixed(2).replace('.', ':');
   currentTime.value = (this.currentTime / 100).toFixed(2).replace('.', ':');
   progress.value = this.currentTime / this.duration;
}

function onEnded() {
   progress.value = 0;
}

function onRewindAudio(this: HTMLElement, event: MouseEvent) {
   if (audio.value && audio.value.duration !== Infinity) {
      const { left } = this.getBoundingClientRect();
      const width = this.offsetWidth;
      const clickX = event.clientX - left;
      audio.value.currentTime = (clickX / width) * audio.value.duration;
   }
}

onBeforeUnmount(() => {
   audio.value?.removeEventListener('play', onPlay);
   audio.value?.removeEventListener('pause', onPause);
   audio.value?.removeEventListener('loadedmetadata', onLoadedMetadata);
   audio.value?.removeEventListener('timeupdate', onTimeUpdate);
   audio.value?.removeEventListener('ended', onEnded);
   barRef.value?.$el.removeEventListener('click', onRewindAudio);
});
</script>


<style lang="scss" module>
.audio {
   width: 150px;
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