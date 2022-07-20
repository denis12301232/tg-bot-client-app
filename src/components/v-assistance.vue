<template lang="pug">
div.assistance-form-container
   v-assistance-form(
      :form="form", 
      :error="error", 
      :success="success", 
      :is-loading="isLoading", 
      :submit="submit"
      )
</template>


<script lang="ts">
import { defineComponent, ref } from "vue"
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
      const error = ref('');
      const success = ref('');
      const isLoading = ref(false);
      const form: AssistanceFormValidators = useForm(init);

      const submit = async (event: Event): Promise<void> => {
         try {
            isLoading.value = true;
            const formToSend = { ...new AssistanceFormDto(form) };
            await AssistanceService.sendForm(<AssistanceForm>formToSend);
            useDefaultValues(form);
            success.value = 'Заявка отправлена!'
            setTimeout(() => success.value = '', 2000);

         } catch (e: any) {
            error.value = e?.response?.data?.message;
            setTimeout(() => error.value = '', 2000);
         } finally {
            isLoading.value = false;
         }
      }

      return { form, submit, error, isLoading, success }
   }
})
</script>

<style lang="scss" scoped>
.assistance-form-container{
   display: flex;
   justify-content: center;
}
</style>