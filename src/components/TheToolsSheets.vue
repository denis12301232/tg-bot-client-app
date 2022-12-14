<template lang="pug">
div(class="filter_container")
   h3(class="filter_title") Критерии выгрузки
   div(class="filter_content")
      div(class="filter_item", v-for="filter in filters", :key="filter.name")
         header(class="item_title") {{ filter.name }}
         CCheckbox(v-model="filterValue", :value="filter.value")
   div(class="filter", v-show="filterValue.includes('district')")
      h4(class="filter_title") Район
      v-select(v-model="district", label="Район", :items="Constants.districts")
   div(class="filter", v-show="filterValue.includes('birth')")
      h4(class="filter_title") Год рождения
      v-range-slider(min="1920", max="2022", step="1", v-model="yearInterval")
         template(v-slot:prepend)
            v-text-field(
               v-model="yearInterval[0]"
               hide-details
               single-line
               type="number"
               variant="outlined"
               density="compact"
               style="width: 85px"
               )
         template(v-slot:append)
            v-text-field(
               v-model="yearInterval[1]"
               hide-details
               single-line
               type="number"
               variant="outlined"
               style="width: 85px"
               density="compact"
               )
   div(class="buttons")
      v-btn(@click="saveForms", :disabled="isDisabled") Сформировать
      LoadingWheel(v-if="isLoading")
   a(class="sheets_link", target="_blank", :href="link", v-if="link") Ссылка на выгруженные заявки
</template> 
         
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useFetching } from '@/hooks/useFetching'
import AssistanceService from '@/api/services/AssistanceService'
import Constants from '@/libs/Constants'

const filterValue = ref<string[]>([]);
const yearInterval = ref([1920, 2022]);
const link = ref('');
const district = ref('');
const isDisabled = computed(() => {
   if (!filterValue.value.length) return true;
   if (filterValue.value.includes('district') && filterValue.value.includes('birth')) {
      return isLoading.value || !district.value || !yearInterval.value[0] || !yearInterval.value[1];
   }
   return isLoading.value || !district.value && (!yearInterval.value[0] || !yearInterval.value[1]);
})
const filters = [
   { name: 'По району', value: 'district' },
   { name: 'По году', value: 'birth' },
];
const { fetchFunc: saveForms, isLoading, data } =
   useFetching<{ message: string, link: string }>({ callback: saveFormsToSheet, successMessage: 'Сформировано' });

async function saveFormsToSheet() {
   link.value = '';
   const filters = {
      district: district.value,
      birth: { from: yearInterval.value[0], to: yearInterval.value[1] || 9999 }
   };
   return await AssistanceService.saveFormsToSheet(filters);
}

watch(data, () => { link.value = data.value?.link || ''; });
</script>
         
<style scoped lang="scss">
.filter_container {

   &>.filter_content {
      border: 2px solid #738095;
      box-shadow: inset 0 0 2px 0 rgb(207 215 230 / 40%);
      border-radius: 5px;
      padding: 5px;

      &>.filter_item {
         padding: 3px 0;
         display: flex;

         &>.item_title {
            flex-basis: 100px;
         }
      }
   }

   .filter_title {
      padding: 10px 0px;
   }
}

.buttons {
   display: flex;
   padding: 10px 0;
}

.sheets_link {
   display: inline-block;
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
   }
}
</style>