<template>
  <QForm ref="formRef">
    <QInput
      class="q-mt-sm"
      v-model="email"
      :label="t('account.form.fields.email.placeholder')"
      standout
      :rules="rules"
      :error="!!error"
      :error-message="typeof error === 'object' ? error.message : error"
      lazy-rules
      counter
      maxlength="30"
    >
      <template #append>
        <QBtn
          v-if="email"
          :disable="!valid || equal"
          :loading="loading"
          icon="eva-checkmark"
          dense
          flat
          round
          color="positive"
          @click="request(email)"
        />
      </template>
    </QInput>
  </QForm>
</template>

<script setup lang="ts">
import type { QForm } from 'quasar';
import { ref, watch, computed } from 'vue';
import { useStore } from '@/stores';
import { useI18n } from 'vue-i18n';
import { useFetch } from '@/hooks';
import { Validate } from '@/util';
import { ToolsService } from '@/api/services';

const { t } = useI18n();
const store = useStore();
const email = ref(store.user?.email || '');
const valid = ref(false);
const formRef = ref<QForm | null>(null);
const equal = computed(() => store.user?.email === email.value);
const { request, loading, error } = useFetch(ToolsService.setNewEmail, {
  afterResponse: () => store.user?.email && (store.user.email = email.value),
  alert: true,
  successMsg: t('account.messages.email'),
});
const rules = [
  (v: string) => Validate.required(v) || t('account.form.fields.email.errors.required'),
  (v: string) => Validate.isEmail(v) || t('account.form.fields.email.errors.isEmail'),
];

watch(email, () => {
  formRef.value?.validate().then((v) => (valid.value = v && !loading.value));
});
</script>

<style scoped lang="scss"></style>
