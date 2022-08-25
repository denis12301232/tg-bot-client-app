<template lang="pug">
div(class="container")
   FormAssistance(
      :form="assistance.form", 
      :is-loading="assistance.isLoading", 
      :submit="submit",
      :success-message="assistance.successMessage"
      :error-message="assistance.errorMessage"
      )
      template(v-slot:submit="slotProps")
         v-button(type="submit" :disabled="!slotProps.form.valid") Отправить
</template>


<script setup lang="ts">

import FormAssistance from "@/components/FormAssistance.vue";
import { reactive } from "vue";
import { useForm } from "@/hooks/useForm"
import { AssistanceFormValidators } from "@/intefaces/interfaces"
import AssistanceFormDto from "@/api/dtos/AssistanseFormDto"
import Constants from "@/libs/Constants"
import { useDefaultValues } from "@/hooks/useDefaultValues";
import AssistanceService from "@/api/services/AssistanceService";

const assistance = reactive({
   form: useForm<AssistanceFormValidators>(Constants.assistance),
   errorMessage: '',
   successMessage: '',
   isLoading: false,
});

const submit = async (): Promise<void> => {
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
.container {
   display: flex;
   justify-content: center;
}
</style>