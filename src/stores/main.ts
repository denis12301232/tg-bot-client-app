import type { IUser, AlertType } from '@/types'
import { defineStore } from 'pinia'
import { ref, reactive, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { AuthService } from '@/api/services'


export const useStore = defineStore('main', () => {
  const $q = useQuasar();
  const user = ref<IUser>({} as IUser);
  const theme = ref(localStorage.getItem('theme') || 'light');
  const isPageLoading = ref(false);
  const modal = ref(false);
  const alert = reactive<{ type: AlertType, message: string, visible: boolean }>({ type: 'success', message: '', visible: false });

  const isAuth = computed(() => !!Object.keys(user.value).length);
  const isAdmin = computed(() => user.value?.roles?.includes('admin'));
  const currentTheme = computed(() => {
    switch (theme.value) {
      case 'light':
      case 'dark':
        return theme.value;
      case 'system':
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          return 'dark';
        } else {
          return 'light';
        }
      default:
        return 'light';
    }
  });

  watch(currentTheme, (n, o) => {
    n === 'dark' ? $q.dark.set(true) : $q.dark.set(false);
    localStorage.setItem('theme', n);
  }, { immediate: true });

  function setTheme() {
    currentTheme.value === 'dark' ? theme.value = 'light' : theme.value = 'dark'
  }

  function setAlert({ type = 'success', message, visible }: { type?: AlertType, message: string, visible: boolean }) {
    alert.message = message;
    alert.type = type;
    alert.visible = visible;
  }

  async function refresh() {
    try {
      const response = await AuthService.refresh();
      localStorage.setItem('token', response.data.accessToken);
      user.value = response.data.user;
    } catch (e: any) {
      console.log(e.message);
    }
  }

  async function logout() {
    try {
      await AuthService.logout();
      localStorage.removeItem('token');
      user.value = <IUser>{};
    } catch (e: any) {
      console.log(e?.response?.data?.message)
    }
  }

  return { user, theme, isPageLoading, modal, alert, isAuth, isAdmin, currentTheme, setTheme, setAlert, refresh, logout };
});