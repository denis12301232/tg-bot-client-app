import { onMounted, onUnmounted, ref } from 'vue';

export default function useOnline() {
  const isOnline = ref(navigator.onLine);

  onMounted(() => {
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
  });

  onUnmounted(() => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  });

  function onOnline() {
    isOnline.value = true;
  }

  function onOffline() {
    isOnline.value = false;
  }

  return isOnline;
}
