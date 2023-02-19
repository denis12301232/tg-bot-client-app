<template lang="pug">
QForm(class="form" @submit.prevent="onSubmit" ref="formRef" no-error-focus)
   h4(class="title") Вход
   QInput(
      v-model="form.loginOrEmail" 
      class="input" outlined 
      label="Логин или е-мэйл" 
      :rules="formRules.loginOrEmail"
      :error="!!formErrors.loginOrEmail"
      :error-message="formErrors.loginOrEmail"
      lazy-rules
      )
   QInput(
      v-model="form.password" 
      class="input" 
      outlined 
      label="Пароль" 
      :rules="formRules.password"
      :error="!!formErrors.password"
      :error-message="formErrors.password"
      lazy-rules
      :type="isPasswordVisible ? 'text' : 'password'"
      )
      template(#append)
         QIcon(:name="isPasswordVisible ? 'visibility' : 'visibility_off'" @click="isPasswordVisible = !isPasswordVisible")
   div(class="buttons")
      QBtn(type="submit" color="primary" :loading="isLoading" :disable="!valid") Войти
   div(class="swap") Еще не зарегестрировны? 
      span(@click="emit('swap', 'reg')") Регистрация
   div(class="swap") Забыли пароль? 
      span(@click="$router.push('/restore')") Восстановить
</template>


<script setup lang="ts">
import type { QForm } from 'quasar'
import { ref, reactive, watch } from 'vue'
import { Validate } from '@/util'
import { AuthService } from '@/api/services'
import { useStore } from '@/stores'


const emit = defineEmits<{
   (event: 'swap', value: string): void;
   (event: 'submit'): void;
}>();
const store = useStore();
const formRef = ref<QForm | null>(null);
const isLoading = ref(false);
const valid = ref(false);
const isPasswordVisible = ref(false);
const form = reactive({
   loginOrEmail: '',
   password: '',
});
const formErrors = reactive({
   loginOrEmail: '',
   password: ''
});
const formRules = {
   loginOrEmail: [
      (v: string) => Validate.required(v) || 'Это обязательное поле',
   ],
   password: [
      (v: string) => Validate.required(v) || 'Это обязательное поле',
   ],
};

watch(form, () => {
   formRef.value?.validate().then((v) => { valid.value = v && !isLoading.value });
});

async function onSubmit() {
   try {
      isLoading.value = true;
      const response = await AuthService.login(form.loginOrEmail, form.password);
      localStorage.setItem('token', response.data.accessToken);
      store.user = response.data.user;
      emit('submit');
   } catch (e: any) {
      if (e?.response?.data?.errors.includes('email')) {
         formErrors.loginOrEmail = 'Неверный логин или е-мэйл';
      } else if (e?.response?.data?.errors.includes('password')) {
         formErrors.password = 'Неверный пароль';
      }
   } finally {
      isLoading.value = false;
   }
}
</script>

<style scoped lang="scss">
.form {
   padding: 10px 20px;
   text-align: center;
   min-width: 300px;

   & .title {
      padding: 20px 0 30px 0;
   }

   & .buttons {
      display: flex;
      justify-content: center;
   }

   & .input {
      margin-bottom: 10px;

      & i {
         cursor: pointer;
         color: $primary;

         &:hover {
            color: $secondary;
         }
      }
   }

   & .swap {
      margin-top: 10px;
      font-size: 1.1em;


      &>span {
         cursor: pointer;
         color: $primary;
         font-weight: bolder;

         &:hover {
            color: $secondary;
         }
      }
   }
}
</style>