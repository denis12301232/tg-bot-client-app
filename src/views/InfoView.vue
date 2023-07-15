<template>
  <div class="column items-center q-pa-sm">
    <h4 class="text-center q-my-lg q-pb-sm">{{ t('info.title') }}</h4>
    <div :class="$style.find">
      <QInput
        v-model="search"
        class="full-width"
        standout="text-white bg-indigo"
        :label="t('info.placeholder')"
        debounce="1000"
        :loading="loading"
        :error="!!error"
        :error-message="t('info.errors.search')"
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
              <span>{{ t('info.table.title') }}</span>
            </div>
            <div>
              <QBtnGroup dense flat>
                <QBtn icon="eva-info" color="teal" dense flat round @click="$router.push(`/info/${form._id}`)"> </QBtn>
                <QBtn
                  icon="eva-edit"
                  color="orange"
                  dense
                  flat
                  round
                  @click="$router.push(`/info/${form._id}?edit=true`)"
                >
                  <QTooltip class="bg-indigo" :offset="[10, 10]" :delay="1000">{{ t('info.hints.edit') }}</QTooltip>
                </QBtn>
              </QBtnGroup>
            </div>
          </div>
        </th>
      </thead>
      <tbody>
        <tr v-for="(value, key, index) in Util.formatForm(form)" :key="index">
          <td>{{ t(`assistance.fields.${key}`) }}</td>
          <td>{{ Util.formatAssistanceValue(value, key, t, form.district) }}</td>
        </tr>
      </tbody>
    </QMarkupTable>
    <QPagination v-if="total > 1" v-model="page" color="primary" :max="total" :max-pages="5" boundary-links />
  </div>
</template>

<script setup lang="ts">
import type { AssistanceResponse, I18n, Langs } from '@/types';
import { AssistanceService } from '@/api/services';
import { ref, watch } from 'vue';
import { useFetch } from '@/hooks';
import { Util } from '@/util';
import { useI18n } from 'vue-i18n';

const { t } = useI18n<I18n, Langs>();
const LIMIT = 1;
const search = ref('');
const page = ref(1);
const total = ref(0);
const {
  request: findForms,
  data: forms,
  loading,
  error,
} = useFetch<AssistanceResponse[], typeof AssistanceService.findForms>(AssistanceService.findForms, {
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
