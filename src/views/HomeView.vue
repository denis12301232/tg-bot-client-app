<template lang="pug">
the-header(@show="store.setMenuVisible", @theme="store.setTheme")
the-header-menu
div(class="content")
   FormAssistance(@save="sendForm", :form="form", :is-loading="isLoading")
      template(v-slot:submit="slotProps")
         v-btn(type="submit" :disabled="!slotProps.form.valid") Отправить
</template>

<script setup lang="ts">
import { useStore } from "@/store/mainStore"
import { useFetching } from "@/hooks/useFetching"
import { useDefaultValues } from '@/hooks/useDefaultValues'
import TheHeader from '@/components/TheHeader.vue'
import TheHeaderMenu from "@/components/TheHeaderMenu.vue"
import FormAssistance from '@/components/FormAssistance.vue'
import { useForm } from "@/hooks/useForm"
import type { AssistanceFormValidators } from "@/interfaces/interfaces"
import AssistanceFormDto from '@/api/dtos/AssistanseFormDto'
import AssistanceService from '@/api/services/AssistanceService'
import Constants from "@/libs/Constants"

const store = useStore();
const form = useForm<AssistanceFormValidators>(Constants.assistance);

const { fetchFunc: sendForm, isLoading } =
   useFetching({ callback: submit, successMessage: 'Отправлено' });

async function submit(form: AssistanceFormValidators) {
   const formToSend = new AssistanceFormDto(form);
   await AssistanceService.sendForm(formToSend);
   useDefaultValues(form);
}
</script>

<style lang="scss" scoped>
.content {
   position: relative;
   display: flex;
   justify-content: center;
}
</style>
