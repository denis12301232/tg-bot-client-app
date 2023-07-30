import type { Ref } from 'vue';

export default function useAudioDuration(src: string, duration: Ref<number>) {
  const audio = new Audio(src);

  function onDurationChange(this: HTMLAudioElement) {
    if (this.duration !== Infinity) {
      duration.value = this.duration;
      this.remove();
    }
  }

  audio.addEventListener('durationchange', onDurationChange);
  audio.load();
  audio.currentTime = 1e101;
  audio.remove();
}
