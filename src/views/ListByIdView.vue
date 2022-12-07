<template lang="pug"> 
TheError(v-if="!store.user.email", :code="403", message="Forbidden")
div(v-else-if="isFormLoading", class="loader")
   LoadingWheel
TheError(v-else-if="!Object.entries(form || {}).length", :code="404", message="Not Found")
template(v-else)
   v-btn(class="home_button", @click="$router.push('/')") На главную
   div(class="container")   
      h1(class="title") Информация о заявке
      div(class="info")
         template(v-if="!isEditable")
            div(class="buttons")
               span
               v-icon(tag="button", class="button", @click="setEditable") mdi-pencil
            TableAssistance(:form="form || voidForm")
         template(v-else)
            FormAssistance(@save="updateForm", :form="formWithValidators", :is-loading="isLoading", title="Редактировать")
               template(v-slot:submit="slotProps")
                  v-btn(type="submit", :disabled="!slotProps.form.valid") Ok
               template(v-slot:cancel)
                  v-btn(@click.prevent="unsetEditable") Отмена
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store/mainStore'
import { useForm } from '@/hooks/useForm'
import { useFetching } from '@/hooks/useFetching'
import AssistanceService from '@/api/services/AssistanceService'
import type { AssistanceForm, AssistanceFormValidators } from '@/interfaces/interfaces'
import Constants from '@/libs/Constants'
import AssistanseFormDto from '@/api/dtos/AssistanseFormDto'
import TheError from '@/components/TheError.vue'
import TableAssistance from '@/components/TableAssistance.vue'
import FormAssistance from '@/components/FormAssistance.vue'

const voidForm = {} as AssistanceForm;
const store = useStore();
const id = useRoute().params.id as string;
const router = useRouter();
const route = useRoute();
const formWithValidators = useForm<AssistanceFormValidators>(Constants.assistance);
const isEditable = ref(route.query.edit === 'true' ? true : false);
const { fetchFunc: getForm, isLoading: isFormLoading, data: form } =
   useFetching<AssistanceForm & { _id: string; }>({ callback: async () => AssistanceService.getFormById(id), alert: false });
const { fetchFunc: updateForm, isLoading } =
   useFetching({ callback: submit, successMessage: 'Обновлено' });

onMounted(() => {
   getForm().then(() => { if (route.query.edit === 'true') fillForm() });
});

watch(route, () => {
   route.query.edit === 'true' ? isEditable.value = true : isEditable.value = false;
   if (route.query.edit === 'true') fillForm();
}, { deep: true });

function fillForm() {
   (Object.keys(Constants.assistance) as Array<keyof typeof Constants.assistance>)
      .forEach((key) => {
         if (key === "phone") {
            formWithValidators[key].value = form.value![key].slice(4);
         } else {
            formWithValidators[key].value = form.value![key];
         }
      });
}

function setEditable() {
   router.push({ query: { edit: 'true' } });
}

function unsetEditable() {
   router.push({ query: { edit: 'false' } });
}

async function submit() {
   const formToSend = new AssistanseFormDto(formWithValidators);
   await AssistanceService.modifyAssistanceForm(formToSend, id);
   await getForm();
   setEditable();
}
</script>


<style lang="scss" scoped>
.home_button {
   margin: 10px 0px 0px 10px;
}

.container {
   width: 95%;
   margin: 0 auto;

}

.loader {
   display: flex;
   justify-content: center;
   align-items: center;
   height: 100%;
}

.title {
   text-align: center;
   padding: 10px 0;
}

.info {
   width: 50%;
   margin: 0 auto;
   padding-bottom: 10px;

   & .buttons {
      display: flex;
      justify-content: space-between;
      align-items: center;

      & .button {
         &:hover {
            transform: scale(1.1);
         }
      }
   }
}

@media (max-width: 768px) {
   .info {
      width: 100%;
   }
}
</style>