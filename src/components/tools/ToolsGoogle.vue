<template lang="pug">
form(class="form" @submit.prevent="onSetSettings")
   h5(class="title") Настроить интеграцию с Google
   QInput(v-model="google.serviceUser" class="input" outlined label="Service account user")
   QInput(v-model="google.servicePrivateKey" class="input" outlined label="Service account private key")
   QInput(v-model="google.sheetId" class="input" outlined label="Sheet id")
   QInput(v-model="google.folderId" class="input" outlined label="Folder id")
   QBtn(type="submit" :loading="loading" :disable="isDisabled" color="primary") Сохранить
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useFetch } from '@/hooks'
import { ToolsService } from '@/api/services'


const google = reactive({
   serviceUser: '',
   servicePrivateKey: '',
   sheetId: '',
   folderId: '',
});
const isDisabled = computed(() => {
   return !google.serviceUser && !google.servicePrivateKey && !google.sheetId && !google.folderId || loading.value;
});
const { f: onSetSettings, loading } = useFetch({
   fn: () => ToolsService.setGoogleServiceAccountSettings(google)
      .then(() => {
         google.serviceUser = '';
         google.servicePrivateKey = '';
         google.sheetId = '';
         google.folderId = '';
      }),
   successMsg: 'Сохранено',
   alert: true
});

</script>

<style scoped lang="scss">
.form {
   & .title {
      margin: 20px 0 10px 0;
   }

   & .input {
      margin-bottom: 10px;
   }
}
</style>