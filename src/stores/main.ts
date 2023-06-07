import type { IUser, Langs, IAlertType, ITheme } from '@/types';
import { ref, computed, watch, watchEffect } from 'vue';
import { defineStore } from 'pinia';
import { useQuasar } from 'quasar';
import { AuthService } from '@/api/services';
import { i18n } from '@/main';
import { ToolsService } from '@/api/services';
import { Alert } from '@/util';


export const useStore = defineStore('main', () => {
  const $q = useQuasar();
  const user = ref<IUser | null>(null);
  const theme = ref<ITheme>(localStorage.getItem('theme') as ITheme);
  const isPageLoading = ref(false);
  const lang = ref((localStorage.getItem('lang') as Langs) || 'ru');
  const alerts = ref<Alert[]>([]);
  const isAuth = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.roles.includes('admin') || false);
  const currentTheme = computed(() => {
    switch (theme.value) {
      case 'light':
      case 'dark':
        return theme.value;
      case 'system':
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      default:
        return 'light';
    }
  });

  watch(
    currentTheme,
    (n) => {
      const html = document.querySelector('html');
      n === 'dark' ? $q.dark.set(true) : $q.dark.set(false);
      html?.setAttribute('class', n);
      localStorage.setItem('theme', n);
    },
    { immediate: true }
  );
  watchEffect(() => setLocale(lang.value).then(() => localStorage.setItem('lang', lang.value)));

  function setTheme() {
    currentTheme.value === 'dark' ? (theme.value = 'light') : (theme.value = 'dark');
  }

  function addAlert(type: IAlertType, message: string) {
    const alert = new Alert(type, message);
    alerts.value.push(alert);
  }


  async function refresh() {
    try {
      const response = await AuthService.refresh();
      localStorage.setItem('token', response.accessToken);
      user.value = response.user;
    } catch (e: any) {
      console.error(e);
    }
  }

  async function logout() {
    try {
      const response = await AuthService.logout();
      localStorage.removeItem('token');
      user.value = response;
    } catch (e: any) {
      console.error(e);
    }
  }

  async function setLocale(locale: any) {
    if (!i18n.global.availableLocales.includes(locale)) {
      const messages = await ToolsService.fetchLocale(locale);
      if (messages === undefined) {
        return;
      }
      i18n.global.setLocaleMessage(locale, messages);
    }
    i18n.global.locale.value = locale;
  }

  return {
    user,
    theme,
    isPageLoading,
    lang,
    isAuth,
    isAdmin,
    currentTheme,
    setTheme,
    refresh,
    logout,
    alerts,
    addAlert
  };
});
