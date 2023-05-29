<template>
  <QForm ref="formRef" @submit.prevent="request(password.new.value, password.old.value)">
    <QInput
      v-model="password.old.value"
      class="q-mt-sm"
      label="Старый пароль"
      standout
      :type="password.old.visible ? 'text' : 'password'"
      lazy-rules
      :error="!!error"
      :error-message="typeof error === 'object' ? error.message : error"
    >
      <template #append>
        <QIcon
          :class="$style.icon"
          :name="password.old.visible ? 'eva-eye' : 'eva-eye-off'"
          @click="showPassword('old')"
        />
      </template>
    </QInput>
    <QInput
      v-model="password.new.value"
      label="Новый пароль"
      standout
      :type="password.new.visible ? 'text' : 'password'"
      :rules="rules"
      lazy-rules
      counter
      maxlength="20"
    >
      <template #append>
        <QIcon
          :class="$style.icon"
          :name="password.new.visible ? 'eva-eye' : 'eva-eye-off'"
          @click="showPassword('new')"
        />
      </template>
    </QInput>
    <QBtn
      v-if="valid && !loading && password.old.value"
      class="q-mt-sm"
      type="submit"
      color="primary"
      :loading="loading"
      :disable="!valid"
      label="Изменить"
    />
  </QForm>
</template>

<script setup lang="ts">
import type { QForm } from 'quasar';
import { ref, reactive, watch } from 'vue';
import { useFetch } from '@/hooks';
import { ToolsService } from '@/api/services';
import { Validate } from '@/util';

const formRef = ref<QForm | null>(null);
const valid = ref(false);
const password = reactive({
  new: { value: '', visible: false },
  old: { value: '', visible: false },
});
const { request, loading, error } = useFetch(ToolsService.setNewPassword, {
  afterResponse: () => (password.new.value = password.old.value = ''),
});
const rules = [
  (v: string) => Validate.required(v) || 'Это обязательное поле',
  (v: string) => Validate.lengthInterval(6, 20)(v) || 'Пароль должен содержать от 6 до 20 символов',
];

watch([() => password.new.value], () => {
  formRef.value?.validate().then((v) => (valid.value = v && !loading.value));
});

function showPassword(type: 'old' | 'new') {
  password[type].visible = !password[type].visible;
}
</script>

<style lang="scss" module>
.icon {
  cursor: pointer;
  color: $primary;

  &:hover {
    color: $secondary;
  }
}
</style>
