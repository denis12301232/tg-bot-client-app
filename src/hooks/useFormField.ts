import { ref, reactive, watch } from 'vue'

interface Field {
   value: string;
   validators: {
      [name: string]: (value: string) => boolean;
   };
}

export function useFormField(field: Field) {
   const valid = ref(true);
   const value = ref(field.value);
   const touched = ref(false);
   const errors = reactive<{ [name: string]: boolean }>({});

   const validate = (value: string): void => {
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