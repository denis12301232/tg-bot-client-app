<template>
  <div class="column items-center q-pa-sm">
    <form
      :class="$style.form"
      @submit.prevent="request({ birth: { from: query.birth.min, to: query.birth.max }, district: query.district })"
    >
      <h5 class="q-pa-lg text-center">Критерии выгрузки</h5>
      <QOptionGroup v-model="criterias" class="criterias" type="checkbox" :options="options" />
      <QSeparator />
      <div v-if="criterias.includes('district')">
        <h6 class="q-mt-md q-mb-sm text-center">Выберите район</h6>
        <QSelect v-model="query.district" class="full-width" :options="Constants.districts" standout label="Район" />
      </div>
      <div v-if="criterias.includes('birth')">
        <h6 class="q-mt-md q-mb-sm text-center">Выберите интервал</h6>
        <QBadge color="indigo">С {{ query.birth.min }} по {{ query.birth.max }}</QBadge>
        <QRange v-model="query.birth" :min="1920" :max="2022" color="secondary"></QRange>
      </div>
      <div v-if="valid" class="column items-center">
        <QBtn class="q-mt-md" color="red-10" type="submit" :loading="loading" :disable="!valid" label="Сохранить" />
        <a v-if="data?.link" :class="[$style.link, 'q-mt-sm']" target="_blank" :href="data.link"
          >Ссылка на выгруженные заявки</a
        >
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watchEffect } from 'vue';
import { useStore } from '@/stores';
import { Constants } from '@/util';
import { useFetch } from '@/hooks';
import { AssistanceService } from '@/api/services';

type Criterias = 'district' | 'birth';
type T = { message: string; link: string };
type S = typeof AssistanceService.saveFormsToSheet;

const store = useStore();
const criterias = ref<Criterias[]>([]);
const query = reactive({ district: '', birth: { min: 1920, max: 2022 } });
const valid = computed(() => !!criterias.value.length);
const { request, loading, data } = useFetch<T, S>(AssistanceService.saveFormsToSheet, {
  afterResponse: ({ response }) => {
    response.status === 200
      ? store.setAlert(true, { message: 'Сформировано' })
      : store.setAlert(true, { message: 'Ничего не найдено по запросу!', type: 'error' });
  },
});
const options = [
  { label: 'По району', value: 'district' },
  { label: 'По году', value: 'birth' },
];

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

<style lang="scss" module>
.form {
  max-width: 500px;
  width: 100%;
}
.link {
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
</style>
