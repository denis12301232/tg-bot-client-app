<template lang="pug">
.info
   .info_title Введите ФИО для поиска
   input.info_search(type="text", placeholder="ФИО", v-model="infoStore.fio", @keyup.enter="infoStore.findHuman")
   v-button(@click="infoStore.findHuman") Найти
   v-loading-wheel(v-if="infoStore.isListLoading")
   .info_error {{ infoStore.error }}
   .info_finded(v-show="infoStore.finded.length")
      .info_finded_all Всего найдено: {{ infoStore.finded.length }}
      .info_block(v-for="(item, index) in infoStore.finded", :key="item._id")
         h3 Найдено:
         button(@click="canEdit") Редактировать
         table.collapsed(:data-id="item._id")
            tbody
               tr(v-for="(key, value) in item.form")
                  td {{ (table as any)[value] }}
                  td(
                     :contenteditable="isEditable",
                     :data-key="value", 
                     @input="test($event, index)"
                     ) {{ useBeautifyValue(key) }}
</template>


<script lang="ts">
import { defineComponent, ref } from "vue";
import { useInfoStore } from "@/store/infoStore"
import { useBeautifyValue } from "@/hooks/useBeautifyValue"
import { table } from "@/libs/constants"


export default defineComponent({
   setup() {
      const infoStore = useInfoStore();
      const isEditable = ref(false);

      const canEdit = (): void => {
         isEditable.value = !isEditable.value;
      }

      function test(event: Event, index: number){
         const target = <HTMLTableCellElement>event.target;
         const key = target.dataset.key;
         (<any>infoStore.finded[index].form)[key!] = target.textContent;
      }

      return { infoStore, table, useBeautifyValue, canEdit, isEditable, test };
   }
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
      }

      & .info_block {
         display: flex;
         flex-direction: column;
         align-items: center;
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
}

.collapsed {
   border-spacing: 3px;
   margin-top: 5px;
   background-color: white;
   border-collapse: collapse;
   border-radius: 10px;
   border-style: hidden;
   box-shadow: 0 0 0 1px #ccc;

   & td,
   th {
      border: solid 1px #ccc;
      padding: 5px;
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

.table {
   width: 100%;

   //display: grid;
   //grid-template-columns: 1fr 1fr;
   & .table_item {
      width: 100%;
      display: flex;

      &>div {
         border: 1px solid #fff;
         flex-basis: 50%;
      }
   }
}
</style>