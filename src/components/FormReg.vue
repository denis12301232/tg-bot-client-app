<template lang="pug">
QForm(class="form" ref="formRef" @submit.prevent="onSubmit" no-error-focus)
   h4(class="title") Регистрация
   QInput(v-model="form.name" class="input" outlined label="Имя" :rules="formRules.name")
   QInput(
      v-model="form.login" 
      class="input" 
      outlined 
      label="Логин" 
      :rules="formRules.login"
      :error="!!formErrors.login"
      :error-message="formErrors.login"
      )
   QInput(
      v-model="form.email" 
      class="input" 
      outlined 
      label="Адрес электронной почты" 
      :rules="formRules.email"
      :error="!!formErrors.email"
      :error-message="formErrors.email"
      )
      template(#append)
         QIcon(name="email")
   QInput(v-model="form.password" class="input" outlined label="Пароль" :rules="formRules.password")
      template(#append)
         QIcon(:name="isPasswordVisible ? 'visibility' : 'visibility_off'" @click="isPasswordVisible = !isPasswordVisible")
   div(class="buttons")
      QBtn(type="submit" color="primary" :loading="isLoading" :disable="!valid") Регистрация
   div(class="swap") Уже зарегестрировны? 
      span(@click="emit('swap', 'log')") Вход
</template>


<script setup lang="ts">
import type { QForm } from 'quasar'
import { reactive, ref, watch } from 'vue'
import { useStore } from '@/stores'
import { Validate } from '@/util'
import { AuthService } from '@/api/services'


const emit = defineEmits<{
   (event: 'swap', value: string): void;
   (event: 'submit'): void;
}>();

const store = useStore();
const formRef = ref<QForm | null>(null);
const valid = ref(false);
const isLoading = ref(false);
const isPasswordVisible = ref(false);
const form = reactive({
   name: '',
   login: '',
   email: '',
   password: '',
});
const formErrors = reactive({
   login: '',
   email: '',
   password: '',
});

const formRules = {
   name: [
      (v: string) => Validate.required(v) || 'Это обязательное поле',
   ],
   login: [
      (v: string) => Validate.required(v) || 'Это обязательное поле',
   ],
   email: [
      (v: string) => Validate.required(v) || 'Это обязательное поле',
      (v: string) => Validate.isEmail(v) || 'Введите корректный е-мэйл'
   ],
   password: [
      (v: string) => Validate.required(v) || 'Это обязательное поле',
      (v: string) => Validate.lengthInterval(6, 20)(v) || 'Пароль должен содержать от 6 до 20 символов'
   ],
};

watch(form, async () => {
   valid.value = await formRef.value?.validate() && !isLoading.value || false;
});

async function onSubmit() {
   try {
      isLoading.value = true;
      const response = await AuthService.registration(form);
      localStorage.setItem('token', response.data.accessToken);
      store.user = response.data.user;
      emit('submit');
      emit('swap', 'log');
   } catch (e: any) {
      if (e?.response?.data?.errors.includes('email')) {
         formErrors.email = 'Уже занят';
      } else if (e?.response?.data?.errors.includes('login')) {
         formErrors.login = 'Уже занят';
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
      margin-top: 10px;
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