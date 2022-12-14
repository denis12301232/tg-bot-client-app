<template lang="pug">
form(class="google", @submit.prevent="setGoogle")
   v-text-field(v-model="googleApi.serviceUser", variant="outlined", label="Service account email")
   v-text-field(v-model="googleApi.servicePrivateKey", variant="outlined", label="Service account private key")
   v-text-field(v-model="googleApi.sheetId", variant="outlined", label="Sheet ID")
   v-text-field(v-model="googleApi.folderId", variant="outlined", label="Folder ID")
   div(class="google_control")
      v-btn(type="submit", :disabled="isDisabled") Сохранить
      LoadingWheel(v-if="isLoading")
      div(class="google_message") {{googleApi.message}}
</template>
      
<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useFetching } from '@/hooks/useFetching'
import ToolsService from '@/api/services/ToolsService'

const googleApi = reactive({
   serviceUser: '',
   servicePrivateKey: '',
   sheetId: '',
   folderId: '',
   message: '',
});
const isDisabled = computed(() => {
   return !googleApi.serviceUser && !googleApi.servicePrivateKey && !googleApi.sheetId && !googleApi.folderId;
});
const { fetchFunc: setGoogle, isLoading } =
   useFetching({ callback: setGoogleApi, successMessage: 'Сохранено' });

async function setGoogleApi() {
   await ToolsService.setGoogleServiceAccountSettings(
      googleApi.serviceUser, googleApi.servicePrivateKey, googleApi.sheetId, googleApi.folderId
   );
   googleApi.serviceUser = '';
   googleApi.servicePrivateKey = '';
   googleApi.sheetId = '';
   googleApi.folderId = '';
}
</script>
      
<style lang="scss" scoped>
.google {
   padding: 10px 0;
}
</style>