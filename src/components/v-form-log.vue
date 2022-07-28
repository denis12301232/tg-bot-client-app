<template lang="pug">
form(:class="style.form", action="submit", @submit.prevent="submit")
   h1(:class="style.title") Вход
   div(:class="style.enter")
      div(:class="style.input_title") Е-мэйл
      v-input-find(
         :class="style.form_input", 
         type="text", 
         placeholder="email",
         v-model="form.email.value",
         @blur="form.email.blur"
         )
      small(:class="style.error_message") {{ emailErrorMessage }}
   div(:class="style.enter")
      div(:class="style.input_title") Пароль
      v-input-find(
         :class="style.form_input", 
         type="password", 
         placeholder="password",
         v-model="form.password.value",
         @blur="form.password.blur"
         )
      small(:class="style.error_message") {{ passwordErrorMessage }}
   div(:class="style.submit")
      v-button(type="submit", :disabled="!form.valid") Вход
      v-loading-wheel(v-if="isLoading")
   div(:class="style.swap") Не зарегестрированы? 
      span(@click="$emit('swap')") Регистрация
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { useForm } from "@/hooks/useForm";
import { LogForm } from "@/intefaces/interfaces"
import { LogFormInit } from "@/libs/constants"
import { useHeaderStore } from "@/store/headerStore";
import style from "@/assets/scss/modules/AuthForm.module.scss";
import AuthController from "@/api/controllers/AuthController";

const form: LogForm = useForm(LogFormInit);
const headerStore = useHeaderStore();
const emailError = ref("");
const passwordError = ref("");
const isLoading = ref(false);

const emailErrorMessage = computed(() => {
   if (form.email.errors.required && form.email.touched) {
      emailError.value = "";
      return "Введите е-мэйл!";
   } else if (form.email.errors.isEmail && form.email.touched) {
      emailError.value = "";
      return "Это не е-мэйл!";
   }
   return emailError.value;
});

const passwordErrorMessage = computed(() => {
   if (form.password.errors.required && form.password.touched) {
      passwordError.value = "";
      return "Введите пароль!";
   } else if (form.password.errors.minLength && form.password.touched) {
      passwordError.value = "";
      return `Пароль должен содержать 6-20 символов!`;
   }
   return passwordError.value;
});

const submit = async () => {
   isLoading.value = true;
   const { message, errors } = await AuthController.login(
      form.email.value,
      form.password.value
   );
   if (!errors.length) {
      headerStore.hideWindow()
   }
   else if (errors[0] === "email") {
      emailError.value = message;
   } else if (errors[0] === "password") {
      passwordError.value = message;
   }
   isLoading.value = false;
};

</script>

<style lang="scss" module>
.form {
   text-align: center;
   min-width: 300px;
   padding: 0;
   margin: 10px;

   & .title {
      color: rgb(38, 43, 150);
   }

   & .enter {
      margin-top: 10px;

      & .input_title {
         font-weight: 700;
         font-size: 1.3em;
         margin-bottom: 5px;
         color: rgb(38, 43, 150);
      }

      & .form_input {
         width: 100%;
      }
   }

   & .submit {
      margin-top: 10px;
   }

   & .swap {
      margin-top: 10px;

      &>span {
         color: $main-color;
         cursor: pointer;
         font-weight: 700;
      }

      &>span:hover {
         border-bottom: 1px solid $main-color;
         color: $main-color-hover;
      }
   }
}
</style>

<!-- <template lang="pug">
form(action="submit", @submit.prevent="submit", :class="styles.form")
   h1 Вход
   div(
      :class="[styles.form_input, { [styles.error]: (!form.email.valid && form.email.touched) || emailErrorMessage }]"
   )
      label(for="email") Е-мэйл
      InputForm#email(
         type="text",
         placeholder="email",
         v-model="form.email.value",
         @blur="form.email.blur"
      )
      small {{ emailErrorMessage }}
   div(
      :class="[styles.form_input, { [styles.error]: (!form.password.valid && form.password.touched) || passwordErrorMessage }]"
   )
      label(for="password") Пароль
      InputForm#password(
         type="password",
         placeholder="password",
         v-model="form.password.value",
         @blur="form.password.blur"
      )
      small {{passwordErrorMessage}}
   HeaderButton(type="submit", :disabled="!form.valid") Войти
   div(:class="styles.swap") Не зарегестрированы?
      span(@click="$emit('swap')") Регистрация
</template>
    
<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useForm } from "@/hooks/useForm";
import { AuthFormInit } from "@/libs/constants";
import { AuthForm } from "@/interfaces/AuthForm";
import { login } from "@/api/http/auth";
import { useHeaderStore } from "@/store/header";
import styles from "@/assets/scss/modules/AuthForm.module.scss";

export default defineComponent({
   setup() {
      const form: AuthForm = useForm(AuthFormInit);
      const headerStore = useHeaderStore();
      const emailError = ref("");
      const passwordError = ref("");

      const emailErrorMessage = computed(() => {
         if (form.email.errors.required && form.email.touched) {
            emailError.value = "";
            return "Введите е-мэйл!";
         } else if (form.email.errors.isEmail && form.email.touched) {
            emailError.value = "";
            return "Это не е-мэйл!";
         }
         return emailError.value;
      });

      const passwordErrorMessage = computed(() => {
         if (form.password.errors.required && form.password.touched) {
            passwordError.value = "";
            return "Введите пароль!";
         } else if (form.password.errors.minLength && form.password.touched) {
            passwordError.value = "";
            return `Пароль должен содержать 8-20 символов!`;
         }
         return passwordError.value;
      });

      const submit = async () => {
         const { message, errors } = await login(
            form.email.value,
            form.password.value
         );
         if (errors[0] === "email") {
            emailError.value = message;
         } else if (errors[0] === "password") {
            passwordError.value = message;
         }
         if (message) return;
         headerStore.hideWindow();
      };

      return { form, styles, emailErrorMessage, passwordErrorMessage, submit };
   },
});
</script>

<style lang="scss" module>
</style> -->
