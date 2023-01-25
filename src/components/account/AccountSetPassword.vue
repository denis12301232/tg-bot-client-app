<template lang="pug">
QForm(class="form" ref="formRef" @submit.prevent="onUpdatePassword")
   QInput(
      v-model="password.old.value" 
      class="form_input" 
      label="Старый пароль" 
      outlined 
      :type="password.old.visible ? 'text' : 'password'"
      lazy-rules
      :error="!!error"
      :error-message="error"
      )
      template(#append)
         QIcon(:name="password.old.visible ? 'visibility' : 'visibility_off'" @click="setPasswordVisible('old')")
   QInput(
      v-model="password.new.value" 
      class="form_input" 
      label="Новый пароль" 
      outlined
      :type="password.new.visible ? 'text' : 'password'"
      :rules="passwordRules"
      lazy-rules
      )
      template(#append)
         QIcon(:name="password.new.visible ? 'visibility' : 'visibility_off'" @click="setPasswordVisible('new')")
   QBtn(class="form_button" type="submit" color="primary" :loading="isPasswordLoading" :disable="!valid") Изменить
</template>

<script setup lang="ts">
import type { QForm } from 'quasar'
import { reactive, ref, watch } from 'vue'
import { useFetch } from '@/hooks'
import { ToolsService } from '@/api/services'
import { Validate } from '@/util'


const formRef = ref<QForm | null>(null);
const valid = ref(false);
const password = reactive({
   new: {
      value: '',
      visible: false,
   },
   old: {
      value: '',
      visible: false,
   },
});
const { f: onUpdatePassword, loading: isPasswordLoading, error } = useFetch({
   fn: () => ToolsService.setNewPassword(password.new.value, password.old.value)
      .then(() => {
         password.new.value = '';
         password.old.value = '';
         setTimeout(() => {
            error.value = '';
            formRef.value?.reset();
            formRef.value?.resetValidation()
         }, 0);
      }),
   successMsg: 'Изменено',
   alert: true
});
const passwordRules = [
   (v: string) => Validate.required(v) || 'Это обязательное поле',
   (v: string) => Validate.lengthInterval(6, 20)(v) || 'Пароль должен содержать от 6 до 20 символов'
];

watch(() => password.new.value, async () => {
   valid.value = await formRef.value?.validate() && !isPasswordLoading.value || false;
});


function setPasswordVisible(value: 'old' | 'new') {
   password[value].visible = !password[value].visible;
}
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