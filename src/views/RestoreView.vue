<template lang="pug">
v-btn(class="home_button", @click="$router.push('/')") На главную
div(class="container")
   h1(class="title") Восстановление пароля
   v-form(v-if="!link", @submit.prevent="sendRestoreMail", ref="emailFormRef")
      div(class="form_block")
         v-text-field(
            type="email", 
            label="Ваш е-мэйл", 
            v-model="email", 
            variant="solo", 
            class="form_input",
            :error-messages="emailError"
            :rules="emailRules"
            )
         div(class="form_buttons")
            LoadingWheel(v-if="isEmailLoading")
      v-btn(type="submit", :disabled="isEmailLoading") Восстановить
      div(class="message_success") {{ emailSuccess }}
   v-form(v-else-if="link", @submit.prevent="restorePass", ref="passwordFormRef")
      div(class="form_block")
         v-text-field(
            label="Введите новый пароль", 
            v-model="password", 
            autocomplete="new-password", 
            :type="showPassword ? 'text' : 'password'",
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'",
            @click:append-inner="showPassword = !showPassword",
            :rules="passwordRules",
            variant="solo",
            :error-messages="passwordError"
            )
         div(class="form_buttons")
            LoadingWheel(v-if="isPasswordLoading")
      v-btn(type="submit") Изменить
      div(class="message_success") {{ passwordSuccess }}
</template>
   
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useFetching } from '@/hooks/useFetching'
import Validate from "@/libs/Validate"
import AuthService from '@/api/services/AuthService'

const email = ref('');
const password = ref('');
const link = computed(() => useRoute().query.link);
const showPassword = ref(false);
const emailFormRef = ref<any>(null);
const passwordFormRef = ref<any>(null);

const emailRules = [
   (v: string) => Validate.isEmail(v) || 'Введите корректный е-мэйл'
];
const passwordRules = [
   (v: string) => Validate.lengthInterval(6, 20)(v) || "Пароль должен содержать 6-20 символов"
];

const { fetchFunc: sendRestoreMail, isLoading: isEmailLoading, success: emailSuccess, error: emailError } =
   useFetching({
      callback: sendMail, alert: false, successMessage: 'Письмо отправлено на указанную почту', errorMessage: 'Ошибка отправки сообщения',
   });
const { fetchFunc: restorePass, isLoading: isPasswordLoading, success: passwordSuccess, error: passwordError } =
   useFetching({ callback: restorePassword, successMessage: 'Пароль изменен', errorMessage: 'Истек срок действия ссылки' });

async function sendMail() {
   emailSuccess.value = '';
   await AuthService.sendMail(email.value);
   emailFormRef.value?.reset();
};

async function restorePassword() {
   passwordSuccess.value = '';
   await AuthService.restorePassword(password.value, link.value as string);
   passwordFormRef.value?.reset();
};
</script>
   
<style lang="scss" scoped>
.home_button {
   margin: 10px 0px 0px 10px;
}

.container {
   width: 90%;
   margin: 0 auto;
}

.title {
   padding: 20px 0px;
}

.form_block {
   display: flex;
   place-items: center;
   width: 50%;

   & .form_input {
      flex-basis: 90%;
   }

   & .form_buttons {
      flex-basis: 10%;
   }
}

.message_success {
   padding: 10px 0;
   color: green;
}

@media (max-width:768px) {
   .form_block {
      width: 100%;
   }
}
</style>