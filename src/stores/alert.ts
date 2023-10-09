import type { IAlert, INotice } from '@/types';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { useAudioAlert } from '@/hooks';
import { NoticeService } from '@/api/services';
import { useStore } from '@/stores';

export const useAlertStore = defineStore('alert', () => {
  const { play } = useAudioAlert('/audio/new-message.mp3');
  const { user } = storeToRefs(useStore());
  const muted = ref(false);
  const alerts = ref<IAlert[]>([]);
  const leaved = ref(false);
  const notices = ref<Map<string, INotice>>(new Map());

  onMounted(() => {
    document.addEventListener('visibilitychange', onVisibilityChange);
    Notification.permission === 'denied' && Notification.requestPermission();
  });
  onUnmounted(() => document.removeEventListener('visibilitychange', onVisibilityChange));

  const unwatch = watch(user, (n) => {
    if (n) {
      NoticeService.index()
        .then((nts) => nts.forEach((n) => notices.value.set(n._id, n)))
        .then(unwatch);
    }
  });

  function onVisibilityChange() {
    document.visibilityState === 'visible' ? (leaved.value = false) : (leaved.value = true);
  }

  function setMuted() {
    muted.value = !muted.value;
  }

  function addNotice(title: string, text: string) {
    NoticeService.store({ title, text }).then((notice) => notices.value.set(notice._id, notice));
    !muted.value && play();
  }

  function addAlert(type: IAlert['type'], message: string) {
    alerts.value.push({ _id: Date.now().toString(), visible: true, message, type });
    !muted.value && play();
  }

  function sendPushNotification(title: string, opts?: NotificationOptions) {
    if (muted.value || !leaved.value) return;
    Notification.permission === 'granted' && new Notification(title, opts);
  }

  return { muted, setMuted, alerts, addAlert, notices, addNotice, sendPushNotification };
});
