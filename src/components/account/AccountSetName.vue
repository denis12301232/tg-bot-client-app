<template>
  <QForm ref="formRef" @submit.prevent="request(name)">
    <QInput
      class="q-mt-sm"
      v-model="name"
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
          v-if="name"
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
const name = ref(store.user?.name || '');
const valid = ref(false);
const formRef = ref<QForm | null>(null);
const equal = computed(() => store.user?.name === name.value);
const { request, loading, error } = useFetch(ToolsService.setNewName, {
  afterResponse: () => store.user?.name && (store.user.name = name.value),
});
const rules = [
  (v: string) => Validate.required(v) || 'Это обязательное поле',
  (v: string) => Validate.lengthInterval(3, 30)(v) || 'Минимум 3 символа',
];

watch(name, () => {
  formRef.value?.validate().then((v) => (valid.value = v && !loading.value));
});
</script>

<style scoped lang="scss"></style>
