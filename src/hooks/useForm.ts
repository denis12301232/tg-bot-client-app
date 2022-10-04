import { reactive, computed } from 'vue'
import { useFormField } from './useFormField'
import { AnyObject } from '@/intefaces/interfaces'

export function useForm<T>(init: AnyObject = {}): T {
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