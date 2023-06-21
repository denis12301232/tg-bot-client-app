import type { IUser, Langs, I18n, IAlertType, ITheme } from '@/types';
import { ref, computed, watch, watchEffect } from 'vue';
import { defineStore } from 'pinia';
import { useQuasar } from 'quasar';
import { AuthService } from '@/api/services';
import { ToolsService } from '@/api/services';
import { Alert } from '@/util';
import { useI18n } from 'vue-i18n';

export const useStore = defineStore('main', () => {
  const $q = useQuasar();
  const { locale, availableLocales, setLocaleMessage } = useI18n<I18n, Langs>();
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

  async function setLocale(lang: Langs) {
    if (!availableLocales.includes(lang)) {
      const messages = await ToolsService.fetchLocale(lang).json();
      availableLocales.push(lang);
      if (messages === undefined) {
        return;
      }
      setLocaleMessage(lang, messages as any);
    }
    locale.value = lang;
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
    addAlert,
  };
});
