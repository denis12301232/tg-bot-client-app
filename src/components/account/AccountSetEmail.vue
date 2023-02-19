<template lang="pug">
QForm(class="form" ref="formRef" @submit.prevent="onUpdateEmail")
   QInput(
      v-model="email" 
      class="form_input" 
      label="Е-мэйл" 
      outlined 
      :rules="emailRules"
      :error="!!error"
      :error-message="error"
      lazy-rules
      )
      template(#append)
         QIcon(name="email")
   QBtn(class="form_button" type="submit" color="primary"  :disable="!valid" :loading="isEmailLoading") Изменить
</template>

<script setup lang="ts">
import type { QForm } from 'quasar'
import { ref, watch } from 'vue'
import { useFetch } from '@/hooks'
import { ToolsService } from '@/api/services'
import { Validate } from '@/util'


const props = defineProps<{
   email: string;
}>();

const formRef = ref<QForm | null>(null);
const email = ref(props.email);
const valid = ref(false);
const { f: onUpdateEmail, loading: isEmailLoading, error } = useFetch({
   fn: () => ToolsService.setNewEmail(email.value)
      .then(() => {
         setTimeout(() => {
            email.value = '';
            formRef.value?.reset();
         }, 0);
      }),
   successMsg: 'Изменено',
   alert: true
});
const emailRules = [
   (v: string) => Validate.required(v) || 'Это обязательное поле',
   (v: string) => Validate.isEmail(v) || 'Введите корректный е-мэйл'
];

watch(email, async () => {
   valid.value = await formRef.value?.validate() && !isEmailLoading.value || false;
});
</script>

<style scoped lang="scss">
.form {
   margin-top: 10px;

   & .form_input {
      margin-top: 5px;

      & i {
         cursor: pointer;
         color: $primary;

         &:hover {
            color: $secondary;
         }
      }
   }

   & .form_button {
      margin-top: 5px;
   }
}
</style>