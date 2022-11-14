<template lang="pug">
TheHeader
AlertModal(
   class="alert", 
   :message="store.alert.message", 
   @show="store.showAlert", 
   :is-visible="store.alert.isVisible", :type="store.alert.type"
   )
div(class="content")
   FormAssistance(@save="submit", :form="form", :is-loading="isLoading")
      template(v-slot:submit="slotProps")
         v-button(type="submit" :disabled="!slotProps.form.valid") Отправить
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useForm } from '@/hooks/useForm'
import Constants from '@/libs/Constants'
import TheHeader from '@/components/TheHeader.vue'
import FormAssistance from '@/components/FormAssistance.vue'
import AssistanceFormDto from '@/api/dtos/AssistanseFormDto'
import { useDefaultValues } from '@/hooks/useDefaultValues'
import { AssistanceFormValidators } from '@/intefaces/interfaces'
import AssistanceService from '@/api/services/AssistanceService'
import AlertModal from "@/components/AlertModal.vue"
import { useStore } from "@/store/mainStore"

const store = useStore();
const form = ref(useForm<AssistanceFormValidators>(Constants.assistance));
const isLoading = ref(false);

async function submit(): Promise<void> {
   try {
      isLoading.value = true;
      const formToSend = new AssistanceFormDto(form.value);
      await AssistanceService.sendForm(formToSend);
      useDefaultValues(form.value);
      store.setAlert('success', 'Отправлено!');
   } catch (e: any) {
      store.setAlert('error', e?.response?.data?.message);
   } finally {
      isLoading.value = false;
      store.showAlert();
   }
}
</script>

<style lang="scss" scoped>
.content {
   top: 50px;
   position: relative;
   display: flex;
   justify-content: center;
}

.alert {
   position: fixed;
   right: 5px;
   top: 55px;
   z-index: 9999;
}
</style>
