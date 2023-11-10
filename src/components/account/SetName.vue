<template>
  <QForm ref="formRef">
    <QInput
      class="q-mt-sm"
      v-model="name"
      :label="t('account.form.fields.name.placeholder')"
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
          v-if="name"
          :disable="!valid || equal"
          :loading="loading"
          icon="eva-checkmark"
          dense
          flat
          round
          color="positive"
          @click="query(name)"
        />
      </template>
    </QInput>
  </QForm>
</template>

<script setup lang="ts">
import type { QForm } from 'quasar';
import { ref, watch, computed } from 'vue';
import { useAlertStore, useStore } from '@/stores';
import { useQuery } from '@/hooks';
import { Validate } from '@/util';
import { UserService } from '@/api/services';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useStore();
const alertStore = useAlertStore();
const name = ref(store.user?.name || '');
const valid = ref(false);
const formRef = ref<QForm | null>(null);
const equal = computed(() => store.user?.name === name.value);
const { query, loading, error } = useQuery(UserService.updateName, { onSuccess });
const rules = [
  (v: string) => Validate.required(v) || t('account.form.fields.name.errors.required'),
  (v: string) => Validate.lengthInterval(3, 30)(v) || t('account.form.fields.name.errors.lengthInterval'),
];

watch(name, () => {
  formRef.value?.validate().then((v) => (valid.value = v && !loading.value));
});

function onSuccess() {
  store.user?.name && (store.user.name = name.value);
  alertStore.addAlert('success', t('account.messages.name'));
}
</script>

<style scoped lang="scss"></style>
