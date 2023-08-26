<template>
  <QForm ref="formRef">
    <QInput
      class="q-mt-sm"
      v-model="name"
      :label="t('account.form.fields.name.placeholder')"
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
          v-if="name"
          :disable="!valid || equal"
          :loading="loading"
          icon="eva-checkmark"
          dense
          flat
          round
          color="positive"
          @click="request(name)"
        />
      </template>
    </QInput>
  </QForm>
</template>

<script setup lang="ts">
import type { QForm } from 'quasar';
import { ref, watch, computed } from 'vue';
import { useStore } from '@/stores';
import { useFetch } from '@/hooks';
import { Validate } from '@/util';
import { ToolsService } from '@/api/services';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const store = useStore();
const name = ref(store.user?.name || '');
const valid = ref(false);
const formRef = ref<QForm | null>(null);
const equal = computed(() => store.user?.name === name.value);
const { request, loading, error } = useFetch(ToolsService.updateName, {
  afterResponse: () => store.user?.name && (store.user.name = name.value),
  alert: true,
  successMsg: t('account.messages.name'),
});
const rules = [
  (v: string) => Validate.required(v) || t('account.form.fields.name.errors.required'),
  (v: string) => Validate.lengthInterval(3, 30)(v) || t('account.form.fields.name.errors.lengthInterval'),
];

watch(name, () => {
  formRef.value?.validate().then((v) => (valid.value = v && !loading.value));
});
</script>

<style scoped lang="scss"></style>
