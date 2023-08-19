<template>
  <div class="row justify-center items-center" style="height: calc(100vh - 50px)">
    <QResizeObserver @resize="onResize" />
    <QCard :class="[$style.card, 'text-center', 'relative-position']" :flat="width < 450" style="top: -50px">
      <QForm ref="formRef" class="q-pa-lg" no-error-focus @submit.prevent="request(form)">
        <h4 class="q-pb-lg q-mb-sm">{{ t('registration.form.title') }}</h4>
        <QInput
          v-model.trim="form.name"
          class="q-mb-sm"
          :label="t('registration.form.fields.name.placeholder')"
          standout
          counter
          maxlength="30"
          :rules="rules.name"
        />
        <QInput
          v-model.trim="form.login"
          class="q-mb-sm"
          :label="t('registration.form.fields.login.placeholder')"
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
          :label="t('registration.form.fields.email.placeholder')"
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
          :label="t('registration.form.fields.password.placeholder')"
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
          <QBtn type="submit" color="primary" :disable="!valid || loading">
            {{ t('registration.form.buttons.registration') }}
          </QBtn>
        </div>
        <div :class="$style.swap">
          {{ t('registration.form.messages.alreadyReg') }}
          <RouterLink :class="$style.link" to="login">{{ t('registration.form.buttons.login') }}</RouterLink>
        </div>
      </QForm>
    </QCard>
  </div>
</template>

<script setup lang="ts">
import type { Responses } from '@/types';
import type { QForm } from 'quasar';
import { ref, reactive, watch } from 'vue';
import { useStore } from '@/stores';
import { Rules } from '@/util';
import { AuthService } from '@/api/services';
import { useFetch } from '@/hooks';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const store = useStore();
const router = useRouter();
const valid = ref(false);
const isPasswordVisible = ref(false);
const formRef = ref<QForm>();
const width = ref(0);
const errors = reactive({ name: '', login: '', email: '', password: '' });
const form = reactive({ name: '', login: '', email: '', password: '' });
const { request, loading, error } = useFetch<Responses.Login, (typeof AuthService)['registration']>(
  AuthService.registration,
  {
    afterSuccess: ({ data }) => {
      store.user = data.value.user;
      localStorage.setItem('token', data.value.accessToken);
      router.push('/');
    },
  }
);
const rules = Rules.registration(t);

watch(form, () => {
  formRef.value?.validate().then((v) => {
    valid.value = v && !loading.value;
  });
});
watch(error, () => {
  if (typeof error.value === 'object') {
    if (error.value.errors.includes('login')) errors.login = t('registration.form.fields.login.errors.alreadyTaken');
    else if (error.value.errors.includes('email'))
      errors.email = t('registration.form.fields.email.errors.alreadyTaken');
  }
});

function showPassword() {
  isPasswordVisible.value = !isPasswordVisible.value;
}

function onResize(size: { height: number; width: number }) {
  width.value = size.width;
}
</script>

<style module lang="scss">
.card {
  max-width: 450px !important;
  min-width: 300px;
  width: 100%;
  padding: 15px;
}

.swap {
  margin-top: 10px;
  font-size: 1.1em;
}
.link {
  cursor: pointer;
  color: $indigo;
  font-weight: bolder;
  text-decoration: none;

  &:hover {
    color: $primary;
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
