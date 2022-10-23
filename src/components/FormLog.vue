<template lang="pug">
form(:class="style.form", action="submit", @submit.prevent="login")
   h1(:class="style.title") Вход
   div(:class="style.enter")
      div(:class="style.input_title") Е-мэйл
      v-input( 
         type="text", 
         placeholder="email",
         v-model="form.email.value",
         @blur="form.email.blur",
         )
      small(:class="style.error_message") {{ emailErrorMessage}}
   div(:class="style.enter")
      div(:class="style.input_title") Пароль
      v-input(
         type="password", 
         placeholder="password",
         v-model="form.password.value",
         @blur="form.password.blur"
         )
      small(:class="style.error_message") {{ passwordErrorMessage }}
   div(:class="style.submit")
      v-button(type="submit", :disabled="!form.valid") Вход
      LoadingWheel(:class="style.submit_wheel", v-if="isLoading")
   div(:class="style.swap") Не зарегестрированы? 
      span(@click="$emit('swap')") Регистрация
   div(:class="style.swap") Забыли пароль? 
      span(@click="$emit('restore')") Восстановить
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useForm } from '@/hooks/useForm'
import { LogForm } from '@/intefaces/interfaces'
import { useStore } from '@/store/mainStore'
import { useHeaderStore } from '@/store/headerStore'
import style from '@/assets/scss/modules/AuthForm.module.scss'
import Constants from '@/libs/Constants'
import AuthService from '@/api/services/AuthService'

const store = useStore();
const headerStore = useHeaderStore();
const form = useForm<LogForm>(Constants.LogFormInit);
const emailError = ref('');
const passwordError = ref('');
const isLoading = ref(false);

const emailErrorMessage = computed(() => {
   if (form.email.errors.required && form.email.touched) {
      emailError.value = '';
      return 'Введите е-мэйл!';
   } else if (form.email.errors.isEmail && form.email.touched) {
      emailError.value = '';
      return 'Это не е-мэйл!';
   }
   return emailError.value;
});

const passwordErrorMessage = computed(() => {
   if (form.password.errors.required && form.password.touched) {
      passwordError.value = '';
      return 'Введите пароль!';
   } else if (form.password.errors.minLength && form.password.touched) {
      passwordError.value = '';
      return `Пароль должен содержать 6-20 символов!`;
   }
   return passwordError.value;
});

function login(): void {
   isLoading.value = true;
   AuthService.login(form.email.value, form.password.value)
      .then((response) => {
         localStorage.setItem('token', response.data.accessToken);
         store.user = response.data.user;
         headerStore.hideWindow();
      })
      .catch((e: any) => {
         const message = e?.response?.data?.message;
         if(e?.response?.data?.errors[0] === 'email') emailError.value = message;
         else if(e?.response?.data?.errors[0] === 'password') passwordError.value = message;
      })
      .finally(() => isLoading.value = false);
}
</script>
