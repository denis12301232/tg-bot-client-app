<template lang="pug">
.assistance-form-container
   v-assistance-form(
      :form="assistance.form", 
      :error="assistance.error", 
      :success="assistance.success", 
      :is-loading="assistance.isLoading", 
      :submit="submit"
      )
</template>


<script setup lang="ts">
import { reactive } from "vue"
import { useForm } from "@/hooks/useForm"
import AssistanceService from "@/api/services/AssistanceService"
import AssistanceFormDto from "@/api/dtos/AssistanseFormDto"
import { AssistanceForm, AssistanceFormValidators } from "@/intefaces/interfaces"
import { useDefaultValues } from "@/hooks/useDefaultValues"
import vAssistanceForm from "./v-assistance-form.vue"
import { init } from "@/libs/constants"

const assistance = reactive({
   form: <AssistanceFormValidators>useForm(init),
   error: '',
   success: '',
   isLoading: false,
});

const submit = async (): Promise<void> => {
   try {
      assistance.isLoading = true;
      const formToSend = { ...new AssistanceFormDto(assistance.form) };
      await AssistanceService.sendForm(<AssistanceForm>formToSend);
      useDefaultValues(assistance.form);
      assistance.success = 'Заявка отправлена!'
      setTimeout(() => assistance.success = '', 2000);
   } catch (e: any) {
      assistance.error = e?.response?.data?.message;
      setTimeout(() => assistance.error = '', 2000);
   } finally {
      assistance.isLoading = false;
   }
}
</script>

<style lang="scss" scoped>
.assistance-form-container {
   display: flex;
   justify-content: center;
}
</style>