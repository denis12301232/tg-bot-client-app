<template>
  <div class="column items-center q-pa-sm">
    <form :class="$style.form" @submit.prevent="request(google)">
      <h5 class="q-pa-lg text-center">Настроить интеграцию с Google</h5>
      <QInput v-model="google.serviceUser" class="q-mb-md" standout clearable label="Service account user" />
      <QInput
        v-model="google.servicePrivateKey"
        class="q-mb-md"
        standout
        clearable
        label="Service account private key"
        type="textarea"
        autogrow
      />
      <QInput v-model="google.sheetId" class="q-mb-md" standout clearable label="Sheet ID" />
      <QInput v-model="google.folderId" class="q-mb-md" standout clearable label="Folder ID" />
      <div class="row justify-center">
        <QBtn type="submit" :loading="loading" :disable="!valid || loading" color="red-10">Сохранить</QBtn>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import { useFetch } from '@/hooks';
import { ToolsService } from '@/api/services';
import { useStore } from '@/stores';

const store = useStore();
const google = reactive({
  serviceUser: '',
  servicePrivateKey: '',
  sheetId: '',
  folderId: '',
});
const valid = computed(() => !!Object.values(google).reduce((sum, item) => (sum += item.length), 0));
const { request, loading } = useFetch(ToolsService.setGoogleServiceAccountSettings, {
  afterResponse: ({ response }) => {
    response.status === 200
      ? store.setAlert(true, { message: 'Сформировано' })
      : store.setAlert(true, { message: 'Ничего не найдено по запросу!', type: 'error' });
    Object.keys(google).forEach((key) => (google[key as keyof typeof google] = ''));
  },
});
</script>

<style lang="scss" module>
.form {
  max-width: 500px;
  width: 100%;
}
</style>
