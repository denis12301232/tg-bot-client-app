import type { IUser } from '@/types/interfaces'
import { defineStore } from 'pinia'
import { ref, reactive, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { AuthService } from '@/api/services'


export const useStore = defineStore('main', () => {
  const $q = useQuasar();
  const user = ref<IUser>({} as IUser);
  const theme = ref(localStorage.getItem('theme') || 'light');
  const alert = reactive<{ type: 'success' | 'info' | 'warning' | 'error', message: string, visible: boolean }>({ type: 'success', message: '', visible: false });

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

  function setAlert({ type = 'success', message, visible }: { type?: 'success' | 'info' | 'warning' | 'error', message: string, visible: boolean }) {
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
      console.log(e);
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

  return { user, alert, isAuth, isAdmin, currentTheme, setTheme, setAlert, refresh, logout };
});


// static async refresh(): Promise<void> {
//   await AuthService.refresh()
//      .then((response) => {
//         const store = useStore();
//         localStorage.setItem('token', response.data.accessToken);
//         store.user = response.data.user;
//      })
//      .catch((e: any) => console.log(e?.response?.data?.message));
// }

// static async logout(): Promise<void> {
//   await AuthService.logout()
//      .then(() => {
//         const store = useStore();
//         localStorage.removeItem('token');
//         store.user = <IUser>{};
//      })
//      .catch((e: any) => console.log(e?.response?.data?.message));
// }