import { ref } from 'vue'
import { AxiosError } from 'axios'
import { useStore } from '@/store/mainStore'

type FetchingArgs = {
   callback: (...args: any) => Promise<any>;
   alert?: boolean;
   errorMessage?: string;
   successMessage?: string;
}

export function useFetching<T = any>({ callback, alert = true, errorMessage, successMessage }: FetchingArgs) {
   const store = useStore();
   const error = ref('');
   const success = ref('');
   const isLoading = ref(false);
   const data = ref<T | null>(null);

   async function fetchFunc(...args: any) {
      try {
         isLoading.value = true;
         const response = await callback(...args);
         data.value = response?.data;
         success.value = successMessage || 'Success';
         if (alert) store.setAlert('success', success.value);
      } catch (e: any) {
         if (errorMessage) error.value = errorMessage;
         else if (e instanceof AxiosError) error.value = e?.response?.data?.message;
         else if (e instanceof Error) error.value = e.message;
         else error.value = 'Unknown Error';
         if (alert) store.setAlert('error', error.value);
      } finally {
         isLoading.value = false;
         if (alert) store.showAlert(true);
      }
   }
   return { error, success, isLoading, data, fetchFunc }
}