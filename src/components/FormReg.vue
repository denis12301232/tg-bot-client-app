<template lang="pug">
form(class="form", action="submit", @submit.prevent="registration")
   h1(class="title") Регистрация
   div(class="enter")
      v-text-field(
         label="Имя",
         v-model="form.name.value",
         :rules="nameRules",
         autocomplete="username"
      )
   div(class="enter")
      v-text-field(
         label="Е-мэйл",
         v-model="form.email.value",
         :rules="emailRules",
         :error-messages="emailError",
         autocomplete="username"
      )
   div(class="enter")
      v-text-field(
         label="Пароль", 
         v-model="form.password.value", 
         autocomplete="new-password", 
         :type="showPassword ? 'text' : 'password'",
         :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'",
         @click:append-inner="showPassword = !showPassword",
         :rules="passwordRules"
         )
   div(class="submit")
      v-btn(type="submit", :disabled="!form.valid") Регистрация
      LoadingWheel(class="submit_wheel", v-if="isLoading")
   div(class="swap") Уже зарегестрированы? 
      span(@click="emit('swap')") Вход
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { RegForm } from '@/interfaces/interfaces'
import { useForm } from '@/hooks/useForm'
import { useStore } from '@/store/mainStore'
import Constants from '@/libs/Constants'
import AuthService from '@/api/services/AuthService'
import LoadingWheel from './UI/LoadingWheel.vue'
import Validate from '@/libs/Validate'


const emit = defineEmits(['show', 'swap']);

const store = useStore();
const form = useForm<RegForm>(Constants.RegFormInit);
const emailError = ref('');
const passwordError = ref('');
const isLoading = ref(false);
const showPassword = ref(false);

const nameRules = [
   (v: string) => Validate.required(v) || 'Это обязательное поле',
];
const emailRules = [
   (v: string) => Validate.isEmail(v) || 'Введите корректный е-мэйл',
];
const passwordRules = [
   (v: string) => Validate.lengthInterval(6, 20)(v) || 'Пароль должен содержать 6-20 символов',
];

function registration(): void {
   isLoading.value = true;
   AuthService.registration(form.email.value, form.password.value, form.name.value)
      .then((response) => {
         localStorage.setItem('token', response.data.accessToken);
         store.user = response.data.user;
         emit('show');
      })
      .catch((e: any) => {
         const message = e?.response?.data?.message;
         if (e?.response?.data?.errors[0] === 'email') emailError.value = message;
         else if (e?.response?.data?.errors[0] === 'password') passwordError.value = message;
      })
      .finally(() => isLoading.value = false);
}
</script>


<style lang="scss">
.form {
   text-align: center;
   min-width: 280px;
   padding: 0;
   margin: 10px;

   & .title {
      padding: 0px 0px 30px 0px;
      color: rgb(38, 43, 150);
   }

   & .enter {
      margin-top: 5px;
   }

   & .submit {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;

      & .submit_wheel {
         margin-top: 10px;
      }
   }

   & .swap {
      margin-top: 10px;

      &>span {
         color: rgb(38, 43, 150);
         cursor: pointer;
         font-weight: 700;
      }

      &>span:hover {
         border-bottom: 1px solid #2c3e50;
         color: #113c64;
      }
   }
}
</style>