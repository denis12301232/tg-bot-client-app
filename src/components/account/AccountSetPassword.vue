<template>
  <QForm ref="formRef" @submit.prevent="query(password.new.value, password.old.value)">
    <QInput
      v-model="password.old.value"
      class="q-mt-sm"
      :label="t('account.form.fields.oldPassword.placeholder')"
      standout
      :type="password.old.visible ? 'text' : 'password'"
      lazy-rules
      :error="!!error"
      :error-message="error?.message"
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
      class="q-mt-sm"
      :label="t('account.form.fields.newPassword.placeholder')"
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
      :label="t('account.form.buttons.password')"
    />
  </QForm>
</template>

<script setup lang="ts">
import type { QForm } from 'quasar';
import { ref, reactive, watch } from 'vue';
import { useQuery } from '@/hooks';
import { UserService } from '@/api/services';
import { Validate } from '@/util';
import { useI18n } from 'vue-i18n';
import { useAlertStore } from '@/stores';

const alertStore = useAlertStore();
const { t } = useI18n();
const formRef = ref<QForm | null>(null);
const valid = ref(false);
const password = reactive({
  new: { value: '', visible: false },
  old: { value: '', visible: false },
});
const { query, loading, error } = useQuery(UserService.updatePassword, { onFinally, onSuccess });
const rules = [
  (v: string) => Validate.required(v) || t('account.form.fields.newPassword.errors.required'),
  (v: string) => Validate.lengthInterval(6, 20)(v) || t('account.form.fields.newPassword.errors.lengthInterval'),
];

watch([() => password.new.value], () => {
  formRef.value?.validate().then((v) => (valid.value = v && !loading.value));
});

function onSuccess() {
  alertStore.addAlert('success', t('account.messages.password'));
}

function onFinally() {
  password.new.value = password.old.value = '';
  setTimeout(() => formRef.value?.reset(), 0);
}

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
