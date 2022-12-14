<template lang="pug">
div(class="container")
   h1(class="title") Поиск
   div(class="search")
      v-text-field(
         class="search_input", 
         label="ФИО", 
         v-model="fio", 
         variant="solo",
         :error-messages="error"
         )
      v-btn(class="search_button", @click="setQuery", @keydown="onEnter") Найти
      div(v-if="isLoading", style="display: flex; justify-content: center; margin-top: 5px;")
         LoadingWheel
   div(class="info", v-if="finded?.humansFormList.length") 
      div(class="info_finded") Всего найдено: {{ finded?.humansFormList.length }}
      div(class="info_item", v-for="item in finded.humansFormList", :key="item._id")
         div(class="item_about")
            div(class="item_title") Найдено: {{ currentQuery }}
            v-icon(tag="button", @click="setEditable(item._id)", class="button") mdi-pencil
         TableAssistance(:form="item.form", style="margin-bottom: 5px !important;")
</template>
   
   
<script setup lang="ts">
import { watch, onMounted, computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFetching } from '@/hooks/useFetching'
import TableAssistance from '@/components/TableAssistance.vue'
import AssistanceService from '@/api/services/AssistanceService'
import type { FormsListResponse } from '@/interfaces/http'


const router = useRouter();
const route = useRoute();
const { fetchFunc: searchHuman, isLoading, error, data: finded } =
   useFetching<FormsListResponse>({ callback: findHuman, alert: false });
const currentSearch = computed(() => route.query.search);
const fio = ref('');
const currentQuery = ref('');


onMounted(() => {
   if (currentSearch.value && typeof currentSearch.value === 'string') {
      fio.value = route.query.search as string;
      searchHuman().then(() => currentQuery.value = fio.value);;
   }
});

watch(currentSearch, () => {
   if (currentSearch.value && typeof currentSearch.value === 'string') {
      searchHuman().then(() => currentQuery.value = fio.value);
   }
});

async function findHuman() {
   if (!fio.value) {
      return;
   }
   error.value = '';
   if (finded.value?.humansFormList)
      finded.value.humansFormList = [];
   const query = fio.value.trim().split(' ');
   if (query.length !== 3)
      throw new Error('Введите ФИО через пробел!');
   return AssistanceService.findHuman(query[0], query[1], query[2]);
}

function setQuery() {
   router.push({ query: { search: fio.value } });
}

function onEnter(event: KeyboardEvent) {
   if (event.key === 'Enter') setQuery();
}

function setEditable(id: string): void {
   router.push({ path: `/list/${id}`, query: { edit: 'true' } });
}
</script>
   
<style lang="scss" scoped>
.container {
   width: 50%;
   margin: 0 auto;

   & .title {
      text-align: center;
      padding: 20px 0;
   }
}

.search {
   display: flex;
   flex-direction: column;

   & .search_button {
      align-self: center;
   }
}

.info {
   display: flex;
   flex-direction: column;
   align-items: center;

   &>*:not(:first-child) {
      margin-top: 10px;
   }

   & .info_finded {
      padding: 10px;
      text-align: center;
   }

   & .info_item {
      .item_about {
         display: flex;
         justify-content: space-between;
         align-items: center;
      }
   }

   & .info_table {
      border-spacing: 3px;
      margin-top: 5px;
      background-color: inherit;
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

.button {
   &:hover {
      transform: scale(1.1);
   }
}

@media(max-width: 768px) {
   .container {
      width: 100%;
   }

   .info {
      width: 90%;
      margin: 0 auto;
   }

   .search_input {
      width: 90%;
      margin: 0 auto;
   }
}
</style>