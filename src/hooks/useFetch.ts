import { ref } from 'vue'
import { useStore } from '@/stores'


interface FetchArgs {
   fn: (...args: any) => any;
   successMsg?: string;
   errorMsg?: string;
   alert?: boolean;
}

export function useFetch<T>({ fn, successMsg, errorMsg, alert = false }: FetchArgs) {
   const { setAlert } = useStore();
   const data = ref<T>();
   const loading = ref(false);
   const success = ref('');
   const error = ref('');

   async function f(...args: any) {
      try {
         if (alert) {
            setAlert({ message: '', visible: true });
         }
         loading.value = true;
         const response = await fn(...args);
         data.value = response?.data;
         successMsg ? success.value = successMsg : 'Success';

         if (alert) {
            setAlert({ type: 'success', message: success.value, visible: true });
         }
      } catch (e) {
         if (errorMsg) {
            error.value = errorMsg;
         } else {
            if (e instanceof Error) {
               error.value = e.message;
            }
         }

         if (alert) {
            setAlert({ type: 'error', message: error.value, visible: true });
         }
      } finally {
         loading.value = false;
      }
   }

   return { data, loading, success, error, f }
}