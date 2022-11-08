<template lang="pug">
v-button(class="home_button", @click="$router.push('/')") На главную
div(class="container")
   h1 Восстановление пароля
   form(class="form", v-if="!link", @submit.prevent="sendMail")
      div(class="form_title") Адрес электронной почты
      div(class="form_block")
         input(
            type="text",
            class="form_input", 
            placeholder="Ваш е-мэйл", 
            :value="restore.email.value", 
            @input="restore.email.setEmail.call(restore.email, $event)"
            )
         div(class="form_buttons")
            LoadingWheel(v-if="restore.email.isLoading")
            ButtonImage(
               image="images/confirm.png"
               v-if="!restore.email.errorMessage && restore.email.value", 
               type="submit", 
               :disabled="restore.email.isLoading"
               )
      div(class="form_message")
         small(class="message_error") {{ restore.email.errorMessage }}
         div(class="message_success") {{ restore.email.successMessage }} 
   form(class="form", v-else-if="link", @submit.prevent="restorePassword")
      div(class="form_title") Введите новый пароль
      div(class="form_block")
         input(
            type="password",
            class="form_input", 
            placeholder="Новый пароль", 
            :value="restore.password.value",
            @input="restore.password.setPassword.call(restore.password, $event)"
            )
         div(class="form_buttons")
            LoadingWheel(v-if="restore.password.isLoading")
            ButtonImage(
               image="images/confirm.png",
               v-if="!restore.password.errorMessage && restore.password.value", 
               type="submit",
               :disabled="restore.password.isLoading"
               )
      div(class="form_message")
         small(class="message_error") {{ restore.password.errorMessage }}
         div(class="message_success") {{ restore.password.successMessage }}
</template>
   
<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import Validate from "@/libs/Validate"
import AuthService from '@/api/services/AuthService'


const link = computed(() => useRoute().query.link);
const restore = reactive({
   email: {
      value: '',
      errorMessage: '',
      successMessage: '',
      isLoading: false,
      setEmail(event: Event): void {
         const target = event.target as HTMLInputElement;
         this.value = target.value;
         !Validate.isEmail(this.value) ? this.errorMessage = '! Введите корректный е-мэйл.' : this.errorMessage = '';
      }
   },
   password: {
      value: '',
      errorMessage: '',
      successMessage: '',
      isLoading: false,
      setPassword(event: Event): void {
         const target = event.target as HTMLInputElement;
         this.value = target.value;
         (this.value.length < 6) ? this.errorMessage = '! Пароль должен содержать 6-20 символов.' : this.errorMessage = '';
      }
   }
});

async function sendMail(): Promise<void> {
   try {
      restore.email.isLoading = true;
      const response = await AuthService.sendMail(restore.email.value);
      restore.email.successMessage = response.data.message;
      restore.email.errorMessage = '';
      restore.email.value = '';
   } catch (e: any) {
      restore.email.errorMessage = e?.response.data.message;
      restore.email.successMessage = '';
   } finally {
      restore.email.isLoading = false;
   }
};

async function restorePassword(): Promise<void> {
   try {
      restore.password.isLoading = true;
      const response = await AuthService.restorePassword(restore.password.value, link.value as string);
      restore.password.successMessage = response.data.message;
      restore.password.errorMessage = '';
      restore.password.value = '';
   } catch (e: any) {
      restore.password.successMessage = '';
      restore.password.errorMessage = e?.response.data.message;
   } finally {
      restore.password.isLoading = false;
   }
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

.form {

   &>* {
      margin-top: 5px;
   }

   & .form_title {
      color: #475366;
      font-weight: 700;
   }

   & .form_block {
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      & .form_buttons {
         display: flex;
         align-items: center;
         padding: 3px;
         width: 70px;

         &>*:not(:first-child) {
            margin-left: 3px;
         }
      }

      & .form_input {
         -webkit-appearance: none;
         -moz-appearance: none;
         appearance: none;
         outline: 0;
         border-radius: 4px;
         padding: 5px 10px;
         font-size: 13px;
         background: #fff;
         border: 2px solid #cfd7e6;
         box-shadow: inset 0 1px 2px 0 rgb(207 215 230 / 40%);
         letter-spacing: 1px;
         font-size: 1em;
         transition: all .1s ease;
         width: 30%;
         height: 42px;
         min-width: 240px;

         &:focus {
            border: 2px solid var(--water-color);
         }

      }
   }

   & .form_message {
      font-weight: bold;

      & .message_error {
         color: var(--error-message-color);
      }

      & .message_success {
         color: green;
      }
   }
}

@media(max-width: 768px) {

   .container {
      & h1 {
         text-align: center;
      }
   }
}
</style>