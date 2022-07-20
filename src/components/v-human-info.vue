<template lang="pug">
.info
   .info_title Введите ФИО для поиска
   input.info_search(type="text", placeholder="ФИО", v-model="infoStore.fio", @keyup.enter="infoStore.findHuman")
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
   .edit(v-show="infoStore.isEditable")
      v-assistance-form(
         :form="form", 
         :submit="submit",  
         :error="error", 
         :success="success", 
         :is-loading="isLoading",
         title="Редактирование",
         )
         v-button.test(@click="setEditable", type="button") Отмена
</template>


<script lang="ts">
import { defineComponent, ref } from "vue"
import { useInfoStore } from "@/store/infoStore"
import { useBeautifyValue } from "@/hooks/useBeautifyValue"
import { table, init } from "@/libs/constants"
import VAssistanceForm from "./v-assistance-form.vue"
import { useForm } from "@/hooks/useForm"
import { AssistanceFormValidators } from "@/intefaces/AssistanceFormValidators"
import AssistanceFormDto from "@/api/dtos/AssistanseFormDto"
import AssistanceService from "@/api/services/AssistanceService"

export default defineComponent({
   setup() {
      const infoStore = useInfoStore();
      const currentId = ref('');
      const form: AssistanceFormValidators = useForm(init);
      const error = ref('');
      const success = ref('');
      const isLoading = ref(false);

      const setEditable = (event: Event, index?: number, id?: string): void => {
         infoStore.isEditable = !infoStore.isEditable;
         if (index === undefined || !id) return;
         currentId.value = id;
         Object.keys(table).forEach(key => {
            (<any>form)[key].value = (<any>infoStore.finded)[index].form[key];
         });
      }
      const submit = async (event: Event): Promise<void> => {
         try {
            isLoading.value = true;
            const formToSend = { ...new AssistanceFormDto(form) };
            const response = await AssistanceService.modifyAssistanceForm(<any>formToSend, currentId.value);
            console.log(response);
            success.value = 'Сохранено!'
            setTimeout(() => success.value = '', 2000);
         } catch (e: any) {
            error.value = e?.response?.data?.message;
            setTimeout(() => error.value = '', 2000);
         } finally {
            isLoading.value = false;
         }
      }

      return { infoStore, table, useBeautifyValue, setEditable, form, submit, error, success, isLoading };
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

.edit{
   width: 50%;
}

.test {
   height: 30px;
}


@media(max-width: 700px) {

   .info_search {
      width: 95% !important;
   }

   .info_finded {
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

.info_error {
   color: red;
   text-align: center;
   font-weight: bolder;
}

</style>