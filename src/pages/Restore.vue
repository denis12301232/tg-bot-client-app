<template lang="pug">
div(class="container")
   h5(class="title text-primary") Адрес электронной почты
   QForm(v-if="!link" class="form" ref="emailForm" @submit.prevent="onSendMail")
      QInput(
         v-model="email" 
         outlined 
         label="Адрес электронной почты" 
         :rules="emailRules" 
         lazy-rules
         :error="!!errorSend"
         :error-message="errorSend"
         )
         template(#append)
            QIcon(name="email")
      QBtn(class="button" color="primary" type="submit" :loading="isSendLoading" :disable="!emailValid") Восстановить
      div(class="message") {{ successSend }}
   QForm(v-else class="form" ref="passwordForm" @submit.prevent="onRestorePassword")
      QInput(
         v-model="password" 
         outlined 
         label="Новый пароль" 
         :rules="passwordRules"
         :error="!!passwordError"
         :error-message="passwordError"
         lazy-rules,
         :type="isPasswordVisible ? 'text' : 'password'"
      )
         template(#append)
            QIcon(
               :name="isPasswordVisible ? 'visibility' : 'visibility_off'"
               @click="isPasswordVisible = !isPasswordVisible"
               )
      QBtn(class="button" type="submit" color="primary" :loading="isRestorePasswordLoading" :disable="!passwordValid") Изменить
</template>

<script setup lang="ts">
import type { QForm } from 'quasar'
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFetch } from '@/hooks'
import { AuthService } from '@/api/services'
import { Validate } from '@/util'


const route = useRoute();
const email = ref('');
const emailForm = ref<QForm | null>(null);
const emailValid = ref(false);
const password = ref('');
const isPasswordVisible = ref(false);
const passwordValid = ref(false);
const passwordForm = ref<QForm | null>(null)
const link = computed(() => route.query.link);
const { f: onSendMail, loading: isSendLoading, success: successSend, error: errorSend } = useFetch({
   fn: () => AuthService.sendMail(email.value),
   successMsg: 'На указаный адрес отправлено письмо',
   errorMsg: 'Письмо не отправлено'
});
const { f: onRestorePassword, loading: isRestorePasswordLoading, error: passwordError } = useFetch({
   fn: () => AuthService.restorePassword(password.value, link.value?.toString() || ''),

})
const emailRules = [
   (v: string) => Validate.required(v) || 'Заполните поле',
   (v: string) => Validate.isEmail(v) || 'Введите корректный е-мэйл'
];
const passwordRules = [
   (v: string) => Validate.required(v) || 'Заполните поле',
   (v: string) => Validate.lengthInterval(6, 20)(v) || 'Пароль должен содержать от 6 до 20 символов'
];

watch(email, async () => {
   emailValid.value = await emailForm.value?.validate() && !isSendLoading.value || false;
});
watch(password, async () => {
   passwordValid.value = await passwordForm.value?.validate() && !isRestorePasswordLoading.value || false;
});
</script>

<style scoped lang="scss">
.container {
   padding: 0 30px 30px 30px;
   width: 50%;

   & .title {
      margin: 20px 0 10px 0;
   }

   & .form {
      & i {
         color: $primary;
         cursor: pointer;

         &:hover {
            color: $secondary;
         }
      }

      & .button {
         margin-top: 5px;
      }

      & .message {
         color: $positive;
         padding: 5px 0;
         font-size: 1.1em;
         font-weight: bolder;
      }
   }
}

@media (max-width:1024px) {
   .container {
      width: 60%;
   }
}

@media (max-width:768px) {
   .container {
      width: 70%;
   }
}

@media (max-width:480px) {
   .container {
      width: 100%;
   }
}
</style>