<template>
  <QForm ref="formRef" :class="$style.settings" @submit="sendMail(email)">
    <h5 class="q-pa-lg text-center">{{ t('restore.titles.email') }}</h5>
    <QInput
      v-model="email"
      class="full-width"
      standout
      :label="t('restore.placeholders.email')"
      counter
      maxlength="30"
      :rules="rules"
      lazy-rules
      :error="!!error"
      :error-message="typeof error === 'object' ? error.message : error"
    >
      <template #append> </template>
    </QInput>
    <div class="row justify-center">
      <QBtn :disable="!valid || loading" :loading="loading" type="submit">{{ t('restore.buttons.email') }}</QBtn>
    </div>
    <div v-if="message" :class="$style.message">{{ message }}</div>
  </QForm>
</template>

<script setup lang="ts">
import type { QForm } from 'quasar';
import { ref, watch } from 'vue';
import { useFetch, useI18nT } from '@/hooks';
import { Validate } from '@/util';
import { AuthService } from '@/api/services';

const { t } = useI18nT();
const email = ref('');
const formRef = ref<QForm | null>(null);
const message = ref('');
const valid = ref(false);
const rules = [
  (v: string) => Validate.required(v) || t('restore.errors.email.required'),
  (v: string) => Validate.isEmail(v) || t('restore.errors.email.isEmail'),
];

const {
  request: sendMail,
  loading,
  error,
} = useFetch(AuthService.sendMail, {
  afterResponse: () => {
    message.value = `${t('restore.msgs.link')} ${email.value}`;
    email.value = '';
  },
});

watch(email, () => {
  formRef.value?.validate().then((v) => (valid.value = v));
});
</script>

<style lang="scss" module>
.settings {
  max-width: 500px;
  width: 100%;
}

.message {
  color: $positive;
  padding: 5px 0;
  font-size: 1.1em;
  font-weight: bolder;
}
</style>
