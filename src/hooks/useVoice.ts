import { ref } from 'vue'


export function useVoice() {
   const stream = ref<MediaStream | null>(null);
   const mediaRecorder = ref<MediaRecorder | null>(null);
   const voiceMessage = ref<File | null>(null);
   const isRecording = ref(false);

   async function startRecording() {
      stream.value = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.value = new MediaRecorder(stream.value, { audioBitsPerSecond: 128000 });
      mediaRecorder.value.onstart = () => isRecording.value = !isRecording.value;
      mediaRecorder.value.onstop = () => isRecording.value = !isRecording.value;
      mediaRecorder.value.ondataavailable = (event) => {
         voiceMessage.value = new File([event.data], 'audio.ogg', {
            type: mediaRecorder.value?.mimeType,
         });
      }
      mediaRecorder.value.start();
   }

   function stopRecording() {
      mediaRecorder.value?.stop();
      voiceMessage.value = null;
      stream.value?.getTracks()[0]?.stop();
   }

   return { mediaRecorder, isRecording, voiceMessage, startRecording, stopRecording }
}