<template>
  <QForm class="text-center" ref="formRef" no-error-focus @submit.prevent="onSubmit">
    <h4 class="q-py-lg">Регистрация</h4>
    <QInput
      v-model.trim="form.name"
      class="q-mb-sm"
      outlined
      label="Имя"
      :rules="formRules.name"
      autocomplete="new-password"
    />
    <QInput
      v-model.trim="form.login"
      class="q-mb-sm"
      outlined
      label="Логин"
      :rules="formRules.login"
      :error="!!formErrors.login"
      :error-message="formErrors.login"
      autocomplete="new-password"
    />
    <QInput
      v-model.trim="form.email"
      class="q-mb-sm"
      outlined
      label="Адрес электронной почты"
      :rules="formRules.email"
      :error="!!formErrors.email"
      :error-message="formErrors.email"
      autocomplete="new-password"
    >
      <template #append>
        <QIcon name="email" />
      </template>
    </QInput>
    <QInput
      v-model.trim="form.password"
      class="q-mb-sm"
      outlined
      label="Пароль"
      :rules="formRules.password"
      :type="isPasswordVisible ? 'text' : 'password'"
      autocomplete="new-password"
    >
      <template #append>
        <QIcon
          :name="isPasswordVisible ? 'visibility' : 'visibility_off'"
          @click="isPasswordVisible = !isPasswordVisible"
        />
      </template>
    </QInput>
    <div class="row justify-center">
      <QBtn type="submit" color="primary" :loading="isLoading" :disable="!valid" label="Регистрация" />
    </div>
    <div class="swap">
      Уже зарегестрировны?
      <span @click="emit('swap', 'log')">Вход</span>
    </div>
  </QForm>
</template>

<script setup lang="ts">
import type { QForm } from 'quasar';
import { reactive, ref, watch } from 'vue';
import { useStore } from '@/stores';
import { Validate } from '@/util';
import { AuthService } from '@/api/services';

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

watch(form, async () => {
  valid.value = ((await formRef.value?.validate()) && !isLoading.value) || false;
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
i {
  cursor: pointer;
  color: $primary;

  &:hover {
    color: $secondary;
  }
}

.swap {
  margin-top: 10px;
  font-size: 1.1em;

  & > span {
    cursor: pointer;
    color: $primary;
    font-weight: bolder;

    &:hover {
      color: $secondary;
    }
  }
}
</style>
