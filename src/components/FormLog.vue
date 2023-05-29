<template>
  <QCard :class="[$style.card, 'q-py-md', 'q-px-lg', 'text-center']">
    <QForm ref="formRef" class="q-pb-md" no-error-focus @submit.prevent="request(form.loginOrEmail, form.password)">
      <h4 class="q-py-lg q-mb-sm">Вход</h4>
      <QInput
        v-model.trim="form.loginOrEmail"
        class="q-mb-md"
        label="Логин или е-мэйл"
        standout
        counter
        maxlength="30"
        :rules="rules.loginOrEmail"
        :error="!!errors.loginOrEmail"
        :error-message="errors.loginOrEmail"
      />
      <QInput
        v-model.trim="form.password"
        class="q-mb-md"
        label="Пароль"
        :type="isPasswordVisible ? 'text' : 'password'"
        standout
        counter
        maxlength="20"
        autocomplete="new-password"
        :rules="rules.password"
        :error="!!errors.password"
        :error-message="errors.password"
      >
        <template #append>
          <QIcon :name="isPasswordVisible ? 'eva-eye' : 'eva-eye-off'" :class="$style.icon" @click="showPassword" />
        </template>
      </QInput>
      <div class="row justify-center q-my-md">
        <QBtn type="submit" :loading="loading" :disable="!valid" color="red-10">Войти</QBtn>
      </div>
      <div :class="$style.swap">
        Еще не зарегестрировны?
        <span @click="$router.push('/registration')">Регистрация</span>
      </div>
      <div :class="$style.swap">
        Забыли пароль?
        <span @click="$router.push('/restore')">Восстановить</span>
      </div>
    </QForm>
  </QCard>
</template>

<script setup lang="ts">
import type { QForm } from 'quasar';
import { ref, reactive, watch } from 'vue';
import { useStore } from '@/stores';
import { Validate } from '@/util';
import { AuthService } from '@/api/services';
import { useFetch } from '@/hooks';
import { LoginResponse } from '@/types';

type T = LoginResponse;
type S = typeof AuthService['login'];

const emit = defineEmits<{
  close: [];
}>();

const store = useStore();
const valid = ref(false);
const isPasswordVisible = ref(false);
const formRef = ref<QForm>();
const form = reactive({ loginOrEmail: '', password: '' });
const errors = reactive({ loginOrEmail: '', password: '' });
const rules = {
  loginOrEmail: [(v: string) => Validate.required(v) || 'Заполните поле'],
  password: [(v: string) => Validate.required(v) || 'Заполните поле'],
};
const { request, loading, error } = useFetch<T, S>(AuthService.login, {
  afterResponse: ({ data }) => {
    store.user = data.value.user;
    localStorage.setItem('token', data.value.accessToken);
    emit('close');
  },
});

watch(form, () => {
  formRef.value?.validate().then((v) => {
    valid.value = v && !loading.value;
  });
});
watch(error, () => {
  if (typeof error.value === 'object') {
    error.value.errors.includes('login')
      ? (errors.loginOrEmail = 'Неверный логин или адрес электронной почты')
      : (errors.password = 'Неверный пароль');
  }
});

function showPassword() {
  isPasswordVisible.value = !isPasswordVisible.value;
}
</script>

<style module lang="scss">
.card {
  max-width: 450px !important;
  min-width: 300px;
  width: 100%;
}

.swap {
  margin-top: 10px;
  font-size: 1.1em;

  & > span {
    cursor: pointer;
    color: $indigo;
    font-weight: bolder;

    &:hover {
      color: $red-10;
    }
  }
}

.icon {
  cursor: pointer;
  color: $primary;

  &:hover {
    color: $secondary;
  }
}
</style>
