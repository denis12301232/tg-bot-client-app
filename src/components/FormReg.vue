<template>
  <QCard :class="[$style.card, 'q-py-md', 'q-px-lg', 'text-center']">
    <QForm ref="formRef" class="q-pb-md" @submit.prevent="request(form)">
      <h4 class="q-py-lg q-mb-sm">{{ t('registration.title') }}</h4>
      <QInput
        v-model.trim="form.name"
        class="q-mb-sm"
        :label="t('registration.placeholders.name')"
        standout
        counter
        maxlength="30"
        :rules="rules.name"
      />
      <QInput
        v-model.trim="form.login"
        class="q-mb-sm"
        :label="t('registration.placeholders.login')"
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
        :label="t('registration.placeholders.email')"
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
        :label="t('registration.placeholders.password')"
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
        <QBtn type="submit" color="red-10" :disable="!valid || loading">
          {{ t('registration.buttons.registration') }}
        </QBtn>
      </div>
      <div :class="$style.swap">
        {{ t('registration.alreadyReg') }}
        <span @click="$router.push('/login')">{{ t('registration.buttons.alreadyReg') }}</span>
      </div>
    </QForm>
  </QCard>
</template>

<script setup lang="ts">
import type { I18n, Langs, LoginResponse } from '@/types';
import type { QForm } from 'quasar';
import { ref, reactive, watch } from 'vue';
import { useStore } from '@/stores';
import { Validate } from '@/util';
import { AuthService } from '@/api/services';
import { useFetch } from '@/hooks';
import { useI18n } from 'vue-i18n';

type T = LoginResponse;
type S = typeof AuthService['registration'];

const emit = defineEmits<{
  close: [];
}>();

const { t } = useI18n<I18n, Langs>({ useScope: 'global' });
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
    (v: string) => Validate.required(v) || t('registration.errors.name.required'),
    (v: string) => Validate.noManySpaces(v) || t('registration.errors.name.noManySpaces'),
  ],
  login: [
    (v: string) => Validate.required(v) || t('registration.errors.login.required'),
    (v: string) => Validate.isLatinOrUnderscore(v) || t('registration.errors.login.isLatinOrUnderscore'),
  ],
  email: [
    (v: string) => Validate.required(v) || t('registration.errors.email.required'),
    (v: string) => Validate.isEmail(v) || t('registration.errors.email.isEmail'),
  ],
  password: [
    (v: string) => Validate.required(v) || t('registration.errors.password.required'),
    (v: string) => Validate.lengthInterval(6, 20)(v) || t('registration.errors.password.lengthInterval'),
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
