import type { IUser, ITheme } from '@/types';
import { ref, computed, watchEffect } from 'vue';
import { defineStore } from 'pinia';
import { useQuasar } from 'quasar';
import { AuthService, ToolsService } from '@/api/services';
import { useI18n } from 'vue-i18n';

export const useStore = defineStore('main', () => {
  const $q = useQuasar();
  const { locale, availableLocales, setLocaleMessage } = useI18n();
  const user = ref<IUser | null>(null);
  const theme = ref(localStorage.getItem('theme') as ITheme);
  const isPageLoading = ref(false);
  const lang = ref(localStorage.getItem('lang') || 'ru');
  const isAuth = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.roles.includes('admin') || false);
  const currentTheme = computed(() => {
    if (theme.value === 'dark' || theme.value === 'light') {
      return theme.value;
    } else if (theme.value === 'system') {
      return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      return 'light';
    }
  });

  watchEffect(() => {
    currentTheme.value === 'dark' ? $q.dark.set(true) : $q.dark.set(false);
    document.documentElement.setAttribute('class', currentTheme.value);
    localStorage.setItem('theme', currentTheme.value);
  });
  watchEffect(() => setLocale(lang.value).then(() => localStorage.setItem('lang', lang.value)));

  function setTheme() {
    currentTheme.value === 'dark' ? (theme.value = 'light') : (theme.value = 'dark');
  }

  function refresh() {
    return AuthService.refresh()
      .then((response) => {
        localStorage.setItem('token', response.accessToken);
        user.value = response.user;
      })
      .catch(console.error);
  }

  function logout() {
    AuthService.logout()
      .then((response) => {
        localStorage.removeItem('token');
        user.value = response;
      })
      .catch(console.error);
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
  };
});
