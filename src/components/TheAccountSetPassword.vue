<template lang="pug">
v-form(@submit.prevent="setPassword", ref="form")
   h3(:class="$style.title") Пароль
   v-text-field(
      label="Старый пароль", 
      v-model="oldPassword", 
      autocomplete="new-password", 
      :type="showOldPassword ? 'text' : 'password'",
      :append-inner-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'",
      @click:append-inner="showOldPassword = !showOldPassword"
      )
   v-text-field(
      label="Новый пароль", 
      v-model="newPassword", 
      autocomplete="new-password", 
      :rules="rules", 
      :type="showNewPassword ? 'text' : 'password'",
      :append-inner-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'",
      @click:append-inner="showNewPassword = !showNewPassword"
      )
   div(:class="$style.buttons")
      v-btn(
         type="submit", 
         :disabled="!Validate.minLength(6)(oldPassword) || !Validate.lengthInterval(6, 20)(newPassword)"
         ) Изменить
      LoadingWheel(v-if="isLoading")
</template>
      
<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '@/store/mainStore'
import { useFetching } from '@/hooks/useFetching'
import ToolsService from '@/api/services/ToolsService'
import Validate from '@/libs/Validate'

const form = ref<any>();
const store = useStore();
const newPassword = ref('');
const oldPassword = ref('');
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const rules = [
   (v: string) => Validate.lengthInterval(6, 20)(v) || 'Пароль должен включать 6-20 символов',
];
const { fetchFunc: setPassword, isLoading } =
   useFetching({ callback: setNewPassword, successMessage: 'Пароль изменен' });

async function setNewPassword() {
   if (store.alert.isVisible) store.showAlert(false);
   await ToolsService.setNewPassword(newPassword.value, oldPassword.value);
   form.value.reset();
}
</script>
      
<style lang="scss" module>
.title {
   padding: 0 5px;
}

.buttons {
   display: flex;
}
</style>