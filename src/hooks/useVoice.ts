import { ref } from 'vue'


export default function useVoice() {
   const stream = ref<MediaStream | null>(null);
   const mediaRecorder = ref<MediaRecorder | null>(null);
   const voiceMessage = ref<File | null>(null);
   const isRecording = ref(false);

   async function startRecording() {
      stream.value = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.value = new MediaRecorder(stream.value);
      mediaRecorder.value.onstart = () => isRecording.value = true;
      mediaRecorder.value.onstop = () => isRecording.value = false;
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
      stream.value?.getTracks().at(0)?.stop();
   }

   return { mediaRecorder, isRecording, voiceMessage, startRecording, stopRecording }
}