<template lang="pug">
form(class="form", action="submit", @submit.prevent="login", autocomplete="off")
   h1(class="title") Вход
   div(class="enter")
      v-text-field(
         label="Е-мэйл",
         v-model="form.email.value",
         :error-messages="emailError",
         type="email"
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
         :error-messages="passwordError",
         )
   div(class="submit")
      v-btn(type="submit", :disabled="!form.valid") Вход
      LoadingWheel(class="submit_wheel", v-if="isLoading")
   div(class="swap") Не зарегестрированы? 
      span(@click="emit('swap')") Регистрация
   div(class="swap") Забыли пароль? 
      span(@click="emit('restore')") Восстановить
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from '@/hooks/useForm'
import type { LogForm } from '@/interfaces/interfaces'
import { useStore } from '@/store/mainStore'
import Constants from '@/libs/Constants'
import AuthService from '@/api/services/AuthService'
import LoadingWheel from './UI/LoadingWheel.vue'


const emit = defineEmits(['swap', 'restore', 'show', 'visible']);

const store = useStore();
const form = useForm<LogForm>(Constants.LogFormInit);
const emailError = ref('');
const passwordError = ref('');
const isLoading = ref(false);
const showPassword = ref(false);

function login(): void {
   isLoading.value = true;
   AuthService.login(form.email.value, form.password.value)
      .then((response) => {
         localStorage.setItem('token', response.data.accessToken);
         store.user = response.data.user;
         emit('show');
         emit('visible', false);
      })
      .catch((e: any) => {
         const message = e?.response?.data?.message;
         if (e?.response?.data?.errors[0] === 'email') emailError.value = message;
         else if (e?.response?.data?.errors[0] === 'password') passwordError.value = message;
      })
      .finally(() => {
         isLoading.value = false;
      });
}
</script>


<style lang="scss" scoped>
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
