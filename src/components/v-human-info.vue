<template lang="pug">
.info
   .info_title Введите ФИО для поиска
   v-input-find.info_search(type="text", placeholder="ФИО", v-model="infoStore.fio", @keyup.enter="infoStore.findHuman")
   v-button(@click="infoStore.findHuman") Найти
   v-loading-wheel(v-if="infoStore.isListLoading")
   .info_error {{ infoStore.error }}
   .info_finded(v-show="infoStore.finded.length", v-if="!infoStore.isEditable")
      .info_finded_all Всего найдено: {{ infoStore.finded.length }}
      .info_block(v-for="(item, index) in infoStore.finded", :key="item._id")
         .info_block_title
            div Найдено:
            v-button(@click="setEditable($event, index, item._id)") Редактировать
         table.collapsed(:data-id="item._id")
            tbody
               tr(v-for="(key, value) in item.form")
                  td {{ (table as any)[value] }}
                  td {{ useBeautifyValue(key) }}
   .info_edit(v-show="infoStore.isEditable")
      v-assistance-form(
         :form="assistance.form", 
         :submit="submit",  
         :error="assistance.error", 
         :success="assistance.success", 
         :is-loading="assistance.isLoading",
         title="Редактирование",
         )
         v-button.cancel_button(@click="setEditable", type="button") Отмена
</template>


<script lang="ts">
import { defineComponent, reactive, ref } from "vue"
import { useInfoStore } from "@/store/infoStore"
import { useBeautifyValue } from "@/hooks/useBeautifyValue"
import { table, init } from "@/libs/constants"
import VAssistanceForm from "./v-assistance-form.vue"
import { useForm } from "@/hooks/useForm"
import { AssistanceFormValidators } from "@/intefaces/AssistanceFormValidators"
import AssistanceFormDto from "@/api/dtos/AssistanseFormDto"
import AssistanceService from "@/api/services/AssistanceService"
import { onBeforeRouteLeave } from "vue-router"


export default defineComponent({
   setup() {
      const infoStore = useInfoStore();
      const currentId = ref('');
      const assistance = reactive({
         form: <AssistanceFormValidators>useForm(init),
         error: '',
         success: '',
         isLoading: false,
      });

      const setEditable = (event: Event, index?: number, id?: string): void => {
         infoStore.isEditable = !infoStore.isEditable;
         if (index === undefined || !id) return;
         window.scrollTo(0, 0);
         currentId.value = id;
         Object.keys(table).forEach(key => {
            (<any>assistance.form)[key].value = (<any>infoStore.finded)[index].form[key];
         });
      }
      const submit = async (): Promise<void> => {
         try {
            assistance.isLoading = true;
            const formToSend = { ...new AssistanceFormDto(assistance.form) };
            await AssistanceService.modifyAssistanceForm(<any>formToSend, currentId.value);
            assistance.success = 'Сохранено!'
            setTimeout(() => assistance.success = '', 2000);
         } catch (e: any) {
            assistance.error = e?.response?.data?.message;
            setTimeout(() => assistance.error = '', 2000);
         } finally {
            assistance.isLoading = false;
         }
      }

      onBeforeRouteLeave((to, from, next) => {
         infoStore.isEditable = false;
         next();
      });

      return { infoStore, assistance, table, useBeautifyValue, setEditable, submit, };
   },
   components: { VAssistanceForm }
})
</script>

<style lang="scss" scoped>
.info {
   padding: 10px;
   display: flex;
   flex-direction: column;
   align-items: center;

   & .info_error {
      color: red;
      text-align: center;
      font-weight: bolder;
   }

   & .info_edit {
      width: 50%;

      & .cancel_button {
         height: 30px;
      }
   }

   & .info_title {
      text-align: center;
      font-size: 1.5em;
   }

   & .info_search {
      width: 50%;
      margin-top: 10px;
      display: block;
   }

   & .info_finded {
      text-align: justify;
      margin-top: 10px;
      width: 50%;

      & .info_finded_all {
         text-align: center;
         width: 100%;
      }

      & .info_block {
         display: flex;
         flex-direction: column;
         align-items: center;
         width: 100%;

         & .info_block_title {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            width: 100%;
         }
      }
   }
}

@media(max-width: 700px) {

   .info_search {
      width: 95% !important;
   }

   .info_finded {
      width: 95% !important;
   }

   .info_edit {
      width: 95% !important;
   }
}

.collapsed {
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
   }
}

button {
   margin-top: 5px !important;
}
</style>