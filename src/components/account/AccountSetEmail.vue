<template>
  <QForm ref="formRef" @submit.prevent="request(email)">
    <QInput
      class="q-mt-sm"
      v-model="email"
      :label="label"
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
          type="submit"
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

defineProps<{
  label: string;
}>();

const store = useStore();
const email = ref(store.user?.email || '');
const valid = ref(false);
const formRef = ref<QForm | null>(null);
const equal = computed(() => store.user?.email === email.value);
const { request, loading, error } = useFetch(ToolsService.setNewEmail, {
  afterResponse: () => store.user?.email && (store.user.email = email.value),
});
const rules = [
  (v: string) => Validate.required(v) || 'Заполните поле',
  (v: string) => Validate.isEmail(v) || 'Введите корректный е-мэйл',
];

watch(email, () => {
  formRef.value?.validate().then((v) => (valid.value = v && !loading.value));
});
</script>

<style scoped lang="scss"></style>
