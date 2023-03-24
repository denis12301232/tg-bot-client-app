<template>
  <QForm class="form" ref="formRef" @submit.prevent="onUpdatePassword">
    <QInput
      class="form_input"
      v-model="password.old.value"
      label="Старый пароль"
      outlined
      :type="password.old.visible ? 'text' : 'password'"
      lazy-rules
      :error="!!error"
      :error-message="error"
    >
      <template #append>
        <QIcon :name="password.old.visible ? 'visibility' : 'visibility_off'" @click="setPasswordVisible('old')" />
      </template>
    </QInput>
    <QInput
      class="q-mt-sm"
      v-model="password.new.value"
      label="Новый пароль"
      outlined
      :type="password.new.visible ? 'text' : 'password'"
      :rules="passwordRules"
      lazy-rules
    >
      <template #append>
        <QIcon :name="password.new.visible ? 'visibility' : 'visibility_off'" @click="setPasswordVisible('new')" />
      </template>
    </QInput>
    <QBtn
      class="q-mt-sm"
      type="submit"
      color="primary"
      :loading="isPasswordLoading"
      :disable="!valid"
      label="Изменить"
    />
  </QForm>
</template>

<script setup lang="ts">
import type { QForm } from 'quasar';
import { reactive, ref, watch } from 'vue';
import { useFetch } from '@/hooks';
import { ToolsService } from '@/api/services';
import { Validate } from '@/util';

const formRef = ref<QForm | null>(null);
const valid = ref(false);
const password = reactive({
  new: {
    value: '',
    visible: false,
  },
  old: {
    value: '',
    visible: false,
  },
});
const { f: onUpdatePassword, loading: isPasswordLoading, error } = useFetch({
  fn: () =>
    ToolsService.setNewPassword(password.new.value, password.old.value).then(() => {
      password.new.value = '';
      password.old.value = '';
      setTimeout(() => {
        error.value = '';
        formRef.value?.reset();
        formRef.value?.resetValidation();
      }, 0);
    }),
  successMsg: 'Изменено',
  alert: true,
});
const passwordRules = [
  (v: string) => Validate.required(v) || 'Это обязательное поле',
  (v: string) => Validate.lengthInterval(6, 20)(v) || 'Пароль должен содержать от 6 до 20 символов',
];

watch(
  () => password.new.value,
  async () => {
    valid.value = ((await formRef.value?.validate()) && !isPasswordLoading.value) || false;
  }
);

function setPasswordVisible(value: 'old' | 'new') {
  password[value].visible = !password[value].visible;
}
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
