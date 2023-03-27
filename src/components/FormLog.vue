<template>
  <QForm class="text-center" ref="formRef" no-error-focus @submit.prevent="onSubmit">
    <h4 class="q-py-lg">Вход</h4>
    <QInput
      v-model.trim="form.loginOrEmail"
      class="q-mb-sm"
      outlined
      label="Логин или е-мэйл"
      :rules="formRules.loginOrEmail"
      :error="!!formErrors.loginOrEmail"
      :error-message="formErrors.loginOrEmail"
      lazy-rules
    />
    <QInput
      v-model="form.password"
      class="q-mb-sm"
      outlined
      label="Пароль"
      :rules="formRules.password"
      :error="!!formErrors.password"
      :error-message="formErrors.password"
      lazy-rules
      :type="isPasswordVisible ? 'text' : 'password'"
      no-error-icon
    >
      <template #append>
        <QIcon
          :name="isPasswordVisible ? 'visibility' : 'visibility_off'"
          @click="isPasswordVisible = !isPasswordVisible"
        />
      </template>
    </QInput>
    <div class="row justify-center">
      <QBtn type="submit" color="primary" :loading="isLoading" :disable="!valid" label="Войти" />
    </div>
    <div class="swap">
      Еще не зарегестрировны?
      <span @click="emit('swap', 'reg')">Регистрация</span>
    </div>
    <div class="swap">
      Забыли пароль?
      <span @click="$router.push('/restore')">Восстановить</span>
    </div>
  </QForm>
</template>

<script setup lang="ts">
import type { QForm } from 'quasar';
import { ref, reactive, watch } from 'vue';
import { Validate } from '@/util';
import { AuthService } from '@/api/services';
import { useStore } from '@/stores';

const emit = defineEmits<{
  (event: 'swap', value: string): void;
  (event: 'submit'): void;
}>();
const store = useStore();
const formRef = ref<QForm | null>(null);
const isLoading = ref(false);
const valid = ref(false);
const isPasswordVisible = ref(false);
const form = reactive({ loginOrEmail: '', password: '' });
const formErrors = reactive({ loginOrEmail: '', password: '' });
const formRules = {
  loginOrEmail: [(v: string) => Validate.required(v) || 'Это обязательное поле'],
  password: [(v: string) => Validate.required(v) || 'Это обязательное поле'],
};

watch(form, () => {
  formRef.value?.validate().then((v) => {
    valid.value = v && !isLoading.value;
  });
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
