<template>
  <div class="container">
    <h5 class="q-mt-lg q-mb-md text-primary">Адрес электронной почты</h5>
    <QForm v-if="!link" class="form" ref="emailForm" @submit.prevent="onSendMail">
      <QInput
        v-model="email"
        outlined
        label="Адрес электронной почты"
        :rules="emailRules"
        lazy-rules
        :error="!!errorSend"
        :error-message="errorSend"
      >
        <template #append>
          <QIcon name="email" />
        </template>
      </QInput>
      <QBtn
        class="q-mt-sm"
        color="primary"
        type="submit"
        :loading="isSendLoading"
        :disable="!emailValid"
        label="Восстановить"
      />
      <div class="message">{{ successSend }}</div>
    </QForm>
    <QForm v-else class="form" ref="passwordForm" @submit.prevent="onRestorePassword">
      <QInput
        v-model="password"
        outlined
        label="Новый пароль"
        :rules="passwordRules"
        :error="!!passwordError"
        :error-message="passwordError"
        lazy-rules
        :type="isPasswordVisible ? 'text' : 'password'"
      >
        <template #append>
          <QIcon
            :name="isPasswordVisible ? 'visibility' : 'visibility_off'"
            @click="isPasswordVisible = !isPasswordVisible"
          />
        </template>
      </QInput>
      <QBtn
        class="q-mt-sm"
        type="submit"
        color="primary"
        :loading="isRestorePasswordLoading"
        :disable="!passwordValid"
        label="Изменить"
      />
    </QForm>
  </div>
</template>

<script setup lang="ts">
import type { QForm } from 'quasar';
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useFetch } from '@/hooks';
import { AuthService } from '@/api/services';
import { Validate } from '@/util';

const route = useRoute();
const email = ref('');
const emailForm = ref<QForm | null>(null);
const emailValid = ref(false);
const password = ref('');
const isPasswordVisible = ref(false);
const passwordValid = ref(false);
const passwordForm = ref<QForm | null>(null);
const link = computed(() => route.query.link);
const { f: onSendMail, loading: isSendLoading, success: successSend, error: errorSend } = useFetch({
  fn: () => AuthService.sendMail(email.value),
  successMsg: 'На указаный адрес отправлено письмо',
  errorMsg: 'Письмо не отправлено',
});
const { f: onRestorePassword, loading: isRestorePasswordLoading, error: passwordError } = useFetch({
  fn: () => AuthService.restorePassword(password.value, link.value?.toString() || ''),
});
const emailRules = [
  (v: string) => Validate.required(v) || 'Заполните поле',
  (v: string) => Validate.isEmail(v) || 'Введите корректный е-мэйл',
];
const passwordRules = [
  (v: string) => Validate.required(v) || 'Заполните поле',
  (v: string) => Validate.lengthInterval(6, 20)(v) || 'Пароль должен содержать от 6 до 20 символов',
];

watch(email, () => {
  emailForm.value?.validate().then((v) => (emailValid.value = v && !isSendLoading.value));
});
watch(password, () => {
  passwordForm.value?.validate().then((v) => (passwordValid.value = v && !isRestorePasswordLoading.value));
});
</script>

<style scoped lang="scss">
.container {
  padding: 0 30px 30px 30px;
  width: 50%;

  & .form {
    & i {
      color: $primary;
      cursor: pointer;

      &:hover {
        color: $secondary;
      }
    }

    & .message {
      color: $positive;
      padding: 5px 0;
      font-size: 1.1em;
      font-weight: bolder;
    }
  }
}

@media (max-width: 1024px) {
  .container {
    width: 60%;
  }
}

@media (max-width: 768px) {
  .container {
    width: 70%;
  }
}

@media (max-width: 480px) {
  .container {
    width: 100%;
  }
}
</style>
