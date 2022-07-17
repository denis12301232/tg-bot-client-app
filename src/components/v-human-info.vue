<template lang="pug">
.info
   .info_title Введите ФИО для поиска
   input.info_search(type="text", placeholder="ФИО", v-model="fio")
   v-button(@click="findHuman") Найти
   v-loading-wheel(v-if="isLoading")
   .info_error {{ error }}
   .info_finded(v-show="finded.length")
      .info_finded_all Всего найдено: {{ finded.length }}
      .info_block(v-for="item in finded")
         h3 Найдено:
         table.collapsed
            tbody
               tr(v-for="(key, value) in item")
                  td {{ (table as any)[value] }}
                  td {{ key }}
</template>


<script lang="ts">
import { defineComponent, ref } from "vue";
import UserDataService from "@/api/services/UserDataService"
import { table } from "@/libs/constants"

export default defineComponent({
   setup() {
      const fio = ref('');
      const finded = ref<Array<any>>([]);
      const error = ref('');
      const isLoading = ref(false);


      const findHuman = async (): Promise<void> => {
         try {
            if (!fio.value) return;
            isLoading.value = true;
            error.value = '';
            const response = await UserDataService.findHuman(fio.value.trim());
            const list = response.data.humansFormList;
            if (!list.length) error.value = `Ничего не найдено по запросу ${fio.value}`

            list.forEach(item => {
               (<any>item.people_fio) = item.people_fio?.join(',');
               (<any>item.children_age) = item.children_age?.join(',');
               Object.entries(item).forEach(([key, value]) => {
                  if (value === false) (<any>item)[key] = "Нет";
                  else if (value === true) (<any>item)[key] = "Да";
               });
            });
            finded.value = list;
            isLoading.value = false;
         } catch (e: any) {
            error.value = e.message;
         } finally {
            isLoading.value = false
         }
      }

      return { fio, findHuman, finded, table, isLoading, error }
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

table {
   border: 1px solid #ccc;
   border-spacing: 3px;
   margin-top: 5px;
}

td,
th {
   border: solid 1px #ccc;
   padding: 5px;
}

.collapsed {
   border-collapse: collapse;
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