<template>
  <QForm class="form" ref="formRef" @submit.prevent="onUpdateEmail">
    <QInput
      class="q-mt-sm"
      v-model="email"
      label="Е-мэйл"
      outlined
      :rules="emailRules"
      :error="!!error"
      :error-message="error"
      lazy-rules
    >
      <template #append>
        <QIcon name="email" />
      </template>
    </QInput>
    <QBtn class="q-mt-sm" type="submit" color="primary" :disable="!valid" :loading="isEmailLoading" label="Изменить" />
  </QForm>
</template>

<script setup lang="ts">
import type { QForm } from 'quasar';
import { ref, watch } from 'vue';
import { useFetch } from '@/hooks';
import { ToolsService } from '@/api/services';
import { Validate } from '@/util';

const props = defineProps<{
  email: string;
}>();

const formRef = ref<QForm | null>(null);
const email = ref(props.email);
const valid = ref(false);
const { f: onUpdateEmail, loading: isEmailLoading, error } = useFetch({
  fn: () =>
    ToolsService.setNewEmail(email.value).then(() => {
      setTimeout(() => {
        email.value = '';
        formRef.value?.reset();
      }, 0);
    }),
  successMsg: 'Изменено',
  alert: true,
});
const emailRules = [
  (v: string) => Validate.required(v) || 'Это обязательное поле',
  (v: string) => Validate.isEmail(v) || 'Введите корректный е-мэйл',
];

watch(email, async () => {
  valid.value = ((await formRef.value?.validate()) && !isEmailLoading.value) || false;
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
