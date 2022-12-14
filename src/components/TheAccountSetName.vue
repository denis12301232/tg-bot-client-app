<template lang="pug">
form(@submit.prevent="setName")
   h3(:class="$style.title") Имя
   v-text-field(
      label="Имя", 
      v-model="name", 
      :rules="rules",
      :append-inner-icon="name !== store.user.name ? 'mdi-close-circle' : undefined",
      @click:append-inner="onCancel"
      )
   div(:class="$style.list_buttons")
      v-btn(v-if="name !== store.user.name", type="submit") Изменить
      LoadingWheel(v-if="isLoading")
</template>
   
<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '@/store/mainStore'
import { useFetching } from '@/hooks/useFetching'
import ToolsService from '@/api/services/ToolsService'
import Validate from '@/libs/Validate'

const store = useStore();
const name = ref(store.user.name);
const error = ref('');
const rules = [
   (v: string) => Validate.required(v) || 'Введите имя',
];

const { fetchFunc: setName, isLoading } =
   useFetching({ callback: setNewName, successMessage: 'Имя изменено' });

function onCancel() {
   name.value = store.user.name;
   error.value = '';
}

async function setNewName() {
   if (store.alert.isVisible) store.showAlert(false);
   await ToolsService.setNewName(name.value);
   store.user.name = name.value;
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