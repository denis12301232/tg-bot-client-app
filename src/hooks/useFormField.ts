import { ref, reactive, watch, Ref } from 'vue';


export function useFormField(field: any) {
   const valid: Ref<boolean> = ref(true);
   const value: Ref<string> = ref(field.value);
   const touched: Ref<boolean> = ref(false);
   const errors: any = reactive({});

   const validate = (value: any): void => {
      valid.value = true;

      Object.keys(field.validators ?? {}).forEach(name => {
         const isValid = field.validators[name](value);
         errors[name] = !isValid;

         if (!isValid) valid.value = false;
      });
   }

   watch(value, validate, { immediate: true });

   return { value, valid, errors, touched, blur: (): boolean => touched.value = true };
}