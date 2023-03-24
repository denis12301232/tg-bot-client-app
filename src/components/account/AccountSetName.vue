<template>
  <QForm class="form" ref="formRef" @submit.prevent="onUpdateName">
    <QInput
      class="q-mt-sm"
      v-model="name"
      label="Имя"
      outlined
      :rules="nameRules"
      :error="!!error"
      :error-message="error"
      lazy-rules
    >
    </QInput>
    <QBtn class="q-mt-sm" type="submit" color="primary" :disable="!valid" :loading="isNameLoading" label="Изменить" />
  </QForm>
</template>

<script setup lang="ts">
import type { QForm } from 'quasar';
import { ref, watch } from 'vue';
import { useFetch } from '@/hooks';
import { ToolsService } from '@/api/services';
import { Validate } from '@/util';

const props = defineProps<{
  name: string;
}>();

const formRef = ref<QForm | null>(null);
const name = ref(props.name);
const valid = ref(false);
const { f: onUpdateName, loading: isNameLoading, error } = useFetch({
  fn: () =>
    ToolsService.setNewName(name.value).then(() => {
      setTimeout(() => {
        error.value = '';
        formRef.value?.reset();
      });
    }),
  successMsg: 'Изменено',
  alert: true,
});
const nameRules = [
  (v: string) => Validate.required(v) || 'Это обязательное поле',
  (v: string) => Validate.lengthInterval(3, 30)(v) || 'Имя должно содержть от 3 до 30 символов',
];

watch(name, async () => {
  valid.value = ((await formRef.value?.validate()) && !isNameLoading.value) || false;
});
</script>

<style scoped lang="scss">
.form {
  margin-top: 10px;

  & i {
    cursor: pointer;
    color: $primary;

    &:hover {
      color: $secondary;
    }
  }
}
</style>
