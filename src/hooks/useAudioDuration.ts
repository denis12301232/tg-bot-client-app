import { ref } from 'vue'


export default function useAudioDuration(src: string) {
   const duration = ref(0);
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
   audio.removeEventListener('durationchange', onDurationChange);
   audio.remove();

   return duration;
}

