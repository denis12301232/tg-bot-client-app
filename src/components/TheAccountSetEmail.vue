<template lang="pug">
form(@submit.prevent="setEmail")
   h3(:class="$style.title") Е-мэйл
   v-text-field(
      label="Е-мэйл", 
      v-model="email",
      :rules="rules",
      :append-inner-icon="email !== store.user.email ? 'mdi-close-circle' : undefined",
      @click:append-inner="onCancel"
      )
   div(:class="$style.list_buttons")
      v-btn(v-if="email !== store.user.email", type="submit") Изменить
      LoadingWheel(v-if="isLoading")
</template>
      
<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '@/store/mainStore'
import { useFetching } from '@/hooks/useFetching'
import ToolsService from '@/api/services/ToolsService'
import Validate from '@/libs/Validate'
import LoadingWheel from './UI/LoadingWheel.vue'


const store = useStore();
const email = ref(store.user.email);
const error = ref('');
const rules = [
   (v: string) => Validate.isEmail(v) || 'Введите корректный е-мэйл',
];

const { fetchFunc: setEmail, isLoading } =
   useFetching({ callback: setNewEmail, successMessage: 'Е-мэйл изменен' });

function onCancel() {
   email.value = store.user.email;
   error.value = '';
}

async function setNewEmail() {
   if (store.alert.isVisible) store.showAlert(false);
   await ToolsService.setNewEmail(email.value);
   store.user.email = email.value;
}
</script>
      
<style lang="scss" module>
.title {
   padding: 0 5px;
}

.list_buttons {
   display: flex;
   align-items: center;
}
</style>