import { ref } from 'vue'
import { useStore } from '@/stores'


interface FetchArgs<T extends (...args: any[]) => any> {
  fn: T;
  successMsg?: string;
  errorMsg?: string;
  alert?: boolean;
}

export default function useFetch<D, T extends (...args: any[]) => any = (...args: any[]) => any>({ fn, successMsg, errorMsg, alert = false }: FetchArgs<T>) {
  const { setAlert } = useStore();
  const data = ref<D>();
  const loading = ref(false);
  const success = ref('');
  const error = ref('');

  async function f(...args: Parameters<T>) {
    try {
      alert && setAlert('success', { message: '', visible: false });
      loading.value = true;
      const response = await fn(...args);
      data.value = response?.data || response;
      successMsg ? (success.value = successMsg) : 'Success';
      alert && setAlert('success', { message: success.value, visible: true });
    } catch (e) {
      if (errorMsg) {
        error.value = errorMsg;
      } else {
        e instanceof Error && (error.value = e.message);
      }
      alert && setAlert('error', { message: error.value, visible: true });
    } finally {
      loading.value = false;
    }
  }

  return { data, loading, success, error, f };
}