import { AssistanceFormValidators } from '@/interfaces/interfaces'
import { computed } from 'vue'

export function useAssistanceValidation(form: AssistanceFormValidators) {
   const validFio = computed(() => {
      return ((form.surname.errors.required
         || form.name.errors.required
         || form.patronymic.errors.required)
         && (form.surname.touched
            || form.name.touched
            || form.patronymic.touched
         ));
   });
   const validPhone = computed(() => {
      return [form.phone.errors.required && form.phone.touched, form.phone.errors.isPhone && form.phone.touched];
   });
   const validBirth = computed(() => {
      return [form.birth.errors.required && form.birth.touched, form.birth.errors.isDDMMYYYY && form.birth.touched];
   });
   const validAddress = computed(() => {
      return ((form.district.errors.required
         || form.house.errors.required
         || form.flat.errors.required)
         && (form.district.touched
            || form.house.touched
            || form.flat.touched));
   });
   const validPeopleNum = computed(() => {
      return form.people_num.errors.required && form.people_num.touched;
   });

   return { validFio, validPhone, validBirth, validAddress, validPeopleNum }
}