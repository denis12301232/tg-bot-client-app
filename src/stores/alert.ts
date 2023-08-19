import type { IAlertType } from '@/types';
import { onMounted, onUnmounted, ref, watchEffect } from 'vue';
import { defineStore } from 'pinia';
import { Alert, ChatAlert, Notice } from '@/models';

export const useAlertStore = defineStore('alert', () => {
  const muted = ref(false);
  const alerts = ref<Array<Alert | ChatAlert>>([]);
  const notices = ref<Notice[]>(JSON.parse(localStorage.getItem('notices') || '') || []);
  const leaved = ref(false);

  onMounted(() => {
    Notification.permission === 'denied' && Notification.requestPermission();
    document.addEventListener('visibilitychange', onVisibilityChange);
  });
  onUnmounted(() => document.removeEventListener('visibilitychange', onVisibilityChange));
  watchEffect(() => localStorage.setItem('notices', JSON.stringify(notices.value)));

  function onVisibilityChange() {
    document.visibilityState === 'visible' ? (leaved.value = false) : (leaved.value = true);
  }

  function setMuted() {
    muted.value = !muted.value;
  }

  function addNotice(title: string, text: string) {
    notices.value.push(new Notice(title, text));
  }

  function addAlert(type: IAlertType, message: string) {
    alerts.value.push(new Alert(type, message));
  }

  function sendPushNotification(title: string, opts?: NotificationOptions) {
    if (muted.value || !leaved.value) return;
    Notification.permission === 'granted' && new Notification(title, opts);
  }

  return { muted, setMuted, alerts, addAlert, notices, addNotice, sendPushNotification };
});
