import type { IUser, IAlertType, ITheme } from '@/types';
import { ref, computed, watchEffect } from 'vue';
import { defineStore } from 'pinia';
import { useQuasar } from 'quasar';
import { AuthService, ToolsService } from '@/api/services';
import { useI18n } from 'vue-i18n';
import { Alert, ChatAlert } from '@/models';

export const useStore = defineStore('main', () => {
  const $q = useQuasar();
  const { locale, availableLocales, setLocaleMessage } = useI18n();
  const user = ref<IUser | null>(null);
  const theme = ref(localStorage.getItem('theme') as ITheme);
  const isPageLoading = ref(false);
  const lang = ref(localStorage.getItem('lang') || 'ru');
  const alerts = ref<(Alert | ChatAlert)[]>([]);
  const isAuth = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.roles.includes('admin') || false);
  const currentTheme = computed(() => {
    if (theme.value === 'dark' || theme.value === 'light') {
      return theme.value;
    } else if (theme.value === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      return 'light';
    }
  });
  watchEffect(() => {
    const html = document.querySelector('html');
    currentTheme.value === 'dark' ? $q.dark.set(true) : $q.dark.set(false);
    html?.setAttribute('class', currentTheme.value);
    localStorage.setItem('theme', currentTheme.value);
  });
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

  async function setLocale(lang: string) {
    if (!availableLocales.includes(lang)) {
      const msgs = await ToolsService.fetchLocale(lang);
      availableLocales.push(lang);
      if (msgs === undefined) {
        return;
      }
      setLocaleMessage(lang, msgs);
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
