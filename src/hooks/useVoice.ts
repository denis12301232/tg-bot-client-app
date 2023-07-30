import { ref } from 'vue';

export default function useVoice() {
  const stream = ref<MediaStream | null>(null);
  const mediaRecorder = ref<MediaRecorder | null>(null);
  const voiceMessage = ref<File | null>(null);
  const isRecording = ref(false);
  const error = ref<string | null>(null);

  async function startRecording() {
    try {
      error.value = null;
      stream.value = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.value = new MediaRecorder(stream.value);
      mediaRecorder.value.onstart = () => (isRecording.value = true);
      mediaRecorder.value.onstop = () => (isRecording.value = false);
      mediaRecorder.value.ondataavailable = (event) => {
        voiceMessage.value = new File([event.data], 'audio.ogg', {
          type: 'audio/webm',
        });
      };
      mediaRecorder.value.start();
    } catch (e) {
      if (e instanceof Error) {
        error.value = e.message;
      }
    }
  }

  function stopRecording() {
    mediaRecorder.value?.stop();
    voiceMessage.value = null;
    stream.value?.getTracks().forEach((track) => track.stop());
  }

  return { mediaRecorder, isRecording, voiceMessage, error, startRecording, stopRecording };
}
