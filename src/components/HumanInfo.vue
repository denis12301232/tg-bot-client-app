<template lang="pug">
div(:class="$style.container")
   div(:class="$style.search")
      div(:class="$style.search_title") Введите ФИО для поиска
      v-input-find(
         :class="$style.search_input", 
         type="text", 
         placeholder="ФИО", 
         v-model="infoStore.fio", 
         @keyup.enter="infoStore.findHuman"
         )
      v-button(@click="infoStore.findHuman") Найти
      v-loading-wheel(v-if="infoStore.isListLoading")
      div(:class="$style.search_error") {{ infoStore.error }}
   div(:class="$style.info", v-show="infoStore.finded.length", v-if="!infoStore.isEditable") 
      div(:class="$style.info_finded") Всего найдено: {{ infoStore.finded.length  }}
      div(:class="$style.info_item", v-for="(item, index) in infoStore.finded", :key="item._id")
         div(:class="$style.item_about")
            div(:class="$style.item_title") Найдено: {{ infoStore.currentQuery }}
            v-button-edit(@click="setEditable($event, index, item._id)") Редактировать
         table(:class="$style.info_table", :data-id="item._id")
            tbody
               tr(v-for="(key, value) in item.form")
                  td {{ Constants.assistance[value].display }}
                  td {{ useBeautifyValue(key) }}
div(:class="$style.form", v-show="infoStore.isEditable")
   FormAssistance(
      :form="assistance.form",
         :is-loading="assistance.isLoading",
         :success-message="assistance.successMessage",
         :error-message="assistance.errorMessage"
         :submit="submit",
         title="Редактировать"
      )
      template(v-slot:submit="slotProps")
         v-button-confirm(type="submit", :disabled="!slotProps.form.valid")
      template(v-slot:cancel)
         v-button-cancel(@click="setEditable")
</template>


<script setup lang="ts">
import { ref, reactive } from "vue"
import Constants from "@/libs/Constants"
import { useForm } from "@/hooks/useForm"
import { useInfoStore } from "@/store/infoStore"
import { useBeautifyValue } from "@/hooks/useBeautifyValue"
import { AssistanceFormValidators } from "@/intefaces/interfaces"
import FormAssistance from "./FormAssistance.vue"
import { onBeforeRouteLeave } from "vue-router"
import AssistanseFormDto from "@/api/dtos/AssistanseFormDto"
import AssistanceService from "@/api/services/AssistanceService"


const infoStore = useInfoStore();
const currentId = ref('');
const assistance = reactive({
   form: useForm<AssistanceFormValidators>(Constants.assistance),
   errorMessage: '',
   successMessage: '',
   isLoading: false,
});

const setEditable = (event: Event, index?: number, id?: string): void => {
   if (index === undefined || !id) {
      infoStore.isEditable = !infoStore.isEditable;
      window.scrollTo(0, infoStore.currentScrollY);
   } else {
      infoStore.currentScrollY = window.pageYOffset;
      infoStore.isEditable = !infoStore.isEditable;
      window.scrollTo(0, 0);
      currentId.value = id;
      (Object.keys(Constants.assistance) as Array<keyof typeof Constants.assistance>)
         .forEach((key: keyof typeof Constants.assistance) => {
            if (key === "phone") {
               assistance.form[key].value = infoStore.finded[index].form[key]!.slice(4);
            } else {
               assistance.form[key].value = infoStore.finded[index].form[key]!
            };
         });
   }
}
const submit = async (): Promise<void> => {
   try {
      assistance.isLoading = true;
      const formToSend = new AssistanseFormDto(assistance.form);
      await AssistanceService.modifyAssistanceForm(formToSend, currentId.value);
      assistance.successMessage = 'Сохранено!';
      setTimeout(() => assistance.successMessage = '', 3000);
   } catch (e: any) {
      console.log(e);

      assistance.errorMessage = e?.response?.data?.message;
      setTimeout(() => assistance.errorMessage = '', 3000);
   } finally {
      assistance.isLoading = false;
   }
}

onBeforeRouteLeave((to, from, next) => {
   infoStore.isEditable = false;
   next();
});
</script>

<style lang="scss" module>
.container {
   padding: 10px;

   & .search {
      display: flex;
      flex-direction: column;
      align-items: center;

      &>*:not(:first-child) {
         margin-top: 10px;
      }

      & .search_title {
         text-align: center;
         font-size: 1.5em;
      }

      & .search_input {
         width: 50%;
         display: block;
         min-width: 300px;
      }

      & .search_error {
         color: $error-message-color;
         text-align: center;
         font-weight: bolder;
      }
   }

   & .info {
      display: flex;
      flex-direction: column;
      align-items: center;

      &>*:not(:first-child) {
         margin-top: 10px;
      }

      & .info_finded {
         text-align: center;
      }

      & .info_item {
         width: 50%;

         .item_about {
            display: flex;
            justify-content: space-between;
            align-items: center;
         }
      }

      & .info_table {
         border-spacing: 3px;
         margin-top: 5px;
         background-color: white;
         border-collapse: collapse;
         border-radius: 10px;
         border-style: hidden;
         box-shadow: 0 0 0 1px #ccc;
         width: 100%;
         table-layout: fixed;

         & td,
         th {
            border: solid 1px #ccc;
            padding: 10px;
            border-radius: 10px;
            overflow: auto;
            word-wrap: break-word;
         }
      }
   }


}

.form {
   display: flex;
   justify-content: center;

   &>form {
      width: 50%;
   }
}

@media(max-width: 768px) {
   .container {
      & .search {
         & .search_input {
            width: 95%;
         }
      }

      & .info {
         & .info_item {
            width: 95%;
         }
      }
   }

   .form {
      &>form {
         width: 95%;
         padding: 0;
      }
   }
}
</style>