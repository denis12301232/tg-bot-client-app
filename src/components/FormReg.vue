<template>
  <QCard :class="[$style.card, 'q-py-md', 'q-px-lg', 'text-center']">
    <QForm ref="formRef" class="q-pb-md" @submit.prevent="request(form)">
      <h4 class="q-py-lg q-mb-sm">Регистрация</h4>
      <QInput
        v-model.trim="form.name"
        class="q-mb-sm"
        label="Имя"
        standout
        counter
        maxlength="30"
        :rules="rules.name"
      />
      <QInput
        v-model.trim="form.login"
        class="q-mb-sm"
        label="Логин"
        standout
        counter
        maxlength="30"
        :rules="rules.login"
        :error="!!errors.login"
        :error-message="errors.login"
      />
      <QInput
        v-model.trim="form.email"
        class="q-mb-sm"
        label="Адрес электронной почты"
        type="email"
        standout
        counter
        maxlength="30"
        :rules="rules.email"
        :error="!!errors.email"
        :error-message="errors.email"
      />
      <QInput
        v-model.trim="form.password"
        class="q-mb-sm"
        label="Пароль"
        :type="isPasswordVisible ? 'text' : 'password'"
        standout
        counter
        maxlength="20"
        autocomplete="new-password"
        :rules="rules.password"
      >
        <template #append>
          <QIcon :name="isPasswordVisible ? 'eva-eye' : 'eva-eye-off'" :class="$style.icon" @click="showPassword" />
        </template>
      </QInput>
      <div class="row justify-center q-my-md">
        <QBtn type="submit" label="Регистрация" color="red-10" :disable="!valid || loading" />
      </div>
      <div :class="$style.swap">
        Уже зарегестрировны?
        <span @click="$router.push('/login')">Вход</span>
      </div>
    </QForm>
  </QCard>
</template>

<script setup lang="ts">
import type { LoginResponse } from '@/types';
import type { QForm } from 'quasar';
import { ref, reactive, watch } from 'vue';
import { useStore } from '@/stores';
import { Validate } from '@/util';
import { AuthService } from '@/api/services';
import { useFetch } from '@/hooks';

type T = LoginResponse;
type S = typeof AuthService['registration'];

const emit = defineEmits<{
  close: [];
}>();

const store = useStore();
const valid = ref(false);
const isPasswordVisible = ref(false);
const formRef = ref<QForm>();
const errors = reactive({ name: '', login: '', email: '', password: '' });
const form = reactive({ name: '', login: '', email: '', password: '' });
const { request, loading, error } = useFetch<T, S>(AuthService.registration, {
  afterResponse: ({ data }) => {
    store.user = data.value.user;
    localStorage.setItem('token', data.value.accessToken);
    emit('close');
  },
});
const rules = {
  name: [
    (v: string) => Validate.required(v) || 'Это обязательное поле',
    (v: string) => Validate.noManySpaces(v) || 'Слишком много пробелов',
  ],
  login: [
    (v: string) => Validate.required(v) || 'Это обязательное поле',
    (v: string) => Validate.isLatinOrUnderscore(v) || 'Только латиница или нижнее подчеркивание',
  ],
  email: [
    (v: string) => Validate.required(v) || 'Это обязательное поле',
    (v: string) => Validate.isEmail(v) || 'Введите корректный е-мэйл',
  ],
  password: [
    (v: string) => Validate.required(v) || 'Это обязательное поле',
    (v: string) => Validate.lengthInterval(6, 20)(v) || 'Пароль должен содержать от 6 до 20 символов',
  ],
};

watch(form, () => {
  formRef.value?.validate().then((v) => {
    valid.value = v && !loading.value;
  });
});
watch(error, () => {
  if (typeof error.value === 'object') {
    if (error.value.errors.includes('login')) errors.login = 'Уже занят';
    else if (error.value.errors.includes('email')) errors.email = 'Уже занят';
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
