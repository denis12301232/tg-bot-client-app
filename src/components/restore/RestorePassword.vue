<template>
  <QForm ref="formRef" :class="$style.settings" @submit="restorePassword(email)">
    <h4 class="q-pa-lg text-center">{{ t('restore.form.title') }}</h4>
    <QInput
      v-model="email"
      class="full-width"
      standout
      :label="t('restore.form.fields.email.placeholder')"
      counter
      maxlength="30"
      :rules="rules"
      lazy-rules
      :error="!!error"
      :error-message="error?.message"
    >
      <template #append> </template>
    </QInput>
    <div class="row justify-center">
      <QBtn :disable="!valid || loading" :loading="loading" type="submit">{{ t('restore.form.buttons.restore') }}</QBtn>
    </div>
    <div v-if="message" :class="$style.message">{{ message }}</div>
  </QForm>
</template>

<script setup lang="ts">
import type { QForm } from 'quasar';
import { ref, watch } from 'vue';
import { useQuery } from '@/hooks';
import { Validate } from '@/util';
import { AuthService } from '@/api/services';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const email = ref('');
const formRef = ref<QForm | null>(null);
const message = ref('');
const valid = ref(false);
const rules = [
  (v: string) => Validate.required(v) || t('restore.form.fields.email.errors.required'),
  (v: string) => Validate.isEmail(v) || t('restore.form.fields.email.errors.isEmail'),
];
const { query: restorePassword, loading, error } = useQuery(AuthService.restorePassword, { onSuccess });

watch(email, () => formRef.value?.validate().then((v) => (valid.value = v)));

function onSuccess() {
  message.value = `${t('restore.messages.link')} ${email.value}`;
  email.value = '';
}
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
