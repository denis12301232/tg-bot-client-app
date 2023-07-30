import { ref } from 'vue';
import { ChatService } from '@/api/services';

export default function useGetTempUrl(filename: string, mimetype: string) {
  const loading = ref(false);
  const src = ref('');

  async function getUrl() {
    loading.value = true;
    const blob = await ChatService.getFileFromS3(filename).blob();
    const file = new File([blob], filename, { type: mimetype });
    src.value = URL.createObjectURL(file);
    loading.value = false;
  }

  return { src, loading, getUrl };
}
