<template>
  <form class="form" @submit.prevent="onSave">
    <h5 class="q-my-lg text-center">Критерии выгрузки</h5>
    <QOptionGroup class="criterias" type="checkbox" v-model="criterias" :options="criteriasOptions" />
    <div v-if="criterias.includes('district')">
      <h6 class="q-mt-md q-mb-sm">Выберите район</h6>
      <QSelect v-model="query.district" :options="Constants.districts" outlined label="Район" />
    </div>
    <div v-if="criterias.includes('birth')">
      <h6 class="q-mt-md q-mb-sm">Выберите интервал</h6>
      <QBadge color="secondary">С {{ query.birth.min }} по {{ query.birth.max }}</QBadge>
      <QRange v-model="query.birth" :min="1920" :max="2022"></QRange>
    </div>
    <QBtn class="q-mt-md" color="primary" type="submit" :loading="loading" :disable="!valid" label="Сохранить" />
    <a class="link" v-if="data?.link" target="_blank" :href="data.link">Ссылка на выгруженные заявки</a>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watchEffect } from 'vue';
import { Constants } from '@/util';
import { useFetch } from '@/hooks';
import { AssistanceService } from '@/api/services';

const criterias = ref<string[]>([]);
const query = reactive({
  district: '',
  birth: { min: 1920, max: 2022 },
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
const { f: onSave, loading, data } = useFetch<{ message: string; link: string }>({
  fn: saveFormsToSheet,
  successMsg: 'Сформировано',
  errorMsg: 'Ничего не найдено по запросу',
  alert: true,
});
const criteriasOptions = [
  { label: 'По району', value: 'district' },
  { label: 'По году', value: 'birth' },
];

function saveFormsToSheet() {
  return AssistanceService.saveFormsToSheet({
    district: query.district,
    birth: { from: query.birth.min, to: query.birth.max },
  });
}

watchEffect(() => {
  if (!criterias.value.includes('district')) {
    query.district = '';
  }
  if (!criterias.value.includes('birth')) {
    query.birth.min = 1920;
    query.birth.max = 2022;
  }
});
</script>

<style scoped lang="scss">
.form {
  padding: 0 20px;

  & .criterias {
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 0;
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

@media (max-width: 480px) {
  .form {
    padding: 0;
  }
}
</style>
