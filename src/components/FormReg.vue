<template lang="pug">
form(:class="style.form", action="submit", @submit.prevent="registration")
   h1(:class="style.title") Регистрация
   div(:class="style.enter")
      div(:class="style.input_title") Имя
      v-input( 
         type="text", 
         placeholder="Ваше имя",
         v-model="form.name.value",
         @blur="form.name.blur"
         )
      small(:class="style.error_message") {{ nameErrorMessage}}
   div(:class="style.enter")
      div(:class="style.input_title") Е-мэйл
      v-input(
         type="text", 
         placeholder="Ваш е-мэйл",
         v-model="form.email.value",
         @blur="form.email.blur"
         )
      small(:class="style.error_message") {{ emailErrorMessage }}
   div(:class="style.enter")
      div(:class="style.input_title") Пароль
      v-input(
         type="password", 
         placeholder="Ваш пароль",
         v-model="form.password.value",
         @blur="form.password.blur"
         )
      small(:class="style.error_message") {{ passwordErrorMessage }}
   div(:class="style.submit")
      v-button(type="submit", :disabled="!form.valid") Регистрация
      LoadingWheel(:class="style.submit_wheel", v-if="isLoading")
   div(:class="style.swap") Уже зарегестрированы? 
      span(@click="$emit('swap')") Вход
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RegForm } from '@/intefaces/interfaces'
import { useForm } from '@/hooks/useForm'
import { useStore } from '@/store/mainStore'
import { useHeaderStore } from '@/store/headerStore'
import Constants from '@/libs/Constants'
import AuthService from '@/api/services/AuthService'
import style from '@/assets/scss/modules/AuthForm.module.scss'

const store = useStore();
const headerStore = useHeaderStore();
const form = useForm<RegForm>(Constants.RegFormInit);
const emailError = ref('');
const passwordError = ref('');
const isLoading = ref(false);

const nameErrorMessage = computed(() => {
   if (form.name.errors.required && form.name.touched) {
      return 'Это обязательное поле!';
   }
   return '';
});

const emailErrorMessage = computed(() => {
   if (form.email.errors.required && form.email.touched) {
      emailError.value = '';
      return 'Введите е-мэйл!';
   } else if (form.email.errors.isEmail && form.email.touched) {
      emailError.value = "";
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

function registration(): void {
   isLoading.value = true;
   AuthService.registration(form.email.value, form.password.value, form.name.value)
      .then((response) => {
         localStorage.setItem('token', response.data.accessToken);
         store.user = response.data.user;
         headerStore.hideWindow();
      })
      .catch((e: any) => {
         const message = e?.response?.data?.message;
         if (e?.response?.data?.errors[0] === 'email') emailError.value = message;
         else if (e?.response?.data?.errors[0] === 'email') passwordError.value = message;
      })
      .finally(() => isLoading.value = false);
}
</script>