<template lang="pug">
form(class="form" @submit.prevent="onSave")
   h5(class="title") Критерии выгрузки
   QOptionGroup(class="criterias" type="checkbox" v-model="criterias" :options="criteriasOptions")
   div(v-if="criterias.includes('district')" class="group")
      h6 Выберите район
      QSelect(v-model="query.district" :options="Constants.districts" outlined label="Район")
   div(v-if="criterias.includes('birth')" class="group")
      h6 Выберите интервал
      QBadge(color="secondary") С {{ query.birth.min }} по {{ query.birth.max }}
      QRange(v-model="query.birth" :min="1920" :max="2022")
   QBtn(class="button" color="primary" type="submit" :loading="loading" :disable="!valid") Сохранить
   a(v-if="data?.link" class="link" target="_blank", :href="data.link") Ссылка на выгруженные заявки
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Constants } from '@/util'
import { useFetch } from '@/hooks'
import { AssistanceService } from '@/api/services'


const criterias = ref<string[]>([]);
const query = reactive({
   district: '',
   birth: { min: 1920, max: 2022 }
});
const valid = computed(() => {
   if (criterias.value.includes('district') && query.district) {
      return true;
   }
   if (criterias.value.includes('birth')) {
      return true;
   }
   return false;
});
const { f: onSave, loading, data } = useFetch<{ message: string, link: string }>({
   fn: () => AssistanceService.saveFormsToSheet({
      district: query.district,
      birth: { from: query.birth.min, to: query.birth.max }
   }),
   successMsg: 'Сформировано',
   errorMsg: 'Ничего не найдено по запросу',
   alert: true
});

const criteriasOptions = [
   { label: 'По району', value: 'district' },
   { label: 'По году', value: 'birth' }
];
</script>

<style scoped lang="scss">
.form {
   padding: 0 20px;

   & .title {
      margin: 20px 0 20px 0;
      text-align: center;
   }

   & .criterias {
      border: 1px solid #ccc;
      border-radius: 5px;
      margin: 0;
   }

   & .group {
      &>h6 {
         margin: 20px 0 10px 0;
      }
   }

   & .button {
      margin-top: 15px;
   }

   & .link {
      display: block;
      color: $positive;
      cursor: pointer;
      font-weight: bold;
      font-size: 1.1em;
      margin-top: 5px;

      &:hover {
         color: $orange;
      }
   }
}

@media (max-width:480px) {
   .form {
      padding: 0;
   }
}
</style>