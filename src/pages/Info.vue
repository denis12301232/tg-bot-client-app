<template>
  <div class="container">
    <h4 class="text-center q-mb-lg">Информация по человеку</h4>
    <div class="column items-center q-pt-md">
      <QInput
        v-model="search"
        class="full-width"
        outlined
        label="Имя или фамилия"
        :error="!!error"
        :error-message="error"
        @keyup.enter="onFetchForms"
      >
        <template #append>
          <QBtn icon="search" round dense flat :loading="loading" :disable="!search" @click="onFetchForms" />
        </template>
      </QInput>
    </div>
    <div class="row justify-center">
      <QPagination
        v-if="forms"
        v-model="page"
        color="grey"
        direction-links
        boundary-links
        :max-pages="5"
        :max="total"
        active-color="indigo"
      />
    </div>
    <QMarkupTable v-for="form in forms" class="q-my-md" separator="cell">
      <thead>
        <th colspan="2">
          <div class="row justify-between">
            <div class="text-h6">
              <span>Найдено</span>
            </div>
            <div>
              <QBtn icon="edit" dense flat round @click="onEdit(form._id)" />
            </div>
          </div>
        </th>
      </thead>
      <tbody>
        <tr v-for="(key, value) in formWithoutId(form)">
          <td>{{ Constants.assistance[value] }}</td>
          <td>{{ useBeautifyAssistance(key) }}</td>
        </tr>
      </tbody>
    </QMarkupTable>
    <div class="row justify-center">
      <QPagination
        v-if="forms"
        v-model="page"
        color="grey"
        direction-links
        boundary-links
        :max-pages="5"
        :max="total"
        active-color="indigo"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AssistanceForm } from '@/types';
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFetch, useBeautifyAssistance } from '@/hooks';
import { AssistanceService } from '@/api/services';
import { Constants } from '@/util';

const limit = 1;
const router = useRouter();
const route = useRoute();
const total = ref(0);
const page = ref(1);
const search = ref(route.query.search?.toString() || '');
const { f: onFetchForms, error, loading, data: forms } = useFetch<AssistanceForm[]>({
  fn: fetchForms,
  errorMsg: 'Ничего не найдено',
});

onMounted(() => {
  if (search.value) {
    onFetchForms();
  }
});

watch([search, page], ([newSearch, newPage], [oldSearch, oldPage]) => {
  error.value = '';
  if (newSearch !== oldSearch) {
    router.push({ query: { search: search.value } });
  }
  if (newPage !== oldPage) {
    onFetchForms();
  }
  if (!newSearch) {
    router.push({ query: undefined });
  }
});

function formWithoutId(form: AssistanceForm) {
  const { _id, ...rest } = form;
  return rest;
}

function onEdit(id: string) {
  router.push({ path: `/list/${id}`, query: { edit: 'true' } });
}

async function fetchForms() {
  if (!search.value) {
    return;
  }

  const response = await AssistanceService.getForms(search.value, limit, page.value);
  total.value = Math.ceil(Number(response.headers['x-total-count']) / limit);
  window.scrollTo(0, 0);
  return response;
}
</script>

<style lang="scss" scoped>
.container {
  width: 50%;
  padding: 20px 0 20px 0;
  margin: 0 auto;
}

@media (max-width: 1024px) {
  .container {
    width: 60%;
  }
}

@media (max-width: 768px) {
  .container {
    width: 70%;
  }
}

@media (max-width: 560px) {
  .container {
    width: 95%;
  }
}
</style>
