<template>
  <div class="column items-center q-pa-sm">
    <h4 class="text-center q-my-lg q-pb-sm">{{ t('applicationsSearch.title') }}</h4>
    <div :class="$style.find">
      <QInput
        v-model="search"
        class="full-width"
        debounce="1000"
        standout
        :label="t('applicationsSearch.search.placeholder')"
        :loading="loading"
        :error="!!error"
        :error-message="t('applicationsSearch.search.errors.notFound')"
      >
        <template #append>
          <QIcon name="eva-search" />
        </template>
      </QInput>
    </div>
    <QPagination v-if="total > 1" v-model="page" color="primary" :max="total" :max-pages="5" boundary-links />
    <QMarkupTable v-for="form in forms" :key="form._id" :class="['q-my-md', $style.find]" separator="cell">
      <thead>
        <th colspan="2">
          <div class="row justify-between">
            <div class="text-h6">
              <span>{{ t('applicationsId.table.title') }}</span>
            </div>
            <div>
              <QBtnGroup dense flat>
                <QBtn
                  icon="eva-info-outline"
                  color="teal"
                  dense
                  flat
                  round
                  @click="$router.push(`/applications/${form._id}`)"
                >
                  <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">
                    {{ t('applicationsSearch.hints.info') }}
                  </QTooltip>
                </QBtn>
              </QBtnGroup>
            </div>
          </div>
        </th>
      </thead>
      <tbody>
        <tr v-for="(value, key, index) in Util.formatForm(form)" :key="index">
          <td>{{ t(`home.form.fields.${key}.value`) }}</td>
          <td>{{ Util.formatAssistanceValue(value, key, t, form.district) }}</td>
        </tr>
      </tbody>
    </QMarkupTable>
    <QPagination v-if="total > 1" v-model="page" color="primary" :max="total" :max-pages="5" boundary-links />
  </div>
</template>

<script setup lang="ts">
import type { Responses } from '@/types';
import { AssistanceService } from '@/api/services';
import { ref, watch } from 'vue';
import { useFetch } from '@/hooks';
import { Util } from '@/util';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const LIMIT = 1;
const search = ref('');
const page = ref(1);
const total = ref(0);
const {
  request,
  data: forms,
  loading,
  error,
} = useFetch<Responses.Assistance[], typeof AssistanceService.catch>(AssistanceService.catch, {
  afterResponse: ({ response }) => {
    total.value = Number(response.headers.get('x-total-count')) || 0;
  },
});

watch(loading, (n) => {
  if (!n && search.value && !forms.value?.length) {
    error.value = t('applicationsSearch.search.errors.notFound');
  }
});

watch([search, page], async () => {
  error.value = '';
  if (search.value) {
    request({
      limit: LIMIT,
      page: page.value,
      filter: { nameOrSurname: search.value },
      sort: '_id',
      descending: false,
    });
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
