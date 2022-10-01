<template lang="pug">
div(:class="$style.container")
   div(:class="$style.search")
      div(:class="$style.search_title") Введите ФИО для поиска
      v-input-find(
         :class="$style.search_input", 
         type="text", 
         placeholder="ФИО", 
         v-model="humanStore.info.fio", 
         @keyup.enter="humanStore.findHuman"
         )
      v-button(@click="humanStore.findHuman") Найти
      v-loading-wheel(v-if="humanStore.info.isLoading")
      div(:class="$style.search_error") {{ humanStore.info.error }}
   div(:class="$style.info", v-show="humanStore.info.finded.length", v-if="!humanStore.info.isEditable") 
      div(:class="$style.info_finded") Всего найдено: {{ humanStore.info.finded.length  }}
      div(:class="$style.info_item", v-for="(item, index) in humanStore.info.finded", :key="item._id")
         div(:class="$style.item_about")
            div(:class="$style.item_title") Найдено: {{ humanStore.info.currentQuery }}
            ButtonImage(@click="setEditable($event, index, item._id)", image="images/edit.png") Редактировать
         table(:class="$style.info_table", :data-id="item._id")
            tbody
               tr(v-for="(key, value) in item.form")
                  td {{ Constants.assistance[value].display }}
                  td {{ useBeautifyValue(key) }}
div(:class="$style.form", v-show="humanStore.info.isEditable")
   FormAssistance(
      @save="submit",
      :form="assistance.form",
      :is-loading="assistance.isLoading",
      :success-message="assistance.successMessage",
      :error-message="assistance.errorMessage",
      title="Редактировать"
      )
      template(v-slot:submit="slotProps")
         ButtonImage(
            type="submit", 
            :disabled="!slotProps.form.valid", 
            image="images/confirm.png", 
            width="27px", 
            height="27px",
            background-color="var(--water-color)"
            )
      template(v-slot:cancel)
         ButtonImage(
            @click="setEditable", 
            image="images/cancel.png",
            width="27px", 
            height="27px",
            background-color="var(--water-color)"
            )
</template>


<script setup lang="ts">
import { ref, reactive } from 'vue'
import Constants from '@/libs/Constants'
import { useForm } from '@/hooks/useForm'
import { onBeforeRouteLeave } from 'vue-router'
import { useHumanStore } from '@/store/humanStore'
import { useBeautifyValue } from '@/hooks/useBeautifyValue'
import { AssistanceFormValidators } from '@/intefaces/interfaces'
import FormAssistance from './FormAssistance.vue'
import AssistanseFormDto from '@/api/dtos/AssistanseFormDto'
import AssistanceService from '@/api/services/AssistanceService'


const humanStore = useHumanStore();
const currentId = ref('');
const currentScrollY = ref(0);
const assistance = reactive({
   form: useForm<AssistanceFormValidators>(Constants.assistance),
   errorMessage: '',
   successMessage: '',
   isLoading: false,
});

onBeforeRouteLeave((to, from, next) => {
   humanStore.info.isEditable = false;
   next();
});

function setEditable(event: Event, index?: number, id?: string): void {
   if (index === undefined || !id) {
      humanStore.info.isEditable = !humanStore.info.isEditable;
      return window.scrollTo(0, currentScrollY.value);
   }
   currentScrollY.value = window.scrollY;
   humanStore.info.isEditable = !humanStore.info.isEditable;
   window.scrollTo(0, 0);
   currentId.value = id;
   (Object.keys(Constants.assistance) as Array<keyof typeof Constants.assistance>)
      .forEach((key: keyof typeof Constants.assistance) => {
         if (key === "phone") {
            assistance.form[key].value = humanStore.info.finded[index].form[key]!.slice(4);
         } else {
            assistance.form[key].value = humanStore.info.finded[index].form[key]!
         };
      });
}

async function submit(): Promise<void> {
   try {
      assistance.isLoading = true;
      const formToSend = new AssistanseFormDto(assistance.form);
      await AssistanceService.modifyAssistanceForm(formToSend, currentId.value);
      assistance.successMessage = 'Сохранено!';
      setTimeout(() => assistance.successMessage = '', 3000);
   } catch (e: any) {
      assistance.errorMessage = e?.response?.data?.message;
      setTimeout(() => assistance.errorMessage = '', 3000);
   } finally {
      assistance.isLoading = false;
   }
}
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
         color: var(--error-message-color);
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