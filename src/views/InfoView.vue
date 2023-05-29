<template>
  <div class="column items-center q-pa-sm">
    <h4 class="text-center q-my-lg q-pb-sm">Поиск</h4>
    <div :class="$style.find">
      <QInput
        v-model="search"
        class="full-width"
        standout="text-white bg-indigo"
        label="Имя или фамилия"
        debounce="1000"
        :loading="loading"
        :error="!!error"
        :error-message="typeof error === 'object' ? error.message : error"
      >
        <template #append>
          <QIcon name="eva-search" />
        </template>
      </QInput>
    </div>
    <QPagination v-if="total > 1" v-model="page" color="red-10" :max="total" :max-pages="5" boundary-links />
    <QMarkupTable v-for="form in forms" :key="form._id" :class="['q-my-md', $style.find]" separator="cell">
      <thead>
        <th colspan="2">
          <div class="row justify-between">
            <div class="text-h6">
              <span>Найдено</span>
            </div>
            <div>
              <QBtn icon="eva-edit" dense flat round @click="$router.push(`/info/${form._id}?edit=true`)">
                <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">Редактировать</QTooltip>
              </QBtn>
            </div>
          </div>
        </th>
      </thead>
      <tbody>
        <tr v-for="(key, value, index) in Util.formatForm(form)" :key="index">
          <td>{{ Constants.assistance[value] }}</td>
          <td>{{ Util.formatAssistanceKey(key) }}</td>
        </tr>
      </tbody>
    </QMarkupTable>
    <QPagination v-if="total > 1" v-model="page" color="red-10" :max="total" :max-pages="5" boundary-links />
  </div>
</template>

<script setup lang="ts">
import type { AssistanceResponse } from '@/types';
import { AssistanceService } from '@/api/services';
import { ref, watch } from 'vue';
import { useFetch } from '@/hooks';
import { Util, Constants } from '@/util';

type T = AssistanceResponse[];
type S = typeof AssistanceService.findForms;

const LIMIT = 1;
const search = ref('');
const page = ref(1);
const total = ref(0);
const { request: findForms, data: forms, loading, error } = useFetch<T, S>(AssistanceService.findForms, {
  afterResponse: ({ response }) => {
    total.value = Number(response.headers.get('x-total-count')) || 0;
  },
});

watch([search, page], async () => {
  error.value = '';
  if (search.value) {
    findForms(search.value, LIMIT, page.value);
  }
});

watch(error, () => {
  if (error.value) {
    forms.value = [];
  }
});
</script>

<style module lang="scss">
.find {
  max-width: 600px;
  width: 100%;
}
</style>
