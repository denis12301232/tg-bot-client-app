<template lang="pug">
TheHeader
div(class="content")
   FormAssistance(
      @save="submit",
      :form="assistance.form", 
      :is-loading="assistance.isLoading", 
      :success-message="assistance.successMessage"
      :error-message="assistance.errorMessage"
      )
      template(v-slot:submit="slotProps")
         v-button(type="submit" :disabled="!slotProps.form.valid") Отправить
</template>

<script setup lang="ts">
import { reactive } from "vue"
import { useForm } from '@/hooks/useForm'
import Constants from '@/libs/Constants'
import TheHeader from '@/components/TheHeader.vue'
import FormAssistance from '@/components/FormAssistance.vue'
import AssistanceFormDto from '@/api/dtos/AssistanseFormDto'
import { useDefaultValues } from '@/hooks/useDefaultValues'
import { AssistanceFormValidators } from '@/intefaces/interfaces'
import AssistanceService from '@/api/services/AssistanceService'


const assistance = reactive({
   form: useForm<AssistanceFormValidators>(Constants.assistance),
   errorMessage: '',
   successMessage: '',
   isLoading: false,
});

async function submit(): Promise<void> {
   try {
      assistance.isLoading = true;
      const formToSend = new AssistanceFormDto(assistance.form);
      await AssistanceService.sendForm(formToSend);
      useDefaultValues(assistance.form);
      assistance.successMessage = 'Заявка отправлена!'
      setTimeout(() => assistance.successMessage = '', 2000);
   } catch (e: any) {
      assistance.errorMessage = e?.response?.data?.message;
      setTimeout(() => assistance.errorMessage = '', 2000);
   } finally {
      assistance.isLoading = false;
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
</style>
