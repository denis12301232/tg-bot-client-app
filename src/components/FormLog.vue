<template>
  <QCard :class="[$style.card, 'q-py-md', 'q-px-lg', 'text-center']">
    <QForm ref="formRef" class="q-pb-md" no-error-focus @submit.prevent="request(form.loginOrEmail, form.password)">
      <h4 class="q-py-lg q-mb-sm">{{ t('login.form.title') }}</h4>
      <QInput
        v-model.trim="form.loginOrEmail"
        class="q-mb-md"
        :label="t('login.form.fields.loginOrEmail.placeholder')"
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
        :label="t('login.form.fields.password.placeholder')"
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
        <QBtn type="submit" :loading="loading" :disable="!valid" color="primary">
          {{ t('login.form.buttons.login') }}
        </QBtn>
      </div>
      <div :class="$style.swap">
        {{ t('login.form.messages.notRegister') }}
        <span @click="$router.push('/registration')">{{ t('login.form.buttons.registration') }}</span>
      </div>
      <div :class="$style.swap">
        {{ t('login.form.messages.restore') }}
        <span @click="$router.push('/restore')">{{ t('login.form.buttons.restore') }}</span>
      </div>
    </QForm>
  </QCard>
</template>

<script setup lang="ts">
import type { LoginResponse } from '@/types';
import type { QForm } from 'quasar';
import { ref, reactive, watch } from 'vue';
import { useStore } from '@/stores';
import { Rules } from '@/util';
import { AuthService } from '@/api/services';
import { useFetch } from '@/hooks';
import { useI18n } from 'vue-i18n';

type T = LoginResponse;
type S = (typeof AuthService)['login'];

const emit = defineEmits<{
  close: [];
}>();

const { t } = useI18n();
const store = useStore();
const valid = ref(false);
const isPasswordVisible = ref(false);
const formRef = ref<QForm>();
const form = reactive({ loginOrEmail: '', password: '' });
const errors = reactive({ loginOrEmail: '', password: '' });
const rules = Rules.login(t);
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
      ? (errors.loginOrEmail = t('login.errors.loginOrEmail.incorrect'))
      : (errors.password = t('login.errors.password.incorrect'));
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
      color: $primary;
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
