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


<script lang="ts">
import { defineComponent, reactive } from "vue"
import { useForm } from "@/hooks/useForm"
import AssistanceService from "@/api/services/AssistanceService"
import AssistanceFormDto from "@/api/dtos/AssistanseFormDto"
import { AssistanceForm } from "@/intefaces/AssistanceForm"
import { useDefaultValues } from "@/hooks/useDefaultValues"
import { AssistanceFormValidators } from "@/intefaces/AssistanceFormValidators"
import vAssistanceForm from "./v-assistance-form.vue"
import { init } from "@/libs/constants"

export default defineComponent({
   components: { vAssistanceForm },
   setup() {
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

      return { assistance, submit }
   }
})
</script>

<style lang="scss" scoped>
.assistance-form-container {
   display: flex;
   justify-content: center;
}
</style>