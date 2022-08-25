<template lang="pug">
v-button(class="home_button", @click="$router.push('/')") На главную
div(class="container")
   h1 Инструменты
   ul(class="sheets")
      h3 Выгрузить заявки в Google Sheets
      li(class="sheets_block") 
         h4 Выгрузить все
         div(class="sheets_button")
            v-button(
               @click="saveFormsToSheet(formsQueries.all)", 
               :disabled="isFormsLoading"
               ) Сформировать
            v-loading-wheel(v-if="formsQueries.all.isLoading")
            div(class="sheets_message") {{ formsQueries.all.message }}
         a(class="sheets_link", target="_blank", :href="formsQueries.all.link", v-if="formsQueries.all.link") Ссылка на выгруженные заявки
      li(class="sheets_block") 
         h4 Выгрузить по району
         v-select(v-model="formsQueries.district.query", :style="{width: 'inherit'}")
         div(class="sheets_button")
            v-button(
               @click="saveFormsToSheet(formsQueries.district)", 
               :disabled="formsQueries.district.query === 'Район' || isFormsLoading"
               ) Сформировать
            v-loading-wheel(v-if="formsQueries.district.isLoading")
            div(class="sheets_message") {{ formsQueries.district.message }}
         a(class="sheets_link", target="_blank", :href="formsQueries.district.link", v-if="formsQueries.district.link") Ссылка на выгруженные заявки
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import AssistanceService from '@/api/services/AssistanceService';

const isFormsLoading = ref(false);
const formsQueries = reactive({
   all: {
      filter: 'all',
      query: 'all',
      isLoading: false,
      message: '',
      link: '',
   },
   district: {
      filter: 'district',
      query: 'Район',
      isLoading: false,
      message: '',
      link: '',
   }
})

const saveFormsToSheet = async (opts: typeof formsQueries.all) => {
   try {
      opts.isLoading = true;
      isFormsLoading.value = true;
      const response = await AssistanceService.saveFormsToSheet(opts.filter, opts.query);
      opts.message = response.data.message;
      opts.link = response.data.link;
   } catch (e: any) {
      console.log(e);
      opts.message = e.response.data.message;
      setTimeout(() => opts.message = '', 2000);
   } finally {
      isFormsLoading.value = false;
      opts.isLoading = false;
      setTimeout(() => opts.message = '', 2000);
   }
}
</script>

<style lang="scss" scoped>
.home_button {
   margin: 10px 0px 0px 10px;
}

.container {
   margin: 0 auto;
   width: 90%;

   & .sheets {

      & .sheets_block {

         & .sheets_link {
            display: inline-block;
            margin-top: 10px;
            border-bottom: 2px solid $main-color;
            color: rgb(32, 143, 71);
            text-decoration: none;
            font-weight: bolder;
            cursor: pointer;

            &:visited {
               color: rgb(32, 143, 71);
            }

            &:hover,
            &:focus {
               color: #C4433A;
               border-bottom: 2px dashed $main-color;
            }

         }

         & .sheets_button {
            display: flex;
            align-items: center;
            margin-top: 10px;

            &>*:not(:first-child) {
               margin: 0 0 0 5px;
            }
         }

         & .sheets_message {
            color: rgb(32, 143, 71);
            font-weight: bold;
         }
      }
   }
}

@media(max-width:768px) {
   .container {
      & h1 {
         text-align: center;
      }
   }
}
</style>