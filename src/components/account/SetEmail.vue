<template>
  <QForm ref="formRef">
    <QInput
      class="q-mt-sm"
      v-model="email"
      :label="t('account.form.fields.email.placeholder')"
      standout
      :rules="rules"
      :error="!!error"
      :error-message="error?.message"
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
          @click="query(email)"
        />
      </template>
    </QInput>
  </QForm>
</template>

<script setup lang="ts">
import type { QForm } from 'quasar';
import { ref, watch, computed } from 'vue';
import { useAlertStore, useStore } from '@/stores';
import { useI18n } from 'vue-i18n';
import { useQuery } from '@/hooks';
import { Validate } from '@/util';
import { UserService } from '@/api/services';

const { t } = useI18n();
const store = useStore();
const alertStore = useAlertStore();
const email = ref(store.user?.email || '');
const valid = ref(false);
const formRef = ref<QForm | null>(null);
const equal = computed(() => store.user?.email === email.value);
const { query, loading, error } = useQuery(UserService.updateEmail, { onSuccess });
const rules = [
  (v: string) => Validate.required(v) || t('account.form.fields.email.errors.required'),
  (v: string) => Validate.isEmail(v) || t('account.form.fields.email.errors.isEmail'),
];

watch(email, () => {
  formRef.value?.validate().then((v) => (valid.value = v && !loading.value));
});

function onSuccess() {
  store.user?.email && (store.user.email = email.value);
  alertStore.addAlert('success', t('account.messages.email'));
}
</script>

<style scoped lang="scss"></style>
