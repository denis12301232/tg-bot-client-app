<template lang="pug">
div(class="container")
   h1(class="title") Поиск
   div(class="search")
      v-text-field(
         class="search_input", 
         label="ФИО", 
         v-model="humanStore.info.fio", 
         variant="solo",
         :error-messages="humanStore.info.error"
         )
      v-btn(class="search_button", @click="humanStore.findHuman", @keydown.enter="onClick") Найти
      div(v-if="humanStore.info.isLoading", style="display: flex; justify-content: center; margin-top: 5px;")
         LoadingWheel
   div(class="info", v-if="humanStore.info.finded.length") 
      div(class="info_finded") Всего найдено: {{ humanStore.info.finded.length  }}
      div(class="info_item", v-for="(item, index) in humanStore.info.finded", :key="item._id")
         div(class="item_about")
            div(class="item_title") Найдено: {{ humanStore.info.currentQuery }}
            v-icon(tag="button", @click="setEditable(item._id)", class="button") mdi-pencil
         TableAssistance(:form="item.form", style="margin-bottom: 5px !important;")
</template>
   
   
<script setup lang="ts">
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useHumanStore } from '@/store/humanStore'
import TableAssistance from './TableAssistance.vue'

const humanStore = useHumanStore();
const router = useRouter();

onBeforeRouteLeave((to, from, next) => {
   humanStore.info.isEditable = false;
   next();
});

function onClick(event: KeyboardEvent) {
   if (event.key === 'Enter') humanStore.findHuman();
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