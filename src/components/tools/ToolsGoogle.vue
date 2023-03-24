<template>
  <form class="form" @submit.prevent="onSetSettings">
    <h5 class="q-my-lg text-center">Настроить интеграцию с Google</h5>
    <QInput class="q-mb-md" v-model="google.serviceUser" outlined label="Service account user" />
    <QInput
      class="q-mb-md"
      v-model="google.servicePrivateKey"
      outlined
      label="Service account private key"
      type="textarea"
      clearable
      autogrow
    />
    <QInput class="q-mb-md" v-model="google.sheetId" outlined label="Sheet id" />
    <QInput class="q-mb-md" v-model="google.folderId" outlined label="Folder id" />
    <QBtn type="submit" :loading="loading" :disable="isDisabled" color="primary" label="Сохранить" />
  </form>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import { useFetch } from '@/hooks';
import { ToolsService } from '@/api/services';

const google = reactive({
  serviceUser: '',
  servicePrivateKey: '',
  sheetId: '',
  folderId: '',
});
const isDisabled = computed(() => {
  return (!google.serviceUser && !google.servicePrivateKey && !google.sheetId && !google.folderId) || loading.value;
});
const { f: onSetSettings, loading } = useFetch({
  fn: () =>
    ToolsService.setGoogleServiceAccountSettings(google).then(() => {
      google.serviceUser = '';
      google.servicePrivateKey = '';
      google.sheetId = '';
      google.folderId = '';
    }),
  successMsg: 'Сохранено',
  alert: true,
});
</script>

<style scoped lang="scss">
.form {
  padding: 0 20px;
}

@media (max-width: 480px) {
  .form {
    padding: 0;
  }
}
</style>
