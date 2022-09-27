import { reactive, computed } from 'vue'
import { useFormField } from './useFormField'

export function useForm<T>(init: { [name: string]: any } = {}): T {
   const form: any = reactive({});

   for (const [key, value] of Object.entries(init)) {
      form[key] = useFormField(value);
   }

   form.valid = computed(() => {
      return Object.keys(form)
         .filter(item => item !== 'valid')
         .every(item => form[item].valid);
   });

   return form;
}